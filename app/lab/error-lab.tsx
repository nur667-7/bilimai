"use client";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SiteFooter } from "@/components/site-footer";
import {
  makeChallenge,
  checkAnswer,
  parseNumericAnswer,
  progressSchema,
  recommendTopic,
  topicName,
  nextSeed,
  reviewSchedule,
  exportProgress,
  labTopics
} from "@/lib/error-lab";
import type { LabTopic, Progress } from "@/lib/error-lab";
import type { Language } from "@/lib/lessons";

const labels = {
  ru: {
    navStudy: "Занятие",
    navGraph: "Карта тем",
    navExam: "Пробное ЕНТ",
    navPlan: "Мой план",
    navLab: "Тренировка ошибок",
    navAbout: "О проекте",
    tag: "Тренировка поиска ошибки",
    title: "Найди неверный переход в решении",
    intro: "Выбери шаг, на котором впервые нарушено математическое правило, изучи исправление и реши задачу для закрепления.",
    mobileTopicLabel: "Тема тренировки",
    find: "1. В каком шаге допущена первая ошибка?",
    check: "Проверить шаг",
    choose: "Шаги решения задачи",
    selectFirst: "Выберите один из шагов 1–3, где впервые нарушено правило.",
    stepValidNote: "Этот переход верен — правило здесь сохранено. Проверь следующий шаг:",
    reason: "В чём ошибка на этом шаге",
    repair: "Верный переход",
    transfer: "2. Реши задачу самостоятельно",
    answer: "Ваш ответ",
    format: "Целое число, десятичная дробь (через точку или запятую) или дробь вида 3/7.",
    verify: "Проверить ответ",
    hint: "Подсказка по шагу",
    reveal: "Показать решение",
    invalid: "Введите число или дробь с ненулевым знаменателем.",
    wrong: "Ответ пока не совпал. Сверь вычисления с верным переходом выше или открой подсказку.",
    right: "Верно! Задача решена.",
    guided: "Решено с подсказкой или не с первой попытки — тема запланирована на повторение.",
    solo: "Решено самостоятельно с первой попытки без подсказок.",
    next: "Следующая задача",
    progress: "Прогресс и повторение",
    memory: "Сохранять результаты на этом устройстве (учитываются в плане и Карте тем)",
    privacy: "Хранятся только тема, номер задачи, признак самостоятельного решения и дата (до 60 записей).",
    clear: "Сбросить результаты",
    empty: "После решения первой задачи здесь появится статистика по темам и расписание интервального повторения (через 2 и 7 дней).",
    allTopicsSummary: "Все 10 тем и расписание повторения",
    recommend: "Рекомендуемая тема",
    count: "самостоятельных задач (≥2 для закрепления темы)",
    storage: "Браузер ограничил доступ к хранилищу. Тренировка работает в текущей вкладке.",
    solved: "Пошаговое решение",
    aiToggle: "Разобрать ошибку подробнее",
    aiAsk: "Получить разбор шага",
    aiLoading: "Формируем разбор…",
    aiTitle: "Подробный разбор перехода",
    aiStepCheck: "Как проверить шаг:",
    aiNextHint: "Ориентир для задачи:",
    aiAdult: "Мне исполнилось 18 лет.",
    aiConsent: "Согласен отправить условие текущей задачи для получения разбора.",
    aiConsentRequired: "Отметьте оба пункта согласия (18+ и отправку условия задачи), чтобы получить разбор.",
    aiError: "Не удалось получить разбор. Проверьте отметки согласия или попробуйте снова.",
    privacyLink: "Приватность",
    badgeLive: "Живой разбор",
    badgePreview: "Разбор по правилу задачи"
  },
  kk: {
    navStudy: "Сабақ",
    navGraph: "Тақырыптар картасы",
    navExam: "Байқау ҰБТ",
    navPlan: "Менің жоспарым",
    navLab: "Қатемен жұмыс",
    navAbout: "Жоба туралы",
    tag: "Қатені табу жаттығуы",
    title: "Шешімдегі қате қадамды тап",
    intro: "Математикалық ереже алғаш бұзылған қадамды таңдап, түзетуді оқып шық және бекіту есебін шығар.",
    mobileTopicLabel: "Жаттығу тақырыбы",
    find: "1. Алғашқы қате қай қадамда жіберілген?",
    check: "Қадамды тексеру",
    choose: "Есептің шешу қадамдары",
    selectFirst: "Ереже алғаш бұзылған 1–3 қадамдардың бірін таңдаңыз.",
    stepValidNote: "Бұл қадам дұрыс — ереже сақталған. Келесі қадамды тексеріңіз:",
    reason: "Осы қадамдағы қатенің себебі",
    repair: "Дұрыс математикалық жол",
    transfer: "2. Есепті өз бетіңше шығар",
    answer: "Жауабыңыз",
    format: "Бүтін сан, ондық бөлшек немесе 3/7 түріндегі бөлшек.",
    verify: "Жауапты тексеру",
    hint: "Қадам бойынша көмек",
    reveal: "Шешімді көрсету",
    invalid: "Сан немесе бөлімі нөл емес бөлшек енгізіңіз.",
    wrong: "Жауап сәйкес келмеді. Жоғарыдағы дұрыс жолмен салыстырыңыз немесе көмекті ашыңыз.",
    right: "Дұрыс! Есеп шешілді.",
    guided: "Көмекпен немесе қайталау арқылы шешілді — тақырып қайталауға қойылды.",
    solo: "Бірінші әрекетте көмексіз өз бетімен шешілді.",
    next: "Келесі есеп",
    progress: "Прогресс және қайталау",
    memory: "Нәтижелерді осы құрылғыда сақтау (оқу жоспары мен Картада есептеледі)",
    privacy: "Тек тақырып, есеп нөмірі, өздік шешім белгісі және күн сақталады (60 жазбаға дейін).",
    clear: "Нәтижелерді тазарту",
    empty: "Бірінші есепті шығарғаннан кейін осы жерде тақырыптар статистикасы мен 2/7 күндік қайталау кестесі пайда болады.",
    allTopicsSummary: "Барлық 10 тақырып және қайталау кестесі",
    recommend: "Ұсынылатын тақырып",
    count: "өздік есеп (бекіту үшін ≥2)",
    storage: "Браузер сақтауды шектеді. Жаттығу осы бетте жұмыс істей береді.",
    solved: "Қадамдық шешім",
    aiToggle: "Қатені толығырақ талдау",
    aiAsk: "Қадам талдауын алу",
    aiLoading: "Талдауда…",
    aiTitle: "Қадамның толық талдауы",
    aiStepCheck: "Қадамды тексеру жолы:",
    aiNextHint: "Есепке бағыт:",
    aiAdult: "Мен 18 жасқа толдым.",
    aiConsent: "Талдау алу үшін ағымдағы есеп шартын жіберуге келісемін.",
    aiConsentRequired: "Талдау алу үшін екі келісім белгісін де (18+ және шартты жіберу) қойыңыз.",
    aiError: "Талдау алынбады. Келісім белгілерін тексеріңіз немесе қайталап көріңіз.",
    privacyLink: "Құпиялық",
    badgeLive: "Тікелей талдау",
    badgePreview: "Есеп ережесі бойынша талдау"
  },
  uz: {
    navStudy: "Dars",
    navGraph: "Mavzular xaritasi",
    navExam: "Sinov UBT",
    navPlan: "Mening rejam",
    navLab: "Xatolar ustida ishlash",
    navAbout: "Loyiha haqida",
    tag: "Xatoni topish mashqi",
    title: "Yechimdagi xato qadamni top",
    intro: "Matematik qoida birinchi marta buzilgan qadamni tanlang, tuzatishni o‘rganing va mustahkamlash masalasini yeching.",
    mobileTopicLabel: "Mashq mavzusi",
    find: "1. Birinchi xato qaysi qadamda qilingan?",
    check: "Qadamni tekshirish",
    choose: "Masalani yechish qadamlari",
    selectFirst: "Qoida birinchi marta buzilgan 1–3 qadamlardan birini tanlang.",
    stepValidNote: "Bu qadam to‘g‘ri — qoida saqlangan. Keyingi qadamni tekshiring:",
    reason: "Shu qadamdagi xato sababi",
    repair: "To‘g‘ri matematik o‘tish",
    transfer: "2. Masalani mustaqil yech",
    answer: "Javobingiz",
    format: "Butun son, o‘nli kasr yoki 3/7 shaklidagi kasr.",
    verify: "Javobni tekshirish",
    hint: "Qadam bo‘yicha yordam",
    reveal: "Yechimni ko‘rsatish",
    invalid: "Son yoki maxraji noldan farqli kasr kiriting.",
    wrong: "Javob mos kelmadi. Yuqoridagi to‘g‘ri o‘tish bilan solishtiring yoki yordamni oching.",
    right: "To‘g‘ri! Masala yechildi.",
    guided: "Yordam bilan yoki qayta urinishda yechildi — mavzu takrorlashga qo‘yildi.",
    solo: "Birinchi urinishda yordamsiz mustaqil yechildi.",
    next: "Keyingi masala",
    progress: "Natija va takrorlash",
    memory: "Natijalarni shu qurilmada saqlash (o‘quv rejasi va Xaritada hisobga olinadi)",
    privacy: "Faqat mavzu, masala raqami, mustaqil yechim belgisi va sana saqlanadi (60 tagacha).",
    clear: "Natijalarni o‘chirish",
    empty: "Birinchi masalani yechgandan so‘ng bu yerda mavzular statistikasi va 2/7 kunlik takrorlash jadvali paydo bo‘ladi.",
    allTopicsSummary: "Barcha 10 ta mavzu va takrorlash jadvali",
    recommend: "Tavsiya etilgan mavzu",
    count: "mustaqil masala (mustahkamlash uchun ≥2)",
    storage: "Brauzer xotirani chekladi. Mashq joriy sahifada ishlaydi.",
    solved: "Qadam-baqadam yechim",
    aiToggle: "Xatoni batafsil tahlil qilish",
    aiAsk: "Qadam tahlilini olish",
    aiLoading: "Tahlil qilinmoqda…",
    aiTitle: "O‘tishning batafsil tahlili",
    aiStepCheck: "Qadamni tekshirish usuli:",
    aiNextHint: "Masala uchun yo‘nalish:",
    aiAdult: "Men 18 yoshga to‘lganman.",
    aiConsent: "Yordam olish uchun joriy masala shartini yuborishga roziman.",
    aiConsentRequired: "Tahlil olish uchun ikkala rozilik belgisini (18+ va shartni yuborish) belgilang.",
    aiError: "Tahlil olinmadi. Rozilik belgilarini tekshiring yoki qayta urinib ko‘ring.",
    privacyLink: "Maxfiylik",
    badgeLive: "Jonli tahlil",
    badgePreview: "Masala qoidasi bo‘yicha tahlil"
  }
};

