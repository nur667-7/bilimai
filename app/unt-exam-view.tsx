"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Atom,
  BarChart3,
  BookOpen,
  BookOpenText,
  Bookmark,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Cpu,
  Dna,
  FlaskConical,
  GitBranch,
  Globe2,
  Grid,
  History,
  Landmark,
  Languages,
  Layers,
  RotateCcw,
  Scale,
  Settings2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  evaluateUntExam,
  scoreUntQuestion,
  untQuestions,
  type UntAttemptSummary,
  type UntExamEvaluation,
  type UntQuestion,
  type UntUserAnswer
} from "@/lib/unt-exam";
import {
  UNT_PROFILE_COMBINATIONS,
  UNT_SUBJECTS,
  generateSubjectUntVariant,
  getUntSubjectMeta,
  type UntSubjectId,
  type UntVariantMode
} from "@/lib/unt-all-subjects";
import { topicName } from "@/lib/error-lab";
import type { Language, TopicId } from "@/lib/lessons";

const EXAM_COPY = {
  ru: {
    changeSetupBtn: "Сменить предмет / вариант",
    hideSetupBtn: "Свернуть настройки и перейти к вопросу №1",
    startExamBtn: "Начать вариант",
    modeLabel: "Режим набора:",
    modeOfficial: "Официальный формат НЦТ",
    modeExtended: "Тренировочный набор (40 вопр.)",
    officialFormatNote:
      "Формат НЦТ РК (testcenter.kz): Мат. грамотность — 10 вопр. (10 б.), Грамотность чтения — 10 вопр. (10 б.), История Казахстана — 20 вопр. (20 б.), профильные предметы — 40 вопр. (50 б.).",
    comboLabel: "Профильная комбинация:",
    allSubjectsBtn: "Все 12 предметов ЕНТ",
    subjectSelectLabel: "Предмет ЕНТ",
    variantSelectLabel: "Вариант",
    variantPrefix: "Вариант №",
    quickDiagBtn: "Диагностика (18 вопр.)",
    cheatsheetBtn: "Справочник формул и правил",
    gridBtn: "Номера заданий",
    sectionsLabel: "Разделы спецификации НЦТ:",
    filterAll: "Все",
    filterFlagged: "Отмеченные",
    filterTwoPt: "2 балла",
    filterMistakes: "Ошибки",
    questionLabel: "Задание",
    ofLabel: "из",
    points1: "1 балл",
    points2: "2 балла",
    flagBtn: "На проверку",
    flaggedBtn: "Отмечено",
    formatSingle: "1 верный ответ из 4 (1 балл)",
    formatContext: "Контекстное задание НЦТ (1 балл)",
    formatMatching: "Соответствие А и Б → 1..4 (2 балла: 1 пара = 1 б., обе = 2 б.)",
    formatMultiple: "Множественный выбор: от 1 до 3 верных из 6 (2 балла: 1 ошибка = 1 б.)",
    selectedCount: "Выбрано вариантов",
    maxThreeHint: "Максимум 3 ответа по правилам НЦТ РК",
    matchingOptionsRef: "Варианты для сопоставления:",
    prevBtn: "Предыдущая",
    nextBtn: "Следующая задача",
    submitExam: "Завершить и проверить",
    resetExam: "Пройти заново",
    answeredStat: "Отвечено",
    reportTitle: "Результат варианта ЕНТ",
    scaledScoreLabel: "По шкале 50",
    rawScoreLabel: "Первичный балл",
    partialNote: "Частичный балл (1 из 2 б.) в двухбалльных заданиях",
    partialTip: "Резерв быстрого роста: вы знаете тему, но потеряли по 1 баллу на полноте ответа или ОДЗ.",
    weakTopicsTitle: "Разделы с потерей баллов (отмечены на Карте тем)",
    noWeakTopics: "Все разделы варианта решены без потери баллов!",
    openGraphBtn: "Открыть Карту тем",
    openLessonBtn: "Разбор темы",
    openLabBtn: "Тренировка ошибок",
    statusFull: "Полный балл",
    statusPartial: "Частично верно (1 из 2 б.)",
    statusZero: "0 баллов — рекомендуется повторить раздел",
    ruleTitle: "Опорное правило / закон НЦТ:",
    solutionTitle: "Пошаговый разбор:",
    trapTitle: "Типичная ловушка ЕНТ:",
    lastAttemptBanner: "Последний сохранённый результат:",
    qShort: "вопр.",
    ptShort: "б."
  },
  kk: {
    changeSetupBtn: "Пән / нұсқаны ауыстыру",
    hideSetupBtn: "Баптауды жауып, №1 сұраққа өту",
    startExamBtn: "Нұсқаны бастау",
    modeLabel: "Жинақ режимі:",
    modeOfficial: "ҚР ҰТО ресми форматы",
    modeExtended: "Жаттығу жинағы (40 сұрақ)",
    officialFormatNote:
      "ҚР ҰТО форматы (testcenter.kz): Мат. сауаттылық — 10 сұрақ (10 б.), Оқу сауаттылығы — 10 сұрақ (10 б.), Қазақстан тарихы — 20 сұрақ (20 б.), бейіндік пәндер — 40 сұрақ (50 б.).",
    comboLabel: "Бейіндік комбинация:",
    allSubjectsBtn: "Барлық 12 ҰБТ пәні",
    subjectSelectLabel: "ҰБТ пәні",
    variantSelectLabel: "Нұсқа",
    variantPrefix: "Нұсқа №",
    quickDiagBtn: "Диагностика (18 сұрақ)",
    cheatsheetBtn: "Формулалар анықтамалығы",
    gridBtn: "Тапсырма нөмірлері",
    sectionsLabel: "ҰТО спецификация бөлімдері:",
    filterAll: "Барлығы",
    filterFlagged: "Белгіленген",
    filterTwoPt: "2 балдық",
    filterMistakes: "Қателер",
    questionLabel: "Тапсырма",
    ofLabel: "/",
    points1: "1 балл",
    points2: "2 балл",
    flagBtn: "Белгілеу",
    flaggedBtn: "Белгіленді",
    formatSingle: "4 нұсқадан 1 дұрыс жауап (1 балл)",
    formatContext: "Контекстік тапсырма (1 балл)",
    formatMatching: "Сәйкестендіру А, Б → 1..4 (2 балл: 1 жұп = 1 б., екеуі = 2 б.)",
    formatMultiple: "Көп таңдаулы: 6-дан 1–3 дұрыс жауап (2 балл: 1 қате = 1 б.)",
    selectedCount: "Таңдалды",
    maxThreeHint: "ҰБТ ережесі бойынша ең көбі 3 жауап",
    matchingOptionsRef: "Сәйкестендіру нұсқалары:",
    prevBtn: "Алдыңғы",
    nextBtn: "Келесі есеп",
    submitExam: "Аяқтап, тексеру",
    resetExam: "Қайта тапсыру",
    answeredStat: "Жауап берілді",
    reportTitle: "ҰБТ нұсқасының нәтижесі",
    scaledScoreLabel: "50 балдық шкала",
    rawScoreLabel: "Бастапқы балл",
    partialNote: "2 балдық тапсырмалардағы ішінара балл (2-ден 1 б.)",
    partialTip: "Жылдам өсу резерві: тақырыпты білесіз, бірақ ММО немесе толық жауапта 1 балл жоғалттыңыз.",
    weakTopicsTitle: "Балл жоғалған тақырыптар (Тақырыптар картасында белгіленді)",
    noWeakTopics: "Барлық тақырыптар қатесіз орындалды!",
    openGraphBtn: "Тақырыптар картасын ашу",
    openLessonBtn: "Сабақ талдауы",
    openLabBtn: "Қатемен жұмыс",
    statusFull: "Толық балл",
    statusPartial: "Ішінара дұрыс (2-ден 1 б.)",
    statusZero: "0 балл — қайталау керек",
    ruleTitle: "Негізгі ереже / ҰТО заңы:",
    solutionTitle: "Қадамдық талдау:",
    trapTitle: "Жиі кездесетін ҰБТ тұзағы:",
    lastAttemptBanner: "Соңғы сақталған нәтиже:",
    qShort: "сұрақ",
    ptShort: "б."
  },
  uz: {
    changeSetupBtn: "Fan / variantni o‘zgartirish",
    hideSetupBtn: "Sozlamani yopib, №1 savolga o‘tish",
    startExamBtn: "Variantni boshlash",
    modeLabel: "To‘plam rejimi:",
    modeOfficial: "Rasmiy UBT formati",
    modeExtended: "Mashq to‘plami (40 savol)",
    officialFormatNote:
      "Rasmiy UBT formati (testcenter.kz): Mat. savodxonlik — 10 savol (10 b.), O‘qish savodxonligi — 10 savol (10 b.), Qozog‘iston tarixi — 20 savol (20 b.), profil fanlar — 40 savol (50 b.).",
    comboLabel: "Profil kombinatsiyasi:",
    allSubjectsBtn: "Barcha 12 ta fan",
    subjectSelectLabel: "Imtihon fani",
    variantSelectLabel: "Variant",
    variantPrefix: "Variant №",
    quickDiagBtn: "Diagnostika (18 savol)",
    cheatsheetBtn: "Formulalar ma’lumotnomasi",
    gridBtn: "Topshiriq raqamlari",
    sectionsLabel: "Spetsifikatsiya bo‘limlari:",
    filterAll: "Barchasi",
    filterFlagged: "Belgilangan",
    filterTwoPt: "2 balli",
    filterMistakes: "Xatolar",
    questionLabel: "Topshiriq",
    ofLabel: "/",
    points1: "1 ball",
    points2: "2 ball",
    flagBtn: "Belgilash",
    flaggedBtn: "Belgilandi",
    formatSingle: "4 tadan 1 ta to‘g‘ri javob (1 ball)",
    formatContext: "Kontekstli topshiriq (1 ball)",
    formatMatching: "Moslikni aniqlash A, B → 1..4 (2 ball: 1 juft = 1 b., ikkalasi = 2 b.)",
    formatMultiple: "Ko‘p tanlovli: 6 tadan 1–3 to‘g‘ri javob (2 ball: 1 xato = 1 b.)",
    selectedCount: "Tanlandi",
    maxThreeHint: "Qoida bo‘yicha ko‘pi bilan 3 ta javob",
    matchingOptionsRef: "Moslashtirish variantlari:",
    prevBtn: "Oldingi",
    nextBtn: "Keyingi masala",
    submitExam: "Yakunlash va tekshirish",
    resetExam: "Qayta boshlash",
    answeredStat: "Javob berildi",
    reportTitle: "Sinov UBT natijasi",
    scaledScoreLabel: "50 ballik shkala",
    rawScoreLabel: "Birlamchi ball",
    partialNote: "2 balli topshiriqlarda qisman ball (2 dan 1 b.)",
    partialTip: "Tez o‘sish zaxirasi: mavzuni bilasiz, lekin AS yoki to‘liq javobda 1 ball yo‘qotdingiz.",
    weakTopicsTitle: "Ball yo‘qotilgan mavzular (Mavzular xaritasida belgilandi)",
    noWeakTopics: "Barcha mavzular xatosiz yechildi!",
    openGraphBtn: "Mavzular xaritasini ochish",
    openLessonBtn: "Dars tahlili",
    openLabBtn: "Xatolar ustida ishlash",
    statusFull: "To‘liq ball",
    statusPartial: "Qisman to‘g‘ri (2 dan 1 b.)",
    statusZero: "0 ball — takrorlash kerak",
    ruleTitle: "Asosiy qoida / qonun:",
    solutionTitle: "Qadam-baqadam yechim:",
    trapTitle: "Ko‘p uchraydigan tuzoq:",
    lastAttemptBanner: "Oxirgi saqlangan natija:",
    qShort: "savol",
    ptShort: "b."
  }
} as const;

