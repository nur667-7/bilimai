export default function About() {
  return (
    <main className="document">
      <a href="/">← BilimAI · к урокам и роадмапу / Back to platform</a>

      <div className="document-card">
        <span className="eyebrow">Technical &amp; Pedagogical Overview · English &amp; Russian</span>
        <h1>BilimAI — Trilingual Diagnostic Math &amp; UNT Prep Platform</h1>
        <p>
          <strong>Executive Summary (for International &amp; Anthropic Reviewers):</strong> BilimAI is a diagnostic mathematics
          learning platform built in Almaty, Kazakhstan for adult learners and university applicants preparing for the National
          Unified Testing (UNT / ҰБТ / ЕНТ) in <strong>Kazakh, Uzbek, and Russian</strong>. Rather than acting as a generic chat
          wrapper that gives away final homework answers, BilimAI combines deterministic mathematical verification with three
          structured <strong>Claude API</strong> pedagogical workflows.
        </p>

        <h2>1. Core Product Architecture</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>10 Core UNT Math Modules (30 lessons, 90 practice questions):</strong> Linear equations, Percentages &amp;
            proportions, Probability &amp; combinatorics, Quadratic equations (Vieta&apos;s theorem), Arithmetic &amp; geometric
            progressions, Exponents &amp; logarithms, Trigonometric identities, Derivatives &amp; extrema, Planimetry, and
            Stereometry.
          </li>
          <li>
            <strong>Error-Analysis Laboratory (<a href="/lab">/lab</a> — 720 localized scenarios):</strong> 24 parameterized
            scenarios per module across 10 UNT modules and 3 languages. Learners inspect a 3-step worked solution, identify the
            exact step where the mathematical invariant breaks down, study the repair, and solve a transfer problem on a 2/7-day
            spaced review schedule.
          </li>
          <li>
            <strong>Three Structured Claude API Workflows:</strong>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>
                <em>Grounded Socratic Explanations (<code>POST /api/explain</code>):</em> Answers learner questions anchored
                strictly to the active lesson&apos;s mathematical rule and worked example, returning schema-validated JSON (
                <code>explanation</code> + <code>hint</code>) without leaking test answers.
              </li>
              <li>
                <em>Personalized UNT Study Roadmap (<code>POST /api/roadmap</code>):</em> Synthesizes the learner&apos;s Error-Lab
                diagnostic history, target UNT score (out of 50), and weeks remaining into a structured JSON study plan (
                <code>priorityModules</code>, <code>weeklyMilestones</code>, and <code>dailyHabit</code>).
              </li>
              <li>
                <em>Error-Lab Step Diagnosis (<code>POST /api/lab-diagnose</code>):</em> Embedded directly inside{" "}
                <a href="/lab">/lab</a>. When a learner selects the wrong step or struggles with a transfer task, Claude explains
                why the broken transition violates the mathematical rule and provides a targeted Socratic micro-hint.
              </li>
            </ol>
          </li>
          <li>
            <strong>Safety, Rate Limiting &amp; Cost Controls:</strong> Strict Zod input/output schemas, 4 KiB request body cap,
            20-second upstream timeout, atomic Cloudflare D1 rate reservations (2 req/min, 10 req/day per user, 50/day global,
            500 pilot cap), and zero retention of raw learner prompts.
          </li>
          <li>
            <strong>Transparent Reviewer Preview Mode:</strong> Every AI response displays an explicit source badge:{" "}
            <code>Claude API · Live</code> when <code>ANTHROPIC_API_KEY</code> is active on the Worker, or{" "}
            <code>Structured Preview</code> when running in pre-grant demonstration mode.
          </li>
        </ul>

        <h2>2. Founder &amp; Repository</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Founder &amp; Lead Engineer:</strong> Nurbek Saidualiev (Almaty, Kazakhstan ·{" "}
            <a href="mailto:nurbek@bilimai.dpdns.org">nurbek@bilimai.dpdns.org</a>)
          </li>
          <li>
            <strong>Live Production URL:</strong>{" "}
            <a href="https://bilimai.dpdns.org">https://bilimai.dpdns.org</a> (Error Lab:{" "}
            <a href="https://bilimai.dpdns.org/lab">/lab</a>)
          </li>
          <li>
            <strong>Source Code &amp; Verification Suite:</strong>{" "}
            <a href="https://github.com/nur667-7/bilimai" target="_blank" rel="noreferrer">
              github.com/nur667-7/bilimai
            </a>
          </li>
          <li>
            <strong>Current Stage:</strong> Deployed technical MVP (bootstrapped, pre-incorporation). Educational efficacy and
            commercial metrics are not claimed prior to running the 60-scenario trilingual evaluation and adult learner pilot.
          </li>
        </ul>

        <hr className="my-6 border-border" />

        <h2>О платформе BilimAI (RU)</h2>
        <p>
          BilimAI — диагностическая платформа подготовки к ЕНТ (ҰБТ) по математике на казахском, русском и узбекском языках.
          Платформа объединяет 10 ключевых разделов спецификации ЕНТ (Математическая грамотность и Профильная математика),
          интерактивную <a href="/lab">Лабораторию ошибок</a> (720 локализованных сценариев) и три контура на базе Claude API:
          сократическое объяснение темы, генератор персонального учебного роадмапа и пошаговую диагностику ошибок в лаборатории.
        </p>
      </div>
    </main>
  );
}
