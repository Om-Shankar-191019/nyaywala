import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import "./App.css";

function App() {
  const [view, setView] = useState("landing");
  return view === "app" ? <DashboardPage onBack={() => setView("landing")} /> : <LandingPage onGetStarted={() => setView("app")} />;
}

export default App;
