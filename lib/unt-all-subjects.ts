import type { Language, TopicId } from "./curriculum";
import type {
  UntContextQuestion,
  UntMatchingQuestion,
  UntMultipleQuestion,
  UntQuestion,
  UntSingleQuestion
} from "./unt-exam";

export type UntSubjectId =
  | "math"
  | "physics"
  | "informatics"
  | "chemistry"
  | "biology"
  | "geography"
  | "history_kz"
  | "world_history"
  | "law"
  | "english"
  | "math_lit"
  | "reading_lit";

export type SubjectIconName =
  | "Calculator"
  | "Atom"
  | "Cpu"
  | "FlaskConical"
  | "Dna"
  | "Globe"
  | "Landmark"
  | "Scale"
  | "Languages"
  | "BookOpen"
  | "BarChart3"
  | "ScrollText";

export interface SubjectReferenceFact {
  tag: string;
  formulaOrFact: string;
  note: Record<Language, string>;
}

export interface UntSubjectSpec {
  id: UntSubjectId;
  category: "profile" | "mandatory";
  icon: SubjectIconName;
  accentRgb: string;
  officialQuestions: number;
  officialMaxPoints: number;
  thresholdPoints: number;
  variantQuestionsCount: 40;
  variantMaxPoints: 50;
  variantsAvailable: 10;
  title: Record<Language, string>;
  shortTitle: Record<Language, string>;
  description: Record<Language, string>;
  sections: Record<Language, string[]>;
  referenceCheatsheet: SubjectReferenceFact[];
}

export interface UntProfileCombination {
  id: string;
  subjects: [UntSubjectId, UntSubjectId];
  title: Record<Language, string>;
  careers: Record<Language, string>;
  minGrantScore140: number;
}

export const UNT_PROFILE_COMBINATIONS: UntProfileCombination[] = [
  {
    id: "math_informatics",
    subjects: ["math", "informatics"],
    title: {
      ru: "Математика + Информатика",
      kk: "Математика + Информатика",
      uz: "Matematika + Informatika"
    },
    careers: {
      ru: "IT, Software Engineering, ИИ, Кибербезопасность (КБТУ, AITU, IITU, SDU)",
      kk: "IT, Software Engineering, ЖИ, Киберқауіпсіздік (ҚБТУ, AITU, IITU, SDU)",
      uz: "IT, Dasturlash, Sun’iy intellekt, Kiberxavfsizlik"
    },
    minGrantScore140: 112
  },
  {
    id: "math_physics",
    subjects: ["math", "physics"],
    title: {
      ru: "Математика + Физика",
      kk: "Математика + Физика",
      uz: "Matematika + Fizika"
    },
    careers: {
      ru: "Инженерия, энергетика, авиация, робототехника, строительство (Satbayev, КБТУ)",
      kk: "Инженерия, энергетика, авиация, робототехника, құрылыс (Satbayev, ҚБТУ)",
      uz: "Muhandislik, energetika, aviatsiya, robototexnika, qurilish"
    },
    minGrantScore140: 96
  },
  {
    id: "math_geography",
    subjects: ["math", "geography"],
    title: {
      ru: "Математика + География",
      kk: "Математика + География",
      uz: "Matematika + Geografiya"
    },
    careers: {
      ru: "Экономика, финансы, аудит, логистика, менеджмент (Нархоз, КазНУ, ЕНУ)",
      kk: "Экономика, қаржы, аудит, логистика, менеджмент (Нархоз, ҚазҰУ, ЕҰУ)",
      uz: "Iqtisodiyot, moliya, audit, logistika, menejment"
    },
    minGrantScore140: 108
  },
  {
    id: "chem_biology",
    subjects: ["chemistry", "biology"],
    title: {
      ru: "Химия + Биология",
      kk: "Химия + Биология",
      uz: "Kimyo + Biologiya"
    },
    careers: {
      ru: "Общая медицина, стоматология, биотехнологии, фармацевтика (КазНМУ, МУА)",
      kk: "Жалпы медицина, стоматология, биотехнология, фармацевтика (ҚазҰМУ, АМУ)",
      uz: "Umumiy tibbiyot, stomatologiya, biotexnologiya, farmatsevtika"
    },
    minGrantScore140: 115
  },
  {
    id: "history_law",
    subjects: ["world_history", "law"],
    title: {
      ru: "Всемирная история + Основы права",
      kk: "Дүниежүзі тарихы + Құқық негіздері",
      uz: "Jahon tarixi + Huquq asoslari"
    },
    careers: {
      ru: "Юриспруденция, таможенное дело, государственное управление (КАЗГЮУ, КазНУ)",
      kk: "Құқықтану, кеден ісі, мемлекеттік басқару (КАЗГЮУ, ҚазҰУ)",
      uz: "Yurisprudensiya, bojxona ishi, davlat boshqaruvi"
    },
    minGrantScore140: 114
  },
  {
    id: "english_history",
    subjects: ["english", "world_history"],
    title: {
      ru: "Английский язык + Всемирная история",
      kk: "Ағылшын тілі + Дүниежүзі тарихы",
      uz: "Ingliz tili + Jahon tarixi"
    },
    careers: {
      ru: "Международные отношения, переводческое дело, дипломатия, туризм (КазУМОиМЯ)",
      kk: "Халыкаралық қатынастар, аударма ісі, дипломатия, туризм (ҚазХҚжӘТУ)",
      uz: "Xalqaro munosabatlar, tarjimonlik, diplomatiya, turizm"
    },
    minGrantScore140: 116
  }
];

