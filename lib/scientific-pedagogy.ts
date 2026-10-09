import type { Language } from "./curriculum";

export type ScientificMethodId =
  | "bloom_mastery"
  | "ebbinghaus_sm2"
  | "kapur_vanlehn"
  | "bjork_interleaving"
  | "sweller_clt"
  | "chi_feynman";

export interface ScientificMethodSpec {
  id: ScientificMethodId;
  scientist: string;
  institution: string;
  year: string;
  effectMetric: string;
  formula: string;
  icon: "GitBranch" | "Clock" | "Microscope" | "Shuffle" | "Layers" | "Sparkles";
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  evidenceSummary: Record<Language, string>;
  platformMechanism: Record<Language, string>;
}

export const SCIENTIFIC_METHODS: ScientificMethodSpec[] = [
  {
    id: "bloom_mastery",
    scientist: "Benjamin S. Bloom",
    institution: "University of Chicago",
    year: "1984",
    effectMetric: "+2.0σ (50% → 98%)",
    formula: "P(Success_k) = ∏ p_i,  Unlock(v) ⇔ ∀u ∈ Parents(v): M(u) ≥ 80%",
    icon: "GitBranch",
    title: {
      ru: "Феномен 2 сигм Блума и Порог мастерства 80%",
      kk: "Блумның 2 сигма феномені және 80% шеберлік шегі",
      uz: "Blumning 2 sigma fenomeni va 80% mahorat chegarasi"
    },
    subtitle: {
      ru: "Mastery Learning + 1-on-1 Diagnostic Backtracking",
      kk: "Mastery Learning + пререквизиттер диагностикасы",
      uz: "Mastery Learning + prerevizitlar diagnostikasi"
    },
    evidenceSummary: {
      ru: "Индивидуальная диагностика с блокировкой перехода без 80% усвоения базы сдвигает результат ученика на +2σ (с 50-го на 98-й перцентиль). Без базы вероятность решения на 3-м уровне падает до 0.6³ = 21.6%.",
      kk: "Базалық тақырыпты 80% меңгермей келесіге өтпеу оқушы нәтижесін +2σ-ға (98-перцентильге) көтереді. Іргетассыз 3-деңгейде есеп шығару ықтималдығы 0.6³ = 21.6%-ға дейін құлдырайды.",
      uz: "Bazaviy mavzuni 80% o‘zlashtirmasdan keyingi bosqichga o‘tmaslik natijani +2σ ga (98-persentilga) oshiradi. Poydevorsiz 3-darajada yechish ehtimoli 0.6³ = 21.6% ga tushadi."
    },
    platformMechanism: {
      ru: "Граф знаний блокирует зависимые темы до 80% владения пререквизитом и автоматически спускает ученика к корневому пробелу (Root Gap).",
      kk: "Білім графы пререквизит 80% меңгерілгенше тәуелді тақырыптарды құлыптап, түпкі олқылықты (Root Gap) бірінші жабады.",
      uz: "Bilim grafi prerevizit 80% o‘zlashtirilmaguncha bog‘liq mavzularni bloklaydi va asosiy bo‘shliqni (Root Gap) birinchi bo‘lib yopadi."
    }
  },
  {
    id: "ebbinghaus_sm2",
    scientist: "Hermann Ebbinghaus & Piotr Woźniak",
    institution: "Univ. of Berlin / SuperMemo Lab",
    year: "1885 / 1990",
    effectMetric: "+28% удержания к ЕНТ",
    formula: "R(t) = 100% · exp(−t / S_n),  I_n = round(I_{n−1} · EF)",
    icon: "Clock",
    title: {
      ru: "Кривая забывания Эббингауза и алгоритм SM-2",
      kk: "Эббингауз ұмыту қисығы және SM-2 интервалдық алгоритмі",
      uz: "Ebbingauz unutish egri chizig‘i va SM-2 algoritmi"
    },
    subtitle: {
      ru: "Spaced Repetition & Memory Stability Tracking",
      kk: "Интервалдық қайталау және жад тұрақтылығы",
      uz: "Intervalli takrorlash va xotira barqarorligi"
    },
    evidenceSummary: {
      ru: "Без повторения через 24 часа в памяти остаётся 33% формул, через месяц — 21%. Повторение в точке R(t) ≈ 85% увеличивает стабильность памяти S в 2.5–3 раза при том же времени учёбы.",
      kk: "Қайталаусыз 24 сағаттан соң жадта 33%, бір айдан соң 21% ғана қалады. R(t) ≈ 85% нүктесінде қайталау жад тұрақтылығын S 2.5–3 есе арттырады.",
      uz: "Takrorlashsiz 24 soatdan keyin xotirada 33%, bir oydan so‘ng 21% qoladi. R(t) ≈ 85% nuqtasida takrorlash xotira barqarorligini 2.5–3 barobar oshiradi."
    },
    platformMechanism: {
      ru: "Живой индикатор удержания памяти R(t)% по каждой теме и очередь оптимального повторения (1 → 6 → 15 → 38 дней).",
      kk: "Әр тақырып бойынша R(t)% жад индикаторы және оңтайлы қайталау кезегі (1 → 6 → 15 → 38 күн).",
      uz: "Har bir mavzu bo‘yicha R(t)% xotira ko‘rsatkichi va optimal takrorlash navbati (1 → 6 → 15 → 38 kun)."
    }
  },
  {
    id: "kapur_vanlehn",
    scientist: "Manu Kapur & Kurt VanLehn",
    institution: "ETH Zurich & Carnegie Mellon Univ.",
    year: "1988 / 2016",
    effectMetric: "d = 0.84 (2× перенос навыка)",
    formula: "k* = min { k | Valid(s_{k−1} → s_k) = False }",
    icon: "Microscope",
    title: {
      ru: "Продуктивная неудача Капура и Buggy Rules ВанЛена",
      kk: "Капурдың өнімді қатесі және ВанЛеннің Buggy Rules теориясы",
      uz: "Kapurning samarali xatosi va VanLenning Buggy Rules nazariyasi"
    },
    subtitle: {
      ru: "Impasse-Driven Learning & First-Fracture Isolation",
      kk: "Алғашқы қате қадамды оқшаулау және түзету",
      uz: "Birinchi xato qadamni ajratish va tuzatish"
    },
    evidenceSummary: {
      ru: "Мета-анализ 53 исследований (N > 12 000): поиск первой сломанной строки в решении до чтения ответа даёт в 2 раза более глубокий перенос навыка (d = 0.84), чем пассивный просмотр ГДЗ.",
      kk: "53 зерттеудің мета-талдауы (N > 12 000): дайын жауапты оқығанша алғашқы қате жолды өз бетінше табу дағдыны 2 есе тереңірек бекітеді (d = 0.84).",
      uz: "53 ta tadqiqot meta-tahlili (N > 12 000): tayyor javobni o‘qishdan ko‘ra birinchi xato qatorni topish ko‘nikmani 2 barobar chuqurroq mustahkamlaydi (d = 0.84)."
    },
    platformMechanism: {
      ru: "Модули «Рентген черновика» и «Тренировка ошибок (/lab)» изолируют строку излома k*, не штрафуя верные шаги ученика.",
      kk: "«Черновик рентгені» мен «Қатемен жұмыс (/lab)» дұрыс қадамдарды сақтап, тек k* үзілу жолын табады.",
      uz: "«Qoralama rentgeni» va «Xatolar ustida ishlash (/lab)» to‘g‘ri qadamlarni saqlab, faqat k* uzilish qatorini topadi."
    }
  },
  {
    id: "bjork_interleaving",
    scientist: "Robert A. Bjork & Doug Rohrer",
    institution: "UCLA Learning & Forgetting Lab",
    year: "1994 / 2015",
    effectMetric: "77% vs 38% на экзамене (d = 1.05)",
    formula: "ΔS_storage = η · (1 − S_retrieval),  Topic(q_i) ≠ Topic(q_{i−1})",
    icon: "Shuffle",
    title: {
      ru: "Желательные трудности Бьорка и Интерливинг",
      kk: "Бьорктың қажетті қиындықтары және Интерливинг",
      uz: "Byorkning zarur qiyinchiliklari va Interliving"
    },
    subtitle: {
      ru: "Interleaved Practice & Confuser Discrimination",
      kk: "Тақырыптар мен форматтарды араластырып жаттығу",
      uz: "Mavzular va formatlarni aralashtirib mashq qilish"
    },
    evidenceSummary: {
      ru: "Нарешивание 20 однотипных задач подряд создаёт иллюзию знания, но на реальном экзамене точность падает до 38%. Чередование разных тем и 4 форматов ЕНТ удерживает точность на уровне 77%.",
      kk: "Бір тақырыпты ғана қатарынан шығару білім елесін береді (емтиханда дәлдік 38%-ға түседі). Әртүрлі тақырыптар мен 4 форматты араластыру дәлдікті 77% деңгейінде сақтайды.",
      uz: "Bir xil masalalarni ketma-ket yechish bilim illyuziyasini beradi (imtihonda aniqlik 38% ga tushadi). Mavzu va 4 formatni aralashtirish aniqlikni 77% da saqlaydi."
    },
    platformMechanism: {
      ru: "Все 10 вариантов ЕНТ по 40 вопросов перемешивают разделы и форматы (1 ответ, контекст, соответствие, мультивыбор) без смежных повторов.",
      kk: "40 сұрақтық барлық 10 ҰБТ нұсқасы бөлімдер мен 4 форматты көршілес қайталаусыз араластырады.",
      uz: "40 savollik barcha 10 ta UBT varianti bo‘limlar va 4 formatni ketma-ket takrorlashsiz aralashtiradi."
    }
  },
  {
    id: "sweller_clt",
    scientist: "John Sweller",
    institution: "University of New South Wales",
    year: "1988 / 2019",
    effectMetric: "−42% времени на освоение (d = 0.72)",
    formula: "CL_total = CL_intrinsic + CL_extraneous + CL_germane ≤ 4 ± 1 chunks",
    icon: "Layers",
    title: {
      ru: "Теория когнитивной нагрузки Свеллера",
      kk: "Свеллердің когнитивтік жүктеме теориясы",
      uz: "Svellerning kognitiv yuklama nazariyasi"
    },
    subtitle: {
      ru: "Worked-Example Effect & Adaptive Guidance Fading",
      kk: "Атомарлық қадамдар және көмекті біртіндеп азайту",
      uz: "Atomar qadamlar va yordamni bosqichma-bosqich kamaytirish"
    },
    evidenceSummary: {
      ru: "Рабочая память удерживает одновременно только 4±1 элемента. Разбиение вывода на нумерованные шаги с выделением одного инварианта снижает когнитивный перегруз и ускоряет обучение на 42%.",
      kk: "Жұмыс жады бір мезетте тек 4±1 элементті ұстай алады. Шешімді нөмірленген атомарлық қадамдарға бөлу оқу уақытын 42%-ға қысқартады.",
      uz: "Ishchi xotira bir vaqtda faqat 4±1 elementni ushlab turadi. Yechimni raqamlangan qadamlarga bo‘lish o‘rganish vaqtini 42% ga qisqartiradi."
    },
    platformMechanism: {
      ru: "4 уровня адаптивной детализации (от полного разбора с подсветкой инварианта до экзаменационного режима без подсказок).",
      kk: "Шеберлік деңгейіне қарай 4 сатылы бейімделу (толық талдаудан бастап көмексіз емтихан режиміне дейін).",
      uz: "Mahorat darajasiga qarab 4 bosqichli moslashuv (to‘liq tahlildan yordamsiz imtihon rejimidagacha)."
    }
  },
  {
    id: "chi_feynman",
    scientist: "Michelene Chi & Richard Feynman",
    institution: "Arizona State Univ. & Caltech",
    year: "1989 / 1965",
    effectMetric: "86% vs 43% на сложных задачах (d = 0.95)",
    formula: "Transfer(SelfExplain) = 2.0 × Transfer(PassiveRead)",
    icon: "Sparkles",
    title: {
      ru: "Эффект самообъяснения Чи и Метод Фейнмана",
      kk: "Мишелин Чи өзіндік түсіндіру эффектісі және Фейнман әдісі",
      uz: "Mishelin Chi o‘z-o‘ziga tushuntirish effekti va Feynman usuli"
    },
    subtitle: {
      ru: "Socratic Invariant Verification via Claude API",
      kk: "Claude API арқылы сократтық тексеру сұрағы",
      uz: "Claude API orqali sokratik tekshiruv savoli"
    },
    evidenceSummary: {
      ru: "Ученики, которые объясняют своими словами «почему работает переход», решают сложные задачи переноса с точностью 86% против 43% у тех, кто просто перечитывает теорию.",
      kk: "Әр қадамның «неліктен жұмыс істейтінін» өз сөзімен түсіндірген оқушылар күрделі есептерді 86% дәлдікпен шығарады (жай оқығандарда — 43%).",
      uz: "Har bir qadam «nega ishlashini» o‘z so‘zi bilan tushuntirgan o‘quvchilar murakkab masalalarni 86% aniqlikda yechadi (oddiy o‘qiganlarda — 43%)."
    },
    platformMechanism: {
      ru: "Сократический ИИ-тьютор (Claude API) не выдаёт готовый ответ, а задаёт точечный вопрос на понимание главного правила задачи.",
      kk: "Сократтық ЖИ-тьютор (Claude API) дайын жауапты бермей, негізгі ережені түсінуге бағытталған сұрақ қояды.",
      uz: "Sokratik SI-tyutor (Claude API) tayyor javobni bermasdan, asosiy qoidani tushunishga yo‘naltirilgan savol beradi."
    }
  }
];

