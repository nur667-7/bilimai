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
    navToday: string;
    navSubjects: string;
    navUnt: string;
    navProgress: string;
    navProfile: string;
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
    categories: Record<UniversalSubjectCurriculum["category"] | "all" | "profile", string>;
    starterBadge: string;
    expandedBadge: string;
    mandatoryUntBadge: string;
    profileUntBadge: string;
    completedLabel: string;
    ofWord: string;
    accuracyLabel: string;
    notAssessed: string;
    openSubjectBtn: string;
    diagnosticBtn: string;
    firstLessonBtn: string;
    noMatches: string;
    resetFiltersBtn: string;
  }
> = {
  ru: {
    navToday: "Сегодня",
    navSubjects: "Предметы (12)",
    navUnt: "Пробное ЕНТ",
    navProgress: "Мой прогресс",
    navProfile: "Профиль",
    onboardingLink: "Онбординг",
    teacherLink: "Учителю",
    workbookLink: "Тренажёр",
    kicker: "КАТАЛОГ ПРЕДМЕТОВ BILIMAI",
    title: "Выберите предмет для изучения",
    subtitle:
      "3 обязательных и 9 профильных предметов ЕНТ: пошаговые уроки, интерактивные практикумы, Лаборатория ошибок, карта пререквизитов, диагностика и ИИ-репетитор.",
    searchPlaceholder: "Поиск предмета или темы (например: История Казахстана, Физика, Python, ДНК)...",
    levelFilterAll: "Все уровни",
    levelBasic: "Базовый (с нуля)",
    levelIntermediate: "Средний",
    levelAdvanced: "Продвинутый / Профиль",
    categories: {
      all: "Все направления (12)",
      mandatory: "Обязательные ЕНТ (3)",
      profile: "Профильные ЕНТ (9)",
      stem: "Точные науки и IT",
      natural_science: "Естественные науки",
      humanities: "История, Право и Общество",
      languages: "Языки и чтение",
      custom: "Дополнительные курсы"
    },
    starterBadge: "Стартовый курс",
    expandedBadge: "Расширенный курс",
    mandatoryUntBadge: "Обязательный ЕНТ",
    profileUntBadge: "Профильный ЕНТ",
    completedLabel: "Материалы:",
    ofWord: "из",
    accuracyLabel: "Навыки:",
    notAssessed: "Ещё не оценено",
    openSubjectBtn: "Открыть предмет →",
    diagnosticBtn: "Диагностика",
    firstLessonBtn: "1-й урок",
    noMatches: "По вашему запросу предметы не найдены. Попробуйте изменить запрос или сбросить фильтр.",
    resetFiltersBtn: "Сбросить фильтры"
  },
  kk: {
    navToday: "Бүгін",
    navSubjects: "Пәндер (12)",
    navUnt: "Байқау ҰБТ",
    navProgress: "Менің прогресім",
    navProfile: "Профиль",
    onboardingLink: "Онбординг",
    teacherLink: "Мұғалімге",
    workbookLink: "Тренажёр",
    kicker: "BILIMAI ПӘНДЕР КАТАЛОГЫ",
    title: "Оқу үшін пәнді таңдаңыз",
    subtitle:
      "ҰБТ-ның 3 міндетті және 9 бейіндік пәні: қадамдық интерактивті сабақтар, Қателер зертханасы, білім картасы, диагностика және ЖИ-репетитор.",
    searchPlaceholder: "Пәнді немесе тақырыпты іздеу (мысалы: Қазақстан тарихы, Физика, Python)...",
    levelFilterAll: "Барлық деңгейлер",
    levelBasic: "Базалық (нөлден)",
    levelIntermediate: "Орташа",
    levelAdvanced: "Күрделі / Профиль",
    categories: {
      all: "Барлық бағыттар (12)",
      mandatory: "Міндетті ҰБТ (3)",
      profile: "Бейіндік ҰБТ (9)",
      stem: "Нақты ғылымдар және IT",
      natural_science: "Жаратылыстану ғылымдары",
      humanities: "Тарих, Құқық және Қоғам",
      languages: "Тілдер және оқу",
      custom: "Қосымша курстар"
    },
    starterBadge: "Бастапқы курс",
    expandedBadge: "Кеңейтілген курс",
    mandatoryUntBadge: "Міндетті ҰБТ",
    profileUntBadge: "Бейіндік ҰБТ",
    completedLabel: "Материал:",
    ofWord: "/",
    accuracyLabel: "Дағдылар:",
    notAssessed: "Әлі бағаланбаған",
    openSubjectBtn: "Пәнді ашу →",
    diagnosticBtn: "Диагностика",
    firstLessonBtn: "1-сабақ",
    noMatches: "Сұраныс бойынша пәндер табылмады.",
    resetFiltersBtn: "Сүзгіні тазарту"
  },
  uz: {
    navToday: "Bugun",
    navSubjects: "Fanlar (12)",
    navUnt: "Sinov imtihoni",
    navProgress: "Mening progressim",
    navProfile: "Profil",
    onboardingLink: "Onbording",
    teacherLink: "O‘qituvchiga",
    workbookLink: "Trenajyor",
    kicker: "BILIMAI FANLAR KATALOGI",
    title: "O‘rganish uchun fanni tanlang",
    subtitle:
      "3 ta majburiy va 9 ta ixtisoslik fani: qadam-baqadam interaktiv darslar, Xatolar laboratoriyasi, bilimlar xaritasi, diagnostika va SI-repetitor.",
    searchPlaceholder: "Fan yoki mavzuni qidirish (masalan: Qozog‘iston tarixi, Fizika, Python)...",
    levelFilterAll: "Barcha darajalar",
    levelBasic: "Bazaviy (noldan)",
    levelIntermediate: "O‘rta",
    levelAdvanced: "Yuqori / Profil",
    categories: {
      all: "Barcha yo‘nalishlar (12)",
      mandatory: "Majburiy fanlar (3)",
      profile: "Ixtisoslik fanlari (9)",
      stem: "Aniq fanlar va IT",
      natural_science: "Tabiiy fanlar",
      humanities: "Tarix, Huquq va Jamiyat",
      languages: "Tillar va o‘qish",
      custom: "Qo‘shimcha kurslar"
    },
    starterBadge: "Boshlang‘ich kurs",
    expandedBadge: "Kengaytirilgan kurs",
    mandatoryUntBadge: "Majburiy fan",
    profileUntBadge: "Ixtisoslik fani",
    completedLabel: "Material:",
    ofWord: "/",
    accuracyLabel: "Ko‘nikma:",
    notAssessed: "Hali baholanmagan",
    openSubjectBtn: "Fanni ochish →",
    diagnosticBtn: "Diagnostika",
    firstLessonBtn: "1-dars",
    noMatches: "So‘rovingiz bo‘yicha fanlar topilmadi.",
    resetFiltersBtn: "Filtrlarni tozalash"
  }
};

