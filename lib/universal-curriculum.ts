import { lessons, type Language } from "./lessons.ts";
import { UNT_SUBJECTS, type UntSubjectId } from "./unt-all-subjects.ts";
import { UNT_GRAPH_NODES } from "./knowledge-graph.ts";
import type { UniversalQuestion } from "./question-engine.ts";

export type UniversalDifficulty = "basic" | "intermediate" | "advanced";

export interface ContentBlock {
  type: "rich_text" | "formula" | "code" | "table" | "source_doc" | "diagram" | "diagram_note";
  title: Record<Language, string>;
  body: Record<Language, string>;
  codeLanguage?: string;
}

export interface UniversalLesson {
  id: string;
  subjectId: string;
  moduleId?: string;
  topicId: string;
  sectionTitle: Record<Language, string>;
  version?: string;
  updatedAt?: string;
  difficulty: UniversalDifficulty;
  estimatedMinutes: number;
  title: Record<Language, string>;
  goal: Record<Language, string>;
  learningGoal: Record<Language, string>;
  prerequisites: string[];
  simpleExplanation: Record<Language, string>;
  detailedExplanation: Record<Language, string>;
  workedExample: {
    problem: Record<Language, string>;
    steps: Record<Language, string[]>;
    takeaway: Record<Language, string>;
  };
  contentBlocks: ContentBlock[];
  summary: Record<Language, string>;
  nextStepNote?: Record<Language, string>;
  questions: UniversalQuestion[];
}

export interface UniversalTopicNode {
  id: string;
  subjectId: string;
  moduleId?: string;
  title: Record<Language, string>;
  sectionTitle: Record<Language, string>;
  difficulty: UniversalDifficulty;
  level?: UniversalDifficulty;
  prerequisites: string[];
  unlocks: string[];
  lessonId: string;
  lessonIds?: string[];
  weight?: number;
}

export interface UniversalModule {
  id: string;
  subjectId?: string;
  title: Record<Language, string>;
  summary?: Record<Language, string>;
  description?: Record<Language, string>;
  topicIds: string[];
}

export interface UniversalErrorLabCase {
  id: string;
  subjectId: string;
  topicId: string;
  title: Record<Language, string>;
  taskPrompt: Record<Language, string>;
  steps: Record<Language, [string, string, string]>;
  brokenStepIndex: 0 | 1 | 2;
  errorCategory: string;
  whyBroken: Record<Language, string>;
  correctedStep: Record<Language, string>;
  transferQuestion: UniversalQuestion;
}

export interface UniversalSubjectCurriculum {
  id: string;
  slug?: string;
  category: "mandatory" | "stem" | "natural_science" | "humanities" | "languages" | "custom";
  badge: string;
  accentColor: string;
  iconName: string;
  version?: string;
  updatedAt?: string;
  readinessStatus?: "full_course" | "starter_course";
  readinessLabel?: Record<Language, string>;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  description: Record<Language, string>;
  shortDescription: Record<Language, string>;
  levels: Record<Language, string[]>;
  courses?: {
    id: string;
    title: Record<Language, string>;
    levelLabel: Record<Language, string>;
    lessonsCount: number;
  }[];
  modules: UniversalModule[];
  topics: UniversalTopicNode[];
  lessons: UniversalLesson[];
  errorLabCases: UniversalErrorLabCase[];
  diagnosticQuestionIds?: string[];
}

function tr(ru: string, kk?: string, uz?: string): Record<Language, string> {
  return {
    ru,
    kk: kk ?? ru,
    uz: uz ?? ru
  };
}

function buildMathUniversalCurriculum(): UniversalSubjectCurriculum {
  const mathLessons: UniversalLesson[] = lessons.ru.map((ruLesson, idx) => {
    const kkLesson = lessons.kk[idx] ?? ruLesson;
    const uzLesson = lessons.uz[idx] ?? ruLesson;
    const graphNode = UNT_GRAPH_NODES.find((g) => g.id === ruLesson.id);
    const prereqs = graphNode?.prerequisites ?? [];

    const qs: UniversalQuestion[] = ruLesson.questions.map((qRu, qIdx) => {
      const qKk = kkLesson.questions[qIdx] ?? qRu;
      const qUz = uzLesson.questions[qIdx] ?? qRu;
      return {
        id: `math-${ruLesson.id}-q${qIdx + 1}`,
        subjectId: "math",
        topicId: ruLesson.id,
        lessonId: `math-lesson-${ruLesson.id}`,
        type: "single_choice",
        difficulty: qIdx === 0 ? "basic" : qIdx === 1 ? "intermediate" : "advanced",
        maxPoints: 1,
        prompt: {
          ru: qRu.text,
          kk: qKk.text,
          uz: qUz.text
        },
        options: {
          ru: [...qRu.options],
          kk: [...qKk.options],
          uz: [...qUz.options]
        },
        correctIndex: qRu.correct,
        explanation: {
          ru: qRu.why,
          kk: qKk.why,
          uz: qUz.why
        },
        hint: {
          ru: ruLesson.rule,
          kk: kkLesson.rule,
          uz: uzLesson.rule
        },
        errorCategory: `math_${ruLesson.id}`
      };
    });

    const goalMap = {
      ru: ruLesson.intro,
      kk: kkLesson.intro,
      uz: uzLesson.intro
    };

    const sectionTitleMap = {
      ru: ruLesson.section ?? "Математика",
      kk: kkLesson.section ?? "Математика",
      uz: uzLesson.section ?? "Matematika"
    };

    return {
      id: `math-lesson-${ruLesson.id}`,
      subjectId: "math",
      moduleId: `math-mod-${Math.floor(idx / 4) + 1}`,
      topicId: ruLesson.id,
      sectionTitle: sectionTitleMap,
      version: "2.0.0",
      updatedAt: "2026-10-10",
      difficulty: idx < 5 ? "basic" : idx < 11 ? "intermediate" : "advanced",
      estimatedMinutes: 12,
      title: {
        ru: ruLesson.title,
        kk: kkLesson.title,
        uz: uzLesson.title
      },
      goal: goalMap,
      learningGoal: goalMap,
      prerequisites: prereqs,
      simpleExplanation: {
        ru: ruLesson.rule,
        kk: kkLesson.rule,
        uz: uzLesson.rule
      },
      detailedExplanation: {
        ru: `${ruLesson.intro} Ключевой инвариант: ${ruLesson.rule}`,
        kk: `${kkLesson.intro} Негізгі ереже: ${kkLesson.rule}`,
        uz: `${uzLesson.intro} Asosiy qoida: ${uzLesson.rule}`
      },
      workedExample: {
        problem: {
          ru: ruLesson.example,
          kk: kkLesson.example,
          uz: uzLesson.example
        },
        steps: {
          ru: [...ruLesson.steps],
          kk: [...kkLesson.steps],
          uz: [...uzLesson.steps]
        },
        takeaway: {
          ru: ruLesson.rule,
          kk: kkLesson.rule,
          uz: uzLesson.rule
        }
      },
      contentBlocks: [
        {
          type: "formula",
          title: tr("Опорное правило и инвариант", "Негізгі ереже мен инвариант", "Tayanch qoida va invariant"),
          body: {
            ru: ruLesson.rule,
            kk: kkLesson.rule,
            uz: uzLesson.rule
          }
        }
      ],
      summary: {
        ru: ruLesson.intro,
        kk: kkLesson.intro,
        uz: uzLesson.intro
      },
      nextStepNote: tr(
        "Закрепите тему на 3 практических заданиях и проверьте перенос правила на новых числах.",
        "Тақырыпты 3 жаттығу арқылы бекітіп, жаңа сандармен тексеріңіз.",
        "Mavzuni 3 ta amaliy topshiriqda mustahkamlang va yangi sonlarda синаб ko‘ring."
      ),
      questions: qs
    };
  });

  const modules: UniversalModule[] = [
    {
      id: "math-mod-1",
      subjectId: "math",
      title: tr("Алгебраический фундамент: уравнения, неравенства и системы", "Алгебра негізі: теңдеулер, теңсіздіктер және жүйелер", "Algebra asosi: tenglamalar, tengsizliklar va sistemalar"),
      description: tr("Равносильные преобразования, метод интервалов, проценты и пропорции.", "Теңбе-тең түрлендірулер, интервалдар әдісі және пайыздар.", "Teng kuchli almashtirishlar, intervallar usuli va foizlar."),
      summary: tr("Равносильные преобразования, метод интервалов, проценты и пропорции.", "Теңбе-тең түрлендірулер, интервалдар әдісі және пайыздар.", "Teng kuchli almashtirishlar, intervallar usuli va foizlar."),
      topicIds: ["linear", "inequalities", "systems", "percent"]
    },
    {
      id: "math-mod-2",
      subjectId: "math",
      title: tr("Вероятность, степени, квадратные уравнения и прогрессии", "Ықтималдық, түбірлер, квадрат теңдеулер және прогрессиялар", "Ehtimollik, ildizlar, kvadrat tenglamalar va progressiyalar"),
      description: tr("Комбинаторика, корни и степени, теорема Виета, арифметическая и геометрическая прогрессии.", "Комбинаторика, дәрежелер, Виет теоремасы және прогрессиялар.", "Kombinatorika, darajalar, Viyet teoremasi va progressiyalar."),
      summary: tr("Комбинаторика, корни и степени, теорема Виета, арифметическая и геометрическая прогрессии.", "Комбинаторика, дәрежелер, Виет теоремасы және прогрессиялар.", "Kombinatorika, darajalar, Viyet teoremasi va progressiyalar."),
      topicIds: ["probability", "combinatorics", "radicals", "quadratic", "progressions"]
    },
    {
      id: "math-mod-3",
      subjectId: "math",
      title: tr("Показательные и логарифмические функции, тригонометрия и анализ", "Көрсеткіштік, логарифмдік функциялар, тригонометрия және анализ", "Ko‘rsatkichli, logarifmik funksiyalar, trigonometriya va analiz"),
      description: tr("ОДЗ логарифмов, тригонометрический круг, производная и первообразная.", "Логарифм АОО, тригонометрия, туынды және интеграл.", "Logarifm aniqlanish sohasi, trigonometriya, hosila va integral."),
      summary: tr("ОДЗ логарифмов, тригонометрический круг, производная и первообразная.", "Логарифм АОО, тригонометрия, туынды және интеграл.", "Logarifm aniqlanish sohasi, trigonometriya, hosila va integral."),
      topicIds: ["functions", "trigonometry", "derivative", "integrals"]
    },
    {
      id: "math-mod-4",
      subjectId: "math",
      title: tr("Геометрия: планиметрия, векторы и стереометрия", "Геометрия: планиметрия, векторлар және стереометрия", "Geometriya: planimetriya, vektorlar va stereometriya"),
      description: tr("Площади фигур, скалярное произведение векторов, объёмы призм, пирамид и тел вращения.", "Фигуралар ауданы, векторлар, призма мен пирамида көлемі.", "Shakl yuzalari, vektorlar, prizma va piramida hajmi."),
      summary: tr("Площади фигур, скалярное произведение векторов, объёмы призм, пирамид и тел вращения.", "Фигуралар ауданы, векторлар, призма мен пирамида көлемі.", "Shakl yuzalari, vektorlar, prizma va piramida hajmi."),
      topicIds: ["planimetry", "vectors", "stereometry"]
    }
  ];

  const topics: UniversalTopicNode[] = mathLessons.map((ml, idx) => ({
    id: ml.topicId,
    subjectId: "math",
    moduleId: ml.moduleId,
    title: ml.title,
    sectionTitle: {
      ru: lessons.ru[idx]?.section ?? "Математика",
      kk: lessons.kk[idx]?.section ?? "Математика",
      uz: lessons.uz[idx]?.section ?? "Matematika"
    },
    difficulty: ml.difficulty,
    level: ml.difficulty,
    prerequisites: ml.prerequisites,
    unlocks: mathLessons.filter((other) => other.prerequisites.includes(ml.topicId)).map((other) => other.topicId),
    lessonId: ml.id,
    lessonIds: [ml.id],
    weight: 3
  }));

  const errorLabCases: UniversalErrorLabCase[] = [
    {
      id: "math-err-ineq",
      subjectId: "math",
      topicId: "inequalities",
      title: tr("Деление неравенства на отрицательное число", "Теңсіздікті теріс санға бөлу", "Tengsizlikni manfiy songa bo‘lish"),
      taskPrompt: tr("Решите неравенство: −4x + 8 > 20", "Теңсіздікті шешіңіз: −4x + 8 > 20", "Tengsizlikni yeching: −4x + 8 > 20"),
      steps: {
        ru: ["1) Перенесём 8 в правую часть: −4x > 12", "2) Разделим обе части на −4: x > −3", "3) Ответ: (−3; +∞)"],
        kk: ["1) 8 санын оң жаққа шығарамыз: −4x > 12", "2) Екі жағын −4-ке бөлеміз: x > −3", "3) Жауабы: (−3; +∞)"],
        uz: ["1) 8 ni o‘ng tomonga o‘tkazamiz: −4x > 12", "2) Ikkala tomonni −4 ga bo‘lamiz: x > −3", "3) Javob: (−3; +∞)"]
      },
      brokenStepIndex: 1,
      errorCategory: "sign_flip",
      whyBroken: tr(
        "При делении обеих частей неравенства на отрицательное число (−4) знак неравенства обязан развернуться с > на <.",
        "Теңсіздіктің екі жағын теріс санға (−4) бөлгенде теңсіздік таңбасы > орнына < болып өзгеруі тиіс.",
        "Tengsizlikning ikkala tomonini manfiy songa (−4) bo‘lganda ishora > dan < ga o‘zgarishi shart."
      ),
      correctedStep: tr("2) Разделим на −4 со сменой знака: x < −3", "2) Таңбаны өзгертіп −4-ке бөлеміз: x < −3", "2) Ishorani o‘zgartirib −4 ga bo‘lamiz: x < −3"),
      transferQuestion: {
        id: "math-err-ineq-transfer",
        subjectId: "math",
        topicId: "inequalities",
        lessonId: "math-lesson-inequalities",
        type: "single_choice",
        difficulty: "basic",
        maxPoints: 1,
        prompt: tr("Решите самостоятельно: −3x > 15", "Өз бетінше шешіңіз: −3x > 15", "Mustaqil yeching: −3x > 15"),
        options: {
          ru: ["x < −5", "x > −5", "x < 5", "x > 5"],
          kk: ["x < −5", "x > −5", "x < 5", "x > 5"],
          uz: ["x < −5", "x > −5", "x < 5", "x > 5"]
        },
        correctIndex: 0,
        explanation: tr("При делении 15 на −3 получаем −5, а знак > разворачивается в <: x < −5.", "15-ті −3-ке бөлгенде −5 шығады, ал > таңбасы < болып өзгереді: x < −5.", "15 ni −3 ga bo‘lganda −5 chiqadi, > ishorasi esa < ga o‘zgaradi: x < −5."),
        hint: tr("Не забудьте развернуть знак неравенства при делении на −3.", "−3-ке бөлгенде таңбаны өзгертуді ұмытпаңыз.", "−3 ga bo‘lganda ishorani o‘zgartirishni unutmang."),
        errorCategory: "sign_flip"
      }
    },
    {
      id: "math-err-vieta",
      subjectId: "math",
      topicId: "quadratic",
      title: tr("Знак суммы корней по теореме Виета", "Виет теоремасы бойынша түбірлер қосындысының таңбасы", "Viyet teoremasi bo‘yicha ildizlar yig‘indisi ishorasi"),
      taskPrompt: tr("Найдите корни уравнения: x² − 7x + 12 = 0", "Теңдеудің түбірлерін табыңыз: x² − 7x + 12 = 0", "Tenglamaning ildizlarini toping: x² − 7x + 12 = 0"),
      steps: {
        ru: ["1) Приведённое квадратное уравнение: p = −7, q = 12", "2) По теореме Виета: x₁ + x₂ = −7, x₁ · x₂ = 12", "3) Подбираем корни: x₁ = −3, x₂ = −4"],
        kk: ["1) Келтірілген квадрат теңдеу: p = −7, q = 12", "2) Виет теоремасы бойынша: x₁ + x₂ = −7, x₁ · x₂ = 12", "3) Түбірлері: x₁ = −3, x₂ = −4"],
        uz: ["1) Keltirilgan kvadrat tenglama: p = −7, q = 12", "2) Viyet teoremasi bo‘yicha: x₁ + x₂ = −7, x₁ · x₂ = 12", "3) Ildizlari: x₁ = −3, x₂ = −4"]
      },
      brokenStepIndex: 1,
      errorCategory: "vieta_sign",
      whyBroken: tr(
        "По теореме Виета сумма корней приведённого уравнения x² + px + q = 0 равна противоположному коэффициенту −p, то есть x₁ + x₂ = 7, а не −7.",
        "Виет теоремасы бойынша түбірлердің қосындысы −p-ға тең, яғни x₁ + x₂ = 7 (−7 емес).",
        "Viyet teoremasiga ko‘ra ildizlar yig‘indisi −p ga teng, ya’ni x₁ + x₂ = 7 (−7 emas)."
      ),
      correctedStep: tr("2) По теореме Виета: x₁ + x₂ = 7, x₁ · x₂ = 12 ⇒ x₁ = 3, x₂ = 4", "2) Виет теоремасы: x₁ + x₂ = 7, x₁ · x₂ = 12 ⇒ x₁ = 3, x₂ = 4", "2) Viyet teoremasi: x₁ + x₂ = 7, x₁ · x₂ = 12 ⇒ x₁ = 3, x₂ = 4"),
      transferQuestion: {
        id: "math-err-vieta-transfer",
        subjectId: "math",
        topicId: "quadratic",
        lessonId: "math-lesson-quadratic",
        type: "single_choice",
        difficulty: "basic",
        maxPoints: 1,
        prompt: tr("Чему равна сумма корней уравнения x² − 9x + 20 = 0?", "x² − 9x + 20 = 0 теңдеуі түбірлерінің қосындысы неге тең?", "x² − 9x + 20 = 0 tenglama ildizlari yig‘indisi nimaga teng?"),
        options: {
          ru: ["9", "−9", "20", "−20"],
          kk: ["9", "−9", "20", "−20"],
          uz: ["9", "−9", "20", "−20"]
        },
        correctIndex: 0,
        explanation: tr("По теореме Виета x₁ + x₂ = −(−9) = 9.", "Виет теоремасы бойынша x₁ + x₂ = −(−9) = 9.", "Viyet teoremasiga ko‘ra x₁ + x₂ = −(−9) = 9."),
        hint: tr("Сумма корней равна второму коэффициенту с противоположным знаком.", "Түбірлер қосындысы қарама-қарсы таңбамен алынған екінші коэффициентке тең.", "Ildizlar yig‘indisi qarama-qarshi ishorali ikkinchi koeffitsiyentga teng."),
        errorCategory: "vieta_sign"
      }
    }
  ];

  const shortDesc = tr(
    "Пошаговые уроки по 16 темам, поиск ошибки в решении, карта зависимостей и экзаменационный тренажёр.",
    "16 тақырып бойынша қадамдық сабақтар, қатені табу, білім картасы және емтихан тренажері.",
    "16 mavzu bo‘yicha qadam-baqadam darslar, xatolarni tahlil qilish, bilimlar xaritasi va imtihon trenajyori."
  );

  return {
    id: "math",
    slug: "math",
    category: "stem",
    badge: "MATH",
    accentColor: "#2563eb",
    iconName: "Calculator",
    version: "3.0.0",
    updatedAt: "2026-10-10",
    readinessStatus: "full_course",
    readinessLabel: tr("Расширенный курс · 16 уроков + практика + Лаборатория ошибок", "Кеңейтілген курс · 16 сабақ + практика + Қателер зертханасы", "Kengaytirilgan kurs · 16 dars + amaliyot + Xatolar laboratoriyasi"),
    title: tr("Математика (Алгебра и Геометрия)", "Математика (Алгебра және Геометрия)", "Matematika (Algebra va Geometriya)"),
    subtitle: shortDesc,
    description: shortDesc,
    shortDescription: shortDesc,
    levels: {
      ru: ["7–9 класс (База)", "10–11 класс (Профиль и ЕНТ)", "Первые курсы вуза"],
      kk: ["7–9 сынып (База)", "10–11 сынып (Профиль және ҰБТ)", "ЖОО 1-курс негізі"],
      uz: ["7–9-sinf (Baza)", "10–11-sinf (Profil va imtihon)", "OTM 1-bosqich asosi"]
    },
    courses: [
      {
        id: "math-course-core",
        title: tr("Фундаментальная алгебра и функции", "Фундаменталды алгебра және функциялар", "Fundamental algebra va funksiyalar"),
        levelLabel: tr("Базовый + Средний", "Базалық + Орташа", "Bazaviy + O‘rta"),
        lessonsCount: 10
      },
      {
        id: "math-course-calculus-geo",
        title: tr("Математический анализ, планиметрия и стереометрия", "Математикалық анализ, планиметрия және стереометрия", "Matematik analiz, planimetriya va stereometriya"),
        levelLabel: tr("Продвинутый / ЕНТ", "Күрделі / ҰБТ", "Yuqori / Imtihon"),
        lessonsCount: 6
      }
    ],
    modules,
    topics,
    lessons: mathLessons,
    errorLabCases,
    diagnosticQuestionIds: mathLessons.flatMap((l) => l.questions.map((q) => q.id))
  };
}

interface NonMathBlueprint {
  id: Exclude<UntSubjectId, "math">;
  category: "mandatory" | "stem" | "natural_science" | "humanities" | "languages";
  iconName: string;
  levels: Record<Language, string[]>;
  lessonsData: {
    topicId: string;
    title: Record<Language, string>;
    sectionTitle: Record<Language, string>;
    difficulty: "basic" | "intermediate" | "advanced";
    prereqs: string[];
    goal: Record<Language, string>;
    simpleExplanation: Record<Language, string>;
    detailedExplanation: Record<Language, string>;
    workedExample: {
      problem: Record<Language, string>;
      steps: Record<Language, string[]>;
      takeaway: Record<Language, string>;
    };
    block: ContentBlock;
    summary: Record<Language, string>;
    questions: UniversalQuestion[];
  }[];
  errorLab: UniversalErrorLabCase;
}

