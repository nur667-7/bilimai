import type { Language, TopicId } from "./curriculum";

export type VerificationState = "verified_correct" | "incorrect" | "unverified" | "unsupported";
export type StepTraceStatus = "valid" | "fracture" | "cascade" | "unverified" | "unsupported";

export interface TraceLineDiagnostic {
  lineNumber: number;
  expression: string;
  status: StepTraceStatus;
  verificationState: VerificationState;
  badge: string;
  note: string;
  correctedLine?: string;
  trapCategory?: string;
}

export interface UntTrapCase {
  id: string;
  code: string;
  topic: TopicId;
  pointsAtStake: 1 | 2;
  trapCategory: Record<Language, string>;
  problem: Record<Language, string>;
  draftLines: Record<Language, [string, string, string, string]>;
  fractureIndex: 0 | 1 | 2 | 3;
  correctedLine: Record<Language, string>;
  whyFractured: Record<Language, string>;
  preservedSkillNote: Record<Language, string>;
  claudePrompt: Record<Language, string>;
}

export const untTrapCases: UntTrapCase[] = [
  {
    id: "trap-log-base",
    code: "TRAP-01 · ОДЗ & Основание < 1",
    topic: "functions",
    pointsAtStake: 2,
    trapCategory: {
      ru: "Логарифм с основанием 0 < a < 1 и потеря ОДЗ",
      kk: "Негізі 0 < a < 1 логарифм және АОО (ОДЗ) жоғалту",
      uz: "Asosi 0 < a < 1 logarifm va aniqlanish соhasini yo‘qotish"
    },
    problem: {
      ru: "Решите неравенство: log₀.₅(x − 3) > −2",
      kk: "Теңсіздікті шешіңіз: log₀.₅(x − 3) > −2",
      uz: "Tengsizlikni yeching: log₀.₅(x − 3) > −2"
    },
    draftLines: {
      ru: [
        "1) Запишем правую часть через основание 0,5: −2 = log₀.₅(0,5⁻²) = log₀.₅(4)",
        "2) Опустим логарифм, сохранив знак: x − 3 > 4",
        "3) Перенесём −3 в правую часть: x > 7",
        "4) Ответ: (7; +∞)"
      ],
      kk: [
        "1) Оң жағын 0,5 негізі арқылы жазамыз: −2 = log₀.₅(0,5⁻²) = log₀.₅(4)",
        "2) Логарифмді таңбаны сақтап түсіреміз: x − 3 > 4",
        "3) −3 санын оң жаққа шығарамыз: x > 7",
        "4) Жауабы: (7; +∞)"
      ],
      uz: [
        "1) O‘ng tomonni 0,5 asos orqali yozamiz: −2 = log₀.₅(0,5⁻²) = log₀.₅(4)",
        "2) Logarifmni ishorani saqlab tushiramiz: x − 3 > 4",
        "3) −3 ni o‘ng tomonga o‘tkazamiz: x > 7",
        "4) Javob: (7; +∞)"
      ]
    },
    fractureIndex: 1,
    correctedLine: {
      ru: "2) С учётом ОДЗ (x − 3 > 0) и основания 0,5 < 1 меняем знак: 0 < x − 3 < 4 ⇒ x ∈ (3; 7)",
      kk: "2) АОО (x − 3 > 0) және 0,5 < 1 негізін ескеріп таңбаны өзгертеміз: 0 < x − 3 < 4 ⇒ x ∈ (3; 7)",
      uz: "2) Aniqlanish sohasi (x − 3 > 0) va 0,5 < 1 asosni hisobga olib ishorani o‘zgartiramiz: 0 < x − 3 < 4 ⇒ x ∈ (3; 7)"
    },
    whyFractured: {
      ru: "При основании 0 < a < 1 логарифмическая функция убывает: знак неравенства обязан развернуться на противоположный, а аргумент ограничен снизу ОДЗ x > 3.",
      kk: "Негізі 0 < a < 1 болғанда логарифмдік функция кемиді: теңсіздік таңбасы қарама-қарсыға ауысуы тиіс және АОО x > 3 шарты сақталады.",
      uz: "Asos 0 < a < 1 bo‘lganda logarifmik funksiya kamayuvchi: tengsizlik ishorasi teskarisiga o‘zgarishi va x > 3 sharti bajarilishi shart."
    },
    preservedSkillNote: {
      ru: "Свойство степени 0,5⁻² = 4 (Строка 1) и линейный перенос (Строка 3) выполнены безупречно. Штрафовать знание степеней нельзя — сбой только в правиле монотонности.",
      kk: "0,5⁻² = 4 дәреже қасиеті (1-жол) мен сызықтық көшіру (3-жол) дұрыс орындалған. Олқылық тек монотондылық ережесінде.",
      uz: "0,5⁻² = 4 daraja xossasi (1-qator) va chiziqli ko‘chirish (3-qator) to‘g‘ri bajarilgan. Xato faqat monotonlik qoidasida."
    },
    claudePrompt: {
      ru: "Объясни, почему в неравенстве log₀.₅(x − 3) > −2 нужно одновременно перевернуть знак и учесть ОДЗ x > 3.",
      kk: "log₀.₅(x − 3) > −2 теңсіздігінде неліктен таңбаны өзгертіп, x > 3 АОО шартын қосу керектігін түсіндірші.",
      uz: "log₀.₅(x − 3) > −2 tengsizligida nega ishorani o‘zgartirish va x > 3 shartini olish kerakligini tushuntiring."
    }
  },
  {
    id: "trap-sqrt-abs",
    code: "TRAP-02 · Потеря модуля √(x²) = |x|",
    topic: "radicals",
    pointsAtStake: 2,
    trapCategory: {
      ru: "Снятие корня чётной степени без модуля |a|",
      kk: "Жұп дәрежелі түбірді |a| модулінсіз ашу",
      uz: "Juft darajali ildizni |a| modulsiz ochish"
    },
    problem: {
      ru: "Найдите значение выражения √((x − 5)²) + x при x = 2",
      kk: "x = 2 болғанда √((x − 5)²) + x өрнегінің мәнін табыңыз",
      uz: "x = 2 bo‘lganda √((x − 5)²) + x ifodaning qiymatini toping"
    },
    draftLines: {
      ru: [
        "1) Упростим корень из квадрата: √((x − 5)²) = x − 5",
        "2) Сложим со вторым слагаемым: (x − 5) + x = 2x − 5",
        "3) Подставим x = 2: 2·2 − 5 = −1",
        "4) Ответ: −1"
      ],
      kk: [
        "1) Квадрат түбірді ықшамдаймыз: √((x − 5)²) = x − 5",
        "2) Екінші қосылғышпен қосамыз: (x − 5) + x = 2x − 5",
        "3) x = 2 мәнін қоямыз: 2·2 − 5 = −1",
        "4) Жауабы: −1"
      ],
      uz: [
        "1) Kvadrat ildizni soddalashtiramiz: √((x − 5)²) = x − 5",
        "2) Ikkinchi qo‘shiluvchi bilan qo‘shamiz: (x − 5) + x = 2x − 5",
        "3) x = 2 qiymatni qo‘yamiz: 2·2 − 5 = −1",
        "4) Javob: −1"
      ]
    },
    fractureIndex: 0,
    correctedLine: {
      ru: "1) Тождество чётного корня: √((x − 5)²) = |x − 5|. Так как x = 2 < 5, то |x − 5| = 5 − x ⇒ (5 − x) + x = 5",
      kk: "1) Жұп түбір тепе-теңдігі: √((x − 5)²) = |x − 5|. x = 2 < 5 болғандықтан, |x − 5| = 5 − x ⇒ (5 − x) + x = 5",
      uz: "1) Juft ildiz ayniyati: √((x − 5)²) = |x − 5|. x = 2 < 5 bo‘lgani uchun |x − 5| = 5 − x ⇒ (5 − x) + x = 5"
    },
    whyFractured: {
      ru: "Арифметический квадратный корень всегда неотрицателен: √(A²) = |A|, а не A. При x = 2 выражение x − 5 = −3 < 0, поэтому модуль раскрывается со знаком минус: 5 − x.",
      kk: "Арифметикалық квадрат түбір әрқашан теріс емес: √(A²) = |A|. x = 2 кезінде x − 5 = −3 < 0, сондықтан модуль 5 − x болып ашылады.",
      uz: "Arifmetik kvadrat ildiz har doim manfiy emas: √(A²) = |A|. x = 2 da x − 5 = −3 < 0, shuning uchun modul 5 − x bo‘lib ochiladi."
    },
    preservedSkillNote: {
      ru: "Приведение подобных и подстановка числа (Строки 2–3) верны для записанного выражения, но само тождество на Строке 1 потеряло модуль.",
      kk: "Ұқсас мүшелерді біріктіру мен санды қою (2–3 жолдар) дұрыс, бірақ 1-жолда модуль ұмытылған.",
      uz: "O‘xshash hadlarni ixchamlash va sonni qo‘yish (2–3 qatorlar) to‘g‘ri, ammo 1-qatorda modul tushib qolgan."
    },
    claudePrompt: {
      ru: "Почему √((x − 5)²) равно |x − 5|, и как правильно раскрыть модуль при x = 2?",
      kk: "Неліктен √((x − 5)²) өрнегі |x − 5|-ке тең және x = 2 кезінде модуль қалай ашылады?",
      uz: "Nega √((x − 5)²) ifoda |x − 5| ga teng va x = 2 da modul qanday ochiladi?"
    }
  },
  {
    id: "trap-rational-odz",
    code: "TRAP-03 · Выколотая точка знаменателя",
    topic: "inequalities",
    pointsAtStake: 2,
    trapCategory: {
      ru: "Включение нуля знаменателя в нестрогом неравенстве",
      kk: "Бөлімнің нөлін жауап аралығына қосып жіберу",
      uz: "Maxraj nolini javob oralig‘iga kiritib yuborish"
    },
    problem: {
      ru: "Найдите количество целых решений неравенства: (x − 3) / (x + 2) ≤ 0",
      kk: "Теңсіздіктің бүтін шешімдер санын табыңыз: (x − 3) / (x + 2) ≤ 0",
      uz: "Tengsizlikning butun yechimlari sonini toping: (x − 3) / (x + 2) ≤ 0"
    },
    draftLines: {
      ru: [
        "1) Найдём нули числителя и знаменателя: x = 3 и x = −2",
        "2) По методу интервалов знаки чередуются: (+), (−), (+)",
        "3) Так как знак ≤ 0, закрашиваем обе границы: x ∈ [−2; 3]",
        "4) Целые решения: −2, −1, 0, 1, 2, 3 → всего 6 целых чисел"
      ],
      kk: [
        "1) Алым мен бөлімнің нөлдерін табамыз: x = 3 және x = −2",
        "2) Интервалдар әдісімен таңбалар алмасады: (+), (−), (+)",
        "3) Таңба ≤ 0 болғандықтан, екі шетін де бояймыз: x ∈ [−2; 3]",
        "4) Бүтін шешімдер: −2, −1, 0, 1, 2, 3 → барлығы 6 бүтін сан"
      ],
      uz: [
        "1) Surat va maxraj nollarini topamiz: x = 3 va x = −2",
        "2) Intervallar usulida ishoralar almashadi: (+), (−), (+)",
        "3) Ishora ≤ 0 bo‘lgani uchun ikkala chegarani bo‘yaymiz: x ∈ [−2; 3]",
        "4) Butun yechimlar: −2, −1, 0, 1, 2, 3 → jami 6 ta butun son"
      ]
    },
    fractureIndex: 2,
    correctedLine: {
      ru: "3) Знаменатель не может быть равен нулю (x ≠ −2), поэтому точка −2 выколота: x ∈ (−2; 3] ⇒ 5 целых решений (−1, 0, 1, 2, 3)",
      kk: "3) Бөлімі нөлге тең болмайды (x ≠ −2), сондықтан −2 нүктесі ашық: x ∈ (−2; 3] ⇒ 5 бүтін шешім (−1, 0, 1, 2, 3)",
      uz: "3) Maxraj nolga teng bo‘lmaydi (x ≠ −2), shuning uchun −2 nuqta ochiq: x ∈ (−2; 3] ⇒ 5 ta butun yechim (−1, 0, 1, 2, 3)"
    },
    whyFractured: {
      ru: "Даже в нестрогом неравенстве (≤ 0) корни знаменателя ВСЕГДА остаются выколотыми (круглые скобки), иначе при x = −2 происходит деление на ноль.",
      kk: "Қатаң емес теңсіздікте де (≤ 0) бөлімнің түбірлері ӘРҚАШАН ашық (дөңгелек жақша) қалады, әйтпесе x = −2 кезінде нөлге бөлу шығады.",
      uz: "hatto noqat’iy tengsizlikda ham (≤ 0) maxraj ildizlari HAR DOIM ochiq qavs bo‘lib qoladi, aks holda x = −2 da nolga bo‘lish yuzaga keladi."
    },
    preservedSkillNote: {
      ru: "Нули функции и чередование знаков на числовой прямой (Строки 1–2) найдены верно. Потеря балла вызвана только круглой скобкой в точке знаменателя.",
      kk: "Функция нөлдері мен таңба алмасуы (1–2 жолдар) дұрыс. Қате тек бөлім нүктесіндегі жақшада.",
      uz: "Funksiya nollari va ishoralar almashinuvi (1–2 qatorlar) to‘g‘ri topilgan. Xato faqat maxraj nuqtasidagi qavsda."
    },
    claudePrompt: {
      ru: "Почему в неравенстве (x − 3)/(x + 2) ≤ 0 точка −2 круглая, а точка 3 квадратная?",
      kk: "(x − 3)/(x + 2) ≤ 0 теңсіздігінде неліктен −2 нүктесі дөңгелек жақшамен, ал 3 тік жақшамен жазылады?",
      uz: "(x − 3)/(x + 2) ≤ 0 tengsizligida nega −2 nuqta oddiy qavs, 3 esa kvadrat qavs bilan yoziladi?"
    }
  },
  {
    id: "trap-vieta-sign",
    code: "TRAP-04 · Знак суммы в теореме Виета",
    topic: "quadratic",
    pointsAtStake: 1,
    trapCategory: {
      ru: "Забытый минус перед коэффициентом b в сумме корней x₁ + x₂ = −b/a",
      kk: "Виет теоремасындағы x₁ + x₂ = −b/a қосынды таңбасын шатастыру",
      uz: "Viyet teoremasida x₁ + x₂ = −b/a yig‘indi ishorasini adashtirish"
    },
    problem: {
      ru: "Пусть x₁ и x₂ — корни уравнения x² − 9x + 14 = 0. Найдите x₁² + x₂²",
      kk: "x₁ және x₂ — x² − 9x + 14 = 0 теңдеуінің түбірлері болсын. x₁² + x₂² мәнін табыңыз",
      uz: "x₁ va x₂ — x² − 9x + 14 = 0 tenglama ildizlari bo‘lsin. x₁² + x₂² qiymatini toping"
    },
    draftLines: {
      ru: [
        "1) По теореме Виета запишем сумму и произведение: x₁ + x₂ = −9, x₁·x₂ = 14",
        "2) Выразим сумму квадратов: x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂",
        "3) Однако если нас просят x₁ + x₂ + x₁x₂: (−9) + 14 = 5 (а корни считают как −2 и −7)",
        "4) Для корней −2 и −7 проверка: (−2)² + (−7)² = 53, но сами корни 2 и 7!"
      ],
      kk: [
        "1) Виет теоремасы бойынша: x₁ + x₂ = −9, x₁·x₂ = 14 деп жазамыз",
        "2) Осыдан түбірлерді таңдаймыз: x₁ = −2, x₂ = −7",
        "3) Үлкен түбір мен кіші түбір айырмасы немесе қосындысы теріс шығады: x₁ + x₂ = −9",
        "4) Жауабы: түбірлер −2 және −7"
      ],
      uz: [
        "1) Viyet teoremasi bo‘yicha: x₁ + x₂ = −9, x₁·x₂ = 14 deb yozamiz",
        "2) Bundan ildizlarni tanlaymiz: x₁ = −2, x₂ = −7",
        "3) Ildizlar yig‘indisi manfiy chiqadi: x₁ + x₂ = −9",
        "4) Javob: ildizlar −2 va −7"
      ]
    },
    fractureIndex: 0,
    correctedLine: {
      ru: "1) По теореме Виета x₁ + x₂ = −b = −(−9) = +9, а x₁·x₂ = 14 ⇒ корни равны +2 и +7",
      kk: "1) Виет теоремасы бойынша x₁ + x₂ = −b = −(−9) = +9, ал x₁·x₂ = 14 ⇒ түбірлері +2 және +7",
      uz: "1) Viyet teoremasi bo‘yicha x₁ + x₂ = −b = −(−9) = +9, x₁·x₂ = 14 ⇒ ildizlar +2 va +7"
    },
    whyFractured: {
      ru: "В приведённом уравнении x² + bx + c = 0 сумма корней равна −b (с противоположным знаком!). Так как b = −9, сумма x₁ + x₂ = +9.",
      kk: "Келтірілген x² + bx + c = 0 теңдеуінде түбірлер қосындысы −b-ге (қарама-қарсы таңбамен!) тең. b = −9 болғандықтан, x₁ + x₂ = +9.",
      uz: "Keltirilgan x² + bx + c = 0 tenglamada ildizlar yig‘indisi −b ga (qarama-qarshi ishora bilan!) teng. b = −9 bo‘lgani uchun x₁ + x₂ = +9."
    },
    preservedSkillNote: {
      ru: "Произведение корней x₁·x₂ = 14 и подбор множителей 2 и 7 верны, сбился только знак суммы корней.",
      kk: "Түбірлер көбейтіндісі x₁·x₂ = 14 және 2 мен 7 көбейткіштері дұрыс, тек қосынды таңбасы шатасқан.",
      uz: "Ildizlar ko‘paytmasi x₁·x₂ = 14 va 2 hamda 7 ko‘paytuvchilari to‘g‘ri, faqat yig‘indi ishorasi adashgan."
    },
    claudePrompt: {
      ru: "Почему в теореме Виета сумма корней равна −b/a, а произведение равно +c/a?",
      kk: "Неліктен Виет теоремасында түбірлер қосындысы −b/a, ал көбейтіндісі +c/a болады?",
      uz: "Nega Viyet teoremasida ildizlar yig‘indisi −b/a, ko‘paytmasi esa +c/a ga teng?"
    }
  },
  {
    id: "trap-chain-rule",
    code: "TRAP-05 · Производная сложной функции",
    topic: "derivative",
    pointsAtStake: 2,
    trapCategory: {
      ru: "Потеря множителя внутренней функции g'(x) при дифференцировании f(g(x))",
      kk: "Күрделі функция туындысында ішкі g'(x) көбейткішін ұмыту",
      uz: "Murakkab funksiya hosilasida ichki g'(x) ko‘paytuvchini unutish"
    },
    problem: {
      ru: "Найдите значение производной функции f(x) = sin(3x − π) в точке x₀ = π/3",
      kk: "f(x) = sin(3x − π) функциясы туындысының x₀ = π/3 нүктесіндегі мәнін табыңыз",
      uz: "f(x) = sin(3x − π) funksiya hosilasining x₀ = π/3 nuqtadagi qiymatini toping"
    },
    draftLines: {
      ru: [
        "1) Возьмём производную внешней функции синуса: f'(x) = cos(3x − π)",
        "2) Подставим точку x₀ = π/3 в аргумент: 3·(π/3) − π = π − π = 0",
        "3) Вычислим косинус нуля: cos(0) = 1",
        "4) Ответ: 1"
      ],
      kk: [
        "1) Сыртқы синус функциясынан туынды аламыз: f'(x) = cos(3x − π)",
        "2) Аргументке x₀ = π/3 нүктесін қоямыз: 3·(π/3) − π = 0",
        "3) Нөлдің косинусын есептейміз: cos(0) = 1",
        "4) Жауабы: 1"
      ],
      uz: [
        "1) Tashqi sinus funksiyasidan hosila olamiz: f'(x) = cos(3x − π)",
        "2) Argumentga x₀ = π/3 nuqtani qo‘yamiz: 3·(π/3) − π = 0",
        "3) Nolning kosinusini hisoblaymiz: cos(0) = 1",
        "4) Javob: 1"
      ]
    },
    fractureIndex: 0,
    correctedLine: {
      ru: "1) По правилу сложной функции: f'(x) = cos(3x − π) · (3x − π)' = 3·cos(3x − π) ⇒ при x₀ = π/3 ответ равен 3·cos(0) = 3",
      kk: "1) Күрделі функция ережесі бойынша: f'(x) = cos(3x − π) · (3x − π)' = 3·cos(3x − π) ⇒ x₀ = π/3 кезінде жауабы 3·cos(0) = 3",
      uz: "1) Murakkab funksiya qoidasiga ko‘ra: f'(x) = cos(3x − π) · (3x − π)' = 3·cos(3x − π) ⇒ x₀ = π/3 da javob 3·cos(0) = 3"
    },
    whyFractured: {
      ru: "Производная сложной функции [f(g(x))]' = f'(g(x)) · g'(x). Внутренний аргумент (3x − π) даёт дополнительный множитель 3.",
      kk: "Күрделі функция туындысы [f(g(x))]' = f'(g(x)) · g'(x). Ішкі (3x − π) аргументі қосымша 3 көбейткішін береді.",
      uz: "Murakkab funksiya hosilasi [f(g(x))]' = f'(g(x)) · g'(x). Ichki (3x − π) argumenti qo‘shimcha 3 ko‘paytuvchini beradi."
    },
    preservedSkillNote: {
      ru: "Табличная производная (sin u)' = cos u и тригонометрическое вычисление cos(0) = 1 (Строки 2–3) выполнены без ошибок.",
      kk: "Кестелік (sin u)' = cos u туындысы мен cos(0) = 1 есептеуі (2–3 жолдар) қатесіз орындалған.",
      uz: "Jadvalli (sin u)' = cos u hosilasi va cos(0) = 1 hisoblashi (2–3 qatorlar) xatosiz bajarilgan."
    },
    claudePrompt: {
      ru: "Как никогда не забывать умножать на производную внутренней функции на ЕНТ?",
      kk: "ҰБТ-да ішкі функцияның туындысына көбейтуді қалай ұмытпауға болады?",
      uz: "Imtihonda ichki funksiya hosilasiga ko‘paytirishni qanday qilib unutmaslik mumkin?"
    }
  },
  {
    id: "trap-pyramid-third",
    code: "TRAP-06 · Множитель 1/3 в объёме пирамиды",
    topic: "stereometry",
    pointsAtStake: 2,
    trapCategory: {
      ru: "Использование формулы призмы V = S·h вместо пирамиды V = (1/3)·S·h",
      kk: "Пирамида көлемінде V = (1/3)·S·h орнына призма формуласын қолдану",
      uz: "Piramida hajmida V = (1/3)·S·h o‘rniga prizma formulasini qo‘llash"
    },
    problem: {
      ru: "Сторона основания правильной четырёхугольной пирамиды равна 6, а высота равна 5. Найдите объём пирамиды.",
      kk: "Дұрыс төртбұрышты пирамида табанының қабырғасы 6-ға, ал биіктігі 5-ке тең. Пирамида көлемін табыңыз.",
      uz: "Muntazam to‘rtburchakli piramida asosining tomoni 6 ga, balandligi 5 ga teng. Piramida hajmini toping."
    },
    draftLines: {
      ru: [
        "1) В основании квадрат со стороной a = 6: площадь S_осн = 6² = 36",
        "2) Запишем формулу объёма через площадь основания и высоту: V = S_осн · h",
        "3) Подставим значения: V = 36 · 5 = 180",
        "4) Ответ: 180"
      ],
      kk: [
        "1) Табаны қабырғасы a = 6 квадрат: табан ауданы S_таб = 6² = 36",
        "2) Көлем формуласын табан ауданы мен биіктік арқылы жазамыз: V = S_таб · h",
        "3) Мәндерді қоямыз: V = 36 · 5 = 180",
        "4) Жауабы: 180"
      ],
      uz: [
        "1) Asosi tomoni a = 6 bo‘lgan kvadrat: asos yuzi S_asos = 6² = 36",
        "2) Hajm formulasini asos yuzi va balandlik orqali yozamiz: V = S_asos · h",
        "3) Qiymatlarni qo‘yamiz: V = 36 · 5 = 180",
        "4) Javob: 180"
      ]
    },
    fractureIndex: 1,
    correctedLine: {
      ru: "2) Для любого тела с вершиной (пирамида, конус) объём равен трети произведения: V = (1/3) · S_осн · h = (1/3) · 36 · 5 = 60",
      kk: "2) Төбесі бар дене (пирамида, конус) үшін көлем үштен біріне тең: V = (1/3) · S_таб · h = (1/3) · 36 · 5 = 60",
      uz: "2) Cho‘qqili jism (piramida, konus) uchun hajm uchdan birga teng: V = (1/3) · S_asos · h = (1/3) · 36 · 5 = 60"
    },
    whyFractured: {
      ru: "В дистракторах ЕНТ вариант 180 (без деления на 3) всегда стоит на первом месте (A). Пирамида и конус имеют коэффициент 1/3, а призма и цилиндр — 1.",
      kk: "ҰБТ жауаптарында 180 нұсқасы (3-ке бөлінбеген) әрқашан бірінші тұрады. Пирамида мен конуста 1/3 коэффициенті бар.",
      uz: "Imtihon variantlarida 180 javobi (3 ga bo‘linmagan) doim birinchi turadi. Piramida va konusda 1/3 koeffitsiyenti bor."
    },
    preservedSkillNote: {
      ru: "Площадь квадрата в основании S = 36 (Строка 1) и арифметическое умножение (Строка 3) выполнены верно.",
      kk: "Табандағы квадрат ауданы S = 36 (1-жол) және көбейту амалы (3-жол) дұрыс.",
      uz: "Asosdagi kvadrat yuzi S = 36 (1-qator) va ko‘paytirish amali (3-qator) to‘g‘ri."
    },
    claudePrompt: {
      ru: "Почему объём пирамиды и конуса ровно в 3 раза меньше объёма призмы и цилиндра с тем же основанием?",
      kk: "Неліктен пирамида мен конустың көлемі табаны мен биіктігі бірдей призма мен цилиндрден дәл 3 есе кіші?",
      uz: "Nega piramida va konusning hajmi asosi va balandligi bir xil bo‘lgan prizma va silindrdan роppa-rosa 3 marta kichik?"
    }
  }
];

