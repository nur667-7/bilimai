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
  Play,
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
    setupTitle: "Пробное ЕНТ: настройка тестирования",
    setupSubtitle:
      "Выберите предмет, формат и вариант перед началом. Во время решения настройки скроются, чтобы ничто не отвлекало от задачи.",
    step1Subject: "1. Выберите предмет ЕНТ",
    step2Format: "2. Выберите формат набора",
    step3Variant: "3. Выберите вариант",
    summaryReadyLabel: "Выбранный набор:",
    changeSetupBtn: "Сменить предмет / вариант",
    hideSetupBtn: "Вернуться к вопросу",
    startExamBtn: "Начать тестирование",
    modeLabel: "Формат набора:",
    modeOfficial: "Официальный формат НЦТ",
    modeExtended: "Тренировочный набор (40 вопр.)",
    officialFormatNote:
      "Формат НЦТ РК (testcenter.kz): Мат. грамотность — 10 заданий (10 б.), Грамотность чтения — 10 заданий (10 б.), История Казахстана — 20 заданий (20 б.), профильные предметы — 40 заданий (50 б.).",
    comboLabel: "Фильтр по профильной комбинации:",
    allSubjectsBtn: "Все 12 предметов ЕНТ",
    subjectSelectLabel: "Предмет ЕНТ",
    variantSelectLabel: "Вариант",
    variantPrefix: "Вариант №",
    quickDiagBtn: "Диагностика по математике (18 заданий)",
    quickDiagNote: "Быстрая проверка 16 тем курса математики (25 первичных баллов).",
    cheatsheetBtn: "Справочник формул",
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
    resetExam: "Пройти вариант заново",
    chooseAnotherExam: "Другой предмет или вариант",
    answeredStat: "Отвечено",
    reportTitle: "Результат тестирования",
    scaledScoreLabel: "По шкале 50",
    rawScoreLabel: "Первичный балл",
    incompleteTitle: "Вы ответили на {answered} из {total} заданий. Тест не завершён.",
    incompleteSub:
      "В список ошибок включены только разделы, где дан неверный ответ ({wrong}). Пропущенные задания ({skipped}) показаны отдельно и не считаются проверенными ошибками.",
    completeBadge: "Все задания варианта проверены",
    partialNote: "Частичный балл (1 из 2 б.) в двухбалльных заданиях",
    partialTip: "Резерв быстрого роста: вы знаете тему, но потеряли по 1 баллу на полноте ответа или ОДЗ.",
    verifiedWeakTitle: "Разделы с ошибками в ваших ответах",
    noVerifiedWeakYet: "В отвеченных заданиях ошибок нет.",
    noAnswersGiven: "Вы ещё не ответили ни на одно задание — ошибки по темам не определены.",
    skippedTopicsTitle: "Не проверено (пропущенные разделы без ответа)",
    skippedBadge: "пропущено",
    openGraphBtn: "Открыть Карту тем",
    openLessonBtn: "Перейти к уроку темы",
    openLabBtn: "Тренировка ошибок",
    toggleReviewShow: "Разобрать ответы по вопросам",
    toggleReviewHide: "Скрыть разбор вопросов",
    statusFull: "Полный балл",
    statusPartial: "Частично верно (1 из 2 б.)",
    statusZero: "Ошибка в ответе (0 баллов)",
    statusUnanswered: "Задание пропущено (без ответа)",
    ruleTitle: "Опорное правило / закон НЦТ:",
    solutionTitle: "Пошаговый разбор:",
    trapTitle: "Типичная ловушка ЕНТ:",
    lastAttemptBanner: "Последний сохранённый результат:",
    qShort: "заданий",
    ptShort: "б."
  },
  kk: {
    setupTitle: "Сынақ ҰБТ: тестілеуді баптау",
    setupSubtitle:
      "Бастамас бұрын пәнді, форматты және нұсқаны таңдаңыз. Есеп шығару кезінде баптаулар жасырылады.",
    step1Subject: "1. ҰБТ пәнін таңдаңыз",
    step2Format: "2. Жинақ форматын таңдаңыз",
    step3Variant: "3. Нұсқаны таңдаңыз",
    summaryReadyLabel: "Таңдалған жинақ:",
    changeSetupBtn: "Пән / нұсқаны ауыстыру",
    hideSetupBtn: "Тапсырмаға оралу",
    startExamBtn: "Тестілеуді бастау",
    modeLabel: "Жинақ форматы:",
    modeOfficial: "ҚР ҰТО ресми форматы",
    modeExtended: "Жаттығу жинағы (40 сұрақ)",
    officialFormatNote:
      "ҚР ҰТО форматы (testcenter.kz): Мат. сауаттылық — 10 сұрақ (10 б.), Оқу сауаттылығы — 10 сұрақ (10 б.), Қазақстан тарихы — 20 сұрақ (20 б.), бейіндік пәндер — 40 сұрақ (50 б.).",
    comboLabel: "Бейіндік комбинация бойынша сүзгі:",
    allSubjectsBtn: "Барлық 12 ҰБТ пәні",
    subjectSelectLabel: "ҰБТ пәні",
    variantSelectLabel: "Нұсқа",
    variantPrefix: "Нұсқа №",
    quickDiagBtn: "Математика диагностикасы (18 тапсырма)",
    quickDiagNote: "Математика курсының 16 тақырыбын жылдам тексеру (25 бастапқы балл).",
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
    chooseAnotherExam: "Басқа пән немесе нұсқа",
    answeredStat: "Жауап берілді",
    reportTitle: "Тестілеу нәтижесі",
    scaledScoreLabel: "50 балдық шкала",
    rawScoreLabel: "Бастапқы балл",
    incompleteTitle: "Сіз {total} тапсырманың {answered}-іне жауап бердіңіз. Тест толық аяқталмады.",
    incompleteSub:
      "Қателер тізіміне тек қате жауап берілген бөлімдер ({wrong}) енгізілді. Жауапсыз қалған тапсырмалар ({skipped}) бөлек көрсетіледі.",
    completeBadge: "Нұсқаның барлық тапсырмасы тексерілді",
    partialNote: "2 балдық тапсырмалардағы ішінара балл (2-ден 1 б.)",
    partialTip: "Жылдам өсу резерві: тақырыпты білесіз, бірақ ММО немесе толық жауапта 1 балл жоғалттыңыз.",
    verifiedWeakTitle: "Жауаптарыңызда қате кеткен бөлімдер",
    noVerifiedWeakYet: "Жауап берілген тапсырмаларда қате жоқ.",
    noAnswersGiven: "Сіз бірде-бір тапсырмаға жауап бермедіңіз — тақырыптар бойынша қателер анықталмады.",
    skippedTopicsTitle: "Тексерілмеген (жауапсыз қалған бөлімдер)",
    skippedBadge: "жауапсыз",
    openGraphBtn: "Тақырыптар картасын ашу",
    openLessonBtn: "Тақырып сабағына өту",
    openLabBtn: "Қатемен жұмыс",
    toggleReviewShow: "Сұрақтар бойынша талдауды ашу",
    toggleReviewHide: "Сұрақтар талдауын жасыру",
    statusFull: "Толық балл",
    statusPartial: "Ішінара дұрыс (2-ден 1 б.)",
    statusZero: "Жауапта қате бар (0 балл)",
    statusUnanswered: "Тапсырма жауапсыз қалды",
    ruleTitle: "Негізгі ереже / ҰТО заңы:",
    solutionTitle: "Қадамдық талдау:",
    trapTitle: "Жиі кездесетін ҰБТ тұзағы:",
    lastAttemptBanner: "Соңғы сақталған нәтиже:",
    qShort: "тапсырма",
    ptShort: "б."
  },
  uz: {
    setupTitle: "Sinov UBT: testni sozlash",
    setupSubtitle:
      "Boshlashdan oldin fan, format va variantni tanlang. Yechish vaqtida sozlamalar yashiriladi.",
    step1Subject: "1. Imtihon fanini tanlang",
    step2Format: "2. To‘plam formatini tanlang",
    step3Variant: "3. Variantni tanlang",
    summaryReadyLabel: "Tanlangan to‘plam:",
    changeSetupBtn: "Fan / variantni o‘zgartirish",
    hideSetupBtn: "Savolga qaytish",
    startExamBtn: "Testni boshlash",
    modeLabel: "To‘plam formati:",
    modeOfficial: "Rasmiy UBT formati",
    modeExtended: "Mashq to‘plami (40 savol)",
    officialFormatNote:
      "Rasmiy UBT formati (testcenter.kz): Mat. savodxonlik — 10 savol (10 b.), O‘qish savodxonligi — 10 savol (10 b.), Qozog‘iston tarixi — 20 savol (20 b.), profil fanlar — 40 savol (50 b.).",
    comboLabel: "Profil kombinatsiyasi bo‘yicha filtr:",
    allSubjectsBtn: "Barcha 12 ta fan",
    subjectSelectLabel: "Imtihon fani",
    variantSelectLabel: "Variant",
    variantPrefix: "Variant №",
    quickDiagBtn: "Matematika diagnostikasi (18 topshiriq)",
    quickDiagNote: "Matematika kursining 16 ta mavzusini tezkor tekshirish (25 birlamchi ball).",
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
    chooseAnotherExam: "Boshqa fan yoki variant",
    answeredStat: "Javob berildi",
    reportTitle: "Test natijasi",
    scaledScoreLabel: "50 ballik shkala",
    rawScoreLabel: "Birlamchi ball",
    incompleteTitle: "Siz {total} topshiriqdan {answered} tasiga javob berdingiz. Test yakunlanmadi.",
    incompleteSub:
      "Xatolar ro‘yxatiga faqat noto‘g‘ri javob berilgan bo‘limlar ({wrong}) kiritildi. Javobsiz qolgan topshiriqlar ({skipped}) alohida ko‘rsatilgan.",
    completeBadge: "Variantning barcha topshiriqlari tekshirildi",
    partialNote: "2 balli topshiriqlarda qisman ball (2 dan 1 b.)",
    partialTip: "Tez o‘sish zaxirasi: mavzuni bilasiz, lekin AS yoki to‘liq javobda 1 ball yo‘qotdingiz.",
    verifiedWeakTitle: "Javoblaringizda xato ketgan bo‘limlar",
    noVerifiedWeakYet: "Javob berilgan topshiriqlarda xato yo‘q.",
    noAnswersGiven: "Siz birorta ham topshiriqqa javob bermadingiz — mavzular bo‘yicha xatolar aniqlanmadi.",
    skippedTopicsTitle: "Tekshirilmagan (javobsiz qolgan bo‘limlar)",
    skippedBadge: "javobsiz",
    openGraphBtn: "Mavzular xaritasini ochish",
    openLessonBtn: "Mavzu darsiga o‘tish",
    openLabBtn: "Xatolar ustida ishlash",
    toggleReviewShow: "Savollar bo‘yicha tahlilni ko‘rish",
    toggleReviewHide: "Savollar tahlilini yashirish",
    statusFull: "To‘liq ball",
    statusPartial: "Qisman to‘g‘ri (2 dan 1 b.)",
    statusZero: "Javobda xato (0 ball)",
    statusUnanswered: "Topshiriq javobsiz qoldi",
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
  initialAutoStart?: boolean;
  onSubjectChange?: (subject: UntSubjectId) => void;
  onCompleteExam: (summary: UntAttemptSummary, evaluation: UntExamEvaluation) => void;
  onOpenGraph: (focusTopic?: TopicId) => void;
  onOpenLesson: (topic: TopicId) => void;
}