const NON_MATH_BLUEPRINTS: NonMathBlueprint[] = [
  {
    id: "physics",
    category: "stem",
    iconName: "Atom",
    levels: {
      ru: ["7–9 класс (Механика и теплота)", "10–11 класс (Электродинамика, оптика, кванты)", "Вводный курс физики вуза"],
      kk: ["7–9 сынып (Механика және жылу)", "10–11 сынып (Электродинамика, оптика, квант)", "ЖОО физика кіріспесі"],
      uz: ["7–9-sinf (Mexanika va issiqlik)", "10–11-sinf (Elektrodinamika, optika, kvant)", "OTM fizika kirish kursi"]
    },
    lessonsData: [
      {
        topicId: "phys_kinematics",
        title: tr("Кинематика и законы Ньютона", "Кинематика және Ньютон заңдары", "Kinematika va Nyuton qonunlari"),
        sectionTitle: tr("Механика", "Механика", "Mexanika"),
        difficulty: "basic",
        prereqs: [],
        goal: tr("Научиться переводить единицы в СИ (м/с, м/с²) и применять второй закон Ньютона F = m·a.", "ХБЖ бірліктеріне (м/с, м/с²) көшіруді және Ньютонның екінші заңын F = m·a қолдануды үйрену.", "SI birliklariga (m/s, m/s²) o‘tkazish va Nyutonning ikkinchi qonuni F = m·a ni qo‘llash."),
        simpleExplanation: tr(
          "Ускорение тела прямо пропорционально равнодействующей всех сил и обратно пропорционально массе тела: a = F / m. Все расчёты ведутся в системе СИ (килограммы, метры, секунды).",
          "Дененің үдеуі теңәрекетті күшке тура пропорционал және массаға кері пропорционал: a = F / m. Барлық есептеулер ХБЖ-де (кг, м, с) жүргізіледі.",
          "Jism tezlanishi teng ta’sir etuvchi kuchga to‘g‘ri proporsional va massaga teskari proporsional: a = F / m. Hisoblashlar SI tizimida (kg, m, s) bajariladi."
        ),
        detailedExplanation: tr(
          "При равноускоренном движении координата и скорость связаны формулами v = v₀ + a·t и s = v₀·t + (a·t²)/2. Частая ошибка — подстановка скорости в км/ч без деления на 3,6 (например, 72 км/ч = 20 м/с).",
          "Теңүдемелі қозғалыста жылдамдық пен орын ауыстыру v = v₀ + a·t және s = v₀·t + (a·t²)/2 формулаларымен сипатталады. 72 км/сағ жылдамдықты 3,6-ға бөліп 20 м/с-қа айналдыру міндетті.",
          "Tekis tezlanuvchan harakatda tezlik va ko‘chish v = v₀ + a·t hamda s = v₀·t + (a·t²)/2 formulalari bilan ifodalanadi. 72 km/soat tezlikni 3,6 ga bo‘lib 20 m/s ga o‘tkazish shart."
        ),
        workedExample: {
          problem: tr("Автомобиль массой 1 500 кг разгоняется с места до 72 км/ч за 10 с. Найдите равнодействующую силу тяги.", "Массасы 1 500 кг автомобиль тыныштықтан 72 км/сағ жылдамдыққа 10 с ішінде жетеді. Теңәрекетті күшті табыңыз.", "Massasi 1 500 kg bo‘lgan avtomobil tinch holatdan 72 km/soat tezlikka 10 s da erishadi. Teng ta’sir etuvchi kuchni toping."),
          steps: {
            ru: ["1) Переведём скорость в СИ: v = 72 / 3,6 = 20 м/с", "2) Найдём ускорение: a = (v − v₀) / t = 20 / 10 = 2 м/с²", "3) По II закону Ньютона: F = m · a = 1500 · 2 = 3000 Н (3 кН)"],
            kk: ["1) Жылдамдықты ХБЖ-ге көшіреміз: v = 72 / 3,6 = 20 м/с", "2) Үдеуді табамыз: a = 20 / 10 = 2 м/с²", "3) Ньютонның II заңы: F = 1500 · 2 = 3000 Н (3 кН)"],
            uz: ["1) Tezlikni SI ga o‘tkazamiz: v = 72 / 3,6 = 20 m/s", "2) Tezlanishni topamiz: a = 20 / 10 = 2 m/s²", "3) Nyutonning II qonuni: F = 1500 · 2 = 3000 N (3 kN)"]
          },
          takeaway: tr("Всегда переводите км/ч в м/с делением на 3,6 перед подстановкой в формулы механики.", "Механика формулаларына қоймас бұрын км/сағ-ты 3,6-ға бөліп м/с-қа айналдырыңыз.", "Mexanika formulalariga qo‘yishdan oldin km/soat ni 3,6 ga bo‘lib m/s ga o‘tkazing.")
        },
        block: {
          type: "formula",
          title: tr("Базовые законы механики (СИ)", "Механиканың негізгі формулалары (ХБЖ)", "Mexanikaning asosiy formulalari (SI)"),
          body: tr("v = v₀ + a·t  |  s = v₀·t + a·t²/2  |  F_рез = m·a  |  1 м/с = 3,6 км/ч", "v = v₀ + a·t  |  s = v₀·t + a·t²/2  |  F = m·a  |  1 м/с = 3,6 км/сағ", "v = v₀ + a·t  |  s = v₀·t + a·t²/2  |  F = m·a  |  1 m/s = 3,6 km/soat")
        },
        summary: tr("Освоены перевод скорости в СИ, расчёт ускорения и второй закон Ньютона.", "Жылдамдықты ХБЖ-ге ауыстыру, үдеу және Ньютонның екінші заңы меңгерілді.", "Tezlikni SI ga o‘tkazish, tezlanish va Nyutonning ikkinchi qonuni o‘zlashtirildi."),
        questions: [
          {
            id: "phys-q1",
            subjectId: "physics",
            topicId: "phys_kinematics",
            lessonId: "physics-lesson-phys_kinematics",
            type: "numeric",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("Переведите скорость 54 км/ч в систему СИ (м/с). Введите только число.", "54 км/сағ жылдамдықты ХБЖ-ге (м/с) айналдырыңыз. Тек санды енгізіңіз.", "54 km/soat tezlikni SI tizimiga (m/s) o‘tkazing. Faqat sonni kiriting."),
            numericAnswer: 15,
            explanation: tr("54 / 3,6 = 15 м/с.", "54 / 3,6 = 15 м/с.", "54 / 3,6 = 15 m/s."),
            hint: tr("Разделите значение в км/ч на 3,6.", "км/сағ мәнін 3,6-ға бөліңіз.", "km/soat qiymatini 3,6 ga bo‘ling."),
            errorCategory: "unit_conversion"
          },
          {
            id: "phys-q2",
            subjectId: "physics",
            topicId: "phys_kinematics",
            lessonId: "physics-lesson-phys_kinematics",
            type: "single_choice",
            difficulty: "intermediate",
            maxPoints: 1,
            prompt: tr("Под действием равнодействующей силы 120 Н тело движется с ускорением 3 м/с². Какова масса тела?", "120 Н теңәрекетті күш әсерінен дене 3 м/с² үдеумен қозғалады. Дененің массасы қандай?", "120 N kuch ta’sirida jism 3 m/s² tezlanish oladi. Jism massasi qanday?"),
            options: {
              ru: ["40 кг", "360 кг", "0,025 кг", "123 кг"],
              kk: ["40 кг", "360 кг", "0,025 кг", "123 кг"],
              uz: ["40 kg", "360 kg", "0,025 kg", "123 kg"]
            },
            correctIndex: 0,
            explanation: tr("По второму закону Ньютона m = F / a = 120 / 3 = 40 кг.", "Ньютонның екінші заңы бойынша m = F / a = 120 / 3 = 40 кг.", "Nyutonning ikkinchi qonuniga ko‘ra m = F / a = 120 / 3 = 40 kg."),
            hint: tr("Выразите массу из формулы F = m · a.", "F = m · a формуласынан массаны өрнектеңіз.", "F = m · a formulasidan massani toping."),
            errorCategory: "newton_second_law"
          },
          {
            id: "phys-q3",
            subjectId: "physics",
            topicId: "phys_kinematics",
            lessonId: "physics-lesson-phys_kinematics",
            type: "true_false",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("Верно ли утверждение: если равнодействующая всех приложенных к телу сил равна нулю, тело движется с постоянным ненулевым ускорением?", "Тұжырым дұрыс па: егер денеге әсер ететін барлық күштердің теңәрекеттісі нөлге тең болса, дене тұрақты нөлдік емес үдеумен қозғалады?", "Tasdiq to‘g‘rimi: agar jismga qo‘yilgan barcha kuchlarning teng ta’sir etuvchisi nolga teng bo‘lsa, jism o‘zgarmas nolmas tezlanish bilan harakatlanadi?"),
            booleanAnswer: false,
            explanation: tr("Неверно (False): по I закону Ньютона при F_рез = 0 ускорение равно нулю (a = 0), а скорость тела постоянна.", "Қате (False): Ньютонның I заңы бойынша F = 0 болғанда үдеу нөлге тең (a = 0).", "Noto‘g‘ri (False): Nyutonning I qonuniga ko‘ra F = 0 bo‘lganda tezlanish nolga teng (a = 0)."),
            hint: tr("Вспомните первый закон Ньютона и связь F = m · a.", "Ньютонның бірінші заңын еске түсіріңіз.", "Nyutonning birinchi qonunini eslang."),
            errorCategory: "newton_first_law"
          }
        ]
      },
      {
        topicId: "phys_energy_mkt",
        title: tr("Законы сохранения и молекулярная физика (МКТ)", "Сақталу заңдары және молекулалық физика (МКТ)", "Saqlanish qonunlari va molekulyar fizika (MKT)"),
        sectionTitle: tr("Механика и Термодинамика", "Механика және Термодинамика", "Mexanika va Termodinamika"),
        difficulty: "intermediate",
        prereqs: ["phys_kinematics"],
        goal: tr("Рассчитывать кинетическую и потенциальную энергию, переводить температуру в Кельвины и применять уравнение Менделеева–Клапейрона.", "Кинетикалық және потенциалдық энергияны есептеу, температураны Кельвинге көшіру және Менделеев–Клапейрон теңдеуін қолдану.", "Kinetik va potensial energiyani hisoblash, haroratni Kelvinga o‘tkazish va Mendeleyev–Klapeyron tenglamasini qo‘llash."),
        simpleExplanation: tr(
          "Кинетическая энергия E_k = m·v²/2 зависит от квадрата скорости. В термодинамике абсолютная температура T (в Кельвинах) связана со шкалой Цельсия формулой T = t(°C) + 273.",
          "Кинетикалық энергия E_k = m·v²/2 жылдамдықтың квадратына тәуелді. Абсолюттік температура: T = t(°C) + 273.",
          "Kinetik energiya E_k = m·v²/2 tezlik kvadratiga bog‘liq. Absolyut harorat: T = t(°C) + 273."
        ),
        detailedExplanation: tr(
          "При увеличении скорости тела в 2 раза его кинетическая энергия возрастает в 4 раза. В газовых законах (P·V = ν·R·T) нельзя подставлять температуру в градусах Цельсия — только в Кельвинах.",
          "Дененің жылдамдығы 2 есе артса, кинетикалық энергиясы 4 есе артады. Газ заңдарына температура тек Кельвинмен қойылады.",
          "Jism tezligi 2 marta ortsa, kinetik energiyasi 4 marta ortadi. Gaz qonunlarida harorat faqat Kelvinda olinadi."
        ),
        workedExample: {
          problem: tr("Найдите кинетическую энергию тела массой 4 кг, движущегося со скоростью 5 м/с.", "Массасы 4 кг, жылдамдығы 5 м/с дененің кинетикалық энергиясын табыңыз.", "Massasi 4 kg, tezligi 5 m/s bo‘lgan jismning kinetik energiyasini toping."),
          steps: {
            ru: ["1) Запишем формулу: E_k = (m · v²) / 2", "2) Возведём скорость в квадрат: v² = 5² = 25 м²/с²", "3) Вычислим: E_k = (4 · 25) / 2 = 50 Дж"],
            kk: ["1) Формула: E_k = (m · v²) / 2", "2) Жылдамдық квадраты: 5² = 25", "3) E_k = (4 · 25) / 2 = 50 Дж"],
            uz: ["1) Formula: E_k = (m · v²) / 2", "2) Tezlik kvadrati: 5² = 25", "3) E_k = (4 · 25) / 2 = 50 J"]
          },
          takeaway: tr("Не забывайте делить произведение m·v² на 2.", "m·v² көбейтіндісін 2-ге бөлуді ұмытпаңыз.", "m·v² ko‘paytmasini 2 ga bo‘lishni unutmang.")
        },
        block: {
          type: "formula",
          title: tr("Энергия и газовые законы", "Энергия және газ заңдары", "Energiya va gaz qonunlari"),
          body: tr("E_k = m·v² / 2  |  E_p = m·g·h  |  T(K) = t(°C) + 273  |  P·V = ν·R·T", "E_k = m·v² / 2  |  E_p = m·g·h  |  T(K) = t(°C) + 273  |  P·V = ν·R·T", "E_k = m·v² / 2  |  E_p = m·g·h  |  T(K) = t(°C) + 273  |  P·V = ν·R·T")
        },
        summary: tr("Изучены формулы механической энергии и перевод температуры в шкалу Кельвина.", "Механикалық энергия және Кельвин шкаласы меңгерілді.", "Mexanik energiya va Kelvin shkalasi o‘zlashtirildi."),
        questions: [
          {
            id: "phys-q4",
            subjectId: "physics",
            topicId: "phys_energy_mkt",
            lessonId: "physics-lesson-phys_energy_mkt",
            type: "numeric",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("Переведите температуру 27 °C в абсолютную шкалу Кельвина (К). Введите число.", "27 °C температураны Кельвин (К) шкаласына көшіріңіз.", "27 °C haroratni Kelvin (K) shkalasiga o‘tkazing."),
            numericAnswer: 300,
            explanation: tr("T = 27 + 273 = 300 К.", "T = 27 + 273 = 300 К.", "T = 27 + 273 = 300 K."),
            hint: tr("Прибавьте 273 к температуре в градусах Цельсия.", "Цельсий мәніне 273 қосыңыз.", "Selsiy qiymatiga 273 ни qo‘shing."),
            errorCategory: "kelvin_conversion"
          },
          {
            id: "phys-q5",
            subjectId: "physics",
            topicId: "phys_energy_mkt",
            lessonId: "physics-lesson-phys_energy_mkt",
            type: "numeric",
            difficulty: "intermediate",
            maxPoints: 1,
            prompt: tr("Тело массой 2 кг движется со скоростью 6 м/с. Чему равна его кинетическая энергия (в Дж)?", "Массасы 2 кг дене 6 м/с жылдамдықпен қозғалады. Кинетикалық энергиясы неше Дж?", "Massasi 2 kg jism 6 m/s tezlik bilan harakatlanmoqda. Kinetik energiyasi necha J?"),
            numericAnswer: 36,
            explanation: tr("E_k = (2 · 6²) / 2 = 36 Дж.", "E_k = (2 · 6²) / 2 = 36 Дж.", "E_k = (2 · 6²) / 2 = 36 J."),
            hint: tr("Используйте формулу E_k = m · v² / 2.", "E_k = m · v² / 2 формуласын қолданыңыз.", "E_k = m · v² / 2 formulasini qo‘llang."),
            errorCategory: "kinetic_energy"
          }
        ]
      },
      {
        topicId: "phys_electrodynamics",
        title: tr("Электродинамика: закон Ома и мощность тока", "Электродинамика: Ом заңы және ток қуаты", "Elektrodinamika: Om qonuni va tok quvvati"),
        sectionTitle: tr("Электродинамика", "Электродинамика", "Elektrodinamika"),
        difficulty: "advanced",
        prereqs: ["phys_energy_mkt"],
        goal: tr("Применять закон Ома для участка цепи I = U / R, рассчитывать последовательное и параллельное соединение проводников.", "Тізбек бөлігі үшін Ом заңын (I = U / R) және өткізгіштерді жалғауды есептеу.", "Zanjir qismi uchun Om qonuni (I = U / R) va o‘tkazgichlarni ulashni hisoblash."),
        simpleExplanation: tr(
          "Сила тока на участке цепи прямо пропорциональна напряжению и обратно пропорциональна сопротивлению: I = U / R. При последовательном соединении сопротивления складываются (R = R₁ + R₂).",
          "Тізбек бөлігіндегі ток күші кернеуге тура, кедергіге кері пропорционал: I = U / R. Тізбектей жалғауда R = R₁ + R₂.",
          "Zanjir qismidagi tok kuchi kuchlanishga to‘g‘ri, qarshilikka teskari proporsional: I = U / R. Ketma-ket ulashda R = R₁ + R₂."
        ),
        detailedExplanation: tr(
          "При параллельном соединении складываются обратные величины: 1/R = 1/R₁ + 1/R₂. Мощность электрического тока вычисляется по формулам P = U·I = I²·R = U²/R.",
          "Параллель жалғауда 1/R = 1/R₁ + 1/R₂. Ток қуаты: P = U·I = I²·R = U²/R.",
          "Parallel ulashda 1/R = 1/R₁ + 1/R₂. Tok quvvati: P = U·I = I²·R = U²/R."
        ),
        workedExample: {
          problem: tr("Два резистора по 6 Ом соединены параллельно и подключены к источнику 12 В. Найдите общую силу тока в цепи.", "Әрқайсысы 6 Ом болатын екі резистор параллель жалғанып, 12 В көзге қосылған. Жалпы ток күшін табыңыз.", "Har biri 6 Om bo‘lgan ikkita rezistor parallel ulanib, 12 V manbaga ulangan. Umumiy tok kuchini toping."),
          steps: {
            ru: ["1) Найдём общее сопротивление параллельного участка: R_общ = (6 · 6) / (6 + 6) = 3 Ом", "2) По закону Ома: I = U / R_общ = 12 / 3 = 4 А"],
            kk: ["1) Параллель бөліктің жалпы кедергісі: R = (6 · 6) / (6 + 6) = 3 Ом", "2) Ом заңы бойынша: I = 12 / 3 = 4 А"],
            uz: ["1) Parallel qismning umumiy qarshiligi: R = (6 · 6) / (6 + 6) = 3 Om", "2) Om qonuniga ko‘ra: I = 12 / 3 = 4 A"]
          },
          takeaway: tr("Для двух одинаковых параллельных резисторов R_общ = R / 2.", "Екі бірдей параллель резистор үшін R_жалпы = R / 2.", "Ikkita bir xil parallel rezistor uchun R_umumiy = R / 2.")
        },
        block: {
          type: "formula",
          title: tr("Закон Ома и соединения резисторов", "Ом заңы және резисторларды жалғау", "Om qonuni va rezistorlarni ulash"),
          body: tr("I = U / R  |  R_посл = R₁ + R₂  |  1/R_пар = 1/R₁ + 1/R₂  |  P = U · I", "I = U / R  |  R_тізб = R₁ + R₂  |  1/R_пар = 1/R₁ + 1/R₂  |  P = U · I", "I = U / R  |  R_ket = R₁ + R₂  |  1/R_par = 1/R₁ + 1/R₂  |  P = U · I")
        },
        summary: tr("Закреплены закон Ома, расчёт эквивалентного сопротивления и мощности тока.", "Ом заңы, балама кедергі және ток қуаты бекітілді.", "Om qonuni, ekvivalent qarshilik va tok quvvati mustahkamlandi."),
        questions: [
          {
            id: "phys-q6",
            subjectId: "physics",
            topicId: "phys_electrodynamics",
            lessonId: "physics-lesson-phys_electrodynamics",
            type: "single_choice",
            difficulty: "intermediate",
            maxPoints: 1,
            prompt: tr("При напряжении 24 В сила тока в резисторе равна 3 А. Чему равно сопротивление резистора?", "Кернеуі 24 В болғанда резистордағы ток күші 3 А. Кедергісі нешеге тең?", "Kuchlanish 24 V bo‘lganda rezistordagi tok kuchi 3 A. Qarshilik nechaga teng?"),
            options: {
              ru: ["8 Ом", "72 Ом", "21 Ом", "0,125 Ом"],
              kk: ["8 Ом", "72 Ом", "21 Ом", "0,125 Ом"],
              uz: ["8 Om", "72 Om", "21 Om", "0,125 Om"]
            },
            correctIndex: 0,
            explanation: tr("R = U / I = 24 / 3 = 8 Ом.", "R = U / I = 24 / 3 = 8 Ом.", "R = U / I = 24 / 3 = 8 Om."),
            hint: tr("Разделите напряжение U на силу тока I.", "U кернеуін I ток күшіне бөліңіз.", "U kuchlanishni I tok kuchiga bo‘ling."),
            errorCategory: "ohms_law"
          }
        ]
      }
    ],
    errorLab: {
      id: "phys-err-units",
      subjectId: "physics",
      topicId: "phys_kinematics",
      title: tr("Потеря перевода км/ч в м/с при расчёте пути", "Жолды есептеуде км/сағ-ты м/с-қа көшірмеу", "Yo‘lni hisoblashda km/soat ni m/s ga o‘tkazmaslik"),
      taskPrompt: tr("Поезд движется равномерно со скоростью 72 км/ч. Какой путь (в метрах) он пройдёт за 15 секунд?", "Пойыз 72 км/сағ жылдамдықпен бірқалыпты қозғалады. Ол 15 секундта неше метр жол жүреді?", "Poyezd 72 km/soat tezlik bilan tekis harakatlanmoqda. U 15 soniyada necha metr yo‘l bosadi?"),
      steps: {
        ru: ["1) Запишем формулу пути: s = v · t", "2) Подставим числа без перевода единиц: s = 72 · 15 = 1080 м", "3) Ответ: 1080 м"],
        kk: ["1) Жол формуласы: s = v · t", "2) Бірлікті ауыстырмай қоямыз: s = 72 · 15 = 1080 м", "3) Жауабы: 1080 м"],
        uz: ["1) Yo‘l formulasi: s = v · t", "2) Birlikni o‘zgartirmay qo‘yamiz: s = 72 · 15 = 1080 m", "3) Javob: 1080 m"]
      },
      brokenStepIndex: 1,
      errorCategory: "unit_conversion",
      whyBroken: tr(
        "Скорость дана в км/ч, а время — в секундах. Сначала нужно перевести 72 км/ч = 72 / 3,6 = 20 м/с, и только затем умножать на 15 с.",
        "Жылдамдық км/сағ-пен, ал уақыт секундпен берілген. Алдымен 72 / 3,6 = 20 м/с тауып, содан соң 15 с-қа көбейту керек.",
        "Tezlik km/soat da, vaqt esa soniyada berilgan. Avval 72 / 3,6 = 20 m/s topilib, so‘ng 15 s ga ko‘paytiriladi."
      ),
      correctedStep: tr("2) v = 72 / 3,6 = 20 м/с ⇒ s = 20 · 15 = 300 м", "2) v = 72 / 3,6 = 20 м/с ⇒ s = 20 · 15 = 300 м", "2) v = 72 / 3,6 = 20 m/s ⇒ s = 20 · 15 = 300 m"),
      transferQuestion: {
        id: "phys-err-transfer",
        subjectId: "physics",
        topicId: "phys_kinematics",
        lessonId: "physics-lesson-phys_kinematics",
        type: "numeric",
        difficulty: "basic",
        maxPoints: 1,
        prompt: tr("Автомобиль едет со скоростью 36 км/ч. Какой путь в метрах он проедет за 25 секунд?", "Автомобиль 36 км/сағ жылдамдықпен жүреді. 25 секундта неше метр жол жүреді?", "Avtomobil 36 km/soat tezlikda yurmoqda. 25 soniyada necha metr yo‘l bosadi?"),
        numericAnswer: 250,
        explanation: tr("36 км/ч = 10 м/с. За 25 с путь равен 10 · 25 = 250 м.", "36 км/сағ = 10 м/с. 25 с ішінде 10 · 25 = 250 м.", "36 km/soat = 10 m/s. 25 s da 10 · 25 = 250 m."),
        hint: tr("Переведите 36 км/ч в м/с (разделив на 3,6) и умножьте на 25.", "36 км/сағ-ты 3,6-ға бөліп, 25-ке көбейтіңіз.", "36 km/soat ni 3,6 ga bo‘lib, 25 ga ko‘paytiring."),
        errorCategory: "unit_conversion"
      }
    }
  },
  {
    id: "history_kz",
    category: "mandatory",
    iconName: "Landmark",
    levels: {
      ru: ["5–9 класс (Древность и Казахское ханство)", "10–11 класс (Новое время, Алаш, Независимость)", "Обязательный блок ЕНТ"],
      kk: ["5–9 сынып (Ежелгі дәуір және Қазақ хандығы)", "10–11 сынып (Жаңа заман, Алаш, Тәуелсіздік)", "ҰБТ міндетті пәні"],
      uz: ["5–9-sinf (Qadimgi davr va Qozoq xonligi)", "10–11-sinf (Yangi davr, Alash, Mustaqillik)", "UBT majburiy fani"]
    },
    lessonsData: [
      {
        topicId: "hkz_ancient_saka",
        title: tr("Древний Казахстан: эпоха бронзы, саки и гунны", "Ежелгі Қазақстан: қола дәуірі, сақтар мен ғұндар", "Qadimgi Qozog‘iston: bronza davri, saklar va xunnlar"),
        sectionTitle: tr("Древний мир", "Ежелгі дәуір", "Qadimgi davr"),
        difficulty: "basic",
        prereqs: [],
        goal: tr("Различать расселение племён саков (тиграхауда, парадарайя, хаомаварга), памятники звериного стиля и роль гуннов.", "Сақ тайпаларының (тиграхауда, парадарайя, хаомаварга) қоныстануын және «аң стилі» ескерткіштерін ажырату.", "Sak qabilalari joylashuvi va «hayvon услуби» yodgorliklarini farqlash."),
        simpleExplanation: tr(
          "В I тысячелетии до н.э. территорию Казахстана населяли саки. Персидские источники называли их «могучими мужами», а греческие — «азиатскими скифами». В Иссыкском кургане (Жетысу) был найден знаменитый «Золотой человек».",
          "Б.з.б. I мыңжылдықта Қазақстан аумағын сақтар мекендеді. Есік обасынан (Жетісу) әйгілі «Алтын адам» табылды.",
          "Miloddan avvalgi I mingyillikda Qozog‘iston hududida saklar yashagan. Issiq qo‘rg‘onidan (Jetisuv) «Oltin odam» topilgan."
        ),
        detailedExplanation: tr(
          "Саки-тиграхауда (носящие остроконечные шапки) жили в Семиречье и предгорьях Тянь-Шаня; саки-парадарайя (заморские) — в Приаралье и низовьях Сырдарьи; саки-хаомаварга — в долине Мургаба.",
          "Сақ-тиграхаудалар Жетісу мен Тянь-Шань баурайында, сақ-парадарайялар Арал маңы мен Сырдарияның төменгі ағысында қоныстанды.",
          "Sak-tigraxauda Jetisuvda, sak-paradarayya esa Orolbo‘yi va Sirdaryo quyi oqimida joylashgan."
        ),
        workedExample: {
          problem: tr("Соотнесите группу сакских племён «саки-тиграхауда» с регионом их расселения.", "«Сақ-тиграхауда» тайпаларын олардың қоныстанған аймағымен сәйкестендіріңіз.", "«Sak-tigraxauda» qabilalarini ular joylashgan hudud bilan moslashtiring."),
          steps: {
            ru: ["1) Вспомним значение: тиграхауда — «носящие остроконечные шапки»", "2) Главный археологический памятник — курган Иссык", "3) Регион: Семиречье (Жетысу) и предгорья Тянь-Шаня"],
            kk: ["1) Тиграхауда — «шошақ бөріктілер»", "2) Негізгі ескерткіші — Есік обасы", "3) Аймағы: Жетісу және Тянь-Шань баурайы"],
            uz: ["1) Tigraxauda — «cho‘qqi qalpoqlilar»", "2) Asosiy yodgorlik — Issiq qo‘rg‘oni", "3) Hudud: Jetisuv va Tyan-Shan etaklari"]
          },
          takeaway: tr("Иссыкский «Золотой человек» относится к культуре саков-тиграхауда в Жетысу.", "Есік «Алтын адамы» Жетісудағы сақ-тиграхауда мәдениетіне жатады.", "Issiq «Oltin odami» Jetisuvdagi sak-tigraxauda madaniyatiga mansub.")
        },
        block: {
          type: "source_doc",
          title: tr("Историческая справка: Геродот и Бехистунская надпись", "Тарихи дерек: Геродот және Бехистун жазбасы", "Tarixiy manba: Gerodot va Behistun yozuvi"),
          body: tr("В древнеперсидских клинописных текстах Дария I саки делятся на три союза племён: тиграхауда, парадарайя и хаомаварга.", "І Дарийдің Бехистун жазбасында сақтар тиграхауда, парадарайя және хаомаварга болып бөлінеді.", "Doro I ning Behistun yozuvida saklar tigraxauda, paradarayya va xaomavarga guruhlariga ajratiladi.")
        },
        summary: tr("Закреплены расселение сакских племён и археологические памятники раннего железного века.", "Сақ тайпаларының қоныстануы мен ерте темір дәуірі ескерткіштері бекітілді.", "Sak qabilalari joylashuvi va ilk temir davri yodgorliklari mustahkamlandi."),
        questions: [
          {
            id: "hkz-q1",
            subjectId: "history_kz",
            topicId: "hkz_ancient_saka",
            lessonId: "history_kz-lesson-hkz_ancient_saka",
            type: "single_choice",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("В каком регионе Казахстана расселялись саки-тиграхауда, оставившие курган Иссык?", "Есік обасын қалдырған сақ-тиграхаудалар Қазақстанның қай аймағында қоныстанды?", "Issiq qo‘rg‘onini qoldirgan sak-tigraxauda Qozog‘istonning qaysi hududida joylashgan?"),
            options: {
              ru: ["Жетысу (Семиречье) и предгорья Тянь-Шаня", "Приаралье и низовья Сырдарьи", "Восточный Казахстан (Шиликты)", "Центральный Казахстан (Сарыарка)"],
              kk: ["Жетісу және Тянь-Шань баурайы", "Арал маңы және Сырдарияның төменгі ағысы", "Шығыс Қазақстан (Шілікті)", "Орталық Қазақстан (Сарыарқа)"],
              uz: ["Jetisuv va Tyan-Shan etaklari", "Orolbo‘yi va Sirdaryo quyi oqimi", "Sharqiy Qozog‘iston", "Markaziy Qozog‘iston"]
            },
            correctIndex: 0,
            explanation: tr("Саки-тиграхауда проживали в Семиречье (Жетысу), где расположен курган Иссык.", "Сақ-тиграхаудалар Жетісу өңірінде мекендеген.", "Sak-tigraxauda Jetisuv hududida yashagan."),
            hint: tr("Вспомните, рядом с каким городом находится курган Иссык.", "Есік обасы қай өңірде орналасқанын еске түсіріңіз.", "Issiq qo‘rg‘oni qaysi hududda joylashganini eslang."),
            errorCategory: "historical_geography"
          }
        ]
      },
      {
        topicId: "hkz_khanate",
        title: tr("Образование и расцвет Казахского ханства (XV–XVII вв.)", "Қазақ хандығының құрылуы мен нығаюы (XV–XVII ғғ.)", "Qozoq xonligining tashkil topishi va yuksalishi (XV–XVII asrlar)"),
        sectionTitle: tr("Казахское ханство", "Қазақ хандығы", "Qozoq xonligi"),
        difficulty: "intermediate",
        prereqs: ["hkz_ancient_saka"],
        goal: tr("Знать хронологию образования Казахского ханства (1465 г., Керей и Жанибек) и своды законов Касым-хана, Есим-хана и Тауке-хана («Жеті жарғы»).", "Қазақ хандығының құрылу хронологиясын (1465 ж.) және Қасым, Есім, Тәуке хандардың заңдарын білу.", "Qozoq xonligi tashkil topishi (1465-y.) va Qosim, Yesim, Tauke xonlar qonunlarini bilish."),
        simpleExplanation: tr(
          "В 1465 году султаны Керей и Жанибек основали Казахское ханство в Западном Жетысу (урочище Козыбасы). При Касым-хане численность населения достигла 1 млн человек, а при Тауке-хане был принят свод законов «Жеті жарғы».",
          "1465 жылы Керей мен Жәнібек сұлтандар Батыс Жетісуда (Қозыбасы) Қазақ хандығының негізін қалады. Тәуке хан тұсында «Жеті жарғы» қабылданды.",
          "1465-yilda Kerey va Janibek sultonlar G‘arbiy Jetisuvda (Qo‘ziboshi) Qozoq xonligiga asos soldilar. Tauke xon davrida «Jeti jarg‘i» qabul qilindi."
        ),
        detailedExplanation: tr(
          "Важно не путать три правовых свода: «Қасым ханның қасқа жолы» (Касым-хан, начало XVI в.), «Есім ханның ескі жолы» (Есим-хан, XVII в.) и «Жеті жарғы» (Тауке-хан, конец XVII — начало XVIII в.).",
          "Үш заңдар жинағын шатастырмау керек: «Қасым ханның қасқа жолы», «Есім ханның ескі жолы» және Тәуке ханның «Жеті жарғысы».",
          "Uchta huquqiy to‘plamni farqlash muhim: Qosim xon, Yesim xon va Tauke xonning «Jeti jarg‘i» qonunlari."
        ),
        workedExample: {
          problem: tr("Расположите правителей Казахского ханства в хронологическом порядке их правления.", "Қазақ хандарын билік құрған хронологиялық ретімен орналастырыңыз.", "Qozoq xonlarini hukmronlik qilgan xronologik tartibda joylashtiring."),
          steps: {
            ru: ["1) Керей и Жанибек (основание ханства, 1465 г.)", "2) Касым-хан (расцвет в начале XVI в., 1511–1521 гг.)", "3) Тауке-хан («Золотой век» и «Жеті жарғы», 1680–1715 гг.)"],
            kk: ["1) Керей мен Жәнібек (1465 ж.)", "2) Қасым хан (1511–1521 жж.)", "3) Тәуке хан (1680–1715 жж.)"],
            uz: ["1) Kerey va Janibek (1465-y.)", "2) Qosim xon (1511–1521-y.)", "3) Tauke xon (1680–1715-y.)"]
          },
          takeaway: tr("Хронологическая цепочка: Керей → Касым → Хакназар → Тауекель → Есим → Жангир → Тауке.", "Хронологиялық тізбек: Керей → Қасым → Хақназар → Тәуекел → Есім → Жәңгір → Тәуке.", "Xronologik zanjir: Kerey → Qosim → Haqnazar → Tauekel → Yesim → Jangir → Tauke.")
        },
        block: {
          type: "source_doc",
          title: tr("«Тарих-и Рашиди» Мухаммеда Хайдара Дулати", "Мұхаммед Хайдар Дулатидің «Тарих-и Рашиди» еңбегі", "Muhammad Haydar Dulatiyning «Tarixi Rashidiy» asari"),
          body: tr("Согласно «Тарих-и Рашиди», образование Казахского ханства в долине Чу и Козыбасы датируется 870 годом хиджры (1465–1466 гг.).", "«Тарих-и Рашиди» дерегі бойынша Қазақ хандығы 870 хиджра жылында (1465–1466 жж.) Шу мен Қозыбасыда құрылды.", "«Tarixi Rashidiy» ma’lumotiga ko‘ra Qozoq xonligi 1465–1466-yillarda tashkil topgan.")
        },
        summary: tr("Изучены ключевые даты и своды законов Казахского ханства.", "Қазақ хандығының негізгі даталары мен заңдар жинағы меңгерілді.", "Qozoq xonligining asosiy sanalari va qonunlari o‘zlashtirildi."),
        questions: [
          {
            id: "hkz-q2",
            subjectId: "history_kz",
            topicId: "hkz_khanate",
            lessonId: "history_kz-lesson-hkz_khanate",
            type: "sequence",
            difficulty: "intermediate",
            maxPoints: 2,
            prompt: tr("Установите хронологическую последовательность событий (от самого раннего к более позднему):", "Оқиғаларды хронологиялық ретімен (ең ертесінен кейінгісіне қарай) орналастырыңыз:", "Voqealarni xronologik ketma-ketlikda joylashtiring:"),
            sequenceItems: {
              ru: [
                "Основание Казахского ханства Кереем и Жанибеком (1465 г.)",
                "Правление Касым-хана и принятие «Қасым ханның қасқа жолы»",
                "Орбулакская битва при Жангир-хане (1643 г.)",
                "Принятие свода законов «Жеті жарғы» при Тауке-хане"
              ],
              kk: [
                "Керей мен Жәнібектің Қазақ хандығын құруы (1465 ж.)",
                "Қасым ханның билігі және «Қасым ханның қасқа жолы»",
                "Жәңгір хан тұсындағы Орбұлақ шайқасы (1643 ж.)",
                "Тәуке хан тұсында «Жеті жарғы» заңдар жинағының қабылдануы"
              ],
              uz: [
                "Kerey va Janibek tomonidan Qozoq xonligining tashkil etilishi (1465-y.)",
                "Qosim xon hukmronligi",
                "Orbulak jangi (1643-y.)",
                "Tauke xon davrida «Jeti jarg‘i» qonunlarining qabul qilinishi"
              ]
            },
            correctSequence: [0, 1, 2, 3],
            explanation: tr("1465 г. (Керей и Жанибек) → 1511–1521 гг. (Касым-хан) → 1643 г. (Орбулакская битва) → конец XVII в. («Жеті жарғы»).", "1465 ж. → 1511–1521 жж. → 1643 ж. → XVII ғ. соңы.", "1465-y. → 1511–1521-y. → 1643-y. → XVII asr oxiri."),
            hint: tr("Сравните века: середина XV в. → начало XVI в. → середина XVII в. → конец XVII в.", "Ғасырларды салыстырыңыз: XV ғ. ортасы → XVI ғ. басы → XVII ғ.", "Asrlarni solishtiring: XV asr → XVI asr → XVII asr."),
            errorCategory: "chronology_order"
          }
        ]
      },
      {
        topicId: "hkz_alash_independence",
        title: tr("Движение «Алаш» и Независимый Казахстан", "«Алаш» қозғалысы және Тәуелсіз Қазақстан", "«Alash» harakati va Mustaqil Qozog‘iston"),
        sectionTitle: tr("Новейшая история", "Қазіргі заман тарихы", "Eng yangi tarix"),
        difficulty: "advanced",
        prereqs: ["hkz_khanate"],
        goal: tr("Знать лидеров партии «Алаш» (А. Букейханов, А. Байтурсынов, М. Дулатов) и ключевые даты суверенитета РК (1990, 1991, 1992, 1993, 1995 гг.).", "«Алаш» қозғалысының қайраткерлері мен Тәуелсіз Қазақстанның негізгі даталарын білу.", "«Alash» harakati yetakchilari va Mustaqil Qozog‘istonning asosiy sanalarini bilish."),
        simpleExplanation: tr(
          "В 1917 году была создана партия «Алаш» и автономия Алаш-Орда во главе с Алиханом Букейхановым. 16 декабря 1991 года принят Конституционный закон «О государственной независимости Республики Казахстан».",
          "1917 жылы Әлихан Бөкейханов бастаған «Алаш» партиясы мен Алашорда үкіметі құрылды. 1991 жылы 16 желтоқсанда ҚР Мемлекеттік тәуелсіздігі жарияланды.",
          "1917-yilda Alixon Bukeyxanov boshchiligida «Alash» partiyasi tuzildi. 1991-yil 16-dekabrda Qozog‘iston davlat mustaqilligi e’lon qilindi."
        ),
        detailedExplanation: tr(
          "Официальный печатный орган движения Алаш — газета «Қазақ» (Оренбург, с 1913 г., редактор Ахмет Байтурсынов). В марте 1992 г. Казахстан вступил в ООН, 15 ноября 1993 г. введена национальная валюта тенге, 30 августа 1995 г. принята действующая Конституция РК.",
          "«Қазақ» газеті 1913 жылдан бастап Орынборда шықты (редакторы А. Байтұрсынұлы). 1992 ж. наурызда ҚР БҰҰ-ға мүше болды, 1993 ж. 15 қарашада теңге енгізілді.",
          "«Qazaq» gazetasi 1913-yildan Orenburgda nashr etilgan. 1992-yilda Qozog‘iston BMTga a’zo bo‘ldi, 1993-yil 15-noyabrda tenge muomalaga kiritildi."
        ),
        workedExample: {
          problem: tr("В каком году Казахстан вступил в ООН, а в каком году была введена национальная валюта — тенге?", "Қазақстан қай жылы БҰҰ-ға мүше болды және ұлттық валюта — теңге қай жылы енгізілді?", "Qozog‘iston qaysi yili BMTga a’zo bo‘ldi va milliy valyuta — tenge qachon kiritildi?"),
          steps: {
            ru: ["1) Вступление РК в ООН: 2 марта 1992 года", "2) Введение национальной валюты тенге: 15 ноября 1993 года"],
            kk: ["1) БҰҰ-ға кіруі: 1992 жылғы 2 наурыз", "2) Ұлттық валюта теңгенің енгізілуі: 1993 жылғы 15 қараша"],
            uz: ["1) BMTga a’zo bo‘lishi: 1992-yil 2-mart", "2) Milliy valyuta tengening kiritilishi: 1993-yil 15-noyabr"]
          },
          takeaway: tr("1991 — Независимость, 1992 — ООН и госсимволы, 1993 — Тенге, 1995 — Конституция.", "1991 — Тәуелсіздік, 1992 — БҰҰ, 1993 — Теңге, 1995 — Конституция.", "1991 — Mustaqillik, 1992 — BMT, 1993 — Tenge, 1995 — Konstitutsiya.")
        },
        block: {
          type: "table",
          title: tr("Ключевые даты Независимого Казахстана", "Тәуелсіз Қазақстанның негізгі даталары", "Mustaqil Qozog‘istonning asosiy sanalari"),
          body: tr("25.10.1990 — Декларация о суверенитете | 16.12.1991 — Закон о Независимости | 02.03.1992 — ООН | 15.11.1993 — Тенге | 30.08.1995 — Конституция РК", "25.10.1990 — Егемендік декларациясы | 16.12.1991 — Тәуелсіздік заңы | 02.03.1992 — БҰҰ | 15.11.1993 — Теңге | 30.08.1995 — ҚР Конституциясы", "25.10.1990 — Suverenitet deklaratsiyasi | 16.12.1991 — Mustaqillik qonuni | 02.03.1992 — BMT | 15.11.1993 — Tenge | 30.08.1995 — Konstitutsiya")
        },
        summary: tr("Систематизированы даты движения «Алаш» и становления независимого Казахстана.", "«Алаш» қозғалысы мен Тәуелсіз Қазақстан хронологиясы жүйеленді.", "«Alash» harakati va Mustaqil Qozog‘iston xronologiyasi tizimlashtirildi."),
        questions: [
          {
            id: "hkz-q3",
            subjectId: "history_kz",
            topicId: "hkz_alash_independence",
            lessonId: "history_kz-lesson-hkz_alash_independence",
            type: "single_choice",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("Кто возглавил правительство Алаш-Орды, образованное в декабре 1917 года на Втором Всеказахском съезде в Оренбурге?", "1917 жылы желтоқсанда Орынбордағы Екінші жалпықазақ съезінде құрылған Алашорда үкіметін кім басқарды?", "1917-yil dekabrda Orenburgda tuzilgan Alash-O‘rda hukumatini kim boshqargan?"),
            options: {
              ru: ["Алихан Букейханов", "Турар Рыскулов", "Сакен Сейфуллин", "Амангельды Иманов"],
              kk: ["Әлихан Бөкейханов", "Тұрар Рысқұлов", "Сәкен Сейфуллин", "Амангелді Иманов"],
              uz: ["Alixon Bukeyxanov", "Turar Risqulov", "Saken Seyfullin", "Amangeldi Imanov"]
            },
            correctIndex: 0,
            explanation: tr("Председателем правительства Алаш-Орды (Народного совета) был избран Алихан Букейханов.", "Алашорда Халық кеңесінің төрағасы болып Әлихан Бөкейханов сайланды.", "Alash-O‘rda Xalq kengashi raisi etib Alixon Bukeyxanov saylangan."),
            hint: tr("Вспомните лидера национально-демократической партии «Алаш».", "«Алаш» партиясының көшбасшысын еске түсіріңіз.", "«Alash» partiyasi yetakchisini eslang."),
            errorCategory: "historical_personalities"
          }
        ]
      }
    ],
    errorLab: {
      id: "hkz-err-chronology",
      subjectId: "history_kz",
      topicId: "hkz_khanate",
      title: tr("Хронологическая ошибка в сводах законов Казахского ханства", "Қазақ хандығының заңдар жинағындағы хронологиялық қате", "Qozoq xonligi qonunlar to‘plamidagi xronologik xato"),
      taskPrompt: tr("Проверьте историческую справку о правовых реформах Казахского ханства:", "Қазақ хандығының құқықтық реформалары туралы анықтаманы тексеріңіз:", "Qozoq xonligi huquqiy islohotlari haqidagi ma’lumotni tekshiring:"),
      steps: {
        ru: [
          "1) В 1465 году Керей и Жанибек основали Казахское ханство в Западном Жетысу.",
          "2) В начале XVI века при Касым-хане был принят свод законов «Жеті жарғы» при участии Толе би, Казыбек би и Айтеке би.",
          "3) В 1643 году Жангир-хан одержал победу в Орбулакской битве."
        ],
        kk: [
          "1) 1465 жылы Керей мен Жәнібек Батыс Жетісуда Қазақ хандығын құрды.",
          "2) XVI ғасырдың басында Қасым хан тұсында Төле би, Қазыбек би және Әйтеке бидің қатысуымен «Жеті жарғы» қабылданды.",
          "3) 1643 жылы Жәңгір хан Орбұлақ шайқасында жеңіске жетті."
        ],
        uz: [
          "1) 1465-yilda Kerey va Janibek G‘arbiy Jetisuvda Qozoq xonligiga asos soldi.",
          "2) XVI asr boshida Qosim xon davrida «Jeti jarg‘i» qonunlar to‘plami qabul qilindi.",
          "3) 1643-yilda Jangir xon Orbulak jangida g‘alaba qozondi."
        ]
      },
      brokenStepIndex: 1,
      errorCategory: "chronology_order",
      whyBroken: tr(
        "Свод законов «Жеті жарғы» с участием трёх великих биев был принят при Тауке-хане (конец XVII в.), а при Касым-хане действовал свод «Қасым ханның қасқа жолы».",
        "«Жеті жарғы» Тәуке хан тұсында (XVII ғ. соңы) қабылданды, ал Қасым хан тұсында «Қасым ханның қасқа жолы» болды.",
        "«Jeti jarg‘i» Tauke xon davrida (XVII asr oxiri) qabul qilingan, Qosim xon davrida esa «Qosim xonning qasqa yo‘li» amal qilgan."
      ),
      correctedStep: tr(
        "2) При Касым-хане принят «Қасым ханның қасқа жолы», а «Жеті жарғы» — при Тауке-хане (конец XVII в.).",
        "2) Қасым хан тұсында «Қасым ханның қасқа жолы», ал Тәуке хан тұсында «Жеті жарғы» қабылданды.",
        "2) Qosim xon davrida «Qosim xonning qasqa yo‘li», Tauke xon davrida esa «Jeti jarg‘i» qabul qilingan."
      ),
      transferQuestion: {
        id: "hkz-err-transfer",
        subjectId: "history_kz",
        topicId: "hkz_khanate",
        lessonId: "history_kz-lesson-hkz_khanate",
        type: "single_choice",
        difficulty: "basic",
        maxPoints: 1,
        prompt: tr("При каком казахском хане был составлен свод законов «Жеті жарғы»?", "«Жеті жарғы» заңдар жинағы қай қазақ ханының тұсында жасалды?", "«Jeti jarg‘i» qonunlar to‘plami qaysi qozoq xoni davrida tuzilgan?"),
        options: {
          ru: ["Тауке-хан", "Касым-хан", "Хакназар-хан", "Абылай-хан"],
          kk: ["Тәуке хан", "Қасым хан", "Хақназар хан", "Абылай хан"],
          uz: ["Tauke xon", "Qosim xon", "Haqnazar xon", "Abilay xon"]
        },
        correctIndex: 0,
        explanation: tr("«Жеті жарғы» («Семь установлений») принят при Тауке-хане (1680–1715 гг.).", "«Жеті жарғы» Тәуке хан тұсында (1680–1715 жж.) қабылданды.", "«Jeti jarg‘i» Tauke xon davrida (1680–1715-y.) qabul qilingan."),
        hint: tr("Вспомните правителя периода «Золотого века» Казахского ханства на рубеже XVII–XVIII вв.", "XVII–XVIII ғғ. тоғысындағы «Алтын ғасыр» ханын еске түсіріңіз.", "XVII–XVIII asrlar chegarasidagi xonni eslang."),
        errorCategory: "chronology_order"
      }
    }
  },
  {
    id: "english",
    category: "languages",
    iconName: "Languages",
    levels: {
      ru: ["A2–B1 (Базовая грамматика и времена)", "B2 (Conditionals, Passive, Reported Speech)", "Подготовка к ЕНТ и IELTS Academic"],
      kk: ["A2–B1 (Базалық грамматика)", "B2 (Conditionals, Passive, Reported Speech)", "ҰБТ және IELTS дайындық"],
      uz: ["A2–B1 (Bazaviy grammatika)", "B2 (Conditionals, Passive, Reported Speech)", "Imtihon va IELTS tayyorgarlik"]
    },
    lessonsData: [
      {
        topicId: "eng_tenses",
        title: tr("Система времён: Present Perfect vs Past Simple", "Шақтар жүйесі: Present Perfect және Past Simple", "Zamonlar tizimi: Present Perfect va Past Simple"),
        sectionTitle: tr("Грамматика (Grammar)", "Грамматика (Grammar)", "Grammatika (Grammar)"),
        difficulty: "basic",
        prereqs: [],
        goal: tr("Различать завершённое действие в прошлом с точной датой (Past Simple) и действие с результатом в настоящем (Present Perfect).", "Нақты уақыты көрсетілген өткен шақты (Past Simple) нәтижесі қазір маңызды шақтан (Present Perfect) ажырату.", "Aniq vaqtli o‘tgan zamon (Past Simple) va natijasi hozir muhim bo‘lgan zamonni (Present Perfect) farqlash."),
        simpleExplanation: tr(
          "Если указано точное время в прошлом (yesterday, in 2020, two days ago), всегда используется Past Simple (V₂). Если время не названо, а важен результат к текущему моменту (already, just, yet, since, for), используется Present Perfect (have/has + V₃).",
          "Өткен уақыт нақты көрсетілсе (yesterday, in 2020, ago) — Past Simple (V₂). Уақыты аталмай, қазіргі нәтижесі маңызды болса (already, yet, since, for) — Present Perfect (have/has + V₃).",
          "O‘tgan vaqt aniq ko‘rsatilsa (yesterday, in 2020, ago) — Past Simple (V₂). Natija muhim bo‘lsa (already, yet, since, for) — Present Perfect (have/has + V₃)."
        ),
        detailedExplanation: tr(
          "Нельзя использовать Present Perfect со словами yesterday или last week: «I have seen him yesterday» — грамматическая ошибка. Правильно: «I saw him yesterday».",
          "Yesterday немесе last week сөздерімен Present Perfect қолданылмайды: «I saw him yesterday» болуы тиіс.",
          "Yesterday yoki last week so‘zlari bilan Present Perfect ishlatilmaydi: «I saw him yesterday» bo‘lishi shart."
        ),
        workedExample: {
          problem: tr("Выберите верную форму: «She ___ (live) in Almaty since 2019».", "Дұрыс форманы таңдаңыз: «She ___ (live) in Almaty since 2019».", "To‘g‘ri shaklni tanlang: «She ___ (live) in Almaty since 2019»."),
          steps: {
            ru: ["1) Маркер «since 2019» показывает действие, начавшееся в прошлом и продолжающееся сейчас", "2) Подлежащее She (3-е лицо ед. ч.) требует вспомогательного глагола has", "3) Ответ: has lived"],
            kk: ["1) «since 2019» маркері әрекеттің әлі жалғасып жатқанын білдіреді", "2) She есімдігімен has көмекші етістігі қолданылады", "3) Жауабы: has lived"],
            uz: ["1) «since 2019» belgisi harakat davom etayotganini bildiradi", "2) She olmoshi bilan has ishlatiladi", "3) Javob: has lived"]
          },
          takeaway: tr("Маркеры since / for / already / yet → Present Perfect; маркеры ago / yesterday / in 1999 → Past Simple.", "since / for / already / yet → Present Perfect; ago / yesterday / in 1999 → Past Simple.", "since / for / already / yet → Present Perfect; ago / yesterday / in 1999 → Past Simple.")
        },
        block: {
          type: "table",
          title: tr("Маркеры времени (Time Expressions)", "Уақыт маркерлері", "Vaqt ko‘rsatkichlari"),
          body: tr("Past Simple (V₂): yesterday, last year, 3 days ago, in 2015 | Present Perfect (have/has + V₃): just, already, yet, ever, never, since, for", "Past Simple (V₂): yesterday, last year, ago, in 2015 | Present Perfect (have/has + V₃): just, already, yet, since, for", "Past Simple (V₂): yesterday, last year, ago, in 2015 | Present Perfect (have/has + V₃): just, already, yet, since, for")
        },
        summary: tr("Освоено разграничение Past Simple и Present Perfect по маркерам времени.", "Past Simple мен Present Perfect шақтарын ажырату меңгерілді.", "Past Simple va Present Perfect zamonlarini farqlash o‘zlashtirildi."),
        questions: [
          {
            id: "eng-q1",
            subjectId: "english",
            topicId: "eng_tenses",
            lessonId: "english-lesson-eng_tenses",
            type: "fill_blank",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("Заполните пропуск (введите 2 слова): «We ___ ___ (finish) the project already.»", "Бос орынды толтырыңыз (2 сөз): «We ___ ___ (finish) the project already.»", "Bo‘sh joyni to‘ldiring (2 so‘z): «We ___ ___ (finish) the project already.»"),
            acceptedTexts: {
              ru: ["have finished"],
              kk: ["have finished"],
              uz: ["have finished"]
            },
            explanation: tr("Маркер «already» без указания точного момента в прошлом требует Present Perfect: have finished.", "«already» маркері Present Perfect шағын талап етеді: have finished.", "«already» ko‘rsatkichi Present Perfect zamonini talab qiladi: have finished."),
            hint: tr("Используйте Present Perfect для местоимения We (have + V₃).", "We үшін Present Perfect (have + V₃) қолданыңыз.", "We uchun Present Perfect (have + V₃) shaklini qo‘llang."),
            errorCategory: "tense_aspect"
          },
          {
            id: "eng-q2",
            subjectId: "english",
            topicId: "eng_tenses",
            lessonId: "english-lesson-eng_tenses",
            type: "single_choice",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("Выберите грамматически верное предложение:", "Грамматикалық тұрғыдан дұрыс сөйлемді таңдаңыз:", "Grammatik jihatdan to‘g‘ri gapni tanlang:"),
            options: {
              ru: [
                "Aidar graduated from university two years ago.",
                "Aidar has graduated from university two years ago.",
                "Aidar had graduate from university two years ago.",
                "Aidar graduates from university two years ago."
              ],
              kk: [
                "Aidar graduated from university two years ago.",
                "Aidar has graduated from university two years ago.",
                "Aidar had graduate from university two years ago.",
                "Aidar graduates from university two years ago."
              ],
              uz: [
                "Aidar graduated from university two years ago.",
                "Aidar has graduated from university two years ago.",
                "Aidar had graduate from university two years ago.",
                "Aidar graduates from university two years ago."
              ]
            },
            correctIndex: 0,
            explanation: tr("Точный указатель прошлого «two years ago» требует Past Simple: graduated.", "«two years ago» нақты өткен уақыт көрсеткіші Past Simple (graduated) талап етеді.", "«two years ago» aniq o‘tgan vaqt ko‘rsatkichi Past Simple (graduated) ni talab qiladi."),
            hint: tr("Обратите внимание на указатель времени «two years ago».", "«two years ago» тіркесіне назар аударыңыз.", "«two years ago» birikmasiga e’tibor bering."),
            errorCategory: "tense_aspect"
          }
        ]
      },
      {
        topicId: "eng_conditionals",
        title: tr("Условные предложения: Zero, First, Second & Third Conditionals", "Шартты сөйлемдер: Zero, First, Second & Third Conditionals", "Shart ergash gaplar: Zero, First, Second & Third Conditionals"),
        sectionTitle: tr("Синтаксис и условные конструкции", "Шартты құрылымдар", "Shart qurilmalari"),
        difficulty: "intermediate",
        prereqs: ["eng_tenses"],
        goal: tr("Безошибочно строить условные предложения I, II и III типа и помнить запрет на will/would после if.", "I, II және III типті шартты сөйлемдерді құрастыру және if-тен кейін will/would қолданбау ережесін меңгеру.", "I, II va III turdagi shart gaplarni tuzish hamda if dan keyin will/would ishlatmaslik."),
        simpleExplanation: tr(
          "В придаточном условия (после if) НЕ ставится будущее время (will / would): First Conditional: If + Present Simple, will + V₁; Second Conditional: If + Past Simple, would + V₁; Third Conditional: If + Past Perfect (had + V₃), would have + V₃.",
          "If-тен кейін will немесе would қойылмайды! First: If + Present Simple, will + V₁; Second: If + Past Simple, would + V₁; Third: If + had V₃, would have V₃.",
          "If dan keyin will yoki would qo‘yilmaydi! First: If + Present Simple, will + V₁; Second: If + Past Simple, would + V₁; Third: If + had V₃, would have V₃."
        ),
        detailedExplanation: tr(
          "Во втором типе условных предложений (нереальное настоящее) для глагола to be со всеми лицами используется форма were: «If I were you, I would study systematically».",
          "Second Conditional-да барлық жақтар үшін were формасы қолданылады: «If I were you, I would...».",
          "Second Conditional da barcha shaxslar uchun were shakli ishlatiladi: «If I were you, I would...»."
        ),
        workedExample: {
          problem: tr("Раскройте скобки: «If she ___ (know) his number, she would call him right now».", "Жақшаны ашыңыз: «If she ___ (know) his number, she would call him right now».", "Qavsni oching: «If she ___ (know) his number, she would call him right now»."),
          steps: {
            ru: ["1) В главной части стоит «would call» + маркер «right now» → это Second Conditional", "2) В части с if нужен Past Simple глагола know → knew"],
            kk: ["1) Басыңқы бөлікте «would call» тұр → Second Conditional", "2) If бөлігіне Past Simple керек: know → knew"],
            uz: ["1) Bosh gapda «would call» turibdi → Second Conditional", "2) If qismida Past Simple kerak: know → knew"]
          },
          takeaway: tr("Видите would + V₁ в главной части → выбирайте Past Simple (V₂) после if.", "Басыңқы бөлікте would + V₁ тұрса, if-тен кейін Past Simple (V₂) таңдаңыз.", "Bosh gapda would + V₁ bo‘lsa, if dan keyin Past Simple (V₂) tanlang.")
        },
        block: {
          type: "formula",
          title: tr("Формулы 4 типов Conditionals", "Conditionals 4 типінің формуласы", "Conditionals 4 turining formulasi"),
          body: tr("1st: If + V₁/V_s, will + V₁  |  2nd: If + V₂(were), would + V₁  |  3rd: If + had V₃, would have + V₃", "1st: If + V₁/V_s, will + V₁  |  2nd: If + V₂(were), would + V₁  |  3rd: If + had V₃, would have + V₃", "1st: If + V₁/V_s, will + V₁  |  2nd: If + V₂(were), would + V₁  |  3rd: If + had V₃, would have + V₃")
        },
        summary: tr("Изучена таблица согласования времён в условных предложениях 1, 2 и 3 типов.", "1, 2 және 3 типті шартты сөйлемдер кестесі меңгерілді.", "1, 2 va 3-tur shart gaplar jadvali o‘zlashtirildi."),
        questions: [
          {
            id: "eng-q3",
            subjectId: "english",
            topicId: "eng_conditionals",
            lessonId: "english-lesson-eng_conditionals",
            type: "single_choice",
            difficulty: "intermediate",
            maxPoints: 1,
            prompt: tr("Choose the correct form: «If it ___ tomorrow, we will stay at home.»", "Дұрыс нұсқаны таңдаңыз: «If it ___ tomorrow, we will stay at home.»", "To‘g‘ri variantni tanlang: «If it ___ tomorrow, we will stay at home.»"),
            options: {
              ru: ["rains", "will rain", "rained", "would rain"],
              kk: ["rains", "will rain", "rained", "would rain"],
              uz: ["rains", "will rain", "rained", "would rain"]
            },
            correctIndex: 0,
            explanation: tr("В First Conditional после if используется Present Simple (it rains), даже если речь о завтрашнем дне.", "First Conditional-да if-тен кейін Present Simple (it rains) қолданылады.", "First Conditional da if dan keyin Present Simple (it rains) ishlatiladi."),
            hint: tr("После союза if в условных предложениях не употребляется will.", "If жалғаулығынан кейін will қолданылмайды.", "If bog‘lovchisidan keyin will ishlatilmaydi."),
            errorCategory: "conditional_will"
          }
        ]
      },
      {
        topicId: "eng_passive_reported",
        title: tr("Страдательный залог и косвенная речь (Passive & Reported Speech)", "Ырықсыз етіс және төлеу сөз (Passive & Reported Speech)", "Majhul nisbat va o‘zlashtirma gap (Passive & Reported Speech)"),
        sectionTitle: tr("Синтаксис", "Синтаксис", "Sintaksis"),
        difficulty: "advanced",
        prereqs: ["eng_conditionals"],
        goal: tr("Преобразовывать предложения в Passive Voice (be + V₃) и соблюдать сдвиг времён на шаг назад в Reported Speech.", "Passive Voice (be + V₃) құрылымын және Reported Speech-тегі шақтардың жылжуын меңгеру.", "Passive Voice (be + V₃) va Reported Speech da zamonlar siljishini o‘zlashtirish."),
        simpleExplanation: tr(
          "В косвенной речи, если слова автора стоят в прошедшем времени (He said that...), время в придаточном сдвигается на шаг назад: Present Simple → Past Simple, will → would, can → could, today → that day.",
          "Төлеу сөзде бастапқы етістік өткен шақта болса (He said that...), шақ бір қадам артқа жылжиды: am/is → was, will → would, today → that day.",
          "O‘zlashtirma gapda bosh fe’l o‘tgan zamonda bo‘lsa (He said that...), zamon bir qadam orqaga suriladi: will → would, today → that day."
        ),
        detailedExplanation: tr(
          "В косвенных вопросах (She asked where he lived) сохраняется ПРЯМОЙ порядок слов (подлежащее перед сказуемым), а вспомогательный глагол do/does/did опускается.",
          "Төлеу сұрақтарда (She asked where he lived) сөз тәртібі тура болады (бастауыш баяндауыштың алдында тұрады).",
          "O‘zlashtirma so‘roq gaplarda (She asked where he lived) to‘g‘ri so‘z tartibi saqlanadi."
        ),
        workedExample: {
          problem: tr("Переведите в косвенную речь: Dana said, «I will call you tomorrow».", "Төлеу сөзге айналдырыңыз: Dana said, «I will call you tomorrow».", "O‘zlashtirma gapga aylantiring: Dana said, «I will call you tomorrow»."),
          steps: {
            ru: ["1) Сдвигаем will → would", "2) Заменяем указатель времени tomorrow → the next day / the following day", "3) Получаем: Dana said (that) she would call me the next day."],
            kk: ["1) will → would болып өзгереді", "2) tomorrow → the next day", "3) Dana said (that) she would call me the next day."],
            uz: ["1) will → would ga o‘zgaradi", "2) tomorrow → the next day", "3) Dana said (that) she would call me the next day."]
          },
          takeaway: tr("Следите одновременно за сдвигом глагола (will → would) и наречия времени (tomorrow → the next day).", "Етістіктің де (will → would), уақыт үстеуінің де (tomorrow → the next day) өзгеруін тексеріңіз.", "Fe’l (will → would) va payt ravishi (tomorrow → the next day) o‘zgarishini birga tekshiring.")
        },
        block: {
          type: "table",
          title: tr("Сдвиг времён в Reported Speech", "Reported Speech шақтар кестесі", "Reported Speech zamonlar siljishi"),
          body: tr("Present Simple → Past Simple | Present Continuous → Past Continuous | Past Simple / Present Perfect → Past Perfect (had + V₃) | will → would", "Present Simple → Past Simple | Present Continuous → Past Continuous | Past Simple → Past Perfect (had + V₃) | will → would", "Present Simple → Past Simple | Present Continuous → Past Continuous | Past Simple → Past Perfect (had + V₃) | will → would")
        },
        summary: tr("Закреплены правила Passive Voice и согласования времён в косвенной речи.", "Passive Voice және төлеу сөз ережелері бекітілді.", "Passive Voice va o‘zlashtirma gap qoidalari mustahkamlandi."),
        questions: [
          {
            id: "eng-q4",
            subjectId: "english",
            topicId: "eng_passive_reported",
            lessonId: "english-lesson-eng_passive_reported",
            type: "single_choice",
            difficulty: "intermediate",
            maxPoints: 1,
            prompt: tr("Choose the correct reported speech: Arman asked me, «Where do you live?»", "Төлеу сөздің дұрыс нұсқасын таңдаңыз: Arman asked me, «Where do you live?»", "To‘g‘ri o‘zlashtirma gapni tanlang: Arman asked me, «Where do you live?»"),
            options: {
              ru: [
                "Arman asked me where I lived.",
                "Arman asked me where did I live.",
                "Arman asked me where do I live.",
                "Arman asked me where I live."
              ],
              kk: [
                "Arman asked me where I lived.",
                "Arman asked me where did I live.",
                "Arman asked me where do I live.",
                "Arman asked me where I live."
              ],
              uz: [
                "Arman asked me where I lived.",
                "Arman asked me where did I live.",
                "Arman asked me where do I live.",
                "Arman asked me where I live."
              ]
            },
            correctIndex: 0,
            explanation: tr("В косвенном вопросе используется прямой порядок слов (where I lived) и время сдвигается в Past Simple.", "Төлеу сұрақта сөз тәртібі тура болады және Past Simple қолданылады: where I lived.", "O‘zlashtirma so‘roqda to‘g‘ri so‘z tartibi va Past Simple ishlatiladi: where I lived."),
            hint: tr("Уберите вспомогательный глагол do/did и поставьте подлежащее перед глаголом в Past Simple.", "Көмекші do/did етістігін алып тастап, бастауышты баяндауыштың алдына қойыңыз.", "Do/did yordamchi fe’lini olib tashlab, egani fe’ldan oldin qo‘ying."),
            errorCategory: "reported_word_order"
          }
        ]
      }
    ],
    errorLab: {
      id: "eng-err-conditional",
      subjectId: "english",
      topicId: "eng_conditionals",
      title: tr("Ошибка употребления will после if в First Conditional", "First Conditional-да if-тен кейін will қолдану қатесі", "First Conditional da if dan keyin will ishlatish xatosi"),
      taskPrompt: tr("Найдите ошибку в построении условного предложения I типа:", "I типті шартты сөйлем құрылымынан қатені табыңыз:", "I turdagi shart gap qurilishidan xatoni toping:"),
      steps: {
        ru: [
          "1) Определяем тип условия: реальное событие в будущем (First Conditional).",
          "2) В придаточном условия после if ставим будущее время: If she will pass the exam,",
          "3) В главной части используем will + инфинитив: she will enter the university."
        ],
        kk: [
          "1) Шарт түрін анықтаймыз: болашақтағы нақты шарт (First Conditional).",
          "2) If-тен кейін келер шақ қоямыз: If she will pass the exam,",
          "3) Басыңқы бөлікте will + V₁ қолданамыз: she will enter the university."
        ],
        uz: [
          "1) Shart turini aniqlaymiz: kelajakdagi real shart (First Conditional).",
          "2) If dan keyin kelasi zamon qo‘yamiz: If she will pass the exam,",
          "3) Bosh gapda will + V₁ ishlatamiz: she will enter the university."
        ]
      },
      brokenStepIndex: 1,
      errorCategory: "conditional_will",
      whyBroken: tr(
        "В английском языке в придаточных времени и условия (после if, when, as soon as, unless) будущее время will НЕ используется — вместо него ставится Present Simple.",
        "Ағылшын тілінде if, when, unless жалғаулықтарынан кейін will қойылмайды — оның орнына Present Simple қолданылады.",
        "Ingliz tilida if, when, unless bog‘lovchilaridan keyin will qo‘yilmaydi — uning o‘rniga Present Simple ishlatiladi."
      ),
      correctedStep: tr("2) После if ставим Present Simple: If she passes the exam,", "2) If-тен кейін Present Simple: If she passes the exam,", "2) If dan keyin Present Simple: If she passes the exam,"),
      transferQuestion: {
        id: "eng-err-transfer",
        subjectId: "english",
        topicId: "eng_conditionals",
        lessonId: "english-lesson-eng_conditionals",
        type: "single_choice",
        difficulty: "basic",
        maxPoints: 1,
        prompt: tr("Выберите правильное продолжение: «As soon as he ___ home, he will call you.»", "Дұрыс нұсқаны таңдаңыз: «As soon as he ___ home, he will call you.»", "To‘g‘ri variantni tanlang: «As soon as he ___ home, he will call you.»"),
        options: {
          ru: ["comes", "will come", "came", "would come"],
          kk: ["comes", "will come", "came", "would come"],
          uz: ["comes", "will come", "came", "would come"]
        },
        correctIndex: 0,
        explanation: tr("После союза времени «as soon as» используется Present Simple (he comes).", "«as soon as» тіркесінен кейін Present Simple (he comes) қолданылады.", "«as soon as» dan keyin Present Simple (he comes) ishlatiladi."),
        hint: tr("Для местоимения he в Present Simple добавляется окончание -s.", "Present Simple-де he есімдігімен -s жалғауы жалғанады.", "Present Simple da he olmoshi bilan -s qo‘shimchasi qo‘shiladi."),
        errorCategory: "conditional_will"
      }
    }
  },
  {
    id: "informatics",
    category: "stem",
    iconName: "Code2",
    levels: {
      ru: ["8–9 класс (Системы счисления, логика, алгоритмы)", "10–11 класс (Python, структуры данных, SQL, сети)", "Профильная информатика ЕНТ и CS Basics"],
      kk: ["8–9 сынып (Санау жүйелері, логика, алгоритмдер)", "10–11 сынып (Python, деректер құрылымы, SQL)", "ҰБТ бейіндік информатика"],
      uz: ["8–9-sinf (Sanoq sistemalari, mantiq, algoritmlar)", "10–11-sinf (Python, ma’lumotlar tuzilmasi, SQL)", "Profil informatika"]
    },
    lessonsData: [
      {
        topicId: "inf_num_logic",
        title: tr("Системы счисления и алгебра логики", "Санау жүйелері және логика алгебрасы", "Sanoq sistemalari va mantiq algebrasi"),
        sectionTitle: tr("Теоретическая информатика", "Теориялық информатика", "Nazariy informatika"),
        difficulty: "basic",
        prereqs: [],
        goal: tr("Переводить числа между двоичной, восьмеричной, десятеричной и шестнадцатеричной системами и вычислять таблицы истинности.", "Екілік, сегіздік, ондық және он алтылық санау жүйелері арасында сандарды ауыстыру және ақиқат кестесін есептеу.", "Ikkilik, sakkizlik, o‘nlik va o‘n oltilik sanoq sistemalari orasida sonlarni o‘tkazish."),
        simpleExplanation: tr(
          "В двоичной системе позиция каждого разряда соответствует степени двойки (2⁰=1, 2¹=2, 2²=4, 2³=8, 2⁴=16...). В алгебре логики конъюнкция (AND / ∧) истинна только когда оба операнда равны 1, а дизъюнкция (OR / ∨) ложна только когда оба равны 0.",
          "Екілік жүйеде әр разряд 2-нің дәрежесін білдіреді (1, 2, 4, 8, 16...). Конъюнкция (AND) тек екі пікір де 1 болғанда ақиқат болады.",
          "Ikkilik sistemada har bir xona 2 ning darajasini bildiradi (1, 2, 4, 8, 16...). Konyunksiya (AND) faqat ikkala operand 1 bo‘lganda rost bo‘ladi."
        ),
        detailedExplanation: tr(
          "Закон де Моргана позволяет раскрывать отрицание над скобкой: ¬(A ∧ B) = ¬A ∨ ¬B и ¬(A ∨ B) = ¬A ∧ ¬B. Импликация A → B ложна только в одном случае: из истины (1) следует ложь (0).",
          "Де Морган заңы: ¬(A ∧ B) = ¬A ∨ ¬B. Импликация A → B тек 1 → 0 жағдайында ғана жалған болады.",
          "De Morgan qonuni: ¬(A ∧ B) = ¬A ∨ ¬B. Implikatsiya A → B faqat 1 → 0 holatida yolg‘on bo‘ladi."
        ),
        workedExample: {
          problem: tr("Переведите двоичное число 10110₂ в десятичную систему счисления.", "10110₂ екілік санын ондық санау жүйесіне ауыстырыңыз.", "10110₂ ikkilik sonini o‘nlik sanoq sistemasiga o‘tkazing."),
          steps: {
            ru: ["1) Пронумеруем разряды справа налево от 0 до 4", "2) Запишем сумму степеней двойки: 1·2⁴ + 0·2³ + 1·2² + 1·2¹ + 0·2⁰", "3) Вычислим: 16 + 0 + 4 + 2 + 0 = 22₁₀"],
            kk: ["1) Разрядтарды оңнан солға 0-ден 4-ке дейін нөмірлейміз", "2) 1·2⁴ + 0·2³ + 1·2² + 1·2¹ + 0·2⁰", "3) 16 + 4 + 2 = 22₁₀"],
            uz: ["1) Xonalarni o‘ngdan chapga 0 dan 4 gacha raqamlaymiz", "2) 1·2⁴ + 0·2³ + 1·2² + 1·2¹ + 0·2⁰", "3) 16 + 4 + 2 = 22₁₀"]
          },
          takeaway: tr("Быстрая шкала степеней двойки: 128 · 64 · 32 · 16 · 8 · 4 · 2 · 1.", "Екінің дәрежелері: 128 · 64 · 32 · 16 · 8 · 4 · 2 · 1.", "Ikkining darajalari: 128 · 64 · 32 · 16 · 8 · 4 · 2 · 1.")
        },
        block: {
          type: "code",
          title: tr("Проверка систем счисления на Python", "Python тілінде санау жүйелерін тексеру", "Python tilida sanoq sistemalarini tekshirish"),
          body: tr("print(int('10110', 2))  # 22\nprint(bin(22))          # '0b10110'\nprint(hex(255))         # '0xff'", "print(int('10110', 2))  # 22\nprint(bin(22))          # '0b10110'\nprint(hex(255))         # '0xff'", "print(int('10110', 2))  # 22\nprint(bin(22))          # '0b10110'\nprint(hex(255))         # '0xff'"),
          codeLanguage: "python"
        },
        summary: tr("Освоены перевод чисел между системами счисления и базовые логические операции.", "Санау жүйелері мен логикалық амалдар меңгерілді.", "Sanoq sistemalari va mantiqiy amallar o‘zlashtirildi."),
        questions: [
          {
            id: "inf-q1",
            subjectId: "informatics",
            topicId: "inf_num_logic",
            lessonId: "informatics-lesson-inf_num_logic",
            type: "numeric",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("Переведите двоичное число 1101₂ в десятичную систему счисления.", "1101₂ екілік санын ондық жүйеге ауыстырыңыз.", "1101₂ ikkilik sonini o‘nlik sanoq sistemasiga o‘tkazing."),
            numericAnswer: 13,
            explanation: tr("1·2³ + 1·2² + 0·2¹ + 1·2⁰ = 8 + 4 + 0 + 1 = 13.", "8 + 4 + 0 + 1 = 13.", "8 + 4 + 0 + 1 = 13."),
            hint: tr("Сложите веса разрядов, где стоит единица: 8 + 4 + 1.", "Бірлік тұрған разрядтарды қосыңыз: 8 + 4 + 1.", "Bir turgan xonalarni qo‘shing: 8 + 4 + 1."),
            errorCategory: "binary_conversion"
          }
        ]
      },
      {
        topicId: "inf_python_loops",
        title: tr("Алгоритмы и циклы на языке Python (range, индексация)", "Python тіліндегі алгоритмдер мен циклдер (range, индексация)", "Python tilida algoritmlar va sikllar (range, indeksatsiya)"),
        sectionTitle: tr("Программирование", "Бағдарламалау", "Dasturlash"),
        difficulty: "intermediate",
        prereqs: ["inf_num_logic"],
        goal: tr("Точно определять количество итераций цикла for i in range(a, b, step) и избегать ошибки смещения границы (off-by-one).", "for i in range(a, b, step) циклінің қадам санын дәл анықтау және шекара қатесін (off-by-one) болдырмау.", "for i in range(a, b, step) sikli qadamlarini aniqlash va chegara xatosini (off-by-one) oldini olish."),
        simpleExplanation: tr(
          "В Python функция range(start, stop) включает левую границу start, но НЕ включает правую границу stop. Например, range(1, 5) выдаёт числа 1, 2, 3, 4 (всего 4 числа, без 5).",
          "Python-да range(start, stop) функциясы сол жақ шекараны қосады, бірақ оң жақ stop шекарасын ҚОСПАЙДЫ. range(1, 5) → 1, 2, 3, 4.",
          "Python da range(start, stop) funksiyasi chap chegarani oladi, ammo o‘ng stop chegarasini OLMAYDI. range(1, 5) → 1, 2, 3, 4."
        ),
        detailedExplanation: tr(
          "Чтобы посчитать сумму чисел от 1 до N включительно, нужно писать range(1, N + 1). Аналогично при срезах списков s[a:b] элемент с индексом b не входит в результат.",
          "1-ден N-ге дейінгі сандар қосындысын табу үшін range(1, N + 1) деп жазу керек.",
          "1 dan N gacha sonlar yig‘indisini topish uchun range(1, N + 1) deb yozish shart."
        ),
        workedExample: {
          problem: tr("Что выведет код:\ns = 0\nfor x in range(2, 7, 2):\n    s += x\nprint(s)", "Код не шығарады:\ns = 0\nfor x in range(2, 7, 2):\n    s += x\nprint(s)", "Kod nimani chiqaradi:\ns = 0\nfor x in range(2, 7, 2):\n    s += x\nprint(s)"),
          steps: {
            ru: ["1) range(2, 7, 2) генерирует числа от 2 до 6 с шагом 2: это 2, 4, 6 (7 не входит)", "2) Суммируем: s = 2 + 4 + 6 = 12"],
            kk: ["1) range(2, 7, 2) мәндері: 2, 4, 6", "2) Қосындысы: s = 2 + 4 + 6 = 12"],
            uz: ["1) range(2, 7, 2) qiymatlari: 2, 4, 6", "2) Yig‘indi: s = 2 + 4 + 6 = 12"]
          },
          takeaway: tr("Правая граница stop в range(start, stop, step) всегда строгая (не включается).", "range(start, stop, step) ішіндегі stop шекарасы ешқашан қосылмайды.", "range(start, stop, step) dagi stop chegarasi hech qachon kirmaydi.")
        },
        block: {
          type: "code",
          title: tr("Шаблон суммы и фильтрации массива в Python", "Python-да қосынды мен сүзгілеу үлгісі", "Python da yig‘indi va filtrlash namunasi"),
          body: tr("total = sum(x for x in range(1, n + 1) if x % 2 == 0)", "total = sum(x for x in range(1, n + 1) if x % 2 == 0)", "total = sum(x for x in range(1, n + 1) if x % 2 == 0)"),
          codeLanguage: "python"
        },
        summary: tr("Закреплена работа функции range(), срезов и циклов в Python.", "Python тіліндегі range(), тілімдер мен циклдер бекітілді.", "Python da range(), kesmalar va sikllar mustahkamlandi."),
        questions: [
          {
            id: "inf-q2",
            subjectId: "informatics",
            topicId: "inf_python_loops",
            lessonId: "informatics-lesson-inf_python_loops",
            type: "code_fix",
            difficulty: "intermediate",
            maxPoints: 1,
            prompt: tr("Ученик написал функцию для вычисления суммы чисел от 1 до n включительно, но ответ всегда меньше на n. Какую строку нужно исправить?", "Оқушы 1-ден n-ге дейінгі сандар қосындысын табатын функция жазды, бірақ жауабы n-ге кем шығады. Қай жолды түзету керек?", "O‘quvchi 1 dan n gacha sonlar yig‘indisini hisoblovchi funksiya yozdi, ammo javob n ga kam chiqmoqda. Qaysi qatorni tuzatish kerak?"),
            codeSnippet: "def sum_to_n(n):\n    s = 0\n    for i in range(1, n):  # <-- ?\n        s += i\n    return s",
            options: {
              ru: [
                "Заменить range(1, n) на range(1, n + 1)",
                "Заменить s = 0 на s = 1",
                "Заменить s += i на s *= i",
                "Заменить return s на return i"
              ],
              kk: [
                "range(1, n) орнына range(1, n + 1) жазу",
                "s = 0 орнына s = 1 жазу",
                "s += i орнына s *= i жазу",
                "return s орнына return i жазу"
              ],
              uz: [
                "range(1, n) o‘rniga range(1, n + 1) yozish",
                "s = 0 o‘rniga s = 1 yozish",
                "s += i o‘rniga s *= i yozish",
                "return s o‘rniga return i yozish"
              ]
            },
            correctIndex: 0,
            explanation: tr("Так как верхняя граница range не включается, для включения числа n необходимо использовать range(1, n + 1).", "range-тің жоғарғы шекарасы қосылмайтындықтан, n санын қосу үшін range(1, n + 1) жазылады.", "range ning yuqori chegarasi kirmagani uchun n sonini qo‘shishda range(1, n + 1) yoziladi."),
            hint: tr("Посмотрите на правую границу функции range(1, n).", "range(1, n) функциясының оң жақ шекарасына қараңыз.", "range(1, n) funksiyasining o‘ng chegarasiga e’tibor bering."),
            errorCategory: "off_by_one_range"
          }
        ]
      },
      {
        topicId: "inf_sql_db",
        title: tr("Реляционные базы данных и SQL-запросы (SELECT, WHERE, GROUP BY)", "Реляциялық деректер қоры және SQL сұраныстары", "Relyatsion ma’lumotlar bazasi va SQL so‘rovlari"),
        sectionTitle: tr("Базы данных", "Деректер қоры", "Ma’lumotlar bazasi"),
        difficulty: "advanced",
        prereqs: ["inf_python_loops"],
        goal: tr("Различать фильтрацию строк до группировки (WHERE) и фильтрацию агрегированных групп (HAVING), понимать первичные и внешние ключи.", "Топтастыруға дейінгі (WHERE) және топтастырудан кейінгі (HAVING) сүзгілеуді ажырату.", "Guruhlashdan oldingi (WHERE) va keyingi (HAVING) filtrlashni farqlash."),
        simpleExplanation: tr(
          "Первичный ключ (PRIMARY KEY) уникально идентифицирует каждую запись в таблице. В SQL-запросах оператор WHERE фильтрует отдельные строки до GROUP BY, а HAVING — результат агрегатных функций (COUNT, AVG, SUM) после GROUP BY.",
          "PRIMARY KEY кестедегі әр жолды бірегей анықтайды. WHERE жолдарды GROUP BY-ға дейін сүзеді, ал HAVING агрегаттық функцияларды (COUNT, SUM) GROUP BY-дан кейін сүзеді.",
          "PRIMARY KEY jadvaldagi har bir yozuvni noyob aniqlaydi. WHERE qatorlarni GROUP BY dan oldin, HAVING esa agregat funksiyalarni GROUP BY dan keyin filtrlaydi."
        ),
        detailedExplanation: tr(
          "Строгий порядок секций в SQL: SELECT → FROM → JOIN → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT.",
          "SQL сұранысының қатаң реті: SELECT → FROM → JOIN → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT.",
          "SQL so‘rovining qat’iy tartibi: SELECT → FROM → JOIN → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT."
        ),
        workedExample: {
          problem: tr("Как выбрать классы, в которых средний балл учеников выше 40?", "Орташа балы 40-тан жоғары сыныптарды қалай таңдаймыз?", "O‘rtacha bali 40 dan yuqori bo‘lgan sinflarni qanday tanlaymiz?"),
          steps: {
            ru: ["1) Группируем по полю grade: GROUP BY grade", "2) Так как условие накладывается на агрегатную функцию AVG(score), используем HAVING AVG(score) > 40"],
            kk: ["1) Сынып бойынша топтастырамыз: GROUP BY grade", "2) AVG(score) агрегаттық функциясы үшін HAVING AVG(score) > 40 қолданамыз"],
            uz: ["1) Sinf bo‘yicha guruhlaymiz: GROUP BY grade", "2) AVG(score) agregat funksiyasi uchun HAVING AVG(score) > 40 ishlatamiz"]
          },
          takeaway: tr("Внутри секции WHERE нельзя вызывать агрегатные функции AVG/SUM/COUNT — для этого служит HAVING.", "WHERE ішінде AVG/SUM/COUNT агрегаттық функцияларын қолдануға болмайды — ол үшін HAVING бар.", "WHERE ichida AVG/SUM/COUNT agregat funksiyalarini ishlatib bo‘lmaydi — buning uchun HAVING xizmat qiladi.")
        },
        block: {
          type: "code",
          title: tr("Эталонный запрос с GROUP BY и HAVING", "GROUP BY және HAVING сұраныс үлгісі", "GROUP BY va HAVING so‘rov namunasi"),
          body: tr("SELECT grade, AVG(score) AS avg_score\nFROM students\nWHERE active = 1\nGROUP BY grade\nHAVING AVG(score) > 40\nORDER BY avg_score DESC;", "SELECT grade, AVG(score) AS avg_score\nFROM students\nWHERE active = 1\nGROUP BY grade\nHAVING AVG(score) > 40\nORDER BY avg_score DESC;", "SELECT grade, AVG(score) AS avg_score\nFROM students\nWHERE active = 1\nGROUP BY grade\nHAVING AVG(score) > 40\nORDER BY avg_score DESC;"),
          codeLanguage: "sql"
        },
        summary: tr("Изучена структура SQL-запросов, ключи таблиц и разница между WHERE и HAVING.", "SQL сұраныстарының құрылымы және WHERE мен HAVING айырмашылығы меңгерілді.", "SQL so‘rovlari tuzilmasi hamda WHERE va HAVING farqi o‘zlashtirildi."),
        questions: [
          {
            id: "inf-q3",
            subjectId: "informatics",
            topicId: "inf_sql_db",
            lessonId: "informatics-lesson-inf_sql_db",
            type: "single_choice",
            difficulty: "intermediate",
            maxPoints: 1,
            prompt: tr("Какое ключевое слово SQL используется для фильтрации групп после GROUP BY по результату функции COUNT(*)?", "GROUP BY-дан кейін COUNT(*) нәтижесі бойынша топтарды сүзу үшін қай SQL сөзі қолданылады?", "GROUP BY dan keyin COUNT(*) natijasi bo‘yicha guruhlarni filtrlash uchun qaysi SQL kalit so‘zi ishlatiladi?"),
            options: {
              ru: ["HAVING", "WHERE", "ORDER BY", "DISTINCT"],
              kk: ["HAVING", "WHERE", "ORDER BY", "DISTINCT"],
              uz: ["HAVING", "WHERE", "ORDER BY", "DISTINCT"]
            },
            correctIndex: 0,
            explanation: tr("Оператор HAVING фильтрует сгруппированные строки по значению агрегатных функций.", "HAVING операторы топтастырылған деректерді агрегаттық функция мәндері бойынша сүзеді.", "HAVING operatori guruhlangan ma’lumotlarni agregat funksiyalar bo‘yicha filtrlaydi."),
            hint: tr("WHERE работает до группировки, а после GROUP BY используется другое ключевое слово.", "WHERE топтастыруға дейін жұмыс істейді.", "WHERE guruhlashdan oldin ishlaydi."),
            errorCategory: "sql_having_where"
          }
        ]
      }
    ],
    errorLab: {
      id: "inf-err-range",
      subjectId: "informatics",
      topicId: "inf_python_loops",
      title: tr("Ошибка границы цикла range(1, n) при подсчёте факториала", "Факториалды есептеудегі range(1, n) шекара қатесі", "Faktorialni hisoblashda range(1, n) chegara xatosi"),
      taskPrompt: tr("Разберите код вычисления факториала 5! = 120:", "5! = 120 факториалын есептейтін кодты талдаңыз:", "5! = 120 faktorialni hisoblovchi kodni tahlil qiling:"),
      steps: {
        ru: [
          "1) Инициализируем аккумулятор произведения: fact = 1",
          "2) Запускаем цикл от 1 до 5: for k in range(1, 5): fact *= k",
          "3) Выводим результат: print(fact)  # Ожидаем 120, но получаем 24"
        ],
        kk: [
          "1) Көбейтінді айнымалысын бастаймыз: fact = 1",
          "2) 1-ден 5-ке дейін цикл: for k in range(1, 5): fact *= k",
          "3) Нәтижені шығарамыз: print(fact)  # 120 орнына 24 шығады"
        ],
        uz: [
          "1) Ko‘paytma o‘zgaruvchisini ochamiz: fact = 1",
          "2) 1 dan 5 gacha sikl: for k in range(1, 5): fact *= k",
          "3) Natijani chiqaramiz: print(fact)  # 120 o‘rniga 24 chiqadi"
        ]
      },
      brokenStepIndex: 1,
      errorCategory: "off_by_one_range",
      whyBroken: tr(
        "В Python range(1, 5) перебирает только 1, 2, 3, 4 (верхняя граница 5 не входит), поэтому вычисляется 4! = 24 вместо 5! = 120.",
        "range(1, 5) тек 1, 2, 3, 4 сандарын береді (5 кірмейді), сондықтан 4! = 24 есептеледі.",
        "range(1, 5) faqat 1, 2, 3, 4 sonlarini beradi (5 kirmaydi), shuning uchun 4! = 24 hisoblanadi."
      ),
      correctedStep: tr("2) Запускаем цикл до n + 1: for k in range(1, 6): fact *= k", "2) Циклді 6-ға дейін береміз: for k in range(1, 6): fact *= k", "2) Siklni 6 gacha beramiz: for k in range(1, 6): fact *= k"),
      transferQuestion: {
        id: "inf-err-transfer",
        subjectId: "informatics",
        topicId: "inf_python_loops",
        lessonId: "informatics-lesson-inf_python_loops",
        type: "numeric",
        difficulty: "basic",
        maxPoints: 1,
        prompt: tr("Какое значение выведет код: print(len(range(3, 10)))?", "Код қандай мән шығарады: print(len(range(3, 10)))?", "Kod qanday qiymat chiqaradi: print(len(range(3, 10)))?"),
        numericAnswer: 7,
        explanation: tr("Числа от 3 до 9 включительно: 10 − 3 = 7 элементов.", "3-тен 9-ға дейінгі сандар: 10 − 3 = 7 элемент.", "3 dan 9 gacha sonlar: 10 − 3 = 7 ta element."),
        hint: tr("Количество элементов в range(a, b) при шаге 1 равно b − a.", "range(a, b) ішіндегі элементтер саны b − a-ға тең.", "range(a, b) dagi elementlar soni b − a ga teng."),
        errorCategory: "off_by_one_range"
      }
    }
  },
  {
    id: "chemistry",
    category: "natural_science",
    iconName: "FlaskConical",
    levels: {
      ru: ["8–9 класс (Строение атома, связь, стехиометрия)", "10–11 класс (ОВР, электролиз, органическая химия)", "Подготовка к профильной химии ЕНТ"],
      kk: ["8–9 сынып (Атом құрылысы, байланыс, стехиометрия)", "10–11 сынып (ТТР, электролиз, органикалық химия)", "ҰБТ бейіндік химия"],
      uz: ["8–9-sinf (Atom tuzilishi, bog‘lanish, stexiometriya)", "10–11-sinf (OQR, elektroliz, organik kimyo)", "Profil kimyo"]
    },
    lessonsData: [
      {
        topicId: "chem_atom_bonds",
        title: tr("Строение атома, периодический закон и химическая связь", "Атом құрылысы, периодтық заң және химиялық байланыс", "Atom tuzilishi, davriy qonun va kimyoviy bog‘lanish"),
        sectionTitle: tr("Общая химия", "Жалпы химия", "Umumiy kimyo"),
        difficulty: "basic",
        prereqs: [],
        goal: tr("Определять число протонов, нейтронов и электронов, а также различать ионную, ковалентную полярную/неполярную и металлическую связь.", "Протон, нейтрон, электрон санын және химиялық байланыс түрлерін анықтау.", "Proton, neytron, elektron soni va kimyoviy bog‘lanish turlarini aniqlash."),
        simpleExplanation: tr(
          "Число протонов Z равно порядковому номеру элемента. Число нейтронов N = A − Z (где A — массовое число). Связь между металлом и неметаллом (NaCl) — ионная, между разными неметаллами (HCl, H₂O) — ковалентная полярная, между одинаковыми неметаллами (O₂, N₂) — ковалентная неполярная.",
          "Протон саны Z реттік нөмірге тең. Нейтрон саны N = A − Z. Металл мен бейметалл арасында (NaCl) — иондық байланыс.",
          "Protonlar soni Z tartib raqamiga teng. Neytronlar soni N = A − Z. Metall vaometall orasida (NaCl) — ion bog‘lanish."
        ),
        detailedExplanation: tr(
          "По периоду слева направо радиус атома уменьшается, а электроотрицательность и неметаллические свойства растут. По группе сверху вниз радиус атома и металлические свойства увеличиваются.",
          "Период бойынша солдан оңға қарай атом радиусы кішірейіп, электртерістілік артады.",
          "Davr bo‘ylab chapdan o‘ngga atom radiusi kichrayib, elektromanfiylik ortadi."
        ),
        workedExample: {
          problem: tr("Сколько протонов, электронов и нейтронов в изотопе хлора ³⁷₁₇Cl?", "Хлордың ³⁷₁₇Cl изотопында қанша протон, электрон және нейтрон бар?", "Xlorning ³⁷₁₇Cl izotopida nechta proton, elektron va neytron bor?"),
          steps: {
            ru: ["1) Порядковый номер Z = 17 → 17 протонов и 17 электронов", "2) Число нейтронов N = 37 − 17 = 20 нейтронов"],
            kk: ["1) Реттік нөмірі Z = 17 → 17 протон және 17 электрон", "2) Нейтрон саны N = 37 − 17 = 20 нейтрон"],
            uz: ["1) Tartib raqami Z = 17 → 17 proton va 17 elektron", "2) Neytronlar soni N = 37 − 17 = 20 neytron"]
          },
          takeaway: tr("Формула ядра: A = Z + N, откуда N = A − Z.", "Ядро формуласы: N = A − Z.", "Yadro formulasi: N = A − Z.")
        },
        block: {
          type: "formula",
          title: tr("Состав атома и типы связи", "Атом құрамы және байланыс түрлері", "Atom tarkibi va bog‘lanish turlari"),
          body: tr("p⁺ = e⁻ = Z  |  n⁰ = A − Z  |  Металл + Неметалл = Ионная  |  Неметалл₁ + Неметалл₂ = Ковалентная полярная", "p⁺ = e⁻ = Z  |  n⁰ = A − Z  |  Металл + Бейметалл = Иондық", "p⁺ = e⁻ = Z  |  n⁰ = A − Z  |  Metall + Nometall = Ionli")
        },
        summary: tr("Освоены расчёт элементарных частиц атома и классификация химических связей.", "Атом бөлшектері мен химиялық байланыс түрлері меңгерілді.", "Atom zarralari va kimyoviy bog‘lanish turlari o‘zlashtirildi."),
        questions: [
          {
            id: "chem-q1",
            subjectId: "chemistry",
            topicId: "chem_atom_bonds",
            lessonId: "chemistry-lesson-chem_atom_bonds",
            type: "numeric",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("Сколько нейтронов содержится в ядре атома натрия ²³₁₁Na?", "Натрий ²³₁₁Na атомының ядросында қанша нейтрон бар?", "Natriy ²³₁₁Na atomi yadrosida nechta neytron bor?"),
            numericAnswer: 12,
            explanation: tr("N = A − Z = 23 − 11 = 12 нейтронов.", "N = 23 − 11 = 12 нейтрон.", "N = 23 − 11 = 12 neytron."),
            hint: tr("Вычтите порядковый номер (11) из массового числа (23).", "Массалық саннан (23) реттік нөмірді (11) азайтыңыз.", "Massa sonidan (23) tartib raqamini (11) ayiring."),
            errorCategory: "nucleon_calculation"
          }
        ]
      },
      {
        topicId: "chem_stoichiometry_solutions",
        title: tr("Количество вещества, стехиометрия и массовая доля раствора", "Зат мөлшері, стехиометрия және ерітіндінің массалық үлесі", "Modda miqdori, stexiometriya va eritmaning massa ulushi"),
        sectionTitle: tr("Расчётная химия", "Есептік химия", "Hisoblash kimyosi"),
        difficulty: "intermediate",
        prereqs: ["chem_atom_bonds"],
        goal: tr("Выполнять расчёты по формулам n = m/M = V/22.4 и находить массовую долю растворённого вещества ω = m(в-ва)/m(р-ра)·100%.", "n = m/M = V/22.4 және ω = m(зат)/m(ерітінді)·100% формулаларымен есеп шығару.", "n = m/M = V/22.4 va ω = m(modda)/m(eritma)·100% formulalari bo‘yicha hisoblash."),
        simpleExplanation: tr(
          "1 моль любого газа при нормальных условиях (н.у.) занимает объём V_m = 22.4 л. Масса раствора складывается из массы растворённого вещества и массы воды: m(р-ра) = m(в-ва) + m(H₂O).",
          "Қалыпты жағдайда (қ.ж.) 1 моль кез келген газ 22.4 л көлем алады. Ерітінді массасы: m(ерітінді) = m(зат) + m(су).",
          "Normal sharoitda (n.sh.) 1 mol har qanday gaz 22.4 l hajmni egallaydi. Eritma massasi: m(eritma) = m(modda) + m(suv)."
        ),
        detailedExplanation: tr(
          "Частая ошибка — делить массу соли только на массу воды вместо общей массы раствора. Если в 160 г воды растворили 40 г соли, масса раствора равна 200 г, а массовая доля ω = 40 / 200 · 100% = 20%.",
          "Жиі кездесетін қате — тұз массасын жалпы ерітінді массасына емес, тек су массасына бөлу. m(ерітінді) = 160 + 40 = 200 г → ω = 20%.",
          "Ko‘p uchraydigan xato — tuz massasini umumiy eritma massasiga emas, faqat suv massasiga bo‘lish. m(eritma) = 160 + 40 = 200 g → ω = 20%."
        ),
        workedExample: {
          problem: tr("В 180 г воды растворили 20 г гидроксида натрия NaOH. Найдите массовую долю NaOH в растворе (%).", "180 г суда 20 г NaOH ерітілді. Ерітіндідегі NaOH массалық үлесін (%) табыңыз.", "180 g suvda 20 g NaOH eritildi. Eritmadagi NaOH massa ulushini (%) toping."),
          steps: {
            ru: ["1) Находим массу всего раствора: m(р-ра) = 180 + 20 = 200 г", "2) Вычисляем массовую долю: ω = (20 / 200) · 100% = 10%"],
            kk: ["1) Ерітінді массасы: m(ерітінді) = 180 + 20 = 200 г", "2) Массалық үлес: ω = (20 / 200) · 100% = 10%"],
            uz: ["1) Eritma massasi: m(eritma) = 180 + 20 = 200 g", "2) Massa ulushi: ω = (20 / 200) · 100% = 10%"]
          },
          takeaway: tr("В знаменателе формулы ω всегда стоит сумма масс вещества и растворителя.", "ω формуласының бөлімінде әрқашан зат пен еріткіш массаларының қосындысы тұрады.", "ω formulasining maxrajida har doim modda va erituvchi massalari yig‘indisi turadi.")
        },
        block: {
          type: "formula",
          title: tr("Базовые формулы стехиометрии", "Стехиометрияның негізгі формулалары", "Stexiometriyaning asosiy formulalari"),
          body: tr("n = m / M = V / 22.4 = N / (6.02·10²³)  |  ω(%) = [m(в-ва) / (m(в-ва) + m(воды))] · 100%", "n = m / M = V / 22.4  |  ω(%) = [m(зат) / m(ерітінді)] · 100%", "n = m / M = V / 22.4  |  ω(%) = [m(modda) / m(eritma)] · 100%")
        },
        summary: tr("Отработаны задачи на количество вещества, молярный объём газа и массовую долю раствора.", "Зат мөлшері мен ерітіндінің массалық үлесіне арналған есептер пысықталды.", "Modda miqdori va eritmaning massa ulushi masalalari mustahkamlandi."),
        questions: [
          {
            id: "chem-q2",
            subjectId: "chemistry",
            topicId: "chem_stoichiometry_solutions",
            lessonId: "chemistry-lesson-chem_stoichiometry_solutions",
            type: "numeric",
            difficulty: "intermediate",
            maxPoints: 1,
            prompt: tr("Какой объём (в литрах при н.у.) занимают 2.5 моль углекислого газа CO₂?", "Қалыпты жағдайда 2.5 моль CO₂ газы қанша литр көлем алады?", "Normal sharoitda 2.5 mol CO₂ gazi necha litr hajmni egallaydi?"),
            numericAnswer: 56,
            unit: "л",
            explanation: tr("V = n · V_m = 2.5 · 22.4 = 56 л.", "V = 2.5 · 22.4 = 56 л.", "V = 2.5 · 22.4 = 56 l."),
            hint: tr("Умножьте количество вещества 2.5 моль на молярный объём газа 22.4 л/моль.", "2.5 мольді 22.4 л/мольге көбейтіңіз.", "2.5 molni 22.4 l/molga ko‘paytiring."),
            errorCategory: "molar_volume"
          }
        ]
      },
      {
        topicId: "chem_redox_organic",
        title: tr("Окислительно-восстановительные реакции и классы органических веществ", "Тотығу-тотықсыздану реакциялары және органикалық заттар кластары", "Oksidlanish-qaytarilish reaksiyalari va organik moddalar sinflari"),
        sectionTitle: tr("ОВР и Органика", "ТТР және Органика", "OQR va Organika"),
        difficulty: "advanced",
        prereqs: ["chem_stoichiometry_solutions"],
        goal: tr("Различать окислитель и восстановитель по переходу электронов и определять общие формулы гомологических рядов (алканы, алкены, алкины, спирты).", "Тотықтырғыш пен тотықсыздандырғышты және көмірсутектердің жалпы формулаларын анықтау.", "Oksidlovchi va qaytaruvchini hamda uglevodorodlarning umumiy formulalarini aniqlash."),
        simpleExplanation: tr(
          "Восстановитель отдаёт электроны и повышает степень окисления (процесс — окисление). Окислитель принимает электроны и понижает степень окисления (процесс — восстановление). Общие формулы: алканы CₙH₂ₙ₊₂, алкены CₙH₂ₙ, алкины и алкадиены CₙH₂ₙ₋₂.",
          "Тотықсыздандырғыш электрон береді (тотығады), тотықтырғыш электрон қосып алады (тотықсызданады). Алкандар: CₙH₂ₙ₊₂, алкендер: CₙH₂ₙ.",
          "Qaytaruvchi elektron beradi (oksidlanadi), oksidlovchi elektron oladi (qaytariladi). Alkanlar: CₙH₂ₙ₊₂, alkenlar: CₙH₂ₙ."
        ),
        detailedExplanation: tr(
          "В кислой среде перманганат калия KMnO₄ (Mn⁺⁷) восстанавливается до бесцветного катиона Mn²⁺, в нейтральной — до бурого осадка MnO₂ (Mn⁺⁴), в щелочной — до зелёного манганата K₂MnO₄ (Mn⁺⁶).",
          "KMnO₄ қышқылдық ортада Mn²⁺-ке дейін, бейтарап ортада MnO₂-ге дейін, сілтілік ортада MnO₄²⁻-ке дейін тотықсызданады.",
          "KMnO₄ kislotali muhitda Mn²⁺ gacha, neytral muhitda MnO₂ gacha, ishqoriy muhitda MnO₄²⁻ gacha qaytariladi."
        ),
        workedExample: {
          problem: tr("Определите общую формулу алкенов и молекулярную формулу пропена (n = 3).", "Алкендердің жалпы формуласын және пропеннің (n = 3) молекулалық формуласын табыңыз.", "Alkenlarning umumiy formulasini va propenning (n = 3) molekulyar formulasini toping."),
          steps: {
            ru: ["1) Общая формула алкенов с одной двойной связью: CₙH₂ₙ", "2) При n = 3 получаем C₃H₆"],
            kk: ["1) Алкендердің жалпы формуласы: CₙH₂ₙ", "2) n = 3 болғанда: C₃H₆"],
            uz: ["1) Alkenlarning umumiy formulasi: CₙH₂ₙ", "2) n = 3 bo‘lganda: C₃H₆"]
          },
          takeaway: tr("Каждая кратная связь или цикл уменьшает число атомов водорода на 2 по сравнению с алканом CₙH₂ₙ₊₂.", "Әр еселі байланыс сутек санын 2-ге азайтады.", "Har bir karrali bog‘ vodorod sonini 2 taga kamaytiradi.")
        },
        block: {
          type: "table",
          title: tr("Гомологические ряды органических соединений", "Органикалық қосылыстардың гомологтық қатарлары", "Organik birikmalarning gomologik qatorlari"),
          body: tr("Алканы: CₙH₂ₙ₊₂ | Алкены / Циклоалканы: CₙH₂ₙ | Алкины / Алкадиены: CₙH₂ₙ₋₂ | Арены (бензол): CₙH₂ₙ₋₆", "Алкандар: CₙH₂ₙ₊₂ | Алкендер: CₙH₂ₙ | Алкиндер: CₙH₂ₙ₋₂ | Арендер: CₙH₂ₙ₋₆", "Alkanlar: CₙH₂ₙ₊₂ | Alkenlar: CₙH₂ₙ | Alkinlar: CₙH₂ₙ₋₂ | Arenlar: CₙH₂ₙ₋₆")
        },
        summary: tr("Систематизированы правила электронного баланса в ОВР и формулы углеводородов.", "ТТР электрондық баланс ережелері мен көмірсутек формулалары жүйеленді.", "OQR elektron balans qoidalari va uglevodorod formulalari tizimlashtirildi."),
        questions: [
          {
            id: "chem-q3",
            subjectId: "chemistry",
            topicId: "chem_redox_organic",
            lessonId: "chemistry-lesson-chem_redox_organic",
            type: "single_choice",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("Какая общая формула соответствует гомологическому ряду алкинов (например, ацетилену C₂H₂)?", "Алкиндердің гомологтық қатарына (мысалы, ацетилен C₂H₂) қай жалпы формула сәйкес келеді?", "Alkinlarning gomologik qatoriga (masalan, atsetilen C₂H₂) qaysi umumiy formula mos keladi?"),
            options: {
              ru: ["CₙH₂ₙ₋₂", "CₙH₂ₙ₊₂", "CₙH₂ₙ", "CₙH₂ₙ₋₆"],
              kk: ["CₙH₂ₙ₋₂", "CₙH₂ₙ₊₂", "CₙH₂ₙ", "CₙH₂ₙ₋₆"],
              uz: ["CₙH₂ₙ₋₂", "CₙH₂ₙ₊₂", "CₙH₂ₙ", "CₙH₂ₙ₋₆"]
            },
            correctIndex: 0,
            explanation: tr("Алкины содержат одну тройную связь и описываются общей формулой CₙH₂ₙ₋₂.", "Алкиндерде бір үштік байланыс болады, жалпы формуласы — CₙH₂ₙ₋₂.", "Alkinlarda bitta uchбоg‘ bo‘ladi, umumiy formulasi — CₙH₂ₙ₋₂."),
            hint: tr("Подставьте n = 2 для C₂H₂: 2·2 − 2 = 2.", "C₂H₂ үшін n = 2 қойып тексеріңіз.", "C₂H₂ uchun n = 2 qo‘yib tekshiring."),
            errorCategory: "organic_homologous_formula"
          }
        ]
      }
    ],
    errorLab: {
      id: "chem-err-solution",
      subjectId: "chemistry",
      topicId: "chem_stoichiometry_solutions",
      title: tr("Ошибка расчёта массовой доли вещества в растворе", "Ерітіндідегі заттың массалық үлесін есептеу қатесі", "Eritmadagi moddaning massa ulushini hisoblash xatosi"),
      taskPrompt: tr("Проверьте решение задачи: «В 160 г воды растворили 40 г соли. Найдите массовую долю соли в растворе»:", "Есептің шығарылуын тексеріңіз: «160 г суда 40 г тұз ерітілді. Тұздың массалық үлесін табыңыз»:", "Masala yechimini tekshiring: «160 g suvda 40 g tuz eritildi. Tuzning massa ulushini toping»:"),
      steps: {
        ru: [
          "1) Записываем данные: m(соли) = 40 г, m(воды) = 160 г.",
          "2) Делим массу соли на массу воды: ω = (40 / 160) · 100%.",
          "3) Получаем ответ: ω = 25%."
        ],
        kk: [
          "1) Берілгені: m(тұз) = 40 г, m(су) = 160 г.",
          "2) Тұз массасын су массасына бөлеміз: ω = (40 / 160) · 100%.",
          "3) Жауабы: ω = 25%."
        ],
        uz: [
          "1) Berilgan: m(tuz) = 40 g, m(suv) = 160 g.",
          "2) Tuz massasini suv massasiga bo‘lamiz: ω = (40 / 160) · 100%.",
          "3) Javob: ω = 25%."
        ]
      },
      brokenStepIndex: 1,
      errorCategory: "solution_mass_denominator",
      whyBroken: tr(
        "Массовая доля считается по отношению к массе ВСЕГО раствора m(р-ра) = m(соли) + m(воды) = 40 + 160 = 200 г, а не только воды.",
        "Массалық үлес тек су массасына емес, жалпы ерітінді массасына (40 + 160 = 200 г) бөлінеді.",
        "Massa ulushi faqat suv massasiga emas, umumiy eritma massasiga (40 + 160 = 200 g) nisbatan hisoblanadi."
      ),
      correctedStep: tr("2) Находим m(р-ра) = 200 г и делим: ω = (40 / 200) · 100% = 20%.", "2) m(ерітінді) = 200 г, ω = (40 / 200) · 100% = 20%.", "2) m(eritma) = 200 g, ω = (40 / 200) · 100% = 20%."),
      transferQuestion: {
        id: "chem-err-transfer",
        subjectId: "chemistry",
        topicId: "chem_stoichiometry_solutions",
        lessonId: "chemistry-lesson-chem_stoichiometry_solutions",
        type: "numeric",
        difficulty: "basic",
        maxPoints: 1,
        prompt: tr("В 210 г воды растворили 40 г сахара. Чему равна массовая доля сахара в полученном растворе (в %)?", "210 г суда 40 г қант ерітілді. Ерітіндідегі қанттың массалық үлесі неше пайыз (%)?", "210 g suvda 40 g shakar eritildi. Eritmadagi shakarning massa ulushi necha foiz (%)?"),
        numericAnswer: 16,
        unit: "%",
        explanation: tr("m(р-ра) = 210 + 40 = 250 г; ω = (40 / 250) · 100% = 16%.", "m(ерітінді) = 250 г; ω = 40 / 250 · 100% = 16%.", "m(eritma) = 250 g; ω = 40 / 250 · 100% = 16%."),
        hint: tr("Сначала сложите массу воды (210 г) и сахара (40 г).", "Алдымен су мен қант массаларын қосыңыз (210 + 40 = 250 г).", "Avval suv va shakar massalarini qo‘shing (250 g)."),
        errorCategory: "solution_mass_denominator"
      }
    }
  },
  {
    id: "biology",
    category: "natural_science",
    iconName: "Dna",
    levels: {
      ru: ["7–9 класс (Клетка, ботаника, зоология, анатомия)", "10–11 класс (Молекулярная биология, генетика, эволюция)", "Профильная биология ЕНТ"],
      kk: ["7–9 сынып (Жасуша, ботаника, зоология, анатомия)", "10–11 сынып (Молекулалық биология, генетика, эволюция)", "ҰБТ бейіндік биология"],
      uz: ["7–9-sinf (Hujayra, botanika, zoologiya, anatomiya)", "10–11-sinf (Molekulyar biologiya, genetika, evolyutsiya)", "Profil biologiya"]
    },
    lessonsData: [
      {
        topicId: "bio_cell_dna",
        title: tr("Цитология и правило Чаргаффа (ДНК и РНК)", "Цитология және Чаргафф ережесі (ДНҚ мен РНҚ)", "Sitologiya va Chargaff qoidasi (DNK va RNK)"),
        sectionTitle: tr("Молекулярная биология", "Молекулалық биология", "Molekulyar biologiya"),
        difficulty: "basic",
        prereqs: [],
        goal: tr("Применять принцип комплементарности (А=Т, Г≡Ц) и рассчитывать процентный состав нуклеотидов ДНК по правилу Чаргаффа.", "Комплементарлық принципін (А=Т, Г≡Ц) және Чаргафф ережесін есептерде қолдану.", "Komplementarlik prinsipi (A=T, G≡S) va Chargaff qoidasini qo‘llash."),
        simpleExplanation: tr(
          "В двуцепочечной молекуле ДНК аденин (А) всегда комплементарен тимину (Т), а гуанин (Г) — цитозину (Ц). Поэтому количество А = Т, Г = Ц, а сумма А + Г = Т + Ц = 50%.",
          "ДНҚ молекуласында А = Т және Г = Ц, ал А + Г = Т + Ц = 50%.",
          "DNK molekulasida A = T va G = S, hamda A + G = T + S = 50%."
        ),
        detailedExplanation: tr(
          "Между А и Т образуются 2 водородные связи, а между Г и Ц — 3 водородные связи. В молекуле РНК вместо тимина (Т) содержится урацил (У).",
          "А мен Т арасында 2 сутектік байланыс, Г мен Ц арасында 3 сутектік байланыс болады. РНҚ-да тиминнің орнына урацил (У) болады.",
          "A va T orasida 2 ta, G va S orasida 3 ta vodorod bog‘i bo‘ladi. RNK da timin o‘rniga uratsil (U) bo‘ladi."
        ),
        workedExample: {
          problem: tr("В молекуле ДНК на долю гуанина (Г) приходится 18%. Найдите процентное содержание аденина (А).", "ДНҚ молекуласында гуанин (Г) үлесі 18% болса, аденин (А) үлесін табыңыз.", "DNK molekulasida guanin (G) ulushi 18% bo‘lsa, adenin (A) ulushini toping."),
          steps: {
            ru: ["1) По правилу Чаргаффа А + Г = 50%", "2) Значит А = 50% − 18% = 32%"],
            kk: ["1) Чаргафф ережесі бойынша А + Г = 50%", "2) А = 50% − 18% = 32%"],
            uz: ["1) Chargaff qoidasiga ko‘ra A + G = 50%", "2) A = 50% − 18% = 32%"]
          },
          takeaway: tr("Быстрая формула Чаргаффа: А% + Г% = 50% и Т% + Ц% = 50%.", "Жылдам формула: А% + Г% = 50%.", "Tezkor formula: A% + G% = 50%.")
        },
        block: {
          type: "formula",
          title: tr("Правило Чаргаффа и водородные связи", "Чаргафф ережесі және сутектік байланыстар", "Chargaff qoidasi va vodorod bog‘lari"),
          body: tr("n(A) = n(T),  n(G) = n(C)  |  A% + G% = 50%  |  N(H-связей) = 2·n(A) + 3·n(G)", "n(A) = n(T),  n(G) = n(C)  |  A% + G% = 50%", "n(A) = n(T),  n(G) = n(C)  |  A% + G% = 50%")
        },
        summary: tr("Освоены строение ДНК/РНК и расчёты по правилу Чаргаффа.", "ДНҚ/РНҚ құрылысы мен Чаргафф ережесі меңгерілді.", "DNK/RNK tuzilishi va Chargaff qoidasi o‘zlashtirildi."),
        questions: [
          {
            id: "bio-q1",
            subjectId: "biology",
            topicId: "bio_cell_dna",
            lessonId: "biology-lesson-bio_cell_dna",
            type: "numeric",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("Фрагмент ДНК содержит 22% аденина (А). Сколько процентов приходится на долю цитозина (Ц)?", "ДНҚ фрагментінде 22% аденин (А) бар. Цитозиннің (Ц) үлесі неше пайыз (%)?", "DNK fragmentida 22% adenin (A) bor. Sitozin (S) ulushi necha foiz (%)?"),
            numericAnswer: 28,
            unit: "%",
            explanation: tr("А + Ц = 50% ⇒ Ц = 50% − 22% = 28%.", "Ц = 50% − 22% = 28%.", "S = 50% − 22% = 28%."),
            hint: tr("Сумма некомплементарных оснований (А + Ц) всегда равна 50%.", "А + Ц қосындысы әрқашан 50%-ға тең.", "A + S yig‘indisi har doim 50% ga teng."),
            errorCategory: "chargaff_rule"
          }
        ]
      },
      {
        topicId: "bio_mendel_genetics",
        title: tr("Законы Менделя и решение генетических задач", "Мендель заңдары және генетикалық есептерді шығару", "Mendel qonunlari va genetik masalalarni yechish"),
        sectionTitle: tr("Генетика", "Генетика", "Genetika"),
        difficulty: "intermediate",
        prereqs: ["bio_cell_dna"],
        goal: tr("Определять расщепление по фенотипу и генотипу при моногибридном (Aa × Aa) и анализирующем (Aa × aa) скрещивании.", "Моногибридті (Aa × Aa) және талдаушы (Aa × aa) будандастырудағы ажырауды анықтау.", "Monogibrid (Aa × Aa) va tahliliy (Aa × aa) chatishtirishda ajralishni aniqlash."),
        simpleExplanation: tr(
          "I закон Менделя (AA × aa → 100% Aa) — единообразие гибридов первого поколения. II закон Менделя (Aa × Aa) даёт расщепление 3:1 по фенотипу и 1:2:1 (1 AA : 2 Aa : 1 aa) по генотипу.",
          "Мендельдің I заңы (AA × aa → 100% Aa). II заңы (Aa × Aa): фенотип бойынша 3:1, генотип бойынша 1:2:1.",
          "Mendelning I qonuni (AA × aa → 100% Aa). II qonuni (Aa × Aa): fenotip bo‘yicha 3:1, genotip bo‘yicha 1:2:1."
        ),
        detailedExplanation: tr(
          "При дигибридном скрещивании дигетерозигот (AaBb × AaBb) при независимом наследовании (III закон Менделя) расщепление по фенотипу составляет 9:3:3:1.",
          "Мендельдің III заңы (AaBb × AaBb) бойынша фенотиптік ажырау — 9:3:3:1.",
          "Mendelning III qonuni (AaBb × AaBb) bo‘yicha fenotipik ajralish — 9:3:3:1."
        ),
        workedExample: {
          problem: tr("При скрещивании двух гетерозиготных растений гороха с жёлтыми семенами (Aa × Aa) получено 120 семян. Сколько из них будут зелёными (рецессивными aa)?", "Екі гетерозиготалы сары бұршақты (Aa × Aa) будандастырғанда 120 тұқым алынды. Оның қаншасы жасыл (aa) болады?", "Ikkita geterozigotali sariq no‘xat (Aa × Aa) chatishtirilganda 120 ta urug‘ olindi. Ulardan nechtasi yashil (aa) bo‘ladi?"),
          steps: {
            ru: ["1) В скрещивании Aa × Aa доля рецессивной гомозиготы aa равна 1/4 (25%)", "2) 120 · (1/4) = 30 зелёных семян"],
            kk: ["1) Aa × Aa будандастыруында aa үлесі — 1/4 (25%)", "2) 120 / 4 = 30 жасыл тұқым"],
            uz: ["1) Aa × Aa chatishtirishda aa ulushi — 1/4 (25%)", "2) 120 / 4 = 30 ta yashil urug‘"]
          },
          takeaway: tr("В Aa × Aa: 75% доминантный фенотип (25% AA + 50% Aa) и 25% рецессивный фенотип (aa).", "Aa × Aa: 75% доминантты, 25% рецессивті фенотип.", "Aa × Aa: 75% dominant, 25% retsessiv fenotip.")
        },
        block: {
          type: "table",
          title: tr("Решётка Пеннета для Aa × Aa", "Aa × Aa үшін Пеннет торы", "Aa × Aa uchun Pennet katakchasi"),
          body: tr("Гаметы A и a × A и a → Генотипы: 1 AA (25%) : 2 Aa (50%) : 1 aa (25%) | Фенотипы: 3 доминантных (75%) : 1 рецессивный (25%)", "Генотип: 1 AA : 2 Aa : 1 aa | Фенотип: 3 : 1", "Genotip: 1 AA : 2 Aa : 1 aa | Fenotip: 3 : 1")
        },
        summary: tr("Отработаны законы Менделя и расчёт вероятностей генотипов в потомстве.", "Мендель заңдары және ұрпақ генотиптерінің ықтималдығы меңгерілді.", "Mendel qonunlari va avlod genotiplari ehtimolligi o‘zlashtirildi."),
        questions: [
          {
            id: "bio-q2",
            subjectId: "biology",
            topicId: "bio_mendel_genetics",
            lessonId: "biology-lesson-bio_mendel_genetics",
            type: "single_choice",
            difficulty: "intermediate",
            maxPoints: 1,
            prompt: tr("Какое расщепление по фенотипу наблюдается в потомстве при анализирующем скрещивании гетерозиготы (Aa × aa)?", "Гетерозиготаны талдаушы будандастыруда (Aa × aa) фенотип бойынша қандай ажырау байқалады?", "Geterozigotani tahliliy chatishtirishda (Aa × aa) fenotip bo‘yicha qanday ajralish кузатилади?"),
            options: {
              ru: ["1 : 1 (50% на 50%)", "3 : 1 (75% на 25%)", "9 : 3 : 3 : 1", "Единообразие (100%)"],
              kk: ["1 : 1 (50% де 50%)", "3 : 1 (75% де 25%)", "9 : 3 : 3 : 1", "Біркелкілік (100%)"],
              uz: ["1 : 1 (50% ga 50%)", "3 : 1 (75% ga 25%)", "9 : 3 : 3 : 1", "Bir xillik (100%)"]
            },
            correctIndex: 0,
            explanation: tr("Скрещивание Aa × aa даёт 50% Aa и 50% aa, то есть расщепление 1 : 1 как по генотипу, так и по фенотипу.", "Aa × aa будандастыруы 50% Aa және 50% aa береді (1 : 1).", "Aa × aa chatishtirish 50% Aa va 50% aa beradi (1 : 1)."),
            hint: tr("Особи aa дают один сорт гамет (a), а особи Aa — два сорта гамет (A и a) поровну.", "Aa дарағы A және a гаметаларын тең мөлшерде береді.", "Aa organizmi A va a gametalarini teng miqdorda beradi."),
            errorCategory: "mendel_ratio"
          }
        ]
      },
      {
        topicId: "bio_human_physiology",
        title: tr("Физиология человека: кровообращение, дыхание и выделение", "Адам физиологиясы: қанайналым, тыныс алу және зәр шығару", "Odam fiziologiyasi: qon aylanish, nafas olish va ayirish"),
        sectionTitle: tr("Анатомия и физиология", "Анатомия және физиология", "Anatomiya va fiziologiya"),
        difficulty: "advanced",
        prereqs: ["bio_mendel_genetics"],
        goal: tr("Безошибочно различать большой и малый круги кровообращения и понимать, по каким сосудам течёт артериальная и венозная кровь.", "Үлкен және кіші қанайналым шеңберлерін және артериялық/веналық қан тамырларын ажырату.", "Katta va kichik qon aylanish doiralarini hamda arterial/venoz qon tomirlarini farqlash."),
        simpleExplanation: tr(
          "Артерии — это сосуды, несущие кровь ОТ сердца, а вены — К сердцу. В малом (лёгочном) круге кровообращения по лёгочной артерии от правого желудочка к лёгким течёт ВЕНОЗНАЯ кровь, а по лёгочным венам в левое предсердие возвращается АРТЕРИАЛЬНАЯ кровь.",
          "Артериялар қанды жүректен алып шығады, веналар жүрекке әкеледі. Кіші шеңберде өкпе артериясымен веналық қан, ал өкпе веналарымен артериялық қан ағады.",
          "Arteriyalar qonni yurakdan olib chiqadi, venalar yurakka olib keladi. Kichik doirada o‘pka arteriyasida venoz qon, o‘pka venalarida arterial qon oqadi."
        ),
        detailedExplanation: tr(
          "Большой круг начинается в левом желудочке (аорта, артериальная кровь) и заканчивается в правом предсердии (верхняя и нижняя полые вены, венозная кровь). Малый круг начинается в правом желудочке и заканчивается в левом предсердии.",
          "Үлкен қанайналым шеңбері сол жақ қарыншадан (қолқа) басталып, оң жақ жүрекшеде аяқталады.",
          "Katta qon aylanish doirasi chap qorinchadan (aorta) boshlanib, o‘ng bo‘lmachada tugaydi."
        ),
        workedExample: {
          problem: tr("Какая кровь течёт по лёгочным венам человека и в какую камеру сердца они впадают?", "Адамның өкпе веналарымен қандай қан ағады және олар жүректің қай бөлігіне құяды?", "Odamning o‘pka venalarida qanday qon oqadi va ular yurakning qaysi bo‘lmasiga quyiladi?"),
          steps: {
            ru: ["1) В лёгких кровь насыщается кислородом и становится артериальной", "2) Сосуды идут к сердцу, поэтому называются лёгочными венами", "3) Они впадают в левое предсердие"],
            kk: ["1) Өкпеде қан оттекке қанығып, артериялық қанға айналады", "2) Өкпе веналары сол жақ жүрекшеге құяды"],
            uz: ["1) O‘pkada qon kislorodga to‘yinib arterial qonga aylanadi", "2) O‘pka venalari chap bo‘lmachaga quyiladi"]
          },
          takeaway: tr("Не путайте название сосуда (вена/артерия = направление к/от сердца) и состав крови (артериальная/венозная).", "Тамыр атауын қан құрамымен шатастырмаңыз: өкпе венасында артериялық қан ағады.", "Tomir nomini qon tarkibi bilan adashtirmang: o‘pka venasida arterial qon oqadi.")
        },
        block: {
          type: "diagram",
          title: tr("Схема двух кругов кровообращения", "Екі қанайналым шеңберінің сызбасы", "Ikki qon aylanish doirasi chizmasi"),
          body: tr("Малый круг: Правый желудочек → Лёгочная артерия (венозная) → Лёгкие → Лёгочные вены (артериальная) → Левое предсердие", "Кіші шеңбер: Оң жақ қарынша → Өкпе артериясы → Өкпе → Өкпе веналары → Сол жақ жүрекше", "Kichik doira: O‘ng qorincha → O‘pka arteriyasi → O‘pka → O‘pka venalari → Chap bo‘lmacha")
        },
        summary: tr("Изучены круги кровообращения и особенности газообмена в лёгких и тканях.", "Қанайналым шеңберлері мен газ алмасу ерекшеліктері меңгерілді.", "Qon aylanish doiralari va gaz almashinuvi o‘zlashtirildi."),
        questions: [
          {
            id: "bio-q3",
            subjectId: "biology",
            topicId: "bio_human_physiology",
            lessonId: "biology-lesson-bio_human_physiology",
            type: "true_false",
            difficulty: "intermediate",
            maxPoints: 1,
            prompt: tr("Верно ли утверждение: «По лёгочным венам малого круга кровообращения в левое предсердие течёт артериальная (богатая кислородом) кровь»?", "«Кіші қанайналым шеңберінің өкпе веналарымен сол жақ жүрекшеге артериялық қан ағады» деген тұжырым рас па?", "«Kichik qon aylanish doirasining o‘pka venalari orqali chap bo‘lmachaga arterial qon oqadi» degan fikr to‘g‘rimi?"),
            options: {
              ru: ["Верно", "Неверно"],
              kk: ["Рас", "Жалған"],
              uz: ["To‘g‘ri", "Noto‘g‘ri"]
            },
            correctIndex: 0,
            explanation: tr("Верно: после газообмена в альвеолах лёгких кровь становится артериальной и по четырём лёгочным венам поступает в левое предсердие.", "Рас: өкпеде оттекке қаныққан артериялық қан өкпе веналары арқылы сол жақ жүрекшеге құяды.", "To‘g‘ri: o‘pkada kislorodga to‘yingan arterial qon o‘pka venalari orqali chap bo‘lmachaga quyiladi."),
            hint: tr("Кровь возвращается из лёгких уже после насыщения кислородом.", "Қан өкпеден оттекке қанығып оралады.", "Qon o‘pkadan kislorodga to‘yinib qaytadi."),
            errorCategory: "pulmonary_vessels"
          }
        ]
      }
    ],
    errorLab: {
      id: "bio-err-chargaff",
      subjectId: "biology",
      topicId: "bio_cell_dna",
      title: tr("Ошибка вычитания из 100% вместо 50% в правиле Чаргаффа", "Чаргафф ережесінде 50% орнына 100%-дан азайту қатесі", "Chargaff qoidasida 50% o‘rniga 100% dan ayirish xatosi"),
      taskPrompt: tr("Проверьте расчёт нуклеотидного состава ДНК (дано: А = 20%, найти Г):", "ДНҚ нуклеотидтік құрамын есептеуді тексеріңіз (берілгені: А = 20%, Г табу керек):", "DNK nukleotid tarkibini hisoblashni tekshiring (berilgan: A = 20%, G ni topish kerak):"),
      steps: {
        ru: [
          "1) По принципу комплементарности количество тимина равно аденину: Т = А = 20%.",
          "2) Находим долю гуанина вычитанием из 100%: Г = 100% − (20% + 20%) = 60%.",
          "3) Записываем ответ: Г = 60%."
        ],
        kk: [
          "1) Комплементарлық бойынша: Т = А = 20%.",
          "2) Гуанин үлесін табамыз: Г = 100% − (20% + 20%) = 60%.",
          "3) Жауабы: Г = 60%."
        ],
        uz: [
          "1) Komplementarlik bo‘yicha: T = A = 20%.",
          "2) Guanin ulushini topamiz: G = 100% − (20% + 20%) = 60%.",
          "3) Javob: G = 60%."
        ]
      },
      brokenStepIndex: 1,
      errorCategory: "chargaff_rule",
      whyBroken: tr(
        "Остаток 60% приходится суммарно на гуанин И цитозин (Г + Ц = 60%), поэтому нужно разделить его пополам: Г = Ц = 60% / 2 = 30%.",
        "60% — бұл Г мен Ц қосындысы (Г + Ц = 60%), сондықтан оны екіге бөлу керек: Г = 30%.",
        "60% — bu G va S yig‘indisi (G + S = 60%), shuning uchun uni ikkiga bo‘lish kerak: G = 30%."
      ),
      correctedStep: tr("2) Г + Ц = 60%, значит Г = Ц = 60% / 2 = 30% (или сразу Г = 50% − 20% = 30%).", "2) Г = 60% / 2 = 30% (немесе Г = 50% − 20% = 30%).", "2) G = 60% / 2 = 30% (yoki G = 50% − 20% = 30%)."),
      transferQuestion: {
        id: "bio-err-transfer",
        subjectId: "biology",
        topicId: "bio_cell_dna",
        lessonId: "biology-lesson-bio_cell_dna",
        type: "numeric",
        difficulty: "basic",
        maxPoints: 1,
        prompt: tr("В молекуле ДНК на долю тимина (Т) приходится 15%. Сколько процентов составляет доля гуанина (Г)?", "ДНҚ молекуласында тимин (Т) үлесі 15%. Гуанин (Г) үлесі неше пайыз (%)?", "DNK molekulasida timin (T) ulushi 15%. Guanin (G) ulushi necha foiz (%)?"),
        numericAnswer: 35,
        unit: "%",
        explanation: tr("Т + Г = 50% ⇒ Г = 50% − 15% = 35%.", "Г = 50% − 15% = 35%.", "G = 50% − 15% = 35%."),
        hint: tr("Вычтите 15% из 50%.", "50%-дан 15%-ды азайтыңыз.", "50% dan 15% ni ayiring."),
        errorCategory: "chargaff_rule"
      }
    }
  },
  {
    id: "geography",
    category: "natural_science",
    iconName: "Globe2",
    levels: {
      ru: ["7–9 класс (Картография, геосферы, физическая география РК)", "10–11 класс (Экономическая география РК, геоэкономика, демография)", "Профильная география ЕНТ"],
      kk: ["7–9 сынып (Картография, геосфералар, ҚР физикалық географиясы)", "10–11 сынып (ҚР экономикалық географиясы, геоэкономика)", "ҰБТ бейіндік география"],
      uz: ["7–9-sinf (Kartografiya, geosferalar, Qozog‘iston tabiiy geografiyasi)", "10–11-sinf (Iqtisodiy geografiya, geoekonomika)", "Profil geografiya"]
    },
    lessonsData: [
      {
        topicId: "geo_cartography_scale",
        title: tr("Картография, масштаб и поясное время", "Картография, масштаб және белдеулік уақыт", "Kartografiya, masshtab va mintaqa vaqti"),
        sectionTitle: tr("Картография и Земля", "Картография", "Kartografiya"),
        difficulty: "basic",
        prereqs: [],
        goal: tr("Переводить численный масштаб в именованный и вычислять реальное расстояние на местности и разницу местного времени по долготе.", "Сандық масштабты атаулы масштабқа айналдыру және жергілікті қашықтықты есептеу.", "Sonli masshtabni nomli masshtabga aylantirish va masofani hisoblash."),
        simpleExplanation: tr(
          "Чтобы перевести численный масштаб (например, 1 : 500 000) в километры в 1 см, зачеркните 5 нулей справа (так как в 1 км = 100 000 см): получаем в 1 см 5 км. Земля поворачивается на 15° долготы за 1 час (или на 1° за 4 минуты).",
          "Сандық масштабты (1 : 500 000) км-ге айналдыру үшін оң жағынан 5 нөлді сызып тастаймыз: 1 см-де 5 км. Жер 1 сағатта 15° бойлыққа бұрылады.",
          "Sonli masshtabni (1 : 500 000) km ga aylantirish uchun 5 ta nolni olib tashlaymiz: 1 sm da 5 km. Yer 1 soatda 15° uzunlikka buriladi."
        ),
        detailedExplanation: tr(
          "При пересчёте площадей по карте коэффициент масштаба возводится в квадрат: если в 1 см 2 км, то в 1 см² карты содержится 2² = 4 км² местности.",
          "Ауданды есептегенде масштаб квадратталады: 1 см-де 2 км болса, 1 см²-де 4 км² болады.",
          "Maydonni hisoblashda masshtab kvadratga oshiriladi: 1 sm da 2 km bo‘lsa, 1 sm² da 4 km² bo‘ladi."
        ),
        workedExample: {
          problem: tr("Расстояние между двумя городами на карте масштаба 1 : 2 000 000 составляет 6 см. Найдите реальное расстояние на местности в километрах.", "Масштабы 1 : 2 000 000 картада екі қала арасы 6 см. Жер бетіндегі нақты қашықтықты (км) табыңыз.", "Masshtabi 1 : 2 000 000 bo‘lgan xaritada ikki shahar orasi 6 sm. Haqiqiy masofani (km) toping."),
          steps: {
            ru: ["1) Переводим масштаб 1 : 2 000 000 в именованный: убираем 5 нулей → в 1 см 20 км", "2) Умножаем: 6 см · 20 км/см = 120 км"],
            kk: ["1) 1 : 2 000 000 масштабында 1 см-де 20 км", "2) 6 · 20 = 120 км"],
            uz: ["1) 1 : 2 000 000 masshtabda 1 sm da 20 km", "2) 6 · 20 = 120 km"]
          },
          takeaway: tr("Правило 5 нулей: −2 нуля = метры в 1 см; −5 нулей = километры в 1 см.", "5 нөл ережесі: −2 нөл = метр, −5 нөл = километр.", "5 nol qoidasi: −2 nol = metr, −5 nol = kilometr.")
        },
        block: {
          type: "formula",
          title: tr("Формулы масштаба и меридиана", "Масштаб және меридиан формулалары", "Masshtab va meridian formulalari"),
          body: tr("1 км = 100 000 см  |  1° меридиана ≈ 111.1 км  |  15° долготы = 1 час (1° = 4 мин)", "1 км = 100 000 см  |  1° меридиан ≈ 111.1 км  |  15° бойлық = 1 сағат", "1 km = 100 000 sm  |  1° meridian ≈ 111.1 km  |  15° uzunlik = 1 soat")
        },
        summary: tr("Освоены расчёты расстояний по масштабу и определение поясного и местного времени.", "Масштаб бойынша қашықтықты және сағаттық белдеуді есептеу меңгерілді.", "Masshtab bo‘yicha masofa va vaqt mintaqalarini hisoblash o‘zlashtirildi."),
        questions: [
          {
            id: "geo-q1",
            subjectId: "geography",
            topicId: "geo_cartography_scale",
            lessonId: "geography-lesson-geo_cartography_scale",
            type: "numeric",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("На карте масштаба 1 : 500 000 расстояние между пунктами равно 8 см. Чему равно расстояние на местности (в км)?", "Масштабы 1 : 500 000 картада екі пункт арасы 8 см. Жергілікті жердегі қашықтық неше км?", "Masshtabi 1 : 500 000 xaritada ikki nuqta orasi 8 sm. Joyda masofa necha km?"),
            numericAnswer: 40,
            unit: "км",
            explanation: tr("В 1 см 5 км (убираем 5 нулей у 500 000). 8 · 5 = 40 км.", "1 см-де 5 км; 8 · 5 = 40 км.", "1 sm da 5 km; 8 · 5 = 40 km."),
            hint: tr("Переведите 1 : 500 000 в км/см (5 км в 1 см) и умножьте на 8.", "1 см-де 5 км екенін ескеріп, 8-ге көбейтіңіз.", "1 sm da 5 km ekanini hisobga olib, 8 ga ko‘paytiring."),
            errorCategory: "scale_conversion"
          }
        ]
      },
      {
        topicId: "geo_atmosphere_temp",
        title: tr("Атмосфера: вертикальный градиент температуры и давления", "Атмосфера: температура мен қысымның биіктік градиенті", "Atmosfera: harorat va bosimning balandlik gradiyenti"),
        sectionTitle: tr("Физическая география", "Физикалық география", "Tabiiy geografiya"),
        difficulty: "intermediate",
        prereqs: ["geo_cartography_scale"],
        goal: tr("Рассчитывать температуру воздуха и атмосферное давление на вершине горы при подъёме в тропосфере.", "Тропосферада биіктікке көтерілгенде ауа температурасы мен қысымның өзгеруін есептеу.", "Troposferada balandlikka ko‘tarilganda harorat va bosim o‘zgarishini hisoblash."),
        simpleExplanation: tr(
          "В тропосфере при подъёме на каждые 1000 м (1 км) температура воздуха понижается в среднем на 6 °C. Атмосферное давление при подъёме в нижних слоях падает примерно на 1 мм рт. ст. на каждые 10.5 м.",
          "Тропосферада әр 1000 м (1 км) биіктікке көтерілген сайын температура орта есеппен 6 °C-қа төмендейді.",
          "Troposferada har 1000 m (1 km) balandlikka ko‘tarilganda havo harorati o‘rtacha 6 °C ga pasayadi."
        ),
        detailedExplanation: tr(
          "Например, у подножия пика Хан-Тенгри (высота 7000 м) температура +18 °C. При подъёме на 4 км температура изменится на −4 · 6 = −24 °C и составит 18 − 24 = −6 °C.",
          "Есептеу формуласы: T(шың) = T(етек) − 6 · H(км).",
          "Hisoblash formulasi: T(cho‘qqi) = T(etak) − 6 · H(km)."
        ),
        workedExample: {
          problem: tr("У подножия горы на уровне моря температура воздуха равна +20 °C. Какова температура на высоте 3000 м?", "Теңіз деңгейіндегі тау етегінде ауа температурасы +20 °C. 3000 м биіктікте температура қандай болады?", "Dengiz sathidagi tog‘ etagida havo harorati +20 °C. 3000 m balandlikda harorat qanday bo‘ladi?"),
          steps: {
            ru: ["1) Переводим высоту в километры: H = 3000 м = 3 км", "2) Находим падение температуры: 3 км · 6 °C/км = 18 °C", "3) Вычитаем: 20 − 18 = +2 °C"],
            kk: ["1) Биіктік: 3000 м = 3 км", "2) Төмендеуі: 3 · 6 = 18 °C", "3) 20 − 18 = +2 °C"],
            uz: ["1) Balandlik: 3000 m = 3 km", "2) Pasayish: 3 · 6 = 18 °C", "3) 20 − 18 = +2 °C"]
          },
          takeaway: tr("Градиент тропосферы: −6 °C на каждый 1 км подъёма.", "Тропосфера градиенті: әр 1 км-ге −6 °C.", "Troposfera gradiyenti: har 1 km ga −6 °C.")
        },
        block: {
          type: "formula",
          title: tr("Формула высотного градиента температуры", "Температураның биіктік градиенті", "Haroratning balandlik gradiyenti"),
          body: tr("T(H) = T₀ − 6 °C · (ΔH / 1000 м)  |  Относительная влажность φ = (абсолютная / максимальная) · 100%", "T(H) = T₀ − 6 °C · (ΔH / 1000 м)", "T(H) = T₀ − 6 °C · (ΔH / 1000 m)")
        },
        summary: tr("Закреплены расчёты температуры, давления и влажности воздуха в тропосфере.", "Тропосферадағы температура, қысым және ылғалдылық есептері бекітілді.", "Troposferada harorat, bosim va namlik hisoblari mustahkamlandi."),
        questions: [
          {
            id: "geo-q2",
            subjectId: "geography",
            topicId: "geo_atmosphere_temp",
            lessonId: "geography-lesson-geo_atmosphere_temp",
            type: "numeric",
            difficulty: "intermediate",
            maxPoints: 1,
            prompt: tr("У подножия горы (0 м) температура воздуха +24 °C. Чему равна температура на вершине высотой 4000 м (в °C)?", "Тау етегінде (0 м) ауа температурасы +24 °C. Биіктігі 4000 м шыңдағы температура неше °C?", "Tog‘ etagida (0 m) havo harorati +24 °C. 4000 m balandlikdagi cho‘qqida harorat necha °C?"),
            numericAnswer: 0,
            unit: "°C",
            explanation: tr("На высоте 4 км температура упадёт на 4 · 6 = 24 °C. Значит 24 − 24 = 0 °C.", "4 · 6 = 24 °C төмендейді: 24 − 24 = 0 °C.", "4 · 6 = 24 °C ga pasayadi: 24 − 24 = 0 °C."),
            hint: tr("На каждые 1000 м подъёма температура снижается на 6 °C.", "Әр 1000 м сайын температура 6 °C-қа төмендейді.", "Har 1000 m da harorat 6 °C ga pasayadi."),
            errorCategory: "lapse_rate"
          }
        ]
      },
      {
        topicId: "geo_kz_economy",
        title: tr("Экономические районы и природно-ресурсный потенциал Казахстана", "Қазақстанның экономикалық аудандары мен табиғи-ресурстық әлеуеті", "Qozog‘istonнинг iqtisodiy rayonlari va tabiiy resurs salohiyati"),
        sectionTitle: tr("Экономическая география РК", "ҚР экономикалық географиясы", "QR iqtisodiy geografiyasi"),
        difficulty: "advanced",
        prereqs: ["geo_atmosphere_temp"],
        goal: tr("Знать специализацию 5 экономических районов РК (Северный, Центральный, Восточный, Западный, Южный) и крупнейшие месторождения.", "Қазақстанның 5 экономикалық ауданының мамандануы мен ірі кен орындарын білу.", "Qozog‘istonning 5 ta iqtisodiy rayoni ixtisoslashuvi va yirik konlarini bilish."),
        simpleExplanation: tr(
          "Западный Казахстан — главный нефтегазовый регион (Тенгиз, Кашаган, Карачаганак) и хромиты (Хромтау). Центральный — уголь (Караганда) и медь (Жезказган, Балхаш). Восточный — полиметаллы, титан, магний и ГЭС на Иртыше. Северный — железная руда (ССГПО), бокситы и зерно.",
          "Батыс Қазақстан — мұнай-газ (Теңіз, Қашаған, Қарашығанақ) және хромит. Орталық — көмір (Қарағанды) мен мыс (Жезқазған).",
          "G‘arbiy Qozog‘iston — neft-gaz (Tengiz, Qashag‘an, Qorachig‘anoq). Markaziy — ko‘mir va mis."
        ),
        detailedExplanation: tr(
          "По классификации Н. Н. Баранского территория Казахстана делится на 5 экономических районов: Западный, Северный, Центральный, Восточный и Южный.",
          "Н. Н. Баранский бойынша Қазақстан 5 экономикалық ауданға бөлінеді: Батыс, Солтүстік, Орталық, Шығыс, Оңтүстік.",
          "Qozog‘iston 5 ta iqtisodiy rayonga bo‘linadi: G‘arbiy, Shimoliy, Markaziy, Sharqiy va Janubiy."
        ),
        workedExample: {
          problem: tr("Соотнесите экономический район Казахстана и его ключевую отрасль специализации.", "Қазақстанның экономикалық ауданы мен оның негізгі маманданған саласын сәйкестендіріңіз.", "Qozog‘iston iqtisodiy rayoni va uning asosiy ixtisoslashган tarmog‘ini moslashtiring."),
          steps: {
            ru: ["1) Западный РК → добыча нефти, газа и хромовых руд", "2) Восточный РК → цветная металлургия (свинец, цинк, титан) и гидроэнергетика"],
            kk: ["1) Батыс ҚР → мұнай, газ және хром өндіру", "2) Шығыс ҚР → түсті металлургия және су энергетикасы"],
            uz: ["1) G‘arbiy QR → neft, gaz va xrom qazib olish", "2) Sharqiy QR → rangli metallurgiya va gidroenergetika"]
          },
          takeaway: tr("Тенгиз/Кашаган — Запад, Соколовско-Сарбайское — Север, Жезказган/Караганда — Центр, Риддер — Восток.", "Теңіз/Қашаған — Батыс, ССГПО — Солтүстік, Жезқазған — Орталық, Риддер — Шығыс.", "Tengiz/Qashag‘an — G‘arb, Jeezqazg‘an — Markaz, Ridder — Sharq.")
        },
        block: {
          type: "table",
          title: tr("5 экономических районов РК", "ҚР 5 экономикалық ауданы", "QR 5 ta iqtisodiy rayoni"),
          body: tr("Западный (Атырау, Мангистау, ЗКО, Актобе) | Северный (Костанай, СКО, Акмола, Павлодар) | Центральный (Караганда, Улытау) | Восточный (ВКО, Абай) | Южный (Алматы, Жетысу, Жамбыл, Туркестан, Кызылорда)", "Батыс | Солтүстік | Орталық | Шығыс | Оңтүстік", "G‘arbiy | Shimoliy | Markaziy | Sharqiy | Janubiy")
        },
        summary: tr("Систематизированы экономические районы Казахстана и их ресурсная специализация.", "Қазақстанның экономикалық аудандары мен ресурстық мамандануы жүйеленді.", "Qozog‘iston iqtisodiy rayonlari va resurs ixtisoslashuvi tizimlashtirildi."),
        questions: [
          {
            id: "geo-q3",
            subjectId: "geography",
            topicId: "geo_kz_economy",
            lessonId: "geography-lesson-geo_kz_economy",
            type: "single_choice",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("В каком экономическом районе Казахстана расположены крупнейшие нефтегазовые месторождения Тенгиз, Кашаган и Карачаганак?", "Теңіз, Қашаған және Қарашығанақ ірі мұнай-газ кен орындары Қазақстанның қай экономикалық ауданында орналасқан?", "Tengiz, Qashag‘an va Qorachig‘anoq yirik neft-gaz konlari Qozog‘istonning qaysi iqtisodiy rayonida joylashgan?"),
            options: {
              ru: ["Западный Казахстан", "Восточный Казахстан", "Северный Казахстан", "Центральный Казахстан"],
              kk: ["Батыс Қазақстан", "Шығыс Қазақстан", "Солтүстік Қазақстан", "Орталық Қазақстан"],
              uz: ["G‘arbiy Qozog‘iston", "Sharqiy Qozog‘iston", "Shimoliy Qozog‘iston", "Markaziy Qozog‘iston"]
            },
            correctIndex: 0,
            explanation: tr("Прикаспийская впадина и месторождения Тенгиз, Кашаган, Карачаганак находятся в Западном экономическом районе РК.", "Теңіз, Қашаған және Қарашығанақ Батыс Қазақстан экономикалық ауданында орналасқан.", "Tengiz, Qashag‘an va Qorachig‘anoq G‘arbiy Qozog‘iston iqtisodiy rayonida joylashgan."),
            hint: tr("Вспомните регион Прикаспия (Атырауская и Западно-Казахстанская области).", "Каспий маңы аймағын еске түсіріңіз.", "Kaspiybo‘yi hududini eslang."),
            errorCategory: "economic_regions"
          }
        ]
      }
    ],
    errorLab: {
      id: "geo-err-scale",
      subjectId: "geography",
      topicId: "geo_cartography_scale",
      title: tr("Ошибка перевода численного масштаба в километры (зачеркнули 3 нуля вместо 5)", "Сандық масштабты километрге ауыстыру қатесі (5 нөлдің орнына 3 нөл сызу)", "Sonli masshtabni kilometrga o‘tkazish xatosi"),
      taskPrompt: tr("Проверьте перевод масштаба 1 : 300 000 в именованный (в км):", "1 : 300 000 масштабын атаулы масштабқа (км) айналдыруды тексеріңіз:", "1 : 300 000 masshtabini nomli masshtabga (km) o‘tkazishni tekshiring:"),
      steps: {
        ru: [
          "1) Численный масштаб карты равен 1 : 300 000 (в 1 см — 300 000 см).",
          "2) Так как в 1 км 1000 м, убираем три нуля и получаем: в 1 см — 300 км.",
          "3) Для отрезка 4 см на карте получаем 4 · 300 = 1200 км."
        ],
        kk: [
          "1) Картаның сандық масштабы 1 : 300 000.",
          "2) 1 км-де 1000 м болғандықтан, үш нөлді алып тастап, 1 см-де 300 км аламыз.",
          "3) 4 см кесінді үшін 4 · 300 = 1200 км шығады."
        ],
        uz: [
          "1) Xaritaning sonli masshtabi 1 : 300 000.",
          "2) 1 km da 1000 m bo‘lgani uchun uchta nolni olib, 1 sm da 300 km olamiz.",
          "3) 4 sm kesma uchun 4 · 300 = 1200 km chiqadi."
        ]
      },
      brokenStepIndex: 1,
      errorCategory: "scale_conversion",
      whyBroken: tr(
        "Численный масштаб записан в сантиметрах, а в 1 км содержится 100 000 см (5 нулей), а не 1000. Поэтому 1 : 300 000 означает в 1 см 3 км.",
        "Сандық масштаб сантиметрмен беріледі, ал 1 км = 100 000 см (5 нөл). Сондықтан 1 см-де 3 км болады.",
        "Sonli masshtab santimetrda beriladi, 1 km = 100 000 sm (5 ta nol). Shuning uchun 1 sm da 3 km bo‘ladi."
      ),
      correctedStep: tr("2) Убираем 5 нулей (1 км = 100 000 см): в 1 см — 3 км; для 4 см расстояние равно 12 км.", "2) 5 нөлді алып тастаймыз: 1 см-де 3 км; 4 см = 12 км.", "2) 5 ta nolni olib tashlaymiz: 1 sm da 3 km; 4 sm = 12 km."),
      transferQuestion: {
        id: "geo-err-transfer",
        subjectId: "geography",
        topicId: "geo_cartography_scale",
        lessonId: "geography-lesson-geo_cartography_scale",
        type: "numeric",
        difficulty: "basic",
        maxPoints: 1,
        prompt: tr("Сколько километров на местности соответствует 1 см на карте масштаба 1 : 700 000?", "Масштабы 1 : 700 000 картадағы 1 см жергілікті жердегі неше километрге сәйкес келеді?", "Masshtabi 1 : 700 000 bo‘lgan xaritadagi 1 sm joyda necha kilometrga teng?"),
        numericAnswer: 7,
        unit: "км",
        explanation: tr("700 000 см / 100 000 = 7 км.", "700 000 / 100 000 = 7 км.", "700 000 / 100 000 = 7 km."),
        hint: tr("Разделите 700 000 на 100 000 (уберите 5 нулей).", "700 000 санынан 5 нөлді алып тастаңыз.", "700 000 sonidan 5 ta nolni olib tashlang."),
        errorCategory: "scale_conversion"
      }
    }
  },
  {
    id: "world_history",
    category: "humanities",
    iconName: "Landmark",
    levels: {
      ru: ["Древний мир и Средневековье", "Новое время и промышленные революции", "Новейшая история и международные отношения XX–XXI вв."],
      kk: ["Ежелгі дүние және Орта ғасырлар", "Жаңа заман және өнеркәсіптік революциялар", "Қазіргі заман тарихы (XX–XXI ғғ.)"],
      uz: ["Qadimgi dunyo va O‘rta asrlar", "Yangi davr va sanoat inqiloblari", "Eng yangi tarix (XX–XXI asrlar)"]
    },
    lessonsData: [
      {
        topicId: "wh_ancient_civilizations",
        title: tr("Цивилизации Древнего Востока и Античности (законы Хаммурапи, полисы Греции и Рим)", "Ежелгі Шығыс пен Антикалық өркениеттер", "Qadimgi Sharq va Antik sivilizatsiyalar"),
        sectionTitle: tr("Древний мир", "Ежелгі дүние", "Qadimgi dunyo"),
        difficulty: "basic",
        prereqs: [],
        goal: tr("Соотносить древние цивилизации (Месопотамия, Египет, Греция, Рим) с их правовыми памятниками и реформами.", "Ежелгі өркениеттерді олардың заңдарымен және реформаларымен сәйкестендіру.", "Qadimgi sivilizatsiyalarni ularning qonunlari va islohotlari bilan moslashtirish."),
        simpleExplanation: tr(
          "Законы царя Хаммурапи были созданы в Древнем Вавилоне (XVIII в. до н.э.). Основы афинской демократии заложил архонт Солон в 594 г. до н.э. (отмена долгового рабства — сисахфия), а расцвет демократии пришёлся на правление стратега Перикла (V в. до н.э.).",
          "Хаммурапи заңдары Ежелгі Вавилонда (б.з.б. XVIII ғ.) жазылды. Афина демократиясының негізін б.з.б. 594 ж. Солон қалады.",
          "Xammurapi qonunlari Qadimgi Bobilda (mil. avv. XVIII asr) yaratilgan. Afina demokratiyasiga mil. avv. 594-yilda Solon asos solgan."
        ),
        detailedExplanation: tr(
          "В Древнем Риме в 509 г. до н.э. была установлена Республика, в V в. до н.э. приняты «Законы XII таблиц», а в VI в. н.э. при византийском императоре Юстиниане составлен «Свод гражданского права» (Corpus Juris Civilis).",
          "Ежелгі Римде б.з.б. V ғ. «XII кесте заңдары» қабылданды.",
          "Qadimgi Rimda mil. avv. V asrda «XII jadval qonunlari» qabul qilingan."
        ),
        workedExample: {
          problem: tr("Кто провёл реформу в Афинах в 594 г. до н.э., отменившую долговое рабство демосa?", "Б.з.б. 594 жылы Афинада борыштық құлдықты жойған реформатор кім?", "Mil. avv. 594-yilda Afinada qarz qulligini bekor qilgan islohotchi kim?"),
          steps: {
            ru: ["1) Вспоминаем реформаторов Афин: Драконт (суровые законы), Солон (594 г. до н.э., отмена долгового рабства), Клисфен (территориальные филы), Перикл (оплата должностей)", "2) Ответ: Солон"],
            kk: ["1) Б.з.б. 594 ж. борыштық құлдықты жойған архонт — Солон", "2) Жауабы: Солон"],
            uz: ["1) Mil. avv. 594-yilda qarz qulligini bekor qilgan arxont — Solon", "2) Javob: Solon"]
          },
          takeaway: tr("Хаммурапи — Вавилон; Солон и Перикл — Афины; Ликург — Спарта; XII таблиц — Рим.", "Хаммурапи — Вавилон; Солон мен Перикл — Афина; XII кесте — Рим.", "Xammurapi — Bobil; Solon va Perikl — Afina; XII jadval — Rim.")
        },
        block: {
          type: "table",
          title: tr("Правовые памятники Древнего мира", "Ежелгі дүние заңдары", "Qadimgi dunyo qonunlari"),
          body: tr("Вавилон: Законы Хаммурапи (XVIII в. до н.э.) | Индия: Законы Ману | Афины: Реформы Солона (594 г. до н.э.) | Рим: Законы XII таблиц (V в. до н.э.)", "Вавилон: Хаммурапи заңдары | Үндістан: Ману заңдары | Афина: Солон реформалары | Рим: XII кесте заңдары", "Bobil: Xammurapi qonunlari | Hindiston: Manu qonunlari | Afina: Solon islohotlari | Rim: XII jadval qonunlari")
        },
        summary: tr("Изучены ключевые реформы и своды законов цивилизаций Древнего мира.", "Ежелгі дүние өркениеттерінің реформалары мен заңдары меңгерілді.", "Qadimgi dunyo sivilizatsiyalari islohotlari va qonunlari o‘zlashtirildi."),
        questions: [
          {
            id: "wh-q1",
            subjectId: "world_history",
            topicId: "wh_ancient_civilizations",
            lessonId: "world_history-lesson-wh_ancient_civilizations",
            type: "single_choice",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("В каком древнем государстве в XVIII веке до н.э. был создан знаменитый свод законов царя Хаммурапи?", "Б.з.б. XVIII ғасырда Хаммурапи патшаның заңдар жинағы қай ежелгі мемлекетте жасалды?", "Mil. avv. XVIII asrda podsho Xammurapi qonunlar to‘plami qaysi qadimgi davlatda tuzilgan?"),
            options: {
              ru: ["Вавилонское царство", "Древний Египет", "Хеттское царство", "Финикия"],
              kk: ["Вавилон патшалығы", "Ежелгі Мысыр", "Хетт патшалығы", "Финикия"],
              uz: ["Bobil podsholigi", "Qadimgi Misr", "Xett podsholigi", "Finikiya"]
            },
            correctIndex: 0,
            explanation: tr("Хаммурапи правил Вавилонским царством в Месопотамии (1792–1750 гг. до н.э.).", "Хаммурапи Қосөзендегі Вавилон патшалығын басқарды.", "Xammurapi Mesopotamiyadagi Bobil podsholigini boshqargan."),
            hint: tr("Это государство находилось в Междуречье Тигра и Евфрата.", "Бұл мемлекет Тигр мен Евфрат өзендерінің аралығында орналасқан.", "Bu davlat Dajla va Frot daryolari oralig‘ida joylashgan."),
            errorCategory: "ancient_states"
          }
        ]
      },
      {
        topicId: "wh_modern_revolutions",
        title: tr("Эпоха Просвещения, промышленный переворот и Великая французская революция", "Ағартушылық дәуірі, өнеркәсіптік төңкеріс және Ұлы француз революциясы", "Ma’rifatпарварлик davri, sanoat to‘ntarishi va Buyuk fransuz inqilobi"),
        sectionTitle: tr("Новое время", "Жаңа заман", "Yangi davr"),
        difficulty: "intermediate",
        prereqs: ["wh_ancient_civilizations"],
        goal: tr("Знать теорию разделения властей Монтескьё, хронологию Войны за независимость США (1775–1783) и Великой французской революции (1789).", "Монтескьенің билікті бөлу теориясын, АҚШ тәуелсіздік соғысы (1775–1783) мен Француз революциясын (1789) білу.", "Monteskyening hokimiyatlar bo‘linishi nazariyasi, AQSH mustaqillik urushi va Fransuz inqilobini bilish."),
        simpleExplanation: tr(
          "Мыслители Просвещения (Локк, Монтескьё, Вольтер, Руссо) обосновали разделение властей на законодательную, исполнительную и судебную. 4 июля 1776 г. принята Декларация независимости США (Т. Джефферсон), а 14 июля 1789 г. взятием Бастилии началась Великая французская революция.",
          "1776 ж. 4 шілдеде АҚШ Тәуелсіздік декларациясы қабылданды, ал 1789 ж. 14 шілдеде Бастилияны алумен Ұлы француз революциясы басталды.",
          "1776-yil 4-iyulda AQSH Mustaqillik deklaratsiyasi qabul qilindi, 1789-yil 14-iyulda эса Buyuk fransuz inqilobi boshlandi."
        ),
        detailedExplanation: tr(
          "В 1789 году Учредительное собрание Франции приняло «Декларацию прав человека и гражданина», провозгласившую свободу, равенство, неприкосновенность собственности и народный суверенитет.",
          "1789 жылы Францияда «Адам және азамат құқықтарының декларациясы» қабылданды.",
          "1789-yilda Fransiyada «Inson va fuqaro huquqlari deklaratsiyasi» qabul qilindi."
        ),
        workedExample: {
          problem: tr("Какой документ был принят во Франции 26 августа 1789 года в начале революции?", "1789 жылы 26 тамызда Францияда революция басында қандай құжат қабылданды?", "1789-yil 26-avgustda Fransiyada inqilob boshida qanday hujjat qabul qilingan?"),
          steps: {
            ru: ["1) Взятие Бастилии — 14 июля 1789 г.", "2) 26 августа 1789 г. принята «Декларация прав человека и гражданина»"],
            kk: ["1) 1789 ж. 14 шілде — Бастилияны алу", "2) 1789 ж. 26 тамыз — «Адам және азамат құқықтарының декларациясы»"],
            uz: ["1) 1789-yil 14-iyul — Bastiliyaning olinishi", "2) 1789-yil 26-avgust — «Inson va fuqaro huquqlari deklaratsiyasi»"]
          },
          takeaway: tr("1689 — Билль о правах (Англия); 1776 — Декларация независимости (США); 1789 — Декларация прав человека и гражданина (Франция).", "1689 — Англия; 1776 — АҚШ; 1789 — Франция.", "1689 — Angliya; 1776 — AQSH; 1789 — Fransiya.")
        },
        block: {
          type: "source_doc",
          title: tr("Шарль Луи Монтескьё «О духе законов» (1748)", "Шарль Луи Монтескье «Заңдар рухы туралы» (1748)", "Sharl Lui Monteskye «Qonunlar ruhi haqida» (1748)"),
          body: tr("Чтобы не было возможности злоупотреблять властью, необходим такой порядок вещей, при котором законодательная, исполнительная и судебная власти сдерживают друг друга.", "Билікті асыра пайдаланбау үшін заң шығарушы, атқарушы және сот билігі бір-бірін тежеп отыруы тиіс.", "Hokimiyatni suiiste’mol qilmaslik uchun qonun chiqaruvchi, ijro etuvchi va sud hokimiyatlari bir-birini tiyib turishi zarur.")
        },
        summary: tr("Освоены идеи Просвещения и ключевые революции Нового времени.", "Ағартушылық идеялары мен Жаңа заман революциялары меңгерілді.", "Ma’rifatparvarlik g‘oyalari va Yangi davr inqiloblari o‘zlashtirildi."),
        questions: [
          {
            id: "wh-q2",
            subjectId: "world_history",
            topicId: "wh_modern_revolutions",
            lessonId: "world_history-lesson-wh_modern_revolutions",
            type: "single_choice",
            difficulty: "intermediate",
            maxPoints: 1,
            prompt: tr("Кто был основным автором Декларации независимости США, принятой 4 июля 1776 года?", "1776 жылы 4 шілдеде қабылданған АҚШ Тәуелсіздік декларациясының негізгі авторы кім?", "1776-yil 4-iyulda qabul qilingan AQSH Mustaqillik deklaratsiyasining asosiy muallifi kim?"),
            options: {
              ru: ["Томас Джефферсон", "Авраам Линкольн", "Франклин Рузвельт", "Оливер Кромвель"],
              kk: ["Томас Джефферсон", "Авраам Линкольн", "Франклин Рузвельт", "Оливер Кромвель"],
              uz: ["Tomas Jefferson", "Avraam Linkoln", "Franklin Ruzvelt", "Oliver Kromvel"]
            },
            correctIndex: 0,
            explanation: tr("Проект Декларации независимости США (1776 г.) написал Томас Джефферсон.", "АҚШ Тәуелсіздік декларациясының (1776 ж.) авторы — Томас Джефферсон.", "AQSH Mustaqillik deklaratsiyasi (1776-y.) muallifi — Tomas Jefferson."),
            hint: tr("Он стал третьим президентом США и одним из отцов-основателей.", "Ол АҚШ-тың негізін қалаушы әкелердің бірі және үшінші президенті.", "U AQSH asoschilaridan biri va uchinchi prezidenti bo‘lgan."),
            errorCategory: "historical_personalities"
          }
        ]
      },
      {
        topicId: "wh_20th_century_intl",
        title: tr("Международные отношения XX века: Версальско-Вашингтонская и Ялтинско-Потсдамская системы", "XX ғасырдағы халықаралық қатынастар: Версаль-Вашингтон және Ялта-Потсдам жүйелері", "XX asr xalqaro munosabatlari: Versal-Vashington va Yalta-Potsdam tizimlari"),
        sectionTitle: tr("Новейшая история", "Қазіргі заман тарихы", "Eng yangi tarix"),
        difficulty: "advanced",
        prereqs: ["wh_modern_revolutions"],
        goal: tr("Чётко разграничивать итоги Первой мировой войны (Лига Наций, 1919) и Второй мировой войны (ООН, 1945).", "Бірінші дүниежүзілік соғыс (Ұлттар Лигасы, 1919) пен Екінші дүниежүзілік соғыс (БҰҰ, 1945) қорытындыларын ажырату.", "Birinchi jahon urushi (Millatlar Ligasi, 1919) va Ikkinchi jahon urushi (BMT, 1945) yakunlarini farqlash."),
        simpleExplanation: tr(
          "После Первой мировой войны (1914–1918) на Парижской мирной конференции 1919 г. был подписан Версальский договор и создана Лига Наций. После Второй мировой войны (1939–1945) на конференциях в Ялте и Потсдаме (1945) сформирована биполярная система и создана ООН.",
          "Бірінші дүниежүзілік соғыстан кейін 1919 ж. Версаль шарты жасалып, Ұлттар Лигасы құрылды. Екінші дүниежүзілік соғыстан кейін 1945 ж. БҰҰ құрылды.",
          "Birinchi jahon urushidan keyin 1919-yilda Versal shartnomasi imzolanib, Millatlar Ligasi tuzildi. Ikkinchi jahon urushidan keyin 1945-yilda BMT tashkil topdi."
        ),
        detailedExplanation: tr(
          "В 1929–1933 гг. разразился мировой экономический кризис («Великая депрессия»), из которого США выходили с помощью реформ «Нового курса» (New Deal) президента Франклина Делано Рузвельта.",
          "1933 жылдан бастап АҚШ президенті Ф. Д. Рузвельт «Жаңа бағыт» (New Deal) реформаларын жүргізді.",
          "1933-yildan AQSH prezidenti F. D. Ruzvelt «Yangi yo‘nalish» (New Deal) islohotlarini amalga oshirdi."
        ),
        workedExample: {
          problem: tr("Какая международная организация была учреждена в 1919 году по итогам Парижской мирной конференции, а какая — в 1945 году на конференции в Сан-Франциско?", "1919 жылы Париж конференциясында және 1945 жылы Сан-Франциско конференциясында қандай халықаралық ұйымдар құрылды?", "1919-yil Parij konferensiyasida va 1945-yil San-Fransisko konferensiyasida qaysi xalqaro tashkilotlar tuzilgan?"),
          steps: {
            ru: ["1) 1919 г. (Париж / Версаль) → Лига Наций", "2) 1945 г. (Сан-Франциско) → Организация Объединённых Наций (ООН)"],
            kk: ["1) 1919 ж. → Ұлттар Лигасы", "2) 1945 ж. → Біріккен Ұлттар Ұйымы (БҰҰ)"],
            uz: ["1) 1919-y. → Millatlar Ligasi", "2) 1945-y. → Birlashgan Millatlar Tashkiloti (BMT)"]
          },
          takeaway: tr("1919 = Версаль + Лига Наций; 1945 = Ялта/Потсдам + ООН.", "1919 = Версаль + Ұлттар Лигасы; 1945 = Ялта/Потсдам + БҰҰ.", "1919 = Versal + Millatlar Ligasi; 1945 = Yalta/Potsdam + BMT.")
        },
        block: {
          type: "table",
          title: tr("Системы международных отношений XX века", "XX ғасырдағы халықаралық қатынастар жүйелері", "XX asr xalqaro munosabatlar tizimlari"),
          body: tr("Версальско-Вашингтонская (1919–1922): после Первой мировой войны, Лига Наций | Ялтинско-Потсдамская (1945): после Второй мировой войны, ООН, биполярный мир", "Версаль-Вашингтон (1919–1922): Ұлттар Лигасы | Ялта-Потсдам (1945): БҰҰ", "Versal-Vashington (1919–1922): Millatlar Ligasi | Yalta-Potsdam (1945): BMT")
        },
        summary: tr("Систематизированы международные договоры и организации XX века.", "XX ғасырдағы халықаралық шарттар мен ұйымдар жүйеленді.", "XX asr xalqaro shartnomalari va tashkilotlari tizimlashtirildi."),
        questions: [
          {
            id: "wh-q3",
            subjectId: "world_history",
            topicId: "wh_20th_century_intl",
            lessonId: "world_history-lesson-wh_20th_century_intl",
            type: "single_choice",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("Какая программа антикризисных реформ проводилась в США с 1933 года президентом Франклином Рузвельтом для преодоления «Великой депрессии»?", "1933 жылдан бастап АҚШ-та «Ұлы күйзелісті» еңсеру үшін президент Франклин Рузвельт жүргізген реформалар бағдарламасы қалай аталды?", "1933-yildan AQSHda «Buyuk depressiya»ni yengish uchun prezident Franklin Ruzvelt o‘tkazgan islohotlar dasturi qanday nomlangan?"),
            options: {
              ru: ["«Новый курс» (New Deal)", "«План Маршалла»", "«Справедливый курс»", "«Новые рубежи»"],
              kk: ["«Жаңа бағыт» (New Deal)", "«Маршалл жоспары»", "«Әділетті бағыт»", "«Жаңа шептер»"],
              uz: ["«Yangi yo‘nalish» (New Deal)", "«Marshall rejasi»", "«Adolatli yo‘nalish»", "«Yangi marralar»"]
            },
            correctIndex: 0,
            explanation: tr("Антикризисная политика Ф. Д. Рузвельта (1933–1939) вошла в историю под названием «Новый курс» (New Deal).", "Ф. Д. Рузвельттің дағдарысқа қарсы саясаты «Жаңа бағыт» (New Deal) деп аталды.", "F. D. Ruzveltning inqirozga qarshi siyosati «Yangi yo‘nalish» (New Deal) deb atalgan."),
            hint: tr("План Маршалла был принят после Второй мировой войны (1947 г.), а в 1933 г. действовал курс Рузвельта.", "Маршалл жоспары 1947 жылы қабылданған, ал 1933 жылы Рузвельттің бағдарламасы болды.", "Marshall rejasi 1947-yilda qabul qilingan, 1933-yilda esa Ruzvelt dasturi amal qilgan."),
            errorCategory: "chronology_order"
          }
        ]
      }
    ],
    errorLab: {
      id: "wh-err-treaties",
      subjectId: "world_history",
      topicId: "wh_20th_century_intl",
      title: tr("Смешение Версальской (1919) и Ялтинской (1945) мирных систем", "Версаль (1919) және Ялта (1945) жүйелерін шатастыру", "Versal (1919) va Yalta (1945) tizimlarini adashtirish"),
      taskPrompt: tr("Проверьте историческое резюме об итогах Первой мировой войны:", "Бірінші дүниежүзілік соғыс қорытындылары туралы анықтаманы тексеріңіз:", "Birinchi jahon urushi yakunlari haqidagi ma’lumotni tekshiring:"),
      steps: {
        ru: [
          "1) Первая мировая война завершилась подписанием Компьенского перемирия 11 ноября 1918 года.",
          "2) В 1919 году на Парижской мирной конференции была учреждена Организация Объединённых Наций (ООН) и разделена Германия на 4 зоны оккупации.",
          "3) В 1921–1922 годах Вашингтонская конференция закрепила баланс сил в Азиатско-Тихоокеанском регионе."
        ],
        kk: [
          "1) Бірінші дүниежүзілік соғыс 1918 жылы 11 қарашада Компьен бітімімен аяқталды.",
          "2) 1919 жылы Париж конференциясында БҰҰ құрылып, Германия 4 оккупациялық аймаққа бөлінді.",
          "3) 1921–1922 жылдары Вашингтон конференциясы өтті."
        ],
        uz: [
          "1) Birinchi jahon urushi 1918-yil 11-noyabrda Kompyen yarashuvi bilan yakunlandi.",
          "2) 1919-yilda Parij konferensiyasida BMT tuzilib, Germaniya 4 ta okkupatsiya zonasiga bo‘lindi.",
          "3) 1921–1922-yillarda Vashington konferensiyasi bo‘lib o‘tdi."
        ]
      },
      brokenStepIndex: 1,
      errorCategory: "chronology_order",
      whyBroken: tr(
        "ООН и раздел Германии на 4 зоны оккупации — это итоги Второй мировой войны (1945 г.), а в 1919 г. на Парижской конференции был подписан Версальский договор и создана Лига Наций.",
        "БҰҰ мен Германияны 4 аймаққа бөлу — 1945 жылғы Екінші дүниежүзілік соғыс қорытындысы. Ал 1919 жылы Ұлттар Лигасы құрылды.",
        "BMT va Germaniyani 4 zonaga bo‘lish — 1945-yilgi Ikkinchi jahon urushi yakuni. 1919-yilda esa Millatlar Ligasi tuzilgan."
      ),
      correctedStep: tr("2) В 1919 году на Парижской мирной конференции был подписан Версальский мирный договор и создана Лига Наций.", "2) 1919 жылы Париж конференциясында Версаль шартына қол қойылып, Ұлттар Лигасы құрылды.", "2) 1919-yilda Parij konferensiyasida Versal shartnomasi imzolanib, Millatlar Ligasi tuzildi."),
      transferQuestion: {
        id: "wh-err-transfer",
        subjectId: "world_history",
        topicId: "wh_20th_century_intl",
        lessonId: "world_history-lesson-wh_20th_century_intl",
        type: "single_choice",
        difficulty: "basic",
        maxPoints: 1,
        prompt: tr("Какая международная организация была создана в 1919 году по итогам Парижской мирной конференции?", "1919 жылы Париж бейбіт конференциясының қорытындысы бойынша қандай халықаралық ұйым құрылды?", "1919-yilda Parij tinchlik konferensiyasi yakuniga ko‘ra qaysi xalqaro tashkilot tuzilgan?"),
        options: {
          ru: ["Лига Наций", "Организация Объединённых Наций (ООН)", "НАТО", "Европейский союз"],
          kk: ["Ұлттар Лигасы", "Біріккен Ұлттар Ұйымы (БҰҰ)", "НАТО", "Еуропалық Одақ"],
          uz: ["Millatlar Ligasi", "Birlashgan Millatlar Tashkiloti (BMT)", "NATO", "Yevropa Ittifoqi"]
        },
        correctIndex: 0,
        explanation: tr("Устав Лиги Наций стал частью Версальского мирного договора 1919 года.", "Ұлттар Лигасының жарғысы 1919 жылғы Версаль шартының бөлігі болды.", "Millatlar Ligasi ustavi 1919-yilgi Versal shartnomasining qismi bo‘lgan."),
        hint: tr("Предшественница ООН, созданная после Первой мировой войны.", "Бірінші дүниежүзілік соғыстан кейін құрылған ұйым.", "Birinchi jahon urushidan keyin tuzilgan tashkilot."),
        errorCategory: "chronology_order"
      }
    }
  },
  {
    id: "law",
    category: "humanities",
    iconName: "Scale",
    levels: {
      ru: ["Конституционное и административное право РК", "Гражданское, трудовое и семейное право РК", "Уголовное право и процессуальные основы (ЕНТ)"],
      kk: ["ҚР Конституциялық және әкімшілік құқығы", "ҚР Азаматтық, еңбек және отбасы құқығы", "Қылмыстық құқық негіздері (ҰБТ)"],
      uz: ["QR Konstitutsiyaviy va ma’muriy huquqi", "Fuqarolik, mehnat va oila huquqi", "Jinoyat huquqi asoslari"]
    },
    lessonsData: [
      {
        topicId: "law_constitution_rk",
        title: tr("Конституционное право Республики Казахстан", "Қазақстан Республикасының Конституциялық құқығы", "Qozog‘iston Respublikasining Konstitutsiyaviy huquqi"),
        sectionTitle: tr("Конституционное право", "Конституциялық құқық", "Konstitutsiyaviy huquq"),
        difficulty: "basic",
        prereqs: [],
        goal: tr("Знать структуру Конституции РК (30 августа 1995 г.), форму правления и полномочия Президента, Парламента (Сенат и Мажилис) и Правительства.", "ҚР Конституциясының (1995 ж. 30 тамыз) құрылымын, Парламент пен Президент өкілеттіктерін білу.", "QR Konstitutsiyasi (1995-yil 30-avgust) tuzilmasi, Parlament va Prezident vakolatlarini bilish."),
        simpleExplanation: tr(
          "Действующая Конституция РК принята на республиканском референдуме 30 августа 1995 года. Единственным источником государственной власти является народ. Парламент РК — высший представительный орган, осуществляющий законодательную власть, состоит из двух палат: Сената и Мажилиса.",
          "ҚР қолданыстағы Конституциясы 1995 жылы 30 тамызда референдумда қабылданды. Мемлекеттік биліктің бірден-бір бастауы — халық. Парламент Сенат пен Мәжілістен тұрады.",
          "QR Konstitutsiyasi 1995-yil 30-avgustda referendumda qabul qilingan. Davlat hokimiyatining yagona manbai — xalq. Parlament Senat va Majilisdan iborat."
        ),
        detailedExplanation: tr(
          "Согласно статье 1 Конституции, Республика Казахстан утверждает себя демократическим, светским, правовым и социальным государством, высшими ценностями которого являются человек, его жизнь, права и свободы.",
          "Конституцияның 1-бабына сәйкес ҚР өзін демократиялық, зайырлы, құқықтық және әлеуметтік мемлекет ретінде орнықтырады.",
          "Konstitutsiyaning 1-moddasiga ko‘ra QR o‘zini demokratik, dunyoviy, huquqiy va ijtimoiy davlat sifatida qaror toptiradi."
        ),
        workedExample: {
          problem: tr("Какой государственный орган в Республике Казахстан осуществляет законодательную власть и из каких палат он состоит?", "Қазақстан Республикасында заң шығару билігін қай орган жүзеге асырады және ол қандай палаталардан тұрады?", "Qozog‘iston Respublikasida qonun chiqaruvchi hokimiyatni qaysi organ amalga oshiradi va u qaysi palatalardan iborat?"),
          steps: {
            ru: ["1) Законодательную власть осуществляет Парламент РК", "2) Парламент состоит из двух палат, действующих на постоянной основе: Сената и Мажилиса"],
            kk: ["1) Заң шығару билігін ҚР Парламенті жүзеге асырады", "2) Парламент екі палатадан тұрады: Сенат және Мәжіліс"],
            uz: ["1) Qonun chiqaruvchi hokimiyatni QR Parlamenti amalga oshiradi", "2) Parlament ikki palatadan iborat: Senat va Majilis"]
          },
          takeaway: tr("Парламент — законодательная власть; Правительство — исполнительная власть; Верховный и местные суды — судебная власть.", "Парламент — заң шығарушы; Үкімет — атқарушы; Сот — сот билігі.", "Parlament — qonun chiqaruvchi; Hukumat — ijro etuvchi; Sud — sud hokimiyati.")
        },
        block: {
          type: "source_doc",
          title: tr("Конституция РК, Раздел I, Статья 1 и 3", "ҚР Конституциясы, I бөлім, 1 және 3-баптар", "QR Konstitutsiyasi, I bo‘lim, 1 va 3-moddalar"),
          body: tr("Статья 1: Высшими ценностями государства являются человек, его жизнь, права и свободы. Статья 3: Единственным источником государственной власти является народ.", "1-бап: Мемлекеттің ең қымбат қазынасы — адам және оның өмірі, құқықтары мен бостандықтары. 3-бап: Биліктің бірден-бір бастауы — халық.", "1-modda: Davlatning oliy qadriyati — inson, uning hayoti, huquq va erkinliklari. 3-modda: Hokimiyatning yagona manbai — xalq.")
        },
        summary: tr("Освоены конституционные основы РК и система разделения властей.", "ҚР конституциялық негіздері мен билік тармақтары меңгерілді.", "QR konstitutsiyaviy asoslari va hokimiyat tarmoqlari o‘zlashtirildi."),
        questions: [
          {
            id: "law-q1",
            subjectId: "law",
            topicId: "law_constitution_rk",
            lessonId: "law-lesson-law_constitution_rk",
            type: "single_choice",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("Кто является единственным источником государственной власти согласно статье 3 Конституции Республики Казахстан?", "ҚР Конституциясының 3-бабына сәйкес мемлекеттік биліктің бірден-бір бастауы кім?", "QR Konstitutsiyasining 3-moddasiga ko‘ra davlat hokimiyatining yagona manbai kim?"),
            options: {
              ru: ["Народ", "Парламент", "Правительство", "Конституционный Суд"],
              kk: ["Халық", "Парламент", "Үкімет", "Конституциялық Сот"],
              uz: ["Xalq", "Parlament", "Hukumat", "Konstitutsiyaviy Sud"]
            },
            correctIndex: 0,
            explanation: tr("По статье 3 Конституции РК единственным источником государственной власти является народ, осуществляющий власть через референдум и свободные выборы.", "3-бап бойынша мемлекеттік биліктің бірден-бір бастауы — халық.", "3-moddaga ko‘ra davlat hokimiyatining yagona manbai — xalqdir."),
            hint: tr("Вспомните понятие народного суверенитета в демократическом государстве.", "Демократиялық мемлекеттегі халық егемендігі ұғымын еске түсіріңіз.", "Demokratik davlatdagi xalq suvereniteti tushunchasini eslang."),
            errorCategory: "constitutional_norms"
          }
        ]
      },
      {
        topicId: "law_civil_capacity",
        title: tr("Гражданское и трудовое право РК: правоспособность и дееспособность", "ҚР Азаматтық және еңбек құқығы: құқық қабілеттілік пен әрекет қабілеттілік", "QR Fuqarolik va mehnat huquqi: huquq лаyoqati va muomala layoqati"),
        sectionTitle: tr("Гражданское и трудовое право", "Азаматтық және еңбек құқығы", "Fuqarolik va mehnat huquqi"),
        difficulty: "intermediate",
        prereqs: ["law_constitution_rk"],
        goal: tr("Чётко различать момент возникновения гражданской правоспособности (с рождения) и полной дееспособности (с 18 лет).", "Азаматтық құқық қабілеттілік (туған сәттен) пен толық әрекет қабілеттіліктің (18 жастан) басталу сәтін ажырату.", "Fuqarolik huquq layoqati (tug‘ilgandan) va to‘liq muomala layoqatining (18 yoshdan) boshlanishini farqlash."),
        simpleExplanation: tr(
          "Правоспособность (способность иметь права и нести обязанности) возникает в момент рождения и прекращается со смертью. Полная гражданская дееспособность (способность своими действиями приобретать права и создавать обязанности) наступает с 18 лет (совершеннолетия) или при эмансипации / вступлении в брак.",
          "Құқық қабілеттілік адам туған сәттен басталады. Ал толық әрекет қабілеттілік 18 жасқа толғанда пайда болады.",
          "Huquq layoqati inson tug‘ilgan paytdan boshlanadi. To‘liq muomala layoqati esa 18 yoshga to‘lganda vujudga keladi."
        ),
        detailedExplanation: tr(
          "По Трудовому кодексу РК заключение трудового договора по общему правилу допускается с гражданами, достигшими 16-летнего возраста (а с письменного согласия родителей на лёгкую работу — с 14–15 лет). Для работников от 16 до 18 лет установлена сокращённая продолжительность рабочего времени — не более 36 часов в неделю.",
          "ҚР Еңбек кодексі бойынша еңбек шартын жалпы тәртіппен 16 жасқа толған азаматтармен жасасуға жол беріледі.",
          "QR Mehnat kodeksiga ko‘ra mehnat shartnomasini umumiy qoida bo‘yicha 16 yoshga to‘lgan fuqarolar bilan tuzish mumkin."
        ),
        workedExample: {
          problem: tr("С какого возраста наступает полная гражданская дееспособность по Гражданскому кодексу РК, а с какого момента возникает правоспособность?", "ҚР Азаматтық кодексі бойынша толық әрекет қабілеттілік неше жастан басталады, ал құқық қабілеттілік қашан пайда болады?", "QR Fuqarolik kodeksiga ko‘ra to‘liq muomala layoqati necha yoshdan, huquq layoqati esa qachondan boshlanadi?"),
          steps: {
            ru: ["1) Гражданская правоспособность возникает с момента рождения", "2) Полная гражданская дееспособность наступает в полном объёме с 18 лет"],
            kk: ["1) Құқық қабілеттілік — туған сәттен", "2) Толық әрекет қабілеттілік — 18 жастан"],
            uz: ["1) Huquq layoqati — tug‘ilgan paytdan", "2) To‘liq muomala layoqati — 18 yoshdan"]
          },
          takeaway: tr("Иметь права (правоспособность) = с рождения; самостоятельно совершать любые сделки (полная дееспособность) = с 18 лет.", "Құқық қабілеттілік = туғаннан; толық әрекет қабілеттілік = 18 жастан.", "Huquq layoqati = tug‘ilgandan; to‘liq muomala layoqati = 18 yoshdan.")
        },
        block: {
          type: "table",
          title: tr("Возрастные пороги в праве РК", "ҚР құқығындағы жас шектері", "QR huquqidagi yosh chegaralari"),
          body: tr("0 лет (рождение): правоспособность | 14 лет: частичная дееспособность | 16 лет: трудовой договор (общий возраст) и адм. ответственность | 18 лет: полная дееспособность и активное избирательное право", "0 жас: құқық қабілеттілік | 14 жас: ішінара әрекет қабілеттілік | 16 жас: еңбек шарты | 18 жас: толық әрекет қабілеттілік", "0 yosh: huquq layoqati | 14 yosh: qisman muomala layoqati | 16 yosh: mehnat shartnomasi | 18 yosh: to‘liq muomala layoqati")
        },
        summary: tr("Разграничены понятия правоспособности, дееспособности и трудовых гарантий несовершеннолетних.", "Құқық қабілеттілік, әрекет қабілеттілік және еңбек кепілдіктері ажыратылды.", "Huquq layoqati, muomala layoqati va mehnat kafolatlari farqlandi."),
        questions: [
          {
            id: "law-q2",
            subjectId: "law",
            topicId: "law_civil_capacity",
            lessonId: "law-lesson-law_civil_capacity",
            type: "numeric",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("По достижении скольких лет гражданин РК приобретает гражданскую дееспособность в полном объёме (по общему правилу ст. 17 ГК РК)?", "ҚР Азаматтық кодексінің 17-бабы бойынша азамат неше жасқа толғанда толық әрекет қабілеттілікке ие болады?", "QR Fuqarolik kodeksining 17-moddasiga ko‘ra fuqaro necha yoshga to‘lganda to‘liq muomala layoqatiga ega bo‘ladi?"),
            numericAnswer: 18,
            explanation: tr("Согласно ст. 17 ГК РК способность гражданина своими действиями приобретать и осуществлять гражданские права в полном объёме возникает с наступлением совершеннолетия (18 лет).", "17-бапқа сәйкес толық әрекет қабілеттілік 18 жастан басталады.", "17-moddaga ko‘ra to‘liq muomala layoqati 18 yoshdan boshlanadi."),
            hint: tr("Возраст совершеннолетия в Республике Казахстан.", "Қазақстан Республикасындағы кәмелеттік жас.", "Qozog‘iston Respublikasida voyaga yetish yoshi."),
            errorCategory: "legal_capacity_age"
          }
        ]
      },
      {
        topicId: "law_criminal_admin",
        title: tr("Уголовная и административная ответственность: состав правонарушения и формы вины", "Қылмыстық және әкімшілік жауаптылық: құқық бұзушылық құрамы", "Jinoiy va ma’muriy javobgarlik: huquqbuzarlik tarkibi"),
        sectionTitle: tr("Публичное право", "Жария құқық", "Ommaviy huquq"),
        difficulty: "advanced",
        prereqs: ["law_civil_capacity"],
        goal: tr("Знать 4 элемента состава правонарушения (объект, объективная сторона, субъект, субъективная сторона) и общий возраст ответственности (16 лет, по тяжким составам УК — 14 лет).", "Құқық бұзушылық құрамының 4 элементін және жауаптылық жасын (16 жас, ауыр қылмыстар бойынша 14 жас) білу.", "Huquqbuzarlik tarkibining 4 ta elementi va javobgarlik yoshini (16 yosh, og‘ir jinoyatlar bo‘yicha 14 yosh) bilish."),
        simpleExplanation: tr(
          "Состав правонарушения включает 4 обязательных элемента: объект (охраняемые общественные отношения), объективную сторону (деяние, вред, причинная связь), субъект (вменяемое лицо, достигшее возраста ответственности) и субъективную сторону (вина в форме умысла или неосторожности).",
          "Құқық бұзушылық құрамы 4 элементтен тұрады: объект, объективтік жағы, субъект және субъективтік жағы (кінә: қасақаналық немесе абайсыздық).",
          "Huquqbuzarlik tarkibi 4 ta elementdan iborat: obyekt, obyektiv tomon, subyekt va subyektiv tomon (ayb: qasd yoki ehtiyotsizlik)."
        ),
        detailedExplanation: tr(
          "По общему правилу уголовная и административная ответственность в РК наступает с 16 лет, а за особо опасные умышленные преступления (убийство, кража, грабёж, разбой, вымогательство, терроризм) уголовная ответственность по ст. 15 УК РК наступает с 14 лет.",
          "Қылмыстық және әкімшілік жауаптылық жалпы ереже бойынша 16 жастан, ал ауыр қылмыстар үшін (ҚК 15-бабы) 14 жастан басталады.",
          "Jinoiy va ma’muriy javobgarlik umumiy qoida bo‘yicha 16 yoshdan, og‘ir jinoyatlar uchun (JK 15-moddasi) 14 yoshdan boshlanadi."
        ),
        workedExample: {
          problem: tr("К какому элементу состава правонарушения относятся вина (умысел или неосторожность), мотив и цель?", "Кінә (қасақаналық немесе абайсыздық), уәж және мақсат құқық бұзушылық құрамының қай элементіне жатады?", "Ayb (qasd yoki ehtiyotsizlik), motiv va maqsad huquqbuzarlik tarkibining qaysi elementiga kiradi?"),
          steps: {
            ru: ["1) Внутреннее психическое отношение лица к совершаемому деянию образует субъективную сторону", "2) Ответ: субъективная сторона правонарушения"],
            kk: ["1) Тұлғаның өз әрекетіне ішкі психикалық қатынасы — субъективтік жағы", "2) Жауабы: субъективтік жағы"],
            uz: ["1) Shaxsning o‘z qilmishiga ichki ruhiy munosabati — subyektiv tomon", "2) Javob: subyektiv tomon"]
          },
          takeaway: tr("Деяние, время, место, способ = объективная сторона; вина, мотив, цель = субъективная сторона.", "Әрекет, уақыт, орын = объективтік жағы; кінә, уәж, мақсат = субъективтік жағы.", "Harakat, vaqt, joy = obyektiv tomon; ayb, motiv, maqsad = subyektiv tomon.")
        },
        block: {
          type: "table",
          title: tr("4 элемента состава правонарушения", "Құқық бұзушылық құрамының 4 элементі", "Huquqbuzarlik tarkibining 4 ta elementi"),
          body: tr("Объект: общественные отношения | Объективная сторона: деяние (действие/бездействие), последствия, причинная связь | Субъект: физ./юр. лицо | Субъективная сторона: вина (умысел/неосторожность), мотив, цель", "Объект | Объективтік жағы | Субъект | Субъективтік жағы", "Obyekt | Obyektiv tomon | Subyekt | Subyektiv tomon")
        },
        summary: tr("Систематизированы элементы состава правонарушения и возраст уголовной и административной ответственности.", "Құқық бұзушылық құрамы мен жауаптылық жасы жүйеленді.", "Huquqbuzarlik tarkibi va javobgarlik yoshi tizimlashtirildi."),
        questions: [
          {
            id: "law-q3",
            subjectId: "law",
            topicId: "law_criminal_admin",
            lessonId: "law-lesson-law_criminal_admin",
            type: "single_choice",
            difficulty: "intermediate",
            maxPoints: 1,
            prompt: tr("К какому элементу состава правонарушения относится вина (прямой/косвенный умысел или неосторожность)?", "Кінә (тікелей/жанама қасақаналық немесе абайсыздық) құқық бұзушылық құрамының қай элементіне жатады?", "Ayb (to‘g‘ри/egri qasd yoki ehtiyotsizlik) huquqbuzarlik tarkibining qaysi elementiga kiradi?"),
            options: {
              ru: ["Субъективная сторона", "Объективная сторона", "Объект правонарушения", "Субъект правонарушения"],
              kk: ["Субъективтік жағы", "Объективтік жағы", "Құқық бұзушылық объектісі", "Құқық бұзушылық субъектісі"],
              uz: ["Subyektiv tomon", "Obyektiv tomon", "Huquqbuzarlik obyekti", "Huquqbuzarlik subyekti"]
            },
            correctIndex: 0,
            explanation: tr("Вина, мотив и цель характеризуют внутреннее отношение нарушителя к деянию и составляют субъективную сторону.", "Кінә, уәж және мақсат құқық бұзушылықтың субъективтік жағын құрайды.", "Ayb, motiv va maqsad huquqbuzarlikning subyektiv tomonini tashkil etadi."),
            hint: tr("Это внутреннее психическое отношение субъекта к своему поступку.", "Бұл субъектінің өз әрекетіне ішкі психикалық қатынасы.", "Bu subyektning o‘z qilmishiga ichki ruhiy munosabatidir."),
            errorCategory: "offense_elements"
          }
        ]
      }
    ],
    errorLab: {
      id: "law-err-capacity",
      subjectId: "law",
      topicId: "law_civil_capacity",
      title: tr("Путаница между моментом возникновения правоспособности и дееспособности", "Құқық қабілеттілік пен әрекет қабілеттіліктің басталу кезін шатастыру", "Huquq layoqati va muomala layoqati boshlanish vaqtini adashtirish"),
      taskPrompt: tr("Проверьте юридическое заключение по гражданскому праву РК:", "ҚР азаматтық құқығы бойынша заңгерлік қорытындыны тексеріңіз:", "QR fuqarolik huquqi bo‘yicha huquqiy xulosani tekshiring:"),
      steps: {
        ru: [
          "1) Гражданские права и обязанности регулируются Гражданским кодексом РК.",
          "2) Гражданская правоспособность (способность иметь права) возникает у гражданина только по достижении 18 лет.",
          "3) Полная гражданская дееспособность по общему правилу также наступает с 18 лет."
        ],
        kk: [
          "1) Азаматтық құқықтар мен міндеттер ҚР Азаматтық кодексімен реттеледі.",
          "2) Азаматтық құқық қабілеттілік азаматта тек 18 жасқа толғанда пайда болады.",
          "3) Толық әрекет қабілеттілік те жалпы ереже бойынша 18 жастан басталады."
        ],
        uz: [
          "1) Fuqarolik huquq va majburiyatlari QR Fuqarolik kodeksi bilan tartibga solinadi.",
          "2) Fuqarolik huquq layoqati fuqaroda faqat 18 yoshga to‘lganda vujudga keladi.",
          "3) To‘liq muomala layoqati ham umumiy qoida bo‘yicha 18 yoshdan boshlanadi."
        ]
      },
      brokenStepIndex: 1,
      errorCategory: "legal_capacity_age",
      whyBroken: tr(
        "Согласно ст. 13 ГК РК гражданская правоспособность признаётся в равной мере за всеми гражданами и возникает в момент рождения, а не в 18 лет.",
        "ҚР АК 13-бабына сәйкес құқық қабілеттілік 18 жаста емес, адам туған сәтте пайда болады.",
        "QR FK 13-moddasiga ko‘ra huquq layoqati 18 yoshda emas, inson tug‘ilgan paytda vujudga keladi."
      ),
      correctedStep: tr("2) Гражданская правоспособность возникает в момент рождения и прекращается со смертью (ст. 13 ГК РК).", "2) Азаматтық құқық қабілеттілік адам туған сәтте пайда болады (АК 13-бабы).", "2) Fuqarolik huquq layoqati inson tug‘ilgan paytda vujudga keladi (FK 13-moddasi)."),
      transferQuestion: {
        id: "law-err-transfer",
        subjectId: "law",
        topicId: "law_civil_capacity",
        lessonId: "law-lesson-law_civil_capacity",
        type: "single_choice",
        difficulty: "basic",
        maxPoints: 1,
        prompt: tr("В какой момент возникает гражданская правоспособность человека по законодательству РК?", "ҚР заңнамасы бойынша адамның азаматтық құқық қабілеттілігі қай сәтте пайда болады?", "QR qonunchiligiga ko‘ra insonning fuqarolik huquq layoqati qaysi paytda vujudga keladi?"),
        options: {
          ru: ["В момент рождения", "При получении удостоверения личности в 16 лет", "В 18 лет", "При поступлении в школу"],
          kk: ["Туған сәтте", "16 жаста жеке куәлік алғанда", "18 жаста", "Мектепке барғанда"],
          uz: ["Tug‘ilgan paytda", "16 yoshda guvohnoma olganda", "18 yoshda", "Maktabga borganda"]
        },
        correctIndex: 0,
        explanation: tr("Правоспособность возникает с момента рождения и прекращается со смертью.", "Құқық қабілеттілік туған сәттен басталады.", "Huquq layoqati tug‘ilgan paytdan boshlanadi."),
        hint: tr("Даже новорождённый ребёнок имеет право на жизнь, имя и наследование имущества.", "Жаңа туған нәрестенің де өмір сүруге және мұрагер болуға құқығы бар.", "Yangi tug‘ilgan chaqaloq ham yashash va meros olish huquqiga ega."),
        errorCategory: "legal_capacity_age"
      }
    }
  },
  {
    id: "math_lit",
    category: "stem",
    iconName: "PieChart",
    levels: {
      ru: ["Базовый (Проценты, пропорции, среднее арифметическое)", "Средний (Таблицы, диаграммы, текстовые задачи на движение/работу)", "Обязательный блок ЕНТ (10 заданий)"],
      kk: ["Базалық (Пайыздар, пропорциялар, орташа мән)", "Орташа (Кестелер, диаграммалар, мәтіндік есептер)", "ҰБТ міндетті блогы (10 тапсырма)"],
      uz: ["Bazaviy (Foizlar, proporsiyalar, o‘rtacha qiymat)", "O‘rtacha (Jadvallar, diagrammalar, matnli masalalar)", "Majburiy blok (10 ta topshiriq)"]
    },
    lessonsData: [
      {
        topicId: "ml_percentages_discounts",
        title: tr("Проценты, последовательные скидки и банковские вклады", "Пайыздар, тізбектелген жеңілдіктер және банк салымдары", "Foizlar, ketma-ket chegirmalar va bank omonatlari"),
        sectionTitle: tr("Количественные рассуждения", "Сандық пайымдау", "Miqdoriy mulohaza"),
        difficulty: "basic",
        prereqs: [],
        goal: tr("Рассчитывать последовательные изменения цены в процентах без ложного сложения процентов.", "Пайыздарды қате қоспай, бағаның тізбектей өзгеруін есептеу.", "Foizlarni xato qo‘shmasdan, narxning ketma-ket o‘zgarishini hisoblash."),
        simpleExplanation: tr(
          "При повышении цены на p% новая цена равна S · (1 + p/100), а при снижении на q% — умножается на (1 − q/100). Второй процент всегда берётся от НОВОЙ базы, а не от исходной цены!",
          "Баға p%-ға өсіп, сосын q%-ға арзандаса, коэффициенттер көбейтіледі: S · (1 + p/100) · (1 − q/100). Пайыздарды жай қоса салуға болмайды!",
          "Narx p% ga oshib, so‘ng q% ga arzonlashsa, koeffitsiyentlar ko‘paytiriladi: S · (1 + p/100) · (1 − q/100)."
        ),
        detailedExplanation: tr(
          "Если товар стоил 10 000 тг, подорожал на 20% (стал 12 000 тг), а затем подешевел на 20% от новой цены (12 000 · 0.8 = 9 600 тг), итоговая цена уменьшилась на 4%, а не вернулась к 10 000 тг.",
          "10 000 тг тауар 20%-ға қымбаттап (12 000 тг), сосын 20%-ға арзандаса: 12 000 · 0.8 = 9 600 тг болады.",
          "10 000 tg mahsulot 20% ga qimmatlab (12 000 tg), so‘ng 20% ga arzonlashsa: 12 000 · 0.8 = 9 600 tg bo‘ladi."
        ),
        workedExample: {
          problem: tr("Куртка стоила 20 000 тенге. Сначала цену снизили на 10%, а затем новую цену снизили ещё на 10%. Сколько тенге стала стоить куртка?", "Күртеше 20 000 теңге тұрды. Бағасы алдымен 10%-ға, содан кейін жаңа баға тағы 10%-ға арзандады. Соңғы бағасы қанша?", "Kurtka 20 000 tenge edi. Narxi avval 10% ga, keyin yangi narx yana 10% ga arzonlashdi. Oxirgi narx qancha?"),
          steps: {
            ru: ["1) После первой скидки 10%: 20 000 · 0.9 = 18 000 тг", "2) После второй скидки 10% от новой цены: 18 000 · 0.9 = 16 200 тг"],
            kk: ["1) Бірінші 10% жеңілдіктен соң: 20 000 · 0.9 = 18 000 тг", "2) Екінші 10% жеңілдіктен соң: 18 000 · 0.9 = 16 200 тг"],
            uz: ["1) Birinchi 10% chegirmadan so‘ng: 20 000 · 0.9 = 18 000 tg", "2) Ikkinchi 10% chegirmadan so‘ng: 18 000 · 0.9 = 16 200 tg"]
          },
          takeaway: tr("Две скидки по 10% подряд дают множитель 0.9 · 0.9 = 0.81 (скидка 19%, а не 20%).", "Қатарынан екі 10% жеңілдік: 0.9 · 0.9 = 0.81 (19% жеңілдік).", "Ketma-ket ikkita 10% chegirma: 0.9 · 0.9 = 0.81 (19% chegirma).")
        },
        block: {
          type: "formula",
          title: tr("Формула последовательных процентных изменений", "Тізбектелген пайыздық өзгерістер формуласы", "Ketma-ket foiz o‘zgarishlari formulasi"),
          body: tr("S_итог = S₀ · (1 ± p₁/100) · (1 ± p₂/100)", "S_соңғы = S₀ · (1 ± p₁/100) · (1 ± p₂/100)", "S_yakuniy = S₀ · (1 ± p₁/100) · (1 ± p₂/100)")
        },
        summary: tr("Освоено решение задач на проценты и последовательные переоценки.", "Пайыздар мен тізбектелген жеңілдіктер есептері меңгерілді.", "Foizlar va ketma-ket chegirmalar masalalari o‘zlashtirildi."),
        questions: [
          {
            id: "ml-q1",
            subjectId: "math_lit",
            topicId: "ml_percentages_discounts",
            lessonId: "math_lit-lesson-ml_percentages_discounts",
            type: "numeric",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("Товар стоил 10 000 тенге. Сначала его цену повысили на 10%, а затем снизили на 10%. Какова итоговая цена товара (в тенге)?", "Тауар 10 000 теңге тұрды. Бағасын алдымен 10%-ға өсіріп, кейін 10%-ға төмендетті. Соңғы бағасы неше теңге?", "Mahsulot 10 000 tenge edi. Narxi avval 10% ga oshirilib, so‘ng 10% ga tushirildi. Yakuniy narxi necha tenge?"),
            numericAnswer: 9900,
            unit: "тг",
            explanation: tr("10 000 · 1.1 · 0.9 = 11 000 · 0.9 = 9 900 тг.", "10 000 · 1.1 · 0.9 = 9 900 тг.", "10 000 · 1.1 · 0.9 = 9 900 tg."),
            hint: tr("Сначала найдите цену после повышения на 10% (11 000 тг), а затем вычтите 10% от 11 000 тг.", "Алдымен 10 000 · 1.1 = 11 000 тг табыңыз, сосын оны 0.9-ға көбейтіңіз.", "Avval 10 000 · 1.1 = 11 000 tg toping, so‘ng uni 0.9 ga ko‘paytiring."),
            errorCategory: "percentage_base"
          }
        ]
      },
      {
        topicId: "ml_tables_statistics",
        title: tr("Анализ таблиц, среднее арифметическое, медиана и размах", "Кестелерді талдау, арифметикалық орта, медиана және өзгеріс ауқымы", "Jadvallarni tahlil qilish, o‘rta arifmetik, mediana va o‘zgarish kengligi"),
        sectionTitle: tr("Статистика и данные", "Статистика және деректер", "Statistika va ma’lumotlar"),
        difficulty: "intermediate",
        prereqs: ["ml_percentages_discounts"],
        goal: tr("Вычислять среднее взвешенное, медиану, моду и размах числового ряда по таблицам и графикам.", "Сандық қатардың арифметикалық ортасын, медианасын, модасын және өзгеріс ауқымын табу.", "Sonlar qatorining o‘rta arifmetigi, medianasi, modasi va o‘zgarish kengligini topish."),
        simpleExplanation: tr(
          "Среднее арифметическое — сумма всех чисел, делённая на их количество. Медиана — число посередине УПОРЯДОЧЕННОГО по возрастанию ряда (или полусумма двух средних). Размах — разность между наибольшим и наименьшим значениями.",
          "Арифметикалық орта — барлық сандар қосындысын олардың санына бөлу. Медиана — өсу ретімен жазылған қатардың дәл ортасындағы сан. Өзгеріс ауқымы = ең үлкен − ең кіші мән.",
          "O‘rta arifmetik — barcha sonlar yig‘indisini ularning soniga bo‘lish. Mediana — tartiblangan qatorning o‘rtasidagi son. O‘zgarish kengligi = eng katta − eng kichik qiymat."
        ),
        detailedExplanation: tr(
          "В задачах на среднюю скорость на всём пути НЕЛЬЗЯ брать полусумму скоростей: нужно разделить весь пройденный путь на всё затраченное время v_ср = S_общ / t_общ.",
          "Орташа жылдамдықты тапқанда барлық жолды барлық уақытқа бөлу керек: v_орт = S_жалпы / t_жалпы.",
          "O‘rtacha tezlikni topishda umumiy yo‘lni umumiy vaqtga bo‘lish kerak: v_o‘rt = S_umumiy / t_umumiy."
        ),
        workedExample: {
          problem: tr("Найдите медиану и размах ряда чисел: 14, 8, 20, 11, 9.", "14, 8, 20, 11, 9 сандар қатарының медианасы мен өзгеріс ауқымын табыңыз.", "14, 8, 20, 11, 9 sonlar qatorining medianasi va o‘zgarish kengligini toping."),
          steps: {
            ru: ["1) Сначала упорядочим ряд по возрастанию: 8, 9, 11, 14, 20", "2) Посередине стоит число 11 → медиана равна 11", "3) Размах: 20 − 8 = 12"],
            kk: ["1) Қатарды өсу ретімен жазамыз: 8, 9, 11, 14, 20", "2) Ортасындағы сан — 11 (медиана)", "3) Өзгеріс ауқымы: 20 − 8 = 12"],
            uz: ["1) Qatorni o‘sish tartibida yozamiz: 8, 9, 11, 14, 20", "2) O‘rtadagi son — 11 (mediana)", "3) O‘zgarish kengligi: 20 − 8 = 12"]
          },
          takeaway: tr("Перед поиском медианы обязательно отсортируйте числа по возрастанию!", "Медиананы таппас бұрын сандарды міндетті түрде өсу ретімен орналастырыңыз!", "Medianani topishdan oldin sonlarni albatta o‘sish tartibida joylashtiring!")
        },
        block: {
          type: "table",
          title: tr("Статистические характеристики ряда", "Статистикалық сипаттамалар", "Statistik ko‘rsatkichlar"),
          body: tr("Среднее = (x₁ + ... + xₙ)/n | Медиана = середина отсортированного ряда | Мода = самое частое число | Размах = x_max − x_min", "Орташа мән | Медиана | Мода | Өзгеріс ауқымы = x_max − x_min", "O‘rtacha qiymat | Mediana | Moda | O‘zgarish kengligi = x_max − x_min")
        },
        summary: tr("Отработаны задачи на статистические характеристики и чтение таблиц.", "Статистикалық сипаттамалар мен кестелерді талдау есептері пысықталды.", "Statistik ko‘rsatkichlar va jadvallarni tahlil qilish mustahkamlandi."),
        questions: [
          {
            id: "ml-q2",
            subjectId: "math_lit",
            topicId: "ml_tables_statistics",
            lessonId: "math_lit-lesson-ml_tables_statistics",
            type: "numeric",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("Найдите медиану набора чисел: 19, 7, 12, 25, 10.", "19, 7, 12, 25, 10 сандар жиынының медианасын табыңыз.", "19, 7, 12, 25, 10 sonlar to‘plamining medianasini toping."),
            numericAnswer: 12,
            explanation: tr("Упорядоченный ряд: 7, 10, 12, 19, 25. Центральный элемент равен 12.", "Өсу ретімен: 7, 10, 12, 19, 25. Ортаңғы элемент — 12.", "O‘sish tartibida: 7, 10, 12, 19, 25. O‘rtadagi element — 12."),
            hint: tr("Сначала расставьте числа по возрастанию: 7, 10, 12, 19, 25.", "Алдымен сандарды өсу ретімен орналастырыңыз: 7, 10, 12, 19, 25.", "Avval sonlarni o‘sish tartibida joylashtiring: 7, 10, 12, 19, 25."),
            errorCategory: "unsorted_median"
          }
        ]
      },
      {
        topicId: "ml_logic_sequences",
        title: tr("Числовые закономерности, комбинаторика и логические задачи", "Сандық заңдылықтар, комбинаторика және логикалық есептер", "Sonli qonuniyatlar, kombinatorika va mantiqiy masalalar"),
        sectionTitle: tr("Логика и комбинаторика", "Логика және комбинаторика", "Mantiq va kombinatorika"),
        difficulty: "advanced",
        prereqs: ["ml_tables_statistics"],
        goal: tr("Применять правило произведения, формулу рукопожатий n(n−1)/2 и находить закономерности в числовых таблицах.", "Көбейту ережесін, қол алысу формуласын n(n−1)/2 және сандық заңдылықтарды қолдану.", "Ko‘paytirish qoidasi, qo‘l berib ko‘rishish formulasi n(n−1)/2 va qonuniyatlarni qo‘llash."),
        simpleExplanation: tr(
          "Если в турнире участвуют n человек и каждый играет с каждым по одному разу (или обменивается рукопожатием), число партий равно n·(n − 1) / 2. А если обмениваются фотографиями или подарками (где важен порядок A→B и B→A), то n·(n − 1).",
          "Қол алысу немесе бір айналымдық ойындар саны: n(n − 1) / 2. Ал фотосурет немесе сыйлық алмасу саны: n(n − 1).",
          "Qo‘l berib ko‘rishish yoki o‘yinlar soni: n(n − 1) / 2. Fotosurat yoki sovg‘a almashish soni esa: n(n − 1)."
        ),
        detailedExplanation: tr(
          "Деление на 2 в задаче о рукопожатиях нужно потому, что рукопожатие между Арманом и Даной — это одно общее событие, а не два разных.",
          "Қол алысуда 2-ге бөлеміз, себебі екі адамның қол алысуы — бір ортақ оқиға.",
          "Qo‘l berib ko‘rishishda 2 ga bo‘lamiz, chunki ikki kishining ko‘rishishi — bitta umumiy hodisa."
        ),
        workedExample: {
          problem: tr("На встречу пришли 8 друзей, и каждый пожал руку каждому ровно один раз. Сколько всего было рукопожатий?", "Кездесуге 8 дос келіп, әрқайсысы бір-бірімен қол алысты. Барлығы қанша қол алысу болды?", "Uchrashuvga 8 ta do‘st kelib, har biri bir-biri bilan qo‘l berib ko‘rishdi. Jami nechta ko‘rishish bo‘ldi?"),
          steps: {
            ru: ["1) Используем формулу сочетаний из n по 2: N = n(n − 1) / 2", "2) N = 8 · 7 / 2 = 28 рукопожатий"],
            kk: ["1) Формула: N = n(n − 1) / 2", "2) N = 8 · 7 / 2 = 28 қол алысу"],
            uz: ["1) Formula: N = n(n − 1) / 2", "2) N = 8 · 7 / 2 = 28 ta ko‘rishish"]
          },
          takeaway: tr("Рукопожатия и матчи в 1 круг = n(n−1)/2; подарки и билеты туда-обратно = n(n−1).", "Қол алысу = n(n−1)/2; сыйлық/фото алмасу = n(n−1).", "Qo‘l berib ko‘rishish = n(n−1)/2; sovg‘a/foto almashish = n(n−1).")
        },
        block: {
          type: "formula",
          title: tr("Формулы комбинаторики в математической грамотности", "Математикалық сауаттылықтағы комбинаторика формулалары", "Matematik savodxonlikda kombinatorika formulalari"),
          body: tr("Рукопожатия (Cₙ²): n(n − 1) / 2  |  Обмен подарками (Aₙ²): n(n − 1)  |  Перестановки n элементов: n!", "Қол алысу: n(n − 1) / 2  |  Сыйлық алмасу: n(n − 1)  |  Алмастыру: n!", "Qo‘l berib ko‘rishish: n(n − 1) / 2  |  Sovg‘a almashish: n(n − 1)")
        },
        summary: tr("Освоены комбинаторные модели и логические задачи формата ЕНТ.", "ҰБТ форматындағы комбинаторикалық және логикалық есептер меңгерілді.", "Imtihon formatidagi kombinatorik va mantiqiy masalalar o‘zlashtirildi."),
        questions: [
          {
            id: "ml-q3",
            subjectId: "math_lit",
            topicId: "ml_logic_sequences",
            lessonId: "math_lit-lesson-ml_logic_sequences",
            type: "numeric",
            difficulty: "intermediate",
            maxPoints: 1,
            prompt: tr("В шахматном турнире участвуют 10 игроков. Каждый сыграл с каждым по одной партии. Сколько всего партий было сыграно?", "Шахмат турниріне 10 ойыншы қатысып, әрқайсысы бір-бірімен бір партиядан ойнады. Барлығы қанша партия ойналды?", "Shaxmat turnirida 10 ta o‘yinchi qatnashib, har biri bir-biri bilan bittadan partiya o‘ynadi. Jami nechta partiya o‘ynaldi?"),
            numericAnswer: 45,
            explanation: tr("N = 10 · (10 − 1) / 2 = 90 / 2 = 45 партий.", "N = 10 · 9 / 2 = 45 партия.", "N = 10 · 9 / 2 = 45 ta partiya."),
            hint: tr("Вычислите 10 · 9 / 2.", "10 · 9 / 2 өрнегін есептеңіз.", "10 · 9 / 2 ifodasini hisoblang."),
            errorCategory: "combinatorics_double_count"
          }
        ]
      }
    ],
    errorLab: {
      id: "ml-err-percent",
      subjectId: "math_lit",
      topicId: "ml_percentages_discounts",
      title: tr("Ловушка сложения процентов от разной базы (+20% и −20%)", "Әртүрлі базадан пайыздарды қосу тұзағы (+20% және −20%)", "Turli bazadan foizlarni qo‘shish tuzog‘i (+20% va −20%)"),
      taskPrompt: tr("Проверьте решение задачи: «Товар стоил 5000 тг. Его цену подняли на 20%, а затем снизили на 20%. Какова новая цена?»", "Есептің шешімін тексеріңіз: «Тауар 5000 тг тұрды. Бағасын 20%-ға көтеріп, кейін 20%-ға түсірді. Жаңа бағасы қанша?»", "Masala yechimini tekshiring: «Mahsulot 5000 tg edi. Narxini 20% ga ko‘tarib, keyin 20% ga tushirishdi. Yangi narxi qancha?»"),
      steps: {
        ru: [
          "1) Первое изменение: +20%, второе изменение: −20%.",
          "2) Складываем изменения в процентах: +20% − 20% = 0%.",
          "3) Значит цена не изменилась и осталась равной 5000 тг."
        ],
        kk: [
          "1) Бірінші өзгеріс: +20%, екінші өзгеріс: −20%.",
          "2) Пайыздарды қосамыз: +20% − 20% = 0%.",
          "3) Демек баға өзгермейді: 5000 тг."
        ],
        uz: [
          "1) Birinchi o‘zgarish: +20%, ikkinchi o‘zgarish: −20%.",
          "2) Foizlarni qo‘shamiz: +20% − 20% = 0%.",
          "3) Demak narx o‘zgarmaydi: 5000 tg."
        ]
      },
      brokenStepIndex: 1,
      errorCategory: "percentage_base",
      whyBroken: tr(
        "Вторые 20% вычитаются не из исходных 5000 тг, а из увеличенной суммы 6000 тг (20% от 6000 = 1200 тг).",
        "Екінші 20% бастапқы 5000 теңгеден емес, өскен 6000 теңгеден есептеледі (6000 · 0.2 = 1200 тг).",
        "Ikkinchi 20% boshlang‘ich 5000 tengedan emas, oshgan 6000 tengedan hisoblanadi (6000 · 0.2 = 1200 tg)."
      ),
      correctedStep: tr("2) Находим новую цену через произведение коэффициентов: 5000 · 1.2 · 0.8 = 4800 тг.", "2) Коэффициенттерді көбейтеміз: 5000 · 1.2 · 0.8 = 4800 тг.", "2) Koeffitsiyentlarni ko‘paytiramiz: 5000 · 1.2 · 0.8 = 4800 tg."),
      transferQuestion: {
        id: "ml-err-transfer",
        subjectId: "math_lit",
        topicId: "ml_percentages_discounts",
        lessonId: "math_lit-lesson-ml_percentages_discounts",
        type: "numeric",
        difficulty: "basic",
        maxPoints: 1,
        prompt: tr("Цена билета составляла 5000 тенге. Сначала она выросла на 20%, а затем снизилась на 20%. Сколько тенге стал стоить билет?", "Билет бағасы 5000 теңге болды. Алдымен 20%-ға қымбаттап, кейін 20%-ға арзандады. Билет неше теңге болды?", "Chipta narxi 5000 tenge edi. Avval 20% ga qimmatlab, keyin 20% ga arzonlashdi. Chipta necha tenge bo‘ldi?"),
        numericAnswer: 4800,
        unit: "тг",
        explanation: tr("5000 · 1.2 = 6000 тг; 6000 · 0.8 = 4800 тг.", "5000 · 1.2 · 0.8 = 4800 тг.", "5000 · 1.2 · 0.8 = 4800 tg."),
        hint: tr("Умножьте 5000 сначала на 1.2, а затем результат на 0.8.", "5000-ды алдымен 1.2-ге, сосын 0.8-ге көбейтіңіз.", "5000 ni avval 1.2 ga, so‘ng 0.8 ga ko‘paytiring."),
        errorCategory: "percentage_base"
      }
    }
  },
  {
    id: "reading_lit",
    category: "languages",
    iconName: "BookOpenCheck",
    levels: {
      ru: ["Анализ структуры текста и главной мысли", "Сравнение двух текстов, факты vs мнения", "Обязательный блок ЕНТ «Грамотность чтения» (10 заданий)"],
      kk: ["Мәтін құрылымы мен негізгі ойды талдау", "Екі мәтінді салыстыру, дерек пен пікір", "ҰБТ «Оқу сауаттылығы» міндетті блогы (10 тапсырма)"],
      uz: ["Matn tuzilmasi va asosiy fikrni tahlil qilish", "Ikki matnni solishtirish, fakt va fikr", "«O‘qish savodxonligi» majburiy bloki"]
    },
    lessonsData: [
      {
        topicId: "rl_main_idea_thesis",
        title: tr("Главная мысль текста, тезис и авторская позиция", "Мәтіннің негізгі ойы, тезис және авторлық ұстаным", "Matnning asosiy g‘oyasi, tezis va muallif pozitsiyasi"),
        sectionTitle: tr("Смысловой анализ текста", "Мәтінді мағыналық талдау", "Matnning ma’noviy tahlili"),
        difficulty: "basic",
        prereqs: [],
        goal: tr("Отличать тему текста (о чём говорится) от главной мысли / тезиса (что именно утверждает автор) и частных деталей.", "Мәтін тақырыбын негізгі ойдан (тезистен) және жекелеген детальдардан ажырату.", "Matn mavzusini asosiy fikrdan (tezisdan) va xususiy detallardan farqlash."),
        simpleExplanation: tr(
          "Тема текста отвечает на вопрос «О чём текст?», а главная мысль (тезис) — «Какой главный вывод доказывает автор?». Ложные варианты на ЕНТ обычно либо слишком узкие (пересказывают один пример из второго абзаца), либо слишком широкие.",
          "Тақырып — «Мәтін не туралы?», ал негізгі ой (тезис) — «Автор қандай басты қорытындыны дәлелдейді?».",
          "Mavzu — «Matn nima haqida?», asosiy fikr (tezis) esa — «Muallif qanday xulosani isbotlaydi?»."
        ),
        detailedExplanation: tr(
          "Чтобы быстро найти главную мысль научно-популярного текста, сопоставьте вступление (постановка проблемы) и заключительный абзац (итоговый вывод автора).",
          "Ғылыми-көпшілік мәтіннің негізгі ойын табу үшін кіріспе мен қорытынды абзацты салыстырыңыз.",
          "Ilmiy-ommabop matnning asosiy fikrini topish uchun kirish va xulosa xatboshilarini solishtiring."
        ),
        workedExample: {
          problem: tr("В тексте описывается, как лесополосы в степи задерживают снег, снижают скорость ветра и повышают урожайность на 25%. Какова главная мысль?", "Мәтінде даладағы орман алқаптары қар тоқтатып, желді бәсеңдетіп, өнімділікті 25%-ға арттыратыны айтылған. Негізгі ой қандай?", "Matnda cho‘ldagi o‘rmon полосаlari qorni ushlab qolishi va hosildorlikni 25% ga oshirishi aytilgan. Asosiy fikr nima?"),
          steps: {
            ru: ["1) Примеры про снег и 25% — это аргументы", "2) Главная мысль: защитные лесонасаждения необходимы для сохранения влаги и устойчивого земледелия в степной зоне"],
            kk: ["1) Қар мен 25% туралы деректер — аргументтер", "2) Негізгі ой: қорғаныш орман алқаптары далалық егіншіліктің тұрақтылығы үшін қажет"],
            uz: ["1) Qor va 25% haqidagi ma’lumotlar — dalillar", "2) Asosiy fikr: himoya o‘rmonlari dasht dehqonchiligi barqarorligi uchun zarur"]
          },
          takeaway: tr("Тезис объединяет все абзацы текста, а аргумент иллюстрирует только один пункт.", "Тезис барлық абзацтарды біріктіреді, ал аргумент тек бір мысалды көрсетеді.", "Tezis barcha xatboshilarni birlashtiradi, dalil esa faqat bitta misolni ko‘rsatadi.")
        },
        block: {
          type: "source_doc",
          title: tr("Алгоритм проверки главной мысли", "Негізгі ойды тексеру алгоритмі", "Asosiy fikrni tekshirish algoritmi"),
          body: tr("1. Уберите вариант, если в нём есть слова «только», «всегда», «никогда», которых не было у автора. 2. Уберите вариант, который пересказывает лишь один частный пример. 3. Выберите суждение, охватывающее проблему и вывод всего текста.", "1. Авторда жоқ «тек», «әрқашан» сөздері бар нұсқаны алып тастаңыз. 2. Бүкіл мәтіннің түйінін қамтитын нұсқаны таңдаңыз.", "1. Muallifda yo‘q «faqat», «har doim» so‘zlari bor variantni chiqarib tashlang. 2. Butun matn xulosasini qamrab olgan variantni tanlang.")
        },
        summary: tr("Освоен алгоритм поиска главной мысли и отсева дистракторов.", "Негізгі ойды табу және қате нұсқаларды алып тастау алгоритмі меңгерілді.", "Asosiy fikrni topish va chalg‘ituvchi variantlarni saralash o‘zlashtirildi."),
        questions: [
          {
            id: "rl-q1",
            subjectId: "reading_lit",
            topicId: "rl_main_idea_thesis",
            lessonId: "reading_lit-lesson-rl_main_idea_thesis",
            type: "single_choice",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("Прочитайте фрагмент: «Хотя электронные книги экономят место, исследования показывают, что при чтении сложных научных текстов с бумаги читатели лучше удерживают структуру аргументов благодаря пространственной памяти страницы». Какое утверждение точно передаёт мысль автора?", "Үзіндіні оқыңыз: «Электронды кітаптар орын үнемдегенімен, зерттеулер күрделі ғылыми мәтіндерді қағаздан оқығанда оқырмандар аргументтер құрылымын жақсырақ есте сақтайтынын көрсетеді». Автор ойын дәл беретін тұжырымды таңдаңыз:", "Parchani o‘qing: «Elektron kitoblar joyni tejasa-da, tadqiqotlar murakkab ilmiy matnlarni qog‘ozdan o‘qiganda o‘quvchilar dalillar tuzilmasini yaxshiroq eslab qolishini ko‘rsatadi». Muallif fikrini aniq ifodalagan javobni tanlang:"),
            options: {
              ru: [
                "Бумажный формат помогает глубже усваивать структуру сложных научных текстов за счёт пространственной опоры.",
                "Электронные книги полностью бесполезны и должны быть запрещены в школах.",
                "Все читатели читают бумажные книги в два раза быстрее электронных.",
                "Научные тексты состоят только из таблиц и графиков."
              ],
              kk: [
                "Қағаз форматы кеңістіктік жад арқылы күрделі ғылыми мәтіндердің құрылымын тереңірек меңгеруге көмектеседі.",
                "Электронды кітаптар мүлдем пайдасыз.",
                "Барлық оқырмандар қағаз кітапты екі есе жылдам оқиды.",
                "Ғылыми мәтіндер тек кестелерден тұрады."
              ],
              uz: [
                "Qog‘oz formati fazoviy xotira tufayli murakkab ilmiy matnlar tuzilmasini chuqurroq o‘zlashtirishga yordam beradi.",
                "Elektron kitoblar butunlay foydasiz.",
                "Barcha o‘quvchilar qog‘oz kitobni ikki baravar tez o‘qiydi.",
                "Ilmiy matnlar faqat jadvallardan iborat."
              ]
            },
            correctIndex: 0,
            explanation: tr("Автор сравнивает форматы без крайностей и указывает преимущество бумаги для понимания структуры сложных текстов.", "Автор қағаз форматының күрделі мәтін құрылымын есте сақтаудағы артықшылығын көрсетеді.", "Muallif qog‘oz formatining murakkab matn tuzilmasini eslab qolishdagi ustunligini ko‘rsatadi."),
            hint: tr("Отбросьте категоричные утверждения со словами «полностью бесполезны», «все», «только».", "«Мүлдем пайдасыз», «барлық», «тек» деген үзілді-кесілді сөздері бар нұсқаларды алып тастаңыз.", "«Butunlay foydasiz», «barcha», «faqat» degan keskin variantlarni chiqarib tashlang."),
            errorCategory: "extreme_distractor"
          }
        ]
      },
      {
        topicId: "rl_fact_vs_opinion",
        title: tr("Разграничение фактов, оценочных суждений и скрытых допущений", "Деректерді (фактілерді), бағалау пікірлерін және болжамдарды ажырату", "Faktlar, baholovchi fikrlar va farazlarni farqlash"),
        sectionTitle: tr("Критическое чтение", "Сыни оқу", "Tanqidiy o‘qish"),
        difficulty: "intermediate",
        prereqs: ["rl_main_idea_thesis"],
        goal: tr("Отличать верифицируемый факт от субъективного мнения и находить информацию, прямо подтверждаемую текстом.", "Тексеруге болатын фактіні субъективті пікірден ажырату.", "Tekshirish mumkin bo‘lgan faktni subyektiv fikrdan farqlash."),
        simpleExplanation: tr(
          "Факт содержит проверяемые данные (дату, число, зафиксированное событие). Оценочное суждение (мнение) содержит субъективные эпитеты («самый красивый», «к сожалению», «вероятно», «лучше всего»).",
          "Факт нақты тексерілетін деректерді (уақыт, сан, оқиға) қамтиды. Ал пікір субъективті бағалау сөздерін («ең әдемі», «өкінішке қарай», «мүмкін») қамтиды.",
          "Fakt tekshiriladigan ma’lumotlarni (sana, son, hodisa) o‘z ichiga oladi. Fikr esa subyektiv baholash so‘zlarini («eng chiroyli», «ehtimol») qamrab oladi."
        ),
        detailedExplanation: tr(
          "На вопросах «Какое утверждение соответствует тексту?» проверяйте каждое слово по исходному абзацу: если причина и следствие поменялись местами — вариант ложный.",
          "«Мәтінге сәйкес ақпаратты табыңыз» сұрақтарында себеп пен салдардың орны ауысып кетпегенін тексеріңіз.",
          "«Matnga mos ma’lumotni toping» savollarida sabab va oqibat o‘rni almashib qolmaganini tekshiring."
        ),
        workedExample: {
          problem: tr("Определите, что является фактом, а что мнением: А) «Озеро Балхаш расположено на юго-востоке Казахстана и имеет пресную западную и солоноватую восточную части»; Б) «Балхаш — самое живописное место для летнего отдыха».", "Қайсысы факт, қайсысы пікір екенін анықтаңыз: А) «Балқаш көлі Қазақстанның оңтүстік-шығысында орналасқан»; Б) «Балқаш — жазғы демалыс үшін ең әсем жер».", "Qaysi biri fakt, qaysi biri fikr: A) «Balxash ko‘li Qozog‘istonning janubi-sharqida joylashgan»; B) «Balxash — dam olish uchun eng go‘zal joy»."),
          steps: {
            ru: ["1) Утверждение А содержит объективные географические и гидрологические данные → это факт", "2) Утверждение Б содержит субъективную оценку «самое живописное» → это мнение"],
            kk: ["1) А тұжырымы — объективті географиялық факт", "2) Б тұжырымы — «ең әсем» деген субъективті пікір"],
            uz: ["1) A fikr — obyektiv geografik fakt", "2) B fikr — «eng go‘zal» degan subyektiv baho"]
          },
          takeaway: tr("Факт можно доказать измерением или документом; мнение выражает отношение автора.", "Фактіні өлшеумен немесе құжатпен дәлелдеуге болады; пікір автордың көзқарасын білдіреді.", "Faktni o‘lchash yoki hujjat bilan isbotlash mumkin; fikr muallif munosabatini bildiradi.")
        },
        block: {
          type: "table",
          title: tr("Факт против мнения", "Факт пен пікір айырмашылығы", "Fakt va fikr farqi"),
          body: tr("Маркеры факта: даты, статистика, результаты измерений, ссылки на источники | Маркеры мнения: «по-видимому», «лучший», «к счастью», «следует считать»", "Факт: дата, статистика, өлшем | Пікір: «шамасы», «ең жақсы», «өкінішке қарай»", "Fakt: sana, statistika, o‘lchov | Fikr: «ehtimol», «eng yaxshi», «baxtga qarshi»")
        },
        summary: tr("Отработано разграничение фактов, мнений и причинно-следственных связей в тексте.", "Фактілерді, пікірлерді және себеп-салдарлық байланыстарды ажырату пысықталды.", "Faktlar, fikrlar va sabab-oqibat bog‘lanishlarini farqlash mustahkamlandi."),
        questions: [
          {
            id: "rl-q2",
            subjectId: "reading_lit",
            topicId: "rl_fact_vs_opinion",
            lessonId: "reading_lit-lesson-rl_fact_vs_opinion",
            type: "single_choice",
            difficulty: "intermediate",
            maxPoints: 1,
            prompt: tr("Какое из приведённых высказываний является проверяемым ФАКТОМ, а не оценочным суждением?", "Төмендегі пікірлердің қайсысы бағалау пікірі емес, тексерілетін ФАКТ болып табылады?", "Quyidagi fikrlardan qaysi biri baholovchi fikr emas, balki tekshiriladigan FAKT hisoblanadi?"),
            options: {
              ru: [
                "Национальная валюта Республики Казахстан — тенге — была введена в обращение 15 ноября 1993 года.",
                "Осенняя погода в горах Заилийского Алатау гораздо приятнее весенней.",
                "Изучение иностранных языков — самое увлекательное занятие для каждого школьника.",
                "Классическая музыка всегда вызывает у слушателей только радостные эмоции."
              ],
              kk: [
                "Қазақстан Республикасының ұлттық валютасы — теңге 1993 жылы 15 қарашада айналымға енгізілді.",
                "Іле Алатауындағы күзгі ауа райы көктемге қарағанда әлдеқайда жағымды.",
                "Шет тілдерін үйрену — әр оқушы үшін ең қызықты іс.",
                "Классикалық музыка тыңдармандарға әрқашан тек қуаныш сыйлайды."
              ],
              uz: [
                "Qozog‘iston Respublikasining milliy valyutasi — tenge 1993-yil 15-noyabrda muomalaga kiritilgan.",
                "Tog‘lardagi kuzgi ob-havo bahorgiga qaraganda ancha yoqimli.",
                "Chet tillarini o‘rganish — har bir o‘quvchi uchun eng qiziqarli mashg‘ulot.",
                "Klassik musiqa tinglovchilarda har doim faqat quvonch uyg‘otadi."
              ]
            },
            correctIndex: 0,
            explanation: tr("Дата введения национальной валюты (15 ноября 1993 г.) — это документально проверяемый исторический факт.", "Ұлттық валютаның енгізілген күні (1993 ж. 15 қараша) — құжатпен расталған тарихи факт.", "Milliy valyutaning kiritilgan sanasi (1993-yil 15-noyabr) — hujjat bilan tasdiqlangan tarixiy fakt."),
            hint: tr("Ищите утверждение с точной датой и документированным событием без субъективных оценок.", "Субъективті бағалаусыз, нақты датасы бар деректі табыңыз.", "Subyektiv baholarsiz, aniq sanaga ega ma’lumotni toping."),
            errorCategory: "fact_opinion_confusion"
          }
        ]
      },
      {
        topicId: "rl_comparative_texts",
        title: tr("Сравнительный анализ двух текстов и функциональные стили речи", "Екі мәтінді салыстырмалы талдау және функционалдық стильдер", "Ikki matnni qiyosiy tahlil qilish va nutq uslublari"),
        sectionTitle: tr("Синтез и стилистика", "Синтез және стилистика", "Sintez va uslubiyat"),
        difficulty: "advanced",
        prereqs: ["rl_fact_vs_opinion"],
        goal: tr("Определять функциональный стиль текста (научный, официально-деловой, публицистический, художественный) и находить общие и различающиеся тезисы двух текстов.", "Мәтіннің функционалдық стилін (ғылыми, ресми іс-қағаздар, публицистикалық, көркем әдебиет) және екі мәтіннің ортақ ойын анықтау.", "Matnning funksional uslubini va ikki matnning umumiy g‘oyasini aniqlash."),
        simpleExplanation: tr(
          "Научный стиль использует термины, формулы и объективное изложение (цель — сообщить точное знание). Официально-деловой — канцелярские стандарты, законы и заявления. Публицистический — обращение к обществу и убеждение (статьи, репортажи). Художественный — художественные образы и тропы (метафоры, эпитеты).",
          "Ғылыми стиль терминдер мен объективті баяндауды қолданады. Ресми іс-қағаздар стилі — заңдар мен құжаттар. Публицистикалық стиль — БАҚ пен қоғамдық пікір. Көркем әдебиет стилі — бейнелі сөздер.",
          "Ilmiy uslub atamalar va obyektiv bayonni qo‘llaydi. Rasmiy-idoraviy uslub — qonun va hujjatlar. Publitsistik uslub — OAV va jamoatchilik fikri. Badiiy uslub — obrazli ifodalar."
        ),
        detailedExplanation: tr(
          "При сравнении Текста А и Текста Б выделите: 1) общий предмет обсуждения; 2) в чём авторы согласны; 3) чем различаются их акценты (например, Текст А описывает экономическую выгоду технологии, а Текст Б — экологические риски).",
          "А және Б мәтіндерін салыстырғанда олардың ортақ тақырыбын және авторлардың назар аударған қырларын бөліп көрсетіңіз.",
          "A va B matnlarini solishtirganda ularning umumiy mavzusi va mualliflar e’tibor qaratgan жиҳатларни ajrating."
        ),
        workedExample: {
          problem: tr("К какому стилю речи относится текст: «Настоящий Договор вступает в силу с момента подписания Сторонами и действует до полного исполнения обязательств»?", "«Осы Шарт Тараптар қол қойған сәттен бастап күшіне енеді және міндеттемелер толық орындалғанға дейін қолданылады» мәтіні қай стильге жатады?", "«Ushbu Shartnoma Tomonlar imzolagan paytdan boshlab kuchga kiradi» matni qaysi uslubga tegishli?"),
          steps: {
            ru: ["1) В тексте используются правовые клише («Настоящий Договор», «Стороны», «исполнение обязательств»)", "2) Ответ: официально-деловой стиль"],
            kk: ["1) Мәтінде құқықтық клишелер («Осы Шарт», «Тараптар») қолданылған", "2) Жауабы: ресми іс-қағаздар стилі"],
            uz: ["1) Matnda huquqiy qoliplar («Ushbu Shartnoma», «Tomonlar») ishlatilgan", "2) Javob: rasmiy-idoraviy uslub"]
          },
          takeaway: tr("Термины и доказательства → научный; законы и договоры → официально-деловой; призыв и злободневность → публицистический.", "Терминдер → ғылыми; заң мен шарт → ресми іс-қағаздар; қоғамдық үндеу → публицистикалық.", "Atamalar → ilmiy; qonun va shartnoma → rasmiy-idoraviy; ijtimoiy da’vat → publitsistik.")
        },
        block: {
          type: "table",
          title: tr("4 книжных функциональных стиля", "4 функционалдық стиль", "4 ta funksional uslub"),
          body: tr("Научный: монография, учебник, статья | Официально-деловой: кодекс, указ, договор | Публицистический: очерк, репортаж, эссе | Художественный: роман, рассказ, поэма", "Ғылыми | Ресми іс-қағаздар | Публицистикалық | Көркем әдебиет", "Ilmiy | Rasmiy-idoraviy | Publitsistik | Badiiy")
        },
        summary: tr("Закреплены навыки сравнительного чтения двух текстов и определения функциональных стилей.", "Екі мәтінді салыстырмалы оқу және стиль түрлерін анықтау дағдылары бекітілді.", "Ikki matnni qiyosiy o‘qish va uslub turlarini aniqlash ko‘nikmalari mustahkamlandi."),
        questions: [
          {
            id: "rl-q3",
            subjectId: "reading_lit",
            topicId: "rl_comparative_texts",
            lessonId: "reading_lit-lesson-rl_comparative_texts",
            type: "single_choice",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("В каком функциональном стиле написан фрагмент: «Фотосинтез представляет собой сложный биохимический процесс преобразования энергии видимого света в энергию химических связей органических веществ при участии хлорофилла»?", "«Фотосинтез — хлорофиллдің қатысуымен жарық энергиясын органикалық заттардың химиялық байланыс энергиясына айналдыратын күрделі биохимиялық процесс» үзіндісі қай стильде жазылған?", "«Fotosintez — xlorofill ishtirokida yorug‘lik energiyasini organik moddalarning kimyoviy bog‘ energiyasiga aylantiruvchi murakkab bioximiyaviy jarayon» parchasi qaysi uslubda yozilgan?"),
            options: {
              ru: ["Научный стиль", "Официально-деловой стиль", "Разговорный стиль", "Художественный стиль"],
              kk: ["Ғылыми стиль", "Ресми іс-қағаздар стилі", "Ауызекі сөйлеу стилі", "Көркем әдебиет стилі"],
              uz: ["Ilmiy uslub", "Rasmiy-idoraviy uslub", "So‘zlashuv uslubi", "Badiiy uslub"]
            },
            correctIndex: 0,
            explanation: tr("Определение понятия, специальная терминология («фотосинтез», «биохимический процесс», «хлорофилл») и нейтрально-объективный тон характерны для научного стиля.", "Терминдер мен ғылыми анықтама ғылыми стильге тән.", "Atamalar va ilmiy ta’rif ilmiy uslubga xosdir."),
            hint: tr("Обратите внимание на биологические и химические термины и формулировку определения.", "Биологиялық және химиялық терминдерге назар аударыңыз.", "Biologik va kimyoviy atamalarga e’tibor bering."),
            errorCategory: "style_identification"
          }
        ]
      }
    ],
    errorLab: {
      id: "rl-err-distractor",
      subjectId: "reading_lit",
      topicId: "rl_main_idea_thesis",
      title: tr("Подмена тезиса автора категоричным обобщением («все», «только»)", "Автор тезисін тым жалпылама («барлық», «тек») тұжырыммен алмастыру", "Muallif tezisini keskin umumlashtirish («barcha», «faqat») bilan almashtirish"),
      taskPrompt: tr("Разберите ошибку при выборе ответа по тексту: «Возобновляемые источники энергии (солнечные и ветровые станции) быстро дешевеют, однако для стабильной работы энергосистемы в безветренную и пасмурную погоду им необходимы накопители энергии или маневренные резервные мощности»:", "Мәтін бойынша жауап таңдаудағы қатені талдаңыз: «Жаңартылатын энергия көздері арзандап келеді, бірақ желсіз және бұлтты ауа райында жүйенің тұрақты жұмысы үшін энергия жинақтағыштар немесе резервтік қуат көздері қажет»:", "Matn bo‘yicha javob tanlashdagi xatoni tahlil qiling:"),
      steps: {
        ru: [
          "1) В тексте говорится о зависимости солнечных и ветровых станций от погодных условий.",
          "2) Делаем вывод: автор утверждает, что солнечные и ветровые станции совершенно не способны вырабатывать электричество и от них нужно полностью отказаться.",
          "3) Выбираем этот вариант как главную мысль текста."
        ],
        kk: [
          "1) Мәтінде күн мен жел станцияларының ауа райына тәуелділігі айтылған.",
          "2) Қорытынды жасаймыз: автор күн мен жел станцияларынан толықтай бас тарту керек деп санайды.",
          "3) Осы нұсқаны негізгі ой ретінде таңдаймыз."
        ],
        uz: [
          "1) Matnda quyosh va shamol stansiyalarining ob-havoga bog‘liqligi aytilgan.",
          "2) Xulosa qilamiz: muallif quyosh va shamol stansiyalaridan butunlay voz kechish kerak deb hisoblaydi.",
          "3) Shu variantni asosiy fikr sifatida tanlaymiz."
        ]
      },
      brokenStepIndex: 1,
      errorCategory: "extreme_distractor",
      whyBroken: tr(
        "Это классическая ловушка радикального обобщения: автор НЕ призывает отказываться от ВИЭ, а лишь указывает условие их стабильной работы — наличие накопителей или резервных мощностей.",
        "Бұл тым үзілді-кесілді жалпылау тұзағы: автор ЖЭК-тен бас тартуға шақырмайды, тек энергия жинақтағыштар қажет екенін айтады.",
        "Bu keskin umumlashtirish tuzog‘i: muallif qayta tiklanuvchi energiyadan voz kechishga chaqirmaydi, balki energiya saqlagichlar zarurligini ta’kidlaydi."
      ),
      correctedStep: tr("2) Точный вывод автора: развитие солнечной и ветровой энергетики требует дополнения накопителями энергии или резервными мощностями для сглаживания погодных колебаний.", "2) Дәл қорытынды: күн мен жел энергетикасын дамыту үшін энергия жинақтағыштар мен резервтік қуат қажет.", "2) Aniq xulosa: quyosh va shamol energetikasini rivojlantirish uchun energiya saqlagichlar va zaxira quvvatlar zarur."),
      transferQuestion: {
        id: "rl-err-transfer",
        subjectId: "reading_lit",
        topicId: "rl_main_idea_thesis",
        lessonId: "reading_lit-lesson-rl_main_idea_thesis",
        type: "single_choice",
        difficulty: "basic",
        maxPoints: 1,
        prompt: tr("Какое слово-маркер в вариантах ответа по грамотности чтения чаще всего выдаёт ЛОЖНЫЙ дистрактор (если этого слова не было в исходном тексте)?", "Оқу сауаттылығы тапсырмаларында бастапқы мәтінде болмаса, көбіне ҚАТЕ нұсқаны (дистракторды) білдіретін маркер-сөз қайсы?", "O‘qish savodxonligi topshiriqlarida asl matnda bo‘lmasa, ko‘pincha XATO variantni bildiruvchi marker-so‘z qaysi?"),
        options: {
          ru: ["Категоричные обобщения («всегда», «исключительно только», «абсолютно никогда»)", "Нейтральные союзы («однако», «при этом»)", "Ссылки на абзац текста", "Пересказ условия с синонимами"],
          kk: ["Үзілді-кесілді жалпылау сөздер («әрқашан», «тек қана», «ешқашан»)", "Бейтарап жалғаулықтар («дегенмен», «сонымен қатар»)", "Мәтін абзацына сілтеме", "Синонимдермен берілген мазмұндама"],
          uz: ["Keskin umumlashtiruvchi so‘zlar («har doim», «faqatgina», «hech qachon»)", "Neytral bog‘lovchilar («biroq», «shu bilan birga»)", "Matn xatboshisiga havola", "Sinonimlar bilan berilgan bayon"]
        },
        correctIndex: 0,
        explanation: tr("Категоричные кванторы («всегда», «только», «никогда»), отсутствующие у автора, превращают верную частную мысль в ложное абсолютное утверждение.", "Автор мәтінінде жоқ «әрқашан», «тек қана», «ешқашан» сөздері дұрыс ойды қате абсолютті тұжырымға айналдырады.", "Muallif matnida yo‘q «har doim», «faqatgina», «hech qachon» so‘zlari to‘g‘ri fikrni xato mutlaq da’voga aylantiradi."),
        hint: tr("Обратите внимание на слова, которые не допускают никаких исключений.", "Ешқандай ерекшелікке жол бермейтін үзілді-кесілді сөздерге назар аударыңыз.", "Hech qanday istisnoga yo‘l qo‘ymaydigan keskin so‘zlarga e’tibor bering."),
        errorCategory: "extreme_distractor"
      }
    }
  }
];

