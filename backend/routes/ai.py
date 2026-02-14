from fastapi import APIRouter, Query, HTTPException
from typing import List
from starlette.concurrency import run_in_threadpool
import importlib

router = APIRouter()


@router.get("/ai/incident-summary")
async def ai_summary(
    server: str = Query(None),
    applications: str = Query(None),
    processes: str = Query(None)
):
    """
    API endpoint to generate a concise incident summary using the AI service.
    Delegates to `app.ai_service.generate_incident_summary` and runs the
    potentially blocking AI call in a threadpool to avoid blocking the event loop.
    """
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
        # Import service at runtime to avoid circular import issues during reload
        ai_service = importlib.import_module("app.ai_service")
        message = await run_in_threadpool(ai_service.generate_incident_summary, data)
    except Exception:
        raise HTTPException(status_code=500, detail="AI service failed to generate summary")

    return {
        "summary": message,
        "data": data
    }