const reviewLabels = {
  ru: {
    title: "Интервальное повторение (2 / 7 дней)",
    due: "Повторить",
    open: "Открыть",
    new: "Ещё не решали",
    export: "Скачать историю (JSON)",
    note: "С подсказкой — повтор сегодня; после 1 самостоятельной задачи — через 2 дня; после 2 разных — через 7 дней.",
    reviewTopic: "Перейти к теме"
  },
  kk: {
    title: "Интервалдық қайталау (2 / 7 күн)",
    due: "Қайталау",
    open: "Ашу",
    new: "Әлі шешілмеді",
    export: "Тарихты жүктеу (JSON)",
    note: "Көмекпен — бүгін; 1 өздік есептен соң — 2 күнде; 2 түрлі өздік есептен соң — 7 күнде.",
    reviewTopic: "Тақырыпқа өту"
  },
  uz: {
    title: "Intervalli takrorlash (2 / 7 kun)",
    due: "Takrorlash",
    open: "Ochish",
    new: "Hali yechilmagan",
    export: "Tarixni yuklash (JSON)",
    note: "Yordam bilan — bugun; 1 mustaqil masaladan so‘ng — 2 kunda; 2 turli mustaqil masaladan so‘ng — 7 kunda.",
    reviewTopic: "Mavzuga o‘tish"
  }
};

