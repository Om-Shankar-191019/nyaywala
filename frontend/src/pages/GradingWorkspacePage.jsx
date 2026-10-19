import { useMemo, useState } from "react";
import Brand from "../components/common/Brand";
import Icon from "../components/common/Icon";

const initialRules = {
  correctness: 60,
  structure: 15,
  complexity: 10,
  memorySafety: 15,
  timeoutMs: 2000,
  memoryMb: 128,
};

const initialTests = [
  { id: 1, input: "2 3", expected: "5" },
  { id: 2, input: "10 25", expected: "35" },
];

const sampleCode = `#include <stdio.h>

int main(void) {
    int a, b;
    if (scanf("%d %d", &a, &b) != 2) {
        return 1;
    }
    printf("%d\\n", a + b);
    return 0;
}`;

function GradingWorkspacePage() {
  const [activeSection, setActiveSection] = useState("Problem setup");
  const [problem, setProblem] = useState({
    title: "Sum two integers",
    statement: "Read two integers and print their sum.",
  });
  const [tests, setTests] = useState(initialTests);
  const [rules, setRules] = useState(initialRules);
  const [code, setCode] = useState(sampleCode);
  const [filename, setFilename] = useState("solution.c");
  const [report, setReport] = useState(null);

  const totalWeight = useMemo(
    () => rules.correctness + rules.structure + rules.complexity + rules.memorySafety,
    [rules],
  );

  const updateRule = (name, value) => {
    setRules((current) => ({ ...current, [name]: Number(value) }));
  };

  const updateTest = (id, field, value) => {
    setTests((current) => current.map((test) => (test.id === id ? { ...test, [field]: value } : test)));
  };

  const addTest = () => {
    setTests((current) => [...current, { id: Date.now(), input: "", expected: "" }]);
  };

  const runEvaluation = () => {
    const hasCode = code.trim().length > 0;
    const score = hasCode && totalWeight === 100 ? 94 : 0;
    setReport({
      score,
      status: hasCode && totalWeight === 100 ? "Evaluation complete" : "Evaluation blocked",
      testsPassed: hasCode && totalWeight === 100 ? tests.length : 0,
      testsTotal: tests.length,
      message: !hasCode
        ? "Add a C program before starting the evaluation."
        : totalWeight !== 100
          ? `Metric weights must total 100%. Current total: ${totalWeight}%.`
          : "The demo report is ready. The backend evaluator will provide compiler and runtime evidence next.",
    });
    setActiveSection("Grade report");
  };

  return (
    <div className="grader-shell">
      <header className="grader-header">
        <Brand />
        <div className="grader-header-meta">
          <span className="prototype-badge">Evaluation workspace</span>
          <span className="header-divider" />
          <span className="future-note">Accounts and history can be added later</span>
        </div>
      </header>

      <div className="grader-layout">
        <aside className="grader-sidebar">
          <div className="workspace-label">
            <span className="workspace-avatar">N</span>
            <span><b>Nyaywala AutoGrader</b><small>Local workspace</small></span>
          </div>
          <p className="sidebar-label">Evaluation flow</p>
          <nav className="grader-nav" aria-label="Evaluation sections">
            {["Problem setup", "Rules configuration", "Code submission", "Grade report"].map((section, index) => (
              <button
                className={activeSection === section ? "active" : ""}
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
              >
                <span className="nav-step">{index + 1}</span>
                <span>{section}</span>
                {section === "Grade report" && report && <span className="nav-dot" />}
              </button>
            ))}
          </nav>
          <div className="sidebar-help">
            <Icon name="shield" />
            <b>Sandbox-first grading</b>
            <span>Submissions will run with strict limits when the evaluator is connected.</span>
          </div>
        </aside>

        <main className="grader-main">
          <div className="grader-titlebar">
            <div>
              <span className="section-kicker">FIRST VERSION WORKSPACE</span>
              <h1>Prepare and evaluate a submission.</h1>
              <p>Define the problem, configure the rubric, submit C code, and inspect the evidence.</p>
            </div>
            <button className="button" type="button" onClick={runEvaluation}>
              <Icon name="sparkles" /> Run evaluation
            </button>
          </div>

          {activeSection === "Problem setup" && (
            <section className="workspace-section">
              <div className="section-heading-row"><div><h2>Problem setup</h2><p>Provide the context and trusted data used to judge correctness.</p></div><span className="step-status">1 of 4</span></div>
              <div className="form-card">
                <label>Problem title<input value={problem.title} onChange={(event) => setProblem({ ...problem, title: event.target.value })} /></label>
                <label>Problem statement<textarea rows="4" value={problem.statement} onChange={(event) => setProblem({ ...problem, statement: event.target.value })} /></label>
              </div>
              <div className="section-heading-row test-heading"><div><h3>Trusted test cases</h3><p>These inputs and expected outputs are kept separate from the student code.</p></div><button className="outline-button" type="button" onClick={addTest}>+ Add test case</button></div>
              <div className="test-list">
                {tests.map((test, index) => (
                  <div className="test-row" key={test.id}>
                    <span className="test-number">Test {index + 1}</span>
                    <label>Input<textarea rows="2" value={test.input} onChange={(event) => updateTest(test.id, "input", event.target.value)} /></label>
                    <label>Expected output<textarea rows="2" value={test.expected} onChange={(event) => updateTest(test.id, "expected", event.target.value)} /></label>
                  </div>
                ))}
              </div>
              <div className="section-actions"><button className="button" type="button" onClick={() => setActiveSection("Rules configuration")}>Continue to rules <Icon name="arrow" /></button></div>
            </section>
          )}

          {activeSection === "Rules configuration" && (
            <section className="workspace-section">
              <div className="section-heading-row"><div><h2>Rules configuration</h2><p>Edit the rubric without changing evaluator code. Weights must total 100%.</p></div><span className={`weight-total ${totalWeight === 100 ? "valid" : "invalid"}`}>{totalWeight}% total</span></div>
              <div className="metric-grid">
                {[
                  ["correctness", "Correctness", "Trusted test results"],
                  ["structure", "Code structure", "Functions, declarations, style"],
                  ["complexity", "Complexity", "Control-flow and nesting"],
                  ["memorySafety", "Memory safety", "Leaks and invalid access"],
                ].map(([name, title, description]) => (
                  <label className="metric-card" key={name}><span className="metric-icon"><Icon name={name === "correctness" ? "check" : name === "memorySafety" ? "shield" : "sliders"} /></span><b>{title}</b><small>{description}</small><span className="number-input"><input type="number" min="0" max="100" value={rules[name]} onChange={(event) => updateRule(name, event.target.value)} /><em>%</em></span></label>
                ))}
              </div>
              <div className="form-card limits-card"><div><h3>Execution limits</h3><p>Limits will be enforced by the isolated execution worker.</p></div><label>Time limit (ms)<input type="number" min="100" value={rules.timeoutMs} onChange={(event) => updateRule("timeoutMs", event.target.value)} /></label><label>Memory limit (MB)<input type="number" min="16" value={rules.memoryMb} onChange={(event) => updateRule("memoryMb", event.target.value)} /></label></div>
              {totalWeight !== 100 && <p className="validation-message">Adjust the metric weights before running an evaluation.</p>}
              <div className="section-actions"><button className="button" type="button" onClick={() => setActiveSection("Code submission")}>Continue to submission <Icon name="arrow" /></button></div>
            </section>
          )}

          {activeSection === "Code submission" && (
            <section className="workspace-section">
              <div className="section-heading-row"><div><h2>Code submission</h2><p>Upload a C file or edit the sample locally for the first demonstration.</p></div><span className="step-status">3 of 4</span></div>
              <div className="upload-card"><Icon name="file" /><div><b>{filename}</b><span>Only C source files are accepted for this evaluator.</span></div><label className="outline-button">Choose .c file<input type="file" accept=".c,text/x-c" onChange={(event) => { const file = event.target.files?.[0]; if (file) { setFilename(file.name); file.text().then(setCode); } }} /></label></div>
              <label className="code-label">Source code<textarea className="code-editor" spellCheck="false" value={code} onChange={(event) => setCode(event.target.value)} /></label>
              <div className="submission-summary"><span><Icon name="check" /> {problem.title}</span><span><Icon name="file" /> {tests.length} test cases</span><span><Icon name="sliders" /> {totalWeight}% configured</span></div>
              <div className="section-actions"><button className="button" type="button" onClick={runEvaluation}>Compile and evaluate <Icon name="arrow" /></button></div>
            </section>
          )}

          {activeSection === "Grade report" && (
            <section className="workspace-section">
              <div className="section-heading-row"><div><h2>Grade report</h2><p>One place for the score, metric results, and actionable evidence.</p></div><span className="step-status">4 of 4</span></div>
              {!report ? <div className="empty-report"><span className="empty-report-icon"><Icon name="file" /></span><h3>No evaluation yet</h3><p>Submit a program and run the evaluation to generate a report.</p><button className="button" type="button" onClick={() => setActiveSection("Code submission")}>Go to submission <Icon name="arrow" /></button></div> : <div className="report-content"><div className={`report-banner ${report.score ? "success" : "error"}`}><span className="report-score">{report.score}<small>/100</small></span><div><b>{report.status}</b><p>{report.message}</p></div></div><div className="report-grid"><div className="report-card"><h3>Metric results</h3>{[["Correctness", rules.correctness, report.score ? 100 : 0], ["Code structure", rules.structure, report.score ? 92 : 0], ["Complexity", rules.complexity, report.score ? 88 : 0], ["Memory safety", rules.memorySafety, report.score ? 100 : 0]].map(([name, weight, value]) => <div className="result-row" key={name}><div><b>{name}</b><span>{weight}% weight</span></div><strong>{value}<small>/100</small></strong></div>)}</div><div className="report-card"><h3>Correctness evidence</h3><div className="test-result-summary"><strong>{report.testsPassed}/{report.testsTotal}</strong><span>test cases passed</span></div>{tests.map((test, index) => <div className="result-test" key={test.id}><span className="pass-dot">✓</span><span>Test {index + 1}</span><code>input: {test.input || "(empty)"}</code></div>)}</div></div><div className="reproducibility"><Icon name="check" /><span><b>Reproducible grading record</b><small>Code, rules, and trusted test data are captured together. Backend versioning will add hashes and analyzer versions.</small></span></div></div>}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default GradingWorkspacePage;
