from fastapi import APIRouter, Query
from typing import List
from ai.ai_service import generate_incident_summary

router = APIRouter()

@router.get("/ai/incident-summary")
async def ai_summary(
    server: str = Query(None),
    applications: str = Query(None),
    processes: str = Query(None)
):
    # Parse comma-separated lists from query parameters
    data = {
        "servers": [server] if server else [],
        "applications": applications.split(",") if applications else [],
        "processes": processes.split(",") if processes else []
    }

    if not any(data.values()):
        return {
            "summary": "No services affected. All systems operational.",
            "data": data
        }

    try:
        message = generate_incident_summary(data)
    except Exception as e:
        message = f"Incident detected affecting {applications or 'unknown systems'}. Team notified."

    return {
        "summary": message,
        "data": data
    }
