import pandas as pd
import random
import os

# -----------------------------
# Configuration
# -----------------------------

random.seed(42)  # remove if you want different data each run

YEARS = range(2022, 2025)

SERVERS = [
    "Core Banking Cluster",
    "Payments Gateway Node",
    "Customer Data Platform",
    "Risk Management Server"
]

APPLICATIONS = [
    "Transaction System",
    "Security Engine",
    "Analytics Platform"
]

PROCESSES = [
    "Processing",
    "Validation",
    "Authorization"
]

SERVICES = [
    "Secure Platform",
    "Enterprise Service",
    "Core System"
]

ROWS_PER_SERVER_PER_YEAR = 3

OUTPUT_PATH = "data/impact_data.csv"


# -----------------------------
# Generate Data
# -----------------------------

rows = []

for year in YEARS:
    for server in SERVERS:
        for _ in range(ROWS_PER_SERVER_PER_YEAR):
            rows.append({
                "year": year,
                "server": server,
                "application": random.choice(APPLICATIONS),
                "process": random.choice(PROCESSES),
                "service": random.choice(SERVICES)
            })

df = pd.DataFrame(rows)

# -----------------------------
# Save CSV
# -----------------------------

os.makedirs("data", exist_ok=True)
df.to_csv(OUTPUT_PATH, index=False)

print(f"✅ CSV created successfully at: {OUTPUT_PATH}")
print(f"📊 Total rows generated: {len(df)}")
