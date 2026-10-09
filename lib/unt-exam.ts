import { z } from "zod";
import { languages, topicIds, type Language, type TopicId } from "./curriculum.ts";

export type UntQuestionFormat = "single" | "context" | "matching" | "multiple";
export type UntSubtest = "math_literacy" | "profile_math";

export type LocalizedText = Record<Language, string>;
export type LocalizedList = Record<Language, string[]>;

export type UntSingleQuestion = {
  id: string;
  order: number;
  format: "single";
  subtest: UntSubtest;
  untNumberRange: string;
  topic: TopicId;
  maxPoints: 1;
  prompt: LocalizedText;
  options: LocalizedList;
  correctIndex: number;
  rule: LocalizedText;
  explanation: LocalizedText;
  trap: LocalizedText;
  labSeed: number;
};

export type UntContextQuestion = {
  id: string;
  order: number;
  format: "context";
  subtest: UntSubtest;
  untNumberRange: string;
  topic: TopicId;
  maxPoints: 1;
  contextId: string;
  contextTitle: LocalizedText;
  contextBody: LocalizedText;
  prompt: LocalizedText;
  options: LocalizedList;
  correctIndex: number;
  rule: LocalizedText;
  explanation: LocalizedText;
  trap: LocalizedText;
  labSeed: number;
};

export type UntMatchingQuestion = {
  id: string;
  order: number;
  format: "matching";
  subtest: UntSubtest;
  untNumberRange: string;
  topic: TopicId;
  maxPoints: 2;
  prompt: LocalizedText;
  leftItems: Record<Language, [string, string]>;
  rightOptions: LocalizedList;
  correctPairs: [number, number];
  rule: LocalizedText;
  explanation: LocalizedText;
  trap: LocalizedText;
  labSeed: number;
};

export type UntMultipleQuestion = {
  id: string;
  order: number;
  format: "multiple";
  subtest: UntSubtest;
  untNumberRange: string;
  topic: TopicId;
  maxPoints: 2;
  prompt: LocalizedText;
  options: LocalizedList;
  correctIndices: number[];
  rule: LocalizedText;
  explanation: LocalizedText;
  trap: LocalizedText;
  labSeed: number;
};

export type UntQuestion =
  | UntSingleQuestion
  | UntContextQuestion
  | UntMatchingQuestion
  | UntMultipleQuestion;

export type UntUserAnswer =
  | { format: "single" | "context"; selectedIndex: number | null }
  | { format: "matching"; pairs: [number | null, number | null] }
  | { format: "multiple"; selectedIndices: number[] };

export type UntQuestionScore = {
  questionId: string;
  topic: TopicId;
  format: UntQuestionFormat;
  earned: 0 | 1 | 2;
  max: 1 | 2;
  status: "full" | "partial" | "zero" | "unanswered";
};

export type TopicExamStat = {
  topic: TopicId;
  earned: number;
  max: number;
  ratio: number;
  questionCount: number;
  answeredCount: number;
  unansweredCount: number;
  answeredWrongCount: number;
  partialCount: number;
  zeroCount: number;
};

export type UntExamEvaluation = {
  earnedPoints: number;
  maxPoints: number;
  scaledScore50: number;
  scaledScore60: number;
  answeredCount: number;
  unansweredCount: number;
  answeredWrongCount: number;
  totalQuestions: number;
  isComplete: boolean;
  partialTwoPointCount: number;
  byFormat: Record<UntQuestionFormat, { earned: number; max: number }>;
  byTopic: Record<TopicId, TopicExamStat>;
  questionScores: Record<string, UntQuestionScore>;
  weakTopics: TopicId[];
  verifiedWeakTopics: TopicId[];
  unansweredTopics: TopicId[];
  strongTopics: TopicId[];
};

export const UNT_OFFICIAL_SPEC = {
  mathLiteracy: {
    questions: 10,
    maxPoints: 10,
    threshold: 3,
    formats: "№1–10: 1 правильный ответ из 4 (по 1 баллу)"
  },
  profileMath: {
    questions: 40,
    maxPoints: 50,
    threshold: 5,
    blocks: [
      { range: "№1–25", count: 25, pointsEach: 1, totalPoints: 25, type: "single" as const },
      { range: "№26–30", count: 5, pointsEach: 1, totalPoints: 5, type: "context" as const },
      { range: "№31–35", count: 5, pointsEach: 2, totalPoints: 10, type: "matching" as const },
      { range: "№36–40", count: 5, pointsEach: 2, totalPoints: 10, type: "multiple" as const }
    ]
  }
} as const;

