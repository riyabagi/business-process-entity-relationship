from fastapi import APIRouter, Query
from app.impact_analysis_service import simulate_failure
from app.impact_service import get_servers

router = APIRouter(prefix="/api")


@router.get("/servers")
def list_servers():
    """
    Get list of all servers in the system.
    """
    return get_servers()


@router.get("/simulate")
def simulate(server: str = Query(..., description="Server name to simulate failure")):
    """
    Comprehensive impact analysis endpoint.
    
    Returns complete impact metrics for a failed server:
    - Financial risk calculation
    - Affected services with assurance scores
    - TPS impact (derived from service criticality)
    - Regulatory impact assessment
    - Propagation chain from Neo4j graph
    
    All calculations are performed on the backend based on real graph data.
    """
    return simulate_failure(server)
