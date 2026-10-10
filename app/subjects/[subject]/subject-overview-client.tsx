"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/curriculum";
import {
  getSubjectCurriculum,
  getAllSubjectCurricula,
  buildUniversalSubjectGraph,
  findSubjectLessonByIdOrSlug,
  computeRecommendedLessonForSubject,
  formatLessonsCountLabel,
  formatQuestionsCountLabel,
  type UniversalSubjectCurriculum,
  type UniversalLesson
} from "@/lib/universal-curriculum";
import {
  advanceLessonQuestionIndex,
  type UniversalQuestion,
  type UniversalQuestionEvaluation
} from "@/lib/question-engine";
import {
  UNIVERSAL_PROGRESS_STORAGE_KEY,
  createDefaultUniversalProgressState,
  migrateUniversalProgressState,
  getSubjectProgress,
  getSubjectSummaryMetrics,
  recordSubjectLessonInteraction,
  recordSubjectLessonCompletion,
  recordSubjectQuestionAttempt,
  recordSubjectDiagnosticAttempt,
  recordSubjectErrorLabCompletion,
  type DiagnosticQuestionResponseRecord,
  type UniversalPlatformProgressState
} from "@/lib/universal-progress";
import { UniversalQuestionRenderer } from "@/components/study/universal-question-renderer";

export type SubjectWorkspaceTab =
  | "overview"
  | "lesson"
  | "practice"
  | "error_lab"
  | "map"
  | "tutor"
  | "diagnostic";

const LOCALE_STORAGE_KEY = "bilimai-locale-v1";
const LEGACY_LANG_STORAGE_KEY = "bilimai-lang";

function parseStartModeToTab(rawStart?: string | null): SubjectWorkspaceTab {
  if (!rawStart) return "overview";
  const clean = rawStart.trim().toLowerCase();
  switch (clean) {
    case "overview":
      return "overview";
    case "lesson":
    case "lessons":
      return "lesson";
    case "practice":
      return "practice";
    case "diagnostic":
    case "diagnostics":
      return "diagnostic";
    case "map":
    case "graph":
      return "map";
    case "tutor":
    case "ai":
      return "tutor";
    case "error_lab":
    case "lab":
      return "error_lab";
    default:
      return "overview";
  }
}

function parseLocaleParam(raw?: string | null): Locale | null {
  if (raw === "ru" || raw === "kk" || raw === "uz") return raw;
  return null;
}

const WORKSPACE_I18N: Record<
  Locale,
  {
    allSubjects: string;
    workbookLink: string;
    progressPrefix: string;
    ofWord: string;
    accuracyPrefix: string;
    notAssessedYet: string;
    levelPrefix: string;
    ctaStartFirstLesson: string;
    ctaCheckLevel: string;
    ctaOpenTopicMap: string;
    ctaGoPractice: string;
    tabs: Record<SubjectWorkspaceTab, string>;
    untSimulatorBtn: string;
    recommendedNextKicker: string;
    openLessonBtn: string;
    startRecommendedLessonBtn: string;
    programTitle: string;
    lessonWord: string;
    lessonCompletedBadge: string;
    lessonReadBadge: string;
    goalPrefix: string;
    repeatLessonBtn: string;
    studyLessonBtn: string;
    keyExplanationTitle: string;
    explainSimplerBtn: string;
    deepBreakdownBtn: string;
    workedExampleTitle: string;
    takeawayPrefix: string;
    understandingCheckTitle: string;
    allLessonQuestionsDone: string;
    nextLessonQuestionBtn: string;
    toLessonSummaryBtn: string;
    lessonSummaryTitle: string;
    completeLessonBtn: string;
    lessonDoneBtn: string;
    nextLessonBtn: string;
    practiceTitle: string;
    errorLabBadge: string;
    errorLabPromptSuffix: string;
    errorLabCorrectHit: string;
    errorLabWrongHit: string;
    correctStepPrefix: string;
    transferQuestionTitle: string;
    mapTitle: string;
    mapSubtitle: string;
    prereqPrefix: string;
    noPrereqs: string;
    unlocksPrefix: string;
    toTopicLessonBtn: string;
    statusMastered: string;
    statusReview: string;
    statusGap: string;
    statusRecommended: string;
    statusUnassessed: string;
    tutorTitle: string;
    tutorSubtitlePrefix: string;
    tutorEmptyHint: string;
    tutorPlaceholder: string;
    tutorSendBtn: string;
    tutorLoadingBtn: string;
    diagTitle: string;
    diagSubtitle: string;
    diagNextBtn: string;
    diagDoneTitle: string;
    diagConfidencePrefix: string;
    diagViewMapBtn: string;
  }