function compileBlueprintToCurriculum(bp: NonMathBlueprint): UniversalSubjectCurriculum {
  const meta = UNT_SUBJECTS.find((s) => s.id === bp.id);
  const title = meta?.title ?? tr(bp.id, bp.id, bp.id);
  const subtitle = meta?.description ?? tr("Учебный курс", "Оқу курсы", "O‘quv kursi");
  const badge = meta?.shortTitle.ru.toUpperCase() ?? bp.id.toUpperCase();
  const accentColor = meta ? `rgb(${meta.accentRgb})` : "#3856f5";

  const lessons: UniversalLesson[] = bp.lessonsData.map((l) => ({
    id: `${bp.id}-lesson-${l.topicId}`,
    subjectId: bp.id,
    moduleId: `${bp.id}-module-core`,
    topicId: l.topicId,
    sectionTitle: l.sectionTitle,
    version: "2.0.0",
    updatedAt: "2026-10-10",
    title: l.title,
    difficulty: l.difficulty,
    estimatedMinutes: 12,
    goal: l.goal,
    learningGoal: l.goal,
    prerequisites: l.prereqs,
    simpleExplanation: l.simpleExplanation,
    detailedExplanation: l.detailedExplanation,
    workedExample: l.workedExample,
    contentBlocks: [l.block],
    summary: l.summary,
    nextStepNote: tr(
      "Закрепите тему на практических заданиях и проверьте понимание в Лаборатории ошибок.",
      "Тақырыпты практикалық тапсырмаларда бекітіп, Қателер зертханасында тексеріңіз.",
      "Mavzuni amaliy topshiriqlarda mustahkamlang va Xatolar laboratoriyasida tekshiring."
    ),
    questions: l.questions
  }));

  const topics: UniversalTopicNode[] = bp.lessonsData.map((l, idx) => ({
    id: l.topicId,
    subjectId: bp.id,
    moduleId: `${bp.id}-module-core`,
    title: l.title,
    sectionTitle: l.sectionTitle,
    difficulty: l.difficulty,
    level: l.difficulty,
    prerequisites: l.prereqs,
    unlocks: bp.lessonsData.filter((other) => other.prereqs.includes(l.topicId)).map((other) => other.topicId),
    lessonId: `${bp.id}-lesson-${l.topicId}`,
    lessonIds: [`${bp.id}-lesson-${l.topicId}`],
    weight: Math.max(2, 4 - idx)
  }));

  const modules: UniversalModule[] = [
    {
      id: `${bp.id}-module-core`,
      subjectId: bp.id,
      title: tr("Базовый и профильный модуль", "Базалық және бейіндік модуль", "Bazaviy va profil moduli"),
      summary: subtitle,
      description: subtitle,
      topicIds: topics.map((t) => t.id)
    }
  ];

  const diagnosticQuestionIds = lessons.flatMap((l) => l.questions.map((q) => q.id));

  const errorLabCases: UniversalErrorLabCase[] = [bp.errorLab];
  if (lessons.length >= 2 && lessons[1].questions.length >= 1) {
    const secondLesson = lessons[1];
    const transferQ = secondLesson.questions[0];
    errorLabCases.push({
      id: `${bp.id}-err-${secondLesson.topicId}`,
      subjectId: bp.id,
      topicId: secondLesson.topicId,
      title: {
        ru: `Типичная ловушка: ${secondLesson.title.ru}`,
        kk: `Типтік қате: ${secondLesson.title.kk}`,
        uz: `Tipik xato: ${secondLesson.title.uz}`
      },
      taskPrompt: secondLesson.workedExample.problem,
      steps: {
        ru: [
          secondLesson.workedExample.steps.ru[0] ?? "1) Запишем исходное условие и правило темы",
          `2) Ошибочный шаг: пропущено ключевое ограничение правила (${secondLesson.learningGoal.ru})`,
          secondLesson.workedExample.steps.ru[1] ?? "3) Итоговый вывод без проверки условия"
        ],
        kk: [
          secondLesson.workedExample.steps.kk[0] ?? "1) Бастапқы шарт пен ережені жазамыз",
          `2) Қате қадам: негізгі шектеу ескерілмеді (${secondLesson.learningGoal.kk})`,
          secondLesson.workedExample.steps.kk[1] ?? "3) Шартты тексерусіз қорытынды"
        ],
        uz: [
          secondLesson.workedExample.steps.uz[0] ?? "1) Dastlabki shart va qoidani yozamiz",
          `2) Xato qadam: asosiy cheklov hisobga olinmadi (${secondLesson.learningGoal.uz})`,
          secondLesson.workedExample.steps.uz[1] ?? "3) Shartni tekshirmasdan xulosa"
        ]
      },
      brokenStepIndex: 1,
      errorCategory: transferQ.errorCategory || `${bp.id}_rule_trap`,
      whyBroken: secondLesson.workedExample.takeaway,
      correctedStep: {
        ru: secondLesson.workedExample.steps.ru[1] ?? secondLesson.summary.ru,
        kk: secondLesson.workedExample.steps.kk[1] ?? secondLesson.summary.kk,
        uz: secondLesson.workedExample.steps.uz[1] ?? secondLesson.summary.uz
      },
      transferQuestion: transferQ
    });
  }

  return {
    id: bp.id,
    slug: bp.id,
    category: bp.category,
    badge,
    accentColor,
    iconName: bp.iconName,
    version: "3.0.0",
    updatedAt: "2026-10-10",
    readinessStatus: "starter_course",
    readinessLabel: tr(
      "Стартовый курс · 3 урока + мультиформатная практика + Лаборатория ошибок",
      "Бастапқы курс · 3 сабақ + практика + Қателер зертханасы",
      "Boshlang‘ich kurs · 3 dars + amaliyot + Xatolar laboratoriyasi"
    ),
    title,
    subtitle,
    description: subtitle,
    shortDescription: subtitle,
    levels: bp.levels,
    modules,
    topics,
    lessons,
    errorLabCases,
    diagnosticQuestionIds
  };
}

