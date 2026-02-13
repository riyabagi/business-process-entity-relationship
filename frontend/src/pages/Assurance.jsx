import { useEffect, useState } from "react";
import { getServers, getAssurance } from "../api";

export default function Assurance() {
  const [servers, setServers] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [dependencies, setDependencies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load servers from backend
  useEffect(() => {
    getServers().then(setServers);
  }, []);

  // Fetch assurance data
  const fetchAssurance = async () => {
    if (!selectedAsset) return;

    setLoading(true);
    try {
      const data = await getAssurance(selectedAsset);
      setDependencies(data.dependencies || []);
    } finally {
      setLoading(false);
    }
  };

  // Update slider value
  const updateDependency = (index, field, value) => {
    const updated = [...dependencies];
    updated[index][field] = value;
    setDependencies(updated);
  };

  // Calculate total impact
  const totalImpact = dependencies.reduce((sum, d) => {
    const impact =
      d.criticality * (1 - d.health) * 100 * d.redundancy;
    return sum + impact;
  }, 0);

  const score = Math.max(0, Math.round(100 - totalImpact));

  let gaugeColor = "#f97316";
  let statusText = "DEGRADED";

  if (score > 80) {
    gaugeColor = "#16a34a";
    statusText = "HEALTHY";
  } else if (score < 50) {
    gaugeColor = "#dc2626";
    statusText = "CRITICAL";
  }

  // Gauge math
  const circleSize = 200;
  const stroke = 18;
  const radius = (circleSize - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3">Business Assurance Scoring</h2>

      {/* Asset selector */}
      <div className="mb-3">
        <select
          className="form-select"
          value={selectedAsset}
          onChange={(e) => setSelectedAsset(e.target.value)}
        >
          <option value="">Select Infrastructure Asset</option>
          {servers.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          className="btn btn-primary mt-2"
          onClick={fetchAssurance}
        >
          Load Assurance
        </button>
      </div>

      {loading && <p>Loading assurance data...</p>}

      <div className="row mt-4">
        {/* Left: Dependencies */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm rounded-4">
            <h5 className="fw-bold mb-3">Dependency Simulation</h5>

            {dependencies.map((dep, i) => (
              <div key={i} className="mb-4 border-bottom pb-3">
                <strong>{dep.name}</strong>

                <label>
                  Criticality: {dep.criticality}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={dep.criticality}
                  onChange={(e) =>
                    updateDependency(
                      i,
                      "criticality",
                      +e.target.value
                    )
                  }
                  className="form-range"
                />

                <label>
                  Health: {dep.health}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={dep.health}
                  onChange={(e) =>
                    updateDependency(
                      i,
                      "health",
                      +e.target.value
                    )
                  }
                  className="form-range"
                />

                <label>
                  Redundancy: {dep.redundancy}
                </label>
                <input
                  type="range"
                  min="0.2"
                  max="1"
                  step="0.2"
                  value={dep.redundancy}
                  onChange={(e) =>
                    updateDependency(
                      i,
                      "redundancy",
                      +e.target.value
                    )
                  }
                  className="form-range"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Gauge */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm rounded-4 text-center">
            <h5 className="fw-bold mb-4">
              Service Assurance Score
            </h5>

            <div
              style={{
                position: "relative",
                width: circleSize,
                height: circleSize,
                margin: "0 auto",
              }}
            >
              <svg width={circleSize} height={circleSize}>
                <circle
                  cx={circleSize / 2}
                  cy={circleSize / 2}
                  r={radius}
                  stroke="#e5e7eb"
                  strokeWidth={stroke}
                  fill="none"
                />

                <circle
                  cx={circleSize / 2}
                  cy={circleSize / 2}
                  r={radius}
                  stroke={gaugeColor}
                  strokeWidth={stroke}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={progress}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${
                    circleSize / 2
                  } ${circleSize / 2})`}
                  style={{
                    transition:
                      "stroke-dashoffset 0.6s ease",
                  }}
                />
              </svg>

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h1 className="fw-bold mb-0">
                  {score}%
                </h1>
                <p
                  className="fw-semibold mb-0"
                  style={{ color: gaugeColor }}
                >
                  {statusText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
