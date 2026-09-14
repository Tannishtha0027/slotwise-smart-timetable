from app.models.domain import CollegeData, TimetableResult, ValidationResult
from app.core.graph import build_conflict_graph
from app.core.solver import solve_timetable
from app.core.validator import validate_timetable
from app.core.scorer import score_timetable

class EngineValidationError(Exception):
    """Raised when the CP-SAT engine produces a timetable that fails independent validation."""
    def __init__(self, validation_result: ValidationResult):
        self.validation_result = validation_result
        super().__init__("Internal Engine Validation Failure")

def generate_timetable(data: CollegeData) -> TimetableResult:
    """
    Orchestrates the entire scheduling pipeline from graph generation to scoring.
    """
    # 1. Build the student conflict graph
    graph = build_conflict_graph(data)
    
    # 2. Solve the scheduling problem using CP-SAT
    result = solve_timetable(data, graph)
    
    # 3. Independent zero-trust validation
    result = validate_timetable(data, graph, result)
    
    # 4. Enforce mathematical feasibility vs actual validation
    if result.status in ["FEASIBLE", "OPTIMAL"]:
        if result.validation and not result.validation.is_valid:
            # The solver claimed success, but independent validation failed.
            # We abort and do NOT return this to the client as a success.
            raise EngineValidationError(result.validation)
            
        # 5. Score the validated timetable
        result = score_timetable(data, graph, result)
        
    return result
