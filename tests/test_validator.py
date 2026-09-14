import pytest
from datetime import date, time
from app.models.domain import CollegeData, Exam, Student, TimeSlot, Room, Faculty, TimetableResult, ExamAssignment, ViolationType
from app.core.graph import build_conflict_graph
from app.core.validator import validate_timetable
from app.data.sample_data import get_sample_data
from app.core.solver import solve_timetable
import copy

@pytest.fixture
def base_data():
    return get_sample_data()

@pytest.fixture
def base_graph(base_data):
    return build_conflict_graph(base_data)

@pytest.fixture
def base_result(base_data, base_graph):
    # This solves the sample data, getting a strictly valid result
    return solve_timetable(base_data, base_graph)

def test_validator_perfect_schedule(base_data, base_graph, base_result):
    """Ensure a natively generated valid schedule passes validation."""
    validated = validate_timetable(base_data, base_graph, base_result)
    assert validated.validation.is_valid is True
    assert len(validated.validation.violations) == 0

def test_validator_catches_room_capacity(base_data, base_graph, base_result):
    # Mutate to force an exam into a room that is too small
    # CS101 requires 4 students. We have R101 (cap 2).
    mutated = copy.deepcopy(base_result)
    mutated.assignments["CS101"].room_id = "R101"
    
    validated = validate_timetable(base_data, base_graph, mutated)
    assert validated.validation.is_valid is False
    assert any(v.type == ViolationType.ROOM_CAPACITY and "CS101" in v.affected_exams for v in validated.validation.violations)

def test_validator_catches_room_collision(base_data, base_graph, base_result):
    # Put two exams in the exact same room and time slot
    mutated = copy.deepcopy(base_result)
    mutated.assignments["CS101"].time_slot_id = "TS1"
    mutated.assignments["CS101"].room_id = "R102"
    mutated.assignments["CS102"].time_slot_id = "TS1"
    mutated.assignments["CS102"].room_id = "R102"
    
    validated = validate_timetable(base_data, base_graph, mutated)
    assert any(v.type == ViolationType.ROOM_COLLISION for v in validated.validation.violations)

def test_validator_catches_student_conflict(base_data, base_graph, base_result):
    # CS101 and CS102 conflict. Put them in the same time slot (different rooms).
    mutated = copy.deepcopy(base_result)
    mutated.assignments["CS101"].time_slot_id = "TS1"
    mutated.assignments["CS101"].room_id = "R101" # Valid for capacity? No, but let's ignore that for a sec
    mutated.assignments["CS102"].time_slot_id = "TS1"
    mutated.assignments["CS102"].room_id = "R102"
    
    validated = validate_timetable(base_data, base_graph, mutated)
    assert any(v.type == ViolationType.STUDENT_CONFLICT for v in validated.validation.violations)

def test_validator_catches_faculty_unavailability(base_data, base_graph, base_result):
    mutated = copy.deepcopy(base_result)
    # F2 is not available for TS2. Force F2 into TS2.
    mutated.assignments["CS101"].time_slot_id = "TS2"
    mutated.assignments["CS101"].faculty_ids = ["F2"]
    
    validated = validate_timetable(base_data, base_graph, mutated)
    assert any(v.type == ViolationType.FACULTY_UNAVAILABLE and "F2" == v.affected_faculty for v in validated.validation.violations)

def test_validator_catches_faculty_double_booking(base_data, base_graph, base_result):
    mutated = copy.deepcopy(base_result)
    # F1 in both CS101 and CS102 at the same time
    mutated.assignments["CS101"].time_slot_id = "TS1"
    mutated.assignments["CS101"].faculty_ids = ["F1"]
    mutated.assignments["CS102"].time_slot_id = "TS1"
    mutated.assignments["CS102"].faculty_ids = ["F1"]
    
    validated = validate_timetable(base_data, base_graph, mutated)
    assert any(v.type == ViolationType.FACULTY_DOUBLE_BOOKED and "F1" == v.affected_faculty for v in validated.validation.violations)

def test_validator_catches_missing_assignment(base_data, base_graph, base_result):
    mutated = copy.deepcopy(base_result)
    del mutated.assignments["CS101"]
    
    validated = validate_timetable(base_data, base_graph, mutated)
    assert any(v.type == ViolationType.MISSING_ASSIGNMENT and "CS101" in v.affected_exams for v in validated.validation.violations)

def test_validator_catches_missing_invigilator(base_data, base_graph, base_result):
    mutated = copy.deepcopy(base_result)
    # Give CS101 zero invigilators instead of 1
    mutated.assignments["CS101"].faculty_ids = []
    
    validated = validate_timetable(base_data, base_graph, mutated)
    assert any(v.type == ViolationType.INVIGILATOR_COUNT for v in validated.validation.violations)

def test_validator_catches_extra_exam(base_data, base_graph, base_result):
    mutated = copy.deepcopy(base_result)
    mutated.assignments["GHOST_EXAM"] = ExamAssignment(time_slot_id="TS1", room_id="R101", faculty_ids=["F1"])
    
    validated = validate_timetable(base_data, base_graph, mutated)
    assert any(v.type == ViolationType.EXTRA_ASSIGNMENT and "GHOST_EXAM" in v.affected_exams for v in validated.validation.violations)

def test_validator_catches_invalid_room(base_data, base_graph, base_result):
    mutated = copy.deepcopy(base_result)
    mutated.assignments["CS101"].room_id = "GHOST_ROOM"
    
    validated = validate_timetable(base_data, base_graph, mutated)
    assert any(v.type == ViolationType.INVALID_ROOM and "GHOST_ROOM" == v.affected_room for v in validated.validation.violations)

def test_validator_catches_invalid_faculty(base_data, base_graph, base_result):
    mutated = copy.deepcopy(base_result)
    mutated.assignments["CS101"].faculty_ids = ["GHOST_FACULTY"]
    
    validated = validate_timetable(base_data, base_graph, mutated)
    assert any(v.type == ViolationType.INVALID_FACULTY and "GHOST_FACULTY" == v.affected_faculty for v in validated.validation.violations)

def test_validator_catches_invalid_time_slot(base_data, base_graph, base_result):
    mutated = copy.deepcopy(base_result)
    mutated.assignments["CS101"].time_slot_id = "GHOST_TS"
    
    validated = validate_timetable(base_data, base_graph, mutated)
    assert any(v.type == ViolationType.INVALID_TIME_SLOT and "GHOST_TS" == v.time_slot for v in validated.validation.violations)
    
def test_validator_preserves_status(base_data, base_graph, base_result):
    mutated = copy.deepcopy(base_result)
    mutated.status = "OPTIMAL"
    mutated.assignments["CS101"].room_id = "GHOST_ROOM"
    
    validated = validate_timetable(base_data, base_graph, mutated)
    assert validated.validation.is_valid is False
    assert validated.status == "OPTIMAL" # Does not modify original solver status
