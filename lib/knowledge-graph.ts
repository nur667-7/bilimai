import { topicIds, type Language, type TopicId } from "./curriculum.ts";
import { reviewSchedule, topicName, type Progress } from "./error-lab.ts";
import type { UntAttemptSummary } from "./unt-exam.ts";

export type GraphCluster = "literacy" | "algebra" | "geometry";
export type GraphFilter = "all" | "gaps" | GraphCluster;

export type GraphNodeStatus =
  | "mastered"
  | "in_progress"
  | "root_gap"
  | "blocked_gap"
  | "ready"
  | "locked";

export type GraphNodeMeta = {
  id: TopicId;
  orderNumber: string;
  cluster: GraphCluster;
  tier: 0 | 1 | 2 | 3;
  baseX: number;
  baseY: number;
  prerequisites: TopicId[];
  untQuestionsWeight: number;
  untWeightLabel: Record<Language, string>;
  commonTraps: Record<Language, [string, string]>;
};

export type ComputedGraphNode = GraphNodeMeta & {
  title: string;
  soloCount: number;
  assistedCount: number;
  examRatio: number | null;
  masteryPercent: number;
  status: GraphNodeStatus;
  isWeakMarked: boolean;
  isRootGap: boolean;
  dueForReview: boolean;
  unlocks: TopicId[];
  missingPrerequisites: TopicId[];
  priorityScore: number;
};

export type ComputedGraphEdge = {
  id: string;
  from: TopicId;
  to: TopicId;
  status: "mastered" | "critical" | "ready" | "neutral";
  reason: Record<Language, string>;
};

export type StudyPlanStep = {
  rank: number;
  topic: TopicId;
  title: string;
  status: GraphNodeStatus;
  masteryPercent: number;
  expectedUntGain: number;
  unlocksCount: number;
  missingPrerequisites: TopicId[];
  reason: string;
};

export type KnowledgeGraphState = {
  nodes: ComputedGraphNode[];
  edges: ComputedGraphEdge[];
  studyPlan: StudyPlanStep[];
  summary: {
    masteredCount: number;
    rootGapCount: number;
    blockedGapCount: number;
    averageMastery: number;
    nextBestTopic: TopicId;
  };
};

