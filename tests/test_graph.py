import pytest
from app.models.domain import CollegeData, Exam, Student
from app.core.graph import build_conflict_graph

def test_empty_data():
    """Graph should handle 0 exams and 0 students."""
    data = CollegeData(time_slots=[], rooms=[], faculty=[], exams=[], students=[])
    graph = build_conflict_graph(data)
    assert graph.number_of_nodes() == 0
    assert graph.number_of_edges() == 0

def test_isolated_exams():
    """Exams with no shared students should result in isolated nodes."""
    data = CollegeData(
        time_slots=[], rooms=[], faculty=[],
        exams=[
            Exam(id="E1", course_name="C1", duration_minutes=60),
            Exam(id="E2", course_name="C2", duration_minutes=60)
        ],
        students=[
            Student(id="S1", batch="B1", enrolled_exams=["E1"]),
            Student(id="S2", batch="B1", enrolled_exams=["E2"])
        ]
    )
    graph = build_conflict_graph(data)
    assert graph.number_of_nodes() == 2
    assert graph.number_of_edges() == 0
    assert "E1" in graph.nodes
    assert "E2" in graph.nodes

def test_basic_conflict():
    """One student taking two exams creates one edge with weight 1."""
    data = CollegeData(
        time_slots=[], rooms=[], faculty=[],
        exams=[
            Exam(id="E1", course_name="C1", duration_minutes=60),
            Exam(id="E2", course_name="C2", duration_minutes=60)
        ],
        students=[
            Student(id="S1", batch="B1", enrolled_exams=["E1", "E2"])
        ]
    )
    graph = build_conflict_graph(data)
    assert graph.number_of_nodes() == 2
    assert graph.number_of_edges() == 1
    assert graph.has_edge("E1", "E2")
    assert graph["E1"]["E2"]["weight"] == 1
    assert graph["E1"]["E2"]["students"] == ["S1"]

def test_weight_accumulation():
    """Multiple students creating the same edge should accumulate weight."""
    data = CollegeData(
        time_slots=[], rooms=[], faculty=[],
        exams=[
            Exam(id="E1", course_name="C1", duration_minutes=60),
            Exam(id="E2", course_name="C2", duration_minutes=60)
        ],
        students=[
            Student(id="S1", batch="B1", enrolled_exams=["E1", "E2"]),
            Student(id="S2", batch="B1", enrolled_exams=["E1", "E2"]),
            Student(id="S3", batch="B1", enrolled_exams=["E1", "E2"])
        ]
    )
    graph = build_conflict_graph(data)
    assert graph.number_of_nodes() == 2
    assert graph.number_of_edges() == 1
    assert graph["E1"]["E2"]["weight"] == 3
    assert set(graph["E1"]["E2"]["students"]) == {"S1", "S2", "S3"}
