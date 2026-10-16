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
  };

  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function App() {
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
          <a className="button button-small" href="#get-started">Get started <Icon name="arrow" /></a>
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
              <a className="button" href="#get-started">Start grading <Icon name="arrow" /></a>
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
            {features.map((feature) => <article className="feature-card" key={feature.title}><div className="feature-icon"><Icon name={feature.icon} /></div><h3>{feature.title}</h3><p>{feature.text}</p><a href="#get-started">Learn more <Icon name="arrow" /></a></article>)}
          </div>
        </section>

        <section className="workflow-section" id="how-it-works">
          <div className="section-heading"><div><span className="section-kicker">HOW IT WORKS</span><h2>From submission<br />to <span>understanding.</span></h2></div><p>One simple workflow. Detailed evidence at every step. Designed to make assessment faster for instructors and more meaningful for learners.</p></div>
          <div className="steps-grid">{steps.map(([number, title, text]) => <article className="step" key={number}><span className="step-number">{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        </section>

        <section className="cta-section" id="get-started">
          <div><span className="section-kicker">READY WHEN YOU ARE</span><h2>Make every submission<br /><span>count.</span></h2></div>
          <div><p>Build a fairer, faster feedback loop for your classroom.</p><a className="button button-light" href="#top">Create your first assignment <Icon name="arrow" /></a></div>
        </section>
      </main>

      <footer id="about"><a className="brand" href="/"><span className="brand-mark">N</span><span>nyaywala</span></a><p>Rule-driven evaluation for better learning.</p><span className="copyright">© 2026 Nyaywala</span></footer>
    </div>
  );
}

export default App;
