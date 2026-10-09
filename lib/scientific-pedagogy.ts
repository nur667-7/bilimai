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
  sourceCitation: string;
  sourceUrl: string;
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
    effectMetric: "Ориентир исследования (1984): до +2.0σ при 1-на-1 обучении до мастерства",
    sourceCitation: "Bloom, B. S. (1984). The 2 Sigma Problem. Educational Researcher, 13(6), 4–16.",
    sourceUrl: "https://doi.org/10.3102/0013189X013006004",
    formula: "P(Success_k) = ∏ p_i,  Unlock(v) ⇔ ∀u ∈ Parents(v): M(u) ≥ 80%",
    icon: "GitBranch",
    title: {
      ru: "Обучение до мастерства (Блум, 1984) и порог пререквизитов 80%",
      kk: "Шеберлікке дейін оқыту (Блум, 1984) және 80% пререквизит шегі",
      uz: "Mahoratgacha o‘qitish (Blum, 1984) va 80% prerevizit chegarasi"
    },
    subtitle: {
      ru: "Исследовательское основание: Mastery Learning",
      kk: "Зерттеу негізі: Mastery Learning",
      uz: "Tadqiqot asosi: Mastery Learning"
    },
    evidenceSummary: {
      ru: "По данным работы Б. Блума (1984), индивидуальная диагностика пробелов с проверкой усвоения базовой темы перед переходом к зависимой в учебных выборках давала прирост до 2 стандартных отклонений относительно поточного класса.",
      kk: "Б. Блум (1984) зерттеуі бойынша, базалық тақырыпты меңгермей келесіге өтпеу және жеке диагностика оқу нәтижесін дәстүрлі сыныппен салыстырғанда айтарлықтай арттырады.",
      uz: "B. Blum (1984) tadqiqotiga ko‘ra, bazaviy mavzuni o‘zlashtirmasdan keyingi bosqichga o‘tmaslik o‘quv natijasini sezilarli oshiradi."
    },
    platformMechanism: {
      ru: "Как реализовано в BilimAI: граф из 16 разделов ЕНТ выделяет корневые пререквизиты (Root Gap) и рекомендует сначала закрыть базовую тему до уровня 80%.",
      kk: "BilimAI-де іске асырылуы: 16 бөлімнен тұратын граф түпкі олқылықты (Root Gap) анықтап, алдымен базалық тақырыпты 80% деңгейінде бекітуді ұсынады.",
      uz: "BilimAI da qo‘llanilishi: 16 bo‘limli graf asosiy bo‘shliqni (Root Gap) topib, avval bazaviy mavzuni 80% darajada mustahkamlashni tavsiya qiladi."
    }
  },
  {
    id: "ebbinghaus_sm2",
    scientist: "Hermann Ebbinghaus & Piotr Woźniak",
    institution: "Univ. of Berlin / SuperMemo Lab",
    year: "1885 / 1990",
    effectMetric: "Модель кривой забывания R(t) = exp(−t / S) и интервалов SM-2",
    sourceCitation: "Ebbinghaus, H. (1885). Über das Gedächtnis; Woźniak, P. A. (1990). Optimization of learning.",
    sourceUrl: "https://super-memory.com/english/ol.htm",
    formula: "R(t) = 100% · exp(−t / S_n),  I_n = round(I_{n−1} · EF)",
    icon: "Clock",
    title: {
      ru: "Кривая забывания Эббингауза и интервальное повторение SM-2",
      kk: "Эббингауз ұмыту қисығы және SM-2 интервалдық қайталауы",
      uz: "Ebbingauz unutish egri chizig‘i va SM-2 intervalli takrorlash"
    },
    subtitle: {
      ru: "Исследовательское основание: Spaced Repetition",
      kk: "Зерттеу негізі: Интервалдық қайталау",
      uz: "Tadqiqot asosi: Intervalli takrorlash"
    },
    evidenceSummary: {
      ru: "Согласно классической модели Г. Эббингауза и алгоритму SM-2 П. Возняка, без распределённого повторения доля удерживаемого материала экспоненциально снижается со временем.",
      kk: "Г. Эббингауз моделі мен П. Возняктың SM-2 алгоритмі бойынша, уақытылы қайталаусыз есте сақталған материал үлесі уақыт өте кемиді.",
      uz: "G. Ebbingauz modeli va SM-2 algoritmiga ko‘ra, taqsimlangan takrorlashsiz xotiradagi material ulushi kamayib boradi."
    },
    platformMechanism: {
      ru: "Как реализовано в BilimAI: после решения задач в тренажёре система рассчитывает ориентировочный срок следующего повторения темы (через 1, 2 и 7+ дней).",
      kk: "BilimAI-де іске асырылуы: есептерді шығарған соң жүйе тақырыпты келесі қайталау мерзімін (1, 2 және 7+ күн) есептейді.",
      uz: "BilimAI da qo‘llanilishi: masalalar yechilgach, tizim mavzuni keyingi takrorlash muddatini (1, 2 va 7+ kun) hisoblaydi."
    }
  },
  {
    id: "kapur_vanlehn",
    scientist: "Manu Kapur, Tanmay Sinha & Kurt VanLehn",
    institution: "ETH Zurich & Carnegie Mellon Univ.",
    year: "1988 / 2021",
    effectMetric: "Метаанализ Sinha & Kapur (2021): Hedges' g = 0.36..0.58 в пользу поиска сбоя",
    sourceCitation: "Sinha, T., & Kapur, M. (2021). When Problem Solving Followed by Instruction Works. Review of Educational Research, 91(5), 761–798.",
    sourceUrl: "https://journals.sagepub.com/doi/10.3102/00346543211019105",
    formula: "k* = min { k | Valid(s_{k−1} → s_k) = False }",
    icon: "Microscope",
    title: {
      ru: "Продуктивная неудача (Kapur & Sinha, 2021) и диагностика неверного шага",
      kk: "Өнімді қате (Kapur & Sinha, 2021) және қате қадамды диагностикалау",
      uz: "Samarali xato (Kapur & Sinha, 2021) va xato qadam diagnostikasi"
    },
    subtitle: {
      ru: "Исследовательское основание: Productive Failure & Buggy Rules",
      kk: "Зерттеу негізі: Productive Failure & Buggy Rules",
      uz: "Tadqiqot asosi: Productive Failure & Buggy Rules"
    },
    evidenceSummary: {
      ru: "Метаанализ Sinha & Kapur (2021, 53 исследования) показывает, что анализ проблемного перехода до получения готовой инструкции в изученных учебных условиях улучшает понятийное понимание и перенос навыка по сравнению с пассивным чтением решения.",
      kk: "Sinha & Kapur (2021, 53 зерттеу) мета-талдауы дайын шешімді оқығанша қате қадамды талдау ұғымдық түсінікті жақсартатынын көрсетеді.",
      uz: "Sinha & Kapur (2021, 53 tadqiqot) meta-tahlili tayyor javobni o‘qishdan avval xato qadamni tahlil qilish tushunishni yaxshilashini ko‘rsatadi."
    },
    platformMechanism: {
      ru: "Как реализовано в BilimAI: в разделах «Проверка решения» и «Тренировка ошибок (/lab)» ученик сначала находит строку с нарушением правила, а затем решает задачу самостоятельно.",
      kk: "BilimAI-де іске асырылуы: «Шешімді тексеру» және «Қатемен жұмыс (/lab)» бөлімдерінде оқушы алдымен ереже бұзылған жолды тауып, содан кейін есепті өз бетінше шығарады.",
      uz: "BilimAI da qo‘llanilishi: «Yechimni tekshirish» va «Xatolar ustida ishlash (/lab)» bo‘limlarida o‘quvchi avval qoida buzilgan qatorni topadi."
    }
  },
  {
    id: "bjork_interleaving",
    scientist: "Robert A. Bjork & Doug Rohrer",
    institution: "UCLA Learning & Forgetting Lab",
    year: "1994 / 2015",
    effectMetric: "Исследование Rohrer et al. (2015): чередование тем улучшает выбор метода решения",
    sourceCitation: "Rohrer, D., Dedrick, R. F., & Stershic, S. (2015). Interleaved practice improves mathematics learning. Journal of Educational Psychology, 107(3), 900–908.",
    sourceUrl: "https://doi.org/10.1037/edu0000001",
    formula: "Topic(q_i) ≠ Topic(q_{i−1})",
    icon: "Shuffle",
    title: {
      ru: "Чередование тем (Интерливинг, Bjork & Rohrer)",
      kk: "Тақырыптарды кезектестіру (Интерливинг, Bjork & Rohrer)",
      uz: "Mavzularni navbatlashtirish (Interliving, Bjork & Rohrer)"
    },
    subtitle: {
      ru: "Исследовательское основание: Interleaved Practice",
      kk: "Зерттеу негізі: Interleaved Practice",
      uz: "Tadqiqot asosi: Interleaved Practice"
    },
    evidenceSummary: {
      ru: "В экспериментах Д. Рорера и Р. Бьорка чередование задач из разных разделов математики помогало школьникам точнее выбирать нужную формулу на отложенном тесте, чем решение однотипных блоков подряд.",
      kk: "Д. Рорер мен Р. Бьорк зерттеулерінде әртүрлі математикалық бөлімдерді араластырып жаттығу емтиханда қажетті формуланы таңдауды жақсартты.",
      uz: "D. Rorer va R. Byork tadqiqotlarida turli bo‘limlarni aralashtirib mashq qilish imtihonda to‘g‘ri formulani tanlashga yordam bergan."
    },
    platformMechanism: {
      ru: "Как реализовано в BilimAI: тренировочные варианты чередуют разные разделы программы и форматы вопросов, чтобы тренировать распознавание типа задачи.",
      kk: "BilimAI-де іске асырылуы: жаттығу нұсқалары есеп түрін тануды жаттықтыру үшін әртүрлі бөлімдер мен сұрақ форматтарын кезектестіреді.",
      uz: "BilimAI da qo‘llanilishi: mashq variantlari masala turini tanib olish uchun turli bo‘limlar va savol formatlarini navbatlashtiradi."
    }
  },
  {
    id: "sweller_clt",
    scientist: "John Sweller",
    institution: "University of New South Wales",
    year: "1988 / 2019",
    effectMetric: "Теория когнитивной нагрузки (Sweller, 1988; 2019): снижение лишнего визуального шума",
    sourceCitation: "Sweller, J. (1988). Cognitive load during problem solving. Cognitive Science, 12(2), 257–285.",
    sourceUrl: "https://doi.org/10.1207/s15516709cog1202_4",
    formula: "CL_total = CL_intrinsic + CL_extraneous + CL_germane",
    icon: "Layers",
    title: {
      ru: "Теория когнитивной нагрузки и разбор по шагам (Sweller)",
      kk: "Когнитивтік жүктеме теориясы және қадамдық талдау (Sweller)",
      uz: "Kognitiv yuklama nazariyasi va qadamma-qadam tahlil (Sweller)"
    },
    subtitle: {
      ru: "Исследовательское основание: Worked-Example Effect",
      kk: "Зерттеу негізі: Worked-Example Effect",
      uz: "Tadqiqot asosi: Worked-Example Effect"
    },
    evidenceSummary: {
      ru: "Работы Дж. Свеллера показывают, что на начальном этапе изучения темы пошагово разобранный образец с явным правилом перехода снижает перегрузку рабочей памяти по сравнению с методом проб и ошибок.",
      kk: "Дж. Свеллер еңбектері жаңа тақырыпты бастағанда ережесі көрсетілген қадамдық үлгі жұмыс жадының шамадан тыс жүктелуін азайтатынын көрсетеді.",
      uz: "J. Sveller tadqiqotlari yangi mavzuni o‘rganishda qadamma-qadam tahlil qilingan namuna ishchi xotira yuklamasini kamaytirishini ko‘rsatadi."
    },
    platformMechanism: {
      ru: "Как реализовано в BilimAI: каждое занятие строится по схеме «Правило → Разобранный образец в 3 шага → Самостоятельная практика».",
      kk: "BilimAI-де іске асырылуы: әр сабақ «Ереже → 3 қадамдық үлгі → Өз бетінше жаттығу» ретімен құрылған.",
      uz: "BilimAI da qo‘llanilishi: har bir dars «Qoida → 3 qadamli namuna → Mustaqil mashq» tartibida tuzilgan."
    }
  },
  {
    id: "chi_feynman",
    scientist: "Michelene Chi & Richard Feynman",
    institution: "Arizona State Univ. & Caltech",
    year: "1989 / 1965",
    effectMetric: "Исследование Chi et al. (1989): самообъяснение шагов помогает выявлять пробелы",
    sourceCitation: "Chi, M. T. H., Bassok, M., Lewis, M. W., Reimann, P., & Glaser, R. (1989). Self-explanations. Cognitive Science, 13(2), 145–182.",
    sourceUrl: "https://doi.org/10.1207/s15516709cog1302_1",
    formula: "Self-Explanation → Invariant Check",
    icon: "Sparkles",
    title: {
      ru: "Эффект самообъяснения (Chi, 1989) и проверочный вопрос",
      kk: "Өзіндік түсіндіру эффектісі (Chi, 1989) және тексеру сұрағы",
      uz: "O‘z-o‘ziga tushuntirish effekti (Chi, 1989) va tekshiruv savoli"
    },
    subtitle: {
      ru: "Исследовательское основание: Self-Explanation Effect",
      kk: "Зерттеу негізі: Self-Explanation Effect",
      uz: "Tadqiqot asosi: Self-Explanation Effect"
    },
    evidenceSummary: {
      ru: "В исследовании М. Чи (1989) учащиеся, которые формулировали причину каждого алгебраического перехода при разборе примера, успешнее справлялись с новыми вариациями задач, чем те, кто перечитывал решение пассивно.",
      kk: "М. Чи (1989) зерттеуінде әрбір алгебралық ауысудың себебін түсіндірген оқушылар жаңа есептерді пассивті оқығандарға қарағанда жақсырақ шығарған.",
      uz: "M. Chi (1989) tadqiqotida har bir algebraik o‘tish sababini tushuntirgan o‘quvchilar yangi masalalarni muvaffaqiyatliroq yechgan."
    },
    platformMechanism: {
      ru: "Как реализовано в BilimAI: ИИ-тьютор (Claude API) поясняет нарушенное правило и задаёт короткий встречный вопрос на понимание перехода.",
      kk: "BilimAI-де іске асырылуы: ЖИ-тьютор (Claude API) бұзылған ережені түсіндіріп, ауысуды тексеруге арналған қысқа сұрақ қояды.",
      uz: "BilimAI da qo‘llanilishi: SI-tyutor (Claude API) buzilgan qoidani tushuntiradi va tekshiruv savolini beradi."
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
