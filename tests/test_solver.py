import pytest
from datetime import date, time
from app.models.domain import CollegeData, Exam, Student, TimeSlot, Room, Faculty
from app.core.graph import build_conflict_graph
from app.core.solver import solve_timetable
from app.data.sample_data import get_sample_data

def _get_generic_faculty(slots):
    return [
        Faculty(id="F1", name="F1", available_slots=slots),
        Faculty(id="F2", name="F2", available_slots=slots),
        Faculty(id="F3", name="F3", available_slots=slots)
    ]

def test_feasible_schedule():
    """Two conflicting exams, two available time slots, sufficient rooms and faculty."""
    slots = ["TS1", "TS2"]
    data = CollegeData(
        time_slots=[
            TimeSlot(id="TS1", date=date(2026, 1, 1), start_time=time(9, 0), end_time=time(11, 0), duration_minutes=120),
            TimeSlot(id="TS2", date=date(2026, 1, 1), start_time=time(13, 0), end_time=time(15, 0), duration_minutes=120)
        ],
        rooms=[Room(id="R1", capacity=10, available_slots=slots)],
        faculty=_get_generic_faculty(slots),
        exams=[
            Exam(id="E1", course_name="C1", duration_minutes=60, enrolled_students=["S1"]),
            Exam(id="E2", course_name="C2", duration_minutes=60, enrolled_students=["S1"])
        ],
        students=[Student(id="S1", batch="B1", enrolled_exams=["E1", "E2"])]
    )
    graph = build_conflict_graph(data)
    result = solve_timetable(data, graph)
    
    assert result.status in ["OPTIMAL", "FEASIBLE"]
    assert len(result.assignments) == 2
    assert len(result.assignments["E1"].faculty_ids) == 1

def test_infeasible_schedule():
    """Three mutually conflicting exams (triangle) but only two time slots available."""
    slots = ["TS1", "TS2"]
    data = CollegeData(
        time_slots=[
            TimeSlot(id="TS1", date=date(2026, 1, 1), start_time=time(9, 0), end_time=time(11, 0), duration_minutes=120),
            TimeSlot(id="TS2", date=date(2026, 1, 1), start_time=time(13, 0), end_time=time(15, 0), duration_minutes=120)
        ],
        rooms=[Room(id="R1", capacity=10, available_slots=slots)],
        faculty=_get_generic_faculty(slots),
        exams=[
            Exam(id="E1", course_name="C1", duration_minutes=60, enrolled_students=["S1"]),
            Exam(id="E2", course_name="C2", duration_minutes=60, enrolled_students=["S1"]),
            Exam(id="E3", course_name="C3", duration_minutes=60, enrolled_students=["S1"])
        ],
        students=[Student(id="S1", batch="B1", enrolled_exams=["E1", "E2", "E3"])]
    )
    graph = build_conflict_graph(data)
    result = solve_timetable(data, graph)
    
    assert result.status == "INFEASIBLE"

def test_sample_data_verification():
    """Verify existing sample dataset returns a valid and exactly-assigned timetable."""
    data = get_sample_data()
    graph = build_conflict_graph(data)
    result = solve_timetable(data, graph)
    
    assert result.status in ["OPTIMAL", "FEASIBLE"]
    assert len(result.assignments) == len(data.exams)
    for exam in data.exams:
        assert exam.id in result.assignments
        assert result.assignments[exam.id].time_slot_id is not None
        assert result.assignments[exam.id].room_id is not None
        assert len(result.assignments[exam.id].faculty_ids) == 1
        
    for exam_a, exam_b in graph.edges():
        slot_a = result.assignments[exam_a].time_slot_id
        slot_b = result.assignments[exam_b].time_slot_id
        assert slot_a != slot_b

