const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

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

// Grading evaluation endpoint placeholder
app.post("/api/grade", (req, res) => {
  const { submissionCode, rules } = req.body;
  res.json({
    success: true,
    grade: 89.0,
    feedback: "Evaluation executed successfully.",
  });
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
