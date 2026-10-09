"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Compass,
  FlaskConical,
  GitBranch,
  GraduationCap,
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
import { PixelBrandMark, PixelKnowledgeMosaic, PixelProgressBar } from "@/components/pixel-mosaic";
import { ThemeToggleButton, useAniqTheme } from "@/components/hero-canvas";
import { getOptionFeedback, lessons, untTopicIds, type Language, type TopicId } from "@/lib/lessons";
import {
  buildBaselineRoadmap,
  checkAnswer,
  formatLabTask,
  makeChallenge,
  parseNumericAnswer,
  progressSchema,
  reviewSchedule,
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
  loadNavContext,
  loadUserProfile,
  saveNavContext,
  saveUserProfile,
  type UniversityId,
  type UserProfile
} from "@/lib/user-profile";
import { UntExamView, SubjectIcon } from "@/app/unt-exam-view";
import { KnowledgeGraphView } from "@/app/knowledge-graph-view";
import { XrayTrapView } from "@/app/xray-trap-view";

const copy = {
  ru: {
    // 4 Goal-oriented primary sections
    navToday: "Сегодня",
    navLearn: "Учиться",
    navExam: "Пробное ЕНТ",
    navProfile: "Профиль",
    // Header utility links
    navHowItWorks: "Как работает BilimAI",
    navAbout: "О проекте",
    logoutBtn: "Выйти",
    // Learn sub-navigation
    subLesson: "Урок и практика",
    subGraph: "Карта тем (16)",
    subXray: "Проверить черновик",
    subLab: "Тренировка ошибок",
    subAi: "Вопрос по теме",
    // Subject boundary banner
    subjectBoundaryTitle: (subj: string) =>
      `Вы перешли из предмета «${subj}» в раздел «Учиться»`,
    subjectBoundaryDesc: (subj: string) =>
      `Пошаговые интерактивные уроки, карта из 16 тем и проверка черновика сейчас доступны по Математике. По предмету «${subj}» доступны варианты в разделе «Пробное ЕНТ».`,
    subjectBoundaryStudyMath: "Учить математику (16 тем)",
    subjectBoundaryBackExam: (subj: string) => `Вернуться к тесту: ${subj}`,
    // Today / Home section (First-time vs Returning)
    todayFirstEyebrow: "Без обязательной регистрации · RU / ҚАЗ / OʻZB",
    todayFirstTitle: "Подготовка к ЕНТ: решайте задачи, разбирайте ошибки и составляйте план",
    todayFirstSub:
      "Начните с первого урока математики, проверьте знания на короткой диагностике или выберите свой предмет ЕНТ ниже. Все решения автоматически сохраняются в вашем браузере.",
    todayStartBtn: "Начать подготовку",
    todayCheckMathBtn: "Проверить знания (Диагностика по математике · 18 заданий)",
    todayPickTopicBtn: "Выбрать тему (16 разделов)",
    todayOptionalRegNote: "Регистрация необязательна — вы можете учиться сразу и создать профиль позже.",
    todaySubjectsTitle: "Выберите предмет ЕНТ (12 предметов НЦТ РК)",
    todaySubjectsSub:
      "Для математики доступны пошаговые уроки, карта тем, проверка черновика и пробники. Для остальных 11 предметов доступны тренировочные и официальные варианты Пробного ЕНТ.",
    todayOpenMathLessons: "Открыть уроки математики →",
    todayOpenSubjectExam: (subj: string) => `Пробное ЕНТ: ${subj} →`,
    // Returning visitor card
    todayContinueBadge: "Продолжить обучение",
    todayContinueTitle: (topicTitle: string, modeLabel: string) =>
      `Продолжить: Математика → ${topicTitle} → ${modeLabel}`,
    todayContinueModeLesson: "Разбор правила",
    todayContinueModePractice: (qNum: number, total: number) => `Практика, задача ${qNum} из ${total}`,
    todayContinueBtn: "Продолжить занятие →",
    todaySwitchTopicBtn: "Сменить тему (Карта тем)",
    todaySwitchSubjectBtn: "Выбрать другой предмет",
    todayNextReviewLabel: "Следующее повторение по расписанию:",
    todayNextReviewBtn: "Повторить тему →",
    todayNoDueReview: "Все изученные темы повторены вовремя.",
    // Study Lesson & Practice
    topics: "16 разделов математики ЕНТ",
    mobileTopicLabel: "Тема математики",
    lessonBreadcrumbPrefix: "Математика",
    lessonActionSubtitle: "Разберитесь с правилом, затем решите 3 задачи.",
    lesson: "Разбор",
    practice: "Практика (3 задачи)",
    ai: "Вопрос по теме",
    statusNotAssessedShort: "Вы ещё не практиковались",
    statusAssessedShort: (solved: number, total: number, solo: number) =>
      `Решено в уроке: ${solved}/${total}${solo > 0 ? ` · без подсказок: ${solo}` : ""}`,
    rule: "§ Главное правило",
    exampleLabel: "Разбор типового задания ЕНТ",
    exampleSteps: "Пошаговый ход решения",
    note: "Проверьте себя: объясните своими словами, почему на каждом шаге сохраняется верное равенство или свойство.",
    solveSelf: "Перейти к практике (3 задачи)",
    askAboutRule: "Задать вопрос по теме",
    practicePurposeNote: "Короткое закрепление урока: решите 3 задачи с проверкой каждого ответа.",
    taskProgress: "Задача",
    ofLabel: "из",
    extraTaskTab: "С другими числами",
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
    practiceSummaryTitle: (solved: number, total: number) =>
      `Итог практики по теме: решено верно ${solved} из ${total}`,
    practiceSummarySub:
      "Выберите следующее действие: закрепите правило на задаче с новыми числами или переходите к следующей теме.",
    practiceSummaryExtraBtn: "Решить задачу с другими числами",
    nextTopicBtn: "Следующая тема курса",
    transferTitle: "Задача с другими числами",
    transferSub: "Примените главное правило темы без готовых вариантов ответа (доступно 24 варианта чисел).",
    transferCheck: "Проверить ответ",
    transferNext: "Новые числа",
    transferRight: "Верно! Правило применено точно.",
    transferWrong: "Ответ пока не совпал. Сверьте вычисления с главным правилом темы.",
    transferInvalid: "Введите целое число, десятичную дробь или обыкновенную дробь вида 3/7.",
    // AI Tutor
    aiTitle: "Вопрос по текущей теме",
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
    badgePreview: "Локальный разбор по правилу темы",
    // My Plan (inside Today / Roadmap)
    rmTitle: "Мой план подготовки",
    rmSub: "Приоритетные темы на сегодня и расписание подготовки по неделям.",
    rmEmptyTitle: "Пока недостаточно данных для персонального плана",
    rmEmptyBody:
      "Пройдите диагностику по математике (18 заданий) или выберите темы самостоятельно, чтобы платформа построила маршрут по вашим ответам.",
    rmStartDiagnosticBtn: "Пройти диагностику (18 заданий) →",
    rmChooseTopicsSelfBtn: "Выбрать темы на карте",
    rmShowExampleBtn: "Посмотреть пример плана",
    rmHideExampleBtn: "Скрыть пример плана",
    rmExampleBadge: "Демонстрационный пример плана (до диагностики)",
    rmAssessedBanner: (mastered: number) =>
      `Персональный план по вашим ответам: закреплено тем — ${mastered} из 16.`,
    rmTarget: "Целевой балл профильной математики (из 50)",
    rmWeeks: "Недель до экзамена",
    rmPaceLabel: (perWeek: number) => `Рекомендуемый темп: ~${perWeek} темы в неделю`,
    rmTodayTitle: "Что делать сегодня",
    rmTodaySub: "Начните с базовых тем, от которых зависят более сложные разделы:",
    rmOpenLesson: "Открыть урок",
    rmOpenLab: "Найти ошибку",
    rmInterleavedLabel: "Чередование тем для повторения:",
    rmScheduleAndSettingsSummary: "Настроить цель, срок по неделям и отметить сложные темы",
    rmWeak: "Отметьте темы, которые вызывают трудности:",
    rmHowDetailsSummary: "Как составлен этот план и как работают приоритеты",
    rmHowDetailsBody:
      "В первую очередь в план попадают базовые темы (линейные уравнения, неравенства и квадратные уравнения), без которых возникают ошибки в логарифмах, тригонометрии и производной. После 2 самостоятельных решений без подсказок тема считается закреплённой.",
    rmHowDetailsLink: "Подробнее о методике (/about) →",
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
    rmHabit: "Режим занятий",
    // Profile Section
    profTitle: "Профиль и настройки",
    profSub:
      "Все решённые задачи, результаты Пробного ЕНТ и выбранные темы автоматически сохраняются в этом браузере. Профиль позволяет закрепить имя, целевой вуз и настройки языка.",
    profGuestTitle: "Гостевой режим (локальное сохранение активно)",
    profGuestDesc:
      "Вы можете заниматься без аккаунта — ваш прогресс уже сохраняется на этом устройстве. Создайте локальный профиль или войдите, чтобы указать целевой вуз и баллы.",
    profLoginBtn: "Войти в профиль",
    profRegisterBtn: "Создать профиль",
    profSignedAs: "Вы вошли как",
    profEditBtn: "Изменить данные профиля",
    profSavedStatsTitle: "Сохранённые данные в этом браузере",
    profStatLab: "Решено разборов в Тренировке ошибок",
    profStatExams: "Завершено вариантов Пробного ЕНТ",
    profStatMastered: "Закреплено тем математики (из 16)",
    profUniTitle: "Ориентиры по баллам профильной математики в вузах РК (справочно)",
    profUniSub:
      "Справочные ориентиры по открытым данным конкурсов грантов МНВО РК и НЦТ (testcenter.kz) для технических и IT-программ. Не являются гарантией присуждения гранта.",
    profUniTargetCol: "Рекомендуемый балл математики",
    profUniGrantCol: "Ориентир общего балла ЕНТ",
    profPrefsTitle: "Язык интерфейса и тема оформления",
    profLangLabel: "Язык обучения",
    profThemeLabel: "Тема экрана",
    profThemeToggle: "Переключить светлую / тёмную тему"
  },
  kk: {
    navToday: "Бүгін",
    navLearn: "Оқу",
    navExam: "Байқау ҰБТ",
    navProfile: "Профиль",
    navHowItWorks: "BilimAI қалай жұмыс істейді",
    navAbout: "Жоба туралы",
    logoutBtn: "Шығу",
    subLesson: "Сабақ және жаттығу",
    subGraph: "Тақырыптар картасы (16)",
    subXray: "Жазбаны тексеру",
    subLab: "Қатемен жұмыс",
    subAi: "Тақырып сұрағы",
    subjectBoundaryTitle: (subj: string) =>
      `Сіз «${subj}» пәнінен «Оқу» бөліміне өттіңіз`,
    subjectBoundaryDesc: (subj: string) =>
      `Қадамдық интерактивті сабақтар, 16 тақырып картасы және жазбаны тексеру қазір Математика пәні бойынша қолжетімді. «${subj}» пәні бойынша нұсқалар «Байқау ҰБТ» бөлімінде.`,
    subjectBoundaryStudyMath: "Математиканы оқу (16 тақырып)",
    subjectBoundaryBackExam: (subj: string) => `Тестке оралу: ${subj}`,
    todayFirstEyebrow: "Тіркеусіз бастау · RU / ҚАЗ / OʻZB",
    todayFirstTitle: "ҰБТ-ға дайындық: есептер шығарыңыз, қателерді талдаңыз және жоспар құрыңыз",
    todayFirstSub:
      "Математиканың бірінші сабағынан бастаңыз, қысқа диагностикадан өтіңіз немесе төменнен өз ҰБТ пәніңізді таңдаңыз. Барлық жауаптар браузерде автоматты түрде сақталады.",
    todayStartBtn: "Дайындықты бастау",
    todayCheckMathBtn: "Білімді тексеру (Математика диагностикасы · 18 тапсырма)",
    todayPickTopicBtn: "Тақырып таңдау (16 бөлім)",
    todayOptionalRegNote: "Тіркелу міндетті емес — бірден оқып бастап, профильді кейін ашуға болады.",
    todaySubjectsTitle: "ҰБТ пәнін таңдаңыз (ҚР ҰТО 12 пәні)",
    todaySubjectsSub:
      "Математика бойынша қадамдық сабақтар, тақырыптар картасы және жазбаны тексеру бар. Қалған 11 пән бойынша Байқау ҰБТ нұсқалары қолжетімді.",
    todayOpenMathLessons: "Математика сабақтарын ашу →",
    todayOpenSubjectExam: (subj: string) => `Байқау ҰБТ: ${subj} →`,
    todayContinueBadge: "Оқуды жалғастыру",
    todayContinueTitle: (topicTitle: string, modeLabel: string) =>
      `Жалғастыру: Математика → ${topicTitle} → ${modeLabel}`,
    todayContinueModeLesson: "Ережені талдау",
    todayContinueModePractice: (qNum: number, total: number) => `Жаттығу, ${qNum}/${total} есеп`,
    todayContinueBtn: "Сабақты жалғастыру →",
    todaySwitchTopicBtn: "Тақырыпты ауыстыру (Карта)",
    todaySwitchSubjectBtn: "Басқа пән таңдау",
    todayNextReviewLabel: "Кесте бойынша келесі қайталау:",
    todayNextReviewBtn: "Тақырыпты қайталау →",
    todayNoDueReview: "Барлық өтілген тақырыптар уақытылы қайталанды.",
    topics: "ҰБТ математикасының 16 бөлімі",
    mobileTopicLabel: "Математика тақырыбы",
    lessonBreadcrumbPrefix: "Математика",
    lessonActionSubtitle: "Ережемен танысып, бекіту үшін 3 есеп шығарыңыз.",
    lesson: "Талдау",
    practice: "Жаттығу (3 есеп)",
    ai: "Тақырып сұрағы",
    statusNotAssessedShort: "Сіз әлі жаттықпадыңыз",
    statusAssessedShort: (solved: number, total: number, solo: number) =>
      `Сабақта шешілді: ${solved}/${total}${solo > 0 ? ` · өз бетінше: ${solo}` : ""}`,
    rule: "§ Негізгі ереже",
    exampleLabel: "ҰБТ типтік есебін талдау",
    exampleSteps: "Қадамдық шешу жолы",
    note: "Өзіңізді тексеріңіз: әр қадамда теңдік немесе қасиет неліктен сақталатынын өз сөзіңізбен түсіндіріңіз.",
    solveSelf: "Жаттығуға өту (3 есеп)",
    askAboutRule: "Тақырып бойынша сұрақ қою",
    practicePurposeNote: "Сабақты қысқа бекіту: әр жауапты тексере отырып 3 есеп шығарыңыз.",
    taskProgress: "Есеп",
    ofLabel: "/",
    extraTaskTab: "Басқа сандармен",
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
    practiceSummaryTitle: (solved: number, total: number) =>
      `Жаттығу қорытындысы: ${total} есептің ${solved}-і дұрыс шешілді`,
    practiceSummarySub:
      "Келесі қадамды таңдаңыз: ережені жаңа сандармен бекітіңіз немесе келесі тақырыпқа өтіңіз.",
    practiceSummaryExtraBtn: "Басқа сандармен есеп шығару",
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
    badgePreview: "Тақырып ережесі бойынша жергілікті талдау",
    rmTitle: "Менің дайындық жоспарым",
    rmSub: "Бүгінгі басым тақырыптар және апталық дайындық кестесі.",
    rmEmptyTitle: "Жеке жоспар құру үшін әзірше деректер жеткіліксіз",
    rmEmptyBody:
      "Математика бойынша диагностикадан өтіңіз (18 тапсырма) немесе тақырыптарды өз бетіңізше таңдаңыз.",
    rmStartDiagnosticBtn: "Диагностикадан өту (18 тапсырма) →",
    rmChooseTopicsSelfBtn: "Картадан тақырып таңдау",
    rmShowExampleBtn: "Жоспар үлгісін көру",
    rmHideExampleBtn: "Жоспар үлгісін жасыру",
    rmExampleBadge: "Жоспардың демонстрациялық үлгісі (диагностикаға дейін)",
    rmAssessedBanner: (mastered: number) =>
      `Сіздің нәтижелеріңіз бойынша жеке жоспар: бекітілген тақырыптар — 16-дан ${mastered}.`,
    rmTarget: "Бейіндік математика бойынша мақсатты балл (50-ден)",
    rmWeeks: "Емтиханға дейінгі апта саны",
    rmPaceLabel: (perWeek: number) => `Ұсынылатын қарқын: аптасына ~${perWeek} тақырып`,
    rmTodayTitle: "Бүгін не істеу керек",
    rmTodaySub: "Күрделі тақырыптарға негіз болатын базалық бөлімдерден бастаңыз:",
    rmOpenLesson: "Сабақты ашу",
    rmOpenLab: "Қатені табу",
    rmInterleavedLabel: "Тақырыптарды кезектестіріп қайталау:",
    rmScheduleAndSettingsSummary: "Мақсатты баллды, апта санын және қиын тақырыптарды баптау",
    rmWeak: "Қиындық тудыратын тақырыптарды белгілеңіз:",
    rmHowDetailsSummary: "Бұл жоспар қалай құрылған",
    rmHowDetailsBody:
      "Алдымен логарифм, тригонометрия және туындыға негіз болатын базалық тақырыптар (сызықтық, квадрат теңдеулер, теңсіздіктер) ұсынылады. Көмексіз 2 есеп шығарғаннан кейін тақырып бекітілген болып есептеледі.",
    rmHowDetailsLink: "Әдістеме туралы (/about) →",
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
    rmHabit: "Дайындық тәртібі",
    profTitle: "Профиль және баптаулар",
    profSub:
      "Барлық шығарылған есептер мен Байқау ҰБТ нәтижелері осы браузерде автоматты түрде сақталады. Профиль атыңызды, мақсатты ЖОО-ны және тілді сақтауға мүмкіндік береді.",
    profGuestTitle: "Қонақ режимі (жергілікті сақтау қосулы)",
    profGuestDesc:
      "Тіркелмей-ақ оқи беруге болады — прогресс осы құрылғыда сақталады. Мақсатты ЖОО мен баллды белгілеу үшін профильге кіріңіз немесе жаңасын жасаңыз.",
    profLoginBtn: "Профильге кіру",
    profRegisterBtn: "Профиль жасау",
    profSignedAs: "Сіз кірдіңіз:",
    profEditBtn: "Профиль деректерін өзгерту",
    profSavedStatsTitle: "Осы браузерде сақталған деректер",
    profStatLab: "Қатемен жұмыста шешілген талдаулар",
    profStatExams: "Аяқталған Байқау ҰБТ нұсқалары",
    profStatMastered: "Бекітілген математика тақырыптары (16-дан)",
    profUniTitle: "ҚР ЖОО гранттары үшін бейіндік математика баллдарының бағдары (анықтама)",
    profUniSub:
      "ҚР ҒЖБМ және ҰТО (testcenter.kz) ашық грант конкурстарының деректері бойынша бағдар. Грант тағайындауға кепілдік болып табылмайды.",
    profUniTargetCol: "Ұсынылатын математика балы",
    profUniGrantCol: "Жалпы ҰБТ балының бағдары",
    profPrefsTitle: "Интерфейс тілі және безендіру тақырыбы",
    profLangLabel: "Оқу тілі",
    profThemeLabel: "Экран тақырыбы",
    profThemeToggle: "Жарық / қараңғы тақырыпты ауыстыру"
  },
  uz: {
    navToday: "Bugun",
    navLearn: "O‘qish",
    navExam: "Sinov UBT",
    navProfile: "Profil",
    navHowItWorks: "BilimAI qanday ishlaydi",
    navAbout: "Loyiha haqida",
    logoutBtn: "Chiqish",
    subLesson: "Dars va mashq",
    subGraph: "Mavzular xaritasi (16)",
    subXray: "Qoralamani tekshirish",
    subLab: "Xatolar ustida ishlash",
    subAi: "Mavzu savoli",
    subjectBoundaryTitle: (subj: string) =>
      `Siz «${subj}» fanidan «O‘qish» bo‘limiga o‘tdingiz`,
    subjectBoundaryDesc: (subj: string) =>
      `Qadamma-qadam interaktiv darslar, 16 ta mavzu xaritasi va qoralamani tekshirish hozir Matematika fani bo‘yicha mavjud. «${subj}» fani bo‘yicha variantlar «Sinov UBT» bo‘limida.`,
    subjectBoundaryStudyMath: "Matematikani o‘qish (16 mavzu)",
    subjectBoundaryBackExam: (subj: string) => `Testga qaytish: ${subj}`,
    todayFirstEyebrow: "Ro‘yxatdan o‘tmasdan boshlash · RU / ҚАЗ / OʻZB",
    todayFirstTitle: "UBTga tayyorgarlik: masalalar yeching, xatolarni tahlil qiling va reja tuzing",
    todayFirstSub:
      "Matematikaning birinchi darsidan boshlang, qisqa diagnostikadan o‘ting yoki quyidan o‘z UBT faningizni tanlang. Barcha javoblar brauzerda avtomatik saqlanadi.",
    todayStartBtn: "Tayyorgarlikni boshlash",
    todayCheckMathBtn: "Bilimni tekshirish (Matematika diagnostikasi · 18 topshiriq)",
    todayPickTopicBtn: "Mavzu tanlash (16 bo‘lim)",
    todayOptionalRegNote: "Ro‘yxatdan o‘tish majburiy emas — darhol o‘qishni boshlab, profilni keyinroq ochishingiz mumkin.",
    todaySubjectsTitle: "UBT fanini tanlang (12 ta fan)",
    todaySubjectsSub:
      "Matematika bo‘yicha qadamma-qadam darslar, mavzular xaritasi va qoralama tekshiruvi mavjud. Qolgan 11 ta fan bo‘yicha Sinov UBT variantlari mavjud.",
    todayOpenMathLessons: "Matematika darslarini ochish →",
    todayOpenSubjectExam: (subj: string) => `Sinov UBT: ${subj} →`,
    todayContinueBadge: "O‘qishni davom ettirish",
    todayContinueTitle: (topicTitle: string, modeLabel: string) =>
      `Davom ettirish: Matematika → ${topicTitle} → ${modeLabel}`,
    todayContinueModeLesson: "Qoida tahlili",
    todayContinueModePractice: (qNum: number, total: number) => `Mashq, ${qNum}/${total}-masala`,
    todayContinueBtn: "Darsni davom ettirish →",
    todaySwitchTopicBtn: "Mavzuni almashtirish (Xarita)",
    todaySwitchSubjectBtn: "Boshqa fanni tanlash",
    todayNextReviewLabel: "Jadval bo‘yicha keyingi takrorlash:",
    todayNextReviewBtn: "Mavzuni takrorlash →",
    todayNoDueReview: "Barcha o‘tilgan mavzular o‘z vaqtida takrorlandi.",
    topics: "16 ta matematika bo‘limi",
    mobileTopicLabel: "Matematika mavzusi",
    lessonBreadcrumbPrefix: "Matematika",
    lessonActionSubtitle: "Qoida bilan tanishing, so‘ng mustahkamlash uchun 3 ta masala yeching.",
    lesson: "Tahlil",
    practice: "Mashq (3 masala)",
    ai: "Mavzu savoli",
    statusNotAssessedShort: "Siz hali mashq qilmadingiz",
    statusAssessedShort: (solved: number, total: number, solo: number) =>
      `Darsda yechildi: ${solved}/${total}${solo > 0 ? ` · mustaqil: ${solo}` : ""}`,
    rule: "§ Asosiy qoida",
    exampleLabel: "Namuna tahlili",
    exampleSteps: "Qadam-baqadam yechim",
    note: "O‘zingizni tekshiring: har bir qadamda tenglik nima uchun saqlanishini o‘z so‘zlaringiz bilan tushuntiring.",
    solveSelf: "Mashqqa o‘tish (3 masala)",
    askAboutRule: "Mavzu bo‘yicha savol berish",
    practicePurposeNote: "Darsni qisqa mustahkamlash: har bir javobni tekshirib 3 ta masala yeching.",
    taskProgress: "Masala",
    ofLabel: "/",
    extraTaskTab: "Boshqa sonlar bilan",
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
    practiceSummaryTitle: (solved: number, total: number) =>
      `Mashq yakuni: ${total} ta masaladan ${solved} tasi to‘g‘ri yechildi`,
    practiceSummarySub:
      "Keyingi qadamni tanlang: qoidani yangi sonlar bilan mustahkamlang yoki keyingi mavzuga o‘ting.",
    practiceSummaryExtraBtn: "Boshqa sonlar bilan masala yechish",
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
    badgePreview: "Mavzu qoidasi bo‘yicha mahalliy tahlil",
    rmTitle: "Mening tayyorgarlik rejam",
    rmSub: "Bugungi ustuvor mavzular va haftalik tayyorgarlik jadvali.",
    rmEmptyTitle: "Shaxsiy reja uchun hozircha ma’lumotlar yetarli emas",
    rmEmptyBody:
      "Matematika bo‘yicha diagnostikadan o‘ting (18 topshiriq) yoki mavzularni mustaqil tanlang.",
    rmStartDiagnosticBtn: "Diagnostikadan o‘tish (18 topshiriq) →",
    rmChooseTopicsSelfBtn: "Xaritadan mavzu tanlash",
    rmShowExampleBtn: "Reja namunasini ko‘rish",
    rmHideExampleBtn: "Reja namunasini yashirish",
    rmExampleBadge: "Rejaning namunaviy ko‘rinishi (diagnostikadan oldin)",
    rmAssessedBanner: (mastered: number) =>
      `Natijalaringiz asosida shaxsiy reja: mustahkamlangan mavzular — 16 tadan ${mastered}.`,
    rmTarget: "Profil matematika bo‘yicha maqsadli ball (50 dan)",
    rmWeeks: "Imtihongacha haftalar soni",
    rmPaceLabel: (perWeek: number) => `Tavsiya etilgan sur’at: haftasiga ~${perWeek} mavzu`,
    rmTodayTitle: "Bugun nima qilish kerak",
    rmTodaySub: "Murakkab bo‘limlar uchun asos bo‘ladigan tayanch mavzulardan boshlang:",
    rmOpenLesson: "Darsni ochish",
    rmOpenLab: "Xatoni topish",
    rmInterleavedLabel: "Mavzularni navbat bilan takrorlash:",
    rmScheduleAndSettingsSummary: "Maqsadli ball, haftalar va qiyin mavzularni sozlash",
    rmWeak: "Qiyinchilik tug‘diradigan mavzularni belgilang:",
    rmHowDetailsSummary: "Bu reja qanday tuzilgan",
    rmHowDetailsBody:
      "Avvalo logarifm, trigonometriya va hosila uchun asos bo‘ladigan tayanch mavzular (chiziqli, kvadrat tenglamalar, tengsizliklar) tavsiya etiladi. Yordamsiz 2 ta masala yechilgach, mavzu mustahkamlangan hisoblanadi.",
    rmHowDetailsLink: "Metodika haqida (/about) →",
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
    rmHabit: "Tayyorgarlik tartibi",
    profTitle: "Profil va sozlamalar",
    profSub:
      "Barcha yechilgan masalalar va Sinov UBT natijalari shu brauzerda avtomatik saqlanadi. Profil ismingiz, maqsadli OTM va tilni saqlash imkonini beradi.",
    profGuestTitle: "Mehmon rejimi (mahalliy saqlash faol)",
    profGuestDesc:
      "Ro‘yxatdan o‘tmasdan shug‘ullanishingiz mumkin — natijalar shu qurilmada saqlanadi. Maqsadli OTM va ballni belgilash uchun profilga kiring yoki yangisini yarating.",
    profLoginBtn: "Profilga kirish",
    profRegisterBtn: "Profil yaratish",
    profSignedAs: "Siz kirdingiz:",
    profEditBtn: "Profil ma’lumotlarini o‘zgartirish",
    profSavedStatsTitle: "Shu brauzerda saqlangan ma’lumotlar",
    profStatLab: "Xatolar ustida ishlashda yechilgan tahlillar",
    profStatExams: "Yakunlangan Sinov UBT variantlari",
    profStatMastered: "Mustahkamlangan matematika mavzulari (16 tadan)",
    profUniTitle: "QR OTM grantlari uchun profil matematika ballari mo‘ljali (ma’lumot uchun)",
    profUniSub:
      "Ochiq grant tanlovlari ma’lumotlari asosida texnik va IT yo‘nalishlar uchun mo‘ljal. Grant kafolati hisoblanmaydi.",
    profUniTargetCol: "Tavsiya etilgan matematika bali",
    profUniGrantCol: "Umumiy UBT bali mo‘ljali",
    profPrefsTitle: "Interfeys tili va mavzusi",
    profLangLabel: "O‘qish tili",
    profThemeLabel: "Ekran mavzusi",
    profThemeToggle: "Yorug‘ / qorong‘i mavzuni almashtirish"
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

export type WorkspaceTab =
  | "today"
  | "lesson"
  | "practice"
  | "ai"
  | "xray"
  | "exam"
  | "graph"
  | "roadmap"
  | "profile";

export interface StudyProps {
  initialLang?: Language;
  initialTab?: WorkspaceTab;
  initialTopic?: TopicId;
  initialSubjectId?: UntSubjectId;
  initialVariantNumber?: number;
}

export default function Study({
  initialLang = "ru",
  initialTab = "today",
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
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showExamplePlan, setShowExamplePlan] = useState(false);

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
  // Honest empty weakTopics until diagnostics or explicit selection!
  const [weakTopics, setWeakTopics] = useState<TopicId[]>([]);
  const [goalNote, setGoalNote] = useState("");
  const [rmBusy, setRmBusy] = useState(false);
  const [rmError, setRmError] = useState("");
  const [aiRoadmap, setAiRoadmap] = useState<ClaudeRoadmap | null>(null);

  const controller = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const current = useRef({ topic, language: lang });

  const lesson = lessons[lang].find((l) => l.id === topic)!;
  const topicIndex = lessons[lang].findIndex((l) => l.id === topic);
  const nextTopicObj = lessons[lang][(topicIndex + 1) % lessons[lang].length];
  const nextTopicId = nextTopicObj.id;
  const t = copy[lang];

  const solvedCount = lesson.questions.filter((q, i) => checkedMap[i] && answers[i] === String(q.correct)).length;
  const checkedCount = Object.keys(checkedMap).length;
  const baseline = buildBaselineRoadmap(labProgress, targetScore, weeksLeft, lang);
  const transferChallenge = makeChallenge(topic, practiceSeed, lang);

  // Primary navigation section grouping (4 sections: Today, Learn, Exam, Profile)
  const isTodaySection = tab === "today" || tab === "roadmap";
  const isLearnSection =
    tab === "lesson" || tab === "practice" || tab === "ai" || tab === "xray" || tab === "graph";
  const isLessonOrPracticeOrAi = tab === "lesson" || tab === "practice" || tab === "ai";
  const isExamSection = tab === "exam";
  const isProfileSection = tab === "profile";

  const currentSubjectMeta = useMemo(
    () => UNT_SUBJECTS.find((s) => s.id === examSubjectId) ?? UNT_SUBJECTS.find((s) => s.id === "math")!,
    [examSubjectId]
  );

  // Topic-specific progress (honest: no fake 45% or 34% before solving tasks)
  const topicStatusInfo = useMemo(() => {
    const topicRecords = labProgress.records.filter((r) => r.topic === topic);
    const soloReviews = topicRecords.filter((r) => r.independent).length;
    const untRatio = untStorage.lastAttempt?.topicRatios?.[topic];
    const hasActivity = soloReviews > 0 || solvedCount > 0 || untRatio !== undefined;
    return { hasActivity, soloReviews };
  }, [labProgress.records, untStorage.lastAttempt, topic, solvedCount]);

  const isPlanAssessed =
    untStorage.lastAttempt !== null ||
    labProgress.records.length > 0 ||
    weakTopics.length > 0 ||
    checkedCount > 0;

  const hasLearningHistory =
    isPlanAssessed || hasInteracted || Boolean(userProfile?.name);

  const nextDueReview = useMemo(() => {
    if (labProgress.records.length === 0) return null;
    const sched = reviewSchedule(labProgress, Date.now());
    const dueItem = sched.find((item) => item.practiced && item.due);
    if (dueItem) return dueItem;
    return sched.find((item) => item.practiced) ?? null;
  }, [labProgress]);

  // Dynamic topic-specific prompts for the AI tutor
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

  function scrollWorkspaceTop() {
    if (typeof window === "undefined") return;
    requestAnimationFrame(() => {
      const el = document.getElementById("workspace-stage-top") ?? document.getElementById("workspace-anchor");
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top < 0 || rect.top > 220) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  }

  function syncUrl(
    nextLang: Language,
    nextTab: string,
    nextTopic: TopicId,
    nextSubject: UntSubjectId = examSubjectId,
    mode: "push" | "replace" = "push"
  ) {
    if (typeof window === "undefined") return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", nextLang);
      if (nextTab && nextTab !== "today") {
        url.searchParams.set("tab", nextTab);
      } else {
        url.searchParams.delete("tab");
      }
      if (nextTopic && (nextTopic !== "linear" || nextTab === "lesson" || nextTab === "practice")) {
        url.searchParams.set("topic", nextTopic);
      } else {
        url.searchParams.delete("topic");
      }
      if (nextSubject && nextSubject !== "math") {
        url.searchParams.set("subject", nextSubject);
      } else {
        url.searchParams.delete("subject");
      }
      const statePayload = {
        lang: nextLang,
        tab: nextTab,
        topic: nextTopic,
        subject: nextSubject
      };
      if (mode === "push") {
        window.history.pushState(statePayload, "", url.toString());
      } else {
        window.history.replaceState(statePayload, "", url.toString());
      }
      saveNavContext({
        tab: nextTab,
        topic: nextTopic,
        subject: nextSubject,
        lang: nextLang
      });
    } catch {}
  }

  useEffect(() => {
    current.current = { topic, language: lang };
  }, [topic, lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Listen to browser Back / Forward buttons (popstate) so section/topic navigation works naturally
  useEffect(() => {
    function onPopState(e: PopStateEvent) {
      const state = e.state as { lang?: Language; tab?: string; topic?: TopicId; subject?: UntSubjectId } | null;
      const params = new URLSearchParams(window.location.search);

      const qLang = state?.lang ?? params.get("lang");
      if (qLang === "ru" || qLang === "kk" || qLang === "uz") {
        setLang(qLang);
      }

      const qSubject = state?.subject ?? params.get("subject");
      if (qSubject && UNT_SUBJECTS.some((s) => s.id === qSubject)) {
        setExamSubjectId(qSubject as UntSubjectId);
      } else {
        setExamSubjectId("math");
      }

      const qTopic = state?.topic ?? params.get("topic");
      if (qTopic && (untTopicIds as readonly string[]).includes(qTopic)) {
        setTopic(qTopic as TopicId);
      } else {
        setTopic("linear");
      }

      const qTab = state?.tab ?? params.get("tab");
      if (
        qTab === "today" ||
        qTab === "lesson" ||
        qTab === "practice" ||
        qTab === "xray" ||
        qTab === "exam" ||
        qTab === "graph" ||
        qTab === "ai" ||
        qTab === "roadmap" ||
        qTab === "profile"
      ) {
        setTab(qTab);
      } else if (qTopic && (untTopicIds as readonly string[]).includes(qTopic)) {
        setTab("lesson");
      } else {
        setTab("today");
      }
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      const params = new URLSearchParams(window.location.search);
      const hasUrlLang = params.has("lang");
      const hasUrlTab = params.has("tab");
      const hasUrlTopic = params.has("topic");
      const hasUrlSubject = params.has("subject");

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
        const savedNav = loadNavContext();
        if (savedNav) {
          setHasInteracted(true);
          if (!hasUrlTopic && (untTopicIds as readonly string[]).includes(savedNav.topic)) {
            setTopic(savedNav.topic as TopicId);
          }
          if (!hasUrlSubject && UNT_SUBJECTS.some((s) => s.id === savedNav.subject)) {
            setExamSubjectId(savedNav.subject as UntSubjectId);
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
        const qTopic = params.get("topic");
        if (qTopic && (untTopicIds as readonly string[]).includes(qTopic)) {
          setTopic(qTopic as TopicId);
        }
        const qTab = params.get("tab");
        if (
          qTab === "today" ||
          qTab === "lesson" ||
          qTab === "practice" ||
          qTab === "xray" ||
          qTab === "exam" ||
          qTab === "graph" ||
          qTab === "ai" ||
          qTab === "roadmap" ||
          qTab === "profile"
        ) {
          setTab(qTab);
        } else if (hasUrlTopic) {
          setTab("lesson");
        }
      } catch {}

      try {
        const raw = localStorage.getItem("bilimai-lab-v1");
        if (raw) {
          const parsed = progressSchema.safeParse(JSON.parse(raw));
          if (parsed.success && parsed.data.records.length > 0) {
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
    setHasInteracted(true);
    setTopic(id);
    const nextTab = isLessonOrPracticeOrAi ? tab : "lesson";
    if (!isLessonOrPracticeOrAi) setTab("lesson");
    syncUrl(lang, nextTab, id, examSubjectId, "push");
    scrollWorkspaceTop();
  }

  function openTopicLesson(id: TopicId) {
    reset();
    setHasInteracted(true);
    setTopic(id);
    setTab("lesson");
    syncUrl(lang, "lesson", id, examSubjectId, "push");
    scrollWorkspaceTop();
  }

  function handleTabChange(nextTab: string) {
    setHasInteracted(true);
    setTab(nextTab);
    syncUrl(lang, nextTab, topic, examSubjectId, "push");
    scrollWorkspaceTop();
  }

  function handleSubjectChange(nextSubject: UntSubjectId) {
    setHasInteracted(true);
    setExamSubjectId(nextSubject);
    syncUrl(lang, tab, topic, nextSubject, "replace");
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
    syncUrl(value, tab, topic, examSubjectId, "replace");
  }

  function checkCurrentQuestion(qIdx: number) {
    if (answers[qIdx] === undefined) {
      setPracticeNotice(true);
      return;
    }
    setHasInteracted(true);
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
    setHasInteracted(true);
    if (checkAnswer(transferInput, transferChallenge.answer)) {
      setTransferStatus("right");
    } else {
      setTransferStatus("wrong");
    }
  }

  function toggleWeakTopic(id: TopicId) {
    setHasInteracted(true);
    setWeakTopics((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
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
          weakTopics: weakTopics.length > 0 ? weakTopics : ["linear", "quadratic"],
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

  const returnToPath = useMemo(() => {
    const params = new URLSearchParams();
    params.set("lang", lang);
    if (tab && tab !== "today") params.set("tab", tab);
    if (topic && topic !== "linear") params.set("topic", topic);
    if (examSubjectId && examSubjectId !== "math") params.set("subject", examSubjectId);
    return `/?${params.toString()}`;
  }, [lang, tab, topic, examSubjectId]);

  const continueModeLabel =
    checkedCount > 0 || tab === "practice"
      ? t.todayContinueModePractice(Math.min(activeQ + 1, 3), lesson.questions.length)
      : t.todayContinueModeLesson;

  return (
    <div className="textbook-shell has-mobile-bottom-nav">
      {/* Compact Single-Row Header: Pixel Brand Logo + 4 Primary Sections (Desktop) + Language & Theme */}
      <header className="site-header">
        <div className="wrap header-inner">
          <div className="header-top-row">
            <a
              className="aniq-brand-logo"
              href={`/?lang=${lang}`}
              onClick={(e) => {
                e.preventDefault();
                handleTabChange("today");
              }}
            >
              <PixelBrandMark size={26} />
              <span className="aniq-logo-word">BilimAI</span>
              <span className="brand-sub hide-on-narrow-mobile">ЕНТ · ҰБТ</span>
            </a>

            {/* 4 Goal-Oriented Primary Sections (Inline on Desktop, Fixed Bottom Nav on Mobile) */}
            <nav className="primary-nav" aria-label="Основные разделы">
              <button
                type="button"
                className={`primary-nav-link ${isTodaySection ? "active" : ""}`}
                aria-current={isTodaySection ? "page" : undefined}
                onClick={() => handleTabChange("today")}
              >
                <Compass size={15} />
                <span>{t.navToday}</span>
              </button>
              <button
                type="button"
                className={`primary-nav-link ${isLearnSection ? "active" : ""}`}
                aria-current={isLearnSection ? "page" : undefined}
                onClick={() => {
                  if (!isLearnSection) {
                    handleTabChange("lesson");
                  }
                }}
              >
                <BookOpen size={15} />
                <span>{t.navLearn}</span>
              </button>
              <button
                type="button"
                className={`primary-nav-link ${isExamSection ? "active" : ""}`}
                aria-current={isExamSection ? "page" : undefined}
                onClick={() => handleTabChange("exam")}
              >
                <Target size={15} />
                <span>{t.navExam}</span>
              </button>
              <button
                type="button"
                className={`primary-nav-link ${isProfileSection ? "active" : ""}`}
                aria-current={isProfileSection ? "page" : undefined}
                onClick={() => handleTabChange("profile")}
              >
                <User size={15} />
                <span>{t.navProfile}</span>
              </button>
            </nav>

            <div className="header-right">
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
            </div>
          </div>
        </div>
      </header>

      <main id="workspace-anchor" className="wrap main-container">
        <div id="workspace-stage-top" />

        {/* Sub-navigation inside "Учиться" so all learning tools are clearly organized */}
        {isLearnSection && (
          <div className="learn-subnav-wrap mb-4">
            <nav className="learn-subnav" aria-label={t.navLearn}>
              <button
                type="button"
                className={`learn-subnav-pill ${tab === "lesson" || tab === "practice" ? "active" : ""}`}
                onClick={() => handleTabChange("lesson")}
              >
                <BookOpen size={14} />
                <span>{t.subLesson}</span>
              </button>
              <button
                type="button"
                className={`learn-subnav-pill ${tab === "graph" ? "active" : ""}`}
                onClick={() => handleTabChange("graph")}
              >
                <GitBranch size={14} />
                <span>{t.subGraph}</span>
              </button>
              <button
                type="button"
                className={`learn-subnav-pill ${tab === "xray" ? "active" : ""}`}
                onClick={() => handleTabChange("xray")}
              >
                <Microscope size={14} />
                <span>{t.subXray}</span>
              </button>
              <a
                className="learn-subnav-pill"
                href={`/lab?lang=${lang}&topic=${topic}`}
              >
                <FlaskConical size={14} />
                <span>{t.subLab}</span>
              </a>
              <button
                type="button"
                className={`learn-subnav-pill ${tab === "ai" ? "active" : ""}`}
                onClick={() => handleTabChange("ai")}
              >
                <Sparkles size={14} />
                <span>{t.subAi}</span>
              </button>
            </nav>

            {/* Subject Boundary Notice if the user came from a non-Math subject in UNT Exam */}
            {examSubjectId !== "math" && (
              <div className="subject-boundary-banner mt-3" role="status">
                <div className="subject-boundary-text">
                  <strong>{t.subjectBoundaryTitle(currentSubjectMeta.title[lang])}</strong>
                  <p className="small m-0 mt-1">
                    {t.subjectBoundaryDesc(currentSubjectMeta.title[lang])}
                  </p>
                </div>
                <div className="subject-boundary-actions">
                  <Button
                    size="sm"
                    onClick={() => handleSubjectChange("math")}
                  >
                    {t.subjectBoundaryStudyMath}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTabChange("exam")}
                  >
                    {t.subjectBoundaryBackExam(currentSubjectMeta.title[lang])}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== SECTION 1: СЕГОДНЯ (START / CONTINUE + МОЙ ПЛАН) ==================== */}
        {isTodaySection ? (
          <div className="today-dashboard space-y-6">
            {!hasLearningHistory && tab === "today" ? (
              /* FIRST-TIME VISITOR VIEW ON / */
              <section className="surface section-surface today-hero-card" aria-label={t.navToday}>
                <div className="today-hero-layout">
                  <div className="today-hero-copy">
                    <span className="rule-label">{t.todayFirstEyebrow}</span>
                    <h1 className="lesson-title mt-1">{t.todayFirstTitle}</h1>
                    <p className="lesson-intro mt-2">{t.todayFirstSub}</p>

                    <div className="today-primary-actions mt-5">
                      <Button
                        size="lg"
                        onClick={() => {
                          handleSubjectChange("math");
                          openTopicLesson("linear");
                        }}
                      >
                        <span>{t.todayStartBtn}</span>
                        <ArrowRight size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleSubjectChange("math");
                          handleTabChange("exam");
                        }}
                      >
                        <Target size={15} />
                        <span>{t.todayCheckMathBtn}</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleSubjectChange("math");
                          handleTabChange("graph");
                        }}
                      >
                        <GitBranch size={15} />
                        <span>{t.todayPickTopicBtn}</span>
                      </Button>
                    </div>

                    <p className="small text-muted-foreground mt-3 mb-0">
                      {t.todayOptionalRegNote}{" "}
                      <a href={`/welcome?lang=${lang}`} className="quiet-inline-link">
                        {t.navHowItWorks} →
                      </a>
                    </p>
                  </div>

                  {/* Signature Pixel-Block Mosaic Illustration (Filling knowledge gaps) */}
                  <div className="today-hero-visual">
                    <PixelKnowledgeMosaic />
                    <div className="today-hero-progress-caption">
                      <span className="small">{t.topics}</span>
                      <PixelProgressBar value={3} max={16} segments={16} label={t.topics} />
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              /* RETURNING VISITOR VIEW ON / */
              <section className="surface section-surface today-continue-card" aria-label={t.todayContinueBadge}>
                <div className="today-hero-layout">
                  <div className="today-hero-copy">
                    <div className="lesson-meta-line">
                      <span className="rule-label">{t.todayContinueBadge}</span>
                      <span className="lesson-honest-status">
                        {topicStatusInfo.hasActivity
                          ? t.statusAssessedShort(solvedCount, lesson.questions.length, topicStatusInfo.soloReviews)
                          : t.statusNotAssessedShort}
                      </span>
                    </div>
                    <h1 className="lesson-title mt-1">
                      {t.todayContinueTitle(lesson.title, continueModeLabel)}
                    </h1>
                    <p className="lesson-intro mt-1">{lesson.intro}</p>

                    <div className="today-primary-actions mt-4">
                      <Button
                        onClick={() =>
                          handleTabChange(checkedCount > 0 ? "practice" : "lesson")
                        }
                      >
                        <span>{t.todayContinueBtn}</span>
                        <ArrowRight size={16} />
                      </Button>
                      <Button variant="outline" onClick={() => handleTabChange("graph")}>
                        <GitBranch size={15} />
                        <span>{t.todaySwitchTopicBtn}</span>
                      </Button>
                      <Button variant="outline" onClick={() => handleTabChange("exam")}>
                        <Target size={15} />
                        <span>{t.navExam}</span>
                      </Button>
                    </div>
                  </div>
                  <div className="today-hero-visual">
                    <PixelKnowledgeMosaic lang={lang} masteredCount={baseline.masteredTopics.length} />
                  </div>
                </div>

                {/* Next Scheduled Review Line + Pixel Mastery Bar */}
                <div className="today-review-strip mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
                  <span className="small">
                    <strong>{t.todayNextReviewLabel}</strong>{" "}
                    {nextDueReview ? topicName(nextDueReview.topic, lang) : t.todayNoDueReview}
                  </span>
                  <div className="flex items-center gap-3">
                    <PixelProgressBar
                      value={baseline.masteredTopics.length}
                      max={16}
                      segments={16}
                      label={t.topics}
                    />
                    {nextDueReview && (
                      <a
                        href={`/lab?lang=${lang}&topic=${nextDueReview.topic}`}
                        className="quiet-inline-link text-sm"
                      >
                        {t.todayNextReviewBtn}
                      </a>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* SUBJECT PICKER (12 UNT SUBJECTS) */}
            <section className="surface section-surface" aria-label={t.todaySubjectsTitle}>
              <header className="mb-4">
                <h2 className="steps-heading m-0">{t.todaySubjectsTitle}</h2>
                <p className="small mt-1 mb-0">{t.todaySubjectsSub}</p>
              </header>

              <div className="today-subjects-grid">
                {UNT_SUBJECTS.map((subj) => {
                  const isSelected = examSubjectId === subj.id;
                  const isMath = subj.id === "math";
                  return (
                    <div
                      key={subj.id}
                      className={`today-subject-card ${isSelected ? "active" : ""}`}
                    >
                      <div className="today-subject-top">
                        <span className="unt-subject-icon-badge">
                          <SubjectIcon subjectId={subj.id} size={17} />
                        </span>
                        <div className="today-subject-meta">
                          <strong>{subj.title[lang]}</strong>
                          <span className="small block">
                            {subj.officialQuestions}{" "}
                            {lang === "kk" ? "сұрақ" : lang === "uz" ? "savol" : "вопр."} ·{" "}
                            {subj.officialMaxPoints}{" "}
                            {lang === "kk" ? "балл" : lang === "uz" ? "ball" : "б."}
                          </span>
                        </div>
                      </div>
                      <div className="today-subject-actions mt-3">
                        {isMath ? (
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                handleSubjectChange("math");
                                handleTabChange("lesson");
                              }}
                            >
                              {t.todayOpenMathLessons}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                handleSubjectChange("math");
                                handleTabChange("exam");
                              }}
                            >
                              {t.navExam}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            onClick={() => {
                              handleSubjectChange(subj.id);
                              handleTabChange("exam");
                            }}
                          >
                            {t.todayOpenSubjectExam(subj.shortTitle[lang])}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* МОЙ ПЛАН (Clean Empty State before Diagnostics, or Priority Today + Collapsible Details) */}
            <section className="surface section-surface" aria-label={t.rmTitle}>
              <header className="lesson-head mb-4">
                <div className="lesson-meta-line">
                  <span className="rule-label">
                    <Calendar size={13} className="inline mr-1" />
                    {t.rmTitle}
                  </span>
                  {showExamplePlan && !isPlanAssessed && (
                    <span className="lesson-honest-status">{t.rmExampleBadge}</span>
                  )}
                </div>
                <h2 className="steps-heading m-0">{t.rmTitle}</h2>
                <p className="small mt-1 mb-0">{t.rmSub}</p>
              </header>

              {!isPlanAssessed && !showExamplePlan ? (
                /* SHORT EMPTY STATE BEFORE DIAGNOSTICS */
                <div className="plan-empty-state-box">
                  <h3 className="text-base font-semibold m-0">{t.rmEmptyTitle}</h3>
                  <p className="small mt-1.5 mb-4">{t.rmEmptyBody}</p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Button
                      onClick={() => {
                        handleSubjectChange("math");
                        handleTabChange("exam");
                      }}
                    >
                      <Target size={15} />
                      <span>{t.rmStartDiagnosticBtn}</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleSubjectChange("math");
                        handleTabChange("graph");
                      }}
                    >
                      <GitBranch size={15} />
                      <span>{t.rmChooseTopicsSelfBtn}</span>
                    </Button>
                    <button
                      type="button"
                      className="quiet-text-action"
                      onClick={() => setShowExamplePlan(true)}
                    >
                      {t.rmShowExampleBtn}
                    </button>
                  </div>
                </div>
              ) : (
                /* ASSESSED PLAN OR EXPLICIT EXAMPLE PLAN */
                <div>
                  <div className="plan-status-banner mb-4">
                    <p className="small m-0">
                      {isPlanAssessed
                        ? t.rmAssessedBanner(baseline.masteredTopics.length)
                        : t.rmExampleBadge}
                    </p>
                    {!isPlanAssessed && showExamplePlan && (
                      <button
                        type="button"
                        className="quiet-inline-link"
                        onClick={() => setShowExamplePlan(false)}
                      >
                        {t.rmHideExampleBtn}
                      </button>
                    )}
                  </div>

                  {/* Block 1: What to do TODAY (Always visible first) */}
                  <div className="plan-actions-section mb-5">
                    <h3 className="steps-heading">{t.rmTodayTitle}</h3>
                    <p className="small mb-3">{t.rmTodaySub}</p>

                    <div className="plan-priority-list">
                      {baseline.priorityModules
                        .filter((m) => m.phase === 1)
                        .slice(0, 3)
                        .map((m, idx) => (
                          <div key={m.topic} className="plan-priority-row">
                            <div className="plan-priority-info">
                              <span className="step-number">{String(idx + 1).padStart(2, "0")}</span>
                              <div>
                                <strong>{m.title}</strong>
                                <span className="small block">
                                  {m.soloCount > 0 ? `${m.soloCount}/2` : t.statusNotAssessedShort}
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

                  {/* Block 2: Collapsible Goal, Weeks & Weak Topics Settings */}
                  <details className="plan-collapsible-details mb-3">
                    <summary>{t.rmScheduleAndSettingsSummary}</summary>
                    <div className="plan-collapsible-body">
                      <div className="plan-controls-grid mb-4">
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

                      <div>
                        <span className="small font-semibold block mb-2">{t.rmWeak}</span>
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
                    </div>
                  </details>

                  {/* Block 3: Collapsible "How this plan works" */}
                  <details className="plan-collapsible-details mb-3">
                    <summary>{t.rmHowDetailsSummary}</summary>
                    <div className="plan-collapsible-body">
                      <p className="small mb-2">{t.rmHowDetailsBody}</p>
                      <a href={`/about?lang=${lang}`} className="quiet-inline-link">
                        {t.rmHowDetailsLink}
                      </a>
                    </div>
                  </details>

                  {/* Block 4: Collapsible AI Roadmap Customizer */}
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
                </div>
              )}
            </section>
          </div>
        ) : isLessonOrPracticeOrAi ? (
          /* ==================== SECTION 2A: УЧИТЬСЯ → УРОК И ПРАКТИКА ==================== */
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

              {/* Single Main Study Surface */}
              <article className="surface" aria-label={lesson.title}>
                <header className="lesson-head">
                  <div className="lesson-meta-line">
                    <span className="topic-index-label">
                      {t.lessonBreadcrumbPrefix} → {String(topicIndex + 1).padStart(2, "0")}. {lesson.title} ({lesson.section})
                    </span>
                    <span className="lesson-honest-status">
                      {topicStatusInfo.hasActivity
                        ? t.statusAssessedShort(solvedCount, lesson.questions.length, topicStatusInfo.soloReviews)
                        : t.statusNotAssessedShort}
                    </span>
                  </div>
                  <h1 className="lesson-title">{lesson.title}</h1>
                  <p className="lesson-action-subtitle">{t.lessonActionSubtitle}</p>
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
                    <p className="small text-muted-foreground mt-0 mb-3">
                      {t.practicePurposeNote}
                    </p>

                    <div className="practice-header-bar">
                      <div className="flex items-center gap-3">
                        <span className="practice-counter">
                          {activeQ < 3
                            ? `${t.taskProgress} ${activeQ + 1} ${t.ofLabel} ${lesson.questions.length}`
                            : t.transferTitle}
                        </span>
                        <div className="w-24 hidden sm:block">
                          <PixelProgressBar
                            value={solvedCount}
                            max={Math.max(1, lesson.questions.length)}
                            segments={6}
                            label={t.practice}
                          />
                        </div>
                      </div>
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

                        {/* End of Practice Summary & Recommended Next Action */}
                        {checkedCount === 3 && (
                          <div className="practice-summary-card mt-5">
                            <strong>
                              {t.practiceSummaryTitle(solvedCount, lesson.questions.length)}
                            </strong>
                            <p className="small mt-1 mb-3">{t.practiceSummarySub}</p>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setActiveQ(3);
                                  setPracticeNotice(false);
                                }}
                              >
                                {t.practiceSummaryExtraBtn}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => selectTopic(nextTopicId)}
                              >
                                <span>
                                  {t.nextTopicBtn}: {nextTopicObj.title}
                                </span>
                                <ArrowRight size={14} />
                              </Button>
                              <a
                                href={`/lab?lang=${lang}&topic=${topic}`}
                                className="btn-ghost-sm"
                              >
                                {t.openLabForTopic}
                              </a>
                            </div>
                          </div>
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
                                <span>
                                  {t.nextTopicBtn}: {nextTopicObj.title}
                                </span>
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
          /* ==================== SECTION 2B: УЧИТЬСЯ → ПРОВЕРИТЬ ЧЕРНОВИК ==================== */
          <section className="surface section-surface" aria-label={t.subXray}>
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
        ) : tab === "graph" ? (
          /* ==================== SECTION 2C: УЧИТЬСЯ → КАРТА ТЕМ ==================== */
          <section className="surface section-surface" aria-label={t.subGraph}>
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
        ) : tab === "exam" ? (
          /* ==================== SECTION 3: ПРОБНОЕ ЕНТ ==================== */
          <section className="surface section-surface" aria-label={t.navExam}>
            <UntExamView
              lang={lang}
              lastSavedAttempt={untStorage.lastAttempt}
              initialTopic={topic}
              initialSubjectId={examSubjectId}
              initialVariantNumber={examVariantNumber}
              onSubjectChange={handleSubjectChange}
              onCompleteExam={handleCompleteUntExam}
              onOpenGraph={(focusTopic) => {
                if (focusTopic) setTopic(focusTopic);
                handleTabChange("graph");
              }}
              onOpenLesson={openTopicLesson}
            />
          </section>
        ) : (
          /* ==================== SECTION 4: ПРОФИЛЬ И НАСТРОЙКИ ==================== */
          <section className="surface section-surface space-y-6" aria-label={t.navProfile}>
            <header className="lesson-head">
              <span className="rule-label">{t.navProfile}</span>
              <h1 className="lesson-title">{t.profTitle}</h1>
              <p className="lesson-intro">{t.profSub}</p>
            </header>

            {/* Card 1: Account & Local Storage Status */}
            <div className="plan-summary-card">
              {userProfile && userProfile.name ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="small text-muted-foreground block">{t.profSignedAs}</span>
                      <strong className="text-lg">{userProfile.name}</strong>
                      <span className="small block text-muted-foreground">
                        {userProfile.identifier} · {userProfile.grade} · {t.rmTarget}: {userProfile.targetScore}/50
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a
                        className="btn-ghost-sm"
                        href={`/login?lang=${lang}&returnTo=${encodeURIComponent(returnToPath)}`}
                      >
                        {t.profEditBtn}
                      </a>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          clearUserProfile();
                          setUserProfile(null);
                        }}
                      >
                        <LogOut size={14} />
                        <span>{t.logoutBtn}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h2 className="steps-heading m-0">{t.profGuestTitle}</h2>
                  <p className="small m-0">{t.profGuestDesc}</p>
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <a
                      className="aniq-primary-link-btn"
                      href={`/login?lang=${lang}&returnTo=${encodeURIComponent(returnToPath)}`}
                    >
                      <User size={15} />
                      <span>{t.profLoginBtn}</span>
                    </a>
                    <a
                      className="btn-ghost-sm"
                      href={`/register?lang=${lang}&returnTo=${encodeURIComponent(returnToPath)}`}
                    >
                      <span>{t.profRegisterBtn}</span>
                    </a>
                  </div>
                </div>
              )}

              <div className="profile-stats-grid mt-5 pt-4 border-t border-border/60">
                <div className="profile-stat-box">
                  <span className="small text-muted-foreground">{t.profStatMastered}</span>
                  <strong>{baseline.masteredTopics.length} / 16</strong>
                </div>
                <div className="profile-stat-box">
                  <span className="small text-muted-foreground">{t.profStatLab}</span>
                  <strong>{labProgress.records.length}</strong>
                </div>
                <div className="profile-stat-box">
                  <span className="small text-muted-foreground">{t.profStatExams}</span>
                  <strong>{untStorage.history.length}</strong>
                </div>
              </div>
            </div>

            {/* Card 2: Language & Theme Preferences */}
            <div className="plan-summary-card">
              <h2 className="steps-heading m-0 mb-3">{t.profPrefsTitle}</h2>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="small font-medium block mb-1.5">{t.profLangLabel}</span>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ["ru", "Русский (РУС)"],
                        ["kk", "Қазақша (ҚАЗ)"],
                        ["uz", "Oʻzbekcha (OʻZB)"]
                      ] as [Language, string][]
                    ).map(([code, labelText]) => (
                      <Button
                        key={code}
                        size="sm"
                        variant={lang === code ? "default" : "outline"}
                        onClick={() => selectLanguage(code)}
                      >
                        {labelText}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="small font-medium block mb-1.5">{t.profThemeLabel}</span>
                  <Button size="sm" variant="outline" onClick={toggleTheme}>
                    {t.profThemeToggle}
                  </Button>
                </div>
              </div>
            </div>

            {/* Card 3: Reference Table of KZ Universities (Moved out of X-Ray Draft Checker) */}
            <div className="plan-summary-card">
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap size={17} />
                <h2 className="steps-heading m-0">{t.profUniTitle}</h2>
              </div>
              <p className="small mb-3">{t.profUniSub}</p>

              <div className="profile-uni-grid">
                {kzUniversities.map((uni) => (
                  <div key={uni.id} className="profile-uni-card">
                    <div className="flex items-center justify-between gap-2">
                      <strong>{uni.shortName}</strong>
                      <span className="small text-muted-foreground">{uni.gopCode}</span>
                    </div>
                    <div className="small mt-0.5">{uni.name[lang]}</div>
                    <div className="small text-muted-foreground mt-2 pt-2 border-t border-border/50 flex justify-between gap-2">
                      <span>{t.profUniTargetCol}:</span>
                      <strong>
                        {uni.minMathScore}–{uni.safeMathScore} / 50
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Fixed 4-item Mobile Bottom Navigation Bar (fits 320px and 390px with 44-48px touch targets) */}
      <nav className="mobile-bottom-nav" aria-label="Мобильная навигация">
        <button
          type="button"
          className={`mobile-bottom-nav-item ${isTodaySection ? "active" : ""}`}
          aria-current={isTodaySection ? "page" : undefined}
          onClick={() => handleTabChange("today")}
        >
          <Compass size={18} />
          <span>{t.navToday}</span>
        </button>
        <button
          type="button"
          className={`mobile-bottom-nav-item ${isLearnSection ? "active" : ""}`}
          aria-current={isLearnSection ? "page" : undefined}
          onClick={() => {
            if (!isLearnSection) {
              handleTabChange("lesson");
            }
          }}
        >
          <BookOpen size={18} />
          <span>{t.navLearn}</span>
        </button>
        <button
          type="button"
          className={`mobile-bottom-nav-item ${isExamSection ? "active" : ""}`}
          aria-current={isExamSection ? "page" : undefined}
          onClick={() => handleTabChange("exam")}
        >
          <Target size={18} />
          <span>{t.navExam}</span>
        </button>
        <button
          type="button"
          className={`mobile-bottom-nav-item ${isProfileSection ? "active" : ""}`}
          aria-current={isProfileSection ? "page" : undefined}
          onClick={() => handleTabChange("profile")}
        >
          <User size={18} />
          <span>{t.navProfile}</span>
        </button>
      </nav>

      <SiteFooter lang={lang} topic={topic} compact />
    </div>
  );
}
