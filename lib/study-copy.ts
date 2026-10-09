import type { Language } from "@/lib/lessons";

export const studyCopy = {
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
      "6 haftada 45/50 ball: kvadrat tenglamalar, теңсіздіктер va trigonometriyada ishora xatolari",
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
} as const;

export type StudyCopyLang = (typeof studyCopy)[Language];

export function getTopicAiPrompts(lang: Language, lessonTitle: string, lessonExample: string) {
  if (lang === "kk") {
    return {
      placeholder: `Мысалы: «${lessonTitle}» тақырыбындағы «${lessonExample}» мысалының бірінші қадамы неге осылай орындалады?`,
      quick: [
        `«${lessonTitle}» тақырыбындағы «${lessonExample}» үлгісінің әр қадамын түсіндіріп берші.`,
        `Осы тақырыпта («${lessonTitle}») ҰБТ-да оқушылар көбіне қай жерде қателеседі?`,
        `Тақырыптың негізгі ережесін есеп шығарғанда қалай жылдам тексеруге болады?`
      ]
    };
  }
  if (lang === "uz") {
    return {
      placeholder: `Masalan: «${lessonTitle}» mavzusidagi «${lessonExample}» misolining birinchi qadami nega shunday bajariladi?`,
      quick: [
        `«${lessonTitle}» mavzusidagi «${lessonExample}» namunasining har bir qadamini tushuntirib bering.`,
        `Shu mavzuda («${lessonTitle}») imtihonda ko‘pincha qaysi qadamda xato qilinadi?`,
        `Mavzuning asosiy qoidasini masalada qanday tez tekshirish mumkin?`
      ]
    };
  }
  return {
    placeholder: `Например: почему в теме «${lessonTitle}» в примере «${lessonExample}» выполняется именно такой первый переход?`,
    quick: [
      `Разбери по шагам образец «${lessonExample}» из темы «${lessonTitle}».`,
      `На каком шаге в теме «${lessonTitle}» чаще всего теряют баллы на ЕНТ?`,
      `Как быстро проверить себя по главному правилу темы «${lessonTitle}»?`
    ]
  };
}

export function getStudyErrorText(lang: Language, code: string | undefined): string {
  const t = studyCopy[lang];
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
