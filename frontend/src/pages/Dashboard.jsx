import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [servers, setServers] = useState([]);

  useEffect(() => {
    api.get("/servers").then(res => setServers(res.data));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Business Server Panel</h2>
      <div className="row">
        {servers.map(s => (
          <div className="col-md-4" key={s}>
            <div className="card p-3 m-2 shadow">
              {s}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
