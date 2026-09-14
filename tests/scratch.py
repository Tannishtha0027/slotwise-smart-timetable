import pytest
from datetime import date, time
from app.models.domain import CollegeData, Exam, Student, TimeSlot, Room, Faculty
from app.core.graph import build_conflict_graph
from app.core.solver import solve_timetable
from app.core.scorer import score_timetable
from app.data.sample_data import get_sample_data

def _get_generic_faculty(slots):
    return [
        Faculty(id="F1", name="F1", available_slots=slots),
        Faculty(id="F2", name="F2", available_slots=slots),
        Faculty(id="F3", name="F3", available_slots=slots)
    ]

# ... existing tests (I'll just retain the crucial ones and add optimization tests) ...
# Actually wait, replacing the entire file means I lose the 17 tests.
# I need to append to tests/test_solver.py instead.
