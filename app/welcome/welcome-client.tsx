"use client";

import { useState } from "react";
import type { Language } from "@/lib/curriculum";
import { UNT_SUBJECTS, type UntSubjectId } from "@/lib/unt-all-subjects";
import { SubjectIcon } from "@/app/unt-exam-view";
import { PixelBrandMark, PixelKnowledgeMosaic } from "@/components/pixel-mosaic";
import { ThemeToggleButton, useAniqTheme } from "@/components/hero-canvas";

const COPY: Record<
  Language,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    examCta: string;
    labCta: string;
    profileLink: string;
    miniTitle: string;
    miniPrompt: string;
    miniInstruction: string;
    miniCorrectMsg: string;
    miniWrongMsg: string;
    miniOpenLab: string;
    subjectsTitle: string;
    subjectsNote: string;
    mandatoryGroup: string;
    profileGroup: string;
    officialBadge: (q: number, pts: number) => string;
    trainingBadge: string;
    startSubject: string;
    howTitle: string;
    howItems: { title: string; body: string; href: string; cta: string }[];
    footerAbout: string;
    footerPrivacy: string;
    footerNct: string;
  }
> = {
  ru: {
    eyebrow: "Тренажёр подготовки к ЕНТ (ҰБТ) · RU / ҚАЗ / OʻZB",
    title: "Разбор задач ЕНТ с проверкой каждого шага решения",
    subtitle:
      "Решайте задачи сразу без регистрации: находите первую ошибочную строку в черновике, проходите пробное ЕНТ в официальном формате НЦТ РК (10 / 20 / 40 заданий) и закрывайте пробелы по карте тем.",
    primaryCta: "Попробовать без регистрации →",
    examCta: "Пробное ЕНТ (формат НЦТ)",
    labCta: "Тренировка ошибок",
    profileLink: "Профиль",
    miniTitle: "Быстрый пример прямо здесь",
    miniPrompt: "Решите уравнение: 3(x − 2) = 15",
    miniInstruction: "Нажмите на строку черновика, в которой допущена первая математическая ошибка:",
    miniCorrectMsg:
      "Верно! В строке 02 при раскрытии скобок 3(x − 2) забыли умножить −2 на 3: должно быть 3x − 6 = 15, откуда 3x = 21 и x = 7.",
    miniWrongMsg:
      "В этой строке нет первичной ошибки. Посмотрите на строку 02: как раскрыты скобки 3(x − 2)?",
    miniOpenLab: "Открыть тренажёр ошибок (1 152 разбора) →",
    subjectsTitle: "Все 12 предметов ЕНТ по спецификации НЦТ РК",
    subjectsNote:
      "Обязательные предметы содержат 10 или 20 заданий (как на реальном ЕНТ), профильные — 40 заданий на 50 баллов. Дополнительно по каждому предмету доступен расширенный тренировочный банк (10 вариантов по 40 вопросов).",
    mandatoryGroup: "Обязательные предметы ЕНТ (3 предмета)",
    profileGroup: "Профильные предметы ЕНТ (9 предметов · 40 заданий / 50 баллов)",
    officialBadge: (q, pts) => `Офиц. ЕНТ: ${q} вопр. · ${pts} б.`,
    trainingBadge: "10 вариантов",
    startSubject: "Открыть вариант →",
    howTitle: "Четыре основных раздела платформы",
    howItems: [
      {
        title: "1. Урок и практика по шагам",
        body: "Формула, пошаговый образец и 3 задачи для закрепления с проверкой каждого перехода.",
        href: "/?tab=lesson",
        cta: "Перейти к уроку →"
      },
      {
        title: "2. Проверить черновик и тренировка ошибок",
        body: "Вставляйте собственное решение для построчной проверки или ищите неверный шаг в готовых примерах.",
        href: "/?tab=xray",
        cta: "Проверить черновик →"
      },
      {
        title: "3. Карта 16 тем и персональный план",
        body: "Наглядный маршрут по всем 16 разделам математики ЕНТ и приоритеты на сегодня.",
        href: "/?tab=graph",
        cta: "Открыть карту тем →"
      }
    ],
    footerAbout: "О проекте, методике и научных источниках",
    footerPrivacy: "Конфиденциальность и локальное хранение",
    footerNct: "Официальный формат ЕНТ на сайте НЦТ РК (testcenter.kz) ↗"
  },
  kk: {
    eyebrow: "ҰБТ-ға дайындық тренажері · RU / ҚАЗ / OʻZB",
    title: "Әр қадамды тексеретін ҰБТ есептер тренажері",
    subtitle:
      "Тіркеусіз бірден бастаңыз: шешімдегі алғашқы қате жолды табыңыз, ҚР ҰТО ресми форматында (10 / 20 / 40 тапсырма) байқау ҰБТ тапсырыңыз және тақырыптар картасы бойынша олқылықтарды жабыңыз.",
    primaryCta: "Тіркеусіз бастау →",
    examCta: "Байқау ҰБТ (ҰТО форматы)",
    labCta: "Қателермен жұмыс",
    profileLink: "Профиль",
    miniTitle: "Осы жерде тексеріп көріңіз",
    miniPrompt: "Теңдеуді шешіңіз: 3(x − 2) = 15",
    miniInstruction: "Бірінші математикалық қате жіберілген жолды басыңыз:",
    miniCorrectMsg:
      "Дұрыс! 02-жолда 3(x − 2) жақшасын ашқанда −2 санын 3-ке көбейту ұмытылған: 3x − 6 = 15, демек 3x = 21 және x = 7 болуы керек.",
    miniWrongMsg:
      "Бұл жолда бастапқы қате жоқ. 02-жолдағы 3(x − 2) жақшасының ашылуын тексеріңіз.",
    miniOpenLab: "Қателер зертханасын ашу (1 152 талдау) →",
    subjectsTitle: "ҚР ҰТО спецификациясы бойынша ҰБТ-ның барлық 12 пәні",
    subjectsNote:
      "Міндетті пәндерде нақты ҰБТ-дағыдай 10 немесе 20 тапсырма, ал бейіндік пәндерде 40 тапсырма (50 балл). Сонымен қатар әр пән бойынша 40 сұрақтық жаттығу жинағы бар.",
    mandatoryGroup: "Міндетті пәндер (3 пән)",
    profileGroup: "Бейіндік пәндер (9 пән · 40 тапсырма / 50 балл)",
    officialBadge: (q, pts) => `Ресми ҰБТ: ${q} сұрақ · ${pts} б.`,
    trainingBadge: "10 нұсқа",
    startSubject: "Нұсқаны ашу →",
    howTitle: "Платформаның негізгі құралдары",
    howItems: [
      {
        title: "1. Сабақ және қадамдық практика",
        body: "Формула, қадамдық үлгі және әр қадамы тексерілетін 3 жаттығу есебі.",
        href: "/?tab=lesson&lang=kk",
        cta: "Сабаққа өту →"
      },
      {
        title: "2. Жазбаны тексеру және қатемен жұмыс",
        body: "Өз шешіміңізді жолдап тексеріңіз немесе дайын шешімдегі алғашқы қате жолды табыңыз.",
        href: "/?tab=xray&lang=kk",
        cta: "Жазбаны тексеру →"
      },
      {
        title: "3. Тақырыптар картасы мен жоспар",
        body: "ҰБТ математикасының 16 бөлімі және бүгінгі дайындық жоспары.",
        href: "/?tab=graph&lang=kk",
        cta: "Картаны ашу →"
      }
    ],
    footerAbout: "Жоба, әдістеме және ғылыми дереккөздер туралы",
    footerPrivacy: "Құпиялылық және деректерді сақтау",
    footerNct: "ҚР ҰТО ресми ҰБТ форматы (testcenter.kz) ↗"
  },
  uz: {
    eyebrow: "UBT tayyorgarlik trenajyori · RU / ҚАЗ / OʻZB",
    title: "Har bir yechim qadamini tekshiruvchi UBT trenajyori",
    subtitle:
      "Ro‘yxatdan o‘tmasdan darhol boshlang: qoralama yechimdagi birinchi xato qatorni toping, rasmiy UTO formatida (10 / 20 / 40 topshiriq) sinov UBT topshiring va mavzular xaritasi bo‘yicha bo‘shliqlarni yoping.",
    primaryCta: "Ro‘yxatdan o‘tmasdan boshlash →",
    examCta: "Sinov UBT (rasmiy format)",
    labCta: "Xatolar ustida ishlash",
    profileLink: "Profil",
    miniTitle: "Shu yerning o‘zida sinab ko‘ring",
    miniPrompt: "Tenglamani yeching: 3(x − 2) = 15",
    miniInstruction: "Birinchi matematik xato qilingan qatorni bosing:",
    miniCorrectMsg:
      "To‘g‘ri! 02-qatorda 3(x − 2) qavsni ochishda −2 ni 3 ga ko‘paytirish unutilgan: 3x − 6 = 15, demak 3x = 21 va x = 7 bo‘lishi kerak.",
    miniWrongMsg:
      "Bu qatorda birlamchi xato yo‘q. 02-qatordagi 3(x − 2) qavsning ochilishiga e’tibor bering.",
    miniOpenLab: "Xatolar trenajyorini ochish (1 152 tahlil) →",
    subjectsTitle: "UTO spetsifikatsiyasi bo‘yicha barcha 12 ta UBT fani",
    subjectsNote:
      "Majburiy fanlarda 10 yoki 20 ta topshiriq, profil fanlarda esa 40 ta topshiriq (50 ball). Har bir fan bo‘yicha 10 ta variant mavjud.",
    mandatoryGroup: "Majburiy fanlar (3 ta fan)",
    profileGroup: "Profil fanlar (9 ta fan · 40 savol / 50 ball)",
    officialBadge: (q, pts) => `Rasmiy UBT: ${q} savol · ${pts} b.`,
    trainingBadge: "10 variant",
    startSubject: "Variantni ochish →",
    howTitle: "Asosiy ishchi vositalar",
    howItems: [
      {
        title: "1. Dars va qadamma-qadam amaliyot",
        body: "Formula, namuna va har bir qadami tekshiriladigan 3 ta mustaqil masala.",
        href: "/?tab=lesson&lang=uz",
        cta: "Darsga o‘tish →"
      },
      {
        title: "2. Qoralamani tekshirish va xatolar ustida ishlash",
        body: "O‘z qoralama yechimingizni tekshiring yoki yechimdagi birinchi xato qatorni toping.",
        href: "/?tab=xray&lang=uz",
        cta: "Qoralamani tekshirish →"
      },
      {
        title: "3. Mavzular xaritasi va reja",
        body: "UBT matematikasining 16 bo‘limi va tayyorgarlik rejasi.",
        href: "/?tab=graph&lang=uz",
        cta: "Xaritani ochish →"
      }
    ],
    footerAbout: "Loyiha, metodika va ilmiy manbalar haqida",
    footerPrivacy: "Maxfiylik va ma’lumotlarni saqlash",
    footerNct: "Rasmiy UBT formati (testcenter.kz) ↗"
  }
};

