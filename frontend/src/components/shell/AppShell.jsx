import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Dashboard from "./Dashboard";

function AppShell({ onBack }) {
  const [activeItem, setActiveItem] = useState("Overview");
  return <div className="app-shell"><Sidebar activeItem={activeItem} onNavigate={setActiveItem} onBack={onBack} /><section className="app-main"><Topbar activeItem={activeItem} /><Dashboard /></section></div>;
}

export default AppShell;
