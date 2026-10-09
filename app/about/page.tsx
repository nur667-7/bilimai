export default function About() {
  return (
    <main className="document textbook-shell">
      <a href="/">← BilimAI · к занятиям и практике</a>

      <div className="document-card">
        <span className="eyebrow">О стартапе и архитектуре · RU / EN</span>
        <h1>BilimAI — нейро-символьная платформа подготовки к ЕНТ (ҰБТ) по математике</h1>
        <p>
          <strong>BilimAI</strong> — образовательный EdTech-стартап для школьников 9–11 классов и абитуриентов Казахстана и
          Центральной Азии, готовящихся к ЕНТ / ҰБТ по математической грамотности и профильной математике на{" "}
          <strong>русском, казахском и узбекском языках</strong>. Вместо выдачи готовых ответов платформа объединяет строгую
          математическую верификацию с сократическим ИИ-тьютором на базе <strong>Anthropic Claude API</strong>.
        </p>

        <h2>1. Какую проблему решает BilimAI</h2>
        <p>
          Ежегодно более <strong>180 000 выпускников в Казахстане</strong> (и свыше 1,2 млн абитуриентов в регионе ЦА) сдают
          государственное тестирование по математике. При подготовке школьники сталкиваются с двумя крайностями:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Статические сборники и видеоразборы</strong> дают заученный алгоритм, но не видят, на каком именно переходе
            ученик теряет знак, ОДЗ или множитель.
          </li>
          <li>
            <strong>Обычные чат-боты (ГДЗ)</strong> сразу выдают готовый ответ или допускают арифметические галлюцинации, из-за
            чего на реальном экзамене с новыми числами ученик не может воспроизвести решение.
          </li>
        </ul>

        <h2>2. Полный охват спецификации ЕНТ (16 разделов НЦТ РК)</h2>
        <p>
          Учебная программа BilimAI покрывает все <strong>16 фундаментальных разделов</strong> спецификации Национального центра
          тестирования РК (5–11 классы) на трёх языках (<code>ru</code>, <code>kk</code>, <code>uz</code>):
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>
            <strong>Линейные уравнения</strong> (раскрытие скобок, перенос слагаемых)
          </li>
          <li>
            <strong>Неравенства и метод интервалов</strong> (смена знака при делении на отрицательное число)
          </li>
          <li>
            <strong>Системы уравнений</strong> (метод подстановки и алгебраического сложения)
          </li>
          <li>
            <strong>Проценты, пропорции и текстовые задачи</strong> (динамика изменения базы процента)
          </li>
          <li>
            <strong>Классическая вероятность и статистика</strong> (отношение благоприятных исходов ко всем равновозможным)
          </li>
          <li>
            <strong>Комбинаторика и логика</strong> (перестановки, размещения, сочетания)
          </li>
          <li>
            <strong>Степени, корни и радикалы</strong> (свойства показателей и арифметического корня)
          </li>
          <li>
            <strong>Квадратные уравнения и теорема Виета</strong> (дискриминант, сумма и произведение корней)
          </li>
          <li>
            <strong>Арифметическая и геометрическая прогрессии</strong> ($n$-й член и сумма первых $n$ членов)
          </li>
          <li>
            <strong>Показательные и логарифмические уравнения</strong> (приведение к общему основанию и проверка ОДЗ)
          </li>
          <li>
            <strong>Тригонометрические тождества и уравнения</strong> (основное тождество, формулы двойного угла и приведения)
          </li>
          <li>
            <strong>Производная и точки экстремума</strong> (касательная, критические точки и смена знака $f&apos;(x)$)
          </li>
          <li>
            <strong>Первообразная и определённый интеграл</strong> (формула Ньютона — Лейбница и площадь криволинейной трапеции)
          </li>
          <li>
            <strong>Планиметрия</strong> (треугольники, окружности, четырёхугольники и площади фигур)
          </li>
          <li>
            <strong>Векторы и метод координат</strong> (длина вектора, скалярное произведение, угол между векторами)
          </li>
          <li>
            <strong>Стереометрия</strong> (объёмы и площади поверхностей призмы, пирамиды, цилиндра, конуса и шара)
          </li>
        </ol>

        <h2>3. Зачем в BilimAI необходим Claude API (Нейро-символьная архитектура)</h2>
        <p>
          Детерминированный движок BilimAI (<code>16 тем × 24 генератора × 3 языка = 1 152 сценария</code>) гарантирует 100%
          точность формул и эталонных ответов, однако только <strong>Claude API</strong> закрывает три задачи живого
          преподавателя, которые невозможно решить статическими правилами:
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>Сократический разбор открытых вопросов и неверных ответов (<code>POST /api/explain</code>):</strong> ученик
            спрашивает своими словами на русском, казахском или узбекском (или нажимает «Разобрать с ИИ-тьютором» после ошибки в
            практике). Claude получает в системном контексте эталонный инвариант урока, объясняет природу заблуждения и задаёт
            проверочный вопрос на понимание без раскрытия готового ответа.
          </li>
          <li>
            <strong>Пошаговая диагностика инварианта в Тренировке ошибок (<code>POST /api/lab-diagnose</code>):</strong> когда
            ученик не может найти ошибочный шаг среди трёх переходов или сомневается в вычислениях, Claude анализирует конкретную
            тройку шагов, формулирует правило самопроверки для выбранной строки и даёт ориентир без спойлера численного ответа
            задачи на перенос.
          </li>
          <li>
            <strong>Многофакторное планирование подготовки (<code>POST /api/roadmap</code>):</strong> синтезирует результаты
            пробного ЕНТ, граф зависимостей 16 тем, историю самостоятельных решений в <code>/lab</code>, целевой балл (из 50) и
            свободную цель ученика в персональный понедельный план.
          </li>
        </ol>

        <h2>4. Приватность школьников, безопасность и контроль квот</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Анонимный режим для школьников:</strong> платформа не требует регистрации, ввода ФИО, телефона, email или
            номера школы. Прогресс хранится локально в браузере ученика (<code>localStorage</code>) с возможностью экспорта в JSON.
          </li>
          <li>
            <strong>Серверная валидация и лимиты (Cloudflare Workers + D1):</strong> все маршруты защищены лимитом размера
            запроса (4 KiB), строгой проверкой схем <code>Zod</code> и атомарным резервированием квот в базе данных Cloudflare D1
            по обезличенному криптографическому хешу (SHA-256).
          </li>
        </ul>

        <h2>5. Контакты и открытый код</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Основатель и разработчик:</strong> Нурбек Сайдуалиев (Алматы, Казахстан ·{" "}
            <a href="mailto:nurbek@bilimai.dpdns.org">nurbek@bilimai.dpdns.org</a>)
          </li>
          <li>
            <strong>Продакшн-платформа:</strong> <a href="https://bilimai.dpdns.org">https://bilimai.dpdns.org</a> (Тренировка
            ошибок: <a href="/lab">/lab</a>)
          </li>
          <li>
            <strong>Открытый репозиторий и документация стартапа:</strong>{" "}
            <a href="https://github.com/nur667-7/bilimai" target="_blank" rel="noreferrer">
              github.com/nur667-7/bilimai
            </a>
          </li>
        </ul>

        <details className="mt-6">
          <summary className="cursor-pointer font-semibold text-sm py-1">
            Startup &amp; Technical Overview for Grant Reviewers (English)
          </summary>
          <div className="mt-3 space-y-2 text-sm">
            <p>
              <strong>Product &amp; Market:</strong> BilimAI is a trilingual (Russian, Kazakh, Uzbek) neuro-symbolic mathematics
              tutoring platform built for secondary school students preparing for the Unified National Testing (UNT / ҰБТ) across
              Kazakhstan and Central Asia. It covers all 16 official UNT mathematics sections with 1,152 deterministic
              step-verification scenarios, a 4-format UNT Mock Exam simulator, a 16-node prerequisite Knowledge Graph, and three
              schema-validated Anthropic Claude API microservices.
            </p>
            <p>
              <strong>Why Claude API is Essential:</strong> Deterministic code verifies numerical equality and generates
              hallucination-free problem parameters, while Claude Haiku 4.5 (<code>claude-haiku-4-5-20251001</code>) handles
              open-ended natural-language misconception diagnosis in Kazakh, Russian, and Uzbek, Socratic step-invariant coaching
              without answer spoilers (<code>/api/lab-diagnose</code>), and multi-week adaptive study planning (
              <code>/api/roadmap</code>).
            </p>
            <p>
              <strong>Edge Security &amp; Unit Economics:</strong> Deployed on Cloudflare Workers + D1 with strict 4 KiB payload
              caps, Zod input/output schemas, and fail-closed D1 rate-limit reservations. Grounding Claude prompts in compact
              lesson invariants keeps average token usage under 950 tokens per request (~$0.0012 per diagnostic interaction).
            </p>
          </div>
        </details>
      </div>
    </main>
  );
}
