// Dashboard.jsx
// Dashboard.jsx
import "./LiveScenario.css";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* -------------------- TOP STATUS CARDS -------------------- */
/* -------------------- TOP STATUS CARDS -------------------- */
function StatusCards() {
  return (
    <div className="status-grid">
      <div className="status-card">
        <div className="status-label">SYSTEM STATUS</div>
        <div className="status-value operational">OPERATIONAL</div>
      </div>

      <div className="status-card">
        <div className="status-label">FINANCIAL RISK / HR</div>
        <div className="status-value">$0M</div>
      </div>

      <div className="status-card">
        <div className="status-label">REG IMPACT (PRA)</div>
        <div className="status-value">NONE</div>
      </div>
    </div>
  );
}


/* -------------------- IBS SERVICE TABLE -------------------- */
function IBSServiceTable() {
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
          {["UK Faster Payments", "CHAPS", "Global Liquidity"].map(service => (
            <tr key={service}>
              <td>{service}</td>
              <td className="status-active">Active</td>
              <td>
                <div className="assurance-bar">
                  <div className="assurance-fill" />
                </div>
                100%
              </td>
              <td>-</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------- LIVE TIMELINE -------------------- */
function LiveTimeline() {
  return (
    <div className="timeline-card">
      <h4 className="timeline-title">
        Scenario: <span>"The Friday Payday Outage"</span>
      </h4>

      <p className="timeline-desc">
        Simulate the propagation of failure from a Database Cluster failure at
        peak volume.
      </p>

      <div className="timeline">
        <TimelineItem
          time="14:00 GMT"
          title="Oracle RAC Node 1 (uk-lon-db-01)"
          text="Storage Controller Failure."
          button="Trigger Event"
        />

        <TimelineItem
          time="14:05 GMT"
          title="Splunk detects ORA-00257"
          text="FCT (Sanctions) App loses connection."
          button="View Propagation"
          secondary
        />

        <TimelineItem
          time="14:15 GMT"
          title="FPS Service Halted"
          text="Dashboard turns Red."
          button="Calculate Impact"
          secondary
          last
        />
      </div>

      <button className="reset-btn">Reset Simulation</button>
    </div>
  );
}

function TimelineItem({ time, title, text, button, secondary, last }) {
  return (
    <div className="timeline-item">
      <div className="timeline-left">
        <div className="timeline-dot" />
        {!last && <div className="timeline-line" />}
      </div>

      <div className="timeline-content">
        <div className="timeline-time">{time}</div>
        <div className="timeline-heading">{title}</div>
        <div className="timeline-text">{text}</div>

        <button className={`timeline-btn ${secondary ? "secondary" : ""}`}>
          {button}
        </button>
      </div>
    </div>
  );
}

/* -------------------- TPS CHART -------------------- */
const tpsData = [
  { time: "13:50", tps: 120 },
  { time: "13:55", tps: 125 },
  { time: "14:00", tps: 118 },
  { time: "14:05", tps: 122 },
  { time: "14:10", tps: 119 },
  { time: "14:15", tps: 124 },
];

function TPSChart() {
  return (
    <div className="tps-card">
      <h4 className="tps-title">PAYMENT VOLUME (TPS)</h4>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={tpsData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 140]} />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="tps"
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
  return (
    <div className="dashboard">
      <div className="live-grid">
        {/* LEFT SIDE */}
        <LiveTimeline />

        {/* RIGHT SIDE */}
        <div className="right-panel">
          {/* TOP STATUS CARDS — MOVED HERE */}
          <StatusCards />

          <IBSServiceTable />
          <TPSChart />
        </div>
      </div>
    </div>
  );
}

