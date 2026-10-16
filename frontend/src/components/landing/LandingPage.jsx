import heroImg from "../../assets/hero.png";
import Icon from "../common/Icon";
import Brand from "../common/Brand";
import { features, workflowSteps } from "../../data/landing";

function LandingPage({ onGetStarted }) {
  return (
    <div className="site-shell">
      <nav className="navbar" aria-label="Main navigation">
        <Brand />
        <div className="nav-links"><a href="#how-it-works">How it works</a><a href="#features">Features</a><a href="#about">About</a></div>
        <div className="nav-actions"><a className="login-link" href="#login">Log in</a><button className="button button-small" type="button" onClick={onGetStarted}>Get started <Icon name="arrow" /></button></div>
      </nav>
      <main>
        <section className="hero-section">
          <div className="hero-copy"><div className="eyebrow"><span className="status-dot" /> Intelligent evaluation for C programs</div><h1>Grade code with <span>clarity.</span><br />Teach with confidence.</h1><p className="hero-lede">Nyaywala automates the hard parts of code evaluation so instructors can focus on teaching and students can understand exactly how to improve.</p><div className="hero-actions"><button className="button" type="button" onClick={onGetStarted}>Start grading <Icon name="arrow" /></button><a className="text-link" href="#how-it-works">See how it works <Icon name="arrow" /></a></div><div className="trust-line"><Icon name="check" /> Reproducible results <span /> <Icon name="check" /> Built for educators</div></div>
          <div className="hero-visual" aria-label="Illustration of the Nyaywala grading engine"><div className="glow" /><img src={heroImg} alt="" /><div className="floating-card card-score"><span className="mini-label">LATEST EVALUATION</span><strong>89.0 <small>/ 100</small></strong><span className="score-up">↑ 12% from last</span></div><div className="floating-card card-safe"><span className="safe-icon"><Icon name="shield" /></span><span><b>Sandbox secured</b><small>Safe execution enabled</small></span></div></div>
        </section>
        <section className="metrics-strip" aria-label="Platform highlights"><div><strong>100%</strong><span>reproducible<br />grading</span></div><div><strong>8+</strong><span>specialist<br />analyzers</span></div><div><strong>0</strong><span>manual steps<br />required</span></div><div className="strip-note">A better standard for<br /><em>automated assessment.</em></div></section>
        <section className="content-section" id="features"><div className="section-heading"><div><span className="section-kicker">WHY NYAYWALA</span><h2>More than a grade.<br /><span>A path forward.</span></h2></div><p>Every submission deserves feedback that is fair, transparent, and useful. Nyaywala brings consistency to evaluation without losing the human side of teaching.</p></div><div className="feature-grid">{features.map((feature) => <article className="feature-card" key={feature.title}><div className="feature-icon"><Icon name={feature.icon} /></div><h3>{feature.title}</h3><p>{feature.text}</p><button type="button" onClick={onGetStarted}>Learn more <Icon name="arrow" /></button></article>)}</div></section>
        <section className="workflow-section" id="how-it-works"><div className="section-heading"><div><span className="section-kicker">HOW IT WORKS</span><h2>From submission<br />to <span>understanding.</span></h2></div><p>One simple workflow. Detailed evidence at every step. Designed to make assessment faster for instructors and more meaningful for learners.</p></div><div className="steps-grid">{workflowSteps.map(([number, title, text]) => <article className="step" key={number}><span className="step-number">{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>
        <section className="cta-section" id="get-started"><div><span className="section-kicker">READY WHEN YOU ARE</span><h2>Make every submission<br /><span>count.</span></h2></div><div><p>Build a fairer, faster feedback loop for your classroom.</p><button className="button button-light" type="button" onClick={onGetStarted}>Create your first assignment <Icon name="arrow" /></button></div></section>
      </main>
      <footer id="about"><Brand /><p>Rule-driven evaluation for better learning.</p><span className="copyright">© 2026 Nyaywala</span></footer>
    </div>
  );
}

export default LandingPage;
