from neo4j import GraphDatabase

driver = GraphDatabase.driver(
    "bolt://localhost:7687",
    auth=("neo4j", "neo4j123")
)

def get_servers():
    with driver.session() as session:
        result = session.run(
            "MATCH (s:Server) RETURN s.name AS name"
        )
        return [r["name"] for r in result]

def get_impact(server):
    with driver.session() as session:
        result = session.run(
            """
            MATCH (s:Server {name:$server})-[:HAS_IMPACT]->(i:Impact)
            RETURN i.application AS application,
                   i.process AS process,
                   i.service AS service
            """,
            server=server
        )
        return result.data()