type LabAiDiagnosis = {
  diagnosis: string;
  stepCheck: string;
  nextStepHint: string;
  source?: string;
};

const storageKey = "bilimai-lab-v1";
const initialProgress: Progress = { version: 1, records: [] };

export default function ErrorLab() {
  const [lang, setLang] = useState<Language>("ru");
  const [topic, setTopic] = useState<LabTopic>("linear");
  const [seed, setSeed] = useState(0);
  const [selection, setSelection] = useState<number | null>(null);
  const [found, setFound] = useState(false);
  const [stepWrong, setStepWrong] = useState(false);
  const [stepNotice, setStepNotice] = useState(false);
  const [stepMistakes, setStepMistakes] = useState(0);
  const [input, setInput] = useState("");
  const [hints, setHints] = useState(0);
  const [tries, setTries] = useState(0);
  const [solved, setSolved] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [persist, setPersist] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const [showAiPanel, setShowAiPanel] = useState(false);
  const [adult, setAdult] = useState(false);
  const [consent, setConsent] = useState(false);
  const [usedAi, setUsedAi] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiDiag, setAiDiag] = useState<LabAiDiagnosis | null>(null);

  const c = makeChallenge(topic, seed, lang);
  const t = labels[lang];
  const r = reviewLabels[lang];
  const wasIndependent = stepMistakes === 0 && hints === 0 && tries === 1 && !usedAi && !revealed;

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    queueMicrotask(() => {
      const params = new URLSearchParams(window.location.search);
      const requested = params.get("lang");
      if (requested === "ru" || requested === "kk" || requested === "uz") setLang(requested);
      const qTopic = params.get("topic");
      const validTopic: LabTopic =
        qTopic && (labTopics as readonly string[]).includes(qTopic) ? (qTopic as LabTopic) : "linear";
      if (validTopic !== "linear") setTopic(validTopic);
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const parsed = progressSchema.safeParse(JSON.parse(raw));
          if (parsed.success) {
            setProgress(parsed.data);
            setSeed(nextSeed(parsed.data, validTopic));
            setPersist(true);
          } else {
            localStorage.removeItem(storageKey);
          }
        }
      } catch {
        setStorageError(true);
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      if (persist) localStorage.setItem(storageKey, JSON.stringify(progress));
      else localStorage.removeItem(storageKey);
    } catch {
      queueMicrotask(() => setStorageError(true));
    }
  }, [persist, progress, loaded]);

  function reset() {
    setSelection(null);
    setFound(false);
    setStepWrong(false);
    setStepNotice(false);
    setStepMistakes(0);
    setInput("");
    setHints(0);
    setTries(0);
    setSolved(false);
    setRevealed(false);
    setMessage("");
    setShowAiPanel(false);
    setUsedAi(false);
    setAiDiag(null);
    setAiError("");
    setAiBusy(false);
  }

  function changeTopic(value: LabTopic) {
    reset();
    setTopic(value);
    setSeed(nextSeed(progress, value));
  }

  async function requestAiDiagnosis() {
    if (aiBusy) return;
    if (!adult || !consent) {
      setAiError(t.aiConsentRequired);
      return;
    }
    setAiBusy(true);
    setAiError("");
    setUsedAi(true);
    try {
      const res = await fetch("/api/lab-diagnose", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          topic,
          seed,
          language: lang,
          task: c.task,
          steps: c.steps,
          wrongStep: c.wrongStep,
          stepFound: found,
          ...(selection !== null ? { selectedStep: selection } : {}),
          ...(input.trim() ? { learnerAttempt: input.trim().slice(0, 80) } : {}),
          adult,
          consent
        })
      });
      if (!res.ok) {
        setAiError(t.aiError);
        return;
      }
      const data = (await res.json()) as LabAiDiagnosis;
      if (data.diagnosis && data.stepCheck && data.nextStepHint) {
        setAiDiag(data);
      } else {
        setAiError(t.aiError);
      }
    } catch {
      setAiError(t.aiError);
    } finally {
      setAiBusy(false);
    }
  }

  function verify() {
    if (solved || revealed) return;
    if (parseNumericAnswer(input) === null) {
      setMessage("invalid");
      return;
    }
    const correct = checkAnswer(input, c.answer);
    const currentTryIndex = tries;
    setTries(currentTryIndex + 1);
    if (!correct) {
      setMessage("wrong");
      return;
    }
    const independentSolve = stepMistakes === 0 && hints === 0 && currentTryIndex === 0 && !usedAi && !revealed;
    setSolved(true);
    setMessage("right");
    setProgress((p) => ({
      version: 1,
      records: [
        ...p.records,
        { topic, challenge: c.id, independent: independentSolve, date: new Date().toISOString() }
      ].slice(-60)
    }));
  }

  function download() {
    const url = URL.createObjectURL(new Blob([exportProgress(progress)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "BilimAI-my-practice.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function clear() {
    try {
      localStorage.removeItem(storageKey);
      setPersist(false);
      setProgress(initialProgress);
      reset();
    } catch {
      setStorageError(true);
    }
  }

  const schedule = reviewSchedule(progress, now);

  return (
    <div className="textbook-shell">
      <header className="site-header">
        <div className="wrap header-inner">
          <div className="header-top-row">
            <a className="brand" href={`/?lang=${lang}&topic=${topic}`}>
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
              <div className="lang-switcher" role="group" aria-label="Language">
                <button
                  type="button"
                  className={`lang-btn ${lang === "ru" ? "active" : ""}`}
                  aria-pressed={lang === "ru"}
                  onClick={() => setLang("ru")}
                >
                  RU
                </button>
                <button
                  type="button"
                  className={`lang-btn ${lang === "kk" ? "active" : ""}`}
                  aria-pressed={lang === "kk"}
                  onClick={() => setLang("kk")}
                >
                  ҚАЗ
                </button>
                <button
                  type="button"
                  className={`lang-btn ${lang === "uz" ? "active" : ""}`}
                  aria-pressed={lang === "uz"}
                  onClick={() => setLang("uz")}
                >
                  OʻZB
                </button>
              </div>
            </div>
          </div>

          <nav className="primary-nav" aria-label="Основные разделы">
            <a className="primary-nav-link" href={`/?lang=${lang}&topic=${topic}`}>
              {t.navStudy}
            </a>
            <a className="primary-nav-link" href={`/?lang=${lang}&tab=graph&topic=${topic}`}>
              {t.navGraph}
            </a>
            <a className="primary-nav-link" href={`/?lang=${lang}&tab=exam&topic=${topic}`}>
              {t.navExam}
            </a>
            <a className="primary-nav-link" href={`/?lang=${lang}&tab=roadmap&topic=${topic}`}>
              {t.navPlan}
            </a>
            <a className="primary-nav-link active" aria-current="page" href={`/lab?lang=${lang}&topic=${topic}`}>
              {t.navLab}
            </a>
          </nav>
        </div>
      </header>

      <main className="wrap main-container">
        <div className="mobile-topic-bar">
          <label htmlFor="mobile-lab-select">{t.mobileTopicLabel}</label>
          <select
            id="mobile-lab-select"
            name="mobileLabTopic"
            className="mobile-topic-select"
            value={topic}
            onChange={(e) => changeTopic(e.target.value as LabTopic)}
          >
            {labTopics.map((id, idx) => (
              <option key={id} value={id}>
                {String(idx + 1).padStart(2, "0")}. {topicName(id, lang)}
              </option>
            ))}
          </select>
        </div>

        <div className="lab-layout">
          <article className="surface">
            <div className="lab-topics lab-topics-desktop">
              {labTopics.map((id, idx) => (
                <button
                  key={id}
                  type="button"
                  className={`topic-chip ${id === topic ? "active" : ""}`}
                  aria-pressed={topic === id}
                  onClick={() => changeTopic(id)}
                >
                  <span>{String(idx + 1).padStart(2, "0")}.</span> {topicName(id, lang)}
                </button>
              ))}
            </div>

            <header className="lesson-head">
              <div className="lesson-meta-line">
                <span className="topic-index-label">
                  {t.tag} · {topicName(topic, lang)} · #{seed + 1}/24
                </span>
              </div>
              <h1 className="lesson-title">{t.title}</h1>
              <p className="lesson-intro">{t.intro}</p>
            </header>

            <div className="math-stage">
              <span className="math-stage-label">{t.find}</span>
              <div className="equation">{c.task}</div>
            </div>

            <div role="group" aria-label={t.choose} className="lab-steps">
              {c.steps.map((step, i) => {
                const isSelected = selection === i;
                const isBrokenStep = found && i === c.wrongStep;
                const isWrongGuess = stepWrong && isSelected;
                return (
                  <div key={i} className="lab-step-item">
                    <button
                      type="button"
                      disabled={found}
                      className={`lab-step ${isSelected ? "selected" : ""} ${isBrokenStep ? "broken-found" : ""} ${isWrongGuess ? "step-valid" : ""}`}
                      aria-pressed={isSelected}
                      onClick={() => {
                        setSelection(i);
                        setStepWrong(false);
                        setStepNotice(false);
                      }}
                    >
                      <span className="step-number">{i + 1}.</span>
                      <span className="step-math-line">{step}</span>
                    </button>

                    {/* Contextual hint right under the selected step if it was a valid step */}
                    {isWrongGuess && (
                      <div className="step-inline-feedback wrong" role="status">
                        <p className="m-0">
                          <strong>{t.stepValidNote}</strong> {c.hints[0]}
                        </p>
                      </div>
                    )}

                    {/* Contextual error explanation & repair right under the broken step once found */}
                    {isBrokenStep && (
                      <div className="step-inline-feedback correct" role="status">
                        <span className="rule-label">{t.reason}</span>
                        <p className="mt-1 mb-2">{c.explanation}</p>
                        <span className="rule-label">{t.repair}</span>
                        <p className="lab-math mt-1 mb-0">{c.repair}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {stepNotice && !found && selection === null && (
              <p className="feedback wrong mt-3" role="status">
                {t.selectFirst}
              </p>
            )}

            {!found && (
              <div className="practice-actions">
                <Button
                  onClick={() => {
                    if (selection === null) {
                      setStepNotice(true);
                      return;
                    }
                    setStepNotice(false);
                    if (selection === c.wrongStep) {
                      setFound(true);
                      setStepWrong(false);
                    } else {
                      setStepWrong(true);
                      setStepMistakes((m) => m + 1);
                    }
                  }}
                >
                  <CheckCircle2 size={16} />
                  {t.check}
                </Button>
                {stepWrong && (
                  <Button type="button" variant="outline" onClick={() => setShowAiPanel((v) => !v)}>
                    {t.aiToggle}
                  </Button>
                )}
              </div>
            )}

            {(showAiPanel || aiDiag) && (stepWrong || found) && (
              <div className="rule mt-4">
                <span className="rule-label block mb-2">{t.aiToggle}</span>
                <label className="checkline">
                  <Checkbox
                    checked={adult}
                    onCheckedChange={(v) => {
                      setAdult(v === true);
                      setAiError("");
                    }}
                  />
                  <span>{t.aiAdult}</span>
                </label>
                <label className="checkline mt-1">
                  <Checkbox
                    checked={consent}
                    onCheckedChange={(v) => {
                      setConsent(v === true);
                      setAiError("");
                    }}
                  />
                  <span>
                    {t.aiConsent} <a href="/privacy">{t.privacyLink}</a>
                  </span>
                </label>
                <div className="mt-3">
                  <Button
                    type="button"
                    size="sm"
                    disabled={aiBusy}
                    onClick={() => void requestAiDiagnosis()}
                  >
                    {aiBusy ? t.aiLoading : t.aiAsk}
                  </Button>
                </div>
                {aiError && (
                  <p role="alert" className="feedback wrong mt-2">
                    {aiError}
                  </p>
                )}
                {aiDiag && (
                  <section aria-live="polite" className="response mt-3">
                    <span className="rule-label">
                      {aiDiag.source === "claude" ? t.badgeLive : t.badgePreview}
                    </span>
                    <strong className="block mt-1 mb-1">{t.aiTitle}</strong>
                    <p className="mt-0 mb-2">{aiDiag.diagnosis}</p>
                    <strong>{t.aiStepCheck}</strong>
                    <p className="mt-0 mb-2">{aiDiag.stepCheck}</p>
                    <strong>{t.aiNextHint}</strong>
                    <p className="mt-0 mb-0">{aiDiag.nextStepHint}</p>
                  </section>
                )}
              </div>
            )}

            {found && (
              <div className="transfer-stage mt-6 pt-5 border-t border-[#e5e0d5]">
                <h2 className="steps-heading m-0">{t.transfer}</h2>
                <div className="practice-math-stem my-3">{c.transfer}</div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    verify();
                  }}
                >
                  <label htmlFor="lab-answer" className="form-label">
                    {t.answer} {c.unit ? `(${c.unit})` : ""}
                  </label>
                  <div className="transfer-input-row mt-1.5">
                    <input
                      id="lab-answer"
                      name="labAnswer"
                      inputMode="decimal"
                      className="lab-input"
                      value={input}
                      maxLength={48}
                      disabled={solved || revealed}
                      autoComplete="off"
                      aria-describedby="answer-format"
                      onChange={(e) => {
                        setInput(e.target.value);
                        setMessage("");
                      }}
                    />
                    {!solved && !revealed && (
                      <Button type="submit">{t.verify}</Button>
                    )}
                  </div>
                  <p id="answer-format" className="small mt-1.5">
                    {t.format}
                  </p>

                  {/* Feedback right next to the answer input */}
                  {message && (
                    <div
                      role="status"
                      className={`feedback mt-3 ${message === "wrong" || message === "invalid" ? "wrong" : "correct"}`}
                    >
                      <p className="m-0">
                        {t[message as keyof typeof t]}
                        {solved && <> {wasIndependent ? t.solo : t.guided}</>}
                      </p>
                    </div>
                  )}

                  {hints > 0 && (
                    <ol className="rule mt-3 list-decimal pl-8 space-y-1">
                      {c.hints.slice(0, hints).map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ol>
                  )}

                  {!solved && !revealed && (
                    <div className="practice-actions">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={hints >= 3}
                        onClick={() => setHints((v) => v + 1)}
                      >
                        {t.hint} ({hints}/3)
                      </Button>
                      <button
                        type="button"
                        className="quiet-text-action"
                        onClick={() => {
                          setRevealed(true);
                          setMessage("");
                        }}
                      >
                        {t.reveal}
                      </button>
                    </div>
                  )}
                </form>

                {(solved || revealed) && (
                  <div className="rule mt-4">
                    <span className="rule-label">{t.solved}</span>
                    <p className="lab-math my-2">{c.solution}</p>
                    <div className="mt-3">
                      <Button
                        onClick={() => {
                          reset();
                          setSeed(nextSeed(progress, topic));
                        }}
                      >
                        {t.next}
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </article>

          <aside className="lab-progress">
            <h2 className="topics-heading">{t.progress}</h2>
            {progress.records.length === 0 ? (
              <p className="small m-0">{t.empty}</p>
            ) : (
              <div className="mb-3">
                <p className="small mb-1.5">{t.recommend}:</p>
                <Button variant="outline" size="sm" onClick={() => changeTopic(recommendTopic(progress))}>
                  {topicName(recommendTopic(progress), lang)}
                </Button>
              </div>
            )}

            <details open={progress.records.length > 0} className="my-3">
              <summary className="cursor-pointer text-sm font-medium py-1">{t.allTopicsSummary}</summary>
              <ul className="mt-2">
                {labTopics.map((id) => (
                  <li key={id}>
                    <span>{topicName(id, lang)}</span>
                    <strong>
                      {new Set(progress.records.filter((rec) => rec.topic === id && rec.independent).map((rec) => rec.challenge)).size}/2
                    </strong>
                  </li>
                ))}
              </ul>
              <p className="small mt-1">{t.count}</p>
              <h3>{r.title}</h3>
              <ul>
                {schedule.map((item) => {
                  const tName = topicName(item.topic, lang);
                  return (
                    <li key={item.topic}>
                      <span>
                        {tName}
                        <br />
                        <small className="text-muted-foreground">
                          {!item.practiced ? r.new : item.due ? r.due : new Date(item.dueAt!).toLocaleDateString(lang)}
                        </small>
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        aria-label={`${r.reviewTopic}: ${tName}`}
                        onClick={() => changeTopic(item.topic)}
                      >
                        {item.due ? r.due : r.open}
                      </Button>
                    </li>
                  );
                })}
              </ul>
              <p className="small mb-2">{r.note}</p>
            </details>

            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-[#e5e0d5]">
              <label className="checkline my-1">
                <input
                  id="persist-checkbox"
                  name="persistProgress"
                  type="checkbox"
                  checked={persist}
                  onChange={(e) => setPersist(e.target.checked)}
                />
                <span>{t.memory}</span>
              </label>
              <p className="small m-0">{t.privacy}</p>
              {progress.records.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  <Button size="sm" variant="outline" onClick={download}>
                    {r.export}
                  </Button>
                  <Button size="sm" variant="outline" onClick={clear}>
                    {t.clear}
                  </Button>
                </div>
              )}
            </div>
            {storageError && (
              <p role="status" className="small mt-2">
                {t.storage}
              </p>
            )}
          </aside>
        </div>
      </main>
      <SiteFooter lang={lang} topic={topic} />
    </div>
  );
}
