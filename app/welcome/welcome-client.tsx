"use client";

import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import Link from "next/link";
import type { Language } from "@/lib/curriculum";
import { UNT_SUBJECTS } from "@/lib/unt-all-subjects";
import { SubjectIcon } from "@/app/unt-exam-view";
import { PixelBrandMark } from "@/components/pixel-mosaic";
import { ThemeToggleButton, useAniqTheme } from "@/components/hero-canvas";
import { useAuxiliaryPageNavigation } from "@/lib/use-study-navigation";
import {
  WELCOME_DEMO_ITEMS,
  getAllSubjectCurricula,
  formatLessonsCountLabel,
  formatQuestionsCountLabel
} from "@/lib/universal-curriculum";
import {
  UNIVERSAL_PROGRESS_STORAGE_KEY,
  createDefaultUniversalProgressState,
  migrateUniversalProgressState,
  saveOnboardingSelection,
  type UserLearnerRole,
  type UserLearningGoal,
  type UserInitialLevel
} from "@/lib/universal-progress";

type AttemptSolveMode = "independent" | "second_try" | "assisted" | "after_solution";

const ONBOARDING_COPY: Record<
  Language,
  {
    stepWord: string;
    backBtn: string;
    nextBtn: string;
    skipBtn: string;
    restoreBtn: string;
    skippedText: string;
    skippedCatalogLink: string;
    step1Title: string;
    step1Error: string;
    roles: Array<{ id: UserLearnerRole; label: string }>;
    step2Title: string;
    step2Error: string;
    goals: Array<{ id: UserLearningGoal; label: string }>;
    step3Title: string;
    step3Hint: string;
    step3Error: string;
    step3Next: string;
    step4Title: string;
    step4Error: string;
    levels: Array<{ id: UserInitialLevel; label: string; badge: string }>;
    step5Title: string;
    summaryRole: string;
    summaryGoal: string;
    summarySubjects: string;
    summaryLevel: string;
    chooseStartSubjectLabel: string;
    startLessonBtn: (subjTitle: string) => string;
    startDiagnosticBtn: string;
    startPracticeBtn: string;
    startMapBtn: string;
    editAnswersBtn: string;
  }
> = {
  ru: {
    stepWord: "ШАГ",
    backBtn: "← Назад",
    nextBtn: "Далее →",
    skipBtn: "Пропустить",
    restoreBtn: "Настроить маршрут",
    skippedText:
      "Анкета пропущена. Выберите любой предмет в каталоге ниже или вернитесь к настройке, когда будет удобно.",
    skippedCatalogLink: "Перейти к каталогу предметов →",
    step1Title: "Шаг 1 из 4. Кто вы?",
    step1Error: "Выберите вариант ответа или нажмите «Пропустить».",
    roles: [
      { id: "student", label: "Школьник (5–11 класс)" },
      { id: "applicant", label: "Абитуриент (подготовка к ЕНТ)" },
      { id: "self_learner", label: "Учусь самостоятельно" },
      { id: "teacher", label: "Преподаватель / репетитор" }
    ],
    step2Title: "Шаг 2 из 4. Какая у вас цель?",
    step2Error: "Выберите цель обучения, чтобы перейти к выбору предметов.",
    goals: [
      { id: "school", label: "Разобраться в школьной теме" },
      { id: "exam", label: "Подготовиться к экзамену / ЕНТ" },
      { id: "from_scratch", label: "Изучить предмет с нуля" },
      { id: "practice_gaps", label: "Найти и закрыть пробелы на практике" }
    ],
    step3Title: "Шаг 3 из 4. Какие предметы вы хотите изучать?",
    step3Hint: "Можно выбрать один или несколько предметов. Повторное нажатие снимает выбор.",
    step3Error: "Выберите хотя бы один предмет для продолжения.",
    step3Next: "Далее: стартовый уровень →",
    step4Title: "Шаг 4 из 4. Как вы оцениваете свой текущий уровень?",
    step4Error: "Укажите ориентировочный уровень или выберите мини-диагностику.",
    levels: [
      {
        id: "beginner",
        label: "Начальный — хочу разбор с базовых понятий",
        badge: "Самооценка"
      },
      {
        id: "intermediate",
        label: "Средний — знаю основы, нужна практика",
        badge: "Самооценка"
      },
      {
        id: "advanced",
        label: "Продвинутый — интересны сложные задачи и ловушки",
        badge: "Самооценка"
      },
      {
        id: "check_level",
        label: "Не уверен — пройти короткую диагностику (5 вопросов)",
        badge: "Проверка"
      }
    ],
    step5Title: "Ваши параметры обучения сохранены",
    summaryRole: "Профиль:",
    summaryGoal: "Цель:",
    summarySubjects: "Выбранные предметы:",
    summaryLevel: "Стартовый уровень:",
    chooseStartSubjectLabel: "С какого предмета начать сейчас:",
    startLessonBtn: (subjTitle) => `Начать первый урок: ${subjTitle} →`,
    startDiagnosticBtn: "Пройти диагностику (5 вопросов)",
    startPracticeBtn: "Перейти к практике",
    startMapBtn: "Открыть карту тем",
    editAnswersBtn: "← Изменить ответы"
  },
  kk: {
    stepWord: "ҚАДАМ",
    backBtn: "← Артқа",
    nextBtn: "Келесі →",
    skipBtn: "Өткізіп жіберу",
    restoreBtn: "Оқуды баптау",
    skippedText:
      "Сауалнама өткізілді. Төмендегі каталогтан кез келген пәнді таңдаңыз немесе баптауға қайта оралыңыз.",
    skippedCatalogLink: "Пәндер каталогына өту →",
    step1Title: "4-тен 1-қадам. Сіз кімсіз?",
    step1Error: "Жауап нұсқасын таңдаңыз немесе «Өткізіп жіберу» түймесін басыңыз.",
    roles: [
      { id: "student", label: "Оқушы (5–11 сынып)" },
      { id: "applicant", label: "Талапкер (ҰБТ-ға дайындық)" },
      { id: "self_learner", label: "Өз бетімше оқимын" },
      { id: "teacher", label: "Оқытушы / репетитор" }
    ],
    step2Title: "4-тен 2-қадам. Мақсатыңыз қандай?",
    step2Error: "Пәндерді таңдау үшін оқу мақсатын көрсетіңіз.",
    goals: [
      { id: "school", label: "Мектеп тақырыбын түсіну" },
      { id: "exam", label: "Емтиханға / ҰБТ-ға дайындалу" },
      { id: "from_scratch", label: "Пәнді нөлден бастап оқу" },
      { id: "practice_gaps", label: "Қателерді талдап, олқылықты жою" }
    ],
    step3Title: "4-тен 3-қадам. Қай пәндерді оқығыңыз келеді?",
    step3Hint: "Бір немесе бірнеше пәнді таңдауға болады. Қайта басу таңдауды алып тастайды.",
    step3Error: "Жалғастыру үшін кемінде бір пәнді таңдаңыз.",
    step3Next: "Келесі: бастапқы деңгей →",
    step4Title: "4-тен 4-қадам. Қазіргі деңгейіңізді қалай бағалайсыз?",
    step4Error: "Деңгейді көрсетіңіз немесе қысқа диагностиканы таңдаңыз.",
    levels: [
      {
        id: "beginner",
        label: "Бастапқы — негізгі ұғымдардан бастап түсіндіру",
        badge: "Өзін-өзі бағалау"
      },
      {
        id: "intermediate",
        label: "Орташа — базаны білемін, практика керек",
        badge: "Өзін-өзі бағалау"
      },
      {
        id: "advanced",
        label: "Жоғары — күрделі есептер мен тұзақтар",
        badge: "Өзін-өзі бағалау"
      },
      {
        id: "check_level",
        label: "Сенімді емеспін — қысқа диагностикадан өту (5 сұрақ)",
        badge: "Тексеру"
      }
    ],
    step5Title: "Оқу параметрлері сақталды",
    summaryRole: "Профиль:",
    summaryGoal: "Мақсат:",
    summarySubjects: "Таңдалған пәндер:",
    summaryLevel: "Бастапқы деңгей:",
    chooseStartSubjectLabel: "Қазір қай пәннен бастайсыз:",
    startLessonBtn: (subjTitle) => `Бірінші сабақты бастау: ${subjTitle} →`,
    startDiagnosticBtn: "Диагностикадан өту (5 сұрақ)",
    startPracticeBtn: "Практикаға өту",
    startMapBtn: "Тақырыптар картасын ашу",
    editAnswersBtn: "← Жауаптарды өзгерту"
  },
  uz: {
    stepWord: "QADAM",
    backBtn: "← Orqaga",
    nextBtn: "Keyingi →",
    skipBtn: "O‘tkazib yuborish",
    restoreBtn: "O‘qishni sozlash",
    skippedText:
      "So‘rovnoma o‘tkazib yuborildi. Quyidagi katalogdan istalgan fanni tanlang yoki sozlashga qayting.",
    skippedCatalogLink: "Fanlar katalogiga o‘tish →",
    step1Title: "4 dan 1-qadam. Siz kimsiz?",
    step1Error: "Javob variantini tanlang yoki «O‘tkazib yuborish» tugmasini bosing.",
    roles: [
      { id: "student", label: "Maktab o‘quvchisi (5–11 sinf)" },
      { id: "applicant", label: "Abituriyent (imtihonga tayyorgarlik)" },
      { id: "self_learner", label: "Mustaqil o‘rganaman" },
      { id: "teacher", label: "O‘qituvchi / repetitor" }
    ],
    step2Title: "4 dan 2-qadam. Maqsadingiz nima?",
    step2Error: "Fanlarni tanlash uchun o‘quv maqsadingizni belgilang.",
    goals: [
      { id: "school", label: "Maktab mavzusini tushunib olish" },
      { id: "exam", label: "Imtihon / UBTga tayyorlanish" },
      { id: "from_scratch", label: "Fanni noldan o‘rganish" },
      { id: "practice_gaps", label: "Amaliyotda xatolarni tahlil qilish" }
    ],
    step3Title: "4 dan 3-qadam. Qaysi fanlarni o‘rganmoqchisiz?",
    step3Hint: "Bitta yoki bir nechta fanni tanlash mumkin. Qayta bosish tanlovni bekor qiladi.",
    step3Error: "Davom etish uchun kamida bitta fanni tanlang.",
    step3Next: "Keyingi: boshlang‘ich daraja →",
    step4Title: "4 dan 4-qadam. Hozirgi darajangizni qanday baholaysiz?",
    step4Error: "Darajani belgilang yoki qisqa diagnostikani tanlang.",
    levels: [
      {
        id: "beginner",
        label: "Boshlang‘ich — asosiy tushunchalardan boshlash",
        badge: "O‘zini baholash"
      },
      {
        id: "intermediate",
        label: "O‘rta — bazani bilaman, amaliyot kerak",
        badge: "O‘zini baholash"
      },
      {
        id: "advanced",
        label: "Yuqori — murakkab masalalar va tuzoqlar",
        badge: "O‘zini baholash"
      },
      {
        id: "check_level",
        label: "Ishonchim komil emas — qisqa diagnostikadan o‘tish (5 savol)",
        badge: "Tekshirish"
      }
    ],
    step5Title: "O‘quv parametrlaringiz saqlandi",
    summaryRole: "Profil:",
    summaryGoal: "Maqsad:",
    summarySubjects: "Tanlangan fanlar:",
    summaryLevel: "Boshlang‘ich daraja:",
    chooseStartSubjectLabel: "Hozir qaysi fandan boshlaysiz:",
    startLessonBtn: (subjTitle) => `Birinchi darsni boshlash: ${subjTitle} →`,
    startDiagnosticBtn: "Diagnostikadan o‘tish (5 savol)",
    startPracticeBtn: "Amaliyotga o‘tish",
    startMapBtn: "Mavzular xaritasini ochish",
    editAnswersBtn: "← Javoblarni o‘zgartirish"
  }
};

