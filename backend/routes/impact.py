from fastapi import APIRouter
from db.neo4j import get_servers, get_impact

router = APIRouter()

@router.get("/servers")
def servers():
    return get_servers()

@router.get("/impact/{server}")
def impact(server: str):
    return get_impact(server)