export const untQuestions: UntQuestion[] = [
  {
    id: "unt-q1-linear",
    order: 1,
    format: "single",
    subtest: "profile_math",
    untNumberRange: "№1–25",
    topic: "linear",
    maxPoints: 1,
    prompt: {
      ru: "Решите систему уравнений { 3x − 2y = 11; 4x + 5y = 7 } и найдите значение выражения x₀ + y₀.",
      kk: "{ 3x − 2y = 11; 4x + 5y = 7 } теңдеулер жүйесін шешіп, x₀ + y₀ өрнегінің мәнін табыңыз.",
      uz: "{ 3x − 2y = 11; 4x + 5y = 7 } tenglamalar sistemasini yeching va x₀ + y₀ ifodaning qiymatini toping."
    },
    options: {
      ru: ["1", "2", "3", "4"],
      kk: ["1", "2", "3", "4"],
      uz: ["1", "2", "3", "4"]
    },
    correctIndex: 1,
    rule: {
      ru: "Метод алгебраического сложения: умножаем уравнения так, чтобы коэффициенты при одной переменной стали противоположными.",
      kk: "Алгебралық қосу тәсілі: бір айнымалының коэффициенттері қарама-қарсы болатындай етіп көбейтеміз.",
      uz: "Algebraik qo‘shish usuli: bitta o‘zgaruvchi oldidagi koeffitsiyentlar qarama-qarshi bo‘lishi uchun ko‘paytiramiz."
    },
    explanation: {
      ru: "Умножим первое уравнение на 5, второе на 2: (15x − 10y) + (8x + 10y) = 55 + 14 ⇒ 23x = 69 ⇒ x₀ = 3. Подставим x₀ = 3: 9 − 2y = 11 ⇒ y₀ = −1. Тогда x₀ + y₀ = 3 + (−1) = 2.",
      kk: "Бірінші теңдеуді 5-ке, екіншісін 2-ге көбейтеміз: 23x = 69 ⇒ x₀ = 3. Онда 9 − 2y = 11 ⇒ y₀ = −1. Сонда x₀ + y₀ = 3 + (−1) = 2.",
      uz: "Birinchi tenglamani 5 ga, ikkinchisini 2 ga ko‘paytiramiz: 23x = 69 ⇒ x₀ = 3. U holda 9 − 2y = 11 ⇒ y₀ = −1. Demak, x₀ + y₀ = 3 + (−1) = 2."
    },
    trap: {
      ru: "Частая ошибка — получить y₀ = 1 вместо y₀ = −1 при переносе 9 в правую часть (11 − 9 = 2, делим на −2) и выбрать ответ 4.",
      kk: "Жиі қате: −2y = 2 теңдеуінде таңбаны жоғалтып, y₀ = 1 деп алып, 3 + 1 = 4 жауабын таңдау.",
      uz: "Tipik xato: −2y = 2 tenglamada manfiy ishorani yo‘qotib, y₀ = 1 deb olish va 4 javobini belgilash."
    },
    labSeed: 0
  },
  {
    id: "unt-q2-percent",
    order: 2,
    format: "single",
    subtest: "math_literacy",
    untNumberRange: "Мат. грам. №1–10",
    topic: "percent",
    maxPoints: 1,
    prompt: {
      ru: "Первый сплав содержит 15% меди, а второй — 35% меди. Сколько килограммов первого сплава нужно сплавить со вторым, чтобы получить 160 кг сплава с содержанием меди 27,5%?",
      kk: "Бірінші қорытпада 15% мыс, ал екіншісінде 35% мыс бар. Құрамында 27,5% мыс болатын 160 кг жаңа қорытпа алу үшін бірінші қорытпадан неше килограмм алу керек?",
      uz: "Birinchi qotishmada 15% mis, ikkinchisida esa 35% mis bor. Tarkibida 27,5% mis bo‘lgan 160 kg yangi qotishma olish uchun birinchi qotishmadan necha kilogramm kerak bo‘ladi?"
    },
    options: {
      ru: ["50 кг", "60 кг", "80 кг", "100 кг"],
      kk: ["50 кг", "60 кг", "80 кг", "100 кг"],
      uz: ["50 kg", "60 kg", "80 kg", "100 kg"]
    },
    correctIndex: 1,
    rule: {
      ru: "Масса чистого вещества в смеси равна сумме масс вещества в исходных компонентах: 0,15x + 0,35(160 − x) = 0,275 × 160.",
      kk: "Қоспадағы таза заттың массасы бастапқы бөліктердегі зат массаларының қосындысына тең: 0,15x + 0,35(160 − x) = 0,275 × 160.",
      uz: "Aralashmadagi sof modda massasi dastlabki qismlar massalari yig‘indisiga teng: 0,15x + 0,35(160 − x) = 0,275 × 160."
    },
    explanation: {
      ru: "Масса меди в 160 кг сплава: 160 × 0,275 = 44 кг. Уравнение: 0,15x + 56 − 0,35x = 44 ⇒ 0,2x = 12 ⇒ x = 60 кг.",
      kk: "160 кг қорытпадағы мыс массасы: 160 × 0,275 = 44 кг. Теңдеу: 0,15x + 56 − 0,35x = 44 ⇒ 0,2x = 12 ⇒ x = 60 кг.",
      uz: "160 kg qotishmadagi mis massasi: 160 × 0,275 = 44 kg. Tenglama: 0,15x + 56 − 0,35x = 44 ⇒ 0,2x = 12 ⇒ x = 60 kg."
    },
    trap: {
      ru: "Ловушка ЕНТ: найти массу второго сплава (160 − 60 = 100 кг) и отметить вариант D вместо первого сплава.",
      kk: "ҰБТ тұзағы: бірінші қорытпаның орнына екінші қорытпаның массасын (100 кг) белгілеп қою.",
      uz: "Imtihon tuzog‘i: birinchi qotishma o‘rniga ikkinchi qotishma massasini (100 kg) tanlash."
    },
    labSeed: 1
  },
  {
    id: "unt-q3-probability",
    order: 3,
    format: "single",
    subtest: "math_literacy",
    untNumberRange: "Мат. грам. №1–10",
    topic: "probability",
    maxPoints: 1,
    prompt: {
      ru: "В корзине лежат 5 белых и 4 чёрных шара. Наудачу одновременно достают 2 шара. Какова вероятность того, что вынутые шары окажутся разного цвета?",
      kk: "Себетте 5 ақ және 4 қара шар бар. Кездейсоқ бір мезгілде 2 шар алынды. Алынған шарлардың түстері әртүрлі болу ықтималдығы қандай?",
      uz: "Savatda 5 ta oq va 4 ta qora shar bor. Tasodifiy ravishda bir vaqtda 2 ta shar olindi. Olingan sharlar har xil rangda bo‘lish ehtimolligi qanday?"
    },
    options: {
      ru: ["4/9", "5/9", "5/18", "20/81"],
      kk: ["4/9", "5/9", "5/18", "20/81"],
      uz: ["4/9", "5/9", "5/18", "20/81"]
    },
    correctIndex: 1,
    rule: {
      ru: "При одновременном выборе 2 шаров без возвращения общее число пар C(9,2) = 36, благоприятных пар (1 белый и 1 чёрный) — 5 × 4 = 20.",
      kk: "Қайтарусыз 2 шар таңдағанда барлық жұптар саны C(9,2) = 36, қолайлы жұптар саны — 5 × 4 = 20.",
      uz: "Qaytarishsiz 2 ta shar tanlanganda barcha juftliklar soni C(9,2) = 36, qulay juftliklar soni — 5 × 4 = 20."
    },
    explanation: {
      ru: "Всего способов выбрать 2 шара из 9: n = (9 × 8) / 2 = 36. Выбрать 1 белый из 5 и 1 чёрный из 4 можно m = 5 × 4 = 20 способами. P = 20 / 36 = 5/9.",
      kk: "9 шардан 2 шар таңдау тәсілі: n = (9 × 8) / 2 = 36. 1 ақ және 1 қара шар таңдау: m = 5 × 4 = 20. P = 20 / 36 = 5/9.",
      uz: "9 tadan 2 ta sharni tanlash: n = (9 × 8) / 2 = 36. 1 ta oq va 1 ta qora sharni tanlash: m = 5 × 4 = 20. P = 20 / 36 = 5/9."
    },
    trap: {
      ru: "Частая ошибка — забыть удвоить порядок или считать выбор с возвращением (5/9 × 4/9 = 20/81).",
      kk: "Жиі қате: шарлар қайтарылмайтынын ескермей 20/81 деп есептеу немесе 2-ге бөліп 5/18 алу.",
      uz: "Ko‘p uchraydigan xato: sharlar qaytarilmasligini unutib 20/81 yoki 5/18 deb hisoblash."
    },
    labSeed: 2
  },
  {
    id: "unt-q4-planimetry",
    order: 4,
    format: "single",
    subtest: "profile_math",
    untNumberRange: "№1–25",
    topic: "planimetry",
    maxPoints: 1,
    prompt: {
      ru: "В равнобедренную трапецию с основаниями 8 см и 18 см вписана окружность. Найдите площадь этой трапеции.",
      kk: "Табандары 8 см және 18 см болатын теңбүйірлі трапецияға шеңбер іштей сызылған. Осы трапецияның ауданын табыңыз.",
      uz: "Asoslari 8 sm va 18 sm bo‘lgan teng yonli trapetsiyaga aylana ichki chizilgan. Shu trapetsiyaning yuzasini toping."
    },
    options: {
      ru: ["144 см²", "156 см²", "169 см²", "130 см²"],
      kk: ["144 см²", "156 см²", "169 см²", "130 см²"],
      uz: ["144 sm²", "156 sm²", "169 sm²", "130 sm²"]
    },
    correctIndex: 1,
    rule: {
      ru: "В описанной равнобедренной трапеции боковая сторона c = (a + b)/2, а высота h = √(a·b). Площадь S = ((a + b)/2) × h.",
      kk: "Шеңбер іштей сызылған теңбүйірлі трапецияның бүйір қабырғасы c = (a + b)/2, биіктігі h = √(a·b). Ауданы S = ((a + b)/2) × h.",
      uz: "Aylana ichki chizilgan teng yonli trapetsiyaning yon tomoni c = (a + b)/2, balandligi h = √(a·b). Yuzasi S = ((a + b)/2) × h."
    },
    explanation: {
      ru: "Полусумма оснований (средняя линия) равна (8 + 18)/2 = 13 см. Высота h = √(8 × 18) = √144 = 12 см. Площадь S = 13 × 12 = 156 см².",
      kk: "Орта сызығы (8 + 18)/2 = 13 см. Биіктігі h = √(8 × 18) = 12 см. Ауданы S = 13 × 12 = 156 см².",
      uz: "O‘rta chizig‘i (8 + 18)/2 = 13 sm. Balandligi h = √(8 × 18) = 12 sm. Yuzasi S = 13 × 12 = 156 sm²."
    },
    trap: {
      ru: "Ловушка: умножить среднюю линию 13 см на боковую сторону 13 см (получив 169 см²) вместо высоты 12 см.",
      kk: "Тұзақ: орта сызықты (13 см) биіктікке (12 см) емес, бүйір қабырғаға (13 см) көбейтіп 169 см² алу.",
      uz: "Tuzoq: o‘rta chiziqni (13 sm) balandlik (12 sm) o‘rniga yon tomonga (13 sm) ko‘paytirib 169 sm² olish."
    },
    labSeed: 3
  },
  {
    id: "unt-q5-derivative",
    order: 5,
    format: "single",
    subtest: "profile_math",
    untNumberRange: "№1–25",
    topic: "derivative",
    maxPoints: 1,
    prompt: {
      ru: "Составьте уравнение касательной к графику функции y = x³ − 2x² + 3 в точке с абсциссой x₀ = 2.",
      kk: "y = x³ − 2x² + 3 функциясының графигіне x₀ = 2 абсциссалы нүктесінде жүргізілген жанаманың теңдеуін жазыңыз.",
      uz: "y = x³ − 2x² + 3 funksiya grafigiga x₀ = 2 abssissali nuqtada o‘tkazilgan urinma tenglamasini tuzing."
    },
    options: {
      ru: ["y = 4x − 5", "y = 4x + 5", "y = 2x − 1", "y = 4x − 8"],
      kk: ["y = 4x − 5", "y = 4x + 5", "y = 2x − 1", "y = 4x − 8"],
      uz: ["y = 4x − 5", "y = 4x + 5", "y = 2x − 1", "y = 4x − 8"]
    },
    correctIndex: 0,
    rule: {
      ru: "Уравнение касательной: y = f(x₀) + f′(x₀)(x − x₀).",
      kk: "Жанама теңдеуі: y = f(x₀) + f′(x₀)(x − x₀).",
      uz: "Urinma tenglamasi: y = f(x₀) + f′(x₀)(x − x₀)."
    },
    explanation: {
      ru: "1) f(2) = 8 − 8 + 3 = 3. 2) f′(x) = 3x² − 4x ⇒ f′(2) = 12 − 8 = 4. 3) y = 3 + 4(x − 2) = 4x − 5.",
      kk: "1) f(2) = 8 − 8 + 3 = 3. 2) f′(x) = 3x² − 4x ⇒ f′(2) = 12 − 8 = 4. 3) y = 3 + 4(x − 2) = 4x − 5.",
      uz: "1) f(2) = 8 − 8 + 3 = 3. 2) f′(x) = 3x² − 4x ⇒ f′(2) = 12 − 8 = 4. 3) y = 3 + 4(x − 2) = 4x − 5."
    },
    trap: {
      ru: "Забыть прибавить f(2) = 3 и записать y = 4(x − 2) = 4x − 8.",
      kk: "f(2) = 3 мәнін қосуды ұмытып, y = 4(x − 2) = 4x − 8 нұсқасын таңдау.",
      uz: "f(2) = 3 qiymatini qo‘shishni unutib, y = 4(x − 2) = 4x − 8 javobini tanlash."
    },
    labSeed: 4
  },
  {
    id: "unt-q6-context-progressions",
    order: 6,
    format: "context",
    subtest: "profile_math",
    untNumberRange: "№26–30 (Контекст)",
    topic: "progressions",
    maxPoints: 1,
    contextId: "amphitheater",
    contextTitle: {
      ru: "Контекст: Летний амфитеатр",
      kk: "Контекст: Жазғы амфитеатр",
      uz: "Kontekst: Yozgi amfiteatr"
    },
    contextBody: {
      ru: "В городском парке построили летний амфитеатр. В первом ряду установлено a₁ = 18 кресел, а в каждом следующем ряду — на d = 4 кресла больше, чем в предыдущем. Всего в зрительном зале n рядов.",
      kk: "Қалалық саябақта жазғы амфитеатр салынды. Бірінші қатарда a₁ = 18 орындық орнатылған, ал әрбір келесі қатарда алдыңғыға қарағанда d = 4 орындыққа артық. Залда барлығы n қатар бар.",
      uz: "Shahar bog‘ida yozgi amfiteatr qurildi. Birinchi qatorda a₁ = 18 ta o‘rindiq o‘rnatilgan, har bir keyingi qatorda esa oldingisidan d = 4 ta o‘rindiq ko‘p. Zalda jami n ta qator bor."
    },
    prompt: {
      ru: "Сколько кресел установлено в 12-м ряду амфитеатра (a₁₂)?",
      kk: "Амфитеатрдың 12-ші қатарында (a₁₂) неше орындық орнатылған?",
      uz: "Amfiteatrning 12-qatorida (a₁₂) nechta o‘rindiq o‘rnatilgan?"
    },
    options: {
      ru: ["58", "62", "66", "60"],
      kk: ["58", "62", "66", "60"],
      uz: ["58", "62", "66", "60"]
    },
    correctIndex: 1,
    rule: {
      ru: "Формула n-го члена арифметической прогрессии: aₙ = a₁ + (n − 1)d.",
      kk: "Арифметикалық прогрессияның n-ші мүшесінің формуласы: aₙ = a₁ + (n − 1)d.",
      uz: "Arifmetik progressiyaning n-hadi formulasi: aₙ = a₁ + (n − 1)d."
    },
    explanation: {
      ru: "До 12-го ряда ровно 11 шагов по 4 кресла: a₁₂ = 18 + (12 − 1) × 4 = 18 + 44 = 62.",
      kk: "12-ші қатарға дейін 11 қадам бар: a₁₂ = 18 + (12 − 1) × 4 = 18 + 44 = 62.",
      uz: "12-qatorgacha 11 ta qadam bor: a₁₂ = 18 + (12 − 1) × 4 = 18 + 44 = 62."
    },
    trap: {
      ru: "Умножить разность 4 на 12 вместо 11 и получить 18 + 48 = 66.",
      kk: "4 айырымын 11-дің орнына 12-ге көбейтіп, 18 + 48 = 66 алу.",
      uz: "4 ayirmani 11 o‘rniga 12 ga ko‘paytirib, 18 + 48 = 66 olish."
    },
    labSeed: 5
  },
  {
    id: "unt-q7-context-quadratic",
    order: 7,
    format: "context",
    subtest: "profile_math",
    untNumberRange: "№26–30 (Контекст)",
    topic: "quadratic",
    maxPoints: 1,
    contextId: "amphitheater",
    contextTitle: {
      ru: "Контекст: Летний амфитеатр",
      kk: "Контекст: Жазғы амфитеатр",
      uz: "Kontekst: Yozgi amfiteatr"
    },
    contextBody: {
      ru: "В городском парке построили летний амфитеатр. В первом ряду установлено a₁ = 18 кресел, а в каждом следующем ряду — на d = 4 кресла больше, чем в предыдущем. Общая вместимость всех n рядов равна Sₙ = 768 мест.",
      kk: "Қалалық саябақта жазғы амфитеатр салынды. Бірінші қатарда a₁ = 18 орындық, ал әрбір келесі қатарда d = 4 орындыққа артық. Барлық n қатардағы жалпы орын саны Sₙ = 768.",
      uz: "Shahar bog‘ida yozgi amfiteatr qurildi. Birinchi qatorda a₁ = 18 ta o‘rindiq, har bir keyingi qatorda d = 4 ta o‘rindiq ko‘p. Barcha n ta qatordagi jami o‘rindiqlar soni Sₙ = 768."
    },
    prompt: {
      ru: "Составьте квадратное уравнение из формулы суммы Sₙ = 768 и найдите количество рядов n в амфитеатре.",
      kk: "Sₙ = 768 қосынды формуласынан квадрат теңдеу құрып, амфитеатрдағы қатарлар саны n-ді табыңыз.",
      uz: "Sₙ = 768 yig‘indi formulasidan kvadrat tenglama tuzing va amfiteatrdagi qatorlar soni n ni toping."
    },
    options: {
      ru: ["15", "16", "18", "20"],
      kk: ["15", "16", "18", "20"],
      uz: ["15", "16", "18", "20"]
    },
    correctIndex: 1,
    rule: {
      ru: "Сумма Sₙ = ((2a₁ + d(n − 1)) / 2) × n сводится к квадратному уравнению n² + 8n − 384 = 0, где n > 0.",
      kk: "Sₙ = ((2a₁ + d(n − 1)) / 2) × n формуласы n² + 8n − 384 = 0 квадрат теңдеуіне келеді (n > 0).",
      uz: "Sₙ = ((2a₁ + d(n − 1)) / 2) × n formulasi n² + 8n − 384 = 0 kvadrat tenglamaga keladi (n > 0)."
    },
    explanation: {
      ru: "((36 + 4(n − 1)) / 2) × n = 768 ⇒ (16 + 2n)n = 768 ⇒ n² + 8n − 384 = 0. По теореме Виета корни 16 и −24. Так как n > 0, рядов 16.",
      kk: "(16 + 2n)n = 768 ⇒ n² + 8n − 384 = 0. Виет теоремасы бойынша түбірлері 16 және −24. n > 0 болғандықтан, n = 16.",
      uz: "(16 + 2n)n = 768 ⇒ n² + 8n − 384 = 0. Viyet teoremasiga ko‘ra ildizlar 16 va −24. n > 0 bo‘lgani uchun n = 16."
    },
    trap: {
      ru: "При делении 768 на 2 получить 380 вместо 384 и выбрать 15.",
      kk: "768-ді 2-ге бөлгенде қателесіп 15-ті таңдау.",
      uz: "768 ni 2 ga bo‘lishda adashib 15 ni tanlash."
    },
    labSeed: 6
  },
  {
    id: "unt-q8-matching-vieta",
    order: 8,
    format: "matching",
    subtest: "profile_math",
    untNumberRange: "№31–35 (2 балла)",
    topic: "quadratic",
    maxPoints: 2,
    prompt: {
      ru: "Для приведённого квадратного уравнения x² − 9x + 20 = 0 установите соответствие между величиной (А, Б) и её числовым значением (1–4):",
      kk: "Берілген x² − 9x + 20 = 0 келтірілген квадрат теңдеуі үшін шамалар (А, Б) мен олардың сандық мәндері (1–4) арасындағы сәйкестікті анықтаңыз:",
      uz: "Berilgan x² − 9x + 20 = 0 keltirilgan kvadrat tenglama uchun kattaliklar (A, B) va ularning son qiymatlari (1–4) o‘rtasidagi moslikni aniqlang:"
    },
    leftItems: {
      ru: ["А) Сумма корней x₁ + x₂", "Б) Больший корень уравнения"],
      kk: ["А) Түбірлердің қосындысы x₁ + x₂", "Б) Теңдеудің үлкен түбірі"],
      uz: ["A) Ildizlar yig‘indisi x₁ + x₂", "B) Tenglamaning katta ildizi"]
    },
    rightOptions: {
      ru: ["1) −9", "2) 4", "3) 5", "4) 9"],
      kk: ["1) −9", "2) 4", "3) 5", "4) 9"],
      uz: ["1) −9", "2) 4", "3) 5", "4) 9"]
    },
    correctPairs: [3, 2],
    rule: {
      ru: "По теореме Виета для x² + px + q = 0: сумма корней x₁ + x₂ = −p, произведение x₁·x₂ = q.",
      kk: "x² + px + q = 0 үшін Виет теоремасы: x₁ + x₂ = −p, ал x₁·x₂ = q.",
      uz: "x² + px + q = 0 uchun Viyet teoremasi: x₁ + x₂ = −p, ko‘paytmasi x₁·x₂ = q."
    },
    explanation: {
      ru: "А) Коэффициент p = −9, поэтому x₁ + x₂ = −(−9) = 9 (вариант 4). Б) Из x₁ + x₂ = 9 и x₁·x₂ = 20 находим корни 4 и 5; больший корень равен 5 (вариант 3).",
      kk: "А) p = −9 болғандықтан, x₁ + x₂ = 9 (4-нұсқа). Б) Түбірлері 4 және 5, үлкен түбірі — 5 (3-нұсқа).",
      uz: "A) p = −9 bo‘lgani uchun x₁ + x₂ = 9 (4-variant). B) Ildizlari 4 va 5, katta ildizi — 5 (3-variant)."
    },
    trap: {
      ru: "Взять сумму корней без смены знака (−9) или перепутать меньший корень (4) с большим (5). За 1 верную пару начисляется 1 балл, за обе — 2 балла.",
      kk: "Түбірлер қосындысын таңбасын ауыстырмай (−9) алу. 1 дұрыс жұпқа — 1 балл, екеуіне — 2 балл беріледі.",
      uz: "Yig‘indini ishorasini o‘zgartirmay (−9) olish. 1 ta to‘g‘ri juftlikka — 1 ball, ikkalasiga — 2 ball beriladi."
    },
    labSeed: 7
  },
  {
    id: "unt-q9-matching-stereometry",
    order: 9,
    format: "matching",
    subtest: "profile_math",
    untNumberRange: "№31–35 (2 балла)",
    topic: "stereometry",
    maxPoints: 2,
    prompt: {
      ru: "Квадратное основание имеет сторону a = 6 см, а высота тела равна h = 5 см. Установите соответствие между пространственным телом (А, Б) и его объёмом (1–4):",
      kk: "Табанының қабырғасы a = 6 см шаршы, ал биіктігі h = 5 см. Кеңістік денесі (А, Б) мен оның көлемі (1–4) арасындағы сәйкестікті табыңыз:",
      uz: "Kvadrat asosning tomoni a = 6 sm, balandligi esa h = 5 sm. Fazoviy jism (A, B) va uning hajmi (1–4) o‘rtasidagi moslikni toping:"
    },
    leftItems: {
      ru: ["А) Объём правильной четырёхугольной пирамиды", "Б) Объём прямой четырёхугольной призмы"],
      kk: ["А) Дұрыс төртбұрышты пирамиданың көлемі", "Б) Тік төртбұрышты призманың көлемі"],
      uz: ["A) Muntazam to‘rtburchakli piramida hajmi", "B) To‘g‘ri to‘rtburchakli prizma hajmi"]
    },
    rightOptions: {
      ru: ["1) 30 см³", "2) 60 см³", "3) 90 см³", "4) 180 см³"],
      kk: ["1) 30 см³", "2) 60 см³", "3) 90 см³", "4) 180 см³"],
      uz: ["1) 30 sm³", "2) 60 sm³", "3) 90 sm³", "4) 180 sm³"]
    },
    correctPairs: [1, 3],
    rule: {
      ru: "Площадь квадратного основания S = a² = 36 см². Для призмы V = S·h, для пирамиды V = (1/3)S·h.",
      kk: "Табан ауданы S = a² = 36 см². Призма үшін V = S·h, пирамида үшін V = (1/3)S·h.",
      uz: "Asos yuzasi S = a² = 36 sm². Prizma uchun V = S·h, piramida uchun V = (1/3)S·h."
    },
    explanation: {
      ru: "Площадь основания S = 6² = 36 см². А) Объём пирамиды V = (1/3) × 36 × 5 = 60 см³ (вариант 2). Б) Объём призмы V = 36 × 5 = 180 см³ (вариант 4).",
      kk: "S = 6² = 36 см². А) Пирамида көлемі V = (1/3) × 36 × 5 = 60 см³ (2-нұсқа). Б) Призма көлемі V = 36 × 5 = 180 см³ (4-нұсқа).",
      uz: "S = 6² = 36 sm². A) Piramida hajmi V = (1/3) × 36 × 5 = 60 sm³ (2-variant). B) Prizma hajmi V = 36 × 5 = 180 sm³ (4-variant)."
    },
    trap: {
      ru: "Забыть коэффициент 1/3 у пирамиды или взять периметр 4×6 = 24 вместо площади 36.",
      kk: "Пирамидада 1/3 коэффициентін ұмыту немесе аудан орнына периметрді алу.",
      uz: "Piramida formulasida 1/3 koeffitsiyentni unutish yoki yuza o‘rniga perimetrni olish."
    },
    labSeed: 8
  },
  {
    id: "unt-q10-multiple-functions",
    order: 10,
    format: "multiple",
    subtest: "profile_math",
    untNumberRange: "№36–40 (2 балла)",
    topic: "functions",
    maxPoints: 2,
    prompt: {
      ru: "Рассмотрите логарифмическое уравнение log₃(x − 4) = 2. Выберите все верные утверждения (от 1 до 3 правильных ответов из 6):",
      kk: "log₃(x − 4) = 2 логарифмдік теңдеуін қарастырыңыз. Барлық дұрыс тұжырымдарды таңдаңыз (6 нұсқадан 1–3 дұрыс жауап):",
      uz: "log₃(x − 4) = 2 logarifmik tenglamani ko‘rib chiqing. Barcha to‘g‘ri mulohazalarni tanlang (6 tadan 1–3 ta to‘g‘ri javob):"
    },
    options: {
      ru: [
        "A) Область допустимых значений (ОДЗ): x > 4",
        "B) По определению логарифма x − 4 = 3²",
        "C) По определению логарифма x − 4 = 2³",
        "D) Корень уравнения равен x = 13",
        "E) Корень уравнения равен x = 10",
        "F) Уравнение не имеет действительных корней"
      ],
      kk: [
        "A) Мүмкін мәндер облысы (ММО): x > 4",
        "B) Логарифм анықтамасы бойынша x − 4 = 3²",
        "C) Логарифм анықтамасы бойынша x − 4 = 2³",
        "D) Теңдеудің түбірі x = 13 санына тең",
        "E) Теңдеудің түбірі x = 10 санына тең",
        "F) Теңдеудің нақты түбірлері жоқ"
      ],
      uz: [
        "A) Aniqlanish sohasi (AS): x > 4",
        "B) Logarifm ta’rifiga ko‘ra x − 4 = 3²",
        "C) Logarifm ta’rifiga ko‘ra x − 4 = 2³",
        "D) Tenglamaning ildizi x = 13 ga teng",
        "E) Tenglamaning ildizi x = 10 ga teng",
        "F) Tenglama haqiqiy ildizga ega emas"
      ]
    },
    correctIndices: [0, 1, 3],
    rule: {
      ru: "Для log_b(f(x)) = k: ОДЗ f(x) > 0 и f(x) = b^k (основание b возводится в степень k).",
      kk: "log_b(f(x)) = k үшін: ММО f(x) > 0 және f(x) = b^k (негізі b саны k дәрежесіне шығарылады).",
      uz: "log_b(f(x)) = k uchun: AS f(x) > 0 va f(x) = b^k (b asos k darajaga ko‘tariladi)."
    },
    explanation: {
      ru: "ОДЗ: x − 4 > 0 ⇒ x > 4 (верно A). По определению логарифма x − 4 = 3² = 9 (верно B). Отсюда x = 9 + 4 = 13 (верно D).",
      kk: "ММО: x − 4 > 0 ⇒ x > 4 (A дұрыс). Анықтама бойынша x − 4 = 3² = 9 (B дұрыс). Осыдан x = 13 (D дұрыс).",
      uz: "AS: x − 4 > 0 ⇒ x > 4 (A to‘g‘ri). Ta’rifga ko‘ra x − 4 = 3² = 9 (B to‘g‘ri). Bundan x = 13 (D to‘g‘ri)."
    },
    trap: {
      ru: "Перепутать основание и показатель (2³ = 8 вместо 3² = 9) или умножить 3 × 2 = 6 (получив x = 10).",
      kk: "Негізі мен дәреже көрсеткішін шатастыру (3² орнына 2³) немесе 3 × 2 = 6 деп көбейту.",
      uz: "Asos va daraja ko‘rsatkichini adashtirish (3² o‘rniga 2³) yoki 3 × 2 = 6 deb ko‘paytirish."
    },
    labSeed: 9
  },
  {
    id: "unt-q11-multiple-trigonometry",
    order: 11,
    format: "multiple",
    subtest: "profile_math",
    untNumberRange: "№36–40 (2 балла)",
    topic: "trigonometry",
    maxPoints: 2,
    prompt: {
      ru: "Укажите все корни тригонометрического уравнения sin(2x) − √3·sin(x) = 0, принадлежащие отрезку [0; π]:",
      kk: "sin(2x) − √3·sin(x) = 0 тригонометриялық теңдеуінің [0; π] кесіндісіне тиісті барлық түбірлерін көрсетіңіз:",
      uz: "sin(2x) − √3·sin(x) = 0 trigonometrik tenglamaning [0; π] kesmaga tegishli barcha ildizlarini ko‘rsating:"
    },
    options: {
      ru: ["A) 0", "B) π/6", "C) π/3", "D) π/2", "E) 5π/6", "F) π"],
      kk: ["A) 0", "B) π/6", "C) π/3", "D) π/2", "E) 5π/6", "F) π"],
      uz: ["A) 0", "B) π/6", "C) π/3", "D) π/2", "E) 5π/6", "F) π"]
    },
    correctIndices: [0, 1, 5],
    rule: {
      ru: "Нельзя делить уравнение на sin(x) — нужно вынести общий множитель: sin(x)·(2cos(x) − √3) = 0.",
      kk: "Теңдеуді sin(x)-ке бөлуге болмайды — ортақ көбейткішті жақша сыртына шығарамыз: sin(x)·(2cos(x) − √3) = 0.",
      uz: "Tenglamani sin(x) ga bo‘lish mumkin emas — umumiy ko‘paytuvchini qavs tashqarisiga chiqaramiz: sin(x)·(2cos(x) − √3) = 0."
    },
    explanation: {
      ru: "2sin(x)cos(x) − √3sin(x) = 0 ⇒ sin(x)(2cos(x) − √3) = 0. Из sin(x) = 0 на [0; π] получаем x = 0 (A) и x = π (F). Из cos(x) = √3/2 на [0; π] получаем x = π/6 (B).",
      kk: "sin(x)(2cos(x) − √3) = 0. sin(x) = 0 теңдеуінен [0; π] кесіндісінде x = 0 (A) және x = π (F) шығады. cos(x) = √3/2 теңдеуінен x = π/6 (B) шығады.",
      uz: "sin(x)(2cos(x) − √3) = 0. sin(x) = 0 dan [0; π] kesmada x = 0 (A) va x = π (F) chiqadi. cos(x) = √3/2 dan esa x = π/6 (B) chiqadi."
    },
    trap: {
      ru: "Разделить обе части на sin(x) и потерять корни 0 и π (получив 0 или 1 балл вместо 2).",
      kk: "Екі жағын sin(x)-ке бөліп жіберіп, 0 мен π түбірлерін жоғалту.",
      uz: "Ikki tomonni sin(x) ga bo‘lib yuborib, 0 va π ildizlarini yo‘qotish."
    },
    labSeed: 10
  },
  {
    id: "unt-q12-multiple-calculus",
    order: 12,
    format: "multiple",
    subtest: "profile_math",
    untNumberRange: "№36–40 (2 балла)",
    topic: "derivative",
    maxPoints: 2,
    prompt: {
      ru: "Дана функция f(x) = x³ − 6x² + 9x − 1. Выберите из списка абсциссы обеих точек экстремума функции, а также значение производной f′(2):",
      kk: "f(x) = x³ − 6x² + 9x − 1 функциясы берілген. Тізімнен функцияның екі экстремум нүктесінің абсциссаларын және f′(2) туынды мәнін таңдаңыз:",
      uz: "f(x) = x³ − 6x² + 9x − 1 funksiya berilgan. Ro‘yxatdan funksiyaning ikkala ekstremum nuqtasi abssissalarini hamda f′(2) hosila qiymatini tanlang:"
    },
    options: {
      ru: ["A) −3", "B) −1", "C) 1", "D) 2", "E) 3", "F) 9"],
      kk: ["A) −3", "B) −1", "C) 1", "D) 2", "E) 3", "F) 9"],
      uz: ["A) −3", "B) −1", "C) 1", "D) 2", "E) 3", "F) 9"]
    },
    correctIndices: [0, 2, 4],
    rule: {
      ru: "Точки экстремума находятся из условия f′(x) = 0 со сменой знака производной: f′(x) = 3x² − 12x + 9 = 3(x − 1)(x − 3).",
      kk: "Экстремум нүктелері f′(x) = 0 шартынан табылады: f′(x) = 3x² − 12x + 9 = 3(x − 1)(x − 3).",
      uz: "Ekstremum nuqtalari f′(x) = 0 shartidan topiladi: f′(x) = 3x² − 12x + 9 = 3(x − 1)(x − 3)."
    },
    explanation: {
      ru: "1) Производная f′(x) = 3x² − 12x + 9 = 3(x − 1)(x − 3). 2) Точки экстремума: x = 1 (C) и x = 3 (E). 3) Значение производной в точке x = 2: f′(2) = 3(2 − 1)(2 − 3) = −3 (A).",
      kk: "1) Туынды: f′(x) = 3(x − 1)(x − 3). 2) Экстремум нүктелері: x = 1 (C) және x = 3 (E). 3) x = 2 нүктесіндегі туынды: f′(2) = −3 (A).",
      uz: "1) Hosila: f′(x) = 3(x − 1)(x − 3). 2) Ekstremum nuqtalari: x = 1 (C) va x = 3 (E). 3) x = 2 nuqtadagi hosila: f′(2) = −3 (A)."
    },
    trap: {
      ru: "Забыть коэффициент 3 перед x² при дифференцировании x³ или перепутать точку x = 2 со значением f′(2) = −3.",
      kk: "x³ туындысын тапқанда 3 коэффициентін ұмыту немесе x = 2 мен f′(2) = −3 мәнін шатастыру.",
      uz: "x³ hosilasini topishda 3 koeffitsiyentni unutish yoki x = 2 bilan f′(2) = −3 qiymatini adashtirish."
    },
    labSeed: 11
  },
  {
    id: "unt-q13-inequalities",
    order: 13,
    format: "single",
    subtest: "profile_math",
    untNumberRange: "№1–25",
    topic: "inequalities",
    maxPoints: 1,
    prompt: {
      ru: "Найдите количество всех целых решений неравенства (x − 2)(x + 3) ≤ 0.",
      kk: "(x − 2)(x + 3) ≤ 0 теңсіздігінің барлық бүтін шешімдерінің санын табыңыз.",
      uz: "(x − 2)(x + 3) ≤ 0 tengsizlikning barcha butun yechimlari sonini toping."
    },
    options: {
      ru: ["4", "5", "6", "7"],
      kk: ["4", "5", "6", "7"],
      uz: ["4", "5", "6", "7"]
    },
    correctIndex: 2,
    rule: {
      ru: "По методу интервалов для (x − x₁)(x − x₂) ≤ 0 решением является замкнутый отрезок [−3; 2], включая оба конца.",
      kk: "Интервалдар әдісі бойынша (x − x₁)(x − x₂) ≤ 0 теңсіздігінің шешімі — екі шетін қоса алғандағы [−3; 2] кесіндісі.",
      uz: "Intervallar usuliga ko‘ra (x − x₁)(x − x₂) ≤ 0 tengsizlik yechimi ikkala uchini o‘z ichiga olgan [−3; 2] kesmadir."
    },
    explanation: {
      ru: "Нули произведения: x = −3 и x = 2. На отрезке [−3; 2] лежат целые числа −3, −2, −1, 0, 1, 2 — всего 6 целых решений.",
      kk: "Көбейтіндінің нөлдері: x = −3 және x = 2. [−3; 2] кесіндісінде −3, −2, −1, 0, 1, 2 бүтін сандары жатыр — барлығы 6 шешім.",
      uz: "Ko‘paytma nollari: x = −3 va x = 2. [−3; 2] kesmada −3, −2, −1, 0, 1, 2 butun sonlari bor — jami 6 ta yechim."
    },
    trap: {
      ru: "Вычесть 2 − (−3) = 5 и забыть прибавить 1 при подсчёте целых точек замкнутого отрезка.",
      kk: "2 − (−3) = 5 деп есептеп, кесіндінің екі шеткі нүктесі де кіретінін (+1) ұмыту.",
      uz: "2 − (−3) = 5 deb hisoblab, kesmaning ikkala чекка nuqtasi ham kirishini (+1) unutish."
    },
    labSeed: 12
  },
  {
    id: "unt-q14-systems",
    order: 14,
    format: "single",
    subtest: "profile_math",
    untNumberRange: "№1–25",
    topic: "systems",
    maxPoints: 1,
    prompt: {
      ru: "Решите систему уравнений { x + y = 9; x·y = 20 } и найдите значение выражения |x − y|.",
      kk: "{ x + y = 9; x·y = 20 } теңдеулер жүйесін шешіп, |x − y| өрнегінің мәнін табыңыз.",
      uz: "{ x + y = 9; x·y = 20 } tenglamalar sistemasini yeching va |x − y| ifodaning qiymatini toping."
    },
    options: {
      ru: ["1", "2", "4", "5"],
      kk: ["1", "2", "4", "5"],
      uz: ["1", "2", "4", "5"]
    },
    correctIndex: 0,
    rule: {
      ru: "Симметричная система { x + y = S; x·y = P } задаёт корни вспомогательного уравнения t² − St + P = 0 или тождество (x − y)² = (x + y)² − 4xy.",
      kk: "{ x + y = S; x·y = P } симметриялы жүйесі үшін (x − y)² = (x + y)² − 4xy тепе-теңдігі орындалады.",
      uz: "{ x + y = S; x·y = P } simmetrik sistema uchun (x − y)² = (x + y)² − 4xy ayniyat o‘rinli."
    },
    explanation: {
      ru: "(x − y)² = 9² − 4 × 20 = 81 − 80 = 1 ⇒ |x − y| = 1 (пары (5; 4) и (4; 5)).",
      kk: "(x − y)² = 9² − 4 × 20 = 81 − 80 = 1 ⇒ |x − y| = 1 ((5; 4) және (4; 5) жұптары).",
      uz: "(x − y)² = 9² − 4 × 20 = 81 − 80 = 1 ⇒ |x − y| = 1 ((5; 4) va (4; 5) juftliklar)."
    },
    trap: {
      ru: "Выбрать один из найденных корней (4 или 5) вместо модуля их разности |5 − 4| = 1.",
      kk: "|5 − 4| = 1 айырмасының орнына түбірлердің бірін (4 немесе 5) белгілеп қою.",
      uz: "|5 − 4| = 1 ayirma o‘rniga ildizlardan birini (4 yoki 5) tanlash."
    },
    labSeed: 13
  },
  {
    id: "unt-q15-combinatorics",
    order: 15,
    format: "single",
    subtest: "math_literacy",
    untNumberRange: "Мат. грам. №1–10",
    topic: "combinatorics",
    maxPoints: 1,
    prompt: {
      ru: "В шахматном турнире участвуют 8 школьников, и каждый сыграл с каждым ровно по одной партии. Сколько всего партий было сыграно?",
      kk: "Шахмат турниріне 8 оқушы қатысып, әрқайсысы бір-бірімен дәл бір партиядан ойнады. Барлығы неше партия ойналды?",
      uz: "Shaxmat turnirida 8 нафар o‘quvchi qatnashib, har biri bir-biri bilan bittadan partiya o‘ynadi. Jami nechta partiya o‘ynalgan?"
    },
    options: {
      ru: ["16", "28", "56", "64"],
      kk: ["16", "28", "56", "64"],
      uz: ["16", "28", "56", "64"]
    },
    correctIndex: 1,
    rule: {
      ru: "Число партий (рукопожатий) между n участниками равно числу сочетаний без учёта порядка: C(n, 2) = n(n − 1) / 2.",
      kk: "n қатысушы арасындағы партиялар саны реттілік ескерілмейтін терулер санына тең: C(n, 2) = n(n − 1) / 2.",
      uz: "n ishtirokchi orasidagi partiyalar soni kombinatsiyalar formulasiga teng: C(n, 2) = n(n − 1) / 2."
    },
    explanation: {
      ru: "C(8, 2) = (8 × 7) / 2 = 28 партий.",
      kk: "C(8, 2) = (8 × 7) / 2 = 28 партия.",
      uz: "C(8, 2) = (8 × 7) / 2 = 28 ta partiya."
    },
    trap: {
      ru: "Забыть разделить произведение 8 × 7 = 56 на 2 (посчитав каждую партию дважды за обоих игроков).",
      kk: "8 × 7 = 56 көбейтіндісін 2-ге бөлуді ұмыту (әр партияны екі рет санау).",
      uz: "8 × 7 = 56 ko‘paytmani 2 ga bo‘lishni unutish."
    },
    labSeed: 14
  },
  {
    id: "unt-q16-radicals",
    order: 16,
    format: "single",
    subtest: "profile_math",
    untNumberRange: "№1–25",
    topic: "radicals",
    maxPoints: 1,
    prompt: {
      ru: "Решите иррациональное уравнение √(2x + 7) = 5.",
      kk: "√(2x + 7) = 5 иррационал теңдеуін шешіңіз.",
      uz: "√(2x + 7) = 5 irratsional tenglamani yeching."
    },
    options: {
      ru: ["x = 1,5", "x = 9", "x = 16", "x = 6"],
      kk: ["x = 1,5", "x = 9", "x = 16", "x = 6"],
      uz: ["x = 1,5", "x = 9", "x = 16", "x = 6"]
    },
    correctIndex: 1,
    rule: {
      ru: "При r ≥ 0 уравнение √f(x) = r равносильно f(x) = r².",
      kk: "r ≥ 0 болғанда √f(x) = r теңдеуі f(x) = r² теңдеуімен мәндес.",
      uz: "r ≥ 0 bo‘lganda √f(x) = r tenglama f(x) = r² ga teng kuchli."
    },
    explanation: {
      ru: "Возведём обе части в квадрат: 2x + 7 = 5² = 25 ⇒ 2x = 18 ⇒ x = 9.",
      kk: "Екі жағын квадраттаймыз: 2x + 7 = 25 ⇒ 2x = 18 ⇒ x = 9.",
      uz: "Ikki tomonni kvadratga oshiramiz: 2x + 7 = 25 ⇒ 2x = 18 ⇒ x = 9."
    },
    trap: {
      ru: "Умножить 5 × 2 = 10 вместо возведения в квадрат (25) и получить 2x = 3 ⇒ x = 1,5.",
      kk: "5-ті квадраттаудың (25) орнына 2-ге көбейтіп (10), x = 1,5 алу.",
      uz: "5 ni kvadratga oshirish (25) o‘rniga 2 ga ko‘paytirib (10), x = 1,5 olish."
    },
    labSeed: 15
  },
  {
    id: "unt-q17-integrals",
    order: 17,
    format: "single",
    subtest: "profile_math",
    untNumberRange: "№1–25",
    topic: "integrals",
    maxPoints: 1,
    prompt: {
      ru: "Вычислите площадь криволинейной трапеции, ограниченной параболой y = 3x² + 2, осью Ox и прямыми x = 0 и x = 2.",
      kk: "y = 3x² + 2 параболасымен, Ox осімен және x = 0, x = 2 түзулерімен шектелген қисықсызықты трапецияның ауданын табыңыз.",
      uz: "y = 3x² + 2 parabola, Ox o‘qi hamda x = 0, x = 2 to‘g‘ri chiziqlar bilan chegaralangan egri chiziqli trapetsiya yuzasini toping."
    },
    options: {
      ru: ["10", "12", "14", "28"],
      kk: ["10", "12", "14", "28"],
      uz: ["10", "12", "14", "28"]
    },
    correctIndex: 1,
    rule: {
      ru: "По формуле Ньютона — Лейбница S = ∫₀² (3x² + 2) dx = F(2) − F(0), где F(x) = x³ + 2x.",
      kk: "Ньютон — Лейбниц формуласы бойынша S = ∫₀² (3x² + 2) dx = F(2) − F(0), мұндағы F(x) = x³ + 2x.",
      uz: "Nyuton — Leybnits formulasiga ko‘ra S = ∫₀² (3x² + 2) dx = F(2) − F(0), bu yerda F(x) = x³ + 2x."
    },
    explanation: {
      ru: "Первообразная F(x) = x³ + 2x. Подставляем пределы: F(2) − F(0) = (2³ + 2×2) − 0 = 8 + 4 = 12.",
      kk: "Алғашқы функция F(x) = x³ + 2x. Шектерді қоямыз: F(2) − F(0) = (8 + 4) − 0 = 12.",
      uz: "Boshlang‘ich funksiya F(x) = x³ + 2x. Chegaralarni qo‘yamiz: F(2) − F(0) = (8 + 4) − 0 = 12."
    },
    trap: {
      ru: "Забыть проинтегрировать константу 2 (получив 8 + 2 = 10) или не разделить 3x³ на 3 (получив 28).",
      kk: "2 тұрақтысын x-ке көбейтуді ұмытып 10 алу немесе 3-ке бөлмей 28 алу.",
      uz: "2 o‘zgarmasni x ga ko‘paytirishni unutib 10 olish yoki 3 ga bo‘lmay 28 olish."
    },
    labSeed: 16
  },
  {
    id: "unt-q18-vectors",
    order: 18,
    format: "single",
    subtest: "profile_math",
    untNumberRange: "№1–25",
    topic: "vectors",
    maxPoints: 1,
    prompt: {
      ru: "При каком значении m векторы a⃗(3; −4) и b⃗(8; m) перпендикулярны?",
      kk: "m-нің қандай мәнінде a⃗(3; −4) және b⃗(8; m) векторлары перпендикуляр болады?",
      uz: "m ning qanday qiymatida a⃗(3; −4) va b⃗(8; m) vektorlar perpendikulyar bo‘ladi?"
    },
    options: {
      ru: ["−6", "6", "4", "−4"],
      kk: ["−6", "6", "4", "−4"],
      uz: ["−6", "6", "4", "−4"]
    },
    correctIndex: 1,
    rule: {
      ru: "Ненулевые векторы перпендикулярны тогда и только тогда, когда их скалярное произведение равно нулю: x₁x₂ + y₁y₂ = 0.",
      kk: "Нөлдік емес векторлар перпендикуляр болуы үшін олардың скаляр көбейтіндісі нөлге тең болуы шарт: x₁x₂ + y₁y₂ = 0.",
      uz: "Noldan farqli vektorlar perpendikulyar bo‘lishi uchun ularning skalyar ko‘paytmasi nolga teng bo‘lishi shart: x₁x₂ + y₁y₂ = 0."
    },
    explanation: {
      ru: "a⃗ · b⃗ = 3 × 8 + (−4) × m = 0 ⇒ 24 − 4m = 0 ⇒ m = 6.",
      kk: "a⃗ · b⃗ = 3 × 8 + (−4) × m = 0 ⇒ 24 − 4m = 0 ⇒ m = 6.",
      uz: "a⃗ · b⃗ = 3 × 8 + (−4) × m = 0 ⇒ 24 − 4m = 0 ⇒ m = 6."
    },
    trap: {
      ru: "Потерять знак минус у координаты −4 и получить 24 + 4m = 0 ⇒ m = −6.",
      kk: "−4 координатасының таңбасын жоғалтып, m = −6 жауабын таңдау.",
      uz: "−4 koordinata ishorasini yo‘qotib, m = −6 javobini tanlash."
    },
    labSeed: 17
  }
];

