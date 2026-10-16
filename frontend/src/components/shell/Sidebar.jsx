import Icon from "../common/Icon";
import Brand from "../common/Brand";

function Sidebar({ activeItem, onNavigate, onBack }) {
  const navItems = [["Overview", "grid"], ["Assignments", "book"], ["Submissions", "file"], ["Rule sets", "sliders"]];
  return <aside className="app-sidebar">
    <div className="sidebar-top"><Brand onClick={onBack} /><button className="sidebar-close" type="button" onClick={onBack} aria-label="Back to landing page">×</button></div>
    <div className="workspace-switcher"><span className="workspace-avatar">A</span><span><b>Academic workspace</b><small>Instructor</small></span><span className="chevron">⌄</span></div>
    <p className="sidebar-label">Workspace</p>
    <nav className="app-nav" aria-label="Application navigation">{navItems.map(([label, icon]) => <button className={activeItem === label ? "active" : ""} key={label} type="button" onClick={() => onNavigate(label)}><Icon name={icon} /> <span>{label}</span>{label === "Submissions" && <em>12</em>}</button>)}</nav>
    <div className="sidebar-bottom"><button type="button"><Icon name="settings" /> <span>Settings</span></button><button type="button" onClick={onBack}><Icon name="logout" /> <span>Back to website</span></button></div>
  </aside>;
}

export default Sidebar;
