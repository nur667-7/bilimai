"use client";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Calendar, CheckCircle2, ChevronDown, FlaskConical, GitBranch, Microscope, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { PixelBrandMark } from "@/components/pixel-mosaic";
import { ThemeToggleButton, useAniqTheme } from "@/components/hero-canvas";
import {
  makeChallenge,
  checkAnswer,
  formatLabTask,
  parseNumericAnswer,
  progressSchema,
  recommendTopic,
  topicName,
  nextSeed,
  reviewSchedule,
  exportProgress,
  labTopics,
  getTopicErrorReasonId
} from "@/lib/error-lab";
import type { LabTopic, Progress } from "@/lib/error-lab";
import { lessons, type Language } from "@/lib/lessons";

import { saveNavContext } from "@/lib/user-profile";
import { useAuxiliaryPageNavigation } from "@/lib/use-study-navigation";
import { Compass, User } from "lucide-react";

const labels = {
  ru: {
    navToday: "Сегодня",
    navLearn: "Учиться",
    navExam: "Пробное ЕНТ",
    navProfile: "Профиль",
    navHowItWorks: "Как работает BilimAI",
    navAbout: "О проекте",
    subLesson: "Урок и практика",
    subGraph: "Карта тем (16)",
    subXray: "Проверить черновик",
    subLab: "Тренировка ошибок",
    subAi: "Вопрос по теме",
    changeModeBtn: "Сменить режим",
    topicsHeading: "16 тем математики ЕНТ",
    mobileTopicLabel: "Тема математики",
    tag: "Тренировка поиска ошибки",
    title: "Найди первый неверный шаг и реши задачу",
    purposeNote: "Нажмите на первый неверный шаг в решении.",
    howItWorksTitle: "Как это работает",
    intro:
      "Двухшаговый тренажёр: 1) выберите шаг (01–03), на котором впервые нарушено математическое правило, 2) решите новую задачу с другими числами для закрепления. Чтобы проверить собственное решение, откройте «Проверить черновик».",
    taskLabel: "1. Условие задачи и готовый черновик с ошибкой",
    check: "Проверить шаг",
    choose: "Шаги решения задачи",
    selectedBadge: "Выбрано",
    brokenBadge: "Ошибка здесь",
    validBadge: "Шаг верен",
    selectFirst: "Выберите один из шагов 01–03, где впервые нарушено правило.",
    stepValidNote: "Этот переход верен — правило здесь сохранено. Проверь следующий шаг:",
    reason: "§ В чём ошибка на этом шаге",
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
    progress: "Прогресс по темам",
    emptyShort: "Реши первую задачу — здесь появится результат и график интервального повторения.",
    allTopicsSummary: "Все 16 тем и график повторения (2 / 7 дней)",
    storageSettingsTitle: "Настройки сохранения и экспорт",
    memory: "Сохранять результаты в браузере на этом устройстве (учитываются в плане и Карте тем)",
    privacy: "Анонимный режим для школьников: хранятся только тема, номер задачи и дата (до 60 записей).",
    clear: "Сбросить результаты",
    recommend: "Рекомендуемая тема",
    count: "самостоятельных задач (≥2 для закрепления темы)",
    storage: "Браузер ограничил доступ к хранилищу. Тренировка работает в текущей вкладке.",
    solved: "Пошаговое решение",
    aiAskInstant: "Разобрать шаг с ИИ-тьютором (Claude API)",
    aiLoading: "ИИ-тьютор анализирует шаг…",
    aiTitle: "Разбор инварианта шага (Claude API)",
    aiStepCheck: "Как проверить переход:",
    aiNextHint: "Ориентир для вычислений:",
    aiError: "Не удалось получить разбор. Попробуйте ещё раз.",
    badgeLive: "Claude API · Живой разбор",
    badgePreview: "Инвариант задачи · Резервный контур"
  },
  kk: {
    navToday: "Бүгін",
    navLearn: "Оқу",
    navExam: "Байқау ҰБТ",
    navProfile: "Профиль",
    navHowItWorks: "BilimAI қалай жұмыс істейді",
    navAbout: "Жоба туралы",
    subLesson: "Сабақ және жаттығу",
    subGraph: "Тақырыптар картасы (16)",
    subXray: "Жазбаны тексеру",
    subLab: "Қатемен жұмыс",
    subAi: "Тақырып сұрағы",
    changeModeBtn: "Режимді ауыстыру",
    topicsHeading: "ҰБТ 16 тақырыбы",
    mobileTopicLabel: "Математика тақырыбы",
    tag: "Қатені табу жаттығуы",
    title: "Алғашқы қате қадамды тап және есеп шығар",
    purposeNote: "Шешімдегі алғашқы қате қадамды басыңыз.",
    howItWorksTitle: "Қалай жұмыс істейді",
    intro:
      "Екі қадамдық жаттығу: 1) математикалық ереже алғаш бұзылған қадамды (01–03) таңдаңыз, 2) жаңа сандармен бекіту есебін шығарыңыз. Өз шешіміңізді тексеру үшін «Жазбаны тексеру» бөлімін ашыңыз.",
    taskLabel: "1. Есеп шарты және қатесі бар шешім",
    check: "Қадамды тексеру",
    choose: "Есептің шешу қадамдары",
    selectedBadge: "Таңдалды",
    brokenBadge: "Қате осында",
    validBadge: "Қадам дұрыс",
    selectFirst: "Ереже алғаш бұзылған 01–03 қадамдардың бірін таңдаңыз.",
    stepValidNote: "Бұл қадам дұрыс — ереже сақталған. Келесі қадамды тексеріңіз:",
    reason: "§ Осы қадамдағы қатенің себебі",
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
    progress: "Тақырыптар прогресі",
    emptyShort: "Бірінші есепті шығарыңыз — осы жерде нәтиже мен қайталау кестесі пайда болады.",
    allTopicsSummary: "Барлық 16 тақырып және қайталау кестесі (2 / 7 күн)",
    storageSettingsTitle: "Сақтау баптаулары және экспорт",
    memory: "Нәтижелерді осы құрылғыда сақтау (оқу жоспары мен Картада есептеледі)",
    privacy: "Оқушыларға арналған анонимді режим: тек тақырып, есеп нөмірі және күн сақталады (60 жазбаға дейін).",
    clear: "Нәтижелерді тазарту",
    recommend: "Ұсынылатын тақырып",
    count: "өздік есеп (бекіту үшін ≥2)",
    storage: "Браузер сақтауды шектеді. Жаттығу осы бетте жұмыс істей береді.",
    solved: "Қадамдық шешім",
    aiAskInstant: "Қадамды ЖИ-тьютормен талдау (Claude API)",
    aiLoading: "ЖИ-тьютор қадамды талдауда…",
    aiTitle: "Қадам инвариантының талдауы (Claude API)",
    aiStepCheck: "Қадамды тексеру жолы:",
    aiNextHint: "Есепке бағыт:",
    aiError: "Талдау алынбады. Қайталап көріңіз.",
    badgeLive: "Claude API · Тікелей талдау",
    badgePreview: "Есеп инварианты · Резервтік контур"
  },
  uz: {
    navToday: "Bugun",
    navLearn: "O‘qish",
    navExam: "Sinov UBT",
    navProfile: "Profil",
    navHowItWorks: "BilimAI qanday ishlaydi",
    navAbout: "Loyiha haqida",
    subLesson: "Dars va mashq",
    subGraph: "Mavzular xaritasi (16)",
    subXray: "Qoralamani tekshirish",
    subLab: "Xatolar ustida ishlash",
    subAi: "Mavzu savoli",
    changeModeBtn: "Rejimni almashtirish",
    topicsHeading: "16 ta kurs mavzusi",
    mobileTopicLabel: "Matematika mavzusi",
    tag: "Xatoni topish mashqi",
    title: "Birinchi xato qadamni top va masalani yech",
    purposeNote: "Yechimdagi birinchi xato qadamni bosing.",
    howItWorksTitle: "Qanday ishlaydi",
    intro:
      "Ikki bosqichli mashq: 1) matematik qoida birinchi marta buzilgan qadamni (01–03) tanlang, 2) yangi sonlar bilan mustahkamlash masalasini yeching. O‘z yechimingizni tekshirish uchun «Qoralamani tekshirish» bo‘limini oching.",
    taskLabel: "1. Masala sharti va xatosi bor yechim",
    check: "Qadamni tekshirish",
    choose: "Masalani yechish qadamlari",
    selectedBadge: "Tanlandi",
    brokenBadge: "Xato shu yerda",
    validBadge: "Qadam to‘g‘ri",
    selectFirst: "Qoida birinchi marta buzilgan 01–03 qadamlardan birini tanlang.",
    stepValidNote: "Bu qadam to‘g‘ri — qoida saqlangan. Keyingi qadamni tekshiring:",
    reason: "§ Shu qadamdagi xato sababi",
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
    progress: "Mavzular natijasi",
    emptyShort: "Birinchi masalani yeching — bu yerda natija va takrorlash jadvali paydo bo‘ladi.",
    allTopicsSummary: "Barcha 16 ta mavzu va takrorlash jadvali (2 / 7 kun)",
    storageSettingsTitle: "Saqlash sozlamalari va eksport",
    memory: "Natijalarni shu qurilmada saqlash (o‘quv rejasi va Xaritada hisobga olinadi)",
    privacy: "Maktab o‘quvchilari uchun anonim rejim: faqat mavzu, masala raqami va sana saqlanadi (60 tagacha).",
    clear: "Natijalarni o‘chirish",
    recommend: "Tavsiya etilgan mavzu",
    count: "mustaqil masala (mustahkamlash uchun ≥2)",
    storage: "Brauzer xotirani chekladi. Mashq joriy sahifada ishlaydi.",
    solved: "Qadam-baqadam yechim",
    aiAskInstant: "Qadamni SI-tyutor bilan tahlil qilish (Claude API)",
    aiLoading: "SI-tyutor tahlil qilmoqda…",
    aiTitle: "O‘tish invariantining tahlili (Claude API)",
    aiStepCheck: "Qadamni tekshirish usuli:",
    aiNextHint: "Masala uchun yo‘nalish:",
    aiError: "Tahlil olinmadi. Qayта urinib ko‘ring.",
    badgeLive: "Claude API · Jonli tahlil",
    badgePreview: "Masala invarianti · Zaxira konturi"
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

export default function ErrorLab({
  initialLang = "ru",
  initialTopic = "linear"
}: {
  initialLang?: Language;
  initialTopic?: LabTopic;
} = {}) {
  const { dark, toggleTheme } = useAniqTheme();
  const { lang, setLang, updateQueryParams } = useAuxiliaryPageNavigation(initialLang);
  const [topic, setTopic] = useState<LabTopic>(initialTopic);
  const [seed, setSeed] = useState(0);
  const [selection, setSelection] = useState<number | null>(null);
  const [found, setFound] = useState(false);
  const [stepWrong, setStepWrong] = useState(false);
  const [stepNotice, setStepNotice] = useState(false);
  const [stepMistakes, setStepMistakes] = useState(0);
  const [input, setInput] = useState("");
  const [firstWrongAnswer, setFirstWrongAnswer] = useState("");
  const [hints, setHints] = useState(0);
  const [tries, setTries] = useState(0);
  const [solved, setSolved] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [persist, setPersist] = useState(true);
  const [storageError, setStorageError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const [usedAi, setUsedAi] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiDiag, setAiDiag] = useState<LabAiDiagnosis | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const c = makeChallenge(topic, seed, lang);
  const t = labels[lang];
  const r = reviewLabels[lang];
  const topicIdx = labTopics.indexOf(topic);
  const currentLessonMeta = lessons[lang].find((l) => l.id === topic);
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
        qTopic && (labTopics as readonly string[]).includes(qTopic)
          ? (qTopic as LabTopic)
          : initialTopic;
      if (validTopic !== topic) setTopic(validTopic);
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
    function onPopState() {
      const params = new URLSearchParams(window.location.search);
      const qLang = params.get("lang");
      if (qLang === "ru" || qLang === "kk" || qLang === "uz") setLang(qLang);
      const qTopic = params.get("topic");
      if (qTopic && (labTopics as readonly string[]).includes(qTopic)) {
        setTopic(qTopic as LabTopic);
      }
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      saveNavContext({
        tab: "lesson",
        topic,
        subject: "math",
        lang
      });
    } catch {}
  }, [lang, topic, loaded]);

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
    setFirstWrongAnswer("");
    setHints(0);
    setTries(0);
    setSolved(false);
    setRevealed(false);
    setMessage("");
    setUsedAi(false);
    setAiDiag(null);
    setAiError("");
    setAiBusy(false);
  }

  function changeTopic(value: LabTopic) {
    reset();
    setTopic(value);
    setSeed(nextSeed(progress, value));
    updateQueryParams({ lang, topic: value }, "push");
  }

  function changeLang(nextLang: Language) {
    setLang(nextLang);
    updateQueryParams({ lang: nextLang, topic }, "replace");
  }

  async function requestAiDiagnosis() {
    if (aiBusy) return;
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
          adult: true,
          consent: true
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
      if (!firstWrongAnswer && input.trim()) {
        setFirstWrongAnswer(input.trim().slice(0, 80));
      }
      setMessage("wrong");
      return;
    }
    const independentSolve = stepMistakes === 0 && hints === 0 && currentTryIndex === 0 && !usedAi && !revealed;
    const totalHintsUsed = Math.min(10, hints + stepMistakes + (usedAi ? 1 : 0));
    setSolved(true);
    setMessage("right");
    setProgress((p) => ({
      version: 1,
      records: [
        ...p.records,
        {
          topic,
          challenge: c.id,
          independent: independentSolve,
          date: new Date().toISOString(),
          ...(firstWrongAnswer ? { wrongAnswer: firstWrongAnswer } : {}),
          hintsUsed: totalHintsUsed,
          errorReason: getTopicErrorReasonId(topic),
          verifiedClean: independentSolve
        }
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
    <div className="textbook-shell has-mobile-bottom-nav">
      <header className="site-header">
        <div className="wrap header-inner">
          <div className="header-top-row">
            <a className="aniq-brand-logo" href={`/?lang=${lang}`}>
              <PixelBrandMark size={26} />
              <span className="aniq-logo-word">BilimAI</span>
              <span className="brand-sub hide-on-narrow-mobile">ЕНТ · ҰБТ</span>
            </a>

            {/* 4 Goal-Oriented Primary Sections (Inline on Desktop, Fixed Bottom Nav on Mobile) */}
            <nav className="primary-nav" aria-label="Основные разделы">
              <a className="primary-nav-link" href={`/?lang=${lang}&tab=today&topic=${topic}`}>
                <Compass size={15} />
                <span>{t.navToday}</span>
              </a>
              <a className="primary-nav-link active" aria-current="page" href={`/lab?lang=${lang}&topic=${topic}`}>
                <BookOpen size={15} />
                <span>{t.navLearn}</span>
              </a>
              <a className="primary-nav-link" href={`/?lang=${lang}&tab=exam&topic=${topic}`}>
                <Target size={15} />
                <span>{t.navExam}</span>
              </a>
              <a className="primary-nav-link" href={`/?lang=${lang}&tab=profile&topic=${topic}`}>
                <User size={15} />
                <span>{t.navProfile}</span>
              </a>
            </nav>

            <div className="header-right">
              <div className="lang-switcher" role="group" aria-label="Language">
                <button
                  type="button"
                  className={`lang-btn ${lang === "ru" ? "active" : ""}`}
                  aria-pressed={lang === "ru"}
                  onClick={() => changeLang("ru")}
                >
                  РУС
                </button>
                <button
                  type="button"
                  className={`lang-btn ${lang === "kk" ? "active" : ""}`}
                  aria-pressed={lang === "kk"}
                  onClick={() => changeLang("kk")}
                >
                  ҚАЗ
                </button>
                <button
                  type="button"
                  className={`lang-btn ${lang === "uz" ? "active" : ""}`}
                  aria-pressed={lang === "uz"}
                  onClick={() => changeLang("uz")}
                >
                  OʻZB
                </button>
              </div>

              <ThemeToggleButton dark={dark} onToggle={toggleTheme} />
            </div>
          </div>
        </div>
      </header>

      <main className="wrap main-container">
        {/* Sub-navigation inside "Учиться" */}
        <div className="learn-subnav-wrap mb-3">
          <nav
            className={`learn-subnav ${mobileMenuOpen ? "is-mobile-open" : ""}`}
            aria-label={t.navLearn}
          >
            <a
              className="learn-subnav-pill"
              href={`/?lang=${lang}&tab=lesson&topic=${topic}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookOpen size={14} />
              <span>{t.subLesson}</span>
            </a>
            <a
              className="learn-subnav-pill"
              href={`/?lang=${lang}&tab=graph&topic=${topic}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <GitBranch size={14} />
              <span>{t.subGraph}</span>
            </a>
            <a
              className="learn-subnav-pill"
              href={`/?lang=${lang}&tab=xray&topic=${topic}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Microscope size={14} />
              <span>{t.subXray}</span>
            </a>
            <a
              className="learn-subnav-pill active"
              aria-current="page"
              href={`/lab?lang=${lang}&topic=${topic}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FlaskConical size={14} />
              <span>{t.subLab}</span>
            </a>
            <a
              className="learn-subnav-pill"
              href={`/?lang=${lang}&tab=ai&topic=${topic}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sparkles size={14} />
              <span>{t.subAi}</span>
            </a>

            <button
              type="button"
              className="learn-subnav-toggle-btn"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <span>{t.changeModeBtn}</span>
              <ChevronDown size={14} className={mobileMenuOpen ? "rotate-180 transition-transform" : "transition-transform"} />
            </button>
          </nav>
        </div>

        {/* Single-line mobile topic selector matching the study page */}
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

        <div className="workspace">
          {/* Unified Left Sidebar Topic List (Same position and design as Study) */}
          <aside className="topics" aria-label={t.topicsHeading}>
            <h2 className="topics-heading">{t.topicsHeading}</h2>
            <div className="topics-list">
              {lessons[lang].map((l, i) => (
                <button
                  key={l.id}
                  type="button"
                  className={`topic ${topic === l.id ? "active" : ""}`}
                  aria-pressed={topic === l.id}
                  onClick={() => changeTopic(l.id)}
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

          <div className="lab-main-column">
            {/* Primary Error-Finding Surface */}
            <article className="surface">
              <header className="lesson-head">
                <div className="lesson-meta-line">
                  <span className="topic-index-label">
                    {String(topicIdx + 1).padStart(2, "0")} · {currentLessonMeta?.section ?? t.tag} · {topicName(topic, lang)} · #{seed + 1}/24
                  </span>
                </div>
                <h1 className="lesson-title">{t.title}</h1>
                <p className="lesson-intro lab-purpose-note">{t.purposeNote}</p>
                <details className="lab-how-details how-it-works-details mt-2">
                  <summary>{t.howItWorksTitle}</summary>
                  <p>{t.intro}</p>
                </details>
              </header>

              <div className="math-stage">
                <span className="math-stage-label">{t.taskLabel}</span>
                <div className="equation">{formatLabTask(c.task)}</div>
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
                        <span className="step-number">{String(i + 1).padStart(2, "0")} →</span>
                        <span className="step-math-line">{step}</span>
                        <span className="option-status-indicator" aria-hidden="true">
                          {isBrokenStep
                            ? t.brokenBadge
                            : isWrongGuess
                              ? t.validBadge
                              : isSelected
                                ? t.selectedBadge
                                : ""}
                        </span>
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
                <p className="feedback wrong" role="status">
                  {t.selectFirst}
                </p>
              )}

              <div className="practice-actions">
                {!found && (
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
                )}

                {(stepWrong || found) && (
                  <button
                    type="button"
                    className="quiet-text-action"
                    disabled={aiBusy}
                    onClick={() => void requestAiDiagnosis()}
                  >
                    <Sparkles size={14} />
                    {aiBusy ? t.aiLoading : t.aiAskInstant}
                  </button>
                )}
              </div>

              {aiError && (
                <p role="alert" className="feedback wrong">
                  {aiError}
                </p>
              )}

              {aiDiag && (
                <section aria-live="polite" className="response">
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

              {found && (
                <div className="transfer-stage">
                  <h2 className="steps-heading">{t.transfer}</h2>
                  <div className="practice-math-stem">{formatLabTask(c.transfer)}</div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      verify();
                    }}
                  >
                    <label htmlFor="lab-answer" className="form-label">
                      {t.answer} {c.unit ? `(${c.unit})` : ""}
                    </label>
                    <div className="transfer-input-row">
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
                    <p id="answer-format" className="small">
                      {t.format}
                    </p>

                    {message && (
                      <div
                        role="status"
                        className={`feedback ${message === "wrong" || message === "invalid" ? "wrong" : "correct"}`}
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
                            setProgress((p) => ({
                              version: 1,
                              records: [
                                ...p.records,
                                {
                                  topic,
                                  challenge: c.id,
                                  independent: false,
                                  date: new Date().toISOString(),
                                  ...(firstWrongAnswer ? { wrongAnswer: firstWrongAnswer } : {}),
                                  hintsUsed: Math.min(10, hints + stepMistakes + 1),
                                  errorReason: getTopicErrorReasonId(topic),
                                  verifiedClean: false
                                }
                              ].slice(-60)
                            }));
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

            {/* Compact Progress & Spaced Repetition Footer Card */}
            <aside className="lab-progress" aria-label={t.progress}>
              <div className="lab-progress-head">
                <h2 className="topics-heading m-0">{t.progress}</h2>
                {progress.records.length === 0 ? (
                  <p className="small m-0">{t.emptyShort}</p>
                ) : (
                  <div className="lab-recommend-inline">
                    <span className="small">{t.recommend}:</span>
                    <Button variant="outline" size="sm" onClick={() => changeTopic(recommendTopic(progress))}>
                      {topicName(recommendTopic(progress), lang)}
                    </Button>
                  </div>
                )}
              </div>

              <div className="lab-progress-drawers">
                <details open={progress.records.length > 0} className="lab-drawer">
                  <summary>{t.allTopicsSummary}</summary>
                  <div className="lab-drawer-body">
                    <ul>
                      {labTopics.map((id) => (
                        <li key={id}>
                          <span>{topicName(id, lang)}</span>
                          <strong>
                            {new Set(progress.records.filter((rec) => rec.topic === id && rec.independent).map((rec) => rec.challenge)).size}/2
                          </strong>
                        </li>
                      ))}
                    </ul>
                    <p className="small">{t.count}</p>
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
                    <p className="small">{r.note}</p>
                  </div>
                </details>

                <details className="lab-drawer">
                  <summary>{t.storageSettingsTitle}</summary>
                  <div className="lab-drawer-body">
                    <label className="checkline">
                      <input
                        id="persist-checkbox"
                        name="persistProgress"
                        type="checkbox"
                        checked={persist}
                        onChange={(e) => setPersist(e.target.checked)}
                      />
                      <span>{t.memory}</span>
                    </label>
                    <p className="small">{t.privacy}</p>
                    {progress.records.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Button size="sm" variant="outline" onClick={download}>
                          {r.export}
                        </Button>
                        <Button size="sm" variant="outline" onClick={clear}>
                          {t.clear}
                        </Button>
                      </div>
                    )}
                    {storageError && (
                      <p role="status" className="small">
                        {t.storage}
                      </p>
                    )}
                  </div>
                </details>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Fixed 4-item Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav" aria-label="Мобильная навигация">
        <a
          className="mobile-bottom-nav-item"
          href={`/?lang=${lang}&tab=today&topic=${topic}`}
        >
          <Compass size={18} />
          <span>{t.navToday}</span>
        </a>
        <a
          className="mobile-bottom-nav-item active"
          aria-current="page"
          href={`/lab?lang=${lang}&topic=${topic}`}
        >
          <BookOpen size={18} />
          <span>{t.navLearn}</span>
        </a>
        <a
          className="mobile-bottom-nav-item"
          href={`/?lang=${lang}&tab=exam&topic=${topic}`}
        >
          <Target size={18} />
          <span>{t.navExam}</span>
        </a>
        <a
          className="mobile-bottom-nav-item"
          href={`/?lang=${lang}&tab=profile&topic=${topic}`}
        >
          <User size={18} />
          <span>{t.navProfile}</span>
        </a>
      </nav>

      <SiteFooter lang={lang} topic={topic} compact />
    </div>
  );
}
