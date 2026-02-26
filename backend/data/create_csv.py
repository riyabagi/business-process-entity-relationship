import pandas as pd
import random
import os

# Controlled CSV generator
servers = ["Core Banking Cluster", "Payments Gateway Node", "Customer Data Platform", "Risk Management Server"]
applications_pool = ["Analytics Platform", "Transaction System", "Security Engine", "Data Warehouse", "Reporting Engine", "API Gateway", "Integration Bus"]
processes_pool = ["Processing", "Validation", "Authorization", "Transformation", "Aggregation", "Notification", "Enrichment", "Sanitization"]
services_pool = ["Enterprise Service", "Secure Platform", "Core System", "Customer Portal", "Admin Dashboard", "Audit Service"]

DESIRED_APPS = 4
DESIRED_PROCESSES = 6
DESIRED_SERVICES = 2

rows = []

for year in range(2022, 2025):
    for server in servers:
        apps = random.sample(applications_pool, k=DESIRED_APPS)
        procs = random.sample(processes_pool, k=DESIRED_PROCESSES)
        servs = random.sample(services_pool, k=DESIRED_SERVICES)

        max_rows = 20
        count = 0

        for a in apps:
            for p in procs:
                for s in servs:
                    rows.append([year, server, a, p, s])
                    count += 1
                    if count >= max_rows:
                        break
                if count >= max_rows:
                    break
            if count >= max_rows:
                break

df = pd.DataFrame(rows, columns=["year", "server", "application", "process", "service"])

# Save in same folder as script (fallback to current working directory if __file__ not available)
try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
except NameError:
    BASE_DIR = os.getcwd()

out_path = os.path.join(BASE_DIR, "impact_data.csv")

df.to_csv(out_path, index=False)

print(f"CSV created at: {out_path}")
print(f"Rows: {len(df)}")