export const UNT_GRAPH_NODES: GraphNodeMeta[] = [
  {
    id: "linear",
    orderNumber: "01",
    cluster: "algebra",
    tier: 0,
    baseX: 115,
    baseY: 165,
    prerequisites: [],
    untQuestionsWeight: 4,
    untWeightLabel: {
      ru: "База · 3–4 задания ЕНТ",
      kk: "База · 3–4 ҰБТ тапсырмасы",
      uz: "Baza · 3–4 ta topshiriq"
    },
    commonTraps: {
      ru: [
        "Вычитание слагаемого только из одной части уравнения",
        "Потеря знака «минус» при делении на отрицательный коэффициент"
      ],
      kk: [
        "Қосылғышты теңдеудің тек бір жағынан азайту",
        "Теріс коэффициентке бөлгенде таңбаны жоғалту"
      ],
      uz: [
        "Hadni tenglamaning faqat bir tomonidan ayirish",
        "Manfiy koeffitsiyentga bo‘lganda ishorani yo‘qotish"
      ]
    }
  },
  {
    id: "planimetry",
    orderNumber: "09",
    cluster: "geometry",
    tier: 0,
    baseX: 115,
    baseY: 365,
    prerequisites: [],
    untQuestionsWeight: 5,
    untWeightLabel: {
      ru: "Геометрия · 4–5 заданий ЕНТ",
      kk: "Геометрия · 4–5 ҰБТ тапсырмасы",
      uz: "Geometriya · 4–5 ta topshiriq"
    },
    commonTraps: {
      ru: [
        "Забывают коэффициент 1/2 в площади треугольника и трапеции",
        "Подставляют боковую сторону трапеции вместо её высоты"
      ],
      kk: [
        "Үшбұрыш пен трапеция ауданында 2-ге бөлуді ұмыту",
        "Трапеция биіктігінің орнына бүйір қабырғасын қою"
      ],
      uz: [
        "Uchburchak va trapetsiya yuzasida 2 ga bo‘lishni unutish",
        "Trapetsiya balandligi o‘rniga yon tomonini qo‘yish"
      ]
    }
  },
  {
    id: "percent",
    orderNumber: "02",
    cluster: "literacy",
    tier: 1,
    baseX: 315,
    baseY: 85,
    prerequisites: ["linear"],
    untQuestionsWeight: 4,
    untWeightLabel: {
      ru: "Мат. грамотность · 3–4 задания",
      kk: "Мат. сауаттылық · 3–4 тапсырма",
      uz: "Mat. savodxonlik · 3–4 ta topshiriq"
    },
    commonTraps: {
      ru: [
        "Вычитают проценты напрямую из числа без перевода в долю",
        "Берут повторную скидку от старой цены вместо новой базы"
      ],
      kk: [
        "Пайызды үлеске айналдырмай саннан тікелей азайту",
        "Қайталама жеңілдікте бастапқы бағаны қате негіз ретінде алу"
      ],
      uz: [
        "Foizni ulushga aylantirmay sondan to‘g‘ridan-to‘g‘ri ayirish",
        "Takroriy chegirmada yangi narx o‘rniga eski bazani olish"
      ]
    }
  },
  {
    id: "progressions",
    orderNumber: "05",
    cluster: "algebra",
    tier: 1,
    baseX: 315,
    baseY: 205,
    prerequisites: ["linear"],
    untQuestionsWeight: 3,
    untWeightLabel: {
      ru: "Контекст + Профиль · 3 задания",
      kk: "Контекст + Бейін · 3 тапсырма",
      uz: "Kontekst + Profil · 3 ta topshiriq"
    },
    commonTraps: {
      ru: [
        "Умножают разность d на n вместо (n − 1) шагов",
        "Путают формулу n-го члена aₙ и суммы первых n членов Sₙ"
      ],
      kk: [
        "d айырымын (n − 1) орнына n-ге көбейту",
        "n-ші мүше aₙ мен Sₙ қосынды формуласын шатастыру"
      ],
      uz: [
        "d ayirmani (n − 1) o‘rniga n ga ko‘paytirish",
        "n-had aₙ va Sₙ yig‘indi formulasini adashtirish"
      ]
    }
  },
  {
    id: "quadratic",
    orderNumber: "04",
    cluster: "algebra",
    tier: 1,
    baseX: 315,
    baseY: 325,
    prerequisites: ["linear"],
    untQuestionsWeight: 6,
    untWeightLabel: {
      ru: "Ядро Алгебры · 5–6 заданий ЕНТ",
      kk: "Алгебра өзегі · 5–6 ҰБТ тапсырмасы",
      uz: "Algebra yadrosi · 5–6 ta topshiriq"
    },
    commonTraps: {
      ru: [
        "В теореме Виета берут сумму корней p вместо противоположного знака −p",
        "Находят оба корня, но в ответ записывают меньший вместо большего"
      ],
      kk: [
        "Виет теоремасында түбірлер қосындысының таңбасын ауыстырмау (−p)",
        "Екі түбірді тауып, сұралған үлкен түбірдің орнына кішісін жазу"
      ],
      uz: [
        "Viyet teoremasida ildizlar yig‘indisi ishorasini o‘zgartirmaslik (−p)",
        "Ikkala ildizni topib, so‘ralgan katta ildiz o‘rniga kichigini tanlash"
      ]
    }
  },
  {
    id: "probability",
    orderNumber: "03",
    cluster: "literacy",
    tier: 2,
    baseX: 540,
    baseY: 95,
    prerequisites: ["percent", "progressions"],
    untQuestionsWeight: 3,
    untWeightLabel: {
      ru: "Мат. грамотность · 2–3 задания",
      kk: "Мат. сауаттылық · 2–3 тапсырма",
      uz: "Mat. savodxonlik · 2–3 ta topshiriq"
    },
    commonTraps: {
      ru: [
        "Делят на число неблагоприятных исходов вместо общего числа исходов n",
        "Не учитывают выбор без возвращения при подсчёте пар C(n,2)"
      ],
      kk: [
        "Барлық нәтижелер саны n орнына тек қолайсыз нәтижелерге бөлу",
        "Қайтарусыз таңдауда жұптар санын C(n,2) бойынша есептемеу"
      ],
      uz: [
        "Barcha natijalar soni n o‘rniga faqat noqulay natijalarga bo‘lish",
        "Qaytarishsiz tanlashda juftliklar sonini C(n,2) bilan hisoblamaslik"
      ]
    }
  },
  {
    id: "functions",
    orderNumber: "06",
    cluster: "algebra",
    tier: 2,
    baseX: 540,
    baseY: 230,
    prerequisites: ["quadratic", "progressions"],
    untQuestionsWeight: 6,
    untWeightLabel: {
      ru: "Степени и логарифмы · 5–6 заданий",
      kk: "Дәреже және логарифм · 5–6 тапсырма",
      uz: "Daraja va logarifm · 5–6 ta topshiriq"
    },
    commonTraps: {
      ru: [
        "В уравнении log_b(A) = k умножают b × k вместо возведения в степень b^k",
        "Забывают отсеять посторонние корни по ОДЗ логарифма (A > 0)"
      ],
      kk: [
        "log_b(A) = k теңдеуінде b^k орнына b × k деп көбейту",
        "Логарифмнің мүмкін мәндер облысын (A > 0) тексермеу"
      ],
      uz: [
        "log_b(A) = k tenglamada b^k o‘rniga b × k deb ko‘paytirish",
        "Logarifm aniqlanish sohasini (A > 0) tekshirmaslik"
      ]
    }
  },
  {
    id: "trigonometry",
    orderNumber: "07",
    cluster: "geometry",
    tier: 2,
    baseX: 540,
    baseY: 370,
    prerequisites: ["planimetry", "quadratic"],
    untQuestionsWeight: 5,
    untWeightLabel: {
      ru: "Тригонометрия · 4–5 заданий ЕНТ",
      kk: "Тригонометрия · 4–5 ҰБТ тапсырмасы",
      uz: "Trigonometriya · 4–5 ta topshiriq"
    },
    commonTraps: {
      ru: [
        "Делят уравнение на sin(x) и теряют целую серию корней sin(x) = 0",
        "Теряют множитель при сворачивании sin²α + cos²α = 1"
      ],
      kk: [
        "Теңдеуді sin(x)-ке бөліп, sin(x) = 0 түбірлер сериясын жоғалту",
        "sin²α + cos²α = 1 тепе-теңдігінде ортақ көбейткішті жоғалту"
      ],
      uz: [
        "Tenglamani sin(x) ga bo‘lib, sin(x) = 0 ildizlarni yo‘qotish",
        "sin²α + cos²α = 1 ayniyatda umumiy ko‘paytuvchini tushirib qoldirish"
      ]
    }
  },
  {
    id: "derivative",
    orderNumber: "08",
    cluster: "algebra",
    tier: 3,
    baseX: 755,
    baseY: 185,
    prerequisites: ["functions", "quadratic", "trigonometry"],
    untQuestionsWeight: 5,
    untWeightLabel: {
      ru: "Производная и анализ · 4–5 заданий",
      kk: "Туынды және талдау · 4–5 тапсырма",
      uz: "Hosila va tahlil · 4–5 ta topshiriq"
    },
    commonTraps: {
      ru: [
        "При дифференцировании ax^n забывают уменьшить показатель степени на 1",
        "В уравнении касательной забывают слагаемое f(x₀)"
      ],
      kk: [
        "ax^n туындысын тапқанда дәреже көрсеткішін 1-ге кемітуді ұмыту",
        "Жанама теңдеуінде f(x₀) мүшесін қосуды ұмыту"
      ],
      uz: [
        "ax^n hosilasini topishda darajani 1 ga kamaytirishni unutish",
        "Urinma tenglamasida f(x₀) hadni qo‘shishni unutish"
      ]
    }
  },
  {
    id: "stereometry",
    orderNumber: "10",
    cluster: "geometry",
    tier: 3,
    baseX: 755,
    baseY: 350,
    prerequisites: ["planimetry", "trigonometry"],
    untQuestionsWeight: 4,
    untWeightLabel: {
      ru: "Стереометрия · 3–4 задания (2 балла)",
      kk: "Стереометрия · 3–4 тапсырма (2 балл)",
      uz: "Stereometriya · 3–4 ta topshiriq (2 ball)"
    },
    commonTraps: {
      ru: [
        "Забывают множитель 1/3 в объёме пирамиды и конуса V = (1/3)S·h",
        "Подставляют апофему боковой грани вместо высоты пирамиды h"
      ],
      kk: [
        "Пирамида мен конус көлемінде 1/3 көбейткішін ұмыту",
        "Биіктік h орнына бүйір жақтың апофемасын қою"
      ],
      uz: [
        "Piramida va konus hajmida 1/3 ko‘paytuvchini unutish",
        "Balandlik h o‘rniga yon yoq apofemasini qo‘yish"
      ]
    }
  }
];

