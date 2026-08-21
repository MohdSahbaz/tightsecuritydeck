import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Workforce from "./pages/Workforce";
import Clients from "./pages/Clients";
import Sites from "./pages/Sites";
import Roster from "./pages/Roster";
import Deployment from "./pages/Deployment";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Billing from "./pages/Billing";
import Procurement from "./pages/Procurement";
import Reports from "./pages/Reports";
import Roles from "./pages/Roles";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workforce" element={<Workforce />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/sites" element={<Sites />} />
        <Route path="/roster" element={<Roster />} />
        <Route path="/deployment" element={<Deployment />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/procurement" element={<Procurement />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
