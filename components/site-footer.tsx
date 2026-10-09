"use client";
import type { Language, TopicId } from "@/lib/lessons";

type SiteFooterProps = {
  lang: Language;
  topic?: TopicId;
  compact?: boolean;
  onSelectTab?: (tab: string) => void;
};

const FOOTER_COPY = {
  ru: {
    summary:
      "BilimAI — интерактивный тренажёр подготовки к ЕНТ (ҰБТ) по всем 12 официальным предметам НЦТ РК: пошаговый разбор задач, проверка черновика решения, 1 152 задачи на поиск первой ошибки, пробное ЕНТ (формат НЦТ 10 / 20 / 40 заданий и тренировочные наборы по 40 вопросов) и ИИ-тьютор (Claude API).",
    navToday: "Сегодня",
    navStudy: "Учиться",
    navExam: "Пробное ЕНТ",
    navProfile: "Профиль",
    navLab: "Тренировка ошибок",
    navWelcome: "Как работает BilimAI",
    navAbout: "О проекте и методике",
    navPrivacy: "Конфиденциальность",
    contactLabel: "Обратная связь:",
    location: "Алматы, Казахстан"
  },
  kk: {
    summary:
      "BilimAI — ҚР ҰТО-ның барлық 12 ресми пәні бойынша ҰБТ-ға дайындық тренажері: қадамдық талдау, шешімді тексеру, 1 152 қате табу есебі, байқау ҰБТ (10 / 20 / 40 тапсырма) және ЖИ-тьютор (Claude API).",
    navToday: "Бүгін",
    navStudy: "Оқу",
    navExam: "Сынақ ҰБТ",
    navProfile: "Профиль",
    navLab: "Қатемен жұмыс",
    navWelcome: "BilimAI қалай жұмыс істейді",
    navAbout: "Жоба және әдістеме",
    navPrivacy: "Құпиялылық",
    contactLabel: "Байланыс:",
    location: "Алматы, Қазақстан"
  },
  uz: {
    summary:
      "BilimAI — barcha 12 ta rasmiy UBT fani bo‘yicha tayyorgarlik trenajyori: qadamma-qadam tahlil, yechimni tekshirish, 1 152 ta xato topish masalasi, sinov UBT (10 / 20 / 40 topshiriq) va SI-tyutor (Claude API).",
    navToday: "Bugun",
    navStudy: "O‘qish",
    navExam: "Sinov UBT",
    navProfile: "Profil",
    navLab: "Xatolar ustida ishlash",
    navWelcome: "BilimAI qanday ishlaydi",
    navAbout: "Loyiha va metodika",
    navPrivacy: "Maxfiylik",
    contactLabel: "Aloqa:",
    location: "Olmaota, Qozog‘iston"
  }
} as const;

export function SiteFooter({
  lang,
  topic = "linear",
  compact = false,
  onSelectTab
}: SiteFooterProps) {
  const c = FOOTER_COPY[lang];

  function handleNavTab(targetTab: string) {
    if (!onSelectTab) return;
    onSelectTab(targetTab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (compact) {
    return (
      <footer className="wrap site-footer site-footer-compact" aria-label="Footer">
        <div className="site-footer-meta-row">
          <span>
            <strong>BilimAI</strong> ·{" "}
            <a href={`/welcome?lang=${lang}`}>{c.navWelcome}</a> ·{" "}
            <a href={`/about?lang=${lang}`}>{c.navAbout}</a> ·{" "}
            <a href={`/privacy?lang=${lang}`}>{c.navPrivacy}</a>
          </span>
          <span>
            <a href="mailto:nurbek@bilimai.dpdns.org">nurbek@bilimai.dpdns.org</a>
          </span>
        </div>
      </footer>
    );
  }

  return (
    <footer id="contacts" className="wrap site-footer" aria-label="Footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <div className="flex items-center gap-2 mb-1">
            <span className="aniq-logo-badge w-6 h-6 text-xs">B</span>
            <strong>
              Bilim<span className="text-brand">AI</span>
            </strong>
          </div>
          <p>{c.summary}</p>
        </div>

        <nav className="site-footer-nav" aria-label="Разделы">
          {onSelectTab ? (
            <>
              <button type="button" className="footer-link-btn" onClick={() => handleNavTab("today")}>
                {c.navToday}
              </button>
              <button type="button" className="footer-link-btn" onClick={() => handleNavTab("lesson")}>
                {c.navStudy}
              </button>
              <button type="button" className="footer-link-btn" onClick={() => handleNavTab("exam")}>
                {c.navExam}
              </button>
              <button type="button" className="footer-link-btn" onClick={() => handleNavTab("profile")}>
                {c.navProfile}
              </button>
            </>
          ) : (
            <>
              <a href={`/?lang=${lang}&tab=today`}>{c.navToday}</a>
              <a href={`/?lang=${lang}&tab=lesson&topic=${topic}`}>{c.navStudy}</a>
              <a href={`/?lang=${lang}&tab=exam`}>{c.navExam}</a>
              <a href={`/?lang=${lang}&tab=profile`}>{c.navProfile}</a>
            </>
          )}
          <a href={`/lab?lang=${lang}&topic=${topic}`}>{c.navLab}</a>
          <a href={`/welcome?lang=${lang}`}>{c.navWelcome}</a>
          <a href={`/about?lang=${lang}`}>{c.navAbout}</a>
          <a href={`/privacy?lang=${lang}`}>{c.navPrivacy}</a>
        </nav>

        <div className="site-footer-meta-row">
          <span>
            {c.contactLabel}{" "}
            <a href="mailto:nurbek@bilimai.dpdns.org">nurbek@bilimai.dpdns.org</a> · {c.location}
          </span>
          <span>
            <a href="https://github.com/nur667-7/bilimai" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