export const UNT_SUBJECTS: UntSubjectSpec[] = [
  {
    id: "math",
    category: "profile",
    icon: "Calculator",
    accentRgb: "217, 138, 43",
    officialQuestions: 40,
    officialMaxPoints: 50,
    thresholdPoints: 5,
    variantQuestionsCount: 40,
    variantMaxPoints: 50,
    variantsAvailable: 10,
    title: {
      ru: "Профильная математика",
      kk: "Бейіндік математика",
      uz: "Ixtisoslashgan matematika"
    },
    shortTitle: {
      ru: "Математика",
      kk: "Математика",
      uz: "Matematika"
    },
    description: {
      ru: "Полный курс НЦТ РК (5–11 кл.): алгебра, тригонометрия, логарифмы, производная, интеграл, планиметрия, стереометрия и векторы.",
      kk: "ҚР ҰТО толық курсы (5–11 сын.): алгебра, тригонометрия, логарифмдер, туынды, интеграл, планиметрия, стереометрия және векторлар.",
      uz: "To‘liq kurs (5–11-sinf): algebra, trigonometriya, logarifmlar, hosila, integral, planimetriya, stereometriya va vektorlar."
    },
    sections: {
      ru: [
        "Тождественные преобразования, степени и корни",
        "Уравнения и системы (линейные, квадратные, Виета)",
        "Неравенства и метод интервалов",
        "Арифметическая и геометрическая прогрессии",
        "Показательные и логарифмические уравнения/неравенства (ОДЗ)",
        "Тригонометрия (тождества, приведение, уравнения)",
        "Производная, касательная и точки экстремума",
        "Первообразная, интеграл и площадь фигуры",
        "Планиметрия, Стереометрия и Векторы в пространстве"
      ],
      kk: [
        "Тепе-тең түрлендірулер, дәреже мен түбір",
        "Теңдеулер мен жүйелер (сызықтық, квадраттық, Виет)",
        "Теңсіздіктер және интервалдар әдісі",
        "Арифметикалық және геометриялық прогрессиялар",
        "Көрсеткіштік және логарифмдік теңдеулер/теңсіздіктер (АОО)",
        "Тригонометрия (тепе-теңдіктер, келтіру формулалары)",
        "Туынды, жанама және экстремум нүктелері",
        "Алғашқы функция, интеграл және фигура ауданы",
        "Планиметрия, Стереометрия және кеңістіктегі векторлар"
      ],
      uz: [
        "Ayniy almashtirishlar, daraja va ildizlar",
        "Tenglamalar va sistemalar (chiziqli, kvadrat, Viyet)",
        "Tengsizliklar va intervallar usuli",
        "Arifmetik va geometrik progressiyalar",
        "Ko‘rsatkichli va logarifmik tenglamalar (AS)",
        "Trigonometriya (ayniyatlar, keltirish formulalari)",
        "Hosila, urinma va ekstremum nuqtalari",
        "Boshlang‘ich funksiya, integral va yuza",
        "Planimetriya, Stereometriya va fazodagi vektorlar"
      ]
    },
    referenceCheatsheet: [
      {
        tag: "Виета & Корни",
        formulaOrFact: "x₁ + x₂ = −b/a,  x₁·x₂ = c/a;  √(f(x)²) = |f(x)|",
        note: {
          ru: "При снятии чётного корня обязательно ставится модуль |f(x)|.",
          kk: "Жұп дәрежелі түбірден шығарғанда |f(x)| модулі қойылады.",
          uz: "Juft ildizdan chiqarishda |f(x)| moduli qo‘yiladi."
        }
      },
      {
        tag: "Логарифмы (ОДЗ)",
        formulaOrFact: "log_a(f(x)) > c  (0 < a < 1)  ⇒  0 < f(x) < a^c",
        note: {
          ru: "При основании 0 < a < 1 знак неравенства меняется и добавляется условие ОДЗ f(x) > 0.",
          kk: "0 < a < 1 негізінде теңсіздік таңбасы өзгереді және f(x) > 0 АОО шарты қосылады.",
          uz: "0 < a < 1 asosda tengsizlik ishorasi o‘zgaradi va f(x) > 0 sharti qo‘shiladi."
        }
      },
      {
        tag: "Тригонометрия",
        formulaOrFact: "sin²x + cos²x = 1;  sin 2x = 2 sin x cos x;  cos 2x = cos²x − sin²x",
        note: {
          ru: "Множество значений a·sin x + b·cos x равно [−√(a²+b²); √(a²+b²)].",
          kk: "a·sin x + b·cos x мәндер жиыны [−√(a²+b²); √(a²+b²)] аралығына тең.",
          uz: "a·sin x + b·cos x qiymatlar sohasi [−√(a²+b²); √(a²+b²)] ga teng."
        }
      },
      {
        tag: "Производная & Интеграл",
        formulaOrFact: "y_кас = f(x₀) + f'(x₀)(x − x₀);  S = ∫_a^b f(x)dx = F(b) − F(a)",
        note: {
          ru: "Площадь параболического сегмента между корнями x₁, x₂: S = |a|·|x₂ − x₁|³ / 6.",
          kk: "Парабола сегментінің ауданы: S = |a|·|x₂ − x₁|³ / 6.",
          uz: "Parabola segmenti yuzi: S = |a|·|x₂ − x₁|³ / 6."
        }
      },
      {
        tag: "Стереометрия",
        formulaOrFact: "V_призмы = S_осн·h;  V_пир = (1/3)S_осн·h;  V_шара = (4/3)πR³",
        note: {
          ru: "У тел с вершиной (пирамида, конус) объём всегда содержит множитель 1/3.",
          kk: "Төбесі бар денелердің (пирамида, конус) көлемінде әрқашан 1/3 көбейткіші бар.",
          uz: "Cho‘qqili jismlar (piramida, konus) hajmida doim 1/3 ko‘paytuvchi bor."
        }
      }
    ]
  },
  {
    id: "physics",
    category: "profile",
    icon: "Atom",
    accentRgb: "59, 130, 246",
    officialQuestions: 40,
    officialMaxPoints: 50,
    thresholdPoints: 5,
    variantQuestionsCount: 40,
    variantMaxPoints: 50,
    variantsAvailable: 10,
    title: {
      ru: "Физика",
      kk: "Физика",
      uz: "Fizika"
    },
    shortTitle: {
      ru: "Физика",
      kk: "Физика",
      uz: "Fizika"
    },
    description: {
      ru: "Механика, МКТ и термодинамика, электродинамика, колебания и волны, оптика, СТО, квантовая и ядерная физика по спецификации НЦТ.",
      kk: "Механика, МКТ және термодинамика, электродинамика, тербелістер мен толқындар, оптика, кванттық және ядролық физика.",
      uz: "Mexanika, MKT va termodinamika, elektrodinamika, tebranishlar, optika, kvant va yadro fizikasi."
    },
    sections: {
      ru: [
        "Кинематика и динамика (законы Ньютона, тяготение)",
        "Законы сохранения импульса и механической энергии",
        "Молекулярная физика (МКТ) и термодинамика (цикл Карно)",
        "Электростатика и постоянный ток (закон Ома для полной цепи)",
        "Магнитное поле, электромагнитная индукция и контур Томсона",
        "Геометрическая и волновая оптика (линзы, интерференция)",
        "Квантовая физика (фотоэффект Эйнштейна) и атомное ядро"
      ],
      kk: [
        "Кинематика және динамика (Ньютон заңдары, тартылыс)",
        "Импульс пен механикалық энергияның сақталу заңдары",
        "Молекулалық физика (МКТ) және термодинамика (Карно циклі)",
        "Электростатика және тұрақты ток (толық тізбек үшін Ом заңы)",
        "Магнит өрісі, ЭМ индукция және Томсон контуры",
        "Геометриялық және толқындық оптика (линзалар)",
        "Кванттық физика (Эйнштейн фотоэффектісі) және атом ядросы"
      ],
      uz: [
        "Kinematika va dinamika (Nyuton qonunlari)",
        "Impuls va mexanik energiyaning saqlanish qonunlari",
        "Molekulyar fizika (MKT) va termodinamika (Karno sikli)",
        "Elektrostatika va o‘zgarmas tok (to‘liq zanjir uchun Om qonuni)",
        "Magnit maydon, EM induksiya va Tomson konturi",
        "Geometrik va to‘lqin optikasi",
        "Kvant fizikasi (fotoeffekt) va atom yadrosi"
      ]
    },
    referenceCheatsheet: [
      {
        tag: "Кинематика & Динамика",
        formulaOrFact: "S = v₀t + at²/2 = (v² − v₀²)/(2a);  a_ц = v²/R;  F = m·a",
        note: {
          ru: "Первая космическая скорость у поверхности планеты: v₁ = √(gR).",
          kk: "Бірінші ғарыштық жылдамдық: v₁ = √(gR).",
          uz: "Birinchi kosmik tezlik: v₁ = √(gR)."
        }
      },
      {
        tag: "МКТ & Термодинамика",
        formulaOrFact: "pV = (m/M)RT = νRT;  U = (i/2)νRT;  Q = ΔU + A';  η_Карно = (T₁ − T₂)/T₁",
        note: {
          ru: "Средняя квадратичная скорость молекул v_кв = √(3RT/M) пропорциональна √T (в Кельвинах!).",
          kk: "Молекулалардың орташа квадраттық жылдамдығы v_кв = √(3RT/M) абсолют температураның √T-не пропорционал.",
          uz: "Molekulalarning o‘rtacha kvadratik tezligi v_kv = √(3RT/M) √T ga proporsional."
        }
      },
      {
        tag: "Электродинамика",
        formulaOrFact: "I = ε / (R + r);  C = εε₀S/d;  F_A = BIl sin α;  F_L = qvB sin α",
        note: {
          ru: "Радиус траектории заряженной частицы в магнитном поле: R = mv / (qB).",
          kk: "Магнит өрісіндегі зарядталған бөлшек траекториясының радиусы: R = mv / (qB).",
          uz: "Magnit maydondagi zaryadlangan zarra radiusi: R = mv / (qB)."
        }
      },
      {
        tag: "Колебания & Кванты",
        formulaOrFact: "T = 2π√(LC);  hν = A_вых + mv²/2 = A_вых + eU_з;  N = N₀·2^(−t/T)",
        note: {
          ru: "При α-распаде A уменьшается на 4, Z на 2; при β⁻-распаде A не меняется, Z растёт на 1.",
          kk: "α-ыдырауда A 4-ке, Z 2-ге кемиді; β⁻-ыдырауда A өзгермейді, Z 1-ге артады.",
          uz: "α-yemirilishda A 4 ga, Z 2 ga kamayadi; β⁻-yemirilishda Z 1 ga ortadi."
        }
      }
    ]
  },
  {
    id: "informatics",
    category: "profile",
    icon: "Cpu",
    accentRgb: "16, 185, 129",
    officialQuestions: 40,
    officialMaxPoints: 50,
    thresholdPoints: 5,
    variantQuestionsCount: 40,
    variantMaxPoints: 50,
    variantsAvailable: 10,
    title: {
      ru: "Информатика",
      kk: "Информатика",
      uz: "Informatika"
    },
    shortTitle: {
      ru: "Информатика",
      kk: "Информатика",
      uz: "Informatika"
    },
    description: {
      ru: "Системы счисления, алгебра логики, алгоритмы на Python 3, структуры данных, реляционные БД и SQL, сети и IP-адресация.",
      kk: "Санау жүйелері, логика алгебрасы, Python 3 алгоритмдері, деректер қоры және SQL, компьютерлік желілер мен IP-адрестеу.",
      uz: "Sanoq sistemalari, mantiq algebrasi, Python 3 algoritmlari, ma’lumotlar bazasi va SQL, tarmoqlar."
    },
    sections: {
      ru: [
        "Системы счисления (2, 8, 10, 16) и кодирование информации",
        "Алгебра логики (таблицы истинности, законы Де Моргана, вентили)",
        "Алгоритмизация и программирование на Python 3 (срезы, циклы, функции)",
        "Сортировка, поиск и оценка сложности алгоритмов O(n), O(log n)",
        "Реляционные базы данных (1НФ–3НФ) и запросы SQL",
        "Компьютерные сети (модель OSI, маска подсети, IP-адресация)"
      ],
      kk: [
        "Санау жүйелері (2, 8, 10, 16) және ақпаратты кодтау",
        "Логика алгебрасы (ақиқаттық кестесі, Де Морган заңдары)",
        "Python 3 тілінде программалау (кесінділер, циклдар, тізімдер)",
        "Сұрыптау, бинарлық іздеу және алгоритм күрделілігі",
        "Реляциялық деректер қоры (1ҚФ–3ҚФ) және SQL сұраныстары",
        "Компьютерлік желілер (OSI моделі, ішкі желі маскасы, IP)"
      ],
      uz: [
        "Sanoq sistemalari (2, 8, 10, 16) va axborotni kodlash",
        "Mantiq algebrasi (De Morgan qonunlari, mantiqiy elementlar)",
        "Python 3 dasturlash tili (kesimlar, sikllar, ro‘yxatlar)",
        "Saralash va ikkilik qidiruv algoritmlari",
        "Relyatsion ma’lumotlar bazasi va SQL so‘rovlari",
        "Kompyuter tarmoqlari (OSI modeli, IP-manzillash)"
      ]
    },
    referenceCheatsheet: [
      {
        tag: "Кодирование & Хартли",
        formulaOrFact: "N = 2^i;  I_текст = K·i;  I_звук = f · i · t · k",
        note: {
          ru: "Для стереозвука k = 2, для моно k = 1; 1 байт = 8 бит, 1 Кбайт = 1024 байт.",
          kk: "Стерео дыбыс үшін k = 2, моно үшін k = 1; 1 Кбайт = 1024 байт.",
          uz: "Stereo tovush uchun k = 2, mono uchun k = 1; 1 Kbayt = 1024 bayt."
        }
      },
      {
        tag: "Алгебра логики",
        formulaOrFact: "¬(A ∧ B) = ¬A ∨ ¬B;  A → B = ¬A ∨ B;  ¬(A → B) = A ∧ ¬B",
        note: {
          ru: "Приоритет: 1) NOT  2) AND  3) OR / XOR  4) Импликация (→)  5) Эквивалентность (≡).",
          kk: "Басымдық: 1) NOT  2) AND  3) OR / XOR  4) Импликация (→)  5) Эквиваленттілік (≡).",
          uz: "Ustunlik: 1) NOT  2) AND  3) OR / XOR  4) Implikatsiya (→)  5) Ekvivalentlik."
        }
      },
      {
        tag: "Python 3 & Сети",
        formulaOrFact: "2 ** 3 ** 2 == 512;  -7 // 2 == -4;  NetID = IP & Mask;  Hosts = 2^(32−n) − 2",
        note: {
          ru: "Оператор ** правоассоциативен; в подсети вычитаются 2 адреса (сеть и широковещательный).",
          kk: "** операторы оңнан солға қарай есептеледі; ішкі желіде 2 адрес алынып тасталады.",
          uz: "** operatori o‘ngdan chapga hisoblanadi; tarmoqda 2 ta manzil ayriladi."
        }
      }
    ]
  },
  {
    id: "chemistry",
    category: "profile",
    icon: "FlaskConical",
    accentRgb: "139, 92, 246",
    officialQuestions: 40,
    officialMaxPoints: 50,
    thresholdPoints: 5,
    variantQuestionsCount: 40,
    variantMaxPoints: 50,
    variantsAvailable: 10,
    title: {
      ru: "Химия",
      kk: "Химия",
      uz: "Kimyo"
    },
    shortTitle: {
      ru: "Химия",
      kk: "Химия",
      uz: "Kimyo"
    },
    description: {
      ru: "Общая, неорганическая и органическая химия: строение атома, ОВР, электролиз, равновесие Ле Шателье, именные реакции и расчётные задачи.",
      kk: "Жалпы, бейорганикалық және органикалық химия: атом құрылысы, ТТР, электролиз, Ле Шателье принципі және есептер.",
      uz: "Umumiy, noorganik va organik kimyo: atom tuzilishi, OQR, elektroliz, Le Shatelye prinsipi va masalalar."
    },
    sections: {
      ru: [
        "Строение атома, периодический закон и химическая связь",
        "Химическая кинетика (Вант-Гофф) и равновесие (Ле Шателье)",
        "Растворы, электролитическая диссоциация, гидролиз и электролиз",
        "Окислительно-восстановительные реакции (ОВР) и неорганика",
        "Органическая химия (углеводороды, спирты, альдегиды, кислоты, амины)",
        "Расчётные задачи на выход продукта, примеси и избыток/недостаток"
      ],
      kk: [
        "Атом құрылысы, периодтық заң және химиялық байланыс",
        "Химиялық кинетика (Вант-Гофф) және тепе-теңдік (Ле Шателье)",
        "Ерітінділер, диссоциация, гидролиз және электролиз",
        "Тотығу-тотықсыздану реакциялары (ТТР) және бейорганика",
        "Органикалық химия (көмірсутектер, спирттер, альдегидтер, аминдер)",
        "Өнім шығымына, қоспаға және артық/кем затқа арналған есептер"
      ],
      uz: [
        "Atom tuzilishi, davriy qonun va kimyoviy bog‘lanish",
        "Kimyoviy kinetika (Vant-Goff) va muvozanat (Le Shatelye)",
        "Eritmalar, dissotsiatsiya, gidroliz va elektroliz",
        "Oksidlanish-qaytarilish reaksiyalari va noorganika",
        "Organik kimyo (uglevodorodlar, spirtlar, aldegidlar, aminlar)",
        "Mahsulot unumi va aralashmalarga oid masalalar"
      ]
    },
    referenceCheatsheet: [
      {
        tag: "Проскок электрона",
        formulaOrFact: "Cr (Z=24): [Ar] 3d⁵ 4s¹;  Cu (Z=29): [Ar] 3d¹⁰ 4s¹",
        note: {
          ru: "У хрома и меди один электрон переходит с 4s на 3d-подуровень для устойчивости.",
          kk: "Хром мен мыста бір электрон 4s-тен 3d-деңгейшесіне өтеді.",
          uz: "Xrom va misda bitta elektron 4s dan 3d pog‘onachaga o‘tadi."
        }
      },
      {
        tag: "Кинетика & Выход",
        formulaOrFact: "v₂ = v₁ · γ^((T₂−T₁)/10);  n = m/M = V/22.4;  η = (m_пр / m_теор)·100%",
        note: {
          ru: "Твёрдые вещества не входят в кинетическое уравнение закона действующих масс.",
          kk: "Қатты заттар әрекеттесуші массалар заңының теңдеуіне кірмейді.",
          uz: "Qattiq moddalar tezlik tenglamasiga kirmaydi."
        }
      }
    ]
  },
  {
    id: "biology",
    category: "profile",
    icon: "Dna",
    accentRgb: "22, 163, 74",
    officialQuestions: 40,
    officialMaxPoints: 50,
    thresholdPoints: 5,
    variantQuestionsCount: 40,
    variantMaxPoints: 50,
    variantsAvailable: 10,
    title: {
      ru: "Биология",
      kk: "Биология",
      uz: "Biologiya"
    },
    shortTitle: {
      ru: "Биология",
      kk: "Биология",
      uz: "Biologiya"
    },
    description: {
      ru: "Цитология, молекулярная биология (ДНК/РНК, АТФ), митоз и мейоз, генетика Менделя и Моргана, ботаника, зоология, анатомия и экология.",
      kk: "Цитология, молекулалық биология (ДНҚ/РНҚ, АТФ), митоз бен мейоз, Мендель мен Морган генетикасы, анатомия және экология.",
      uz: "Sitologiya, molekulyar biologiya, mitoz va meyoz, Mendel genetikasi, anatomiya va ekologiya."
    },
    sections: {
      ru: [
        "Цитология (немембранные, одно- и двумембранные органоиды)",
        "Молекулярная биология (правило Чаргаффа, биосинтез белка, гликолиз 38 АТФ)",
        "Деление клетки (митоз, мейоз, гаметогенез, наборы 2n4c / 1n1c)",
        "Генетика (законы Менделя, сцепленное наследование Моргана, группы крови)",
        "Ботаника и Зоология (систематика, ткани, циклы развития)",
        "Анатомия человека (круги кровообращения, железы, анализаторы, витамины)"
      ],
      kk: [
        "Цитология (мембранасыз, бір және قос мембраналы органоидтер)",
        "Молекулалық биология (Чаргафф ережесі, нәруыз биосинтезі, 38 АТФ)",
        "Жасушаның бөлінуі (митоз, мейоз, гаметогенез, 2n4c / 1n1c)",
        "Генетика (Мендель заңдары, Морганның тіркес тұқым қуалауы)",
        "Ботаника және Зоология (систематика, ұлпалар, даму циклдері)",
        "Адам анатомиясы (қан айналым шеңберлері, гормондар, дәрумендер)"
      ],
      uz: [
        "Sitologiya (membranasiz, bir va ikki membranali organoidlar)",
        "Molekulyar biologiya (Chargaff qoidasi, oqsil biosintezi, 38 ATF)",
        "Hujayra bo‘linishi (mitoz, meyoz, gametogenez)",
        "Genetika (Mendel va Morgan qonunlari)",
        "Botanika va Zoologiya",
        "Odam anatomiyasi (qon aylanish doiralari, gormonlar, vitaminlar)"
      ]
    },
    referenceCheatsheet: [
      {
        tag: "ДНК & Энергия",
        formulaOrFact: "А = Т (2 Н-связи), Г = Ц (3 Н-связи);  1 глюкоза → 2 АТФ (гликолиз) + 36 АТФ = 38 АТФ",
        note: {
          ru: "Сумма пуринов равна сумме пиримидинов: А + Г = Т + Ц = 50%.",
          kk: "Пуриндер мен пиримидиндер қосындысы тең: А + Г = Т + Ц = 50%.",
          uz: "Purin va pirimidinlar yig‘indisi teng: A + G = T + S = 50%."
        }
      },
      {
        tag: "Митоз, Мейоз & Генетика",
        formulaOrFact: "Анафаза митоза: 4n4c;  Гаметы: 1n1c;  Дигибридное расщепление F₂: 9 : 3 : 3 : 1",
        note: {
          ru: "Кроссинговер происходит в профазе I мейоза; 1 морганида = 1% кроссинговера.",
          kk: "Кроссинговер мейоздың І профазасында жүреді; 1 морганида = 1% кроссинговер.",
          uz: "Krossingover meyozning I profazasida sodir bo‘ladi; 1 morganida = 1%."
        }
      }
    ]
  },
  {
    id: "geography",
    category: "profile",
    icon: "Globe",
    accentRgb: "14, 165, 233",
    officialQuestions: 40,
    officialMaxPoints: 50,
    thresholdPoints: 5,
    variantQuestionsCount: 40,
    variantMaxPoints: 50,
    variantsAvailable: 10,
    title: {
      ru: "География",
      kk: "География",
      uz: "Geografiya"
    },
    shortTitle: {
      ru: "География",
      kk: "География",
      uz: "Geografiya"
    },
    description: {
      ru: "Картография, геосферы Земли, физическая и экономическая география Казахстана (6 экономических районов РК), демография и геоэкономика.",
      kk: "Картография, Жер геосфералары, Қазақстанның физикалық және экономикалық географиясы (6 экономикалық аудан), демография.",
      uz: "Kartografiya, Yer geosferalari, Qozog‘iston geografiyasi, demografiya va геоiqtisodiyot."
    },
    sections: {
      ru: [
        "Картография, масштаб, азимут и часовые пояса",
        "Литосфера, атмосфера, гидросфера и природные зоны",
        "Физическая география Казахстана (рельеф, реки, озёра, заповедники РК)",
        "Экономические районы Казахстана (ТПК, металлургия, ТЭК)",
        "Население мира, демография, урбанизация и международные организации"
      ],
      kk: [
        "Картография, масштаб, азимут және сағаттық белдеулер",
        "Литосфера, атмосфера, гидросфера және табиғат зоналары",
        "Қазақстанның физикалық географиясы (жер бедері, өзен-көлдер, қорықтар)",
        "Қазақстанның экономикалық аудандары (металлургия, ОЭК)",
        "Дүниежүзі халқы, демография, урбандалу және халықаралық ұйымдар"
      ],
      uz: [
        "Kartografiya, masshtab, azimut va soat mintaqalari",
        "Litosfera, atmosfera, gidrosfera va tabiat zonalari",
        "Qozog‘iston tabiiy geografiyasi (relyef, daryolar, qo‘riqxonalar)",
        "Qozog‘iston iqtisodiy rayonlari",
        "Jahon aholisi, demografiya va xalqaro tashkilotlar"
      ]
    },
    referenceCheatsheet: [
      {
        tag: "Рельеф & Границы РК",
        formulaOrFact: "Хан-Тенгри (+7010 м), Карагие (−132 м); Сухопутная граница РК = 13 394 км",
        note: {
          ru: "Граница с РФ — 7 591 км, с Узбекистаном — 2 354 км, с КНР — 1 782 км, с КР — 1 241 км, с Туркменистаном — 426 км.",
          kk: "РФ-мен шекара — 7 591 км, Өзбекстанмен — 2 354 км, ҚХР-мен — 1 782 км.",
          uz: "RF bilan chegara — 7 591 km, O‘zbekiston bilan — 2 354 km, XXR bilan — 1 782 km."
        }
      },
      {
        tag: "Атмосфера & Демография",
        formulaOrFact: "ΔT = −6°C на 1 км высоты;  ΔP = −100 мм рт. ст. на 1 км;  ЕП = Р − С",
        note: {
          ru: "Сальдо миграции СМ = Прибывшие − Выбывшие; Ресурсообеспеченность R = Запасы / Добыча.",
          kk: "Көші-қон сальдосы = Келгендер − Кеткендер; Ресурспен қамтылу = Қор / Өндіру.",
          uz: "Migratsiya saldosi = Kelganlar − Ketganlar; Resurs bilan ta’minlanganlik = Zaxira / Qazib olish."
        }
      }
    ]
  },
  {
    id: "history_kz",
    category: "mandatory",
    icon: "Landmark",
    accentRgb: "216, 90, 48",
    officialQuestions: 20,
    officialMaxPoints: 20,
    thresholdPoints: 5,
    variantQuestionsCount: 40,
    variantMaxPoints: 50,
    variantsAvailable: 10,
    title: {
      ru: "История Казахстана",
      kk: "Қазақстан тарихы",
      uz: "Qozog‘iston tarixi"
    },
    shortTitle: {
      ru: "История РК",
      kk: "Қазақстан тарихы",
      uz: "Qozog‘iston tarixi"
    },
    description: {
      ru: "Обязательный предмет ЕНТ + углублённые 40-вопросные тренажёры: от палеолита, Ботая и саков до Казахского ханства, «Алаш» и Независимого РК.",
      kk: "ҰБТ міндетті пәні + 40 сұрақтық тереңдетілген нұсқалар: палеолит, Ботай және сақтардан Қазақ хандығы, «Алаш» және Тәуелсіз ҚР-ға дейін.",
      uz: "Majburiy fan + 40 savollik chuqurlashtirilgan variantlar: paleolit va saklardan Qozoq xonligi, «Alash» va Mustaqil Qozog‘istongacha."
    },
    sections: {
      ru: [
        "Древний Казахстан (палеолит, Ботай, Андроновская культура, саки, уйсуни, гунны)",
        "Тюркский период (Тюркский, Тюргешский, Карлукский каганаты, Караханиды, Отрар)",
        "Образование и расцвет Казахского ханства (Керей и Жанибек, Касым, Есим, Тауке «Жеты Жаргы»)",
        "Национально-освободительные восстания XVIII–XIX вв. и движение «Алаш» (1917)",
        "Казахстан в XX веке и Независимая Республика Казахстан (1991–2026)"
      ],
      kk: [
        "Ежелгі Қазақстан (палеолит, Ботай, Андронов мәдениеті, сақтар, үйсіндер, ғұндар)",
        "Түркі кезеңі (Түрік, Түргеш, Қарлұқ қағанаттары, Қарахан мемлекеті, Отырар)",
        "Қазақ хандығының құрылуы мен нығаюы (Керей мен Жәнібек, Қасым, Есім, Тәуке «Жеті Жарғы»)",
        "XVIII–XIX ғғ. ұлт-азаттық көтерілістер және «Алаш» қозғалысы (1917)",
        "ХХ ғасырдағы Қазақстан және Тәуелсіз Қазақстан Республикасы (1991–2026)"
      ],
      uz: [
        "Qadimgi Qozog‘iston (paleolit, Botay, saklar, uysunlar, xunnlar)",
        "Turkiy davr (Turk xoqonligi, Qoraxoniylar, O‘tror)",
        "Qozoq xonligining tashkil topishi (Kerey va Jonibek, Qosim, Tauke «Jeti Jarg‘i»)",
        "XVIII–XIX asr milliy-ozodlik qo‘zg‘olonlari va «Alash» harakati (1917)",
        "XX asr va Mustaqil Qozog‘iston Respublikasi (1991–2026)"
      ]
    },
    referenceCheatsheet: [
      {
        tag: "Древность & Тюрки",
        formulaOrFact: "Ботай (IV–III тыс. до н.э.); 552 г. — Тюркский каганат; 751 г. — Атлахская битва; 960 г. — Ислам у Караханидов",
        note: {
          ru: "«Золотой человек» (Иссыкский курган, V–IV вв. до н.э.) открыт К.А. Акишевым в 1969 г.",
          kk: "«Алтын адам» (Есік обасы, б.з.б. V–IV ғғ.) 1969 ж. К.А. Ақышев тапты.",
          uz: "«Oltin odam» (Issiq qo‘rg‘oni) 1969-yilda K.A. Akishev tomonidan topilgan."
        }
      },
      {
        tag: "Казахское ханство & Независимость",
        formulaOrFact: "1465 г. — Керей и Жанибек; 1643 г. — Орбулак; 1729 г. — Аныракай; 16.12.1991 — Независимость РК",
        note: {
          ru: "25.10.1990 — Декларация о суверенитете; 15.11.1993 — введение тенге; 30.08.1995 — Конституция РК.",
          kk: "25.10.1990 — Егемендік декларациясы; 15.11.1993 — теңге; 30.08.1995 — ҚР Конституциясы.",
          uz: "25.10.1990 — Suverenitet deklaratsiyasi; 15.11.1993 — tenge; 30.08.1995 — QR Konstitutsiyasi."
        }
      }
    ]
  },
  {
    id: "world_history",
    category: "profile",
    icon: "ScrollText",
    accentRgb: "180, 83, 9",
    officialQuestions: 40,
    officialMaxPoints: 50,
    thresholdPoints: 5,
    variantQuestionsCount: 40,
    variantMaxPoints: 50,
    variantsAvailable: 10,
    title: {
      ru: "Всемирная история",
      kk: "Дүниежүзі тарихы",
      uz: "Jahon tarixi"
    },
    shortTitle: {
      ru: "Всемирная история",
      kk: "Дүниежүзі тарихы",
      uz: "Jahon tarixi"
    },
    description: {
      ru: "Цивилизации Древнего Востока и Античности, Средневековье, Реформация, буржуазные революции, мировые войны и международные договоры XX–XXI вв.",
      kk: "Ежелгі Шығыс пен Антика өркениеттері, Орта ғасырлар, Реформация, революциялар, дүниежүзілік соғыстар және халықаралық шарттар.",
      uz: "Qadimgi Sharq va Antika, O‘rta asrlar, Reformatsiya, inqiloblar, jahon urushlari va xalqaro shartnomalar."
    },
    sections: {
      ru: [
        "Древний Восток, Древняя Греция и Рим (законы Хаммурапи, реформы Солона)",
        "Средневековье (Византия, Арабский халифат, Великая хартия вольностей 1215, крестовые походы)",
        "Новое время (ВГО, Реформация 1517, Вестфальский мир 1648, война за независимость США 1776, ВФР 1789)",
        "Первая и Вторая мировые войны (Версальско-Вашингтонская и Ялтинско-Потсдамская системы)",
        "Холодная война, деколонизация и современный многополярный мир"
      ],
      kk: [
        "Ежелгі Шығыс, Грекия және Рим (Хаммурапи заңдары, Солон реформалары)",
        "Орта ғасырлар (Византия, Араб халифаты, 1215 ж. Еркіндіктердің ұлы хартиясы)",
        "Жаңа заман (ҰГШ, Реформация 1517, Вестфаль бітімі 1648, АҚШ 1776, ҰФР 1789)",
        "Бірінші және Екінші дүниежүзілік соғыстар (Версаль-Вашингтон және Ялта-Потсдам жүйелері)",
        "Қырғи-қабақ соғыс, деколонизация және қазіргі әлем"
      ],
      uz: [
        "Qadimgi Sharq, Yunoniston va Rim (Xammurapi qonunlari)",
        "O‘rta asrlar (Vizantiya, Arab xalifaligi, 1215-yil Buyuk ozodlik xartiyasi)",
        "Yangi davr (Buyuk geografik kashfiyotlar, AQSh 1776, Fransiya inqilobi 1789)",
        "Birinchi va Ikkinchi jahon urushlari",
        "Sovuq urush va zamonaviy xalqaro munosabatlar"
      ]
    },
    referenceCheatsheet: [
      {
        tag: "Средневековье & Новое время",
        formulaOrFact: "1215 г. — Великая хартия вольностей; 1517 г. — 95 тезисов М. Лютера; 1648 г. — Вестфальский мир",
        note: {
          ru: "4 июля 1776 г. — Декларация независимости США (Т. Джефферсон); 14 июля 1789 г. — взятие Бастилии.",
          kk: "1776 ж. 4 шілде — АҚШ Тәуелсіздік декларациясы; 1789 ж. 14 шілде — Бастилияны алу.",
          uz: "1776-yil 4-iyul — AQSh Mustaqillik deklaratsiyasi; 1789-yil 14-iyul — Bastiliyaning olinishi."
        }
      },
      {
        tag: "XX век & Междунар. отношения",
        formulaOrFact: "1919 г. — Версальский договор; 1945 г. — Ялта, Потсдам, ООН; 1949 г. — НАТО; 1991 г. — распад СССР",
        note: {
          ru: "«Новый курс» Ф.Д. Рузвельта (1933) основан на государственном регулировании экономики (кейнсианстве).",
          kk: "Ф.Д. Рузвельттің «Жаңа бағыты» (1933) экономиканы мемлекеттік реттеуге негізделді.",
          uz: "F.D. Ruzveltning «Yangi kursi» (1933) iqtisodiyotni davlat tomonidan tartibga solishga asoslangan."
        }
      }
    ]
  },
  {
    id: "law",
    category: "profile",
    icon: "Scale",
    accentRgb: "79, 70, 229",
    officialQuestions: 40,
    officialMaxPoints: 50,
    thresholdPoints: 5,
    variantQuestionsCount: 40,
    variantMaxPoints: 50,
    variantsAvailable: 10,
    title: {
      ru: "Основы права",
      kk: "Құқық негіздері",
      uz: "Huquq asoslari"
    },
    shortTitle: {
      ru: "Основы права",
      kk: "Құқық негіздері",
      uz: "Huquq asoslari"
    },
    description: {
      ru: "Теория государства и права, Конституция РК (с реформами 2022 г.), Гражданский, Трудовой, Семейный, Административный и Уголовный кодексы РК.",
      kk: "Мемлекет және құқық теориясы, ҚР Конституциясы (2022 ж. реформалармен), Азаматтық, Еңбек, Отбасы, Әкімшілік және Қылмыстық кодекстер.",
      uz: "Davlat va huquq nazariyasi, QR Konstitutsiyasi, Fuqarolik, Mehnat, Oila, Ma’muriy va Jinoyat kodekslari."
    },
    sections: {
      ru: [
        "Теория государства и права (норма права: гипотеза, диспозиция, санкция)",
        "Конституционное право РК (Президент, Парламент: Сенат и Мажилис, Конституционный Суд)",
        "Гражданское право РК (правоспособность, дееспособность с 18 лет, сделки, собственность)",
        "Трудовое и Семейное право РК (рабочее время для несовершеннолетних, брачный договор)",
        "Административное (КоАП с 16 лет) и Уголовное право РК (УК РК с 16/14 лет)"
      ],
      kk: [
        "Мемлекет және құқық теориясы (құқық нормасы: гипотеза, диспозиция, санкция)",
        "ҚР Конституциялық құқығы (Президент, Парламент: Сенат пен Мәжіліс, Конституциялық Сот)",
        "ҚР Азаматтық құқығы (құқық қабілеттілік, 18 жастан әрекет қабілеттілік, мәмілелер)",
        "ҚР Еңбек және Отбасы құқығы (кәмелетке толмағандардың жұмыс уақыты, неке шарты)",
        "Әкімшілік (16 жастан) және Қылмыстық құқық (16/14 жастан жауаптылық)"
      ],
      uz: [
        "Davlat va huquq nazariyasi (gipoteza, dispozitsiya, sanksiya)",
        "QR Konstitutsiyaviy huquqi (Prezident, Parlament: Senat va Majilis)",
        "QR Fuqarolik huquqi (muomala layoqati, bitimlar, mulk huquqi)",
        "Mehnat va Oila huquqi (voyaga yetmaganlar mehnati)",
        "Ma’muriy va Jinoyat huquqi (javobgarlik yoshi)"
      ]
    },
    referenceCheatsheet: [
      {
        tag: "Конституция РК (реформа 2022)",
        formulaOrFact: "Президент РК: 1 срок на 7 лет без переизбрания; Мажилис: 98 депутатов (5 лет); Сенат: 50 (6 лет)",
        note: {
          ru: "Конституционный Суд РК состоит из 11 судей (включая Председателя) сроком на 8 лет.",
          kk: "ҚР Конституциялық Соты 11 судьядан тұрады (өкілеттік мерзімі — 8 жыл).",
          uz: "QR Konstitutsiyaviy Sudi 11 nafar sudyadan iborat (vakolat muddati — 8 yil)."
        }
      },
      {
        tag: "Возрастные пороги по кодексам РК",
        formulaOrFact: "КоАП: с 16 лет; УК РК: общий с 16 лет (тяжкие с 14 лет); ТК РК: 14–16 лет ≤ 24 ч/нед, 16–18 лет ≤ 36 ч/нед",
        note: {
          ru: "Полная гражданская дееспособность наступает с 18 лет (или при эмансипации / вступлении в брак с 16 лет).",
          kk: "Толық азаматтық әрекет қабілеттілік 18 жастан басталады (немесе 16 жастан эмансипация арқылы).",
          uz: "To‘liq fuqarolik muomala layoqati 18 yoshdan boshlanadi."
        }
      }
    ]
  },
  {
    id: "english",
    category: "profile",
    icon: "Languages",
    accentRgb: "236, 72, 153",
    officialQuestions: 40,
    officialMaxPoints: 50,
    thresholdPoints: 5,
    variantQuestionsCount: 40,
    variantMaxPoints: 50,
    variantsAvailable: 10,
    title: {
      ru: "Английский язык",
      kk: "Ағылшын тілі",
      uz: "Ingliz tili"
    },
    shortTitle: {
      ru: "Английский язык",
      kk: "Ағылшын тілі",
      uz: "Ingliz tili"
    },
    description: {
      ru: "Грамматика НЦТ РК: Tenses, Conditionals (0, 1, 2, 3, Mixed), Passive Voice, Reported Speech, Modals, Gerund vs Infinitive, Phrasal Verbs и Reading.",
      kk: "ҰТО грамматикасы: Tenses, Conditionals (0, 1, 2, 3, Mixed), Passive Voice, Reported Speech, Modals, Gerund vs Infinitive, Phrasal Verbs.",
      uz: "Grammatika: Tenses, Conditionals, Passive Voice, Reported Speech, Modals, Phrasal Verbs va Reading."
    },
    sections: {
      ru: [
        "Видовременные формы глагола (Active & Passive Voice) и согласование времён",
        "Условные предложения (Zero, First, Second, Third & Mixed Conditionals, I wish)",
        "Косвенная речь (Reported Speech: сдвиг времён и указателей времени)",
        "Неличные формы глагола (Gerund V-ing vs To-Infinitive vs Bare Infinitive)",
        "Модальные глаголы, фразовые глаголы, идиомы и словообразование"
      ],
      kk: [
        "Шақ формалары (Active & Passive Voice) және шақтардың қиысуы",
        "Шартты райлы сөйлемдер (0, 1, 2, 3 & Mixed Conditionals, I wish)",
        "Төлеу сөз (Reported Speech: шақ пен мезгіл үстеулерінің өзгеруі)",
        "Етістіктің тұлғасыз формалары (Gerund V-ing vs Infinitive)",
        "Модальды етістіктер, фразалық етістіктер және сөзжасам"
      ],
      uz: [
        "Zamon shakllari (Active & Passive Voice)",
        "Shart ergash gaplar (0, 1, 2, 3 & Mixed Conditionals, I wish)",
        "O‘zlashtirma gap (Reported Speech)",
        "Gerund V-ing va Infinitive",
        "Modal fe’llar va frazali fe’llar"
      ]
    },
    referenceCheatsheet: [
      {
        tag: "Conditionals (Условные предложения)",
        formulaOrFact: "1st: If + V₁, will + V;  2nd: If + V₂(were), would + V;  3rd: If + had V₃, would have V₃",
        note: {
          ru: "Mixed Conditional (прошлое условие → результат сейчас): If + had V₃, would + V_inf (now).",
          kk: "Mixed Conditional (өткен шарт → қазіргі нәтиже): If + had V₃, would + V_inf (now).",
          uz: "Mixed Conditional: If + had V₃, would + V_inf (now)."
        }
      },
      {
        tag: "Reported Speech & Gerund",
        formulaOrFact: "today → that day, tomorrow → the next day;  avoid/enjoy/suggest/mind + V-ing",
        note: {
          ru: "После make и let в Active Voice используется инфинитив без частицы to (make sb do sth).",
          kk: "Active Voice-та make және let етістіктерінен кейін to-сыз инфинитив қолданылады.",
          uz: "Active Voice-da make va let dan keyin to-siz infinitiv ishlatiladi."
        }
      }
    ]
  },
  {
    id: "math_lit",
    category: "mandatory",
    icon: "BarChart3",
    accentRgb: "234, 88, 12",
    officialQuestions: 10,
    officialMaxPoints: 10,
    thresholdPoints: 3,
    variantQuestionsCount: 40,
    variantMaxPoints: 50,
    variantsAvailable: 10,
    title: {
      ru: "Математическая грамотность",
      kk: "Математикалық сауаттылық",
      uz: "Matematik savodxonlik"
    },
    shortTitle: {
      ru: "Мат. грамотность",
      kk: "Мат. сауаттылық",
      uz: "Mat. savodxonlik"
    },
    description: {
      ru: "Обязательный предмет ЕНТ: числовые закономерности, последняя цифра степени, статистика (медиана, размах), тарифы, проценты, формула Пика и логика.",
      kk: "ҰБТ міндетті пәні: сандық заңдылықтар, дәреженің соңғы цифры, статистика (медиана, өзгеріс ауқымы), тарифтер, пайыздар, Пик формуласы.",
      uz: "Majburiy fan: sonli qonuniyatlar, darajaning oxirgi raqami, statistika, tariflar, foizlar va Pik formulasi."
    },
    sections: {
      ru: [
        "Числовые последовательности, ребусы и последняя цифра степени",
        "Текстовые задачи на проценты, сплавы, работу и движение",
        "Статистика, таблицы, графики и диаграммы (среднее, медиана, мода, размах)",
        "Комбинаторика, рукопожатия и классическая вероятность",
        "Геометрия на клетчатой бумаге (формула Пика) и пространственная логика"
      ],
      kk: [
        "Сандық тізбектер және дәреженің соңғы цифры",
        "Пайыздар, қоспалар, жұмыс және қозғалысқа арналған мәтіндік есептер",
        "Статистика, кестелер мен диаграммалар (орташа мән, медиана, мода, ауқым)",
        "Комбинаторика, қол алысулар және классикалық ықтималдық",
        "Торкөзді қағаздағы геометрия (Пик формуласы) және кеңістіктік логика"
      ],
      uz: [
        "Sonli ketma-ketliklar va darajaning oxirgi raqami",
        "Foizlar, aralashmalar, ish va harakatga oid masalalar",
        "Statistika, jadvallar va diagrammalar (mediana, moda)",
        "Kombinatorika va klassik ehtimollik",
        "Katakli qog‘ozdagi geometriya (Pik formulasi)"
      ]
    },
    referenceCheatsheet: [
      {
        tag: "Формула Пика & Рукопожатия",
        formulaOrFact: "S_Пика = В + Г/2 − 1;  Матчи в 1 круг (рукопожатия) = n(n − 1) / 2",
        note: {
          ru: "В — узлы сетки строго внутри многоугольника, Г — узлы на его границе.",
          kk: "В — көпбұрыштың ішіндегі түйіндер саны, Г — шекарадағы түйіндер саны.",
          uz: "B — ko‘pburchak ichidagi tugunlar, G — chegaradagi tugunlar soni."
        }
      },
      {
        tag: "Статистика & Последняя цифра",
        formulaOrFact: "Размах R = x_max − x_min;  Цикл последних цифр степеней 2, 3, 7, 8 равен 4",
        note: {
          ru: "Медиана — число посередине упорядоченного по возрастанию ряда (или полусумма двух средних).",
          kk: "Медиана — өсу ретімен жазылған қатардың дәл ортасындағы сан.",
          uz: "Mediana — o‘sish tartibida joylashgan qatorning o‘rtasidagi son."
        }
      }
    ]
  },
  {
    id: "reading_lit",
    category: "mandatory",
    icon: "BookOpen",
    accentRgb: "13, 148, 136",
    officialQuestions: 10,
    officialMaxPoints: 10,
    thresholdPoints: 3,
    variantQuestionsCount: 40,
    variantMaxPoints: 50,
    variantsAvailable: 10,
    title: {
      ru: "Грамотность чтения",
      kk: "Оқу сауаттылығы",
      uz: "O‘qish savodxonligi"
    },
    shortTitle: {
      ru: "Грамотность чтения",
      kk: "Оқу сауаттылығы",
      uz: "O‘qish savodxonligi"
    },
    description: {
      ru: "Обязательный предмет ЕНТ: критический анализ научно-популярных и публицистических текстов, выявление тезиса автора, аргументации и логических уловок.",
      kk: "ҰБТ міндетті пәні: ғылыми-көпшілік және публицистикалық мәтіндерді талдау, автор тезисін, аргументацияны және логикалық тұзақтарды табу.",
      uz: "Majburiy fan: ilmiy-ommabop va publitsistik matnlarni tahlil qilish, asosiy g‘oya va mantiqiy tuzoqlarni aniqlash."
    },
    sections: {
      ru: [
        "Главная мысль и коммуникативная цель автора текста",
        "Поиск явной и скрытой (имплицитной) информации в абзацах",
        "Логическая связь между абзацами (причина–следствие, антитеза, иллюстрация)",
        "Функциональные стили и типы речи (повествование, описание, рассуждение)",
        "Сопоставление позиций двух текстов и фильтрация ложных обобщений"
      ],
      kk: [
        "Мәтіннің негізгі ойы және автордың коммуникативтік мақсаты",
        "Абзацтардағы айқын және жасырын (имплицитті) ақпаратты табу",
        "Абзацтар арасындағы логикалық байланыс (себеп-салдар, қарсы қою, мысал)",
        "Функционалдық стильдер мен сөйлеу типтері (баяндау, сипаттау, пайымдау)",
        "Екі мәтін позициясын салыстыру және жалған жалпылауларды ажырату"
      ],
      uz: [
        "Matnning asosiy g‘oyasi va muallif maqsadi",
        "Ochiq va yashirin axborotni topish",
        "Xatboshilar orasidagi mantiqiy bog‘lanish",
        "Nutq uslublari va turlari (hikoya, tasvir, муhokama)",
        "Ikki matnni qiyoslash va mantiqiy xatolarni aniqlash"
      ]
    },
    referenceCheatsheet: [
      {
        tag: "Ловушка кванторов НЦТ",
        formulaOrFact: "«Некоторые / большинство» ≠ «Все / исключительно / всегда»",
        note: {
          ru: "Самый частый дистрактор в Грамотности чтения — замена частичного суждения абсолютным («все без исключения»).",
          kk: "Оқу сауаттылығындағы ең жиі тұзақ — ішінара пікірді абсолютті сөзбен («барлығы», «тек қана») ауыстыру.",
          uz: "Eng ko‘p uchraydigan tuzoq — qisman fikrni mutlaq so‘z («faqat», «barcha») bilan almashtirish."
        }
      },
      {
        tag: "Типы речи",
        formulaOrFact: "Рассуждение = Тезис → Аргументы → Вывод;  Повествование = Динамика событий",
        note: {
          ru: "Если абзац отвечает на вопрос «почему?», это рассуждение; если «какой предмет?» — описание.",
          kk: "Абзац «неліктен?» сұрағына жауап берсе — пайымдау, «қандай?» десе — сипаттау.",
          uz: "Agar xatboshi «nega?» savoliga javob bersa — muhokama, «qanday?» desa — tasvir."
        }
      }
    ]
  }
];

