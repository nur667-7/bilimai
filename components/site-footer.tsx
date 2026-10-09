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
      "Aniq AI (ex-BilimAI) — платформа точной ИИ-диагностики математического мышления и подготовки к ЕНТ (ҰБТ): все 16 разделов НЦТ РК, Рентген черновика, 1 152 сценария поиска ошибки, Радар гранта РК и сократический ИИ-тьютор (Claude API).",
    navLesson: "Учебник и практика",
    navXray: "🔬 Рентген & Грант РК",
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
      "Aniq AI (ex-BilimAI) — орыс, қазақ және өзбек тілдеріндегі ҰБТ математикасына (ҰТО 16 бөлімі) дайындыққа арналған дәл диагностикалық ЖИ-платформа: шешім рентгені, 1 152 қате табу есебі және ҚР грант радары.",
    navLesson: "Оқулық пен жаттығу",
    navXray: "🔬 Рентген & ҚР Гранты",
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
      "Aniq AI (ex-BilimAI) — rus, qozoq va o‘zbek tillarida matematika bo‘yicha (16 ta bo‘lim) aniq diagnostik SI-platforma: qoralama rentgeni, 1 152 ta xato topish masalasi va grant radari.",
    navLesson: "Darslik va mashq",
    navXray: "🔬 Rentgen & Grant",
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
          <div className="flex items-center gap-2 mb-1">
            <span className="aniq-logo-badge w-6 h-6 text-xs">A</span>
            <strong>
              Aniq<span className="text-brand">AI</span>
            </strong>
          </div>
          <p>{c.summary}</p>
        </div>

        <nav className="site-footer-nav" aria-label="Разделы">
          {onSelectTab ? (
            <>
              <button type="button" className="footer-link-btn" onClick={() => handleNavTab("lesson")}>
                {c.navLesson}
              </button>
              <button type="button" className="footer-link-btn" onClick={() => handleNavTab("xray")}>
                {c.navXray}
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
              <a href={`/?lang=${lang}&tab=xray&topic=${topic}`}>{c.navXray}</a>
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