export function scoreUntQuestion(
  question: UntQuestion,
  answer: UntUserAnswer | undefined
): UntQuestionScore {
  if (!answer) {
    return {
      questionId: question.id,
      topic: question.topic,
      format: question.format,
      earned: 0,
      max: question.maxPoints,
      status: "unanswered"
    };
  }

  if (question.format === "single" || question.format === "context") {
    if (answer.format !== "single" && answer.format !== "context") {
      return { questionId: question.id, topic: question.topic, format: question.format, earned: 0, max: 1, status: "unanswered" };
    }
    if (answer.selectedIndex === null || answer.selectedIndex === undefined) {
      return { questionId: question.id, topic: question.topic, format: question.format, earned: 0, max: 1, status: "unanswered" };
    }
    const isCorrect = answer.selectedIndex === question.correctIndex;
    return {
      questionId: question.id,
      topic: question.topic,
      format: question.format,
      earned: isCorrect ? 1 : 0,
      max: 1,
      status: isCorrect ? "full" : "zero"
    };
  }

  if (question.format === "matching") {
    if (answer.format !== "matching") {
      return { questionId: question.id, topic: question.topic, format: "matching", earned: 0, max: 2, status: "unanswered" };
    }
    const [a, b] = answer.pairs;
    if (a === null && b === null) {
      return { questionId: question.id, topic: question.topic, format: "matching", earned: 0, max: 2, status: "unanswered" };
    }
    const [corrA, corrB] = question.correctPairs;
    const matchA = a === corrA;
    const matchB = b === corrB;
    if (matchA && matchB) {
      return { questionId: question.id, topic: question.topic, format: "matching", earned: 2, max: 2, status: "full" };
    }
    if (matchA || matchB) {
      return { questionId: question.id, topic: question.topic, format: "matching", earned: 1, max: 2, status: "partial" };
    }
    return { questionId: question.id, topic: question.topic, format: "matching", earned: 0, max: 2, status: "zero" };
  }

  // multiple choice (1..3 out of 6, 2 points max, official NTO partial grading)
  if (answer.format !== "multiple" || answer.selectedIndices.length === 0) {
    return { questionId: question.id, topic: question.topic, format: "multiple", earned: 0, max: 2, status: "unanswered" };
  }

  const uniqueSelected = [...new Set(answer.selectedIndices)];
  if (uniqueSelected.length > 3) {
    return { questionId: question.id, topic: question.topic, format: "multiple", earned: 0, max: 2, status: "zero" };
  }

  const correctSet = new Set(question.correctIndices);
  const selectedSet = new Set(uniqueSelected);

  let missed = 0;
  for (const c of correctSet) {
    if (!selectedSet.has(c)) missed++;
  }
  let extra = 0;
  for (const s of selectedSet) {
    if (!correctSet.has(s)) extra++;
  }

  if (missed === 0 && extra === 0) {
    return { questionId: question.id, topic: question.topic, format: "multiple", earned: 2, max: 2, status: "full" };
  }

  // Official NTO rule: 1 point when exactly 1 mistake is made (either 1 missed with 0 extra and at least 1 correct chosen, OR 0 missed with 1 extra)
  const truePositives = uniqueSelected.length - extra;
  if ((missed === 1 && extra === 0 && truePositives >= 1) || (missed === 0 && extra === 1)) {
    return { questionId: question.id, topic: question.topic, format: "multiple", earned: 1, max: 2, status: "partial" };
  }

  return { questionId: question.id, topic: question.topic, format: "multiple", earned: 0, max: 2, status: "zero" };
}

