<!-- impeccable-schema: product@1 -->
# PRODUCT.md — BilimAI

## Positioning
**BilimAI** (`https://bilimai.dpdns.org`) is a trilingual (`RU` / `ҚАЗ` / `OʻZB`) cognitive diagnostic and UNT (ЕНТ / ҰБТ) preparation platform for Kazakhstan and Central Asia. Unlike generic test banks or direct-answer LLM wrappers, BilimAI diagnoses the exact reasoning step where a student breaks down across all **12 official UNT subjects** (3 mandatory + 9 profile subjects).

## Operating Context
- **Primary Users:** High school students (grades 9–11, ages 14–18) preparing for the Unified National Testing (ЕНТ / ҰБТ) in Russian, Kazakh, or Uzbek.
- **Primary Devices & Environments:** Mobile phones (`375px–414px`) during daily commutes or study breaks, and school/home laptops (`1024px–1440px`) for full 40-question UNT mock exams.
- **Core Workflows:**
  1. **Honest Personalization (`/welcome`):** Select mandatory or profile UNT subjects, language (`RU`/`ҚАЗ`/`OʻZB`), and study goal (`start_basics`, `fix_mistakes`, `prepare_unt`) with immediate persistence across routes.
  2. **Step-by-Step Topic Mastery (`/`):** 10 curriculum topics per subject (`120` lessons total) with worked examples, atomic steps, and `360` practice problems with distractor-specific feedback.
  3. **Productive Failure & Error Diagnosis (`/lab` & Draft X-Ray):** Inspect a 4-step student solution, locate the first broken line, understand the cognitive trap (`sign_flip`, `lost_domain`, `wrong_formula`, `order_of_operations`, `incomplete_case`), and solve a transfer task.
  4. **Authentic UNT Mock Simulation:** Official NCT formats (single-choice 1 pt, context passage 1 pt, matching A/B 2 pts, multiple-select 1–3 of 6 2 pts) feeding into the prerequisite Knowledge Graph and personal Study Plan.
  5. **Socratic AI Tutoring:** Guided Socratic scaffolding backed by a deterministic local pedagogical engine when offline or without API keys.

## Evidence on Hand
- Official NCT RK (testcenter.kz 2025–2026) exam structure across 3 mandatory subjects (`history_kz`, `math_lit`, `reading_lit`) and 9 profile subjects (`math_profile`, `physics`, `informatics`, `chemistry`, `biology`, `geography`, `world_history`, `law`, `english`).
- Live browser audit across Light (`Quiet Paper`) and Dark (`Deep Slate`) themes at `1440×1000`, `1024×768`, `768×1024`, `390×844`, `375×812`, and `320×740`.

## Product Principles
- **Zero Fake Analytics:** Never fabricate mastery scores, streaks, or grant probabilities before the student completes diagnostic tasks. Show explicit `Not evaluated yet` states until real work is recorded.
- **Pedagogical Integrity over Cheating:** Guide the student to discover the broken step rather than dumping ready-made answers.
- **Calm Academic Ergonomics:** High-contrast, distraction-free reading and problem-solving in both Light and Dark themes with zero horizontal overflow on mobile.