const COPY: Record<
  Language,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaTryDemo: string;
    ctaChooseSubject: string;
    ctaSetupLearning: string;
    catalogLink: string;
    profileLink: string;
    demoSectionTitle: string;
    demoSectionSubtitle: string;
    demoRemindRuleBtn: string;
    demoHideRuleBtn: string;
    demoRulePrefix: string;
    demoFollowUpBadge: string;
    demoBackToMainTaskBtn: string;
    demoCheckBtn: string;
    demoHintBtn: string;
    demoHideHintBtn: string;
    demoEmptyWarning: string;
    demoWrongTitle: string;
    demoRetryPrompt: string;
    demoShowSolutionBtn: string;
    demoHideSolutionBtn: string;
    demoSolutionLabel: string;
    demoCorrectTitle: string;
    demoSimilarTaskBtn: string;
    solveStatusLabels: Record<AttemptSolveMode, string>;
    howTitle: string;
    howSteps: Array<{ num: string; title: string; body: string }>;
    subjectsTitle: (count: number) => string;
    subjectsNote: string;
    fullCourseBadge: string;
    starterCourseBadge: string;
    openSubjectOverview: string;
    onboardingTitle: string;
    onboardingSubtitle: string;
    footerAbout: string;
    footerPrivacy: string;
    footerTeacher: string;
    footerGithub: string;
  }
