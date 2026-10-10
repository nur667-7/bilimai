"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/curriculum";
import {
  getAllSubjectCurricula,
  formatLessonsCountLabel,
  formatQuestionsCountLabel,
  formatModulesCountLabel,
  type UniversalSubjectCurriculum
} from "@/lib/universal-curriculum";
import {
  UNIVERSAL_PROGRESS_STORAGE_KEY,
  createDefaultUniversalProgressState,
  migrateUniversalProgressState,
  getSubjectSummaryMetrics,
  type UniversalPlatformProgressState
} from "@/lib/universal-progress";

const LOCALE_STORAGE_KEY = "bilimai-locale-v1";
const LEGACY_LANG_STORAGE_KEY = "bilimai-lang";

const CATALOG_I18N: Record<
  Locale,
  {
    onboardingLink: string;
    teacherLink: string;
    workbookLink: string;
    kicker: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    levelFilterAll: string;
    levelBasic: string;
    levelIntermediate: string;
    levelAdvanced: string;
    categories: Record<UniversalSubjectCurriculum["category"] | "all", string>;
    starterBadge: string;
    expandedBadge: string;
    completedLabel: string;
    ofWord: string;
    accuracyLabel: string;
    notAssessed: string;
    openSubjectBtn: string;
    diagnosticBtn: string;
    firstLessonBtn: string;
    noMatches: string;
  }
> = {
  ru: {
    onboardingLink: "Онбординг",
    teacherLink: "Учителю",
    workbookLink: "Тренажёр",
    kicker: "КАТАЛОГ ПРЕДМЕТОВ BILIMAI",
    title: "Выберите предмет для изучения",
    subtitle:
      "В каждом предмете доступны пошаговые интерактивные уроки, проверка понимания, Лаборатория ошибок, карта пререквизитов, диагностика и ИИ-репетитор.",
    searchPlaceholder: "Поиск предмета или темы (например: Физика, Python, ДНК, Ханство)...",
    levelFilterAll: "Все уровни",
    levelBasic: "Базовый (с нуля)",
    levelIntermediate: "Средний",
    levelAdvanced: "Продвинутый / Профиль",
    categories: {
      all: "Все направления (12)",
      stem: "Точные науки и IT",
      natural_science: "Естественные науки",
      humanities: "История, Право и Общество",
      languages: "Языки и чтение",
      mandatory: "Базовая грамотность",
      custom: "Дополнительные курсы"
    },
    starterBadge: "Стартовый курс",
    expandedBadge: "Расширенный курс",
    completedLabel: "Пройдено:",
    ofWord: "из",
    accuracyLabel: "Точность:",
    notAssessed: "Ещё не оценено",
    openSubjectBtn: "Открыть предмет →",
    diagnosticBtn: "Диагностика",
    firstLessonBtn: "1-й урок",
    noMatches: "По вашему запросу предметы не найдены. Попробуйте сбросить фильтр."
  },
  kk: {
    onboardingLink: "Онбординг",
    teacherLink: "Мұғалімге",
    workbookLink: "Тренажёр",
    kicker: "BILIMAI ПӘНДЕР КАТАЛОГЫ",
    title: "Оқу үшін пәнді таңдаңыз",
    subtitle:
      "Әр пәнде қадамдық интерактивті сабақтар, түсінгенді тексеру, Қателер зертханасы, білім картасы, диагностика және ЖИ-репетитор бар.",
    searchPlaceholder: "Пәнді немесе тақырыпты іздеу (мысалы: Физика, Python, ДНҚ)...",
    levelFilterAll: "Барлық деңгейлер",
    levelBasic: "Базалық (нөлден)",
    levelIntermediate: "Орташа",
    levelAdvanced: "Күрделі / Профиль",
    categories: {
      all: "Барлық бағыттар (12)",
      stem: "Нақты ғылымдар және IT",
      natural_science: "Жаратылыстану ғылымдары",
      humanities: "Тарих, Құқық және Қоғам",
      languages: "Тілдер және оқу",
      mandatory: "Базалық сауаттылық",
      custom: "Қосымша курстар"
    },
    starterBadge: "Бастапқы курс",
    expandedBadge: "Кеңейтілген курс",
    completedLabel: "Өтілді:",
    ofWord: "/",
    accuracyLabel: "Дәлдік:",
    notAssessed: "Әлі бағаланбаған",
    openSubjectBtn: "Пәнді ашу →",
    diagnosticBtn: "Диагностика",
    firstLessonBtn: "1-сабақ",
    noMatches: "Сұраныс бойынша пәндер табылмады."
  },
  uz: {
    onboardingLink: "Onbording",
    teacherLink: "O‘qituvchiga",
    workbookLink: "Trenajyor",
    kicker: "BILIMAI FANLAR KATALOGI",
    title: "O‘rganish uchun fanni tanlang",
    subtitle:
      "Har bir fanda qadam-baqadam interaktiv darslar, amaliy mashqlar, Xatolar laboratoriyasi, bilimlar xaritasi, diagnostika va SI-repetitor mavjud.",
    searchPlaceholder: "Fan yoki mavzuni qidirish (masalan: Fizika, Python, DNK)...",
    levelFilterAll: "Barcha darajalar",
    levelBasic: "Bazaviy (noldan)",
    levelIntermediate: "O‘rta",
    levelAdvanced: "Yuqori / Profil",
    categories: {
      all: "Barcha yo‘nalishlar (12)",
      stem: "Aniq fanlar va IT",
      natural_science: "Tabiiy fanlar",
      humanities: "Tarix, Huquq va Jamiyat",
      languages: "Tillar va o‘qish",
      mandatory: "Bazaviy savodxonlik",
      custom: "Qo‘shimcha kurslar"
    },
    starterBadge: "Boshlang‘ich kurs",
    expandedBadge: "Kengaytirilgan kurs",
    completedLabel: "O‘tildi:",
    ofWord: "/",
    accuracyLabel: "Aniqlik:",
    notAssessed: "Hali baholanmagan",
    openSubjectBtn: "Fanni ochish →",
    diagnosticBtn: "Diagnostika",
    firstLessonBtn: "1-dars",
    noMatches: "So‘rovingiz bo‘yicha fanlar topilmadi."
  }
};

