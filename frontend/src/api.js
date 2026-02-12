import axios from "axios";

const API = "http://localhost:8000/api";

export const getServers = async () => {
  const res = await axios.get(`${API}/servers`);
  return res.data;
};

export const getImpact = async (server) => {
  const res = await axios.get(`${API}/impact/${server}`);
  return res.data;
};
