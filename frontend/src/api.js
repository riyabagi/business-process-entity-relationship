import axios from "axios";

const API = "http://localhost:8000/api";

export const getServers = async () => {
  const res = await axios.get(`${API}/servers`);
  return res.data;
};

/**
 * NEW: Unified endpoint for complete impact analysis
 * Returns all metrics in one call instead of multiple API calls
 */
export const simulate = async (server) => {
  const res = await axios.get(`${API}/simulate`, {
    params: { server }
  });
  return res.data;
};

// Legacy endpoints kept for backward compatibility
export const getImpact = async (server) => {
  const res = await axios.get(`${API}/impact/${server}`);
  return res.data;
};

export const getDisturbed = async (server) => {
  const res = await axios.get(`${API}/disturbed-entities/${server}`);
  return res.data;
};

export const getAssurance = async (asset) => {
  const res = await axios.get(`${API}/assurance-score`, {
    params: { asset }
  });
  return res.data;
};

export async function getAISummary(server, applications, processes) {
  const params = new URLSearchParams();
  if (server) params.append("server", server);
  if (applications && applications.length > 0) params.append("applications", applications.join(","));
  if (processes && processes.length > 0) params.append("processes", processes.join(","));
  
  const url = `http://localhost:8000/ai/incident-summary?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch AI summary");
  }

  return res.json();
}

