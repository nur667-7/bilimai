# DESIGN.md — BilimAI Design System (Floating Antigravity + Emil Kowalski Motion + Academic Precision)

## 1. Core Design Philosophy
- **Task-First Hierarchy (No Marketing Clutter Above the Fold):** A learner opening BilimAI on a `390×844` phone or `1280×800` desktop sees and interacts with the active mathematical task on the very first screen (`Y < 260px` on mobile), without scrolling past marketing walls.
- **Floating Antigravity Aesthetic ("Летающий Антигравити"):**
  - Unanchored glassmorphic islands (`rgba(255, 255, 255, 0.84)` + `backdrop-filter: blur(22px) saturate(165%)`) suspended over a deep radial light mesh (`#f4f7fb` with subtle indigo/cyan/emerald ambient orbs).
  - Multi-layered weightless elevation (`--ag-shadow-float`, `--ag-shadow-hover`) with specular top-edge highlights (`inset 0 1px 0 rgba(255, 255, 255, 0.92)`).
  - Floating capsule header (`border-radius: 999px`) detached from the top viewport edge (`top: 12px`) with direct jump links to all core workflows (`Уроки и ЕНТ`, `Тренировка ошибок`, `Claude API`, `О проекте`, `Контакты`).
- **Canonical Website Anatomy:**
  1. **Floating Capsule Navigation (`<header>`):** Brand identity, primary navigation links, and `RU / ҚАЗ / OʻZB` language switcher.
  2. **Interactive Workspace (`<main>`):** 6 deterministic tabs (`Объяснение`, `Практика`, `Пробное ЕНТ`, `Второй мозг`, `Разобрать вопрос`, `Мой план`) + Error-Analysis Laboratory (`/lab`).
  3. **Kinetic Claude API Architecture Showcase (`#claude-engine`):** Animated SVG `stroke-dashoffset` telemetry diagram + 3-engine breakdown (`/api/explain`, `/api/roadmap`, `/api/lab-diagnose`).
  4. **Structured 4-Column Corporate Footer (`#contacts`):** Brand mission & live status badge, platform section links, legal/grant documentation links, and direct contact channels (`nurbek@bilimai.dpdns.org`, Almaty, Kazakhstan).

## 2. Motion Engineering (Emil Kowalski / Linear Principles)
- **Strict Curve Tokens:**
  - `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` for all enter, hover, and tab transitions (`160ms–220ms`).
  - `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` for structural state shifts.
  - `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)` for subtle interactive tactile feedback (`transform: scale(0.98)` on `:active`).
- **No `transition: all`:** Every animated element explicitly declares `transition-property: transform, opacity, box-shadow, background-color, border-color, color`.
- **Reduced Motion Compliance:** Full `@media (prefers-reduced-motion: reduce)` support disabling keyframe loops and transforms when requested by the OS.

## 3. Typography & Mathematical Notation
- **UI Sans:** `-apple-system, BlinkMacSystemFont, "Inter", "Plus Jakarta Sans", "Segoe UI", Roboto, sans-serif` (`text-wrap: balance` on headings, `text-wrap: pretty` on body copy).
- **Mathematical Expressions & Worked Steps:** `"Cambria Math", "STIX Two Math", Georgia, serif` (`19px–24px`, `line-height: 1.45`), high contrast (`#0d1b2a`).
- **Numeric Alignment:** `font-variant-numeric: tabular-nums` on all step numbers, UNT exam scores, timers, and progress counters.

## 4. Deterministic Interactive Primitives & Accessibility (WCAG AA+)
- **Deterministic React 19 Controls (`components/ui/`):** Native button/radio/checkbox/tab state handlers with zero pointer-event gating, ensuring 100% clickability across touch, mouse, keyboard, and automated browser tests.
- **Always-Clickable Primary Actions:** Action buttons (`Проверить ответ`, `Показать подсказку`, `Объяснить проще`, `Проверить шаг`) are never dead-disabled; clicking without a selection surfaces an immediate, helpful inline prompt.
- **Explicit Accessible Names & Focus Rings:** Minimum `40px–44px` touch targets, descriptive `aria-label` attributes, and high-contrast `:focus-visible` outlines (`3px solid #d97706`).