const MINI_STEPS = [
  { num: "01", expr: "3(x − 2) = 15", isError: false },
  { num: "02", expr: "3x − 2 = 15", isError: true },
  { num: "03", expr: "3x = 17  ⇒  x = 17/3", isError: false }
];

export default function WelcomeClient({
  initialLang = "ru"
}: {
  initialLang?: Language;
}) {
  const { dark, toggleTheme } = useAniqTheme();
  const [lang, setLang] = useState<Language>(initialLang);
  const [pickedStep, setPickedStep] = useState<number | null>(null);

  function handleLangChange(next: Language) {
    setLang(next);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", next);
      window.history.replaceState({}, "", url.toString());
    }
  }

  const t = COPY[lang];
  const mandatorySubjects = UNT_SUBJECTS.filter((s) => s.category === "mandatory");
  const profileSubjects = UNT_SUBJECTS.filter((s) => s.category === "profile");

  return (
    <div className="study-page welcome-standalone-page">
      <header className="study-topbar">
        <div className="study-topbar-inner">
          <div className="study-brand-row">
            <a href={`/?lang=${lang}`} className="aniq-brand-logo">
              <PixelBrandMark size={26} />
              <span className="aniq-logo-word">BilimAI</span>
            </a>
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

            <a href={`/?tab=profile&lang=${lang}`} className="top-UtilityLink hide-on-narrow-mobile">
              {t.profileLink}
            </a>

            <a href={`/?tab=lesson&lang=${lang}`} className="btn-primary welcome-top-cta hide-on-narrow-mobile">
              {t.primaryCta}
            </a>
          </div>
        </div>
      </header>

      <main className="welcome-standalone-main">
        {/* Hero + Interactive Mini Problem */}
        <section className="welcome-hero-grid" aria-labelledby="welcome-h1">
          <div className="welcome-hero-copy">
            <span className="lesson-kicker">{t.eyebrow}</span>
            <h1 id="welcome-h1" className="welcome-main-title">
              {t.title}
            </h1>
            <p className="welcome-main-lead">{t.subtitle}</p>

            <PixelKnowledgeMosaic className="mt-1" />

            <div className="welcome-cta-row">
              <a href={`/?tab=lesson&lang=${lang}`} className="btn-primary">
                {t.primaryCta}
              </a>
              <a href={`/?tab=exam&lang=${lang}`} className="btn-ghost">
                {t.examCta}
              </a>
              <a href={`/lab?lang=${lang}`} className="btn-ghost">
                {t.labCta}
              </a>
            </div>
          </div>

          <div className="welcome-mini-card">
            <div className="welcome-mini-header">
              <span className="section-num">{t.miniTitle}</span>
              <strong className="welcome-mini-Equation">{t.miniPrompt}</strong>
              <p className="muted-note">{t.miniInstruction}</p>
            </div>

            <div className="welcome-mini-steps" role="group" aria-label={t.miniPrompt}>
              {MINI_STEPS.map((st, idx) => {
                const isSelected = pickedStep === idx;
                const isRight = isSelected && st.isError;
                const isWrong = isSelected && !st.isError;
                return (
                  <button
                    key={st.num}
                    type="button"
                    onClick={() => setPickedStep(idx)}
                    className={`welcome-step-btn ${isRight ? "step-correct" : ""} ${
                      isWrong ? "step-wrong" : ""
                    }`}
                  >
                    <span className="welcome-step-num">{st.num}</span>
                    <span className="welcome-step-expr">{st.expr}</span>
                  </button>
                );
              })}
            </div>

            {pickedStep !== null && (
              <div
                className={`feedback-banner ${
                  MINI_STEPS[pickedStep].isError ? "ok" : "err"
                }`}
              >
                <p>
                  {MINI_STEPS[pickedStep].isError ? t.miniCorrectMsg : t.miniWrongMsg}
                </p>
                <div style={{ marginTop: "0.5rem" }}>
                  <a href={`/lab?lang=${lang}`} className="inline-action-link">
                    {t.miniOpenLab}
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Three core tools */}
        <section className="welcome-tools-section" aria-label={t.howTitle}>
          <h2 className="section-title">{t.howTitle}</h2>
          <div className="welcome-tools-grid">
            {t.howItems.map((item) => (
              <article key={item.title} className="welcome-tool-card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <a href={item.href} className="inline-action-link">
                  {item.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* Compact 12 UNT Subjects Picker with Official NCT Counts */}
        <section className="welcome-subjects-section" aria-labelledby="welcome-subjects-h2">
          <div className="welcome-subjects-head">
            <h2 id="welcome-subjects-h2" className="section-title">
              {t.subjectsTitle}
            </h2>
            <p className="muted-note">{t.subjectsNote}</p>
          </div>

          <h3 className="welcome-group-subtitle">{t.mandatoryGroup}</h3>
          <div className="welcome-subject-grid mandatory">
            {mandatorySubjects.map((subj: {
              id: UntSubjectId;
              officialQuestions: number;
              officialMaxPoints: number;
              title: Record<Language, string>;
            }) => (
              <a
                key={subj.id}
                href={`/?tab=exam&subject=${subj.id}&lang=${lang}`}
                className="welcome-subject-card"
              >
                <div className="welcome-subject-top">
                  <SubjectIcon subjectId={subj.id} size={18} />
                  <strong>{subj.title[lang]}</strong>
                </div>
                <div className="welcome-subject-badges">
                  <span className="welcome-subj-badge official">
                    {t.officialBadge(subj.officialQuestions, subj.officialMaxPoints)}
                  </span>
                  <span className="welcome-subj-badge">{t.trainingBadge}</span>
                </div>
              </a>
            ))}
          </div>

          <h3 className="welcome-group-subtitle">{t.profileGroup}</h3>
          <div className="welcome-subject-grid profile">
            {profileSubjects.map((subj: {
              id: UntSubjectId;
              officialQuestions: number;
              officialMaxPoints: number;
              title: Record<Language, string>;
            }) => (
              <a
                key={subj.id}
                href={`/?tab=exam&subject=${subj.id}&lang=${lang}`}
                className="welcome-subject-card"
              >
                <div className="welcome-subject-top">
                  <SubjectIcon subjectId={subj.id} size={18} />
                  <strong>{subj.title[lang]}</strong>
                </div>
                <div className="welcome-subject-badges">
                  <span className="welcome-subj-badge official">
                    {t.officialBadge(subj.officialQuestions, subj.officialMaxPoints)}
                  </span>
                  <span className="welcome-subj-badge">{t.trainingBadge}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <footer className="welcome-footer">
          <a href={`/about?lang=${lang}`}>{t.footerAbout}</a>
          <span aria-hidden="true">·</span>
          <a href={`/privacy?lang=${lang}`}>{t.footerPrivacy}</a>
          <span aria-hidden="true">·</span>
          <a
            href="https://testcenter.kz/?page_id=15074&lang=ru"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.footerNct}
          </a>
        </footer>
      </main>
    </div>
  );
}
