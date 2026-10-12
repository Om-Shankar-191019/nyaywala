# Nyaywala (न्यायवाला) 🚀

> **An Intelligent Rule-Driven Agent for Automated C Program Evaluation & Grading**

Nyaywala is an automated grading agent designed to ingest student C program submissions and instructor-defined rule sets, execute submissions safely under strict time and memory constraints, evaluate various code metrics through specialized analyzers, and output reproducible grades with actionable debugging feedback.

---

## 🏗️ Project Architecture & Tech Stack

This project is structured as a **monorepo** housing both the frontend interface and backend server service together for seamless full-stack deployment on platforms like Vercel.

- **Frontend**: React + Vite + Tailwind CSS (located in `/frontend`)
- **Backend API**: Node.js & Express (located in `/api` as Vercel Serverless Functions)
- **Evaluation Engines**: GCC, Sanitizers (ASan/UBSan), Static Analysis Tools, and Local LLMs (Ollama / Llama 3.3)

---

## 📂 Project Directory Structure

```text
nyaywala/
├── api/
│   └── index.js          # Express backend routes & serverless handler
├── frontend/
│   ├── src/              # React components & UI logic
│   ├── public/           # Static web assets
│   ├── vite.config.js    # Vite bundler & API proxy configuration
│   └── package.json      # Frontend dependencies
├── .gitignore            # Git ignore rules for node_modules, build outputs, etc.
├── package.json          # Root configuration for scripts & backend dependencies
├── vercel.json           # Vercel routing & monorepo build configuration
└── README.md             # Project documentation
```