> = {
  ru: {
    allSubjects: "Все предметы (12)",
    workbookLink: "Рабочая тетрадь",
    progressPrefix: "Прогресс по предмету:",
    ofWord: "из",
    accuracyPrefix: "Точность",
    notAssessedYet: "Ещё не оценено",
    levelPrefix: "Уровень",
    ctaStartFirstLesson: "Начать с первого урока",
    ctaCheckLevel: "Проверить уровень (5–10 минут)",
    ctaOpenTopicMap: "Открыть карту тем",
    ctaGoPractice: "Перейти к практике",
    tabs: {
      overview: "Обзор курса",
      lesson: "Урок",
      practice: "Практика",
      error_lab: "Лаборатория ошибок",
      map: "Карта знаний",
      tutor: "ИИ-репетитор",
      diagnostic: "Диагностика"
    },
    untSimulatorBtn: "Тренажёр ЕНТ по предмету →",
    recommendedNextKicker: "РЕКОМЕНДУЕМЫЙ СЛЕДУЮЩИЙ ШАГ",
    openLessonBtn: "Открыть урок →",
    startRecommendedLessonBtn: "Начать рекомендуемый урок →",
    programTitle: "Программа предмета",
    lessonWord: "Урок",
    lessonCompletedBadge: "✓ Урок прочитан",
    lessonReadBadge: "📖 Урок прочитан",
    goalPrefix: "Цель:",
    repeatLessonBtn: "Повторить урок",
    studyLessonBtn: "Изучить →",
    keyExplanationTitle: "1. Ключевое объяснение",
    explainSimplerBtn: "Объясни проще",
    deepBreakdownBtn: "Глубокий разбор",
    workedExampleTitle: "2. Пошаговый пример с разбором",
    takeawayPrefix: "📌 Вывод:",
    understandingCheckTitle: "3. Проверка понимания",
    allLessonQuestionsDone: "Все задания урока пройдены ✓",
    nextLessonQuestionBtn: "Следующий вопрос урока →",
    toLessonSummaryBtn: "К итогу урока →",
    lessonSummaryTitle: "Итог урока",
    completeLessonBtn: "Отметить урок завершённым",
    lessonDoneBtn: "Урок завершён ✓",
    nextLessonBtn: "Следующий урок →",
    practiceTitle: "Практика по предмету",
    errorLabBadge: "ЛАБОРАТОРИЯ ОШИБОК",
    errorLabPromptSuffix: "Нажмите на строку, где допущена первая логическая или предметная ошибка:",
    errorLabCorrectHit: "✓ Точно! Вы нашли сломанный шаг.",
    errorLabWrongHit: "Этот шаг корректен или является следствием. Проверьте другой шаг.",
    correctStepPrefix: "Верная запись:",
    transferQuestionTitle: "Задача на закрепление без этой ловушки:",
    mapTitle: "Карта знаний и пререквизитов",
    mapSubtitle:
      "Каждая тема связана с базовыми темами (пререквизитами). Статус «Освоено» выставляется только по проверенным ответам практики.",
    prereqPrefix: "Требует базу:",
    noPrereqs: "Базовая стартовая тема (без пререквизитов)",
    unlocksPrefix: "Открывает:",
    toTopicLessonBtn: "К уроку темы →",
    statusMastered: "Освоено",
    statusReview: "Повторить",
    statusGap: "Пробел",
    statusRecommended: "Учить следующим",
    statusUnassessed: "Ещё не оценено",
    tutorTitle: "ИИ-репетитор",
    tutorSubtitlePrefix: "Задайте вопрос по текущей теме или выберите один из 9 учебных режимов:",
    tutorEmptyHint:
      "Выберите один из 9 режимов выше или напишите свой вопрос — репетитор разберёт тему пошагово с прозрачной маркировкой источника (AI-generated / Deterministically verified).",
    tutorPlaceholder: "Напишите свой вопрос или шаг рассуждения...",
    tutorSendBtn: "Спросить ИИ",
    tutorLoadingBtn: "Разбираем...",
    diagTitle: "Экспресс-диагностика по предмету",
    diagSubtitle:
      "Ответьте на вопросы ключевых разделов, чтобы BilimAI определил ваш стартовый уровень и рекомендовал точный урок для закрытия пробелов.",
    diagNextBtn: "Следующий диагностический вопрос →",
    diagDoneTitle: "Диагностика завершена! Ваш проверенный результат:",
    diagConfidencePrefix: "Достоверность оценки:",
    diagViewMapBtn: "Посмотреть карту знаний"
  },
  kk: {
    allSubjects: "Барлық пәндер (12)",
    workbookLink: "Жұмыс дәптері",
    progressPrefix: "Пән бойынша прогресс:",
    ofWord: "/",
    accuracyPrefix: "Дәлдік",
    notAssessedYet: "Әлі бағаланбаған",
    levelPrefix: "Деңгей",
    ctaStartFirstLesson: "Бірінші сабақтан бастау",
    ctaCheckLevel: "Деңгейді тексеру (5–10 минут)",
    ctaOpenTopicMap: "Тақырыптар картасын ашу",
    ctaGoPractice: "Практикаға өту",
    tabs: {
      overview: "Курсқа шолу",
      lesson: "Сабақ",
      practice: "Практика",
      error_lab: "Қателер зертханасы",
      map: "Білім картасы",
      tutor: "ЖИ-репетитор",
      diagnostic: "Диагностика"
    },
    untSimulatorBtn: "Пән бойынша ҰБТ тренажері →",
    recommendedNextKicker: "ҰСЫНЫЛАТЫН КЕЛЕСІ ҚАДАМ",
    openLessonBtn: "Сабақты ашу →",
    startRecommendedLessonBtn: "Ұсынылған сабақты бастау →",
    programTitle: "Пән бағдарламасы",
    lessonWord: "Сабақ",
    lessonCompletedBadge: "✓ Сабақ оқылды",
    lessonReadBadge: "📖 Сабақ оқылды",
    goalPrefix: "Мақсаты:",
    repeatLessonBtn: "Сабақты қайталау",
    studyLessonBtn: "Оқу →",
    keyExplanationTitle: "1. Негізгі түсіндірме",
    explainSimplerBtn: "Қарапайым тілмен",
    deepBreakdownBtn: "Терең талдау",
    workedExampleTitle: "2. Қадамдық мысал мен талдау",
    takeawayPrefix: "📌 Қорытынды:",
    understandingCheckTitle: "3. Түсінгенді тексеру",
    allLessonQuestionsDone: "Сабақтың барлық тапсырмасы орындалды ✓",
    nextLessonQuestionBtn: "Келесі сұрақ →",
    toLessonSummaryBtn: "Сабақ қорытындысына →",
    lessonSummaryTitle: "Сабақ қорытындысы",
    completeLessonBtn: "Сабақты аяқталды деп белгілеу",
    lessonDoneBtn: "Сабақ аяқталды ✓",
    nextLessonBtn: "Келесі сабақ →",
    practiceTitle: "Пән бойынша практика",
    errorLabBadge: "ҚАТЕЛЕР ЗЕРТХАНАСЫ",
    errorLabPromptSuffix: "Бірінші логикалық немесе пәндік қате кеткен жолды басыңыз:",
    errorLabCorrectHit: "✓ Дәл таптыңыз! Қате қадам анықталды.",
    errorLabWrongHit: "Бұл қадам дұрыс. Басқа қадамды тексеріп көріңіз.",
    correctStepPrefix: "Дұрыс жазылуы:",
    transferQuestionTitle: "Осы қатесіз бекіту есебі:",
    mapTitle: "Білім және пререквизиттер картасы",
    mapSubtitle:
      "Әр тақырып базалық тақырыптармен байланысқан. «Меңгерілді» мәртебесі тек тексерілген жауаптар нәтижесінде қойылады.",
    prereqPrefix: "Базалық тақырып:",
    noPrereqs: "Бастапқы базалық тақырып (пререквизитсіз)",
    unlocksPrefix: "Ашатын тақырыптары:",
    toTopicLessonBtn: "Тақырып сабағына →",
    statusMastered: "Меңгерілді",
    statusReview: "Қайталау керек",
    statusGap: "Олқылық",
    statusRecommended: "Келесі оқуға ұсынылады",
    statusUnassessed: "Әлі бағаланбаған",
    tutorTitle: "ЖИ-репетитор",
    tutorSubtitlePrefix: "Ағымдағы тақырып бойынша сұрақ қойыңыз немесе 9 оқу режимінің бірін таңдаңыз:",
    tutorEmptyHint:
      "Жоғарыдағы 9 режимнің бірін таңдаңыз немесе өз сұрағыңызды жазыңыз — репетитор тақырыпты қадамдап түсіндіреді.",
    tutorPlaceholder: "Сұрағыңызды немесе шешу қадамын жазыңыз...",
    tutorSendBtn: "ЖИ-ден сұрау",
    tutorLoadingBtn: "Талдауда...",
    diagTitle: "Пән бойынша экспресс-диагностика",
    diagSubtitle:
      "Негізгі бөлімдердің сұрақтарына жауап беріп, BilimAI ұсынған жеке оқу маршрутын алыңыз.",
    diagNextBtn: "Келесі диагностикалық сұрақ →",
    diagDoneTitle: "Диагностика аяқталды! Сіздің тексерілген нәтижеңіз:",
    diagConfidencePrefix: "Бағалау сенімділігі:",
    diagViewMapBtn: "Білім картасын көру"
  },
  uz: {
    allSubjects: "Barcha fanlar (12)",
    workbookLink: "Ish daftari",
    progressPrefix: "Fan bo‘yicha progress:",
    ofWord: "/",
    accuracyPrefix: "Aniqlik",
    notAssessedYet: "Hali baholanmagan",
    levelPrefix: "Daraja",
    ctaStartFirstLesson: "Birinchi darsdan boshlash",
    ctaCheckLevel: "Darajani tekshirish (5–10 daqiqa)",
    ctaOpenTopicMap: "Mavzular xaritasini ochish",
    ctaGoPractice: "Amaliyotga o‘tish",
    tabs: {
      overview: "Kurs шарhi",
      lesson: "Dars",
      practice: "Amaliyot",
      error_lab: "Xatolar laboratoriyasi",
      map: "Bilimlar xaritasi",
      tutor: "SI-repetitor",
      diagnostic: "Diagnostika"
    },
    untSimulatorBtn: "Fan bo‘yicha imtihon trenajyori →",
    recommendedNextKicker: "TAVSIYA ETILGAN KEYINGI QADAM",
    openLessonBtn: "Darsni ochish →",
    startRecommendedLessonBtn: "Tavsiya etilgan darsni boshlash →",
    programTitle: "Fan dasturi",
    lessonWord: "Dars",
    lessonCompletedBadge: "✓ Dars o‘qildi",
    lessonReadBadge: "📖 Dars o‘qildi",
    goalPrefix: "Maqsad:",
    repeatLessonBtn: "Darsni takrorlash",
    studyLessonBtn: "O‘rganish →",
    keyExplanationTitle: "1. Asosiy tushuntirish",
    explainSimplerBtn: "Oddiyroq tushuntir",
    deepBreakdownBtn: "Chuqur tahlil",
    workedExampleTitle: "2. Qadam-baqadam misol tahlili",
    takeawayPrefix: "📌 Xulosa:",
    understandingCheckTitle: "3. Tushunishni tekshirish",
    allLessonQuestionsDone: "Darsning barcha topshiriqlari bajarildi ✓",
    nextLessonQuestionBtn: "Keyingi savol →",
    toLessonSummaryBtn: "Dars xulosasiga →",
    lessonSummaryTitle: "Dars xulosasi",
    completeLessonBtn: "Darsni yakunlangan deb belgilash",
    lessonDoneBtn: "Dars yakunlandi ✓",
    nextLessonBtn: "Keyingi dars →",
    practiceTitle: "Fan bo‘yicha amaliyot",
    errorLabBadge: "XATOLAR LABORATORIYASI",
    errorLabPromptSuffix: "Birinchi mantiqiy yoki fan xatosi ketgan qatorni bosing:",
    errorLabCorrectHit: "✓ To‘ppa-to‘g‘ri! Xato qadamni topdingiz.",
    errorLabWrongHit: "Bu qadam to‘g‘ri. Boshqa qadamni tekshirib ko‘ring.",
    correctStepPrefix: "To‘g‘ri yozuv:",
    transferQuestionTitle: "Ushbu xatosiz mustahkamlash masalasi:",
    mapTitle: "Bilimlar va prerevizitlar xaritasi",
    mapSubtitle:
      "Har bir mavzu bazaviy mavzular bilan bog‘langan. «O‘zlashtirildi» holati faqat tekshirilgan amaliyot javoblari asosida beriladi.",
    prereqPrefix: "Talab qilinadigan baza:",
    noPrereqs: "Boshlang‘ich bazaviy mavzu (prerevizitsiz)",
    unlocksPrefix: "Ochadigan mavzulari:",
    toTopicLessonBtn: "Mavzu darsiga →",
    statusMastered: "O‘zlashtirildi",
    statusReview: "Takrorlash kerak",
    statusGap: "Bo‘shliq",
    statusRecommended: "Keyingi o‘rganish",
    statusUnassessed: "Hali baholanmagan",
    tutorTitle: "SI-repetitor",
    tutorSubtitlePrefix: "Joriy mavzu bo‘yicha savol bering yoki 9 o‘quv rejimidan birini tanlang:",
    tutorEmptyHint:
      "Yuqoridagi 9 rejimdan birini tanlang yoki savolingizni yozing — repetitor mavzuni qadam-baqadam tushuntiradi.",
    tutorPlaceholder: "Savolingizni yoki yechim qadamini yozing...",
    tutorSendBtn: "SI dan so‘rash",
    tutorLoadingBtn: "Tahlil qilinmoqda...",
    diagTitle: "Fan bo‘yicha ekspress-diagnostika",
    diagSubtitle:
      "Asosiy bo‘lim savollariga javob bering — BilimAI boshlang‘ich darajangizni aniqlab, aniq darsni tavsiya qiladi.",
    diagNextBtn: "Keyingi diagnostika savoli →",
    diagDoneTitle: "Diagnostika yakunlandi! Tekshirilgan natijangiz:",
    diagConfidencePrefix: "Baholash ishonchliligi:",
    diagViewMapBtn: "Bilimlar xaritasini ko‘rish"
  }
};