export function UntExamView({
  lang,
  lastSavedAttempt,
  initialSubjectId = "math",
  initialVariantNumber = 1,
  initialAutoStart = false,
  onSubjectChange,
  onCompleteExam,
  onOpenGraph,
  onOpenLesson
}: UntExamViewProps) {
  const t = EXAM_COPY[lang];
  const [selectedComboId, setSelectedComboId] = useState<string>("all");
  const [subjectId, setSubjectId] = useState<UntSubjectId>(initialSubjectId);
  const [variantNumber, setVariantNumber] = useState<number>(initialVariantNumber);
  const [variantMode, setVariantMode] = useState<UntVariantMode>("official");
  // Three mutually exclusive exam stages: "setup" -> "active" -> "submitted"
  const [examStage, setExamStage] = useState<"setup" | "active" | "submitted">(
    initialAutoStart ? "active" : "setup"
  );
  const [showCheatsheet, setShowCheatsheet] = useState<boolean>(false);
  const [showQuestionGrid, setShowQuestionGrid] = useState<boolean>(false);
  const [showSubmittedReview, setShowSubmittedReview] = useState<boolean>(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [navFilter, setNavFilter] = useState<"all" | "flagged" | "twopt" | "mistakes">("all");
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, UntUserAnswer>>({});
  const [submittedEval, setSubmittedEval] = useState<UntExamEvaluation | null>(null);
  const subjectTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const stageTopRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSubjectId(initialSubjectId);
  }, [initialSubjectId]);

  useEffect(() => {
    setVariantNumber(initialVariantNumber);
  }, [initialVariantNumber]);

  useEffect(() => {
    if (initialAutoStart) {
      setExamStage("active");
    }
  }, [initialAutoStart]);

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

  function scrollToStageTop() {
    if (typeof window !== "undefined" && stageTopRef.current) {
      stageTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleSelectSubject(nextSubject: UntSubjectId) {
    setSubjectId(nextSubject);
    onSubjectChange?.(nextSubject);
    if (variantNumber === 0 && nextSubject !== "math") {
      setVariantNumber(1);
    }
    setAnswers({});
    setFlagged({});
    setSubmittedEval(null);
    setShowSubmittedReview(false);
    setNavFilter("all");
    setActiveIdx(0);
  }

  function handleSelectVariant(nextVariant: number) {
    setVariantNumber(nextVariant);
    setAnswers({});
    setFlagged({});
    setSubmittedEval(null);
    setShowSubmittedReview(false);
    setNavFilter("all");
    setActiveIdx(0);
  }

  function handleStartExam() {
    setSubmittedEval(null);
    setShowSubmittedReview(false);
    setShowQuestionGrid(false);
    setExamStage("active");
    scrollToStageTop();
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
    setExamStage("submitted");
    setShowQuestionGrid(false);
    setShowSubmittedReview(false);
    scrollToStageTop();

    const topicRatios = Object.fromEntries(
      Object.entries(evaluation.byTopic).map(([k, v]) => [k, v.ratio])
    ) as UntAttemptSummary["topicRatios"];

    const summary: UntAttemptSummary = {
      completedAt: new Date().toISOString(),
      earnedPoints: evaluation.earnedPoints,
      maxPoints: evaluation.maxPoints,
      scaledScore50: evaluation.scaledScore50,
      weakTopics: evaluation.verifiedWeakTopics,
      topicRatios
    };
    onCompleteExam(summary, evaluation);
  }

  function handleResetExam() {
    setAnswers({});
    setFlagged({});
    setSubmittedEval(null);
    setShowSubmittedReview(false);
    setNavFilter("all");
    setActiveIdx(0);
    setExamStage("active");
    scrollToStageTop();
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
    <div className="unt-exam-root" ref={stageTopRef}>
      {/* STAGE 1: SETUP SCREEN (Before starting Question #1) */}
      {examStage === "setup" && (
        <section className="exam-spec-banner" aria-label={t.setupTitle}>
          <div className="mb-3">
            <h2 className="text-lg font-bold m-0">{t.setupTitle}</h2>
            <p className="small mt-1 mb-0">{t.setupSubtitle}</p>
          </div>

          {lastSavedAttempt && (
            <div className="exam-saved-strip mb-3">
              <span>
                {t.lastAttemptBanner}{" "}
                <strong>
                  {lastSavedAttempt.scaledScore50}/50 ({lastSavedAttempt.earnedPoints}/
                  {lastSavedAttempt.maxPoints})
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

          {/* Шаг 1: Выбор предмета ЕНТ */}
          <div className="mt-3">
            <strong className="small block mb-1.5">{t.step1Subject}</strong>
            <div className="unt-combo-bar mb-2">
              <span className="small text-muted-foreground">{t.comboLabel}</span>
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

            <div className="unt-subject-bar">
              <div className="unt-subject-grid" role="tablist" aria-label={t.subjectSelectLabel}>
                {visibleSubjects.map((subj, idx) => {
                  const active = subj.id === subjectId;
                  const qCount =
                    variantMode === "official" ? subj.officialQuestions : subj.variantQuestionsCount;
                  const ptCount =
                    variantMode === "official" ? subj.officialMaxPoints : subj.variantMaxPoints;
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
          </div>

          {/* Шаг 2: Выбор формата набора */}
          <div className="mt-4">
            <strong className="small block mb-1.5">{t.step2Format}</strong>
            <p className="small text-muted-foreground mt-0 mb-2">{t.officialFormatNote}</p>
            <div className="unt-combo-pills" role="group" aria-label={t.modeLabel}>
              <button
                type="button"
                className={`unt-combo-chip ${
                  variantMode === "official" && variantNumber !== 0 ? "active" : ""
                }`}
                onClick={() => {
                  setVariantMode("official");
                  if (variantNumber === 0) setVariantNumber(1);
                  setActiveIdx(0);
                }}
              >
                <span>
                  {t.modeOfficial} ({subjectMeta.officialQuestions} {t.qShort} ·{" "}
                  {subjectMeta.officialMaxPoints} {t.ptShort})
                </span>
              </button>
              {subjectMeta.officialQuestions !== 40 && (
                <button
                  type="button"
                  className={`unt-combo-chip ${
                    variantMode === "extended40" && variantNumber !== 0 ? "active" : ""
                  }`}
                  onClick={() => {
                    setVariantMode("extended40");
                    if (variantNumber === 0) setVariantNumber(1);
                    setActiveIdx(0);
                  }}
                >
                  <span>{t.modeExtended}</span>
                </button>
              )}
              {subjectId === "math" && (
                <button
                  type="button"
                  className={`unt-combo-chip ${variantNumber === 0 ? "active" : ""}`}
                  onClick={() => handleSelectVariant(0)}
                >
                  <span>{t.quickDiagBtn}</span>
                </button>
              )}
            </div>
          </div>

          {/* Шаг 3: Выбор варианта */}
          {variantNumber !== 0 && (
            <div className="mt-4">
              <strong className="small block mb-1.5">{t.step3Variant}</strong>
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
              </div>
            </div>
          )}

          {/* Итоговая плашка выбранного набора + Главная кнопка старта */}
          <div className="exam-setup-launch-bar mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="unt-subject-icon">
                <SubjectIcon subjectId={subjectMeta.id} size={18} />
              </span>
              <div>
                <span className="small text-muted-foreground block">{t.summaryReadyLabel}</span>
                <strong className="text-sm sm:text-base">
                  {subjectMeta.title[lang]} ·{" "}
                  {variantNumber === 0 ? t.quickDiagBtn : `${t.variantPrefix}${variantNumber}`} ·{" "}
                  {activeQuestions.length} {t.qShort} ({activeMaxPoints} {t.ptShort})
                </strong>
              </div>
            </div>

            <Button type="button" size="lg" className="min-h-11 px-5" onClick={handleStartExam}>
              <Play size={16} />
              <span>{t.startExamBtn}</span>
            </Button>
          </div>
        </section>
      )}

      {/* STAGE 2: ACTIVE QUESTION SCREEN (Focused solving without setup clutter) */}
      {examStage === "active" && (
        <>
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
                  {t.answeredStat}: {answeredCount}/{activeQuestions.length}
                </span>
              </div>
            </div>

            <div className="exam-compact-actions">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="whitespace-normal text-left h-auto min-h-10 py-1.5"
                onClick={() => setExamStage("setup")}
              >
                <Settings2 size={14} />
                <span>{t.changeSetupBtn}</span>
              </Button>
              <Button
                type="button"
                size="sm"
                variant={showQuestionGrid ? "default" : "outline"}
                className="whitespace-normal text-left h-auto min-h-10 py-1.5"
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
                className="min-h-10"
                onClick={() => setShowCheatsheet((prev) => !prev)}
              >
                <BookOpen size={14} />
                <span>{t.cheatsheetBtn}</span>
                {showCheatsheet ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </Button>
            </div>
          </div>

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
                </div>
              </div>

              <div className="exam-nav-grid" role="navigation" aria-label="Навигация по заданиям ЕНТ">
                {(filteredQuestions.length > 0 ? filteredQuestions : activeQuestions).map((q) => {
                  const idx = activeQuestions.findIndex((item) => item.id === q.id);
                  const isCurrent = idx === activeIdx;
                  const sc = scoreUntQuestion(q, answers[q.id]);
                  const isAnswered = sc.status !== "unanswered";
                  const isFlag = Boolean(flagged[q.id]);

                  return (
                    <button
                      key={q.id}
                      type="button"
                      className={`exam-nav-cell ${isCurrent ? "current" : ""} ${
                        isAnswered ? "exam-cell-answered" : ""
                      }`}
                      aria-current={isCurrent ? "step" : undefined}
                      aria-label={`${t.questionLabel} ${q.order} (${
                        q.maxPoints === 2 ? t.points2 : t.points1
                      })`}
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

          {/* Карточка текущего вопроса */}
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

            {currentQuestion.format === "context" && (
              <div className="exam-context-box">
                <strong>{currentQuestion.contextTitle[lang]}</strong>
                <p className="mt-1 mb-0">{currentQuestion.contextBody[lang]}</p>
              </div>
            )}

            <h3 className="exam-stem">{currentQuestion.prompt[lang]}</h3>

            {(currentQuestion.format === "single" || currentQuestion.format === "context") && (
              <div
                className="exam-options-list"
                role="radiogroup"
                aria-label={currentQuestion.prompt[lang]}
              >
                {currentQuestion.options[lang].map((opt, optIdx) => {
                  const ans = answers[currentQuestion.id];
                  const isSelected =
                    (ans?.format === "single" || ans?.format === "context") &&
                    ans.selectedIndex === optIdx;
                  const letter = ["A", "B", "C", "D"][optIdx] ?? String(optIdx + 1);

                  return (
                    <button
                      key={`${currentQuestion.id}-opt-${optIdx}`}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={`exam-option-btn ${isSelected ? "selected" : ""}`}
                      onClick={() => selectSingleAnswer(currentQuestion, optIdx)}
                    >
                      <span className="exam-opt-letter">{letter}</span>
                      <span className="exam-opt-text">{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

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
                    const chosenIdx = ans?.format === "matching" ? ans.pairs[rowIdx] : null;

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
                            return (
                              <button
                                key={choiceIdx}
                                type="button"
                                role="radio"
                                aria-checked={active}
                                className={`exam-match-num-btn ${active ? "selected" : ""}`}
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

            {currentQuestion.format === "multiple" &&
              (() => {
                const ans = answers[currentQuestion.id];
                const selectedList = ans?.format === "multiple" ? ans.selectedIndices : [];
                const limitReached = selectedList.length >= 3;

                return (
                  <div>
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                      <span className="small font-semibold tabular-nums">
                        {t.selectedCount}: {selectedList.length} / 3
                      </span>
                      <span className="small text-muted-foreground">{t.maxThreeHint}</span>
                    </div>
                    <div
                      className="exam-options-list"
                      role="group"
                      aria-label={currentQuestion.prompt[lang]}
                    >
                      {currentQuestion.options[lang].map((opt, optIdx) => {
                        const isSelected = selectedList.includes(optIdx);
                        const isDisabled = !isSelected && limitReached;

                        return (
                          <button
                            key={`${currentQuestion.id}-mopt-${optIdx}`}
                            type="button"
                            aria-pressed={isSelected}
                            disabled={isDisabled}
                            className={`exam-option-btn multi ${isSelected ? "selected" : ""}`}
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

            <div className="exam-footer-actions">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11"
                  disabled={activeIdx === 0}
                  onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
                >
                  <ChevronLeft size={15} />
                  <span>{t.prevBtn}</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11"
                  disabled={activeIdx === activeQuestions.length - 1}
                  onClick={() => setActiveIdx((i) => Math.min(activeQuestions.length - 1, i + 1))}
                >
                  <span>{t.nextBtn}</span>
                  <ChevronRight size={15} />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="button" className="min-h-11" onClick={handleSubmitExam}>
                  <CheckCircle2 size={16} />
                  <span>{t.submitExam}</span>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* STAGE 3: DEDICATED RESULT SCREEN (Separates answered errors from skipped questions) */}
      {examStage === "submitted" && submittedEval && (
        <section className="exam-report-card" aria-live="polite">
          {/* Early / Incomplete submission warning */}
          {!submittedEval.isComplete ? (
            <div className="callout warn mb-4" role="status">
              <strong className="flex items-center gap-2 text-sm sm:text-base">
                <AlertTriangle size={18} className="text-amber-700 shrink-0" />
                <span>
                  {t.incompleteTitle
                    .replace("{answered}", String(submittedEval.answeredCount))
                    .replace("{total}", String(activeQuestions.length))}
                </span>
              </strong>
              <p className="small mt-1 mb-0">
                {t.incompleteSub
                  .replace("{wrong}", String(submittedEval.answeredWrongCount))
                  .replace("{skipped}", String(submittedEval.unansweredCount))}
              </p>
            </div>
          ) : (
            <div className="callout ok mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
              <strong className="text-sm">{t.completeBadge}</strong>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold m-0">
                {t.reportTitle} — {subjectMeta.title[lang]} (
                {variantNumber > 0 ? `${t.variantPrefix}${variantNumber}` : t.quickDiagBtn})
              </h2>
              <p className="small mt-0.5 mb-0">
                {t.rawScoreLabel}:{" "}
                <strong className="tabular-nums">
                  {submittedEval.earnedPoints} / {submittedEval.maxPoints}
                </strong>{" "}
                · {t.answeredStat}:{" "}
                <strong className="tabular-nums">
                  {submittedEval.answeredCount} / {activeQuestions.length}
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

          {/* Блок 1: Только подтверждённые ошибки в данных ответах */}
          <div className="mt-4">
            <strong className="block text-sm mb-2">{t.verifiedWeakTitle}:</strong>
            {submittedEval.answeredCount === 0 ? (
              <p className="small text-muted-foreground m-0">{t.noAnswersGiven}</p>
            ) : submittedEval.verifiedWeakTopics.length === 0 ? (
              <p className="small text-emerald-700 font-semibold m-0">{t.noVerifiedWeakYet}</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {submittedEval.verifiedWeakTopics.map((topicId) => {
                  const st = submittedEval.byTopic[topicId];
                  return (
                    <button
                      key={topicId}
                      type="button"
                      className="exam-gap-pill"
                      onClick={() =>
                        subjectId === "math" ? onOpenLesson(topicId) : setShowSubmittedReview(true)
                      }
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

          {/* Блок 2: Пропущенные темы без ответа (отдельно от ошибок) */}
          {submittedEval.unansweredTopics.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <strong className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {t.skippedTopicsTitle}:
              </strong>
              <div className="flex flex-wrap gap-1.5">
                {submittedEval.unansweredTopics.map((topicId) => {
                  const st = submittedEval.byTopic[topicId];
                  return (
                    <span key={topicId} className="section-pill">
                      {topicName(topicId, lang)} ({st.unansweredCount} {t.skippedBadge})
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Действия после результата */}
          <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {subjectId === "math" && (
                <>
                  <Button
                    type="button"
                    className="min-h-11"
                    onClick={() =>
                      onOpenLesson(submittedEval.verifiedWeakTopics[0] ?? "linear")
                    }
                  >
                    <BookOpen size={15} />
                    <span>{t.openLessonBtn}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-11"
                    onClick={() => onOpenGraph(submittedEval.verifiedWeakTopics[0])}
                  >
                    <GitBranch size={15} />
                    <span>{t.openGraphBtn}</span>
                  </Button>
                </>
              )}
              <Button
                type="button"
                variant="outline"
                className="min-h-11"
                onClick={() => setShowSubmittedReview((prev) => !prev)}
              >
                <Grid size={15} />
                <span>{showSubmittedReview ? t.toggleReviewHide : t.toggleReviewShow}</span>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" className="min-h-11" onClick={handleResetExam}>
                <RotateCcw size={15} />
                <span>{t.resetExam}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="min-h-11"
                onClick={() => {
                  setSubmittedEval(null);
                  setShowSubmittedReview(false);
                  setExamStage("setup");
                  scrollToStageTop();
                }}
              >
                <Settings2 size={15} />
                <span>{t.chooseAnotherExam}</span>
              </Button>
            </div>
          </div>

          {/* Опциональный пошаговый разбор вопросов после сдачи */}
          {showSubmittedReview && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="exam-nav-grid mb-3" role="navigation" aria-label="Разбор заданий">
                {activeQuestions.map((q, idx) => {
                  const isCurrent = idx === activeIdx;
                  const evalScore = submittedEval.questionScores[q.id];
                  let statusClass = "exam-cell-zero";
                  if (evalScore?.status === "full") statusClass = "exam-cell-full";
                  else if (evalScore?.status === "partial") statusClass = "exam-cell-partial";

                  return (
                    <button
                      key={q.id}
                      type="button"
                      className={`exam-nav-cell ${isCurrent ? "current" : ""} ${statusClass}`}
                      onClick={() => setActiveIdx(idx)}
                    >
                      <span className="tabular-nums">{String(q.order).padStart(2, "0")}</span>
                    </button>
                  );
                })}
              </div>

              {currentScore && (
                <div
                  className={`exam-solution-box ${
                    currentScore.status === "full"
                      ? "sol-full"
                      : currentScore.status === "partial"
                        ? "sol-partial"
                        : "sol-zero"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <strong>
                      #{currentQuestion.order}. {currentQuestion.prompt[lang]} —{" "}
                      {currentScore.status === "full"
                        ? `${t.statusFull} (${currentScore.earned}/${currentScore.max})`
                        : currentScore.status === "partial"
                          ? t.statusPartial
                          : currentScore.status === "unanswered"
                            ? t.statusUnanswered
                            : `${t.statusZero} (0/${currentScore.max})`}
                    </strong>
                    {subjectId === "math" && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenLesson(currentQuestion.topic)}
                      >
                        {t.openLessonBtn}
                      </Button>
                    )}
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
            </div>
          )}
        </section>
      )}
    </div>
  );
}
