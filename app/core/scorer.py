import networkx as nx
from collections import defaultdict
from app.models.domain import CollegeData, TimetableResult
from app.core.solver import B2B_WEIGHT

def score_timetable(data: CollegeData, conflict_graph: nx.Graph, result: TimetableResult) -> TimetableResult:
    """
    Independent quality analysis layer for evaluating timetables.
    """
    if result.status not in ["FEASIBLE", "OPTIMAL"]:
        return result
        
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
                    
    b2b_violations = 0
    sameday_violations = 0
    
    for e1, e2 in conflict_graph.edges():
        weight = conflict_graph[e1][e2].get('weight', 1)
        if e1 in result.assignments and e2 in result.assignments:
            t1 = result.assignments[e1].time_slot_id
            t2 = result.assignments[e2].time_slot_id
            if (t1, t2) in b2b_pairs:
                b2b_violations += weight
            elif (t1, t2) in sameday_pairs:
                sameday_violations += weight
                
    # 1. Student Comfort Score
    total_possible_conflicts = sum(w for u, v, w in conflict_graph.edges(data='weight', default=1))
    max_penalty = total_possible_conflicts * B2B_WEIGHT
    actual_penalty = (b2b_violations * B2B_WEIGHT) + (sameday_violations * 50)
    
    if max_penalty == 0:
        student_comfort = 100.0
    else:
        student_comfort = max(0.0, 100.0 * (1.0 - (actual_penalty / max_penalty)))
        
    # 2. Room Efficiency Score
    total_req_cap = 0
    total_assigned_cap = 0
    room_map = {r.id: r for r in data.rooms}
    
    for exam in data.exams:
        if exam.id in result.assignments:
            req_cap = exam.required_room_capacity
            r_id = result.assignments[exam.id].room_id
            assigned_cap = room_map[r_id].capacity
            
            total_req_cap += req_cap
            total_assigned_cap += assigned_cap
            
    if total_assigned_cap == 0:
        room_efficiency = 0.0
    else:
        room_efficiency = 100.0 * total_req_cap / total_assigned_cap
        
    # Clamp
    room_efficiency = min(100.0, max(0.0, room_efficiency))
    
    # 3. Overall Score
    overall_score = (student_comfort * 0.70) + (room_efficiency * 0.30)
    
    result.student_comfort_score = round(student_comfort, 2)
    result.room_efficiency_score = round(room_efficiency, 2)
    result.quality_score = round(overall_score, 2)
    result.metrics = {
        "b2b_violations": b2b_violations,
        "sameday_violations": sameday_violations,
        "room_waste": total_assigned_cap - total_req_cap,
        "total_required_capacity": total_req_cap,
        "total_assigned_capacity": total_assigned_cap
    }
    
    return result