export const EDGE_REASONS: Record<string, Record<Language, string>> = {
  "linear->percent": {
    ru: "Задачи на сплавы и проценты сводятся к линейным уравнениям баланса.",
    kk: "Қорытпа мен пайыз есептері сызықтық теңдеуге келтіріледі.",
    uz: "Qotishma va foiz masalalari chiziqli tenglamaga keltiriladi."
  },
  "linear->progressions": {
    ru: "Формула n-го члена aₙ = a₁ + (n−1)d линейна относительно шага n.",
    kk: "aₙ = a₁ + (n−1)d формуласы n бойынша сызықтық теңдеу.",
    uz: "aₙ = a₁ + (n−1)d formulasi n ga nisbatan chiziqli tenglama."
  },
  "linear->quadratic": {
    ru: "Приведение подобных и равносильные переходы со знаками.",
    kk: "Ұқсас мүшелерді біріктіру және таңба инварианты.",
    uz: "O‘xshash hadlarni ixchamlash va ishora qoidalari."
  },
  "percent->probability": {
    ru: "Перевод долей, частот и процентов в классическую вероятность m/n.",
    kk: "Үлес пен пайызды m/n ықтималдығына ауыстыру.",
    uz: "Ulush va foizni m/n ehtimollikka o‘tkazish."
  },
  "progressions->probability": {
    ru: "Подсчёт числа комбинаций и суммирование рядов исходов.",
    kk: "Нұсқалар санын және қатар қосындысын есептеу.",
    uz: "Variantlar soni va qator yig‘indisini hisoblash."
  },
  "quadratic->functions": {
    ru: "Логарифмические и показательные уравнения сводятся к квадратным с проверкой ОДЗ.",
    kk: "Логарифмдік және көрсеткіштік теңдеулер ММО-мен квадрат теңдеуге келеді.",
    uz: "Logarifmik va ko‘rsatkichli tenglamalar kvadrat tenglamaga keladi."
  },
  "progressions->functions": {
    ru: "Геометрическая прогрессия bₙ = b₁·q^(n−1) задаёт показательный рост.",
    kk: "Геометриялық прогрессия көрсеткіштік функциямен байланысты.",
    uz: "Geometrik progressiya ko‘rsatkichli funksiya bilan bog‘liq."
  },
  "planimetry->trigonometry": {
    ru: "Тождество sin²α + cos²α = 1 следует из теоремы Пифагора в прямоугольном треугольнике.",
    kk: "Негізгі тригонометриялық тепе-теңдік Пифагор теоремасынан шығады.",
    uz: "Asosiy trigonometrik ayniyat Pifagor teoremasiga tayanadi."
  },
  "quadratic->trigonometry": {
    ru: "Тригонометрические уравнения решаются заменой t = cos(x) через квадратный трёхчлен.",
    kk: "Тригонометриялық теңдеулер квадрат үшмүшеге алмастыру арқылы шешіледі.",
    uz: "Trigonometrik tenglamalar kvadrat uchhadga almashtirish bilan yechiladi."
  },
  "functions->derivative": {
    ru: "Дифференцирование степенных, показательных и логарифмических функций.",
    kk: "Дәрежелік және логарифмдік функциялардың туындысын табу.",
    uz: "Darajali va logarifmik funksiyalar hosilasini hisoblash."
  },
  "quadratic->derivative": {
    ru: "Поиск точек экстремума f′(x) = 0 для кубической функции сводится к квадратному уравнению.",
    kk: "f′(x) = 0 экстремум нүктелерін табу квадрат теңдеуді шешуді талап етеді.",
    uz: "f′(x) = 0 ekstremum nuqtalarini topish kvadrat tenglamaga keladi."
  },
  "trigonometry->derivative": {
    ru: "Производные тригонометрических функций и угловой коэффициент касательной k = tg(α).",
    kk: "Тригонометриялық функциялар туындысы және жанаманың бұрыштық коэффициенті.",
    uz: "Trigonometrik funksiyalar hosilasi va urinma burchak koeffitsiyenti."
  },
  "planimetry->stereometry": {
    ru: "В формулу объёма V = (1/3)S_осн·h входит площадь плоского многоугольника или круга.",
    kk: "Көлем формуласына табанындағы жазық фигураның ауданы S_таб кіреді.",
    uz: "Hajm formulasiga asosidagi tekis shakl yuzasi S_asos kiradi."
  },
  "trigonometry->stereometry": {
    ru: "Высота пирамиды и конуса находится через угол наклона ребра или образующей.",
    kk: "Пирамида биіктігі бүйір қырының көлбеу бұрышы арқылы табылады.",
    uz: "Piramida balandligi yon qirra og‘ish burchagi orqali topiladi."
  }
};