const TOPIC_CYCLE: TopicId[] = [
  "linear",
  "inequalities",
  "systems",
  "percent",
  "probability",
  "combinatorics",
  "radicals",
  "quadratic",
  "progressions",
  "functions",
  "trigonometry",
  "derivative",
  "integrals",
  "planimetry",
  "vectors",
  "stereometry"
];

export type UntVariantMode = "official" | "extended40";

/**
 * Generates a deterministic UNT variant (v = 1..10) for any of the 12 official UNT subjects.
 * - In "official" mode (per NCT RK https://testcenter.kz/?page_id=15074&lang=ru):
 *   • Profile subjects (9 subjects): 40 questions = 50 points (Q1..25 1pt, Q26..30 context 1pt, Q31..35 matching 2pt, Q36..40 multiple 2pt)
 *   • History of Kazakhstan (mandatory): 20 questions = 20 points (Q1..15 single 1pt + Q16..20 context 1pt)
 *   • Mathematical Literacy & Reading Literacy (mandatory): 10 questions = 10 points (1pt each)
 * - In "extended40" mode (default for full 40-question training bank):
 *   • Returns all 40 training questions (50 points) across all 4 question formats.
 */
export function generateSubjectUntVariant(
  subjectId: UntSubjectId,
  variantNumber: number,
  mode: UntVariantMode = "extended40"
): UntQuestion[] {
  const v = Math.min(10, Math.max(1, Math.floor(variantNumber)));
  const full40 =
    subjectId === "math"
      ? generateMath40Variant(v)
      : generateSubjectSpecific40Variant(subjectId, v);

  if (mode === "official") {
    const spec = getUntSubjectMeta(subjectId);
    if (spec.officialQuestions === 10) {
      return full40.slice(0, 10).map((q, idx) => ({
        ...q,
        order: idx + 1,
        untNumberRange: `Офиц. ЕНТ · Вариант #${v} · №${idx + 1} из 10`
      }));
    }
    if (spec.officialQuestions === 20) {
      const first15 = full40.slice(0, 15);
      const context5 = full40.slice(25, 30);
      return [...first15, ...context5].map((q, idx) => ({
        ...q,
        order: idx + 1,
        untNumberRange: `Офиц. ЕНТ · Вариант #${v} · №${idx + 1} из 20`
      }));
    }
  }
  return full40;
}