const DYNAMIC_SUBJECT_REGISTRY = new Map<string, UniversalSubjectCurriculum>();

function ensureDefaultRegistryInitialized() {
  if (DYNAMIC_SUBJECT_REGISTRY.size > 0) return;
  const mathCurriculum = buildMathUniversalCurriculum();
  DYNAMIC_SUBJECT_REGISTRY.set("math", mathCurriculum);
  for (const bp of NON_MATH_BLUEPRINTS) {
    DYNAMIC_SUBJECT_REGISTRY.set(bp.id, compileBlueprintToCurriculum(bp));
  }
}

/**
 * Dynamic Subject Registry API: allows adding or overriding a subject curriculum at runtime
 * without rewriting UI components.
 */
export function registerSubjectCurriculum(curriculum: UniversalSubjectCurriculum): void {
  ensureDefaultRegistryInitialized();
  DYNAMIC_SUBJECT_REGISTRY.set(curriculum.id, curriculum);
}

export function getSubjectCurriculum(subjectId: string): UniversalSubjectCurriculum | null {
  ensureDefaultRegistryInitialized();
  return DYNAMIC_SUBJECT_REGISTRY.get(subjectId) ?? null;
}

export function getAllSubjectCurricula(): UniversalSubjectCurriculum[] {
  ensureDefaultRegistryInitialized();
  return Array.from(DYNAMIC_SUBJECT_REGISTRY.values());
}

