import React, { useEffect, useState } from "react";
import { getServers, getImpact } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

export default function BlastRadiusExplorer() {
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState("");
  const [impact, setImpact] = useState([]);

  useEffect(() => {
    getServers().then(setServers);
  }, []);

  const handleCheck = async () => {
    if (!selectedServer) return;
    const data = await getImpact(selectedServer);
    setImpact(data);
  };

  const apps = [...new Set(impact.map(i => i.application))];
  const processes = [...new Set(impact.map(i => i.process))];
  const services = [...new Set(impact.map(i => i.service))];

  return (
    <div className="container-fluid">

    <h2 className="mb-2">Business Impact Explorer</h2>
      <p className="text-muted">
        Select an infrastructure asset to trace its dependencies.
      </p>

      <div className="row g-3">

        {/* Infrastructure */}
        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h5>1 Infrastructure</h5>

            <select
              className="form-select my-2"
              value={selectedServer}
              onChange={e => setSelectedServer(e.target.value)}
            >
              <option value="">Select Server</option>
              {servers.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>

            <button
              className="btn btn-primary"
              onClick={handleCheck}
            >
              Simulate Impact
            </button>
          </div>
        </div>

        {/* Applications */}
        <div className="col-md-3">
          <div className="card p-3 shadow-sm border-danger">
            <h5>2 Applications</h5>
            {apps.map((a, i) => (
              <div key={i} className="alert alert-danger p-2 my-1">
                {a}
              </div>
            ))}
          </div>
        </div>

        {/* Processes */}
        <div className="col-md-3">
          <div className="card p-3 shadow-sm border-primary">
            <h5>3 Processes</h5>
            {processes.map((p, i) => (
              <div key={i} className="alert alert-primary p-2 my-1">
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="col-md-3">
          <div className="card p-3 shadow-sm border-warning">
            <h5>4 Business Services</h5>
            {services.map((s, i) => (
              <div key={i} className="alert alert-warning p-2 my-1">
                {s}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Summary */}
      <div className="row mt-4">

        <div className="col-md-6">
          <div className="card p-3 shadow-sm bg-danger-subtle">
            <h5>Blast Radius Summary</h5>
            <h3>{services.length} Services</h3>
            <p>Potentially impacted by this asset failure.</p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3 shadow-sm bg-warning-subtle">
            <h5>Max Criticality</h5>
            <h3>CRITICAL</h3>
          </div>
        </div>

      </div>

    </div>
  );
}