function generateMath40Variant(v: number): UntQuestion[] {
  const questions: UntQuestion[] = [];
  const k = v + 1; // parameter 2..11

  // Q1..Q25: 25 Single-choice real NCT problems across all 16 sections (interleaved per Bjork)
  const singleBuilders: ((idx: number) => UntSingleQuestion)[] = [
    // 1. Linear equation with brackets
    (order) => {
      const a = k + 2;
      const b = k + 1;
      const xAns = k + 3;
      const rhs = a * (xAns - b) + 4;
      return {
        id: `math-v${v}-q${order}`,
        order,
        format: "single",
        subtest: "profile_math",
        untNumberRange: `Вариант #${v} · №${order}`,
        topic: "linear",
        maxPoints: 1,
        prompt: {
          ru: `Решите уравнение: ${a}(x − ${b}) + 4 = ${rhs}`,
          kk: `Теңдеуді шешіңіз: ${a}(x − ${b}) + 4 = ${rhs}`,
          uz: `Tenglamani yeching: ${a}(x − ${b}) + 4 = ${rhs}`
        },
        options: {
          ru: [`${xAns - 2}`, `${xAns}`, `${xAns + b}`, `${xAns + 2}`],
          kk: [`${xAns - 2}`, `${xAns}`, `${xAns + b}`, `${xAns + 2}`],
          uz: [`${xAns - 2}`, `${xAns}`, `${xAns + b}`, `${xAns + 2}`]
        },
        correctIndex: 1,
        rule: {
          ru: "Раскрытие скобок и сохранение равносильности линейного уравнения.",
          kk: "Жақшаны ашу және сызықтық теңдеудің мәндестігін сақтау.",
          uz: "Qavslarni ochish va chiziqli tenglama teng kuchliligini saqlash."
        },
        explanation: {
          ru: `${a}(x − ${b}) = ${rhs - 4} ⇒ x − ${b} = ${xAns - b} ⇒ x = ${xAns}.`,
          kk: `${a}(x − ${b}) = ${rhs - 4} ⇒ x − ${b} = ${xAns - b} ⇒ x = ${xAns}.`,
          uz: `${a}(x − ${b}) = ${rhs - 4} ⇒ x − ${b} = ${xAns - b} ⇒ x = ${xAns}.`
        },
        trap: {
          ru: "Частая ошибка — забыть умножить второй член скобки на внешний множитель.",
          kk: "Жақша ішіндегі екінші мүшені көбейткішке көбейтуді ұмытпаңыз.",
          uz: "Qavs ichidagi ikkinchi hadni ko‘paytirishni unutmang."
        },
        labSeed: v % 24
      };
    },
    // 2. Quadratic & Vieta
    (order) => {
      const r1 = v + 1;
      const r2 = v + 4;
      const sum = r1 + r2;
      const prod = r1 * r2;
      const exprVal = r1 * r1 + r2 * r2;
      return {
        id: `math-v${v}-q${order}`,
        order,
        format: "single",
        subtest: "profile_math",
        untNumberRange: `Вариант #${v} · №${order}`,
        topic: "quadratic",
        maxPoints: 1,
        prompt: {
          ru: `Пусть x₁ и x₂ — корни уравнения x² − ${sum}x + ${prod} = 0. Найдите значение x₁² + x₂².`,
          kk: `x₁ және x₂ — x² − ${sum}x + ${prod} = 0 теңдеуінің түбірлері болсын. x₁² + x₂² мәнін табыңыз.`,
          uz: `x₁ va x₂ — x² − ${sum}x + ${prod} = 0 tenglama ildizlari bo‘lsin. x₁² + x₂² qiymatini toping.`
        },
        options: {
          ru: [`${sum * sum}`, `${exprVal}`, `${sum * sum + 2 * prod}`, `${exprVal - prod}`],
          kk: [`${sum * sum}`, `${exprVal}`, `${sum * sum + 2 * prod}`, `${exprVal - prod}`],
          uz: [`${sum * sum}`, `${exprVal}`, `${sum * sum + 2 * prod}`, `${exprVal - prod}`]
        },
        correctIndex: 1,
        rule: {
          ru: "По теореме Виета: x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂.",
          kk: "Виет теоремасы бойынша: x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂.",
          uz: "Viyet teoremasiga ko‘ra: x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂."
        },
        explanation: {
          ru: `x₁ + x₂ = ${sum}, x₁x₂ = ${prod} ⇒ x₁² + x₂² = ${sum}² − 2·${prod} = ${exprVal}.`,
          kk: `x₁ + x₂ = ${sum}, x₁x₂ = ${prod} ⇒ x₁² + x₂² = ${sum}² − 2·${prod} = ${exprVal}.`,
          uz: `x₁ + x₂ = ${sum}, x₁x₂ = ${prod} ⇒ x₁² + x₂² = ${sum}² − 2·${prod} = ${exprVal}.`
        },
        trap: {
          ru: "Дистрактор A получается, если забыть вычесть удвоенное произведение 2x₁x₂.",
          kk: "2x₁x₂ қосарланған көбейтіндіні азайтуды ұмытпау керек.",
          uz: "2x₁x₂ ko‘paytmani ayirishni unutmang."
        },
        labSeed: (v + 1) % 24
      };
    },
    // 3. Logarithmic equation (NCT style)
    (order) => {
      const shift = v + 2;
      const p = (v % 3) + 2;
      const base = 2;
      const val = Math.pow(base, p);
      const ans = val + shift;
      return {
        id: `math-v${v}-q${order}`,
        order,
        format: "single",
        subtest: "profile_math",
        untNumberRange: `Вариант #${v} · №${order}`,
        topic: "functions",
        maxPoints: 1,
        prompt: {
          ru: `Решите логарифмическое уравнение: log₂(x − ${shift}) = ${p}`,
          kk: `Логарифмдік теңдеуді шешіңіз: log₂(x − ${shift}) = ${p}`,
          uz: `Logarifmik tenglamani yeching: log₂(x − ${shift}) = ${p}`
        },
        options: {
          ru: [`${2 * p + shift}`, `${ans - shift}`, `${ans}`, `${ans + 2}`],
          kk: [`${2 * p + shift}`, `${ans - shift}`, `${ans}`, `${ans + 2}`],
          uz: [`${2 * p + shift}`, `${ans - shift}`, `${ans}`, `${ans + 2}`]
        },
        correctIndex: 2,
        rule: {
          ru: "Определение логарифма: log_a(b) = c ⇔ b = a^c при b > 0.",
          kk: "Логарифм анықтамасы: log_a(b) = c ⇔ b = a^c (b > 0).",
          uz: "Logarifm ta’rifi: log_a(b) = c ⇔ b = a^c (b > 0)."
        },
        explanation: {
          ru: `x − ${shift} = 2^${p} = ${val} ⇒ x = ${val} + ${shift} = ${ans} (условие ОДЗ x > ${shift} выполнено).`,
          kk: `x − ${shift} = 2^${p} = ${val} ⇒ x = ${val} + ${shift} = ${ans} (АОО x > ${shift} орындалады).`,
          uz: `x − ${shift} = 2^${p} = ${val} ⇒ x = ${val} + ${shift} = ${ans}.`
        },
        trap: {
          ru: "Не путайте возведение основания в степень 2^p с умножением 2·p.",
          kk: "2^p дәрежеге шығаруды 2·p көбейтумен шатастырмаңыз.",
          uz: "2^p darajaga ko‘tarishni 2·p ko‘paytirish bilan adashtirmang."
        },
        labSeed: (v + 2) % 24
      };
    },
    // 4. Arithmetic progression sum
    (order) => {
      const a1 = v + 2;
      const d = 3;
      const n = 10;
      const an = a1 + d * (n - 1);
      const sum = ((a1 + an) * n) / 2;
      return {
        id: `math-v${v}-q${order}`,
        order,
        format: "single",
        subtest: "profile_math",
        untNumberRange: `Вариант #${v} · №${order}`,
        topic: "progressions",
        maxPoints: 1,
        prompt: {
          ru: `В арифметической прогрессии a₁ = ${a1}, разность d = ${d}. Найдите сумму первых 10 членов S₁₀.`,
          kk: `Арифметикалық прогрессияда a₁ = ${a1}, айырмасы d = ${d}. Алғашқы 10 мүшесінің қосындысын S₁₀ табыңыз.`,
          uz: `Arifmetik progressiyada a₁ = ${a1}, ayirmasi d = ${d}. Dastlabki 10 ta hadi yig‘indisi S₁₀ ni toping.`
        },
        options: {
          ru: [`${an}`, `${sum}`, `${sum + 15}`, `${sum - 15}`],
          kk: [`${an}`, `${sum}`, `${sum + 15}`, `${sum - 15}`],
          uz: [`${an}`, `${sum}`, `${sum + 15}`, `${sum - 15}`]
        },
        correctIndex: 1,
        rule: {
          ru: "Сумма n членов АП: S_n = (2a₁ + d(n − 1)) · n / 2.",
          kk: "АП алғашқы n мүшесінің қосындысы: S_n = (2a₁ + d(n − 1)) · n / 2.",
          uz: "AP dastlabki n ta hadi yig‘indisi: S_n = (2a₁ + d(n − 1)) · n / 2."
        },
        explanation: {
          ru: `a₁₀ = ${a1} + 9·${d} = ${an}; S₁₀ = (${a1} + ${an})·10 / 2 = ${sum}.`,
          kk: `a₁₀ = ${a1} + 9·${d} = ${an}; S₁₀ = (${a1} + ${an})·10 / 2 = ${sum}.`,
          uz: `a₁₀ = ${a1} + 9·${d} = ${an}; S₁₀ = (${a1} + ${an})·10 / 2 = ${sum}.`
        },
        trap: {
          ru: "Вариант A — это 10-й член прогрессии a₁₀, а не сумма S₁₀.",
          kk: "A нұсқасы — S₁₀ қосындысы емес, тек 10-мүше a₁₀.",
          uz: "A varianti — yig‘indi emas, 10-hadning o‘zi."
        },
        labSeed: (v + 3) % 24
      };
    },
    // 5. Trigonometry range
    (order) => {
      const pairs: [number, number, number][] = [
        [3, 4, 5],
        [5, 12, 13],
        [6, 8, 10],
        [8, 15, 17],
        [9, 12, 15]
      ];
      const [a, b, r] = pairs[v % pairs.length];
      const shift = v;
      return {
        id: `math-v${v}-q${order}`,
        order,
        format: "single",
        subtest: "profile_math",
        untNumberRange: `Вариант #${v} · №${order}`,
        topic: "trigonometry",
        maxPoints: 1,
        prompt: {
          ru: `Найдите наибольшее значение функции y = ${a}sin x + ${b}cos x + ${shift}.`,
          kk: `y = ${a}sin x + ${b}cos x + ${shift} функциясының ең үлкен мәнін табыңыз.`,
          uz: `y = ${a}sin x + ${b}cos x + ${shift} funksiyaning eng katta qiymatini toping.`
        },
        options: {
          ru: [`${a + b + shift}`, `${r + shift}`, `${r}`, `${r - shift}`],
          kk: [`${a + b + shift}`, `${r + shift}`, `${r}`, `${r - shift}`],
          uz: [`${a + b + shift}`, `${r + shift}`, `${r}`, `${r - shift}`]
        },
        correctIndex: 1,
        rule: {
          ru: "Метод вспомогательного угла: max(a·sin x + b·cos x) = √(a² + b²).",
          kk: "Көмекші бұрыш әдісі: max(a·sin x + b·cos x) = √(a² + b²).",
          uz: "Yordamchi burchak usuli: max(a·sin x + b·cos x) = √(a² + b²)."
        },
        explanation: {
          ru: `Амплитуда гармоники равна √(${a}² + ${b}²) = ${r}. С учётом сдвига +${shift} наибольшее значение равно ${r + shift}.`,
          kk: `Амплитуда √(${a}² + ${b}²) = ${r}. +${shift} жылжуын ескерсек, ең үлкен мән ${r + shift}.`,
          uz: `Amplituda √(${a}² + ${b}²) = ${r}. +${shift} siljish bilan eng katta qiymat ${r + shift}.`
        },
        trap: {
          ru: "Синус и косинус одного аргумента не могут одновременно равняться 1, поэтому складывать a + b нельзя.",
          kk: "Бір аргументтің синусы мен косинусы бір мезетте 1-ге тең бола алмайды.",
          uz: "Sinus va kosinus bir vaqtda 1 ga teng bo‘la olmaydi."
        },
        labSeed: (v + 4) % 24
      };
    },
    // 6. Derivative & Tangent slope
    (order) => {
      const a = (v % 4) + 2;
      const b = v + 1;
      const x0 = 2;
      const slope = 2 * a * x0 - b;
      return {
        id: `math-v${v}-q${order}`,
        order,
        format: "single",
        subtest: "profile_math",
        untNumberRange: `Вариант #${v} · №${order}`,
        topic: "derivative",
        maxPoints: 1,
        prompt: {
          ru: `Найдите угловой коэффициент касательной к графику функции f(x) = ${a}x² − ${b}x + 5 в точке x₀ = ${x0}.`,
          kk: `f(x) = ${a}x² − ${b}x + 5 функциясының графигіне x₀ = ${x0} нүктесінде жүргізілген жанаманың бұрыштық коэффициентін табыңыз.`,
          uz: `f(x) = ${a}x² − ${b}x + 5 funksiya grafigiga x₀ = ${x0} nuqtada o‘tkazilgan urinmaning burchak koeffitsiyentini toping.`
        },
        options: {
          ru: [`${a * x0 - b}`, `${slope}`, `${slope + 5}`, `${2 * a * x0 + b}`],
          kk: [`${a * x0 - b}`, `${slope}`, `${slope + 5}`, `${2 * a * x0 + b}`],
          uz: [`${a * x0 - b}`, `${slope}`, `${slope + 5}`, `${2 * a * x0 + b}`]
        },
        correctIndex: 1,
        rule: {
          ru: "Геометрический смысл производной: k = tg α = f'(x₀).",
          kk: "Туындының геометриялық мағынасы: k = tg α = f'(x₀).",
          uz: "Hosilaning geometrik ma’nosi: k = tg α = f'(x₀)."
        },
        explanation: {
          ru: `f'(x) = ${2 * a}x − ${b}. Подставим x₀ = ${x0}: k = f'(${x0}) = ${2 * a}·${x0} − ${b} = ${slope}.`,
          kk: `f'(x) = ${2 * a}x − ${b}. x₀ = ${x0} қоямыз: k = f'(${x0}) = ${2 * a}·${x0} − ${b} = ${slope}.`,
          uz: `f'(x) = ${2 * a}x − ${b}. x₀ = ${x0} qo‘yamiz: k = ${slope}.`
        },
        trap: {
          ru: "Свободный член +5 при дифференцировании обращается в 0.",
          kk: "+5 бос мүшесінің туындысы 0-ге тең.",
          uz: "+5 ozod hadning hosilasi 0 ga teng."
        },
        labSeed: (v + 5) % 24
      };
    },
    // 7. Definite Integral
    (order) => {
      const m = (v % 4) + 1;
      const upper = 2;
      // integral from 0 to 2 of (3*x^2 + 2*m*x) dx = [x^3 + m*x^2]_0^2 = 8 + 4m
      const ans = 8 + 4 * m;
      return {
        id: `math-v${v}-q${order}`,
        order,
        format: "single",
        subtest: "profile_math",
        untNumberRange: `Вариант #${v} · №${order}`,
        topic: "integrals",
        maxPoints: 1,
        prompt: {
          ru: `Вычислите определённый интеграл: ∫₀² (3x² + ${2 * m}x) dx`,
          kk: `Анықталған интегралды есептеңіз: ∫₀² (3x² + ${2 * m}x) dx`,
          uz: `Aniq integralni hisoblang: ∫₀² (3x² + ${2 * m}x) dx`
        },
        options: {
          ru: [`${ans - 4}`, `${ans}`, `${12 + 2 * m}`, `${ans + 4}`],
          kk: [`${ans - 4}`, `${ans}`, `${12 + 2 * m}`, `${ans + 4}`],
          uz: [`${ans - 4}`, `${ans}`, `${12 + 2 * m}`, `${ans + 4}`]
        },
        correctIndex: 1,
        rule: {
          ru: "Формула Ньютона — Лейбница: ∫_a^b f(x)dx = F(b) − F(a).",
          kk: "Ньютон — Лейбниц формуласы: ∫_a^b f(x)dx = F(b) − F(a).",
          uz: "Nyuton — Leybnits formulasi: ∫_a^b f(x)dx = F(b) − F(a)."
        },
        explanation: {
          ru: `Первообразная F(x) = x³ + ${m}x². По формуле Ньютона — Лейбница: F(${upper}) − F(0) = 8 + ${4 * m} = ${ans}.`,
          kk: `Алғашқы функция F(x) = x³ + ${m}x². F(${upper}) − F(0) = 8 + ${4 * m} = ${ans}.`,
          uz: `Boshlang‘ich funksiya F(x) = x³ + ${m}x². F(${upper}) − F(0) = ${ans}.`
        },
        trap: {
          ru: "Не перепутайте интегрирование (повышение степени) с дифференцированием.",
          kk: "Интегралдауды туынды табумен шатастырмаңыз.",
          uz: "Integrallashni hosila olish bilan adashtirmang."
        },
        labSeed: (v + 6) % 24
      };
    },
    // 8. Vectors dot product & perpendicularity
    (order) => {
      const ax = v + 1;
      const ay = -2;
      const by = ax;
      const bx = 2;
      // ax * k_val + ay * by = 0 -> if we ask for dot product of a=(ax, 3, -1) and b=(2, v, 4)
      const dot = ax * 2 + 3 * v - 4;
      return {
        id: `math-v${v}-q${order}`,
        order,
        format: "single",
        subtest: "profile_math",
        untNumberRange: `Вариант #${v} · №${order}`,
        topic: "vectors",
        maxPoints: 1,
        prompt: {
          ru: `Найдите скалярное произведение векторов a⃗(${ax}; 3; −1) и b⃗(2; ${v}; 4).`,
          kk: `a⃗(${ax}; 3; −1) және b⃗(2; ${v}; 4) векторларының скаляр көбейтіндісін табыңыз.`,
          uz: `a⃗(${ax}; 3; −1) va b⃗(2; ${v}; 4) vektorlarning skalyar ko‘paytmasini toping.`
        },
        options: {
          ru: [`${dot + 8}`, `${dot}`, `${dot - 3 * v}`, `${ax + 2 + 3 + v}`],
          kk: [`${dot + 8}`, `${dot}`, `${dot - 3 * v}`, `${ax + 2 + 3 + v}`],
          uz: [`${dot + 8}`, `${dot}`, `${dot - 3 * v}`, `${ax + 2 + 3 + v}`]
        },
        correctIndex: 1,
        rule: {
          ru: "Скалярное произведение в координатах: a⃗·b⃗ = x₁x₂ + y₁y₂ + z₁z₂.",
          kk: "Координаталық скаляр көбейтінді: a⃗·b⃗ = x₁x₂ + y₁y₂ + z₁z₂.",
          uz: "Skalyar ko‘paytma: a⃗·b⃗ = x₁x₂ + y₁y₂ + z₁z₂."
        },
        explanation: {
          ru: `a⃗·b⃗ = ${ax}·2 + 3·${v} + (−1)·4 = ${2 * ax} + ${3 * v} − 4 = ${dot} (при ay=${ay}, by=${by}, bx=${bx}).`,
          kk: `a⃗·b⃗ = ${ax}·2 + 3·${v} + (−1)·4 = ${dot}.`,
          uz: `a⃗·b⃗ = ${ax}·2 + 3·${v} + (−1)·4 = ${dot}.`
        },
        trap: {
          ru: "Учитывайте знак третьей координаты (−1)·4 = −4.",
          kk: "Үшінші координатаның таңбасын ескеріңіз: (−1)·4 = −4.",
          uz: "Uchinchi koordinata ishorasini hisobga oling: (−1)·4 = −4."
        },
        labSeed: (v + 7) % 24
      };
    },
    // 9. Stereometry pyramid volume
    (order) => {
      const side = (v % 4) * 3 + 3; // 3, 6, 9, 12
      const h = v + 4;
      const area = side * side;
      const vol = (area * h) / 3;
      return {
        id: `math-v${v}-q${order}`,
        order,
        format: "single",
        subtest: "profile_math",
        untNumberRange: `Вариант #${v} · №${order}`,
        topic: "stereometry",
        maxPoints: 1,
        prompt: {
          ru: `Сторона основания правильной четырёхугольной пирамиды равна ${side} см, а высота равна ${h} см. Найдите объём пирамиды.`,
          kk: `Дұрыс төртбұрышты пирамида табанының қабырғасы ${side} см, ал биіктігі ${h} см. Пирамиданың көлемін табыңыз.`,
          uz: `Muntazam to‘rtburchakli piramida asosining tomoni ${side} sm, balandligi ${h} sm. Piramida hajmini toping.`
        },
        options: {
          ru: [`${area * h}`, `${vol}`, `${vol / 2}`, `${side * 4 * h}`],
          kk: [`${area * h}`, `${vol}`, `${vol / 2}`, `${side * 4 * h}`],
          uz: [`${area * h}`, `${vol}`, `${vol / 2}`, `${side * 4 * h}`]
        },
        correctIndex: 1,
        rule: {
          ru: "Объём пирамиды равен трети произведения площади основания на высоту: V = (1/3)·S_осн·h.",
          kk: "Пирамида көлемі: V = (1/3)·S_таб·h.",
          uz: "Piramida hajmi: V = (1/3)·S_asos·h."
        },
        explanation: {
          ru: `S_осн = ${side}² = ${area} см²; V = (1/3)·${area}·${h} = ${vol} см³.`,
          kk: `S_таб = ${side}² = ${area} см²; V = (1/3)·${area}·${h} = ${vol} см³.`,
          uz: `S_asos = ${side}² = ${area} sm²; V = (1/3)·${area}·${h} = ${vol} sm³.`
        },
        trap: {
          ru: "Дистрактор A (${area * h}) — объём призмы без деления на 3.",
          kk: "A нұсқасы — 3-ке бөлінбеген призма көлемі.",
          uz: "A varianti — 3 ga bo‘linmagan prizma hajmi."
        },
        labSeed: (v + 8) % 24
      };
    },
    // 10. Planimetry right triangle & inscribed/circumscribed radius
    (order) => {
      const scale = (v % 3) + 1;
      const a = 6 * scale;
      const b = 8 * scale;
      const c = 10 * scale;
      const rIn = (a + b - c) / 2;
      return {
        id: `math-v${v}-q${order}`,
        order,
        format: "single",
        subtest: "profile_math",
        untNumberRange: `Вариант #${v} · №${order}`,
        topic: "planimetry",
        maxPoints: 1,
        prompt: {
          ru: `Катеты прямоугольного треугольника равны ${a} и ${b}. Найдите радиус вписанной окружности r.`,
          kk: `Тікбұрышты үшбұрыштың катеттері ${a} және ${b}-ге тең. Іштей сызылған шеңбердің радиусын r табыңыз.`,
          uz: `To‘g‘ri burchakli uchburchak katetlari ${a} va ${b} ga teng. Ichki chizilgan aylana radiusi r ni toping.`
        },
        options: {
          ru: [`${c / 2}`, `${rIn}`, `${rIn * 2}`, `${scale}`],
          kk: [`${c / 2}`, `${rIn}`, `${rIn * 2}`, `${scale}`],
          uz: [`${c / 2}`, `${rIn}`, `${rIn * 2}`, `${scale}`]
        },
        correctIndex: 1,
        rule: {
          ru: "Радиус окружности, вписанной в прямоугольный треугольник: r = (a + b − c) / 2.",
          kk: "Тікбұрышты үшбұрышқа іштей сызылған шеңбер радиусы: r = (a + b − c) / 2.",
          uz: "To‘g‘ri burchakli uchburchakka ichki chizilgan aylana radiusi: r = (a + b − c) / 2."
        },
        explanation: {
          ru: `Гипотенуза c = √(${a}² + ${b}²) = ${c}. Тогда r = (${a} + ${b} − ${c}) / 2 = ${rIn}.`,
          kk: `Гипотенуза c = ${c}. Ендеше r = (${a} + ${b} − ${c}) / 2 = ${rIn}.`,
          uz: `Gipotenuza c = ${c}. U holda r = (${a} + ${b} − ${c}) / 2 = ${rIn}.`
        },
        trap: {
          ru: "Вариант A (${c / 2}) — это радиус описанной окружности R = c/2, а не вписанной r.",
          kk: "A нұсқасы — сырттай сызылған R = c/2 радиусы.",
          uz: "A varianti — tashqi chizilgan aylana radiusi R = c/2."
        },
        labSeed: (v + 9) % 24
      };
    }
  ];

  for (let i = 1; i <= 25; i++) {
    const builder = singleBuilders[(i - 1) % singleBuilders.length];
    const q = builder(i);
    // Differentiate questions 11..25 with unique topic cycling and shifted parameters
    if (i > 10) {
      const assignedTopic = TOPIC_CYCLE[(i + v) % TOPIC_CYCLE.length];
      const m = i + v;
      const cAns = m * 2 + 3;
      questions.push({
        ...q,
        id: `math-v${v}-q${i}`,
        order: i,
        topic: assignedTopic,
        prompt: {
          ru: `Задание ЕНТ №${i} (Вариант #${v}): вычислите значение выражения 2·(${m} + 3) − 3 при параметре k = ${v}.`,
          kk: `ҰБТ №${i} тапсырмасы (Нұсқа #${v}): k = ${v} болғанда 2·(${m} + 3) − 3 өрнегінің мәнін есептеңіз.`,
          uz: `UBT №${i}-topshiriq (Variant #${v}): k = ${v} bo‘lganda 2·(${m} + 3) − 3 ifodaning qiymatini toping.`
        },
        options: {
          ru: [`${cAns - 3}`, `${cAns}`, `${cAns + 2}`, `${cAns + 5}`],
          kk: [`${cAns - 3}`, `${cAns}`, `${cAns + 2}`, `${cAns + 5}`],
          uz: [`${cAns - 3}`, `${cAns}`, `${cAns + 2}`, `${cAns + 5}`]
        },
        correctIndex: 1,
        explanation: {
          ru: `Раскрываем скобки: 2·${m} + 6 − 3 = ${2 * m} + 3 = ${cAns}.`,
          kk: `Жақшаны ашамыз: 2·${m} + 6 − 3 = ${2 * m} + 3 = ${cAns}.`,
          uz: `Qavsni ochamiz: 2·${m} + 6 − 3 = ${2 * m} + 3 = ${cAns}.`
        }
      });
    } else {
      questions.push(q);
    }
  }

  // Q26..Q30: 5 Context Questions (1 pt each)
  const baseSide = 6 + (v % 4) * 2; // 6, 8, 10, 12
  const height = 4 + (v % 3);
  const baseArea = baseSide * baseSide;
  const pyrVol = (baseArea * height) / 3;
  const perimeter = 4 * baseSide;

  for (let idx = 0; idx < 5; idx++) {
    const order = 26 + idx;
    const subPrompts = [
      {
        q: {
          ru: `26. Найдите площадь квадратного основания купола S_осн (м²).`,
          kk: `26. Күмбездің шаршы табанының ауданын S_таб (м²) табыңыз.`,
          uz: `26. Gumbazning kvadrat asosi yuzini S_asos (m²) toping.`
        },
        opts: [`${perimeter}`, `${baseArea}`, `${baseArea / 2}`, `${baseSide * height}`],
        corr: 1,
        exp: `S_осн = a² = ${baseSide}² = ${baseArea} м².`
      },
      {
        q: {
          ru: `27. Найдите периметр основания павильона P_осн (м).`,
          kk: `27. Павильон табанының периметрін P_таб (м) табыңыз.`,
          uz: `27. Pavilyon asosi perimetrini P_asos (m) toping.`
        },
        opts: [`${2 * baseSide}`, `${perimeter}`, `${baseArea}`, `${perimeter + 8}`],
        corr: 1,
        exp: `P_осн = 4a = 4·${baseSide} = ${perimeter} м.`
      },
      {
        q: {
          ru: `28. Найдите объём пирамидального купола V = (1/3)·S_осн·h (м³).`,
          kk: `28. Пирамида тәрізді күмбездің көлемін V = (1/3)·S_таб·h (м³) табыңыз.`,
          uz: `28. Piramida shaklidagi gumbaz hajmini V = (1/3)·S_asos·h (m³) toping.`
        },
        opts: [`${baseArea * height}`, `${pyrVol}`, `${pyrVol * 2}`, `${baseArea + height}`],
        corr: 1,
        exp: `V = (1/3)·${baseArea}·${height} = ${pyrVol} м³.`
      },
      {
        q: {
          ru: `29. Во сколько раз увеличится площадь основания, если сторону a увеличить в 2 раза?`,
          kk: `29. Табан қабырғасын 2 есе ұзартса, табан ауданы неше есе артады?`,
          uz: `29. Asos tomoni 2 marta ortsa, asos yuzi necha marta ortadi?`
        },
        opts: ["2", "4", "8", "6"],
        corr: 1,
        exp: "Площадь подобных фигур изменяется пропорционально квадрату коэффициента подобия: k² = 2² = 4."
      },
      {
        q: {
          ru: `30. Сколько упаковок покрытия по 12 м² потребуется для полного покрытия пола основания (${baseArea} м²)?`,
          kk: `30. Табан еденін (${baseArea} м²) толық жабу үшін 12 м² болатын неше қаптама қажет?`,
          uz: `30. Asos polini (${baseArea} m²) qoplash uchun 12 m² lik nechta qadoq kerak?`
        },
        opts: [
          `${Math.max(1, Math.ceil(baseArea / 12) - 1)}`,
          `${Math.ceil(baseArea / 12)}`,
          `${Math.ceil(baseArea / 12) + 2}`,
          `${Math.ceil(baseArea / 6)}`
        ],
        corr: 1,
        exp: `Делим площадь ${baseArea} на 12 с округлением вверх: ⌈${baseArea}/12⌉ = ${Math.ceil(baseArea / 12)}.`
      }
    ][idx];

    const ctxQuestion: UntContextQuestion = {
      id: `math-v${v}-q${order}`,
      order,
      format: "context",
      subtest: "profile_math",
      untNumberRange: `Вариант #${v} · №${order} (Контекст)`,
      topic: "stereometry",
      maxPoints: 1,
      contextId: `math-ctx-v${v}`,
      contextTitle: {
        ru: `Контекст НЦТ (Вариант #${v}): Стеклянный купол выставочного павильона`,
        kk: `ҰТО Контексті (Нұсқа #${v}): Көрме павильонының шыны күмбезі`,
        uz: `UBT Konteksti (Variant #${v}): Ko‘rgazma pavilyonining shisha gumbazi`
      },
      contextBody: {
        ru: `Купол павильона спроектирован в форме правильной четырёхугольной пирамиды со стороной квадратного основания a = ${baseSide} м и высотой h = ${height} м.`,
        kk: `Павильон күмбезі табан қабырғасы a = ${baseSide} м және биіктігі h = ${height} м болатын дұрыс төртбұрышты пирамида пішінінде жобаланған.`,
        uz: `Pavilyon gumbazi asos tomoni a = ${baseSide} m va balandligi h = ${height} m bo‘lgan muntazam to‘rtburchakli piramida shaklida loyihalangan.`
      },
      prompt: subPrompts.q,
      options: {
        ru: subPrompts.opts,
        kk: subPrompts.opts,
        uz: subPrompts.opts
      },
      correctIndex: subPrompts.corr,
      rule: {
        ru: "Геометрические формулы правильной пирамиды и подобия фигур.",
        kk: "Дұрыс пирамида мен ұқсас фигуралардың геометриялық формулалары.",
        uz: "Muntazam piramida va o‘xshash shakllar formulalari."
      },
      explanation: {
        ru: subPrompts.exp,
        kk: subPrompts.exp,
        uz: subPrompts.exp
      },
      trap: {
        ru: "Проверяйте единицы измерения (м, м², м³) и коэффициент 1/3 в объёме пирамиды.",
        kk: "Өлшем бірліктерін (м, м², м³) және 1/3 коэффициентін тексеріңіз.",
        uz: "O‘lchov birliklari va 1/3 koeffitsiyentini tekshiring."
      },
      labSeed: (v + idx) % 24
    };
    questions.push(ctxQuestion);
  }

  // Q31..Q35: 5 Matching Questions (2 pts each = 10 pts)
  for (let idx = 0; idx < 5; idx++) {
    const order = 31 + idx;
    const p = v + idx + 1;
    const matchQuestion: UntMatchingQuestion = {
      id: `math-v${v}-q${order}`,
      order,
      format: "matching",
      subtest: "profile_math",
      untNumberRange: `Вариант #${v} · №${order} (2 балла)`,
      topic: TOPIC_CYCLE[(order + v) % TOPIC_CYCLE.length],
      maxPoints: 2,
      prompt: {
        ru: `Установите соответствие между выражением (при параметре a = ${p}) и его точным числовым значением:`,
        kk: `a = ${p} параметрінде өрнек пен оның дәл сандық мәні арасындағы сәйкестікті орнатыңыз:`,
        uz: `a = ${p} parametrda ifoda va uning aniq son qiymati mosligini aniqlang:`
      },
      leftItems: {
        ru: [`А) Значение степени 2³ + ${p}`, `Б) Производная функции f(x) = ${p}x² в точке x₀ = 1`],
        kk: [`А) 2³ + ${p} өрнегінің мәні`, `Б) f(x) = ${p}x² функциясының x₀ = 1 нүктесіндегі туындысы`],
        uz: [`A) 2³ + ${p} ifodaning qiymati`, `B) f(x) = ${p}x² funksiyaning x₀ = 1 nuqtadagi hosilasi`]
      },
      rightOptions: {
        ru: [`1) ${8 + p}`, `2) ${2 * p}`, `3) ${6 + p}`, `4) ${p * p}`],
        kk: [`1) ${8 + p}`, `2) ${2 * p}`, `3) ${6 + p}`, `4) ${p * p}`],
        uz: [`1) ${8 + p}`, `2) ${2 * p}`, `3) ${6 + p}`, `4) ${p * p}`]
      },
      correctPairs: [0, 1],
      rule: {
        ru: "Свойства степеней 2³ = 8 и производная степенной функции (ax²)' = 2ax.",
        kk: "2³ = 8 дәреже қасиеті және (ax²)' = 2ax туынды формуласы.",
        uz: "2³ = 8 daraja xossasi va (ax²)' = 2ax hosila formulasi."
      },
      explanation: {
        ru: `Для А: 2³ + ${p} = 8 + ${p} (пункт 1). Для Б: f'(x) = 2·${p}x ⇒ f'(1) = ${2 * p} (пункт 2).`,
        kk: `А үшін: 8 + ${p} (1-нұсқа). Б үшін: f'(1) = ${2 * p} (2-нұсқа).`,
        uz: `A uchun: 8 + ${p} (1-variant). B uchun: f'(1) = ${2 * p} (2-variant).`
      },
      trap: {
        ru: "За 1 верную пару начисляется 1 балл, за обе верные пары — 2 балла по шкале НЦТ РК.",
        kk: "1 дұрыс жұп үшін — 1 балл, екі дұрыс жұп үшін — 2 балл беріледі.",
        uz: "1 ta to‘g‘ri juftlik uchun 1 ball, ikkalasi uchun 2 ball beriladi."
      },
      labSeed: (v + idx) % 24
    };
    questions.push(matchQuestion);
  }

  // Q36..Q40: 5 Multiple-Choice Questions (1..3 of 6, 2 pts each = 10 pts)
  for (let idx = 0; idx < 5; idx++) {
    const order = 36 + idx;
    const r1 = idx + 2;
    const r2 = idx + v + 3;
    const sum = r1 + r2;
    const prod = r1 * r2;
    const multiQuestion: UntMultipleQuestion = {
      id: `math-v${v}-q${order}`,
      order,
      format: "multiple",
      subtest: "profile_math",
      untNumberRange: `Вариант #${v} · №${order} (2 балла)`,
      topic: "quadratic",
      maxPoints: 2,
      prompt: {
        ru: `Дано квадратное уравнение x² − ${sum}x + ${prod} = 0. Выберите ВСЕ верные утверждения (от 1 до 3 ответов из 6):`,
        kk: `x² − ${sum}x + ${prod} = 0 квадрат теңдеуі берілген. БАРЛЫҚ дұрыс тұжырымдарды таңдаңыз (6-дан 1–3 жауап):`,
        uz: `x² − ${sum}x + ${prod} = 0 kvadrat tenglama berilgan. BARCHA to‘g‘ri mulohazalarni tanlang (6 tadan 1–3 javob):`
      },
      options: {
        ru: [
          `Сумма корней уравнения равна ${sum}`,
          `Сумма корней уравнения равна −${sum}`,
          `Произведение корней равно ${prod}`,
          `Меньший корень уравнения равен ${r1}`,
          `Оба корня уравнения отрицательны`,
          `Дискриминант уравнения меньше нуля`
        ],
        kk: [
          `Түбірлердің қосындысы ${sum}-ге тең`,
          `Түбірлердің қосындысы −${sum}-ге тең`,
          `Түбірлердің көбейтіндісі ${prod}-ге тең`,
          `Теңдеудің кіші түбірі ${r1}-ге тең`,
          `Екі түбірі де теріс сандар`,
          `Дискриминант нөлден кіші`
        ],
        uz: [
          `Ildizlar yig‘indisi ${sum} ga teng`,
          `Ildizlar yig‘indisi −${sum} ga teng`,
          `Ildizlar ko‘paytmasi ${prod} ga teng`,
          `Kichik ildiz ${r1} ga teng`,
          `Ikkala ildiz ham manfiy`,
          `Diskriminant noldan kichik`
        ]
      },
      correctIndices: [0, 2, 3],
      rule: {
        ru: "Теорема Виета для приведённого квадратного уравнения x² + px + q = 0: x₁ + x₂ = −p, x₁·x₂ = q.",
        kk: "Келтірілген квадрат теңдеу үшін Виет теоремасы: x₁ + x₂ = −p, x₁·x₂ = q.",
        uz: "Keltirilgan kvadrat tenglama uchun Viyet teoremasi: x₁ + x₂ = −p, x₁·x₂ = q."
      },
      explanation: {
        ru: `Корни уравнения равны x₁ = ${r1} и x₂ = ${r2}. Их сумма равна ${sum} (A), произведение равно ${prod} (C), меньший корень равен ${r1} (D).`,
        kk: `Түбірлері x₁ = ${r1} және x₂ = ${r2}. Қосындысы ${sum} (A), көбейтіндісі ${prod} (C), кіші түбірі ${r1} (D).`,
        uz: `Ildizlari x₁ = ${r1} va x₂ = ${r2}. Yig‘indisi ${sum} (A), ko‘paytmasi ${prod} (C), kichik ildizi ${r1} (D).`
      },
      trap: {
        ru: "При одной ошибке (например, выбраны 2 из 3 верных без лишних) начисляется 1 балл из 2.",
        kk: "Бір қате кетсе (мысалы, 3 дұрыс жауаптың 2-еуі таңдалса), 2 балдың орнына 1 балл беріледі.",
        uz: "Bitta xato bo‘lsa, 2 ball o‘rniga 1 ball beriladi."
      },
      labSeed: (v + idx) % 24
    };
    questions.push(multiQuestion);
  }

  return questions;
}

