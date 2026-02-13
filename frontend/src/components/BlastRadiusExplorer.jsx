import React, { useEffect, useState, useMemo } from "react";
import { getServers, getImpact, getAISummary } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BlastRadiusExplorer.css";

export default function BlastRadiusExplorer() {
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState("");
  const [serverInfo, setServerInfo] = useState(null);
  const [impact, setImpact] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");

  // Static metadata for servers (IP, location, and type)
  const SERVER_METADATA = {
    "Core Banking Cluster": {
      ip: "10.0.1.10",
      location: "London DC",
      type: ["corebanking", "application"]
    },
    "Payments Gateway Node": {
      ip: "10.0.2.21",
      location: "London Edge",
      type: ["network", "application"]
    },
    "Customer Data Platform": {
      ip: "10.0.3.33",
      location: "Cloud - Azure UK South",
      type: ["cloud", "application", "db"]
    },
    "Risk Management Server": {
      ip: "10.0.4.44",
      location: "London DC - Secondary",
      type: ["application", "process"]
    }
  };

  // Load servers from backend
  useEffect(() => {
    getServers()
      .then((data) => {
        setServers(data);
        console.log("Servers loaded from backend:", data);
      })
      .catch(() => setError("Failed to load servers from backend."));
  }, []);

  // Fetch impact data
  const handleCheck = async () => {
    if (!selectedServer) return;

    try {
      setLoading(true);
      setError("");

      const data = await getImpact(selectedServer);

      console.log("Impact data fetched from backend for server", selectedServer, ":", data);

      if (!data || data.length === 0) {
        setImpact([]);
        setError("No impact data found from backend.");
        return;
      }

      setImpact(data);
      // set server info from local mapping (fallback null)
      setServerInfo(SERVER_METADATA[selectedServer] || null);
    } catch (err) {
      setError("Failed to fetch impact from backend.");
    } finally {
      setLoading(false);
    }
  };

  // Extract unique values - memoized to prevent unnecessary re-renders
  const apps = useMemo(
    () => [...new Set(impact.map(i => i.application).filter(Boolean))],
    [impact]
  );
  const processes = useMemo(
    () => [...new Set(impact.map(i => i.process).filter(Boolean))],
    [impact]
  );
  const services = useMemo(
    () => [...new Set(impact.map(i => i.service).filter(Boolean))],
    [impact]
  );

  // All values (including duplicates) — kept for debugging but UI will show unique lists
  const appsAll = impact.map(i => i.application).filter(Boolean);
  const processesAll = impact.map(i => i.process).filter(Boolean);
  const servicesAll = impact.map(i => i.service).filter(Boolean);

  // Debug: log counts to help determine whether data or UI limits items
  useEffect(() => {
    console.log("Unique counts -> apps:", apps.length, "processes:", processes.length, "services:", services.length);
  }, [impact]);

  // Fetch AI summary when impact data changes
  useEffect(() => {
    if (selectedServer && impact.length > 0) {
      console.log("Triggering AI fetch for:", selectedServer, "Apps:", apps, "Processes:", processes);
      setAiLoading(true);
      getAISummary(selectedServer, apps, processes)
        .then(data => {
          console.log("AI Summary received:", data.summary);
          setSummary(data.summary);
          setAiLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch AI summary:", err);
          setSummary("Unable to generate incident summary at this time.");
          setAiLoading(false);
        });
    }
  }, [selectedServer, impact]);

  // Dynamic scaling for bar chart
  const maxValue = Math.max(apps.length, processes.length, services.length, 1);

  // Compute impact level with simple weighted rules
  const computeImpact = () => {
    const a = apps.length;
    const p = processes.length;
    const s = services.length;

    // Score weights: services (4), applications (2), processes (1)
    const score = s * 4 + a * 2 + p * 1;

    if (score >= 20 || (s >= 3 && a >= 4)) {
      return { level: "CRITICAL", color: "danger", reasons: [
        `High service impact (${s} services)`,
        `Multiple applications affected (${a})`,
        `Many processes touched (${p})`
      ] };
    }

    if (score >= 12 || (s === 2 && a >= 4) || (a >= 5)) {
      return { level: "HIGH", color: "warning", reasons: [
        `Multiple services affected (${s})`,
        `Several applications impacted (${a})`,
      ] };
    }

    if (score >= 6 || (a >= 3 && p >= 3)) {
      return { level: "MEDIUM", color: "info", reasons: [
        `Moderate application impact (${a})`,
        `Some processes involved (${p})`,
      ] };
    }

    if (score > 0) {
      return { level: "LOW", color: "secondary", reasons: [`Limited impact: apps=${a}, processes=${p}, services=${s}`] };
    }

    return { level: "SAFE", color: "success", reasons: ["No services impacted"] };
  };

  const impactResult = computeImpact();
  
  const formatSummary = (text) => {
    if (!text) return {};

    // Log full response for debugging
    console.log("Raw AI Response:", text);

    const sections = {
      affected: "",
      impact: "",
      team: "",
      time: "",
      reassurance: ""
    };

    // Split by section headers and capture content after each header
    const affectedMatch = text.match(/Affected Systems[:\s]+([\s\S]*?)(?=Business Impact|$)/i);
    const impactMatch = text.match(/Business Impact[:\s]+([\s\S]*?)(?=Responsible Team|$)/i);
    const teamMatch = text.match(/Responsible Team[:\s]+([\s\S]*?)(?=Estimated Resolution|$)/i);
    const timeMatch = text.match(/Estimated Resolution[:\s]+([\s\S]*?)(?=Reassurance|$)/i);
    const reassuranceMatch = text.match(/Reassurance[:\s]+([\s\S]*?)$/i);

    sections.affected = affectedMatch ? affectedMatch[1].trim() : "Processing...";
    sections.impact = impactMatch ? impactMatch[1].trim() : "Processing...";
    sections.team = teamMatch ? teamMatch[1].trim() : "Processing...";
    sections.time = timeMatch ? timeMatch[1].trim() : "Processing...";
    sections.reassurance = reassuranceMatch ? reassuranceMatch[1].trim() : "Processing...";

    // Log parsed sections for debugging
    console.log("Parsed Sections:", sections);

    return sections;
  };

  const formatted = formatSummary(summary);

  return (
    <div className="container-fluid py-3">
      <h2 className="mb-2">Business Impact Explorer</h2>
      <p className="text-muted">
        Select an infrastructure asset to trace its dependencies.
      </p>

      {/* Loading & Error */}
      {loading && <p className="text-primary">Loading impact data...</p>}
      {error && <p className="text-danger">{error}</p>}

      {/* Debug panel: raw impact data from backend */}
      {/* {impact && impact.length > 0 && (
        <details className="mt-2">
          <summary>Raw impact data ({impact.length} rows) — expand to inspect</summary>
          <pre style={{maxHeight: 200, overflow: 'auto'}}>{JSON.stringify(impact, null, 2)}</pre>
        </details>
      )} */}

      {/* Dependency Boxes */}
      <div className="row g-3 align-items-stretch">
        {/* Infrastructure */}
        <div className="col-md-3">
          <div className="card p-3 shadow-sm h-100">
            <h5>1 Infrastructure</h5>
            <select
              className="form-select my-2"
              value={selectedServer}
              onChange={e => setSelectedServer(e.target.value)}
            >
              <option value="">Select Server</option>
              {servers.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button
              className="btn btn-primary"
              onClick={handleCheck}
            >
              Simulate Impact
            </button>
            {serverInfo && (
              <div className="mt-2">
                <small className="text-muted">IP:</small> <span className="me-2">{serverInfo.ip}</span>
                <br />
                <small className="text-muted">Location:</small> <span className="me-2">{serverInfo.location}</span>
                <br />
                <small className="text-muted">Type:</small>
                {serverInfo.type.map((t, idx) => (
                  <span key={idx} className="badge bg-secondary ms-2 text-white">{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Applications */}
        <div className="col-md-3">
          <div className="card p-3 shadow-sm border-danger h-100">
            <h5>2 Applications</h5>
            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
              {apps.length === 0 && <p className="text-muted">No data</p>}
              {apps.map((a, i) => (
                <div key={i} className="alert alert-danger p-2 my-1">
                  {a}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Processes */}
        <div className="col-md-3">
          <div className="card p-3 shadow-sm border-primary h-100">
            <h5>3 Processes</h5>
            <div className="scrollable-list">
              {processes.length === 0 && <p className="text-muted">No data</p>}
              {processes.map((p, i) => (
                <div key={i} className="alert alert-primary p-2 my-1">
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Business Services */}
        <div className="col-md-3">
          <div className="card p-3 shadow-sm border-warning h-100">
            <h5>4 Business Services</h5>
            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
              {services.length === 0 && <p className="text-muted">No data</p>}
              {services.map((s, i) => (
                <div key={i} className="alert alert-warning p-2 my-1">
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary & Graph */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm h-100">
            <h5 className="fw-bold mb-4">Estimated Impact Severity</h5>

            <div className="graph-container-v">
              <div className="y-axis">
                <span>{maxValue}</span>
                <span>{Math.ceil(maxValue / 2)}</span>
                <span>1</span>
                <span>0</span>
              </div>

              <div className="bars-wrapper border-bottom border-start">
                <div className="bar-column">
                  <div
                    className="bar-v bar-gray"
                    style={{
                      height: `${(apps.length / maxValue) * 100}%`,
                    }}
                  ></div>
                  <small className="mt-2">Applications</small>
                </div>

                <div className="bar-column">
                  <div
                    className="bar-v bar-blue"
                    style={{
                      height: `${(processes.length / maxValue) * 100}%`,
                    }}
                  ></div>
                  <small className="mt-2">Processes</small>
                </div>

                <div className="bar-column">
                  <div
                    className="bar-v bar-red"
                    style={{
                      height: `${(services.length / maxValue) * 100}%`,
                    }}
                  ></div>
                  <small className="mt-2">Biz Services</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="col-md-6 d-flex flex-column gap-3">

          {/* Impacted Services Card */}
          <div
            className="card p-3 shadow-sm border-0"
            style={{ backgroundColor: "#ede9fe" }}
          >
            <h6 className="fw-bold text-uppercase small">Impacted Services</h6>
            <h3 className="fw-bold">{services.length} Services</h3>
            <p className="mb-0">
              Potentially impacted by this asset failure.
            </p>
          </div>

          {/* Impact Level Card */}
          <div
            className="card p-3 shadow-sm border-0"
            style={{ backgroundColor: "#dcfce7" }}
          >
            <h6 className="fw-bold text-uppercase small">Impact Level</h6>
            <h3 className={`fw-bold text-${impactResult.color}`}>
              {impactResult.level}
            </h3>

            <ul className="mb-0 mt-2" style={{ paddingLeft: "1rem" }}>
              {impactResult.reasons.map((r, idx) => (
                <li key={idx} style={{ fontSize: "0.9rem" }}>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="ai-summary-card">

            <div className="ai-summary-header">
              <span className="ai-summary-icon">🤖</span>
              <h5 className="fw-bold mb-0">AI Incident Summary</h5>
              <span className="ai-badge">{aiLoading ? "🔄 Generating..." : "✓ Auto Generated"}</span>
            </div>

            {aiLoading && (
              <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⏳</div>
                <p>Analyzing incident data with AI...</p>
                <p style={{ fontSize: "0.9rem", fontStyle: "italic" }}>This usually takes 5-15 seconds</p>
              </div>
            )}

            {!aiLoading && summary && (
              <>
                <div className="ai-section ai-affected">
                  <strong>🖥 Affected Systems</strong>
                  <p>{formatted.affected || "—"}</p>
                </div>

                <div className="ai-section ai-impact">
                  <strong>⚠ Business Impact</strong>
                  <p>{formatted.impact || "—"}</p>
                </div>

                <div className="ai-section ai-team">
                  <strong>👨‍💻 Responsible Team</strong>
                  <p>{formatted.team || "—"}</p>
                </div>

                <div className="ai-section ai-time">
                  <strong>⏱ Estimated Resolution</strong>
                  <p>{formatted.time || "—"}</p>
                </div>

                <div className="ai-section ai-reassurance">
                  <strong>💬 Reassurance</strong>
                  <p>{formatted.reassurance || "—"}</p>
                </div>
              </>
            )}

            {!aiLoading && !summary && (
              <p style={{ color: "#999", padding: "1rem" }}>Select a server and click "Simulate Impact" to generate an incident summary.</p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}