def test_room_capacity_failure():
    slots = ["TS1"]
    data = CollegeData(
        time_slots=[TimeSlot(id="TS1", date=date(2026, 1, 1), start_time=time(9, 0), end_time=time(11, 0), duration_minutes=120)],
        rooms=[Room(id="R1", capacity=2, available_slots=slots)],
        faculty=_get_generic_faculty(slots),
        exams=[Exam(id="E1", course_name="C1", duration_minutes=60, enrolled_students=["S1", "S2", "S3", "S4"])],
        students=[]
    )
    result = solve_timetable(data, build_conflict_graph(data))
    assert result.status == "INFEASIBLE"

def test_room_overlap_failure():
    slots = ["TS1"]
    data = CollegeData(
        time_slots=[TimeSlot(id="TS1", date=date(2026, 1, 1), start_time=time(9, 0), end_time=time(11, 0), duration_minutes=120)],
        rooms=[Room(id="R1", capacity=10, available_slots=slots)],
        faculty=_get_generic_faculty(slots),
        exams=[
            Exam(id="E1", course_name="C1", duration_minutes=60, enrolled_students=["S1"]),
            Exam(id="E2", course_name="C2", duration_minutes=60, enrolled_students=["S2"])
        ],
        students=[] 
    )
    result = solve_timetable(data, build_conflict_graph(data))
    assert result.status == "INFEASIBLE"

def test_room_availability():
    slots = ["TS1"]
    data = CollegeData(
        time_slots=[TimeSlot(id="TS1", date=date(2026, 1, 1), start_time=time(9, 0), end_time=time(11, 0), duration_minutes=120)],
        rooms=[Room(id="R1", capacity=10, available_slots=[])], 
        faculty=_get_generic_faculty(slots),
        exams=[Exam(id="E1", course_name="C1", duration_minutes=60, enrolled_students=["S1"])],
        students=[]
    )
    result = solve_timetable(data, build_conflict_graph(data))
    assert result.status == "INFEASIBLE"

def test_student_conflict_with_multiple_rooms():
    slots = ["TS1"]
    data = CollegeData(
        time_slots=[TimeSlot(id="TS1", date=date(2026, 1, 1), start_time=time(9, 0), end_time=time(11, 0), duration_minutes=120)],
        rooms=[
            Room(id="R1", capacity=10, available_slots=slots),
            Room(id="R2", capacity=10, available_slots=slots)
        ],
        faculty=_get_generic_faculty(slots),
        exams=[
            Exam(id="E1", course_name="C1", duration_minutes=60, enrolled_students=["S1"]),
            Exam(id="E2", course_name="C2", duration_minutes=60, enrolled_students=["S1"])
        ],
        students=[Student(id="S1", batch="B1", enrolled_exams=["E1", "E2"])]
    )
    result = solve_timetable(data, build_conflict_graph(data))
    assert result.status == "INFEASIBLE"

def test_room_alternative_availability():
    slots = ["TS1"]
    data = CollegeData(
        time_slots=[TimeSlot(id="TS1", date=date(2026, 1, 1), start_time=time(9, 0), end_time=time(11, 0), duration_minutes=120)],
        rooms=[
            Room(id="R1", capacity=10, available_slots=[]),
            Room(id="R2", capacity=10, available_slots=slots)
        ],
        faculty=_get_generic_faculty(slots),
        exams=[Exam(id="E1", course_name="C1", duration_minutes=60, enrolled_students=["S1"])],
        students=[]
    )
    result = solve_timetable(data, build_conflict_graph(data))
    assert result.status in ["OPTIMAL", "FEASIBLE"]
    assert result.assignments["E1"].room_id == "R2"

# --- Phase 5 Tests ---

def test_faculty_unavailability():
    """Exam forced into TS1, but only available faculty is busy."""
    slots = ["TS1"]
    data = CollegeData(
        time_slots=[TimeSlot(id="TS1", date=date(2026, 1, 1), start_time=time(9, 0), end_time=time(11, 0), duration_minutes=120)],
        rooms=[Room(id="R1", capacity=10, available_slots=slots)],
        faculty=[Faculty(id="F1", name="F1", available_slots=[])], # Unavailable
        exams=[Exam(id="E1", course_name="C1", duration_minutes=60, enrolled_students=["S1"])],
        students=[]
    )
    result = solve_timetable(data, build_conflict_graph(data))
    assert result.status == "INFEASIBLE"