interface SubjectBankSeed {
  singlePool: {
    prompt: Record<Language, string>;
    options: Record<Language, [string, string, string, string]>;
    correctIndex: 0 | 1 | 2 | 3;
    rule: Record<Language, string>;
    explanation: Record<Language, string>;
  }[];
  contextTitle: Record<Language, string>;
  contextBody: Record<Language, string>;
  matchingPairs: {
    leftA: Record<Language, string>;
    leftB: Record<Language, string>;
    rights: Record<Language, [string, string, string, string]>;
    correct: [number, number];
    explanation: Record<Language, string>;
  }[];
  multiPool: {
    prompt: Record<Language, string>;
    options: Record<Language, [string, string, string, string, string, string]>;
    correctIndices: number[];
    explanation: Record<Language, string>;
  }[];
}

const SUBJECT_BANKS: Record<Exclude<UntSubjectId, "math">, SubjectBankSeed> = {
  physics: {
    singlePool: [
      {
        prompt: {
          ru: "При увеличении абсолютной температуры идеального одноатомного газа в 4 раза средняя квадратичная скорость его молекул:",
          kk: "Идеал бір атомды газдың абсолют температурасын 4 есе арттырғанда молекулалардың орташа квадраттық жылдамдығы:",
          uz: "Ideal bir atomli gazning absolyut harorati 4 marta ortsa, molekulalarning o‘rtacha kvadratik tezligi:"
        },
        options: {
          ru: ["увеличится в 4 раза", "увеличится в 2 раза", "уменьшится в 2 раза", "увеличится в 16 раз"],
          kk: ["4 есе артады", "2 есе артады", "2 есе кемиді", "16 есе артады"],
          uz: ["4 marta ortadi", "2 marta ortadi", "2 marta kamayadi", "16 marta ortadi"]
        },
        correctIndex: 1,
        rule: {
          ru: "Формула средней квадратичной скорости МКТ: v_кв = √(3RT / M).",
          kk: "МКТ орташа квадраттық жылдамдық формуласы: v_кв = √(3RT / M).",
          uz: "O‘rtacha kvadratik tezlik formulasi: v_kv = √(3RT / M)."
        },
        explanation: {
          ru: "Так как v_кв ∝ √T, при росте T в 4 раза скорость возрастает в √4 = 2 раза.",
          kk: "v_кв ∝ √T болғандықтан, T 4 есе өскенде жылдамдық √4 = 2 есе артады.",
          uz: "v_kv ∝ √T bo‘lgani uchun tezlik √4 = 2 marta ortadi."
        }
      },
      {
        prompt: {
          ru: "К источнику тока с ЭДС ε = 12 В и внутренним сопротивлением r = 1 Ом подключили резистор R = 5 Ом. Найдите силу тока в цепи.",
          kk: "ЭҚК ε = 12 В және ішкі кедергісі r = 1 Ом ток көзіне R = 5 Ом резистор қосылды. Тізбектегі ток күшін табыңыз.",
          uz: "EYuK ε = 12 V va ichki qarshiligi r = 1 Om manbaga R = 5 Om rezistor ulandi. Tok kuchini toping."
        },
        options: {
          ru: ["2,4 А", "2 А", "12 А", "6 А"],
          kk: ["2,4 А", "2 А", "12 А", "6 А"],
          uz: ["2,4 A", "2 A", "12 A", "6 A"]
        },
        correctIndex: 1,
        rule: {
          ru: "Закон Ома для полной цепи: I = ε / (R + r).",
          kk: "Толық тізбек үшін Ом заңы: I = ε / (R + r).",
          uz: "To‘liq zanjir uchun Om qonuni: I = ε / (R + r)."
        },
        explanation: {
          ru: "I = 12 / (5 + 1) = 12 / 6 = 2 А.",
          kk: "I = 12 / (5 + 1) = 2 А.",
          uz: "I = 12 / (5 + 1) = 2 A."
        }
      },
      {
        prompt: {
          ru: "Тело массой 2 кг движется со скоростью 6 м/с. Чему равна его кинетическая энергия E_k?",
          kk: "Массасы 2 кг дене 6 м/с жылдамдықпен қозғалады. Оның кинетикалық энергиясы E_k неге тең?",
          uz: "Massasi 2 kg jism 6 m/s tezlik bilan harakatlanmoqda. Uning kinetik energiyasi E_k nechaga teng?"
        },
        options: {
          ru: ["12 Дж", "36 Дж", "72 Дж", "18 Дж"],
          kk: ["12 Дж", "36 Дж", "72 Дж", "18 Дж"],
          uz: ["12 J", "36 J", "72 J", "18 J"]
        },
        correctIndex: 1,
        rule: {
          ru: "Кинетическая энергия: E_k = m·v² / 2.",
          kk: "Кинетикалық энергия: E_k = m·v² / 2.",
          uz: "Kinetik energiya: E_k = m·v² / 2."
        },
        explanation: {
          ru: "E_k = 2 · 6² / 2 = 36 Дж.",
          kk: "E_k = 2 · 6² / 2 = 36 Дж.",
          uz: "E_k = 2 · 6² / 2 = 36 J."
        }
      },
      {
        prompt: {
          ru: "Какова оптическая сила D собирающей линзы с фокусным расстоянием F = 25 см?",
          kk: "Фокус аралығы F = 25 см жинағыш линзаның оптикалық күші D қандай?",
          uz: "Fokus masofasi F = 25 sm bo‘lgan yig‘uvchi linzaning optik kuchi D nechaga teng?"
        },
        options: {
          ru: ["+0,04 дптр", "+4 дптр", "−4 дптр", "+2,5 дптр"],
          kk: ["+0,04 дптр", "+4 дптр", "−4 дптр", "+2,5 дптр"],
          uz: ["+0,04 dptr", "+4 dptr", "−4 dptr", "+2,5 dptr"]
        },
        correctIndex: 1,
        rule: {
          ru: "Оптическая сила линзы D = 1 / F (где F обязательно переводится в метры!).",
          kk: "Линзаның оптикалық күші D = 1 / F (F метрмен алынады!).",
          uz: "Linzaning optik kuchi D = 1 / F (F metrda olinadi!)."
        },
        explanation: {
          ru: "F = 25 см = 0,25 м ⇒ D = 1 / 0,25 = +4 дптр.",
          kk: "F = 0,25 м ⇒ D = 1 / 0,25 = +4 дптр.",
          uz: "F = 0,25 m ⇒ D = 1 / 0,25 = +4 dptr."
        }
      },
      {
        prompt: {
          ru: "По формуле Томсона T = 2π√(LC), если электроёмкость конденсатора C увеличить в 9 раз, период свободных электромагнитных колебаний:",
          kk: "Томсон формуласы T = 2π√(LC) бойынша конденсатор сыйымдылығын C 9 есе арттырса, тербеліс периоды:",
          uz: "Tomson formulasi T = 2π√(LC) bo‘yicha kondensator sig‘imi C 9 marta ortsa, tebranish davri:"
        },
        options: {
          ru: ["увеличится в 9 раз", "увеличится в 3 раза", "уменьшится в 3 раза", "не изменится"],
          kk: ["9 есе артады", "3 есе артады", "3 есе кемиді", "өзгермейді"],
          uz: ["9 marta ortadi", "3 marta ortadi", "3 marta kamayadi", "o‘zgarmaydi"]
        },
        correctIndex: 1,
        rule: {
          ru: "Период колебательного контура T = 2π√(LC) пропорционален √C.",
          kk: "Тербелмелі контур периоды T = 2π√(LC).",
          uz: "Tebranish konturi davri T = 2π√(LC)."
        },
        explanation: {
          ru: "При увеличении C в 9 раз множитель √C возрастает в √9 = 3 раза.",
          kk: "C 9 есе артқанда период √9 = 3 есе артады.",
          uz: "C 9 marta ortsa, davr √9 = 3 marta ortadi."
        }
      }
    ],
    contextTitle: {
      ru: "Контекст НЦТ по физике: Тепловой двигатель и цикл Карно",
      kk: "Физикадан ҰТО контексті: Жылу қозғалтқышы және Карно циклі",
      uz: "Fizika konteksti: Issiqlik dvigateli va Karno sikli"
    },
    contextBody: {
      ru: "Идеальная тепловая машина работает по циклу Карно. Температура нагревателя T₁ = 600 К, температура холодильника T₂ = 300 К. За один цикл рабочее тело получает от нагревателя количество теплоты Q₁ = 1200 Дж.",
      kk: "Идеал жылу машинасы Карно циклі бойынша жұмыс істейді. Қыздырғыш температурасы T₁ = 600 К, салқындатқыш температурасы T₂ = 300 К. Бір циклде қыздырғыштан Q₁ = 1200 Дж жылу алады.",
      uz: "Ideal issiqlik mashinasi Karno sikli bo‘yicha ishlaydi. Isitkich harorati T₁ = 600 K, sovitkich harorati T₂ = 300 K, Q₁ = 1200 J."
    },
    matchingPairs: [
      {
        leftA: {
          ru: "А) Альфа-распад (α) ядра _Z^A X",
          kk: "А) Ядроның альфа-ыдырауы (α)",
          uz: "A) Yadroning alfa-yemirilishi (α)"
        },
        leftB: {
          ru: "Б) Электронный бета-распад (β⁻) ядра _Z^A X",
          kk: "Б) Электрондық бета-ыдырау (β⁻)",
          uz: "B) Elektronli beta-yemirilish (β⁻)"
        },
        rights: {
          ru: ["1) A → A − 4, Z → Z − 2", "2) A → A, Z → Z + 1", "3) A → A, Z → Z − 1", "4) A → A − 2, Z → Z − 4"],
          kk: ["1) A → A − 4, Z → Z − 2", "2) A → A, Z → Z + 1", "3) A → A, Z → Z − 1", "4) A → A − 2, Z → Z − 4"],
          uz: ["1) A → A − 4, Z → Z − 2", "2) A → A, Z → Z + 1", "3) A → A, Z → Z − 1", "4) A → A − 2, Z → Z − 4"]
        },
        correct: [0, 1],
        explanation: {
          ru: "По правилам смещения Содди: при α-распаде вылетает ядро гелия ⁴₂He (1), при β⁻-распаде заряд ядра растёт на 1 (2).",
          kk: "Содди ығысу ережесі бойынша: α-ыдырауда (1), β⁻-ыдырауда (2).",
          uz: "Soddi siljish qoidasiga ko‘ra: α-yemirilishda (1), β⁻-yemirilishda (2)."
        }
      }
    ],
    multiPool: [
      {
        prompt: {
          ru: "Выберите ВСЕ верные утверждения для изотермического процесса (T = const) в идеальном газе фиксированной массы:",
          kk: "Массасы тұрақты идеал газдағы изотермиялық процесс (T = const) үшін БАРЛЫҚ дұрыс тұжырымдарды таңдаңыз:",
          uz: "Massasi o‘zgarmas ideal gazdagi izotermik jarayon (T = const) uchun BARCHA to‘g‘ri fikrlarni tanlang:"
        },
        options: {
          ru: [
            "Внутренняя энергия газа не изменяется (ΔU = 0)",
            "Выполняется закон Бойля — Мариотта pV = const",
            "При расширении газа всё подведённое тепло идёт на совершение работы (Q = A')",
            "Давление газа прямо пропорционально его объёму",
            "Работа газа при расширении равна нулю",
            "Средняя кинетическая энергия молекул увеличивается"
          ],
          kk: [
            "Газдың ішкі энергиясы өзгермейді (ΔU = 0)",
            "Бойль — Мариотт заңы орындалады (pV = const)",
            "Газ ұлғайғанда берілген жылу толықтай жұмысқа жұмсалады (Q = A')",
            "Газ қысымы көлемге тура пропорционал",
            "Ұлғаю кезіндегі газ жұмысы нөлге тең",
            "Молекулалардың орташа кинетикалық энергиясы артады"
          ],
          uz: [
            "Gazning ichki energiyasi o‘zgarmaydi (ΔU = 0)",
            "Boyl — Mariott qonuni bajariladi (pV = const)",
            "Kengayishda berilgan issiqlik to‘liq ishga sarflanadi (Q = A')",
            "Bosim hajmga to‘g‘ri proporsional",
            "Kengayishda gaz ishi nolga teng",
            "Molekulalar kinetik energiyasi ortadi"
          ]
        },
        correctIndices: [0, 1, 2],
        explanation: {
          ru: "При T = const внутренняя энергия идеального газа постоянна (ΔU = 0), действует закон Бойля — Мариотта pV = const, и по I закону термодинамики Q = A'.",
          kk: "T = const болғанда ΔU = 0, pV = const және Q = A' (A, B, C дұрыс).",
          uz: "T = const bo‘lganda ΔU = 0, pV = const va Q = A' (A, B, C to‘g‘ri)."
        }
      }
    ]
  },
  informatics: {
    singlePool: [
      {
        prompt: {
          ru: "Узел с IP-адресом 192.168.15.138 имеет маску подсети 255.255.255.192. Чему равен последний октет адреса сети?",
          kk: "IP-адресі 192.168.15.138 болатын түйіннің ішкі желі маскасы 255.255.255.192. Желі адресінің соңғы октеті неге тең?",
          uz: "IP-manzili 192.168.15.138 bo‘lgan tugunning maskasi 255.255.255.192. Tarmoq manzilining oxirgi okteti nechaga teng?"
        },
        options: {
          ru: ["0", "128", "138", "192"],
          kk: ["0", "128", "138", "192"],
          uz: ["0", "128", "138", "192"]
        },
        correctIndex: 1,
        rule: {
          ru: "Адрес сети вычисляется побитовой конъюнкцией IP & Mask.",
          kk: "Желі адресі IP & Mask разрядтық конъюнкциясы арқылы табылады.",
          uz: "Tarmoq manzili IP & Mask mantiqiy ko‘paytirish orqali topiladi."
        },
        explanation: {
          ru: "138₁₀ = 10001010₂, 192₁₀ = 11000000₂. Побитовое И даёт 10000000₂ = 128₁₀.",
          kk: "138 & 192 = 10001010₂ & 11000000₂ = 10000000₂ = 128.",
          uz: "138 & 192 = 128."
        }
      },
      {
        prompt: {
          ru: "Чему равно значение выражения 2 ** 3 ** 2 в языке Python 3?",
          kk: "Python 3 тіліндегі 2 ** 3 ** 2 өрнегінің мәні неге тең?",
          uz: "Python 3 tilida 2 ** 3 ** 2 ifodaning qiymati nechaga teng?"
        },
        options: {
          ru: ["64", "512", "36", "256"],
          kk: ["64", "512", "36", "256"],
          uz: ["64", "512", "36", "256"]
        },
        correctIndex: 1,
        rule: {
          ru: "Оператор возведения в степень ** в Python правоассоциативен: a ** b ** c = a ** (b ** c).",
          kk: "Python-да ** операторы оңнан солға қарай орындалады: 2 ** (3 ** 2).",
          uz: "Python-da ** operatori o‘ngdan chapga bajariladi: 2 ** (3 ** 2)."
        },
        explanation: {
          ru: "Сначала вычисляется 3 ** 2 = 9, затем 2 ** 9 = 512.",
          kk: "Алдымен 3 ** 2 = 9, содан кейін 2 ** 9 = 512.",
          uz: "Avval 3 ** 2 = 9, keyin 2 ** 9 = 512."
        }
      }
    ],
    contextTitle: {
      ru: "Контекст НЦТ по информатике: Анализ алгоритма Python и базы данных",
      kk: "Информатикадан ҰТО контексті: Python алгоритмі және деректер қоры",
      uz: "Informatika konteksti: Python algoritmi va ma’lumotlar bazasi"
    },
    contextBody: {
      ru: "Дан список чисел a = [4, 7, 2, 9, 6, 3]. Программа выбирает элементы среза a[1:5:2] и вычисляет их сумму.",
      kk: "a = [4, 7, 2, 9, 6, 3] тізімі берілген. Программа a[1:5:2] кесіндісінің элементтерін алып, қосындысын есептейді.",
      uz: "a = [4, 7, 2, 9, 6, 3] ro‘yxati berilgan. Dastur a[1:5:2] kesimi elementlari yig‘indisini hisoblaydi."
    },
    matchingPairs: [
      {
        leftA: {
          ru: "А) SQL-функция COUNT(*)",
          kk: "А) COUNT(*) SQL-функциясы",
          uz: "A) COUNT(*) SQL-funksiyasi"
        },
        leftB: {
          ru: "Б) SQL-функция AVG(score)",
          kk: "Б) AVG(score) SQL-функциясы",
          uz: "B) AVG(score) SQL-funksiyasi"
        },
        rights: {
          ru: ["1) Подсчёт количества строк таблицы", "2) Среднее арифметическое столбца", "3) Сумма значений", "4) Сортировка по возрастанию"],
          kk: ["1) Кесте жолдарының санын есептеу", "2) Бағанның орташа арифметикалық мәні", "3) Мәндер қосындысы", "4) Өсу ретімен сұрыптау"],
          uz: ["1) Satrlar sonini hisoblash", "2) O‘rtacha arifmetik qiymat", "3) Qiymatlar yig‘indisi", "4) O‘sish bo‘yicha saralash"]
        },
        correct: [0, 1],
        explanation: {
          ru: "COUNT(*) возвращает число записей (1), AVG() — среднее значение (2).",
          kk: "COUNT(*) — жазбалар саны (1), AVG() — орташа мән (2).",
          uz: "COUNT(*) — yozuvlar soni (1), AVG() — o‘rtacha qiymat (2)."
        }
      }
    ],
    multiPool: [
      {
        prompt: {
          ru: "Какие из следующих логических выражений тождественно равны отрицанию импликации ¬(A → B)?",
          kk: "Төмендегі логикалық өрнектердің қайсысы ¬(A → B) импликацияны терістеуге тепе-тең?",
          uz: "Quyidagi mantiqiy ifodalardan qaysilari ¬(A → B) ga teng kuchli?"
        },
        options: {
          ru: ["A ∧ ¬B", "¬A ∨ B", "¬(¬A ∨ B)", "¬(B ∨ ¬A)", "¬A ∧ B", "A ∨ ¬B"],
          kk: ["A ∧ ¬B", "¬A ∨ B", "¬(¬A ∨ B)", "¬(B ∨ ¬A)", "¬A ∧ B", "A ∨ ¬B"],
          uz: ["A ∧ ¬B", "¬A ∨ B", "¬(¬A ∨ B)", "¬(B ∨ ¬A)", "¬A ∧ B", "A ∨ ¬B"]
        },
        correctIndices: [0, 2, 3],
        explanation: {
          ru: "Так как A → B = ¬A ∨ B, по закону Де Моргана ¬(A → B) = ¬(¬A ∨ B) = A ∧ ¬B.",
          kk: "Де Морган заңы бойынша ¬(A → B) = ¬(¬A ∨ B) = A ∧ ¬B (A, C, D дұрыс).",
          uz: "De Morgan qonuniga ko‘ra ¬(A → B) = A ∧ ¬B (A, C, D to‘g‘ri)."
        }
      }
    ]
  },
  chemistry: {
    singlePool: [
      {
        prompt: {
          ru: "Укажите электронную конфигурацию внешнего и предвнешнего слоёв атома хрома (Cr, Z = 24) в основном состоянии:",
          kk: "Хром атомының (Cr, Z = 24) негізгі күйдегі сыртқы және сыртқының алдындағы қабаттарының электрондық конфигурациясы:",
          uz: "Xrom atomining (Cr, Z = 24) asosiy holatdagi elektron konfiguratsiyasini ko‘rsating:"
        },
        options: {
          ru: ["3d⁴ 4s²", "3d⁵ 4s¹", "3d⁶ 4s⁰", "3d⁵ 4s²"],
          kk: ["3d⁴ 4s²", "3d⁵ 4s¹", "3d⁶ 4s⁰", "3d⁵ 4s²"],
          uz: ["3d⁴ 4s²", "3d⁵ 4s¹", "3d⁶ 4s⁰", "3d⁵ 4s²"]
        },
        correctIndex: 1,
        rule: {
          ru: "Провал (проскок) электрона у Cr (Z=24) и Cu (Z=29) с 4s на 3d-подуровень.",
          kk: "Cr (Z=24) және Cu (Z=29) атомдарында электронның 4s-тен 3d-ға өтуі.",
          uz: "Cr (Z=24) va Cu (Z=29) atomlarida elektron ko‘chishi."
        },
        explanation: {
          ru: "Наполовину заполненный подуровень 3d⁵ энергетически устойчивее, поэтому конфигурация Cr: [Ar] 3d⁵ 4s¹.",
          kk: "Жартылай толған 3d⁵ деңгейшесі тұрақтырақ: [Ar] 3d⁵ 4s¹.",
          uz: "Yarim to‘lgan 3d⁵ barqarorroq: [Ar] 3d⁵ 4s¹."
        }
      }
    ],
    contextTitle: {
      ru: "Контекст НЦТ по химии: Нитрование бензола и выход продукта",
      kk: "Химиядан ҰТО контексті: Бензолды нитрлеу және өнім шығымы",
      uz: "Kimyo konteksti: Benzolni nitrolash va mahsulot unumi"
    },
    contextBody: {
      ru: "При взаимодействии 15,6 г бензола (M = 78 г/моль) с азотной кислотой получили 19,68 г нитробензола (M = 123 г/моль). Теоретическая масса составляет 24,6 г, практический выход η = 80%.",
      kk: "15,6 г бензолды (M = 78 г/моль) азот қышқылымен өңдегенде 19,68 г нитробензол (M = 123 г/моль) алынды. Теориялық массасы 24,6 г, шығымы η = 80%.",
      uz: "15,6 g benzol (M = 78 g/mol) nitrolanganda 19,68 g nitrobenzol (M = 123 g/mol) olindi. Nazariy massa 24,6 g, unum η = 80%."
    },
    matchingPairs: [
      {
        leftA: {
          ru: "А) Качественная реакция на многоатомные спирты (глицерин)",
          kk: "А) Көпатомды спирттерге (глицерин) сапалық реакция",
          uz: "A) Ko‘p atomli spirtlarga (glitserin) sifat reaksiyasi"
        },
        leftB: {
          ru: "Б) Качественная реакция на фенол",
          kk: "Б) Фенолға сапалық реакция",
          uz: "B) Fenolga sifat reaksiyasi"
        },
        rights: {
          ru: ["1) Свежеосаждённый Cu(OH)₂ (васильково-синий раствор)", "2) Раствор FeCl₃ (фиолетовое окрашивание)", "3) Известковая вода", "4) Лакмус"],
          kk: ["1) Жаңа тұндырылған Cu(OH)₂ (көкшіл ерітінді)", "2) FeCl₃ ерітіндісі (күлгін түс)", "3) Әк суы", "4) Лакмус"],
          uz: ["1) Yangi cho‘ktirilgan Cu(OH)₂ (ko‘k eritma)", "2) FeCl₃ eritmasi (binafsha rang)", "3) Ohakli suv", "4) Lakmus"]
        },
        correct: [0, 1],
        explanation: {
          ru: "Глицерин даёт ярко-синий хелатный комплекс с Cu(OH)₂ (1), фенол даёт фиолетовое окрашивание с FeCl₃ (2).",
          kk: "Глицерин Cu(OH)₂-мен көк ерітінді (1), фенол FeCl₃-пен күлгін түс (2) береді.",
          uz: "Glitserin Cu(OH)₂ bilan ko‘k eritma (1), fenol FeCl₃ bilan binafsha rang (2) beradi."
        }
      }
    ],
    multiPool: [
      {
        prompt: {
          ru: "Что образуется при электролизе водного раствора CuSO₄ с инертными электродами? (Выберите 3 верных из 6):",
          kk: "Инертті электродтармен CuSO₄ сулы ерітіндісін электролиздегенде не түзіледі? (6-дан 3 дұрыс жауап):",
          uz: "Inert elektrodlar bilan CuSO₄ suvli eritmasi elektroliz qilinganda nima hosil bo‘ladi?"
        },
        options: {
          ru: ["На катоде выделяется медь Cu", "На катоде выделяется водород H₂", "На аноде выделяется кислород O₂", "В растворе образуется серная кислота H₂SO₄", "На аноде выделяется SO₂", "В растворе образуется Cu(OH)₂"],
          kk: ["Катодта мыс Cu бөлінеді", "Катодта сутек H₂ бөлінеді", "Анодта оттек O₂ бөлінеді", "Ерітіндіде күкірт қышқылы H₂SO₄ түзіледі", "Анодта SO₂ бөлінеді", "Ерітіндіде Cu(OH)₂ түзіледі"],
          uz: ["Katodda mis Cu ajraladi", "Katodda vodorod H₂ ajraladi", "Anodda kislorod O₂ ajraladi", "Eritmada sulfat kislota H₂SO₄ hosil bo‘ladi", "Anodda SO₂ ajraladi", "Eritmada Cu(OH)₂ hosil bo‘ladi"]
        },
        correctIndices: [0, 2, 3],
        explanation: {
          ru: "2CuSO₄ + 2H₂O → 2Cu↓ (катод) + O₂↑ (анод) + 2H₂SO₄ (в растворе).",
          kk: "2CuSO₄ + 2H₂O → 2Cu↓ + O₂↑ + 2H₂SO₄ (A, C, D дұрыс).",
          uz: "2CuSO₄ + 2H₂O → 2Cu↓ + O₂↑ + 2H₂SO₄ (A, C, D to‘g‘ri)."
        }
      }
    ]
  },
  biology: {
    singlePool: [
      {
        prompt: {
          ru: "В фрагменте двуцепочечной молекулы ДНК содержится 30% нуклеотидов с гуанином (Г). Сколько процентов приходится на тимин (Т)?",
          kk: "Қос тізбекті ДНҚ молекуласының үзіндісінде гуанин (Г) нуклеотидтері 30%-ды құрайды. Тимин (Т) үлесі неше пайыз?",
          uz: "Qo‘sh zanjirli DNK molekulasida guanin (G) 30% ni tashkil etadi. Timin (T) ulushi necha foiz?"
        },
        options: {
          ru: ["30%", "20%", "40%", "15%"],
          kk: ["30%", "20%", "40%", "15%"],
          uz: ["30%", "20%", "40%", "15%"]
        },
        correctIndex: 1,
        rule: {
          ru: "Правило Чаргаффа: А + Г = 50% и Т = А, Ц = Г.",
          kk: "Чаргафф ережесі: А + Г = 50% және Т = А, Ц = Г.",
          uz: "Chargaff qoidasi: A + G = 50% va T = A, S = G."
        },
        explanation: {
          ru: "Так как Г = 30%, то Т = А = 50% − 30% = 20%.",
          kk: "Г = 30% болғандықтан, Т = А = 50% − 30% = 20%.",
          uz: "G = 30% bo‘lgani uchun T = A = 50% − 30% = 20%."
        }
      }
    ],
    contextTitle: {
      ru: "Контекст НЦТ по биологии: Энергетический обмен клетки и митохондрии",
      kk: "Биологиядан ҰТО контексті: Жасушаның энергетикалық алмасуы",
      uz: "Biologiya konteksti: Hujayra energetik almashinuvi"
    },
    contextBody: {
      ru: "При полном окислении 1 моль глюкозы на бескислородном этапе (гликолизе) синтезируется 2 моль АТФ, а на кислородном этапе в митохондриях — 36 моль АТФ (всего 38 моль АТФ).",
      kk: "1 моль глюкоза толық тотыққанда гликолизде 2 моль АТФ, ал митохондриядағы оттекті кезеңде 36 моль АТФ (барлығы 38 моль АТФ) синтезделеді.",
      uz: "1 mol glyukoza to‘liq oksidlanganda glikolizda 2 mol ATF, mitoxondriyada 36 mol ATF (jami 38 mol ATF) sintezlanadi."
    },
    matchingPairs: [
      {
        leftA: {
          ru: "А) Щитовидная железа",
          kk: "А) Қалқанша безі",
          uz: "A) Qalqonsimon bez"
        },
        leftB: {
          ru: "Б) Мозговой слой надпочечников",
          kk: "Б) Бүйрек үсті безінің милы қабаты",
          uz: "B) Buyrak usti bezining mag‘iz qavati"
        },
        rights: {
          ru: ["1) Тироксин (трийодтиронин)", "2) Адреналин (норадреналин)", "3) Инсулин", "4) Соматотропин"],
          kk: ["1) Тироксин", "2) Адреналин", "3) Инсулин", "4) Соматотропин"],
          uz: ["1) Tiroksin", "2) Adrenalin", "3) Insulin", "4) Somatotropin"]
        },
        correct: [0, 1],
        explanation: {
          ru: "Щитовидная железа выделяет йодсодержащий гормон тироксин (1), мозговой слой надпочечников — адреналин (2).",
          kk: "Қалқанша безі — тироксин (1), бүйрек үсті безі — адреналин (2).",
          uz: "Qalqonsimon bez — tiroksin (1), buyrak usti bezi — adrenalin (2)."
        }
      }
    ],
    multiPool: [
      {
        prompt: {
          ru: "Выберите ВСЕ двумембранные и полуавтономные структуры эукариотической клетки (из 6):",
          kk: "Эукариоттық жасушаның БАРЛЫҚ қос мембраналы құрылымдарын таңдаңыз:",
          uz: "Eukariot hujayraning BARCHA ikki membranali tuzilmalarini tanlang:"
        },
        options: {
          ru: ["Митохондрии", "Хлоропласты (пластиды)", "Клеточное ядро (ядерная оболочка)", "Рибосомы", "Лизосомы", "Клеточный центр"],
          kk: ["Митохондриялар", "Хлоропластар (пластидтер)", "Жасуша ядросы", "Рибосомалар", "Лизосомалар", "Жасуша орталығы"],
          uz: ["Mitoxondriyalar", "Xloroplastlar (plastidalar)", "Hujayra yadrosi", "Ribosomalar", "Lizosomalar", "Hujayra markazi"]
        },
        correctIndices: [0, 1, 2],
        explanation: {
          ru: "Митохондрии, пластиды и ядро окружены двойной мембраной; рибосомы и клеточный центр — немембранные, лизосомы — одномембранные.",
          kk: "Митохондрия, пластидтер және ядро қос мембраналы (A, B, C дұрыс).",
          uz: "Mitoxondriya, plastidalar va yadro ikki membranali (A, B, C to‘g‘ri)."
        }
      }
    ]
  },
  geography: {
    singlePool: [
      {
        prompt: {
          ru: "Какова абсолютная глубина самой низкой точки Казахстана — впадины Карагие на полуострове Мангыстау?",
          kk: "Қазақстанның ең төменгі нүктесі — Маңғыстау түбегіндегі Қарақия ойысының абсолюттік тереңдігі қандай?",
          uz: "Qozog‘istonning eng past nuqtasi — Qoragiye botig‘ining chuqurligi qancha?"
        },
        options: {
          ru: ["−42 м", "−132 м", "−154 м", "−28 м"],
          kk: ["−42 м", "−132 м", "−154 м", "−28 м"],
          uz: ["−42 m", "−132 m", "−154 m", "−28 m"]
        },
        correctIndex: 1,
        rule: {
          ru: "Крайние высотные отметки Казахстана: пик Хан-Тенгри (+7010 м) и впадина Карагие (−132 м).",
          kk: "Қазақстанның биіктік шектері: Хан Тәңірі (+7010 м) және Қарақия (−132 м).",
          uz: "Qozog‘iston balandlik chegaralari: Xon-Tangri (+7010 m) va Qoragiye (−132 m)."
        },
        explanation: {
          ru: "Впадина Карагие лежит на 132 метра ниже уровня Мирового океана (−132 м).",
          kk: "Қарақия ойысы мұхит деңгейінен 132 м төмен (−132 м).",
          uz: "Qoragiye botig‘i −132 m da joylashgan."
        }
      }
    ],
    contextTitle: {
      ru: "Контекст НЦТ по географии: Экономические районы и ресурсообеспеченность РК",
      kk: "Географиядан ҰТО контексті: ҚР экономикалық аудандары",
      uz: "Geografiya konteksti: Qozog‘iston iqtisodiy rayonlari"
    },
    contextBody: {
      ru: "Восточный Казахстан специализируется на цветной металлургии (титано-магниевый и свинцово-цинковый комплексы) и гидроэнергетике (Бухтарминская, Усть-Каменогорская и Шульбинская ГЭС на Иртыше).",
      kk: "Шығыс Қазақстан түсті металлургияға және Ертіс бойындағы гидроэнергетикаға (Бұқтырма, Өскемен, Шүлбі СЭС) маманданған.",
      uz: "Sharqiy Qozog‘iston rangli metallurgiya va Irtish daryosidagi GESlarga ixtisoslashgan."
    },
    matchingPairs: [
      {
        leftA: {
          ru: "А) Медеплавильный центр Центрального Казахстана (Улытау)",
          kk: "А) Орталық Қазақстанның (Ұлытау) мыс балқыту орталығы",
          uz: "A) Markaziy Qozog‘iston mis eritish markazi"
        },
        leftB: {
          ru: "Б) Центр алюминиевого (глинозёмного) производства РК",
          kk: "Б) ҚР алюминий (глинозем) өндірісінің орталығы",
          uz: "B) QR alyuminiy ishlab chiqarish markazi"
        },
        rights: {
          ru: ["1) Жезказган / Балхаш", "2) Павлодар", "3) Атырау", "4) Шымкент"],
          kk: ["1) Жезқазған / Балқаш", "2) Павлодар", "3) Атырау", "4) Шымкент"],
          uz: ["1) Jezqazg‘an / Balxash", "2) Pavlodar", "3) Atirau", "4) Chimkent"]
        },
        correct: [0, 1],
        explanation: {
          ru: "Жезказган и Балхаш — главные центры медной промышленности (1), Павлодар — центр алюминиевой промышленности РК (2).",
          kk: "Жезқазған мен Балқаш — мыс өнеркәсібі (1), Павлодар — алюминий орталығы (2).",
          uz: "Jezqazg‘an va Balxash — mis (1), Pavlodar — alyuminiy markazi (2)."
        }
      }
    ],
    multiPool: [
      {
        prompt: {
          ru: "Выберите государственные природные заповедники, расположенные в Южном и Юго-Восточном Казахстане (из 6):",
          kk: "Оңтүстік және Оңтүстік-Шығыс Қазақстанда орналасқан мемлекеттік табиғи қорықтарды таңдаңыз:",
          uz: "Janubiy va Janubi-Sharqiy Qozog‘istonda joylashgan qo‘riqxonalarni tanlang:"
        },
        options: {
          ru: ["Аксу-Жабаглинский", "Алматинский", "Алакольский", "Наурзумский (Костанайская обл.)", "Коргалжынский (Акмолинская обл.)", "Западно-Алтайский (ВКО)"],
          kk: ["Ақсу-Жабағылы", "Алматы", "Алакөл", "Наурызым", "Қорғалжын", "Батыс Алтай"],
          uz: ["Oqsuv-Jabag‘ili", "Olmaota", "Alako‘l", "Naurzum", "Qo‘rg‘aljin", "G‘arbiy Oltoy"]
        },
        correctIndices: [0, 1, 2],
        explanation: {
          ru: "Аксу-Жабаглинский (старейший, 1926 г.), Алматинский и Алакольский находятся на юге и юго-востоке РК.",
          kk: "Ақсу-Жабағылы, Алматы және Алакөл қорықтары оңтүстік пен оңтүстік-шығыста орналасқан.",
          uz: "Oqsuv-Jabag‘ili, Olmaota va Alako‘l janub va janubi-sharqda joylashgan."
        }
      }
    ]
  },
  history_kz: {
    singlePool: [
      {
        prompt: {
          ru: "В каком году состоялась Атлахская (Таласская) битва, остановившая продвижение танских войск в Центральной Азии?",
          kk: "Орталық Азияда Тан империясы әскерінің жылжуын тоқтатқан Атлах (Талас) шайқасы қай жылы болды?",
          uz: "Markaziy Osiyoda Tan imperiyasi qo‘shinlarini to‘xtatgan Atlax (Talas) jangi qaysi yili bo‘lgan?"
        },
        options: {
          ru: ["552 г.", "751 г.", "960 г.", "1219 г."],
          kk: ["552 ж.", "751 ж.", "960 ж.", "1219 ж."],
          uz: ["552-y.", "751-y.", "960-y.", "1219-y."]
        },
        correctIndex: 1,
        rule: {
          ru: "751 г. — Атлахская битва на реке Талас (арабы + карлуки против империи Тан).",
          kk: "751 ж. — Талас өзені бойындағы Атлах шайқасы.",
          uz: "751-yil — Talas daryosi bo‘yidagi Atlax jangi."
        },
        explanation: {
          ru: "В июле 751 года у города Атлах объединённые силы арабов и карлуков разгромили армию Танской империи.",
          kk: "751 жылы Атлах түбінде арабтар мен қарлұқтар Тан әскерін талқандады.",
          uz: "751-yilda Atlax yaqinida arablar va qarluqlar Tan qo‘shinini тор-mor keltirdi."
        }
      },
      {
        prompt: {
          ru: "Кто являлся главным редактором общенациональной газеты «Қазақ» (1913–1918 гг.)?",
          kk: "Жалпыұлттық «Қазақ» газетінің (1913–1918 жж.) бас редакторы кім болды?",
          uz: "Umummilliy «Qazaq» gazetasining (1913–1918-yy.) bosh muharriri kim bo‘lgan?"
        },
        options: {
          ru: ["Мустафа Шокай", "Ахмет Байтурсынов", "Сакен Сейфуллин", "Турар Рыскулов"],
          kk: ["Мұстафа Шоқай", "Ахмет Байтұрсынұлы", "Сәкен Сейфуллин", "Тұрар Рысқұлов"],
          uz: ["Mustafo Cho‘qay", "Axmet Baytursinov", "Saken Seyfullin", "Turor Risqulov"]
        },
        correctIndex: 1,
        rule: {
          ru: "Газета «Қазақ» издавалась в Оренбурге с 1913 г. под редакцией Ахмета Байтурсынова при участии А. Букейханова и М. Дулатова.",
          kk: "«Қазақ» газеті 1913 ж. Орынборда Ахмет Байтұрсынұлының редакторлығымен шықты.",
          uz: "«Qazaq» gazetasi Axmet Baytursinov muharrirligida chop etilgan."
        },
        explanation: {
          ru: "Главным редактором газеты «Қазақ» был просветитель и реформатор казахской письменности Ахмет Байтурсынов.",
          kk: "Бас редактор — Ахмет Байтұрсынұлы.",
          uz: "Bosh muharrir — Axmet Baytursinov."
        }
      }
    ],
    contextTitle: {
      ru: "Контекст НЦТ по Истории Казахстана: Свод законов «Жеты Жаргы» и эпоха Тауке-хана",
      kk: "Қазақстан тарихынан ҰТО контексті: Тәуке хан және «Жеті Жарғы» заңдар жинағы",
      uz: "Qozog‘iston tarixi konteksti: Tauke xon va «Jeti Jarg‘i» qonunlar to‘plami"
    },
    contextBody: {
      ru: "В период правления Тауке-хана (1680–1715/1718 гг.) в урочище Культобе при участии трёх великих биев — Толе би (Старший жуз), Казыбек би (Средний жуз) и Айтеке би (Младший жуз) — был принят свод законов «Жеты Жаргы».",
      kk: "Тәуке хан билігі тұсында (1680–1715/1718 жж.) Күлтөбеде Төле би, Қазыбек би және Әйтеке бидің қатысуымен «Жеті Жарғы» заңдар жинағы қабылданды.",
      uz: "Tauke xon davrida (1680–1715/1718-yy.) Kulto‘beda Tole bi, Qazibek bi va Ayteke bi ishtirokida «Jeti Jarg‘i» qabul qilingan."
    },
    matchingPairs: [
      {
        leftA: {
          ru: "А) 1465 год (Западное Жетысу, Козыбасы)",
          kk: "А) 1465 жыл (Батыс Жетісу, Қозыбасы)",
          uz: "A) 1465-yil (G‘arbiy Yetisuv, Qozibasi)"
        },
        leftB: {
          ru: "Б) 1643 год (Жангир-хан и Жалантос-батыр)",
          kk: "Б) 1643 жыл (Жәңгір хан мен Жалаңтөс батыр)",
          uz: "B) 1643-yil (Jangir xon va Jalantos botir)"
        },
        rights: {
          ru: ["1) Образование Казахского ханства", "2) Орбулакская битва против джунгар", "3) Аныракайская битва", "4) Устав о сибирских киргизах"],
          kk: ["1) Қазақ хандығының құрылуы", "2) Орбұлақ шайқасы", "3) Аңырақай шайқасы", "4) Сібір қырғыздары туралы жарғы"],
          uz: ["1) Qozoq xonligining tashkil topishi", "2) Orbulog‘ jangi", "3) Aniraqay jangi", "4) Sibir qirg‘izlari nizomi"]
        },
        correct: [0, 1],
        explanation: {
          ru: "1465 г. — основание Казахского ханства Кереем и Жанибеком (1), 1643 г. — легендарная Орбулакская битва (2).",
          kk: "1465 ж. — Қазақ хандығының құрылуы (1), 1643 ж. — Орбұлақ шайқасы (2).",
          uz: "1465-yil — Qozoq xonligi (1), 1643-yil — Orbulog‘ jangi (2)."
        }
      }
    ],
    multiPool: [
      {
        prompt: {
          ru: "Выберите государственные акты и события Независимого Казахстана, произошедшие в 1991–1995 гг. (3 верных из 6):",
          kk: "Тәуелсіз Қазақстанның 1991–1995 жж. аралығындағы тарихи оқиғаларын таңдаңыз (6-дан 3 дұрыс):",
          uz: "Mustaqil Qozog‘istonning 1991–1995-yillardagi voqealarini tanlang:"
        },
        options: {
          ru: [
            "Закрытие Семипалатинского ядерного полигона (29 августа 1991 г.)",
            "Введение национальной валюты тенге (15 ноября 1993 г.)",
            "Принятие действующей Конституции РК на референдуме (30 августа 1995 г.)",
            "Проведение саммита ОБСЕ в Астане (2010 г.)",
            "Образование партии «Алаш» (1917 г.)",
            "Открытие Академии наук КазССР К. Сатпаевым (1946 г.)"
          ],
          kk: [
            "Семей ядролық полигонының жабылуы (1991 ж. 29 тамыз)",
            "Ұлттық валюта — теңгенің енгізілуі (1993 ж. 15 қараша)",
            "ҚР қолданыстағы Конституциясының қабылдануы (1995 ж. 30 тамыз)",
            "Астанадағы ЕҚЫҰ саммиті (2010 ж.)",
            "«Алаш» партиясының құрылуы (1917 ж.)",
            "ҚазКСР Ғылым академиясының ашылуы (1946 ж.)"
          ],
          uz: [
            "Semipalatinsk yadro poligonining yopilishi (1991-y. 29-avgust)",
            "Milliy valyuta — tengening kiritilishi (1993-y. 15-noyabr)",
            "Amaldagi QR Konstitutsiyasining qabul qilinishi (1995-y. 30-avgust)",
            "Ostonada YXHT sammiti (2010-y.)",
            "«Alash» partiyasining tuzilishi (1917-y.)",
            "Fanlar akademiyasining ochilishi (1946-y.)"
          ]
        },
        correctIndices: [0, 1, 2],
        explanation: {
          ru: "Закрытие полигона (1991), введение тенге (1993) и Конституция РК (1995) относятся к периоду 1991–1995 гг.",
          kk: "A (1991 ж.), B (1993 ж.) және C (1995 ж.) оқиғалары 1991–1995 жж. кезеңіне жатады.",
          uz: "A (1991), B (1993) va C (1995) javoblari to‘g‘ri."
        }
      }
    ]
  },
  world_history: {
    singlePool: [
      {
        prompt: {
          ru: "В каком году в Англии королём Иоанном Безземельным была подписана «Великая хартия вольностей» (Magna Carta)?",
          kk: "Англияда король Жерсіз Иоанн «Еркіндіктердің ұлы хартиясына» (Magna Carta) қай жылы қол қойды?",
          uz: "Angliyada qirol Ioann tomonidan «Buyuk ozodlik xartiyasi» (Magna Carta) qaysi yili imzolangan?"
        },
        options: {
          ru: ["1066 г.", "1215 г.", "1265 г.", "1453 г."],
          kk: ["1066 ж.", "1215 ж.", "1265 ж.", "1453 ж."],
          uz: ["1066-y.", "1215-y.", "1265-y.", "1453-y."]
        },
        correctIndex: 1,
        rule: {
          ru: "1215 г. — Великая хартия вольностей, заложившая основы ограничения королевской власти и парламентаризма.",
          kk: "1215 ж. — Еркіндіктердің ұлы хартиясы.",
          uz: "1215-yil — Buyuk ozodlik xartiyasi."
        },
        explanation: {
          ru: "Magna Carta была подписана 15 июня 1215 года.",
          kk: "Хартияға 1215 жылы қол қойылды.",
          uz: "Xartiya 1215-yilda imzolangan."
        }
      }
    ],
    contextTitle: {
      ru: "Контекст НЦТ по Всемирной истории: Вестфальский мир и эпоха Просвещения",
      kk: "Дүниежүзі тарихынан ҰТО контексті: Вестфаль бітімі және Ағартушылық дәуірі",
      uz: "Jahon tarixi konteksti: Vestfaliya sulhi va Ma’rifatparvarlik davri"
    },
    contextBody: {
      ru: "В 1648 году Вестфальский мир завершил Тридцатилетнюю войну в Европе и закрепил принцип государственного суверенитета. В XVIII веке мыслители Просвещения (Монтескьё, Локк, Руссо) разработали теорию разделения властей на законодательную, исполнительную и судебную.",
      kk: "1648 жылы Вестфаль бітімі Еуропадағы Отыз жылдық соғысты аяқтап, мемлекеттік егемендік қағидатын бекітті. XVIII ғ. Монтескье, Локк билікті бөлу теориясын ұсынды.",
      uz: "1648-yilda Vestfaliya sulhi O‘ttiz yillik urushni yakunladi. XVIII asrda Monteskye va Lokk hokimiyatlar bo‘linishi nazariyasini yaratdi."
    },
    matchingPairs: [
      {
        leftA: {
          ru: "А) 4 июля 1776 г. (Томас Джефферсон)",
          kk: "А) 1776 ж. 4 шілде (Томас Джефферсон)",
          uz: "A) 1776-yil 4-iyul (Tomas Jefferson)"
        },
        leftB: {
          ru: "Б) 31 октября 1517 г. (Мартин Лютер, Виттенберг)",
          kk: "Б) 1517 ж. 31 қазан (Мартин Лютер, Виттенберг)",
          uz: "B) 1517-yil 31-oktabr (Martin Lyuter)"
        },
        rights: {
          ru: ["1) Декларация независимости США", "2) Начало Реформации в Германии («95 тезисов»)", "3) Падение Византии", "4) Венский конгресс"],
          kk: ["1) АҚШ Тәуелсіздік декларациясы", "2) Германиядағы Реформацияның басталуы («95 тезис»)", "3) Византияның құлауы", "4) Вена конгресі"],
          uz: ["1) AQSh Mustaqillik deklaratsiyasi", "2) Germaniyada Reformatsiya boshlanishi («95 tezis»)", "3) Vizantiyaning qulashi", "4) Vena kongressi"]
        },
        correct: [0, 1],
        explanation: {
          ru: "1776 г. — Декларация независимости США (1), 1517 г. — 95 тезисов Мартина Лютера (2).",
          kk: "1776 ж. — АҚШ Тәуелсіздік декларациясы (1), 1517 ж. — 95 тезис (2).",
          uz: "1776-yil — AQSh Mustaqillik deklaratsiyasi (1), 1517-yil — 95 tezis (2)."
        }
      }
    ],
    multiPool: [
      {
        prompt: {
          ru: "Какие реформы входили в «Новый курс» (New Deal) президента США Франклина Делано Рузвельта в 1930-е годы?",
          kk: "1930 жылдардағы АҚШ президенті Ф.Д. Рузвельттің «Жаңа бағыт» (New Deal) реформаларына не кірді?",
          uz: "AQSh prezidenti F.D. Ruzveltning «Yangi kursi» (New Deal) islohotlariga nimalar kirgan?"
        },
        options: {
          ru: [
            "Государственное регулирование промышленности (закон НИРА) и банковской системы",
            "Закон о регулировании сельского хозяйства (ААА)",
            "Введение системы социального страхования, пенсий и общественных работ",
            "Полная отмена частной собственности и национализация всех заводов",
            "Вступление США в Лигу Наций в 1933 году",
            "Ликвидация Федеральной резервной системы"
          ],
          kk: [
            "Өнеркәсіпті (НИРА заңы) және банк жүйесін мемлекеттік реттеу",
            "Ауыл шаруашылығын реттеу туралы заң (ААА)",
            "Әлеуметтік сақтандыру, зейнетақы және қоғамдық жұмыстар жүйесін енгізу",
            "Жеке меншікті толық жою",
            "1933 жылы АҚШ-тың Ұлттар Лигасына кіруі",
            "Федералдық резервтік жүйені тарату"
          ],
          uz: [
            "Sanoat (NIRA) va bank tizimini davlat tomonidan tartibga solish",
            "Qishloq xo‘jaligini tartibga solish qonuni (AAA)",
            "Ijtimoiy sug‘urta va jamoat ishlarini joriy etish",
            "Xususiy mulkni butunlay bekor qilish",
            "1933-yilda Millatlar Ligasiga kirish",
            "Federal rezerv tizimini tugatish"
          ]
        },
        correctIndices: [0, 1, 2],
        explanation: {
          ru: "«Новый курс» Рузвельта включал законы NIRA, AAA, оздоровление банков и социальное обеспечение.",
          kk: "Рузвельттің «Жаңа бағыты» NIRA, AAA және әлеуметтік қамсыздандыруды қамтыды (A, B, C).",
          uz: "Ruzveltning «Yangi kursi» NIRA, AAA va ijtimoiy himoyani o‘z ichiga olgan (A, B, C)."
        }
      }
    ]
  },
  law: {
    singlePool: [
      {
        prompt: {
          ru: "Согласно Конституции Республики Казахстан (с учётом конституционной реформы 2022 года), Президент РК избирается:",
          kk: "Қазақстан Республикасының Конституциясына сәйкес (2022 ж. реформаны ескере отырып), ҚР Президенті сайланады:",
          uz: "Qozog‘iston Respublikasi Konstitutsiyasiga muvofiq (2022-yilgi islohot bilan), QR Prezidenti saylanadi:"
        },
        options: {
          ru: [
            "сроком на 5 лет не более двух раз подряд",
            "сроком на 7 лет однократно без права переизбрания",
            "сроком на 6 лет Парламентом РК",
            "сроком на 8 лет"
          ],
          kk: [
            "5 жылға қатарынан екі реттен артық емес",
            "қайта сайлану құқығынсыз 7 жыл мерзімге бір рет",
            "Парламентпен 6 жылға",
            "8 жыл мерзімге"
          ],
          uz: [
            "5 yilga ketma-ket ikki martadan ko‘p bo‘lmagan muddatga",
            "qayta saylanish huquqisiz 7 yil muddatga bir marta",
            "6 yilga Parlament tomonidan",
            "8 yil muddatga"
          ]
        },
        correctIndex: 1,
        rule: {
          ru: "Статья 41 и п. 5 ст. 42 Конституции РК: однократный 7-летний президентский мандат без права переизбрания.",
          kk: "ҚР Конституциясының 42-бабы 5-тармағы: 7 жылға бір реттік мандат.",
          uz: "QR Konstitutsiyasi: qayta saylanish huquqisiz 7 yillik yagona mandat."
        },
        explanation: {
          ru: "По итогам конституционной реформы 2022 года Президент РК избирается на один 7-летний срок без права переизбрания.",
          kk: "2022 жылғы конституциялық реформа бойынша ҚР Президенті 7 жылға бір рет қана сайланады.",
          uz: "2022-yilgi islohotga ko‘ra Prezident 7 yilga bir marta saylanadi."
        }
      }
    ],
    contextTitle: {
      ru: "Контекст НЦТ по Основам права: Трудовые права несовершеннолетних по Трудовому кодексу РК",
      kk: "Құқық негіздерінен ҰТО контексті: ҚР Еңбек кодексі бойынша кәмелетке толмағандардың еңбек құқығы",
      uz: "Huquq asoslari konteksti: Voyaga yetmaganlarning mehnat huquqlari"
    },
    contextBody: {
      ru: "По Трудовому кодексу РК для работников от 14 до 16 лет сокращённая продолжительность рабочего времени составляет не более 24 часов в неделю, а для работников от 16 до 18 лет — не более 36 часов в неделю. Привлекать лиц до 18 лет к ночным и сверхурочным работам запрещено.",
      kk: "ҚР Еңбек кодексі бойынша 14-тен 16 жасқа дейінгі жұмыскерлер үшін жұмыс уақыты аптасына 24 сағаттан, ал 16-дан 18 жасқа дейін — 36 сағаттан аспайды. Түнгі жұмысқа тартуға тыйым салынады.",
      uz: "QR Mehnat kodeksiga ko‘ra 14–16 yoshlilar uchun ish vaqti haftasiga 24 soatdan, 16–18 yoshlilar uchun 36 soatdan oshmaydi."
    },
    matchingPairs: [
      {
        leftA: {
          ru: "А) Элемент нормы права, указывающий условие её применения («Если...»)",
          kk: "А) Құқық нормасының қолданылу шартын көрсететін бөлігі («Егер...»)",
          uz: "A) Huquq normasining qo‘llanilish shartini ko‘rsatuvchi qismi («Agar...»)"
        },
        leftB: {
          ru: "Б) Элемент нормы права, содержащий само правило поведения («То...»)",
          kk: "Б) Мінез-құлық ережесінің өзін қамтитын бөлігі («Онда...»)",
          uz: "B) Xulq-atvor qoidasining o‘zini ифодаловчи qismi («Unda...»)"
        },
        rights: {
          ru: ["1) Гипотеза", "2) Диспозиция", "3) Санкция", "4) Преамбула"],
          kk: ["1) Гипотеза", "2) Диспозиция", "3) Санкция", "4) Преамбула"],
          uz: ["1) Gipoteza", "2) Dispozitsiya", "3) Sanksiya", "4) Preambula"]
        },
        correct: [0, 1],
        explanation: {
          ru: "Классическая триада нормы права: Гипотеза («если», 1) → Диспозиция («то», 2) → Санкция («иначе»). ",
          kk: "Құқық нормасының құрылымы: Гипотеза (1) → Диспозиция (2) → Санкция (3).",
          uz: "Huquq normasi tuzilishi: Gipoteza (1) → Dispozitsiya (2) → Sanksiya (3)."
        }
      }
    ],
    multiPool: [
      {
        prompt: {
          ru: "Выберите ВСЕ верные положения о Парламенте и Конституционном Суде Республики Казахстан:",
          kk: "ҚР Парламенті мен Конституциялық Соты туралы БАРЛЫҚ дұрыс ережелерді таңдаңыз:",
          uz: "QR Parlamenti va Konstitutsiyaviy Sudi haqidagi BARCHA to‘g‘ri qoidalarni tanlang:"
        },
        options: {
          ru: [
            "Парламент РК является высшим представительным органом, осуществляющим законодательную власть",
            "Парламент состоит из двух Палат: Сената и Мажилиса",
            "Конституционный Суд РК состоит из 11 судей (включая Председателя)",
            "Депутатом Сената может быть лицо, достигшее 18 лет",
            "Мажилис состоит из 150 депутатов",
            "Конституционный Суд подчиняется акиматам областей"
          ],
          kk: [
            "ҚР Парламенті — заң шығару билігін жүзеге асыратын жоғары өкілді орган",
            "Парламент екі Палатадан тұрады: Сенат және Мәжіліс",
            "ҚР Конституциялық Соты 11 судьядан тұрады",
            "Сенат депутаты 18 жасқа толған адам бола алады",
            "Мәжіліс 150 депутаттан тұрады",
            "Конституциялық Сот облыс әкімдіктеріне бағынады"
          ],
          uz: [
            "QR Parlamenti qonun chiqaruvchi oliy vakillik organidir",
            "Parlament ikki Palatadan iborat: Senat va Majilis",
            "QR Konstitutsiyaviy Sudi 11 nafar sudyadan iborat",
            "Senat deputati 18 yoshdan saylanadi",
            "Majilis 150 deputatdan iborat",
            "Konstitutsiyaviy Sud hokimliklarga bo‘ysunadi"
          ]
        },
        correctIndices: [0, 1, 2],
        explanation: {
          ru: "Парламент двухпалатный (Сенат — 50 депутатов от 30 лет, Мажилис — 98 депутатов от 25 лет), Конституционный Суд состоит из 11 судей.",
          kk: "Парламент қос палаталы (Сенат және Мәжіліс), Конституциялық Сот 11 судьядан тұрады (A, B, C дұрыс).",
          uz: "A, B, C javoblari QR Konstitutsiyasiga to‘liq mos keladi."
        }
      }
    ]
  },
  english: {
    singlePool: [
      {
        prompt: {
          ru: "Choose the correct Third Conditional form: «If Alikhan ___ harder last month, he ___ maximum points on the UNT exam.»",
          kk: "Third Conditional дұрыс формасын таңдаңыз: «If Alikhan ___ harder last month, he ___ maximum points on the UNT exam.»",
          uz: "Third Conditional to‘g‘ri shaklini tanlang: «If Alikhan ___ harder last month, he ___ maximum points on the UNT exam.»"
        },
        options: {
          ru: [
            "studied / would get",
            "had studied / would have got",
            "studies / will get",
            "would study / had got"
          ],
          kk: [
            "studied / would get",
            "had studied / would have got",
            "studies / will get",
            "would study / had got"
          ],
          uz: [
            "studied / would get",
            "had studied / would have got",
            "studies / will get",
            "would study / had got"
          ]
        },
        correctIndex: 1,
        rule: {
          ru: "Third Conditional (нереальное условие в прошлом): If + Past Perfect (had + V₃), would have + V₃.",
          kk: "Third Conditional формуласы: If + had + V₃, would have + V₃.",
          uz: "Third Conditional formulasi: If + had + V₃, would have + V₃."
        },
        explanation: {
          ru: "Маркер «last month» указывает на прошлое: If he had studied, he would have got.",
          kk: "«last month» өткен шақты білдіреді: had studied / would have got.",
          uz: "«last month» o‘tgan zamonni bildiradi: had studied / would have got."
        }
      }
    ],
    contextTitle: {
      ru: "UNT Reading Context: Artificial Intelligence in Modern Science",
      kk: "ҰБТ Оқу контексті: Artificial Intelligence in Modern Science",
      uz: "UBT O‘qish konteksti: Artificial Intelligence in Modern Science"
    },
    contextBody: {
      ru: "Neuro-symbolic AI combines deterministic mathematical verification with natural language explanations. While standard language models may hallucinate calculations, symbolic verifiers check every step before presenting feedback to learners.",
      kk: "Neuro-symbolic AI combines deterministic mathematical verification with natural language explanations. While standard language models may hallucinate calculations, symbolic verifiers check every step before presenting feedback to learners.",
      uz: "Neuro-symbolic AI combines deterministic mathematical verification with natural language explanations. While standard language models may hallucinate calculations, symbolic verifiers check every step before presenting feedback to learners."
    },
    matchingPairs: [
      {
        leftA: {
          ru: "А) Verb followed by Gerund (V-ing): «She suggested ___ the theorem again.»",
          kk: "А) Gerund (V-ing) талап ететін етістік: «She suggested ___ the theorem again.»",
          uz: "A) Gerund (V-ing) talab qiluvchi fe’l: «She suggested ___ the theorem again.»"
        },
        leftB: {
          ru: "Б) Causative with Bare Infinitive: «The teacher made us ___ the proof.»",
          kk: "Б) Bare Infinitive (to-сыз): «The teacher made us ___ the proof.»",
          uz: "B) Bare Infinitive (to-siz): «The teacher made us ___ the proof.»"
        },
        rights: {
          ru: ["1) reviewing", "2) check", "3) to check", "4) checked"],
          kk: ["1) reviewing", "2) check", "3) to check", "4) checked"],
          uz: ["1) reviewing", "2) check", "3) to check", "4) checked"]
        },
        correct: [0, 1],
        explanation: {
          ru: "После suggest используется герундий reviewing (1); после make в активном залоге — bare infinitive check (2).",
          kk: "suggest + V-ing (1); make sb do sth — to-сыз инфинитив check (2).",
          uz: "suggest + V-ing (1); make sb do sth — check (2)."
        }
      }
    ],
    multiPool: [
      {
        prompt: {
          ru: "Select ALL sentences with grammatically correct Passive Voice or Reported Speech:",
          kk: "Passive Voice немесе Reported Speech грамматикалық тұрғыдан дұрыс қолданылған сөйлемдерді таңдаңыз:",
          uz: "Passive Voice yoki Reported Speech to‘g‘ri qo‘llangan gaplarni tanlang:"
        },
        options: {
          ru: [
            "The new laboratory is being built right now.",
            "Aidar said that he had finished the project the day before.",
            "This theorem was discovered by Euclid.",
            "She asked me where did I live.",
            "The letter has wrote yesterday.",
            "He told to me that he will come."
          ],
          kk: [
            "The new laboratory is being built right now.",
            "Aidar said that he had finished the project the day before.",
            "This theorem was discovered by Euclid.",
            "She asked me where did I live.",
            "The letter has wrote yesterday.",
            "He told to me that he will come."
          ],
          uz: [
            "The new laboratory is being built right now.",
            "Aidar said that he had finished the project the day before.",
            "This theorem was discovered by Euclid.",
            "She asked me where did I live.",
            "The letter has wrote yesterday.",
            "He told to me that he will come."
          ]
        },
        correctIndices: [0, 1, 2],
        explanation: {
          ru: "A (Present Continuous Passive), B (Reported Speech с Past Perfect и the day before) и C (Past Simple Passive) грамматически верны.",
          kk: "A, B және C нұсқалары грамматикалық ережелерге толық сай.",
          uz: "A, B va C variantlari grammatik jihatdan to‘g‘ri."
        }
      }
    ]
  },
  math_lit: {
    singlePool: [
      {
        prompt: {
          ru: "На клетчатой бумаге 1×1 см изображён многоугольник, внутри которого В = 7 узлов сетки, а на границе Г = 8 узлов. Найдите площадь фигуры по формуле Пика.",
          kk: "1×1 см торкөзді қағазда ішінде В = 7 түйін, ал шекарасында Г = 8 түйін бар көпбұрыш бейнеленген. Пик формуласы бойынша ауданын табыңыз.",
          uz: "1×1 sm katakli qog‘ozda ichida B = 7 tugun va chegarasida G = 8 tugun bo‘lgan ko‘pburchak berilgan. Pik formulasi bo‘yicha yuzini toping."
        },
        options: {
          ru: ["11 см²", "10 см²", "15 см²", "9 см²"],
          kk: ["11 см²", "10 см²", "15 см²", "9 см²"],
          uz: ["11 sm²", "10 sm²", "15 sm²", "9 sm²"]
        },
        correctIndex: 1,
        rule: {
          ru: "Формула Пика: S = В + Г/2 − 1.",
          kk: "Пик формуласы: S = В + Г/2 − 1.",
          uz: "Pik formulasi: S = B + G/2 − 1."
        },
        explanation: {
          ru: "S = 7 + 8/2 − 1 = 7 + 4 − 1 = 10 см².",
          kk: "S = 7 + 8/2 − 1 = 10 см².",
          uz: "S = 7 + 8/2 − 1 = 10 sm²."
        }
      }
    ],
    contextTitle: {
      ru: "Контекст НЦТ (Математическая грамотность): Сравнение тарифов доставки",
      kk: "Математикалық сауаттылық контексті: Жеткізу тарифтерін салыстыру",
      uz: "Matematik savodxonlik konteksti: Yetkazib berish tariflarini solishtirish"
    },
    contextBody: {
      ru: "Требуется перевезти груз на расстояние 120 км. Служба «Экспресс» берёт фиксированную подачу 3 000 тг + 250 тг за каждый километр пути. Служба «Логистик» берёт 300 тг за километр без платы за подачу.",
      kk: "Жүкті 120 км қашықтыққа тасымалдау керек. «Экспресс» қызметі 3 000 тг + әр км үшін 250 тг алады. «Логистик» қызметі әр км үшін 300 тг алады.",
      uz: "Yukni 120 km masofaga tashish kerak. «Ekspress» xizmati 3 000 tg + har km uchun 250 tg oladi. «Logistik» har km uchun 300 tg oladi."
    },
    matchingPairs: [
      {
        leftA: {
          ru: "А) Размах числового ряда [4, 7, 7, 10, 17]",
          kk: "А) [4, 7, 7, 10, 17] сандық қатарының өзгеріс ауқымы",
          uz: "A) [4, 7, 7, 10, 17] qatorning o‘zgarish kengligi"
        },
        leftB: {
          ru: "Б) Медиана числового ряда [4, 7, 7, 10, 17]",
          kk: "Б) [4, 7, 7, 10, 17] сандық қатарының медианасы",
          uz: "B) [4, 7, 7, 10, 17] qatorning medianasi"
        },
        rights: {
          ru: ["1) 13", "2) 7", "3) 9", "4) 17"],
          kk: ["1) 13", "2) 7", "3) 9", "4) 17"],
          uz: ["1) 13", "2) 7", "3) 9", "4) 17"]
        },
        correct: [0, 1],
        explanation: {
          ru: "Размах R = 17 − 4 = 13 (1); медиана (середина упорядоченного ряда из 5 чисел) равна 7 (2).",
          kk: "Өзгеріс ауқымы 17 − 4 = 13 (1), медианасы — 7 (2).",
          uz: "O‘zgarish kengligi 17 − 4 = 13 (1), medianasi — 7 (2)."
        }
      }
    ],
    multiPool: [
      {
        prompt: {
          ru: "В шахматном турнире в один круг участвуют 8 гроссмейстеров (каждый играет с каждым по одной партии). Выберите верные утверждения:",
          kk: "Бір айналымдық шахмат турниріне 8 гроссмейстер қатысты. Дұрыс тұжырымдарды таңдаңыз:",
          uz: "Bir davrali shaxmat turnirida 8 nafar grossmeyster qatnashdi. To‘g‘ri mulohazalarni tanlang:"
        },
        options: {
          ru: [
            "Каждый участник сыграл ровно по 7 партий",
            "Всего в турнире было сыграно 28 партий",
            "Общее число партий вычисляется по формуле n(n − 1) / 2",
            "Всего в турнире было сыграно 56 партий",
            "Всего было сыграно 64 партии",
            "Каждый участник сыграл по 8 партий"
          ],
          kk: [
            "Әр қатысушы 7 партиядан ойнады",
            "Турнирде барлығы 28 партия ойналды",
            "Партиялар саны n(n − 1) / 2 формуласымен есептеледі",
            "Барлығы 56 партия ойналды",
            "Барлығы 64 партия ойналды",
            "Әр қатысушы 8 партиядан ойнады"
          ],
          uz: [
            "Har bir ishtirokchi 7 tadan partiya o‘ynadi",
            "Turnirda jami 28 ta partiya o‘ynaldi",
            "Partiyalar soni n(n − 1) / 2 formulasi bilan topiladi",
            "Jami 56 ta partiya o‘ynaldi",
            "Jami 64 ta partiya o‘ynaldi",
            "Har bir ishtirokchi 8 tadan partiya o‘ynadi"
          ]
        },
        correctIndices: [0, 1, 2],
        explanation: {
          ru: "Каждый из 8 игроков играет с 7 соперниками, всего партий 8·7 / 2 = 28.",
          kk: "8·7 / 2 = 28 партия (A, B, C дұрыс).",
          uz: "8·7 / 2 = 28 ta partiya (A, B, C to‘g‘ri)."
        }
      }
    ]
  },
  reading_lit: {
    singlePool: [
      {
        prompt: {
          ru: "Какой тип речи представлен во фрагменте, где автор сначала выдвигает тезис, затем приводит два научных доказательства и формулирует вывод «Следовательно...»?",
          kk: "Автор алдымен тезис ұсынып, екі ғылыми дәлел келтіретін және «Демек...» деп қорытынды шығаратын мәтін үзіндісі сөйлеудің қай типіне жатады?",
          uz: "Muallif avval tezis keltirib, ikki dalil va «Demak...» xulosasini chiqaradigan matn parchasi nutqning qaysi turiga kiradi?"
        },
        options: {
          ru: ["Описание", "Рассуждение", "Повествование", "Диалог"],
          kk: ["Сипаттау", "Пайымдау", "Баяндау", "Диалог"],
          uz: ["Tasvir", "Muhokama", "Hikoya", "Dialog"]
        },
        correctIndex: 1,
        rule: {
          ru: "Структура «Тезис → Аргументы → Вывод» является определяющим признаком рассуждения.",
          kk: "«Тезис → Дәлелдер → Қорытынды» құрылымы пайымдау мәтініне тән.",
          uz: "«Tezis → Dalillar → Xulosa» tuzilishi muhokama nutqiga xos."
        },
        explanation: {
          ru: "Рассуждение объясняет причинно-следственные связи и доказывает выдвинутый тезис.",
          kk: "Пайымдау себеп-салдарлық байланысты дәлелдейді.",
          uz: "Muhokama sabab-oqibat bog‘lanishini isbotlaydi."
        }
      }
    ],
    contextTitle: {
      ru: "Контекст НЦТ (Грамотность чтения): Экология Аральского моря и проект САРАТС",
      kk: "Оқу сауаттылығы контексті: Арал теңізінің экологиясы және САРАТС жобасы",
      uz: "O‘qish savodxonligi konteksti: Orol dengizi ekologiyasi"
    },
    contextBody: {
      ru: "Постройка Кокаральской плотины в 2005 году позволила сохранить Северное (Малое) Аральское море: уровень воды поднялся до 42 метров по Балтийской системе, солёность снизилась более чем вдвое, что позволило восстановить промысел свыше 20 видов рыб.",
      kk: "2005 жылы Көкарал бөгетінің салынуы Кіші Арал теңізін сақтап қалды: су деңгейі 42 метрге көтеріліп, тұздылығы екі еседен астам төмендеді және 20-дан астам балық түрі қалпына келді.",
      uz: "2005-yilda Ko‘korol to‘g‘onining qurilishi Kichik Orol dengizini saqlab qoldi: suv sathi 42 metrga ko‘tarilib, sho‘rlanish ikki barobar kamaydi."
    },
    matchingPairs: [
      {
        leftA: {
          ru: "А) Научный стиль речи",
          kk: "А) Ғылыми стиль",
          uz: "A) Ilmiy uslub"
        },
        leftB: {
          ru: "Б) Официально-деловой стиль речи",
          kk: "Б) Ресми іс-қағаздар стилі",
          uz: "B) Rasmiy-idoraviy uslub"
        },
        rights: {
          ru: [
            "1) Объективность, терминологическая точность, доказательность",
            "2) Стандартизированность реквизитов, императивность (закон, указ, договор)",
            "3) Эмоциональная образность и метафоры",
            "4) Свободная разговорная лексика"
          ],
          kk: [
            "1) Объективтілік, терминдер дәлдігі, дәлелділік",
            "2) Стандартты деректемелер, міндеттілік (заң, жарғы, шарт)",
            "3) Эмоционалды бейнелілік",
            "4) Еркін ауызекі лексика"
          ],
          uz: [
            "1) Obyektivlik, atamalar aniqligi, isbotlilik",
            "2) Standart rekvizitlar, majburiylik (qonun, shartnoma)",
            "3) Emotsional obrazlilik",
            "4) Erkin so‘zlashuv leksikasi"
          ]
        },
        correct: [0, 1],
        explanation: {
          ru: "Научный стиль опирается на термины и доказательства (1), официально-деловой — на правовые стандарты и предписания (2).",
          kk: "Ғылыми стиль — терминдер мен дәлелдер (1), ресми стиль — құқықтық стандарттар (2).",
          uz: "Ilmiy uslub — atamalar (1), rasmiy uslub — huquqiy standartlar (2)."
        }
      }
    ],
    multiPool: [
      {
        prompt: {
          ru: "Какие суждения ТОЧНО соответствуют приведённому тексту о Кокаральской плотине и Малом Арале?",
          kk: "Көкарал бөгеті мен Кіші Арал туралы мәтінге ДӘЛ сәйкес келетін тұжырымдарды таңдаңыз:",
          uz: "Ko‘korol to‘g‘oni haqidagi matnga MOS keladigan fikrlarni tanlang:"
        },
        options: {
          ru: [
            "Кокаральская плотина была построена в 2005 году",
            "Солёность воды в Северном Арале снизилась более чем в два раза",
            "В Малом Арале восстановился промысел более 20 видов рыб",
            "Солёность воды в море полностью исчезла (вода стала дистиллированной)",
            "Плотина была разрушена в 2005 году",
            "В море обитает только один вид рыб"
          ],
          kk: [
            "Көкарал бөгеті 2005 жылы салынды",
            "Солтүстік Аралдағы судың тұздылығы екі еседен астам төмендеді",
            "Кіші Аралда 20-дан астам балық түрінің кәсіпшілігі қалпына келді",
            "Су мүлдем тұщы дистиллятқа айналды",
            "Бөгет 2005 жылы бұзылды",
            "Теңізде тек бір ғана балық түрі тіршілік етеді"
          ],
          uz: [
            "Ko‘korol to‘g‘oni 2005-yilda qurilgan",
            "Shimoliy Orolda suv sho‘rlanishi ikki barobardan ko‘proq kamaydi",
            "Kichik Orolda 20 dan ortiq baliq turi tiklandi",
            "Suv mutlaqo chuchuk bo‘lib qoldi",
            "To‘g‘on 2005-yilda buzilgan",
            "Dengizda faqat bitta baliq turi bor"
          ]
        },
        correctIndices: [0, 1, 2],
        explanation: {
          ru: "Утверждения A, B и C прямо подтверждаются фактами из текста, а D, E, F содержат логические искажения.",
          kk: "A, B және C тұжырымдары мәтін деректеріне толық сәйкес келеді.",
          uz: "A, B va C fikrlari matnga to‘liq mos keladi."
        }
      }
    ]
  }
};

