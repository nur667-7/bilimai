"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Compass,
  FlaskConical,
  GitBranch,
  Microscope,
  Search,
  Sparkles,
  Target,
  User,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PixelBrandMark } from "@/components/pixel-mosaic";
import { ThemeToggleButton } from "@/components/hero-canvas";
import type { Language, TopicId } from "@/lib/lessons";
import type { UntSubjectId, UntSubjectSpec } from "@/lib/unt-all-subjects";
import type { StudyCopyLang } from "@/lib/study-copy";
import type { WorkspaceTab } from "@/lib/use-study-navigation";
import { searchPlatformContent } from "@/lib/universal-curriculum";

export interface StudyHeaderProps {
  lang: Language;
  tab: WorkspaceTab;
  topic: TopicId;
  dark: boolean;
  isTodaySection: boolean;
  isLearnSection: boolean;
  isExamSection: boolean;
  isProfileSection: boolean;
  t: StudyCopyLang;
  onToggleTheme: () => void;
  onSelectLanguage: (lang: Language) => void;
  onTabChange: (tab: string) => void;
}

export function FigmaDesktopSidebar({
  lang,
  tab,
  onTabChange
}: {
  lang: Language;
  tab: WorkspaceTab;
  onTabChange: (tab: string) => void;
}) {
  const labels = {
    home: lang === "kk" ? "Басты бет" : lang === "uz" ? "Bosh sahifa" : "Главная",
    subjects: lang === "kk" ? "Пәндер" : lang === "uz" ? "Fanlar" : "Предметы",
    lesson: lang === "kk" ? "Сабақтар" : lang === "uz" ? "Darslar" : "Урок и практика",
    graph: lang === "kk" ? "Білім картасы" : lang === "uz" ? "Bilim xaritasi" : "Карта знаний",
    errors: lang === "kk" ? "Менің қателерім" : lang === "uz" ? "Xatolarim" : "Мои ошибки",
    exam: lang === "kk" ? "Сынақ ҰБТ" : lang === "uz" ? "Sinov UBT" : "Пробное ЕНТ",
    ai: lang === "kk" ? "ЖИ-көмекші" : lang === "uz" ? "SI-yordamchi" : "ИИ-помощник",
    profile: lang === "kk" ? "Профиль" : lang === "uz" ? "Profil" : "Профиль"
  };

  return (
    <aside className="figma-sidebar" data-testid="figma-desktop-sidebar" aria-label="Навигация платформы">
      <a
        href={`/?lang=${lang}`}
        className="figma-sidebar-brand"
        onClick={(e) => {
          e.preventDefault();
          onTabChange("today");
        }}
      >
        <PixelBrandMark size={24} />
        <span>BilimAI</span>
      </a>

      <nav className="figma-sidebar-nav" aria-label="Основные разделы">
        <button
          type="button"
          data-testid="figma-nav-today"
          className={`figma-sidebar-link ${tab === "today" ? "active" : ""}`}
          onClick={() => onTabChange("today")}
        >
          <Compass size={16} />
          <span>{labels.home}</span>
        </button>

        <a
          href={`/subjects?lang=${lang}`}
          data-testid="figma-nav-subjects"
          className="figma-sidebar-link"
        >
          <BookOpen size={16} />
          <span>{labels.subjects}</span>
        </a>

        <button
          type="button"
          data-testid="figma-nav-lesson"
          className={`figma-sidebar-link ${tab === "lesson" || tab === "practice" ? "active" : ""}`}
          onClick={() => onTabChange("lesson")}
        >
          <BookOpen size={16} />
          <span>{labels.lesson}</span>
        </button>

        <button
          type="button"
          data-testid="figma-nav-graph"
          className={`figma-sidebar-link ${tab === "graph" ? "active" : ""}`}
          onClick={() => onTabChange("graph")}
        >
          <GitBranch size={16} />
          <span>{labels.graph}</span>
        </button>

        <a
          href="/lab"
          data-testid="figma-nav-errors"
          className="figma-sidebar-link"
        >
          <FlaskConical size={16} />
          <span>{labels.errors}</span>
        </a>

        <button
          type="button"
          data-testid="figma-nav-exam"
          className={`figma-sidebar-link ${tab === "exam" ? "active" : ""}`}
          onClick={() => onTabChange("exam")}
        >
          <Target size={16} />
          <span>{labels.exam}</span>
        </button>

        <button
          type="button"
          data-testid="figma-nav-ai"
          className={`figma-sidebar-link ${tab === "ai" ? "active" : ""}`}
          onClick={() => onTabChange("ai")}
        >
          <Sparkles size={16} />
          <span>{labels.ai}</span>
        </button>

        <button
          type="button"
          data-testid="figma-nav-profile"
          className={`figma-sidebar-link ${tab === "profile" ? "active" : ""}`}
          onClick={() => onTabChange("profile")}
        >
          <User size={16} />
          <span>{labels.profile}</span>
        </button>
      </nav>
    </aside>
  );
}

