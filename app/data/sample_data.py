from datetime import date, time
from app.models.domain import TimeSlot, Room, Faculty, Student, Exam, CollegeData

def get_sample_data() -> CollegeData:
    time_slots = [
        TimeSlot(id="TS1", date=date(2026, 10, 1), start_time=time(9, 0), end_time=time(11, 0), duration_minutes=120),
        TimeSlot(id="TS2", date=date(2026, 10, 1), start_time=time(13, 0), end_time=time(15, 0), duration_minutes=120),
        TimeSlot(id="TS3", date=date(2026, 10, 2), start_time=time(9, 0), end_time=time(11, 0), duration_minutes=120),
    ]

    rooms = [
        Room(id="R101", capacity=2, building="Main", available_slots=["TS1", "TS2", "TS3"]),
        Room(id="R102", capacity=5, building="Main", available_slots=["TS1", "TS2", "TS3"]),
    ]

    faculty = [
        Faculty(id="F1", name="Prof. Smith", available_slots=["TS1", "TS2", "TS3"], max_invigilations_per_day=2),
        Faculty(id="F2", name="Prof. Johnson", available_slots=["TS1", "TS3"], max_invigilations_per_day=1),
    ]

    students = [
        Student(id="S1", batch="CS-2026", enrolled_exams=["CS101", "MATH201"]),
        Student(id="S2", batch="CS-2026", enrolled_exams=["CS101"]),
        Student(id="S3", batch="CS-2026", enrolled_exams=["CS101", "CS102"]),
        Student(id="S4", batch="CS-2026", enrolled_exams=["CS102", "MATH201"]),
        Student(id="S5", batch="CS-2026", enrolled_exams=["CS102"]),
    ]

    exams = [
        Exam(id="CS101", course_name="Intro to CS", duration_minutes=120, enrolled_students=["S1", "S2", "S3"]),
        Exam(id="CS102", course_name="Data Structures", duration_minutes=120, enrolled_students=["S3", "S4", "S5"]),
        Exam(id="MATH201", course_name="Calculus", duration_minutes=90, enrolled_students=["S1", "S4"]),
    ]

    return CollegeData(
        time_slots=time_slots,
        rooms=rooms,
        faculty=faculty,
        students=students,
        exams=exams
    )

if __name__ == "__main__":
    data = get_sample_data()
    print(f"Loaded {len(data.exams)} exams and {len(data.students)} students.")
    # Quick sanity check on Pydantic validation
    print(data.model_dump_json(indent=2))
