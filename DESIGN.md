# DESIGN.md — BilimAI Design System (Taste + Impeccable + Academic Utility)

## 1. Core Design Philosophy
- **Task-First Hierarchy (No Marketing Clutter Above the Fold):** A learner opening BilimAI on a `390×844` phone or `1280×800` desktop must see and interact with the active mathematical task on the very first screen (`Y < 260px` on mobile), without scrolling past marketing counters, developer architecture badges, or a 10-item vertical catalog wall.
- **Calm Academic Paper Surface (Zero AI-Slop):**
  - No decorative dot-matrix backgrounds, neon gradients, or competing bordered cards.
  - Background canvas: warm neutral paper (`#f6f7f9`).
  - Primary task surface: crisp white (`#ffffff`) with a single subtle border (`#dde3ee`) and generous internal breathing room.
  - Secondary / diagnostic blocks: quiet slate tint (`#f1f4f9`) with lower visual contrast so they never compete with the equation or step selector.
- **Student Language Over Developer Jargon:**
  - Primary UI uses learner-centered labels: **«Объяснение»**, **«Практика»**, **«Разобрать вопрос»**, **«Мой план»**, **«Тренировка ошибок»**.
  - Technical details for grant reviewers (Claude API schemas, D1 rate-limit architecture, JSON export, commit verification) live in `/about` and a quiet footer link.

## 2. Typography & Mathematical Notation
- **UI Sans:** `-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif`
- **Mathematical Expressions & Worked Steps:** `"Cambria Math", "STIX Two Math", Georgia, serif` (`19px–24px`, `line-height: 1.45`), high contrast (`#0d1b2a`).
- **Numeric Alignment:** `font-variant-numeric: tabular-nums` on all step numbers, scores, and progress counters.

## 3. Touch Targets & Accessibility (WCAG AA+)
- **Interactive Controls:** Minimum `40px–44px` height on mobile for language pills, tabs, topic selector, and step buttons.
- **Explicit Accessible Names:** Every repetition/topic action button includes a descriptive `aria-label` (e.g., `Повторить тему: Квадратные уравнения (Виет)`), never a bare arrow `→`.
- **Keyboard Navigation:** Visible high-contrast focus ring (`3px solid #d97706`, `outline-offset: 2px`) and roving `tablist` support.

## 4. Layout & Viewport Budgets
- **Header (`≤ 56px` height):** Single compact row (`Brand` + `Тренировка ошибок` link + `RU / ҚАЗ / O‘ZB` switcher).
- **Mobile Topic Picker (`< 840px`):** Native `<select>` dropdown paired with a compact progress indicator, keeping the task starting at `Y < 260px` on `390×844` and `320×568` viewports.
- **Empty State Discipline:** Before the learner completes their first task, show a single calm prompt instead of 20 rows of zeros and "Not tried yet" placeholders.