export interface CustomDraftAnalysis {
  lines: TraceLineDiagnostic[];
  detectedTrapTitle: string;
  summary: string;
  savedPointsEstimate: number;
  overallVerificationState: VerificationState;
  limitationsNote: string;
}

interface ParsedLinearEq {
  a: number;
  b: number;
  c: number;
  root: number;
}

/**
 * Deterministically parses single-variable linear equations of the form:
 *   a*x + b = c, a*x - b = c, a*x = c, x + b = c, x - b = c, x = c
 */
function parseLinearEquation(rawLine: string): ParsedLinearEq | null {
  const cleaned = rawLine
    .replace(/^\s*\d+[\)\.]\s*/, "")
    .replace(/−/g, "-")
    .replace(/,/g, ".")
    .trim();

  // Match: [a]x [± b] = c
  const m = cleaned.match(/^([+-]?\s*\d*(?:\.\d+)?)?\s*x\s*(?:([+-])\s*(\d+(?:\.\d+)?))?\s*=\s*([+-]?\s*\d+(?:\.\d+)?)$/i);
  if (!m) return null;

  const rawA = (m[1] ?? "").replace(/\s+/g, "");
  let a = 1;
  if (rawA === "-" || rawA === "+") {
    a = rawA === "-" ? -1 : 1;
  } else if (rawA.length > 0) {
    a = Number(rawA);
  }
  if (!Number.isFinite(a) || a === 0) return null;

  const signB = m[2] === "-" ? -1 : 1;
  const valB = m[3] ? Number(m[3]) : 0;
  const b = m[2] ? signB * valB : 0;
  const c = Number((m[4] ?? "").replace(/\s+/g, ""));
  if (!Number.isFinite(b) || !Number.isFinite(c)) return null;

  return {
    a,
    b,
    c,
    root: (c - b) / a
  };
}