export default function SubjectsCatalogPage() {
  const [locale, setLocale] = useState<Locale>("ru");
  const [categoryFilter, setCategoryFilter] = useState<
    UniversalSubjectCurriculum["category"] | "all"
  >("all");
  const [levelFilter, setLevelFilter] = useState<"all" | "basic" | "intermediate" | "advanced">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [progressState, setProgressState] = useState<UniversalPlatformProgressState>(() =>
    createDefaultUniversalProgressState()
  );

  const curricula = useMemo(() => getAllSubjectCurricula(), []);

  useEffect(() => {
    try {
      const savedLocale =
        window.localStorage.getItem(LOCALE_STORAGE_KEY) ??
        window.localStorage.getItem(LEGACY_LANG_STORAGE_KEY);
      if (savedLocale === "ru" || savedLocale === "kk" || savedLocale === "uz") {
        setLocale(savedLocale);
      }
      const rawV2 = window.localStorage.getItem(UNIVERSAL_PROGRESS_STORAGE_KEY);
      const rawLegacy = window.localStorage.getItem("bilimai-lab-v1");
      const migrated = migrateUniversalProgressState(rawV2, rawLegacy);
      setProgressState(migrated);
      window.localStorage.setItem(UNIVERSAL_PROGRESS_STORAGE_KEY, JSON.stringify(migrated));
    } catch {
      // ignore
    }
  }, []);

  const handleLocaleChange = (nextLocale: Locale) => {
    setLocale(nextLocale);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
      window.localStorage.setItem(LEGACY_LANG_STORAGE_KEY, nextLocale);
    } catch {
      // ignore
    }
  };

  const ui = CATALOG_I18N[locale];

  const filteredCurricula = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return curricula.filter((subj) => {
      if (categoryFilter !== "all" && subj.category !== categoryFilter) {
        return false;
      }
      if (levelFilter !== "all") {
        const hasDifficulty = subj.lessons.some((l) => l.difficulty === levelFilter);
        if (!hasDifficulty) return false;
      }
      if (q.length > 0) {
        const hay = `${subj.title[locale]} ${subj.description[locale]} ${subj.badge} ${subj.lessons
          .map((l) => l.title[locale])
          .join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [curricula, categoryFilter, levelFilter, searchQuery, locale]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg, #f7f5ef)", color: "var(--ink, #171717)" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "rgba(247, 245, 239, 0.94)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--border, #e4e1d8)",
          padding: "12px 16px"
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link
              href="/welcome"
              style={{
                fontWeight: 800,
                fontSize: 19,
                textDecoration: "none",
                color: "var(--ink, #171717)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8
              }}
            >
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 9,
                  background: "var(--accent, #3856f5)",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 800
                }}
              >
                B
              </span>
              <span>BilimAI</span>
            </Link>

            <Link
              href="/welcome"
              style={{
                fontSize: 13.5,
                color: "var(--muted, #65635d)",
                textDecoration: "none",
                fontWeight: 600
              }}
            >
              {ui.onboardingLink}
            </Link>

            <Link
              href="/teacher"
              style={{
                fontSize: 13.5,
                color: "var(--muted, #65635d)",
                textDecoration: "none",
                fontWeight: 600
              }}
            >
              {ui.teacherLink}
            </Link>

            <Link
              href="/"
              style={{
                fontSize: 13.5,
                color: "var(--muted, #65635d)",
                textDecoration: "none",
                fontWeight: 600
              }}
            >
              {ui.workbookLink}
            </Link>
          </div>

          <div
            role="group"
            aria-label="Язык интерфейса"
            style={{
              display: "inline-flex",
              borderRadius: 10,
              border: "1px solid var(--border, #dcd8ce)",
              overflow: "hidden",
              background: "var(--surface, #fff)"
            }}
          >
            {(["ru", "kk", "uz"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                data-testid={`catalog-lang-${lang}`}
                onClick={() => handleLocaleChange(lang)}
                style={{
                  padding: "6px 10px",
                  border: "none",
                  background: locale === lang ? "var(--accent, #3856f5)" : "transparent",
                  color: locale === lang ? "#fff" : "inherit",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                {lang === "ru" ? "RU" : lang === "kk" ? "ҚАЗ" : "OʻZB"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "28px 16px 80px",
          display: "grid",
          gap: 22
        }}
      >
        <section style={{ display: "grid", gap: 8 }}>
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              color: "var(--accent, #3856f5)",
              letterSpacing: "0.04em"
            }}
          >
            {ui.kicker}
          </span>
          <h1 style={{ margin: 0, fontSize: "clamp(24px, 3.2vw, 34px)", lineHeight: 1.2 }}>
            {ui.title}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 16,
              color: "var(--muted, #57544e)",
              maxWidth: 780,
              lineHeight: 1.5
            }}
          >
            {ui.subtitle}
          </p>
        </section>

        {/* Search & Level filter bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "center"
          }}
        >
          <input
            type="search"
            data-testid="catalog-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={ui.searchPlaceholder}
            style={{
              flex: "1 1 280px",
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid var(--border, #dcd8ce)",
              background: "var(--surface, #fff)",
              fontSize: 14.5
            }}
          />

          <select
            aria-label="Level filter"
            data-testid="catalog-level-filter"
            value={levelFilter}
            onChange={(e) =>
              setLevelFilter(e.target.value as "all" | "basic" | "intermediate" | "advanced")
            }
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid var(--border, #dcd8ce)",
              background: "var(--surface, #fff)",
              fontSize: 14,
              fontWeight: 600
            }}
          >
            <option value="all">{ui.levelFilterAll}</option>
            <option value="basic">{ui.levelBasic}</option>
            <option value="intermediate">{ui.levelIntermediate}</option>
            <option value="advanced">{ui.levelAdvanced}</option>
          </select>
        </div>

        {/* Category Filter Tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {(["all", "stem", "natural_science", "humanities", "languages", "mandatory"] as const).map(
            (cat) => {
              const active = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  data-testid={`catalog-category-${cat}`}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: active
                      ? "1px solid var(--accent, #3856f5)"
                      : "1px solid var(--border, #dcd8ce)",
                    background: active ? "var(--accent, #3856f5)" : "var(--surface, #fff)",
                    color: active ? "#fff" : "inherit",
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  {ui.categories[cat]}
                </button>
              );
            }
          )}
        </div>

        {/* Subject Grid */}
        {filteredCurricula.length === 0 ? (
          <div
            style={{
              padding: 24,
              borderRadius: 16,
              background: "var(--surface, #fff)",
              border: "1px solid var(--border, #e4e1d8)",
              fontSize: 15,
              color: "var(--muted, #57544e)"
            }}
          >
            {ui.noMatches}
          </div>
        ) : (
          <div
            data-testid="subjects-catalog-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
              gap: 16
            }}
          >
            {filteredCurricula.map((subj) => {
              const metrics = getSubjectSummaryMetrics(
                progressState,
                subj.id,
                subj.lessons.length
              );
              const totalQuestions = subj.lessons.reduce(
                (acc, l) => acc + l.questions.length,
                0
              );
              const firstLessonId = subj.lessons[0]?.id ?? "";
              const isExpandedCourse = subj.readinessStatus === "full_course";

              return (
                <article
                  key={subj.id}
                  data-testid={`subject-card-${subj.id}`}
                  style={{
                    background: "var(--surface, #ffffff)",
                    border: "1px solid var(--border, #e4e1d8)",
                    borderRadius: 18,
                    padding: "18px 20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 14
                  }}
                >
                  <div style={{ display: "grid", gap: 8 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                        flexWrap: "wrap"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: 999,
                            background: `${subj.accentColor}18`,
                            color: subj.accentColor,
                            fontSize: 11.5,
                            fontWeight: 800
                          }}
                        >
                          {subj.badge}
                        </span>
                        <span
                          data-testid={`subject-readiness-${subj.id}`}
                          style={{
                            padding: "3px 8px",
                            borderRadius: 999,
                            background: isExpandedCourse
                              ? "rgba(22, 163, 74, 0.12)"
                              : "rgba(56, 86, 245, 0.1)",
                            color: isExpandedCourse ? "#15803d" : "var(--accent, #3856f5)",
                            fontSize: 11,
                            fontWeight: 700
                          }}
                        >
                          {isExpandedCourse ? ui.expandedBadge : ui.starterBadge}
                        </span>
                      </div>
                      <span style={{ fontSize: 12, color: "var(--muted, #65635d)" }}>
                        {formatModulesCountLabel(subj.modules.length, locale)} ·{" "}
                        {formatLessonsCountLabel(subj.lessons.length, locale)} ·{" "}
                        {formatQuestionsCountLabel(totalQuestions, locale)}
                      </span>
                    </div>

                    <h2 style={{ margin: 0, fontSize: 19, lineHeight: 1.25 }}>
                      {subj.title[locale]}
                    </h2>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        lineHeight: 1.48,
                        color: "var(--muted, #57544e)"
                      }}
                    >
                      {subj.shortDescription[locale]}
                    </p>
                  </div>

                  <div style={{ display: "grid", gap: 10 }}>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "var(--muted, #65635d)",
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                    >
                      <span>
                        {ui.completedLabel} {metrics.completedLessons} {ui.ofWord}{" "}
                        {formatLessonsCountLabel(metrics.totalLessons, locale)}
                      </span>
                      <span>
                        {metrics.averageAccuracyPercent !== null
                          ? `${ui.accuracyLabel} ${metrics.averageAccuracyPercent}%`
                          : ui.notAssessed}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Link
                        href={`/subjects/${subj.id}?lang=${locale}`}
                        data-testid={`open-subject-${subj.id}`}
                        style={{
                          flex: "1 1 auto",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "10px 14px",
                          borderRadius: 12,
                          background: "var(--accent, #3856f5)",
                          color: "#ffffff",
                          textDecoration: "none",
                          fontWeight: 700,
                          fontSize: 14
                        }}
                      >
                        {ui.openSubjectBtn}
                      </Link>
                      <Link
                        href={`/subjects/${subj.id}?start=diagnostic&lang=${locale}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "10px 12px",
                          borderRadius: 12,
                          border: "1px solid var(--border, #dcd8ce)",
                          background: "var(--surface, #fff)",
                          color: "inherit",
                          textDecoration: "none",
                          fontWeight: 600,
                          fontSize: 13
                        }}
                      >
                        {ui.diagnosticBtn}
                      </Link>
                      {firstLessonId && (
                        <Link
                          href={`/subjects/${subj.id}/lessons/${encodeURIComponent(firstLessonId)}?lang=${locale}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "10px 12px",
                            borderRadius: 12,
                            border: "1px solid var(--border, #dcd8ce)",
                            background: "var(--surface, #fff)",
                            color: "inherit",
                            textDecoration: "none",
                            fontWeight: 600,
                            fontSize: 13
                          }}
                        >
                          {ui.firstLessonBtn}
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
