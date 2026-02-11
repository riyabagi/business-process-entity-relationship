import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

/* ---------- Hover Layer Component ---------- */

function LayerCard({ title, subtitle, description, color }) {
  const [hover, setHover] = React.useState(false);

  return (
    <div
      className="mb-3 rounded shadow-sm overflow-hidden"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer" }}
    >
      {/* Header */}
      <div
        className="p-3 d-flex justify-content-between fw-bold"
        style={{ backgroundColor: color }}
      >
        <span>{title}</span>
        <span>{subtitle}</span>
      </div>

      {/* Expandable Info */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          maxHeight: hover ? "100px" : "0px",
          opacity: hover ? 1 : 0,
          padding: hover ? "12px 16px" : "0px 16px",
          transition: "all 0.3s ease",
          overflow: "hidden",
        }}
      >
        <div className="text-muted small">{description}</div>
      </div>
    </div>
  );
}

/* ---------- Main Page ---------- */

export default function BusinessResiliencePage() {
  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#f1f5f9", minHeight: "100vh" }}
    >
      <div className="row g-4">

        {/* LEFT COLUMN */}
        <div className="col-lg-8">

          {/* Challenge Card */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="fw-bold mb-3">
                The Operational Resilience Challenge
              </h2>

              <p className="text-muted">
                In our Business Process Entity Relationship project, we are
                solving the disconnect between IT infrastructure and business
                layers such as applications and processes.
              </p>

              <div
                className="border rounded p-3 mt-3"
                style={{ backgroundColor: "#ede9fe" }}
              >
                <h6 className="fw-bold">PROJECT OBJECTIVE</h6>
                <p className="mb-0">
                  Build an end-to-end mapping model connecting infrastructure
                  → platforms → applications → business processes → services.
                </p>
              </div>
            </div>
          </div>

          {/* Golden Thread Card */}
          <div className="card shadow-sm">
            <div className="card-body">

              <h2 className="fw-bold mb-3">
                The "Golden Thread" Architecture
              </h2>

              <p className="text-muted">
                Mapping dependencies from infrastructure to business services.
              </p>

              <div className="mt-4">

                <LayerCard
                    title="LAYER 6"
                    subtitle="Customer & Revenue Segments"
                    color="#e0f2fe"
                    description="Examples: Wholesale, Retail, Private Banking. Delivers value to end users."
                    />

                    <LayerCard
                    title="LAYER 5"
                    subtitle="Business Services"
                    color="#ede9fe"
                    description="Core services supporting customer operations."
                    />

                    <LayerCard
                    title="LAYER 4"
                    subtitle="Business Processes"
                    color="#dcfce7"
                    description="Operational workflows enabling service delivery."
                    />

                    <LayerCard
                    title="LAYER 3"
                    subtitle="Applications"
                    color="#fef9c3"
                    description="Software systems supporting operations."
                    />

                    <LayerCard
                    title="LAYER 2"
                    subtitle="Platforms & Services"
                    color="#fee2e2"
                    description="Technical platforms hosting applications."
                    />

                    <LayerCard
                    title="LAYER 1"
                    subtitle="Infrastructure"
                    color="#e2e8f0"
                    description="Servers, hardware, and core systems."
                    />

              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="col-lg-4">

          {/* Motivation */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">PROJECT MOTIVATION</h5>

              <p className="text-muted mb-2">
                Organizations struggle to understand how failures impact
                business services.
              </p>

              <p className="text-muted mb-0">
                Our system provides clear relationship mapping for faster
                impact analysis.
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="card shadow-sm">
            <div className="card-body">

              <h5 className="fw-bold mb-3">POC TECH STACK</h5>

              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="badge bg-warning-subtle text-warning p-2">
                  Python FastAPI
                </span>
                <span className="badge bg-secondary-subtle text-secondary p-2">
                  PostgreSQL
                </span>
                <span className="badge bg-success-subtle text-success p-2">
                  Neo4j Graph
                </span>
                <span className="badge bg-primary-subtle text-primary p-2">
                  React + Bootstrap
                </span>
              </div>

              <ul className="text-muted small mb-0">
                <li><strong>Cypher:</strong> Queries Neo4j relationships</li>
                <li><strong>FastAPI:</strong> Backend APIs</li>
                <li><strong>Neo4j:</strong> Graph database</li>
                <li><strong>PostgreSQL:</strong> Structured storage</li>
                <li><strong>React + Bootstrap:</strong> Dashboard UI</li>
              </ul>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
