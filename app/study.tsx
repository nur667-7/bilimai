"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  FlaskConical,
  GitBranch,
  LogOut,
  Microscope,
  RotateCcw,
  Sparkles,
  Target,
  User,
  X
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggleButton, useAniqTheme } from "@/components/hero-canvas";
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
  UNT_SUBJECTS,
  type UntSubjectId
} from "@/lib/unt-all-subjects";
import {
  buildBjorkInterleavedList
} from "@/lib/scientific-pedagogy";
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
    navXray: "Проверка решения",
    navGraph: "Карта тем",
    navExam: "Пробное ЕНТ",
    navPlan: "Мой план",
    navLab: "Тренировка ошибок",
    navWelcome: "Обзор",
    navAbout: "О проекте",
    profileBtn: "Профиль / сохранить",
    logoutBtn: "Выйти",
    topics: "16 разделов математики ЕНТ",
    mobileTopicLabel: "Тема",
    lesson: "Разбор",
    practice: "Практика",
    ai: "ИИ-тьютор",
    statusNotAssessed: "Статус темы: ещё не оценено · решите задачи в «Практике» или проверьте тему в «Тренировке ошибок»",
    statusAssessed: (solved: number, total: number, solo: number) =>
      `Освоение по решённым задачам: ${solved}/${total} в уроке · самостоятельно без подсказок: ${solo}`,
    rule: "§ Главное правило",
    exampleLabel: "Разбор типового задания ЕНТ",
    exampleSteps: "Пошаговый ход решения",
    note: "Проверьте себя: объясните своими словами, почему на каждом шаге сохраняется верное равенство или свойство.",
    solveSelf: "Перейти к практике",
    askAboutRule: "Задать вопрос по теме",
    taskProgress: "Задача",
    ofLabel: "из",
    extraTaskTab: "Задача с другими числами",
    checkOne: "Проверить ответ",
    chooseOptionPrompt: "Выберите один из вариантов ответа выше, чтобы проверить решение.",
    selectedIndicator: "Выбрано",
    correctTitle: "Верно",
    wrongTitle: "Обратите внимание на переход",
    analyzeErrorBtn: "Показать правило",
    askAiWhyBtn: "Разобрать с ИИ-тьютором",
    tryAgainBtn: "Попробовать ещё раз",
    nextTaskBtn: "Следующая задача",
    ruleBreakdownTitle: "Разбор по правилу темы:",
    openLabForTopic: "Потренировать поиск ошибки в этой теме",
    allTasksSolved: "Все 3 задачи решены верно. Закрепите правило на задаче с другими числами или переходите к следующей теме.",
    nextTopicBtn: "Следующая тема курса",
    transferTitle: "Задача с другими числами",
    transferSub: "Примените главное правило темы без готовых вариантов ответа (доступно 24 варианта чисел).",
    transferCheck: "Проверить ответ",
    transferNext: "Новые числа",
    transferRight: "Верно! Правило применено точно.",
    transferWrong: "Ответ пока не совпал. Сверьте вычисления с главным правилом темы.",
    transferInvalid: "Введите целое число, десятичную дробь или обыкновенную дробь вида 3/7.",
    aiTitle: "ИИ-тьютор по текущей теме",
    aiSub:
      "Опишите шаг решения или вопрос по теме. Тьютор разберёт ошибку и задаст проверочный вопрос без готового спойлера.",
    question: "Ваш вопрос или шаг, который вызвал трудность",
    quickLabel: "Примеры вопросов по этой теме:",
    schoolPrivacyNote:
      "Анонимный режим для школьников: регистрация не нужна. Не вводите ФИО, телефон или номер школы.",
    consent: "Я согласен отправить этот учебный вопрос по математике на сервер для получения разбора (без личных данных).",
    consentRequiredHint: "Отметьте согласие на отправку учебного вопроса и введите текст (от 3 символов).",
    ask: "Получить разбор",
    loading: "Формируем разбор…",
    pilot: "Если внешний ключ Claude API активен на сервере, ответ генерирует модель Claude; иначе срабатывает локальный разбор по правилу темы.",
    privacy: "Конфиденциальность",
    badgeLive: "Разбор ИИ-тьютора (Claude API)",
    badgePreview: "Локальный разбор по правилу темы (демо-режим)",
    rmTitle: "Мой план подготовки к ЕНТ",
    rmSub: "Выберите целевой балл и срок до экзамена — платформа выделит приоритетные темы на сегодня и на неделю.",
    rmNotAssessedBanner:
      "Диагностика ещё не пройдена: ниже показан демонстрационный пример маршрута. Пройдите Пробное ЕНТ или решите задачи в Тренировке ошибок, чтобы план перестроился по вашим реальным ответам.",
    rmAssessedBanner: (mastered: number) =>
      `План построен по вашим результатам: закреплено тем — ${mastered} из 16.`,
    rmStartDiagnosticBtn: "Пройти пробное ЕНТ →",
    rmTarget: "Целевой балл профильной математики (из 50)",
    rmWeeks: "Недель до экзамена",
    rmPaceLabel: (perWeek: number) => `Рекомендуемый темп: ~${perWeek} темы в неделю`,
    rmTodayTitle: "1. Что делать сегодня и на этой неделе",
    rmTodaySub: "Начните с базовых тем, от которых зависят более сложные разделы:",
    rmOpenLesson: "Открыть урок",
    rmOpenLab: "Найти ошибку",
    rmInterleavedLabel: "Чередование тем для закрепления (чтобы не путать формулы):",
    rmWeak: "2. Отметьте темы, которые вызывают трудности",
    rmHowDetailsSummary: "Как составлен этот план и как работают приоритеты",
    rmHowDetailsBody:
      "В первую очередь в план попадают базовые темы (например, линейные уравнения, неравенства и квадратные уравнения), без которых возникают ошибки в логарифмах, тригонометрии и производной. После 2 самостоятельных решений без подсказок тема считается закреплённой и переходит в режим периодического повторения.",
    rmHowDetailsLink: "Подробнее о методике и научных источниках (/about) →",
    rmAiDetailsSummary: "Уточнить план по своей цели через ИИ-планировщик",
    rmGoal: "Опишите вашу цель и главную трудность",
    rmGoalPlaceholder: "Например: путаю знаки в тригонометрии и формулы объёмов пирамиды, нужно набрать 42+ за 6 недель",
    rmPresets: [
      "Цель 45/50 за 6 недель: путаю знаки в квадратных уравнениях, неравенствах и тригонометрии",
      "Цель 38/50 за 4 недели: нужно подтянуть производную, первообразную и стереометрию"
    ],
    rmGenerate: "Составить персональный план",
    rmClaudeTitle: "Персональный план по неделям",
    rmMilestones: "Шаги по неделям",
    rmHabit: "Режим занятий"
  },
  kk: {
    navStudy: "Сабақ",
    navXray: "Шешімді тексеру",
    navGraph: "Тақырыптар картасы",
    navExam: "Байқау ҰБТ",
    navPlan: "Менің жоспарым",
    navLab: "Қатемен жұмыс",
    navWelcome: "Шолу",
    navAbout: "Жоба туралы",
    profileBtn: "Профиль / сақтау",
    logoutBtn: "Шығу",
    topics: "ҰБТ математикасының 16 бөлімі",
    mobileTopicLabel: "Тақырып",
    lesson: "Талдау",
    practice: "Жаттығу",
    ai: "ЖИ-тьютор",
    statusNotAssessed: "Тақырып мәртебесі: әлі бағаланбаған · «Жаттығу» немесе «Қатемен жұмыс» бөлімінде есеп шығарыңыз",
    statusAssessed: (solved: number, total: number, solo: number) =>
      `Шығарылған есептер бойынша: сабақта ${solved}/${total} · көмексіз өз бетінше: ${solo}`,
    rule: "§ Негізгі ереже",
    exampleLabel: "ҰБТ типтік есебін талдау",
    exampleSteps: "Қадамдық шешу жолы",
    note: "Өзіңізді тексеріңіз: әр қадамда теңдік немесе қасиет неліктен сақталатынын өз сөзіңізбен түсіндіріңіз.",
    solveSelf: "Жаттығуға өту",
    askAboutRule: "Тақырып бойынша сұрақ қою",
    taskProgress: "Есеп",
    ofLabel: "/",
    extraTaskTab: "Басқа сандармен есеп",
    checkOne: "Жауапты тексеру",
    chooseOptionPrompt: "Шешімді тексеру үшін жоғарыдағы жауап нұсқаларының бірін таңдаңыз.",
    selectedIndicator: "Таңдалды",
    correctTitle: "Дұрыс",
    wrongTitle: "Амал мен таңбаға назар аударыңыз",
    analyzeErrorBtn: "Ережені көрсету",
    askAiWhyBtn: "ЖИ-тьютормен талдау",
    tryAgainBtn: "Қайта көру",
    nextTaskBtn: "Келесі есеп",
    ruleBreakdownTitle: "Тақырып ережесі бойынша талдау:",
    openLabForTopic: "Осы тақырып бойынша қате табуды жаттықтыру",
    allTasksSolved: "Барлық 3 есеп дұрыс шешілді. Ережені басқа сандармен бекітіңіз немесе келесі тақырыпқа өтіңіз.",
    nextTopicBtn: "Келесі тақырып",
    transferTitle: "Басқа сандармен есеп",
    transferSub: "Тақырыптың негізгі ережесін дайын нұсқаларсыз қолданыңыз (24 нұсқа).",
    transferCheck: "Жауапты тексеру",
    transferNext: "Жаңа сандар",
    transferRight: "Дұрыс! Ереже дәл қолданылды.",
    transferWrong: "Жауап сәйкес келмеді. Есептеуді негізгі ережемен салыстырыңыз.",
    transferInvalid: "Бүтін сан, ондық бөлшек немесе 3/7 түріндегі бөлшек енгізіңіз.",
    aiTitle: "Тақырып бойынша ЖИ-тьютор",
    aiSub:
      "Қиындық тудырған қадамды немесе сұрақты жазыңыз. Тьютор қатені түсіндіріп, бағыттаушы сұрақ қояды.",
    question: "Сұрағыңыз немесе қиындық тудырған қадам",
    quickLabel: "Осы тақырып бойынша сұрақ үлгілері:",
    schoolPrivacyNote:
      "Оқушыларға арналған анонимді режим: тіркелу қажет емес. Аты-жөніңізді, телефон немесе мектеп нөмірін жазбаңыз.",
    consent: "Талдау алу үшін тек математикалық оқу сұрағын жіберуге келісемін (жеке деректерсіз).",
    consentRequiredHint: "Келісім белгісін қойып, оқу сұрағын енгізіңіз (кемінде 3 таңба).",
    ask: "Талдау алу",
    loading: "Талдау дайындалып жатыр…",
    pilot: "Серверде Claude API кілті қосылған болса, жауапты Claude моделі береді; әйтпесе тақырып ережесі бойынша жергілікті талдау көрсетіледі.",
    privacy: "Құпиялылық",
    badgeLive: "ЖИ-тьютор талдауы (Claude API)",
    badgePreview: "Тақырып ережесі бойынша жергілікті талдау (демо-режим)",
    rmTitle: "Менің ҰБТ-ға дайындық жоспарым",
    rmSub: "Мақсатты балл мен емтиханға дейінгі апта санын таңдаңыз — бүгінгі және осы аптадағы басым тақырыптарды көресіз.",
    rmNotAssessedBanner:
      "Диагностика әлі өтілмеген: төменде дайындық бағытының демонстрациялық үлгісі көрсетілген. Өз нәтижеңіз бойынша жоспар құру үшін Байқау ҰБТ тапсырыңыз.",
    rmAssessedBanner: (mastered: number) =>
      `Жоспар сіздің нәтижелеріңіз бойынша құрылды: бекітілген тақырыптар — 16-дан ${mastered}.`,
    rmStartDiagnosticBtn: "Байқау ҰБТ-ны бастау →",
    rmTarget: "Бейіндік математика бойынша мақсатты балл (50-ден)",
    rmWeeks: "Емтиханға дейінгі апта саны",
    rmPaceLabel: (perWeek: number) => `Ұсынылатын қарқын: аптасына ~${perWeek} тақырып`,
    rmTodayTitle: "1. Бүгін және осы аптада не істеу керек",
    rmTodaySub: "Күрделі тақырыптарға негіз болатын базалық бөлімдерден бастаңыз:",
    rmOpenLesson: "Сабақты ашу",
    rmOpenLab: "Қатені табу",
    rmInterleavedLabel: "Формулаларды шатастырмау үшін тақырыптарды кезектестіру:",
    rmWeak: "2. Қиындық тудыратын тақырыптарды белгілеңіз",
    rmHowDetailsSummary: "Бұл жоспар қалай құрылған",
    rmHowDetailsBody:
      "Алдымен логарифм, тригонометрия және туындыға негіз болатын базалық тақырыптар (сызықтық, квадрат теңдеулер, теңсіздіктер) ұсынылады. Көмексіз 2 есеп шығарғаннан кейін тақырып бекітілген болып есептеледі.",
    rmHowDetailsLink: "Әдістеме және ғылыми дереккөздер туралы (/about) →",
    rmAiDetailsSummary: "ЖИ-жоспарлаушы арқылы жеке мақсат бойынша жоспарды нақтылау",
    rmGoal: "Мақсатыңыз бен негізгі қиындықты сипаттаңыз",
    rmGoalPlaceholder: "Мысалы: тригонометрия мен пирамида көлемінде қателесемін, 6 аптада 42+ балл жинау керек",
    rmPresets: [
      "6 аптада 45/50 балл: квадрат теңдеулер, теңсіздіктер және тригонометрияда таңба қателері",
      "4 аптада 38/50 балл: туынды, интеграл және стереометрия"
    ],
    rmGenerate: "Жеке жоспар құру",
    rmClaudeTitle: "Апталық жеке жоспар",
    rmMilestones: "Апталық қадамдар",
    rmHabit: "Дайындық тәртібі"
  },
  uz: {
    navStudy: "Dars",
    navXray: "Yechimni tekshirish",
    navGraph: "Mavzular xaritasi",
    navExam: "Sinov UBT",
    navPlan: "Mening rejam",
    navLab: "Xatolar ustida ishlash",
    navWelcome: "Sharh",
    navAbout: "Loyiha haqida",
    profileBtn: "Profil / saqlash",
    logoutBtn: "Chiqish",
    topics: "16 ta matematika bo‘limi",
    mobileTopicLabel: "Mavzu",
    lesson: "Tahlil",
    practice: "Mashq",
    ai: "SI-tyutor",
    statusNotAssessed: "Mavzu holati: hali baholanmagan · «Mashq» yoki «Xatolar ustida ishlash» bo‘limida masala yeching",
    statusAssessed: (solved: number, total: number, solo: number) =>
      `Yechilgan masalalar bo‘yicha: darsda ${solved}/${total} · mustaqil yechilgan: ${solo}`,
    rule: "§ Asosiy qoida",
    exampleLabel: "Namuna tahlili",
    exampleSteps: "Qadam-baqadam yechim",
    note: "O‘zingizni tekshiring: har bir qadamda tenglik nima uchun saqlanishini o‘z so‘zlaringiz bilan tushuntiring.",
    solveSelf: "Mashqqa o‘tish",
    askAboutRule: "Mavzu bo‘yicha savol berish",
    taskProgress: "Masala",
    ofLabel: "/",
    extraTaskTab: "Boshqa sonlar bilan masala",
    checkOne: "Javobni tekshirish",
    chooseOptionPrompt: "Yechimni tekshirish uchun yuqoridagi javob variantlaridan birini tanlang.",
    selectedIndicator: "Tanlandi",
    correctTitle: "To‘g‘ri",
    wrongTitle: "Amal va ishoraga e’tibor bering",
    analyzeErrorBtn: "Qoidani ko‘rsatish",
    askAiWhyBtn: "SI-tyutor bilan tahlil",
    tryAgainBtn: "Qayta urinib ko‘rish",
    nextTaskBtn: "Keyingi masala",
    ruleBreakdownTitle: "Mavzu qoidasi bo‘yicha tahlil:",
    openLabForTopic: "Shu mavzuda xatoni topishni mashq qilish",
    allTasksSolved: "Barcha 3 ta masala to‘g‘ri yechildi. Qoidani boshqa sonlar bilan mustahkamlang yoki keyingi mavzuga o‘ting.",
    nextTopicBtn: "Keyingi mavzu",
    transferTitle: "Boshqa sonlar bilan masala",
    transferSub: "Mavzuning asosiy qoidasini tayyor variantlarsiz qo‘llang (24 xil variant).",
    transferCheck: "Javobni tekshirish",
    transferNext: "Yangi sonlar",
    transferRight: "To‘g‘ri! Qoida aniq qo‘llanildi.",
    transferWrong: "Javob mos kelmadi. Hisobni asosiy qoida bilan solishtiring.",
    transferInvalid: "Butun son, o‘nli kasr yoki 3/7 shaklidagi kasr kiriting.",
    aiTitle: "Mavzu bo‘yicha SI-tyutor",
    aiSub:
      "Qiyinchilik tug‘dirgan qadamni yoki savolni yozing. Tyutor xatoni tushuntiradi va yo‘naltiruvchi savol beradi.",
    question: "Savolingiz yoki qiyinchilik tug‘dirgan qadam",
    quickLabel: "Shu mavzu bo‘yicha savol namunalari:",
    schoolPrivacyNote:
      "Maktab o‘quvchilari uchun anonim rejim: ro‘yxatdan o‘tish shart emas. Ism-sharif, telefon yoki maktab raqamini kiritmang.",
    consent: "Tahlil olish uchun faqat matematik o‘quv savolini yuborishga roziman (shaxsiy ma’lumotlarsiz).",
    consentRequiredHint: "Rozilik belgisini qo‘ying va o‘quv savolini kiriting (kamida 3 ta belgi).",
    ask: "Tahlil olish",
    loading: "Javob tayyorlanmoqda…",
    pilot: "Serverda Claude API kaliti faol bo‘lsa, javobni Claude modeli yaratadi; aks holda mavzu qoidasi bo‘yicha mahalliy tahlil ko‘rsatiladi.",
    privacy: "Maxfiylik",
    badgeLive: "SI-tyutor tahlili (Claude API)",
    badgePreview: "Mavzu qoidasi bo‘yicha mahalliy tahlil (demo-rejim)",
    rmTitle: "Mening UBTga tayyorgarlik rejam",
    rmSub: "Maqsadli ball va imtihongacha qolgan haftalarni tanlang — bugungi va haftalik ustuvor mavzularni ko‘rasiz.",
    rmNotAssessedBanner:
      "Diagnostika hali o‘tilmagan: quyida namunaviy yo‘nalish ko‘rsatilgan. O‘z natijangiz bo‘yicha reja tuzish uchun Sinov UBT topshiring.",
    rmAssessedBanner: (mastered: number) =>
      `Reja natijalaringiz asosida tuzildi: mustahkamlangan mavzular — 16 tadan ${mastered}.`,
    rmStartDiagnosticBtn: "Sinov UBTni boshlash →",
    rmTarget: "Profil matematika bo‘yicha maqsadli ball (50 dan)",
    rmWeeks: "Imtihongacha haftalar soni",
    rmPaceLabel: (perWeek: number) => `Tavsiya etilgan sur’at: haftasiga ~${perWeek} mavzu`,
    rmTodayTitle: "1. Bugun va shu haftada nima qilish kerak",
    rmTodaySub: "Murakkab bo‘limlar uchun asos bo‘ladigan tayanch mavzulardan boshlang:",
    rmOpenLesson: "Darsni ochish",
    rmOpenLab: "Xatoni topish",
    rmInterleavedLabel: "Formulalarni adashtirmaslik uchun mavzularni navbat билан takrorlash:",
    rmWeak: "2. Qiyinchilik tug‘diradigan mavzularni belgilang",
    rmHowDetailsSummary: "Bu reja qanday tuzilgan",
    rmHowDetailsBody:
      "Avvalo logarifm, trigonometriya va hosila uchun asos bo‘ladigan tayanch mavzular (chiziqli, kvadrat tenglamalar, tengsizliklar) tavsiya etiladi. Yordamsiz 2 ta masala yechilgach, mavzu mustahkamlangan hisoblanadi.",
    rmHowDetailsLink: "Metodika va ilmiy manbalar haqida (/about) →",
    rmAiDetailsSummary: "SI-rejalashtiruvchi orqali maqsad bo‘yicha rejani aniqlashtirish",
    rmGoal: "Maqsadingiz va asosiy qiyinchilikni yozing",
    rmGoalPlaceholder: "Masalan: logarifm va hosilada xato qilaman, 6 haftada 42+ ball yig‘ishim kerak",
    rmPresets: [
      "6 haftada 45/50 ball: kvadrat tenglamalar, tengsizliklar va trigonometriyada ishora xatolari",
      "4 haftada 38/50 ball: hosila, integral va stereometriya"
    ],
    rmGenerate: "Shaxsiy reja tuzish",
    rmClaudeTitle: "Haftalik shaxsiy o‘quv rejasi",
    rmMilestones: "Haftalik qadamlar",
    rmHabit: "Tayyorgarlik tartibi"
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

export type WorkspaceTab = "lesson" | "practice" | "ai" | "xray" | "exam" | "graph" | "roadmap";

export interface StudyProps {
  initialLang?: Language;
  initialTab?: WorkspaceTab;
  initialTopic?: TopicId;
  initialSubjectId?: UntSubjectId;
  initialVariantNumber?: number;
}

export default function Study({
  initialLang = "ru",
  initialTab = "lesson",
  initialTopic = "linear",
  initialSubjectId = "math",
  initialVariantNumber = 1
}: StudyProps = {}) {
  const { dark, toggleTheme } = useAniqTheme();
  const [lang, setLang] = useState<Language>(initialLang);
  const [topic, setTopic] = useState<TopicId>(initialTopic);
  const [tab, setTab] = useState<string>(initialTab);
  const [examSubjectId, setExamSubjectId] = useState<UntSubjectId>(initialSubjectId);
  const [examVariantNumber, setExamVariantNumber] = useState<number>(initialVariantNumber);
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

  const isStudySection = tab === "lesson" || tab === "practice" || tab === "ai";

  // Topic-specific progress (honest: no fake 45% or 34% before solving tasks)
  const topicStatusInfo = useMemo(() => {
    const topicRecords = labProgress.records.filter((r) => r.topic === topic);
    const soloReviews = topicRecords.filter((r) => r.independent).length;
    const untRatio = untStorage.lastAttempt?.topicRatios?.[topic];
    const hasActivity = soloReviews > 0 || solvedCount > 0 || untRatio !== undefined;
    return { hasActivity, soloReviews };
  }, [labProgress.records, untStorage.lastAttempt, topic, solvedCount]);

  const isPlanAssessed =
    untStorage.lastAttempt !== null || labProgress.records.length > 0;

  // Dynamic topic-specific prompts for the AI tutor (never show Vieta's theorem inside Linear Equations)
  const topicAiPrompts = useMemo(() => {
    if (lang === "kk") {
      return {
        placeholder: `Мысалы: «${lesson.title}» тақырыбындағы «${lesson.example}» мысалының бірінші қадамы неге осылай орындалады?`,
        quick: [
          `«${lesson.title}» тақырыбындағы «${lesson.example}» үлгісінің әр қадамын түсіндіріп берші.`,
          `Осы тақырыпта («${lesson.title}») ҰБТ-да оқушылар көбіне қай жерде қателеседі?`,
          `Тақырыптың негізгі ережесін есеп шығарғанда қалай жылдам тексеруге болады?`
        ]
      };
    }
    if (lang === "uz") {
      return {
        placeholder: `Masalan: «${lesson.title}» mavzusidagi «${lesson.example}» misolining birinchi qadami nega shunday bajariladi?`,
        quick: [
          `«${lesson.title}» mavzusidagi «${lesson.example}» namunasining har bir qadamini tushuntirib bering.`,
          `Shu mavzuda («${lesson.title}») imtihonda ko‘pincha qaysi qadamda xato qilinadi?`,
          `Mavzuning asosiy qoidasini masalada qanday tez tekshirish mumkin?`
        ]
      };
    }
    return {
      placeholder: `Например: почему в теме «${lesson.title}» в примере «${lesson.example}» выполняется именно такой первый переход?`,
      quick: [
        `Разбери по шагам образец «${lesson.example}» из темы «${lesson.title}».`,
        `На каком шаге в теме «${lesson.title}» чаще всего теряют баллы на ЕНТ?`,
        `Как быстро проверить себя по главному правилу темы «${lesson.title}»?`
      ]
    };
  }, [lang, lesson.title, lesson.example]);

  const interleavedQueue = useMemo(() => {
    const items = baseline.priorityModules.map((m) => ({
      topic: m.topic,
      title: m.title,
      phase: m.phase,
      soloCount: m.soloCount
    }));
    return buildBjorkInterleavedList(items).slice(0, 6);
  }, [baseline.priorityModules]);

  function syncUrl(nextLang: Language, nextTab: string, nextTopic: TopicId) {
    if (typeof window === "undefined") return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", nextLang);
      if (nextTab && nextTab !== "lesson") {
        url.searchParams.set("tab", nextTab);
      } else {
        url.searchParams.delete("tab");
      }
      if (nextTopic && nextTopic !== "linear") {
        url.searchParams.set("topic", nextTopic);
      } else {
        url.searchParams.delete("topic");
      }
      window.history.replaceState({}, "", url.toString());
    } catch {}
  }

  useEffect(() => {
    current.current = { topic, language: lang };
  }, [topic, lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    queueMicrotask(() => {
      const params = new URLSearchParams(window.location.search);
      const hasUrlLang = params.has("lang");

      try {
        const storedProfile = loadUserProfile();
        if (storedProfile && storedProfile.name) {
          setUserProfile(storedProfile);
          setTargetScore(storedProfile.targetScore);
          if (!hasUrlLang) {
            setLang(storedProfile.preferredLanguage);
          }
        }
      } catch {}

      try {
        const qLang = params.get("lang");
        if (qLang === "ru" || qLang === "kk" || qLang === "uz") {
          setLang(qLang);
        }
        const qSubject = params.get("subject");
        if (qSubject && UNT_SUBJECTS.some((s) => s.id === qSubject)) {
          setExamSubjectId(qSubject as UntSubjectId);
        }
        const qVariant = Number(params.get("variant"));
        if (Number.isInteger(qVariant) && qVariant >= 1 && qVariant <= 10) {
          setExamVariantNumber(qVariant);
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
            input: t.consentRequiredHint
          }
        : lang === "kk"
          ? {
              quota: "Сынақ лимиті аяқталды. Дайын сабақтарды жалғастырыңыз.",
              origin: "Сұраныс көзі қате.",
              input: t.consentRequiredHint
            }
          : {
              quota: "Sinov limiti tugadi. Tayyor darslarni davom ettiring.",
              origin: "So‘rov manbasi noto‘g‘ri.",
              input: t.consentRequiredHint
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
    const nextTab = isStudySection ? tab : "lesson";
    if (!isStudySection) setTab("lesson");
    syncUrl(lang, nextTab, id);
  }

  function openTopicLesson(id: TopicId) {
    reset();
    setTopic(id);
    setTab("lesson");
    syncUrl(lang, "lesson", id);
  }

  function handleTabChange(nextTab: string) {
    setTab(nextTab);
    syncUrl(lang, nextTab, topic);
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
    syncUrl(value, tab, topic);
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

  async function runExplainQuery(rawQuestion: string, overrideConsent?: boolean) {
    if (busy) return;
    const isConsented = overrideConsent ?? consent;
    if (!isConsented || rawQuestion.trim().length < 3) {
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
    handleTabChange("ai");
    void runExplainQuery(prefilled, true);
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

  const currentQuestionObj = lesson.questions[activeQ] ?? lesson.questions[0];
  const isCurrentChecked = Boolean(checkedMap[activeQ]);
  const selectedVal = answers[activeQ];
  const isCurrentCorrect = isCurrentChecked && selectedVal === String(currentQuestionObj.correct);
  const diagnosticMessage =
    isCurrentChecked && selectedVal !== undefined
      ? getOptionFeedback(topic, activeQ, Number(selectedVal), lang)
      : "";

  const targetUniShort =
    userProfile && userProfile.name
      ? kzUniversities.find((u) => u.id === userProfile.targetUniversity)?.shortName ?? "KBTU"
      : null;

  return (
    <div className="textbook-shell">
      {/* Header: BilimAI Brand + Language Switcher + Theme Toggle + Calm Profile Link + Unified Nav */}
      <header className="site-header">
        <div className="wrap header-inner">
          <div className="header-top-row">
            <a
              className="aniq-brand-logo"
              href={`/?lang=${lang}`}
              onClick={(e) => {
                e.preventDefault();
                handleTabChange("lesson");
              }}
            >
              <span className="aniq-logo-badge" aria-hidden="true">
                B
              </span>
              <span className="aniq-logo-word">
                Bilim<span className="text-brand">AI</span>
              </span>
              <span className="brand-sub">ЕНТ · ҰБТ</span>
            </a>

            <div className="header-right">
              <a className="header-quiet-link" href={`/welcome?lang=${lang}`}>
                {t.navWelcome}
              </a>
              <a className="header-quiet-link" href={`/about?lang=${lang}`}>
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

              {userProfile && userProfile.name ? (
                <div className="aniq-user-chip">
                  <button
                    type="button"
                    className="aniq-user-btn"
                    onClick={() => handleTabChange("xray")}
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
                <a className="header-quiet-link" href={`/login?lang=${lang}`}>
                  {t.profileBtn}
                </a>
              )}
            </div>
          </div>

          <nav className="primary-nav" aria-label="Основные разделы">
            <button
              type="button"
              className={`primary-nav-link ${isStudySection ? "active" : ""}`}
              aria-current={isStudySection ? "page" : undefined}
              onClick={() => handleTabChange("lesson")}
            >
              <BookOpen size={14} />
              <span>{t.navStudy}</span>
            </button>
            <button
              type="button"
              className={`primary-nav-link ${tab === "xray" ? "active" : ""}`}
              aria-current={tab === "xray" ? "page" : undefined}
              onClick={() => handleTabChange("xray")}
            >
              <Microscope size={14} />
              <span>{t.navXray}</span>
            </button>
            <button
              type="button"
              className={`primary-nav-link ${tab === "graph" ? "active" : ""}`}
              aria-current={tab === "graph" ? "page" : undefined}
              onClick={() => handleTabChange("graph")}
            >
              <GitBranch size={14} />
              <span>{t.navGraph}</span>
            </button>
            <button
              type="button"
              className={`primary-nav-link ${tab === "exam" ? "active" : ""}`}
              aria-current={tab === "exam" ? "page" : undefined}
              onClick={() => handleTabChange("exam")}
            >
              <Target size={14} />
              <span>{t.navExam}</span>
            </button>
            <button
              type="button"
              className={`primary-nav-link ${tab === "roadmap" ? "active" : ""}`}
              aria-current={tab === "roadmap" ? "page" : undefined}
              onClick={() => handleTabChange("roadmap")}
            >
              <Calendar size={14} />
              <span>{t.navPlan}</span>
            </button>
            <a className="primary-nav-link" href={`/lab?lang=${lang}&topic=${topic}`}>
              <FlaskConical size={14} />
              <span>{t.navLab}</span>
            </a>
          </nav>
        </div>
      </header>

      <main id="workspace-anchor" className="wrap main-container">
        {isStudySection ? (
          <>
            {/* Mobile Topic Selector */}
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
              {/* Topic List: Unboxed Textbook Table of Contents (All 16 UNT Sections) */}
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

              {/* Single Main Study Surface (Strict Left-Aligned Header Composition) */}
              <article className="surface" aria-label={lesson.title}>
                <header className="lesson-head">
                  <div className="lesson-meta-line">
                    <span className="topic-index-label">
                      {String(topicIndex + 1).padStart(2, "0")} · {lesson.section}
                    </span>
                    <span className="lesson-honest-status">
                      {topicStatusInfo.hasActivity
                        ? t.statusAssessed(solvedCount, lesson.questions.length, topicStatusInfo.soloReviews)
                        : t.statusNotAssessed}
                    </span>
                  </div>
                  <h1 className="lesson-title">{lesson.title}</h1>
                  <p className="lesson-intro">{lesson.intro}</p>
                </header>

                {/* Inside the lesson: 3 calm modes for the current topic */}
                <Tabs value={tab} onValueChange={handleTabChange}>
                  <TabsList className="tabsbar">
                    <TabsTrigger value="lesson">{t.lesson}</TabsTrigger>
                    <TabsTrigger value="practice">{t.practice}</TabsTrigger>
                    <TabsTrigger value="ai">{t.ai}</TabsTrigger>
                  </TabsList>

                  {/* TAB 1: РАЗБОР */}
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
                            <span className="step-number">{String(i + 1).padStart(2, "0")}</span>
                            <span className="step-text">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <p className="notebook-margin-note">{t.note}</p>

                    <div className="lesson-footer-action">
                      <Button
                        onClick={() => {
                          handleTabChange("practice");
                          setActiveQ(0);
                        }}
                      >
                        {t.solveSelf}
                        <ArrowRight size={16} />
                      </Button>
                      <button
                        type="button"
                        className="quiet-text-action"
                        onClick={() => handleTabChange("ai")}
                      >
                        {t.askAboutRule}
                      </button>
                    </div>
                  </TabsContent>

                  {/* TAB 2: ПРАКТИКА */}
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
                                  {isCurrentChecked ? (
                                    isOptionCorrect ? (
                                      <Check size={14} />
                                    ) : isSelected ? (
                                      <X size={14} />
                                    ) : null
                                  ) : isSelected ? (
                                    t.selectedIndicator
                                  ) : null}
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
                                <a className="quiet-inline-link inline-flex items-center gap-1" href={`/lab?lang=${lang}&topic=${topic}`}>
                                  <span>{t.openLabForTopic}</span>
                                  <ArrowRight size={13} />
                                </a>
                              </div>
                            )}
                          </div>
                        )}

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
                                className="quiet-text-action inline-flex items-center gap-1"
                                onClick={() => selectTopic(nextTopicId)}
                              >
                                <span>{t.nextTopicBtn}</span>
                                <ArrowRight size={14} />
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

                  {/* TAB 3: ИИ-ТЬЮТОР */}
                  <TabsContent value="ai">
                    <div className="ai-stage">
                      <h2 className="steps-heading">{t.aiTitle}</h2>
                      <p className="lesson-intro">{t.aiSub}</p>

                      <div className="quick-prompts-block">
                        <span className="rule-label">{t.quickLabel}</span>
                        <div className="quick-prompts">
                          {topicAiPrompts.quick.map((qq) => (
                            <button
                              key={qq}
                              type="button"
                              className="quick-pill"
                              onClick={() => {
                                setQuestion(qq);
                                setConsent(true);
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
                          placeholder={topicAiPrompts.placeholder}
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
                            <a href={`/privacy?lang=${lang}`} onClick={(e) => e.stopPropagation()}>
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
              initialSubjectId={examSubjectId}
              initialVariantNumber={examVariantNumber}
              onCompleteExam={handleCompleteUntExam}
              onOpenGraph={(focusTopic) => {
                if (focusTopic) setTopic(focusTopic);
                handleTabChange("graph");
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
              onOpenExam={() => handleTabChange("exam")}
              onToggleWeakTopic={toggleWeakTopic}
            />
          </section>
        ) : (
          /* TAB: МОЙ ПЛАН (Clean 3-block structure: 1. Goal & Level -> 2. Today/Week Actions -> 3. How it works / Optional AI) */
          <section className="surface section-surface" aria-label={t.navPlan}>
            <header className="lesson-head">
              <h1 className="lesson-title">{t.rmTitle}</h1>
              <p className="lesson-intro">{t.rmSub}</p>
            </header>

            {/* Block 1: Honest Assessment Status + Goal & Weeks Settings */}
            <div className="plan-summary-card mb-6">
              <div className="plan-status-banner">
                <p className="small m-0">
                  {isPlanAssessed
                    ? t.rmAssessedBanner(baseline.masteredTopics.length)
                    : t.rmNotAssessedBanner}
                </p>
                {!isPlanAssessed && (
                  <button
                    type="button"
                    className="quiet-inline-link"
                    onClick={() => handleTabChange("exam")}
                  >
                    {t.rmStartDiagnosticBtn}
                  </button>
                )}
              </div>

              <div className="plan-controls-grid mt-4">
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
                <div className="flex flex-col justify-end pb-1">
                  <span className="small font-medium">{t.rmPaceLabel(baseline.topicsPerWeek)}</span>
                </div>
              </div>
            </div>

            {/* Block 2: Concrete Actions for Today and This Week */}
            <div className="plan-actions-section mb-6">
              <h2 className="steps-heading">{t.rmTodayTitle}</h2>
              <p className="small mb-3">{t.rmTodaySub}</p>

              <div className="plan-priority-list">
                {baseline.priorityModules
                  .filter((m) => m.phase === 1)
                  .slice(0, 4)
                  .map((m, idx) => (
                    <div key={m.topic} className="plan-priority-row">
                      <div className="plan-priority-info">
                        <span className="step-number">{String(idx + 1).padStart(2, "0")}</span>
                        <div>
                          <strong>{m.title}</strong>
                          <span className="small block">
                            {m.soloCount > 0 ? `${m.soloCount}/2` : "0/2"}
                          </span>
                        </div>
                      </div>
                      <div className="plan-priority-btns">
                        <Button size="sm" onClick={() => openTopicLesson(m.topic)}>
                          {t.rmOpenLesson}
                        </Button>
                        <a
                          href={`/lab?lang=${lang}&topic=${m.topic}`}
                          className="btn-ghost-sm"
                        >
                          {t.rmOpenLab}
                        </a>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-4">
                <span className="small font-medium block mb-1.5">{t.rmInterleavedLabel}</span>
                <div className="flex flex-wrap gap-1.5">
                  {interleavedQueue.map((item, idx) => (
                    <button
                      key={`${item.topic}-${idx}`}
                      type="button"
                      className="unt-combo-chip"
                      onClick={() => openTopicLesson(item.topic)}
                    >
                      <span>
                        {idx + 1}. {item.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Weak Topics Selector */}
            <div className="mb-6">
              <h2 className="steps-heading mb-2">{t.rmWeak}</h2>
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

            {/* Block 3A: Collapsible "How this plan works" */}
            <details className="plan-collapsible-details mb-4">
              <summary>{t.rmHowDetailsSummary}</summary>
              <div className="plan-collapsible-body">
                <p className="small mb-2">{t.rmHowDetailsBody}</p>
                <a href={`/about?lang=${lang}`} className="quiet-inline-link">
                  {t.rmHowDetailsLink}
                </a>
              </div>
            </details>

            {/* Block 3B: Collapsible AI Roadmap Customizer */}
            <details className="plan-collapsible-details" open={Boolean(aiRoadmap)}>
              <summary>{t.rmAiDetailsSummary}</summary>
              <div className="plan-collapsible-body">
                <form
                  className="ai-form"
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    void askRoadmap();
                  }}
                >
                  <div>
                    <div className="quick-prompts">
                      {t.rmPresets.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          className="quick-pill"
                          onClick={() => {
                            setGoalNote(preset);
                            setConsent(true);
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
                      <a href={`/privacy?lang=${lang}`} onClick={(e) => e.stopPropagation()}>
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
                    <h3 className="steps-heading mt-1 mb-2">{t.rmClaudeTitle}</h3>
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
              </div>
            </details>
          </section>
        )}
      </main>
      <SiteFooter lang={lang} topic={topic} onSelectTab={handleTabChange} />
    </div>
  );
}
