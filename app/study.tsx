"use client";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { ArrowRight, BookOpen, BrainCircuit, CheckCircle2, Compass, GraduationCap, LogOut, Microscope, RotateCcw, Sparkles, Target, User } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SiteFooter } from "@/components/site-footer";
import { HeroCanvas, ThemeToggleButton, useAniqTheme } from "@/components/hero-canvas";
import { getOptionFeedback, lessons, untTopicIds, type Language, type TopicId } from "@/lib/lessons";
import {
  buildBaselineRoadmap,
  checkAnswer,
  formatLabTask,
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
import {
  clearUserProfile,
  kzUniversities,
  loadUserProfile,
  saveUserProfile,
  type UniversityId,
  type UserProfile
} from "@/lib/user-profile";
import { UntExamView } from "@/app/unt-exam-view";
import { KnowledgeGraphView } from "@/app/knowledge-graph-view";
import { XrayTrapView } from "@/app/xray-trap-view";

const copy = {
  ru: {
    navStudy: "Занятие",
    navXray: "🔬 Рентген & Грант РК",
    navGraph: "Карта тем",
    navExam: "Пробное ЕНТ",
    navPlan: "Мой план",
    navLab: "Тренировка ошибок",
    navAbout: "О проекте",
    loginBtn: "Войти",
    registerBtn: "Начать",
    logoutBtn: "Выйти",
    welcomeBadge: "Единая ИИ-платформа математики и ЕНТ · 16 разделов НЦТ РК",
    welcomeTitle: "Понимать логику, находить ловушки и",
    welcomeHighlight: "брать грант на ЕНТ",
    welcomeDesc:
      "Единая платформа точной математической диагностики Aniq AI: построчный Рентген черновика, 1 152 задачи на поиск неверного шага, пробное ЕНТ, граф знаний, сократический ИИ-тьютор Claude API и Радар госгранта ВУЗов РК.",
    welcomeCtaRegister: "Создать аккаунт",
    welcomeCtaXray: "🔬 Рентген черновика",
    welcomeCtaExam: "Пробное ЕНТ",
    welcomeCtaGraph: "Карта 16 тем",
    welcomeCtaLab: "Тренировка ошибок",
    welcomeHide: "Свернуть витрину",
    welcomeShow: "Витрина Aniq AI",
    bentoKicker: "ШЕСТЬ МОДУЛЕЙ ANIQ AI",
    bentoTitle: "Всё для победы на ЕНТ и понимания математики",
    topics: "16 тем ЕНТ",
    mobileTopicLabel: "Тема",
    lesson: "Разбор",
    practice: "Практика",
    ai: "ИИ-тьютор",
    rule: "§ Главное правило (инвариант)",
    exampleLabel: "Разбор образца",
    exampleSteps: "Пошаговый ход решения",
    note: "Проговори каждый переход своими словами — почему равенство или свойство сохраняется на этом шаге.",
    solveSelf: "Решить самостоятельно",
    askAboutRule: "Задать вопрос по правилу",
    taskProgress: "Задача",
    ofLabel: "из",
    extraTaskTab: "Свои числа",
    checkOne: "Проверить ответ",
    chooseOptionPrompt: "Выберите один из вариантов ответа выше, чтобы проверить решение.",
    selectedIndicator: "Выбрано",
    correctTitle: "Верно",
    wrongTitle: "Обрати внимание на переход",
    analyzeErrorBtn: "Показать правило",
    askAiWhyBtn: "Разобрать с ИИ-тьютором (Claude)",
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
    aiTitle: "Сократический ИИ-тьютор (Claude API)",
    aiSub:
      "В отличие от статического учебника, Claude API анализирует твой вопрос или конкретную ошибку в вычислениях, объясняет правило простыми словами на выбранном языке и задаёт проверочный вопрос без спойлера ответа.",
    question: "Ваш вопрос или шаг, который вызвал трудность",
    placeholder: "Например: почему в теореме Виета сумма корней берётся с противоположным знаком?",
    quickLabel: "Частые вопросы по теме:",
    quickQuestions: [
      "Почему при переносе слагаемого через знак равенства меняется знак?",
      "Как быстро проверить, не перепутаны ли формулы в этой теме?",
      "На каком шаге чаще всего теряют баллы на ЕНТ в этой теме?"
    ],
    schoolPrivacyNote:
      "Анонимный режим для школьников: регистрация не нужна. Не вводите ФИО, номер телефона или школу.",
    consent: "Отправить только учебный вопрос по математике для получения разбора (без личных данных).",
    ask: "Получить разбор ИИ-тьютора",
    loading: "ИИ-тьютор формирует разбор…",
    pilot: "Генеративный разбор выполняется через защищённый серверный маршрут /api/explain (Claude API с детерминированным резервным контуром).",
    privacy: "Приватность",
    rmTitle: "Персональный план подготовки к ЕНТ",
    rmSub: "Очерёдность 16 тем строится по результатам пробного ЕНТ, тренировки ошибок и выбранной цели.",
    rmTarget: "Целевой балл ЕНТ (из 50)",
    rmWeeks: "Недель до экзамена",
    rmWeak: "Темы, которые нужно подтянуть (из 16 разделов ЕНТ)",
    rmConsolidation: "Закреплено (≥2 самостоятельных решения)",
    rmConsolidationEmpty: "Пока нет закреплённых тем — решите по 2 задачи без подсказок в разделе «Тренировка ошибок».",
    rmGoal: "Цель и главная трудность для ИИ-планировщика (Claude API)",
    rmGoalPlaceholder: "Например: путаю знаки в тригонометрии и формулы объёмов пирамиды, нужно набрать 42+ за 6 недель",
    rmPresets: [
      "Цель 45/50 за 6 недель: путаю знаки в теореме Виета, неравенствах и тригонометрии",
      "Цель 38/50 за 4 недели: нужно подтянуть производную, первообразную и стереометрию"
    ],
    rmGenerate: "Составить план с Claude API",
    rmBaseTitle: "Рекомендуемая очерёдность тем",
    rmPhase1: "Этап 1 (недели 1–2): базовые темы и закрытие пробелов",
    rmPhase2: "Этап 2 (недели 3+): закрепление и перенос навыка",
    rmClaudeTitle: "Персональный план по неделям",
    rmMilestones: "Шаги по неделям",
    rmHabit: "Режим занятий",
    badgeLive: "Claude API · Живой разбор",
    badgePreview: "Инвариант урока · Резервный контур"
  },
  kk: {
    navStudy: "Сабақ",
    navXray: "🔬 Рентген & ҚР Гранты",
    navGraph: "Тақырыптар картасы",
    navExam: "Байқау ҰБТ",
    navPlan: "Менің жоспарым",
    navLab: "Қатемен жұмыс",
    navAbout: "Жоба туралы",
    loginBtn: "Кіру",
    registerBtn: "Бастау",
    logoutBtn: "Шығу",
    welcomeBadge: "Математика және ҰБТ-ға арналған бірыңғай ЖИ-платформа · ҰТО 16 бөлімі",
    welcomeTitle: "Логиканы түсіну, тұзақты табу және",
    welcomeHighlight: "ҰБТ грантын жеңіп алу",
    welcomeDesc:
      "Aniq AI дәл математикалық диагностика платформасы: шешім рентгені, 1 152 қате қадамды табу есебі, байқау ҰБТ, білім графы, Claude API сократикалық тьюторы және ҚР ЖОО грант радары.",
    welcomeCtaRegister: "Аккаунт ашу",
    welcomeCtaXray: "🔬 Шешім рентгені",
    welcomeCtaExam: "Байқау ҰБТ",
    welcomeCtaGraph: "16 тақырып картасы",
    welcomeCtaLab: "Қатемен жұмыс",
    welcomeHide: "Витринаны жинау",
    welcomeShow: "Aniq AI витринасы",
    bentoKicker: "ANIQ AI АЛТЫ МОДУЛІ",
    bentoTitle: "ҰБТ-ға дайындық пен математиканы түсінуге қажеттінің бәрі",
    topics: "ҰБТ 16 тақырыбы",
    mobileTopicLabel: "Тақырып",
    lesson: "Талдау",
    practice: "Жаттығу",
    ai: "ЖИ-тьютор",
    rule: "§ Негізгі ереже (инвариант)",
    exampleLabel: "Үлгі талдауы",
    exampleSteps: "Қадамдық шешу жолы",
    note: "Әр қадамды өз сөзіңізбен түсіндіріп көріңіз — теңдік немесе қасиет неліктен сақталады.",
    solveSelf: "Өз бетінше шығару",
    askAboutRule: "Ереже бойынша сұрақ қою",
    taskProgress: "Есеп",
    ofLabel: "/",
    extraTaskTab: "Жаңа сандар",
    checkOne: "Жауапты тексеру",
    chooseOptionPrompt: "Шешімді тексеру үшін жоғарыдағы жауап нұсқаларының бірін таңдаңыз.",
    selectedIndicator: "Таңдалды",
    correctTitle: "Дұрыс",
    wrongTitle: "Амал мен таңбаға назар аударыңыз",
    analyzeErrorBtn: "Ережені көрсету",
    askAiWhyBtn: "ЖИ-тьютормен талдау (Claude)",
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
    aiTitle: "Сократикалық ЖИ-тьютор (Claude API)",
    aiSub:
      "Кәдімгі оқулықтан айырмашылығы — Claude API сіздің нақты сұрағыңызды немесе жіберген қатеңізді талдап, ережені түсінікті тілде түсіндіреді және дайын жауапты айтпай бағыттаушы сұрақ қояды.",
    question: "Сұрағыңыз немесе қиындық тудырған қадам",
    placeholder: "Мысалы: Виет теоремасында түбірлер қосындысы неге қарама-қарсы таңбамен алынады?",
    quickLabel: "Жиі қойылатын сұрақтар:",
    quickQuestions: [
      "Теңдеудің бір жағынан екінші жағына шығарғанда таңба неге өзгереді?",
      "Осы бөлімдегі формулаларды шатастырмау үшін нені есте сақтау керек?",
      "ҰБТ-да осы тақырыпта көбіне қай қадамда ұпай жоғалтады?"
    ],
    schoolPrivacyNote:
      "Оқушыларға арналған анонимді режим: тіркелу қажет емес. Аты-жөніңізді, телефон немесе мектеп нөмірін жазбаңыз.",
    consent: "Талдау алу үшін тек математикалық оқу сұрағын жіберуге келісемін (жеке деректерсіз).",
    ask: "ЖИ-тьютор талдауын алу",
    loading: "Талдау дайындалып жатыр…",
    pilot: "Генеративті талдау қорғалған /api/explain серверлік маршруты арқылы (Claude API + резервтік контур) орындалады.",
    privacy: "Құпиялық",
    rmTitle: "ҰБТ-ға жеке дайындық жоспары",
    rmSub: "16 тақырыптың реті байқау ҰБТ, қатемен жұмыс және мақсатты балға қарай құрылады.",
    rmTarget: "Мақсатты ҰБТ балы (50-ден)",
    rmWeeks: "Емтиханға дейінгі апта саны",
    rmWeak: "Қайталауды қажет ететін тақырыптар (16 бөлімнен)",
    rmConsolidation: "Бекітілді (≥2 өздік шешім)",
    rmConsolidationEmpty: "Әзірше бекітілген тақырып жоқ — «Қатемен жұмыс» бөлімінде көмексіз 2 есептен шығарыңыз.",
    rmGoal: "ЖИ-жоспарлаушыға (Claude API) арналған мақсат пен қиындық",
    rmGoalPlaceholder: "Мысалы: тригонометрия мен пирамида көлемінде қателесемін, 6 аптада 42+ балл жинау керек",
    rmPresets: [
      "6 аптада 45/50 балл: Виет теоремасы, теңсіздіктер және тригонометрияда таңба қателері",
      "4 аптада 38/50 балл: туынды, интеграл және стереометрия"
    ],
    rmGenerate: "Claude API арқылы жоспар құру",
    rmBaseTitle: "Ұсынылатын тақырыптар реті",
    rmPhase1: "1-кезең (1–2 апта): базалық тақырыптар және олқылықтарды жою",
    rmPhase2: "2-кезең (3+ апта): бекіту және дағдыны тексеру",
    rmClaudeTitle: "Апталық жеке жоспар",
    rmMilestones: "Апталық қадамдар",
    rmHabit: "Дайындық тәртібі",
    badgeLive: "Claude API · Тікелей талдау",
    badgePreview: "Сабақ инварианты · Резервтік контур"
  },
  uz: {
    navStudy: "Dars",
    navXray: "🔬 Rentgen & Grant",
    navGraph: "Mavzular xaritasi",
    navExam: "Sinov UBT",
    navPlan: "Mening rejam",
    navLab: "Xatolar ustida ishlash",
    navAbout: "Loyiha haqida",
    loginBtn: "Kirish",
    registerBtn: "Boshlash",
    logoutBtn: "Chiqish",
    welcomeBadge: "Matematika va imtihon uchun yagona SI-platforma · 16 ta bo‘lim",
    welcomeTitle: "Mantiqni tushunish, tuzoqni topish va",
    welcomeHighlight: "davlat grantini yutish",
    welcomeDesc:
      "Aniq AI aniq matematik diagnostika platformasi: qoralama rentgeni, 1 152 ta xato qadamni topish masalasi, sinov UBT, bilimlar grafi, Claude API tyutori va grant radari.",
    welcomeCtaRegister: "Akkaunt yaratish",
    welcomeCtaXray: "🔬 Qoralama rentgeni",
    welcomeCtaExam: "Sinov UBT",
    welcomeCtaGraph: "16 mavzu xaritasi",
    welcomeCtaLab: "Xatolar ustida ishlash",
    welcomeHide: "Vitrinani yopish",
    welcomeShow: "Aniq AI vitrinasi",
    bentoKicker: "ANIQ AI OLTI MODULI",
    bentoTitle: "Imtihonda yuqori ball va matematikani tushunish uchun barchasi",
    topics: "16 ta kurs mavzusi",
    mobileTopicLabel: "Mavzu",
    lesson: "Tahlil",
    practice: "Mashq",
    ai: "SI-tyutor",
    rule: "§ Asosiy qoida (invariant)",
    exampleLabel: "Namuna tahlili",
    exampleSteps: "Qadam-baqadam yechim",
    note: "Har bir qadamni o‘z so‘zlaringiz bilan tushuntiring — tenglik yoki xossa nega saqlanib qoladi.",
    solveSelf: "Mustaqil yechish",
    askAboutRule: "Qoida bo‘yicha savol berish",
    taskProgress: "Masala",
    ofLabel: "/",
    extraTaskTab: "Yangi sonlar",
    checkOne: "Javobni tekshirish",
    chooseOptionPrompt: "Yechimni tekshirish uchun yuqoridagi javob variantlaridan birini tanlang.",
    selectedIndicator: "Tanlandi",
    correctTitle: "To‘g‘ri",
    wrongTitle: "Amal va ishoraga e’tibor bering",
    analyzeErrorBtn: "Qoidani ko‘rsatish",
    askAiWhyBtn: "SI-tyutor bilan tahlil (Claude)",
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
    aiTitle: "Sokratik SI-tyutor (Claude API)",
    aiSub:
      "Oddiy darslikdan farqli o‘laroq, Claude API sizning savolingiz yoki aniq xatongizni tahlil qiladi, qoidani sodda tilda tushuntiradi va tayyor javobni aytmasdan yo‘naltiruvchi savol beradi.",
    question: "Savolingiz yoki qiyinchilik tug‘dirgan qadam",
    placeholder: "Masalan: nega Viyet teoremasida ildizlar yig‘indisi qarama-qarshi ishora bilan olinadi?",
    quickLabel: "Ko‘p beriladigan savollar:",
    quickQuestions: [
      "Nega hadni tenglikning boshqa tomoniga o‘tkazganda ishora o‘zgaradi?",
      "Shu bo‘limdagi formulalarni adashtirmaslik uchun nimaga e’tibor berish kerak?",
      "Imtihonda bu mavzuda ko‘pincha qaysi qadamda ball yo‘qotiladi?"
    ],
    schoolPrivacyNote:
      "Maktab o‘quvchilari uchun anonim rejim: ro‘yxatdan o‘tish shart emas. Ism-sharif, telefon yoki maktab raqamini kiritmang.",
    consent: "Tahlil olish uchun faqat matematik o‘quv savolini yuborishga roziman (shaxsiy ma’lumotlarsiz).",
    ask: "SI-tyutor tahlilini olish",
    loading: "Javob tayyorlanmoqda…",
    pilot: "Generativ tahlil himoyalangan /api/explain server yo‘nalishi orqali (Claude API + zaxira konturi) bajariladi.",
    privacy: "Maxfiylik",
    rmTitle: "Imtihonga shaxsiy tayyorgarlik rejasi",
    rmSub: "16 ta mavzu tartibi sinov testi, xatolar ustida ishlash natijalari va maqsadli ball asosida tuziladi.",
    rmTarget: "Maqsadli ball (50 dan)",
    rmWeeks: "Imtihongacha haftalar soni",
    rmWeak: "Mustahkamlash kerak bo‘lgan mavzular (16 bo‘limdan)",
    rmConsolidation: "Mustahkamlangan (≥2 mustaqil masala)",
    rmConsolidationEmpty: "Hozircha mustahkamlangan mavzu yo‘q — «Xatolar ustida ishlash» bo‘limida yordamsiz 2 tadan masala yeching.",
    rmGoal: "SI-rejalashtiruvchi (Claude API) uchun maqsad va qiyinchilik",
    rmGoalPlaceholder: "Masalan: logarifm va hosilada xato qilaman, 6 haftada 42+ ball yig‘ishim kerak",
    rmPresets: [
      "6 haftada 45/50 ball: Viyet teoremasi, tengsizliklar va trigonometriyada ishora xatolari",
      "4 haftada 38/50 ball: hosila, integral va stereometriya"
    ],
    rmGenerate: "Claude API bilan reja tuzish",
    rmBaseTitle: "Tavsiya etilgan mavzular tartibi",
    rmPhase1: "1-bosqich (1–2 hafta): tayanch mavzular va bo‘shliqlarni yopish",
    rmPhase2: "2-bosqich (3+ hafta): mustahkamlash va ko‘nikmani tekshirish",
    rmClaudeTitle: "Haftalik shaxsiy o‘quv rejasi",
    rmMilestones: "Haftalik qadamlar",
    rmHabit: "Kunlik tayyorgarlik tartibi",
    badgeLive: "Claude API · Jonli tahlil",
    badgePreview: "Dars invarianti · Zaxira konturi"
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
const optionLetters = ["A", "B", "C", "D"];

export default function Study() {
  const { dark, toggleTheme } = useAniqTheme();
  const [lang, setLang] = useState<Language>("ru");
  const [topic, setTopic] = useState<TopicId>("linear");
  const [tab, setTab] = useState("lesson");
  const [showWelcome, setShowWelcome] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

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
  const [consent, setConsent] = useState(true);
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
        const storedProfile = loadUserProfile();
        if (storedProfile) {
          setUserProfile(storedProfile);
          setTargetScore(storedProfile.targetScore);
          setLang(storedProfile.preferredLanguage);
        }
      } catch {}

      try {
        const params = new URLSearchParams(window.location.search);
        const qLang = params.get("lang");
        if (qLang === "ru" || qLang === "kk" || qLang === "uz") {
          setLang(qLang);
        }
        const qTab = params.get("tab");
        if (
          qTab === "lesson" ||
          qTab === "practice" ||
          qTab === "xray" ||
          qTab === "exam" ||
          qTab === "graph" ||
          qTab === "ai" ||
          qTab === "roadmap"
        ) {
          setTab(qTab);
          if (qTab !== "lesson") setShowWelcome(false);
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
            input: "Введите учебный вопрос (от 3 символов) и оставьте отметку согласия."
          }
        : lang === "kk"
          ? {
              quota: "Сынақ лимиті аяқталды. Дайын сабақтарды жалғастырыңыз.",
              origin: "Сұраныс көзі қате.",
              input: "Оқу сұрағын енгізіп, келісім белгісін тексеріңіз."
            }
          : {
              quota: "Sinov limiti tugadi. Tayyor darslarni davom ettiring.",
              origin: "So‘rov manbasi noto‘g‘ri.",
              input: "O‘quv savolini kiriting va rozilik belgisini tekshiring."
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

  async function runExplainQuery(rawQuestion: string) {
    if (busy) return;
    if (!consent || rawQuestion.trim().length < 3) {
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
        body: JSON.stringify({
          topic,
          language: lang,
          question: rawQuestion.trim(),
          adult: true,
          consent: true
        })
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

  function askWithPrefill(prefilled: string) {
    setConsent(true);
    setQuestion(prefilled);
    setTab("ai");
    void runExplainQuery(prefilled);
  }

  async function askRoadmap() {
    if (rmBusy) return;
    if (!consent || goalNote.trim().length < 3) {
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
          adult: true,
          consent: true
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

  function handleUpdateUserStats(streak: number, disarmedTotal: number, targetUni?: UniversityId) {
    if (!userProfile) return;
    const updated: UserProfile = {
      ...userProfile,
      trapBlitzBestStreak: Math.max(userProfile.trapBlitzBestStreak, streak),
      disarmedTrapsCount: disarmedTotal,
      targetUniversity: targetUni ?? userProfile.targetUniversity
    };
    setUserProfile(updated);
    saveUserProfile(updated);
  }

  function jumpToSection(nextTab: string) {
    setTab(nextTab);
    setTimeout(() => {
      document.getElementById("workspace-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
  }

  const currentQuestionObj = lesson.questions[activeQ] ?? lesson.questions[0];
  const isCurrentChecked = Boolean(checkedMap[activeQ]);
  const selectedVal = answers[activeQ];
  const isCurrentCorrect = isCurrentChecked && selectedVal === String(currentQuestionObj.correct);
  const diagnosticMessage =
    isCurrentChecked && selectedVal !== undefined
      ? getOptionFeedback(topic, activeQ, Number(selectedVal), lang)
      : "";

  const targetUniShort =
    userProfile
      ? kzUniversities.find((u) => u.id === userProfile.targetUniversity)?.shortName ?? "KBTU"
      : null;

  return (
    <div className="textbook-shell">
      {/* 1. Header: Aniq AI Brand + Theme Toggle + Language Switcher + Auth Buttons + Primary Nav */}
      <header className="site-header">
        <div className="wrap header-inner">
          <div className="header-top-row">
            <a
              className="aniq-brand-logo"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setTab("lesson");
              }}
            >
              <span className="aniq-logo-badge" aria-hidden="true">
                A
              </span>
              <span className="aniq-logo-word">
                Aniq<span className="text-brand">AI</span>
              </span>
              <span className="brand-sub">ЕНТ · ҰБТ</span>
            </a>

            <div className="header-right">
              <button
                type="button"
                className="header-quiet-link"
                onClick={() => setShowWelcome((v) => !v)}
              >
                {showWelcome ? t.welcomeHide : t.welcomeShow}
              </button>
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
                  РУС
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

              <ThemeToggleButton dark={dark} onToggle={toggleTheme} />

              {userProfile ? (
                <div className="aniq-user-chip">
                  <button
                    type="button"
                    className="aniq-user-btn"
                    onClick={() => jumpToSection("xray")}
                    title={userProfile.identifier}
                  >
                    <User size={14} />
                    <span>{userProfile.name}</span>
                    {targetUniShort && <span className="aniq-user-uni">{targetUniShort}</span>}
                  </button>
                  <button
                    type="button"
                    className="aniq-logout-btn"
                    title={t.logoutBtn}
                    aria-label={t.logoutBtn}
                    onClick={() => {
                      clearUserProfile();
                      setUserProfile(null);
                    }}
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              ) : (
                <div className="aniq-auth-btns">
                  <a className="aniq-btn aniq-btn-ghost" href={`/login?lang=${lang}`}>
                    {t.loginBtn}
                  </a>
                  <a className="aniq-btn aniq-btn-primary" href={`/register?lang=${lang}`}>
                    {t.registerBtn}
                  </a>
                </div>
              )}
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
              className={`primary-nav-link xray-nav-highlight ${tab === "xray" ? "active" : ""}`}
              aria-current={tab === "xray" ? "page" : undefined}
              onClick={() => setTab("xray")}
            >
              {t.navXray}
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

      {/* 2. Floating Hero + 3D Fibonacci Sphere Canvas + 6-Card Bento Showcase (inspired by bilim-ai.kz) */}
      {showWelcome && (
        <section className="aniq-hero-showcase" aria-label={t.welcomeBadge}>
          <HeroCanvas />
          <div className="hero-glow" aria-hidden="true" />

          <div className="wrap aniq-hero-inner">
            <div className="aniq-hero-center">
              <div className="aniq-badge-pill">
                <span className="pulse-dot" />
                <span>{t.welcomeBadge}</span>
              </div>

              <h2 className="aniq-hero-h1">
                {t.welcomeTitle} <br />
                <span className="gradient-text">{t.welcomeHighlight}</span>
              </h2>

              <p className="aniq-hero-lead">{t.welcomeDesc}</p>

              <div className="aniq-hero-ctas">
                <button
                  type="button"
                  onClick={() => jumpToSection("xray")}
                  className="aniq-btn aniq-btn-primary aniq-btn-lg"
                >
                  {t.welcomeCtaXray}
                  <ArrowRight size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => jumpToSection("exam")}
                  className="aniq-btn aniq-btn-ghost aniq-btn-lg aniq-glass"
                >
                  {t.welcomeCtaExam}
                </button>
                {!userProfile && (
                  <a
                    href={`/register?lang=${lang}`}
                    className="aniq-btn aniq-btn-ghost aniq-btn-lg"
                  >
                    {t.welcomeCtaRegister}
                  </a>
                )}
              </div>

              {/* 4 Glass Stat Tiles */}
              <div className="aniq-stat-grid">
                <div className="aniq-stat-tile aniq-glass">
                  <div className="aniq-stat-num gradient-text">16 тем</div>
                  <div className="aniq-stat-lbl">по спецификации НЦТ</div>
                </div>
                <div className="aniq-stat-tile aniq-glass">
                  <div className="aniq-stat-num gradient-text">1 152</div>
                  <div className="aniq-stat-lbl">задачи-ловушки ЕНТ</div>
                </div>
                <div className="aniq-stat-tile aniq-glass">
                  <div className="aniq-stat-num gradient-text">3 языка</div>
                  <div className="aniq-stat-lbl">ҚАЗ · РУС · OʻZB</div>
                </div>
                <div className="aniq-stat-tile aniq-glass">
                  <div className="aniq-stat-num gradient-text">Claude AI</div>
                  <div className="aniq-stat-lbl">+ Радар гранта РК</div>
                </div>
              </div>
            </div>

            {/* 6-Card Bento Grid with Per-Tile RGB Glow */}
            <div className="aniq-bento-section">
              <div className="aniq-bento-head">
                <div className="aniq-bento-kicker">{t.bentoKicker}</div>
                <h3 className="aniq-bento-title">{t.bentoTitle}</h3>
              </div>

              <div className="aniq-bento-grid">
                <button
                  type="button"
                  onClick={() => jumpToSection("xray")}
                  className="bento-wrap text-left"
                  style={{ ["--tile-rgb" as string]: "216 90 48" }}
                >
                  <div className="bento-tile">
                    <span
                      className="bento-icon"
                      style={{
                        background: "linear-gradient(135deg, #d85a30, #8a2c14)",
                        boxShadow: "0 6px 16px -6px rgba(216, 90, 48, 0.55)"
                      }}
                    >
                      <Microscope size={22} />
                    </span>
                    <div className="bento-badge-tag">ИЗЮМИНКА СТАРТАПА</div>
                    <h4 className="bento-card-title">Рентген черновика & Блиц ловушек</h4>
                    <p className="bento-card-desc">
                      Построчный дебаггер решения и 60-сек поиск точки излома логики (ОДЗ, знак, модуль) без штрафа за усвоенные темы.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => jumpToSection("lesson")}
                  className="bento-wrap text-left"
                  style={{ ["--tile-rgb" as string]: "217 138 43" }}
                >
                  <div className="bento-tile">
                    <span
                      className="bento-icon"
                      style={{
                        background: "linear-gradient(135deg, #d98a2b, #7c4a0e)",
                        boxShadow: "0 6px 16px -6px rgba(217, 138, 43, 0.55)"
                      }}
                    >
                      <BookOpen size={22} />
                    </span>
                    <h4 className="bento-card-title">Интерактивный учебник (16 разделов)</h4>
                    <p className="bento-card-desc">
                      Главное правило-инвариант, крупная формула, разбор по шагам и перенос навыка на задачи с новыми числами.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => jumpToSection("exam")}
                  className="bento-wrap text-left"
                  style={{ ["--tile-rgb" as string]: "255 154 60" }}
                >
                  <div className="bento-tile">
                    <span
                      className="bento-icon"
                      style={{
                        background: "linear-gradient(135deg, #ff9a3c, #994d08)",
                        boxShadow: "0 6px 16px -6px rgba(255, 154, 60, 0.55)"
                      }}
                    >
                      <Target size={22} />
                    </span>
                    <h4 className="bento-card-title">Пробное ЕНТ (4 формата НЦТ РК)</h4>
                    <p className="bento-card-desc">
                      Одновыборные (1 б.), контекстные сюжеты, задания на соответствие A/B (2 б.) и множественный выбор из 6 (2 б.).
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => jumpToSection("graph")}
                  className="bento-wrap text-left"
                  style={{ ["--tile-rgb" as string]: "10 132 216" }}
                >
                  <div className="bento-tile">
                    <span
                      className="bento-icon"
                      style={{
                        background: "linear-gradient(135deg, #0a84d8, #083b66)",
                        boxShadow: "0 6px 16px -6px rgba(10, 132, 216, 0.55)"
                      }}
                    >
                      <BrainCircuit size={22} />
                    </span>
                    <h4 className="bento-card-title">Граф знаний «Второй мозг»</h4>
                    <p className="bento-card-desc">
                      Направленный граф зависимостей 16 тем: отделяет корневой пробел в базе от заблокированных сложных разделов.
                    </p>
                  </div>
                </button>

                <a
                  href={`/lab?lang=${lang}&topic=${topic}`}
                  className="bento-wrap text-left no-underline"
                  style={{ ["--tile-rgb" as string]: "21 163 127" }}
                >
                  <div className="bento-tile">
                    <span
                      className="bento-icon"
                      style={{
                        background: "linear-gradient(135deg, #15a37f, #094a3b)",
                        boxShadow: "0 6px 16px -6px rgba(21, 163, 127, 0.55)"
                      }}
                    >
                      <Compass size={22} />
                    </span>
                    <h4 className="bento-card-title">Лаборатория 1 152 ошибок & Claude</h4>
                    <p className="bento-card-desc">
                      Тренажёр поиска первого неверного шага и безопасный сократический ИИ-тьютор, который учит думать, а не списывать.
                    </p>
                  </div>
                </a>

                <div className="bento-cta-tile">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-90 mb-1">
                    <GraduationCap size={16} />
                    <span>Радар Гранта РК</span>
                  </div>
                  <h4 className="bento-cta-title">Готовы узнать свой шанс на грант?</h4>
                  <p className="bento-cta-desc">
                    Создайте паспорт абитуриента (КБТУ, МУИТ, AITU, SDU, Satbayev) и рассчитайте прибавку баллов за минуту.
                  </p>
                  <div className="flex gap-2 flex-wrap mt-auto">
                    <a className="aniq-btn aniq-btn-white" href={`/register?lang=${lang}`}>
                      {t.welcomeCtaRegister}
                    </a>
                    <button
                      type="button"
                      onClick={() => jumpToSection("xray")}
                      className="aniq-btn aniq-btn-outline-white"
                    >
                      Открыть Радар →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <main id="workspace-anchor" className="wrap main-container">
        {isStudySection ? (
          <>
            {/* Mobile Topic Selector (Single compact line above the study page) */}
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
              {/* 2. Topic List: Unboxed Textbook Table of Contents (All 16 UNT Sections) */}
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

              {/* 3. Single Main Study Surface (Strict Left-Aligned Header Composition) */}
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

                {/* Inside the lesson: 3 calm modes for the current topic */}
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
                            <span className="step-number">{String(i + 1).padStart(2, "0")} →</span>
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

                  {/* TAB 2: ПРАКТИКА (Step-by-step solving -> Contextual Feedback + 1-click Claude Tutor) */}
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
                          className="options-stack"
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
                                <RadioGroupItem
                                  value={String(j)}
                                  id={`q${activeQ}a${j}`}
                                  className="sr-only"
                                />
                                <span className="option-badge">{optionLetters[j] ?? j + 1}</span>
                                <span className="option-math-text">{option}</span>
                                <span className="option-status-indicator" aria-hidden="true">
                                  {isCurrentChecked
                                    ? isOptionCorrect
                                      ? "✓"
                                      : isSelected
                                        ? "✕"
                                        : ""
                                    : isSelected
                                      ? t.selectedIndicator
                                      : ""}
                                </span>
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

                        {/* Primary & Secondary Actions with clear visual separation */}
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
                              <button
                                type="button"
                                className="quiet-text-action"
                                onClick={() => {
                                  const chosenText =
                                    selectedVal !== undefined
                                      ? currentQuestionObj.options[Number(selectedVal)]
                                      : "";
                                  askWithPrefill(
                                    lang === "ru"
                                      ? `В задаче «${currentQuestionObj.text}» я выбрал ответ «${chosenText}». Объясни по шагам, почему этот переход ошибочен и как применить правило темы.`
                                      : lang === "kk"
                                        ? `«${currentQuestionObj.text}» есебінде мен «${chosenText}» жауабын таңдадым. Осы қадам неге қате екенін және ережені қалай қолдану керегін түсіндіріп берші.`
                                        : `«${currentQuestionObj.text}» masalasida men «${chosenText}» javobini tanladim. Nega bu qadam xato ekanini va qoidani qanday qo‘llashni tushuntirib bering.`
                                  );
                                }}
                              >
                                <Sparkles size={14} />
                                {t.askAiWhyBtn}
                              </button>
                            </>
                          )}
                        </div>

                        {solvedCount === 3 && (
                          <p className="notebook-margin-note">{t.allTasksSolved}</p>
                        )}
                      </div>
                    ) : (
                      /* Step 4 inside Practice: Dynamic Transfer Problem with new numbers */
                      <div className="practice-stage">
                        <div className="practice-transfer-head">
                          <span className="rule-label">{t.transferTitle}</span>
                          <span className="topic-index-label">#{practiceSeed + 1}/24</span>
                        </div>
                        <p className="lesson-intro">{t.transferSub}</p>

                        <div className="practice-math-stem">{formatLabTask(transferChallenge.transfer)}</div>

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
                            className={`feedback ${transferStatus === "right" ? "correct" : "wrong"}`}
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

                  {/* TAB 3: ИИ-ТЬЮТОР (CLAUDE API) */}
                  <TabsContent value="ai">
                    <div className="ai-stage">
                      <h2 className="steps-heading">{t.aiTitle}</h2>
                      <p className="lesson-intro">{t.aiSub}</p>

                      <div className="quick-prompts-block">
                        <span className="rule-label">{t.quickLabel}</span>
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
                          void runExplainQuery(question);
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
                        <div className="ai-meta-row">
                          <span className="small">{t.schoolPrivacyNote}</span>
                          <span className="small">{question.length}/600</span>
                        </div>

                        <label className="checkline" onClick={() => setError("")}>
                          <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} />
                          <span>
                            {t.consent}{" "}
                            <a href="/privacy" onClick={(e) => e.stopPropagation()}>
                              {t.privacy}
                            </a>
                          </span>
                        </label>

                        <div className="practice-actions">
                          <Button type="submit" disabled={busy}>
                            <Sparkles size={15} />
                            {busy ? t.loading : t.ask}
                          </Button>
                        </div>
                      </form>
                      <p className="small">{t.pilot}</p>
                      {error && (
                        <p role="alert" className="feedback wrong">
                          {error}
                        </p>
                      )}
                      {answer && (
                        <section aria-live="polite" className="response">
                          <span className="rule-label">
                            {answer.source === "claude" ? t.badgeLive : t.badgePreview}
                          </span>
                          <p className="response-explanation">{answer.explanation}</p>
                          <strong>
                            {lang === "ru"
                              ? "Проверь себя:"
                              : lang === "kk"
                                ? "Өзіңді тексер:"
                                : "O‘zingizni tekshiring:"}
                          </strong>
                          <p className="response-hint">{answer.hint}</p>
                        </section>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </article>
            </div>
          </>
        ) : tab === "xray" ? (
          <section className="surface section-surface" aria-label={t.navXray}>
            <XrayTrapView
              lang={lang}
              lastUntScaled50={untStorage.lastAttempt?.scaledScore50 ?? null}
              masteredTopicsCount={baseline.masteredTopics.length}
              weakTopics={weakTopics}
              userProfile={userProfile}
              onUpdateStats={handleUpdateUserStats}
              onSelectTopic={(tId) => openTopicLesson(tId)}
              onAskClaude={(tId, promptText) => {
                setTopic(tId);
                askWithPrefill(promptText);
              }}
            />
          </section>
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
              <div className="ai-meta-row">
                <span className="small">{t.schoolPrivacyNote}</span>
                <span className="small">{goalNote.length}/400</span>
              </div>

              <label className="checkline" onClick={() => setRmError("")}>
                <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} />
                <span>
                  {t.consent}{" "}
                  <a href="/privacy" onClick={(e) => e.stopPropagation()}>
                    {t.privacy}
                  </a>
                </span>
              </label>

              <div className="practice-actions">
                <Button type="submit" disabled={rmBusy}>
                  <Sparkles size={15} />
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
