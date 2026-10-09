"use client";
import { Compass, FlaskConical, GitBranch, Mail, MapPin, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import type { Language, TopicId } from "@/lib/lessons";

type SiteFooterProps = {
  lang: Language;
  topic?: TopicId;
  onSelectTab?: (tab: string) => void;
};

const FOOTER_COPY = {
  ru: {
    claudeBadge: "Anthropic Claude API · Архитектура ИИ-диагностики",
    claudeTitle: "Как BilimAI использует Claude API без готовых шпаргалок",
    claudeSub:
      "Вместо генерации готового ответа три серверных маршрута связывают детерминированное ядро проверки шагов с моделью Anthropic Claude по строгим JSON-схемам Zod.",
    pipeStep1: "1. Шаг ученика",
    pipeStep1Sub: "Условие, выбранный шаг или матрица пробелов ЕНТ",
    pipeStep2: "2. 18+ и квота D1",
    pipeStep2Sub: "Согласие сессии, лимит ≤ 4 КБ и резервация в Cloudflare D1",
    pipeStep3: "3. Anthropic Claude API",
    pipeStep3Sub: "Системный промпт с эталонным инвариантом урока",
    pipeStep4: "4. Проверенный ответ",
    pipeStep4Sub: "Валидация Zod: объяснение, проверка шага и микро-подсказка",
    engines: [
      {
        endpoint: "POST /api/explain",
        title: "Сократический разбор вопроса",
        desc: "Объясняет математический инвариант текущего урока на примере ученика и задаёт проверочный вопрос на следующий шаг без спойлера ответа.",
        cta: "Разобрать вопрос с Claude →",
        tab: "ai"
      },
      {
        endpoint: "POST /api/roadmap",
        title: "Персональный маршрут до цели ЕНТ",
        desc: "Принимает целевой балл (из 50), оставшиеся недели и корневые пробелы из «Второго мозга» или Пробного ЕНТ и строит понедельный план.",
        cta: "Составить учебный план →",
        tab: "roadmap"
      },
      {
        endpoint: "POST /api/lab-diagnose",
        title: "Диагностика ошибочного перехода в /lab",
        desc: "Разбирает конкретный неверный шаг из 720 параметрических задач Лаборатории ошибок и даёт ориентир для задачи на перенос.",
        cta: "Открыть Лабораторию (/lab) →",
        href: "/lab"
      }
    ],
    colBrandDesc:
      "Диагностическая платформа подготовки к ЕНТ (ҰБТ) по математической грамотности и профильной математике на русском, казахском и узбекском языках.",
    colBrandMeta: "10 разделов НЦТ РК · 720 задач в /lab · 4 формата Пробного ЕНТ · 18+",
    colNavTitle: "Разделы платформы",
    navLesson: "Уроки и пошаговая практика",
    navExam: "Пробное ЕНТ (4 формата НЦТ)",
    navGraph: "Второй мозг (Граф знаний)",
    navLab: "Лаборатория ошибок (/lab)",
    navAbout: "О проекте и архитектуре",
    navPrivacy: "Приватность и данные (18+)",
    colClaudeTitle: "Claude API и защита данных",
    claudeBullets: [
      "Маршруты: /api/explain, /api/roadmap, /api/lab-diagnose",
      "Строгая схема ответа (Zod) и потоковый лимит чтения ≤ 16 КБ",
      "Хеширование квот SHA-256 в Cloudflare D1 без хранения ПДн",
      "Явное согласие 18+ перед каждым обращением к ИИ"
    ],
    colContactTitle: "Контакты и реквизиты",
    founderLabel: "Основатель и разработчик:",
    founderName: "Нурбек Сайдуалиев",
    location: "Алматы, Республика Казахстан",
    corpEmailLabel: "Корпоративная почта:",
    domainLabel: "Официальный домен:",
    repoLabel: "Исходный код и тесты (22/22):",
    copyright: "© 2026 BilimAI · Диагностическая подготовка к ЕНТ (ҰБТ) · Все права защищены.",
    poweredBy: "Работает на базе Anthropic Claude API и Cloudflare Workers + D1 · Возрастное ограничение 18+"
  },
  kk: {
    claudeBadge: "Anthropic Claude API · ЖИ-диагностика архитектурасы",
    claudeTitle: "BilimAI дайын жауап берудің орнына Claude API-ді қалай қолданады",
    claudeSub:
      "Дайын жауапты көшіріп берудің орнына үш серверлік маршрут математикалық тексеру ядросын Anthropic Claude моделімен қатаң Zod JSON-схемалары арқылы байланыстырады.",
    pipeStep1: "1. Оқушы қадамы",
    pipeStep1Sub: "Есеп шарты, таңдалған қадам немесе ҰБТ олқылықтар матрицасы",
    pipeStep2: "2. 18+ және D1 квотасы",
    pipeStep2Sub: "Сессия келісімі, ≤ 4 КБ лимиті және Cloudflare D1 резервациясы",
    pipeStep3: "3. Anthropic Claude API",
    pipeStep3Sub: "Сабақтың эталондық инварианты бар жүйелік промпт",
    pipeStep4: "4. Тексерілген жауап",
    pipeStep4Sub: "Zod валидациясы: түсіндіру, қадамды тексеру және бағыт",
    engines: [
      {
        endpoint: "POST /api/explain",
        title: "Сұрақты сократтық талдау",
        desc: "Ағымдағы сабақтың математикалық ережесін түсіндіреді және дайын жауапты ашпай, келесі қадамға бағыттайтын сұрақ қояды.",
        cta: "Claude арқылы сұрақты талдау →",
        tab: "ai"
      },
      {
        endpoint: "POST /api/roadmap",
        title: "ҰБТ мақсатына жеке оқу жоспары",
        desc: "Мақсатты балл (50-ден), қалған апталар мен «Екінші ми» графындағы түпкі олқылықтарды ескеріп, апталық жоспар құрады.",
        cta: "Жеке жоспар құру →",
        tab: "roadmap"
      },
      {
        endpoint: "POST /api/lab-diagnose",
        title: "Қателер зертханасындағы (/lab) қадам талдауы",
        desc: "720 параметрлік есептің ішіндегі нақты қате қадамды талдап, жаңа есепті шығаруға бағыт береді.",
        cta: "Зертхананы ашу (/lab) →",
        href: "/lab"
      }
    ],
    colBrandDesc:
      "Орыс, қазақ және өзбек тілдерінде математикалық сауаттылық пен бейіндік математикадан ҰБТ-ға диагностикалық дайындық платформасы.",
    colBrandMeta: "ҰТО 10 бөлімі · /lab ішінде 720 есеп · ҰБТ 4 форматы · 18+",
    colNavTitle: "Платформа бөлімдері",
    navLesson: "Сабақтар мен қадамдық жаттығу",
    navExam: "Сынақ ҰБТ (4 ресми формат)",
    navGraph: "Екінші ми (Білім графы)",
    navLab: "Қателер зертханасы (/lab)",
    navAbout: "Жоба және архитектура туралы",
    navPrivacy: "Құпиялық және деректер (18+)",
    colClaudeTitle: "Claude API және деректер қорғанысы",
    claudeBullets: [
      "Маршруттар: /api/explain, /api/roadmap, /api/lab-diagnose",
      "Қатаң жауап схемасы (Zod) және ≤ 16 КБ ағын лимиті",
      "Жеке деректерді сақтамай Cloudflare D1-де SHA-256 квоталау",
      "ЖИ-ге жүгінер алдында міндетті 18+ келісімі"
    ],
    colContactTitle: "Байланыс және деректемелер",
    founderLabel: "Негізін қалаушы және әзірлеуші:",
    founderName: "Нұрбек Сайдуалиев",
    location: "Алматы, Қазақстан Республикасы",
    corpEmailLabel: "Корпоративтік пошта:",
    domainLabel: "Ресми домен:",
    repoLabel: "Ашық код және тесттер (22/22):",
    copyright: "© 2026 BilimAI · ҰБТ диагностикалық дайындық платформасы · Барлық құқықтар қорғалған.",
    poweredBy: "Anthropic Claude API және Cloudflare Workers + D1 негізінде жұмыс істейді · 18+"
  },
  uz: {
    claudeBadge: "Anthropic Claude API · AI-diagnostika arxitekturasi",
    claudeTitle: "BilimAI tayyor javob berish o‘rniga Claude API-dan qanday foydalanadi",
    claudeSub:
      "Tayyor javobni ko‘rsatish o‘rniga uchta server marshruti matematik tekshiruv yadrosini Anthropic Claude modeli bilan qat’iy Zod JSON-sxemalari orqali bog‘laydi.",
    pipeStep1: "1. O‘quvchi qadami",
    pipeStep1Sub: "Masala sharti, tanlangan qadam yoki bo‘shliqlar matritsasi",
    pipeStep2: "2. 18+ va D1 kvotasi",
    pipeStep2Sub: "Sessiya roziligi, ≤ 4 KB limiti va Cloudflare D1 rezervatsiyasi",
    pipeStep3: "3. Anthropic Claude API",
    pipeStep3Sub: "Darsning etalon invarianti bilan tizimli prompt",
    pipeStep4: "4. Tekshirilgan javob",
    pipeStep4Sub: "Zod validatsiyasi: tushuntirish, qadam tekshiruvi va yo‘nalish",
    engines: [
      {
        endpoint: "POST /api/explain",
        title: "Savolning sokratik tahlili",
        desc: "Joriy darsning matematik qoidasini tushuntiradi va javobni ochmasdan keyingi qadam uchun tekshiruv savolini beradi.",
        cta: "Claude bilan savolni tahlil qilish →",
        tab: "ai"
      },
      {
        endpoint: "POST /api/roadmap",
        title: "Maqsadli ball uchun shaxsiy o‘quv rejasi",
        desc: "Maqsadli ball (50 dan), qolgan haftalar va «Ikkinchi miya» grafigidagi bo‘shliqlarni hisobga olib, haftalik reja tuzadi.",
        cta: "Shaxsiy reja tuzish →",
        tab: "roadmap"
      },
      {
        endpoint: "POST /api/lab-diagnose",
        title: "Xatolar laboratoriyasida (/lab) qadam tahlili",
        desc: "720 ta parametrik masaladagi xato qadamni tahlil qilib, yangi masalani yechish uchun yo‘nalish beradi.",
        cta: "Laboratoriyani ochish (/lab) →",
        href: "/lab"
      }
    ],
    colBrandDesc:
      "Rus, qozoq va o‘zbek tillarida matematik savodxonlik hamda chuqurlashtirilgan matematikadan diagnostik tayyorgarlik platformasi.",
    colBrandMeta: "10 ta bo‘lim · /lab ichida 720 ta masala · 4 ta rasmiy format · 18+",
    colNavTitle: "Platforma bo‘limlari",
    navLesson: "Darslar va qadam-baqadam mashq",
    navExam: "Sinov imtihoni (4 ta rasmiy format)",
    navGraph: "Ikkinchi miya (Bilimlar grafi)",
    navLab: "Xatolar laboratoriyasi (/lab)",
    navAbout: "Loyiha va arxitektura haqida",
    navPrivacy: "Maxfiylik va ma’lumotlar (18+)",
    colClaudeTitle: "Claude API va ma’lumotlar himoyasi",
    claudeBullets: [
      "Marshrutlar: /api/explain, /api/roadmap, /api/lab-diagnose",
      "Qat’iy javob sxemasi (Zod) va ≤ 16 KB oqim limiti",
      "Shaxsiy ma’lumotlarni saqlamasdan Cloudflare D1 da SHA-256 kvotalash",
      "AI ga murojaat qilishdan oldin majburiy 18+ roziligi"
    ],
    colContactTitle: "Aloqa va rekvizitlar",
    founderLabel: "Asoschi va dasturchi:",
    founderName: "Nurbek Saidualiyev",
    location: "Olmaota, Qozog‘iston Respublikasi",
    corpEmailLabel: "Korporativ pochta:",
    domainLabel: "Rasmiy domen:",
    repoLabel: "Ochiq kod va testlar (22/22):",
    copyright: "© 2026 BilimAI · Matematika diagnostik platformasi · Barcha huquqlar himoyalangan.",
    poweredBy: "Anthropic Claude API va Cloudflare Workers + D1 asosida ishlaydi · 18+"
  }
} as const;

export function SiteFooter({ lang, topic = "linear", onSelectTab }: SiteFooterProps) {
  const c = FOOTER_COPY[lang];

  function handleNavTab(targetTab: string) {
    if (!onSelectTab) return;
    onSelectTab(targetTab);
    const ws = document.querySelector(".workspace");
    ws?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="wrap mt-7 space-y-6">
      {/* Claude API Architecture & Live Motion Choreography Showcase */}
      <section id="claude-engine" className="claude-showcase agy-floating-island" aria-labelledby="claude-showcase-heading">
        <div className="claude-showcase-head">
          <div>
            <span className="claude-pill-badge">
              <Sparkles size={13} aria-hidden="true" />
              {c.claudeBadge}
            </span>
            <h2 id="claude-showcase-heading" className="claude-showcase-title">
              {c.claudeTitle}
            </h2>
            <p className="claude-showcase-sub">{c.claudeSub}</p>
          </div>
        </div>

        {/* Kinetic SVG Telemetry Pipeline (60fps stroke-dashoffset + transform/opacity) */}
        <div className="claude-pipeline" role="region" aria-label={c.claudeBadge}>
          <svg className="claude-pipe-svg" viewBox="0 0 960 44" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="claudePulseGrad" x1="0" y1="0" x2="960" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.85" />
              </linearGradient>
            </defs>
            <line x1="60" y1="22" x2="900" y2="22" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5 5" />
            <line
              className="claude-pipe-pulse"
              x1="60"
              y1="22"
              x2="900"
              y2="22"
              stroke="url(#claudePulseGrad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle className="claude-pipe-node n1" cx="120" cy="22" r="6" fill="#175cd3" />
            <circle className="claude-pipe-node n2" cx="360" cy="22" r="6" fill="#2563eb" />
            <circle className="claude-pipe-node n3" cx="600" cy="22" r="6" fill="#4f46e5" />
            <circle className="claude-pipe-node n4" cx="840" cy="22" r="6" fill="#059669" />
          </svg>

          <div className="claude-pipe-steps">
            <div className="claude-pipe-step">
              <strong>{c.pipeStep1}</strong>
              <span>{c.pipeStep1Sub}</span>
            </div>
            <div className="claude-pipe-step">
              <strong>{c.pipeStep2}</strong>
              <span>{c.pipeStep2Sub}</span>
            </div>
            <div className="claude-pipe-step">
              <strong>{c.pipeStep3}</strong>
              <span>{c.pipeStep3Sub}</span>
            </div>
            <div className="claude-pipe-step">
              <strong>{c.pipeStep4}</strong>
              <span>{c.pipeStep4Sub}</span>
            </div>
          </div>
        </div>

        {/* 3 Claude API Engine Cards */}
        <div className="claude-engines-grid">
          {c.engines.map((eng) => (
            <article key={eng.endpoint} className="claude-engine-card">
              <div className="claude-endpoint-tag">
                <Terminal size={13} aria-hidden="true" />
                <code>{eng.endpoint}</code>
              </div>
              <h3>{eng.title}</h3>
              <p>{eng.desc}</p>
              {"tab" in eng ? (
                onSelectTab ? (
                  <button
                    type="button"
                    className="claude-engine-btn"
                    onClick={() => handleNavTab(eng.tab)}
                  >
                    {eng.cta}
                  </button>
                ) : (
                  <a className="claude-engine-btn" href={`/?lang=${lang}&topic=${topic}`}>
                    {eng.cta}
                  </a>
                )
              ) : (
                <a className="claude-engine-btn" href={`${eng.href}?lang=${lang}&topic=${topic}`}>
                  {eng.cta}
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Structured Corporate & Academic Footer */}
      <footer id="contacts" className="site-footer agy-floating-island">
        <div className="site-footer-grid">
          {/* Column 1: Brand & Mission */}
          <div className="site-footer-col">
            <a className="brand" href="/">
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect width="32" height="32" rx="9" fill="#175cd3" />
                <path
                  d="M9 10h8.5a4.5 4.5 0 0 1 0 9H9V10zm0 9h9.5a4.5 4.5 0 0 1 0 9H9v-9z"
                  fill="#fff"
                  fillOpacity="0.95"
                />
              </svg>
              BilimAI <span className="beta">ЕНТ · ҰБТ</span>
            </a>
            <p className="site-footer-desc">{c.colBrandDesc}</p>
            <span className="site-footer-meta">{c.colBrandMeta}</span>
          </div>

          {/* Column 2: Platform Modules */}
          <div className="site-footer-col">
            <h3 className="site-footer-heading">{c.colNavTitle}</h3>
            <ul className="site-footer-links">
              <li>
                {onSelectTab ? (
                  <button type="button" className="footer-link-btn" onClick={() => handleNavTab("lesson")}>
                    {c.navLesson}
                  </button>
                ) : (
                  <a href={`/?lang=${lang}&topic=${topic}`}>{c.navLesson}</a>
                )}
              </li>
              <li>
                {onSelectTab ? (
                  <button type="button" className="footer-link-btn" onClick={() => handleNavTab("exam")}>
                    <Compass size={13} aria-hidden="true" />
                    {c.navExam}
                  </button>
                ) : (
                  <a href={`/?lang=${lang}&topic=${topic}`}>
                    <Compass size={13} aria-hidden="true" />
                    {c.navExam}
                  </a>
                )}
              </li>
              <li>
                {onSelectTab ? (
                  <button type="button" className="footer-link-btn" onClick={() => handleNavTab("graph")}>
                    <GitBranch size={13} aria-hidden="true" />
                    {c.navGraph}
                  </button>
                ) : (
                  <a href={`/?lang=${lang}&topic=${topic}`}>
                    <GitBranch size={13} aria-hidden="true" />
                    {c.navGraph}
                  </a>
                )}
              </li>
              <li>
                <a href={`/lab?lang=${lang}&topic=${topic}`}>
                  <FlaskConical size={13} aria-hidden="true" />
                  {c.navLab}
                </a>
              </li>
              <li>
                <a href="/about">{c.navAbout}</a>
              </li>
              <li>
                <a href="/privacy">{c.navPrivacy}</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Claude API & Security */}
          <div className="site-footer-col">
            <h3 className="site-footer-heading">
              <ShieldCheck size={15} aria-hidden="true" />
              {c.colClaudeTitle}
            </h3>
            <ul className="site-footer-bullets">
              {c.claudeBullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>

          {/* Column 4: Official Contacts & Corporate Email */}
          <div className="site-footer-col">
            <h3 className="site-footer-heading">{c.colContactTitle}</h3>
            <ul className="site-footer-contacts">
              <li>
                <span className="contact-label">{c.founderLabel}</span>
                <strong>{c.founderName}</strong>
              </li>
              <li className="contact-row">
                <MapPin size={14} aria-hidden="true" />
                <span>{c.location}</span>
              </li>
              <li>
                <span className="contact-label">{c.corpEmailLabel}</span>
                <a className="corp-email-pill" href="mailto:nurbek@bilimai.dpdns.org">
                  <Mail size={14} aria-hidden="true" />
                  nurbek@bilimai.dpdns.org
                </a>
              </li>
              <li>
                <span className="contact-label">{c.domainLabel}</span>
                <a href="https://bilimai.dpdns.org">https://bilimai.dpdns.org</a>
              </li>
              <li>
                <span className="contact-label">{c.repoLabel}</span>
                <a href="https://github.com/nur667-7/bilimai" target="_blank" rel="noreferrer">
                  github.com/nur667-7/bilimai
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-footer-bottom">
          <span>{c.copyright}</span>
          <span>{c.poweredBy}</span>
        </div>
      </footer>
    </div>
  );
}
