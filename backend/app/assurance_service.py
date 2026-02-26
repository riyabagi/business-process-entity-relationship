from db.neo4j import get_assurance_dependencies as db_get_assurance_dependencies

# This file is acting as a service layer for assurance scoring.


def get_assurance_score(asset):
    """
    Fetches assurance score data for a given server asset.
    
    Args:
        asset (str): Name of the server/infrastructure asset
    
    Returns:
        list: List of applications with their assurance metrics
             (name, criticality, health, redundancy)
    
    Business Logic:
        - Retrieves all applications running on the specified asset
        - Each application has assurance metrics that indicate:
          * criticality: How important this app is to operations (0-1 scale)
          * health: Current operational health (0-1 scale)
          * redundancy: Level of redundancy protection (0-1 scale)
    
    These metrics are used by the frontend to calculate overall resilience scores.
    """
    return db_get_assurance_dependencies(asset)