> = {
  ru: {
    eyebrow: "Образовательная платформа · RU / ҚАЗ / OʻZB",
    title: "Разберись в теме и научись решать самостоятельно",
    subtitle:
      "Пошаговые уроки, практика с разбором причины ошибки и закрепление на похожих задачах.",
    ctaTryDemo: "Попробовать задачу",
    ctaChooseSubject: "Выбрать предмет",
    ctaSetupLearning: "Настроить обучение",
    catalogLink: "Предметы (12)",
    profileLink: "Профиль",
    demoSectionTitle: "Попробуй задачу",
    demoSectionSubtitle: "Выбери предмет, дай ответ и посмотри разбор шага.",
    demoRemindRuleBtn: "Напомнить правило",
    demoHideRuleBtn: "Скрыть правило",
    demoRulePrefix: "Правило:",
    demoFollowUpBadge: "Похожая задача для самостоятельной проверки",
    demoBackToMainTaskBtn: "Вернуться к первой задаче",
    demoCheckBtn: "Проверить ответ",
    demoHintBtn: "Подсказка",
    demoHideHintBtn: "Скрыть подсказку",
    demoEmptyWarning: "Выберите вариант ответа",
    demoWrongTitle: "Пока неверно",
    demoRetryPrompt: "Попробуй выбрать другой вариант или открой пошаговое решение.",
    demoShowSolutionBtn: "Показать решение",
    demoHideSolutionBtn: "Скрыть решение",
    demoSolutionLabel: "Пошаговый разбор:",
    demoCorrectTitle: "Верно!",
    demoSimilarTaskBtn: "Решить похожую задачу →",
    solveStatusLabels: {
      independent: "Решено самостоятельно",
      second_try: "Решено после исправления ошибки",
      assisted: "Решено с подсказкой",
      after_solution: "После просмотра решения"
    },
    howTitle: "Как устроено обучение",
    howSteps: [
      {
        num: "1",
        title: "Выбери тему",
        body: "Открой нужный предмет, прочитай короткое объяснение и разбери пример по шагам."
      },
      {
        num: "2",
        title: "Реши и разбери ошибку",
        body: "При неверном ответе платформа объясняет, в чём именно ловушка выбранного варианта, и даёт исправить шаг."
      },
      {
        num: "3",
        title: "Проверь себя на новой задаче",
        body: "Закрепи правило на аналогичном примере и открой следующую тему на карте предмета."
      }
    ],
    subjectsTitle: (count) => `Доступные предметы (${count})`,
    subjectsNote:
      "В профильной математике доступен расширенный курс (16 уроков), по остальным 11 предметам — стартовые модули (по 3 базовых урока и практика).",
    fullCourseBadge: "Расширенный курс",
    starterCourseBadge: "Стартовый курс",
    openSubjectOverview: "Открыть предмет →",
    onboardingTitle: "Настроить обучение под свою цель",
    onboardingSubtitle:
      "Необязательная анкета из 4 вопросов: выберите предметы и уровень или сразу перейдите в каталог.",
    footerAbout: "О платформе и методике",
    footerPrivacy: "Конфиденциальность и хранение данных",
    footerTeacher: "Кабинет преподавателя",
    footerGithub: "Исходный код на GitHub ↗"
  },
  kk: {
    eyebrow: "Білім беру платформасы · RU / ҚАЗ / OʻZB",
    title: "Тақырыпты түсініп, өз бетіңше шығаруды үйрен",
    subtitle:
      "Қадамдық сабақтар, қатенің себебін талдайтын практика және ұқсас есептермен бекіту.",
    ctaTryDemo: "Тапсырманы орындап көру",
    ctaChooseSubject: "Пәнді таңдау",
    ctaSetupLearning: "Оқуды баптау",
    catalogLink: "Пәндер (12)",
    profileLink: "Профиль",
    demoSectionTitle: "Тапсырманы орындап көр",
    demoSectionSubtitle: "Пәнді таңдап, жауап беріңіз және қадамдық талдауды көріңіз.",
    demoRemindRuleBtn: "Ережені еске салу",
    demoHideRuleBtn: "Ережені жасыру",
    demoRulePrefix: "Ереже:",
    demoFollowUpBadge: "Өзін-өзі тексеруге арналған ұқсас есеп",
    demoBackToMainTaskBtn: "Бірінші есепке оралу",
    demoCheckBtn: "Жауапты тексеру",
    demoHintBtn: "Кеңес",
    demoHideHintBtn: "Кеңесті жасыру",
    demoEmptyWarning: "Жауап нұсқасын таңдаңыз",
    demoWrongTitle: "Әзірге қате",
    demoRetryPrompt: "Басқа нұсқаны таңдап көріңіз немесе шешімді ашыңыз.",
    demoShowSolutionBtn: "Шешімді көрсету",
    demoHideSolutionBtn: "Шешімді жасыру",
    demoSolutionLabel: "Қадамдық шешім:",
    demoCorrectTitle: "Дұрыс!",
    demoSimilarTaskBtn: "Ұқсас есепті шығару →",
    solveStatusLabels: {
      independent: "Өз бетінше шығарылды",
      second_try: "Қатені түзеткен соң шығарылды",
      assisted: "Кеңеспен шығарылды",
      after_solution: "Шешімді көргеннен кейін"
    },
    howTitle: "Оқыту қалай құрылған",
    howSteps: [
      {
        num: "1",
        title: "Тақырыпты таңда",
        body: "Қажетті пәнді ашып, қысқа түсіндірмені оқып, мысалды қадамдап талда."
      },
      {
        num: "2",
        title: "Шығар және қатені талда",
        body: "Қате жауап болса, жүйе таңдалған нұсқаның тұзағын түсіндіріп, қайта көруге мүмкіндік береді."
      },
      {
        num: "3",
        title: "Жаңа есепте өзіңді тексер",
        body: "Ережені ұқсас тапсырмада бекітіп, келесі тақырыпқа өт."
      }
    ],
    subjectsTitle: (count) => `Қолжетімді пәндер (${count})`,
    subjectsNote:
      "Профильдік математикада кеңейтілген курс (16 сабақ), ал қалған 11 пәнде бастапқы модульдер (3 базалық сабақ пен практика) қолжетімді.",
    fullCourseBadge: "Кеңейтілген курс",
    starterCourseBadge: "Бастапқы курс",
    openSubjectOverview: "Пәнді ашу →",
    onboardingTitle: "Оқуды өз мақсатыңа сай баптау",
    onboardingSubtitle:
      "4 сұрақтан тұратын қосымша сауалнама: пәндер мен деңгейді таңдаңыз немесе бірден каталогқа өтіңіз.",
    footerAbout: "Жоба және әдістеме туралы",
    footerPrivacy: "Құпиялылық және деректерді сақтау",
    footerTeacher: "Оқытушы кабинеті",
    footerGithub: "GitHub бастапқы коды ↗"
  },
  uz: {
    eyebrow: "Ta’lim platformasi · RU / ҚАЗ / OʻZB",
    title: "Mavzuni tushunib, mustaqil yechishni o‘rganing",
    subtitle:
      "Qadamma-qadam darslar, xato sababini tahlil qiluvchi amaliyot va o‘xshash masalalarda mustahkamlash.",
    ctaTryDemo: "Masalani yechib ko‘rish",
    ctaChooseSubject: "Fanni tanlash",
    ctaSetupLearning: "O‘qishni sozlash",
    catalogLink: "Fanlar (12)",
    profileLink: "Profil",
    demoSectionTitle: "Masalani yechib ko‘ring",
    demoSectionSubtitle: "Fanni tanlang, javob bering va qadam tahlilini ko‘ring.",
    demoRemindRuleBtn: "Qoidani eslatish",
    demoHideRuleBtn: "Qoidani yashirish",
    demoRulePrefix: "Qoida:",
    demoFollowUpBadge: "Mustaqil tekshirish uchun o‘xshash masala",
    demoBackToMainTaskBtn: "Birinchi masalaga qaytish",
    demoCheckBtn: "Javobni tekshirish",
    demoHintBtn: "Maslahat",
    demoHideHintBtn: "Maslahatni yashirish",
    demoEmptyWarning: "Javob variantini tanlang",
    demoWrongTitle: "Hozircha noto‘g‘ri",
    demoRetryPrompt: "Boshqa variantni tanlab ko‘ring yoki yechimni oching.",
    demoShowSolutionBtn: "Yechimni ko‘rsatish",
    demoHideSolutionBtn: "Yechimni yashirish",
    demoSolutionLabel: "Qadamma-qadam yechim:",
    demoCorrectTitle: "To‘g‘ri!",
    demoSimilarTaskBtn: "O‘xshash masalani yechish →",
    solveStatusLabels: {
      independent: "Mustaqil yechildi",
      second_try: "Xatoni tuzatgach yechildi",
      assisted: "Maslahat yordamida yechildi",
      after_solution: "Yechim ko‘rilgandan so‘ng"
    },
    howTitle: "Ta’lim qanday tuzilgan",
    howSteps: [
      {
        num: "1",
        title: "Mavzuni tanlang",
        body: "Kerakli fanni oching, qisqa tushuntirishni o‘qing va namunani qadamma-qadam ko‘rib chiqing."
      },
      {
        num: "2",
        title: "Yeching va xatoni tahlil qiling",
        body: "Xato javobda tizim tanlangan variant tuzog‘ini tushuntiradi va qayta urinib ko‘rish imkonini beradi."
      },
      {
        num: "3",
        title: "Yangi masalada o‘zingizni синаб ko‘ring",
        body: "Qoidani o‘xshash misolda mustahkamlang va keyingi mavzuga o‘ting."
      }
    ],
    subjectsTitle: (count) => `Mavjud fanlar (${count})`,
    subjectsNote:
      "chuqurlashtirilgan matematikada kengaytirilgan kurs (16 dars), qolgan 11 fanda boshlang‘ich modullar (3 ta bazaviy dars va amaliyot) mavjud.",
    fullCourseBadge: "Kengaytirilgan kurs",
    starterCourseBadge: "Boshlang‘ich kurs",
    openSubjectOverview: "Fanni ochish →",
    onboardingTitle: "O‘qishni o‘z maqsadingizga moslash",
    onboardingSubtitle:
      "4 ta savoldan iborat ixtiyoriy so‘rovnoma: fan va darajani tanlang yoki darhol katalogga o‘ting.",
    footerAbout: "Loyiha va metodika haqida",
    footerPrivacy: "Maxfiylik va ma’lumotlarni saqlash",
    footerTeacher: "O‘qituvchi kabineti",
    footerGithub: "GitHub manba kodi ↗"
  }
};

