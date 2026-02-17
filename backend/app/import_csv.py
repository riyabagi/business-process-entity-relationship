import pandas as pd
import os
from db.neo4j import run_query

# Delete all existing data
delete_query = "MATCH (n) DETACH DELETE n"
run_query(delete_query)
print("🗑️ All existing data deleted from Neo4j")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_DIR, "..", "data", "impact_data.csv")

df = pd.read_csv(csv_path)

for _, row in df.iterrows():
    query = """
    // Create Year
    MERGE (y:Year {year: $year})

    // Create Server
    MERGE (s:Server {name: $server})

    // Application UNIQUE per Server
    MERGE (a:Application {
        name: $application,
        server: $server
    })

    // Process UNIQUE per Application + Server
    MERGE (p:Process {
        name: $process,
        application: $application,
        server: $server
    })

    // Service UNIQUE per Process + Application + Server
    MERGE (sv:Service {
        name: $service,
        process: $process,
        application: $application,
        server: $server
    })

    // Relationships
    MERGE (s)-[:RUNS]->(a)
    MERGE (a)-[:SUPPORTS]->(p)
    MERGE (p)-[:DELIVERS]->(sv)
    MERGE (y)-[:HAS_SERVER]->(s)
    """

    run_query(query, row.to_dict())

print("✅ CSV imported into Neo4j")
