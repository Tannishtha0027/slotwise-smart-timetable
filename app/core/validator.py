import networkx as nx
from app.models.domain import CollegeData, TimetableResult, ValidationResult, Violation, ViolationType

def validate_timetable(data: CollegeData, conflict_graph: nx.Graph, result: TimetableResult) -> TimetableResult:
    """
    Independent validation layer for hard constraints.
    Does not modify solver status. Does not trust CP-SAT output.
    """
    violations = []
    
    valid_exam_ids = {e.id for e in data.exams}
    valid_room_ids = {r.id for r in data.rooms}
    valid_ts_ids = {t.id for t in data.time_slots}
    valid_fac_ids = {f.id for f in data.faculty}
    
    exams_dict = {e.id: e for e in data.exams}
    rooms_dict = {r.id: r for r in data.rooms}
    facs_dict = {f.id: f for f in data.faculty}
    
    assigned_exam_ids = set(result.assignments.keys())
    
    # 1. Missing & Extra Assignments
    for e_id in valid_exam_ids - assigned_exam_ids:
        violations.append(Violation(
            type=ViolationType.MISSING_ASSIGNMENT,
            affected_exams=[e_id],
            message=f"Exam {e_id} is completely missing from assignments."
        ))
        
    for e_id in assigned_exam_ids - valid_exam_ids:
        violations.append(Violation(
            type=ViolationType.EXTRA_ASSIGNMENT,
            affected_exams=[e_id],
            message=f"Exam {e_id} is assigned but does not exist in CollegeData."
        ))
        
    room_usage = {}
    faculty_usage = {}
    
    # Validate Individual Assignments
    for e_id, assignment in result.assignments.items():
        if e_id not in valid_exam_ids:
            continue
            
        exam = exams_dict[e_id]
        ts_id = assignment.time_slot_id
        r_id = assignment.room_id
        f_ids = assignment.faculty_ids
        
        # Invalid References Check
        invalid_ref = False
        if ts_id not in valid_ts_ids:
            violations.append(Violation(type=ViolationType.INVALID_TIME_SLOT, affected_exams=[e_id], time_slot=ts_id, message="Invalid time slot referenced."))
            invalid_ref = True
            
        if r_id not in valid_room_ids:
            violations.append(Violation(type=ViolationType.INVALID_ROOM, affected_exams=[e_id], affected_room=r_id, message="Invalid room referenced."))
            invalid_ref = True
            
        for f_id in f_ids:
            if f_id not in valid_fac_ids:
                violations.append(Violation(type=ViolationType.INVALID_FACULTY, affected_exams=[e_id], affected_faculty=f_id, message="Invalid faculty referenced."))
                invalid_ref = True
                
        if invalid_ref:
            continue
            
        # Required Invigilators Check
        if len(f_ids) != exam.required_invigilators:
            violations.append(Violation(
                type=ViolationType.INVIGILATOR_COUNT, affected_exams=[e_id],
                message=f"Expected {exam.required_invigilators} invigilators, got {len(f_ids)}."
            ))
            
        # Room Capacity & Availability Check
        room = rooms_dict[r_id]
        if room.capacity < exam.required_room_capacity:
            violations.append(Violation(type=ViolationType.ROOM_CAPACITY, affected_exams=[e_id], affected_room=r_id, message="Assigned room capacity is smaller than enrolled students."))
            
        if ts_id not in room.available_slots:
            violations.append(Violation(type=ViolationType.ROOM_UNAVAILABLE, affected_exams=[e_id], affected_room=r_id, time_slot=ts_id, message="Room is not available during this time slot."))
            
        # Populate for Collision Checks
        r_key = (ts_id, r_id)
        room_usage.setdefault(r_key, []).append(e_id)
        
        # Faculty Availability Check
        for f_id in f_ids:
            faculty = facs_dict[f_id]
            if ts_id not in faculty.available_slots:
                violations.append(Violation(type=ViolationType.FACULTY_UNAVAILABLE, affected_exams=[e_id], affected_faculty=f_id, time_slot=ts_id, message="Faculty is not available during this time slot."))
                
            f_key = (ts_id, f_id)
            faculty_usage.setdefault(f_key, []).append(e_id)
            
    # Room Collision Check
    for (ts_id, r_id), exams in room_usage.items():
        if len(exams) > 1:
            violations.append(Violation(type=ViolationType.ROOM_COLLISION, affected_exams=exams, affected_room=r_id, time_slot=ts_id, message="Multiple exams assigned to the same room at the same time."))
            
    # Faculty Double-Booking Check
    for (ts_id, f_id), exams in faculty_usage.items():
        if len(exams) > 1:
            violations.append(Violation(type=ViolationType.FACULTY_DOUBLE_BOOKED, affected_exams=exams, affected_faculty=f_id, time_slot=ts_id, message="Faculty assigned to multiple exams at the same time."))
            
    # Student Conflict Check
    for e1, e2 in conflict_graph.edges():
        if e1 in assigned_exam_ids and e2 in assigned_exam_ids:
            a1 = result.assignments[e1]
            a2 = result.assignments[e2]
            # Verify they don't have broken refs before strictly comparing time
            if a1.time_slot_id in valid_ts_ids and a2.time_slot_id in valid_ts_ids:
                if a1.time_slot_id == a2.time_slot_id:
                    violations.append(Violation(
                        type=ViolationType.STUDENT_CONFLICT,
                        affected_exams=[e1, e2],
                        time_slot=a1.time_slot_id,
                        message="Exams sharing students are scheduled at the same time."
                    ))

    result.validation = ValidationResult(is_valid=(len(violations) == 0), violations=violations)
    return result
