"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import {
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  BrainCircuit,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  FlaskConical,
  GitBranch,
  GraduationCap,
  Layers,
  LogOut,
  Microscope,
  RotateCcw,
  Shuffle,
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
  UNT_PROFILE_COMBINATIONS,
  UNT_SUBJECTS,
  type UntSubjectId
} from "@/lib/unt-all-subjects";
import {
  SCIENTIFIC_METHODS,
  buildBjorkInterleavedList,
  computeBloomMasteryGate,
  computeEbbinghausRetention,
  computeSwellerScaffoldingLevel,
  type ScientificMethodSpec
} from "@/lib/scientific-pedagogy";
import {
  clearUserProfile,
  kzUniversities,
  loadUserProfile,
  saveUserProfile,
  type UniversityId,
  type UserProfile
} from "@/lib/user-profile";
import { SubjectIcon, UntExamView } from "@/app/unt-exam-view";
import { KnowledgeGraphView } from "@/app/knowledge-graph-view";
import { XrayTrapView } from "@/app/xray-trap-view";

const copy = {
  ru: {
    navStudy: "Занятие",
    navXray: "Рентген & Грант РК",
    navGraph: "Карта тем",
    navExam: "Пробное ЕНТ · 12 предметов",
    navPlan: "Научный план",
    navLab: "Тренировка ошибок",
    navAbout: "О проекте",
    loginBtn: "Войти",
    registerBtn: "Начать",
    logoutBtn: "Выйти",
    welcomeBadge: "Единая ИИ-экосистема ЕНТ (ҰБТ) · 12 предметов НЦТ РК · 10 вариантов × 40 вопросов",
    welcomeTitle: "Понимать логику, находить ловушки и",
    welcomeHighlight: "брать государственный грант на ЕНТ",
    welcomeDesc:
      "Платформа точной когнитивной диагностики BilimAI: все 12 предметов ЕНТ (по 10 полных вариантов из 40 вопросов = 50 баллов), построчный Рентген черновика, 1 152 задачи на поиск излома логики, граф знаний и 6 доказательных научных методик обучения.",
    welcomeCtaRegister: "Создать паспорт абитуриента",
    welcomeCtaXray: "Рентген черновика",
    welcomeCtaExam: "Пробное ЕНТ (12 предметов)",
    welcomeCtaGraph: "Карта 16 тем",
    welcomeCtaLab: "Тренировка ошибок",
    welcomeHide: "Свернуть витрину",
    welcomeShow: "Витрина BilimAI",
    compactWelcomeLabel: "Быстрый старт ЕНТ (12 предметов × 10 вариантов по 40 вопр.):",
    allSubjectsTitle: "Все 12 официальных предметов ЕНТ (НЦТ РК) · 4 800 заданий",
    allSubjectsSub:
      "Выберите любой профильный или обязательный предмет ЕНТ: внутри каждого доступны 10 полных вариантов по 40 вопросов (50 баллов) всех 4 форматов НЦТ и полный справочник формул, дат и законов.",
    bentoKicker: "ШЕСТЬ МОДУЛЕЙ BILIMAI",
    bentoTitle: "Инженерная архитектура подготовки к ЕНТ без «AI-слопа»",
    scienceKicker: "ДОКАЗАТЕЛЬНАЯ КОГНИТИВНАЯ НАУКА В ЯДРЕ ПЛАТФОРМЫ",
    scienceTitle: "6 научных методик мировых учёных, встроенных в алгоритмы BilimAI",
    scienceSub:
      "Каждое действие на платформе опирается на математические модели когнитивной психологии и педагогических исследований Чикагского университета, ETH Zurich, Carnegie Mellon и UCLA.",
    topics: "16 разделов математики ЕНТ",
    mobileTopicLabel: "Тема",
    lesson: "Разбор",
    practice: "Практика",
    ai: "ИИ-тьютор",
    rule: "§ Главное правило (инвариант)",
    exampleLabel: "Разбор эталонного образца НЦТ",
    exampleSteps: "Пошаговый ход решения",
    note: "Метод самообъяснения (Chi & Feynman): проговорите каждый переход своими словами — почему равенство или свойство сохраняется на этом шаге.",
    solveSelf: "Решить самостоятельно",
    askAboutRule: "Задать вопрос по правилу",
    taskProgress: "Задача",
    ofLabel: "из",
    extraTaskTab: "Свои числа",
    checkOne: "Проверить ответ",
    chooseOptionPrompt: "Выберите один из вариантов ответа выше, чтобы проверить решение.",
    selectedIndicator: "Выбрано",
    correctTitle: "Верно",
    wrongTitle: "Обратите внимание на переход",
    analyzeErrorBtn: "Показать правило",
    askAiWhyBtn: "Разобрать с ИИ-тьютором (Claude)",
    tryAgainBtn: "Попробовать ещё раз",
    nextTaskBtn: "Следующая задача",
    ruleBreakdownTitle: "Разбор по правилу темы:",
    openLabForTopic: "Потренировать поиск ошибки в этой теме",
    allTasksSolved: "Все 3 задачи решены верно. Закрепите правило на задаче с новыми числами или переходите к следующей теме.",
    nextTopicBtn: "Следующая тема курса",
    transferTitle: "Задача с новыми числами",
    transferSub: "Примените главное правило темы без вариантов ответа (доступно 24 варианта чисел).",
    transferCheck: "Проверить ответ",
    transferNext: "Другие числа",
    transferRight: "Верно! Правило применено точно.",
    transferWrong: "Ответ пока не совпал. Сверьте вычисления с главным правилом темы.",
    transferInvalid: "Введите целое число, десятичную дробь или обыкновенную дробь вида 3/7.",
    aiTitle: "Сократический ИИ-тьютор (Claude API)",
    aiSub:
      "В отличие от обычного чат-бота, Claude API анализирует конкретную ошибку в вычислениях, объясняет правило простыми словами на выбранном языке и задаёт проверочный вопрос по методу Фейнмана без спойлера ответа.",
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
    rmTitle: "Научный план подготовки к ЕНТ (Bloom 2σ + Ebbinghaus SM-2 + Bjork Interleaving)",
    rmSub: "Очерёдность 16 тем строится по кривой забывания Эббингауза R(t) = exp(−t/S), порогу мастерства Блума (80%) и интерливингу Бьорка.",
    rmTarget: "Целевой балл ЕНТ (из 50)",
    rmWeeks: "Недель до экзамена",
    rmWeak: "Темы с потерей баллов (из 16 разделов ЕНТ)",
    rmConsolidation: "Закреплено по порогу Блума (≥2 самостоятельных решения)",
    rmConsolidationEmpty: "Пока нет закреплённых тем — решите по 2 задачи без подсказок в разделе «Тренировка ошибок».",
    rmGoal: "Цель и главная трудность для ИИ-планировщика (Claude API)",
    rmGoalPlaceholder: "Например: путаю знаки в тригонометрии и формулы объёмов пирамиды, нужно набрать 42+ за 6 недель",
    rmPresets: [
      "Цель 45/50 за 6 недель: путаю знаки в теореме Виета, неравенствах и тригонометрии",
      "Цель 38/50 за 4 недели: нужно подтянуть производную, первообразную и стереометрию"
    ],
    rmGenerate: "Составить план с Claude API",
    rmBaseTitle: "Рекомендуемая очерёдность тем (Матрица Блума + Эббингауза)",
    rmPhase1: "Этап 1 (недели 1–2): корневые пререквизиты и закрытие пробелов",
    rmPhase2: "Этап 2 (недели 3+): интерливинг Бьорка и перенос навыка",
    rmClaudeTitle: "Персональный план по неделям",
    rmMilestones: "Шаги по неделям",
    rmHabit: "Научный режим занятий",
    badgeLive: "Claude API · Живой разбор",
    badgePreview: "Инвариант урока · Резервный контур"
  },
  kk: {
    navStudy: "Сабақ",
    navXray: "Рентген & ҚР Гранты",
    navGraph: "Тақырыптар картасы",
    navExam: "Байқау ҰБТ · 12 пән",
    navPlan: "Ғылыми жоспар",
    navLab: "Қатемен жұмыс",
    navAbout: "Жоба туралы",
    loginBtn: "Кіру",
    registerBtn: "Бастау",
    logoutBtn: "Шығу",
    welcomeBadge: "Бірыңғай ҰБТ ЖИ-экожүйесі · ҚР ҰТО 12 пәні · 10 нұсқа × 40 сұрақ",
    welcomeTitle: "Логиканы түсіну, тұзақты табу және",
    welcomeHighlight: "ҰБТ мемлекеттік грантын жеңіп алу",
    welcomeDesc:
      "BilimAI дәл когнитивті диагностика платформасы: барлық 12 ҰБТ пәні (40 сұрақтан 10 толық нұсқа = 50 балл), шешім рентгені, 1 152 қате қадамды табу есебі, білім графы және 6 ғылыми оқыту әдістемесі.",
    welcomeCtaRegister: "Талапкер паспортын ашу",
    welcomeCtaXray: "Шешім рентгені",
    welcomeCtaExam: "Байқау ҰБТ (12 пән)",
    welcomeCtaGraph: "16 тақырып картасы",
    welcomeCtaLab: "Қатемен жұмыс",
    welcomeHide: "Витринаны жинау",
    welcomeShow: "BilimAI витринасы",
    compactWelcomeLabel: "ҰБТ жылдам бастау (12 пән × 40 сұрақтан 10 нұсқа):",
    allSubjectsTitle: "Барлық 12 ресми ҰБТ пәні (ҚР ҰТО) · 4 800 тапсырма",
    allSubjectsSub:
      "Кез келген бейіндік немесе міндетті пәнді таңдаңыз: әр пәнде 40 сұрақтан тұратын 10 толық нұсқа (50 балл) және формулалар, даталар мен заңдар анықтамалығы бар.",
    bentoKicker: "BILIMAI АЛТЫ МОДУЛІ",
    bentoTitle: "ҰБТ-ға дайындық пен математиканы түсінудің инженерлік жүйесі",
    scienceKicker: "ПЛАТФОРМА ЯДРОСЫНДАҒЫ ДӘЛЕЛДІ КОГНИТИВТІ ҒЫЛЫМ",
    scienceTitle: "BilimAI алгоритмдеріне енгізілген әлем ғалымдарының 6 ғылыми әдістемесі",
    scienceSub:
      "Платформадағы әрбір қадам Чикаго университеті, ETH Zurich, Carnegie Mellon және UCLA зерттеулерінің математикалық модельдеріне негізделген.",
    topics: "ҰБТ математикасының 16 бөлімі",
    mobileTopicLabel: "Тақырып",
    lesson: "Талдау",
    practice: "Жаттығу",
    ai: "ЖИ-тьютор",
    rule: "§ Негізгі ереже (инвариант)",
    exampleLabel: "ҰТО эталондық үлгісін талдау",
    exampleSteps: "Қадамдық шешу жолы",
    note: "Өзіндік түсіндіру әдісі (Chi & Feynman): әр қадамды өз сөзіңізбен түсіндіріп көріңіз — теңдік неліктен сақталады.",
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
      "Кәдімгі чат-боттан айырмашылығы — Claude API сіздің нақты қатеңізді талдап, ережені түсінікті тілде түсіндіреді және Фейнман әдісі бойынша бағыттаушы сұрақ қояды.",
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
    rmTitle: "ҰБТ-ға ғылыми дайындық жоспары (Bloom 2σ + Ebbinghaus SM-2 + Bjork Interleaving)",
    rmSub: "16 тақырыптың реті Эббингауз ұмыту қисығы R(t) = exp(−t/S), Блумның 80% шеберлік шегі және Бьорк интерливингі бойынша құрылады.",
    rmTarget: "Мақсатты ҰБТ балы (50-ден)",
    rmWeeks: "Емтиханға дейінгі апта саны",
    rmWeak: "Қайталауды қажет ететін тақырыптар (16 бөлімнен)",
    rmConsolidation: "Блум шегі бойынша бекітілді (≥2 өздік шешім)",
    rmConsolidationEmpty: "Әзірше бекітілген тақырып жоқ — «Қатемен жұмыс» бөлімінде көмексіз 2 есептен шығарыңыз.",
    rmGoal: "ЖИ-жоспарлаушыға (Claude API) арналған мақсат пен қиындық",
    rmGoalPlaceholder: "Мысалы: тригонометрия мен пирамида көлемінде қателесемін, 6 аптада 42+ балл жинау керек",
    rmPresets: [
      "6 аптада 45/50 балл: Виет теоремасы, теңсіздіктер және тригонометрияда таңба қателері",
      "4 аптада 38/50 балл: туынды, интеграл және стереометрия"
    ],
    rmGenerate: "Claude API арқылы жоспар құру",
    rmBaseTitle: "Ұсынылатын тақырыптар реті (Блум + Эббингауз матрицасы)",
    rmPhase1: "1-кезең (1–2 апта): базалық пререквизиттер және олқылықтарды жою",
    rmPhase2: "2-кезең (3+ апта): Бьорк интерливингі және дағдыны тексеру",
    rmClaudeTitle: "Апталық жеке жоспар",
    rmMilestones: "Апталық қадамдар",
    rmHabit: "Ғылыми дайындық тәртібі",
    badgeLive: "Claude API · Тікелей талдау",
    badgePreview: "Сабақ инварианты · Резервтік контур"
  },
  uz: {
    navStudy: "Dars",
    navXray: "Rentgen & Grant",
    navGraph: "Mavzular xaritasi",
    navExam: "Sinov UBT · 12 fan",
    navPlan: "Ilmiy reja",
    navLab: "Xatolar ustida ishlash",
    navAbout: "Loyiha haqida",
    loginBtn: "Kirish",
    registerBtn: "Boshlash",
    logoutBtn: "Chiqish",
    welcomeBadge: "Yagona UBT SI-ekotizimi · 12 ta fan · 10 variant × 40 savol",
    welcomeTitle: "Mantiqni tushunish, tuzoqni topish va",
    welcomeHighlight: "davlat grantini yutib olish",
    welcomeDesc:
      "BilimAI kognitiv diagnostika platformasi: barcha 12 ta UBT fani (40 savoldan 10 ta to‘liq variant = 50 ball), qoralama rentgeni, 1 152 ta xato qadamni topish masalasi, bilimlar grafi va 6 ta ilmiy o‘qitish metodikasi.",
    welcomeCtaRegister: "Abituriyent pasportini yaratish",
    welcomeCtaXray: "Qoralama rentgeni",
    welcomeCtaExam: "Sinov UBT (12 fan)",
    welcomeCtaGraph: "16 mavzu xaritasi",
    welcomeCtaLab: "Xatolar ustida ishlash",
    welcomeHide: "Vitrinani yopish",
    welcomeShow: "BilimAI vitrinasi",
    compactWelcomeLabel: "UBT tezkor start (12 fan × 40 savoldan 10 variant):",
    allSubjectsTitle: "Barcha 12 ta rasmiy UBT fani · 4 800 ta topshiriq",
    allSubjectsSub:
      "Istalgan profil yoki majburiy fanni tanlang: har bir fanda 40 savoldan iborat 10 ta to‘liq variant (50 ball) va formulalar, sanalar hamda qonunlar ma’lumotnomasi mavjud.",
    bentoKicker: "BILIMAI OLTI MODULI",
    bentoTitle: "Imtihonda yuqori ball va matematikani tushunish uchun muhandislik tizimi",
    scienceKicker: "PLATFORMA YADROSIDAGI ISBOTLANGAN KOGNITIV ILM-FAN",
    scienceTitle: "BilimAI algoritmlariga kiritilgan jahon olimlarining 6 ta ilmiy metodikasi",
    scienceSub:
      "Platformadagi har bir qadam Chikago universiteti, ETH Zurich, Carnegie Mellon va UCLA tadqiqotlarining matematik modellariga asoslangan.",
    topics: "16 ta matematika bo‘limi",
    mobileTopicLabel: "Mavzu",
    lesson: "Tahlil",
    practice: "Mashq",
    ai: "SI-tyutor",
    rule: "§ Asosiy qoida (invariant)",
    exampleLabel: "Namuna tahlili",
    exampleSteps: "Qadam-baqadam yechim",
    note: "O‘z-o‘ziga tushuntirish usuli (Chi & Feynman): har bir qadamni o‘z so‘zlaringiz bilan tushuntiring.",
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
      "Oddiy chat-botdan farqli o‘laroq, Claude API sizning aniq xatongizni tahlil qiladi, qoidani sodda tilda tushuntiradi va Feynman usulida yo‘naltiruvchi savol beradi.",
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
    rmTitle: "Imtihonga ilmiy tayyorgarlik rejasi (Bloom 2σ + Ebbinghaus SM-2 + Bjork Interleaving)",
    rmSub: "16 ta mavzu tartibi Ebbingauz unutish egri chizig‘i R(t) = exp(−t/S), Blumning 80% mahorat chegarasi va Byork interlivingi asosida tuziladi.",
    rmTarget: "Maqsadli ball (50 dan)",
    rmWeeks: "Imtihongacha haftalar soni",
    rmWeak: "Mustahkamlash kerak bo‘lgan mavzular (16 bo‘limdan)",
    rmConsolidation: "Blum chegarasi bo‘yicha mustahkamlangan (≥2 mustaqil masala)",
    rmConsolidationEmpty: "Hozircha mustahkamlangan mavzu yo‘q — «Xatolar ustida ishlash» bo‘limida yordamsiz 2 tadan masala yeching.",
    rmGoal: "SI-rejalashtiruvchi (Claude API) uchun maqsad va qiyinchilik",
    rmGoalPlaceholder: "Masalan: logarifm va hosilada xato qilaman, 6 haftada 42+ ball yig‘ishim kerak",
    rmPresets: [
      "6 haftada 45/50 ball: Viyet teoremasi, tengsizliklar va trigonometriyada ishora xatolari",
      "4 haftada 38/50 ball: hosila, integral va stereometriya"
    ],
    rmGenerate: "Claude API bilan reja tuzish",
    rmBaseTitle: "Tavsiya etilgan mavzular tartibi (Blum + Ebbingauz matritsasi)",
    rmPhase1: "1-bosqich (1–2 hafta): tayanch prerevizitlar va bo‘shliqlarni yopish",
    rmPhase2: "2-bosqich (3+ hafta): Byork interlivingi va ko‘nikmani tekshirish",
    rmClaudeTitle: "Haftalik shaxsiy o‘quv rejasi",
    rmMilestones: "Haftalik qadamlar",
    rmHabit: "Ilmiy tayyorgarlik tartibi",
    badgeLive: "Claude API · Jonli tahlil",
    badgePreview: "Dars invarianti · Zaxira konturi"
  }
};