/**
 * Resolves a lesson within a subject curriculum by full lesson ID (e.g. `physics-lesson-phys_kinematics`),
 * topicId (`phys_kinematics`), or hyphen/underscore-normalized slug (`phys-kinematics`) (P1-004 & E2E-013).
 */
export function findSubjectLessonByIdOrSlug(
  curriculum: UniversalSubjectCurriculum,
  lessonIdOrSlug: string | null | undefined
): { lesson: UniversalLesson; index: number } | null {
  if (!lessonIdOrSlug || typeof lessonIdOrSlug !== "string") return null;
  const raw = decodeURIComponent(lessonIdOrSlug).trim().toLowerCase();
  if (!raw) return null;
  const norm = raw.replace(/[-_]+/g, "_");

  for (let i = 0; i < curriculum.lessons.length; i++) {
    const l = curriculum.lessons[i];
    const lid = l.id.toLowerCase();
    const tid = l.topicId.toLowerCase();
    if (
      lid === raw ||
      tid === raw ||
      lid.replace(/[-_]+/g, "_") === norm ||
      tid.replace(/[-_]+/g, "_") === norm ||
      lid.endsWith(`_${norm}`) ||
      lid.endsWith(`-${raw}`)
    ) {
      return { lesson: l, index: i };
    }
  }
  return null;
}

