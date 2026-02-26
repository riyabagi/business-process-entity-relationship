from neo4j import GraphDatabase

URI = "bolt://localhost:7687"
USER = "neo4j"
PASSWORD = "neo4j123"

driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))

def run_query(query, params=None):
    with driver.session() as session:
        result = session.run(query, params or {})
        return result.data()

# ----------------------------
# Get unique servers
# ----------------------------
def get_servers():
    try:
        with driver.session() as session:
            result = session.run("""
                MATCH (s:Server)
                RETURN DISTINCT s.name AS name
                ORDER BY name
            """)

            servers = [record["name"] for record in result]

            print("Servers from Neo4j:", servers)  # debug print

            return servers

    except Exception as e:
        print("Neo4j ERROR:", str(e))
        return []

# ----------------------------
# Get impact chain
# ----------------------------
def get_impact(server):
    with driver.session() as session:
        result = session.run(
            """
            MATCH (s:Server {name:$server})-[:RUNS]->(a:Application)
                  -[:SUPPORTS]->(p:Process)
                  -[:DELIVERS]->(sv:Service)
            RETURN a.name AS application,
                   p.name AS process,
                   sv.name AS service
            """,
            server=server
        )
        return result.data()

# ----------------------------
# Get all disturbed entities when a server is affected
# ----------------------------
def get_disturbed_entities(server):
    """
    Returns all entities affected when a specific server fails.
    Includes all downstream applications, processes, and services.
    """
    try:
        with driver.session() as session:
            result = session.run(
                """
                MATCH (s:Server {name:$server})-[:RUNS]->(a:Application)
                      -[:SUPPORTS]->(p:Process)
                      -[:DELIVERS]->(sv:Service)
                RETURN DISTINCT
                       collect(DISTINCT s.name) AS servers,
                       collect(DISTINCT a.name) AS applications,
                       collect(DISTINCT p.name) AS processes,
                       collect(DISTINCT sv.name) AS services
                """,
                server=server
            )
            
            data = result.data()
            
            if data:
                return {
                    "servers": data[0].get("servers", []),
                    "applications": data[0].get("applications", []),
                    "processes": data[0].get("processes", []),
                    "services": data[0].get("services", [])
                }
            else:
                return {
                    "servers": [],
                    "applications": [],
                    "processes": [],
                    "services": []
                }
    
    except Exception as e:
        print(f"Neo4j ERROR in get_disturbed_entities: {str(e)}")
        return {
            "servers": [],
            "applications": [],
            "processes": [],
            "services": []
        }

# ----------------------------
# Get assurance dependencies for a server
# ----------------------------
def get_assurance_dependencies(asset):
    """
    Fetches all applications running on a server with their assurance metrics.
    Returns criticality, health, and redundancy attributes.
    """
    try:
        with driver.session() as session:
            result = session.run(
                """
                MATCH (s:Server {name: $asset})
                MATCH (s)-[:RUNS]->(a:Application)
                RETURN a.name AS name,
                       coalesce(a.criticality, 0.8) AS criticality,
                       coalesce(a.health, 1.0) AS health,
                       coalesce(a.redundancy, 1.0) AS redundancy
                """,
                asset=asset
            )
            return result.data()
    
    except Exception as e:
        print(f"Neo4j ERROR in get_assurance_dependencies: {str(e)}")
        return []
