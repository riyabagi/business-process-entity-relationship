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