export interface UniversalGraphNodeView {
  id: string;
  subjectId: string;
  title: Record<Language, string>;
  sectionTitle: Record<Language, string>;
  difficulty: UniversalDifficulty;
  prerequisites: string[];
  unlocks: string[];
  lessonId: string;
  lessonCompleted: boolean;
  masteryScore: number;
  status: "unassessed" | "mastered" | "review" | "gap" | "recommended";
  attemptsCount: number;
}

/**
 * P0-001 FIX: Builds the subject knowledge graph strictly separating `lessonCompleted` (theory read)
 * from verified question mastery (`stat.max > 0`). Completing a lesson without verified answers
 * NEVER sets `status = "mastered"` or inflates `masteryScore`.
 */
export function buildUniversalSubjectGraph(
  subjectId: string,
  completedLessonIds: string[] = [],
  topicAccuracyMap: Record<string, { earned: number; max: number; attempts: number }> = {}
): UniversalGraphNodeView[] {
  const curriculum = getSubjectCurriculum(subjectId);
  if (!curriculum) return [];

  const completedSet = new Set(completedLessonIds);
  const rawNodes: UniversalGraphNodeView[] = curriculum.topics.map((topic) => {
    const stat = topicAccuracyMap[topic.id];
    const lessonDone = completedSet.has(topic.lessonId);
    let masteryScore = 0;
    const attemptsCount = stat?.attempts ?? 0;

    let status: UniversalGraphNodeView["status"] = "unassessed";
    if (stat && stat.max > 0) {
      masteryScore = Math.round((stat.earned / stat.max) * 100);
      if (masteryScore >= 80) status = "mastered";
      else if (masteryScore >= 50) status = "review";
      else status = "gap";
    }

    return {
      id: topic.id,
      subjectId: topic.subjectId,
      title: topic.title,
      sectionTitle: topic.sectionTitle,
      difficulty: topic.difficulty,
      prerequisites: topic.prerequisites,
      unlocks: topic.unlocks,
      lessonId: topic.lessonId,
      lessonCompleted: lessonDone,
      masteryScore,
      status,
      attemptsCount
    };
  });

  // Mark the first unassessed node whose prerequisites are mastered (or completed/empty) as "recommended"
  const readyPrereqIds = new Set(
    rawNodes.filter((n) => n.status === "mastered" || n.lessonCompleted).map((n) => n.id)
  );
  let assignedRecommended = false;
  for (const node of rawNodes) {
    if (node.status === "unassessed" && !node.lessonCompleted) {
      const prereqsMet = node.prerequisites.every((p) => readyPrereqIds.has(p));
      if (prereqsMet) {
        node.status = "recommended";
        assignedRecommended = true;
        break;
      }
    }
  }
  if (!assignedRecommended) {
    for (const node of rawNodes) {
      if (node.status === "unassessed") {
        node.status = "recommended";
        break;
      }
    }
  }

  return rawNodes;
}

