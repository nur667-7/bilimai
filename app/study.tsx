"use client";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { BookOpen, CheckCircle2, ClipboardCheck, Compass, FlaskConical, GitBranch, RotateCcw, Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SiteFooter } from "@/components/site-footer";
import { lessons, untTopicIds, type Language, type TopicId } from "@/lib/lessons";
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
    eyebrow: "Математика ЕНТ (ҰБТ) · 10 тем · 18+",
    title: "Понимай каждый шаг решения, а не заучивай ответы.",
    sub: "Разбери правило и пример, сдай пробное ЕНТ, открой граф пробелов «Второй мозг» или найди ошибку в Лаборатории.",
    openLab: "Лаборатория ошибок →",
    topics: "Темы ЕНТ (10)",
    mobileTopicLabel: "Тема урока",
    lesson: "Объяснение",
    practice: "Практика (3)",
    examTab: "Пробное ЕНТ",
    graphTab: "Второй мозг",
    ai: "Разобрать вопрос",
    roadmapTab: "Мой план",
    rule: "Ключевое правило и инвариант",
    example: "Пошаговый разбор примера",
    hint: "Проверь каждый шаг своим устным объяснением, затем переходи к практике или в Лабораторию ошибок.",
    check: "Проверить ответы",
    retryWrong: "Исправить ошибки",
    showSolutions: "Показать разбор всех вопросов",
    reset: "Сбросить тест",
    correct: "Верно",
    wrong: "Пока неверно — проверь условие и знак перехода",
    result: "Результат",
    choose: "Ответьте на все три вопроса, чтобы проверить себя.",
    session: "Ответы хранятся только в открытой вкладке.",
    transferTitle: "Дополнительная задача с новыми числами",
    transferSub: "Реши задачу по правилу темы (генерируются 24 варианта с разными числами).",
    transferCheck: "Проверить число",
    transferNext: "Новые числа →",
    transferRight: "Верно! Правило применено точно.",
    transferWrong: "Ответ пока не совпал. Проверь вычисления по правилу урока.",
    transferInvalid: "Введите целое число, десятичную дробь или дробь вида 3/7.",
    aiTitle: "Сократический разбор вопроса по теме",
    aiSub: "Помощник объясняет выбранную тему с опорой на правило урока и задаёт наводящий вопрос без подсказки готового ответа.",
    question: "Ваш вопрос по теме",
    placeholder: "Например: почему в теореме Виета сумма корней берётся с противоположным знаком?",
    quickLabel: "Подставить пример вопроса:",
    quickQuestions: [
      "Почему при переносе слагаемого через знак равенства меняется знак?",
      "Как быстро проверить, не перепутаны ли формулы в этой теме?",
      "На каком шаге чаще всего теряют баллы в подобных задачах?"
    ],
    adult: "Мне исполнилось 18 лет.",
    consent: "Согласен отправить текст учебного вопроса для получения разбора. Не ввожу личные данные.",
    ask: "Получить разбор",
    loading: "Формируем разбор…",
    pilot: "Прозрачный статус ответа: при подключённом ключе сервера отображается живой ответ Claude API, в демо-режиме — структурный превью-разбор по правилу урока.",
    read: "О проекте",
    privacy: "Приватность",
    foot: "BilimAI · 10 тем ЕНТ · 240 упражнений на каждом языке (RU / KK / UZ)",
    static: "Выверенные правила и примеры по 10 темам",
    next: "Можно исправить неверные ответы или открыть полный разбор.",
    done: "Все ответы верны! Попробуй задачу с новыми числами ниже или переходи в Лабораторию ошибок.",
    rmTitle: "Учебный план подготовки к ЕНТ",
    rmSub: "Приоритет тем рассчитывается по вашим самостоятельным решениям в Лаборатории ошибок и выбранной цели.",
    rmTarget: "Целевой балл ЕНТ (из 50)",
    rmWeeks: "Недель до экзамена",
    rmWeak: "Темы, вызывающие трудности",
    rmConsolidation: "Базово закреплено (≥2 самостоятельных задач в /lab)",
    rmConsolidationEmpty: "Пока нет закреплённых тем — решите по 2 задачи без подсказок в Лаборатории ошибок.",
    rmGoal: "Цель и главная трудность",
    rmGoalPlaceholder: "Например: путаю знаки в тригонометрии и формулы объёмов пирамиды, нужно набрать 42+ за 6 недель",
    rmPresets: [
      "Цель 45/50 за 6 недель: путаю знаки в теореме Виета, логарифмах и тригонометрии",
      "Цель 38/50 за 4 недели: нужно подтянуть производную, площади и объёмы фигур"
    ],
    rmGenerate: "Составить персональный план",
    rmBaseTitle: "Рекомендуемая очерёдность тем",
    rmPhase1: "Этап 1 (недели 1–2): закрытие пробелов",
    rmPhase2: "Этап 2 (недели 3+): закрепление и перенос навыка",
    rmClaudeTitle: "Персональный план по неделям",
    rmMilestones: "Шаги по неделям",
    rmHabit: "Режим занятий",
    badgeLive: "Claude API · Живой ответ",
    badgePreview: "Демо-режим · Структурный превью-ответ"
  },
  kk: {
    eyebrow: "ҰБТ Математика · 10 тақырып · 18+",
    title: "Дайын жауапты жаттамай, әр қадамның логикасын түсін.",
    sub: "Ереже мен мысалды талдап, жаттығуда өзіңді тексер немесе Қателер зертханасында дайын шешімдегі қатені тап.",
    openLab: "Қателер зертханасы →",
    topics: "ҰБТ тақырыптары (10)",
    mobileTopicLabel: "Сабақ тақырыбы",
    lesson: "Түсіндіру",
    practice: "Жаттығу (3)",
    examTab: "Байқау ҰБТ",
    graphTab: "Екінші ми",
    ai: "Сұрақты талдау",
    roadmapTab: "Менің жоспарым",
    rule: "Негізгі ереже мен инвариант",
    example: "Мысалды қадамдап талдау",
    hint: "Әр қадамды өз сөзіңізбен түсіндіріп көріңіз, содан кейін жаттығуға немесе Қателер зертханасына өтіңіз.",
    check: "Жауаптарды тексеру",
    retryWrong: "Қателерді түзету",
    showSolutions: "Барлық сұрақтың талдауын көрсету",
    reset: "Тестті қайта бастау",
    correct: "Дұрыс",
    wrong: "Әзірше қате — шарт пен таңбаны тексеріңіз",
    result: "Нәтиже",
    choose: "Өзіңізді тексеру үшін үш сұраққа да жауап беріңіз.",
    session: "Жауаптар тек ашық бетте сақталады.",
    transferTitle: "Жаңа сандармен қосымша есеп",
    transferSub: "Тақырып ережесі бойынша есепті шығарыңыз (24 түрлі нұсқа).",
    transferCheck: "Санды тексеру",
    transferNext: "Жаңа сандар →",
    transferRight: "Дұрыс! Ереже дәл қолданылды.",
    transferWrong: "Жауап сәйкес келмеді. Сабақ ережесі бойынша есептеуді тексеріңіз.",
    transferInvalid: "Бүтін сан, ондық бөлшек немесе 3/7 түріндегі бөлшек енгізіңіз.",
    aiTitle: "Тақырып бойынша сұрақты сократтық талдау",
    aiSub: "Көмекші таңдалған тақырыпты сабақ ережесіне сүйеніп түсіндіреді және дайын жауапты айтпай бағыттаушы сұрақ қояды.",
    question: "Тақырып бойынша сұрағыңыз",
    placeholder: "Мысалы: Виет теоремасында түбірлер қосындысы неге қарама-қарсы таңбамен алынады?",
    quickLabel: "Сұрақ үлгісін қою:",
    quickQuestions: [
      "Теңдеудің бір жағынан екінші жағына шығарғанда таңба неге өзгереді?",
      "Осы бөлімдегі формулаларды шатастырмау үшін нені есте сақтау керек?",
      "Осындай есептерде көбіне қай қадамда қателеседі?"
    ],
    adult: "Мен 18 жасқа толдым.",
    consent: "Талдау алу үшін оқу сұрағымды жіберуге келісемін. Жеке деректерді енгізбеймін.",
    ask: "Талдауды алу",
    loading: "Талдау дайындалып жатыр…",
    pilot: "Жауап мәртебесі ашық көрсетіледі: сервер кілті қосылғанда тікелей Claude API жауабы, ал демо-режимде сабақ ережесіне негізделген құрылымдық превью беріледі.",
    read: "Жоба туралы",
    privacy: "Құпиялық",
    foot: "BilimAI · 10 ҰБТ тақырыбы · Әр тілде 240 жаттығу (RU / KK / UZ)",
    static: "10 тақырып бойынша тексерілген ережелер мен мысалдар",
    next: "Қате жауаптарды түзетуге немесе толық талдауды ашуға болады.",
    done: "Барлық жауап дұрыс! Төмендегі жаңа сандармен есепті шығарып көріңіз немесе Қателер зертханасына өтіңіз.",
    rmTitle: "ҰБТ-ға дайындықтың оқу жоспары",
    rmSub: "Тақырыптар басымдығы Қателер зертханасындағы өздік шешімдеріңіз бен мақсатты балға қарай есептеледі.",
    rmTarget: "Мақсатты ҰБТ балы (50-ден)",
    rmWeeks: "Емтиханға дейінгі апта саны",
    rmWeak: "Қиындық тудыратын тақырыптар",
    rmConsolidation: "Базалық деңгейде бекітілді (/lab ішінде ≥2 өздік есеп)",
    rmConsolidationEmpty: "Әзірше бекітілген тақырып жоқ — Қателер зертханасында көмексіз 2 есептен шығарыңыз.",
    rmGoal: "Мақсатыңыз және негізгі қиындық",
    rmGoalPlaceholder: "Мысалы: тригонометрия мен пирамида көлемінде қателесемін, 6 аптада 42+ балл жинау керек",
    rmPresets: [
      "6 аптада 45/50 балл: Виет теоремасы, логарифм және тригонометрияда таңба қателері",
      "4 аптада 38/50 балл: туынды, планиметрия аудандары және пирамида көлемі"
    ],
    rmGenerate: "Жеке жоспар құру",
    rmBaseTitle: "Ұсынылатын тақырыптар реті",
    rmPhase1: "1-кезең (1–2 апта): негізгі олқылықтарды жою",
    rmPhase2: "2-кезең (3+ апта): бекіту және дағдыны тексеру",
    rmClaudeTitle: "Апталық жеке жоспар",
    rmMilestones: "Апталық қадамдар",
    rmHabit: "Дайындық тәртібі",
    badgeLive: "Claude API · Тікелей жауап",
    badgePreview: "Демо-режим · Құрылымдық превью"
  },
  uz: {
    eyebrow: "Matematika · 10 ta mavzu · 18+",
    title: "Javobni yodlama, har bir qadam mantiqini tushunib ol.",
    sub: "Qoida va namunani tahlil qiling, sinov UBT topshiring, «Ikkinchi miya» grafini oching yoki Xatolar laboratoriyasida yechimdagi xatoni toping.",
    openLab: "Xatolar laboratoriyasi →",
    topics: "Dastur mavzulari (10)",
    mobileTopicLabel: "Dars mavzusi",
    lesson: "Tushuntirish",
    practice: "Mashq (3)",
    examTab: "Sinov UBT",
    graphTab: "Ikkinchi miya",
    ai: "Savolni tahlil qilish",
    roadmapTab: "Mening rejam",
    rule: "Asosiy qoida va invariant",
    example: "Namunani qadam-baqadam tahlil qilish",
    hint: "Har bir qadamni o‘z so‘zlaringiz bilan tushuntiring, keyin mashq yoki Xatolar laboratoriyasiga o‘ting.",
    check: "Javoblarni tekshirish",
    retryWrong: "Xatolarni tuzatish",
    showSolutions: "Barcha savollar tahlilini ko‘rsatish",
    reset: "Testni qayta boshlash",
    correct: "To‘g‘ri",
    wrong: "Hozircha noto‘g‘ri — shart va ishorani tekshiring",
    result: "Natija",
    choose: "O‘zingizni tekshirish uchun uchala savolga javob bering.",
    session: "Javoblar faqat ochiq sahifada saqlanadi.",
    transferTitle: "Yangi sonlar bilan qo‘shimcha masala",
    transferSub: "Mavzu qoidasi asosida masalani yeching (24 xil variant).",
    transferCheck: "Sonni tekshirish",
    transferNext: "Yangi sonlar →",
    transferRight: "To‘g‘ri! Qoida aniq qo‘llanildi.",
    transferWrong: "Javob mos kelmadi. Dars qoidasi bo‘yicha hisobni tekshiring.",
    transferInvalid: "Butun son, o‘nli kasr yoki 3/7 shaklidagi kasr kiriting.",
    aiTitle: "Mavzu bo‘yicha savolning Sokratik tahlili",
    aiSub: "Yordamchi tanlangan mavzuni dars qoidasiga tayangan holda tushuntiradi va tayyor javobni aytmasdan yo‘naltiruvchi savol beradi.",
    question: "Mavzu bo‘yicha savolingiz",
    placeholder: "Masalan: nega Viyet teoremasida ildizlar yig‘indisi qarama-qarshi ishora bilan olinadi?",
    quickLabel: "Savol namunasini qo‘yish:",
    quickQuestions: [
      "Nega hadni tenglikning boshqa tomoniga o‘tkazganda ishora o‘zgaradi?",
      "Shu bo‘limdagi formulalarni adashtirmaslik uchun nimaga e’tibor berish kerak?",
      "Bunday masalalarda ko‘pincha qaysi qadamda xato qilinadi?"
    ],
    adult: "Men 18 yoshga to‘lganman.",
    consent: "Tahlil olish uchun o‘quv savolimni yuborishga roziman. Shaxsiy ma’lumot kiritmayman.",
    ask: "Tushuntirish olish",
    loading: "Javob tayyorlanmoqda…",
    pilot: "Javob holati ochiq ko‘rsatiladi: server kaliti yoqilganda jonli Claude API javobi, demo rejimda esa dars qoidasi asosida tuzilgan prevyu qaytariladi.",
    read: "Loyiha haqida",
    privacy: "Maxfiylik",
    foot: "BilimAI · 10 ta mavzu · Har bir tilda 240 ta mashq (RU / KK / UZ)",
    static: "10 ta mavzu bo‘yicha tekshirilgan qoida va namunalar",
    next: "Noto‘g‘ri javoblarni tuzatish yoki to‘liq tahlilni ochish mumkin.",
    done: "Barcha javoblar to‘g‘ri! Quyidagi yangi sonlar bilan masalani yechib ko‘ring yoki Xatolar laboratoriyasiga o‘ting.",
    rmTitle: "Imtihonga tayyorgarlik o‘quv rejasi",
    rmSub: "Mavzular ustuvorligi Xatolar laboratoriyasidagi mustaqil yechimlaringiz va maqsadli ball asosida hisoblanadi.",
    rmTarget: "Maqsadli ball (50 dan)",
    rmWeeks: "Imtihongacha haftalar soni",
    rmWeak: "Qiyinchilik tug‘diradigan mavzular",
    rmConsolidation: "Bazaviy mustahkamlangan (/lab ichida ≥2 mustaqil masala)",
    rmConsolidationEmpty: "Hozircha mustahkamlangan mavzu yo‘q — Xatolar laboratoriyasida yordamsiz 2 tadan masala yeching.",
    rmGoal: "Maqsadingiz va asosiy qiyinchilik",
    rmGoalPlaceholder: "Masalan: logarifm va hosilada xato qilaman, 6 haftada 42+ ball yig‘ishim kerak",
    rmPresets: [
      "6 haftada 45/50 ball: Viyet teoremasi, logarifm va trigonometriyada ishora xatolari",
      "4 haftada 38/50 ball: hosila hamda geometrik yuzalar va hajmlar"
    ],
    rmGenerate: "Shaxsiy rejani tuzish",
    rmBaseTitle: "Tavsiya etilgan mavzular tartibi",
    rmPhase1: "1-bosqich (1–2 hafta): asosiy bo‘shliqlarni yopish",
    rmPhase2: "2-bosqich (3+ hafta): mustahkamlash va ko‘nikmani tekshirish",
    rmClaudeTitle: "Haftalik shaxsiy o‘quv rejasi",
    rmMilestones: "Haftalik qadamlar",
    rmHabit: "Kunlik tayyorgarlik tartibi",
    badgeLive: "Claude API · Jonli javob",
    badgePreview: "Demo rejim · Tuzilgan prevyu"
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
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);
  const [practiceNotice, setPracticeNotice] = useState(false);

  const [practiceSeed, setPracticeSeed] = useState(0);
  const [transferInput, setTransferInput] = useState("");
  const [transferStatus, setTransferStatus] = useState<"" | "right" | "wrong" | "invalid">("");

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
  const t = copy[lang];
  const score = lesson.questions.filter((q, i) => answers[i] === String(q.correct)).length;
  const baseline = buildBaselineRoadmap(labProgress, targetScore, weeksLeft, lang);
  const transferChallenge = makeChallenge(topic, practiceSeed, lang);

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
            input: "Проверьте заполнение вопроса и отметьте оба пункта согласия."
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
    setAnswers({});
    setChecked(false);
    setShowExplanations(false);
    setTransferInput("");
    setTransferStatus("");
    setAnswer(null);
    setError("");
    setBusy(false);
    setQuestion("");
  }

  function selectTopic(id: TopicId) {
    reset();
    setTopic(id);
    if (tab === "roadmap" || tab === "exam") setTab("lesson");
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

  function retryWrongAnswers() {
    const nextAnswers: Record<number, string> = {};
    lesson.questions.forEach((q, idx) => {
      if (answers[idx] === String(q.correct)) {
        nextAnswers[idx] = answers[idx];
      }
    });
    setAnswers(nextAnswers);
    setChecked(false);
    setShowExplanations(false);
  }

  function handleCheckPractice() {
    if (Object.keys(answers).length < 3) {
      setPracticeNotice(true);
      const firstUnanswered = [0, 1, 2].find((idx) => answers[idx] === undefined) ?? 0;
      const el = document.getElementById(`q${firstUnanswered}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setPracticeNotice(false);
    setChecked(true);
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

  return (
    <div className="agy-shell">
      <header className="wrap top agy-floating-dock">
        <a className="brand" href="/">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="9" fill="url(#agyBrandGrad)" />
            <path d="M9 10h8.5a4.5 4.5 0 0 1 0 9H9V10zm0 9h9.5a4.5 4.5 0 0 1 0 9H9v-9z" fill="#fff" fillOpacity="0.95" />
            <defs>
              <linearGradient id="agyBrandGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563eb" />
                <stop offset="1" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
          </svg>
          BilimAI <span className="beta">ЕНТ · ҰБТ</span>
        </a>
        <nav className="topnav" aria-label="Навигация">
          <button
            type="button"
            className={`topnav-pill ${tab === "exam" ? "active" : ""}`}
            onClick={() => setTab("exam")}
          >
            <ClipboardCheck size={14} />
            {t.examTab}
          </button>
          <button
            type="button"
            className={`topnav-pill ${tab === "graph" ? "active" : ""}`}
            onClick={() => setTab("graph")}
          >
            <GitBranch size={14} />
            {t.graphTab}
          </button>
          <a href={`/lab?lang=${lang}&topic=${topic}`}>{t.openLab}</a>
          <a href="#claude-engine" className="topnav-pill accent">
            <Sparkles size={13} aria-hidden="true" />
            Claude API
          </a>
          <a href="#contacts">{lang === "ru" ? "Контакты" : lang === "kk" ? "Байланыс" : "Aloqa"}</a>
          <a href="/about">{t.read}</a>
          <div className="flex gap-1" aria-label="Язык">
            <Button variant={lang === "ru" ? "default" : "ghost"} size="sm" aria-pressed={lang === "ru"} onClick={() => selectLanguage("ru")}>
              RU
            </Button>
            <Button variant={lang === "kk" ? "default" : "ghost"} size="sm" aria-pressed={lang === "kk"} onClick={() => selectLanguage("kk")}>
              KK
            </Button>
            <Button variant={lang === "uz" ? "default" : "ghost"} size="sm" aria-pressed={lang === "uz"} onClick={() => selectLanguage("uz")}>
              UZ
            </Button>
          </div>
        </nav>
      </header>

      <main className="wrap">
        <section className="compact-hero agy-floating-island">
          <div className="compact-hero-text">
            <span className="eyebrow">{t.eyebrow}</span>
            <h1>{t.title}</h1>
            <p>{t.sub}</p>
          </div>
          <div className="hero-actions">
            <button
              type="button"
              className={`cta-pill secondary ${tab === "exam" ? "active" : ""}`}
              onClick={() => setTab("exam")}
            >
              <ClipboardCheck size={16} />
              {t.examTab}
            </button>
            <button
              type="button"
              className={`cta-pill secondary ${tab === "graph" ? "active" : ""}`}
              onClick={() => setTab("graph")}
            >
              <GitBranch size={16} />
              {t.graphTab}
            </button>
            <a className="cta-pill" href={`/lab?lang=${lang}&topic=${topic}`}>
              <FlaskConical size={16} />
              {t.openLab}
            </a>
          </div>
        </section>

        <div className="mobile-topic-bar">
          <label htmlFor="mobile-lesson-select" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t.mobileTopicLabel}
          </label>
          <select
            id="mobile-lesson-select"
            name="mobileLessonSelect"
            className="mobile-topic-select"
            value={topic}
            onChange={(e) => selectTopic(e.target.value as TopicId)}
          >
            {lessons[lang].map((l, idx) => (
              <option key={l.id} value={l.id}>
                {String(idx + 1).padStart(2, "0")}. {l.title} ({l.section})
              </option>
            ))}
          </select>
        </div>

        <div className="workspace">
          <aside className="topics agy-floating-island">
            <h2>{t.topics}</h2>
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
                  {l.title}
                  <small>{l.section}</small>
                </span>
              </button>
            ))}
            <div className="aside-note">
              <BookOpen size={18} className="mb-1.5" />
              {t.static}
            </div>
          </aside>

          <section className="surface agy-floating-island" aria-label={lesson.title}>
            <div className="lesson-head">
              <div>
                <h2>{lesson.title}</h2>
                <p className="small mt-1 mb-0">{lesson.intro}</p>
              </div>
              <span className="section-pill">{lesson.section}</span>
            </div>

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="tabsbar h-auto flex-wrap justify-start">
                <TabsTrigger value="lesson">{t.lesson}</TabsTrigger>
                <TabsTrigger value="practice">{t.practice}</TabsTrigger>
                <TabsTrigger value="exam">
                  <ClipboardCheck size={15} />
                  {t.examTab}
                </TabsTrigger>
                <TabsTrigger value="graph">
                  <GitBranch size={15} />
                  {t.graphTab}
                </TabsTrigger>
                <TabsTrigger value="ai">
                  <Sparkles size={15} />
                  {t.ai}
                </TabsTrigger>
                <TabsTrigger value="roadmap">
                  <Compass size={15} />
                  {t.roadmapTab}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lesson">
                <div className="rule">
                  <strong>{t.rule}</strong>
                  {lesson.rule}
                </div>
                <h3 className="text-base mt-5 font-bold">{t.example}</h3>
                <div className="equation">{lesson.example}</div>
                <ol className="steps">
                  {lesson.steps.map((step, i) => (
                    <li key={step}>
                      <span className="step-number">{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="callout">{t.hint}</div>
                <div className="actions">
                  <Button onClick={() => setTab("practice")}>{t.practice}</Button>
                  <Button variant="outline" onClick={() => setTab("exam")}>
                    <ClipboardCheck size={15} />
                    {t.examTab}
                  </Button>
                  <Button variant="outline" onClick={() => setTab("graph")}>
                    <GitBranch size={15} />
                    {t.graphTab}
                  </Button>
                  <Button variant="outline" onClick={() => setTab("ai")}>
                    <Sparkles size={15} />
                    {t.ai}
                  </Button>
                  <a className="cta-pill secondary text-xs ml-auto" href={`/lab?lang=${lang}&topic=${topic}`}>
                    <FlaskConical size={14} />
                    {t.openLab}
                  </a>
                </div>
              </TabsContent>

              <TabsContent value="practice">
                <p className="small mb-2">{t.session}</p>
                {lesson.questions.map((q, i) => {
                  const isCorrect = answers[i] === String(q.correct);
                  return (
                    <div className="question" key={q.text}>
                      <h3 id={`q${i}`}>
                        {i + 1}. {q.text}
                      </h3>
                      <RadioGroup
                        aria-labelledby={`q${i}`}
                        value={answers[i] ?? ""}
                        disabled={checked}
                        onValueChange={(v) => {
                          setPracticeNotice(false);
                          setAnswers((prev) => ({ ...prev, [i]: v }));
                        }}
                      >
                        {q.options.map((option, j) => (
                          <label
                            className="option"
                            key={option}
                            data-selected={answers[i] === String(j)}
                            onClick={() => {
                              if (!checked) {
                                setPracticeNotice(false);
                                setAnswers((prev) => ({ ...prev, [i]: String(j) }));
                              }
                            }}
                          >
                            <RadioGroupItem value={String(j)} id={`q${i}a${j}`} />
                            <span>{option}</span>
                          </label>
                        ))}
                      </RadioGroup>
                      {checked && (
                        <div className={`feedback ${!isCorrect ? "wrong" : ""}`}>
                          <strong>{isCorrect ? t.correct : t.wrong}. </strong>
                          {(isCorrect || showExplanations) && <span>{q.why}</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="actions">
                  {checked ? (
                    <>
                      <span role="status" className="score">
                        {t.result}: {score}/3
                      </span>
                      {score < 3 && (
                        <Button variant="default" onClick={retryWrongAnswers}>
                          {t.retryWrong}
                        </Button>
                      )}
                      {score < 3 && !showExplanations && (
                        <Button variant="outline" onClick={() => setShowExplanations(true)}>
                          {t.showSolutions}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setAnswers({});
                          setChecked(false);
                          setShowExplanations(false);
                          setPracticeNotice(false);
                        }}
                      >
                        <RotateCcw size={16} />
                        {t.reset}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleCheckPractice}>
                      <CheckCircle2 size={16} />
                      {t.check} ({Object.keys(answers).length}/3)
                    </Button>
                  )}
                </div>
                {practiceNotice && !checked && Object.keys(answers).length < 3 && (
                  <p role="status" className="feedback wrong">
                    {t.choose} ({Object.keys(answers).length}/3)
                  </p>
                )}
                <p className="small mt-2">{checked ? (score === 3 ? t.done : t.next) : t.choose}</p>

                <div className="callout mt-6">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <strong>{t.transferTitle}</strong>
                    <span className="section-pill">#{practiceSeed + 1}/24</span>
                  </div>
                  <p className="small mt-1 mb-2">{t.transferSub}</p>
                  <p className="lab-task my-2">{transferChallenge.transfer}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <input
                      id="transfer-answer-input"
                      name="transferAnswer"
                      type="text"
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
                    <Button type="button" size="sm" onClick={checkTransfer}>
                      {t.transferCheck}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setPracticeSeed((s) => (s + 1) % 24);
                        setTransferInput("");
                        setTransferStatus("");
                      }}
                    >
                      {t.transferNext}
                    </Button>
                  </div>
                  {transferStatus && (
                    <p role="status" className={`feedback mt-2 ${transferStatus !== "right" ? "wrong" : ""}`}>
                      {transferStatus === "right"
                        ? `${t.transferRight} (${transferChallenge.solution})`
                        : transferStatus === "invalid"
                          ? t.transferInvalid
                          : t.transferWrong}
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="exam">
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
              </TabsContent>

              <TabsContent value="graph">
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
              </TabsContent>

              <TabsContent value="ai">
                <h3 className="text-lg font-bold">{t.aiTitle}</h3>
                <p className="small mb-3">{t.aiSub}</p>

                <div className="mb-3">
                  <span className="small font-semibold block mb-1">{t.quickLabel}</span>
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
                  <label htmlFor="learner-question" className="font-semibold text-sm">
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
                      {t.consent} <a href="/privacy" onClick={(e) => e.stopPropagation()}>{t.privacy}</a>
                    </span>
                  </label>
                  <div>
                    <Button type="submit" disabled={busy}>
                      <Sparkles size={15} />
                      {busy ? t.loading : t.ask}
                    </Button>
                  </div>
                </form>
                <p className="small mt-3">{t.pilot}</p>
                {error && (
                  <p role="alert" className="error">
                    {error}
                  </p>
                )}
                {answer && (
                  <section aria-live="polite" className="response">
                    <div className={`source-badge ${answer.source === "claude" ? "live" : "preview"}`}>
                      {answer.source === "claude" ? t.badgeLive : t.badgePreview}
                    </div>
                    <p className="mt-1 mb-3">{answer.explanation}</p>
                    <strong>{lang === "ru" ? "Наводящий вопрос:" : lang === "kk" ? "Бағыттаушы сұрақ:" : "Yo‘naltiruvchi savol:"}</strong>
                    <p className="mt-1 mb-0">{answer.hint}</p>
                  </section>
                )}
              </TabsContent>

              <TabsContent value="roadmap">
                <h3 className="text-lg font-bold">{t.rmTitle}</h3>
                <p className="small mb-3">{t.rmSub}</p>

                <div className="callout mb-4">
                  <strong>{t.rmBaseTitle}</strong>
                  <p className="small mt-1">
                    {lang === "ru"
                      ? `Цель: ${targetScore}/50 баллов · Срок: ${weeksLeft} нед. · Тем в неделю: ~${baseline.topicsPerWeek}`
                      : lang === "kk"
                        ? `Мақсат: ${targetScore}/50 балл · Мерзімі: ${weeksLeft} апта · Аптасына: ~${baseline.topicsPerWeek} тақырып`
                        : `Maqsad: ${targetScore}/50 ball · Muddat: ${weeksLeft} hafta · Haftasiga: ~${baseline.topicsPerWeek} mavzu`}
                  </p>
                  <p className="small font-semibold mt-2">{t.rmConsolidation}:</p>
                  {baseline.masteredTopics.length === 0 ? (
                    <p className="small m-0">{t.rmConsolidationEmpty}</p>
                  ) : (
                    <p className="small m-0">{baseline.masteredTopics.map((id) => topicName(id, lang)).join(", ")}</p>
                  )}
                  <p className="small font-semibold mt-2">{t.rmPhase1}:</p>
                  <ul className="small list-disc pl-5">
                    {baseline.priorityModules
                      .filter((m) => m.phase === 1)
                      .map((m) => (
                        <li key={m.topic}>
                          <button type="button" className="underline font-medium cursor-pointer" onClick={() => selectTopic(m.topic)}>
                            {m.title}
                          </button>{" "}
                          ({m.soloCount}/2)
                        </li>
                      ))}
                  </ul>
                  <p className="small font-semibold mt-2">{t.rmPhase2}:</p>
                  <ul className="small list-disc pl-5">
                    {baseline.priorityModules
                      .filter((m) => m.phase === 2)
                      .map((m) => (
                        <li key={m.topic}>
                          <button type="button" className="underline font-medium cursor-pointer" onClick={() => selectTopic(m.topic)}>
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
                    <label htmlFor="target-score-input" className="flex flex-col gap-1 text-sm font-semibold">
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
                    <label htmlFor="weeks-left-input" className="flex flex-col gap-1 text-sm font-semibold">
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
                    <span className="block font-semibold text-sm mb-2">{t.rmWeak}</span>
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
                    <span className="small font-semibold block mb-1">{t.quickLabel}</span>
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

                  <label htmlFor="roadmap-goal" className="font-semibold text-sm">
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
                      {t.consent} <a href="/privacy" onClick={(e) => e.stopPropagation()}>{t.privacy}</a>
                    </span>
                  </label>

                  <div>
                    <Button type="submit" disabled={rmBusy}>
                      <Compass size={15} />
                      {rmBusy ? t.loading : t.rmGenerate}
                    </Button>
                  </div>
                </form>

                {rmError && (
                  <p role="alert" className="error">
                    {rmError}
                  </p>
                )}

                {aiRoadmap && (
                  <section aria-live="polite" className="response mt-4">
                    <div className={`source-badge ${aiRoadmap.source === "claude" ? "live" : "preview"}`}>
                      {aiRoadmap.source === "claude" ? t.badgeLive : t.badgePreview}
                    </div>
                    <strong className="block text-base mb-1">{t.rmClaudeTitle}</strong>
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
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
      <SiteFooter lang={lang} topic={topic} onSelectTab={setTab} />
    </div>
  );
}
