import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Assurance from "./pages/Assurance";
import Impact from "./pages/Impact";
import Overview from "./pages/Overview";
import Live from "./pages/Live";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/assurance" element={<Assurance />} />
        <Route path="/live" element={<Live />} />
      </Routes>
    </BrowserRouter>
  );
}