def test_faculty_double_booking():
    """2 independent exams in 1 time slot (2 rooms), but only 1 faculty member exists."""
    slots = ["TS1"]
    data = CollegeData(
        time_slots=[TimeSlot(id="TS1", date=date(2026, 1, 1), start_time=time(9, 0), end_time=time(11, 0), duration_minutes=120)],
        rooms=[
            Room(id="R1", capacity=10, available_slots=slots),
            Room(id="R2", capacity=10, available_slots=slots)
        ],
        faculty=[Faculty(id="F1", name="F1", available_slots=slots)],
        exams=[
            Exam(id="E1", course_name="C1", duration_minutes=60, enrolled_students=["S1"]),
            Exam(id="E2", course_name="C2", duration_minutes=60, enrolled_students=["S2"])
        ],
        students=[] # independent
    )
    result = solve_timetable(data, build_conflict_graph(data))
    assert result.status == "INFEASIBLE"

def test_insufficient_faculty_for_multiple_invigilators():
    """1 exam requires 3 invigilators, but only 2 are available."""
    slots = ["TS1"]
    data = CollegeData(
        time_slots=[TimeSlot(id="TS1", date=date(2026, 1, 1), start_time=time(9, 0), end_time=time(11, 0), duration_minutes=120)],
        rooms=[Room(id="R1", capacity=10, available_slots=slots)],
        faculty=[
            Faculty(id="F1", name="F1", available_slots=slots),
            Faculty(id="F2", name="F2", available_slots=slots)
        ],
        exams=[Exam(id="E1", course_name="C1", duration_minutes=60, enrolled_students=["S1"], required_invigilators=3)],
        students=[]
    )
    result = solve_timetable(data, build_conflict_graph(data))
    assert result.status == "INFEASIBLE"

def test_successful_multiple_invigilator_assignment():
    """1 exam requires 2 invigilators, exactly 2 distinct faculty IDs must be returned."""
    slots = ["TS1"]
    data = CollegeData(
        time_slots=[TimeSlot(id="TS1", date=date(2026, 1, 1), start_time=time(9, 0), end_time=time(11, 0), duration_minutes=120)],
        rooms=[Room(id="R1", capacity=10, available_slots=slots)],
        faculty=[
            Faculty(id="F1", name="F1", available_slots=slots),
            Faculty(id="F2", name="F2", available_slots=slots),
            Faculty(id="F3", name="F3", available_slots=slots)
        ],
        exams=[Exam(id="E1", course_name="C1", duration_minutes=60, enrolled_students=["S1"], required_invigilators=2)],
        students=[]
    )
    result = solve_timetable(data, build_conflict_graph(data))
    assert result.status in ["OPTIMAL", "FEASIBLE"]
    
    facs = result.assignments["E1"].faculty_ids
    assert len(facs) == 2
    assert len(set(facs)) == 2 # must be distinct

def test_faculty_assignment_follows_time_slot():
    """Ensure faculty assignment respects the assigned time slot."""
    data = CollegeData(
        time_slots=[
            TimeSlot(id="TS1", date=date(2026, 1, 1), start_time=time(9, 0), end_time=time(11, 0), duration_minutes=120),
            TimeSlot(id="TS2", date=date(2026, 1, 1), start_time=time(13, 0), end_time=time(15, 0), duration_minutes=120)
        ],
        rooms=[Room(id="R1", capacity=10, available_slots=["TS1", "TS2"])],
        faculty=[
            Faculty(id="F1", name="F1", available_slots=["TS1"]), # Only TS1
            Faculty(id="F2", name="F2", available_slots=["TS2"])  # Only TS2
        ],
        exams=[
            Exam(id="E1", course_name="C1", duration_minutes=60, enrolled_students=["S1"]),
            Exam(id="E2", course_name="C2", duration_minutes=60, enrolled_students=["S1"])
        ],
        students=[Student(id="S1", batch="B1", enrolled_exams=["E1", "E2"])]
    )
    result = solve_timetable(data, build_conflict_graph(data))
    assert result.status in ["OPTIMAL", "FEASIBLE"]
    
    # E1 and E2 must be in different slots due to student conflict
    slot_e1 = result.assignments["E1"].time_slot_id
    slot_e2 = result.assignments["E2"].time_slot_id
    
    assert slot_e1 != slot_e2
    
    # Faculty must match the time slot they are assigned to
    if slot_e1 == "TS1":
        assert result.assignments["E1"].faculty_ids == ["F1"]
        assert result.assignments["E2"].faculty_ids == ["F2"]
    else:
        assert result.assignments["E1"].faculty_ids == ["F2"]
        assert result.assignments["E2"].faculty_ids == ["F1"]

