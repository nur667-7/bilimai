# BilimAI — Trilingual Diagnostic Math & UNT (ҰБТ / ЕНТ) Platform

**BilimAI** is a diagnostic mathematics learning platform built in Almaty, Kazakhstan for adult learners and university applicants preparing for the National Unified Testing (**UNT / ҰБТ / ЕНТ**) in **Kazakh (`kk`), Russian (`ru`), and Uzbek (`uz`)**.

Instead of functioning as a generic chat wrapper that gives away final answers, BilimAI pairs deterministic mathematical verification with **three structured Anthropic Claude API workflows**.

---

## Key Features

1. **10 Core UNT Specification Modules (30 Localized Lessons, 90 Practice Questions):**
   - `linear` — Linear Equations (Линейные уравнения / Сызықтық теңдеулер / Chiziqli tenglamalar)
   - `percent` — Percentages & Proportions (Проценты и пропорции / Пайыздар / Foizlar)
   - `probability` — Probability & Combinatorics (Вероятность / Ықтималдық / Ehtimollik)
   - `quadratic` — Quadratic Equations & Vieta's Theorem (Квадратные уравнения / Виет теоремасы / Viyet)
   - `progressions` — Arithmetic & Geometric Progressions (Прогрессии / Прогрессиялар / Progressiyalar)
   - `functions` — Exponents & Logarithms (Степени и логарифмы / Логарифмдер / Logarifmlar)
   - `trigonometry` — Trigonometric Identities (Тригонометрия / Тригонометрия / Trigonometriya)
   - `derivative` — Derivatives & Extrema (Производная и экстремумы / Туынды / Hosila)
   - `planimetry` — Planimetry & Areas (Планиметрия / Планиметрия / Planimetriya)
   - `stereometry` — Stereometry & Volumes (Стереометрия / Стереометрия / Stereometriya)

2. **Error-Analysis Laboratory (`/lab` — 720 Localized Scenarios):**
   - 24 parameterized variants × 10 UNT modules × 3 languages.
   - Learners inspect a 3-step worked solution, identify the exact step where the mathematical invariant breaks down, review the algebraic repair, and solve a transfer problem on a **2/7-day spaced review schedule**.

3. **Three Structured Claude API Pedagogical Workflows (`lib/claude.ts`):**
   - **`POST /api/explain` (Grounded Socratic Explanations):** Anchors explanations strictly to the active lesson's mathematical rule and worked example, returning schema-validated JSON (`{ explanation, hint }`) without leaking test answers.
   - **`POST /api/roadmap` (Personalized UNT Study Roadmap):** Synthesizes the learner's diagnostic error history, target UNT score (out of 50), and weeks remaining into a structured JSON study plan (`{ summary, priorityModules, weeklyMilestones, dailyHabit }`).
   - **`POST /api/lab-diagnose` (Error-Lab Step Diagnosis):** Embedded directly inside `/lab`. Analyzes why a learner's chosen step or calculation went off track and provides a targeted Socratic micro-hint.

4. **Safety, Rate Limiting & Transparent Preview Mode:**
   - Strict Zod input/output schemas, 4 KiB request body limit, 20-second upstream timeout.
   - Atomic Cloudflare D1 reservations (`2 calls/min`, `10/day` per user, `50/day` global, `500` pilot cap).
   - **Transparent Reviewer Preview:** Every AI response displays an explicit source badge (`Claude API · Live` when `ANTHROPIC_API_KEY` is configured on the Worker, or `Structured Preview` when running in pre-grant demonstration mode).

---

## Verification & Local Development

Requires **Node.js 22.13+ (Node 24 recommended)** for native TypeScript test execution and `node:sqlite`.

```bash
# Run unit & integration tests (14 tests across Claude schemas, D1 quotas, 10 UNT modules, and 720 Lab scenarios)
node --test tests/core.test.mjs tests/lab.test.mjs

# Run TypeScript typecheck
node node_modules/typescript/bin/tsc --noEmit

# Build production Cloudflare Worker bundle
node scripts/run-framework.mjs build
```

---

## Founder

- **Nurbek Saidualiev** — Almaty, Kazakhstan