export interface SubjectOverviewClientProps {
  subjectId: string;
  initialStartMode?: string;
  initialLessonId?: string;
  initialLang?: string;
}

export function SubjectOverviewClient({
  subjectId,
  initialStartMode,
  initialLessonId,
  initialLang
}: SubjectOverviewClientProps) {
  const curriculum: UniversalSubjectCurriculum | null = useMemo(
    () => getSubjectCurriculum(subjectId),
    [subjectId]
  );
  const allSubjects = useMemo(() => getAllSubjectCurricula(), []);

  const initialResolvedLessonIndex = useMemo(() => {
    if (!curriculum || !initialLessonId) return 0;
    const found = findSubjectLessonByIdOrSlug(curriculum, initialLessonId);
    return found ? found.index : 0;
  }, [curriculum, initialLessonId]);

  const [locale, setLocale] = useState<Locale>(() => parseLocaleParam(initialLang) ?? "ru");
  const [activeTab, setActiveTab] = useState<SubjectWorkspaceTab>(() =>
    initialLessonId && !initialStartMode
      ? "lesson"
      : parseStartModeToTab(initialStartMode)
  );
  const [progressState, setProgressState] = useState<UniversalPlatformProgressState>(() =>
    createDefaultUniversalProgressState()
  );

  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(
    initialResolvedLessonIndex
  );
  const [lessonQuestionIndex, setLessonQuestionIndex] = useState(0);
  const [lessonQuestionsFinished, setLessonQuestionsFinished] = useState(false);
  const [explanationDepth, setExplanationDepth] = useState<"simple" | "detailed">("simple");

  // Practice state
  const [practiceQuestionIndex, setPracticeQuestionIndex] = useState(0);

  // Error lab state (supports multiple cases per subject — Section 11)
  const [selectedErrorLabIdx, setSelectedErrorLabIdx] = useState(0);
  const [selectedStepIdx, setSelectedStepIdx] = useState<number | null>(null);

  // Diagnostic state (Section 10)
  const [diagIndex, setDiagIndex] = useState(0);
  const [diagResponses, setDiagResponses] = useState<DiagnosticQuestionResponseRecord[]>([]);
  const [diagDone, setDiagDone] = useState(false);

  // AI Tutor state (Section 12 & E2E-008)
  const [tutorInput, setTutorInput] = useState("");
  const [tutorLoading, setTutorLoading] = useState(false);
  const [tutorMessages, setTutorMessages] = useState<
    Array<{
      role: "user" | "assistant";
      text: string;
      modeLabel?: string;
      verificationBadge?: string;
    }>
  >([]);

  const syncBrowserUrl = useCallback(
    (
      nextTab: SubjectWorkspaceTab,
      nextLessonIdx: number,
      nextLocale: Locale,
      historyMode: "push" | "replace" = "push"
    ) => {
      if (typeof window === "undefined" || !curriculum) return;
      try {
        const lessonObj =
          curriculum.lessons[Math.max(0, Math.min(nextLessonIdx, curriculum.lessons.length - 1))] ??
          curriculum.lessons[0];
        let targetPath = `/subjects/${curriculum.id}`;
        const params = new URLSearchParams();
        if (nextTab === "lesson" && lessonObj) {
          targetPath = `/subjects/${curriculum.id}/lessons/${encodeURIComponent(lessonObj.id)}`;
        } else if (nextTab !== "overview") {
          params.set("start", nextTab === "map" ? "map" : nextTab);
        }
        params.set("lang", nextLocale);
        const query = params.toString();
        const nextUrl = query ? `${targetPath}?${query}` : targetPath;
        const currentUrl = `${window.location.pathname}${window.location.search}`;
        if (currentUrl !== nextUrl) {
          const payload = {
            subjectId: curriculum.id,
            tab: nextTab,
            lessonIndex: nextLessonIdx,
            lang: nextLocale
          };
          if (historyMode === "push") {
            window.history.pushState(payload, "", nextUrl);
          } else {
            window.history.replaceState(payload, "", nextUrl);
          }
        }
      } catch {
        // ignore history API errors
      }
    },
    [curriculum]
  );

  // Initial client hydration of URL params, deep lesson slug, and idempotent v1->v2 storage migration (P0-002, P1-002, P1-004, E2E-013)
  useEffect(() => {
    if (typeof window === "undefined" || !curriculum) return;
    try {
      const params = new URLSearchParams(window.location.search);
      const urlLang = parseLocaleParam(params.get("lang")) ?? parseLocaleParam(initialLang);
      const savedLocale =
        parseLocaleParam(window.localStorage.getItem(LOCALE_STORAGE_KEY)) ??
        parseLocaleParam(window.localStorage.getItem(LEGACY_LANG_STORAGE_KEY));
      const resolvedLocale: Locale = urlLang ?? savedLocale ?? "ru";
      setLocale(resolvedLocale);
      window.localStorage.setItem(LOCALE_STORAGE_KEY, resolvedLocale);
      window.localStorage.setItem(LEGACY_LANG_STORAGE_KEY, resolvedLocale);

      const urlStart = params.get("start") ?? initialStartMode;
      const urlLesson = params.get("lesson") ?? initialLessonId;

      if (urlLesson) {
        const found = findSubjectLessonByIdOrSlug(curriculum, urlLesson);
        if (found) {
          setSelectedLessonIndex(found.index);
        }
      }

      if (urlStart) {
        setActiveTab(parseStartModeToTab(urlStart));
      } else if (urlLesson) {
        setActiveTab("lesson");
      }

      const rawV2 = window.localStorage.getItem(UNIVERSAL_PROGRESS_STORAGE_KEY);
      const rawLegacy = window.localStorage.getItem("bilimai-lab-v1");
      const migrated = migrateUniversalProgressState(rawV2, rawLegacy);
      migrated.activeSubjectId = subjectId;
      setProgressState(migrated);
      window.localStorage.setItem(UNIVERSAL_PROGRESS_STORAGE_KEY, JSON.stringify(migrated));
    } catch {
      // ignore storage errors
    }
  }, [curriculum, subjectId, initialStartMode, initialLessonId, initialLang]);

  // Listen to browser Back / Forward navigation (P1-005)
  useEffect(() => {
    if (typeof window === "undefined" || !curriculum) return;
    const onPopState = (ev: PopStateEvent) => {
      const state = ev.state as {
        tab?: SubjectWorkspaceTab;
        lessonIndex?: number;
        lang?: Locale;
      } | null;
      if (state && state.tab) {
        setActiveTab(state.tab);
        if (typeof state.lessonIndex === "number") {
          setSelectedLessonIndex(state.lessonIndex);
        }
        if (state.lang === "ru" || state.lang === "kk" || state.lang === "uz") {
          setLocale(state.lang);
        }
        return;
      }
      const params = new URLSearchParams(window.location.search);
      const qLang = parseLocaleParam(params.get("lang"));
      if (qLang) setLocale(qLang);

      const pathParts = window.location.pathname.split("/").filter(Boolean);
      const lessonsIdx = pathParts.indexOf("lessons");
      const pathLessonSlug =
        lessonsIdx >= 0 && pathParts[lessonsIdx + 1] ? pathParts[lessonsIdx + 1] : params.get("lesson");
      if (pathLessonSlug) {
        const found = findSubjectLessonByIdOrSlug(curriculum, pathLessonSlug);
        if (found) {
          setSelectedLessonIndex(found.index);
          setActiveTab("lesson");
          return;
        }
      }
      const qStart = params.get("start");
      setActiveTab(parseStartModeToTab(qStart));
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [curriculum]);

  const updateProgress = (
    updater: (prev: UniversalPlatformProgressState) => UniversalPlatformProgressState
  ) => {
    setProgressState((prev) => {
      const next = updater(prev);
      try {
        window.localStorage.setItem(UNIVERSAL_PROGRESS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleLocaleChange = (nextLocale: Locale) => {
    setLocale(nextLocale);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
      window.localStorage.setItem(LEGACY_LANG_STORAGE_KEY, nextLocale);
    } catch {
      // ignore
    }
    syncBrowserUrl(activeTab, selectedLessonIndex, nextLocale, "replace");
  };

  if (!curriculum) {
    return (
      <main style={{ maxWidth: 920, margin: "40px auto", padding: "0 20px" }}>
        <h1>Предмет не найден</h1>
        <p>Выберите предмет из каталога BilimAI.</p>
        <Link href="/subjects" style={{ color: "var(--accent, #3856f5)", fontWeight: 600 }}>
          ← Перейти в каталог предметов
        </Link>
      </main>
    );
  }

  const ui = WORKSPACE_I18N[locale];

  const currentLesson: UniversalLesson =
    curriculum.lessons[Math.min(selectedLessonIndex, curriculum.lessons.length - 1)] ??
    curriculum.lessons[0];

  const allPracticeQuestions: UniversalQuestion[] = curriculum.lessons.flatMap((l) => l.questions);
  const currentPracticeQuestion: UniversalQuestion | undefined =
    allPracticeQuestions[
      Math.min(practiceQuestionIndex, Math.max(0, allPracticeQuestions.length - 1))
    ];

  // Select up to 5 diagnostic questions spanning distinct lessons/difficulties (Section 10)
  const diagnosticQuestions: UniversalQuestion[] = (() => {
    const picked: UniversalQuestion[] = [];
    for (const lesson of curriculum.lessons) {
      if (lesson.questions[0]) {
        picked.push(lesson.questions[0]);
      }
      if (picked.length >= 5) break;
    }
    for (const q of allPracticeQuestions) {
      if (picked.length >= 5) break;
      if (!picked.some((p) => p.id === q.id)) {
        picked.push(q);
      }
    }
    return picked;
  })();

  const subjectProgress = getSubjectProgress(progressState, curriculum.id);
  const summaryMetrics = getSubjectSummaryMetrics(
    progressState,
    curriculum.id,
    curriculum.lessons.length
  );
  const graphNodes = buildUniversalSubjectGraph(
    curriculum.id,
    subjectProgress.completedLessonIds,
    subjectProgress.topicStats
  );

  // Exact recommended lesson computed from diagnostic/gaps/completion (P1-003 & Section 10)
  const recommendedLessonInfo = computeRecommendedLessonForSubject(
    curriculum,
    subjectProgress.completedLessonIds,
    subjectProgress.topicStats,
    subjectProgress.recommendedLessonId
  );

  const switchTab = (nextTab: SubjectWorkspaceTab) => {
    setActiveTab(nextTab);
    syncBrowserUrl(nextTab, selectedLessonIndex, locale, "push");
  };

  const openLessonByIndex = (idx: number) => {
    const safeIdx = Math.max(0, Math.min(idx, curriculum.lessons.length - 1));
    const targetLesson = curriculum.lessons[safeIdx];
    setSelectedLessonIndex(safeIdx);
    setLessonQuestionIndex(0);
    setLessonQuestionsFinished(false);
    setActiveTab("lesson");
    if (targetLesson) {
      updateProgress((prev) =>
        recordSubjectLessonInteraction(prev, curriculum.id, targetLesson.id, "viewed")
      );
    }
    syncBrowserUrl("lesson", safeIdx, locale, "push");
  };

  const handleLessonQuestionNext = () => {
    const step = advanceLessonQuestionIndex(lessonQuestionIndex, currentLesson.questions.length);
    setLessonQuestionIndex(step.nextIndex);
    if (step.completed) {
      setLessonQuestionsFinished(true);
    }
  };

  const handleCompleteCurrentLesson = () => {
    updateProgress((prev) =>
      recordSubjectLessonCompletion(prev, curriculum.id, currentLesson.id, currentLesson.topicId)
    );
    setLessonQuestionsFinished(true);
  };

  const handleQuestionEvaluated = (
    evaluation: UniversalQuestionEvaluation,
    q: UniversalQuestion,
    attemptId: string
  ) => {
    updateProgress((prev) =>
      recordSubjectQuestionAttempt(prev, {
        subjectId: curriculum.id,
        topicId: q.topicId,
        questionId: q.id,
        attemptId,
        earnedPoints: evaluation.earnedPoints,
        maxPoints: evaluation.maxPoints,
        verificationState: evaluation.verificationState,
        errorCategory: evaluation.errorCategory
      })
    );
  };

  const finalizeDiagnostic = (responses: DiagnosticQuestionResponseRecord[]) => {
    let earned = 0;
    let max = 0;
    let verifiedCorrectCount = 0;
    let incorrectCount = 0;
    let unverifiedOrSkippedCount = 0;
    const weakTopicsSet = new Set<string>();

    for (const r of responses) {
      if (r.verificationState === "verified_correct") {
        verifiedCorrectCount++;
        earned += r.earnedPoints;
        max += r.maxPoints;
      } else if (r.verificationState === "incorrect") {
        incorrectCount++;
        earned += r.earnedPoints;
        max += r.maxPoints;
        weakTopicsSet.add(r.topicId);
      } else {
        unverifiedOrSkippedCount++;
      }
    }

    const scorePercent = max > 0 ? Math.round((earned / max) * 100) : 0;
    const weakTopicIds = Array.from(weakTopicsSet);

    let targetLesson = curriculum.lessons[0];
    if (weakTopicIds.length > 0) {
      const weakMatch = curriculum.lessons.find((l) => l.topicId === weakTopicIds[0]);
      if (weakMatch) targetLesson = weakMatch;
    } else if (scorePercent >= 80 && curriculum.lessons.length > 1) {
      // If beginner topics are already strong, recommend the next uncompleted or intermediate lesson
      const nextUnfinished =
        curriculum.lessons.find((l) => !subjectProgress.completedLessonIds.includes(l.id)) ??
        curriculum.lessons[Math.min(1, curriculum.lessons.length - 1)];
      targetLesson = nextUnfinished;
    }

    const confidenceLevel: "low" | "medium" | "high" =
      verifiedCorrectCount + incorrectCount >= 3
        ? "high"
        : verifiedCorrectCount + incorrectCount >= 2
          ? "medium"
          : "low";

    const record = {
      id: `diag-${curriculum.id}-${Date.now()}`,
      subjectId: curriculum.id,
      version: "3.0.0",
      completedAt: new Date().toISOString(),
      scorePercent,
      verifiedCorrectCount,
      incorrectCount,
      unverifiedOrSkippedCount,
      totalQuestions: diagnosticQuestions.length,
      confidenceLevel,
      weakTopicIds,
      recommendedLessonId: targetLesson.id,
      recommendationReason: {
        ru:
          weakTopicIds.length > 0
            ? `По итогам диагностики обнаружена точка потери баллов в теме «${targetLesson.title.ru}» — начните с этого урока.`
            : `Отличный базовый результат (${scorePercent}%)! Рекомендуем перейти к уроку «${targetLesson.title.ru}».`,
        kk:
          weakTopicIds.length > 0
            ? `Диагностика бойынша «${targetLesson.title.kk}» тақырыбында олқылық анықталды — осы сабақтан бастаңыз.`
            : `Тамаша нәтиже (${scorePercent}%)! «${targetLesson.title.kk}» сабағына өтуді ұсынамыз.`,
        uz:
          weakTopicIds.length > 0
            ? `Diagnostika bo‘yicha «${targetLesson.title.uz}» mavzusida bo‘shliq aniqlandi — shu darsdan boshlang.`
            : `Ajoyib natija (${scorePercent}%)! «${targetLesson.title.uz}» darsiga o‘tishni tavsiya qilamiz.`
      },
      responses
    };

    updateProgress((prev) => recordSubjectDiagnosticAttempt(prev, record));
    setDiagDone(true);
  };

  // Universal 9-mode AI Tutor with explicit verification & source badges (Section 12 & E2E-008)
  const tutorModeButtons: Array<{
    mode: string;
    label: Record<Locale, string>;
    prompt: string;
  }> = [
    {
      mode: "simple",
      label: { ru: "1. Объясни проще", kk: "1. Қарапайым тілмен", uz: "1. Oddiyroq tushuntir" },
      prompt: `Объясни проще тему «${currentLesson.title[locale]}» на наглядном примере.`
    },
    {
      mode: "step_by_step",
      label: { ru: "2. Разбери по шагам", kk: "2. Қадамдап талда", uz: "2. Qadam-baqadam tahlil" },
      prompt: `Разбери по шагам решение задачи: ${currentLesson.workedExample.problem[locale]}`
    },
    {
      mode: "hint",
      label: { ru: "3. Подсказка без ответа", kk: "3. Жауапсыз кеңес", uz: "3. Javobsiz maslahat" },
      prompt: `Дай наводящую подсказку без готового ответа по задаче: ${currentLesson.workedExample.problem[locale]}`
    },
    {
      mode: "check_solution",
      label: { ru: "4. Проверь моё решение", kk: "4. Шешімімді тексер", uz: "4. Yechimimni tekshir" },
      prompt: `Проверь мой ход рассуждений по теме «${currentLesson.title[locale]}» и укажи первый шаг, где нужно быть внимательным.`
    },
    {
      mode: "why_wrong",
      label: { ru: "5. Почему ответ неверный", kk: "5. Неге жауап қате", uz: "5. Nega javob xato" },
      prompt: `Объясни типичную ошибку в теме «${currentLesson.title[locale]}» и как её избежать.`
    },
    {
      mode: "similar_task",
      label: { ru: "6. Дай похожую задачу", kk: "6. Ұқсас есеп бер", uz: "6. O‘xshash masala ber" },
      prompt: `Дай одну похожую задачу для самопроверки по теме «${currentLesson.title[locale]}».`
    },
    {
      mode: "memorize",
      label: { ru: "7. Краткий конспект", kk: "7. Қысқаша конспект", uz: "7. Qisqa konspekt" },
      prompt: `Сделай краткий конспект и чек-лист правил по теме «${currentLesson.title[locale]}».`
    },
    {
      mode: "exam_prep",
      label: { ru: "8. Подготовь к тесту", kk: "8. Тестке дайында", uz: "8. Testga tayyorla" },
      prompt: `Какие ловушки чаще всего встречаются в тестах по теме «${currentLesson.title[locale]}»?`
    },
    {
      mode: "socratic",
      label: { ru: "9. Проверочный вопрос", kk: "9. Тексеру сұрағы", uz: "9. Tekshiruv savoli" },
      prompt: `Задай мне один проверочный вопрос на понимание темы «${currentLesson.title[locale]}».`
    }
  ];

  const askTutor = async (promptText: string, modeLabel?: string, modeCode?: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || tutorLoading) return;
    setTutorMessages((prev) => [...prev, { role: "user", text: trimmed, modeLabel }]);
    setTutorInput("");
    setTutorLoading(true);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: curriculum.id,
          topicId: currentLesson.topicId,
          lessonId: currentLesson.id,
          mode: modeCode ?? "step_by_step",
          locale,
          userMessage: trimmed,
          lessonContext: `${currentLesson.simpleExplanation[locale]}\n${currentLesson.workedExample.problem[locale]}`
        })
      });
      const data = (await res.json()) as {
        reply?: string;
        explanation?: string;
        nextStepPrompt?: string;
        fallbackUsed?: boolean;
        source?: string;
      };
      const replyText =
        data.reply ||
        (data.explanation
          ? `${data.explanation}${data.nextStepPrompt ? `\n\n👉 ${data.nextStepPrompt}` : ""}`
          : `${currentLesson.simpleExplanation[locale]}\n\n${currentLesson.workedExample.steps[locale].join("\n")}\n\n📌 ${currentLesson.workedExample.takeaway[locale]}`);

      const isFallback = Boolean(data.fallbackUsed || data.source === "deterministic_fallback");
      setTutorMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: replyText,
          modeLabel: modeLabel ?? ui.tutorTitle,
          verificationBadge: isFallback
            ? "Deterministically verified · Локальный педагогический разбор по правилу урока"
            : "AI-generated explanation · Ответ ИИ-репетитора BilimAI"
        }
      ]);
    } catch {
      setTutorMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `${currentLesson.simpleExplanation[locale]}\n\nПример по шагам:\n${currentLesson.workedExample.steps[locale].join("\n")}\n\n📌 ${currentLesson.workedExample.takeaway[locale]}`,
          modeLabel: modeLabel ?? ui.tutorTitle,
          verificationBadge:
            "Deterministically verified · Локальный педагогический разбор по правилу урока"
        }
      ]);
    } finally {
      setTutorLoading(false);
    }
  };

  const activeErrorLab =
    curriculum.errorLabCases[
      Math.min(selectedErrorLabIdx, Math.max(0, curriculum.errorLabCases.length - 1))
    ] ?? curriculum.errorLabCases[0];

  const lastDiag = subjectProgress.lastDiagnostic;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg, #f7f5ef)", color: "var(--ink, #171717)" }}>
      {/* Top Universal Navigation Bar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "rgba(247, 245, 239, 0.94)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--border, #e4e1d8)",
          padding: "10px 16px"
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
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/welcome"
              style={{
                fontWeight: 800,
                fontSize: 18,
                textDecoration: "none",
                color: "var(--ink, #171717)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "var(--accent, #3856f5)",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 800
                }}
              >
                B
              </span>
              <span>BilimAI</span>
            </Link>

            <Link
              href="/subjects"
              style={{
                fontSize: 13.5,
                color: "var(--muted, #65635d)",
                textDecoration: "none",
                fontWeight: 600
              }}
            >
              {ui.allSubjects}
            </Link>

            <select
              aria-label="Выбор предмета"
              value={curriculum.id}
              onChange={(e) => {
                window.location.href = `/subjects/${e.target.value}?lang=${locale}`;
              }}
              style={{
                padding: "6px 10px",
                borderRadius: 10,
                border: "1px solid var(--border, #dcd8ce)",
                background: "var(--surface, #fff)",
                fontSize: 13.5,
                fontWeight: 600
              }}
            >
              {allSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.badge} · {s.title[locale]}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
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
                  data-testid={`subject-lang-${lang}`}
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

            <Link
              href={`/?subject=${curriculum.id}&lang=${locale}`}
              style={{
                padding: "7px 12px",
                borderRadius: 10,
                border: "1px solid var(--border, #dcd8ce)",
                background: "var(--surface, #fff)",
                textDecoration: "none",
                color: "inherit",
                fontSize: 13,
                fontWeight: 600
              }}
            >
              {ui.workbookLink}
            </Link>
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "24px 16px 80px",
          display: "grid",
          gap: 22
        }}
      >
        {/* Subject Hero & 4 Primary CTAs */}
        <section
          data-testid="subject-overview-hero"
          style={{
            background: "var(--surface, #ffffff)",
            border: "1px solid var(--border, #e4e1d8)",
            borderRadius: 20,
            padding: "22px 24px",
            display: "grid",
            gap: 16
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: `${curriculum.accentColor}18`,
                  color: curriculum.accentColor,
                  fontWeight: 800,
                  fontSize: 12
                }}
              >
                {curriculum.badge}
              </span>
              <span style={{ fontSize: 13, color: "var(--muted, #65635d)" }}>
                {formatLessonsCountLabel(curriculum.lessons.length, locale)} ·{" "}
                {formatQuestionsCountLabel(allPracticeQuestions.length, locale)}
              </span>
              {curriculum.readinessLabel && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "3px 9px",
                    borderRadius: 999,
                    background: "var(--bg, #f7f5ef)",
                    color: "var(--muted, #57544e)"
                  }}
                >
                  {curriculum.readinessLabel[locale]}
                </span>
              )}
            </div>

            <div
              data-testid="subject-isolated-progress-pill"
              style={{
                fontSize: 13,
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: 999,
                background: "var(--bg, #f7f5ef)",
                border: "1px solid var(--border, #e4e1d8)"
              }}
            >
              {ui.progressPrefix} {summaryMetrics.completedLessons} {ui.ofWord}{" "}
              {formatLessonsCountLabel(summaryMetrics.totalLessons, locale)} (
              {summaryMetrics.completionPercent}%)
              {summaryMetrics.averageAccuracyPercent !== null
                ? ` · ${ui.accuracyPrefix} ${summaryMetrics.averageAccuracyPercent}%`
                : ` · ${ui.notAssessedYet}`}
            </div>
          </div>

          <div>
            <h1 style={{ margin: "0 0 8px", fontSize: "clamp(22px, 3vw, 30px)", lineHeight: 1.2 }}>
              {curriculum.title[locale]}
            </h1>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: "var(--muted, #57544e)" }}>
              {curriculum.description[locale]}
            </p>
          </div>

          {/* Available levels */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(curriculum.levels[locale] ?? curriculum.levels.ru).map((lvl, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: 12.5,
                  padding: "5px 11px",
                  borderRadius: 999,
                  background: "var(--bg, #f7f5ef)",
                  color: "var(--ink, #171717)"
                }}
              >
                {ui.levelPrefix} {idx + 1}: {lvl}
              </span>
            ))}
          </div>

          {/* 4 Required Primary Buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingTop: 4 }}>
            <button
              type="button"
              data-testid="cta-start-first-lesson"
              onClick={() => openLessonByIndex(0)}
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                border: "none",
                background: "var(--accent, #3856f5)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer"
              }}
            >
              {ui.ctaStartFirstLesson}
            </button>

            <button
              type="button"
              data-testid="cta-check-level"
              onClick={() => {
                setDiagIndex(0);
                setDiagResponses([]);
                setDiagDone(false);
                switchTab("diagnostic");
              }}
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid var(--accent, #3856f5)",
                background: "rgba(56, 86, 245, 0.08)",
                color: "var(--accent, #3856f5)",
                fontWeight: 700,
                fontSize: 14.5,
                cursor: "pointer"
              }}
            >
              {ui.ctaCheckLevel}
            </button>

            <button
              type="button"
              data-testid="cta-open-topic-map"
              onClick={() => switchTab("map")}
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid var(--border, #dcd8ce)",
                background: "var(--surface, #fff)",
                fontWeight: 600,
                fontSize: 14.5,
                cursor: "pointer"
              }}
            >
              {ui.ctaOpenTopicMap}
            </button>

            <button
              type="button"
              data-testid="cta-go-practice"
              onClick={() => switchTab("practice")}
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid var(--border, #dcd8ce)",
                background: "var(--surface, #fff)",
                fontWeight: 600,
                fontSize: 14.5,
                cursor: "pointer"
              }}
            >
              {ui.ctaGoPractice}
            </button>
          </div>
        </section>

        {/* Subject Workspace Mode Tabs */}
        <nav
          aria-label="Разделы предмета"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            borderBottom: "1px solid var(--border, #e4e1d8)",
            paddingBottom: 10
          }}
        >
          {(
            ["overview", "lesson", "practice", "error_lab", "map", "tutor", "diagnostic"] as const
          ).map((tabId) => {
            const active = activeTab === tabId;
            return (
              <button
                key={tabId}
                type="button"
                data-testid={`subject-tab-${tabId}`}
                onClick={() => switchTab(tabId)}
                style={{
                  padding: "9px 15px",
                  borderRadius: 10,
                  border: active
                    ? "1px solid var(--accent, #3856f5)"
                    : "1px solid var(--border, #dcd8ce)",
                  background: active ? "var(--accent, #3856f5)" : "var(--surface, #fff)",
                  color: active ? "#fff" : "inherit",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer"
                }}
              >
                {ui.tabs[tabId]}
              </button>
            );
          })}

          {/* P1-001 & E2E-002 FIX: Link directly to /?tab=exam&subject=${curriculum.id} */}
          <Link
            href={`/?tab=exam&subject=${curriculum.id}&lang=${locale}`}
            data-testid="subject-unt-exam-link"
            style={{
              marginLeft: "auto",
              padding: "9px 14px",
              borderRadius: 10,
              border: "1px dashed var(--border, #c5c0b4)",
              background: "transparent",
              color: "var(--muted, #57544e)",
              textDecoration: "none",
              fontSize: 13.5,
              fontWeight: 600
            }}
          >
            {ui.untSimulatorBtn}
          </Link>
        </nav>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gap: 18 }}>
            <div
              data-testid="recommended-next-step-card"
              style={{
                padding: "16px 20px",
                borderRadius: 16,
                background: "rgba(56, 86, 245, 0.07)",
                border: "1px solid rgba(56, 86, 245, 0.25)",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12
              }}
            >
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent, #3856f5)" }}>
                  {ui.recommendedNextKicker}
                </span>
                <div style={{ fontSize: 17, fontWeight: 700, marginTop: 2 }}>
                  {recommendedLessonInfo.lesson.title[locale]}
                </div>
                <div style={{ fontSize: 13.5, color: "var(--muted, #57544e)", marginTop: 2 }}>
                  {recommendedLessonInfo.reason[locale]}
                </div>
              </div>
              <button
                type="button"
                data-testid="open-recommended-lesson-btn"
                onClick={() => openLessonByIndex(recommendedLessonInfo.index)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "none",
                  background: "var(--accent, #3856f5)",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                {ui.openLessonBtn}
              </button>
            </div>

            <section
              style={{
                background: "var(--surface, #fff)",
                border: "1px solid var(--border, #e4e1d8)",
                borderRadius: 18,
                padding: "18px 20px",
                display: "grid",
                gap: 12
              }}
            >
              <h2 style={{ margin: 0, fontSize: 19 }}>
                {ui.programTitle} ({formatLessonsCountLabel(curriculum.lessons.length, locale)})
              </h2>
              <div style={{ display: "grid", gap: 10 }}>
                {curriculum.lessons.map((lesson, idx) => {
                  const isDone = subjectProgress.completedLessonIds.includes(lesson.id);
                  const topicStat = subjectProgress.topicStats[lesson.topicId];
                  return (
                    <div
                      key={lesson.id}
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "12px 14px",
                        borderRadius: 14,
                        border: "1px solid var(--border, #e4e1d8)",
                        background: isDone ? "rgba(22, 163, 74, 0.05)" : "var(--bg, #f7f5ef)"
                      }}
                    >
                      <div style={{ display: "grid", gap: 3 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexWrap: "wrap"
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: "var(--muted, #65635d)"
                            }}
                          >
                            {ui.lessonWord} {idx + 1} · {lesson.sectionTitle[locale]}
                          </span>
                          {isDone && (
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                padding: "2px 8px",
                                borderRadius: 999,
                                background: "rgba(22, 163, 74, 0.15)",
                                color: "#15803d"
                              }}
                            >
                              {ui.lessonCompletedBadge}
                            </span>
                          )}
                          {topicStat && topicStat.max > 0 ? (
                            <span style={{ fontSize: 12, color: "var(--muted, #65635d)" }}>
                              {ui.accuracyPrefix}: {Math.round((topicStat.earned / topicStat.max) * 100)}%
                            </span>
                          ) : (
                            <span style={{ fontSize: 12, color: "var(--muted, #65635d)" }}>
                              {ui.notAssessedYet}
                            </span>
                          )}
                        </div>
                        <strong style={{ fontSize: 16 }}>{lesson.title[locale]}</strong>
                        <span style={{ fontSize: 13.5, color: "var(--muted, #57544e)" }}>
                          {ui.goalPrefix} {lesson.learningGoal[locale]}
                        </span>
                      </div>

                      <button
                        type="button"
                        data-testid={`open-lesson-idx-${idx}`}
                        onClick={() => openLessonByIndex(idx)}
                        style={{
                          padding: "9px 14px",
                          borderRadius: 10,
                          border: "1px solid var(--accent, #3856f5)",
                          background: "var(--surface, #fff)",
                          color: "var(--accent, #3856f5)",
                          fontWeight: 600,
                          fontSize: 13.5,
                          cursor: "pointer"
                        }}
                      >
                        {isDone ? ui.repeatLessonBtn : ui.studyLessonBtn}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: INTERACTIVE LESSON ENGINE */}
        {activeTab === "lesson" && (
          <section
            data-testid="interactive-lesson-engine"
            data-lesson-id={currentLesson.id}
            style={{
              background: "var(--surface, #fff)",
              border: "1px solid var(--border, #e4e1d8)",
              borderRadius: 20,
              padding: "22px 24px",
              display: "grid",
              gap: 18
            }}
          >
            {/* Lesson selector bar */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent, #3856f5)" }}>
                  {ui.lessonWord} {selectedLessonIndex + 1} {ui.ofWord} {curriculum.lessons.length}
                </span>
                <span style={{ fontSize: 13, color: "var(--muted, #65635d)" }}>
                  · {currentLesson.sectionTitle[locale]} · ~{currentLesson.estimatedMinutes} min
                </span>
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {curriculum.lessons.map((l, idx) => (
                  <button
                    key={l.id}
                    type="button"
                    data-testid={`lesson-selector-${idx}`}
                    onClick={() => openLessonByIndex(idx)}
                    style={{
                      padding: "6px 11px",
                      borderRadius: 8,
                      border:
                        idx === selectedLessonIndex
                          ? "1px solid var(--accent, #3856f5)"
                          : "1px solid var(--border, #dcd8ce)",
                      background:
                        idx === selectedLessonIndex ? "var(--accent, #3856f5)" : "transparent",
                      color: idx === selectedLessonIndex ? "#fff" : "inherit",
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    #{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 data-testid="active-lesson-title" style={{ margin: "0 0 6px", fontSize: 23 }}>
                {currentLesson.title[locale]}
              </h2>
              <p style={{ margin: 0, fontSize: 15, color: "var(--muted, #57544e)" }}>
                <strong>{ui.goalPrefix}</strong> {currentLesson.learningGoal[locale]}
              </p>
            </div>

            {/* Step 1: Theory & Explanation Toggle */}
            <div
              style={{
                padding: "16px 18px",
                borderRadius: 16,
                background: "var(--bg, #f7f5ef)",
                display: "grid",
                gap: 12
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8
                }}
              >
                <strong style={{ fontSize: 15 }}>{ui.keyExplanationTitle}</strong>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => setExplanationDepth("simple")}
                    style={{
                      padding: "6px 11px",
                      borderRadius: 8,
                      border: "1px solid var(--border, #dcd8ce)",
                      background:
                        explanationDepth === "simple"
                          ? "var(--accent, #3856f5)"
                          : "var(--surface, #fff)",
                      color: explanationDepth === "simple" ? "#fff" : "inherit",
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    {ui.explainSimplerBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setExplanationDepth("detailed")}
                    style={{
                      padding: "6px 11px",
                      borderRadius: 8,
                      border: "1px solid var(--border, #dcd8ce)",
                      background:
                        explanationDepth === "detailed"
                          ? "var(--accent, #3856f5)"
                          : "var(--surface, #fff)",
                      color: explanationDepth === "detailed" ? "#fff" : "inherit",
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    {ui.deepBreakdownBtn}
                  </button>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55 }}>
                {explanationDepth === "simple"
                  ? currentLesson.simpleExplanation[locale]
                  : currentLesson.detailedExplanation[locale]}
              </p>

              {currentLesson.contentBlocks.map((block, bIdx) => (
                <div
                  key={bIdx}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1px solid var(--border, #dcd8ce)",
                    background: block.type === "code" ? "#161922" : "var(--surface, #fff)",
                    color: block.type === "code" ? "#f8f8f2" : "inherit"
                  }}
                >
                  <strong style={{ display: "block", fontSize: 13.5, marginBottom: 4 }}>
                    {block.title[locale]}
                  </strong>
                  <pre
                    style={{
                      margin: 0,
                      whiteSpace: "pre-wrap",
                      fontFamily:
                        block.type === "code" || block.type === "formula"
                          ? "var(--font-mono, monospace)"
                          : "inherit",
                      fontSize: 14.5,
                      lineHeight: 1.5
                    }}
                  >
                    {block.body[locale]}
                  </pre>
                </div>
              ))}
            </div>

            {/* Step 2: Worked Example */}
            <div
              style={{
                padding: "16px 18px",
                borderRadius: 16,
                border: "1px solid var(--border, #e4e1d8)",
                display: "grid",
                gap: 10
              }}
            >
              <strong style={{ fontSize: 15 }}>{ui.workedExampleTitle}</strong>
              <div style={{ fontSize: 15.5, fontWeight: 600 }}>
                {currentLesson.workedExample.problem[locale]}
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                {(
                  currentLesson.workedExample.steps[locale] ??
                  currentLesson.workedExample.steps.ru
                ).map((stepText, sIdx) => (
                  <div
                    key={sIdx}
                    style={{
                      padding: "9px 12px",
                      borderRadius: 10,
                      background: "var(--bg, #f7f5ef)",
                      fontSize: 14.5
                    }}
                  >
                    {stepText}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 14, color: "var(--accent, #3856f5)", fontWeight: 600 }}>
                {ui.takeawayPrefix} {currentLesson.workedExample.takeaway[locale]}
              </div>
            </div>

            {/* Step 3: Interactive Micro-Practice inside Lesson */}
            <div style={{ display: "grid", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 8
                }}
              >
                <strong style={{ fontSize: 16 }}>
                  {ui.understandingCheckTitle} (
                  {Math.min(lessonQuestionIndex + 1, currentLesson.questions.length)} {ui.ofWord}{" "}
                  {currentLesson.questions.length})
                </strong>
                {lessonQuestionsFinished && (
                  <span
                    data-testid="lesson-questions-completed-badge"
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: "rgba(22, 163, 74, 0.14)",
                      color: "#15803d"
                    }}
                  >
                    {ui.allLessonQuestionsDone}
                  </span>
                )}
              </div>

              {currentLesson.questions[lessonQuestionIndex] && (
                <UniversalQuestionRenderer
                  question={currentLesson.questions[lessonQuestionIndex]}
                  locale={locale}
                  onEvaluated={handleQuestionEvaluated}
                  onNextQuestion={handleLessonQuestionNext}
                  nextButtonLabel={
                    lessonQuestionIndex + 1 < currentLesson.questions.length
                      ? ui.nextLessonQuestionBtn
                      : ui.toLessonSummaryBtn
                  }
                />
              )}
            </div>

            {/* Step 4: Lesson Summary & Completion Button */}
            <div
              style={{
                padding: "16px 18px",
                borderRadius: 16,
                background: "rgba(22, 163, 74, 0.07)",
                border: "1px solid rgba(22, 163, 74, 0.25)",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12
              }}
            >
              <div>
                <strong style={{ display: "block", fontSize: 15 }}>{ui.lessonSummaryTitle}</strong>
                <span style={{ fontSize: 14.5 }}>{currentLesson.summary[locale]}</span>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  data-testid="complete-lesson-btn"
                  onClick={handleCompleteCurrentLesson}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 10,
                    border: "none",
                    background: "#15803d",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {subjectProgress.completedLessonIds.includes(currentLesson.id)
                    ? ui.lessonDoneBtn
                    : ui.completeLessonBtn}
                </button>

                {selectedLessonIndex + 1 < curriculum.lessons.length && (
                  <button
                    type="button"
                    data-testid="next-lesson-btn"
                    onClick={() => openLessonByIndex(selectedLessonIndex + 1)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 10,
                      border: "1px solid var(--accent, #3856f5)",
                      background: "var(--surface, #fff)",
                      color: "var(--accent, #3856f5)",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    {ui.nextLessonBtn}
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: UNIVERSAL PRACTICE */}
        {activeTab === "practice" && currentPracticeQuestion && (
          <section style={{ display: "grid", gap: 14 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10
              }}
            >
              <h2 style={{ margin: 0, fontSize: 20 }}>
                {ui.practiceTitle} ({practiceQuestionIndex + 1} {ui.ofWord}{" "}
                {allPracticeQuestions.length})
              </h2>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {allPracticeQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setPracticeQuestionIndex(idx)}
                    style={{
                      padding: "6px 11px",
                      borderRadius: 8,
                      border:
                        idx === practiceQuestionIndex
                          ? "1px solid var(--accent, #3856f5)"
                          : "1px solid var(--border, #dcd8ce)",
                      background:
                        idx === practiceQuestionIndex
                          ? "var(--accent, #3856f5)"
                          : "var(--surface, #fff)",
                      color: idx === practiceQuestionIndex ? "#fff" : "inherit",
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    #{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <UniversalQuestionRenderer
              question={currentPracticeQuestion}
              locale={locale}
              onEvaluated={handleQuestionEvaluated}
              onNextQuestion={() => {
                const next = advanceLessonQuestionIndex(
                  practiceQuestionIndex,
                  allPracticeQuestions.length
                );
                setPracticeQuestionIndex(next.completed ? 0 : next.nextIndex);
              }}
            />
          </section>
        )}

        {/* TAB 4: SUBJECT ERROR LAB */}
        {activeTab === "error_lab" && activeErrorLab && (
          <section
            data-testid="subject-error-lab"
            style={{
              background: "var(--surface, #fff)",
              border: "1px solid var(--border, #e4e1d8)",
              borderRadius: 20,
              padding: "22px 24px",
              display: "grid",
              gap: 16
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "rgba(220, 38, 38, 0.1)",
                  color: "#b91c1c"
                }}
              >
                {ui.errorLabBadge} · {curriculum.badge}
              </span>

              {curriculum.errorLabCases.length > 1 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {curriculum.errorLabCases.map((errCase, cIdx) => (
                    <button
                      key={errCase.id}
                      type="button"
                      data-testid={`error-lab-case-selector-${cIdx}`}
                      onClick={() => {
                        setSelectedErrorLabIdx(cIdx);
                        setSelectedStepIdx(null);
                      }}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 8,
                        border:
                          cIdx === selectedErrorLabIdx
                            ? "1px solid #b91c1c"
                            : "1px solid var(--border, #dcd8ce)",
                        background:
                          cIdx === selectedErrorLabIdx ? "#b91c1c" : "var(--surface, #fff)",
                        color: cIdx === selectedErrorLabIdx ? "#fff" : "inherit",
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      #{cIdx + 1}: {errCase.title[locale]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 style={{ margin: "4px 0", fontSize: 21 }}>{activeErrorLab.title[locale]}</h2>
              <p style={{ margin: 0, fontSize: 15, color: "var(--muted, #57544e)" }}>
                {activeErrorLab.taskPrompt[locale]} {ui.errorLabPromptSuffix}
              </p>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              {(activeErrorLab.steps[locale] ?? activeErrorLab.steps.ru).map((stepLine, idx) => {
                const isSelected = selectedStepIdx === idx;
                const isBroken = idx === activeErrorLab.brokenStepIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    data-testid={`error-lab-step-${idx}`}
                    onClick={() => {
                      setSelectedStepIdx(idx);
                      if (idx === activeErrorLab.brokenStepIndex) {
                        updateProgress((prev) =>
                          recordSubjectErrorLabCompletion(prev, curriculum.id, activeErrorLab.id)
                        );
                      }
                    }}
                    style={{
                      textAlign: "left",
                      padding: "13px 15px",
                      borderRadius: 12,
                      border: isSelected
                        ? isBroken
                          ? "2px solid #15803d"
                          : "2px solid #b91c1c"
                        : "1px solid var(--border, #dcd8ce)",
                      background: isSelected
                        ? isBroken
                          ? "rgba(22, 163, 74, 0.09)"
                          : "rgba(220, 38, 38, 0.08)"
                        : "var(--bg, #f7f5ef)",
                      fontSize: 15,
                      cursor: "pointer"
                    }}
                  >
                    {stepLine}
                  </button>
                );
              })}
            </div>

            {selectedStepIdx !== null && (
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: 14,
                  background:
                    selectedStepIdx === activeErrorLab.brokenStepIndex
                      ? "rgba(22, 163, 74, 0.08)"
                      : "rgba(245, 158, 11, 0.1)",
                  border:
                    selectedStepIdx === activeErrorLab.brokenStepIndex
                      ? "1px solid rgba(22, 163, 74, 0.35)"
                      : "1px solid rgba(245, 158, 11, 0.4)",
                  display: "grid",
                  gap: 8
                }}
              >
                <strong>
                  {selectedStepIdx === activeErrorLab.brokenStepIndex
                    ? ui.errorLabCorrectHit
                    : ui.errorLabWrongHit}
                </strong>
                <p style={{ margin: 0, fontSize: 14.5 }}>{activeErrorLab.whyBroken[locale]}</p>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#15803d" }}>
                  {ui.correctStepPrefix} {activeErrorLab.correctedStep[locale]}
                </div>
              </div>
            )}

            <div style={{ paddingTop: 6 }}>
              <h3 style={{ margin: "0 0 10px", fontSize: 17 }}>{ui.transferQuestionTitle}</h3>
              <UniversalQuestionRenderer
                question={activeErrorLab.transferQuestion}
                locale={locale}
                onEvaluated={handleQuestionEvaluated}
              />
            </div>
          </section>
        )}

        {/* TAB 5: UNIVERSAL KNOWLEDGE MAP */}
        {activeTab === "map" && (
          <section
            data-testid="subject-knowledge-map"
            style={{
              background: "var(--surface, #fff)",
              border: "1px solid var(--border, #e4e1d8)",
              borderRadius: 20,
              padding: "22px 24px",
              display: "grid",
              gap: 16
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: 21 }}>
                {ui.mapTitle} · {curriculum.title[locale]}
              </h2>
              <p style={{ margin: 0, fontSize: 14.5, color: "var(--muted, #57544e)" }}>
                {ui.mapSubtitle}
              </p>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {graphNodes.map((node, idx) => {
                const statusLabels: Record<
                  typeof node.status,
                  { text: string; color: string; bg: string }
                > = {
                  mastered: {
                    text: ui.statusMastered,
                    color: "#15803d",
                    bg: "rgba(22, 163, 74, 0.12)"
                  },
                  review: {
                    text: ui.statusReview,
                    color: "#b45309",
                    bg: "rgba(245, 158, 11, 0.14)"
                  },
                  gap: {
                    text: ui.statusGap,
                    color: "#b91c1c",
                    bg: "rgba(220, 38, 38, 0.12)"
                  },
                  recommended: {
                    text: ui.statusRecommended,
                    color: "#3856f5",
                    bg: "rgba(56, 86, 245, 0.12)"
                  },
                  unassessed: {
                    text: ui.statusUnassessed,
                    color: "#65635d",
                    bg: "rgba(101, 99, 93, 0.12)"
                  }
                };
                const st = statusLabels[node.status];
                return (
                  <div
                    key={node.id}
                    data-testid={`knowledge-node-${node.id}`}
                    data-node-status={node.status}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 14,
                      border: "1px solid var(--border, #e4e1d8)",
                      background: "var(--bg, #f7f5ef)",
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12
                    }}
                  >
                    <div style={{ display: "grid", gap: 4 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flexWrap: "wrap"
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            padding: "3px 9px",
                            borderRadius: 999,
                            background: st.bg,
                            color: st.color
                          }}
                        >
                          {st.text}
                        </span>
                        {node.lessonCompleted && (
                          <span
                            style={{
                              fontSize: 11.5,
                              fontWeight: 600,
                              padding: "3px 8px",
                              borderRadius: 999,
                              background: "rgba(15, 23, 42, 0.08)",
                              color: "var(--ink, #171717)"
                            }}
                          >
                            {ui.lessonReadBadge}
                          </span>
                        )}
                        <span style={{ fontSize: 12.5, color: "var(--muted, #65635d)" }}>
                          #{idx + 1} · {node.sectionTitle[locale]}
                        </span>
                      </div>
                      <strong style={{ fontSize: 16 }}>{node.title[locale]}</strong>
                      <div style={{ fontSize: 13, color: "var(--muted, #57544e)" }}>
                        {node.prerequisites.length > 0
                          ? `${ui.prereqPrefix} ${node.prerequisites.join(", ")}`
                          : ui.noPrereqs}
                        {node.unlocks.length > 0
                          ? ` → ${ui.unlocksPrefix} ${node.unlocks.join(", ")}`
                          : ""}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const lIdx = curriculum.lessons.findIndex((l) => l.id === node.lessonId);
                        openLessonByIndex(lIdx >= 0 ? lIdx : 0);
                      }}
                      style={{
                        padding: "9px 14px",
                        borderRadius: 10,
                        border: "1px solid var(--accent, #3856f5)",
                        background: "var(--surface, #fff)",
                        color: "var(--accent, #3856f5)",
                        fontWeight: 600,
                        fontSize: 13.5,
                        cursor: "pointer"
                      }}
                    >
                      {ui.toTopicLessonBtn}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* TAB 6: SUBJECT AI TUTOR (9 Modes + Verification Badges — Section 12 & E2E-008) */}
        {activeTab === "tutor" && (
          <section
            data-testid="subject-ai-tutor"
            style={{
              background: "var(--surface, #fff)",
              border: "1px solid var(--border, #e4e1d8)",
              borderRadius: 20,
              padding: "22px 24px",
              display: "grid",
              gap: 16
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: 21 }}>
                {ui.tutorTitle} · {curriculum.title[locale]}
              </h2>
              <p style={{ margin: 0, fontSize: 14.5, color: "var(--muted, #57544e)" }}>
                {ui.tutorSubtitlePrefix} «{currentLesson.title[locale]}»
              </p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {tutorModeButtons.map((btn) => (
                <button
                  key={btn.mode}
                  type="button"
                  data-testid={`tutor-mode-${btn.mode}`}
                  onClick={() => askTutor(btn.prompt, btn.label[locale], btn.mode)}
                  style={{
                    padding: "8px 13px",
                    borderRadius: 999,
                    border: "1px solid var(--border, #dcd8ce)",
                    background: "var(--bg, #f7f5ef)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  {btn.label[locale]}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {tutorMessages.length === 0 && (
                <div
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    background: "var(--bg, #f7f5ef)",
                    fontSize: 14.5,
                    color: "var(--muted, #57544e)"
                  }}
                >
                  {ui.tutorEmptyHint}
                </div>
              )}
              {tutorMessages.map((msg, idx) => (
                <div
                  key={idx}
                  data-testid={`tutor-message-${msg.role}-${idx}`}
                  style={{
                    padding: "12px 15px",
                    borderRadius: 14,
                    background:
                      msg.role === "user" ? "rgba(56, 86, 245, 0.08)" : "var(--bg, #f7f5ef)",
                    border: "1px solid var(--border, #e4e1d8)",
                    whiteSpace: "pre-wrap",
                    fontSize: 14.5,
                    lineHeight: 1.5
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 8,
                      marginBottom: 4
                    }}
                  >
                    {msg.modeLabel && (
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: "var(--accent, #3856f5)"
                        }}
                      >
                        {msg.modeLabel}
                      </span>
                    )}
                    {msg.verificationBadge && (
                      <span
                        data-testid="tutor-verification-badge"
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 999,
                          background: "rgba(56, 86, 245, 0.1)",
                          color: "var(--accent, #3856f5)"
                        }}
                      >
                        {msg.verificationBadge}
                      </span>
                    )}
                  </div>
                  {msg.text}
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void askTutor(tutorInput);
              }}
              style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
            >
              <input
                type="text"
                value={tutorInput}
                onChange={(e) => setTutorInput(e.target.value)}
                placeholder={ui.tutorPlaceholder}
                style={{
                  flex: "1 1 260px",
                  padding: "11px 14px",
                  borderRadius: 12,
                  border: "1px solid var(--border, #dcd8ce)",
                  fontSize: 15
                }}
              />
              <button
                type="submit"
                disabled={tutorLoading}
                style={{
                  padding: "11px 18px",
                  borderRadius: 12,
                  border: "none",
                  background: "var(--accent, #3856f5)",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                {tutorLoading ? ui.tutorLoadingBtn : ui.tutorSendBtn}
              </button>
            </form>
          </section>
        )}

        {/* TAB 7: DIAGNOSTIC CHECK (Section 10 & P1-003) */}
        {activeTab === "diagnostic" && (
          <section
            data-testid="subject-diagnostic"
            style={{
              background: "var(--surface, #fff)",
              border: "1px solid var(--border, #e4e1d8)",
              borderRadius: 20,
              padding: "22px 24px",
              display: "grid",
              gap: 16
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: 21 }}>
                {ui.diagTitle} · {curriculum.title[locale]}
              </h2>
              <p style={{ margin: 0, fontSize: 14.5, color: "var(--muted, #57544e)" }}>
                {ui.diagSubtitle}
              </p>
            </div>

            {!diagDone && diagnosticQuestions[diagIndex] ? (
              <UniversalQuestionRenderer
                question={diagnosticQuestions[diagIndex]}
                locale={locale}
                onEvaluated={(ev, q, attemptId) => {
                  handleQuestionEvaluated(ev, q, attemptId);
                  setDiagResponses((prev) => {
                    const filtered = prev.filter((item) => item.questionId !== q.id);
                    return [
                      ...filtered,
                      {
                        questionId: q.id,
                        topicId: q.topicId,
                        difficulty: q.difficulty,
                        verificationState: ev.verificationState,
                        earnedPoints: ev.earnedPoints,
                        maxPoints: ev.maxPoints
                      }
                    ];
                  });
                }}
                onNextQuestion={() => {
                  const step = advanceLessonQuestionIndex(diagIndex, diagnosticQuestions.length);
                  if (step.completed) {
                    finalizeDiagnostic(diagResponses);
                  } else {
                    setDiagIndex(step.nextIndex);
                  }
                }}
                nextButtonLabel={ui.diagNextBtn}
              />
            ) : (
              <div
                data-testid="diagnostic-completed-card"
                style={{
                  padding: "18px 20px",
                  borderRadius: 16,
                  background: "rgba(22, 163, 74, 0.08)",
                  border: "1px solid rgba(22, 163, 74, 0.3)",
                  display: "grid",
                  gap: 10
                }}
              >
                <strong style={{ fontSize: 18 }}>
                  {ui.diagDoneTitle}{" "}
                  {lastDiag ? `${lastDiag.scorePercent}%` : `${subjectProgress.diagnosticScorePercent ?? 0}%`}
                </strong>
                {lastDiag && (
                  <div style={{ fontSize: 13.5, color: "var(--muted, #57544e)" }}>
                    {ui.diagConfidencePrefix} <strong>{lastDiag.confidenceLevel.toUpperCase()}</strong> ·{" "}
                    ✓ {lastDiag.verifiedCorrectCount} / ✕ {lastDiag.incorrectCount}
                  </div>
                )}
                <p style={{ margin: 0, fontSize: 14.5 }}>
                  {lastDiag
                    ? lastDiag.recommendationReason[locale]
                    : recommendedLessonInfo.reason[locale]}
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {/* P1-003 FIX: Open the exact recommendedLessonInfo.index, NEVER hardcoded 0 */}
                  <button
                    type="button"
                    data-testid="start-recommended-lesson-btn"
                    onClick={() => openLessonByIndex(recommendedLessonInfo.index)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 10,
                      border: "none",
                      background: "var(--accent, #3856f5)",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    {ui.startRecommendedLessonBtn} ({recommendedLessonInfo.lesson.title[locale]})
                  </button>
                  <button
                    type="button"
                    onClick={() => switchTab("map")}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 10,
                      border: "1px solid var(--border, #dcd8ce)",
                      background: "var(--surface, #fff)",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    {ui.diagViewMapBtn}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
