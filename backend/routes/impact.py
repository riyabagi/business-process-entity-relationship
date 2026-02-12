from fastapi import APIRouter
from app.impact_service import get_servers, get_impact

router = APIRouter(prefix="/api")

@router.get("/servers")
def servers():
    return get_servers()

@router.get("/impact/{server}")
def impact(server: str):
    return get_impact(server)
