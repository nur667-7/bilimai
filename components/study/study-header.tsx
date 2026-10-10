"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Compass,
  FlaskConical,
  GitBranch,
  Microscope,
  Sparkles,
  Target,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PixelBrandMark } from "@/components/pixel-mosaic";
import { ThemeToggleButton } from "@/components/hero-canvas";
import type { Language, TopicId } from "@/lib/lessons";
import type { UntSubjectId, UntSubjectSpec } from "@/lib/unt-all-subjects";
import type { StudyCopyLang } from "@/lib/study-copy";
import type { WorkspaceTab } from "@/lib/use-study-navigation";

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

export function StudyHeader({
  lang,
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
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <div className="header-top-row">
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

          {/* 4 Goal-Oriented Primary Sections (Inline on Desktop, Fixed Bottom Nav on Mobile) */}
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
          href="/subjects"
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
              href={`/subjects/${examSubjectId}`}
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