export interface EbbinghausMetrics {
  retentionPercent: number;
  stabilityDays: number;
  nextIntervalDays: number;
  easinessFactor: number;
  status: "fresh" | "optimal_review" | "decay_risk";
}

/**
 * Computes Ebbinghaus Forgetting Curve retention R(t) = 100 * exp(-t / S)
 * combined with Piotr Wozniak's SuperMemo SM-2 interval & stability scaling.
 */
export function computeEbbinghausRetention(
  daysSinceReview: number,
  successfulReviews: number,
  quality: number = 4
): EbbinghausMetrics {
  const safeDays = Math.max(0, daysSinceReview);
  const safeReviews = Math.max(0, Math.floor(successfulReviews));
  const q = Math.min(5, Math.max(0, quality));

  const efDelta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
  const easinessFactor = Number(Math.max(1.3, 2.5 + efDelta).toFixed(2));

  let interval = 1;
  if (safeReviews <= 0) {
    interval = 1;
  } else if (safeReviews === 1) {
    interval = 2;
  } else if (safeReviews === 2) {
    interval = 6;
  } else {
    interval = Math.round(6 * Math.pow(easinessFactor, safeReviews - 2));
  }

  // Calibrate stability S so that at t = interval, retention R(interval) ≈ 85%
  const stabilityDays = Number(Math.max(1.5, -interval / Math.log(0.85)).toFixed(1));
  const rawRetention = safeReviews === 0 && safeDays > 0 ? 34 : 100 * Math.exp(-safeDays / stabilityDays);
  const retentionPercent = Math.min(100, Math.max(12, Math.round(rawRetention)));

  const status: EbbinghausMetrics["status"] =
    retentionPercent >= 85 ? "fresh" : retentionPercent >= 70 ? "optimal_review" : "decay_risk";

  return {
    retentionPercent,
    stabilityDays,
    nextIntervalDays: interval,
    easinessFactor,
    status
  };
}

