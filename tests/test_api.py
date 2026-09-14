from fastapi.testclient import TestClient
from app.main import app
from app.data.sample_data import get_sample_data
from unittest.mock import patch
import copy

client = TestClient(app)

def test_api_generate_schedule_success():
    data = get_sample_data()
    response = client.post("/api/v1/schedule", json=data.model_dump(mode="json"))
    assert response.status_code == 200
    
    res_json = response.json()
    assert res_json["status"] in ["OPTIMAL", "FEASIBLE"]
    assert res_json["quality_score"] is not None
    assert res_json["validation"]["is_valid"] is True

def test_api_invalid_json_payload():
    # Missing required 'exams' field
    response = client.post("/api/v1/schedule", json={"students": []}) 
    assert response.status_code == 422

def test_api_infeasible_schedule():
    data = get_sample_data()
    # Force infeasibility: all rooms have capacity 1, but exams need more
    for r in data.rooms:
        r.capacity = 1
        
    response = client.post("/api/v1/schedule", json=data.model_dump(mode="json"))
    assert response.status_code == 200
    
    res_json = response.json()
    assert res_json["status"] == "INFEASIBLE"

@patch("app.services.timetable_service.solve_timetable")
def test_api_validator_catches_mocked_corruption(mock_solve):
    data = get_sample_data()
    
    # Run the real solver to get a real result structure
    from app.core.graph import build_conflict_graph
    from app.core.solver import solve_timetable
    graph = build_conflict_graph(data)
    real_result = solve_timetable(data, graph)
    
    # Corrupt it deliberately
    corrupted = copy.deepcopy(real_result)
    corrupted.assignments["CS101"].room_id = "INVALID_ROOM"
    mock_solve.return_value = corrupted
    
    response = client.post("/api/v1/schedule", json=data.model_dump(mode="json"))
    # The API should catch this via the validator and throw an Internal Engine Validation Failure (500)
    assert response.status_code == 500
    assert "Internal Engine Validation Failure" in response.json()["detail"]
