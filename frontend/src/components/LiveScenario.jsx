// LiveScenario.jsx - Refactored: All business logic moved to backend
import "./LiveScenario.css";
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { simulate, getServers } from "../api";

/* -------------------- TOP STATUS CARDS -------------------- */
function StatusCards({ financialRisk, systemStatus, regImpact }) {
  return (
    <div className="status-grid">
      <div className="status-card">
        <div className="status-label">SYSTEM STATUS</div>
        <div className={`status-value ${systemStatus.toLowerCase()}`}>
          {systemStatus}
        </div>
      </div>

      <div className="status-card">
        <div className="status-label">FINANCIAL RISK / HR</div>
        <div className="status-value">${financialRisk.toFixed(1)}M</div>
      </div>

      <div className="status-card">
        <div className="status-label">REG IMPACT (PRA)</div>
        <div className="status-value">{regImpact}</div>
      </div>
    </div>
  );
}

/* -------------------- IBS SERVICE TABLE -------------------- */
function IBSServiceTable({ affectedServices, isSimulationActive }) {
  return (
    <div className="ibs-card">
      <div className="ibs-title">
        Important Business Services (IBS) Real-Time View
      </div>

      <table className="ibs-table">
        <thead>
          <tr>
            <th>SERVICE NAME</th>
            <th>STATUS</th>
            <th>ASSURANCE SCORE</th>
            <th>ROOT CAUSE</th>
          </tr>
        </thead>

        <tbody>
          {affectedServices.length > 0 ? (
            affectedServices.map((service) => (
              <tr
                key={service.name}
                data-affected={service.affected ? "true" : "false"}
                style={{
                  opacity: service.affected ? 0.8 : 1,
                }}
              >
                <td>{service.name}</td>
                <td className={service.affected ? "status-inactive" : "status-active"}>
                  {service.affected ? "Degraded" : "Active"}
                </td>
                <td>
                  <div className="assurance-bar">
                    <div
                      className="assurance-fill"
                      style={{
                        width: `${service.assuranceScore * 100}%`,
                        background:
                          service.assuranceScore >= 0.8
                            ? 'linear-gradient(90deg, #10b981, #059669)'
                            : service.assuranceScore >= 0.5
                            ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                            : 'linear-gradient(90deg, #ef4444, #dc2626)',
                      }}
                    />
                  </div>
                  {Math.round(service.assuranceScore * 100)}%
                </td>
                <td>{service.rootCause || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", color: "#9ca3af" }}>
                All systems operational
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------- LIVE TIMELINE -------------------- */
function LiveTimeline({
  onTriggerEvent,
  onViewPropagation,
  onCalculateImpact,
  onResetSimulation,
  propagationData,
  isSimulationActive,
  loading,
  failedServer,
}) {
  const timelineEvents = [
    {
      time: "14:00 GMT",
      title: failedServer
        ? `Infrastructure Failure (${failedServer})`
        : "Oracle RAC Node 1 (uk-lon-db-01)",
      text: failedServer ? "Database failure detected" : "Storage Controller Failure.",
      button: "Trigger Event",
      action: onTriggerEvent,
      id: "trigger",
    },
   {
      time: "14:05 GMT",
      title: "Services Detect Failure",
      text: "Applications lose connectivity.",
     /* id: "propagation",
      button: "View Propagation",
      action: onViewPropagation,
      secondary: true,
      id: "propagation",
      disabled: !isSimulationActive,*/
    },
    {
      time: "14:15 GMT",
      title: "Impact Analysis Complete",
      text: "Full cascade impact calculated.",
     /* button: "Calculate Impact",
      action: onCalculateImpact,
      secondary: true,
      last: true,
      id: "impact",
      disabled: !isSimulationActive,*/
    },
  ];

  return (
    <div className="timeline-card">
      <h4 className="timeline-title">
        Scenario: <span>Server Failure Impact Analysis</span>
      </h4>

      <p className="timeline-desc">
        Real-time impact propagation based on Neo4j dependency graph.
        All calculations derived from actual business criticality and redundancy metrics.
      </p>

      <div className="timeline">
        {timelineEvents.map((event) => (
          <TimelineItem
            key={event.id}
            time={event.time}
            title={event.title}
            text={event.text}
            button={event.button}
            /*secondary={event.secondary}
            last={event.last}*/
            onClick={event.action}
            isActive={isSimulationActive}
            isLoading={loading}
            disabled={event.disabled}
          />
        ))}
      </div>

      

      <button
        className="reset-btn"
        onClick={onResetSimulation}
        disabled={!isSimulationActive && (!propagationData || propagationData.length === 0)}
      >
        Reset Simulation
      </button>
    </div>
  );
}

function TimelineItem({
  time,
  title,
  text,
  button,
  secondary,
  last,
  onClick,
  isActive,
  isLoading,
  disabled,
}) {
  return (
    <div className="timeline-item">
      <div className="timeline-left">
        <div className={`timeline-dot ${isActive ? "active" : ""}`} />
        {!last && <div className="timeline-line" />}
      </div>

      <div className="timeline-content">
        <div className="timeline-time">{time}</div>
        <div className="timeline-heading">{title}</div>
        <div className="timeline-text">{text}</div>

         {button && (
        <button
         className={`timeline-btn ${secondary ? "secondary" : ""} ${
          isLoading ? "loading" : ""
          }`}
          onClick={onClick}
          disabled={isLoading || disabled}
          >
           {isLoading ? "Loading..." : button}
            </button>
           )}
      </div>
    </div>
  );
}

/* -------------------- TPS CHART -------------------- */
function TPSChart({ chartData }) {
  return (
    <div className="tps-card">
      <h4 className="tps-title">PAYMENT VOLUME (TPS)</h4>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 140]} />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#dc2626"
            strokeWidth={3}
            fill="rgba(220,38,38,0.1)"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* -------------------- MAIN DASHBOARD -------------------- */
export default function Dashboard() {
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [propagationData, setPropagationData] = useState([]);
  const [affectedServices, setAffectedServices] = useState([]);
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState("uk-lon-db-01");

  const [financialRisk, setFinancialRisk] = useState(0);
  const [systemStatus, setSystemStatus] = useState("OPERATIONAL");
  const [regImpact, setRegImpact] = useState("NONE");
  const [chartData, setChartData] = useState([
    { time: "13:50", value: 120 },
    { time: "13:55", value: 125 },
    { time: "14:00", value: 118 },
    { time: "14:05", value: 122 },
    { time: "14:10", value: 119 },
    { time: "14:15", value: 124 },
  ]);

  // Load available servers on component mount
  useEffect(() => {
    const loadServers = async () => {
      try {
        const data = await getServers();
        // Backend returns array directly, not wrapped in object
        if (Array.isArray(data) && data.length > 0) {
          setServers(data);
          setSelectedServer(data[0]);
        }
      } catch (e) {
        console.error("Failed to load servers:", e);
      }
    };
    loadServers();
  }, []);

  // Trigger event - fetch complete impact analysis from backend
  const handleTriggerEvent = async () => {
    if (isSimulationActive) return;

    setLoading(true);
    try {
      // Single API call returns ALL metrics
      const result = await simulate(selectedServer);

      setIsSimulationActive(true);

      // Update all state from backend response
      setFinancialRisk(result.financialRisk || 0);
      setSystemStatus(result.systemStatus || "CRITICAL");
      setRegImpact(result.regImpact || "MEDIUM");
      setAffectedServices(result.services || []);
      setChartData(result.tpsData || []);
      setPropagationData(result.propagationChain || []);
    } catch (error) {
      console.error("Error triggering event:", error);
      setSystemStatus("CRITICAL");
      setPropagationData([`Error: ${error.message}`]);
    } finally {
      setLoading(false);
    }
  };

  // View propagation - just display the chain from the simulation result
  const handleViewPropagation = () => {
    if (propagationData.length === 0) {
      setPropagationData(["No propagation data available"]);
    }
  };

  // Calculate impact - detailed analysis (already done in trigger)
  const handleCalculateImpact = () => {
    if (financialRisk === 0) {
      setFinancialRisk(0.1);
    }
  };

  // Reset simulation
  const handleResetSimulation = () => {
    setIsSimulationActive(false);
    setPropagationData([]);
    setAffectedServices([]);
    setFinancialRisk(0);
    setSystemStatus("OPERATIONAL");
    setRegImpact("NONE");
    setChartData([
      { time: "13:50", value: 120 },
      { time: "13:55", value: 125 },
      { time: "14:00", value: 118 },
      { time: "14:05", value: 122 },
      { time: "14:10", value: 119 },
      { time: "14:15", value: 124 },
    ]);
  };

  return (
    <div className="dashboard">
      <div className="server-selector" style={{ marginBottom: "20px", padding: "0 20px" }}>
        <label>Select Server to Simulate: </label>
        <select
          value={selectedServer}
          onChange={(e) => setSelectedServer(e.target.value)}
          disabled={isSimulationActive}
          style={{ marginLeft: "10px", padding: "5px 10px", fontSize: "14px" }}
        >
          {servers.map((server) => (
            <option key={server} value={server}>
              {server}
            </option>
          ))}
        </select>
      </div>

      <div className="live-grid">
        {/* LEFT SIDE */}
        <LiveTimeline
          onTriggerEvent={handleTriggerEvent}
          onViewPropagation={handleViewPropagation}
          onCalculateImpact={handleCalculateImpact}
          onResetSimulation={handleResetSimulation}
          propagationData={propagationData}
          isSimulationActive={isSimulationActive}
          loading={loading}
          failedServer={selectedServer}
        />

        {/* RIGHT SIDE */}
        <div className="right-panel">
          {/* TOP STATUS CARDS — MOVED HERE */}
          <StatusCards
            financialRisk={financialRisk}
            systemStatus={systemStatus}
            regImpact={regImpact}
          />

          <IBSServiceTable
            affectedServices={affectedServices}
            isSimulationActive={isSimulationActive}
          />
          <TPSChart chartData={chartData} />
        </div>
      </div>
    </div>
  );
}
