from fastapi import APIRouter
from app.assurance_service import get_assurance_score

router = APIRouter(prefix="/api")

@router.get("/assurance-score")
def assurance(asset: str):
    """
    Returns assurance score data for a given server asset.
    Fetches all dependent applications with their criticality, health, and redundancy metrics.
    """
    dependencies = get_assurance_score(asset)
    
    return {
        "dependencies": dependencies
    }