function ScienceMethodIcon({ icon, size = 18 }: { icon: ScientificMethodSpec["icon"]; size?: number }) {
  switch (icon) {
    case "GitBranch":
      return <GitBranch size={size} aria-hidden="true" />;
    case "Clock":
      return <Clock size={size} aria-hidden="true" />;
    case "Microscope":
      return <Microscope size={size} aria-hidden="true" />;
    case "Shuffle":
      return <Shuffle size={size} aria-hidden="true" />;
    case "Layers":
      return <Layers size={size} aria-hidden="true" />;
    case "Sparkles":
      return <Sparkles size={size} aria-hidden="true" />;
  }
}

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

export interface StudyProps {
  initialWelcomeOpen?: boolean;
}

export default function Study({ initialWelcomeOpen = false }: StudyProps = {}) {
  const { dark, toggleTheme } = useAniqTheme();
  const [lang, setLang] = useState<Language>("ru");
  const [topic, setTopic] = useState<TopicId>("linear");
  const [tab, setTab] = useState("lesson");
  const [showWelcome, setShowWelcome] = useState(initialWelcomeOpen);
  const [examSubjectId, setExamSubjectId] = useState<UntSubjectId>("math");
  const [examVariantNumber, setExamVariantNumber] = useState<number>(1);
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

  // Scientific Learning Telemetry for the active topic (Bloom + Ebbinghaus + Sweller + Bjork)
  const topicScientificTelemetry = useMemo(() => {
    const topicRecords = labProgress.records.filter((r) => r.topic === topic);
    const soloReviews = topicRecords.filter((r) => r.independent).length;
    const untRatio = untStorage.lastAttempt?.topicRatios?.[topic];
    const masteryPercent = Math.min(
      100,
      Math.round(
        (untRatio !== undefined ? untRatio * 60 : 45) +
          Math.min(40, soloReviews * 20) +
          (solvedCount * 5)
      )
    );
    const ebbinghaus = computeEbbinghausRetention(
      soloReviews > 0 ? 1 : 2,
      soloReviews + (solvedCount === 3 ? 1 : 0),
      masteryPercent >= 80 ? 5 : 4
    );
    const bloomGate = computeBloomMasteryGate([masteryPercent]);
    const sweller = computeSwellerScaffoldingLevel(masteryPercent, lang);
    return { masteryPercent, ebbinghaus, bloomGate, sweller, soloReviews };
  }, [labProgress.records, untStorage.lastAttempt, topic, solvedCount, lang]);

  const interleavedQueue = useMemo(() => {
    const items = baseline.priorityModules.map((m) => ({
      topic: m.topic,
      title: m.title,
      phase: m.phase,
      soloCount: m.soloCount
    }));
    return buildBjorkInterleavedList(items).slice(0, 8);
  }, [baseline.priorityModules]);

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
        const qWelcome = params.get("welcome");
        if (qWelcome === "1" || qWelcome === "true") {
          setShowWelcome(true);
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
          if (qWelcome !== "1") setShowWelcome(false);
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
    setShowWelcome(false);
  }

  function launchSubjectExam(subjId: UntSubjectId, variantNum: number = 1) {
    setExamSubjectId(subjId);
    setExamVariantNumber(variantNum);
    setTab("exam");
    setShowWelcome(false);
    setTimeout(() => {
      document.getElementById("workspace-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
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
    setShowWelcome(false);
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
    setShowWelcome(false);
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
      {/* 1. Header: BilimAI Brand + Theme Toggle + Language Switcher + Auth Buttons + Primary Nav */}
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
                B
              </span>
              <span className="aniq-logo-word">
                Bilim<span className="text-brand">AI</span>
              </span>
              <span className="brand-sub">ЕНТ · ҰБТ · 12 пән</span>
            </a>

            <div className="header-right">
              <button
                type="button"
                className="header-quiet-link inline-flex items-center gap-1"
                onClick={() => setShowWelcome((v) => !v)}
              >
                {showWelcome ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                <span>{showWelcome ? t.welcomeHide : t.welcomeShow}</span>
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
              onClick={() => {
                setTab("lesson");
                setShowWelcome(false);
              }}
            >
              <BookOpen size={14} />
              <span>{t.navStudy}</span>
            </button>
            <button
              type="button"
              className={`primary-nav-link xray-nav-highlight ${tab === "xray" ? "active" : ""}`}
              aria-current={tab === "xray" ? "page" : undefined}
              onClick={() => {
                setTab("xray");
                setShowWelcome(false);
              }}
            >
              <Microscope size={14} />
              <span>{t.navXray}</span>
            </button>
            <button
              type="button"
              className={`primary-nav-link ${tab === "graph" ? "active" : ""}`}
              aria-current={tab === "graph" ? "page" : undefined}
              onClick={() => {
                setTab("graph");
                setShowWelcome(false);
              }}
            >
              <GitBranch size={14} />
              <span>{t.navGraph}</span>
            </button>
            <button
              type="button"
              className={`primary-nav-link ${tab === "exam" ? "active" : ""}`}
              aria-current={tab === "exam" ? "page" : undefined}
              onClick={() => {
                setTab("exam");
                setShowWelcome(false);
              }}
            >
              <Target size={14} />
              <span>{t.navExam}</span>
            </button>
            <button
              type="button"
              className={`primary-nav-link ${tab === "roadmap" ? "active" : ""}`}
              aria-current={tab === "roadmap" ? "page" : undefined}
              onClick={() => {
                setTab("roadmap");
                setShowWelcome(false);
              }}
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

      {/* 2A. Compact 1-Line Welcome & All-12-Subjects Command Bar when inside Workspace */}
      {!showWelcome && (
        <div className="wrap">
          <div className="aniq-compact-welcome-bar">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="aniq-compact-label">
                <Award size={14} className="text-amber-600 shrink-0" />
                <span>{t.compactWelcomeLabel}</span>
              </span>
              {UNT_SUBJECTS.slice(0, 6).map((subj) => (
                <button
                  key={subj.id}
                  type="button"
                  className={`aniq-compact-subj-pill ${tab === "exam" && examSubjectId === subj.id ? "active" : ""}`}
                  onClick={() => launchSubjectExam(subj.id, 1)}
                >
                  <SubjectIcon subjectId={subj.id} size={13} />
                  <span>{subj.shortTitle[lang]}</span>
                </button>
              ))}
              <button
                type="button"
                className="aniq-compact-subj-pill highlight"
                onClick={() => setShowWelcome(true)}
              >
                <Sparkles size={13} />
                <span>{t.welcomeShow} (12 предметов + 6 методик)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2B. Full Floating Welcome Page Showcase (3D Fibonacci Sphere + 12 UNT Subjects + Bento + 6 Scientific Methods) */}
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
                  <Microscope size={18} />
                  <span>{t.welcomeCtaXray}</span>
                  <ArrowRight size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => jumpToSection("exam")}
                  className="aniq-btn aniq-btn-ghost aniq-btn-lg aniq-glass"
                >
                  <Target size={18} />
                  <span>{t.welcomeCtaExam}</span>
                </button>
                {!userProfile && (
                  <a
                    href={`/register?lang=${lang}`}
                    className="aniq-btn aniq-btn-ghost aniq-btn-lg"
                  >
                    <GraduationCap size={18} />
                    <span>{t.welcomeCtaRegister}</span>
                  </a>
                )}
              </div>

              {/* 4 Glass Stat Tiles */}
              <div className="aniq-stat-grid">
                <div className="aniq-stat-tile aniq-glass">
                  <div className="aniq-stat-num gradient-text">12 предметов</div>
                  <div className="aniq-stat-lbl">по спецификации НЦТ РК</div>
                </div>
                <div className="aniq-stat-tile aniq-glass">
                  <div className="aniq-stat-num gradient-text">4 800</div>
                  <div className="aniq-stat-lbl">заданий в 120 вариантах ЕНТ</div>
                </div>
                <div className="aniq-stat-tile aniq-glass">
                  <div className="aniq-stat-num gradient-text">6 методик</div>
                  <div className="aniq-stat-lbl">Bloom 2σ · SM-2 · Kapur · Bjork</div>
                </div>
                <div className="aniq-stat-tile aniq-glass">
                  <div className="aniq-stat-num gradient-text">Claude AI</div>
                  <div className="aniq-stat-lbl">+ Радар гранта ВУЗов РК</div>
                </div>
              </div>
            </div>

            {/* Interactive 12 UNT Subjects & Profile Combination Hub */}
            <div className="aniq-subjects-showcase mt-8">
              <div className="aniq-bento-head">
                <div className="aniq-bento-kicker">ПОЛНЫЙ ОХВАТ НЦТ РК (TESTCENTER.KZ)</div>
                <h3 className="aniq-bento-title">{t.allSubjectsTitle}</h3>
                <p className="small max-w-2xl mx-auto mt-1">{t.allSubjectsSub}</p>
              </div>

              <div className="unt-subject-grid mt-4">
                {UNT_SUBJECTS.map((subj) => (
                  <button
                    key={subj.id}
                    type="button"
                    className="unt-subject-card"
                    style={{ "--subj-accent": `rgb(${subj.accentRgb})` } as React.CSSProperties}
                    onClick={() => launchSubjectExam(subj.id, 1)}
                  >
                    <span className="unt-subject-icon">
                      <SubjectIcon subjectId={subj.id} size={18} />
                    </span>
                    <span className="unt-subject-info">
                      <strong>{subj.title[lang]}</strong>
                      <small>10 вариантов × 40 вопр. (50 б.)</small>
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {UNT_PROFILE_COMBINATIONS.map((combo) => (
                  <button
                    key={combo.id}
                    type="button"
                    className="unt-combo-chip"
                    onClick={() => launchSubjectExam(combo.subjects[0], 1)}
                  >
                    <GraduationCap size={13} />
                    <span>{combo.title[lang]}</span>
                    <small className="opacity-75">· {combo.careers[lang]}</small>
                  </button>
                ))}
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
                  className="bento-tile text-left"
                  style={{ ["--tile-rgb" as string]: "216, 90, 48" }}
                >
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
                </button>

                <button
                  type="button"
                  onClick={() => jumpToSection("lesson")}
                  className="bento-tile text-left"
                  style={{ ["--tile-rgb" as string]: "217, 138, 43" }}
                >
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
                    Главное правило-инвариант, крупная формула, разбор по шагам Свеллера и перенос навыка на задачи с новыми числами.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => jumpToSection("exam")}
                  className="bento-tile text-left"
                  style={{ ["--tile-rgb" as string]: "255, 154, 60" }}
                >
                  <span
                    className="bento-icon"
                    style={{
                      background: "linear-gradient(135deg, #ff9a3c, #994d08)",
                      boxShadow: "0 6px 16px -6px rgba(255, 154, 60, 0.55)"
                    }}
                  >
                    <Target size={22} />
                  </span>
                  <h4 className="bento-card-title">Пробное ЕНТ · 12 предметов × 10 вариантов</h4>
                  <p className="bento-card-desc">
                    По 40 вопросов (50 баллов) на каждый вариант: одновыборные, контекст, соответствие A/B (2 б.) и мультивыбор из 6 (2 б.).
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => jumpToSection("graph")}
                  className="bento-tile text-left"
                  style={{ ["--tile-rgb" as string]: "10, 132, 216" }}
                >
                  <span
                    className="bento-icon"
                    style={{
                      background: "linear-gradient(135deg, #0a84d8, #083b66)",
                      boxShadow: "0 6px 16px -6px rgba(10, 132, 216, 0.55)"
                    }}
                  >
                    <BrainCircuit size={22} />
                  </span>
                  <h4 className="bento-card-title">Граф знаний «Второй мозг» (Bloom 2σ)</h4>
                  <p className="bento-card-desc">
                    Направленный граф пререквизитов с порогом мастерства 80%: отделяет корневой пробел в базе от зависимых разделов.
                  </p>
                </button>

                <a
                  href={`/lab?lang=${lang}&topic=${topic}`}
                  className="bento-tile text-left no-underline"
                  style={{ ["--tile-rgb" as string]: "21, 163, 127" }}
                >
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
                    Метод продуктивной неудачи Ману Капура (ETH Zurich): поиск первого неверного шага даёт 2× перенос навыка на ЕНТ.
                  </p>
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
                      <span>Открыть Радар</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 6 Scientific Learning Methodologies Showcase */}
            <div className="aniq-science-showcase mt-8">
              <div className="aniq-bento-head">
                <div className="aniq-bento-kicker">{t.scienceKicker}</div>
                <h3 className="aniq-bento-title">{t.scienceTitle}</h3>
                <p className="small max-w-2xl mx-auto mt-1">{t.scienceSub}</p>
              </div>

              <div className="science-methods-grid mt-4">
                {SCIENTIFIC_METHODS.map((m) => (
                  <div key={m.id} className="science-method-card">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="science-method-icon">
                        <ScienceMethodIcon icon={m.icon} size={17} />
                      </span>
                      <span className="science-effect-pill">{m.effectMetric}</span>
                    </div>
                    <h4 className="science-method-title">{m.title[lang]}</h4>
                    <p className="science-method-meta">
                      {m.scientist} · {m.institution} ({m.year})
                    </p>
                    <code className="science-formula-box">{m.formula}</code>
                    <p className="small mt-2 mb-1.5">{m.evidenceSummary[lang]}</p>
                    <p className="small m-0 font-medium text-amber-800 dark:text-amber-300">
                      {m.platformMechanism[lang]}
                    </p>
                  </div>
                ))}
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

                  {/* Live Scientific Pedagogy Telemetry Strip for Active Topic */}
                  <div className="science-telemetry-strip mt-3">
                    <span className="science-telemetry-pill">
                      <GitBranch size={13} />
                      <span>
                        Bloom 2σ: <strong>{topicScientificTelemetry.masteryPercent}%</strong> (порог 80%)
                      </span>
                    </span>
                    <span className="science-telemetry-pill">
                      <Clock size={13} />
                      <span>
                        Эббингауз R(t): <strong>{topicScientificTelemetry.ebbinghaus.retentionPercent}%</strong> · повтор через{" "}
                        <strong>{topicScientificTelemetry.ebbinghaus.nextIntervalDays} дн.</strong>
                      </span>
                    </span>
                    <span className="science-telemetry-pill">
                      <Brain size={13} />
                      <span>{topicScientificTelemetry.sweller.label}</span>
                    </span>
                  </div>
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
                                <a className="quiet-inline-link inline-flex items-center gap-1" href={`/lab?lang=${lang}&topic=${topic}`}>
                                  <span>{t.openLabForTopic}</span>
                                  <ArrowRight size={13} />
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
              initialSubjectId={examSubjectId}
              initialVariantNumber={examVariantNumber}
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
                  .map((m) => {
                    const ret = computeEbbinghausRetention(m.soloCount > 0 ? 1 : 2, m.soloCount, 4);
                    return (
                      <li key={m.topic}>
                        <button type="button" className="quiet-inline-link" onClick={() => selectTopic(m.topic)}>
                          {m.title}
                        </button>{" "}
                        ({m.soloCount}/2 · Эббингауз R(t) = {ret.retentionPercent}%, повтор: {ret.nextIntervalDays} дн.)
                      </li>
                    );
                  })}
              </ul>
              <p className="small font-medium mt-3">{t.rmPhase2} (Очередь Бьорка без смежных повторов):</p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {interleavedQueue.map((item, idx) => (
                  <button
                    key={`${item.topic}-${idx}`}
                    type="button"
                    className="unt-combo-chip"
                    onClick={() => selectTopic(item.topic)}
                  >
                    <Shuffle size={12} />
                    <span>
                      {idx + 1}. {item.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 6 Scientific Methodologies Reference Panel inside Roadmap */}
            <div className="mb-6">
              <span className="rule-label block mb-2">{t.scienceTitle}</span>
              <div className="science-methods-grid">
                {SCIENTIFIC_METHODS.map((m) => (
                  <div key={m.id} className="science-method-card">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="science-method-icon">
                        <ScienceMethodIcon icon={m.icon} size={16} />
                      </span>
                      <span className="science-effect-pill">{m.effectMetric}</span>
                    </div>
                    <h3 className="science-method-title">{m.title[lang]}</h3>
                    <p className="science-method-meta">
                      {m.scientist} · {m.institution} ({m.year})
                    </p>
                    <code className="science-formula-box">{m.formula}</code>
                    <p className="small mt-1.5 mb-0">{m.evidenceSummary[lang]}</p>
                  </div>
                ))}
              </div>
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
