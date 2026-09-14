from ortools.sat.python import cp_model
import networkx as nx
from collections import defaultdict
from app.models.domain import CollegeData, TimetableResult, ExamAssignment

B2B_WEIGHT = 100
SAME_DAY_WEIGHT = 50
ROOM_WASTE_WEIGHT = 1

def solve_timetable(data: CollegeData, conflict_graph: nx.Graph) -> TimetableResult:
    model = cp_model.CpModel()
    
    assign_room = {}
    assign_faculty = {}
    
    # 1. Variables
    for exam in data.exams:
        for ts in data.time_slots:
            for room in data.rooms:
                if room.capacity >= exam.required_room_capacity and ts.id in room.available_slots:
                    var_name = f"e_{exam.id}_t_{ts.id}_r_{room.id}"
                    assign_room[(exam.id, ts.id, room.id)] = model.NewBoolVar(var_name)
                    
    for exam in data.exams:
        for ts in data.time_slots:
            for faculty in data.faculty:
                if ts.id in faculty.available_slots:
                    var_name = f"e_{exam.id}_t_{ts.id}_f_{faculty.id}"
                    assign_faculty[(exam.id, ts.id, faculty.id)] = model.NewBoolVar(var_name)
                    
    # 2. Hard Constraints
    
    # Exactly One Room Assignment per Exam
    for exam in data.exams:
        valid_room_vars = [
            assign_room[(exam.id, ts.id, room.id)] 
            for ts in data.time_slots for room in data.rooms 
            if (exam.id, ts.id, room.id) in assign_room
        ]
        if not valid_room_vars:
            model.AddBoolOr([0])
        else:
            model.AddExactlyOne(valid_room_vars)
            
    # Room Uniqueness
    for ts in data.time_slots:
        for room in data.rooms:
            exams_in_room = [
                assign_room[(exam.id, ts.id, room.id)] 
                for exam in data.exams 
                if (exam.id, ts.id, room.id) in assign_room
            ]
            if exams_in_room:
                model.Add(sum(exams_in_room) <= 1)

    # Helper: exam_active_at_t -> strictly boolean
    exam_at_t = {}
    for exam in data.exams:
        for ts in data.time_slots:
            room_vars_for_t = [assign_room[(exam.id, ts.id, r.id)] for r in data.rooms if (exam.id, ts.id, r.id) in assign_room]
            e_t = model.NewBoolVar(f"exam_{exam.id}_at_{ts.id}")
            model.Add(e_t == sum(room_vars_for_t))
            exam_at_t[(exam.id, ts.id)] = e_t

    # Student Conflict Avoidance (Hard constraint: overlapping exams cannot share a time slot)
    for exam_a, exam_b in conflict_graph.edges():
        for ts in data.time_slots:
            model.Add(exam_at_t[(exam_a, ts.id)] + exam_at_t[(exam_b, ts.id)] <= 1)
                
    # Required Invigilators
    for exam in data.exams:
        for ts in data.time_slots:
            faculty_vars_for_t = [
                assign_faculty[(exam.id, ts.id, f.id)]
                for f in data.faculty if (exam.id, ts.id, f.id) in assign_faculty
            ]
            active_var = exam_at_t[(exam.id, ts.id)]
            if faculty_vars_for_t:
                model.Add(sum(faculty_vars_for_t) == exam.required_invigilators * active_var)
            elif exam.required_invigilators > 0:
                model.Add(active_var == 0)

    # Faculty Overlap Avoidance
    for ts in data.time_slots:
        for faculty in data.faculty:
            exams_for_faculty = [
                assign_faculty[(exam.id, ts.id, faculty.id)]
                for exam in data.exams
                if (exam.id, ts.id, faculty.id) in assign_faculty
            ]
            if exams_for_faculty:
                model.Add(sum(exams_for_faculty) <= 1)

    # 3. Optimization (Phase 6 Soft Constraints)
    penalty_terms = []
    
    # Pre-calculate B2B and Same-Day pairs
    day_slots = defaultdict(list)
    for ts in data.time_slots:
        day_slots[ts.date].append(ts)
        
    b2b_pairs = set()
    sameday_pairs = set()
    
    for date_val, slots in day_slots.items():
        slots.sort(key=lambda x: x.start_time)
        for i in range(len(slots)):
            for j in range(i + 1, len(slots)):
                if j == i + 1:
                    b2b_pairs.add((slots[i].id, slots[j].id))
                    b2b_pairs.add((slots[j].id, slots[i].id))
                else:
                    sameday_pairs.add((slots[i].id, slots[j].id))
                    sameday_pairs.add((slots[j].id, slots[i].id))
                    
    # Objective: B2B and Same-Day
    for e1, e2 in conflict_graph.edges():
        weight = conflict_graph[e1][e2].get('weight', 1)
        
        # B2B Variables
        for t1, t2 in b2b_pairs:
            b2b_aux = model.NewBoolVar(f"b2b_{e1}_{e2}_{t1}_{t2}")
            e1_t1 = exam_at_t[(e1, t1)]
            e2_t2 = exam_at_t[(e2, t2)]
            
            model.Add(b2b_aux <= e1_t1)
            model.Add(b2b_aux <= e2_t2)
            model.Add(b2b_aux >= e1_t1 + e2_t2 - 1)
            
            penalty_terms.append(b2b_aux * weight * B2B_WEIGHT)
            
        # Same-Day Variables
        for t1, t2 in sameday_pairs:
            sameday_aux = model.NewBoolVar(f"sameday_{e1}_{e2}_{t1}_{t2}")
            e1_t1 = exam_at_t[(e1, t1)]
            e2_t2 = exam_at_t[(e2, t2)]
            
            model.Add(sameday_aux <= e1_t1)
            model.Add(sameday_aux <= e2_t2)
            model.Add(sameday_aux >= e1_t1 + e2_t2 - 1)
            
            penalty_terms.append(sameday_aux * weight * SAME_DAY_WEIGHT)

    # Objective: Room Waste
    for (e_id, t_id, r_id), var in assign_room.items():
        room = next(r for r in data.rooms if r.id == r_id)
        exam = next(e for e in data.exams if e.id == e_id)
        waste = room.capacity - exam.required_room_capacity
        penalty_terms.append(var * waste * ROOM_WASTE_WEIGHT)

    model.Minimize(sum(penalty_terms))
                
    # 4. Solve
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 10.0
    status_val = solver.Solve(model)
    
    status_map = {
        cp_model.OPTIMAL: "OPTIMAL",
        cp_model.FEASIBLE: "FEASIBLE",
        cp_model.INFEASIBLE: "INFEASIBLE",
        cp_model.MODEL_INVALID: "MODEL_INVALID",
        cp_model.UNKNOWN: "UNKNOWN"
    }
    status_str = status_map.get(status_val, "UNKNOWN")
    
    assignments = {}
    obj_val = None
    
    if status_val in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
        obj_val = solver.ObjectiveValue()
        for exam in data.exams:
            assigned_ts = None
            assigned_r = None
            assigned_f = []
            
            for ts in data.time_slots:
                for room in data.rooms:
                    if (exam.id, ts.id, room.id) in assign_room:
                        if solver.Value(assign_room[(exam.id, ts.id, room.id)]) == 1:
                            assigned_ts = ts.id
                            assigned_r = room.id
                            
            if assigned_ts:
                for faculty in data.faculty:
                    if (exam.id, assigned_ts, faculty.id) in assign_faculty:
                        if solver.Value(assign_faculty[(exam.id, assigned_ts, faculty.id)]) == 1:
                            assigned_f.append(faculty.id)
            
            if assigned_ts and assigned_r:
                assignments[exam.id] = ExamAssignment(
                    time_slot_id=assigned_ts, 
                    room_id=assigned_r,
                    faculty_ids=assigned_f
                )
                
    return TimetableResult(
        status=status_str, 
        assignments=assignments,
        objective_value=obj_val
    )
