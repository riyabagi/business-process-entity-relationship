from fastapi import APIRouter
from db import neo4j

router = APIRouter(prefix="/api")

@router.get("/assurance-score")
def assurance(asset: str):
    query = """
    MATCH (s:Server {name: $asset})
    MATCH (s)-[:RUNS]->(a:Application)
    RETURN a.name AS name,
           coalesce(a.criticality, 0.8) AS criticality,
           coalesce(a.health, 1.0) AS health,
           coalesce(a.redundancy, 1.0) AS redundancy
    """

    result = neo4j.run_query(query, {"asset": asset})

    return {
        "dependencies": result
    }
