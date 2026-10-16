# Nyaywala

> A rule-driven evaluator for automated C-program grading.

Nyaywala is being built to help instructors evaluate C-program submissions consistently and give students useful, evidence-based feedback. The long-term platform will compile and run submissions safely, apply instructor-defined grading rules, analyze multiple code-quality metrics, and generate reproducible reports.

## Current milestone

The first frontend milestone is complete:

- Responsive Nyaywala landing page
- Product positioning and call-to-action sections
- Feature overview
- Three-step workflow explanation
- Trust and platform metrics
- Responsive mobile layout
- Reusable inline SVG icons
- Existing hero illustration integrated

The grading engine, authentication, dashboard, database, and isolated code-execution worker are planned for subsequent phases.

## Technology stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js and Express
- **Planned database:** PostgreSQL
- **Planned file storage:** Vercel Blob, S3, or Supabase Storage
- **Planned code execution:** Judge0 or a dedicated isolated Docker worker
- **Hosting:** Vercel for the frontend and API orchestration

> Uploaded C programs must not be executed directly inside the Vercel/Express process. Production grading will use a separate sandboxed execution service or worker with strict CPU, memory, process, network, file, and timeout limits.

## Project structure

```text
nyaywala/
├── backend/
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── vercel.json
└── README.md
```

## Run the frontend locally

### Requirements

- Node.js 18 or newer
- npm

### Installation

```powershell
cd frontend
npm install
```

### Development server

```powershell
npm run dev
```

The Vite development server will start at the URL shown in the terminal, normally `http://localhost:5173`.

### Production validation

```powershell
npm run lint
npm run build
npm run preview
```

## Run the backend locally

```powershell
cd backend
npm install
npm start
```

The Express server runs on port `5000` by default. You can change it with the `PORT` environment variable.

Available starter endpoints:

```text
GET  /
GET  /api/health
POST /api/grade
```

The `/api/grade` endpoint is currently a placeholder and does not yet execute or analyze C programs.

## Deployment

The repository includes [vercel.json](./vercel.json) for routing frontend traffic and `/api` traffic to their respective services.

Before deploying:

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Configure the project and environment variables in Vercel.
4. Deploy the `develop` branch for development previews.
5. Promote a tested release to `main` when the project is ready for production.

## Planned product roadmap

### Phase 1: Frontend foundation

- [x] Build the public landing page
- [ ] Add the application shell
- [ ] Add dashboard layouts
- [ ] Add navigation, loading, empty, and error states
- [ ] Add authentication screens

### Phase 2: Assignment and rules

- [ ] Add instructor assignment creation
- [ ] Add editable, versioned JSON rule sets
- [ ] Add test-case management
- [ ] Add role-based access control
- [ ] Add database persistence

### Phase 3: Core grading engine

- [ ] Add C-file upload and SHA-256 hashing
- [ ] Add grading jobs and progress states
- [ ] Add isolated compilation and execution
- [ ] Add time and memory limits
- [ ] Add correctness testing
- [ ] Show failing input, expected output, and actual output

### Phase 4: Specialist analyzers

- [ ] Compiler-warning analyzer
- [ ] Static structure analyzer
- [ ] Modularity analyzer
- [ ] Edge-case analyzer
- [ ] Complexity estimator
- [ ] AddressSanitizer and UndefinedBehaviorSanitizer checks
- [ ] Readability analysis
- [ ] Similarity/originality flags

### Phase 5: Reports and delivery

- [ ] Generate machine-readable JSON reports
- [ ] Generate student-facing reports
- [ ] Add report downloads
- [ ] Add retries and failure handling
- [ ] Add audit logs
- [ ] Add integration and end-to-end tests
- [ ] Document usefulness and limitations

## Reproducible grading goal

Nyaywala is designed around the following contract:

```text
same source + same rules + same tests + same analyzer versions
= same grade
```

Each final report should preserve:

- Submission hash
- Rules snapshot and rules hash
- Test cases used
- Compiler and analyzer versions
- Compiler flags
- Runtime limits
- Raw diagnostics and evidence
- Final weighted score

## Contributing

1. Create a feature branch from `develop`.
2. Make focused changes.
3. Run the frontend lint and build checks.
4. Test the relevant backend behavior.
5. Open a pull request into `develop`.

Example:

```powershell
git checkout develop
git pull origin develop
git checkout -b feature/your-feature
```

## License

This project is currently under development. Add the project license before the first public release.
