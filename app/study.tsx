"use client";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SiteFooter } from "@/components/site-footer";
import { getOptionFeedback, lessons, untTopicIds, type Language, type TopicId } from "@/lib/lessons";
import {
  buildBaselineRoadmap,
  checkAnswer,
  makeChallenge,
  parseNumericAnswer,
  progressSchema,
  topicName,
  type Progress
} from "@/lib/error-lab";
import {
  emptyUntStorage,
  untStorageKey,
  untStorageSchema,
  type UntAttemptSummary,
  type UntStorage
} from "@/lib/unt-exam";
import { UntExamView } from "@/app/unt-exam-view";
import { KnowledgeGraphView } from "@/app/knowledge-graph-view";

const copy = {
  ru: {
    navStudy: "Занятие",
    navGraph: "Карта тем",
    navExam: "Пробное ЕНТ",
    navPlan: "Мой план",
    navLab: "Тренировка ошибок",
    navAbout: "О проекте",
    topics: "Темы курса",
    mobileTopicLabel: "Тема занятия",
    lesson: "Разбор",
    practice: "Практика",
    ai: "Задать вопрос",
    rule: "Главное правило",
    exampleLabel: "Пример",
    exampleSteps: "Пошаговый разбор",
    note: "Проговори каждый переход своими словами — почему равенство или свойство сохраняется на этом шаге.",
    solveSelf: "Решить самостоятельно",
    askAboutRule: "Задать вопрос по правилу",
    taskProgress: "Задача",
    ofLabel: "из",
    extraTaskTab: "Свои числа",
    checkOne: "Проверить ответ",
    chooseOptionPrompt: "Выберите один из вариантов ответа выше, чтобы проверить решение.",
    correctTitle: "Верно",
    wrongTitle: "Обрати внимание на переход",
    analyzeErrorBtn: "Разобрать ошибку",
    tryAgainBtn: "Попробовать ещё раз",
    nextTaskBtn: "Следующая задача",
    ruleBreakdownTitle: "Разбор по правилу темы:",
    openLabForTopic: "Потренировать поиск ошибки в этой теме",
    allTasksSolved: "Все 3 задачи решены верно. Закрепи правило на задаче с новыми числами или переходи к следующей теме.",
    nextTopicBtn: "Следующая тема курса",
    transferTitle: "Задача с новыми числами",
    transferSub: "Примени главное правило темы без вариантов ответа (доступно 24 варианта чисел).",
    transferCheck: "Проверить ответ",
    transferNext: "Другие числа",
    transferRight: "Верно! Правило применено точно.",
    transferWrong: "Ответ пока не совпал. Сверь вычисления с главным правилом темы.",
    transferInvalid: "Введите целое число, десятичную дробь или обыкновенную дробь вида 3/7.",
    aiTitle: "Задать вопрос по теме",
    aiSub: "Помощник объясняет выбранную тему с опорой на главное правило урока и задаёт наводящий вопрос без подсказки готового ответа.",
    question: "Ваш вопрос",
    placeholder: "Например: почему в теореме Виета сумма корней берётся с противоположным знаком?",
    quickLabel: "Частые вопросы по теме:",
    quickQuestions: [
      "Почему при переносе слагаемого через знак равенства меняется знак?",
      "Как быстро проверить, не перепутаны ли формулы в этой теме?",
      "На каком шаге чаще всего теряют баллы в подобных задачах?"
    ],
    adult: "Мне исполнилось 18 лет.",
    consent: "Согласен отправить текст учебного вопроса для получения разбора. Не ввожу личные данные.",
    ask: "Получить объяснение",
    loading: "Формируем объяснение…",
    pilot: "При подключённом ключе сервера отображается живой ответ модели, в демо-режиме — структурный разбор по правилу урока.",
    privacy: "Приватность",
    rmTitle: "План подготовки к ЕНТ",
    rmSub: "Очерёдность тем строится по результатам решения задач и выбранной цели.",
    rmTarget: "Целевой балл ЕНТ (из 50)",
    rmWeeks: "Недель до экзамена",
    rmWeak: "Темы, которые нужно подтянуть",
    rmConsolidation: "Закреплено (≥2 самостоятельных решения)",
    rmConsolidationEmpty: "Пока нет закреплённых тем — решите по 2 задачи без подсказок в разделе «Тренировка ошибок».",
    rmGoal: "Цель и главная трудность",
    rmGoalPlaceholder: "Например: путаю знаки в тригонометрии и формулы объёмов пирамиды, нужно набрать 42+ за 6 недель",
    rmPresets: [
      "Цель 45/50 за 6 недель: путаю знаки в теореме Виета, логарифмах и тригонометрии",
      "Цель 38/50 за 4 недели: нужно подтянуть производную, площади и объёмы фигур"
    ],
    rmGenerate: "Составить учебный план",
    rmBaseTitle: "Рекомендуемая очерёдность тем",
    rmPhase1: "Этап 1 (недели 1–2): базовые темы и закрытие пробелов",
    rmPhase2: "Этап 2 (недели 3+): закрепление и перенос навыка",
    rmClaudeTitle: "Персональный план по неделям",
    rmMilestones: "Шаги по неделям",
    rmHabit: "Режим занятий",
    badgeLive: "Живой разбор",
    badgePreview: "Разбор по правилу урока"
  },
  kk: {
    navStudy: "Сабақ",
    navGraph: "Тақырыптар картасы",
    navExam: "Байқау ҰБТ",
    navPlan: "Менің жоспарым",
    navLab: "Қатемен жұмыс",
    navAbout: "Жоба туралы",
    topics: "Курс тақырыптары",
    mobileTopicLabel: "Сабақ тақырыбы",
    lesson: "Талдау",
    practice: "Жаттығу",
    ai: "Сұрақ қою",
    rule: "Негізгі ереже",
    exampleLabel: "Мысал",
    exampleSteps: "Қадамдық талдау",
    note: "Әр қадамды өз сөзіңізбен түсіндіріп көріңіз — теңдік немесе қасиет неліктен сақталады.",
    solveSelf: "Өз бетінше шығару",
    askAboutRule: "Ереже бойынша сұрақ қою",
    taskProgress: "Есеп",
    ofLabel: "/",
    extraTaskTab: "Жаңа сандар",
    checkOne: "Жауапты тексеру",
    chooseOptionPrompt: "Шешімді тексеру үшін жоғарыдағы жауап нұсқаларының бірін таңдаңыз.",
    correctTitle: "Дұрыс",
    wrongTitle: "Амал мен таңбаға назар аударыңыз",
    analyzeErrorBtn: "Қатені талдау",
    tryAgainBtn: "Қайта көру",
    nextTaskBtn: "Келесі есеп",
    ruleBreakdownTitle: "Тақырып ережесі бойынша талдау:",
    openLabForTopic: "Осы тақырып бойынша қате табуды жаттықтыру",
    allTasksSolved: "Барлық 3 есеп дұрыс шешілді. Ережені жаңа сандармен бекітіңіз немесе келесі тақырыпқа өтіңіз.",
    nextTopicBtn: "Келесі тақырып",
    transferTitle: "Жаңа сандармен есеп",
    transferSub: "Тақырыптың негізгі ережесін дайын нұсқаларсыз қолданыңыз (24 нұсқа).",
    transferCheck: "Жауапты тексеру",
    transferNext: "Басқа сандар",
    transferRight: "Дұрыс! Ереже дәл қолданылды.",
    transferWrong: "Жауап сәйкес келмеді. Есептеуді негізгі ережемен салыстырыңыз.",
    transferInvalid: "Бүтін сан, ондық бөлшек немесе 3/7 түріндегі бөлшек енгізіңіз.",
    aiTitle: "Тақырып бойынша сұрақ қою",
    aiSub: "Көмекші таңдалған тақырыпты негізгі ережеге сүйеніп түсіндіреді және дайын жауапты айтпай бағыттаушы сұрақ қояды.",
    question: "Сұрағыңыз",
    placeholder: "Мысалы: Виет теоремасында түбірлер қосындысы неге қарама-қарсы таңбамен алынады?",
    quickLabel: "Жиі қойылатын сұрақтар:",
    quickQuestions: [
      "Теңдеудің бір жағынан екінші жағына шығарғанда таңба неге өзгереді?",
      "Осы бөлімдегі формулаларды шатастырмау үшін нені есте сақтау керек?",
      "Осындай есептерде көбіне қай қадамда қателеседі?"
    ],
    adult: "Мен 18 жасқа толдым.",
    consent: "Талдау алу үшін оқу сұрағымды жіберуге келісемін. Жеке деректерді енгізбеймін.",
    ask: "Түсіндірме алу",
    loading: "Талдау дайындалып жатыр…",
    pilot: "Сервер кілті қосылғанда тікелей жауап, ал демо-режимде сабақ ережесіне негізделген талдау беріледі.",
    privacy: "Құпиялық",
    rmTitle: "ҰБТ-ға дайындық жоспары",
    rmSub: "Тақырыптар реті шығарылған есептер нәтижесі мен мақсатты балға қарай құрылады.",
    rmTarget: "Мақсатты ҰБТ балы (50-ден)",
    rmWeeks: "Емтиханға дейінгі апта саны",
    rmWeak: "Қайталауды қажет ететін тақырыптар",
    rmConsolidation: "Бекітілді (≥2 өздік шешім)",
    rmConsolidationEmpty: "Әзірше бекітілген тақырып жоқ — «Қатемен жұмыс» бөлімінде көмексіз 2 есептен шығарыңыз.",
    rmGoal: "Мақсатыңыз және негізгі қиындық",
    rmGoalPlaceholder: "Мысалы: тригонометрия мен пирамида көлемінде қателесемін, 6 аптада 42+ балл жинау керек",
    rmPresets: [
      "6 аптада 45/50 балл: Виет теоремасы, логарифм және тригонометрияда таңба қателері",
      "4 аптада 38/50 балл: туынды, планиметрия аудандары және пирамида көлемі"
    ],
    rmGenerate: "Оқу жоспарын құру",
    rmBaseTitle: "Ұсынылатын тақырыптар реті",
    rmPhase1: "1-кезең (1–2 апта): базалық тақырыптар және олқылықтарды жою",
    rmPhase2: "2-кезең (3+ апта): бекіту және дағдыны тексеру",
    rmClaudeTitle: "Апталық жеке жоспар",
    rmMilestones: "Апталық қадамдар",
    rmHabit: "Дайындық тәртібі",
    badgeLive: "Тікелей талдау",
    badgePreview: "Сабақ ережесі бойынша талдау"
  },
  uz: {
    navStudy: "Dars",
    navGraph: "Mavzular xaritasi",
    navExam: "Sinov UBT",
    navPlan: "Mening rejam",
    navLab: "Xatolar ustida ishlash",
    navAbout: "Loyiha haqida",
    topics: "Kurs mavzulari",
    mobileTopicLabel: "Dars mavzusi",
    lesson: "Tahlil",
    practice: "Mashq",
    ai: "Savol berish",
    rule: "Asosiy qoida",
    exampleLabel: "Namuna",
    exampleSteps: "Qadam-baqadam yechim",
    note: "Har bir qadamni o‘z so‘zlaringiz bilan tushuntiring — tenglik yoki xossa nega saqlanib qoladi.",
    solveSelf: "Mustaqil yechish",
    askAboutRule: "Qoida bo‘yicha savol berish",
    taskProgress: "Masala",
    ofLabel: "/",
    extraTaskTab: "Yangi sonlar",
    checkOne: "Javobni tekshirish",
    chooseOptionPrompt: "Yechimni tekshirish uchun yuqoridagi javob variantlaridan birini tanlang.",
    correctTitle: "To‘g‘ri",
    wrongTitle: "Amal va ishoraga e’tibor bering",
    analyzeErrorBtn: "Xatoni tahlil qilish",
    tryAgainBtn: "Qayta urinib ko‘rish",
    nextTaskBtn: "Keyingi masala",
    ruleBreakdownTitle: "Mavzu qoidasi bo‘yicha tahlil:",
    openLabForTopic: "Shu mavzuda xatoni topishni mashq qilish",
    allTasksSolved: "Barcha 3 ta masala to‘g‘ri yechildi. Qoidani yangi sonlar bilan mustahkamlang yoki keyingi mavzuga o‘ting.",
    nextTopicBtn: "Keyingi mavzu",
    transferTitle: "Yangi sonlar bilan masala",
    transferSub: "Mavzuning asosiy qoidasini tayyor variantlarsiz qo‘llang (24 xil variant).",
    transferCheck: "Javobni tekshirish",
    transferNext: "Boshqa sonlar",
    transferRight: "To‘g‘ri! Qoida aniq qo‘llanildi.",
    transferWrong: "Javob mos kelmadi. Hisobni asosiy qoida bilan solishtiring.",
    transferInvalid: "Butun son, o‘nli kasr yoki 3/7 shaklidagi kasr kiriting.",
    aiTitle: "Mavzu bo‘yicha savol berish",
    aiSub: "Yordamchi tanlangan mavzuni asosiy qoidaga tayangan holda tushuntiradi va tayyor javobni aytmasdan yo‘naltiruvchi savol beradi.",
    question: "Savolingiz",
    placeholder: "Masalan: nega Viyet teoremasida ildizlar yig‘indisi qarama-qarshi ishora bilan olinadi?",
    quickLabel: "Ko‘p beriladigan savollar:",
    quickQuestions: [
      "Nega hadni tenglikning boshqa tomoniga o‘tkazganda ishora o‘zgaradi?",
      "Shu bo‘limdagi formulalarni adashtirmaslik uchun nimaga e’tibor berish kerak?",
      "Bunday masalalarda ko‘pincha qaysi qadamda xato qilinadi?"
    ],
    adult: "Men 18 yoshga to‘lganman.",
    consent: "Tahlil olish uchun o‘quv savolimni yuborishga roziman. Shaxsiy ma’lumot kiritmayman.",
    ask: "Tushuntirish olish",
    loading: "Javob tayyorlanmoqda…",
    pilot: "Server kaliti yoqilganda jonli javob, demo rejimda esa dars qoidasi asosida tahlil qaytariladi.",
    privacy: "Maxfiylik",
    rmTitle: "Imtihonga tayyorgarlik rejasi",
    rmSub: "Mavzular tartibi yechilgan masalalar natijasi va maqsadli ball asosida tuziladi.",
    rmTarget: "Maqsadli ball (50 dan)",
    rmWeeks: "Imtihongacha haftalar soni",
    rmWeak: "Mustahkamlash kerak bo‘lgan mavzular",
    rmConsolidation: "Mustahkamlangan (≥2 mustaqil masala)",
    rmConsolidationEmpty: "Hozircha mustahkamlangan mavzu yo‘q — «Xatolar ustida ishlash» bo‘limida yordamsiz 2 tadan masala yeching.",
    rmGoal: "Maqsadingiz va asosiy qiyinchilik",
    rmGoalPlaceholder: "Masalan: logarifm va hosilada xato qilaman, 6 haftada 42+ ball yig‘ishim kerak",
    rmPresets: [
      "6 haftada 45/50 ball: Viyet teoremasi, logarifm va trigonometriyada ishora xatolari",
      "4 haftada 38/50 ball: hosila hamda geometrik yuzalar va hajmlar"
    ],
    rmGenerate: "O‘quv rejasini tuzish",
    rmBaseTitle: "Tavsiya etilgan mavzular tartibi",
    rmPhase1: "1-bosqich (1–2 hafta): tayanch mavzular va bo‘shliqlarni yopish",
    rmPhase2: "2-bosqich (3+ hafta): mustahkamlash va ko‘nikmani tekshirish",
    rmClaudeTitle: "Haftalik shaxsiy o‘quv rejasi",
    rmMilestones: "Haftalik qadamlar",
    rmHabit: "Kunlik tayyorgarlik tartibi",
    badgeLive: "Jonli tahlil",
    badgePreview: "Dars qoidasi bo‘yicha tahlil"
  }
};

