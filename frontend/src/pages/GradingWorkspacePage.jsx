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

const MAX_SOURCE_LENGTH = 100000;
const MIN_TIMEOUT_MS = 100;
const MAX_TIMEOUT_MS = 60000;
const MIN_MEMORY_MB = 16;
const MAX_MEMORY_MB = 2048;

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
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [problemErrors, setProblemErrors] = useState({});
  const [rulesErrors, setRulesErrors] = useState({});
  const [submissionErrors, setSubmissionErrors] = useState({});

  const totalWeight = useMemo(
    () => rules.correctness + rules.structure + rules.complexity + rules.memorySafety,
    [rules],
  );

  const updateRule = (name, value) => {
    setRules((current) => ({ ...current, [name]: value === "" ? "" : Number(value) }));
  };

  const updateTest = (id, field, value) => {
    setTests((current) => current.map((test) => (test.id === id ? { ...test, [field]: value } : test)));
  };

  const addTest = () => {
    setTests((current) => [...current, { id: Date.now(), input: "", expected: "" }]);
  };

  const removeTest = (id) => {
    setTests((current) => current.filter((test) => test.id !== id));
  };

  const validateProblem = () => {
    const errors = {};
    if (!problem.title.trim()) errors.title = "Enter a problem title.";
    if (!problem.statement.trim()) errors.statement = "Enter a problem statement.";
    if (tests.length === 0) {
      errors.tests = "Add at least one trusted test case.";
    }
    tests.forEach((test, index) => {
      if (!test.input.trim()) errors[`test-${test.id}-input`] = `Enter input for test ${index + 1}.`;
      if (!test.expected.trim()) errors[`test-${test.id}-expected`] = `Enter expected output for test ${index + 1}.`;
    });
    setProblemErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const continueToRules = () => {
    if (validateProblem()) setActiveSection("Rules configuration");
  };

  const validateRules = () => {
    const errors = {};
    const weights = ["correctness", "structure", "complexity", "memorySafety"];
    weights.forEach((name) => {
      if (!Number.isInteger(rules[name]) || rules[name] < 0 || rules[name] > 100) {
        errors[name] = "Enter a whole number from 0 to 100.";
      }
    });
    if (Object.keys(errors).length === 0 && totalWeight !== 100) {
      errors.total = `Metric weights must total 100%. Current total: ${totalWeight}%.`;
    }
    if (!Number.isInteger(rules.timeoutMs) || rules.timeoutMs < MIN_TIMEOUT_MS || rules.timeoutMs > MAX_TIMEOUT_MS) {
      errors.timeoutMs = `Enter a whole number from ${MIN_TIMEOUT_MS} to ${MAX_TIMEOUT_MS} ms.`;
    }
    if (!Number.isInteger(rules.memoryMb) || rules.memoryMb < MIN_MEMORY_MB || rules.memoryMb > MAX_MEMORY_MB) {
      errors.memoryMb = `Enter a whole number from ${MIN_MEMORY_MB} to ${MAX_MEMORY_MB} MB.`;
    }
    setRulesErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSubmission = () => {
    const errors = {};
    if (!filename.trim()) {
      errors.filename = "Choose a C source file.";
    } else if (!filename.toLowerCase().endsWith(".c")) {
      errors.filename = "The submission filename must end with .c.";
    }
    if (!code.trim()) {
      errors.code = "Add C source code before evaluating.";
    } else if (code.length > MAX_SOURCE_LENGTH) {
      errors.code = `Source code must be at most ${MAX_SOURCE_LENGTH.toLocaleString()} characters.`;
    }
    setSubmissionErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEvaluation = () => validateProblem() && validateRules() && validateSubmission();

  const continueToSubmission = () => {
    if (validateRules()) setActiveSection("Code submission");
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const errors = {};
    if (!file.name.toLowerCase().endsWith(".c")) {
      errors.filename = "Choose a file with a .c extension.";
    } else if (file.size > MAX_SOURCE_LENGTH) {
      errors.code = `Source file must be at most ${MAX_SOURCE_LENGTH.toLocaleString()} bytes.`;
    }
    if (Object.keys(errors).length > 0) {
      setSubmissionErrors(errors);
      event.target.value = "";
      return;
    }
    try {
      const source = await file.text();
      setFilename(file.name);
      setCode(source);
      setSubmissionErrors({});
    } catch {
      setSubmissionErrors({ code: `Unable to read ${file.name}. Choose another C source file.` });
    }
  };

  const runEvaluation = async () => {
    if (!validateEvaluation()) {
      setReport({
        score: 0,
        status: "Evaluation blocked",
        testsPassed: 0,
        testsTotal: tests.length,
        message: "Fix the highlighted validation errors before starting the evaluation.",
        compilation: { success: false, diagnostics: "The request was not sent." },
        testResults: [],
      });
      setActiveSection("Grade report");
      return;
    }

    setIsEvaluating(true);
    try {
      const response = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission: { filename, source: code },
          problem: { ...problem, testCases: tests },
          rules: {
            metrics: {
              correctness: rules.correctness,
              codeStructure: rules.structure,
              complexity: rules.complexity,
              memorySafety: rules.memorySafety,
            },
            limits: { timeoutMs: rules.timeoutMs, memoryMb: rules.memoryMb },
          },
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "The grading service rejected the request.");
      }
      setReport({
        score: result.grade ?? 0,
        status: result.status,
        testsPassed: result.testResults.filter((test) => test.passed).length,
        testsTotal: tests.length,
        message: result.feedback,
        compilation: result.compilation,
        testResults: result.testResults,
      });
    } catch (error) {
      setReport({
        score: 0,
        status: "Grading service unavailable",
        testsPassed: 0,
        testsTotal: tests.length,
        message: error.message,
        compilation: { success: false, diagnostics: error.message },
        testResults: [],
      });
    } finally {
      setIsEvaluating(false);
    }
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
            <button className="button" type="button" onClick={runEvaluation} disabled={isEvaluating}>
              <Icon name="sparkles" /> {isEvaluating ? "Compiling..." : "Run evaluation"}
            </button>
          </div>

          {activeSection === "Problem setup" && (
            <section className="workspace-section">
              <div className="section-heading-row"><div><h2>Problem setup</h2><p>Provide the context and trusted data used to judge correctness.</p></div><span className="step-status">1 of 4</span></div>
              <div className="form-card">
                <label>Problem title<input value={problem.title} onChange={(event) => setProblem({ ...problem, title: event.target.value })} />{problemErrors.title && <small className="field-error">{problemErrors.title}</small>}</label>
                <label>Problem statement<textarea rows="4" value={problem.statement} onChange={(event) => setProblem({ ...problem, statement: event.target.value })} />{problemErrors.statement && <small className="field-error">{problemErrors.statement}</small>}</label>
              </div>
              <div className="section-heading-row test-heading"><div><h3>Trusted test cases</h3><p>These inputs and expected outputs are kept separate from the student code.</p></div><button className="outline-button" type="button" onClick={addTest}>+ Add test case</button></div>
              <div className="test-list">
                {tests.map((test, index) => (
                  <div className="test-row" key={test.id}>
                    <span className="test-number">Test {index + 1}</span>
                    <label>Input<textarea rows="2" value={test.input} onChange={(event) => updateTest(test.id, "input", event.target.value)} />{problemErrors[`test-${test.id}-input`] && <small className="field-error">{problemErrors[`test-${test.id}-input`]}</small>}</label>
                    <label>Expected output<textarea rows="2" value={test.expected} onChange={(event) => updateTest(test.id, "expected", event.target.value)} />{problemErrors[`test-${test.id}-expected`] && <small className="field-error">{problemErrors[`test-${test.id}-expected`]}</small>}</label>
                    <button className="remove-test-button" type="button" onClick={() => removeTest(test.id)}>Remove</button>
                  </div>
                ))}
              </div>
              {problemErrors.tests && <p className="validation-message">{problemErrors.tests}</p>}
              <div className="section-actions"><button className="button" type="button" onClick={continueToRules}>Continue to rules <Icon name="arrow" /></button></div>
            </section>
          )}

          {activeSection === "Rules configuration" && (
            <section className="workspace-section">
              <div className="section-heading-row"><div><h2>Rules configuration</h2><p>Edit the rubric without changing evaluator code. Weights must total 100%.</p></div><span className={`weight-total ${totalWeight === 100 ? "valid" : "invalid"}`}>{Number.isFinite(totalWeight) ? totalWeight : "—"}% total</span></div>
              <div className="metric-grid">
                {[
                  ["correctness", "Correctness", "Trusted test results"],
                  ["structure", "Code structure", "Functions, declarations, style"],
                  ["complexity", "Complexity", "Control-flow and nesting"],
                  ["memorySafety", "Memory safety", "Leaks and invalid access"],
                ].map(([name, title, description]) => (
                  <label className="metric-card" key={name}><span className="metric-icon"><Icon name={name === "correctness" ? "check" : name === "memorySafety" ? "shield" : "sliders"} /></span><b>{title}</b><small>{description}</small><span className="number-input"><input type="number" min="0" max="100" step="1" value={rules[name]} onChange={(event) => updateRule(name, event.target.value)} aria-invalid={Boolean(rulesErrors[name])} /><em>%</em></span>{rulesErrors[name] && <small className="field-error">{rulesErrors[name]}</small>}</label>
                ))}
              </div>
              <div className="form-card limits-card"><div><h3>Execution limits</h3><p>Limits will be enforced by the isolated execution worker.</p></div><label>Time limit (ms)<input type="number" min={MIN_TIMEOUT_MS} max={MAX_TIMEOUT_MS} step="1" value={rules.timeoutMs} onChange={(event) => updateRule("timeoutMs", event.target.value)} aria-invalid={Boolean(rulesErrors.timeoutMs)} />{rulesErrors.timeoutMs && <small className="field-error">{rulesErrors.timeoutMs}</small>}</label><label>Memory limit (MB)<input type="number" min={MIN_MEMORY_MB} max={MAX_MEMORY_MB} step="1" value={rules.memoryMb} onChange={(event) => updateRule("memoryMb", event.target.value)} aria-invalid={Boolean(rulesErrors.memoryMb)} />{rulesErrors.memoryMb && <small className="field-error">{rulesErrors.memoryMb}</small>}</label></div>
              {rulesErrors.total && <p className="validation-message">{rulesErrors.total}</p>}
              <div className="section-actions"><button className="button" type="button" onClick={continueToSubmission}>Continue to submission <Icon name="arrow" /></button></div>
            </section>
          )}

          {activeSection === "Code submission" && (
            <section className="workspace-section">
              <div className="section-heading-row"><div><h2>Code submission</h2><p>Upload a C file or edit the sample locally for the first demonstration.</p></div><span className="step-status">3 of 4</span></div>
              <div className="upload-card"><Icon name="file" /><div><b>{filename}</b><span>Only C source files up to {MAX_SOURCE_LENGTH.toLocaleString()} bytes are accepted.</span></div><label className="outline-button">Choose .c file<input type="file" accept=".c,text/x-c" onChange={handleFileChange} /></label></div>
              {submissionErrors.filename && <p className="validation-message">{submissionErrors.filename}</p>}
              <label className="code-label">Source code<textarea className="code-editor" maxLength={MAX_SOURCE_LENGTH} spellCheck="false" value={code} onChange={(event) => { setCode(event.target.value); setSubmissionErrors((current) => ({ ...current, code: undefined })); }} />{submissionErrors.code && <small className="field-error">{submissionErrors.code}</small>}</label>
              <div className="submission-summary"><span><Icon name="check" /> {problem.title}</span><span><Icon name="file" /> {tests.length} test cases</span><span><Icon name="sliders" /> {totalWeight}% configured</span></div>
              <div className="section-actions"><button className="button" type="button" onClick={runEvaluation} disabled={isEvaluating}> {isEvaluating ? "Compiling..." : "Compile and evaluate"} <Icon name="arrow" /></button></div>
            </section>
          )}

          {activeSection === "Grade report" && (
            <section className="workspace-section">
              <div className="section-heading-row"><div><h2>Grade report</h2><p>One place for the score, metric results, and actionable evidence.</p></div><span className="step-status">4 of 4</span></div>
              {!report ? <div className="empty-report"><span className="empty-report-icon"><Icon name="file" /></span><h3>No evaluation yet</h3><p>Submit a program and run the evaluation to generate a report.</p><button className="button" type="button" onClick={() => setActiveSection("Code submission")}>Go to submission <Icon name="arrow" /></button></div> : <div className="report-content"><div className={`report-banner ${report.compilation?.success ? "success" : "error"}`}><span className="report-score">{report.score ?? "—"}<small>{report.score === null ? "" : "/100"}</small></span><div><b>{report.status}</b><p>{report.message}</p></div></div><div className="report-grid"><div className="report-card"><h3>Compilation diagnostics</h3><pre className="diagnostics">{report.compilation?.diagnostics || "No diagnostics returned."}</pre></div><div className="report-card"><h3>Correctness evidence</h3><div className="test-result-summary"><strong>{report.testsPassed}/{report.testsTotal}</strong><span>test cases passed</span></div>{tests.map((test, index) => <div className="result-test" key={test.id}><span className={report.testResults?.[index]?.passed ? "pass-dot" : "pending-dot"}>{report.testResults?.[index]?.passed ? "✓" : "—"}</span><span>Test {index + 1}</span><code>input: {test.input || "(empty)"}</code></div>)}</div></div><div className="reproducibility"><Icon name="check" /><span><b>Compilation record</b><small>Source, rules, and trusted test data were sent together. Runtime execution and analyzer results will be added in the next evaluator milestone.</small></span></div></div>}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default GradingWorkspacePage;