export function buildKnowledgeGraphState(
  progress: Progress,
  untAttempt: UntAttemptSummary | null | undefined,
  manualWeakTopics: TopicId[],
  lang: Language,
  now = Date.now()
): KnowledgeGraphState {
  const schedule = reviewSchedule(progress, now);
  const dueMap = new Map(schedule.map((s) => [s.topic, s.due]));

  const rawByTopic = new Map<
    TopicId,
    {
      soloCount: number;
      assistedCount: number;
      examRatio: number | null;
      isWeakMarked: boolean;
      empiricalScore: number;
      hasEvidence: boolean;
    }
  >();

  for (const meta of UNT_GRAPH_NODES) {
    const records = progress.records.filter((r) => r.topic === meta.id);
    const soloCount = new Set(records.filter((r) => r.independent).map((r) => r.challenge)).size;
    const assistedCount = records.filter((r) => !r.independent).length;
    const rawRatio = untAttempt?.topicRatios[meta.id];
    const examRatio: number | null = typeof rawRatio === "number" ? rawRatio : null;
    const isWeakMarked = manualWeakTopics.includes(meta.id);

    const labScore =
      soloCount >= 2 ? 92 : soloCount === 1 ? 72 : assistedCount > 0 ? 38 : null;
    const examScore = examRatio !== null ? Math.round(examRatio * 100) : null;

    let empiricalScore = 45;
    let hasEvidence = false;

    if (examScore !== null && labScore !== null) {
      empiricalScore = Math.round(0.6 * examScore + 0.4 * labScore);
      hasEvidence = true;
    } else if (examScore !== null) {
      empiricalScore = examScore;
      hasEvidence = true;
    } else if (labScore !== null) {
      empiricalScore = labScore;
      hasEvidence = true;
    }

    if (isWeakMarked && soloCount < 2 && (examScore === null || examScore < 80)) {
      empiricalScore = Math.min(empiricalScore, 42);
      hasEvidence = true;
    }

    rawByTopic.set(meta.id, {
      soloCount,
      assistedCount,
      examRatio,
      isWeakMarked,
      empiricalScore,
      hasEvidence
    });
  }

  // Propagate mastery & detect root vs blocked gaps in topological order (tier 0 -> 3)
  const masteryMap = new Map<TopicId, number>();
  const gapFlagMap = new Map<TopicId, boolean>();

  const sortedMeta = [...UNT_GRAPH_NODES].sort((a, b) => a.tier - b.tier);
  for (const meta of sortedMeta) {
    const raw = rawByTopic.get(meta.id)!;
    const parentScores = meta.prerequisites.map((p) => masteryMap.get(p) ?? 50);
    const parentAvg =
      parentScores.length > 0
        ? parentScores.reduce((acc, v) => acc + v, 0) / parentScores.length
        : 55;

    let mastery = raw.hasEvidence
      ? Math.round(0.8 * raw.empiricalScore + 0.2 * parentAvg)
      : Math.round(0.5 * 45 + 0.5 * parentAvg);

    // Back-propagation penalty if user failed exam or marked weak
    if (raw.examRatio !== null && raw.examRatio < 0.5 && raw.soloCount < 2) {
      mastery = Math.min(mastery, 44);
    }
    mastery = Math.max(0, Math.min(100, mastery));
    masteryMap.set(meta.id, mastery);

    const hasGap =
      raw.isWeakMarked ||
      (raw.examRatio !== null && raw.examRatio < 0.75 && raw.soloCount < 2) ||
      (raw.assistedCount > 0 && raw.soloCount === 0);

    gapFlagMap.set(meta.id, hasGap && mastery < 80);
  }

  // If a child has a gap and a parent has no evidence yet and isn't mastered, check prerequisite readiness
  const isPrerequisiteReady = (id: TopicId): boolean => {
    const m = masteryMap.get(id) ?? 0;
    const g = gapFlagMap.get(id) ?? false;
    return !g && m >= 60;
  };

  const computedNodes: ComputedGraphNode[] = UNT_GRAPH_NODES.map((meta) => {
    const raw = rawByTopic.get(meta.id)!;
    const masteryPercent = masteryMap.get(meta.id) ?? 45;
    const hasGap = gapFlagMap.get(meta.id) ?? false;
    const unlocks = UNT_GRAPH_NODES.filter((m) => m.prerequisites.includes(meta.id)).map((m) => m.id);
    const missingPrerequisites = meta.prerequisites.filter((p) => !isPrerequisiteReady(p));

    let status: GraphNodeStatus;
    if (masteryPercent >= 80 && !hasGap) {
      status = "mastered";
    } else if (hasGap && missingPrerequisites.length === 0) {
      status = "root_gap";
    } else if (hasGap && missingPrerequisites.length > 0) {
      status = "blocked_gap";
    } else if (masteryPercent >= 60) {
      status = "in_progress";
    } else if (missingPrerequisites.length === 0) {
      status = "ready";
    } else {
      status = "locked";
    }

    const isRootGap = status === "root_gap";
    const gate = missingPrerequisites.length === 0 ? 1.0 : 0.25;
    const deficit = Math.max(0, 88 - masteryPercent);
    const unlockBonus = unlocks.length * 14;
    const weightBonus = meta.untQuestionsWeight * 6;
    const rootBonus = isRootGap ? 30 : 0;
    const priorityScore =
      status === "mastered"
        ? 0
        : Math.round(gate * (deficit + unlockBonus + weightBonus + rootBonus));

    return {
      ...meta,
      title: topicName(meta.id, lang),
      soloCount: raw.soloCount,
      assistedCount: raw.assistedCount,
      examRatio: raw.examRatio,
      masteryPercent,
      status,
      isWeakMarked: raw.isWeakMarked,
      isRootGap,
      dueForReview: dueMap.get(meta.id) ?? false,
      unlocks,
      missingPrerequisites,
      priorityScore
    };
  });

  const nodeById = new Map(computedNodes.map((n) => [n.id, n]));

  const edges: ComputedGraphEdge[] = [];
  for (const node of computedNodes) {
    for (const pre of node.prerequisites) {
      const fromNode = nodeById.get(pre)!;
      const key = `${pre}->${node.id}`;
      let edgeStatus: ComputedGraphEdge["status"] = "neutral";
      if (fromNode.status === "root_gap" || (node.status === "blocked_gap" && !isPrerequisiteReady(pre))) {
        edgeStatus = "critical";
      } else if (fromNode.status === "mastered" && node.status === "mastered") {
        edgeStatus = "mastered";
      } else if (isPrerequisiteReady(pre)) {
        edgeStatus = "ready";
      }

      edges.push({
        id: key,
        from: pre,
        to: node.id,
        status: edgeStatus,
        reason: EDGE_REASONS[key] ?? {
          ru: "Базовый математический пререквизит.",
          kk: "Тірек математикалық тақырып.",
          uz: "Tayanch matematik mavzu."
        }
      });
    }
  }

  const actionableNodes = computedNodes
    .filter((n) => n.status !== "mastered")
    .sort((a, b) => b.priorityScore - a.priorityScore || a.tier - b.tier);

  const studyPlan: StudyPlanStep[] = actionableNodes.map((n, index) => {
    const missingNames = n.missingPrerequisites.map((id) => topicName(id, lang)).join(", ");
    let reason: string;
    if (n.status === "root_gap") {
      reason =
        lang === "ru"
          ? `Корневой пробел (база открыта): закрытие темы разблокирует ${n.unlocks.length} след. разд. и сохранит до +${n.untQuestionsWeight} б. ЕНТ.`
          : lang === "kk"
            ? `Түпкі олқылық (база ашық): осы тақырыпты меңгеру ${n.unlocks.length} келесі бөлімге жол ашады (+${n.untQuestionsWeight} балл).`
            : `Asosiy bo‘shliq: ushbu mavzuni yopish ${n.unlocks.length} ta keyingi bo‘limni ochadi (+${n.untQuestionsWeight} ball).`;
    } else if (n.status === "blocked_gap") {
      reason =
        lang === "ru"
          ? `Заблокировано пробелом в базовой теме (${missingNames}). Сначала закройте фундамент.`
          : lang === "kk"
            ? `Тірек тақырыптағы (${missingNames}) олқылықпен бұғатталған. Алдымен базаны жабыңыз.`
            : `Tayanch mavzudagi (${missingNames}) bo‘shliq tufayli bloklangan. Avval bazani yoping.`;
    } else if (n.status === "ready") {
      reason =
        lang === "ru"
          ? `Фронт обучения: все пререквизиты освоены, тема готова к быстрой отработке.`
          : lang === "kk"
            ? `Оқу шебі: барлық пререквизиттер меңгерілген, жаттығуға дайын.`
            : `O‘quv fronti: barcha tayanch mavzular o‘zlashtirilgan, mashqqa tayyor.`;
    } else {
      reason =
        lang === "ru"
          ? `Закрепление навыка до ≥2 самостоятельных решений без подсказок.`
          : lang === "kk"
            ? `Көмексіз ≥2 өздік шешімге дейін бекіту.`
            : `Yordamsiz ≥2 ta mustaqil yechimgacha mustahkamlash.`;
    }

    return {
      rank: index + 1,
      topic: n.id,
      title: n.title,
      status: n.status,
      masteryPercent: n.masteryPercent,
      expectedUntGain: n.untQuestionsWeight,
      unlocksCount: n.unlocks.length,
      missingPrerequisites: n.missingPrerequisites,
      reason
    };
  });

  const masteredCount = computedNodes.filter((n) => n.status === "mastered").length;
  const rootGapCount = computedNodes.filter((n) => n.status === "root_gap").length;
  const blockedGapCount = computedNodes.filter((n) => n.status === "blocked_gap").length;
  const averageMastery = Math.round(
    computedNodes.reduce((sum, n) => sum + n.masteryPercent, 0) / computedNodes.length
  );
  const nextBestTopic = studyPlan[0]?.topic ?? topicIds[0];

  return {
    nodes: computedNodes,
    edges,
    studyPlan,
    summary: {
      masteredCount,
      rootGapCount,
      blockedGapCount,
      averageMastery,
      nextBestTopic
    }
  };
}
