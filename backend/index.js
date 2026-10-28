const express = require("express");
const cors = require("cors");
const { execFile } = require("node:child_process");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { promisify } = require("node:util");
const {
  GRADE_STATUSES,
  normalizeRequest,
  validateGradeRequest,
} = require("./contract");

const app = express();
const execFileAsync = promisify(execFile);
const compiler = process.env.C_COMPILER || "gcc";
const compileTimeoutMs = 10000;

app.use(cors());
app.use(express.json({ limit: "256kb" }));

// Root route handler
app.get("/", (req, res) => {
  res.send("Nyaywala Backend Server is Live on Vercel!");
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    message: "Parikshak.ai backend is running with Vite & Tailwind!",
  });
});

app.post("/api/grade", async (req, res) => {
  const validationErrors = validateGradeRequest(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      status: GRADE_STATUSES.VALIDATION_FAILED,
      errors: validationErrors,
    });
  }

  const request = normalizeRequest(req.body);
  const { submission, problem, rules } = request;
  const source = submission.source;
  const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "nyaywala-"));
  const sourcePath = path.join(temporaryDirectory, "submission.c");
  const outputPath = path.join(temporaryDirectory, "submission.out");

  try {
    await fs.writeFile(sourcePath, source, "utf8");

    try {
      await execFileAsync(
        compiler,
        [sourcePath, "-std=c11", "-Wall", "-Wextra", "-pedantic", "-o", outputPath],
        { timeout: compileTimeoutMs, windowsHide: true, maxBuffer: 128 * 1024 },
      );
    } catch (error) {
      if (error.code === "ENOENT") {
        return res.status(503).json({
          success: false,
          error: `C compiler "${compiler}" was not found. Install GCC or set C_COMPILER.`,
        });
      }
      const timedOut = error.code === "ETIMEDOUT";
      const diagnostics = [error.stderr, error.stdout].filter(Boolean).join("\n").trim();

      return res.status(200).json({
        success: true,
        grade: 0,
        status: GRADE_STATUSES.COMPILATION_FAILED,
        compilation: {
          success: false,
          timedOut,
          diagnostics: diagnostics || (timedOut ? "Compilation timed out." : "The compiler did not provide diagnostics."),
        },
        runtime: { status: "Not started" },
        testResults: [],
        metrics: {},
        feedback: timedOut ? "Compilation exceeded the compiler time limit." : "Fix the compiler errors before execution can begin.",
        rules: rules || {},
        reproducibility: { sourceHash: null, testDataHash: null, rulesHash: null, requestHash: null },
      });
    }

    return res.json({
      success: true,
      grade: null,
      status: GRADE_STATUSES.ANALYZER_LIMITATION,
      compilation: {
        success: true,
        diagnostics: "Compilation completed without errors.",
      },
      runtime: { status: "Not started" },
      testResults: [],
      metrics: {},
      feedback: "Compilation succeeded. Runtime execution is not enabled yet.",
      rules: rules || {},
      reproducibility: { sourceHash: null, testDataHash: null, rulesHash: null, requestHash: null },
    });
  } catch (error) {
    console.error("Grading request failed:", error);
    return res.status(500).json({ success: false, error: "Unable to prepare the submission for compilation." });
  } finally {
    await fs.rm(temporaryDirectory, { recursive: true, force: true });
  }
});

// For local testing: run standalone server if not hosted on Vercel
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Backend server running locally on port ${PORT}`);
  });
}

// Crucial for Vercel Serverless deployment
module.exports = app;
