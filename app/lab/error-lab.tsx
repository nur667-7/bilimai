"use client";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    back: "← К урокам и роадмапу ЕНТ",
    tag: "Лаборатория ошибок ЕНТ · 18+",
    title: "Ошибка — начало понимания.",
    intro: "10 разделов ЕНТ (240 задач на каждом языке): найди первый неверный шаг, разберись в причине поломки и реши новую задачу на перенос.",
    static: "10 тем ЕНТ · 720 локализованных сценариев + AI-диагностика шага",
    find: "1. Найди первый неверный шаг в решении",
    check: "Проверить выбранный шаг",
    choose: "Выберите шаг",
    miss: "Это не первый неверный шаг. Проверь переходы по порядку или запроси AI-диагностику.",
    reason: "Почему это ошибка",
    repair: "Корректный математический переход",
    transfer: "2. Закрепи правило: реши новую задачу",
    answer: "Ваш ответ",
    format: "Число, десятичная дробь (через точку или запятую) или обыкновенная дробь вида 3/7. Для вероятности допустимы проценты.",
    verify: "Проверить ответ",
    hint: "Подсказка",
    reveal: "Показать решение",
    invalid: "Введите число или дробь с ненулевым знаменателем.",
    wrong: "Пока не совпало. Проверь вычисления, открой подсказку или запроси AI-диагностику.",
    right: "Верно. Новая задача решена.",
    guided: "Решено после повторной попытки или с подсказкой. Повтори позже самостоятельно.",
    solo: "Решено с первой попытки без подсказок!",
    next: "Следующая задача →",
    progress: "Диагностика и повторение ЕНТ",
    memory: "Сохранять результаты на этом устройстве (учитываются в Роадмапе ЕНТ)",
    privacy: "Сохраняются только тема, номер задания, факт самостоятельного решения и дата (последние 60 записей).",
    clear: "Сбросить сохранённые результаты",
    empty: "Начни с любой темы ЕНТ. После решения обновится диагностика и график интервального повторения.",
    recommend: "Приоритетная тема сейчас",
    count: "разных задач без подсказок",
    limit: "10 разделов ЕНТ × 24 варианта на тему (240 задач на язык).",
    storage: "Браузер не разрешил сохранение. Практика продолжит работать в рамках сессии.",
    solved: "Эталонное решение",
    reset: "Удалено. Результаты текущей сессии сброшены.",
    aiAsk: "AI-разбор шага (Claude)",
    aiLoading: "Анализируем шаг…",
    aiTitle: "Диагностика шага от Claude AI",
    aiStepCheck: "Проверка перехода:",
    aiNextHint: "Микро-подсказка к задаче:",
    badgeLive: "Claude API · Живой разбор",
    badgePreview: "Structured Preview · Демо-режим (до активации ключей гранта)"
  },
  kk: {
    back: "← Сабақтар мен ҰБТ роадмапына",
    tag: "ҰБТ қателер зертханасы · 18+",
    title: "Қате — түсінудің бастауы.",
    intro: "ҰБТ-ның 10 бөлімі (әр тілде 240 есеп): алғашқы қате қадамды тап, себебін түсін және жаңа есепті өз бетіңмен шеш.",
    static: "10 ҰБТ тақырыбы · 720 сценарий + Claude AI қадам диагностикасы",
    find: "1. Шешімдегі алғашқы қате қадамды тап",
    check: "Қадамды тексеру",
    choose: "Қадамды таңдаңыз",
    miss: "Бұл алғашқы қате қадам емес. Қадамдарды ретімен тексеріңіз немесе AI-диагностиканы қолданыңыз.",
    reason: "Бұл неге қате",
    repair: "Дұрыс математикалық жол",
    transfer: "2. Ережені бекіт: жаңа есепті шеш",
    answer: "Жауабыңыз",
    format: "Сан, ондық бөлшек немесе 3/7 түріндегі бөлшек. Ықтималдықты пайызбен де беруге болады.",
    verify: "Жауапты тексеру",
    hint: "Көмек",
    reveal: "Шешімді көрсету",
    invalid: "Сан немесе бөлімі нөл емес бөлшек енгізіңіз.",
    wrong: "Әзірше сәйкес емес. Есепті тексеріңіз немесе көмек алыңыз.",
    right: "Дұрыс. Жаңа есеп шешілді.",
    guided: "Көмекпен шешілді — кейін көмексіз қайталаңыз.",
    solo: "Бірінші әрекетте көмексіз шешілді!",
    next: "Келесі есеп →",
    progress: "ҰБТ диагностикасы және қайталау",
    memory: "Нәтижелерді осы құрылғыда сақтау (ҰБТ роадмапында есептеледі)",
    privacy: "Тек тақырып, тапсырма нөмірі, нәтиже және күн сақталады (соңғы 60 нәтиже).",
    clear: "Сақталған нәтижелерді жою",
    empty: "Кез келген ҰБТ тақырыбынан бастаңыз. Шешкен соң ұсыныс пайда болады.",
    recommend: "Қазіргі басым тақырып",
    count: "көмексіз шешілген әртүрлі есеп",
    limit: "10 ҰБТ бөлімі × әр тақырыпта 24 нұсқа (әр тілде 240 есеп).",
    storage: "Браузер сақтауға рұқсат бермеді. Жаттығу сақтаусыз жұмыс істейді.",
    solved: "Эталондық шешім",
    reset: "Жойылды. Осы сессия нәтижелері тазартылды.",
    aiAsk: "Қадамды AI-мен талдау (Claude)",
    aiLoading: "Талдауда…",
    aiTitle: "Claude AI қадам диагностикасы",
    aiStepCheck: "Ауысуды тексеру:",
    aiNextHint: "Жаңа есепке бағыт:",
    badgeLive: "Claude API · Тікелей талдау",
    badgePreview: "Structured Preview · Демо-режим (грант кілті қосылғанға дейін)"
  },
  uz: {
    back: "← Darslar va o‘quv rejasiga",
    tag: "Xatolar laboratoriyasi · 18+",
    title: "Xato — tushunishning boshlanishi.",
    intro: "10 ta asosiy bo‘lim (har bir tilda 240 ta masala): birinchi xato qadamni top, sababini tushun va yangi masalani yech.",
    static: "10 ta bo‘lim · 720 ta ssenariy + Claude AI qadam diagnostikasi",
    find: "1. Yechimdagi birinchi xato qadamni top",
    check: "Qadamni tekshirish",
    choose: "Qadamni tanlang",
    miss: "Bu birinchi xato qadam emas. Qadamlarni tartib bilan tekshiring yoki AI-diagnostikani chaqiring.",
    reason: "Nega bu xato",
    repair: "To‘g‘ri matematik o‘tish",
    transfer: "2. Qoidani mustahkamlash: yangi masalani yech",
    answer: "Javobingiz",
    format: "Son, o‘nli kasr yoki 3/7 shaklidagi kasr. Ehtimollikni foizda ham yozish mumkin.",
    verify: "Javobni tekshirish",
    hint: "Yordam",
    reveal: "Yechimni ko‘rsatish",
    invalid: "Son yoki maxraji noldan farqli kasr kiriting.",
    wrong: "Hali mos kelmadi. Hisobni tekshiring yoki yordam oling.",
    right: "To‘g‘ri. Yangi masala yechildi.",
    guided: "Yordam bilan yechildi — keyin yordamsiz qaytaring.",
    solo: "Birinchi urinishda yordamsiz yechildi!",
    next: "Keyingi masala →",
    progress: "Diagnostika va takrorlash yo‘li",
    memory: "Natijalarni shu qurilmada saqlash (O‘quv rejasida hisobga olinadi)",
    privacy: "Faqat mavzu, topshiriq raqami, natija va sana saqlanadi (oxirgi 60 natija).",
    clear: "Saqlangan natijalarni o‘chirish",
    empty: "Istalgan mavzudan boshlang. Yechgandan keyin tavsiya paydo bo‘ladi.",
    recommend: "Keyingi ustuvor mavzu",
    count: "yordamsiz yechilgan turli masala",
    limit: "10 ta bo‘lim × har mavzuda 24 variant (har tilda 240 masala).",
    storage: "Brauzer saqlashga ruxsat bermadi. Mashq saqlashsiz ishlaydi.",
    solved: " Namunaviy yechim",
    reset: "O‘chirildi. Shu sessiya natijalari tozalandi.",
    aiAsk: "Qadamni AI bilan tahlil qilish (Claude)",
    aiLoading: "Tahlil qilinmoqda…",
    aiTitle: "Claude AI qadam diagnostikasi",
    aiStepCheck: "O‘tishni tekshirish:",
    aiNextHint: "Yangi masala uchun maslahat:",
    badgeLive: "Claude API · Jonli tahlil",
    badgePreview: "Structured Preview · Demo rejim (grant API kaliti ulangunga qadar)"
  }
};