type WebContext = {
  registerTool: (
    tool: { name: string; description: string; inputSchema: object; annotations: object; execute: (input: unknown) => unknown },
    options: { signal: AbortSignal }
  ) => void | Promise<void>;
};

type ClaudeRoadmap = {
  summary: string;
  priorityModules: { topic: TopicId; reason: string; recommendedAction: string }[];
  weeklyMilestones: string[];
  dailyHabit: string;
  source?: string;
};

const emptyProgress: Progress = { version: 1, records: [] };

export default function Study() {
  const [lang, setLang] = useState<Language>("ru");
  const [topic, setTopic] = useState<TopicId>("linear");
  const [tab, setTab] = useState("lesson");

  // Focused step-by-step practice state (questions 0, 1, 2 + transfer task index 3)
  const [activeQ, setActiveQ] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checkedMap, setCheckedMap] = useState<Record<number, boolean>>({});
  const [expandedErrorMap, setExpandedErrorMap] = useState<Record<number, boolean>>({});
  const [practiceNotice, setPracticeNotice] = useState(false);

  const [practiceSeed, setPracticeSeed] = useState(0);
  const [transferInput, setTransferInput] = useState("");
  const [transferStatus, setTransferStatus] = useState<"" | "right" | "wrong" | "invalid">("");
  const [showTransferRule, setShowTransferRule] = useState(false);

  const [question, setQuestion] = useState("");
  const [adult, setAdult] = useState(false);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState<{ explanation: string; hint: string; source?: string } | null>(null);

  const [labProgress, setLabProgress] = useState<Progress>(emptyProgress);
  const [untStorage, setUntStorage] = useState<UntStorage>(emptyUntStorage);
  const [targetScore, setTargetScore] = useState(42);
  const [weeksLeft, setWeeksLeft] = useState(6);
  const [weakTopics, setWeakTopics] = useState<TopicId[]>(["quadratic", "trigonometry", "derivative", "stereometry"]);
  const [goalNote, setGoalNote] = useState("");
  const [rmBusy, setRmBusy] = useState(false);
  const [rmError, setRmError] = useState("");
  const [aiRoadmap, setAiRoadmap] = useState<ClaudeRoadmap | null>(null);

  const controller = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const current = useRef({ topic, language: lang });

  const lesson = lessons[lang].find((l) => l.id === topic)!;
  const topicIndex = lessons[lang].findIndex((l) => l.id === topic);
  const nextTopicId = lessons[lang][(topicIndex + 1) % lessons[lang].length].id;
  const t = copy[lang];

  const solvedCount = lesson.questions.filter((q, i) => checkedMap[i] && answers[i] === String(q.correct)).length;
  const baseline = buildBaselineRoadmap(labProgress, targetScore, weeksLeft, lang);
  const transferChallenge = makeChallenge(topic, practiceSeed, lang);

  // Whether we are inside the active study lesson view vs a top-level section (Topic Map, UNT Exam, Study Plan)
  const isStudySection = tab === "lesson" || tab === "practice" || tab === "ai";

  useEffect(() => {
    current.current = { topic, language: lang };
  }, [topic, lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const params = new URLSearchParams(window.location.search);
        const qLang = params.get("lang");
        if (qLang === "ru" || qLang === "kk" || qLang === "uz") {
          setLang(qLang);
        }
        const qTab = params.get("tab");
        if (qTab === "lesson" || qTab === "practice" || qTab === "exam" || qTab === "graph" || qTab === "ai" || qTab === "roadmap") {
          setTab(qTab);
        }
        const qTopic = params.get("topic");
        if (qTopic && (untTopicIds as readonly string[]).includes(qTopic)) {
          setTopic(qTopic as TopicId);
        }
      } catch {}

      try {
        const raw = localStorage.getItem("bilimai-lab-v1");
        if (raw) {
          const parsed = progressSchema.safeParse(JSON.parse(raw));
          if (parsed.success) {
            setLabProgress(parsed.data);
            const autoBase = buildBaselineRoadmap(parsed.data, 42, 6, "ru");
            setWeakTopics(autoBase.weakTopics);
          }
        }
      } catch {}

      try {
        const rawUnt = localStorage.getItem(untStorageKey);
        if (rawUnt) {
          const parsedUnt = untStorageSchema.safeParse(JSON.parse(rawUnt));
          if (parsedUnt.success) {
            setUntStorage(parsedUnt.data);
            if (parsedUnt.data.lastAttempt && parsedUnt.data.lastAttempt.weakTopics.length > 0) {
              setWeakTopics(parsedUnt.data.lastAttempt.weakTopics);
            }
          }
        }
      } catch {}
    });
  }, []);

  useEffect(() => {
    const ctx = (document as Document & { modelContext?: WebContext }).modelContext;
    if (!ctx?.registerTool) return;
    const life = new AbortController();
    try {
      Promise.resolve(
        ctx.registerTool(
          {
            name: "get_current_lesson",
            description: "Read the UNT mathematics lesson currently visible in BilimAI. Does not send anything to Claude.",
            inputSchema: { type: "object", properties: {}, additionalProperties: false },
            annotations: { readOnlyHint: true, untrustedContentHint: false },
            execute(input) {
              if (!input || typeof input !== "object" || Array.isArray(input) || Object.keys(input).length)
                throw new Error("Expected an empty object");
              const state = current.current;
              const l = lessons[state.language].find((x) => x.id === state.topic)!;
              return { topic: state.topic, language: state.language, section: l.section, title: l.title, rule: l.rule };
            }
          },
          { signal: life.signal }
        )
      ).catch(() => {});
    } catch {}
    return () => life.abort();
  }, []);

  useEffect(() => () => controller.current?.abort(), []);

  function errorText(code: string | undefined) {
    const codes: Record<string, string> =
      lang === "ru"
        ? {
            quota: "Лимит запросов пилота исчерпан. Продолжите с готовыми материалами.",
            origin: "Неверный источник запроса.",
            input: "Заполните текст вопроса и отметьте оба пункта согласия."
          }
        : lang === "kk"
          ? {
              quota: "Сынақ лимиті аяқталды. Дайын сабақтарды жалғастырыңыз.",
              origin: "Сұраныс көзі қате.",
              input: "Сұрақтың толтырылуын және келісім белгілерін тексеріңіз."
            }
          : {
              quota: "Sinov limiti tugadi. Tayyor darslarni davom ettiring.",
              origin: "So‘rov manbasi noto‘g‘ri.",
              input: "Savol maydoni va rozilik belgilari qo‘yilganini tekshiring."
            };
    return (
      codes[code ?? ""] ??
      (lang === "ru"
        ? "Не удалось получить ответ. Попробуйте ещё раз."
        : lang === "kk"
          ? "Жауап алынбады. Қайталап көріңіз."
          : "Javob olinmadi. Qayta urinib ko‘ring.")
    );
  }

  function reset() {
    generation.current++;
    controller.current?.abort();
    setActiveQ(0);
    setAnswers({});
    setCheckedMap({});
    setExpandedErrorMap({});
    setPracticeNotice(false);
    setTransferInput("");
    setTransferStatus("");
    setShowTransferRule(false);
    setAnswer(null);
    setError("");
    setBusy(false);
    setQuestion("");
  }

  function selectTopic(id: TopicId) {
    reset();
    setTopic(id);
    if (!isStudySection) setTab("lesson");
  }

  function openTopicLesson(id: TopicId) {
    reset();
    setTopic(id);
    setTab("lesson");
  }

  function handleCompleteUntExam(summary: UntAttemptSummary) {
    const nextStorage: UntStorage = {
      version: 1,
      lastAttempt: summary,
      history: [summary, ...untStorage.history].slice(0, 20)
    };
    setUntStorage(nextStorage);
    if (summary.weakTopics.length > 0) {
      setWeakTopics(summary.weakTopics);
    }
    try {
      localStorage.setItem(untStorageKey, JSON.stringify(nextStorage));
    } catch {}
  }

  function selectLanguage(value: Language) {
    reset();
    setRmError("");
    setLang(value);
  }

  function checkCurrentQuestion(qIdx: number) {
    if (answers[qIdx] === undefined) {
      setPracticeNotice(true);
      return;
    }
    setPracticeNotice(false);
    setCheckedMap((prev) => ({ ...prev, [qIdx]: true }));
  }

  function retryQuestion(qIdx: number) {
    setCheckedMap((prev) => {
      const next = { ...prev };
      delete next[qIdx];
      return next;
    });
    setExpandedErrorMap((prev) => {
      const next = { ...prev };
      delete next[qIdx];
      return next;
    });
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[qIdx];
      return next;
    });
    setPracticeNotice(false);
  }

  function checkTransfer() {
    if (!transferInput.trim() || parseNumericAnswer(transferInput) === null) {
      setTransferStatus("invalid");
      return;
    }
    if (checkAnswer(transferInput, transferChallenge.answer)) {
      setTransferStatus("right");
    } else {
      setTransferStatus("wrong");
    }
  }

  function toggleWeakTopic(id: TopicId) {
    setWeakTopics((prev) => {
      if (prev.includes(id)) return prev.length > 1 ? prev.filter((x) => x !== id) : prev;
      return [...prev, id];
    });
  }

  async function ask() {
    if (busy) return;
    if (!adult || !consent || question.trim().length < 3) {
      setError(errorText("input"));
      return;
    }
    const version = generation.current;
    controller.current = new AbortController();
    setBusy(true);
    setError("");
    setAnswer(null);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: controller.current.signal,
        body: JSON.stringify({ topic, language: lang, question, adult, consent })
      });
      const data = z
        .object({
          error: z.string().optional(),
          explanation: z.string().optional(),
          hint: z.string().optional(),
          source: z.string().optional()
        })
        .parse(await res.json());
      if (version !== generation.current) return;
      if (!res.ok) throw new Error(errorText(data.error));
      if (!data.explanation || !data.hint) throw new Error("Invalid response");
      setAnswer({ explanation: data.explanation, hint: data.hint, source: data.source });
    } catch (e) {
      if (version === generation.current && !(e instanceof Error && e.name === "AbortError"))
        setError(e instanceof Error ? e.message : "Ошибка сети");
    } finally {
      if (version === generation.current) setBusy(false);
    }
  }

  async function askRoadmap() {
    if (rmBusy) return;
    if (!adult || !consent || goalNote.trim().length < 3) {
      setRmError(errorText("input"));
      return;
    }
    setRmBusy(true);
    setRmError("");
    setAiRoadmap(null);
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          language: lang,
          targetScore,
          weeksLeft,
          weakTopics,
          masteredTopics: baseline.masteredTopics.filter((item) => !weakTopics.includes(item)),
          goalNote: goalNote.trim(),
          adult,
          consent
        })
      });
      const raw = await res.json();
      if (!res.ok) {
        const errObj = z.object({ error: z.string().optional() }).safeParse(raw);
        throw new Error(errorText(errObj.success ? errObj.data.error : undefined));
      }
      const parsed = z
        .object({
          summary: z.string(),
          priorityModules: z.array(z.object({ topic: z.enum(untTopicIds), reason: z.string(), recommendedAction: z.string() })),
          weeklyMilestones: z.array(z.string()),
          dailyHabit: z.string(),
          source: z.string().optional()
        })
        .parse(raw);
      setAiRoadmap(parsed);
    } catch (e) {
      setRmError(e instanceof Error ? e.message : "Ошибка сети");
    } finally {
      setRmBusy(false);
    }
  }

  const currentQuestionObj = lesson.questions[activeQ] ?? lesson.questions[0];
  const isCurrentChecked = Boolean(checkedMap[activeQ]);
  const selectedVal = answers[activeQ];
  const isCurrentCorrect = isCurrentChecked && selectedVal === String(currentQuestionObj.correct);
  const diagnosticMessage =
    isCurrentChecked && selectedVal !== undefined
      ? getOptionFeedback(topic, activeQ, Number(selectedVal), lang)
      : "";

  return (
    <div className="textbook-shell">
      {/* 1. Header: Primary Product Sections + Language Switcher */}
      <header className="site-header">
        <div className="wrap header-inner">
          <div className="header-top-row">
            <a
              className="brand"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setTab("lesson");
              }}
            >
              <span className="brand-mark" aria-hidden="true">
                ∑
              </span>
              <span className="brand-name">BilimAI</span>
              <span className="brand-sub">ЕНТ · ҰБТ</span>
            </a>

            <div className="header-right">
              <a className="header-quiet-link" href="/about">
                {t.navAbout}
              </a>
              <div className="lang-switcher" role="group" aria-label="Язык">
                <button
                  type="button"
                  className={`lang-btn ${lang === "ru" ? "active" : ""}`}
                  aria-pressed={lang === "ru"}
                  onClick={() => selectLanguage("ru")}
                >
                  RU
                </button>
                <button
                  type="button"
                  className={`lang-btn ${lang === "kk" ? "active" : ""}`}
                  aria-pressed={lang === "kk"}
                  onClick={() => selectLanguage("kk")}
                >
                  ҚАЗ
                </button>
                <button
                  type="button"
                  className={`lang-btn ${lang === "uz" ? "active" : ""}`}
                  aria-pressed={lang === "uz"}
                  onClick={() => selectLanguage("uz")}
                >
                  OʻZB
                </button>
              </div>
            </div>
          </div>

          <nav className="primary-nav" aria-label="Основные разделы">
            <button
              type="button"
              className={`primary-nav-link ${isStudySection ? "active" : ""}`}
              aria-current={isStudySection ? "page" : undefined}
              onClick={() => setTab("lesson")}
            >
              {t.navStudy}
            </button>
            <button
              type="button"
              className={`primary-nav-link ${tab === "graph" ? "active" : ""}`}
              aria-current={tab === "graph" ? "page" : undefined}
              onClick={() => setTab("graph")}
            >
              {t.navGraph}
            </button>
            <button
              type="button"
              className={`primary-nav-link ${tab === "exam" ? "active" : ""}`}
              aria-current={tab === "exam" ? "page" : undefined}
              onClick={() => setTab("exam")}
            >
              {t.navExam}
            </button>
            <button
              type="button"
              className={`primary-nav-link ${tab === "roadmap" ? "active" : ""}`}
              aria-current={tab === "roadmap" ? "page" : undefined}
              onClick={() => setTab("roadmap")}
            >
              {t.navPlan}
            </button>
            <a className="primary-nav-link" href={`/lab?lang=${lang}&topic=${topic}`}>
              {t.navLab}
            </a>
          </nav>
        </div>
      </header>

      <main className="wrap main-container">
        {isStudySection ? (
          <>
            {/* Mobile Topic Selector (Clean single dropdown above the study page) */}
            <div className="mobile-topic-bar">
              <label htmlFor="mobile-lesson-select">{t.mobileTopicLabel}</label>
              <select
                id="mobile-lesson-select"
                name="mobileLessonSelect"
                className="mobile-topic-select"
                value={topic}
                onChange={(e) => selectTopic(e.target.value as TopicId)}
              >
                {lessons[lang].map((l, idx) => (
                  <option key={l.id} value={l.id}>
                    {String(idx + 1).padStart(2, "0")}. {l.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="workspace">
              {/* 2. Topic List: Unboxed Textbook Table of Contents */}
              <aside className="topics" aria-label={t.topics}>
                <h2 className="topics-heading">{t.topics}</h2>
                <div className="topics-list">
                  {lessons[lang].map((l, i) => (
                    <button
                      key={l.id}
                      type="button"
                      className={`topic ${topic === l.id ? "active" : ""}`}
                      aria-pressed={topic === l.id}
                      onClick={() => selectTopic(l.id)}
                    >
                      <span className="num">{String(i + 1).padStart(2, "0")}</span>
                      <span className="topic-title">
                        <span>{l.title}</span>
                        <small>{l.section}</small>
                      </span>
                    </button>
                  ))}
                </div>
              </aside>

              {/* 3. Single Main Study Surface (No nested card boxes inside) */}
              <article className="surface" aria-label={lesson.title}>
                <header className="lesson-head">
                  <div className="lesson-meta-line">
                    <span className="topic-index-label">
                      {String(topicIndex + 1).padStart(2, "0")} · {lesson.section}
                    </span>
                  </div>
                  <h1 className="lesson-title">{lesson.title}</h1>
                  <p className="lesson-intro">{lesson.intro}</p>
                </header>

                {/* Inside the lesson: only 3 calm actions for the current topic */}
                <Tabs value={tab} onValueChange={setTab}>
                  <TabsList className="tabsbar">
                    <TabsTrigger value="lesson">{t.lesson}</TabsTrigger>
                    <TabsTrigger value="practice">{t.practice}</TabsTrigger>
                    <TabsTrigger value="ai">{t.ai}</TabsTrigger>
                  </TabsList>

                  {/* TAB 1: РАЗБОР (Rule -> Centerpiece Formula -> Numbered Steps -> Single Next Step) */}
                  <TabsContent value="lesson">
                    <div className="rule">
                      <span className="rule-label">{t.rule}</span>
                      <p className="rule-body">{lesson.rule}</p>
                    </div>

                    <div className="math-stage">
                      <span className="math-stage-label">{t.exampleLabel}</span>
                      <div className="equation" aria-label={t.exampleLabel}>
                        {lesson.example}
                      </div>
                    </div>

                    <div className="steps-section">
                      <h2 className="steps-heading">{t.exampleSteps}</h2>
                      <ol className="steps">
                        {lesson.steps.map((step, i) => (
                          <li key={step}>
                            <span className="step-number">{i + 1}.</span>
                            <span className="step-text">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <p className="notebook-margin-note">{t.note}</p>

                    <div className="lesson-footer-action">
                      <Button
                        onClick={() => {
                          setTab("practice");
                          setActiveQ(0);
                        }}
                      >
                        {t.solveSelf}
                        <ArrowRight size={16} />
                      </Button>
                      <button
                        type="button"
                        className="quiet-text-action"
                        onClick={() => setTab("ai")}
                      >
                        {t.askAboutRule}
                      </button>
                    </div>
                  </TabsContent>

                  {/* TAB 2: ПРАКТИКА (Step-by-step solving -> Contextual Feedback right next to answer) */}
                  <TabsContent value="practice">
                    <div className="practice-header-bar">
                      <span className="practice-counter">
                        {activeQ < 3
                          ? `${t.taskProgress} ${activeQ + 1} ${t.ofLabel} ${lesson.questions.length}`
                          : t.transferTitle}
                      </span>
                      <div className="practice-step-dots" role="tablist" aria-label={t.practice}>
                        {lesson.questions.map((q, idx) => {
                          const done = checkedMap[idx] && answers[idx] === String(q.correct);
                          const hasErr = checkedMap[idx] && answers[idx] !== String(q.correct);
                          return (
                            <button
                              key={q.text}
                              type="button"
                              role="tab"
                              aria-selected={activeQ === idx}
                              className={`practice-dot ${activeQ === idx ? "active" : ""} ${done ? "done" : ""} ${hasErr ? "err" : ""}`}
                              onClick={() => {
                                setActiveQ(idx);
                                setPracticeNotice(false);
                              }}
                            >
                              {idx + 1}
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          role="tab"
                          aria-selected={activeQ === 3}
                          className={`practice-dot extra ${activeQ === 3 ? "active" : ""} ${transferStatus === "right" ? "done" : ""}`}
                          onClick={() => {
                            setActiveQ(3);
                            setPracticeNotice(false);
                          }}
                        >
                          {t.extraTaskTab}
                        </button>
                      </div>
                    </div>

                    {activeQ < 3 ? (
                      <div className="practice-stage" key={`q-${activeQ}`}>
                        <div className="practice-math-stem" id={`q${activeQ}`}>
                          {currentQuestionObj.text}
                        </div>

                        <RadioGroup
                          aria-labelledby={`q${activeQ}`}
                          value={selectedVal ?? ""}
                          disabled={isCurrentChecked}
                          onValueChange={(v) => {
                            setPracticeNotice(false);
                            setAnswers((prev) => ({ ...prev, [activeQ]: v }));
                          }}
                        >
                          {currentQuestionObj.options.map((option, j) => {
                            const isSelected = selectedVal === String(j);
                            const isOptionCorrect = j === currentQuestionObj.correct;
                            const stateClass = isCurrentChecked
                              ? isOptionCorrect
                                ? "option-correct"
                                : isSelected
                                  ? "option-wrong"
                                  : ""
                              : "";
                            return (
                              <label
                                className={`option ${stateClass}`}
                                key={option}
                                data-selected={isSelected}
                                onClick={() => {
                                  if (!isCurrentChecked) {
                                    setPracticeNotice(false);
                                    setAnswers((prev) => ({ ...prev, [activeQ]: String(j) }));
                                  }
                                }}
                              >
                                <RadioGroupItem value={String(j)} id={`q${activeQ}a${j}`} />
                                <span className="option-math-text">{option}</span>
                              </label>
                            );
                          })}
                        </RadioGroup>

                        {practiceNotice && !isCurrentChecked && selectedVal === undefined && (
                          <div role="status" className="feedback wrong">
                            {t.chooseOptionPrompt}
                          </div>
                        )}

                        {/* Contextual feedback right next to the answer */}
                        {isCurrentChecked && (
                          <div role="status" className={`feedback ${isCurrentCorrect ? "correct" : "wrong"}`}>
                            <strong className="feedback-heading">
                              {isCurrentCorrect ? t.correctTitle : t.wrongTitle}
                            </strong>
                            <p className="feedback-body">{diagnosticMessage}</p>

                            {!isCurrentCorrect && expandedErrorMap[activeQ] && (
                              <div className="error-breakdown-note">
                                <strong>{t.ruleBreakdownTitle}</strong>
                                <p>{lesson.rule}</p>
                                <p className="error-breakdown-solution">{currentQuestionObj.why}</p>
                                <a className="quiet-inline-link" href={`/lab?lang=${lang}&topic=${topic}`}>
                                  {t.openLabForTopic} →
                                </a>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Single clear primary action depending on state */}
                        <div className="practice-actions">
                          {!isCurrentChecked ? (
                            <Button onClick={() => checkCurrentQuestion(activeQ)}>
                              <CheckCircle2 size={16} />
                              {t.checkOne}
                            </Button>
                          ) : isCurrentCorrect ? (
                            <Button
                              onClick={() => {
                                setPracticeNotice(false);
                                setActiveQ((prev) => Math.min(3, prev + 1));
                              }}
                            >
                              {t.nextTaskBtn}
                              <ArrowRight size={16} />
                            </Button>
                          ) : (
                            <>
                              {!expandedErrorMap[activeQ] && (
                                <Button
                                  onClick={() =>
                                    setExpandedErrorMap((prev) => ({ ...prev, [activeQ]: true }))
                                  }
                                >
                                  {t.analyzeErrorBtn}
                                </Button>
                              )}
                              <Button
                                variant={expandedErrorMap[activeQ] ? "default" : "outline"}
                                onClick={() => retryQuestion(activeQ)}
                              >
                                <RotateCcw size={15} />
                                {t.tryAgainBtn}
                              </Button>
                            </>
                          )}
                        </div>

                        {solvedCount === 3 && (
                          <p className="notebook-margin-note mt-4">{t.allTasksSolved}</p>
                        )}
                      </div>
                    ) : (
                      /* Step 4 inside Practice: Dynamic Transfer Problem with new numbers */
                      <div className="practice-stage">
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                          <span className="rule-label">{t.transferTitle}</span>
                          <span className="topic-index-label">#{practiceSeed + 1}/24</span>
                        </div>
                        <p className="lesson-intro mb-3">{t.transferSub}</p>

                        <div className="practice-math-stem">{transferChallenge.transfer}</div>

                        <form
                          className="transfer-form"
                          onSubmit={(e) => {
                            e.preventDefault();
                            checkTransfer();
                          }}
                        >
                          <div className="transfer-input-row">
                            <input
                              id="transfer-answer-input"
                              name="transferAnswer"
                              type="text"
                              inputMode="decimal"
                              className="lab-input"
                              value={transferInput}
                              maxLength={40}
                              placeholder={transferChallenge.unit || "0"}
                              aria-label={t.transferTitle}
                              onChange={(e) => {
                                setTransferInput(e.target.value);
                                setTransferStatus("");
                              }}
                            />
                            <Button type="submit">{t.transferCheck}</Button>
                          </div>
                        </form>

                        {transferStatus && (
                          <div
                            role="status"
                            className={`feedback mt-3 ${transferStatus === "right" ? "correct" : "wrong"}`}
                          >
                            <strong className="feedback-heading">
                              {transferStatus === "right" ? t.correctTitle : t.wrongTitle}
                            </strong>
                            <p className="feedback-body">
                              {transferStatus === "right"
                                ? `${t.transferRight} (${transferChallenge.solution})`
                                : transferStatus === "invalid"
                                  ? t.transferInvalid
                                  : t.transferWrong}
                            </p>
                            {transferStatus === "wrong" && showTransferRule && (
                              <div className="error-breakdown-note">
                                <strong>{t.ruleBreakdownTitle}</strong>
                                <p>{lesson.rule}</p>
                                <p className="error-breakdown-solution">{transferChallenge.hints[0]}</p>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="practice-actions">
                          {transferStatus === "right" ? (
                            <>
                              <Button
                                onClick={() => {
                                  setPracticeSeed((s) => (s + 1) % 24);
                                  setTransferInput("");
                                  setTransferStatus("");
                                  setShowTransferRule(false);
                                }}
                              >
                                {t.nextTaskBtn}
                                <ArrowRight size={16} />
                              </Button>
                              <button
                                type="button"
                                className="quiet-text-action"
                                onClick={() => selectTopic(nextTopicId)}
                              >
                                {t.nextTopicBtn} →
                              </button>
                            </>
                          ) : transferStatus === "wrong" ? (
                            <>
                              {!showTransferRule && (
                                <Button onClick={() => setShowTransferRule(true)}>
                                  {t.analyzeErrorBtn}
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setPracticeSeed((s) => (s + 1) % 24);
                                  setTransferInput("");
                                  setTransferStatus("");
                                  setShowTransferRule(false);
                                }}
                              >
                                {t.transferNext}
                              </Button>
                            </>
                          ) : (
                            <button
                              type="button"
                              className="quiet-text-action"
                              onClick={() => {
                                setPracticeSeed((s) => (s + 1) % 24);
                                setTransferInput("");
                                setTransferStatus("");
                                setShowTransferRule(false);
                              }}
                            >
                              {t.transferNext}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* TAB 3: ЗАДАТЬ ВОПРОС */}
                  <TabsContent value="ai">
                    <h2 className="steps-heading mt-0">{t.aiTitle}</h2>
                    <p className="lesson-intro mb-4">{t.aiSub}</p>

                    <div className="mb-4">
                      <span className="rule-label block mb-2">{t.quickLabel}</span>
                      <div className="quick-prompts">
                        {t.quickQuestions.map((qq) => (
                          <button
                            key={qq}
                            type="button"
                            className="quick-pill"
                            onClick={() => {
                              setQuestion(qq);
                              setError("");
                            }}
                          >
                            {qq}
                          </button>
                        ))}
                      </div>
                    </div>

                    <form
                      className="ai-form"
                      noValidate
                      onSubmit={(e) => {
                        e.preventDefault();
                        void ask();
                      }}
                    >
                      <label htmlFor="learner-question" className="form-label">
                        {t.question} ({lesson.title})
                      </label>
                      <textarea
                        id="learner-question"
                        name="learnerQuestion"
                        value={question}
                        maxLength={600}
                        placeholder={t.placeholder}
                        onChange={(e) => {
                          setQuestion(e.target.value);
                          if (error) setError("");
                        }}
                      />
                      <span className="small">{question.length}/600</span>
                      <label className="checkline" onClick={() => setError("")}>
                        <Checkbox checked={adult} onCheckedChange={(v) => setAdult(v === true)} />
                        <span>{t.adult}</span>
                      </label>
                      <label className="checkline" onClick={() => setError("")}>
                        <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} />
                        <span>
                          {t.consent}{" "}
                          <a href="/privacy" onClick={(e) => e.stopPropagation()}>
                            {t.privacy}
                          </a>
                        </span>
                      </label>
                      <div>
                        <Button type="submit" disabled={busy}>
                          {busy ? t.loading : t.ask}
                        </Button>
                      </div>
                    </form>
                    <p className="small mt-3">{t.pilot}</p>
                    {error && (
                      <p role="alert" className="feedback wrong mt-3">
                        {error}
                      </p>
                    )}
                    {answer && (
                      <section aria-live="polite" className="response">
                        <span className="rule-label">
                          {answer.source === "claude" ? t.badgeLive : t.badgePreview}
                        </span>
                        <p className="mt-2 mb-3">{answer.explanation}</p>
                        <strong>
                          {lang === "ru"
                            ? "Проверь себя:"
                            : lang === "kk"
                              ? "Өзіңді тексер:"
                              : "O‘zingizni tekshiring:"}
                        </strong>
                        <p className="mt-1 mb-0">{answer.hint}</p>
                      </section>
                    )}
                  </TabsContent>
                </Tabs>
              </article>
            </div>
          </>
        ) : tab === "exam" ? (
          <section className="surface section-surface" aria-label={t.navExam}>
            <UntExamView
              lang={lang}
              lastSavedAttempt={untStorage.lastAttempt}
              initialTopic={topic}
              onCompleteExam={handleCompleteUntExam}
              onOpenGraph={(focusTopic) => {
                if (focusTopic) setTopic(focusTopic);
                setTab("graph");
              }}
              onOpenLesson={openTopicLesson}
            />
          </section>
        ) : tab === "graph" ? (
          <section className="surface section-surface" aria-label={t.navGraph}>
            <KnowledgeGraphView
              lang={lang}
              progress={labProgress}
              untAttempt={untStorage.lastAttempt}
              weakTopics={weakTopics}
              selectedTopic={topic}
              onSelectTopic={setTopic}
              onOpenLesson={openTopicLesson}
              onOpenExam={() => setTab("exam")}
              onToggleWeakTopic={toggleWeakTopic}
            />
          </section>
        ) : (
          <section className="surface section-surface" aria-label={t.navPlan}>
            <header className="lesson-head">
              <h1 className="lesson-title">{t.rmTitle}</h1>
              <p className="lesson-intro">{t.rmSub}</p>
            </header>

            <div className="rule mb-6">
              <span className="rule-label">{t.rmBaseTitle}</span>
              <p className="small mt-1 mb-2">
                {lang === "ru"
                  ? `Цель: ${targetScore}/50 баллов · Срок: ${weeksLeft} нед. · Тем в неделю: ~${baseline.topicsPerWeek}`
                  : lang === "kk"
                    ? `Мақсат: ${targetScore}/50 балл · Мерзімі: ${weeksLeft} апта · Аптасына: ~${baseline.topicsPerWeek} тақырып`
                    : `Maqsad: ${targetScore}/50 ball · Muddat: ${weeksLeft} hafta · Haftasiga: ~${baseline.topicsPerWeek} mavzu`}
              </p>
              <p className="small font-medium mt-2">{t.rmConsolidation}:</p>
              {baseline.masteredTopics.length === 0 ? (
                <p className="small m-0">{t.rmConsolidationEmpty}</p>
              ) : (
                <p className="small m-0">{baseline.masteredTopics.map((id) => topicName(id, lang)).join(", ")}</p>
              )}
              <p className="small font-medium mt-3">{t.rmPhase1}:</p>
              <ul className="small list-disc pl-5">
                {baseline.priorityModules
                  .filter((m) => m.phase === 1)
                  .map((m) => (
                    <li key={m.topic}>
                      <button type="button" className="quiet-inline-link" onClick={() => selectTopic(m.topic)}>
                        {m.title}
                      </button>{" "}
                      ({m.soloCount}/2)
                    </li>
                  ))}
              </ul>
              <p className="small font-medium mt-3">{t.rmPhase2}:</p>
              <ul className="small list-disc pl-5">
                {baseline.priorityModules
                  .filter((m) => m.phase === 2)
                  .map((m) => (
                    <li key={m.topic}>
                      <button type="button" className="quiet-inline-link" onClick={() => selectTopic(m.topic)}>
                        {m.title}
                      </button>{" "}
                      ({m.soloCount}/2)
                    </li>
                  ))}
              </ul>
            </div>

            <form
              className="ai-form"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                void askRoadmap();
              }}
            >
              <div className="flex flex-wrap gap-4">
                <label htmlFor="target-score-input" className="flex flex-col gap-1 text-sm font-medium">
                  <span>{t.rmTarget}</span>
                  <input
                    id="target-score-input"
                    name="targetScore"
                    type="number"
                    min={20}
                    max={50}
                    value={targetScore}
                    className="lab-input"
                    onChange={(e) => setTargetScore(Math.max(20, Math.min(50, Number(e.target.value) || 40)))}
                  />
                </label>
                <label htmlFor="weeks-left-input" className="flex flex-col gap-1 text-sm font-medium">
                  <span>{t.rmWeeks}</span>
                  <input
                    id="weeks-left-input"
                    name="weeksLeft"
                    type="number"
                    min={1}
                    max={24}
                    value={weeksLeft}
                    className="lab-input"
                    onChange={(e) => setWeeksLeft(Math.max(1, Math.min(24, Number(e.target.value) || 6)))}
                  />
                </label>
              </div>

              <div>
                <span className="block font-medium text-sm mb-2">{t.rmWeak}</span>
                <div className="flex flex-wrap gap-1.5">
                  {untTopicIds.map((id) => (
                    <Button
                      key={id}
                      type="button"
                      size="sm"
                      variant={weakTopics.includes(id) ? "default" : "outline"}
                      aria-pressed={weakTopics.includes(id)}
                      onClick={() => toggleWeakTopic(id)}
                    >
                      {topicName(id, lang)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <span className="rule-label block mb-1.5">{t.quickLabel}</span>
                <div className="quick-prompts">
                  {t.rmPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className="quick-pill"
                      onClick={() => {
                        setGoalNote(preset);
                        setRmError("");
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <label htmlFor="roadmap-goal" className="form-label">
                {t.rmGoal}
              </label>
              <textarea
                id="roadmap-goal"
                name="roadmapGoal"
                value={goalNote}
                maxLength={400}
                placeholder={t.rmGoalPlaceholder}
                onChange={(e) => {
                  setGoalNote(e.target.value);
                  if (rmError) setRmError("");
                }}
              />
              <span className="small">{goalNote.length}/400</span>

              <label className="checkline" onClick={() => setRmError("")}>
                <Checkbox checked={adult} onCheckedChange={(v) => setAdult(v === true)} />
                <span>{t.adult}</span>
              </label>
              <label className="checkline" onClick={() => setRmError("")}>
                <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} />
                <span>
                  {t.consent}{" "}
                  <a href="/privacy" onClick={(e) => e.stopPropagation()}>
                    {t.privacy}
                  </a>
                </span>
              </label>

              <div>
                <Button type="submit" disabled={rmBusy}>
                  {rmBusy ? t.loading : t.rmGenerate}
                </Button>
              </div>
            </form>

            {rmError && (
              <p role="alert" className="feedback wrong mt-3">
                {rmError}
              </p>
            )}

            {aiRoadmap && (
              <section aria-live="polite" className="response mt-4">
                <span className="rule-label">
                  {aiRoadmap.source === "claude" ? t.badgeLive : t.badgePreview}
                </span>
                <h2 className="steps-heading mt-1 mb-2">{t.rmClaudeTitle}</h2>
                <p className="mt-1 mb-3">{aiRoadmap.summary}</p>
                <ul className="list-disc pl-5 my-2 space-y-1">
                  {aiRoadmap.priorityModules.map((pm) => (
                    <li key={pm.topic}>
                      <strong>{topicName(pm.topic, lang)}:</strong> {pm.reason} → <em>{pm.recommendedAction}</em>
                    </li>
                  ))}
                </ul>
                <strong className="block mt-3">{t.rmMilestones}</strong>
                <ol className="list-decimal pl-5 my-2 space-y-1">
                  {aiRoadmap.weeklyMilestones.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ol>
                <strong className="block mt-3">{t.rmHabit}</strong>
                <p className="mt-1 mb-0">{aiRoadmap.dailyHabit}</p>
              </section>
            )}
          </section>
        )}
      </main>
      <SiteFooter lang={lang} topic={topic} onSelectTab={setTab} />
    </div>
  );
}
