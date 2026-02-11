import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Impact from "./pages/Impact";
import Overview from "./pages/Overview";
import Live from "./pages/Live";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/live" element={<Live />} />
      </Routes>
    </BrowserRouter>
  );
}