export function evaluateUntExam(
  answers: Record<string, UntUserAnswer>,
  questions: UntQuestion[] = untQuestions
): UntExamEvaluation {
  let earnedPoints = 0;
  let maxPoints = 0;
  let answeredCount = 0;
  let partialTwoPointCount = 0;

  const byFormat: Record<UntQuestionFormat, { earned: number; max: number }> = {
    single: { earned: 0, max: 0 },
    context: { earned: 0, max: 0 },
    matching: { earned: 0, max: 0 },
    multiple: { earned: 0, max: 0 }
  };

  const byTopic = Object.fromEntries(
    topicIds.map((id) => [
      id,
      {
        topic: id,
        earned: 0,
        max: 0,
        ratio: 0,
        questionCount: 0,
        answeredCount: 0,
        unansweredCount: 0,
        answeredWrongCount: 0,
        partialCount: 0,
        zeroCount: 0
      }
    ])
  ) as Record<TopicId, TopicExamStat>;

  const questionScores: Record<string, UntQuestionScore> = {};

  for (const q of questions) {
    const sc = scoreUntQuestion(q, answers[q.id]);
    questionScores[q.id] = sc;
    earnedPoints += sc.earned;
    maxPoints += sc.max;
    if (sc.status !== "unanswered") answeredCount++;
    if (sc.status === "partial") partialTwoPointCount++;

    byFormat[q.format].earned += sc.earned;
    byFormat[q.format].max += sc.max;

    const tStat = byTopic[q.topic];
    tStat.earned += sc.earned;
    tStat.max += sc.max;
    tStat.questionCount += 1;
    if (sc.status === "unanswered") {
      tStat.unansweredCount += 1;
      tStat.zeroCount += 1;
    } else {
      tStat.answeredCount += 1;
      if (sc.status === "partial") tStat.partialCount += 1;
      if (sc.status === "zero") {
        tStat.answeredWrongCount += 1;
        tStat.zeroCount += 1;
      }
    }
  }

  const verifiedWeakTopics: TopicId[] = [];
  const unansweredTopics: TopicId[] = [];
  const strongTopics: TopicId[] = [];

  for (const id of topicIds) {
    const st = byTopic[id];
    st.ratio = st.max > 0 ? Math.round((st.earned / st.max) * 100) / 100 : 0;
    if (st.max > 0) {
      if (st.answeredCount === 0) {
        unansweredTopics.push(id);
      } else if (st.ratio < 0.75 || st.answeredWrongCount > 0 || st.partialCount > 0) {
        if (st.ratio < 0.75) {
          verifiedWeakTopics.push(id);
        } else {
          strongTopics.push(id);
        }
      } else {
        strongTopics.push(id);
      }
    }
  }

  const unansweredCount = Math.max(0, questions.length - answeredCount);
  const answeredWrongCount = Object.values(questionScores).filter(
    (sc) => sc.status === "zero" || sc.status === "partial"
  ).length;
  const isComplete = answeredCount === questions.length && questions.length > 0;
  const scaledScore50 = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 50) : 0;
  const scaledScore60 = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 60) : 0;

  return {
    earnedPoints,
    maxPoints,
    scaledScore50,
    scaledScore60,
    answeredCount,
    unansweredCount,
    answeredWrongCount,
    totalQuestions: questions.length,
    isComplete,
    partialTwoPointCount,
    byFormat,
    byTopic,
    questionScores,
    weakTopics: verifiedWeakTopics,
    verifiedWeakTopics,
    unansweredTopics,
    strongTopics
  };
}

export const untStorageKey = "bilimai-unt-v1";

export const untAttemptSummarySchema = z
  .object({
    completedAt: z.string().min(10).max(40),
    earnedPoints: z.number().int().min(0).max(60),
    maxPoints: z.number().int().min(1).max(60),
    scaledScore50: z.number().int().min(0).max(50),
    weakTopics: z.array(z.enum(topicIds)).max(16),
    topicRatios: z.record(z.enum(topicIds), z.number().min(0).max(1))
  })
  .strict();

export type UntAttemptSummary = z.infer<typeof untAttemptSummarySchema>;

export const untStorageSchema = z
  .object({
    version: z.literal(1),
    lastAttempt: untAttemptSummarySchema.nullable(),
    history: z.array(untAttemptSummarySchema).max(20)
  })
  .strict();

export type UntStorage = z.infer<typeof untStorageSchema>;

export const emptyUntStorage: UntStorage = {
  version: 1,
  lastAttempt: null,
  history: []
};

export { languages, topicIds };
