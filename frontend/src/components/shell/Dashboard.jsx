import Icon from "../common/Icon";

const stats = [
  ["book", "purple", "Active assignments", "08", "↑ 2 this month", "positive"],
  ["file", "blue", "Total submissions", "248", "↑ 18% from last month", "positive"],
  ["check", "green", "Average score", "78.4", "↑ 4.2% from last month", "positive"],
  ["clock", "orange", "Needs review", "14", "Requires your attention", "warning"],
];

const assignments = [
  ["Σ", "purple-bg", "Data Structures: Arrays", "32 submissions · Updated 2h ago", "Published", "published", "86.2"],
  ["</>", "blue-bg", "Introduction to C", "48 submissions · Updated yesterday", "Published", "published", "74.8"],
  ["ƒ", "orange-bg", "Functions and Modularity", "26 submissions · Updated Oct 12", "Draft", "draft", "—"],
];

function Dashboard() {
  return <main className="dashboard-content">
    <div className="dashboard-heading"><div><span className="section-kicker">THURSDAY, OCTOBER 16, 2026</span><h1>Good afternoon, Ananya <span>✦</span></h1><p>Here&apos;s what&apos;s happening in your workspace.</p></div><button className="button" type="button"><span className="plus">+</span> New assignment</button></div>
    <div className="stat-grid">{stats.map(([icon, color, label, value, note, noteClass]) => <article className="stat-card" key={label}><div className={`stat-icon ${color}`}><Icon name={icon} /></div><span>{label}</span><strong>{value}{label === "Average score" && <small>/100</small>}</strong><small className={noteClass}>{note}</small></article>)}</div>
    <div className="dashboard-grid"><section className="panel assignments-panel"><div className="panel-heading"><div><h2>Recent assignments</h2><p>Your latest grading activity</p></div><button type="button">View all <Icon name="arrow" /></button></div><div className="assignment-list">{assignments.map(([symbol, color, title, meta, status, statusClass, score]) => <div className="assignment-row" key={title}><div className={`assignment-symbol ${color}`}>{symbol}</div><div><b>{title}</b><span>{meta}</span></div><span className={statusClass}>{status}</span><strong>{score} <small>{score === "—" ? "" : "avg."}</small></strong></div>)}</div></section><section className="panel quick-panel"><div className="panel-heading"><div><h2>Quick start</h2><p>Get your next assignment ready</p></div></div><div className="quick-illustration"><div className="quick-circle"><Icon name="sparkles" /></div></div><p className="quick-copy">Create a rubric, add test cases, and let Nyaywala handle the evaluation.</p><button className="button quick-button" type="button"><span className="plus">+</span> Create assignment</button></section></div>
    <div className="dashboard-note"><Icon name="shield" /><span><b>Your evaluations are sandboxed and secure.</b> Every submission runs with strict limits and produces reproducible results.</span><button type="button">Learn about safety <Icon name="arrow" /></button></div>
  </main>;
}

export default Dashboard;