const reviewLabels = {
  ru: {
    title: "График интервального повторения (2 / 7 дней)",
    due: "Повторить сегодня",
    new: "Ещё не пробовали",
    export: "Скачать историю практики (JSON)",
    note: "После решения с подсказкой — повторение сегодня; после первого самостоятельного — через 2 дня, после двух разных — через 7 дней."
  },
  kk: {
    title: "Интервалдық қайталау кестесі (2 / 7 күн)",
    due: "Бүгін қайталау",
    new: "Әлі орындалмады",
    export: "Нәтижелерімді жүктеу (JSON)",
    note: "Көмекпен шешкен соң — бүгін; бірінші өздік шешімнен кейін — 2 күнде, екі түрлі өздік есептен кейін — 7 күнде."
  },
  uz: {
    title: "Intervalli takrorlash jadvali (2 / 7 kun)",
    due: "Bugun takrorlash",
    new: "Hali bajarilmagan",
    export: "Natijalarimni yuklash (JSON)",
    note: "Yordam bilan yechgandan so‘ng — bugun; birinchi mustaqil yechimdan keyin — 2 kunda, ikkita turli mustaqil masaladan keyin — 7 kunda."
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
  const [now, setNow] = useState(0);

  const [aiBusy, setAiBusy] = useState(false);
  const [aiDiag, setAiDiag] = useState<LabAiDiagnosis | null>(null);

  const c = makeChallenge(topic, seed, lang);
  const t = labels[lang];
  const r = reviewLabels[lang];

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
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
        } else localStorage.removeItem(storageKey);
      }
    } catch {
      setStorageError(true);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      if (persist) localStorage.setItem(storageKey, JSON.stringify(progress));
      else localStorage.removeItem(storageKey);
    } catch {
      setStorageError(true);
    }
  }, [persist, progress, loaded]);

  function reset() {
    setSelection(null);
    setFound(false);
    setStepWrong(false);
    setInput("");
    setHints(0);
    setTries(0);
    setSolved(false);
    setRevealed(false);
    setMessage("");
    setAiDiag(null);
    setAiBusy(false);
  }

  function changeTopic(value: LabTopic) {
    reset();
    setTopic(value);
    setSeed(nextSeed(progress, value));
  }

  async function requestAiDiagnosis() {
    if (aiBusy) return;
    setAiBusy(true);
    try {
      const res = await fetch("/api/lab-diagnose", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          topic,
          language: lang,
          task: c.task,
          steps: c.steps,
          wrongStep: c.wrongStep,
          ...(selection !== null ? { selectedStep: selection } : {}),
          ...(input.trim() ? { learnerAttempt: input.trim().slice(0, 80) } : {}),
          adult: true,
          consent: true
        })
      });
      if (res.ok) {
        const data = (await res.json()) as LabAiDiagnosis;
        if (data.diagnosis && data.stepCheck && data.nextStepHint) {
          setAiDiag(data);
        }
      }
    } catch {
      // Fallback handled silently
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
    setTries(tries + 1);
    if (!correct) {
      setMessage("wrong");
      return;
    }
    setSolved(true);
    setMessage("right");
    setProgress((p) => ({
      version: 1,
      records: [
        ...p.records,
        { topic, challenge: c.id, independent: hints === 0 && tries === 0, date: new Date().toISOString() }
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

  return (
    <>
      <header className="wrap top">
        <a className="brand" href="/">
          <img src="/favicon.svg" alt="" />
          BilimAI <span className="beta">LAB · 10 ТЕМ ЕНТ</span>
        </a>
        <nav className="topnav" aria-label="Language">
          <a href="/">{t.back}</a>
          <a href="/about">About / EN</a>
          <div className="flex gap-1">
            {(["ru", "kk", "uz"] as Language[]).map((l) => (
              <Button key={l} size="sm" variant={lang === l ? "default" : "ghost"} aria-pressed={lang === l} onClick={() => setLang(l)}>
                {l === "ru" ? "Русский" : l === "kk" ? "Қазақша" : "O‘zbekcha"}
              </Button>
            ))}
          </div>
        </nav>
      </header>
      <main className="wrap">
        <section className="hero">
          <div>
            <span className="eyebrow">{t.tag}</span>
            <h1>{t.title}</h1>
            <p>{t.intro}</p>
          </div>
          <div className="hero-note">{t.static}</div>
        </section>
        <div className="lab-layout">
          <section className="surface">
            <div className="lab-topics">
              {labTopics.map((id) => (
                <Button key={id} size="sm" variant={id === topic ? "default" : "outline"} aria-pressed={topic === id} onClick={() => changeTopic(id)}>
                  {topicName(id, lang)}
                </Button>
              ))}
            </div>
            <div className="flex items-center justify-between flex-wrap gap-2 mt-5">
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
                    } else setStepWrong(true);
                  }}
                >
                  {t.check}
                </Button>
                <Button type="button" variant="outline" disabled={aiBusy} onClick={() => void requestAiDiagnosis()}>
                  <Sparkles size={15} />
                  {aiBusy ? t.aiLoading : t.aiAsk}
                </Button>
              </div>
            )}
            {stepWrong && (
              <p className="feedback wrong" role="status">
                {t.miss}
              </p>
            )}
            {aiDiag && (
              <section aria-live="polite" className="response">
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
                    <Button type="button" variant="outline" disabled={aiBusy} onClick={() => void requestAiDiagnosis()}>
                      <Sparkles size={15} />
                      {aiBusy ? t.aiLoading : t.aiAsk}
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
                    {solved && <> {hints === 0 && tries === 1 ? t.solo : t.guided}</>}
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
              <p className="small">{t.empty}</p>
            ) : (
              <div className="mb-3">
                <p className="small mb-1">{t.recommend}:</p>
                <Button variant="outline" size="sm" onClick={() => changeTopic(recommendTopic(progress))}>
                  {topicName(recommendTopic(progress), lang)}
                </Button>
              </div>
            )}
            <ul>
              {labTopics.map((id) => (
                <li key={id}>
                  <span>{topicName(id, lang)}</span>
                  <strong>{new Set(progress.records.filter((r) => r.topic === id && r.independent).map((r) => r.challenge)).size}</strong>
                </li>
              ))}
            </ul>
            <p className="small">
              {t.count}. {t.limit}
            </p>
            <h3>{r.title}</h3>
            <ul>
              {reviewSchedule(progress, now).map((item) => (
                <li key={item.topic}>
                  <span>
                    {topicName(item.topic, lang)}
                    <br />
                    <small className="text-muted-foreground">
                      {!item.practiced ? r.new : item.due ? r.due : new Date(item.dueAt!).toLocaleDateString(lang)}
                    </small>
                  </span>
                  <Button size="sm" variant="outline" onClick={() => changeTopic(item.topic)}>
                    {item.due ? r.due : "→"}
                  </Button>
                </li>
              ))}
            </ul>
            <p className="small mb-3">{r.note}</p>
            <div className="flex flex-col gap-2">
              <Button size="sm" variant="outline" disabled={!progress.records.length} onClick={download}>
                {r.export}
              </Button>
              <label className="checkline my-1">
                <input type="checkbox" checked={persist} onChange={(e) => setPersist(e.target.checked)} />
                <span>{t.memory}</span>
              </label>
              <p className="small m-0">{t.privacy}</p>
              <Button size="sm" variant="outline" onClick={clear}>
                {t.clear}
              </Button>
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
          <a href="/">{t.back}</a>
          <a href="/about">About / EN</a>
          <a href="/privacy">
            {lang === "ru" ? "Данные и приватность" : lang === "kk" ? "Деректер және құпиялық" : "Ma’lumotlar va maxfiylik"}
          </a>
        </div>
      </footer>
    </>
  );
}
