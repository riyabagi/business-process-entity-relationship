from db.neo4j import get_servers as db_get_servers
from db.neo4j import get_impact as db_get_impact


def get_servers():
    return db_get_servers()


def get_impact(server_name):
    return db_get_impact(server_name)

def get_disturbed_entities():
    # Replace with real Neo4j query
    return {
        "servers": ["Core Banking Server"],
        "applications": ["Transaction System"],
        "processes": ["Payment Processing"]
    }