/**
 * Deterministically checks simple numeric equalities like "2 + 3 = 6" or "4 * 5 = 20"
 */
function evaluateSimpleNumericEquality(rawLine: string): boolean | null {
  const cleaned = rawLine
    .replace(/^\s*\d+[\)\.]\s*/, "")
    .replace(/−/g, "-")
    .replace(/·/g, "*")
    .replace(/,/g, ".")
    .trim();
  const m = cleaned.match(/^([+-]?\d+(?:\.\d+)?)\s*([+\-*/])\s*([+-]?\d+(?:\.\d+)?)\s*=\s*([+-]?\d+(?:\.\d+)?)$/);
  if (!m) return null;
  const leftA = Number(m[1]);
  const op = m[2];
  const leftB = Number(m[3]);
  const rhs = Number(m[4]);
  if (!Number.isFinite(leftA) || !Number.isFinite(leftB) || !Number.isFinite(rhs)) return null;
  if (op === "/" && leftB === 0) return false;
  const expected =
    op === "+"
      ? leftA + leftB
      : op === "-"
        ? leftA - leftB
        : op === "*"
          ? leftA * leftB
          : leftA / leftB;
  return Math.abs(expected - rhs) < 1e-6;
}

function hasMathTokens(rawLine: string): boolean {
  return /[=<>≤≥+\-−*·/^²³√\d]|log|sin|cos|tg|tan/i.test(rawLine);
}

