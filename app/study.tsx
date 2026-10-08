"use client";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { BookOpen, CheckCircle2, Compass, FlaskConical, Lightbulb, RotateCcw, Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { lessons, untTopicIds, type Language, type TopicId } from "@/lib/lessons";
import { buildBaselineRoadmap, progressSchema, topicName, type Progress } from "@/lib/error-lab";

const copyBase = {
  ru: {
    eyebrow: "Математика ЕНТ (ҰБТ) • Диагностическая платформа 18+",
    title: "Не заучивай. Разберись в логике каждого шага.",
    sub: "10 разделов спецификации ЕНТ (Математическая грамотность и Профильная математика), интерактивная лаборатория ошибок и персональный роадмап на базе Claude.",
    note: "Вместо выдачи готового ответа система учит находить место поломки в решении и переносить правило на новую задачу.",
    topics: "Программа ЕНТ (10 тем)",
    lesson: "Объяснение",
    practice: "Практика (3)",
    ai: "Спросить Claude",
    roadmapTab: "Роадмап ЕНТ (AI)",
    rule: "Инвариант и ключевое правило",
    example: "Эталонный разбор задачи ЕНТ",
    hint: "Сначала объясни каждый переход своими словами, затем проверь себя в практике или лаборатории ошибок.",
    check: "Проверить ответы",
    reset: "Пройти заново",
    correct: "Верно",
    wrong: "Разберём ошибку",
    result: "Ваш результат",
    choose: "Ответьте на все три контрольных вопроса.",
    session: "Ответы хранятся только в памяти текущей вкладки.",
    aiTitle: "Сократический разбор темы с Claude",
    aiSub: "Claude объясняет выбранный раздел ЕНТ с опорой на эталонное правило урока и даёт наводящую подсказку без спойлера ответов теста.",
    question: "Ваш вопрос по теме урока",
    placeholder: "Например: почему в теореме Виета сумма корней берётся с противоположным знаком?",
    quickLabel: "Быстрый пример для проверки:",
    quickQuestions: [
      "Почему при переносе слагаемого через знак равенства меняется знак?",
      "Как быстро проверить, не перепутаны ли формулы в этом разделе ЕНТ?",
      "На каком шаге чаще всего теряют баллы в этой теме на ЕНТ?"
    ],
    adult: "Мне исполнилось 18 лет.",
    consent: "Согласен передать текст учебного запроса для генерации ответа. Не ввожу личные данные.",
    ask: "Получить разбор",
    loading: "Формируем разбор…",
    pilot: "Режим проверки (Reviewer Demo): при активном ключе ANTHROPIC_API_KEY запрос идёт в живой Claude API (с лимитами D1), а до активации гранта возвращается детерминированный превью-ответ по схеме.",
    read: "О проекте / Architecture (EN)",
    privacy: "Данные и приватность",
    foot: "BilimAI · 10 модулей ЕНТ · 720 сценариев в Лаборатории ошибок · Kazakh / Russian / Uzbek",
    static: "Верифицированный учебный модуль · без галлюцинаций AI",
    next: "Повтори шаги, где возникла ошибка, и попробуй снова.",
    done: "Отлично! Переходи к следующей теме или открой Лабораторию ошибок.",
    rmTitle: "Персональный роадмап подготовки к ЕНТ",
    rmSub: "Базовый диагностический маршрут рассчитывается мгновенно по 10 темам ЕНТ, а Claude строит пошаговый недельный план под целевой балл.",
    rmTarget: "Целевой балл ЕНТ (из 50)",
    rmWeeks: "Недель до экзамена",
    rmWeak: "Приоритетные темы для проработки",
    rmGoal: "Ваша цель и основные трудности",
    rmGoalPlaceholder: "Например: путаю знаки в тригонометрии и формулы объёмов пирамиды, нужно набрать 42+ за 6 недель",
    rmPresets: [
      "Цель 45/50 за 6 недель (ИТ): путаю знаки в теореме Виета, логарифмах и тригонометрии",
      "Цель 38/50 за 4 недели: нужно подтянуть производную, площади и объёмы фигур"
    ],
    rmGenerate: "Сформировать персональный роадмап",
    rmBaseTitle: "Базовый диагностический маршрут (детерминированный расчёт)",
    rmPhase1: "Фаза 1 (недели 1–2): закрытие критических пробелов",
    rmPhase2: "Фаза 2 (недели 3+): закрепление и перенос навыка",
    rmClaudeTitle: "Персональный учебный план",
    rmMilestones: "План по неделям",
    rmHabit: "Ежедневный ритуал подготовки",
    badgeLive: "Claude API · Живой ответ",
    badgePreview: "Structured Preview · Демо-режим (до активации ключей гранта)"
  },
  uz: {
    eyebrow: "Matematika (UBT / Milliy sertifikat) • 18+ diagnostik platforma",
    title: "Yodlama. Har bir qadam mantiqini tushunib ol.",
    sub: "Imtihon dasturidagi 10 ta asosiy bo‘lim, interaktiv xatolar laboratoriyasi va Claude asosidagi shaxsiy o‘quv rejasi.",
    note: "Tayyor javobni berish o‘rniga tizim yechimdagi xato qadamni topishga va qoidani yangi masalada qo‘llashga o‘rgatadi.",
    topics: "Dastur bo‘limlari (10 mavzu)",
    lesson: "Tushuntirish",
    practice: "Mashq (3)",
    ai: "Claude’dan so‘rash",
    roadmapTab: "O‘quv rejasi (AI)",
    rule: "Asosiy qoida va invariant",
    example: "Namuna asosida qadam-baqadam tahlil",
    hint: "Har bir qadamni o‘z so‘zlaringiz bilan tushuntiring, keyin mashq yoki xatolar laboratoriyasida sinab ko‘ring.",
    check: "Javoblarni tekshirish",
    reset: "Qayta boshlash",
    correct: "To‘g‘ri",
    wrong: "Xatoni tahlil qilamiz",
    result: "Natijangiz",
    choose: "Uchala nazorat savoliga javob bering.",
    session: "Javoblar faqat joriy sahifa yopilguncha saqlanadi.",
    aiTitle: "Claude bilan Sokratik tahlil",
    aiSub: "Claude tanlangan mavzuni dars qoidasiga tayangan holda tushuntiradi va tayyor test javobini aytmasdan yo‘naltiruvchi maslahat beradi.",
    question: "Mavzu bo‘yicha savolingiz",
    placeholder: "Masalan: nega Viyet teoremasida ildizlar yig‘indisi qarama-qarshi ishora bilan olinadi?",
    quickLabel: "Tekshirish uchun tezkor savol:",
    quickQuestions: [
      "Nega hadni tenglikning boshqa tomoniga o‘tkazganda ishora o‘zgaradi?",
      "Shu bo‘limdagi formulalarni adashtirmaslik uchun nimaga e’tibor berish kerak?",
      "Imtihonda bu mavzuda ko‘пинча qaysi qadamda xato qilinadi?"
    ],
    adult: "Men 18 yoshga to‘lganman.",
    consent: "Javob olish uchun o‘quv so‘rovimni yuborishga roziman. Shaxsiy ma’lumot kiritmayman.",
    ask: "Tushuntirish olish",
    loading: "Javob tayyorlanmoqda…",
    pilot: "Ko‘rib chiqish rejimi (Reviewer Demo): ANTHROPIC_API_KEY yoqilganda so‘rov jonli Claude API’ga boradi, grant aktivatsiyasigacha esa sxema bo‘yicha deterministik prevyu qaytariladi.",
    read: "Loyiha haqida / EN",
    privacy: "Ma’lumotlar va maxfiylik",
    foot: "BilimAI · 10 ta bo‘lim · 720 ta xato tahlili ssenariysi · KK / RU / UZ",
    static: "Tekshirilgan o‘quv moduli · AI gallyutsinatsiyasisiz",
    next: "Xato qadamlarni takrorlang va testni yana bajaring.",
    done: "Ajoyib! Keyingi mavzuga o‘ting yoki Xatolar laboratoriyasini oching.",
    rmTitle: "Imtihonga tayyorgarlik shaxsiy роадмапи",
    rmSub: "10 ta bo‘lim bo‘yicha bazaviy diagnostika darhol ishlaydi, Claude esa maqsadingizga mos haftalik reja tuzib beradi.",
    rmTarget: "Maqsadli ball (50 dan)",
    rmWeeks: "Imtihongacha haftalar soni",
    rmWeak: "Kuchaytirish kerak bo‘lgan mavzular",
    rmGoal: "Maqsadingiz va asosiy qiyinchilik",
    rmGoalPlaceholder: "Masalan: logarifm va hosilada xato qilaman, 6 haftada 42+ ball yig‘ishim kerak",
    rmPresets: [
      "6 haftada 45/50 ball: Viyet teoremasi, logarifm va trigonometriyada ishora xatolari",
      "4 haftada 38/50 ball: hosila hamda geometrik yuzalar va hajmlar"
    ],
    rmGenerate: "Shaxsiy o‘quv rejasini tuzish",
    rmBaseTitle: "Bazaviy diagnostik yo‘nalish (deterministik hisob)",
    rmPhase1: "1-bosqich (1–2 hafta): asosiy bo‘shliqlarni yopish",
    rmPhase2: "2-bosqich (3+ hafta): mustahkamlash va ko‘nikmani tekshirish",
    rmClaudeTitle: "Shaxsiy o‘quv rejasi",
    rmMilestones: "Haftalik bosqichlar",
    rmHabit: "Kunlik tayyorgarlik odati",
    badgeLive: "Claude API · Jonli javob",
    badgePreview: "Structured Preview · Demo rejim (grant API kaliti ulangunga qadar)"
  }
};

const copy = {
  ...copyBase,
  kk: {
    eyebrow: "ҰБТ Математика • 18+ диагностикалық платформа",
    title: "Жаттама. Әр қадамның логикасын түсініп ал.",
    sub: "ҰБТ спецификациясының 10 негізгі бөлімі (Мат. сауаттылық және Бейіндік математика), интерактивті қателер зертханасы және Claude негізіндегі жеке роадмап.",
    note: "Дайын жауапты бере салудың орнына жүйе шешімдегі қате қадамды табуға және ережені жаңа есепте қолдануға үйретеді.",
    topics: "ҰБТ бағдарламасы (10 тақырып)",
    lesson: "Түсіндіру",
    practice: "Жаттығу (3)",
    ai: "Claude-тан сұрау",
    roadmapTab: "ҰБТ Роадмап (AI)",
    rule: "Негізгі ереже мен инвариант",
    example: "ҰБТ есебін қадамдап талдау",
    hint: "Әр қадамды өз сөзіңізбен түсіндіріңіз, содан кейін жаттығуда немесе қателер зертханасында өзіңізді тексеріңіз.",
    check: "Жауаптарды тексеру",
    reset: "Қайта бастау",
    correct: "Дұрыс",
    wrong: "Қатені талдайық",
    result: "Нәтижеңіз",
    choose: "Үш бақылау сұрағының бәріне жауап беріңіз.",
    session: "Жауаптар тек осы бет жабылғанға дейін сақталады.",
    aiTitle: "Claude-пен сократтық талдау",
    aiSub: "Claude таңдалған ҰБТ тақырыбын сабақ ережесіне сүйеніп, дайын тест жауабын айтпай қадамдап түсіндіреді.",
    question: "Тақырып бойынша сұрағыңыз",
    placeholder: "Мысалы: Виет теоремасында түбірлер қосындысы неге қарама-қарсы таңбамен алынады?",
    quickLabel: "Тексеруге арналған дайын сұрақтар:",
    quickQuestions: [
      "Теңдеудің бір жағынан екінші жағына шығарғанда таңба неге өзгереді?",
      "Осы бөлімдегі формулаларды шатастырмау үшін нені есте сақтау керек?",
      "ҰБТ-да осы тақырыпта көбіне қай қадамда ұпай жоғалтады?"
    ],
    adult: "Мен 18 жасқа толдым.",
    consent: "Жауап алу үшін оқу сұранысымды жіберуге келісемін. Жеке деректерді енгізбеймін.",
    ask: "Талдауды алу",
    loading: "Талдау дайындалып жатыр…",
    pilot: "Тексеру режимі (Reviewer Demo): ANTHROPIC_API_KEY қосылғанда сұраныс тікелей Claude API-ға жіберіледі, ал грант белсендірілгенге дейін схема бойынша детерминирленген превью қайтарылады.",
    read: "Жоба туралы / Architecture (EN)",
    privacy: "Деректер және құпиялық",
    foot: "BilimAI · ҰБТ 10 бөлімі · 720 қате талдау сценарийі · KK / RU / UZ",
    static: "Тексерілген оқу модулі · AI галлюцинациясыз",
    next: "Қате кеткен қадамдарды қайталап, тестті қайта өтіңіз.",
    done: "Керемет! Келесі тақырыпқа өтіңіз немесе Қателер зертханасын ашыңыз.",
    rmTitle: "ҰБТ-ға дайындықтың жеке роадмапы",
    rmSub: "10 тақырып бойынша базалық диагностикалық бағыт бірден құрылады, ал Claude мақсатты балға сай апталық жоспар жасайды.",
    rmTarget: "Мақсатты ҰБТ балы (50-ден)",
    rmWeeks: "Емтиханға дейінгі апта саны",
    rmWeak: "Күшейтуді қажет ететін тақырыптар",
    rmGoal: "Мақсатыңыз және қиындық тудыратын есептер",
    rmGoalPlaceholder: "Мысалы: тригонометрия мен пирамида көлемінде қателесемін, 6 аптада 42+ балл жинау керек",
    rmPresets: [
      "6 аптада 45/50 балл (АТ): Виет теоремасы, логарифм және тригонометрияда таңба қателері",
      "4 аптада 38/50 балл: туынды, планиметрия аудандары және пирамида көлемі"
    ],
    rmGenerate: "Жеке роадмап құру",
    rmBaseTitle: "Базалық диагностикалық бағыт (детерминирленген есеп)",
    rmPhase1: "1-кезең (1–2 апта): негізгі олқылықтарды жою",
    rmPhase2: "2-кезең (3+ апта): бекіту және дағдыны тексеру",
    rmClaudeTitle: "Жеке оқу жоспары",
    rmMilestones: "Апталық қадамдар",
    rmHabit: "Күнделікті дайындық әдеті",
    badgeLive: "Claude API · Тікелей жауап",
    badgePreview: "Structured Preview · Демо-режим (грант кілті қосылғанға дейін)"
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

export default function Study() {
  const [lang, setLang] = useState<Language>("ru");
  const [topic, setTopic] = useState<TopicId>("linear");
  const [tab, setTab] = useState("lesson");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const [question, setQuestion] = useState("");
  const [adult, setAdult] = useState(true);
  const [consent, setConsent] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState<{ explanation: string; hint: string; source?: string } | null>(null);

  const [labProgress, setLabProgress] = useState<Progress>(emptyProgress);
  const [targetScore, setTargetScore] = useState(42);
  const [weeksLeft, setWeeksLeft] = useState(6);
  const [weakTopics, setWeakTopics] = useState<TopicId[]>(["quadratic", "trigonometry", "derivative", "stereometry"]);
  const [goalNote, setGoalNote] = useState("");
  const [rmBusy, setRmBusy] = useState(false);
  const [rmError, setRmError] = useState("");
  const [aiRoadmap, setAiRoadmap] = useState<ClaudeRoadmap | null>(null);

  const controller = useRef<AbortController | null>(null);
  const generation = useRef(0);

  const lesson = lessons[lang].find((l) => l.id === topic)!;
  const t = copy[lang];
  const score = lesson.questions.filter((q, i) => answers[i] === String(q.correct)).length;
  const baseline = buildBaselineRoadmap(labProgress, targetScore, weeksLeft, lang);

  const current = useRef({ topic, language: lang });
  current.current = { topic, language: lang };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
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
            input: "Проверьте корректность заполнения полей и галочек согласия."
          }
        : lang === "kk"
          ? {
              quota: "Сынақ лимиті аяқталды. Дайын сабақтарды жалғастырыңыз.",
              origin: "Сұраныс көзі қате.",
              input: "Өрістердің дұрыс толтырылғанын тексеріңіз."
            }
          : {
              quota: "Sinov limiti tugadi. Tayyor darslarni davom ettiring.",
              origin: "So‘rov manbasi noto‘g‘ri.",
              input: "Maydonlar to‘g‘ri to‘ldirilganini tekshiring."
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
    setAnswers({});
    setChecked(false);
    setAnswer(null);
    setError("");
    setBusy(false);
    setQuestion("");
  }

  function selectTopic(id: TopicId) {
    reset();
    setTopic(id);
    if (tab === "roadmap") setTab("lesson");
  }

  function selectLanguage(value: Language) {
    reset();
    setRmError("");
    setLang(value);
  }

  function toggleWeakTopic(id: TopicId) {
    setWeakTopics((prev) => {
      if (prev.includes(id)) return prev.length > 1 ? prev.filter((x) => x !== id) : prev;
      return [...prev, id];
    });
  }

  async function ask() {
    if (busy || !adult || !consent || question.trim().length < 3) return;
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
        body: JSON.stringify({ topic, language: lang, question, adult, consent })
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

  async function askRoadmap() {
    if (rmBusy || !adult || !consent || goalNote.trim().length < 3) return;
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
          adult,
          consent
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

  return (
    <>
      <header className="wrap top">
        <a className="brand" href="/">
          <img src="/favicon.svg" alt="" />
          BilimAI <span className="beta">UNT · ҰБТ · 10 ТЕМ</span>
        </a>
        <nav className="topnav" aria-label="Навигация">
          <a href={`/lab?lang=${lang}`}>
            {lang === "ru" ? "Лаборатория ошибок (/lab)" : lang === "kk" ? "Қателер зертханасы (/lab)" : "Xatolar laboratoriyasi (/lab)"}
          </a>
          <a href="/about">{t.read}</a>
          <div className="flex gap-1" aria-label="Язык">
            <Button variant={lang === "ru" ? "default" : "ghost"} size="sm" aria-pressed={lang === "ru"} onClick={() => selectLanguage("ru")}>
              Русский
            </Button>
            <Button variant={lang === "kk" ? "default" : "ghost"} size="sm" aria-pressed={lang === "kk"} onClick={() => selectLanguage("kk")}>
              Қазақша
            </Button>
            <Button variant={lang === "uz" ? "default" : "ghost"} size="sm" aria-pressed={lang === "uz"} onClick={() => selectLanguage("uz")}>
              O‘zbekcha
            </Button>
          </div>
        </nav>
      </header>
      <main className="wrap">
        <section className="hero">
          <div>
            <span className="eyebrow">{t.eyebrow}</span>
            <h1>{t.title}</h1>
            <p>{t.sub}</p>
          </div>
          <div className="hero-note">
            <Lightbulb size={22} className="mb-2 text-primary" />
            {t.note}
          </div>
        </section>

        <section className="stats-strip" aria-label="Показатели платформы">
          <div className="stat-card">
            <strong>10 модулей</strong>
            <span>{lang === "ru" ? "Спецификация ЕНТ (Мат. грамотность + Профиль)" : lang === "kk" ? "ҰБТ спецификациясы (Мат. сауаттылық + Бейін)" : "Imtihon dasturining 10 ta asosiy bo‘limi"}</span>
          </div>
          <div className="stat-card">
            <strong>720 сценариев</strong>
            <span>{lang === "ru" ? "Поиск первого неверного шага и перенос навыка" : lang === "kk" ? "Алғашқы қате қадамды табу және жаңа есеп" : "Birinchi xato qadamni topish va yangi masala"}</span>
          </div>
          <div className="stat-card">
            <strong>KK · RU · UZ</strong>
            <span>{lang === "ru" ? "Полная синхронизация формул на 3 языках" : lang === "kk" ? "Үш тілдегі синхрондалған математикалық база" : "Uch tilda sinxronlashtirilgan matematik baza"}</span>
          </div>
          <div className="stat-card">
            <strong>3 AI-контура</strong>
            <span>{lang === "ru" ? "Сократический разбор, Роадмап ЕНТ и Диагностика в /lab" : lang === "kk" ? "Сократтық түсіндіру, ҰБТ Роадмап және /lab диагностикасы" : "Sokratik tahlil, O‘quv rejasi va /lab diagnostikasi"}</span>
          </div>
        </section>

        <section className="lab-launch">
          <div>
            <strong>
              {lang === "ru"
                ? "Лаборатория ошибок ЕНТ (/lab): найди сломанный шаг в решении и получи AI-диагностику"
                : lang === "kk"
                  ? "ҰБТ қателер зертханасы (/lab): шешімдегі қате қадамды тап және AI-талдау ал"
                  : "Xatolar laboratoriyasi (/lab): yechimdagi xato qadamni top va AI-diagnostika ol"}
            </strong>
            <span className="small">
              {lang === "ru"
                ? "240 задач на каждом языке + встроенный разбор ошибки от Claude AI и интервальное повторение 2/7 дней."
                : lang === "kk"
                  ? "Әр тілде 240 есеп + Claude AI қате талдауы және 2/7 күндік қайталау кестесі."
                  : "Har bir tilda 240 masala + Claude AI xato tahlili va 2/7 kunlik takrorlash rejasi."}
            </span>
          </div>
          <a href={`/lab?lang=${lang}`}>
            {lang === "ru" ? "Открыть Лабораторию →" : lang === "kk" ? "Зертхананы ашу →" : "Laboratoriyani ochish →"}
          </a>
        </section>

        <div className="workspace">
          <aside className="topics">
            <h2>{t.topics}</h2>
            {lessons[lang].map((l, i) => (
              <button
                key={l.id}
                className={`topic ${topic === l.id ? "active" : ""}`}
                aria-pressed={topic === l.id}
                onClick={() => selectTopic(l.id)}
              >
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <span className="topic-title">
                  {l.title}
                  <small>{l.section}</small>
                </span>
              </button>
            ))}
            <div className="aside-note">
              <BookOpen size={20} className="mb-2" />
              {t.static}
            </div>
          </aside>

          <section className="surface" aria-label={lesson.title}>
            <div className="lesson-head">
              <div>
                <h2>{lesson.title}</h2>
                <p className="small mt-1 mb-0">{lesson.intro}</p>
              </div>
              <span className="section-pill">{lesson.section}</span>
            </div>

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="tabsbar h-auto flex-wrap justify-start">
                <TabsTrigger value="lesson">{t.lesson}</TabsTrigger>
                <TabsTrigger value="practice">{t.practice}</TabsTrigger>
                <TabsTrigger value="ai">
                  <Sparkles size={15} />
                  {t.ai}
                </TabsTrigger>
                <TabsTrigger value="roadmap">
                  <Compass size={15} />
                  {t.roadmapTab}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lesson">
                <div className="rule">
                  <strong>{t.rule}</strong>
                  {lesson.rule}
                </div>
                <h3 className="text-lg mt-6 font-bold">{t.example}</h3>
                <div className="equation">{lesson.example}</div>
                <ol className="steps">
                  {lesson.steps.map((step, i) => (
                    <li key={step}>
                      <span className="step-number">{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="callout">{t.hint}</div>
                <div className="actions">
                  <Button onClick={() => setTab("practice")}>{t.practice}</Button>
                  <Button variant="outline" onClick={() => setTab("ai")}>
                    <Sparkles size={15} />
                    {t.ai}
                  </Button>
                  <Button variant="outline" onClick={() => setTab("roadmap")}>
                    <Compass size={15} />
                    {t.roadmapTab}
                  </Button>
                  <a className="small font-semibold ml-auto" href={`/lab?lang=${lang}`}>
                    <FlaskConical size={14} className="inline mr-1" />
                    {lang === "ru" ? "Тренировать в /lab →" : lang === "kk" ? "Зертханада шыңдау →" : "Laboratoriyada ishlash →"}
                  </a>
                </div>
              </TabsContent>

              <TabsContent value="practice">
                <p className="small mb-2">{t.session}</p>
                {lesson.questions.map((q, i) => (
                  <div className="question" key={q.text}>
                    <h3 id={`q${i}`}>
                      {i + 1}. {q.text}
                    </h3>
                    <RadioGroup
                      aria-labelledby={`q${i}`}
                      value={answers[i] ?? ""}
                      disabled={checked}
                      onValueChange={(v) => setAnswers((prev) => ({ ...prev, [i]: v }))}
                    >
                      {q.options.map((option, j) => (
                        <label className="option" key={option} data-selected={answers[i] === String(j)}>
                          <RadioGroupItem value={String(j)} id={`q${i}a${j}`} />
                          <span>{option}</span>
                        </label>
                      ))}
                    </RadioGroup>
                    {checked && (
                      <div className={`feedback ${answers[i] !== String(q.correct) ? "wrong" : ""}`}>
                        <strong>{answers[i] === String(q.correct) ? t.correct : t.wrong}. </strong>
                        {q.why}
                      </div>
                    )}
                  </div>
                ))}
                <div className="actions">
                  {checked ? (
                    <>
                      <span role="status" className="score">
                        {t.result}: {score}/3
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setAnswers({});
                          setChecked(false);
                        }}
                      >
                        <RotateCcw size={16} />
                        {t.reset}
                      </Button>
                    </>
                  ) : (
                    <Button disabled={Object.keys(answers).length !== 3} onClick={() => setChecked(true)}>
                      <CheckCircle2 size={16} />
                      {t.check}
                    </Button>
                  )}
                </div>
                <p className="small mt-3">{checked ? (score === 3 ? t.done : t.next) : t.choose}</p>
              </TabsContent>

              <TabsContent value="ai">
                <h3 className="text-xl font-bold">{t.aiTitle}</h3>
                <p className="small mb-4">{t.aiSub}</p>
                <div className="callout mb-5">{t.pilot}</div>

                <div className="mb-3">
                  <span className="small font-semibold block mb-1">{t.quickLabel}</span>
                  <div className="quick-prompts">
                    {t.quickQuestions.map((qq) => (
                      <button
                        key={qq}
                        type="button"
                        className="quick-pill"
                        onClick={() => {
                          setQuestion(qq);
                          setAdult(true);
                          setConsent(true);
                        }}
                      >
                        {qq}
                      </button>
                    ))}
                  </div>
                </div>

                <form
                  className="ai-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void ask();
                  }}
                >
                  <label htmlFor="learner-question" className="font-semibold text-sm">
                    {t.question} ({lesson.title})
                  </label>
                  <textarea
                    id="learner-question"
                    value={question}
                    maxLength={600}
                    minLength={3}
                    required
                    placeholder={t.placeholder}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                  <span className="small">{question.length}/600</span>
                  <label className="checkline">
                    <Checkbox checked={adult} onCheckedChange={(v) => setAdult(v === true)} />
                    <span>{t.adult}</span>
                  </label>
                  <label className="checkline">
                    <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} />
                    <span>
                      {t.consent} <a href="/privacy">{t.privacy}</a>
                    </span>
                  </label>
                  <div>
                    <Button type="submit" disabled={busy || !adult || !consent || question.trim().length < 3}>
                      <Sparkles size={15} />
                      {busy ? t.loading : t.ask}
                    </Button>
                  </div>
                </form>
                {error && (
                  <p role="alert" className="error">
                    {error}
                  </p>
                )}
                {answer && (
                  <section aria-live="polite" className="response">
                    <div className={`source-badge ${answer.source === "claude" ? "live" : "preview"}`}>
                      {answer.source === "claude" ? t.badgeLive : t.badgePreview}
                    </div>
                    <p className="mt-1 mb-3">{answer.explanation}</p>
                    <strong>{lang === "ru" ? "Наводящий вопрос (Сократическая подсказка):" : lang === "kk" ? "Бағыттаушы сұрақ:" : "Yo‘naltiruvchi savol:"}</strong>
                    <p className="mt-1 mb-0">{answer.hint}</p>
                  </section>
                )}
              </TabsContent>

              <TabsContent value="roadmap">
                <h3 className="text-xl font-bold">{t.rmTitle}</h3>
                <p className="small mb-4">{t.rmSub}</p>

                <div className="callout mb-5">
                  <strong>{t.rmBaseTitle}</strong>
                  <p className="small mt-1">
                    {lang === "ru"
                      ? `Цель: ${targetScore}/50 баллов · Срок: ${weeksLeft} нед. · Тем в неделю: ~${baseline.topicsPerWeek}`
                      : lang === "kk"
                        ? `Мақсат: ${targetScore}/50 балл · Мерзімі: ${weeksLeft} апта · Аптасына: ~${baseline.topicsPerWeek} тақырып`
                        : `Maqsad: ${targetScore}/50 ball · Muddat: ${weeksLeft} hafta · Haftasiga: ~${baseline.topicsPerWeek} mavzu`}
                  </p>
                  <p className="small font-semibold mt-2">{t.rmPhase1}:</p>
                  <ul className="small list-disc pl-5">
                    {baseline.priorityModules
                      .filter((m) => m.phase === 1)
                      .map((m) => (
                        <li key={m.topic}>
                          <button type="button" className="underline font-medium" onClick={() => selectTopic(m.topic)}>
                            {m.title}
                          </button>{" "}
                          ({m.soloCount} solo)
                        </li>
                      ))}
                  </ul>
                  <p className="small font-semibold mt-2">{t.rmPhase2}:</p>
                  <ul className="small list-disc pl-5">
                    {baseline.priorityModules
                      .filter((m) => m.phase === 2)
                      .map((m) => (
                        <li key={m.topic}>
                          <button type="button" className="underline font-medium" onClick={() => selectTopic(m.topic)}>
                            {m.title}
                          </button>{" "}
                          ({m.soloCount} solo)
                        </li>
                      ))}
                  </ul>
                </div>

                <form
                  className="ai-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void askRoadmap();
                  }}
                >
                  <div className="flex flex-wrap gap-4">
                    <label className="flex flex-col gap-1 text-sm font-semibold">
                      <span>{t.rmTarget}</span>
                      <input
                        type="number"
                        min={20}
                        max={50}
                        value={targetScore}
                        className="lab-input"
                        onChange={(e) => setTargetScore(Math.max(20, Math.min(50, Number(e.target.value) || 40)))}
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-semibold">
                      <span>{t.rmWeeks}</span>
                      <input
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
                    <span className="block font-semibold text-sm mb-2">{t.rmWeak}</span>
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
                    <span className="small font-semibold block mb-1">{t.quickLabel}</span>
                    <div className="quick-prompts">
                      {t.rmPresets.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          className="quick-pill"
                          onClick={() => {
                            setGoalNote(preset);
                            setAdult(true);
                            setConsent(true);
                          }}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label htmlFor="roadmap-goal" className="font-semibold text-sm">
                    {t.rmGoal}
                  </label>
                  <textarea
                    id="roadmap-goal"
                    value={goalNote}
                    maxLength={400}
                    minLength={3}
                    required
                    placeholder={t.rmGoalPlaceholder}
                    onChange={(e) => setGoalNote(e.target.value)}
                  />
                  <span className="small">{goalNote.length}/400</span>

                  <label className="checkline">
                    <Checkbox checked={adult} onCheckedChange={(v) => setAdult(v === true)} />
                    <span>{t.adult}</span>
                  </label>
                  <label className="checkline">
                    <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} />
                    <span>
                      {t.consent} <a href="/privacy">{t.privacy}</a>
                    </span>
                  </label>

                  <div>
                    <Button type="submit" disabled={rmBusy || !adult || !consent || goalNote.trim().length < 3}>
                      <Compass size={15} />
                      {rmBusy ? t.loading : t.rmGenerate}
                    </Button>
                  </div>
                </form>

                {rmError && (
                  <p role="alert" className="error">
                    {rmError}
                  </p>
                )}

                {aiRoadmap && (
                  <section aria-live="polite" className="response mt-4">
                    <div className={`source-badge ${aiRoadmap.source === "claude" ? "live" : "preview"}`}>
                      {aiRoadmap.source === "claude" ? t.badgeLive : t.badgePreview}
                    </div>
                    <strong className="block text-base mb-1">{t.rmClaudeTitle}</strong>
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
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
      <footer className="wrap foot">
        <span>{t.foot}</span>
        <div>
          <a href={`/lab?lang=${lang}`}>/lab</a>
          <a href="/about">{t.read}</a>
          <a href="/privacy">{t.privacy}</a>
        </div>
      </footer>
    </>
  );
}
