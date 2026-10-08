"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
    back: "← К урокам",
    tag: "Лаборатория ошибок ЕНТ · 18+",
    title: "Найди сломанный шаг и закрепи правило на новой задаче.",
    intro: "Выбери строку, где впервые нарушено правило, изучи исправление и реши задачу на перенос.",
    static: "10 тем ЕНТ · по 24 упражнения на тему (RU / KK / UZ)",
    mobileTopicLabel: "Раздел практики",
    find: "1. Найди первый неверный шаг в решении",
    check: "Проверить выбранный шаг",
    choose: "Шаги решения задачи",
    miss: "Это не первый неверный шаг. Проверь переходы по порядку сверху вниз.",
    reason: "Почему это ошибка",
    repair: "Корректный математический переход",
    transfer: "2. Закрепи правило: реши новую задачу",
    answer: "Ваш ответ",
    format: "Целое число, десятичная дробь (через точку или запятую) или обыкновенная дробь вида 3/7. Для вероятности допустимы проценты.",
    verify: "Проверить ответ",
    hint: "Подсказка",
    reveal: "Показать решение",
    invalid: "Введите число или дробь с ненулевым знаменателем.",
    wrong: "Пока не совпало. Проверь вычисления или открой подсказку.",
    right: "Верно. Новая задача решена.",
    guided: "Решено с подсказкой или не с первой попытки — тема запланирована на повторение сегодня.",
    solo: "Решено самостоятельно с первой попытки без подсказок!",
    next: "Следующая задача →",
    progress: "Мой прогресс и повторение",
    memory: "Сохранять результаты на этом устройстве (учитываются в учебном плане)",
    privacy: "Хранятся только тема, номер задачи, признак самостоятельного решения и дата (до 60 записей).",
    clear: "Сбросить результаты",
    empty: "Пока нет решённых задач. Решите первую задачу слева — здесь появится статистика самостоятельных решений и график повторения (2 и 7 дней).",
    allTopicsSummary: "Показать все 10 тем и график повторения",
    recommend: "Следующая тема для закрепления",
    count: "самостоятельных задач (≥2 для базового закрепления темы)",
    storage: "Браузер ограничил доступ к хранилищу. Практика работает в текущей вкладке.",
    solved: "Эталонное решение",
    aiToggle: "Помощь по шагу (AI)",
    aiAsk: "Запросить разбор шага",
    aiLoading: "Анализируем шаг…",
    aiTitle: "Разбор перехода",
    aiStepCheck: "Как проверить шаг:",
    aiNextHint: "Ориентир для задачи:",
    aiAdult: "Мне исполнилось 18 лет.",
    aiConsent: "Согласен отправить условие текущей задачи для получения подсказки.",
    aiError: "Не удалось получить подсказку. Проверьте галочки согласия или попробуйте снова.",
    privacyLink: "Приватность",
    aboutLink: "О проекте",
    badgeLive: "Claude API · Живой разбор",
    badgePreview: "Демо-режим · Структурный разбор по правилу задачи"
  },
  kk: {
    back: "← Сабақтарға",
    tag: "ҰБТ қателер зертханасы · 18+",
    title: "Қате қадамды тап және ережені жаңа есепте бекіт.",
    intro: "Ереже алғаш бұзылған жолды таңдап, түзетуді оқып шық және жаңа есепті шығар.",
    static: "10 ҰБТ тақырыбы · әр тақырыпта 24 жаттығу (RU / KK / UZ)",
    mobileTopicLabel: "Жаттығу бөлімі",
    find: "1. Шешімдегі алғашқы қате қадамды тап",
    check: "Қадамды тексеру",
    choose: "Есептің шешу қадамдары",
    miss: "Бұл алғашқы қате қадам емес. Қадамдарды жоғарыдан төмен қарай ретімен тексеріңіз.",
    reason: "Бұл неге қате",
    repair: "Дұрыс математикалық жол",
    transfer: "2. Ережені бекіт: жаңа есепті шеш",
    answer: "Жауабыңыз",
    format: "Бүтін сан, ондық бөлшек немесе 3/7 түріндегі бөлшек. Ықтималдықты пайызбен де жазуға болады.",
    verify: "Жауапты тексеру",
    hint: "Көмек",
    reveal: "Шешімді көрсету",
    invalid: "Сан немесе бөлімі нөл емес бөлшек енгізіңіз.",
    wrong: "Әзірше сәйкес емес. Есептеуді тексеріңіз немесе көмек ашыңыз.",
    right: "Дұрыс. Жаңа есеп шешілді.",
    guided: "Көмекпен немесе қайталау арқылы шешілді — тақырып бүгін қайталауға қойылды.",
    solo: "Бірінші әрекетте көмексіз өз бетімен шешілді!",
    next: "Келесі есеп →",
    progress: "Менің прогресім және қайталау",
    memory: "Нәтижелерді осы құрылғыда сақтау (оқу жоспарында есептеледі)",
    privacy: "Тек тақырып, есеп нөмірі, өздік шешім белгісі және күн сақталады (60 жазбаға дейін).",
    clear: "Нәтижелерді тазарту",
    empty: "Әзірше шешілген есеп жоқ. Сол жақтағы бірінші есепті шығарыңыз — осы жерде өздік шешімдер мен 2/7 күндік қайталау кестесі пайда болады.",
    allTopicsSummary: "Барлық 10 тақырып пен қайталау кестесін көрсету",
    recommend: "Келесі бекітілетін тақырып",
    count: "өздік есеп (базалық бекіту үшін ≥2)",
    storage: "Браузер сақтауды шектеді. Жаттығу осы бетте жұмыс істей береді.",
    solved: "Эталондық шешім",
    aiToggle: "Қадам бойынша көмек (AI)",
    aiAsk: "Қадам талдауын сұрау",
    aiLoading: "Талдауда…",
    aiTitle: "Қадам талдауы",
    aiStepCheck: "Қадамды тексеру жолы:",
    aiNextHint: "Есепке бағыт:",
    aiAdult: "Мен 18 жасқа толдым.",
    aiConsent: "Көмек алу үшін ағымдағы есеп шартын жіберуге келісемін.",
    aiError: "Көмек алынбады. Келісім белгілерін тексеріңіз немесе қайталап көріңіз.",
    privacyLink: "Құпиялық",
    aboutLink: "Жоба туралы",
    badgeLive: "Claude API · Тікелей талдау",
    badgePreview: "Демо-режим · Есеп ережесі бойынша құрылымдық талдау"
  },
  uz: {
    back: "← Darslarga",
    tag: "Xatolar laboratoriyasi · 18+",
    title: "Xato qadamni top va qoidani yangi masalada mustahkamla.",
    intro: "Qoida birinchi marta buzilgan qatorni tanlang, tuzatishni o‘rganing va yangi masalani yeching.",
    static: "10 ta mavzu · har mavzuda 24 ta mashq (RU / KK / UZ)",
    mobileTopicLabel: "Mashq bo‘limi",
    find: "1. Yechimdagi birinchi xato qadamni top",
    check: "Qadamni tekshirish",
    choose: "Masalani yechish qadamlari",
    miss: "Bu birinchi xato qadam emas. Qadamlarni yuqoridan pastga tartib bilan tekshiring.",
    reason: "Nega bu xato",
    repair: "To‘g‘ri matematik o‘tish",
    transfer: "2. Qoidani mustahkamlash: yangi masalani yech",
    answer: "Javobingiz",
    format: "Butun son, o‘nli kasr yoki 3/7 shaklidagi kasr. Ehtimollikni foizda ham yozish mumkin.",
    verify: "Javobni tekshirish",
    hint: "Yordam",
    reveal: "Yechimni ko‘rsatish",
    invalid: "Son yoki maxraji noldan farqli kasr kiriting.",
    wrong: "Hali mos kelmadi. Hisobni tekshiring yoki yordamni oching.",
    right: "To‘g‘ri. Yangi masala yechildi.",
    guided: "Yordam bilan yoki qayta urinishda yechildi — mavzu bugun takrorlashga qo‘yildi.",
    solo: "Birinchi urinishda yordamsiz mustaqil yechildi!",
    next: "Keyingi masala →",
    progress: "Mening natijam va takrorlash",
    memory: "Natijalarni shu qurilmada saqlash (o‘quv rejasida hisobga olinadi)",
    privacy: "Faqat mavzu, masala raqami, mustaqil yechim belgisi va sana saqlanadi (60 tagacha).",
    clear: "Natijalarni o‘chirish",
    empty: "Hozircha yechilgan masala yo‘q. Chap tomondagi birinchi masalani yeching — bu yerda mustaqil yechimlar va 2/7 kunlik takrorlash jadvali paydo bo‘ladi.",
    allTopicsSummary: "Barcha 10 ta mavzu va takrorlash jadvalini ko‘rsatish",
    recommend: "Keyingi mustahkamlanadigan mavzu",
    count: "mustaqil masala (bazaviy mustahkamlash uchun ≥2)",
    storage: "Brauzer xotirani chekladi. Mashq joriy sahifada ishlaydi.",
    solved: "Namunaviy yechim",
    aiToggle: "Qadam bo‘yicha yordam (AI)",
    aiAsk: "Qadam tahlilini so‘rash",
    aiLoading: "Tahlil qilinmoqda…",
    aiTitle: "O‘tish tahlili",
    aiStepCheck: "Qadamni tekshirish usuli:",
    aiNextHint: "Masala uchun yo‘nalish:",
    aiAdult: "Men 18 yoshga to‘lganman.",
    aiConsent: "Yordam olish uchun joriy masala shartini yuborishga roziman.",
    aiError: "Yordam olinmadi. Rozilik belgilarini tekshiring yoki qayta urinib ko‘ring.",
    privacyLink: "Maxfiylik",
    aboutLink: "Loyiha haqida",
    badgeLive: "Claude API · Jonli tahlil",
    badgePreview: "Demo rejim · Masala qoidasi bo‘yicha tahlil"
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
      const requested = new URLSearchParams(window.location.search).get("lang");
      if (requested === "ru" || requested === "kk" || requested === "uz") setLang(requested);
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const parsed = progressSchema.safeParse(JSON.parse(raw));
          if (parsed.success) {
            setProgress(parsed.data);
            setSeed(nextSeed(parsed.data, "linear"));
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
    if (aiBusy || !adult || !consent) return;
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
    <>
      <header className="wrap top">
        <Link className="brand" href="/">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#175cd3" />
            <path d="M9 10h8.5a4.5 4.5 0 0 1 0 9H9V10zm0 9h9.5a4.5 4.5 0 0 1 0 9H9v-9z" fill="#fff" fillOpacity="0.92" />
          </svg>
          BilimAI <span className="beta">LAB</span>
        </Link>
        <nav className="topnav" aria-label="Language">
          <Link href="/">{t.back}</Link>
          <Link href="/about">{t.aboutLink}</Link>
          <div className="flex gap-1">
            {(["ru", "kk", "uz"] as Language[]).map((l) => (
              <Button key={l} size="sm" variant={lang === l ? "default" : "ghost"} aria-pressed={lang === l} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </Button>
            ))}
          </div>
        </nav>
      </header>

      <main className="wrap">
        <section className="compact-hero">
          <div className="compact-hero-text">
            <span className="eyebrow">{t.tag}</span>
            <h1>{t.title}</h1>
            <p>{t.intro}</p>
          </div>
        </section>

        <div className="mobile-topic-bar">
          <label htmlFor="mobile-lab-select" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t.mobileTopicLabel}
          </label>
          <select
            id="mobile-lab-select"
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
          <section className="surface">
            <div className="lab-topics lab-topics-desktop">
              {labTopics.map((id) => (
                <Button key={id} size="sm" variant={id === topic ? "default" : "outline"} aria-pressed={topic === id} onClick={() => changeTopic(id)}>
                  {topicName(id, lang)}
                </Button>
              ))}
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="lab-heading m-0">{t.find}</h2>
              <span className="section-pill">
                {topicName(topic, lang)} · #{seed + 1}/24
              </span>
            </div>
            <p className="lab-task">{c.task}</p>
            <div role="group" aria-label={t.choose} className="lab-steps">
              {c.steps.map((step, i) => (
                <button
                  key={i}
                  disabled={found}
                  className={`lab-step ${selection === i ? "selected" : ""}`}
                  aria-pressed={selection === i}
                  onClick={() => {
                    setSelection(i);
                    setStepWrong(false);
                  }}
                >
                  <span className="step-number">{i + 1}</span>
                  <span>{step}</span>
                </button>
              ))}
            </div>
            {!found && (
              <div className="actions">
                <Button
                  disabled={selection === null}
                  onClick={() => {
                    if (selection === c.wrongStep) {
                      setFound(true);
                      setStepWrong(false);
                    } else {
                      setStepWrong(true);
                      setStepMistakes((m) => m + 1);
                    }
                  }}
                >
                  {t.check}
                </Button>
                {stepWrong && (
                  <Button type="button" variant="outline" onClick={() => setShowAiPanel((v) => !v)}>
                    <Sparkles size={15} />
                    {t.aiToggle}
                  </Button>
                )}
              </div>
            )}
            {stepWrong && (
              <p className="feedback wrong" role="status">
                {t.miss}
              </p>
            )}

            {(showAiPanel || aiDiag) && (stepWrong || found) && (
              <div className="callout mt-3">
                <strong className="block text-sm mb-2">{t.aiToggle}</strong>
                <label className="checkline">
                  <Checkbox checked={adult} onCheckedChange={(v) => setAdult(v === true)} />
                  <span>{t.aiAdult}</span>
                </label>
                <label className="checkline mt-1">
                  <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} />
                  <span>
                    {t.aiConsent} <Link href="/privacy">{t.privacyLink}</Link>
                  </span>
                </label>
                <div className="mt-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={aiBusy || !adult || !consent}
                    onClick={() => void requestAiDiagnosis()}
                  >
                    <Sparkles size={14} />
                    {aiBusy ? t.aiLoading : t.aiAsk}
                  </Button>
                </div>
                {aiError && (
                  <p role="alert" className="error mt-2">
                    {aiError}
                  </p>
                )}
                {aiDiag && (
                  <section aria-live="polite" className="response mt-3">
                    <div className={`source-badge ${aiDiag.source === "claude" ? "live" : "preview"}`}>
                      {aiDiag.source === "claude" ? t.badgeLive : t.badgePreview}
                    </div>
                    <strong className="block mb-1">{t.aiTitle}</strong>
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
              <>
                <div className="callout" role="status">
                  <strong>{t.reason}</strong>
                  <p className="mt-1 mb-3">{c.explanation}</p>
                  <strong>{t.repair}</strong>
                  <p className="lab-math mt-1 mb-0">{c.repair}</p>
                </div>
                <h2 className="lab-heading">{t.transfer}</h2>
                <p className="lab-task">{c.transfer}</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    verify();
                  }}
                >
                  <label htmlFor="lab-answer" className="lab-answer-label">
                    {t.answer} {c.unit}
                  </label>
                  <input
                    id="lab-answer"
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
                  <p id="answer-format" className="small mt-1">
                    {t.format}
                  </p>
                  <div className="actions">
                    <Button type="submit" disabled={!input.trim() || solved || revealed}>
                      {t.verify}
                    </Button>
                    <Button type="button" variant="outline" disabled={hints >= 3 || solved || revealed} onClick={() => setHints((v) => v + 1)}>
                      {t.hint} {hints}/3
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAiPanel((v) => !v)}>
                      <Sparkles size={15} />
                      {t.aiToggle}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={solved || revealed}
                      onClick={() => {
                        setRevealed(true);
                        setMessage("");
                      }}
                    >
                      {t.reveal}
                    </Button>
                  </div>
                </form>
                {hints > 0 && (
                  <ol className="callout list-decimal pl-8 space-y-1">
                    {c.hints.slice(0, hints).map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ol>
                )}
                {message && (
                  <p role="status" className={`feedback ${message === "wrong" || message === "invalid" ? "wrong" : ""}`}>
                    {t[message as keyof typeof t]}
                    {solved && <> {wasIndependent ? t.solo : t.guided}</>}
                  </p>
                )}
                {(solved || revealed) && (
                  <div className="callout">
                    <strong>{t.solved}</strong>
                    <p className="lab-math my-2">{c.solution}</p>
                    <Button
                      onClick={() => {
                        reset();
                        setSeed(nextSeed(progress, topic));
                      }}
                    >
                      {t.next}
                    </Button>
                  </div>
                )}
              </>
            )}
          </section>

          <aside className="surface lab-progress">
            <h2>{t.progress}</h2>
            {progress.records.length === 0 ? (
              <div className="callout my-2">
                <p className="small m-0">{t.empty}</p>
              </div>
            ) : (
              <div className="mb-3">
                <p className="small mb-1">{t.recommend}:</p>
                <Button variant="outline" size="sm" onClick={() => changeTopic(recommendTopic(progress))}>
                  {topicName(recommendTopic(progress), lang)}
                </Button>
              </div>
            )}

            <details open={progress.records.length > 0} className="my-2">
              <summary className="cursor-pointer text-sm font-semibold py-1">{t.allTopicsSummary}</summary>
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

            <div className="flex flex-col gap-2 mt-3">
              <label className="checkline my-1">
                <input type="checkbox" checked={persist} onChange={(e) => setPersist(e.target.checked)} />
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
      <footer className="wrap foot">
        <span>{t.static}</span>
        <div>
          <Link href="/">{t.back}</Link>
          <Link href="/about">{t.aboutLink}</Link>
          <Link href="/privacy">{t.privacyLink}</Link>
        </div>
      </footer>
    </>
  );
}