/**
 * Implements Benjamin Bloom's 80% Mastery Gate & Multiplicative Prerequisite Chain Probability.
 */
export function computeBloomMasteryGate(parentMasteryPercents: number[]): {
  unlocked: boolean;
  minParentMastery: number;
  chainSuccessProbabilityPercent: number;
} {
  if (parentMasteryPercents.length === 0) {
    return {
      unlocked: true,
      minParentMastery: 100,
      chainSuccessProbabilityPercent: 100
    };
  }
  const normalized = parentMasteryPercents.map((p) => Math.min(100, Math.max(0, p)));
  const minParentMastery = Math.min(...normalized);
  const product = normalized.reduce((acc, p) => acc * (p / 100), 1);
  return {
    unlocked: minParentMastery >= 80,
    minParentMastery: Math.round(minParentMastery),
    chainSuccessProbabilityPercent: Math.round(product * 100)
  };
}

/**
 * Implements John Sweller's Guidance Fading Effect (4 scaffolding levels based on topic mastery).
 */
export function computeSwellerScaffoldingLevel(masteryPercent: number, lang: Language): {
  level: 1 | 2 | 3 | 4;
  visibleStepsRatio: number;
  requireFeynmanCheck: boolean;
  label: string;
  hintPolicy: string;
} {
  const m = Math.min(100, Math.max(0, masteryPercent));
  if (m < 40) {
    return {
      level: 1,
      visibleStepsRatio: 1,
      requireFeynmanCheck: false,
      label:
        lang === "kk"
          ? "1-деңгей: Толық мысал + инвариант (Sweller Worked Example)"
          : lang === "uz"
            ? "1-daraja: To‘liq namuna + invariant (Sweller Worked Example)"
            : "Уровень 1: Полный разбор образца + инвариант (Sweller Worked Example)",
      hintPolicy:
        lang === "kk"
          ? "Барлық қадамдар ашық, жұмыс жадына артық жүктеме түспейді."
          : lang === "uz"
            ? "Barcha qadamlar ochiq, ishchi xotiraga ortiqcha yuk tushmaydi."
            : "Все шаги открыты, снята лишняя нагрузка с рабочей памяти."
    };
  }
  if (m < 65) {
    return {
      level: 2,
      visibleStepsRatio: 0.67,
      requireFeynmanCheck: false,
      label:
        lang === "kk"
          ? "2-деңгей: Ішінара көмек (Backward Fading)"
          : lang === "uz"
            ? "2-daraja: Qisman yordam (Backward Fading)"
            : "Уровень 2: Частичное затухание подсказок (Backward Fading)",
      hintPolicy:
        lang === "kk"
          ? "Бастапқы қадамдар көрсетіледі, қорытынды есептеуді өзіңіз аяқтайсыз."
          : lang === "uz"
            ? "Boshlang‘ich qadamlar ko‘rsatiladi, yakuniy hisobni o‘zingiz bajarasiz."
            : "Показана завязка решения, финальный переход выполняете самостоятельно."
    };
  }
  if (m < 80) {
    return {
      level: 3,
      visibleStepsRatio: 0.33,
      requireFeynmanCheck: true,
      label:
        lang === "kk"
          ? "3-деңгей: Сократтық бағыттау (Impasse & Self-Repair)"
          : lang === "uz"
            ? "3-daraja: Sokratik yo‘naltirish (Impasse & Self-Repair)"
            : "Уровень 3: Сократический намёк без готовой формулы",
      hintPolicy:
        lang === "kk"
          ? "Тек бағыттаушы сұрақ беріледі (Капур мен ВанЛен әдісі)."
          : lang === "uz"
            ? "Faqat yo‘naltiruvchi savol beriladi (Kapur va VanLen usuli)."
            : "Даётся только наводящий вопрос на правило (метод Капура и ВанЛена)."
    };
  }
  return {
    level: 4,
    visibleStepsRatio: 0,
    requireFeynmanCheck: true,
    label:
      lang === "kk"
        ? "4-деңгей: ҰБТ Шебері + Фейнман тексеруі"
        : lang === "uz"
          ? "4-daraja: UBT Ustasi + Feynman tekshiruvi"
          : "Уровень 4: Мастер ЕНТ + Проверка по методу Фейнмана",
    hintPolicy:
      lang === "kk"
        ? "Көмексіз емтихан режимі және ережені өз сөзімен негіздеу."
        : lang === "uz"
          ? "Yordamsiz imtihon rejimi va qoidani o‘z so‘zi bilan asoslash."
          : "Чистый экзаменационный режим без подсказок + проверка понимания сути правила."
  };
}

/**
 * Implements Robert Bjork's Interleaved Practice Ordering:
 * prevents adjacent items from sharing the same topic when alternatives exist.
 */
export function buildBjorkInterleavedList<T extends { topic: string }>(items: readonly T[]): T[] {
  const pool = [...items];
  const result: T[] = [];

  while (pool.length > 0) {
    const lastTopic = result.length > 0 ? result[result.length - 1].topic : null;
    const diffIdx = lastTopic !== null ? pool.findIndex((item) => item.topic !== lastTopic) : 0;
    const pickIdx = diffIdx >= 0 ? diffIdx : 0;
    result.push(pool[pickIdx]);
    pool.splice(pickIdx, 1);
  }

  return result;
}
