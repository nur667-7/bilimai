"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Language } from "@/lib/curriculum";
import { UNT_SUBJECTS } from "@/lib/unt-all-subjects";
import { SubjectIcon } from "@/app/unt-exam-view";
import { PixelBrandMark, PixelKnowledgeMosaic } from "@/components/pixel-mosaic";
import { ThemeToggleButton, useAniqTheme } from "@/components/hero-canvas";
import { useAuxiliaryPageNavigation } from "@/lib/use-study-navigation";
import {
  WELCOME_DEMO_ITEMS,
  getAllSubjectCurricula
} from "@/lib/universal-curriculum";
import { UniversalQuestionRenderer } from "@/components/study/universal-question-renderer";
import {
  UNIVERSAL_PROGRESS_STORAGE_KEY,
  createDefaultUniversalProgressState,
  migrateUniversalProgressState,
  saveOnboardingSelection,
  type UserLearnerRole,
  type UserLearningGoal,
  type UserInitialLevel
} from "@/lib/universal-progress";

const COPY: Record<
  Language,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaChooseSubject: string;
    ctaCheckLevel: string;
    ctaTryDemo: string;
    catalogLink: string;
    profileLink: string;
    demoSectionTitle: string;
    demoSectionSubtitle: string;
    demoOpenLesson: string;
    onboardingTitle: string;
    onboardingSubtitle: string;
    subjectsTitle: string;
    subjectsNote: string;
    openSubjectOverview: string;
    lessonsBadge: (n: number) => string;
    howTitle: string;
    howSteps: Array<{ num: string; title: string; body: string }>;
    aiTitle: string;
    aiCapabilities: string[];
    footerAbout: string;
    footerPrivacy: string;
    footerTeacher: string;
    footerGithub: string;
  }
