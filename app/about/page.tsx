export default function About() {
  return (
    <main className="document agy-shell">
      <a href="/">← BilimAI · к урокам и практике</a>

      <div className="document-card agy-floating-island">
        <span className="eyebrow">О проекте · RU / EN</span>
        <h1>BilimAI — диагностическая подготовка к ЕНТ (ҰБТ) по математике</h1>
        <p>
          <strong>BilimAI</strong> — учебная платформа для абитуриентов и студентов (18+), готовящихся к ЕНТ / ҰБТ по
          математической грамотности и профильной математике на <strong>русском, казахском и узбекском языках</strong>. Вместо
          выдачи готовых ответов платформа учит проверять математический инвариант каждого перехода, находить первый ошибочный шаг
          и переносить правило на новую задачу.
        </p>

        <h2>1. Что входит в платформу</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>10 разделов спецификации ЕНТ (по 3 языка):</strong> линейные уравнения со скобками и переносом, проценты и
            пропорции, классическая вероятность, квадратные уравнения и теорема Виета, арифметическая и геометрическая прогрессии,
            показательные и логарифмические уравнения, тригонометрия, производная и экстремумы, планиметрия, стереометрия.
          </li>
          <li>
            <strong>
              Лаборатория ошибок (<a href="/lab">/lab</a> — по 24 упражнения в каждой теме):
            </strong>{" "}
            ученик анализирует 3 шага готового решения, находит строку, где впервые нарушено правило, изучает корректный переход и
            решает задачу на перенос с интервальным повторением (через 2 и 7 дней).
          </li>
          <li>
            <strong>Помощник разбора и планирования (Claude API):</strong>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>
                <em>Сократический разбор вопроса (<code>POST /api/explain</code>):</em> отвечает строго по правилу и эталонному
                примеру урока и задаёт проверочный вопрос без спойлера ответов.
              </li>
              <li>
                <em>Персональный учебный план (<code>POST /api/roadmap</code>):</em> строит понедельный маршрут подготовки с
                учётом целевого балла ЕНТ, оставшихся недель и прогресса в Лаборатории ошибок.
              </li>
              <li>
                <em>Разбор шага в Лаборатории (<code>POST /api/lab-diagnose</code>):</em> помогает проверить выбранный шаг без
                преждевременного раскрытия правильного ответа.
              </li>
            </ol>
          </li>
        </ul>

        <h2>2. Контакты и исходный код</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Основатель и разработчик:</strong> Нурбек Сайдуалиев (Алматы, Казахстан ·{" "}
            <a href="mailto:nurbek@bilimai.dpdns.org">nurbek@bilimai.dpdns.org</a>)
          </li>
          <li>
            <strong>Адрес платформы:</strong> <a href="https://bilimai.dpdns.org">https://bilimai.dpdns.org</a> (Лаборатория:{" "}
            <a href="/lab">/lab</a>)
          </li>
          <li>
            <strong>Открытый репозиторий и тесты:</strong>{" "}
            <a href="https://github.com/nur667-7/bilimai" target="_blank" rel="noreferrer">
              github.com/nur667-7/bilimai
            </a>
          </li>
        </ul>

        <details className="mt-6">
          <summary className="cursor-pointer font-semibold text-sm py-1">
            Technical Overview for International Reviewers (English)
          </summary>
          <div className="mt-3 space-y-2 text-sm">
            <p>
              <strong>Architecture Summary:</strong> BilimAI is a trilingual (Russian, Kazakh, Uzbek) diagnostic mathematics
              platform built on Next.js and Cloudflare Workers + D1. It pairs deterministic mathematical verification (10 UNT
              modules × 24 parameterized error-analysis scenarios per language) with three schema-validated Anthropic Claude API
              endpoints (<code>/api/explain</code>, <code>/api/roadmap</code>, and <code>/api/lab-diagnose</code>).
            </p>
            <p>
              <strong>Safety &amp; Cost Controls:</strong> All AI endpoints require explicit per-session 18+ and data-transfer
              consent, enforce 4 KiB payload caps, validate inputs and outputs with Zod, and use fail-closed Cloudflare D1 rate
              reservations when live credentials are configured. Responses display a transparent source badge (live Claude API vs.
              deterministic structured preview).
            </p>
          </div>
        </details>
      </div>
    </main>
  );
}
