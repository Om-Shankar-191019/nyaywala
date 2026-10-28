const MAX_TEST_CASES = 100;
const MAX_FIELD_LENGTH = 100000;

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

function validateGradeRequest(body) {
  const errors = [];
  const submission = body && body.submission;
  const problem = body && body.problem;

  if (!submission || typeof submission.source !== "string" || submission.source.trim().length === 0) {
    errors.push({ field: "submission.source", message: "submission.source must be a non-empty string." });
  } else if (submission.source.length > MAX_FIELD_LENGTH) {
    errors.push({ field: "submission.source", message: `submission.source must be at most ${MAX_FIELD_LENGTH} characters.` });
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

module.exports = {
  GRADE_STATUSES,
  MAX_TEST_CASES,
  MAX_FIELD_LENGTH,
  normalizeRequest,
  validateGradeRequest,
};