export function SubjectIcon({ subjectId, size = 15 }: { subjectId: UntSubjectId; size?: number }) {
  switch (subjectId) {
    case "math":
      return <Calculator size={size} aria-hidden="true" />;
    case "physics":
      return <Atom size={size} aria-hidden="true" />;
    case "informatics":
      return <Cpu size={size} aria-hidden="true" />;
    case "chemistry":
      return <FlaskConical size={size} aria-hidden="true" />;
    case "biology":
      return <Dna size={size} aria-hidden="true" />;
    case "geography":
      return <Globe2 size={size} aria-hidden="true" />;
    case "history_kz":
      return <Landmark size={size} aria-hidden="true" />;
    case "world_history":
      return <History size={size} aria-hidden="true" />;
    case "law":
      return <Scale size={size} aria-hidden="true" />;
    case "english":
      return <Languages size={size} aria-hidden="true" />;
    case "math_lit":
      return <BarChart3 size={size} aria-hidden="true" />;
    case "reading_lit":
      return <BookOpenText size={size} aria-hidden="true" />;
  }
}

export interface UntExamViewProps {
  lang: Language;
  lastSavedAttempt: UntAttemptSummary | null;
  initialTopic?: TopicId;
  initialSubjectId?: UntSubjectId;
  initialVariantNumber?: number;
  onCompleteExam: (summary: UntAttemptSummary, evaluation: UntExamEvaluation) => void;
  onOpenGraph: (focusTopic?: TopicId) => void;
  onOpenLesson: (topic: TopicId) => void;
}

