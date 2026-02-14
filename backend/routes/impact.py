from fastapi import APIRouter
from app.impact_service import get_servers, get_impact, get_disturbed_entities

router = APIRouter(prefix="/api")

@router.get("/servers")
def servers():
    """
    Returns a list of all available servers in the system.
    """
    return get_servers()

@router.get("/impact/{server}")
def impact(server: str):
    """
    Returns the forward impact chain for a given server.
    Shows what applications, processes, and services depend on this server.
    """
    return get_impact(server)

@router.get("/disturbed-entities/{server}")
def disturbed_entities(server: str):
    """
    Returns all entities (servers, applications, processes, services)
    that would be affected if the given server fails.
    
    This is useful for impact analysis and incident response planning.
    """
    return get_disturbed_entities(server)