# --- Phase 6 Tests ---

def test_zero_b2b_when_avoidable():
    """Ensure solver produces exactly 0 B2B violations when a zero-B2B arrangement is feasible."""
    slots = ["TS1", "TS2", "TS3"]
    data = CollegeData(
        time_slots=[
            TimeSlot(id="TS1", date=date(2026, 1, 1), start_time=time(9, 0), end_time=time(11, 0), duration_minutes=120),
            TimeSlot(id="TS2", date=date(2026, 1, 1), start_time=time(12, 0), end_time=time(14, 0), duration_minutes=120),
            TimeSlot(id="TS3", date=date(2026, 1, 1), start_time=time(15, 0), end_time=time(17, 0), duration_minutes=120)
        ],
        rooms=[Room(id="R1", capacity=10, available_slots=slots)],
        faculty=_get_generic_faculty(slots),
        exams=[
            Exam(id="E1", course_name="C1", duration_minutes=60, enrolled_students=["S1"]),
            Exam(id="E2", course_name="C2", duration_minutes=60, enrolled_students=["S1"])
        ],
        students=[Student(id="S1", batch="B1", enrolled_exams=["E1", "E2"])]
    )
    graph = build_conflict_graph(data)
    result = solve_timetable(data, graph)
    assert result.status in ["OPTIMAL", "FEASIBLE"]
    
    # Check that they are not assigned to adjacent slots (TS1 and TS2, or TS2 and TS3)
    t1 = result.assignments["E1"].time_slot_id
    t2 = result.assignments["E2"].time_slot_id
    assert {t1, t2} == {"TS1", "TS3"}

def test_prefer_smaller_room():
    """Ensure solver selects the smaller suitable room when room waste is the only active trade-off."""
    slots = ["TS1"]
    data = CollegeData(
        time_slots=[TimeSlot(id="TS1", date=date(2026, 1, 1), start_time=time(9, 0), end_time=time(11, 0), duration_minutes=120)],
        rooms=[
            Room(id="R_SMALL", capacity=10, available_slots=slots),
            Room(id="R_MASSIVE", capacity=1000, available_slots=slots)
        ],
        faculty=_get_generic_faculty(slots),
        exams=[Exam(id="E1", course_name="C1", duration_minutes=60, enrolled_students=["S1"])], # required cap = 1
        students=[]
    )
    graph = build_conflict_graph(data)
    result = solve_timetable(data, graph)
    assert result.status in ["OPTIMAL", "FEASIBLE"]
    assert result.assignments["E1"].room_id == "R_SMALL"

def test_optimal_vs_feasible_status():
    """Verify status correctly reports OPTIMAL or FEASIBLE."""
    # A tiny problem should be proven OPTIMAL immediately.
    slots = ["TS1"]
    data = CollegeData(
        time_slots=[TimeSlot(id="TS1", date=date(2026, 1, 1), start_time=time(9, 0), end_time=time(11, 0), duration_minutes=120)],
        rooms=[Room(id="R1", capacity=10, available_slots=slots)],
        faculty=_get_generic_faculty(slots),
        exams=[Exam(id="E1", course_name="C1", duration_minutes=60, enrolled_students=["S1"])],
        students=[]
    )
    graph = build_conflict_graph(data)
    result = solve_timetable(data, graph)
    assert result.status == "OPTIMAL"