export function WelcomeClient({ initialLang }: { initialLang?: Language } = {}) {
  const { lang, changeLanguage: handleLangChange } = useAuxiliaryPageNavigation(initialLang ?? "ru");
  const { dark, toggleTheme } = useAniqTheme();
  const t = COPY[lang];
  const ob = ONBOARDING_COPY[lang];

  const allCurricula = getAllSubjectCurricula();

  // Interactive 5-Subject Demo state
  const [demoSubjectIndex, setDemoSubjectIndex] = useState(0);
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [emptyWarning, setEmptyWarning] = useState(false);
  const [ruleOpen, setRuleOpen] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const [usedRuleOrHint, setUsedRuleOrHint] = useState(false);
  const [wrongAttemptsCount, setWrongAttemptsCount] = useState(0);
  const [checkedState, setCheckedState] = useState<"idle" | "wrong" | "correct">("idle");
  const [solveMode, setSolveMode] = useState<AttemptSolveMode>("independent");

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Honest Onboarding state (nothing pre-selected until user chooses or loads saved completed state)
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [onboardingSkipped, setOnboardingSkipped] = useState(false);
  const [role, setRole] = useState<UserLearnerRole | null>(null);
  const [goal, setGoal] = useState<UserLearningGoal | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [primaryStartSubject, setPrimaryStartSubject] = useState<string | null>(null);
  const [level, setLevel] = useState<UserInitialLevel | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(UNIVERSAL_PROGRESS_STORAGE_KEY);
      if (raw) {
        const state = migrateUniversalProgressState(raw);
        if (state.onboarding.completed && state.onboarding.selectedSubjects.length > 0) {
          setRole(state.onboarding.role);
          setGoal(state.onboarding.goal);
          setSelectedSubjects(state.onboarding.selectedSubjects);
          setPrimaryStartSubject(state.onboarding.selectedSubjects[0] ?? null);
          setLevel(state.onboarding.level);
          setOnboardingStep(5);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const resetDemoTaskState = (nextFollowUp = false) => {
    setIsFollowUp(nextFollowUp);
    setSelectedOption(null);
    setEmptyWarning(false);
    setRuleOpen(false);
    setHintOpen(false);
    setSolutionRevealed(false);
    setUsedRuleOrHint(false);
    setWrongAttemptsCount(0);
    setCheckedState("idle");
    setSolveMode("independent");
  };

  const selectDemoSubject = (idx: number, focusTab = false) => {
    setDemoSubjectIndex(idx);
    resetDemoTaskState(false);
    if (focusTab) {
      tabRefs.current[idx]?.focus();
    }
  };

  const handleDemoTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const count = WELCOME_DEMO_ITEMS.length;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      selectDemoSubject((idx + 1) % count, true);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      selectDemoSubject((idx - 1 + count) % count, true);
    } else if (e.key === "Home") {
      e.preventDefault();
      selectDemoSubject(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      selectDemoSubject(count - 1, true);
    }
  };

  const activeDemo = WELCOME_DEMO_ITEMS[demoSubjectIndex] ?? WELCOME_DEMO_ITEMS[0];
  const activeQuestion = isFollowUp ? activeDemo.followUpQuestion : activeDemo.question;
  const optionsList = activeQuestion.options?.[lang] ?? [];

  const handleToggleRule = () => {
    const next = !ruleOpen;
    setRuleOpen(next);
    if (next && checkedState !== "correct") {
      setUsedRuleOrHint(true);
    }
  };

  const handleToggleHint = () => {
    const next = !hintOpen;
    setHintOpen(next);
    if (next && checkedState !== "correct") {
      setUsedRuleOrHint(true);
    }
  };

  const handleCheckDemoAnswer = () => {
    if (selectedOption === null) {
      setEmptyWarning(true);
      return;
    }
    setEmptyWarning(false);

    if (selectedOption === activeQuestion.correctIndex) {
      let mode: AttemptSolveMode = "independent";
      if (solutionRevealed) {
        mode = "after_solution";
      } else if (usedRuleOrHint) {
        mode = "assisted";
      } else if (wrongAttemptsCount > 0) {
        mode = "second_try";
      }
      setSolveMode(mode);
      setCheckedState("correct");
    } else {
      setWrongAttemptsCount((prev) => prev + 1);
      setCheckedState("wrong");
    }
  };

  const toggleOnboardingSubject = (subjId: string) => {
    setStepError(null);
    setSelectedSubjects((prev) => {
      const next = prev.includes(subjId)
        ? prev.filter((id) => id !== subjId)
        : [...prev, subjId];
      setPrimaryStartSubject((currPrimary) => {
        if (next.length === 0) return null;
        if (currPrimary && next.includes(currPrimary)) return currPrimary;
        return next[0];
      });
      return next;
    });
  };

  const canReachOnboardingStep = (targetStep: 1 | 2 | 3 | 4 | 5): boolean => {
    if (targetStep === 1) return true;
    if (targetStep === 2) return role !== null;
    if (targetStep === 3) return role !== null && goal !== null;
    if (targetStep === 4) return role !== null && goal !== null && selectedSubjects.length > 0;
    return role !== null && goal !== null && selectedSubjects.length > 0 && level !== null;
  };

  const persistOnboardingIfComplete = (
    nextRole: UserLearnerRole,
    nextGoal: UserLearningGoal,
    nextSubjects: string[],
    nextLevel: UserInitialLevel,
    preferredPrimary?: string | null
  ) => {
    const orderedSubjects =
      preferredPrimary && nextSubjects.includes(preferredPrimary)
        ? [preferredPrimary, ...nextSubjects.filter((id) => id !== preferredPrimary)]
        : nextSubjects;
    try {
      const raw = window.localStorage.getItem(UNIVERSAL_PROGRESS_STORAGE_KEY);
      const current = raw ? migrateUniversalProgressState(raw) : createDefaultUniversalProgressState();
      const updated = saveOnboardingSelection(current, {
        role: nextRole,
        goal: nextGoal,
        selectedSubjects: orderedSubjects,
        level: nextLevel
      });
      window.localStorage.setItem(UNIVERSAL_PROGRESS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const finishOnboardingAndNavigate = (
    targetMode: "lesson" | "diagnostic" | "practice" | "map"
  ) => {
    if (!role || !goal || selectedSubjects.length === 0 || !level) return;
    const targetSubject =
      primaryStartSubject && selectedSubjects.includes(primaryStartSubject)
        ? primaryStartSubject
        : selectedSubjects[0];
    persistOnboardingIfComplete(role, goal, selectedSubjects, level, targetSubject);
    window.location.href = `/subjects/${targetSubject}?start=${targetMode}&lang=${lang}`;
  };

  const activeStartSubjectId =
    primaryStartSubject && selectedSubjects.includes(primaryStartSubject)
      ? primaryStartSubject
      : selectedSubjects[0] ?? "math";
  const activeStartSubjectTitle =
    UNT_SUBJECTS.find((s) => s.id === activeStartSubjectId)?.title[lang] ?? activeStartSubjectId;

  const wrongOptionDiagnosis =
    selectedOption !== null
      ? activeQuestion.optionDiagnoses?.[lang]?.[selectedOption] ?? activeQuestion.hint[lang]
      : activeQuestion.hint[lang];

  return (
    <div
      className="study-root welcome-standalone-root"
      style={{
        background: "var(--bilimai-bg)",
        color: "var(--bilimai-text)",
        minHeight: "100vh"
      }}
    >
      <header
        className="study-topbar"
        style={{
          background: "var(--bilimai-header-bg)",
          borderBottom: "1px solid var(--bilimai-border)"
        }}
      >
        <div className="study-topbar-inner">
          <div className="study-brand-row">
            <Link href={`/welcome?lang=${lang}`} className="brand-link" aria-label="BilimAI">
              <PixelBrandMark size={26} />
              <span className="brand-title" style={{ color: "var(--bilimai-text)", fontWeight: 700 }}>
                BilimAI
              </span>
            </Link>
            <span className="brand-Sep hide-on-narrow-mobile" aria-hidden="true">
              /
            </span>
            <span
              className="brand-subtitle hide-on-narrow-mobile"
              style={{ color: "var(--bilimai-text-muted)" }}
            >
              {t.eyebrow}
            </span>
          </div>

          <div className="study-controls-row">
            <div className="lang-bar" role="group" aria-label="Language">
              {(
                [
                  ["ru", "RU"],
                  ["kk", "ҚАЗ"],
                  ["uz", "OʻZB"]
                ] as [Language, string][]
              ).map(([code, label]) => {
                const isActive = lang === code;
                return (
                  <button
                    key={code}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleLangChange(code)}
                    className={`lang-pill ${isActive ? "active" : ""}`}
                    style={{
                      background: isActive ? "var(--bilimai-brand)" : "transparent",
                      color: isActive ? "var(--bilimai-on-brand)" : "var(--bilimai-text-muted)"
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <ThemeToggleButton dark={dark} onToggle={toggleTheme} />

            <Link
              href={`/subjects?lang=${lang}`}
              className="top-UtilityLink hide-on-narrow-mobile"
              style={{ color: "var(--bilimai-text-muted)" }}
            >
              {t.catalogLink}
            </Link>

            <Link
              href={`/?tab=profile&lang=${lang}`}
              className="top-UtilityLink hide-on-narrow-mobile"
              style={{ color: "var(--bilimai-text-muted)" }}
            >
              {t.profileLink}
            </Link>

            <a
              href="#subjects-catalog"
              className="btn-primary welcome-top-cta hide-on-narrow-mobile"
              style={{
                background: "var(--bilimai-brand)",
                color: "var(--bilimai-on-brand)"
              }}
            >
              {t.ctaChooseSubject}
            </a>
          </div>
        </div>
      </header>

      <main className="welcome-standalone-main">
        {/* 1. HERO + INTERACTIVE MINI LEARNING LOOP DEMO */}
        <section className="welcome-hero-grid" aria-labelledby="welcome-h1">
          <div className="welcome-hero-copy">
            <span
              className="lesson-kicker"
              style={{ color: "var(--bilimai-brand-text)" }}
            >
              {t.eyebrow}
            </span>
            <h1
              id="welcome-h1"
              className="welcome-main-title"
              style={{ color: "var(--bilimai-text)" }}
            >
              {t.title}
            </h1>
            <p
              className="welcome-main-lead"
              style={{ color: "var(--bilimai-text-muted)" }}
            >
              {t.subtitle}
            </p>

            <div className="welcome-cta-row">
              <a
                href="#interactive-multi-demo"
                className="btn-primary"
                data-testid="hero-cta-try-demo"
                style={{
                  background: "var(--bilimai-brand)",
                  color: "var(--bilimai-on-brand)",
                  minHeight: 44
                }}
              >
                {t.ctaTryDemo}
              </a>
              <a
                href="#subjects-catalog"
                className="btn-ghost"
                data-testid="hero-cta-choose-subject"
                style={{
                  background: "var(--bilimai-surface)",
                  color: "var(--bilimai-text)",
                  border: "1px solid var(--bilimai-border)",
                  minHeight: 44
                }}
              >
                {t.ctaChooseSubject}
              </a>
              <a
                href="#onboarding-wizard"
                className="btn-ghost"
                data-testid="hero-cta-setup-learning"
                onClick={() => setOnboardingSkipped(false)}
                style={{
                  background: "var(--bilimai-surface)",
                  color: "var(--bilimai-text)",
                  border: "1px solid var(--bilimai-border)",
                  minHeight: 44
                }}
              >
                {t.ctaSetupLearning}
              </a>
            </div>
          </div>

          {/* Interactive 5-Subject Mini Learning Loop Card */}
          <div
            id="interactive-multi-demo"
            className="welcome-mini-card"
            data-testid="welcome-5subject-demo"
            style={{
              display: "grid",
              gap: 14,
              background: "var(--bilimai-surface)",
              border: "1px solid var(--bilimai-border)",
              color: "var(--bilimai-text)"
            }}
          >
            <div>
              <h2
                id="demo-heading"
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--bilimai-text)"
                }}
              >
                {t.demoSectionTitle}
              </h2>
              <p
                className="muted-note"
                style={{ margin: "4px 0 0", color: "var(--bilimai-text-muted)" }}
              >
                {t.demoSectionSubtitle}
              </p>
            </div>

            {/* WAI-ARIA Subject Switcher Tablist */}
            <div
              role="tablist"
              aria-labelledby="demo-heading"
              className="welcome-demo-tablist"
              style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
            >
              {WELCOME_DEMO_ITEMS.map((item, idx) => {
                const active = idx === demoSubjectIndex;
                return (
                  <button
                    key={item.subjectId}
                    ref={(el) => {
                      tabRefs.current[idx] = el;
                    }}
                    id={`demo-tab-${item.subjectId}`}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="welcome-demo-tabpanel"
                    tabIndex={active ? 0 : -1}
                    data-testid={`welcome-demo-tab-${item.subjectId}`}
                    onClick={() => selectDemoSubject(idx)}
                    onKeyDown={(e) => handleDemoTabKeyDown(e, idx)}
                    style={{
                      minHeight: 40,
                      padding: "7px 13px",
                      borderRadius: 999,
                      border: active
                        ? "1.5px solid var(--bilimai-brand)"
                        : "1px solid var(--bilimai-border)",
                      background: active
                        ? "var(--bilimai-brand)"
                        : "var(--bilimai-surface-raised)",
                      color: active ? "var(--bilimai-on-brand)" : "var(--bilimai-text)",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    {item.subjectTitle[lang]}
                  </button>
                );
              })}
            </div>

            {/* Tabpanel: Task Prompt First -> Optional Rule Toggle -> Radio Options -> Feedback */}
            <div
              id="welcome-demo-tabpanel"
              role="tabpanel"
              aria-labelledby={`demo-tab-${activeDemo.subjectId}`}
              style={{
                display: "grid",
                gap: 12,
                padding: "14px 16px",
                borderRadius: 12,
                background: "var(--bilimai-surface-raised)",
                border: "1px solid var(--bilimai-border)"
              }}
            >
              {isFollowUp && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 8
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "3px 9px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      background: "var(--bilimai-selected-bg)",
                      color: "var(--bilimai-selected-text)"
                    }}
                  >
                    {t.demoFollowUpBadge}
                  </span>
                  <button
                    type="button"
                    onClick={() => resetDemoTaskState(false)}
                    style={{
                      background: "transparent",
                      border: 0,
                      padding: "2px 4px",
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "var(--bilimai-brand-text)",
                      textDecoration: "underline",
                      cursor: "pointer"
                    }}
                  >
                    {t.demoBackToMainTaskBtn}
                  </button>
                </div>
              )}

              {/* 1. Task Prompt First */}
              <div
                data-testid="demo-task-prompt"
                style={{
                  fontSize: 15.5,
                  fontWeight: 700,
                  lineHeight: 1.45,
                  color: "var(--bilimai-text)"
                }}
              >
                {activeQuestion.prompt[lang]}
              </div>

              {/* 2. Rule Hidden Behind Toggle Button */}
              <div>
                <button
                  type="button"
                  data-testid="demo-toggle-rule-btn"
                  aria-expanded={ruleOpen}
                  onClick={handleToggleRule}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    minHeight: 36,
                    padding: "5px 11px",
                    borderRadius: 8,
                    border: "1px solid var(--bilimai-border)",
                    background: "var(--bilimai-surface)",
                    color: "var(--bilimai-brand-text)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  {ruleOpen ? t.demoHideRuleBtn : t.demoRemindRuleBtn}
                </button>

                {ruleOpen && (
                  <div
                    data-testid="demo-rule-box"
                    style={{
                      marginTop: 8,
                      padding: "10px 12px",
                      borderRadius: 9,
                      background: "var(--bilimai-selected-bg)",
                      border: "1px solid var(--bilimai-selected-border)",
                      color: "var(--bilimai-text)",
                      fontSize: 13.5,
                      lineHeight: 1.45
                    }}
                  >
                    <strong>{t.demoRulePrefix}</strong> {activeDemo.contextNote[lang]}
                  </div>
                )}
              </div>

              {/* 3. Native Radio Options Group */}
              <fieldset
                style={{
                  border: 0,
                  margin: 0,
                  padding: 0,
                  display: "grid",
                  gap: 8
                }}
              >
                <legend className="sr-only">{activeQuestion.prompt[lang]}</legend>
                {optionsList.map((opt, idx) => {
                  const selected = selectedOption === idx;
                  return (
                    <label
                      key={idx}
                      data-testid={`demo-option-${idx}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        minHeight: 44,
                        padding: "10px 13px",
                        borderRadius: 10,
                        border: selected
                          ? "2px solid var(--bilimai-selected-border)"
                          : "1px solid var(--bilimai-border)",
                        background: selected
                          ? "var(--bilimai-selected-bg)"
                          : "var(--bilimai-surface)",
                        color: selected
                          ? "var(--bilimai-selected-text)"
                          : "var(--bilimai-text)",
                        fontWeight: selected ? 600 : 500,
                        fontSize: 14,
                        lineHeight: 1.4,
                        cursor: "pointer"
                      }}
                    >
                      <input
                        type="radio"
                        name={`demo-q-${activeQuestion.id}`}
                        checked={selected}
                        onChange={() => {
                          setSelectedOption(idx);
                          setEmptyWarning(false);
                          if (checkedState === "wrong") {
                            setCheckedState("idle");
                          }
                        }}
                        style={{
                          width: 18,
                          height: 18,
                          margin: 0,
                          accentColor: "var(--bilimai-brand)",
                          flexShrink: 0,
                          cursor: "pointer"
                        }}
                      />
                      <span>
                        <strong>{String.fromCharCode(65 + idx)}.</strong> {opt}
                      </span>
                    </label>
                  );
                })}
              </fieldset>

              {/* 4. Check & Hint Buttons */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                <button
                  type="button"
                  data-testid="demo-check-btn"
                  onClick={handleCheckDemoAnswer}
                  style={{
                    minHeight: 44,
                    padding: "9px 18px",
                    borderRadius: 9,
                    border: "1px solid var(--bilimai-brand)",
                    background: "var(--bilimai-brand)",
                    color: "var(--bilimai-on-brand)",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer"
                  }}
                >
                  {t.demoCheckBtn}
                </button>

                <button
                  type="button"
                  data-testid="demo-hint-btn"
                  aria-expanded={hintOpen}
                  onClick={handleToggleHint}
                  style={{
                    minHeight: 44,
                    padding: "9px 14px",
                    borderRadius: 9,
                    border: "1px solid var(--bilimai-border)",
                    background: "var(--bilimai-surface)",
                    color: "var(--bilimai-text)",
                    fontWeight: 600,
                    fontSize: 13.5,
                    cursor: "pointer"
                  }}
                >
                  {hintOpen ? t.demoHideHintBtn : t.demoHintBtn}
                </button>
              </div>

              {hintOpen && (
                <div
                  data-testid="demo-hint-box"
                  style={{
                    padding: "10px 12px",
                    borderRadius: 9,
                    background: "var(--bilimai-warning-bg)",
                    border: "1px solid var(--bilimai-warning-border)",
                    color: "var(--bilimai-warning-text)",
                    fontSize: 13.5,
                    lineHeight: 1.45
                  }}
                >
                  {activeQuestion.hint[lang]}
                </div>
              )}

              {/* 5. Empty Submission Inline Alert */}
              {emptyWarning && (
                <div
                  role="alert"
                  data-testid="demo-empty-warning"
                  style={{
                    padding: "10px 12px",
                    borderRadius: 9,
                    background: "var(--bilimai-warning-bg)",
                    border: "1px solid var(--bilimai-warning-border)",
                    color: "var(--bilimai-warning-text)",
                    fontSize: 13.5,
                    fontWeight: 600
                  }}
                >
                  {t.demoEmptyWarning}
                </div>
              )}

              {/* 6. Wrong Answer Diagnostic Feedback (Option-Specific Trap + Retry + Optional Solution) */}
              {checkedState === "wrong" && (
                <div
                  role="status"
                  data-testid="demo-feedback-wrong"
                  style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    background: "var(--bilimai-error-bg)",
                    border: "1px solid var(--bilimai-error-border)",
                    color: "var(--bilimai-error-text)",
                    display: "grid",
                    gap: 8,
                    fontSize: 13.5,
                    lineHeight: 1.45
                  }}
                >
                  <strong style={{ fontSize: 14.5 }}>{t.demoWrongTitle}</strong>
                  <p style={{ margin: 0 }}>{wrongOptionDiagnosis}</p>
                  <p style={{ margin: 0, fontWeight: 600 }}>{t.demoRetryPrompt}</p>

                  <div>
                    <button
                      type="button"
                      data-testid="demo-show-solution-btn"
                      aria-expanded={solutionRevealed}
                      onClick={() => setSolutionRevealed((prev) => !prev)}
                      style={{
                        minHeight: 38,
                        padding: "6px 12px",
                        borderRadius: 8,
                        border: "1px solid var(--bilimai-error-border)",
                        background: "var(--bilimai-surface)",
                        color: "var(--bilimai-text)",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      {solutionRevealed ? t.demoHideSolutionBtn : t.demoShowSolutionBtn}
                    </button>
                  </div>

                  {solutionRevealed && (
                    <div
                      data-testid="demo-solution-box"
                      style={{
                        padding: "10px 12px",
                        borderRadius: 8,
                        background: "var(--bilimai-surface)",
                        border: "1px solid var(--bilimai-border)",
                        color: "var(--bilimai-text)"
                      }}
                    >
                      <strong>{t.demoSolutionLabel}</strong> {activeQuestion.explanation[lang]}
                    </div>
                  )}
                </div>
              )}

              {/* 7. Correct Answer Feedback + Solve Mode Badge + Similar Task Button */}
              {checkedState === "correct" && (
                <div
                  role="status"
                  data-testid="demo-feedback-correct"
                  style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    background: "var(--bilimai-success-bg)",
                    border: "1px solid var(--bilimai-success-border)",
                    color: "var(--bilimai-success-text)",
                    display: "grid",
                    gap: 8,
                    fontSize: 13.5,
                    lineHeight: 1.45
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 8
                    }}
                  >
                    <strong style={{ fontSize: 15 }}>{t.demoCorrectTitle}</strong>
                    <span
                      data-testid="demo-attempt-status"
                      style={{
                        padding: "3px 9px",
                        borderRadius: 999,
                        background: "var(--bilimai-surface)",
                        border: "1px solid var(--bilimai-success-border)",
                        color: "var(--bilimai-success-text)",
                        fontSize: 12,
                        fontWeight: 700
                      }}
                    >
                      {t.solveStatusLabels[solveMode]}
                    </span>
                  </div>

                  <p style={{ margin: 0 }}>{activeQuestion.explanation[lang]}</p>

                  {!isFollowUp && (
                    <div>
                      <button
                        type="button"
                        data-testid="demo-similar-task-btn"
                        onClick={() => resetDemoTaskState(true)}
                        style={{
                          minHeight: 40,
                          padding: "7px 14px",
                          borderRadius: 8,
                          border: "1px solid var(--bilimai-success-border)",
                          background: "var(--bilimai-surface)",
                          color: "var(--bilimai-text)",
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        {t.demoSimilarTaskBtn}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 8. Bottom Subject-Specific CTA */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8
              }}
            >
              <Link
                href={`/subjects/${activeDemo.subjectId}?lang=${lang}`}
                className="inline-action-link"
                data-testid="welcome-demo-open-subject-link"
                style={{
                  color: "var(--bilimai-brand-text)",
                  fontWeight: 700,
                  fontSize: 14
                }}
              >
                {activeDemo.subjectCtaLabel[lang]} →
              </Link>
            </div>
          </div>
        </section>

        {/* 2. HOW LEARNING WORKS (3 CONCISE STEPS) */}
        <section
          id="how-it-works"
          className="welcome-tools-section"
          aria-labelledby="welcome-how-h2"
        >
          <h2
            id="welcome-how-h2"
            className="section-title"
            style={{ color: "var(--bilimai-text)" }}
          >
            {t.howTitle}
          </h2>
          <div className="welcome-tools-grid">
            {t.howSteps.map((step) => (
              <article
                key={step.num}
                className="welcome-tool-card"
                style={{
                  background: "var(--bilimai-surface)",
                  border: "1px solid var(--bilimai-border)",
                  color: "var(--bilimai-text)"
                }}
              >
                <span
                  className="section-num"
                  style={{ color: "var(--bilimai-brand-text)" }}
                >
                  {ob.stepWord} {step.num}
                </span>
                <h3 style={{ color: "var(--bilimai-text)" }}>{step.title}</h3>
                <p style={{ color: "var(--bilimai-text-muted)" }}>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 3. HONEST 12-SUBJECT CATALOG (Visible descriptions on mobile & desktop, honest course badges) */}
        <section
          id="subjects-catalog"
          className="welcome-subjects-section"
          aria-labelledby="welcome-subjects-h2"
        >
          <div className="welcome-subjects-head">
            <h2
              id="welcome-subjects-h2"
              className="section-title"
              style={{ color: "var(--bilimai-text)" }}
            >
              {t.subjectsTitle(allCurricula.length)}
            </h2>
            <p className="muted-note" style={{ color: "var(--bilimai-text-muted)" }}>
              {t.subjectsNote}
            </p>
          </div>

          <div className="welcome-subject-grid profile">
            {allCurricula.map((subj) => {
              const totalQuestions = subj.lessons.reduce((acc, l) => acc + l.questions.length, 0);
              const isFullCourse = subj.lessons.length >= 10;
              return (
                <Link
                  key={subj.id}
                  href={`/subjects/${subj.id}?lang=${lang}`}
                  data-testid={`welcome-subject-card-${subj.id}`}
                  className="welcome-subject-card"
                  style={{
                    background: "var(--bilimai-surface)",
                    border: "1px solid var(--bilimai-border)",
                    color: "var(--bilimai-text)"
                  }}
                >
                  <div className="welcome-subject-top">
                    <SubjectIcon
                      subjectId={subj.id as import("@/lib/unt-all-subjects").UntSubjectId}
                      size={18}
                    />
                    <strong style={{ color: "var(--bilimai-text)" }}>{subj.title[lang]}</strong>
                  </div>
                  <p
                    className="welcome-subject-subtitle"
                    style={{
                      margin: "6px 0 10px",
                      fontSize: 13.5,
                      color: "var(--bilimai-text-muted)",
                      lineHeight: 1.45
                    }}
                  >
                    {subj.shortDescription?.[lang] ?? subj.subtitle[lang]}
                  </p>
                  <div className="welcome-subject-badges">
                    <span
                      className="welcome-subj-badge official"
                      style={{
                        background: isFullCourse
                          ? "var(--bilimai-selected-bg)"
                          : "var(--bilimai-surface-raised)",
                        color: isFullCourse
                          ? "var(--bilimai-selected-text)"
                          : "var(--bilimai-text-muted)",
                        border: "1px solid var(--bilimai-border)",
                        fontWeight: 600
                      }}
                    >
                      {isFullCourse ? t.fullCourseBadge : t.starterCourseBadge} ·{" "}
                      {formatLessonsCountLabel(subj.lessons.length, lang)} ·{" "}
                      {formatQuestionsCountLabel(totalQuestions, lang)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 4. HONEST ONBOARDING WIZARD (No pre-selected defaults, honest skip, single primary CTA) */}
        <section
          id="onboarding-wizard"
          data-testid="welcome-onboarding-wizard"
          aria-labelledby="welcome-onboarding-h2"
          style={{
            background: "var(--bilimai-surface)",
            border: "1px solid var(--bilimai-border)",
            color: "var(--bilimai-text)",
            borderRadius: 16,
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
            <div>
              <h2
                id="welcome-onboarding-h2"
                className="section-title"
                style={{ margin: 0, color: "var(--bilimai-text)" }}
              >
                {t.onboardingTitle}
              </h2>
              <p
                className="muted-note"
                style={{ margin: "4px 0 0", color: "var(--bilimai-text-muted)" }}
              >
                {t.onboardingSubtitle}
              </p>
            </div>

            {!onboardingSkipped && (
              <div style={{ display: "flex", gap: 6 }} role="group" aria-label="Onboarding steps">
                {([1, 2, 3, 4, 5] as const).map((stepNum) => {
                  const isCurrent = onboardingStep === stepNum;
                  const reachable = canReachOnboardingStep(stepNum);
                  return (
                    <button
                      key={stepNum}
                      type="button"
                      disabled={!reachable}
                      data-testid={`onboarding-step-btn-${stepNum}`}
                      onClick={() => {
                        if (reachable) {
                          setStepError(null);
                          setOnboardingStep(stepNum);
                        }
                      }}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 999,
                        border: isCurrent
                          ? "2px solid var(--bilimai-brand)"
                          : "1px solid var(--bilimai-border)",
                        background: isCurrent
                          ? "var(--bilimai-brand)"
                          : "var(--bilimai-surface-raised)",
                        color: isCurrent
                          ? "var(--bilimai-on-brand)"
                          : reachable
                            ? "var(--bilimai-text)"
                            : "var(--bilimai-text-muted)",
                        opacity: reachable ? 1 : 0.5,
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: reachable ? "pointer" : "not-allowed"
                      }}
                    >
                      {stepNum}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {onboardingSkipped ? (
            <div
              data-testid="onboarding-skipped-banner"
              style={{
                padding: "14px 16px",
                borderRadius: 12,
                background: "var(--bilimai-surface-raised)",
                border: "1px solid var(--bilimai-border)",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12
              }}
            >
              <p style={{ margin: 0, fontSize: 14, color: "var(--bilimai-text-muted)" }}>
                {ob.skippedText}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                <a
                  href="#subjects-catalog"
                  className="inline-action-link"
                  style={{ color: "var(--bilimai-brand-text)", fontWeight: 700 }}
                >
                  {ob.skippedCatalogLink}
                </a>
                <button
                  type="button"
                  data-testid="onboarding-restore-btn"
                  onClick={() => {
                    setOnboardingSkipped(false);
                    setStepError(null);
                  }}
                  style={{
                    minHeight: 40,
                    padding: "7px 14px",
                    borderRadius: 8,
                    border: "1px solid var(--bilimai-border)",
                    background: "var(--bilimai-surface)",
                    color: "var(--bilimai-text)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  {ob.restoreBtn}
                </button>
              </div>
            </div>
          ) : (
            <>
              {stepError && (
                <div
                  role="alert"
                  data-testid="onboarding-step-error"
                  style={{
                    padding: "10px 12px",
                    borderRadius: 9,
                    background: "var(--bilimai-warning-bg)",
                    border: "1px solid var(--bilimai-warning-border)",
                    color: "var(--bilimai-warning-text)",
                    fontSize: 13.5,
                    fontWeight: 600
                  }}
                >
                  {stepError}
                </div>
              )}

              {onboardingStep === 1 && (
                <div style={{ display: "grid", gap: 12 }}>
                  <strong style={{ fontSize: 16, color: "var(--bilimai-text)" }}>
                    {ob.step1Title}
                  </strong>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                      gap: 10
                    }}
                  >
                    {ob.roles.map((item) => {
                      const active = role === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={active}
                          data-testid={`onboarding-role-${item.id}`}
                          onClick={() => {
                            setRole(item.id);
                            setStepError(null);
                            setOnboardingStep(2);
                          }}
                          style={{
                            minHeight: 46,
                            padding: "12px 15px",
                            borderRadius: 10,
                            border: active
                              ? "2px solid var(--bilimai-selected-border)"
                              : "1px solid var(--bilimai-border)",
                            background: active
                              ? "var(--bilimai-selected-bg)"
                              : "var(--bilimai-surface-raised)",
                            color: active
                              ? "var(--bilimai-selected-text)"
                              : "var(--bilimai-text)",
                            fontWeight: 600,
                            textAlign: "left",
                            cursor: "pointer"
                          }}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      flexWrap: "wrap"
                    }}
                  >
                    <button
                      type="button"
                      data-testid="onboarding-skip"
                      onClick={() => {
                        setStepError(null);
                        setOnboardingSkipped(true);
                      }}
                      style={{
                        minHeight: 42,
                        padding: "8px 14px",
                        borderRadius: 8,
                        border: "1px solid var(--bilimai-border)",
                        background: "var(--bilimai-surface)",
                        color: "var(--bilimai-text-muted)",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      {ob.skipBtn}
                    </button>
                    <button
                      type="button"
                      data-testid="onboarding-next"
                      onClick={() => {
                        if (!role) {
                          setStepError(ob.step1Error);
                          return;
                        }
                        setStepError(null);
                        setOnboardingStep(2);
                      }}
                      style={{
                        minHeight: 42,
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "1px solid var(--bilimai-brand)",
                        background: "var(--bilimai-brand)",
                        color: "var(--bilimai-on-brand)",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      {ob.nextBtn}
                    </button>
                  </div>
                </div>
              )}

              {onboardingStep === 2 && (
                <div style={{ display: "grid", gap: 12 }}>
                  <strong style={{ fontSize: 16, color: "var(--bilimai-text)" }}>
                    {ob.step2Title}
                  </strong>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                      gap: 10
                    }}
                  >
                    {ob.goals.map((item) => {
                      const active = goal === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={active}
                          data-testid={`onboarding-goal-${item.id}`}
                          onClick={() => {
                            setGoal(item.id);
                            setStepError(null);
                            setOnboardingStep(3);
                          }}
                          style={{
                            minHeight: 46,
                            padding: "12px 15px",
                            borderRadius: 10,
                            border: active
                              ? "2px solid var(--bilimai-selected-border)"
                              : "1px solid var(--bilimai-border)",
                            background: active
                              ? "var(--bilimai-selected-bg)"
                              : "var(--bilimai-surface-raised)",
                            color: active
                              ? "var(--bilimai-selected-text)"
                              : "var(--bilimai-text)",
                            fontWeight: 600,
                            textAlign: "left",
                            cursor: "pointer"
                          }}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      flexWrap: "wrap"
                    }}
                  >
                    <button
                      type="button"
                      data-testid="onboarding-back"
                      onClick={() => {
                        setStepError(null);
                        setOnboardingStep(1);
                      }}
                      style={{
                        minHeight: 42,
                        padding: "8px 14px",
                        borderRadius: 8,
                        border: "1px solid var(--bilimai-border)",
                        background: "var(--bilimai-surface)",
                        color: "var(--bilimai-text)",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      {ob.backBtn}
                    </button>
                    <button
                      type="button"
                      data-testid="onboarding-next"
                      onClick={() => {
                        if (!goal) {
                          setStepError(ob.step2Error);
                          return;
                        }
                        setStepError(null);
                        setOnboardingStep(3);
                      }}
                      style={{
                        minHeight: 42,
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "1px solid var(--bilimai-brand)",
                        background: "var(--bilimai-brand)",
                        color: "var(--bilimai-on-brand)",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      {ob.nextBtn}
                    </button>
                  </div>
                </div>
              )}

              {onboardingStep === 3 && (
                <div style={{ display: "grid", gap: 12 }}>
                  <div>
                    <strong style={{ fontSize: 16, color: "var(--bilimai-text)" }}>
                      {ob.step3Title}
                    </strong>
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: 13,
                        color: "var(--bilimai-text-muted)"
                      }}
                    >
                      {ob.step3Hint}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {UNT_SUBJECTS.map((s) => {
                      const picked = selectedSubjects.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          aria-pressed={picked}
                          data-testid={`onboarding-subject-${s.id}`}
                          onClick={() => toggleOnboardingSubject(s.id)}
                          style={{
                            minHeight: 42,
                            padding: "8px 14px",
                            borderRadius: 999,
                            border: picked
                              ? "2px solid var(--bilimai-selected-border)"
                              : "1px solid var(--bilimai-border)",
                            background: picked
                              ? "var(--bilimai-selected-bg)"
                              : "var(--bilimai-surface-raised)",
                            color: picked
                              ? "var(--bilimai-selected-text)"
                              : "var(--bilimai-text)",
                            fontWeight: 600,
                            fontSize: 13.5,
                            cursor: "pointer"
                          }}
                        >
                          {picked ? "✓ " : ""}
                          {s.title[lang]}
                        </button>
                      );
                    })}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      flexWrap: "wrap"
                    }}
                  >
                    <button
                      type="button"
                      data-testid="onboarding-back"
                      onClick={() => {
                        setStepError(null);
                        setOnboardingStep(2);
                      }}
                      style={{
                        minHeight: 42,
                        padding: "8px 14px",
                        borderRadius: 8,
                        border: "1px solid var(--bilimai-border)",
                        background: "var(--bilimai-surface)",
                        color: "var(--bilimai-text)",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      {ob.backBtn}
                    </button>
                    <button
                      type="button"
                      data-testid="onboarding-next"
                      onClick={() => {
                        if (selectedSubjects.length === 0) {
                          setStepError(ob.step3Error);
                          return;
                        }
                        setStepError(null);
                        setOnboardingStep(4);
                      }}
                      style={{
                        minHeight: 42,
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "1px solid var(--bilimai-brand)",
                        background: "var(--bilimai-brand)",
                        color: "var(--bilimai-on-brand)",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      {ob.step3Next}
                    </button>
                  </div>
                </div>
              )}

              {onboardingStep === 4 && (
                <div style={{ display: "grid", gap: 12 }}>
                  <strong style={{ fontSize: 16, color: "var(--bilimai-text)" }}>
                    {ob.step4Title}
                  </strong>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: 10
                    }}
                  >
                    {ob.levels.map((item) => {
                      const active = level === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={active}
                          data-testid={`onboarding-level-${item.id}`}
                          onClick={() => {
                            setLevel(item.id);
                            setStepError(null);
                            if (role && goal && selectedSubjects.length > 0) {
                              persistOnboardingIfComplete(
                                role,
                                goal,
                                selectedSubjects,
                                item.id,
                                primaryStartSubject
                              );
                            }
                            setOnboardingStep(5);
                          }}
                          style={{
                            minHeight: 54,
                            padding: "12px 15px",
                            borderRadius: 10,
                            border: active
                              ? "2px solid var(--bilimai-selected-border)"
                              : "1px solid var(--bilimai-border)",
                            background: active
                              ? "var(--bilimai-selected-bg)"
                              : "var(--bilimai-surface-raised)",
                            color: active
                              ? "var(--bilimai-selected-text)"
                              : "var(--bilimai-text)",
                            fontWeight: 600,
                            textAlign: "left",
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                            cursor: "pointer"
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11.5,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              color: "var(--bilimai-brand-text)"
                            }}
                          >
                            {item.badge}
                          </span>
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      flexWrap: "wrap"
                    }}
                  >
                    <button
                      type="button"
                      data-testid="onboarding-back"
                      onClick={() => {
                        setStepError(null);
                        setOnboardingStep(3);
                      }}
                      style={{
                        minHeight: 42,
                        padding: "8px 14px",
                        borderRadius: 8,
                        border: "1px solid var(--bilimai-border)",
                        background: "var(--bilimai-surface)",
                        color: "var(--bilimai-text)",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      {ob.backBtn}
                    </button>
                    <button
                      type="button"
                      data-testid="onboarding-next"
                      onClick={() => {
                        if (!level) {
                          setStepError(ob.step4Error);
                          return;
                        }
                        if (role && goal && selectedSubjects.length > 0) {
                          persistOnboardingIfComplete(
                            role,
                            goal,
                            selectedSubjects,
                            level,
                            primaryStartSubject
                          );
                        }
                        setStepError(null);
                        setOnboardingStep(5);
                      }}
                      style={{
                        minHeight: 42,
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "1px solid var(--bilimai-brand)",
                        background: "var(--bilimai-brand)",
                        color: "var(--bilimai-on-brand)",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      {ob.nextBtn}
                    </button>
                  </div>
                </div>
              )}

              {onboardingStep === 5 && role && goal && selectedSubjects.length > 0 && level && (
                <div
                  data-testid="onboarding-summary-card"
                  style={{
                    padding: "18px 20px",
                    borderRadius: 12,
                    background: "var(--bilimai-surface-raised)",
                    border: "1px solid var(--bilimai-border)",
                    display: "grid",
                    gap: 14
                  }}
                >
                  <strong style={{ fontSize: 17, color: "var(--bilimai-text)" }}>
                    {ob.step5Title}
                  </strong>

                  <dl
                    style={{
                      margin: 0,
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: 10,
                      fontSize: 13.5
                    }}
                  >
                    <div
                      style={{
                        padding: "9px 12px",
                        borderRadius: 8,
                        background: "var(--bilimai-surface)",
                        border: "1px solid var(--bilimai-border)"
                      }}
                    >
                      <dt style={{ color: "var(--bilimai-text-muted)", fontSize: 12 }}>
                        {ob.summaryRole}
                      </dt>
                      <dd style={{ margin: "2px 0 0", fontWeight: 700 }}>
                        {ob.roles.find((r) => r.id === role)?.label ?? role}
                      </dd>
                    </div>

                    <div
                      style={{
                        padding: "9px 12px",
                        borderRadius: 8,
                        background: "var(--bilimai-surface)",
                        border: "1px solid var(--bilimai-border)"
                      }}
                    >
                      <dt style={{ color: "var(--bilimai-text-muted)", fontSize: 12 }}>
                        {ob.summaryGoal}
                      </dt>
                      <dd style={{ margin: "2px 0 0", fontWeight: 700 }}>
                        {ob.goals.find((g) => g.id === goal)?.label ?? goal}
                      </dd>
                    </div>

                    <div
                      style={{
                        padding: "9px 12px",
                        borderRadius: 8,
                        background: "var(--bilimai-surface)",
                        border: "1px solid var(--bilimai-border)"
                      }}
                    >
                      <dt style={{ color: "var(--bilimai-text-muted)", fontSize: 12 }}>
                        {ob.summarySubjects}
                      </dt>
                      <dd style={{ margin: "2px 0 0", fontWeight: 700 }}>
                        {selectedSubjects
                          .map((id) => UNT_SUBJECTS.find((s) => s.id === id)?.title[lang] ?? id)
                          .join(", ")}
                      </dd>
                    </div>

                    <div
                      style={{
                        padding: "9px 12px",
                        borderRadius: 8,
                        background: "var(--bilimai-surface)",
                        border: "1px solid var(--bilimai-border)"
                      }}
                    >
                      <dt style={{ color: "var(--bilimai-text-muted)", fontSize: 12 }}>
                        {ob.summaryLevel}
                      </dt>
                      <dd style={{ margin: "2px 0 0", fontWeight: 700 }}>
                        {ob.levels.find((l) => l.id === level)?.label ?? level}
                      </dd>
                    </div>
                  </dl>

                  {selectedSubjects.length > 1 && (
                    <div style={{ display: "grid", gap: 6 }}>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--bilimai-text-muted)"
                        }}
                      >
                        {ob.chooseStartSubjectLabel}
                      </span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {selectedSubjects.map((subjId) => {
                          const active = activeStartSubjectId === subjId;
                          const subjTitle =
                            UNT_SUBJECTS.find((s) => s.id === subjId)?.title[lang] ?? subjId;
                          return (
                            <button
                              key={subjId}
                              type="button"
                              aria-pressed={active}
                              data-testid={`onboarding-start-subject-${subjId}`}
                              onClick={() => setPrimaryStartSubject(subjId)}
                              style={{
                                minHeight: 38,
                                padding: "6px 12px",
                                borderRadius: 999,
                                border: active
                                  ? "2px solid var(--bilimai-brand)"
                                  : "1px solid var(--bilimai-border)",
                                background: active
                                  ? "var(--bilimai-selected-bg)"
                                  : "var(--bilimai-surface)",
                                color: active
                                  ? "var(--bilimai-selected-text)"
                                  : "var(--bilimai-text)",
                                fontWeight: 600,
                                fontSize: 13,
                                cursor: "pointer"
                              }}
                            >
                              {subjTitle}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ONE Primary CTA + Secondary Actions */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                    <button
                      type="button"
                      data-testid="onboarding-finish-lesson"
                      onClick={() => finishOnboardingAndNavigate("lesson")}
                      style={{
                        minHeight: 44,
                        padding: "10px 18px",
                        borderRadius: 9,
                        border: "1px solid var(--bilimai-brand)",
                        background: "var(--bilimai-brand)",
                        color: "var(--bilimai-on-brand)",
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: "pointer"
                      }}
                    >
                      {ob.startLessonBtn(activeStartSubjectTitle)}
                    </button>

                    <button
                      type="button"
                      data-testid="onboarding-finish-diagnostic"
                      onClick={() => finishOnboardingAndNavigate("diagnostic")}
                      style={{
                        minHeight: 44,
                        padding: "10px 15px",
                        borderRadius: 9,
                        border: "1px solid var(--bilimai-border)",
                        background: "var(--bilimai-surface)",
                        color: "var(--bilimai-text)",
                        fontWeight: 600,
                        fontSize: 13.5,
                        cursor: "pointer"
                      }}
                    >
                      {ob.startDiagnosticBtn}
                    </button>

                    <button
                      type="button"
                      data-testid="onboarding-finish-practice"
                      onClick={() => finishOnboardingAndNavigate("practice")}
                      style={{
                        minHeight: 44,
                        padding: "10px 14px",
                        borderRadius: 9,
                        border: "1px solid var(--bilimai-border)",
                        background: "var(--bilimai-surface)",
                        color: "var(--bilimai-text)",
                        fontWeight: 600,
                        fontSize: 13.5,
                        cursor: "pointer"
                      }}
                    >
                      {ob.startPracticeBtn}
                    </button>

                    <button
                      type="button"
                      data-testid="onboarding-finish-map"
                      onClick={() => finishOnboardingAndNavigate("map")}
                      style={{
                        minHeight: 44,
                        padding: "10px 14px",
                        borderRadius: 9,
                        border: "1px solid var(--bilimai-border)",
                        background: "var(--bilimai-surface)",
                        color: "var(--bilimai-text)",
                        fontWeight: 600,
                        fontSize: 13.5,
                        cursor: "pointer"
                      }}
                    >
                      {ob.startMapBtn}
                    </button>
                  </div>

                  <div>
                    <button
                      type="button"
                      data-testid="onboarding-back"
                      onClick={() => setOnboardingStep(4)}
                      style={{
                        minHeight: 38,
                        padding: "6px 12px",
                        borderRadius: 8,
                        border: "1px solid var(--bilimai-border)",
                        background: "var(--bilimai-surface)",
                        color: "var(--bilimai-text-muted)",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      {ob.editAnswersBtn}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        <footer
          className="welcome-footer"
          style={{
            borderTop: "1px solid var(--bilimai-border)",
            color: "var(--bilimai-text-muted)"
          }}
        >
          <Link href={`/subjects?lang=${lang}`} style={{ color: "var(--bilimai-text-muted)" }}>
            {t.catalogLink}
          </Link>
          <span aria-hidden="true">·</span>
          <Link href={`/about?lang=${lang}`} style={{ color: "var(--bilimai-text-muted)" }}>
            {t.footerAbout}
          </Link>
          <span aria-hidden="true">·</span>
          <Link href={`/privacy?lang=${lang}`} style={{ color: "var(--bilimai-text-muted)" }}>
            {t.footerPrivacy}
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/teacher" style={{ color: "var(--bilimai-text-muted)" }}>
            {t.footerTeacher}
          </Link>
          <span aria-hidden="true">·</span>
          <a
            href="https://github.com/nur667-7/bilimai"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--bilimai-text-muted)" }}
          >
            {t.footerGithub}
          </a>
        </footer>
      </main>
    </div>
  );
}

export default WelcomeClient;