import { useAniqTheme, ThemeToggleButton } from "@/components/hero-canvas";

export default function SubjectsCatalogPage() {
  const { dark, toggleTheme } = useAniqTheme();
  const [locale, setLocale] = useState<Locale>("ru");
  const [categoryFilter, setCategoryFilter] = useState<
    UniversalSubjectCurriculum["category"] | "all" | "profile"
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
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get("lang");
      const savedLocale =
        urlLang === "ru" || urlLang === "kk" || urlLang === "uz"
          ? urlLang
          : window.localStorage.getItem(LOCALE_STORAGE_KEY) ??
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
  const themeLightAction =
    locale === "kk"
      ? "Жарық тақырыпты қосу"
      : locale === "uz"
        ? "Yorug‘ mavzuni yoqish"
        : "Включить светлую тему";
  const themeDarkAction =
    locale === "kk"
      ? "Қараңғы тақырыпты қосу"
      : locale === "uz"
        ? "Qorong‘i mavzuni yoqish"
        : "Включить тёмную тему";

  const filteredCurricula = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return curricula.filter((subj) => {
      const isMand =
        subj.id === "history_kz" ||
        subj.id === "math_lit" ||
        subj.id === "math_literacy" ||
        subj.id === "reading_lit" ||
        subj.id === "reading_literacy";
      if (categoryFilter === "mandatory") {
        if (!isMand) return false;
      } else if (categoryFilter === "profile") {
        if (isMand) return false;
      } else if (categoryFilter !== "all" && subj.category !== categoryFilter) {
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
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bilimai-bg, #FAFAF8)",
        color: "var(--bilimai-text, #202522)"
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "var(--bilimai-header-bg, rgba(250, 250, 248, 0.94))",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--bilimai-border, #DCE2DD)",
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
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <Link
              href={`/welcome?lang=${locale}`}
              style={{
                fontWeight: 800,
                fontSize: 19,
                textDecoration: "none",
                color: "var(--bilimai-text, #202522)",
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
                  background: "var(--bilimai-brand, #156D5D)",
                  color: "var(--bilimai-on-brand, #fff)",
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

            <nav
              aria-label="Глобальная навигация"
              style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}
            >
              <Link
                href={`/?tab=today&lang=${locale}`}
                style={{
                  fontSize: 13.5,
                  color: "var(--bilimai-text-muted, #525D56)",
                  textDecoration: "none",
                  fontWeight: 600,
                  padding: "7px 10px",
                  minHeight: 38,
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 8
                }}
              >
                {ui.navToday}
              </Link>
              <Link
                href={`/subjects?lang=${locale}`}
                style={{
                  fontSize: 13.5,
                  color: "var(--bilimai-brand-text, #0F5346)",
                  background: "var(--bilimai-selected-bg, #E6F2EF)",
                  textDecoration: "none",
                  fontWeight: 700,
                  padding: "7px 10px",
                  minHeight: 38,
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 8
                }}
              >
                {ui.navSubjects}
              </Link>
              <Link
                href={`/?tab=exam&lang=${locale}`}
                style={{
                  fontSize: 13.5,
                  color: "var(--bilimai-text-muted, #525D56)",
                  textDecoration: "none",
                  fontWeight: 600,
                  padding: "7px 10px",
                  minHeight: 38,
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 8
                }}
              >
                {ui.navUnt}
              </Link>
              <Link
                href={`/?tab=roadmap&lang=${locale}`}
                style={{
                  fontSize: 13.5,
                  color: "var(--bilimai-text-muted, #525D56)",
                  textDecoration: "none",
                  fontWeight: 600,
                  padding: "7px 10px",
                  minHeight: 38,
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 8
                }}
              >
                {ui.navProgress}
              </Link>
              <Link
                href="/teacher"
                style={{
                  fontSize: 13.5,
                  color: "var(--bilimai-text-muted, #525D56)",
                  textDecoration: "none",
                  fontWeight: 600,
                  padding: "7px 10px",
                  minHeight: 38,
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 8
                }}
              >
                {ui.teacherLink}
              </Link>
            </nav>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              role="group"
              aria-label="Язык интерфейса"
              style={{
                display: "inline-flex",
                borderRadius: 10,
                border: "1px solid var(--bilimai-border, #DCE2DD)",
                overflow: "hidden",
                background: "var(--bilimai-surface, #fff)"
              }}
            >
              {(["ru", "kk", "uz"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  data-testid={`catalog-lang-${lang}`}
                  aria-pressed={locale === lang}
                  onClick={() => handleLocaleChange(lang)}
                  style={{
                    padding: "6px 10px",
                    minHeight: 38,
                    border: "none",
                    background: locale === lang ? "var(--bilimai-brand, #156D5D)" : "transparent",
                    color:
                      locale === lang
                        ? "var(--bilimai-on-brand, #fff)"
                        : "var(--bilimai-text, #202522)",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {lang === "ru" ? "RU" : lang === "kk" ? "ҚАЗ" : "OʻZB"}
                </button>
              ))}
            </div>

            <ThemeToggleButton
              dark={dark}
              onToggle={toggleTheme}
              lightActionLabel={themeLightAction}
              darkActionLabel={themeDarkAction}
            />

            <Link
              href={`/login?lang=${locale}`}
              style={{
                padding: "8px 12px",
                minHeight: 38,
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 10,
                border: "1px solid var(--bilimai-border, #DCE2DD)",
                background: "var(--bilimai-surface, #fff)",
                textDecoration: "none",
                color: "var(--bilimai-text, #202522)",
                fontSize: 13,
                fontWeight: 600
              }}
            >
              {ui.navProfile}
            </Link>
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
        <section style={{ display: "grid", gap: 6 }}>
          <h1 style={{ margin: 0, fontSize: "clamp(24px, 3.2vw, 34px)", lineHeight: 1.2 }}>
            {ui.title}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 15.5,
              color: "var(--bilimai-text-muted, #525D56)",
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
              minHeight: 42,
              borderRadius: 12,
              border: "1px solid var(--bilimai-border, #DCE2DD)",
              background: "var(--bilimai-surface, #fff)",
              color: "var(--bilimai-text, #202522)",
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
              minHeight: 42,
              borderRadius: 12,
              border: "1px solid var(--bilimai-border, #DCE2DD)",
              background: "var(--bilimai-surface, #fff)",
              color: "var(--bilimai-text, #202522)",
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
          {(["all", "mandatory", "profile", "stem", "natural_science", "humanities", "languages"] as const).map(
            (cat) => {
              const active = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  data-testid={`catalog-category-${cat}`}
                  aria-pressed={active}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    padding: "8px 14px",
                    minHeight: 38,
                    borderRadius: 999,
                    border: active
                      ? "1px solid var(--bilimai-brand, #156D5D)"
                      : "1px solid var(--bilimai-border, #DCE2DD)",
                    background: active
                      ? "var(--bilimai-brand, #156D5D)"
                      : "var(--bilimai-surface, #fff)",
                    color: active
                      ? "var(--bilimai-on-brand, #fff)"
                      : "var(--bilimai-text, #202522)",
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
              background: "var(--bilimai-surface, #fff)",
              border: "1px solid var(--bilimai-border, #DCE2DD)",
              fontSize: 15,
              color: "var(--bilimai-text-muted, #525D56)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12
            }}
          >
            <span>{ui.noMatches}</span>
            <button
              type="button"
              data-testid="catalog-reset-filters-btn"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
                setLevelFilter("all");
              }}
              style={{
                padding: "9px 14px",
                minHeight: 38,
                borderRadius: 10,
                border: "1px solid var(--bilimai-selected-border, #156D5D)",
                background: "var(--bilimai-selected-bg, #E6F2EF)",
                color: "var(--bilimai-brand-text, #0F5346)",
                fontWeight: 700,
                fontSize: 13.5,
                cursor: "pointer"
              }}
            >
              {ui.resetFiltersBtn}
            </button>
          </div>
        ) : (
          <div
            data-testid="subjects-catalog-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 290px), 1fr))",
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
              const isMandatoryUnt =
                subj.id === "history_kz" ||
                subj.id === "math_lit" ||
                subj.id === "math_literacy" ||
                subj.id === "reading_lit" ||
                subj.id === "reading_literacy";

              return (
                <article
                  key={subj.id}
                  data-testid={`subject-card-${subj.id}`}
                  style={{
                    background: "var(--bilimai-surface, #ffffff)",
                    border: "1px solid var(--bilimai-border, #DCE2DD)",
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
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: 999,
                            background: "var(--bilimai-selected-bg, #E6F2EF)",
                            color: "var(--bilimai-selected-text, #0F5346)",
                            fontSize: 11.5,
                            fontWeight: 800
                          }}
                        >
                          {subj.badge}
                        </span>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: 999,
                            background: isMandatoryUnt
                              ? "var(--bilimai-selected-bg, #E6F2EF)"
                              : "var(--bilimai-surface-raised, #F0F2EF)",
                            color: isMandatoryUnt
                              ? "var(--bilimai-brand-text, #0F5346)"
                              : "var(--bilimai-text-muted, #525D56)",
                            fontSize: 11,
                            fontWeight: 700
                          }}
                        >
                          {isMandatoryUnt ? ui.mandatoryUntBadge : ui.profileUntBadge}
                        </span>
                        <span
                          data-testid={`subject-readiness-${subj.id}`}
                          style={{
                            padding: "3px 8px",
                            borderRadius: 999,
                            background: isExpandedCourse
                              ? "var(--bilimai-success-bg, #ECFDF5)"
                              : "var(--bilimai-surface-raised, #F0F2EF)",
                            color: isExpandedCourse
                              ? "var(--bilimai-success-text, #065F46)"
                              : "var(--bilimai-text-muted, #525D56)",
                            fontSize: 11,
                            fontWeight: 700
                          }}
                        >
                          {isExpandedCourse ? ui.expandedBadge : ui.starterBadge}
                        </span>
                      </div>
                      <span style={{ fontSize: 12, color: "var(--bilimai-text-muted, #525D56)" }}>
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
                        color: "var(--bilimai-text-muted, #525D56)"
                      }}
                    >
                      {subj.shortDescription[locale]}
                    </p>
                  </div>

                  <div style={{ display: "grid", gap: 10 }}>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "var(--bilimai-text-muted, #525D56)",
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 10px",
                        borderRadius: 10,
                        background: "var(--bilimai-surface-raised, #F0F2EF)"
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
                          minHeight: 40,
                          borderRadius: 12,
                          background: "var(--bilimai-brand, #156D5D)",
                          color: "var(--bilimai-on-brand, #ffffff)",
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
                          minHeight: 40,
                          borderRadius: 12,
                          border: "1px solid var(--bilimai-border, #DCE2DD)",
                          background: "var(--bilimai-surface, #fff)",
                          color: "var(--bilimai-text, #202522)",
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
                            minHeight: 40,
                            borderRadius: 12,
                            border: "1px solid var(--bilimai-border, #DCE2DD)",
                            background: "var(--bilimai-surface, #fff)",
                            color: "var(--bilimai-text, #202522)",
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