export function StudyHeader({
  lang,
  tab,
  dark,
  isTodaySection,
  isLearnSection,
  isExamSection,
  isProfileSection,
  t,
  onToggleTheme,
  onSelectLanguage,
  onTabChange
}: StudyHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(
    () => searchPlatformContent(searchQuery, lang, 16),
    [searchQuery, lang]
  );

  useEffect(() => {
    if (!searchOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchOpen]);

  const searchLabel =
    lang === "kk" ? "Іздеу" : lang === "uz" ? "Qidiruv" : "Поиск";
  const searchPlaceholder =
    lang === "kk"
      ? "Пән, тақырып немесе сабақ атауын енгізіңіз..."
      : lang === "uz"
        ? "Fan, mavzu yoki dars nomini kiriting..."
        : "Введите название предмета, темы или урока...";

  const breadcrumbPrefix =
    lang === "kk" ? "Оқу" : lang === "uz" ? "O‘qish" : "Обучение";
  const breadcrumbCurrent =
    tab === "today"
      ? lang === "kk"
        ? "Басты бет"
        : lang === "uz"
          ? "Bosh sahifa"
          : "Главная"
      : tab === "lesson"
        ? lang === "kk"
          ? "Сабақ"
          : lang === "uz"
            ? "Dars"
            : "Урок"
        : tab === "practice"
          ? lang === "kk"
            ? "Практика"
            : lang === "uz"
              ? "Amaliyot"
              : "Практика"
          : tab === "graph"
            ? lang === "kk"
              ? "Білім картасы"
              : lang === "uz"
                ? "Bilim xaritasi"
                : "Карта знаний"
            : tab === "ai"
              ? lang === "kk"
                ? "ЖИ-көмекші"
                : lang === "uz"
                  ? "SI-yordamchi"
                  : "ИИ-помощник"
              : tab === "exam"
                ? lang === "kk"
                  ? "ҰБТ-ға дайындық"
                  : lang === "uz"
                    ? "UBTga tayyorgarlik"
                    : "Подготовка к ЕНТ"
                : tab === "profile"
                  ? lang === "kk"
                    ? "Профиль"
                    : lang === "uz"
                      ? "Profil"
                      : "Профиль"
                  : "Главная";

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <div className="header-top-row">
          <div className="figma-topbar-breadcrumb" data-testid="figma-topbar-breadcrumb">
            <span>{breadcrumbPrefix}</span>
            <span>/</span>
            <strong>{breadcrumbCurrent}</strong>
          </div>

          <a
            className="aniq-brand-logo"
            href={`/?lang=${lang}`}
            onClick={(e) => {
              e.preventDefault();
              onTabChange("today");
            }}
          >
            <PixelBrandMark size={26} />
            <span className="aniq-logo-word">BilimAI</span>
            <span className="brand-sub hide-on-narrow-mobile">ЕНТ · ҰБТ</span>
          </a>

          {/* Primary Sections (Inline on Desktop, Fixed Bottom Nav on Mobile) */}
          <nav className="primary-nav" aria-label="Основные разделы">
            <button
              type="button"
              className={`primary-nav-link ${isTodaySection ? "active" : ""}`}
              aria-current={isTodaySection ? "page" : undefined}
              onClick={() => onTabChange("today")}
            >
              <Compass size={15} />
              <span>{t.navToday}</span>
            </button>
            <button
              type="button"
              className={`primary-nav-link ${isLearnSection ? "active" : ""}`}
              aria-current={isLearnSection ? "page" : undefined}
              onClick={() => {
                if (!isLearnSection) {
                  onTabChange("lesson");
                }
              }}
            >
              <BookOpen size={15} />
              <span>{t.navLearn}</span>
            </button>
            <a
              href={`/subjects?lang=${lang}`}
              className="primary-nav-link"
              style={{ textDecoration: "none" }}
            >
              <GitBranch size={15} />
              <span>{lang === "kk" ? "Пәндер" : lang === "uz" ? "Fanlar" : "Предметы"}</span>
            </a>
            <button
              type="button"
              className={`primary-nav-link ${isExamSection ? "active" : ""}`}
              aria-current={isExamSection ? "page" : undefined}
              onClick={() => onTabChange("exam")}
            >
              <Target size={15} />
              <span>{t.navExam}</span>
            </button>
            <button
              type="button"
              className={`primary-nav-link ${isProfileSection ? "active" : ""}`}
              aria-current={isProfileSection ? "page" : undefined}
              onClick={() => onTabChange("profile")}
            >
              <User size={15} />
              <span>{t.navProfile}</span>
            </button>
          </nav>

          <div className="header-right">
            <button
              type="button"
              data-testid="global-search-trigger"
              aria-label={searchLabel}
              onClick={() => setSearchOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                minHeight: 36,
                padding: "6px 11px",
                borderRadius: 10,
                border: "1px solid var(--line, #DCE2DD)",
                background: "var(--paper-elevated, #ffffff)",
                color: "var(--ink, #171c1a)",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              <Search size={14} />
              <span className="hide-on-narrow-mobile">{searchLabel}</span>
            </button>

            <div className="lang-switcher" role="group" aria-label="Язык">
              <button
                type="button"
                className={`lang-btn ${lang === "ru" ? "active" : ""}`}
                aria-pressed={lang === "ru"}
                onClick={() => onSelectLanguage("ru")}
              >
                РУС
              </button>
              <button
                type="button"
                className={`lang-btn ${lang === "kk" ? "active" : ""}`}
                aria-pressed={lang === "kk"}
                onClick={() => onSelectLanguage("kk")}
              >
                ҚАЗ
              </button>
              <button
                type="button"
                className={`lang-btn ${lang === "uz" ? "active" : ""}`}
                aria-pressed={lang === "uz"}
                onClick={() => onSelectLanguage("uz")}
              >
                OʻZB
              </button>
            </div>

            <ThemeToggleButton dark={dark} onToggle={onToggleTheme} />
          </div>
        </div>
      </div>

      {searchOpen && (
        <div
          className="global-search-backdrop"
          data-testid="global-search-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false);
          }}
        >
          <div
            className="global-search-dialog"
            data-testid="global-search-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={searchLabel}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 16px",
                borderBottom: "1px solid var(--line, #DCE2DD)"
              }}
            >
              <Search size={18} style={{ opacity: 0.65, flexShrink: 0 }} />
              <input
                type="search"
                data-testid="global-search-input"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "inherit",
                  fontSize: 15,
                  fontWeight: 600
                }}
              />
              <button
                type="button"
                data-testid="global-search-close"
                aria-label="Закрыть поиск"
                onClick={() => setSearchOpen(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "1px solid var(--line, #DCE2DD)",
                  background: "transparent",
                  color: "inherit",
                  cursor: "pointer"
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div
              style={{
                overflowY: "auto",
                padding: "12px 14px",
                display: "grid",
                gap: 8
              }}
            >
              {searchResults.length === 0 ? (
                <div
                  data-testid="global-search-empty"
                  style={{
                    padding: "28px 16px",
                    textAlign: "center",
                    fontSize: 14,
                    opacity: 0.78
                  }}
                >
                  {lang === "kk"
                    ? "Сұраныс бойынша ештеңе табылмады. Басқа сөзді енгізіп көріңіз."
                    : lang === "uz"
                      ? "So‘rov bo‘yicha hech narsa topilmadi. Boshqa so‘zni kiriting."
                      : "По вашему запросу ничего не найдено. Попробуйте другое ключевое слово."}
                </div>
              ) : (
                searchResults.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    data-testid="global-search-result-item"
                    onClick={() => setSearchOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "11px 14px",
                      borderRadius: 12,
                      border: "1px solid var(--line, #DCE2DD)",
                      textDecoration: "none",
                      color: "inherit"
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 800,
                            padding: "2px 7px",
                            borderRadius: 999,
                            background: "rgba(13, 110, 91, 0.12)",
                            color: "var(--accent-strong, #0d6e5b)"
                          }}
                        >
                          {item.badge}
                        </span>
                        <span style={{ fontSize: 11.5, fontWeight: 700, opacity: 0.72 }}>
                          {item.kind === "subject"
                            ? lang === "kk"
                              ? "Пән"
                              : lang === "uz"
                                ? "Fan"
                                : "Предмет"
                            : lang === "kk"
                              ? "Сабақ"
                              : lang === "uz"
                                ? "Dars"
                                : "Урок"}
                        </span>
                      </div>
                      <div style={{ fontSize: 14.5, fontWeight: 700 }}>{item.title}</div>
                      <div style={{ fontSize: 12.5, opacity: 0.75 }}>{item.subtitle}</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-strong, #0d6e5b)" }}>
                      →
                    </span>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export interface LearnSubnavProps {
  lang: Language;
  tab: WorkspaceTab;
  topic: TopicId;
  examSubjectId: UntSubjectId;
  currentSubjectMeta: UntSubjectSpec;
  t: StudyCopyLang;
  onTabChange: (tab: string) => void;
  onSubjectChange: (subjectId: UntSubjectId) => void;
}

export function LearnSubnav({
  lang,
  tab,
  topic,
  examSubjectId,
  currentSubjectMeta,
  t,
  onTabChange,
  onSubjectChange
}: LearnSubnavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectMode = (nextTab: string) => {
    setMobileMenuOpen(false);
    onTabChange(nextTab);
  };

  return (
    <div className="learn-subnav-wrap mb-3">
      <nav
        className={`learn-subnav ${mobileMenuOpen ? "is-mobile-open" : ""}`}
        aria-label={t.navLearn}
      >
        <button
          type="button"
          className={`learn-subnav-pill ${tab === "lesson" || tab === "practice" ? "active" : ""}`}
          onClick={() => handleSelectMode("lesson")}
        >
          <BookOpen size={14} />
          <span>{t.subLesson}</span>
        </button>
        <button
          type="button"
          className={`learn-subnav-pill ${tab === "graph" ? "active" : ""}`}
          onClick={() => handleSelectMode("graph")}
        >
          <GitBranch size={14} />
          <span>{t.subGraph}</span>
        </button>
        <button
          type="button"
          className={`learn-subnav-pill ${tab === "xray" ? "active" : ""}`}
          onClick={() => handleSelectMode("xray")}
        >
          <Microscope size={14} />
          <span>{t.subXray}</span>
        </button>
        <a
          className="learn-subnav-pill"
          href={`/lab?lang=${lang}&topic=${topic}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <FlaskConical size={14} />
          <span>{t.subLab}</span>
        </a>
        <button
          type="button"
          className={`learn-subnav-pill ${tab === "ai" ? "active" : ""}`}
          onClick={() => handleSelectMode("ai")}
        >
          <Sparkles size={14} />
          <span>{t.subAi}</span>
        </button>

        <a
          className="learn-subnav-pill"
          href={`/subjects?lang=${lang}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <Compass size={14} />
          <span>{lang === "kk" ? "Пәндер (12)" : lang === "uz" ? "Fanlar (12)" : "Предметы (12)"}</span>
        </a>

        <button
          type="button"
          className="learn-subnav-toggle-btn"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <span>{t.changeModeBtn}</span>
          <ChevronDown size={14} className={mobileMenuOpen ? "rotate-180 transition-transform" : "transition-transform"} />
        </button>
      </nav>

      {/* Universal Subject Course CTA when another subject is active */}
      {examSubjectId !== "math" && (
        <div className="subject-boundary-banner mt-3" role="status">
          <div className="subject-boundary-text">
            <strong>{currentSubjectMeta.title[lang]} — полный курс предмета доступен</strong>
            <p className="small m-0 mt-1">
              Откройте интерактивные уроки, практику, Лабораторию ошибок, Карту знаний и ИИ-репетитора по предмету «{currentSubjectMeta.title[lang]}».
            </p>
          </div>
          <div className="subject-boundary-actions">
            <a
              href={`/subjects/${examSubjectId}?lang=${lang}`}
              className="btn-primary"
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                textDecoration: "none",
                fontSize: 13.5,
                fontWeight: 700
              }}
            >
              Открыть уроки: {currentSubjectMeta.title[lang]} →
            </a>
            <Button size="sm" variant="outline" onClick={() => onSubjectChange("math")}>
              {t.subjectBoundaryStudyMath}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export interface MobileBottomNavProps {
  isTodaySection: boolean;
  isLearnSection: boolean;
  isExamSection: boolean;
  isProfileSection: boolean;
  t: StudyCopyLang;
  onTabChange: (tab: string) => void;
}

export function MobileBottomNav({
  isTodaySection,
  isLearnSection,
  isExamSection,
  isProfileSection,
  t,
  onTabChange
}: MobileBottomNavProps) {
  return (
    <nav className="mobile-bottom-nav" aria-label="Мобильная навигация">
      <button
        type="button"
        className={`mobile-bottom-nav-item ${isTodaySection ? "active" : ""}`}
        aria-current={isTodaySection ? "page" : undefined}
        onClick={() => onTabChange("today")}
      >
        <Compass size={18} />
        <span>{t.navToday}</span>
      </button>
      <button
        type="button"
        className={`mobile-bottom-nav-item ${isLearnSection ? "active" : ""}`}
        aria-current={isLearnSection ? "page" : undefined}
        onClick={() => {
          if (!isLearnSection) {
            onTabChange("lesson");
          }
        }}
      >
        <BookOpen size={18} />
        <span>{t.navLearn}</span>
      </button>
      <button
        type="button"
        className={`mobile-bottom-nav-item ${isExamSection ? "active" : ""}`}
        aria-current={isExamSection ? "page" : undefined}
        onClick={() => onTabChange("exam")}
      >
        <Target size={18} />
        <span>{t.navExam}</span>
      </button>
      <button
        type="button"
        className={`mobile-bottom-nav-item ${isProfileSection ? "active" : ""}`}
        aria-current={isProfileSection ? "page" : undefined}
        onClick={() => onTabChange("profile")}
      >
        <User size={18} />
        <span>{t.navProfile}</span>
      </button>
    </nav>
  );
}