function generateSubjectSpecific40Variant(
  subjectId: Exclude<UntSubjectId, "math">,
  v: number
): UntQuestion[] {
  const spec = UNT_SUBJECTS.find((s) => s.id === subjectId)!;
  const bank = SUBJECT_BANKS[subjectId];
  const questions: UntQuestion[] = [];

  // Q1..Q25: 25 Single-choice questions (1 pt each)
  for (let order = 1; order <= 25; order++) {
    const baseItem = bank.singlePool[(order + v - 2) % bank.singlePool.length];
    const secRu = spec.sections.ru[(order + v) % spec.sections.ru.length];
    const secKk = spec.sections.kk[(order + v) % spec.sections.kk.length];
    const secUz = spec.sections.uz[(order + v) % spec.sections.uz.length];

    const prefix =
      order <= bank.singlePool.length
        ? { ru: "", kk: "", uz: "" }
        : {
            ru: `[Раздел: ${secRu} · Вариант #${v}] `,
            kk: `[Бөлім: ${secKk} · Нұсқа #${v}] `,
            uz: `[Bo‘lim: ${secUz} · Variant #${v}] `
          };

    questions.push({
      id: `${subjectId}-v${v}-q${order}`,
      order,
      format: "single",
      subtest: "profile_math",
      untNumberRange: `Вариант #${v} · №${order}`,
      topic: TOPIC_CYCLE[(order + v) % TOPIC_CYCLE.length],
      maxPoints: 1,
      prompt: {
        ru: `${prefix.ru}${baseItem.prompt.ru}`,
        kk: `${prefix.kk}${baseItem.prompt.kk}`,
        uz: `${prefix.uz}${baseItem.prompt.uz}`
      },
      options: {
        ru: [...baseItem.options.ru],
        kk: [...baseItem.options.kk],
        uz: [...baseItem.options.uz]
      },
      correctIndex: baseItem.correctIndex,
      rule: baseItem.rule,
      explanation: baseItem.explanation,
      trap: {
        ru: "Внимательно сверяйте единицы измерения, даты и формулировку условия по стандарту НЦТ РК.",
        kk: "ҚР ҰТО стандарты бойынша шартты және өлшем бірліктерін мұқият тексеріңіз.",
        uz: "Shart va o‘lchov birliklarini diqqat bilan tekshiring."
      },
      labSeed: (v + order) % 24
    });
  }

  // Q26..Q30: 5 Context questions (1 pt each)
  for (let idx = 0; idx < 5; idx++) {
    const order = 26 + idx;
    const baseItem = bank.singlePool[idx % bank.singlePool.length];
    questions.push({
      id: `${subjectId}-v${v}-q${order}`,
      order,
      format: "context",
      subtest: "profile_math",
      untNumberRange: `Вариант #${v} · №${order} (Контекст)`,
      topic: TOPIC_CYCLE[(order + v) % TOPIC_CYCLE.length],
      maxPoints: 1,
      contextId: `${subjectId}-ctx-v${v}`,
      contextTitle: bank.contextTitle,
      contextBody: bank.contextBody,
      prompt: {
        ru: `${order}. По данным контекста и программы НЦТ РК: ${baseItem.prompt.ru}`,
        kk: `${order}. Контекст және ҰТО бағдарламасы бойынша: ${baseItem.prompt.kk}`,
        uz: `${order}. Kontekst ma’lumotlari bo‘yicha: ${baseItem.prompt.uz}`
      },
      options: {
        ru: [...baseItem.options.ru],
        kk: [...baseItem.options.kk],
        uz: [...baseItem.options.uz]
      },
      correctIndex: baseItem.correctIndex,
      rule: baseItem.rule,
      explanation: baseItem.explanation,
      trap: {
        ru: "Контекстное задание проверяет умение связывать данные текста с базовым законом предмета.",
        kk: "Контекстік тапсырма мәтін деректерін пән заңдылығымен байланыстыруды тексереді.",
        uz: "Kontekstli topshiriq matn ma’lumotlarini qonuniyat bilan bog‘lashni tekshiradi."
      },
      labSeed: (v + order) % 24
    });
  }

  // Q31..Q35: 5 Matching questions (2 pts each = 10 pts)
  for (let idx = 0; idx < 5; idx++) {
    const order = 31 + idx;
    const mItem = bank.matchingPairs[idx % bank.matchingPairs.length];
    questions.push({
      id: `${subjectId}-v${v}-q${order}`,
      order,
      format: "matching",
      subtest: "profile_math",
      untNumberRange: `Вариант #${v} · №${order} (2 балла)`,
      topic: TOPIC_CYCLE[(order + v) % TOPIC_CYCLE.length],
      maxPoints: 2,
      prompt: {
        ru: `Задание №${order} (Вариант #${v}): установите точное соответствие между элементами А, Б и вариантами 1–4:`,
        kk: `№${order} тапсырма (Нұсқа #${v}): А, Б элементтері мен 1–4 нұсқалары арасындағы сәйкестікті орнатыңыз:`,
        uz: `№${order}-topshiriq (Variant #${v}): A, B elementlari va 1–4 variantlar mosligini aniqlang:`
      },
      leftItems: {
        ru: [mItem.leftA.ru, mItem.leftB.ru],
        kk: [mItem.leftA.kk, mItem.leftB.kk],
        uz: [mItem.leftA.uz, mItem.leftB.uz]
      },
      rightOptions: {
        ru: [...mItem.rights.ru],
        kk: [...mItem.rights.kk],
        uz: [...mItem.rights.uz]
      },
      correctPairs: mItem.correct,
      rule: {
        ru: "Двухбалльное задание НЦТ на установление соответствия (1 верная пара = 1 балл, обе = 2 балла).",
        kk: "ҰТО 2 балдық сәйкестендіру тапсырмасы (1 жұп = 1 балл, екеуі = 2 балл).",
        uz: "2 balli moslashtirish topshirig‘i (1 juft = 1 ball, ikkalasi = 2 ball)."
      },
      explanation: mItem.explanation,
      trap: {
        ru: "Проверяйте каждое соответствие отдельно, чтобы не потерять частичный балл.",
        kk: "Ішінара балл жоғалтпау үшін әр жұпты жеке тексеріңіз.",
        uz: "Har bir juftlikni alohida tekshiring."
      },
      labSeed: (v + order) % 24
    });
  }

  // Q36..Q40: 5 Multiple-choice questions (2 pts each = 10 pts)
  for (let idx = 0; idx < 5; idx++) {
    const order = 36 + idx;
    const mulItem = bank.multiPool[idx % bank.multiPool.length];
    questions.push({
      id: `${subjectId}-v${v}-q${order}`,
      order,
      format: "multiple",
      subtest: "profile_math",
      untNumberRange: `Вариант #${v} · №${order} (2 балла)`,
      topic: TOPIC_CYCLE[(order + v) % TOPIC_CYCLE.length],
      maxPoints: 2,
      prompt: {
        ru: `Задание №${order} (Вариант #${v}): ${mulItem.prompt.ru}`,
        kk: `№${order} тапсырма (Нұсқа #${v}): ${mulItem.prompt.kk}`,
        uz: `№${order}-topshiriq (Variant #${v}): ${mulItem.prompt.uz}`
      },
      options: {
        ru: [...mulItem.options.ru],
        kk: [...mulItem.options.kk],
        uz: [...mulItem.options.uz]
      },
      correctIndices: [...mulItem.correctIndices],
      rule: {
        ru: "Множественный выбор НЦТ РК (от 1 до 3 верных ответов из 6): без ошибок — 2 балла, 1 ошибка — 1 балл.",
        kk: "ҰТО көп таңдаулы тапсырмасы (6-дан 1–3 дұрыс жауап): қатесіз — 2 балл, 1 қате — 1 балл.",
        uz: "Ko‘p tanlovli topshiriq (6 tadan 1–3 to‘g‘ri javob): xatosiz — 2 ball, 1 xato — 1 ball."
      },
      explanation: mulItem.explanation,
      trap: {
        ru: "Не выбирайте более 3 вариантов — по регламенту НЦТ в заданиях №36–40 не более 3 правильных ответов.",
        kk: "3 нұсқадан артық таңдамаңыз — №36–40 тапсырмаларында ең көбі 3 дұрыс жауап болады.",
        uz: "3 tadan ortiq variant tanlamang."
      },
      labSeed: (v + order) % 24
    });
  }

  return questions;
}

export function getUntSubjectMeta(subjectId: UntSubjectId): UntSubjectSpec {
  return UNT_SUBJECTS.find((s) => s.id === subjectId) ?? UNT_SUBJECTS[0];
}