export function UntExamView({
  lang,
  lastSavedAttempt,
  initialSubjectId = "math",
  initialVariantNumber = 1,
  onCompleteExam,
  onOpenGraph,
  onOpenLesson
}: UntExamViewProps) {
  const t = EXAM_COPY[lang];
  const [selectedComboId, setSelectedComboId] = useState<string>("all");
  const [subjectId, setSubjectId] = useState<UntSubjectId>(initialSubjectId);
  const [variantNumber, setVariantNumber] = useState<number>(initialVariantNumber);
  const [variantMode, setVariantMode] = useState<UntVariantMode>("official");
  // Setup drawer is collapsed by default so Question #1 is immediately visible in the active viewport
  const [showSetupDrawer, setShowSetupDrawer] = useState<boolean>(false);
  const [showCheatsheet, setShowCheatsheet] = useState<boolean>(false);
  const [showQuestionGrid, setShowQuestionGrid] = useState<boolean>(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [navFilter, setNavFilter] = useState<"all" | "flagged" | "twopt" | "mistakes">("all");
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, UntUserAnswer>>({});
  const [submittedEval, setSubmittedEval] = useState<UntExamEvaluation | null>(null);
  const subjectTabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    setSubjectId(initialSubjectId);
  }, [initialSubjectId]);

  useEffect(() => {
    setVariantNumber(initialVariantNumber);
  }, [initialVariantNumber]);

  const subjectMeta = useMemo(() => getUntSubjectMeta(subjectId), [subjectId]);

  const activeQuestions: UntQuestion[] = useMemo(() => {
    if (subjectId === "math" && variantNumber === 0) {
      return untQuestions;
    }
    const vNum = variantNumber >= 1 && variantNumber <= 10 ? variantNumber : 1;
    return generateSubjectUntVariant(subjectId, vNum, variantMode);
  }, [subjectId, variantNumber, variantMode]);

  const activeMaxPoints = useMemo(
    () => activeQuestions.reduce((acc, q) => acc + q.maxPoints, 0),
    [activeQuestions]
  );

  const visibleSubjects = useMemo(() => {
    if (selectedComboId === "all") return UNT_SUBJECTS;
    const combo = UNT_PROFILE_COMBINATIONS.find((c) => c.id === selectedComboId);
    if (!combo) return UNT_SUBJECTS;
    const allowed = new Set<UntSubjectId>([
      ...combo.subjects,
      "history_kz",
      "math_lit",
      "reading_lit"
    ]);
    return UNT_SUBJECTS.filter((s) => allowed.has(s.id));
  }, [selectedComboId]);

  function handleSelectSubject(nextSubject: UntSubjectId) {
    setSubjectId(nextSubject);
    if (variantNumber === 0 && nextSubject !== "math") {
      setVariantNumber(1);
    }
    setAnswers({});
    setFlagged({});
    setSubmittedEval(null);
    setNavFilter("all");
    setActiveIdx(0);
  }

  function handleSelectVariant(nextVariant: number) {
    setVariantNumber(nextVariant);
    setAnswers({});
    setFlagged({});
    setSubmittedEval(null);
    setNavFilter("all");
    setActiveIdx(0);
  }

  function handleSubjectKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (visibleSubjects.length === 0) return;
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (index + 1) % visibleSubjects.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (index - 1 + visibleSubjects.length) % visibleSubjects.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = visibleSubjects.length - 1;
    }
    if (nextIndex !== null) {
      const targetSubject = visibleSubjects[nextIndex];
      handleSelectSubject(targetSubject.id);
      subjectTabRefs.current[nextIndex]?.focus();
    }
  }

  const currentQuestion: UntQuestion = activeQuestions[activeIdx] ?? activeQuestions[0];
  const currentScore = submittedEval ? submittedEval.questionScores[currentQuestion.id] : null;

  const answeredCount = activeQuestions.filter((q) => {
    const sc = scoreUntQuestion(q, answers[q.id]);
    return sc.status !== "unanswered";
  }).length;

  const twoPtCount = activeQuestions.filter((q) => q.maxPoints === 2).length;

  function toggleFlag(questionId: string) {
    setFlagged((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  }

  function selectSingleAnswer(q: UntQuestion, optionIdx: number) {
    if (submittedEval) return;
    if (q.format !== "single" && q.format !== "context") return;
    setAnswers((prev) => ({
      ...prev,
      [q.id]: { format: q.format, selectedIndex: optionIdx }
    }));
  }

  function selectMatchingPair(q: UntQuestion, rowIdx: 0 | 1, choiceIdx: number) {
    if (submittedEval || q.format !== "matching") return;
    setAnswers((prev) => {
      const existing = prev[q.id];
      const currentPairs: [number | null, number | null] =
        existing && existing.format === "matching" ? [...existing.pairs] : [null, null];
      currentPairs[rowIdx] = choiceIdx;
      return {
        ...prev,
        [q.id]: { format: "matching", pairs: currentPairs }
      };
    });
  }

  function toggleMultipleOption(q: UntQuestion, optionIdx: number) {
    if (submittedEval || q.format !== "multiple") return;
    setAnswers((prev) => {
      const existing = prev[q.id];
      const currentList =
        existing && existing.format === "multiple" ? [...existing.selectedIndices] : [];
      if (currentList.includes(optionIdx)) {
        return {
          ...prev,
          [q.id]: {
            format: "multiple",
            selectedIndices: currentList.filter((i) => i !== optionIdx)
          }
        };
      }
      if (currentList.length >= 3) {
        return prev;
      }
      return {
        ...prev,
        [q.id]: {
          format: "multiple",
          selectedIndices: [...currentList, optionIdx].sort((a, b) => a - b)
        }
      };
    });
  }

  function handleSubmitExam() {
    const evaluation = evaluateUntExam(answers, activeQuestions);
    setSubmittedEval(evaluation);
    setShowQuestionGrid(true);

    const topicRatios = Object.fromEntries(
      Object.entries(evaluation.byTopic).map(([k, v]) => [k, v.ratio])
    ) as UntAttemptSummary["topicRatios"];

    const summary: UntAttemptSummary = {
      completedAt: new Date().toISOString(),
      earnedPoints: evaluation.earnedPoints,
      maxPoints: evaluation.maxPoints,
      scaledScore50: evaluation.scaledScore50,
      weakTopics: evaluation.weakTopics,
      topicRatios
    };
    onCompleteExam(summary, evaluation);
  }

  function handleResetExam() {
    setAnswers({});
    setFlagged({});
    setSubmittedEval(null);
    setNavFilter("all");
    setActiveIdx(0);
  }

  const filteredQuestions = activeQuestions.filter((q) => {
    if (navFilter === "flagged") return Boolean(flagged[q.id]);
    if (navFilter === "twopt") return q.maxPoints === 2;
    if (navFilter === "mistakes" && submittedEval) {
      const sc = submittedEval.questionScores[q.id];
      return sc && sc.status !== "full";
    }
    return true;
  });

  const formatLabel =
    currentQuestion.format === "single"
      ? t.formatSingle
      : currentQuestion.format === "context"
        ? t.formatContext
        : currentQuestion.format === "matching"
          ? t.formatMatching
          : t.formatMultiple;

  return (
    <div className="unt-exam-root">
      {/* Компактная строка активного варианта — вопрос №1 сразу на первом экране */}
      <div className="exam-compact-toolbar">
        <div className="exam-compact-summary">
          <span className="unt-subject-icon">
            <SubjectIcon subjectId={subjectMeta.id} size={16} />
          </span>
          <div>
            <strong className="text-sm">{subjectMeta.title[lang]}</strong>
            <span className="exam-compact-meta">
              {" · "}
              {variantNumber > 0 ? `${t.variantPrefix}${variantNumber}` : t.quickDiagBtn}
              {" · "}
              {activeQuestions.length} {t.qShort} ({activeMaxPoints} {t.ptShort})
              {" · "}
              {t.answeredStat}: {answeredCount}/{activeQuestions.length}
            </span>
          </div>
        </div>

        <div className="exam-compact-actions">
          <Button
            type="button"
            size="sm"
            variant={showSetupDrawer ? "default" : "outline"}
            onClick={() => setShowSetupDrawer((prev) => !prev)}
          >
            <Settings2 size={14} />
            <span>{showSetupDrawer ? t.hideSetupBtn : t.changeSetupBtn}</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant={showQuestionGrid ? "default" : "outline"}
            onClick={() => setShowQuestionGrid((prev) => !prev)}
          >
            <Grid size={14} />
            <span>
              {t.gridBtn} ({activeIdx + 1}/{activeQuestions.length})
            </span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant={showCheatsheet ? "default" : "outline"}
            onClick={() => setShowCheatsheet((prev) => !prev)}
          >
            <BookOpen size={14} />
            <span>{t.cheatsheetBtn}</span>
            {showCheatsheet ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>
        </div>
      </div>

      {/* Панель выбора предмета, режима НЦТ и варианта (сворачивается после выбора) */}
      {showSetupDrawer && (
        <div className="exam-spec-banner">
          <p className="small m-0">{t.officialFormatNote}</p>

          {/* Переключатель: Официальный формат НЦТ (10/20/40) vs Расширенный тренировочный набор (40) */}
          <div className="unt-mode-row mt-3">
            <span className="small font-semibold">{t.modeLabel}</span>
            <div className="unt-combo-pills" role="group" aria-label={t.modeLabel}>
              <button
                type="button"
                className={`unt-combo-chip ${variantMode === "official" ? "active" : ""}`}
                onClick={() => {
                  setVariantMode("official");
                  setActiveIdx(0);
                }}
              >
                <span>{t.modeOfficial} (10 / 20 / 40 {t.qShort})</span>
              </button>
              <button
                type="button"
                className={`unt-combo-chip ${variantMode === "extended40" ? "active" : ""}`}
                onClick={() => {
                  setVariantMode("extended40");
                  setActiveIdx(0);
                }}
              >
                <span>{t.modeExtended}</span>
              </button>
            </div>
          </div>

          {/* Фильтр профильных комбинаций гранта РК */}
          <div className="unt-combo-bar mt-3">
            <span className="small font-semibold">{t.comboLabel}</span>
            <div className="unt-combo-pills">
              <button
                type="button"
                className={`unt-combo-chip ${selectedComboId === "all" ? "active" : ""}`}
                onClick={() => setSelectedComboId("all")}
              >
                <Layers size={13} />
                <span>{t.allSubjectsBtn}</span>
              </button>
              {UNT_PROFILE_COMBINATIONS.map((combo) => (
                <button
                  key={combo.id}
                  type="button"
                  className={`unt-combo-chip ${selectedComboId === combo.id ? "active" : ""}`}
                  onClick={() => {
                    setSelectedComboId(combo.id);
                    if (!combo.subjects.includes(subjectId)) {
                      handleSelectSubject(combo.subjects[0]);
                    }
                  }}
                >
                  <span>{combo.title[lang]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Выбор одного из 12 предметов ЕНТ с клавиатурной навигацией ArrowLeft/ArrowRight */}
          <div className="unt-subject-bar mt-3">
            <div className="unt-subject-grid" role="tablist" aria-label={t.subjectSelectLabel}>
              {visibleSubjects.map((subj, idx) => {
                const active = subj.id === subjectId;
                const qCount = variantMode === "official" ? subj.officialQuestions : subj.variantQuestionsCount;
                const ptCount = variantMode === "official" ? subj.officialMaxPoints : subj.variantMaxPoints;
                return (
                  <button
                    key={subj.id}
                    ref={(el) => {
                      subjectTabRefs.current[idx] = el;
                    }}
                    type="button"
                    role="tab"
                    tabIndex={active ? 0 : -1}
                    aria-selected={active}
                    className={`unt-subject-card ${active ? "active" : ""}`}
                    style={{ "--subj-accent": `rgb(${subj.accentRgb})` } as React.CSSProperties}
                    onClick={() => handleSelectSubject(subj.id)}
                    onKeyDown={(e) => handleSubjectKeyDown(e, idx)}
                  >
                    <span className="unt-subject-icon">
                      <SubjectIcon subjectId={subj.id} size={16} />
                    </span>
                    <span className="unt-subject-info">
                      <strong>{subj.title[lang]}</strong>
                      <small>
                        {qCount} {t.qShort} · {ptCount} {t.ptShort}
                      </small>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Выбор варианта 1..10 */}
          <div className="unt-variant-row mt-3">
            <div className="unt-variant-pills" role="group" aria-label={t.variantSelectLabel}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((vNum) => (
                <button
                  key={vNum}
                  type="button"
                  className={`unt-variant-pill ${variantNumber === vNum ? "active" : ""}`}
                  onClick={() => handleSelectVariant(vNum)}
                >
                  {t.variantPrefix}
                  {vNum}
                </button>
              ))}
              {subjectId === "math" && (
                <button
                  type="button"
                  className={`unt-variant-pill ${variantNumber === 0 ? "active" : ""}`}
                  onClick={() => handleSelectVariant(0)}
                >
                  {t.quickDiagBtn}
                </button>
              )}
            </div>

            <Button type="button" size="sm" onClick={() => setShowSetupDrawer(false)}>
              <span>{t.startExamBtn}</span>
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* Справочник формул, дат и законов по выбранному предмету (открывается отдельно) */}
      {showCheatsheet && (
        <div className="unt-cheatsheet-panel">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <strong className="text-sm flex items-center gap-1.5">
              <SubjectIcon subjectId={subjectMeta.id} size={15} />
              <span>
                {subjectMeta.title[lang]} — {t.sectionsLabel}
              </span>
            </strong>
            <div className="flex flex-wrap gap-1.5">
              {subjectMeta.sections[lang].map((sec) => (
                <span key={sec} className="section-pill">
                  {sec}
                </span>
              ))}
            </div>
          </div>
          <div className="unt-cheatsheet-grid">
            {subjectMeta.referenceCheatsheet.map((item) => (
              <div key={item.tag} className="unt-cheatsheet-card">
                <strong className="text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  {item.tag}
                </strong>
                <code className="block text-xs sm:text-sm font-mono mt-1 font-semibold">
                  {item.formulaOrFact}
                </code>
                <p className="small mt-1 mb-0">{item.note[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Матрица номеров заданий 01..N (открывается по кнопке или после завершения) */}
      {showQuestionGrid && (
        <div className="exam-hud-bar">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Фильтр вопросов ЕНТ">
              <Button
                type="button"
                size="sm"
                variant={navFilter === "all" ? "default" : "outline"}
                onClick={() => setNavFilter("all")}
              >
                {t.filterAll} ({activeQuestions.length})
              </Button>
              {twoPtCount > 0 && (
                <Button
                  type="button"
                  size="sm"
                  variant={navFilter === "twopt" ? "default" : "outline"}
                  onClick={() => setNavFilter("twopt")}
                >
                  {t.filterTwoPt} ({twoPtCount})
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                variant={navFilter === "flagged" ? "default" : "outline"}
                onClick={() => setNavFilter("flagged")}
              >
                <Bookmark size={13} />
                {t.filterFlagged} ({Object.values(flagged).filter(Boolean).length})
              </Button>
              {submittedEval && (
                <Button
                  type="button"
                  size="sm"
                  variant={navFilter === "mistakes" ? "default" : "outline"}
                  onClick={() => setNavFilter("mistakes")}
                >
                  <AlertTriangle size={13} />
                  {t.filterMistakes}
                </Button>
              )}
            </div>
          </div>

          <div className="exam-nav-grid" role="navigation" aria-label="Навигация по заданиям ЕНТ">
            {(filteredQuestions.length > 0 ? filteredQuestions : activeQuestions).map((q) => {
              const idx = activeQuestions.findIndex((item) => item.id === q.id);
              const isCurrent = idx === activeIdx;
              const sc = scoreUntQuestion(q, answers[q.id]);
              const isAnswered = sc.status !== "unanswered";
              const isFlag = Boolean(flagged[q.id]);

              let statusClass = "";
              if (submittedEval) {
                const evalScore = submittedEval.questionScores[q.id];
                if (evalScore?.status === "full") statusClass = "exam-cell-full";
                else if (evalScore?.status === "partial") statusClass = "exam-cell-partial";
                else statusClass = "exam-cell-zero";
              } else if (isAnswered) {
                statusClass = "exam-cell-answered";
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  className={`exam-nav-cell ${isCurrent ? "current" : ""} ${statusClass}`}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`${t.questionLabel} ${q.order} (${q.maxPoints === 2 ? t.points2 : t.points1})`}
                  onClick={() => setActiveIdx(idx)}
                >
                  <span className="tabular-nums">{String(q.order).padStart(2, "0")}</span>
                  {q.maxPoints === 2 && <small className="exam-cell-2pt">2б</small>}
                  {isFlag && (
                    <span className="exam-cell-flag" aria-hidden="true">
                      <Bookmark size={9} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {lastSavedAttempt && !submittedEval && (
        <div className="exam-saved-strip">
          <span>
            {t.lastAttemptBanner}{" "}
            <strong>
              {lastSavedAttempt.scaledScore50}/50 ({lastSavedAttempt.earnedPoints}/{lastSavedAttempt.maxPoints})
            </strong>
          </span>
          <button
            type="button"
            className="underline font-semibold text-xs inline-flex items-center gap-1"
            onClick={() => onOpenGraph(lastSavedAttempt.weakTopics[0])}
          >
            <span>{t.openGraphBtn}</span>
            <ChevronRight size={13} />
          </button>
        </div>
      )}

      {/* Карточка текущего вопроса ЕНТ */}
      <div className="exam-question-card" aria-live="polite">
        <div className="exam-question-meta">
          <div className="flex flex-wrap items-center gap-2">
            <span className="exam-q-number tabular-nums">
              {t.questionLabel} #{currentQuestion.order} {t.ofLabel} {activeQuestions.length}
            </span>
            <span className="section-pill">{currentQuestion.untNumberRange}</span>
            <span className={`exam-weight-pill ${currentQuestion.maxPoints === 2 ? "two-pt" : ""}`}>
              {currentQuestion.maxPoints === 2 ? t.points2 : t.points1}
            </span>
            <span className="small font-semibold text-muted-foreground">
              · {subjectMeta.title[lang]} ({topicName(currentQuestion.topic, lang)})
            </span>
          </div>
          <Button
            type="button"
            size="sm"
            variant={flagged[currentQuestion.id] ? "default" : "outline"}
            aria-pressed={Boolean(flagged[currentQuestion.id])}
            onClick={() => toggleFlag(currentQuestion.id)}
          >
            <Bookmark size={14} />
            {flagged[currentQuestion.id] ? t.flaggedBtn : t.flagBtn}
          </Button>
        </div>

        <p className="exam-format-hint">{formatLabel}</p>

        {/* Контекстная вставка для заданий №26–30 */}
        {currentQuestion.format === "context" && (
          <div className="exam-context-box">
            <strong>{currentQuestion.contextTitle[lang]}</strong>
            <p className="mt-1 mb-0">{currentQuestion.contextBody[lang]}</p>
          </div>
        )}

        <h3 className="exam-stem">{currentQuestion.prompt[lang]}</h3>

        {/* Формат 1 и 2: Single Choice / Context (1 из 4) */}
        {(currentQuestion.format === "single" || currentQuestion.format === "context") && (
          <div className="exam-options-list" role="radiogroup" aria-label={currentQuestion.prompt[lang]}>
            {currentQuestion.options[lang].map((opt, optIdx) => {
              const ans = answers[currentQuestion.id];
              const isSelected =
                (ans?.format === "single" || ans?.format === "context") &&
                ans.selectedIndex === optIdx;
              const isCorrectOption = submittedEval && currentQuestion.correctIndex === optIdx;
              const isWrongSelected = submittedEval && isSelected && !isCorrectOption;
              const letter = ["A", "B", "C", "D"][optIdx] ?? String(optIdx + 1);

              return (
                <button
                  key={`${currentQuestion.id}-opt-${optIdx}`}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={Boolean(submittedEval)}
                  className={`exam-option-btn ${isSelected ? "selected" : ""} ${
                    isCorrectOption ? "correct" : ""
                  } ${isWrongSelected ? "wrong" : ""}`}
                  onClick={() => selectSingleAnswer(currentQuestion, optIdx)}
                >
                  <span className="exam-opt-letter">{letter}</span>
                  <span className="exam-opt-text">{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Формат 3: Matching (Установление соответствия А, Б -> 1..4 на 2 балла) */}
        {currentQuestion.format === "matching" && (
          <div className="exam-matching-wrap">
            <div className="exam-matching-ref">
              <strong className="small block mb-1">{t.matchingOptionsRef}</strong>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {currentQuestion.rightOptions[lang].map((ro, rIdx) => (
                  <div key={`${currentQuestion.id}-ro-${rIdx}`} className="exam-matching-chip">
                    {ro}
                  </div>
                ))}
              </div>
            </div>

            <div className="exam-matching-rows">
              {([0, 1] as const).map((rowIdx) => {
                const rowText = currentQuestion.leftItems[lang][rowIdx];
                const ans = answers[currentQuestion.id];
                const chosenIdx =
                  ans?.format === "matching" ? ans.pairs[rowIdx] : null;
                const corrIdx = currentQuestion.correctPairs[rowIdx];

                return (
                  <div key={`${currentQuestion.id}-row-${rowIdx}`} className="exam-matching-row">
                    <div className="exam-matching-prompt">{rowText}</div>
                    <div
                      className="exam-matching-choices"
                      role="radiogroup"
                      aria-label={rowText}
                    >
                      {[0, 1, 2, 3].map((choiceIdx) => {
                        const active = chosenIdx === choiceIdx;
                        const isRight = submittedEval && corrIdx === choiceIdx;
                        const isWrong = submittedEval && active && corrIdx !== choiceIdx;
                        return (
                          <button
                            key={choiceIdx}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            disabled={Boolean(submittedEval)}
                            className={`exam-match-num-btn ${active ? "selected" : ""} ${
                              isRight ? "correct" : ""
                            } ${isWrong ? "wrong" : ""}`}
                            onClick={() =>
                              selectMatchingPair(currentQuestion, rowIdx, choiceIdx)
                            }
                          >
                            {choiceIdx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Формат 4: Multiple Choice (1..3 из 6 на 2 балла) */}
        {currentQuestion.format === "multiple" && (() => {
          const ans = answers[currentQuestion.id];
          const selectedList =
            ans?.format === "multiple" ? ans.selectedIndices : [];
          const limitReached = selectedList.length >= 3;

          return (
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <span className="small font-semibold tabular-nums">
                  {t.selectedCount}: {selectedList.length} / 3
                </span>
                <span className="small text-muted-foreground">{t.maxThreeHint}</span>
              </div>
              <div className="exam-options-list" role="group" aria-label={currentQuestion.prompt[lang]}>
                {currentQuestion.options[lang].map((opt, optIdx) => {
                  const isSelected = selectedList.includes(optIdx);
                  const isDisabled = Boolean(submittedEval) || (!isSelected && limitReached);
                  const isCorrectOpt =
                    submittedEval && currentQuestion.correctIndices.includes(optIdx);
                  const isWrongSelected =
                    submittedEval && isSelected && !isCorrectOpt;

                  return (
                    <button
                      key={`${currentQuestion.id}-mopt-${optIdx}`}
                      type="button"
                      aria-pressed={isSelected}
                      disabled={isDisabled}
                      className={`exam-option-btn multi ${isSelected ? "selected" : ""} ${
                        isCorrectOpt ? "correct" : ""
                      } ${isWrongSelected ? "wrong" : ""}`}
                      onClick={() => toggleMultipleOption(currentQuestion, optIdx)}
                    >
                      <span className="exam-opt-check" aria-hidden="true">
                        {isSelected ? <Check size={13} /> : null}
                      </span>
                      <span className="exam-opt-text">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Пошаговый разбор после завершения ЕНТ */}
        {submittedEval && currentScore && (
          <div
            className={`exam-solution-box mt-4 ${
              currentScore.status === "full"
                ? "sol-full"
                : currentScore.status === "partial"
                  ? "sol-partial"
                  : "sol-zero"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <strong>
                {currentScore.status === "full"
                  ? `${t.statusFull} (${currentScore.earned}/${currentScore.max})`
                  : currentScore.status === "partial"
                    ? `${t.statusPartial}`
                    : `${t.statusZero} (0/${currentScore.max})`}
              </strong>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenLesson(currentQuestion.topic)}
                >
                  {t.openLessonBtn}
                </Button>
                <a
                  className="cta-pill text-xs py-1 px-2.5"
                  href={`/lab?lang=${lang}&topic=${currentQuestion.topic}`}
                >
                  <FlaskConical size={13} />
                  {t.openLabBtn}
                </a>
              </div>
            </div>
            <p className="small mb-1.5">
              <strong>{t.ruleTitle}</strong> {currentQuestion.rule[lang]}
            </p>
            <p className="small mb-1.5">
              <strong>{t.solutionTitle}</strong> {currentQuestion.explanation[lang]}
            </p>
            <p className="small m-0 text-muted-foreground">
              <strong>{t.trapTitle}</strong> {currentQuestion.trap[lang]}
            </p>
          </div>
        )}

        {/* Навигация Вперёд / Назад и Завершение */}
        <div className="exam-footer-actions">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={activeIdx === 0}
              onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
            >
              <ChevronLeft size={15} />
              <span>{t.prevBtn}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={activeIdx === activeQuestions.length - 1}
              onClick={() => setActiveIdx((i) => Math.min(activeQuestions.length - 1, i + 1))}
            >
              <span>{t.nextBtn}</span>
              <ChevronRight size={15} />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {!submittedEval ? (
              <Button type="button" onClick={handleSubmitExam}>
                <CheckCircle2 size={16} />
                <span>{t.submitExam}</span>
              </Button>
            ) : (
              <>
                <Button type="button" onClick={() => onOpenGraph(submittedEval.weakTopics[0])}>
                  <GitBranch size={15} />
                  <span>{t.openGraphBtn}</span>
                </Button>
                <Button type="button" variant="outline" onClick={handleResetExam}>
                  <RotateCcw size={15} />
                  <span>{t.resetExam}</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Итоговая диагностическая сводка после сдачи */}
      {submittedEval && (
        <section className="exam-report-card mt-5" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold m-0">
                {t.reportTitle} — {subjectMeta.title[lang]} (
                {variantNumber > 0 ? `${t.variantPrefix}${variantNumber}` : t.quickDiagBtn})
              </h3>
              <p className="small mt-0.5 mb-0">
                {t.rawScoreLabel}:{" "}
                <strong className="tabular-nums">
                  {submittedEval.earnedPoints} / {submittedEval.maxPoints}
                </strong>
              </p>
            </div>
            <div className="exam-scaled-badge tabular-nums">
              <span>{t.scaledScoreLabel}:</span>
              <strong>{submittedEval.scaledScore50} / 50</strong>
            </div>
          </div>

          <div className="exam-format-breakdown mt-3">
            <div className="exam-stat-box">
              <span className="small">1 {t.ptShort} (A–D)</span>
              <strong className="tabular-nums">
                {submittedEval.byFormat.single.earned}/{submittedEval.byFormat.single.max}
              </strong>
            </div>
            {submittedEval.byFormat.context.max > 0 && (
              <div className="exam-stat-box">
                <span className="small">Контекст (1 {t.ptShort})</span>
                <strong className="tabular-nums">
                  {submittedEval.byFormat.context.earned}/{submittedEval.byFormat.context.max}
                </strong>
              </div>
            )}
            {submittedEval.byFormat.matching.max > 0 && (
              <div className="exam-stat-box">
                <span className="small">Соотв. (2 {t.ptShort})</span>
                <strong className="tabular-nums">
                  {submittedEval.byFormat.matching.earned}/{submittedEval.byFormat.matching.max}
                </strong>
              </div>
            )}
            {submittedEval.byFormat.multiple.max > 0 && (
              <div className="exam-stat-box">
                <span className="small">Множ. (2 {t.ptShort})</span>
                <strong className="tabular-nums">
                  {submittedEval.byFormat.multiple.earned}/{submittedEval.byFormat.multiple.max}
                </strong>
              </div>
            )}
          </div>

          {submittedEval.partialTwoPointCount > 0 && (
            <div className="callout mt-3">
              <strong>
                <Sparkles size={14} className="inline mr-1" />
                {t.partialNote}: {submittedEval.partialTwoPointCount}
              </strong>
              <p className="small mt-1 mb-0">{t.partialTip}</p>
            </div>
          )}

          <div className="mt-4">
            <strong className="block text-sm mb-2">{t.weakTopicsTitle}:</strong>
            {submittedEval.weakTopics.length === 0 ? (
              <p className="small text-emerald-700 font-semibold">{t.noWeakTopics}</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {submittedEval.weakTopics.map((topicId) => {
                  const st = submittedEval.byTopic[topicId];
                  return (
                    <button
                      key={topicId}
                      type="button"
                      className="exam-gap-pill"
                      onClick={() => onOpenGraph(topicId)}
                    >
                      <span>{topicName(topicId, lang)}</span>
                      <strong className="tabular-nums">
                        {st.earned}/{st.max} {t.ptShort}
                      </strong>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
