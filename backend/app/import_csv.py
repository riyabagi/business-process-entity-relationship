import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_DIR, "..", "data", "impact_data.csv")

df = pd.read_csv(csv_path)

for _, row in df.iterrows():
    query = """
    MERGE (y:Year {year: $year})
    MERGE (s:Server {name: $server})
    MERGE (a:Application {name: $application})
    MERGE (p:Process {name: $process})
    MERGE (sv:Service {name: $service})

    MERGE (s)-[:RUNS]->(a)
    MERGE (a)-[:SUPPORTS]->(p)
    MERGE (p)-[:DELIVERS]->(sv)
    MERGE (y)-[:HAS_SERVER]->(s)
    """

    run_query(query, row.to_dict())

print("✅ CSV imported into Neo4j")
