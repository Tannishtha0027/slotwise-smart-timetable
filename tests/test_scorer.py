import pytest
from datetime import date, time
from app.models.domain import CollegeData, Exam, Student, TimeSlot, Room, Faculty, TimetableResult, ExamAssignment
from app.core.scorer import score_timetable
import networkx as nx

def test_b2b_is_not_double_counted_as_sameday():
    data = CollegeData(
        time_slots=[
            TimeSlot(id="TS1", date=date(2026, 1, 1), start_time=time(9, 0), end_time=time(11, 0), duration_minutes=120),
            TimeSlot(id="TS2", date=date(2026, 1, 1), start_time=time(12, 0), end_time=time(14, 0), duration_minutes=120)
        ],
        rooms=[Room(id="R1", capacity=10, available_slots=["TS1", "TS2"])],
        faculty=[],
        exams=[
            Exam(id="E1", course_name="C1", duration_minutes=60, enrolled_students=["S1"]),
            Exam(id="E2", course_name="C2", duration_minutes=60, enrolled_students=["S1"])
        ],
        students=[Student(id="S1", batch="B1", enrolled_exams=["E1", "E2"])]
    )
    graph = nx.Graph()
    graph.add_edge("E1", "E2", weight=1)
    
    result = TimetableResult(status="FEASIBLE", assignments={
        "E1": ExamAssignment(time_slot_id="TS1", room_id="R1"),
        "E2": ExamAssignment(time_slot_id="TS2", room_id="R1")
    })
    
    scored = score_timetable(data, graph, result)
    assert scored.metrics["b2b_violations"] == 1
    assert scored.metrics["sameday_violations"] == 0

def test_room_efficiency_calculation():
    data = CollegeData(
        time_slots=[],
        rooms=[
            Room(id="R1", capacity=10, available_slots=[]),
            Room(id="R2", capacity=50, available_slots=[])
        ],
        faculty=[],
        exams=[
            Exam(id="E1", course_name="C1", duration_minutes=60, enrolled_students=["S1", "S2"]), # req 2
            Exam(id="E2", course_name="C2", duration_minutes=60, enrolled_students=["S1", "S2"])  # req 2
        ],
        students=[]
    )
    graph = nx.Graph()
    result = TimetableResult(status="FEASIBLE", assignments={
        "E1": ExamAssignment(time_slot_id="TS1", room_id="R1"), # 2/10
        "E2": ExamAssignment(time_slot_id="TS2", room_id="R2")  # 2/50
    })
    
    scored = score_timetable(data, graph, result)
    # Total req = 4
    # Total assigned = 60
    # Expected efficiency = 100 * 4 / 60 = 6.666...
    assert abs(scored.room_efficiency_score - 6.67) < 0.1
    assert scored.metrics["room_waste"] == 56

def test_quality_score_normalization():
    data = CollegeData(time_slots=[], rooms=[], faculty=[], exams=[], students=[])
    graph = nx.Graph()
    result = TimetableResult(status="FEASIBLE", assignments={})
    scored = score_timetable(data, graph, result)
    
    # 0 conflicts = 100 comfort
    # 0 rooms = 0 efficiency
    # 0.7*100 + 0.3*0 = 70
    assert scored.student_comfort_score == 100.0
    assert scored.room_efficiency_score == 0.0
    assert scored.quality_score == 70.0
