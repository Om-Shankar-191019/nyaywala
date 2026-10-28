const crypto = require("node:crypto");

const MAX_TEST_CASES = 100;
const MAX_SOURCE_LENGTH = 100000;
const MAX_FIELD_LENGTH = 10000;
const MAX_TEST_DATA_LENGTH = 128000;
const MAX_REQUEST_BYTES = 256 * 1024;
const MIN_TIMEOUT_MS = 100;
const MAX_TIMEOUT_MS = 60000;
const MIN_MEMORY_MB = 16;
const MAX_MEMORY_MB = 2048;

const GRADE_STATUSES = Object.freeze({
  VALIDATION_FAILED: "Validation failed",
  COMPILATION_FAILED: "Compilation failed",
  RUNTIME_FAILED: "Runtime failed",
  ANALYZER_LIMITATION: "Analyzer limitation",
  COMPLETED: "Completed evaluation",
});

function normalizeText(value) {
  return value.replace(/\r\n?/g, "\n");
}

function isIntegerInRange(value, minimum, maximum) {
  return Number.isInteger(value) && value >= minimum && value <= maximum;
}

function validateGradeRequest(body) {
  const errors = [];
  const submission = body && body.submission;
  const problem = body && body.problem;
  const rules = body && body.rules;

  if (!submission || typeof submission.source !== "string" || submission.source.trim().length === 0) {
    errors.push({ field: "submission.source", message: "submission.source must be a non-empty string." });
  } else if (submission.source.length > MAX_SOURCE_LENGTH) {
    errors.push({ field: "submission.source", message: `submission.source must be at most ${MAX_SOURCE_LENGTH} characters.` });
  }
  if (submission && submission.filename !== undefined && (typeof submission.filename !== "string" || !submission.filename.toLowerCase().endsWith(".c"))) {
    errors.push({ field: "submission.filename", message: "submission.filename must be a .c filename." });
  }

  if (!problem || !Array.isArray(problem.testCases)) {
    errors.push({ field: "problem.testCases", message: "problem.testCases must be an array." });
  } else {
    if (problem.testCases.length === 0) {
      errors.push({ field: "problem.testCases", message: "At least one test case is required." });
    } else if (problem.testCases.length > MAX_TEST_CASES) {
      errors.push({ field: "problem.testCases", message: `No more than ${MAX_TEST_CASES} test cases are allowed.` });
    }

    problem.testCases.forEach((testCase, index) => {
      if (!testCase || typeof testCase.input !== "string" || typeof testCase.expected !== "string") {
        errors.push({ field: `problem.testCases[${index}]`, message: "Each test case requires input and expected output strings." });
      } else if (testCase.input.length > MAX_FIELD_LENGTH || testCase.expected.length > MAX_FIELD_LENGTH) {
        errors.push({ field: `problem.testCases[${index}]`, message: "Test case fields are too large." });
      }
    });
    const testDataLength = problem.testCases.reduce((total, testCase) => (
      total
      + (typeof testCase?.input === "string" ? testCase.input.length : 0)
      + (typeof testCase?.expected === "string" ? testCase.expected.length : 0)
    ), 0);
    if (testDataLength > MAX_TEST_DATA_LENGTH) {
      errors.push({ field: "problem.testCases", message: `Combined test data must be at most ${MAX_TEST_DATA_LENGTH} characters.` });
    }
  }

  if (!rules || typeof rules !== "object" || Array.isArray(rules)) {
    errors.push({ field: "rules", message: "rules must be an object." });
  } else {
    const metrics = rules.metrics;
    const limits = rules.limits;
    if (!metrics || typeof metrics !== "object") {
      errors.push({ field: "rules.metrics", message: "rules.metrics must be an object." });
    } else {
      const metricNames = ["correctness", "codeStructure", "complexity", "memorySafety"];
      metricNames.forEach((name) => {
        if (!isIntegerInRange(metrics[name], 0, 100)) {
          errors.push({ field: `rules.metrics.${name}`, message: "Metric weights must be whole numbers from 0 to 100." });
        }
      });
      if (metricNames.every((name) => isIntegerInRange(metrics[name], 0, 100))
        && metricNames.reduce((total, name) => total + metrics[name], 0) !== 100) {
        errors.push({ field: "rules.metrics", message: "Metric weights must total exactly 100." });
      }
    }
    if (!limits || typeof limits !== "object") {
      errors.push({ field: "rules.limits", message: "rules.limits must be an object." });
    } else {
      if (!isIntegerInRange(limits.timeoutMs, MIN_TIMEOUT_MS, MAX_TIMEOUT_MS)) {
        errors.push({ field: "rules.limits.timeoutMs", message: `timeoutMs must be a whole number from ${MIN_TIMEOUT_MS} to ${MAX_TIMEOUT_MS}.` });
      }
      if (!isIntegerInRange(limits.memoryMb, MIN_MEMORY_MB, MAX_MEMORY_MB)) {
        errors.push({ field: "rules.limits.memoryMb", message: `memoryMb must be a whole number from ${MIN_MEMORY_MB} to ${MAX_MEMORY_MB}.` });
      }
    }
  }

  return errors;
}

function normalizeRequest(body) {
  return {
    submission: {
      filename: body.submission.filename || "submission.c",
      source: normalizeText(body.submission.source),
    },
    problem: {
      id: body.problem.id || null,
      title: body.problem.title || "",
      statement: body.problem.statement || "",
      testCases: body.problem.testCases.map((testCase) => ({
        input: normalizeText(testCase.input),
        expected: normalizeText(testCase.expected),
      })),
    },
    rules: body.rules || {},
  };
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256(value) {
  return crypto.createHash("sha256").update(typeof value === "string" ? value : stableStringify(value), "utf8").digest("hex");
}

function createReproducibility(normalizedRequest) {
  return {
    sourceHash: sha256(normalizedRequest.submission.source),
    testDataHash: sha256(normalizedRequest.problem.testCases),
    rulesHash: sha256(normalizedRequest.rules),
    requestHash: sha256(normalizedRequest),
  };
}

module.exports = {
  GRADE_STATUSES,
  MAX_TEST_CASES,
  MAX_SOURCE_LENGTH,
  MAX_FIELD_LENGTH,
  MAX_TEST_DATA_LENGTH,
  MAX_REQUEST_BYTES,
  normalizeRequest,
  validateGradeRequest,
  createReproducibility,
};
