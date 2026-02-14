from db.neo4j import get_servers as db_get_servers
from db.neo4j import get_impact as db_get_impact
from db.neo4j import get_disturbed_entities as db_get_disturbed_entities

# This file is acting as a service layer.
def get_servers():
    """
    Fetches all available servers from the database.
    """
    return db_get_servers()

def get_impact(server_name):
    """
    Fetches the forward impact chain for a given server.
    Shows what applications, processes, and services depend on this server.
    """
    return db_get_impact(server_name)

def get_disturbed_entities(server_name):
    """
    Fetches all entities (servers, applications, processes, services)
    that would be affected/disturbed if the given server fails.
    Args: server_name (str): Name of the server to analyze
    Returns:dict: Contains lists of affected servers, applications, processes, and services
    """
    return db_get_disturbed_entities(server_name)