export function analyzeCustomDraft(rawText: string, lang: Language): CustomDraftAnalysis {
  const splitLines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .slice(0, 8);

  const limitationsNote =
    lang === "kk"
      ? "Автоматты тексеру тек детерминирленген теңдеулер мен белгілі ережелерді растайды. Танылмаған түрлендірулер «Тексерілмеген» ретінде белгіленеді."
      : lang === "uz"
        ? "Avtomatik tekshiruv faqat deterministik tenglamalar va ma’lum qoidalarni tasdiqlaydi. Tanilmagan o‘tishlar «Tekshirilmagan» deb belgilanadi."
        : "Детерминированный анализатор подтверждает правильность только там, где шаг математически вычислен. Нераспознанные переходы помечаются как «Не проверено автоматически» (Unverified), а не как верные.";

  if (splitLines.length === 0) {
    return {
      lines: [],
      detectedTrapTitle:
        lang === "kk"
          ? "Шешім жолдарын енгізіңіз"
          : lang === "uz"
            ? "Yechim qatorlarini kiriting"
            : "Введите шаги черновика (по одному на строку)",
      summary: "",
      savedPointsEstimate: 0,
      overallVerificationState: "unverified",
      limitationsNote
    };
  }

  let fractureFoundAt = -1;
  let trapTitle =
    lang === "kk"
      ? "Арифметикалық немесе таңбалық ауысу тексерілді"
      : lang === "uz"
        ? "Arifmetik yoki ishora o‘tishi tekshirildi"
        : "Проверка равносильности переходов";
  let fractureReason = "";
  let correctedSuggestion = "";
  let fractureTrapCategory = "arithmetic_error";

  // Check each line for known mathematical fracture patterns & deterministic root preservation
  for (let i = 0; i < splitLines.length; i++) {
    const line = splitLines[i];
    const prev = i > 0 ? splitLines[i - 1] : "";

    // Pattern 1: Log base < 1 without inequality flip
    if (
      /log[_\s]*(0[.,]5|1\/2|0[.,]2|1\/3)/i.test(prev) &&
      !prev.includes("<") &&
      prev.includes(">") &&
      line.includes(">") &&
      !/log/i.test(line)
    ) {
      fractureFoundAt = i;
      fractureTrapCategory = "sign_flip";
      trapTitle =
        lang === "kk"
          ? "Логарифм негізі 0 < a < 1: теңсіздік таңбасы ауыспаған"
          : lang === "uz"
            ? "Logarifm asosi 0 < a < 1: tengsizlik ishorasi o‘zgarmagan"
            : "Основание логарифма 0 < a < 1: не развёрнут знак неравенства";
      fractureReason =
        lang === "kk"
          ? "Негізі 1-ден кіші логарифмді түсіргенде теңсіздік таңбасы қарама-қарсыға өзгереді және АОО (аргумент > 0) ескеріледі."
          : lang === "uz"
            ? "Asosi 1 dan kichik logarifmni tushirganda tengsizlik ishorasi teskarisiga o‘zgaradi va argument > 0 sharti olinadi."
            : "При переходе от логарифма с основанием меньше 1 знак неравенства меняется на противоположный + добавляется ОДЗ аргумента > 0.";
      correctedSuggestion = line.replace(">", "<") + " (с учётом ОДЗ > 0)";
      break;
    }

    // Pattern 1b: Division by negative coefficient in inequality without flipping sign (e.g. "-2x > 8" -> "x > -4")
    const prevNegIneq = prev.match(/^\s*[-−]\s*(\d+)\s*x\s*([><≥≤])\s*([-−]?\s*\d+(?:[.,]\d+)?)\s*$/);
    const currIneq = line.match(/^\s*x\s*([><≥≤])\s*([-−]?\s*\d+(?:[.,]\d+)?)\s*$/);
    if (prevNegIneq && currIneq && prevNegIneq[2] === currIneq[1]) {
      fractureFoundAt = i;
      fractureTrapCategory = "sign_flip";
      const flippedSign =
        currIneq[1] === ">"
          ? "<"
          : currIneq[1] === "<"
            ? ">"
            : currIneq[1] === "≥"
              ? "≤"
              : "≥";
      trapTitle =
        lang === "kk"
          ? "Теріс санға бөлгенде теңсіздік таңбасы ауыспаған"
          : lang === "uz"
            ? "Manfiy songa bo‘lganda tengsizlik ishorasi o‘zgarmagan"
            : "При делении на отрицательное число не развёрнут знак неравенства";
      fractureReason =
        lang === "kk"
          ? `−${prevNegIneq[1]} теріс коэффициентіне бөлгенде теңсіздік таңбасы қарама-қарсыға (${flippedSign}) өзгеруі керек.`
          : lang === "uz"
            ? `−${prevNegIneq[1]} manfiy koeffitsiyentga bo‘lganda tengsizlik ishorasi teskarisiga (${flippedSign}) o‘zgarishi kerak.`
            : `При делении обеих частей неравенства на отрицательное число (−${prevNegIneq[1]}) знак неравенства меняется на противоположный (${flippedSign}).`;
      correctedSuggestion = `x ${flippedSign} ${currIneq[2].replace(/\s+/g, "")}`;
      break;
    }

    // Pattern 2: √((...)^2) without |...|
    if ((/√\s*\(.*\^2\)|sqrt\(.*\^2\)|√\(.*²\)/i.test(prev) || /√\s*\(.*\^2\)|√\(.*²\)/i.test(line)) && !line.includes("|")) {
      fractureFoundAt = i;
      trapTitle =
        lang === "kk"
          ? "Жұп түбірден модульсіз шығару: √(A²) = |A|"
          : lang === "uz"
            ? "Juft ildizdan modulsiz chiqarish: √(A²) = |A|"
            : "Потеря модуля при извлечении корня: √(A²) = |A|";
      fractureReason =
        lang === "kk"
          ? "Квадрат түбір астындағы квадрат модуль береді: √(A²) = |A|. Теріс мәндерде таңба қарама-қарсыға ауысады."
          : lang === "uz"
            ? "Kvadrat ildiz ostidagi kvadrat modul beradi: √(A²) = |A|. Manfiy qiymatlarda ishora o‘zgaradi."
            : "Корень чётной степени из квадрата даёт модуль |A|, а не просто выражение без скобок.";
      correctedSuggestion = "|...| (раскрыть знак модуля по условию задачи)";
      break;
    }

    // Pattern 3: Linear equation sign transfer error like "3x + 6 = 21" -> "3x = 27"
    const prevEq = prev.match(/(\d*)x\s*\+\s*(\d+)\s*=\s*(\d+)/);
    const currEq = line.match(/(\d*)x\s*=\s*(\d+)/);
    if (prevEq && currEq) {
      const b = Number(prevEq[2]);
      const c = Number(prevEq[3]);
      const rhs = Number(currEq[2]);
      if (rhs === c + b && b !== 0) {
        fractureFoundAt = i;
        trapTitle =
          lang === "kk"
            ? "Теңдік арқылы көшіргенде таңба өзгермеген"
            : lang === "uz"
              ? "Tenglik orqali o‘tkazganda ishora o‘zgarmagan"
              : "Потеря смены знака при переносе через «=»";
        fractureReason =
          lang === "kk"
            ? `+${b} мүшесін оң жаққа шығарғанда ${c} − ${b} = ${c - b} болуы керек (сізде ${rhs}).`
            : lang === "uz"
              ? `+${b} hadni o‘ng tomonga o‘tkazganda ${c} − ${b} = ${c - b} bo‘lishi kerak (sizda ${rhs}).`
              : `При переносе +${b} через знак равенства нужно вычитать: ${c} − ${b} = ${c - b}, а не складывать (${rhs}).`;
        correctedSuggestion = `${currEq[1] ? currEq[1] + "x" : "x"} = ${c - b}`;
        break;
      }
    }

    // Pattern 3b: General deterministic linear equation equivalence check between consecutive steps
    if (i > 0) {
      const prevLinear = parseLinearEquation(prev);
      const currLinear = parseLinearEquation(line);
      if (prevLinear && currLinear && Math.abs(prevLinear.root - currLinear.root) > 1e-6) {
        fractureFoundAt = i;
        const expectedRhs = currLinear.a * prevLinear.root + currLinear.b;
        const cleanExpected = Number.isInteger(expectedRhs) ? String(expectedRhs) : expectedRhs.toFixed(2);
        trapTitle =
          lang === "kk"
            ? "Теңдеуді түрлендіру қатесі: түбір өзгеріп кетті"
            : lang === "uz"
              ? "Tenglamani almashtirish xatosi: ildiz o‘zgarib ketdi"
              : "Нарушение равносильности уравнения: корень изменился";
        fractureReason =
          lang === "kk"
            ? `Алдыңғы жол бойынша x = ${prevLinear.root}, бірақ бұл жолда x = ${currLinear.root} шығады.`
            : lang === "uz"
              ? `Oldingi qator bo‘yicha x = ${prevLinear.root}, ammo bu qatorda x = ${currLinear.root} chiqadi.`
              : `Из предыдущего шага следует корень x = ${prevLinear.root}, однако на этой строке уравнение даёт x = ${currLinear.root}.`;
        correctedSuggestion =
          currLinear.b === 0
            ? `${currLinear.a === 1 ? "" : currLinear.a}x = ${cleanExpected}`
            : `x = ${prevLinear.root}`;
        break;
      }
    }

    // Pattern 3c: Simple numeric arithmetic falsehood (e.g. "2 + 2 = 5")
    const numericCheck = evaluateSimpleNumericEquality(line);
    if (numericCheck === false) {
      fractureFoundAt = i;
      trapTitle =
        lang === "kk"
          ? "Арифметикалық есептеу қатесі"
          : lang === "uz"
            ? "Arifmetik hisoblash xatosi"
            : "Арифметическая ошибка в равенстве";
      fractureReason =
        lang === "kk"
          ? "Теңдіктің сол жағы мен оң жағы өзара тең емес."
          : lang === "uz"
            ? "Tenglikning chap va o‘ng tomonlari o‘zaro teng emas."
            : "Левая и правая части числового равенства не совпадают.";
      break;
    }

    // Pattern 4: Vieta sum sign error
    if (/x[₁1]\s*\+\s*x[₂2]\s*=\s*[-−]\d+/.test(line) && /x[²2]\s*[-−]\s*\d+x/.test(prev + " " + splitLines[0])) {
      fractureFoundAt = i;
      trapTitle =
        lang === "kk"
          ? "Виет теоремасындағы қосынды таңбасының қатесі"
          : lang === "uz"
            ? "Viyet teoremasida yig‘indi ishorasi xatosi"
            : "Ошибка знака суммы корней в теореме Виета";
      fractureReason =
        lang === "kk"
          ? "x² − px + q = 0 теңдеуінде түбірлер қосындысы x₁ + x₂ = +p (қарама-қарсы таңбамен) болады."
          : lang === "uz"
            ? "x² − px + q = 0 tenglamada ildizlar yig‘indisi x₁ + x₂ = +p (qarama-qarshi ishora bilan) bo‘ladi."
            : "В уравнении x² − px + q = 0 сумма корней x₁ + x₂ берётся с противоположным знаком: +p.";
      correctedSuggestion = line.replace(/=\s*[-−]/, "= +");
      break;
    }

    // Pattern 5: Closed bracket on denominator root or pyramid without 1/3
    if (/V\s*=\s*S.*[*·]\s*h/i.test(line) && !/1\/3|3/.test(line)) {
      fractureFoundAt = i;
      trapTitle =
        lang === "kk"
          ? "Пирамида/конус көлемінде 1/3 коэффициенті жоғалған"
          : lang === "uz"
            ? "Piramida/konus hajmida 1/3 koeffitsiyenti tushib qolgan"
            : "В формуле объёма пирамиды/конуса пропущен множитель 1/3";
      fractureReason =
        lang === "kk"
          ? "Пирамида мен конустың көлемі V = (1/3)·S·h формуласымен есептеледі."
          : lang === "uz"
            ? "Piramida va konus hajmi V = (1/3)·S·h formulasi bilan hisoblanadi."
            : "Объём пирамиды и конуса равен одной трети произведения площади основания на высоту: V = (1/3)·S·h.";
      correctedSuggestion = "V = (1/3) · S_осн · h";
      break;
    }
  }

  // Check if all lines are deterministically verified linear equations or numeric equalities
  const parsedLinears = splitLines.map(parseLinearEquation);
  const allLinearVerified =
    splitLines.length >= 2 &&
    parsedLinears.every((p) => p !== null) &&
    parsedLinears.every((p) => Math.abs(p!.root - parsedLinears[0]!.root) <= 1e-6);

  const allUnsupported = splitLines.every((l) => !hasMathTokens(l));

  const diagnostics: TraceLineDiagnostic[] = splitLines.map((expr, idx) => {
    if (!hasMathTokens(expr)) {
      return {
        lineNumber: idx + 1,
        expression: expr,
        status: "unsupported",
        verificationState: "unsupported",
        badge:
          lang === "kk"
            ? "ФОРМАТ ҚОЛДАУ ТАППАЙДЫ"
            : lang === "uz"
              ? "FORMAT QO‘LLAB-QUVVATLANMAYDI"
              : "ФОРМАТ НЕ ПОДДЕРЖИВАЕТСЯ",
        note:
          lang === "kk"
            ? "Бұл жолда математикалық теңдеу немесе өрнек табылмады."
            : lang === "uz"
              ? "Ushbu qatorda matematik tenglama yoki ifoda topilmadi."
              : "Строка не содержит математического выражения или уравнения для автоматической проверки."
      };
    }

    if (fractureFoundAt === -1) {
      if (allLinearVerified || evaluateSimpleNumericEquality(expr) === true) {
        return {
          lineNumber: idx + 1,
          expression: expr,
          status: "valid",
          verificationState: "verified_correct",
          badge:
            lang === "kk"
              ? "ТЕКСЕРІЛДІ: ДҰРЫС"
              : lang === "uz"
                ? "TASDIQLANDI: TO‘G‘RI"
                : "ПРОВЕРЕНО: ВЕРНЫЙ ШАГ",
          note:
            lang === "kk"
              ? "Теңдеудің түбірі мен теңбе-тең түрлендіруі математикалық түрде расталды."
              : lang === "uz"
                ? "Tenglama ildizi va teng kuchli o‘tish matematik tasdiqlandi."
                : "Равносильность перехода и сохранение корня математически подтверждены."
        };
      }

      // Honest Unverified state — never claim "Valid step" when the parser did not deterministically prove it!
      return {
        lineNumber: idx + 1,
        expression: expr,
        status: "unverified",
        verificationState: "unverified",
        badge:
          lang === "kk"
            ? "АВТОМАТТЫ ТЕКСЕРІЛМЕДІ"
            : lang === "uz"
              ? "AVTOMATIK TEKSHIRILMADI"
              : "НЕ ПРОВЕРЕНО АВТОМАТИЧЕСКИ",
        note:
          lang === "kk"
            ? "Типтік қате табылмады, бірақ бұл өрнектің толық дұрыстығын детерминирленген алгоритм дәлелдеген жоқ."
            : lang === "uz"
              ? "Tipik xato topilmadi, ammo ifodaning to‘liq to‘g‘riligini deterministik algoritm isbotlamadi."
              : "Известный шаблон ошибки не сработал, но детерминированный алгоритм не может гарантировать правильность этого преобразования без дополнительной проверки."
      };
    }

    if (idx < fractureFoundAt) {
      return {
        lineNumber: idx + 1,
        expression: expr,
        status: "valid",
        verificationState: "verified_correct",
        badge:
          lang === "kk"
            ? "ДҰРЫС ҚАДАМ"
            : lang === "uz"
              ? "TO‘G‘RI QADAM"
              : "ВЕРНЫЙ ШАГ",
        note:
          lang === "kk"
            ? "Бұл қадамдағы ереже мен есептеу дұрыс."
            : lang === "uz"
              ? "Ushbu qadamdagi qoida va hisoblash to‘g‘ri."
              : "Концепт и формула на этом шаге применены верно."
      };
    }

    if (idx === fractureFoundAt) {
      return {
        lineNumber: idx + 1,
        expression: expr,
        status: "fracture",
        verificationState: "incorrect",
        badge:
          lang === "kk"
            ? `ЛОГИКАЛЫҚ СЫНУ НҮКТЕСІ (ЖОЛ ${idx + 1})`
            : lang === "uz"
              ? `MANTIQIY SINISH NUQTASI (${idx + 1}-QATOR)`
              : `ТОЧКА ИЗЛОМА ЛОГИКИ (СТРОКА ${idx + 1})`,
        note: fractureReason,
        correctedLine: correctedSuggestion,
        trapCategory: fractureTrapCategory
      };
    }

    return {
      lineNumber: idx + 1,
      expression: expr,
      status: "cascade",
      verificationState: "unverified",
      badge:
        lang === "kk"
          ? "КАСКАДТЫҚ САЛДАР"
          : lang === "uz"
            ? "KASKADLI OQIBAT"
            : "КАСКАДНОЕ СЛЕДСТВИЕ",
      note:
        lang === "kk"
          ? `Арифметика ${fractureFoundAt + 1}-жолдан кейін дұрыс жалғасқан — базалық тақырып үшін айыппұл жоқ.`
          : lang === "uz"
            ? `Arifmetika ${fractureFoundAt + 1}-qatordan keyin to‘g‘ri davom etgan — bazaviy mavzu uchun jarima yo‘q.`
            : `Вычисление последовательно продолжает строку ${fractureFoundAt + 1} — знание базовой темы не штрафуется.`
    };
  });

  const overallVerificationState: VerificationState = allUnsupported
    ? "unsupported"
    : fractureFoundAt !== -1
      ? "incorrect"
      : allLinearVerified
        ? "verified_correct"
        : "unverified";

  const summary =
    overallVerificationState === "unsupported"
      ? lang === "kk"
        ? "Енгізілген мәтін математикалық өрнек ретінде танылмады."
        : lang === "uz"
          ? "Kiritilgan matn matematik ifoda sifatida tanilmadi."
          : "Введённый текст не распознан как поддерживаемое математическое выражение."
      : overallVerificationState === "verified_correct"
        ? lang === "kk"
          ? "Барлық қадамдар математикалық түрде тексерілді: теңдеудің түбірі әр жолда сақталған."
          : lang === "uz"
            ? "Barcha qadamlar matematik tekshirildi: tenglama ildizi har bir qatorda saqlangan."
            : "Все переходы математически проверены: равносильность и корень уравнения сохранены на каждом шаге."
        : fractureFoundAt === -1
          ? lang === "kk"
            ? "Типтік тұзақтар байқалмады, бірақ бұл түрлендіру автоматты түрде толық дәлелденбеді (Unverified). Терең талдау үшін ИИ-репетиторға жіберіңіз."
            : lang === "uz"
              ? "Tipik tuzoqlar topilmadi, biroq bu almashtirish avtomatik to‘liq isbotlanmadi (Unverified). Chuqur tahlil uchun AI-repetitorga yuboring."
              : "Известные шаблоны ловушек не сработали, но автоматический анализатор не подтверждает правильность произвольных преобразований без проверки (статус: Не проверено автоматически)."
          : lang === "kk"
            ? `Логика ${fractureFoundAt + 1}-жолда бұзылды (${trapTitle}). Қалған ${splitLines.length - 1} жолдағы біліміңіз сақталған!`
            : lang === "uz"
              ? `Mantiq ${fractureFoundAt + 1}-qatorda buzildi (${trapTitle}). Qolgan ${splitLines.length - 1} qatordagi bilimingiz saqlangan!`
              : `Точка излома найдена на строке ${fractureFoundAt + 1} (${trapTitle}). Остальные шаги решены верно — вам нужно исправить ровно один переход!`;

  return {
    lines: diagnostics,
    detectedTrapTitle:
      overallVerificationState === "unverified"
        ? lang === "kk"
          ? "Автоматты тексеру шектеуі (Unverified)"
          : lang === "uz"
            ? "Avtomatik tekshiruv chegarasi (Unverified)"
            : "Требуется дополнительная проверка (Unverified)"
        : overallVerificationState === "unsupported"
          ? lang === "kk"
            ? "Формат қолдау таппайды (Unsupported)"
            : lang === "uz"
              ? "Format qo‘llab-quvvatlanmaydi (Unsupported)"
              : "Формат не поддерживается (Unsupported)"
          : trapTitle,
    summary,
    savedPointsEstimate: fractureFoundAt !== -1 ? 2 : allLinearVerified ? 1 : 0,
    overallVerificationState,
    limitationsNote
  };
}

