# BilimAI — Trilingual Diagnostic Math & UNT (ҰБТ / ЕНТ) Platform

**Live Platform:** [https://bilimai.dpdns.org](https://bilimai.dpdns.org) · **Error Lab:** [https://bilimai.dpdns.org/lab](https://bilimai.dpdns.org/lab) · **Overview:** [https://bilimai.dpdns.org/about](https://bilimai.dpdns.org/about) · **Design System:** [DESIGN.md](./DESIGN.md)

**BilimAI** is a diagnostic mathematics learning platform built in Almaty, Kazakhstan for adult learners and university applicants preparing for the National Unified Testing (**UNT / ҰБТ / ЕНТ**) in **Kazakh (`kk`), Russian (`ru`), and Uzbek (`uz`)**.

Instead of functioning as a generic chat wrapper that gives away final answers, BilimAI pairs deterministic mathematical verification with **three structured Anthropic Claude API workflows**.

---

## Key Features

1. **10 Core UNT Specification Modules (30 Localized Lessons, 90 Practice Questions + Dynamic Transfer Tasks):**
   - `linear` — Linear Equations (`Линейные уравнения со скобками и переносом`)
   - `percent` — Percentages & Proportions (`Проценты и изменение цены`)
   - `probability` — Classical Probability (`Классическая вероятность`)
   - `quadratic` — Quadratic Equations & Vieta's Theorem (`Квадратные уравнения и теорема Виета`)
   - `progressions` — Arithmetic & Geometric Progressions (`Арифметическая и геометрическая прогрессии`)
   - `functions` — Exponents & Logarithms (`Показательные и логарифмические уравнения`)
   - `trigonometry` — Trigonometric Identities (`Основное тригонометрическое тождество`)
   - `derivative` — Derivatives & Extrema (`Производная полинома и точки экстремума`)
   - `planimetry` — Planimetry & Areas (`Планиметрия: площадь треугольника и теорема Пифагора`)
   - `stereometry` — Stereometry & Volumes (`Стереометрия: объём правильной пирамиды и призмы`)

2. **Error-Analysis Laboratory (`/lab` — 240 Exercises per Language / 720 Localized Scenarios):**
   - 24 parameterized variants × 10 UNT modules × 3 languages.
   - Learners inspect a 3-step worked solution, identify the exact step where the mathematical invariant breaks down, review the algebraic repair, and solve a transfer problem on a **2/7-day spaced review schedule**.
   - Strict independent-solve tracking (`independent: true` only when `stepMistakes === 0 && hints === 0 && tries === 0 && !usedAi && !revealed`).

3. **Three Structured Claude API Pedagogical Workflows (`lib/claude.ts`):**
   - **`POST /api/explain` (Grounded Socratic Explanations):** Anchors explanations strictly to the active lesson's mathematical rule and worked example, returning schema-validated JSON (`{ explanation, hint }`) without leaking test answers.
   - **`POST /api/roadmap` (Personalized UNT Study Roadmap):** Synthesizes the learner's diagnostic error history, target UNT score (out of 50), and weeks remaining into a structured JSON study plan (`{ summary, priorityModules, weeklyMilestones, dailyHabit }`).
   - **`POST /api/lab-diagnose` (Error-Lab Step Diagnosis):** Reconstructs and verifies `makeChallenge(topic, seed, language)` on the server, providing non-spoiler Socratic verification guidance before the broken step is found and exact seed-bound repair analysis afterward.

4. **Safety, Rate Limiting & Fail-Closed Live Controls (`lib/pilot-api.ts`):**
   - Explicit per-session `18+` and data-transfer consent (never pre-checked).
   - Strict Zod input/output schemas, 4 KiB request body limit, 20-second upstream timeout.
   - Fail-closed live safeguard: when `ANTHROPIC_API_KEY` is configured, requires `ANTHROPIC_MODEL`, `DB`, and `QUOTA_HASH_SECRET` and enforces atomic Cloudflare D1 reservations (`2 calls/min`, `10/day` per user, `50/day` global, `500` pilot cap).
   - **Transparent Source & Reason Codes:** Every response includes `source` (`claude` or `preview`) and `reasonCode`.

---

## Verification & Local Development

Requires **Node.js 22.13+ (Node 24 recommended)** for native TypeScript test execution and `node:sqlite`.

```bash
# Run unit & mathematical invariant tests (20 tests covering all 720 Lab scenarios, schemas, fail-closed API, and D1 quotas)
npm test

# Run TypeScript typecheck
npm run typecheck

# Run ESLint (0 errors, 0 warnings)
npm run lint

# Build production Cloudflare Worker bundle
npm run build
```

---

## Founder

- **Nurbek Saidualiev** — Almaty, Kazakhstan (`nurbek@bilimai.dpdns.org`)
