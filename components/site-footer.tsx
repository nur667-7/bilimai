"use client";
import type { Language, TopicId } from "@/lib/lessons";

type SiteFooterProps = {
  lang: Language;
  topic?: TopicId;
  onSelectTab?: (tab: string) => void;
};

const FOOTER_COPY = {
  ru: {
    summary:
      "BilimAI — интерактивный тренажёр и диагностическая платформа подготовки к ЕНТ (ҰБТ) по математике (все 16 разделов НЦТ РК) на русском, казахском и узбекском языках.",
    navLesson: "Учебник и практика",
    navGraph: "Карта 16 тем",
    navExam: "Пробное ЕНТ",
    navPlan: "Мой план",
    navLab: "Тренировка ошибок",
    navAbout: "О стартапе и архитектуре",
    navPrivacy: "Приватность",
    contactLabel: "Обратная связь:",
    location: "Алматы, Казахстан"
  },
  kk: {
    summary:
      "BilimAI — орыс, қазақ және өзбек тілдеріндегі ҰБТ математикасына (ҰТО 16 бөлімі) дайындыққа арналған диагностикалық тренажер.",
    navLesson: "Оқулық пен жаттығу",
    navGraph: "16 тақырып картасы",
    navExam: "Байқау ҰБТ",
    navPlan: "Менің жоспарым",
    navLab: "Қатемен жұмыс",
    navAbout: "Жоба және архитектура",
    navPrivacy: "Құпиялық",
    contactLabel: "Байланыс:",
    location: "Алматы, Қазақстан"
  },
  uz: {
    summary:
      "BilimAI — rus, qozoq va o‘zbek tillarida matematika bo‘yicha (16 ta bo‘lim) diagnostik darslik va mashq platformasi.",
    navLesson: "Darslik va mashq",
    navGraph: "16 mavzu xaritasi",
    navExam: "Sinov imtihoni",
    navPlan: "Mening rejam",
    navLab: "Xatolar ustida ishlash",
    navAbout: "Loyiha va arxitektura",
    navPrivacy: "Maxfiylik",
    contactLabel: "Aloqa:",
    location: "Olmaota, Qozog‘iston"
  }
} as const;

export function SiteFooter({ lang, topic = "linear", onSelectTab }: SiteFooterProps) {
  const c = FOOTER_COPY[lang];

  function handleNavTab(targetTab: string) {
    if (!onSelectTab) return;
    onSelectTab(targetTab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer id="contacts" className="wrap site-footer" aria-label="Footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <strong>BilimAI</strong>
          <p>{c.summary}</p>
        </div>

        <nav className="site-footer-nav" aria-label="Разделы">
          {onSelectTab ? (
            <>
              <button type="button" className="footer-link-btn" onClick={() => handleNavTab("lesson")}>
                {c.navLesson}
              </button>
              <button type="button" className="footer-link-btn" onClick={() => handleNavTab("graph")}>
                {c.navGraph}
              </button>
              <button type="button" className="footer-link-btn" onClick={() => handleNavTab("exam")}>
                {c.navExam}
              </button>
              <button type="button" className="footer-link-btn" onClick={() => handleNavTab("roadmap")}>
                {c.navPlan}
              </button>
            </>
          ) : (
            <>
              <a href={`/?lang=${lang}&topic=${topic}`}>{c.navLesson}</a>
              <a href={`/?lang=${lang}&tab=graph&topic=${topic}`}>{c.navGraph}</a>
              <a href={`/?lang=${lang}&tab=exam&topic=${topic}`}>{c.navExam}</a>
              <a href={`/?lang=${lang}&tab=roadmap&topic=${topic}`}>{c.navPlan}</a>
            </>
          )}
          <a href={`/lab?lang=${lang}&topic=${topic}`}>{c.navLab}</a>
          <a href="/about">{c.navAbout}</a>
          <a href="/privacy">{c.navPrivacy}</a>
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
