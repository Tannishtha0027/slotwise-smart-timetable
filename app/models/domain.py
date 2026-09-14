from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, time

class TimeSlot(BaseModel):
    """Represents a specific window of time for an exam."""
    id: str
    date: date
    start_time: time
    end_time: time
    duration_minutes: int

class Room(BaseModel):
    """Represents a physical room where an exam can take place."""
    id: str
    capacity: int
    building: Optional[str] = None
    available_slots: List[str] = Field(default_factory=list) # List of TimeSlot IDs

class Faculty(BaseModel):
    """Represents a faculty member available for invigilation."""
    id: str
    name: str
    available_slots: List[str] = Field(default_factory=list) # List of TimeSlot IDs
    max_invigilations_per_day: Optional[int] = None
    total_invigilations_target: Optional[int] = None

class Student(BaseModel):
    """Represents a student and their enrolled exams."""
    id: str
    batch: str
    enrolled_exams: List[str] = Field(default_factory=list) # List of Exam IDs

class Exam(BaseModel):
    """Represents an examination that needs to be scheduled."""
    id: str
    course_name: str
    duration_minutes: int
    enrolled_students: List[str] = Field(default_factory=list) # List of Student IDs
    required_invigilators: int = 1
    
    @property
    def required_room_capacity(self) -> int:
        return len(self.enrolled_students)

class CollegeData(BaseModel):
    """The full input dataset for the timetable problem."""
    time_slots: List[TimeSlot]
    rooms: List[Room]
    faculty: List[Faculty]
    exams: List[Exam]
    students: List[Student]

from pydantic import BaseModel, Field
from enum import Enum

class ViolationType(str, Enum):
    ROOM_CAPACITY = "ROOM_CAPACITY"
    ROOM_UNAVAILABLE = "ROOM_UNAVAILABLE"
    ROOM_COLLISION = "ROOM_COLLISION"
    FACULTY_UNAVAILABLE = "FACULTY_UNAVAILABLE"
    FACULTY_DOUBLE_BOOKED = "FACULTY_DOUBLE_BOOKED"
    STUDENT_CONFLICT = "STUDENT_CONFLICT"
    MISSING_ASSIGNMENT = "MISSING_ASSIGNMENT"
    EXTRA_ASSIGNMENT = "EXTRA_ASSIGNMENT"
    INVIGILATOR_COUNT = "INVIGILATOR_COUNT"
    INVALID_ROOM = "INVALID_ROOM"
    INVALID_FACULTY = "INVALID_FACULTY"
    INVALID_TIME_SLOT = "INVALID_TIME_SLOT"

class Violation(BaseModel):
    type: ViolationType
    severity: str = "HARD"
    affected_exams: List[str] = Field(default_factory=list)
    affected_room: Optional[str] = None
    affected_faculty: Optional[str] = None
    time_slot: Optional[str] = None
    message: str

class ValidationResult(BaseModel):
    is_valid: bool
    violations: List[Violation] = Field(default_factory=list)

class ExamAssignment(BaseModel):
    """Represents a scheduled exam block."""
    time_slot_id: str
    room_id: str
    faculty_ids: List[str] = Field(default_factory=list)

class TimetableResult(BaseModel):
    """Represents the output of the scheduling solver."""
    status: str
    assignments: dict[str, ExamAssignment] = Field(default_factory=dict) # Exam ID -> ExamAssignment
    objective_value: Optional[float] = None
    quality_score: Optional[float] = None
    student_comfort_score: Optional[float] = None
    room_efficiency_score: Optional[float] = None
    metrics: dict = Field(default_factory=dict)
    validation: Optional[ValidationResult] = None