/**
 * Computes the exact recommended next lesson for a subject based on diagnostic results,
 * topic gaps, or uncompleted lessons (P1-003 & Section 10).
 */
export function computeRecommendedLessonForSubject(
  curriculum: UniversalSubjectCurriculum,
  completedLessonIds: string[] = [],
  topicAccuracyMap: Record<string, { earned: number; max: number; attempts: number }> = {},
  preferredLessonId?: string
): {
  lesson: UniversalLesson;
  index: number;
  reason: Record<Language, string>;
} {
  if (preferredLessonId) {
    const matched = findSubjectLessonByIdOrSlug(curriculum, preferredLessonId);
    if (matched) {
      return {
        lesson: matched.lesson,
        index: matched.index,
        reason: tr(
          `Рекомендовано по итогам входной диагностики: «${matched.lesson.title.ru}».`,
          `Бастапқы диагностика нәтижесі бойынша ұсынылды: «${matched.lesson.title.kk}».`,
          `Boshlang‘ich diagnostika natijasiga ko‘ra tavsiya etildi: «${matched.lesson.title.uz}».`
        )
      };
    }
  }

  const graph = buildUniversalSubjectGraph(curriculum.id, completedLessonIds, topicAccuracyMap);
  const gapNode = graph.find((n) => n.status === "gap") ?? graph.find((n) => n.status === "review");
  if (gapNode) {
    const matched = findSubjectLessonByIdOrSlug(curriculum, gapNode.lessonId);
    if (matched) {
      return {
        lesson: matched.lesson,
        index: matched.index,
        reason: tr(
          `Обнаружен пробел в теме «${matched.lesson.title.ru}» (точность ${gapNode.masteryScore}%) — закройте базовое правило перед переходом далее.`,
          `«${matched.lesson.title.kk}» тақырыбында олқылық анықталды (дәлдік ${gapNode.masteryScore}%) — келесі тақырыпқа өтпес бұрын ережені бекітіңіз.`,
          `«${matched.lesson.title.uz}» mavzusida bo‘shliq aniqlandi (aniqlik ${gapNode.masteryScore}%) — keyingi mavzuga o‘tishdan oldin qoidani mustahkamlang.`
        )
      };
    }
  }

  const recNode = graph.find((n) => n.status === "recommended");
  if (recNode) {
    const matched = findSubjectLessonByIdOrSlug(curriculum, recNode.lessonId);
    if (matched) {
      return {
        lesson: matched.lesson,
        index: matched.index,
        reason: tr(
          `Следующий шаг учебной траектории: «${matched.lesson.title.ru}».`,
          `Оқу траекториясының келесі қадамы: «${matched.lesson.title.kk}».`,
          `O‘quv trayektoriyasining keyingi qadami: «${matched.lesson.title.uz}».`
        )
      };
    }
  }

  const fallback = curriculum.lessons[0];
  return {
    lesson: fallback,
    index: 0,
    reason: tr(
      `Стартовый урок курса: «${fallback.title.ru}».`,
      `Курстың бастапқы сабағы: «${fallback.title.kk}».`,
      `Kursning boshlang‘ich darsi: «${fallback.title.uz}».`
    )
  };
}