> = {
  ru: {
    eyebrow: "Универсальная образовательная ИИ-платформа · RU / ҚАЗ / OʻZB",
    title: "BilimAI — твой персональный ИИ-преподаватель по любому предмету",
    subtitle:
      "Объяснения простым языком, интерактивные уроки, практика разных форматов, разбор причины ошибки, карта знаний и подготовка к урокам, контрольным и ЕНТ.",
    ctaChooseSubject: "Выбрать предмет",
    ctaCheckLevel: "Проверить свой уровень",
    ctaTryDemo: "Попробовать демо без регистрации",
    catalogLink: "Предметы (12)",
    profileLink: "Профиль",
    demoSectionTitle: "Живое демо по 5 предметам прямо здесь",
    demoSectionSubtitle:
      "Переключайте предметы (Математика, Физика, Английский, История, Информатика), проверяйте ответ и смотрите пошаговое объяснение:",
    demoOpenLesson: "Перейти к полному курсу предмета →",
    onboardingTitle: "Персональная настройка обучения за 5 шагов",
    onboardingSubtitle:
      "Ответьте на 4 коротких вопроса, чтобы платформа подобрала стартовый предмет, уровень и первый урок.",
    subjectsTitle: "Каталог предметов BilimAI (12 полных направлений)",
    subjectsNote:
      "Нажмите на любой предмет, чтобы открыть его обзор, пошаговые уроки, практику, Лабораторию ошибок, Карту тем и тренажёр ЕНТ.",
    openSubjectOverview: "Обзор предмета и уроки →",
    lessonsBadge: (n) => `${n} уроков`,
    howTitle: "Как работает платформа (5 шагов)",
    howSteps: [
      {
        num: "01",
        title: "Выбираешь предмет и цель",
        body: "Школьная программа, изучение с нуля, закрытие пробелов или подготовка к экзамену / ЕНТ."
      },
      {
        num: "02",
        title: "Проходишь быструю диагностику или начинаешь с первого урока",
        body: "За 5 минут определяем знакомые темы и точки потери баллов без лишнего стресса."
      },
      {
        num: "03",
        title: "Изучаешь тему через понятные объяснения и практику",
        body: "Короткая теория, разобранный по шагам пример, переключение «Объясни проще» и интерактивные задачи."
      },
      {
        num: "04",
        title: "Разбираешь ошибки с ИИ-репетитором",
        body: "Платформа показывает не просто «неверно», а объясняет причину ошибки и даёт задачу на закрепление."
      },
      {
        num: "05",
        title: "Двигаешься по персональному плану и видишь прогресс",
        body: "Карта знаний и очередь занятий показывают, что изучать сегодня и какие темы уже освоены."
      }
    ],
    aiTitle: "Что реально умеет ИИ-репетитор BilimAI",
    aiCapabilities: [
      "Объясняет тему проще или глубже на русском, казахском и узбекском языках",
      "Даёт пошаговую наводящую подсказку вместо готового ответа для списывания",
      "Находит первую ошибочную строку в черновике и честно маркирует статус проверки",
      "Подбирает аналогичную задачу на закрепление после исправления ошибки"
    ],
    footerAbout: "О платформе и методике",
    footerPrivacy: "Конфиденциальность и хранение данных",
    footerTeacher: "Кабинет преподавателя",
    footerGithub: "Исходный код на GitHub ↗"
  },
  kk: {
    eyebrow: "Әмбебап білім беру ЖИ-платформасы · RU / ҚАЗ / OʻZB",
    title: "BilimAI — кез келген пән бойынша сенің жеке ЖИ-оқытушың",
    subtitle:
      "Қарапайым тілмен түсіндіру, интерактивті сабақтар, түрлі форматтағы практика, қателерді талдау, білім картасы және сабақ пен ҰБТ-ға дайындық.",
    ctaChooseSubject: "Пәнді таңдау",
    ctaCheckLevel: "Деңгейді тексеру",
    ctaTryDemo: "Тіркеусіз демоны көру",
    catalogLink: "Пәндер (12)",
    profileLink: "Профиль",
    demoSectionTitle: "5 пән бойынша интерактивті демо",
    demoSectionSubtitle:
      "Пәнді таңдап (Математика, Физика, Ағылшын тілі, Тарих, Информатика), жауапты тексеріңіз және қадамдық түсіндірмені көріңіз:",
    demoOpenLesson: "Пәннің толық курсына өту →",
    onboardingTitle: "5 қадаммен жеке оқу маршрутын баптау",
    onboardingSubtitle:
      "Платформа сізге лайықты пән мен алғашқы сабақты таңдап беруі үшін 4 сұраққа жауап беріңіз.",
    subjectsTitle: "BilimAI пәндер каталогы (12 бағыт)",
    subjectsNote:
      "Кез келген пәнді басып, оның шолуын, сабақтарын, практикасын, Қателер зертханасын және Білім картасын ашыңыз.",
    openSubjectOverview: "Пән шолуы мен сабақтар →",
    lessonsBadge: (n) => `${n} сабақ`,
    howTitle: "Платформа қалай жұмыс істейді (5 қадам)",
    howSteps: [
      {
        num: "01",
        title: "Пән мен мақсатты таңдайсың",
        body: "Мектеп бағдарламасы, нөлден бастап оқу немесе ҰБТ-ға дайындық."
      },
      {
        num: "02",
        title: "Қысқа диагностикадан өтесің немесе 1-сабақтан бастайсың",
        body: "5 минут ішінде деңгейді анықтап, оқу ретін құрамыз."
      },
      {
        num: "03",
        title: "Түсінікті мысалдар мен практика арқылы меңгересің",
        body: "Қысқа теория, қадамдық үлгі және интерактивті тапсырмалар."
      },
      {
        num: "04",
        title: "ЖИ-репетитормен қателерді талдайсың",
        body: "Қатенің себебін түсініп, бекіту есебін шығарасың."
      },
      {
        num: "05",
        title: "Жеке жоспармен алға жылжисың",
        body: "Білім картасы әр пән бойынша прогресті бөлек сақтайды."
      }
    ],
    aiTitle: "BilimAI ЖИ-репетиторының мүмкіндіктері",
    aiCapabilities: [
      "Тақырыпты орыс, қазақ және өзбек тілдерінде қарапайым тілмен түсіндіреді",
      "Дайын жауаптың орнына бағыттаушы кеңес береді",
      "Шешімдегі қате жолды тауып, тексеру мәртебесін адал көрсетеді",
      "Қатені түзеткен соң ұқсас бекіту тапсырмасын ұсынады"
    ],
    footerAbout: "Жоба және әдістеме туралы",
    footerPrivacy: "Құпиялылық және деректерді сақтау",
    footerTeacher: "Оқытушы кабинеті",
    footerGithub: "GitHub бастапқы коды ↗"
  },
  uz: {
    eyebrow: "Universal ta’limiy SI-platformasi · RU / ҚАЗ / OʻZB",
    title: "BilimAI — har qanday fan bo‘yicha shaxsiy SI-o‘qituvchingiz",
    subtitle:
      "Sodda tilda tushuntirishlar, interaktiv darslar, turli formatdagi amaliyot, xatolar tahlili, bilimlar xaritasi va imtihonlarga tayyorgarlik.",
    ctaChooseSubject: "Fanni tanlash",
    ctaCheckLevel: "Darajani tekshirish",
    ctaTryDemo: "Ro‘yxatdan o‘tmasdan demoni ko‘rish",
    catalogLink: "Fanlar (12)",
    profileLink: "Profil",
    demoSectionTitle: "5 ta fan bo‘yicha jonli demo",
    demoSectionSubtitle:
      "Fanni tanlang (Matematika, Fizika, Ingliz tili, Tarix, Informatika), javobni tekshiring va qadamma-qadam izohni ko‘ring:",
    demoOpenLesson: "Fanning to‘liq kursiga o‘tish →",
    onboardingTitle: "5 qadamda shaxsiy o‘quv yo‘nalishini sozlash",
    onboardingSubtitle:
      "Platforma sizga mos fan va birinchi darsni tanlab berishi uchun 4 ta qisqa savolga javob bering.",
    subjectsTitle: "BilimAI fanlar katalogi (12 ta yo‘nalish)",
    subjectsNote:
      "Istalgan fanni bosib, uning sharhi, darslari, amaliyoti, Xatolar laboratoriyasi va Bilimlar xaritasini oching.",
    openSubjectOverview: "Fan sharhi va darslar →",
    lessonsBadge: (n) => `${n} dars`,
    howTitle: "Platforma qanday ishlaydi (5 qadam)",
    howSteps: [
      {
        num: "01",
        title: "Fan va maqsadni tanlaysiz",
        body: "Maktab dasturi, noldan o‘rganish yoki imtihonga tayyorgarlik."
      },
      {
        num: "02",
        title: "Qisqa diagnostikadan o‘tasiz yoki 1-darsdan boshlaysiz",
        body: "5 daqiqada boshlang‘ich darajani aniqlaymiz."
      },
      {
        num: "03",
        title: "Tushunarli misollar va amaliyot orqali o‘rganasiz",
        body: "Qisqa nazariya, qadamma-qadam namuna va interaktiv topshiriqlar."
      },
      {
        num: "04",
        title: "SI-repetitor bilan xatolarni tahlil qilasiz",
        body: "Xato sababini tushunib, mustahkamlash masalasini yechasiz."
      },
      {
        num: "05",
        title: "Shaxsiy reja bo‘yicha oldinga borasiz",
        body: "Bilimlar xaritasi har bir fan bo‘yicha progressni alohida saqlaydi."
      }
    ],
    aiTitle: "BilimAI SI-repetitorining imkoniyatlari",
    aiCapabilities: [
      "Mavzuni rus, qozoq va o‘zbek tillarida sodda tilda tushuntiradi",
      "Tayyor javob o‘rniga yo‘naltiruvchi maslahat beradi",
      "Qoralamadagi xato qatorni topib, tekshirish holatini halol ko‘rsatadi",
      "Xatoni tuzatgach, o‘xshash mustahkamlash masalasini beradi"
    ],
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

  const [demoSubjectIndex, setDemoSubjectIndex] = useState(0);
  const allCurricula = getAllSubjectCurricula();

  // 5-Step Onboarding state
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [role, setRole] = useState<UserLearnerRole>("student");
  const [goal, setGoal] = useState<UserLearningGoal>("school");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["math", "physics"]);
  const [level, setLevel] = useState<UserInitialLevel>("beginner");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(UNIVERSAL_PROGRESS_STORAGE_KEY);
      if (raw) {
        const state = migrateUniversalProgressState(raw);
        if (state.onboarding.selectedSubjects.length > 0) {
          setSelectedSubjects(state.onboarding.selectedSubjects);
          setRole(state.onboarding.role);
          setGoal(state.onboarding.goal);
          setLevel(state.onboarding.level);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleOnboardingSubject = (subjId: string) => {
    setSelectedSubjects((prev) => {
      if (prev.includes(subjId)) {
        return prev.length > 1 ? prev.filter((id) => id !== subjId) : prev;
      }
      return [...prev, subjId];
    });
  };

  const finishOnboardingAndNavigate = (targetMode: "lesson" | "diagnostic") => {
    const primarySubject = selectedSubjects[0] ?? "math";
    try {
      const raw = window.localStorage.getItem(UNIVERSAL_PROGRESS_STORAGE_KEY);
      const current = raw ? migrateUniversalProgressState(raw) : createDefaultUniversalProgressState();
      const updated = saveOnboardingSelection(current, {
        role,
        goal,
        selectedSubjects,
        level
      });
      window.localStorage.setItem(UNIVERSAL_PROGRESS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    window.location.href = `/subjects/${primarySubject}${targetMode === "diagnostic" ? "?start=diagnostic" : ""}`;
  };

  const activeDemo = WELCOME_DEMO_ITEMS[demoSubjectIndex] ?? WELCOME_DEMO_ITEMS[0];

  return (
    <div className="study-root welcome-standalone-root">
      <header className="study-topbar">
        <div className="study-topbar-inner">
          <div className="study-brand-row">
            <Link href="/welcome" className="brand-link" aria-label="BilimAI">
              <PixelBrandMark size={26} />
              <span className="brand-title">BilimAI</span>
            </Link>
            <span className="brand-Sep hide-on-narrow-mobile" aria-hidden="true">
              /
            </span>
            <span className="brand-subtitle hide-on-narrow-mobile">{t.eyebrow}</span>
          </div>

          <div className="study-controls-row">
            <div className="lang-bar" role="group" aria-label="Language">
              {(
                [
                  ["ru", "RU"],
                  ["kk", "ҚАЗ"],
                  ["uz", "OʻZB"]
                ] as [Language, string][]
              ).map(([code, label]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleLangChange(code)}
                  className={`lang-pill ${lang === code ? "active" : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <ThemeToggleButton dark={dark} onToggle={toggleTheme} />

            <Link href="/subjects" className="top-UtilityLink hide-on-narrow-mobile">
              {t.catalogLink}
            </Link>

            <Link href={`/?tab=profile&lang=${lang}`} className="top-UtilityLink hide-on-narrow-mobile">
              {t.profileLink}
            </Link>

            <a href="#subjects-catalog" className="btn-primary welcome-top-cta hide-on-narrow-mobile">
              {t.ctaChooseSubject}
            </a>
          </div>
        </div>
      </header>

      <main className="welcome-standalone-main">
        {/* 1. HERO + 5-SUBJECT INTERACTIVE DEMO */}
        <section className="welcome-hero-grid" aria-labelledby="welcome-h1">
          <div className="welcome-hero-copy">
            <span className="lesson-kicker">{t.eyebrow}</span>
            <h1 id="welcome-h1" className="welcome-main-title">
              {t.title}
            </h1>
            <p className="welcome-main-lead">{t.subtitle}</p>

            <PixelKnowledgeMosaic className="mt-1" />

            <div className="welcome-cta-row">
              <a href="#subjects-catalog" className="btn-primary" data-testid="hero-cta-choose-subject">
                {t.ctaChooseSubject}
              </a>
              <a href="#onboarding-wizard" className="btn-ghost" data-testid="hero-cta-check-level">
                {t.ctaCheckLevel}
              </a>
              <a href="#interactive-multi-demo" className="btn-ghost" data-testid="hero-cta-try-demo">
                {t.ctaTryDemo}
              </a>
            </div>
          </div>

          {/* Interactive 5-Subject Live Demo Card */}
          <div
            id="interactive-multi-demo"
            className="welcome-mini-card"
            data-testid="welcome-5subject-demo"
            style={{ display: "grid", gap: 12 }}
          >
            <div>
              <span className="section-num">{t.demoSectionTitle}</span>
              <p className="muted-note" style={{ margin: "4px 0 0" }}>
                {t.demoSectionSubtitle}
              </p>
            </div>

            {/* 5 Subject Switcher Pills */}
            <div
              role="tablist"
              aria-label="Демо-предметы"
              style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
            >
              {WELCOME_DEMO_ITEMS.map((item, idx) => {
                const active = idx === demoSubjectIndex;
                return (
                  <button
                    key={item.subjectId}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    data-testid={`welcome-demo-tab-${item.subjectId}`}
                    onClick={() => setDemoSubjectIndex(idx)}
                    style={{
                      padding: "6px 11px",
                      borderRadius: 999,
                      border: active
                        ? "1px solid var(--accent, #3856f5)"
                        : "1px solid var(--border, #dcd8ce)",
                      background: active ? "var(--accent, #3856f5)" : "var(--surface, #fff)",
                      color: active ? "#fff" : "inherit",
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    {item.subjectTitle[lang]}
                  </button>
                );
              })}
            </div>

            <div
              style={{
                padding: "9px 12px",
                borderRadius: 10,
                background: "rgba(56, 86, 245, 0.07)",
                fontSize: 13.5,
                lineHeight: 1.45
              }}
            >
              💡 <strong>Правило урока:</strong> {activeDemo.contextNote[lang]}
            </div>

            <UniversalQuestionRenderer question={activeDemo.question} locale={lang} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <Link
                href={`/subjects/${activeDemo.subjectId}`}
                className="inline-action-link"
                data-testid="welcome-demo-open-subject-link"
              >
                {t.demoOpenLesson} ({activeDemo.subjectTitle[lang]})
              </Link>
            </div>
          </div>
        </section>

        {/* 2. 5-STEP INTERACTIVE ONBOARDING WIZARD (Part VI) */}
        <section
          id="onboarding-wizard"
          data-testid="welcome-onboarding-wizard"
          style={{
            background: "var(--surface, #fff)",
            border: "1px solid var(--border, #e4e1d8)",
            borderRadius: 20,
            padding: "22px 24px",
            display: "grid",
            gap: 16
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div>
              <h2 className="section-title" style={{ margin: 0 }}>
                {t.onboardingTitle}
              </h2>
              <p className="muted-note" style={{ margin: "4px 0 0" }}>
                {t.onboardingSubtitle}
              </p>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {([1, 2, 3, 4, 5] as const).map((stepNum) => (
                <button
                  key={stepNum}
                  type="button"
                  onClick={() => setOnboardingStep(stepNum)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    border:
                      onboardingStep === stepNum
                        ? "2px solid var(--accent, #3856f5)"
                        : "1px solid var(--border, #dcd8ce)",
                    background:
                      onboardingStep === stepNum ? "var(--accent, #3856f5)" : "var(--bg, #f7f5ef)",
                    color: onboardingStep === stepNum ? "#fff" : "inherit",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer"
                  }}
                >
                  {stepNum}
                </button>
              ))}
            </div>
          </div>

          {onboardingStep === 1 && (
            <div style={{ display: "grid", gap: 12 }}>
              <strong style={{ fontSize: 16 }}>Шаг 1 из 5. Кто ты?</strong>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
                {(
                  [
                    { id: "student", label: "Школьник (5–11 класс)" },
                    { id: "applicant", label: "Абитуриент (подготовка к ЕНТ)" },
                    { id: "self_learner", label: "Самостоятельно изучаю предмет" },
                    { id: "teacher", label: "Преподаватель / репетитор" }
                  ] as Array<{ id: UserLearnerRole; label: string }>
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setRole(item.id);
                      setOnboardingStep(2);
                    }}
                    style={{
                      padding: "13px 15px",
                      borderRadius: 12,
                      border:
                        role === item.id
                          ? "2px solid var(--accent, #3856f5)"
                          : "1px solid var(--border, #dcd8ce)",
                      background: role === item.id ? "rgba(56, 86, 245, 0.08)" : "var(--bg, #f7f5ef)",
                      fontWeight: 600,
                      textAlign: "left",
                      cursor: "pointer"
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {onboardingStep === 2 && (
            <div style={{ display: "grid", gap: 12 }}>
              <strong style={{ fontSize: 16 }}>Шаг 2 из 5. Какая у тебя цель?</strong>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
                {(
                  [
                    { id: "school", label: "Подтянуть школьный предмет" },
                    { id: "exam", label: "Подготовиться к экзамену / ЕНТ" },
                    { id: "from_scratch", label: "Изучить тему с нуля" },
                    { id: "practice_gaps", label: "Практиковаться и разбирать ошибки" }
                  ] as Array<{ id: UserLearningGoal; label: string }>
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setGoal(item.id);
                      setOnboardingStep(3);
                    }}
                    style={{
                      padding: "13px 15px",
                      borderRadius: 12,
                      border:
                        goal === item.id
                          ? "2px solid var(--accent, #3856f5)"
                          : "1px solid var(--border, #dcd8ce)",
                      background: goal === item.id ? "rgba(56, 86, 245, 0.08)" : "var(--bg, #f7f5ef)",
                      fontWeight: 600,
                      textAlign: "left",
                      cursor: "pointer"
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {onboardingStep === 3 && (
            <div style={{ display: "grid", gap: 12 }}>
              <strong style={{ fontSize: 16 }}>Шаг 3 из 5. Выбери один или несколько предметов:</strong>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {UNT_SUBJECTS.map((s) => {
                  const picked = selectedSubjects.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleOnboardingSubject(s.id)}
                      style={{
                        padding: "9px 13px",
                        borderRadius: 999,
                        border: picked
                          ? "2px solid var(--accent, #3856f5)"
                          : "1px solid var(--border, #dcd8ce)",
                        background: picked ? "rgba(56, 86, 245, 0.1)" : "var(--bg, #f7f5ef)",
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
              <div>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setOnboardingStep(4)}
                  style={{ cursor: "pointer" }}
                >
                  Далее: выбрать уровень →
                </button>
              </div>
            </div>
          )}

          {onboardingStep === 4 && (
            <div style={{ display: "grid", gap: 12 }}>
              <strong style={{ fontSize: 16 }}>Шаг 4 из 5. Выбери стартовый уровень:</strong>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
                {(
                  [
                    { id: "beginner", label: "Начальный — объяснять с самых азов" },
                    { id: "intermediate", label: "Средний — знаю базу, нужна практика" },
                    { id: "advanced", label: "Продвинутый — сложные задачи и ловушки" },
                    { id: "check_level", label: "Проверить мой уровень за 5 минут" }
                  ] as Array<{ id: UserInitialLevel; label: string }>
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setLevel(item.id);
                      setOnboardingStep(5);
                    }}
                    style={{
                      padding: "13px 15px",
                      borderRadius: 12,
                      border:
                        level === item.id
                          ? "2px solid var(--accent, #3856f5)"
                          : "1px solid var(--border, #dcd8ce)",
                      background: level === item.id ? "rgba(56, 86, 245, 0.08)" : "var(--bg, #f7f5ef)",
                      fontWeight: 600,
                      textAlign: "left",
                      cursor: "pointer"
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {onboardingStep === 5 && (
            <div
              style={{
                padding: "16px 18px",
                borderRadius: 14,
                background: "rgba(56, 86, 245, 0.07)",
                border: "1px solid rgba(56, 86, 245, 0.28)",
                display: "grid",
                gap: 12
              }}
            >
              <strong style={{ fontSize: 17 }}>
                Шаг 5 из 5. Твой персональный маршрут готов!
              </strong>
              <p style={{ margin: 0, fontSize: 14.5 }}>
                Выбранные предметы:{" "}
                <strong>
                  {selectedSubjects
                    .map((id) => UNT_SUBJECTS.find((s) => s.id === id)?.title[lang] ?? id)
                    .join(", ")}
                </strong>
                . Начни с первого интерактивного урока или пройди 5-минутную проверку уровня:
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => finishOnboardingAndNavigate("lesson")}
                  style={{ cursor: "pointer" }}
                >
                  Начать первый урок →
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => finishOnboardingAndNavigate("diagnostic")}
                  style={{ cursor: "pointer" }}
                >
                  Пройти проверку уровня (5 мин)
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 3. FULL 12-SUBJECT CATALOG (CASE G: Every card links to /subjects/[subject]) */}
        <section
          id="subjects-catalog"
          className="welcome-subjects-section"
          aria-labelledby="welcome-subjects-h2"
        >
          <div className="welcome-subjects-head">
            <h2 id="welcome-subjects-h2" className="section-title">
              {t.subjectsTitle}
            </h2>
            <p className="muted-note">{t.subjectsNote}</p>
          </div>

          <div className="welcome-subject-grid profile">
            {allCurricula.map((subj) => {
              const totalQuestions = subj.lessons.reduce((acc, l) => acc + l.questions.length, 0);
              return (
                <Link
                  key={subj.id}
                  href={`/subjects/${subj.id}`}
                  data-testid={`welcome-subject-card-${subj.id}`}
                  className="welcome-subject-card"
                >
                  <div className="welcome-subject-top">
                    <SubjectIcon subjectId={subj.id as import("@/lib/unt-all-subjects").UntSubjectId} size={18} />
                    <strong>{subj.title[lang]}</strong>
                  </div>
                  <p
                    style={{
                      margin: "6px 0 10px",
                      fontSize: 13,
                      color: "var(--muted, #57544e)",
                      lineHeight: 1.4
                    }}
                  >
                    {subj.subtitle[lang]}
                  </p>
                  <div className="welcome-subject-badges">
                    <span className="welcome-subj-badge official">
                      {t.lessonsBadge(subj.lessons.length)} · {totalQuestions} заданий
                    </span>
                    <span className="welcome-subj-badge">{t.openSubjectOverview}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 4. HOW PLATFORM WORKS (5 STEPS) + AI CAPABILITIES */}
        <section className="welcome-tools-section" aria-label={t.howTitle}>
          <h2 className="section-title">{t.howTitle}</h2>
          <div className="welcome-tools-grid">
            {t.howSteps.map((step) => (
              <article key={step.num} className="welcome-tool-card">
                <span className="section-num">ШАГ {step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          style={{
            background: "var(--surface, #fff)",
            border: "1px solid var(--border, #e4e1d8)",
            borderRadius: 18,
            padding: "20px 22px",
            display: "grid",
            gap: 12
          }}
        >
          <h2 className="section-title" style={{ margin: 0 }}>
            {t.aiTitle}
          </h2>
          <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6, fontSize: 15 }}>
            {t.aiCapabilities.map((cap, idx) => (
              <li key={idx}>{cap}</li>
            ))}
          </ul>
        </section>

        <footer className="welcome-footer">
          <Link href={`/subjects`}>{t.catalogLink}</Link>
          <span aria-hidden="true">·</span>
          <Link href={`/about?lang=${lang}`}>{t.footerAbout}</Link>
          <span aria-hidden="true">·</span>
          <Link href={`/privacy?lang=${lang}`}>{t.footerPrivacy}</Link>
          <span aria-hidden="true">·</span>
          <Link href="/teacher">{t.footerTeacher}</Link>
          <span aria-hidden="true">·</span>
          <a
            href="https://github.com/nur667-7/bilimai"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.footerGithub}
          </a>
        </footer>
      </main>
    </div>
  );
}

export default WelcomeClient;
