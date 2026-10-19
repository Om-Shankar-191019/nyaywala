# Nyaywala

> A rule-driven evaluator for automated C-program grading.

Nyaywala accepts a C program and instructor-defined grading rules, then produces a reproducible report. The first version intentionally focuses on the grading workflow rather than building a complete college portal.

## First-version scope

The frontend now provides one evaluation workspace with four steps:

1. **Problem setup** - enter the problem statement and trusted input/expected-output test cases.
2. **Rules configuration** - edit analyzer weights and execution limits separately from the student code.
3. **Code submission** - paste C source or upload a `.c` file.
4. **Grade report** - view the overall score, metric results, test evidence, and reproducibility notes.

The four primary grading concepts are kept separate:

```text
Problem data + grading rules + student C code -> evaluation report
```

Authentication, student and instructor accounts, enrollment, assignment deadlines, persistent submission history, and grade-release controls are intentionally deferred to a later version. The component boundaries are ready for those features to be added around the evaluation workspace.

## Mandatory evaluator capabilities

The backend implementation will connect the workspace to these capabilities:

- C compilation with compiler-error reporting
- Safe execution with time, memory, process, and network limits
- Correctness testing against trusted outputs
- Separate correctness, structure, complexity, and memory-safety analyzers
- Configurable weighted scoring
- Specific feedback containing failed inputs and expected versus actual output
- Reproducible grading from the same code, rules, and test data
- Additional analysis such as memory errors and originality flags
- A final metric-by-metric grading report

The current `/api/grade` endpoint is still a placeholder. The frontend uses local state and a demonstration report until the compiler and sandbox worker are connected.

## Technology stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js and Express
- **Planned persistence:** PostgreSQL or file-backed assignment configurations
- **Planned execution:** Judge0 or a dedicated isolated Docker worker
- **Hosting:** Vercel for frontend and API orchestration

> Uploaded programs must never be executed directly inside the Vercel or Express request process. Production grading must use a separate sandboxed worker with strict CPU, memory, process, file, network, and timeout limits.

## Project structure

```text
nyaywala/
├── backend/
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── landing/       # reusable marketing components
│   │   │   └── shell/         # legacy shell components for later reuse
│   │   ├── pages/
│   │   │   ├── GradingWorkspacePage.jsx
│   │   │   └── ...
│   │   ├── App.css
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── vercel.json
└── README.md
```

The grading workspace currently lives in `frontend/src/pages/GradingWorkspacePage.jsx`. Its local sections are deliberately separated so they can later become `ProblemSetup`, `RulesEditor`, `CodeSubmission`, and `GradeReport` components backed by APIs.

## Run locally

### Requirements

- Node.js 18 or newer
- npm
- GCC or another C compiler for the future local evaluator

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite, normally `http://localhost:5173`.

Validation commands:

```powershell
npm run lint
npm run build
```

### Backend

```powershell
cd backend
npm install
npm start
```

The Express server runs on port `5000` by default.

Starter endpoints:

```text
GET  /
GET  /api/health
POST /api/grade
```

The `/api/grade` endpoint currently returns a placeholder response and does not compile or execute source code yet.

## Planned grading request

The eventual grading request should contain the two primary engine inputs and their supporting problem data:

```json
{
  "submission": {
    "filename": "solution.c",
    "source": "#include <stdio.h>..."
  },
  "problem": {
    "id": "sum-two-integers",
    "statement": "Read two integers and print their sum.",
    "testCases": [
      { "input": "2 3\n", "expectedOutput": "5\n" }
    ]
  },
  "rules": {
    "metrics": {
      "correctness": 60,
      "codeStructure": 15,
      "complexity": 10,
      "memorySafety": 15
    },
    "limits": {
      "timeoutMs": 2000,
      "memoryMb": 128
    }
  }
}
```

The final report should include the score, individual analyzer results, compiler/runtime status, failed test cases, expected versus actual output, feedback, and reproducibility metadata such as code/rules/test-data hashes and analyzer versions.

## Roadmap

### Phase 1: Grading workspace

- [x] Problem setup interface
- [x] Trusted test-case editor
- [x] Editable analyzer weights
- [x] Execution-limit controls
- [x] C-file upload and source editor
- [x] Report layout and reproducibility explanation
- [ ] Connect the frontend to `/api/grade`
- [ ] Implement compilation and compiler diagnostics
- [ ] Implement isolated execution
- [ ] Implement correctness and code analyzers
- [ ] Persist sample rules and problem data

### Phase 2: Platform features

- [ ] Assignment and rules persistence
- [ ] Authentication and protected routes
- [ ] Student and instructor roles
- [ ] Submission history
- [ ] Enrollment, deadlines, and grade-release controls

## Assignment deliverables

The project should also include sample grading outputs, a discussion of usefulness and limitations with three to four examples each, a public GitHub repository, an installation guide, and a 15-20 minute demonstration video.
