from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
from app.models.domain import CollegeData, TimetableResult
from app.services.timetable_service import generate_timetable, EngineValidationError

app = FastAPI(title="Smart Exam Timetable Generator API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/api/v1/schedule", response_model=TimetableResult)
def schedule_endpoint(data: CollegeData):
    """
    Generate an optimized and validated exam timetable from raw college data.
    """
    try:
        result = generate_timetable(data)
        return result
    except EngineValidationError as e:
        logger.error(f"Internal Engine Validation Failure: {e.validation_result.model_dump_json()}")
        raise HTTPException(status_code=500, detail="Internal Engine Validation Failure")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected internal server error occurred.")
