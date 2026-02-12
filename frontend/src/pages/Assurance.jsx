import { useState } from "react";

export default function Assurance() {
  const [criticality, setCriticality] = useState(1);
  const [health, setHealth] = useState(0.6);
  const [redundancy, setRedundancy] = useState(1);

  const impact = criticality * (1 - health) * 100 * redundancy;
  const score = Math.max(0, Math.round(100 - impact));

  let gaugeColor = "#f97316"; // orange
  let statusText = "DEGRADED";

  if (score > 80) {
    gaugeColor = "#16a34a"; // green
    statusText = "HEALTHY";
  } else if (score < 50) {
    gaugeColor = "#dc2626"; // red
    statusText = "CRITICAL";
  }

  const circleSize = 180;
  const stroke = 16;
  const radius = (circleSize - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-2">Business Assurance Scoring</h2>
      <hr />

      <p className="text-muted">
        Simulate the "Service Health" formula:{" "}
        <code>100 - Σ (ImpactWeight × OutageSeverity)</code>
      </p>

      <div className="row mt-4">
        {/* Left Panel */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm rounded-4">
            <h5 className="fw-bold mb-3">Simulation Inputs</h5>

            <label className="fw-semibold">
              Dependency Criticality (C): {criticality}
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={criticality}
              onChange={(e) => setCriticality(+e.target.value)}
              className="form-range"
            />

            <label className="fw-semibold">
              Component Health (H): {health}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={health}
              onChange={(e) => setHealth(+e.target.value)}
              className="form-range"
            />

            <label className="fw-semibold">
              Redundancy Factor (R): {redundancy}
            </label>
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.5"
              value={redundancy}
              onChange={(e) => setRedundancy(+e.target.value)}
              className="form-range"
            />

            {/* Formula Box */}
            <div className="mt-4 p-3 bg-light rounded">
              <strong>Formula Logic</strong>
              <pre className="mb-0">
Impact = (Criticality × (1 - Health)) × 100 × Redundancy
Score = 100 - Impact
              </pre>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm rounded-4 text-center">
            <h5 className="fw-bold mb-4">Assurance Score</h5>

            {/* Round Gauge */}
            <div style={{ position: "relative", width: circleSize, height: circleSize, margin: "0 auto" }}>
              <svg width={circleSize} height={circleSize}>
                {/* Grey base ring */}
                <circle
                  cx={circleSize / 2}
                  cy={circleSize / 2}
                  r={radius}
                  stroke="#e5e7eb"
                  strokeWidth={stroke}
                  fill="none"
                />

                {/* Colored progress ring */}
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
                  transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
              </svg>

              {/* Score text in center */}
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
                <h1 className="fw-bold mb-0">{score}%</h1>
                <p className="fw-semibold mb-0" style={{ color: gaugeColor }}>
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
