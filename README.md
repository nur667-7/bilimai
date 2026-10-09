# BilimAI — Trilingual Diagnostic Math & UNT (ҰБТ / ЕНТ) Platform

**Live Platform:** [https://bilimai.dpdns.org](https://bilimai.dpdns.org) · **Error Lab:** [https://bilimai.dpdns.org/lab](https://bilimai.dpdns.org/lab) · **Architecture & Grant Overview:** [https://bilimai.dpdns.org/about](https://bilimai.dpdns.org/about) · **Privacy & 18+ Policy:** [https://bilimai.dpdns.org/privacy](https://bilimai.dpdns.org/privacy) · **Design System:** [DESIGN.md](./DESIGN.md)

**BilimAI** is a diagnostic mathematics learning platform built in Almaty, Kazakhstan for learners and university applicants preparing for the National Unified Testing (**UNT / ҰБТ / ЕНТ**) in **Kazakh (`kk`), Russian (`ru`), and Uzbek (`uz`)**.

Instead of functioning as a generic chat wrapper that gives away final answers, BilimAI combines **official UNT exam simulation**, an **Obsidian-style "Second Brain" prerequisite knowledge graph**, a **720-scenario Error-Analysis Laboratory**, and **three structured Anthropic Claude API engines** wrapped in a **Floating Antigravity** glassmorphic interface.

---

## Core Architecture & Features

### 1. Official UNT (ҰБТ / ЕНТ) Diagnostic Simulator (`lib/unt-exam.ts`, `app/unt-exam-view.tsx`)
Mirrors the official **National Testing Center of the Republic of Kazakhstan (`testcenter.kz`)** specification:
- **Official Blueprint Reference:** Mathematical Literacy (`10 questions / 10 points`) + Profile Mathematics (`40 questions / 50 points`: `25` single-choice × 1 pt, `5` context × 1 pt, `5` matching × 2 pts, `5` multiple-select × 2 pts).
- **Interactive 12-Question Diagnostic Slice (`17 raw points → scaled out of 50`):**
  1. **Single-choice (`1 from 4`, `1 pt`)** — Core algebra, trigonometry, calculus, and geometry items.
  2. **Contextual problem (`1 from 4`, `1 pt`)** — Real-world applied scenarios with shared data tables/plots.
  3. **Matching (`A & B → 1..4`, `2 pts`)** — `2 pts` when both rows match, `1 pt` partial credit for one row, `0 pts` otherwise.
  4. **Multiple-select (`1..3 from 6`, `2 pts`)** — Official NCT RK partial credit (`2 pts` exact set, `1 pt` with a single missing/extra selection, `0 pts` otherwise; capped at 3 selections).
- Automatically updates per-topic mastery and syncs directly into the **Obsidian Knowledge Graph** and **Claude Study Roadmap**.

### 2. Obsidian-Style "Second Brain" Knowledge Graph (`lib/knowledge-graph.ts`, `app/knowledge-graph-view.tsx`)
An interactive SVG Directed Acyclic Graph (DAG) mapping **10 UNT math modules** and **14 mathematical prerequisite edges**:
- **Root-Gap vs. Blocked-Topic Detection:** Distinguishes foundational root gaps (`root_gap`, e.g. failing `linear` or `quadratic`) from downstream topics that are blocked by an unmastered prerequisite (`blocked_gap`, e.g. `functions`, `derivative`, `stereometry`).
- **5 Live Node States:** `mastered` (≥ 75%), `consolidating` (50–74%), `root_gap` (< 50% with ready prerequisites), `blocked_gap` (< 50% with broken prerequisite), and `frontier` (next recommended topic to unlock).
- **Interactive Node Inspector:** Clicking any node highlights upstream prerequisites (`От чего зависит`) and downstream unlocks (`Что открывает`), shows combined UNT + Lab mastery telemetry, and provides 1-click jump buttons to the Lesson, UNT Simulator, or Error Lab.

### 3. Error-Analysis Laboratory (`/lab` — 240 Exercises per Language / 720 Localized Scenarios)
- **24 parameterized variants × 10 UNT modules × 3 languages (`kk`, `ru`, `uz`)** (`lib/error-lab.ts`, `app/lab/error-lab.tsx`).
- Learners inspect a 3-step worked solution, pinpoint the exact step (`1`, `2`, or `3`) where the algebraic or geometric invariant breaks down, study the formal repair, and solve a dynamic transfer problem on a **2/7-day spaced repetition schedule**.
- Strict independent-solve verification (`independent: true` only when `stepMistakes === 0 && hints === 0 && tries === 0 && !usedAi && !revealed`).

### 4. 10 Core UNT Specification Modules (`lib/curriculum.ts`, `lib/lessons.ts`)
30 localized lessons + 90 diagnostic practice items covering the full school curriculum (Grades 5–11):
- `linear` — Linear Equations & Parentheses (`Линейные уравнения со скобками и переносом`)
- `percent` — Percentages, Mixtures & Proportions (`Проценты и изменение цены`)
- `probability` — Combinatorics & Classical Probability (`Классическая вероятность`)
- `quadratic` — Quadratic Equations & Vieta's Theorem (`Квадратные уравнения и теорема Виета`)
- `progressions` — Arithmetic & Geometric Progressions (`Арифметическая и геометрическая прогрессии`)
- `functions` — Exponents & Logarithms (`Показательные и логарифмические уравнения`)
- `trigonometry` — Trigonometric Identities & Reduction (`Основное тригонометрическое тождество`)
- `derivative` — Derivatives, Tangents & Extrema (`Производная полинома и точки экстремума`)
- `planimetry` — Planimetry, Triangles & Circles (`Планиметрия: площадь треугольника и теорема Пифагора`)
- `stereometry` — Stereometry, Pyramids & Prisms (`Стереометрия: объём правильной пирамиды и призмы`)

### 5. Three Structured Anthropic Claude API Pedagogical Workflows (`lib/claude.ts`)
- **`POST /api/explain` (Grounded Socratic Explanations):** Anchors explanations strictly to the active lesson's mathematical rule and worked example, returning schema-validated JSON (`{ explanation, hint }`) without leaking test answers.
- **`POST /api/roadmap` (Personalized UNT Study Roadmap):** Synthesizes the learner's diagnostic error history, UNT Mock Exam gaps, target UNT score (out of 50), and weeks remaining into a structured JSON study plan (`{ summary, priorityModules, weeklyMilestones, dailyHabit }`).
- **`POST /api/lab-diagnose` (Error-Lab Step Diagnosis):** Reconstructs and verifies `makeChallenge(topic, seed, language)` on the server, providing non-spoiler Socratic verification guidance before the broken step is found and exact seed-bound repair analysis afterward.

### 6. Floating Antigravity Design System & Fail-Closed Controls (`DESIGN.md`, `lib/pilot-api.ts`)
- **Floating Antigravity UI (`app/globals.css`, `components/site-footer.tsx`):** Unanchored glassmorphic islands (`backdrop-filter: blur(22px) saturate(165%)`), ambient radial light mesh, Emil Kowalski spring/ease-out motion tokens (`cubic-bezier(0.23, 1, 0.32, 1)`, zero `transition: all`), kinetic SVG `stroke-dashoffset` Claude API pipeline visualization (`#claude-engine`), and a 4-column corporate footer (`#contacts`).
- **Deterministic React 19 Primitives (`components/ui/`):** Zero pointer-gated Radix bugs — every tab, radio option, checkbox, and validation button works reliably across mouse, touch, keyboard, and headless automation.
- **Safety, Rate Limiting & Fail-Closed Live Controls:** Explicit per-session `18+` consent, strict Zod schemas, 4 KiB payload cap, 20s timeout, and atomic Cloudflare D1 quota reservations (`2 calls/min`, `10/day` per user, `50/day` global, `500` pilot cap).

---

## Краткое описание (RU)

**BilimAI** ([https://bilimai.dpdns.org](https://bilimai.dpdns.org)) — трёхъязычная (`RU / ҚАЗ / OʻZB`) образовательная ИИ-платформа диагностики математических пробелов и подготовки к **ЕНТ (ҰБТ)** на базе **Anthropic Claude API**:
- **Пробное ЕНТ (`Пробное ЕНТ`)** — симулятор по спецификации НЦТ РК (`testcenter.kz`): все 4 официальных типа заданий (с 1 ответом за 1 балл, контекстные за 1 балл, соответствие A/B → 1..4 за 2 балла, множественный выбор 1..3 из 6 за 2 балла с частичным оцениванием) и пересчёт в шкалу `0..50`.
- **Граф знаний «Второй мозг» (`Второй мозг`)** — интерактивный направленный граф в стиле **Obsidian Graph View** (10 модулей ЕНТ и 14 пререквизитных связей), который автоматически отделяет **корневые пробелы** в базовых темах от **заблокированных тем** верхнего уровня.
- **Лаборатория ошибок (`/lab`)** — 240 параметризованных сценариев на каждом языке (720 всего): поиск сломанного шага в решении, разбор математического инварианта и задача на перенос с интервальным повторением `2/7 дней`.
- **3 движка Anthropic Claude API (`#claude-engine`)** — `/api/explain`, `/api/roadmap`, `/api/lab-diagnose` со строгой JSON-схемой Zod, защитой от подсказки готового ответа и квотами Cloudflare D1.
- **Дизайн «Летающий Антигравити» (`Floating Antigravity`)** — парящие полупрозрачные капсулы, кинетическая SVG-телеметрия пайплайна Claude API и полноценный корпоративный футер с контактами.

---

## Verification & Local Development

Requires **Node.js 22.13+ (Node 24 recommended)** for native TypeScript test execution and `node:sqlite`.

```bash
# Run unit & mathematical invariant tests (22/22 tests covering 720 Lab scenarios, UNT 4-format grading, Obsidian DAG, Zod schemas, fail-closed API, and D1 quotas)
npm test

# Run TypeScript typecheck
npm run typecheck

# Run ESLint (0 errors, 0 warnings)
npm run lint

# Build production Cloudflare Worker bundle
npm run build
```

---

## Contacts & Founder

- **Founder & Lead Engineer:** Nurbek Saidualiev — Almaty, Republic of Kazakhstan
- **Email (Grants, Partnerships & Pilot Access):** [nurbek@bilimai.dpdns.org](mailto:nurbek@bilimai.dpdns.org)
- **Production URL:** [https://bilimai.dpdns.org](https://bilimai.dpdns.org)
- **GitHub Repository:** [https://github.com/nur667-7/bilimai](https://github.com/nur667-7/bilimai)