export function formatCountRu(count: number, one: string, few: string, many: string): string {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return `${count} ${many}`;
  if (n1 > 1 && n1 < 5) return `${count} ${few}`;
  if (n1 === 1) return `${count} ${one}`;
  return `${count} ${many}`;
}

export function formatLessonsCountLabel(count: number, lang: Language): string {
  if (lang === "kk") return `${count} сабақ`;
  if (lang === "uz") return `${count} ta dars`;
  return formatCountRu(count, "урок", "урока", "уроков");
}

export function formatQuestionsCountLabel(count: number, lang: Language): string {
  if (lang === "kk") return `${count} тапсырма`;
  if (lang === "uz") return `${count} ta topshiriq`;
  return formatCountRu(count, "задание", "задания", "заданий");
}

export function formatModulesCountLabel(count: number, lang: Language): string {
  if (lang === "kk") return `${count} модуль`;
  if (lang === "uz") return `${count} ta modul`;
  return formatCountRu(count, "модуль", "модуля", "модулей");
}

export interface WelcomeSubjectDemoItem {
  subjectId: UntSubjectId;
  badge: string;
  subjectTitle: Record<Language, string>;
  contextNote: Record<Language, string>;
  question: UniversalQuestion;
}

export const WELCOME_DEMO_ITEMS: WelcomeSubjectDemoItem[] = [
  {
    subjectId: "math",
    badge: "MATH",
    subjectTitle: tr("Математика", "Математика", "Matematika"),
    contextNote: tr(
      "Линейные уравнения: при делении обеих частей на коэффициент знак сохраняется.",
      "Сызықтық теңдеулер: теңдеудің екі жағын коэффициентке бөлу.",
      "Chiziqli tenglamalar: tenglamaning ikkala qismini koeffitsiyentga bo‘lish."
    ),
    question: {
      id: "demo-math-1",
      subjectId: "math",
      topicId: "linear_equations",
      lessonId: "math-lesson-linear",
      type: "single_choice",
      difficulty: "basic",
      maxPoints: 1,
      prompt: tr("Решите уравнение: 3x − 7 = 14. Чему равен x?", "Теңдеуді шешіңіз: 3x − 7 = 14. x неге тең?", "Tenglamani yeching: 3x − 7 = 14. x nimaga teng?"),
      options: {
        ru: ["x = 7", "x = 7/3", "x = −7", "x = 21"],
        kk: ["x = 7", "x = 7/3", "x = −7", "x = 21"],
        uz: ["x = 7", "x = 7/3", "x = −7", "x = 21"]
      },
      correctIndex: 0,
      explanation: tr("Переносим −7 вправо с плюсом: 3x = 14 + 7 = 21. Делим на 3: x = 7.", "−7-ні оң жаққа плюс таңбасымен шығарамыз: 3x = 21 ⇒ x = 7.", "−7 ni o‘ng tomonga plyus bilan o‘tkazamiz: 3x = 21 ⇒ x = 7."),
      hint: tr("При переносе −7 через знак равенства знак меняется на противоположный (+7).", "−7-ні теңдік таңбасынан өткізгенде таңбасы +7 болады.", "−7 ni tenglik belgisidan o‘tkazganda ishorasi +7 bo‘ladi."),
      errorCategory: "sign_flip"
    }
  },
  {
    subjectId: "physics",
    badge: "PHYS",
    subjectTitle: tr("Физика", "Физика", "Fizika"),
    contextNote: tr(
      "Второй закон Ньютона: ускорение прямо пропорционально равнодействующей силе и обратно пропорционально массе (a = F / m).",
      "Ньютонның екінші заңы: үдеу қорытқы күшке тура пропорционал, ал массаға кері пропорционал (a = F / m).",
      "Nyutonning ikkinchi qonuni: tezlanish natijaviy kuchga to‘g‘ri, massaga teskari proporsional (a = F / m)."
    ),
    question: {
      id: "demo-phys-1",
      subjectId: "physics",
      topicId: "phys_dynamics",
      lessonId: "physics-lesson-phys_dynamics",
      type: "single_choice",
      difficulty: "basic",
      maxPoints: 1,
      prompt: tr("На тележку массой m = 4 кг действует равнодействующая сила F = 12 Н. С каким ускорением движется тележка?", "Массасы m = 4 кг арбашаға F = 12 Н қорытқы күш әсер етеді. Арбаша қандай үдеумен қозғалады?", "Massasi m = 4 kg aravachaga F = 12 N natijaviy kuch ta’sir qiladi. Aravacha qanday tezlanish bilan harakatlanadi?"),
      options: {
        ru: ["3 м/с²", "48 м/с²", "8 м/с²", "0.33 м/с²"],
        kk: ["3 м/с²", "48 м/с²", "8 м/с²", "0.33 м/с²"],
        uz: ["3 м/с²", "48 м/с²", "8 м/с²", "0.33 м/с²"]
      },
      correctIndex: 0,
      explanation: tr("По II закону Ньютона a = F / m = 12 Н / 4 кг = 3 м/с².", "Ньютонның II заңы бойынша: a = F / m = 12 / 4 = 3 м/с².", "Nyutonning II qonuniga ko‘ra: a = F / m = 12 / 4 = 3 m/s²."),
      hint: tr("Разделите силу F (12 Н) на массу m (4 кг).", "Күшті (12 Н) массаға (4 кг) бөліңіз.", "Kuchni (12 N) massaga (4 kg) bo‘ling."),
      errorCategory: "formula_inversion"
    }
  },
  {
    subjectId: "english",
    badge: "ENG",
    subjectTitle: tr("Английский язык", "Ағылшын тілі", "Ingliz tili"),
    contextNote: tr(
      "First Conditional: в придаточном условия после if используется Present Simple, а не будущее время will.",
      "First Conditional: if жалғаулығынан кейін келер шақ (will) емес, Present Simple қолданылады.",
      "First Conditional: if bog‘lovchisidan keyin will emas, Present Simple ishlatiladi."
    ),
    question: {
      id: "demo-eng-1",
      subjectId: "english",
      topicId: "eng_conditionals",
      lessonId: "english-lesson-eng_conditionals",
      type: "single_choice",
      difficulty: "basic",
      maxPoints: 1,
      prompt: tr("Выберите грамматически верную форму: «If she ___ early tomorrow, we will catch the morning train.»", "Дұрыс грамматикалық форманы таңдаңыз: «If she ___ early tomorrow, we will catch the morning train.»", "To‘g‘ri grammatik shaklni tanlang: «If she ___ early tomorrow, we will catch the morning train.»"),
      options: {
        ru: ["arrives", "will arrive", "arrived", "would arrive"],
        kk: ["arrives", "will arrive", "arrived", "would arrive"],
        uz: ["arrives", "will arrive", "arrived", "would arrive"]
      },
      correctIndex: 0,
      explanation: tr("В условных предложениях I типа после if используется Present Simple (she arrives).", "I типті шартты сөйлемде if-тен кейін Present Simple (she arrives) қолданылады.", "I turdagi shart gapda if dan keyin Present Simple (she arrives) ishlatiladi."),
      hint: tr("После if нельзя ставить will; для местоимения she в Present Simple добавляется окончание -s.", "If-тен кейін will қойылмайды; she үшін -s жалғауы жалғанады.", "If dan keyin will qo‘yilmaydi; she uchun -s qo‘shimchasi qo‘shiladi."),
      errorCategory: "conditional_will"
    }
  },
  {
    subjectId: "history_kz",
    badge: "HIST KZ",
    subjectTitle: tr("История Казахстана", "Қазақстан тарихы", "Qozog‘iston tarixi"),
    contextNote: tr(
      "Образование Казахского ханства: в 1465 году султаны Керей и Жанибек основали ханство в Западном Жетысу (Козыбасы).",
      "Қазақ хандығының құрылуы: 1465 жылы Керей мен Жәнібек сұлтандар Батыс Жетісуда (Қозыбасы) хандықтың негізін қалады.",
      "Qozoq xonligining tashkil topishi: 1465-yilda Kerey va Janibek sultonlar G‘arbiy Jetisuvda (Qo‘ziboshi) xonlikka asos soldilar."
    ),
    question: {
      id: "demo-hkz-1",
      subjectId: "history_kz",
      topicId: "hkz_khanate",
      lessonId: "history_kz-lesson-hkz_khanate",
      type: "single_choice",
      difficulty: "basic",
      maxPoints: 1,
      prompt: tr("При каком хане в конце XVII — начале XVIII века был принят свод законов «Жеті жарғы» («Семь установлений»)?", "XVII ғ. соңы — XVIII ғ. басында «Жеті жарғы» заңдар жинағы қай ханның тұсында қабылданды?", "XVII asr oxiri — XVIII asr boshida «Jeti jarg‘i» qonunlar to‘plami qaysi xon davrida qabul qilingan?"),
      options: {
        ru: ["Тауке-хан", "Касым-хан", "Есим-хан", "Хакназар-хан"],
        kk: ["Тәуке хан", "Қасым хан", "Есім хан", "Хақназар хан"],
        uz: ["Tauke xon", "Qosim xon", "Yesim xon", "Haqnazar xon"]
      },
      correctIndex: 0,
      explanation: tr("Свод законов «Жеті жарғы» был разработан и принят при Тауке-хане с участием Толе би, Казыбек би и Айтеке би.", "«Жеті жарғы» Тәуке хан тұсында үш ұлы бидің қатысуымен қабылданды.", "«Jeti jarg‘i» Tauke xon davrida uch buyuk biy ishtirokida qabul qilingan."),
      hint: tr("При Касым-хане был «Қасқа жол», при Есим-хане — «Ескі жол», а «Жеті жарғы»...", "Қасым ханда — «Қасқа жол», Есім ханда — «Ескі жол», ал «Жеті жарғы»...", "Qosim xonda — «Qasqa yo‘l», Yesim xonda — «Eski yo‘l», «Jeti jarg‘i» esa..."),
      errorCategory: "chronology_order"
    }
  },
  {
    subjectId: "informatics",
    badge: "INFO",
    subjectTitle: tr("Информатика", "Информатика", "Informatika"),
    contextNote: tr(
      "Python range(start, stop): левая граница start включается, а правая граница stop НЕ включается.",
      "Python range(start, stop): сол жақ start шекарасы кіреді, ал оң жақ stop шекарасы КІРМЕЙДІ.",
      "Python range(start, stop): chap start chegarasi kiradi, o‘ng stop chegarasi esa KIRMAYDI."
    ),
    question: {
      id: "demo-inf-1",
      subjectId: "informatics",
      topicId: "inf_python_loops",
      lessonId: "informatics-lesson-inf_python_loops",
      type: "single_choice",
      difficulty: "basic",
      maxPoints: 1,
      prompt: tr("Что выведет код на Python: print(sum(range(1, 5)))?", "Python коды не шығарады: print(sum(range(1, 5)))?", "Python kodi nimani chiqaradi: print(sum(range(1, 5)))?"),
      options: {
        ru: ["10 (сумма 1 + 2 + 3 + 4)", "15 (сумма 1 + 2 + 3 + 4 + 5)", "4", "5"],
        kk: ["10 (1 + 2 + 3 + 4 қосындысы)", "15 (1 + 2 + 3 + 4 + 5 қосындысы)", "4", "5"],
        uz: ["10 (1 + 2 + 3 + 4 yig‘indisi)", "15 (1 + 2 + 3 + 4 + 5 yig‘indisi)", "4", "5"]
      },
      correctIndex: 0,
      explanation: tr("range(1, 5) возвращает числа 1, 2, 3, 4 (число 5 не входит). Их сумма равна 1 + 2 + 3 + 4 = 10.", "range(1, 5) тек 1, 2, 3, 4 сандарын береді. Қосындысы: 10.", "range(1, 5) faqat 1, 2, 3, 4 sonlarini beradi. Yig‘indisi: 10."),
      hint: tr("Вспомните, включается ли верхняя граница 5 в range(1, 5).", "range(1, 5) ішіне жоғарғы шекара 5 кіре ме?", "range(1, 5) ichiga yuqori chegara 5 kiradimi?"),
      errorCategory: "off_by_one_range"
    }
  }
];
