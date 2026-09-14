import networkx as nx
from itertools import combinations
from app.models.domain import CollegeData

def build_conflict_graph(data: CollegeData) -> nx.Graph:
    """
    Builds a deterministic undirected conflict graph where nodes are Exam IDs
    and edges represent a scheduling conflict due to shared students.
    """
    graph = nx.Graph()
    
    # 1. Add all exams as nodes (even those with no students)
    for exam in data.exams:
        graph.add_node(exam.id)
        
    # 2. Add edges based on student enrollments
    for student in data.students:
        # Deduplicate to prevent false weight inflation if data is dirty
        unique_exams = list(set(student.enrolled_exams))
        
        if len(unique_exams) >= 2:
            # Generate all pairs of exams this student is taking
            for exam_a, exam_b in combinations(unique_exams, 2):
                if graph.has_edge(exam_a, exam_b):
                    graph[exam_a][exam_b]['weight'] += 1
                    graph[exam_a][exam_b]['students'].append(student.id)
                else:
                    graph.add_edge(exam_a, exam_b, weight=1, students=[student.id])
                    
    return graph

if __name__ == "__main__":
    from app.data.sample_data import get_sample_data
    
    data = get_sample_data()
    conflict_graph = build_conflict_graph(data)
    
    print(f"Graph created with {conflict_graph.number_of_nodes()} nodes and {conflict_graph.number_of_edges()} edges.\n")
    
    print("Nodes (Exams):", list(conflict_graph.nodes()))
    print("\nEdges (Conflicts):")
    for u, v, edge_data in conflict_graph.edges(data=True):
        print(f" - {u} <-> {v} | weight: {edge_data['weight']}, students: {edge_data['students']}")
