import { useEffect, useMemo, useState } from "react";
import { getServers, getAssurance } from "../api";

export default function Assurance() {
  // If you still see a tiny page scroll, increase the 170px a bit (like 180px)
  const PAGE_H = "calc(100vh - 105px)";

  const [servers, setServers] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [dependencies, setDependencies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getServers().then(setServers);
  }, []);

  const fetchAssurance = async () => {
    if (!selectedAsset) return;
    setLoading(true);
    try {
      const data = await getAssurance(selectedAsset);
      setDependencies(data?.dependencies || []);
    } finally {
      setLoading(false);
    }
  };

  const updateDependency = (index, field, value) => {
    setDependencies((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    );
  };

  const totalImpact = useMemo(() => {
    return dependencies.reduce((sum, d) => {
      const impact = d.criticality * (1 - d.health) * 100 * d.redundancy;
      return sum + impact;
    }, 0);
  }, [dependencies]);

  const score = useMemo(() => {
    return Math.max(0, Math.min(100, Math.round(100 - totalImpact)));
  }, [totalImpact]);

  let gaugeColor = "#f97316";
  let statusText = "DEGRADED";
  if (score >= 80) {
    gaugeColor = "#16a34a";
    statusText = "HEALTHY";
  } else if (score < 50) {
    gaugeColor = "#dc2626";
    statusText = "CRITICAL";
  }

  // ✅ CHANGED: Slightly smaller gauge so left card doesn't become longer
  const circleSize = 230; // was 280
  const stroke = 22;
  const radius = (circleSize - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div
      style={{
        background: "#f6f9ff",
        height: PAGE_H,
        overflow: "hidden", // ✅ prevent whole page scroll
      }}
    >
      <div className="container h-100 py-4">
        {/* Title */}
        <div className="mb-4">
          <h1 className="fw-bold mb-0" style={{ color: "#0f172a" }}>
            Business Assurance Scoring
          </h1>
        </div>

        {/* Main fixed-height layout */}
        <div className="row g-4" style={{ height: "calc(100% - 70px)" }}>
          {/* LEFT column: controls + gauge */}
          <div className="col-md-5 h-100 d-flex flex-column gap-4">
            {/* Controls card */}
            <div
              className="card shadow-sm rounded-4 p-3"
              style={{ border: "1px solid #e5e7eb" }}
            >
              <div className="row g-3 align-items-center">
                <div className="col-8">
                  <select
                    className="form-select"
                    value={selectedAsset}
                    onChange={(e) => setSelectedAsset(e.target.value)}
                    style={{
                      borderRadius: "14px",
                      padding: "12px 16px",
                      borderColor: "#dbeafe",
                      height: "56px",
                      fontSize: "16px",
                    }}
                  >
                    <option value="" disabled>
                      Select Infrastructure Asset
                    </option>
                    {servers.map((s, i) => (
                      <option key={i} value={s}>
                        {s.length > 22 ? s.slice(0, 22) + "..." : s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-4 d-grid">
                  <button
                    className="btn fw-semibold"
                    style={{
                      background: selectedAsset ? "#2563eb" : "#a7c5ff",
                      color: "white",
                      borderRadius: "14px",
                      height: "56px",
                      fontSize: "16px",
                      border: "none",
                    }}
                    onClick={fetchAssurance}
                    disabled={!selectedAsset || loading}
                  >
                    {loading ? "Loading..." : "Load Assurance"}
                  </button>
                </div>
              </div>
            </div>

            {/* Gauge card (fills remaining height) */}
            <div
              className="card shadow-sm rounded-4 p-4 d-flex flex-column"
              style={{
                border: "1px solid #e5e7eb",
                flex: 1,
                overflow: "hidden", // ✅ CHANGED: prevents left card from extending below right
              }}
            >
              <h4 className="fw-bold text-center mb-3">
                Service Assurance Score
              </h4>

              <div
                className="flex-grow-1 d-flex align-items-center justify-content-center"
                style={{ paddingBottom: 10 }}
              >
                <div
                  style={{
                    position: "relative",
                    width: circleSize,
                    height: circleSize,
                    // ✅ CHANGED: removed translateY
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
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      transform={`rotate(-90 ${circleSize / 2} ${
                        circleSize / 2
                      })`}
                      style={{ transition: "stroke-dashoffset 0.6s ease" }}
                    />
                  </svg>

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      className="fw-bold"
                      style={{ fontSize: 64, color: "#111827" }}
                    >
                      {score}%
                    </div>
                    <div
                      className="fw-bold"
                      style={{ color: gaugeColor, letterSpacing: 1 }}
                    >
                      {statusText}
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ CHANGED: tighter footer spacing so card height matches right */}
              <div
                className="text-center text-muted"
                style={{ fontSize: 13, marginTop: -12 }}
              >
                Adjust sliders to simulate impact.
              </div>
            </div>
          </div>

          {/* RIGHT column: Dependency Simulation (same height as left column) */}
          <div className="col-md-7 h-100">
            <div
              className="card shadow-sm rounded-4 p-4 h-100 d-flex flex-column"
              style={{
                border: "1px solid #e5e7eb",
                overflow: "hidden",
              }}
            >
              <h2
                className="fw-bold mb-2"
                style={{ color: "#0f172a", fontSize: "2.2rem" }}
              >
                Dependency Simulation
              </h2>

              {!selectedAsset && (
                <div className="text-muted mb-3">
                  Select an asset and click <b>Load Assurance</b>
                </div>
              )}

              {/* Scroll area ONLY inside this box */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  paddingRight: 10,
                  paddingBottom: 36, // ✅ ensures last slider never hides
                }}
              >
                {dependencies.map((dep, i) => (
                  <div
                    key={i}
                    className="p-3 mb-3 rounded-4"
                    style={{
                      background: "white",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="fw-bold" style={{ color: "#0f172a" }}>
                        {dep.name}
                      </div>

                      <span
                        className="badge"
                        style={{
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          padding: "8px 10px",
                          borderRadius: 999,
                        }}
                      >
                        C: {Number(dep.criticality).toFixed(1)}
                      </span>
                    </div>

                    {/* Criticality */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Criticality</span>
                        <span className="fw-semibold">
                          {Number(dep.criticality).toFixed(1)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={dep.criticality}
                        onChange={(e) =>
                          updateDependency(i, "criticality", Number(e.target.value))
                        }
                        className="form-range"
                      />
                    </div>

                    {/* Health */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Health</span>
                        <span className="fw-semibold">
                          {Number(dep.health).toFixed(1)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={dep.health}
                        onChange={(e) =>
                          updateDependency(i, "health", Number(e.target.value))
                        }
                        className="form-range"
                      />
                    </div>

                    {/* Redundancy */}
                    <div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Redundancy</span>
                        <span className="fw-semibold">
                          {Number(dep.redundancy).toFixed(1)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={dep.redundancy}
                        onChange={(e) =>
                          updateDependency(i, "redundancy", Number(e.target.value))
                        }
                        className="form-range"
                      />
                    </div>
                  </div>
                ))}

                {selectedAsset && !loading && dependencies.length === 0 && (
                  <div className="text-muted">
                    No dependencies received from backend.
                  </div>
                )}
              </div>

              <div className="text-muted mt-2" style={{ fontSize: 13 }}>
                Scroll inside this box to view all dependencies.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
