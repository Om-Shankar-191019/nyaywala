import { useState } from "react";
import heroImg from "./assets/hero.png";
import "./App.css";

const features = [
  {
    icon: "shield",
    title: "Safe execution",
    text: "Run every submission inside a controlled environment with strict time and memory limits.",
  },
  {
    icon: "sliders",
    title: "Rules that adapt",
    text: "Create and update grading rules without changing the evaluator's source code.",
  },
  {
    icon: "sparkles",
    title: "Actionable feedback",
    text: "Show the exact failing input, expected output, and practical ways to improve.",
  },
];

const steps = [
  ["01", "Define your rubric", "Set metrics, weights, thresholds, and test cases for the assignment."],
  ["02", "Submit a program", "Students upload a C submission directly from their workspace."],
  ["03", "Get a clear report", "Nyaywala analyzes the code and returns a reproducible score."],
];

function Icon({ name }) {
  const paths = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    shield: <path d="m12 3 7 3v5c0 4.2-2.9 8-7 10-4.1-2-7-5.8-7-10V6l7-3Zm-3 9 2 2 4-4" />,
    sliders: <><path d="M4 6h16M4 12h16M4 18h16" /><path d="M8 4v4m8-1v4m-5 5v4" /></>,
    sparkles: <><path d="m12 3 1.2 5.8L19 10l-5.8 1.2L12 17l-1.2-5.8L5 10l5.8-1.2L12 3Z" /><path d="m19 16 .5 2.5L22 19l-2.5.5L19 22l-.5-2.5L16 19l2.5-.5L19 16Z" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" /><path d="M4 5.5v16M8 7h8" /></>,
    file: <><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5M9 13h6m-6 4h4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1h-2.4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L8 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6.7v-2.4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L8 8.6l1.7-1.7.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.1h2.4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.7 1.7-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1V14h-.1a1.7 1.7 0 0 0-1.6 1Z" /></>,
    logout: <><path d="M10 17 15 12 10 7m5 5H3" /><path d="M14 4h5v16h-5" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.3" /><path d="m16 16 4 4" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" /></>,
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></>,
  };

  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function AppShell({ onBack }) {
  const [activeItem, setActiveItem] = useState("Overview");
  const navItems = [
    ["Overview", "grid"],
    ["Assignments", "book"],
    ["Submissions", "file"],
    ["Rule sets", "sliders"],
  ];

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="sidebar-top">
          <a className="brand" href="#top" onClick={onBack}>
            <span className="brand-mark">N</span>
            <span>nyaywala</span>
          </a>
          <button className="sidebar-close" type="button" onClick={onBack} aria-label="Back to landing page">×</button>
        </div>
        <div className="workspace-switcher">
          <span className="workspace-avatar">A</span>
          <span><b>Academic workspace</b><small>Instructor</small></span>
          <span className="chevron">⌄</span>
        </div>
        <p className="sidebar-label">Workspace</p>
        <nav className="app-nav" aria-label="Application navigation">
          {navItems.map(([label, icon]) => (
            <button className={activeItem === label ? "active" : ""} key={label} type="button" onClick={() => setActiveItem(label)}>
              <Icon name={icon} /> <span>{label}</span>
              {label === "Submissions" && <em>12</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button type="button"><Icon name="settings" /> <span>Settings</span></button>
          <button type="button" onClick={onBack}><Icon name="logout" /> <span>Back to website</span></button>
        </div>
      </aside>
      <section className="app-main">
        <header className="app-topbar">
          <div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{activeItem}</strong></div>
          <div className="topbar-actions">
            <button className="icon-button" type="button" aria-label="Search"><Icon name="search" /></button>
            <button className="icon-button notification" type="button" aria-label="Notifications"><Icon name="bell" /><i /></button>
            <span className="topbar-divider" />
            <span className="user-avatar">AS</span>
            <span className="user-name">Ananya Sharma</span>
            <span className="chevron">⌄</span>
          </div>
        </header>
        <main className="dashboard-content">
          <div className="dashboard-heading">
            <div><span className="section-kicker">THURSDAY, OCTOBER 16, 2026</span><h1>Good afternoon, Ananya <span>✦</span></h1><p>Here&apos;s what&apos;s happening in your workspace.</p></div>
            <button className="button" type="button"><span className="plus">+</span> New assignment</button>
          </div>
          <div className="stat-grid">
            <article className="stat-card"><div className="stat-icon purple"><Icon name="book" /></div><span>Active assignments</span><strong>08</strong><small className="positive">↑ 2 this month</small></article>
            <article className="stat-card"><div className="stat-icon blue"><Icon name="file" /></div><span>Total submissions</span><strong>248</strong><small className="positive">↑ 18% from last month</small></article>
            <article className="stat-card"><div className="stat-icon green"><Icon name="check" /></div><span>Average score</span><strong>78.4<small>/100</small></strong><small className="positive">↑ 4.2% from last month</small></article>
            <article className="stat-card"><div className="stat-icon orange"><Icon name="clock" /></div><span>Needs review</span><strong>14</strong><small className="warning">Requires your attention</small></article>
          </div>
          <div className="dashboard-grid">
            <section className="panel assignments-panel">
              <div className="panel-heading"><div><h2>Recent assignments</h2><p>Your latest grading activity</p></div><button type="button">View all <Icon name="arrow" /></button></div>
              <div className="assignment-list">
                <div className="assignment-row"><div className="assignment-symbol purple-bg">Σ</div><div><b>Data Structures: Arrays</b><span>32 submissions · Updated 2h ago</span></div><span className="published">Published</span><strong>86.2 <small>avg.</small></strong></div>
                <div className="assignment-row"><div className="assignment-symbol blue-bg">&lt;/&gt;</div><div><b>Introduction to C</b><span>48 submissions · Updated yesterday</span></div><span className="published">Published</span><strong>74.8 <small>avg.</small></strong></div>
                <div className="assignment-row"><div className="assignment-symbol orange-bg">ƒ</div><div><b>Functions and Modularity</b><span>26 submissions · Updated Oct 12</span></div><span className="draft">Draft</span><strong>—</strong></div>
              </div>
            </section>
            <section className="panel quick-panel">
              <div className="panel-heading"><div><h2>Quick start</h2><p>Get your next assignment ready</p></div></div>
              <div className="quick-illustration"><div className="quick-circle"><Icon name="sparkles" /></div></div>
              <p className="quick-copy">Create a rubric, add test cases, and let Nyaywala handle the evaluation.</p>
              <button className="button quick-button" type="button"><span className="plus">+</span> Create assignment</button>
            </section>
          </div>
          <div className="dashboard-note"><Icon name="shield" /><span><b>Your evaluations are sandboxed and secure.</b> Every submission runs with strict limits and produces reproducible results.</span><button type="button">Learn about safety <Icon name="arrow" /></button></div>
        </main>
      </section>
    </div>
  );
}

function App() {
  const [view, setView] = useState("landing");

  if (view === "app") {
    return <AppShell onBack={() => setView("landing")} />;
  }

  return (
    <div className="site-shell">
      <nav className="navbar" aria-label="Main navigation">
        <a className="brand" href="/" aria-label="Nyaywala home">
          <span className="brand-mark">N</span>
          <span>nyaywala</span>
        </a>
        <div className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>
        <div className="nav-actions">
          <a className="login-link" href="#login">Log in</a>
          <button className="button button-small" type="button" onClick={() => setView("app")}>Get started <Icon name="arrow" /></button>
        </div>
      </nav>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><span className="status-dot" /> Intelligent evaluation for C programs</div>
            <h1>Grade code with <span>clarity.</span><br />Teach with confidence.</h1>
            <p className="hero-lede">
              Nyaywala automates the hard parts of code evaluation so instructors can focus on teaching and students can understand exactly how to improve.
            </p>
            <div className="hero-actions">
              <button className="button" type="button" onClick={() => setView("app")}>Start grading <Icon name="arrow" /></button>
              <a className="text-link" href="#how-it-works">See how it works <Icon name="arrow" /></a>
            </div>
            <div className="trust-line"><Icon name="check" /> Reproducible results <span /> <Icon name="check" /> Built for educators</div>
          </div>
          <div className="hero-visual" aria-label="Illustration of the Nyaywala grading engine">
            <div className="glow" />
            <img src={heroImg} alt="" />
            <div className="floating-card card-score"><span className="mini-label">LATEST EVALUATION</span><strong>89.0 <small>/ 100</small></strong><span className="score-up">↑ 12% from last</span></div>
            <div className="floating-card card-safe"><span className="safe-icon"><Icon name="shield" /></span><span><b>Sandbox secured</b><small>Safe execution enabled</small></span></div>
          </div>
        </section>

        <section className="metrics-strip" aria-label="Platform highlights">
          <div><strong>100%</strong><span>reproducible<br />grading</span></div>
          <div><strong>8+</strong><span>specialist<br />analyzers</span></div>
          <div><strong>0</strong><span>manual steps<br />required</span></div>
          <div className="strip-note">A better standard for<br /><em>automated assessment.</em></div>
        </section>

        <section className="content-section" id="features">
          <div className="section-heading"><div><span className="section-kicker">WHY NYAYWALA</span><h2>More than a grade.<br /><span>A path forward.</span></h2></div><p>Every submission deserves feedback that is fair, transparent, and useful. Nyaywala brings consistency to evaluation without losing the human side of teaching.</p></div>
          <div className="feature-grid">
            {features.map((feature) => <article className="feature-card" key={feature.title}><div className="feature-icon"><Icon name={feature.icon} /></div><h3>{feature.title}</h3><p>{feature.text}</p><button type="button" onClick={() => setView("app")}>Learn more <Icon name="arrow" /></button></article>)}
          </div>
        </section>

        <section className="workflow-section" id="how-it-works">
          <div className="section-heading"><div><span className="section-kicker">HOW IT WORKS</span><h2>From submission<br />to <span>understanding.</span></h2></div><p>One simple workflow. Detailed evidence at every step. Designed to make assessment faster for instructors and more meaningful for learners.</p></div>
          <div className="steps-grid">{steps.map(([number, title, text]) => <article className="step" key={number}><span className="step-number">{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        </section>

        <section className="cta-section" id="get-started">
          <div><span className="section-kicker">READY WHEN YOU ARE</span><h2>Make every submission<br /><span>count.</span></h2></div>
          <div><p>Build a fairer, faster feedback loop for your classroom.</p><button className="button button-light" type="button" onClick={() => setView("app")}>Create your first assignment <Icon name="arrow" /></button></div>
        </section>
      </main>

      <footer id="about"><a className="brand" href="/"><span className="brand-mark">N</span><span>nyaywala</span></a><p>Rule-driven evaluation for better learning.</p><span className="copyright">© 2026 Nyaywala</span></footer>
    </div>
  );
}

export default App;
