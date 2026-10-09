import { z } from 'zod';
import { topicIds, variantsPerTopic, type Language, type TopicId } from './curriculum.ts';

export type LabTopic = TopicId;
export const labTopics = topicIds;

export type Challenge = {
  id: string;
  topic: LabTopic;
  task: string;
  steps: string[];
  wrongStep: number;
  explanation: string;
  repair: string;
  transfer: string;
  answer: number;
  unit: string;
  hints: string[];
  solution: string;
};

const topicTitles: Record<Language, Record<LabTopic, string>> = {
  ru: {
    linear: 'Линейные уравнения',
    inequalities: 'Линейные и метод интервалов',
    systems: 'Системы уравнений',
    percent: 'Проценты, сплавы и смеси',
    probability: 'Классическая вероятность',
    combinatorics: 'Комбинаторика и статистика',
    radicals: 'Корни и иррациональные выражения',
    quadratic: 'Квадратные уравнения (Виет)',
    progressions: 'Арифметическая прогрессия (aₙ)',
    functions: 'Логарифмические уравнения',
    trigonometry: 'Тригонометрические тождества',
    derivative: 'Производная степенной функции',
    integrals: 'Первообразная и интеграл',
    planimetry: 'Площадь прямоугольного треугольника',
    vectors: 'Векторы и скалярное произведение',
    stereometry: 'Объём правильной пирамиды'
  },
  kk: {
    linear: 'Сызықтық теңдеулер',
    inequalities: 'Теңсіздіктер және интервалдар',
    systems: 'Теңдеулер жүйесі',
    percent: 'Пайыздар және қорытпалар',
    probability: 'Классикалық ықтималдық',
    combinatorics: 'Комбинаторика және статистика',
    radicals: 'Түбірлер және дәрежелер',
    quadratic: 'Квадрат теңдеулер (Виет)',
    progressions: 'Арифметикалық прогрессия (aₙ)',
    functions: 'Логарифмдік теңдеулер',
    trigonometry: 'Тригонометриялық тепе-теңдіктер',
    derivative: 'Дәрежелік функция туындысы',
    integrals: 'Алғашқы функция және интеграл',
    planimetry: 'Тікбұрышты үшбұрыш ауданы',
    vectors: 'Векторлар және скаляр көбейтінді',
    stereometry: 'Дұрыс пирамида көлемі'
  },
  uz: {
    linear: 'Chiziqli tenglamalar',
    inequalities: 'Tengsizliklar va intervallar',
    systems: 'Tenglamalar sistemasi',
    percent: 'Foizlar va qotishmalar',
    probability: 'Klassik ehtimollik',
    combinatorics: 'Kombinatorika va statistika',
    radicals: 'Ildizlar va darajalar',
    quadratic: 'Kvadrat tenglamalar (Viyet)',
    progressions: 'Arifmetik progressiya (aₙ)',
    functions: 'Logarifmik tenglamalar',
    trigonometry: 'Trigonometrik ayniyatlar',
    derivative: 'Darajali funksiya hosilasi',
    integrals: 'Boshlang‘ich funksiya va integral',
    planimetry: 'To‘g‘ri burchakli uchburchak yuzasi',
    vectors: 'Vektorlar va skalyar ko‘paytma',
    stereometry: 'Muntazam piramida hajmi'
  }
};

const text = {
  ru: {
    solve: 'Найдите x',
    subtract: 'Вычитаем',
    both: 'с обеих сторон',
    ineqFind: 'Найдите наименьшее целое решение x',
    ineqWhy: 'При делении обеих частей неравенства на отрицательное число знак неравенства обязательно меняется на противоположный.',
    ineqHint: 'Раздели на отрицательный коэффициент и поменяй знак < на >.',
    sysWhy: 'При почленном сложении уравнений (x + y) и (x − y) коэффициенты при x складываются: получается 2x, а не 1x.',
    sysHint: 'Сложи левые и правые части: 2x = сумма правых частей.',
    discount: 'Цена',
    off: 'скидка',
    pay: 'Сколько заплатить?',
    discountSum: 'Сумма скидки',
    final: 'Итоговая цена',
    bag: 'В мешке',
    red: 'красных и',
    blue: 'синих шаров.',
    chance: 'Шар выбирают случайно. Найдите вероятность синего шара.',
    fav: 'Подходящих исходов',
    total: 'Всего исходов',
    prob: 'Вероятность',
    combTask: 'Вычислите число сочетаний',
    combWhy: 'В сочетаниях порядок не важен, поэтому произведение n(n − 1) обязательно делится на 2! = 2.',
    combHint: 'Используй формулу C(n, 2) = n(n − 1) / 2.',
    radWhy: 'Чтобы избавиться от квадратного корня √A = r, правую часть нужно возвести в квадрат r², а не умножить на 2.',
    radHint: 'Возведи правую часть в квадрат и прибавь вычитаемое.',
    eqWhy: 'При вычитании числа справа нужно вычесть то же число слева. Иначе равенство изменится.',
    pctWhy: 'Процент скидки нужно умножить на исходную цену. Цена в тенге и число процентов — разные величины.',
    probWhy: 'В знаменателе нужны все шары, а не только красные. Каждый шар одинаково вероятен.',
    eqHint: 'Проверь действие с обеими сторонами.',
    pctHint: 'Сначала найди сумму скидки, затем вычти её.',
    probHint: 'Сначала посчитай все шары.',
    quadTask: 'Найдите больший корень уравнения',
    quadSum: 'По теореме Виета сумма корней',
    quadProd: 'Произведение корней',
    quadRoots: 'Корни и больший корень',
    quadWhy: 'По теореме Виета для x² − Sx + P = 0 сумма корней равна +S (с противоположным знаком), а не −S.',
    quadHint: 'Проверь знак суммы корней по теореме Виета: x₁ + x₂ = S.',
    progTask: 'В арифметической прогрессии',
    progFind6: 'Найдите 6-й член a₆.',
    progFind7: 'Найдите 7-й член a₇.',
    progWhy: 'В формуле aₙ = a₁ + (n − 1)d разность d умножается на (n − 1) шагов, а не на n.',
    progHint: 'От первого до n-го члена ровно (n − 1) шагов.',
    logWhy: 'Запись log_b(A) = 2 означает A = b² (возведение основания в квадрат), а не умножение b × 2.',
    logHint: 'Замени логарифм по определению: подлогарифмическое выражение равно основанию в степени.',
    trigTask: 'Вычислите значение выражения',
    trigWhy: 'По основному тригонометрическому тождеству sin²α + cos²α = 1, а не 2.',
    trigHint: 'Вынеси общий множитель перед sin² и cos² за скобки.',
    derivTask: 'Найдите значение производной f\'(2) для функции',
    derivWhy: 'По правилу (x³)\' = 3x² показатель степени уменьшается на единицу, а не остаётся равным 3.',
    derivHint: 'Сначала найди f\'(x) = 3ax² + b, затем подставь x = 2.',
    intTask: 'Вычислите определённый интеграл',
    intWhy: 'При интегрировании 3ax² показатель степени делится на 3: первообразная равна ax³, а не 3ax³.',
    intHint: 'Найди первообразную F(x) = ax³ + bx и вычисли F(2) − F(0).',
    planTask: 'Катеты прямоугольного треугольника равны',
    planFind: 'Найдите площадь треугольника.',
    planWhy: 'Площадь прямоугольного треугольника равна половине произведения катетов S = (a × b) / 2, а не полному произведению.',
    planHint: 'Умножь катеты и раздели произведение на 2.',
    vecTask: 'Найдите скалярное произведение векторов',
    vecWhy: 'Скалярное произведение равно сумме произведений одноимённых координат x₁x₂ + y₁y₂, а не сумме всех координат.',
    vecHint: 'Перемножь абсциссы x₁x₂, перемножь ординаты y₁y₂ и сложи результаты.',
    stereoTask: 'Сторона квадратного основания правильной пирамиды равна',
    stereoHeight: 'высота равна',
    stereoFind: 'Найдите объём пирамиды.',
    stereoWhy: 'Объём пирамиды равен одной трети произведения площади основания на высоту V = S × h / 3, а не S × h.',
    stereoHint: 'Найди площадь квадрата a², умножь на высоту h и раздели на 3.'
  },
  kk: {
    solve: 'x-ті табыңыз',
    subtract: 'Азайтамыз',
    both: 'екі жақтан',
    ineqFind: 'Ең кіші бүтін шешімін табыңыз',
    ineqWhy: 'Теңсіздіктің екі жағын теріс санға бөлгенде теңсіздік таңбасы қарама-қарсыға өзгереді.',
    ineqHint: 'Теріс коэффициентке бөліп, < таңбасын > таңбасына ауыстырыңыз.',
    sysWhy: '(x + y) және (x − y) теңдеулерін мүшелеп қосқанда x коэффициенттері қосылып, 2x шығады.',
    sysHint: 'Екі теңдеуді қосыңыз: 2x = оң жақтардың қосындысы.',
    discount: 'Баға',
    off: 'жеңілдік',
    pay: 'Қанша төлейсіз?',
    discountSum: 'Жеңілдік сомасы',
    final: 'Соңғы баға',
    bag: 'Қапта',
    red: 'қызыл және',
    blue: 'көк шар бар.',
    chance: 'Шар кездейсоқ алынады. Көк шардың ықтималдығын табыңыз.',
    fav: 'Қолайлы нәтижелер',
    total: 'Барлық нәтижелер',
    prob: 'Ықтималдық',
    combTask: 'Терулер санын есептеңіз',
    combWhy: 'Терулерде реттілік маңызды емес, сондықтан n(n − 1) көбейтіндісі 2! = 2 санына бөлінеді.',
    combHint: 'C(n, 2) = n(n − 1) / 2 формуласын қолданыңыз.',
    radWhy: '√A = r теңдеуінде түбірден құтылу үшін оң жақты 2-ге көбейтпей, квадраттаймыз (r²).',
    radHint: 'Оң жақты квадраттап, бос мүшені қосыңыз.',
    eqWhy: 'Оң жақтан санды азайтсақ, сол жақтан да сол санды азайтамыз. Әйтпесе теңдік өзгереді.',
    pctWhy: 'Жеңілдік пайызын бастапқы бағаға көбейту керек. Теңгемен баға мен пайыз саны — әртүрлі шамалар.',
    probWhy: 'Бөлімге тек қызыл емес, барлық шар кіреді. Әр шардың алыну мүмкіндігі бірдей.',
    eqHint: 'Екі жаққа жасалған амалды тексеріңіз.',
    pctHint: 'Алдымен жеңілдікті тауып, бағадан азайтыңыз.',
    probHint: 'Алдымен барлық шарды санаңыз.',
    quadTask: 'Теңдеудің үлкен түбірін табыңыз',
    quadSum: 'Виет теоремасы бойынша түбірлер қосындысы',
    quadProd: 'Түбірлер көбейтіндісі',
    quadRoots: 'Түбірлер және үлкен түбір',
    quadWhy: 'x² − Sx + P = 0 теңдеуінде Виет теоремасы бойынша түбірлер қосындысы −S емес, +S болады.',
    quadHint: 'Виет теоремасындағы қосынды таңбасын тексеріңіз: x₁ + x₂ = S.',
    progTask: 'Арифметикалық прогрессияда',
    progFind6: '6-шы мүшесін (a₆) табыңыз.',
    progFind7: '7-ші мүшесін (a₇) табыңыз.',
    progWhy: 'aₙ = a₁ + (n − 1)d формуласында d айырымы n-ге емес, (n − 1) қадамға көбейтіледі.',
    progHint: 'Бірінші мүшеден n-ші мүшеге дейін дәл (n − 1) қадам бар.',
    logWhy: 'log_b(A) = 2 жазбасы b × 2 емес, A = b² (негізді квадраттау) дегенді білдіреді.',
    logHint: 'Логарифм анықтамасын қолданыңыз: логарифм астындағы өрнек негіздің дәрежесіне тең.',
    trigTask: 'Өрнектің мәнін есептеңіз',
    trigWhy: 'Негізгі тригонометриялық тепе-теңдік бойынша sin²α + cos²α = 1 (2 емес).',
    trigHint: 'Ортақ көбейткішті жақша сыртына шығарыңыз.',
    derivTask: 'Функция үшін f\'(2) туынды мәнін табыңыз',
    derivWhy: '(x³)\' = 3x² ережесі бойынша дәреже көрсеткіші бірге кемиді, 3 күйінде қалмайды.',
    derivHint: 'Алдымен f\'(x) = 3ax² + b табыңыз, сосын x = 2 қойыңыз.',
    intTask: 'Анықталған интегралды есептеңіз',
    intWhy: '3ax² өрнегін интегралдағанда коэффициент 3-ке бөлінеді: алғашқы функция 3ax³ емес, ax³ болады.',
    intHint: 'F(x) = ax³ + bx алғашқы функциясын тауып, F(2) − F(0) есептеңіз.',
    planTask: 'Тікбұрышты үшбұрыштың катеттері',
    planFind: 'Үшбұрыштың ауданын табыңыз.',
    planWhy: 'Тікбұрышты үшбұрыш ауданы катеттер көбейтіндісінің жартысына тең: S = (a × b) / 2.',
    planHint: 'Катеттерді көбейтіп, нәтижені 2-ге бөліңіз.',
    vecTask: 'Векторлардың скаляр көбейтіндісін табыңыз',
    vecWhy: 'Скаляр көбейтінді сәйкес координаталар көбейтіндісінің қосындысына тең: x₁x₂ + y₁y₂.',
    vecHint: 'x₁x₂ және y₁y₂ көбейтінділерін тауып, оларды қосыңыз.',
    stereoTask: 'Дұрыс пирамиданың шаршы табанының қабырғасы',
    stereoHeight: 'биіктігі',
    stereoFind: 'Пирамиданың көлемін табыңыз.',
    stereoWhy: 'Пирамида көлемі S × h емес, табан ауданы мен биіктік көбейтіндісінің үштен біріне тең: V = S × h / 3.',
    stereoHint: 'Алдымен a² табан ауданын тауып, h биіктікке көбейтіп, 3-ке бөліңіз.'
  },
  uz: {
    solve: 'x ni toping',
    subtract: 'Ayiramiz',
    both: 'ikkala tomondan',
    ineqFind: 'Eng kichik butun yechimni toping',
    ineqWhy: 'Tengsizlikning ikkala tomonini manfiy songa bo‘lganda tengsizlik ishorasi qarama-qarshiga o‘zgaradi.',
    ineqHint: 'Manfiy koeffitsiyentga bo‘lib, < ishorasini > ga almashtiring.',
    sysWhy: '(x + y) va (x − y) tenglamalarni qo‘shganda x oldidagi koeffitsiyentlar qo‘shilib, 2x hosil bo‘ladi.',
    sysHint: 'Ikkala tenglamani qo‘shing: 2x = o‘ng tomonlar yig‘indisi.',
    discount: 'Narx',
    off: 'chegirma',
    pay: 'Qancha to‘lanadi?',
    discountSum: 'Chegirma summasi',
    final: 'Yakuniy narx',
    bag: 'Xaltada',
    red: 'qizil va',
    blue: 'ko‘k shar bor.',
    chance: 'Shar tasodifiy olinadi. Ko‘k shar ehtimolini toping.',
    fav: 'Mos natijalar',
    total: 'Jami natijalar',
    prob: 'Ehtimollik',
    combTask: 'Kombinatsiyalar sonini hisoblang',
    combWhy: 'Kombinatsiyalarda tartib muhim emas, shuning uchun n(n − 1) ko‘paytma 2! = 2 ga bo‘linadi.',
    combHint: 'C(n, 2) = n(n − 1) / 2 formulasidan foydalaning.',
    radWhy: '√A = r tenglamada ildizdan qutulish uchun o‘ng tomonni 2 ga ko‘paytirmay, kvadratga oshiramiz (r²).',
    radHint: 'O‘ng tomonni kvadratga oshirib, ozod hadni qo‘shing.',
    eqWhy: 'O‘ng tomondan sonni ayirsak, chap tomondan ham shu sonni ayiramiz. Aks holda tenglik o‘zgaradi.',
    pctWhy: 'Chegirma foizini boshlang‘ich narxga ko‘paytirish kerak. Tengedagi narx va foiz soni turli kattaliklar.',
    probWhy: 'Maxrajga faqat qizil emas, barcha sharlar kiradi. Har bir shar teng ehtimolli.',
    eqHint: 'Ikkala tomonga qo‘llangan amalni tekshiring.',
    pctHint: 'Avval chegirmani topib, narxdan ayiring.',
    probHint: 'Avval barcha sharlarni sanang.',
    quadTask: 'Tenglamaning katta ildizini toping',
    quadSum: 'Viyet teoremasiga ko‘ra ildizlar yig‘indisi',
    quadProd: 'Ildizlar ko‘paytmasi',
    quadRoots: 'Ildizlar va katta ildiz',
    quadWhy: 'x² − Sx + P = 0 tenglamada Viyet teoremasiga ko‘ra ildizlar yig‘indisi −S emas, +S ga teng.',
    quadHint: 'Viyet teoremasida ildizlar yig‘indisi ishorasini tekshiring: x₁ + x₂ = S.',
    progTask: 'Arifmetik progressiyada',
    progFind6: '6-hadini (a₆) toping.',
    progFind7: '7-hadini (a₇) toping.',
    progWhy: 'aₙ = a₁ + (n − 1)d formulada d ayirma n ga emas, (n − 1) qadamga ko‘paytiriladi.',
    progHint: 'Birinchi haddan n-hadgacha roppa-rosa (n − 1) qadam bor.',
    logWhy: 'log_b(A) = 2 yozuvi b × 2 emas, A = b² (asosni kvadratga oshirish) deganidir.',
    logHint: 'Logarifm ta’rifini qo‘llang: logarifm ostidagi ifoda asosning darajasiga teng.',
    trigTask: 'Ifodaning qiymatini hisoblang',
    trigWhy: 'Asosiy trigonometrik ayniyatga ko‘ra sin²α + cos²α = 1 ga teng (2 emas).',
    trigHint: 'Umumiy ko‘paytuvchini qavsdan tashqariga chiqaring.',
    derivTask: 'Funksiya uchun f\'(2) hosila qiymatini toping',
    derivWhy: '(x³)\' = 3x² qoidaga ko‘ra daraja ko‘rsatkichi bittaga kamayadi, 3 bo‘lib qolmaydi.',
    derivHint: 'Avval f\'(x) = 3ax² + b ni toping, so‘ng x = 2 qo‘ying.',
    intTask: 'Aniq integralni hisoblang',
    intWhy: '3ax² ni integrallashda koeffitsiyent 3 ga bo‘linadi: boshlang‘ich funksiya 3ax³ emas, ax³ bo‘ladi.',
    intHint: 'F(x) = ax³ + bx boshlang‘ich funksiyani topib, F(2) − F(0) ni hisoblang.',
    planTask: 'To‘g‘ri burchakli uchburchak katetlari',
    planFind: 'Uchburchak yuzasini toping.',
    planWhy: 'To‘g‘ri burchakli uchburchak yuzasi katetlar ko‘paytmasining yarmiga teng: S = (a × b) / 2.',
    planHint: 'Katetlarni ko‘paytirib, natijani 2 ga bo‘ling.',
    vecTask: 'Vektorlarning skalyar ko‘paytmasini toping',
    vecWhy: 'Skalyar ko‘paytma mos koordinatalar ko‘paytmasining yig‘indisiga teng: x₁x₂ + y₁y₂.',
    vecHint: 'x₁x₂ va y₁y₂ ko‘paytmalarni topib, ularni qo‘shing.',
    stereoTask: 'Muntazam piramidaning kvadrat asosi tomoni',
    stereoHeight: 'balandligi',
    stereoFind: 'Piramida hajmini toping.',
    stereoWhy: 'Piramida hajmi S × h emas, asos yuzasi va balandlik ko‘paytmasining uchdan biriga teng: V = S × h / 3.',
    stereoHint: 'Avval a² asos yuzasini toping, h balandlikka ko‘paytiring va 3 ga bo‘ling.'
  }
};

export function topicName(topic: LabTopic, language: Language) {
  return topicTitles[language][topic];
}

const edgeReasons: Record<Language, Record<LabTopic, [string, string]>> = {
  ru: {
    linear: ['Число вычли только справа. Одинаковое действие нужно применять к обеим сторонам.', 'В последнем шаге нужно делить на коэффициент перед x.'],
    inequalities: ['При переносе слагаемого в правую часть забыли поменять знак.', 'В строгом неравенстве x > k наименьшее целое решение равно k + 1, а не k.'],
    systems: ['При сложении уравнений вычли правые части вместо их сложения.', 'В последнем шаге забыли разделить сумму на коэффициент 2.'],
    percent: ['Процент — сотая доля. Нужно делить на 100, не на 10.', 'Скидка уменьшает цену: её вычитают, а не прибавляют.'],
    probability: ['Спрашивают о синем шаре. Нужно считать синие, а не красные шары.', 'В числителе — подходящие исходы, в знаменателе — все. Дробь перевёрнута.'],
    combinatorics: ['В числителе для C(n, 2) берут n(n − 1), а не n(n + 1).', 'При делении произведения на 2 разделили на 4 вместо 2! = 2.'],
    radicals: ['Подкоренное выражение не может равняться сумме без возведения в квадрат.', 'При переносе вычитаемого в правую часть нужно прибавить число, а не вычесть.'],
    quadratic: ['Произведение и сумма корней перепутаны местами.', 'В ответе нужно выбрать больший из двух корней, а не меньший.'],
    progressions: ['Вместо первого члена a₁ подставили разность d.', 'В последнем шаге перемножили числа вместо сложения a₁ и прироста.'],
    functions: ['Основание логарифма перепутали с показателем степени.', 'При переносе вычитаемого в правую часть нужно прибавить число, а не вычесть.'],
    trigonometry: ['При вынесении общего множителя потеряли второе слагаемое.', 'К результату тождества забыли прибавить свободное слагаемое.'],
    derivative: ['При дифференцировании ax³ забыли умножить коэффициент на 3.', 'Производная линейного члена bx равна b, а не нулю.'],
    integrals: ['Первообразная константы b равна bx, а не нулю.', 'При подстановке верхнего предела x = 2 возвели 2 в квадрат вместо куба 2³ = 8.'],
    planimetry: ['Вместо умножения катетов нашли их сумму.', 'При делении произведения катетов на 2 допустили ошибку: разделили на 4.'],
    vectors: ['Перепутали координаты: умножили x₁ на y₂ вместо x₁ на x₂.', 'В последнем шаге вычли произведения координат вместо их сложения.'],
    stereometry: ['Площадь квадрата со стороной a равна a², а не периметру 4a.', 'В последнем шаге разделили на 2 вместо деления на 3 по формуле пирамиды.']
  },
  kk: {
    linear: ['Сан тек оң жақтан азайтылды. Бірдей амалды екі жаққа қолдану керек.', 'Соңғы қадамда x алдындағы коэффициентке бөлу керек.'],
    inequalities: ['Бос мүшені оң жаққа шығарғанда таңбасын ауыстыру ұмытылған.', 'x > k қатаң теңсіздігінде ең кіші бүтін шешім k емес, k + 1 болады.'],
    systems: ['Теңдеулерді қосқанда оң жақтарын қосудың орнына азайтқан.', 'Соңғы қадамда қосындыны 2-ге бөлу ұмытылған.'],
    percent: ['Пайыз — жүзден бір үлес. 10-ға емес, 100-ге бөлеміз.', 'Жеңілдік бағаны азайтады: оны қоспай, азайтамыз.'],
    probability: ['Көк шар сұралған. Қызыл емес, көк шарларды санау керек.', 'Алымда қолайлы, бөлімде барлық нәтижелер болады. Бөлшек кері жазылған.'],
    combinatorics: ['C(n, 2) алымында n(n + 1) емес, n(n − 1) көбейтіндісі алынады.', 'Соңғы қадамда 2! = 2 орнына 4-ке бөлген.'],
    radicals: ['Түбірден құтылу үшін оң жақты квадраттау қажет.', 'Бос мүшені оң жаққа шығарғанда азайту емес, қосу керек.'],
    quadratic: ['Түбірлердің қосындысы мен көбейтіндісі ауысып кеткен.', 'Жауапта кіші түбірді емес, үлкен түбірді таңдау керек.'],
    progressions: ['Бірінші мүше a₁ орнына d айырымы жазылған.', 'Соңғы қадамда қосудың орнына көбейту орындалған.'],
    functions: ['Логарифм негізі мен дәреже көрсеткіші ауысып кеткен.', 'Бос мүшені оң жаққа шығарғанда азайту емес, қосу керек.'],
    trigonometry: ['Ортақ көбейткішті шығарғанда екінші қосылғыш қалып қойған.', 'Соңғы қадамда бос мүшені қосу ұмытылған.'],
    derivative: ['ax³ туындысын тапқанда коэффициентті 3-ке көбейту ұмытылған.', 'bx сызықтық мүшесінің туындысы 0 емес, b болады.'],
    integrals: ['b тұрақтысының алғашқы функциясы 0 емес, bx болады.', 'x = 2 мәнін қойғанда 2³ = 8 орнына 2² = 4 алған.'],
    planimetry: ['Катеттерді көбейтудің орнына оларды қосқан.', 'Соңғы қадамда 2-ге емес, 4-ке бөлген.'],
    vectors: ['Координаталарды шатастырып, x₁-ді x₂ орнына y₂-ге көбейткен.', 'Соңғы қадамда көбейтінділерді қосудың орнына азайтқан.'],
    stereometry: ['Шаршы ауданы 4a емес, a² болады.', 'Пирамида формуласы бойынша 2-ге емес, 3-ке бөлу керек.']
  },
  uz: {
    linear: ['Son faqat o‘ng tomondan ayirildi. Ikkala tomonga bir xil amal qo‘llash kerak.', 'Oxirgi qadamda x oldidagi koeffitsiyentga bo‘lish kerak.'],
    inequalities: ['Ozod hadni o‘ng tomonga o‘tkazishda ishora o‘zgartirilmagan.', 'x > k qat’iy tengsizlikda eng kichik butun yechim k emas, k + 1 ga teng.'],
    systems: ['Tenglamalarni qo‘shishda o‘ng tomonlar ayirib yuborilgan.', 'Oxirgi qadamda yig‘indini 2 ga bo‘lish unutilgan.'],
    percent: ['Foiz — yuzdan bir ulush. 10 ga emas, 100 ga bo‘lamiz.', 'Chegirma narxni kamaytiradi: uni qo‘shmaymiz, ayiramiz.'],
    probability: ['Ko‘k shar so‘ralgan. Qizil emas, ko‘k sharlarni sanash kerak.', 'Suratda mos natijalar, maxrajda barcha natijalar. Kasr teskari yozilgan.'],
    combinatorics: ['C(n, 2) suratida n(n + 1) emas, n(n − 1) olinadi.', 'Oxirgi qadamda 2! = 2 o‘rniga 4 ga bo‘lingan.'],
    radicals: ['Ildizdan qutulish uchun o‘ng tomonni kvadratga oshirish shart.', 'Ozod hadni o‘ng tomonga o‘tkazishda ayirish emas, qo‘shish kerak.'],
    quadratic: ['Ildizlar yig‘indisi va ko‘paytmasi o‘rni almashib qolgan.', 'Javobda kichik ildiz emas, katta ildiz tanlanishi kerak.'],
    progressions: ['Birinchi had a₁ o‘rniga d ayirma qo‘yilgan.', 'Oxirgi qadamda qo‘shish o‘rniga ko‘paytirish bajarilgan.'],
    functions: ['Logarifm asosi va daraja ko‘rsatkichi almashib qolgan.', 'Ozod hadni o‘ng tomonga o‘tkazishda ayirish emas, qo‘shish kerak.'],
    trigonometry: ['Umumiy ko‘paytuvchini chiqarishda ikkinchi had tushib qolgan.', 'Oxirgi qadamda ozod hadni qo‘shish unutilgan.'],
    derivative: ['ax³ hosilasini topishda koeffitsiyentni 3 ga ko‘paytirish unutilgan.', 'bx chiziqli hadning hosilasi 0 emas, b ga teng.'],
    integrals: ['b o‘zgarmasning boshlang‘ich funksiyasi 0 emas, bx ga teng.', 'x = 2 ni qo‘yganda 2³ = 8 o‘rniga 2² = 4 olingan.'],
    planimetry: ['Katetlarni ko‘paytirish o‘rniga ularni qo‘shib qo‘ygan.', 'Oxirgi qadamda 2 ga emas, 4 ga bo‘lingan.'],
    vectors: ['Koordinatalar adashtirilib, x₁ ni x₂ o‘rniga y₂ ga ko‘paytirilgan.', 'Oxirgi qadamda ko‘paytmalarni qo‘shish o‘rniga ayirilgan.'],
    stereometry: ['Kvadrat yuzasi 4a emas, a² ga teng.', 'Piramida formulasiga ko‘ra 2 ga emas, 3 ga bo‘lish kerak.']
  }
};

function vary(c: Challenge, n: number, language: Language, valid: string[], first: string[], last: string[]): Challenge {
  const position = n % 3;
  if (position === 1) return c;
  return {
    ...c,
    steps: position === 0 ? first : [...valid.slice(0, 2), last[2]],
    wrongStep: position,
    explanation: edgeReasons[language][c.topic][position === 0 ? 0 : 1]
  };
}

export function makeChallenge(topic: LabTopic, seed: number, language: Language): Challenge {
  if (!Number.isSafeInteger(seed) || seed < 0) throw new Error('Invalid seed');
  const n = seed % variantsPerTopic;
  const t = text[language];
  const id = `${topic}-${n}`;

  if (topic === 'linear') {
    const a = 2 + (n % 4), b = 3 + Math.floor(n / 4), x = 3 + (n % 5), c = a * x + b;
    const aa = a + 1, xx = x + 2, cc = aa * xx + b;
    const form = n % 3;
    const transferEq =
      form === 0
        ? `${aa + 1}x + ${b} = x + ${cc}. ${t.solve}.`
        : form === 1
          ? `${aa}(x − 1) + ${b} = ${cc - aa}. ${t.solve}.`
          : `${aa}x − ${b} = ${aa * xx - b}. ${t.solve}.`;
    const transferHints =
      form === 0
        ? [t.eqHint, `${aa}x + ${b} = ${cc}`, `x = (${cc} − ${b}) / ${aa}`]
        : form === 1
          ? [t.eqHint, `${aa}(x − 1) = ${cc - aa - b}`, `x − 1 = ${xx - 1} → x = ${xx}`]
          : [t.eqHint, `${aa}x = ${aa * xx - b} + ${b}`, `x = ${aa * xx} / ${aa}`];
    return vary(
      {
        id, topic,
        task: `${a}x + ${b} = ${c}. ${t.solve}.`,
        steps: [`${t.subtract} ${b} ${t.both}.`, `${a}x = ${c}`, `x = ${c}/${a}`],
        wrongStep: 1,
        explanation: t.eqWhy,
        repair: `${a}x = ${c} − ${b} = ${a * x}; x = ${x}.`,
        transfer: transferEq,
        answer: xx, unit: '',
        hints: transferHints,
        solution: `x = ${xx}`
      },
      n, language,
      [`${a}x = ${c} − ${b}`, `${a}x = ${a * x}`, `x = ${x}`],
      [`${a}x + ${b} = ${c} − ${b}`, `${a}x = ${c} − ${b} − ${b}`, `x = (${c} − ${b} − ${b})/${a}`],
      ['', '', `x = ${a * x}/${a + 1}`]
    );
  }

  if (topic === 'inequalities') {
    const a = 2 + (n % 4), x = 2 + Math.floor(n / 4), b = 3 + n, prod = a * x, rhs = b - prod;
    const aa = a + 1, xx = x + 2, bb = b + 2, prod2 = aa * xx, rhs2 = bb - prod2;
    return vary(
      {
        id, topic,
        task: `−${a}x + ${b} < ${rhs}. ${t.ineqFind}.`,
        steps: [`−${a}x < ${rhs} − ${b} = −${prod}`, `x < (−${prod}) / (−${a}) = ${x}`, `x_min = ${x - 1}`],
        wrongStep: 1,
        explanation: t.ineqWhy,
        repair: `−${a}x < −${prod} ⇒ x > ${x}; x_min = ${x + 1}.`,
        transfer: `−${aa}x + ${bb} < ${rhs2}. ${t.ineqFind}.`,
        answer: xx + 1, unit: '',
        hints: [t.ineqHint, `−${aa}x < −${prod2} ⇒ x > ${xx}`, `x_min = ${xx + 1}`],
        solution: `x > ${xx} → x_min = ${xx + 1}`
      },
      n, language,
      [`−${a}x < −${prod}`, `x > ${x}`, `x_min = ${x + 1}`],
      [`−${a}x < ${rhs} + ${b}`, `x > −(${rhs + b})/${a}`, `x_min = 0`],
      ['', '', `x_min = ${x}`]
    );
  }

  if (topic === 'systems') {
    const x = 4 + n, y = 1 + (n % 5), sum = x + y, diff = x - y;
    const xx = x + 3, yy = y + 1, sum2 = xx + yy, diff2 = xx - yy;
    return vary(
      {
        id, topic,
        task: `{ x + y = ${sum}; x − y = ${diff} }. ${t.solve}.`,
        steps: [`(x + y) + (x − y) = ${sum} + ${diff}`, `x = ${sum + diff}`, `x = ${sum + diff}`],
        wrongStep: 1,
        explanation: t.sysWhy,
        repair: `2x = ${sum} + ${diff} = ${2 * x} ⇒ x = ${x}.`,
        transfer: `{ x + y = ${sum2}; x − y = ${diff2} }. ${t.solve}.`,
        answer: xx, unit: '',
        hints: [t.sysHint, `2x = ${sum2} + ${diff2} = ${2 * xx}`, `x = ${2 * xx} / 2 = ${xx}`],
        solution: `2x = ${2 * xx} → x = ${xx}`
      },
      n, language,
      [`(x + y) + (x − y) = ${sum} + ${diff}`, `2x = ${2 * x}`, `x = ${x}`],
      [`2x = ${sum} − ${diff} = ${2 * y}`, `x = ${y}`, `x = ${y}`],
      ['', '', `x = ${2 * x}`]
    );
  }

  if (topic === 'percent') {
    const price = 10000 + n * 1000, p = 10 + (n % 3) * 5, other = price + 5000, answer = (other * (100 - p)) / 100;
    return vary(
      {
        id, topic,
        task: `${t.discount}: ${price} ₸, ${t.off} ${p}%. ${t.pay}`,
        steps: [`${p}% = ${p}/100`, `${t.discountSum}: ${price} − ${p}`, `${t.final}: ${price} − (${price} − ${p})`],
        wrongStep: 1,
        explanation: t.pctWhy,
        repair: `${price} × ${p}/100 = ${(price * p) / 100} ₸; ${price} − ${(price * p) / 100} = ${(price * (100 - p)) / 100} ₸.`,
        transfer: `${t.discount}: ${other} ₸, ${t.off} ${p}%. ${t.pay}`,
        answer, unit: '₸',
        hints: [t.pctHint, `${t.discountSum}: ${other} × ${p}/100`, `${t.final}: ${other} − (${other} × ${p}/100)`],
        solution: `${other} × (100 − ${p}) / 100 = ${answer} ₸`
      },
      n, language,
      [`${p}% = ${p}/100`, `${t.discountSum}: ${(price * p) / 100} ₸`, ''],
      [`${p}% = ${p}/10`, `${t.discountSum}: ${(price * p) / 10} ₸`, `${t.final}: ${price} − ${(price * p) / 10}`],
      ['', '', `${t.final}: ${price} + ${(price * p) / 100}`]
    );
  }

  if (topic === 'probability') {
    const r = 7 + Math.floor(n / 4), b = 2 + (n % 4), total = r + b, rr = r + 2, bb = b + 1;
    return vary(
      {
        id, topic,
        task: `${t.bag} ${r} ${t.red} ${b} ${t.blue} ${t.chance}`,
        steps: [`${t.fav}: ${b}`, `${t.total}: ${r}`, `${t.prob}: ${b}/${r}`],
        wrongStep: 1,
        explanation: t.probWhy,
        repair: `${t.total}: ${r} + ${b} = ${total}; P = ${b}/${total}.`,
        transfer: `${t.bag} ${rr} ${t.red} ${bb} ${t.blue} ${t.chance}`,
        answer: bb / (rr + bb), unit: '',
        hints: [t.probHint, `${t.total}: ${rr} + ${bb}`, `P = ${bb} / (${rr} + ${bb})`],
        solution: `P = ${bb}/${rr + bb}`
      },
      n, language,
      [`${t.fav}: ${b}`, `${t.total}: ${total}`, ''],
      [`${t.fav}: ${r}`, `${t.total}: ${total}`, `${t.prob}: ${r}/${total}`],
      ['', '', `${t.prob}: ${total}/${b}`]
    );
  }

  if (topic === 'combinatorics') {
    const m = 5 + n, prod = m * (m - 1), val = prod / 2;
    const mm = m + 2, prod2 = mm * (mm - 1), ans = prod2 / 2;
    return vary(
      {
        id, topic,
        task: `${t.combTask}: C(${m}, 2).`,
        steps: [`C(${m}, 2) = ${m}! / (2! · ${m - 2}!)`, `C(${m}, 2) = ${m} × ${m - 1}`, `= ${prod}`],
        wrongStep: 1,
        explanation: t.combWhy,
        repair: `C(${m}, 2) = (${m} × ${m - 1}) / 2 = ${prod} / 2 = ${val}.`,
        transfer: `${t.combTask}: C(${mm}, 2).`,
        answer: ans, unit: '',
        hints: [t.combHint, `(${mm} × ${mm - 1}) / 2`, `${prod2} / 2 = ${ans}`],
        solution: `(${mm} × ${mm - 1}) / 2 = ${ans}`
      },
      n, language,
      [`${m} × ${m - 1} = ${prod}`, `C(${m}, 2) = ${prod} / 2`, `= ${val}`],
      [`${m} × ${m + 1} = ${m * (m + 1)}`, `C(${m}, 2) = ${(m * (m + 1)) / 2}`, `= ${(m * (m + 1)) / 2}`],
      ['', '', `= ${prod} / 4 = ${prod / 4}`]
    );
  }

  if (topic === 'radicals') {
    const r = 3 + (n % 6), shift = 2 + n, val = r * r + shift;
    const r2 = r + 1, s2 = shift + 4, ans = r2 * r2 + s2;
    return vary(
      {
        id, topic,
        task: `√(x − ${shift}) = ${r}. ${t.solve}.`,
        steps: [`x − ${shift} ≥ 0`, `x − ${shift} = ${r} × 2 = ${r * 2}`, `x = ${r * 2 + shift}`],
        wrongStep: 1,
        explanation: t.radWhy,
        repair: `x − ${shift} = ${r}² = ${r * r}; x = ${r * r} + ${shift} = ${val}.`,
        transfer: `√(x − ${s2}) = ${r2}. ${t.solve}.`,
        answer: ans, unit: '',
        hints: [t.radHint, `x − ${s2} = ${r2}² = ${r2 * r2}`, `x = ${r2 * r2} + ${s2}`],
        solution: `x = ${r2}² + ${s2} = ${ans}`
      },
      n, language,
      [`x − ${shift} ≥ 0`, `x − ${shift} = ${r}² = ${r * r}`, `x = ${val}`],
      [`x − ${shift} = ${r}`, `x = ${r} + ${shift}`, `x = ${r + shift}`],
      ['', '', `x = ${r * r} − ${shift} = ${r * r - shift}`]
    );
  }

  if (topic === 'quadratic') {
    const r1 = 2 + (n % 4), r2 = r1 + 1 + Math.floor(n / 4), s = r1 + r2, p = r1 * r2;
    const rr1 = r1 + 1, rr2 = r2 + 2, ss = rr1 + rr2, pp = rr1 * rr2;
    return vary(
      {
        id, topic,
        task: `x² − ${s}x + ${p} = 0. ${t.quadTask}.`,
        steps: [`${t.quadProd}: x₁ × x₂ = ${p}`, `${t.quadSum}: x₁ + x₂ = −${s}`, `${t.quadRoots}: −${r1} & −${r2} → −${r1}`],
        wrongStep: 1,
        explanation: t.quadWhy,
        repair: `x₁ + x₂ = ${s}, x₁ × x₂ = ${p} → x₁ = ${r1}, x₂ = ${r2}; max = ${r2}.`,
        transfer: `x² − ${ss}x + ${pp} = 0. ${t.quadTask}.`,
        answer: rr2, unit: '',
        hints: [t.quadHint, `x₁ + x₂ = ${ss}, x₁ × x₂ = ${pp}`, `x₁ = ${rr1}, x₂ = ${rr2}`],
        solution: `x₁ = ${rr1}, x₂ = ${rr2} → max = ${rr2}`
      },
      n, language,
      [`${t.quadProd}: x₁ × x₂ = ${p}`, `${t.quadSum}: x₁ + x₂ = ${s}`, `max = ${r2}`],
      [`${t.quadProd}: x₁ × x₂ = ${s}`, `${t.quadSum}: x₁ + x₂ = ${p}`, `max = ${s}`],
      ['', '', `${t.quadRoots}: ${r1} & ${r2} → max = ${r1}`]
    );
  }

  if (topic === 'progressions') {
    const a1 = 3 + (n % 4), d = 8 + Math.floor(n / 4), a6 = a1 + 5 * d;
    const aa1 = a1 + 2, dd = d + 1, a7 = aa1 + 6 * dd;
    return vary(
      {
        id, topic,
        task: `${t.progTask}: a₁ = ${a1}, d = ${d}. ${t.progFind6}`,
        steps: [`aₙ = a₁ + (n − 1)d`, `a₆ = ${a1} + 6 × ${d}`, `a₆ = ${a1 + 6 * d}`],
        wrongStep: 1,
        explanation: t.progWhy,
        repair: `a₆ = ${a1} + (6 − 1) × ${d} = ${a1} + ${5 * d} = ${a6}.`,
        transfer: `${t.progTask}: a₁ = ${aa1}, d = ${dd}. ${t.progFind7}`,
        answer: a7, unit: '',
        hints: [t.progHint, `a₇ = ${aa1} + 6 × ${dd}`, `a₇ = ${aa1} + ${6 * dd}`],
        solution: `${aa1} + 6 × ${dd} = ${a7}`
      },
      n, language,
      [`a₁ = ${a1}, d = ${d}`, `5 × d = ${5 * d}`, `a₆ = ${a6}`],
      [`a₁ = ${d}, d = ${a1}`, `5 × d = ${5 * a1}`, `a₆ = ${d + 5 * a1}`],
      ['', '', `a₆ = ${a1} × ${5 * d} = ${a1 * 5 * d}`]
    );
  }

  if (topic === 'functions') {
    const base = 3 + 2 * (n % 3), shift = 2 + n, val = base * base + shift;
    const b2 = base, s2 = shift + 5, ans = b2 * b2 + s2;
    return vary(
      {
        id, topic,
        task: `log_${base}(x − ${shift}) = 2. ${t.solve}.`,
        steps: [`x − ${shift} > 0`, `x − ${shift} = ${base} × 2 = ${base * 2}`, `x = ${base * 2 + shift}`],
        wrongStep: 1,
        explanation: t.logWhy,
        repair: `x − ${shift} = ${base}² = ${base * base}; x = ${base * base} + ${shift} = ${val}.`,
        transfer: `log_${b2}(x − ${s2}) = 2. ${t.solve}.`,
        answer: ans, unit: '',
        hints: [t.logHint, `x − ${s2} = ${b2}² = ${b2 * b2}`, `x = ${b2 * b2} + ${s2}`],
        solution: `x = ${b2}² + ${s2} = ${ans}`
      },
      n, language,
      [`x − ${shift} > 0`, `x − ${shift} = ${base}² = ${base * base}`, `x = ${val}`],
      [`x − ${shift} = 2^${base}`, `x − ${shift} = ${2 ** base}`, `x = ${2 ** base + shift}`],
      ['', '', `x = ${base * base} − ${shift} = ${base * base - shift}`]
    );
  }

  if (topic === 'trigonometry') {
    const k = 3 + (n % 4), add = 2 + Math.floor(n / 4), deg = 15 + n;
    const kk = k + 2, add2 = add + 3, deg2 = 20 + n, ans = kk + add2;
    return vary(
      {
        id, topic,
        task: `${t.trigTask}: ${k}sin²(${deg}°) + ${k}cos²(${deg}°) + ${add}.`,
        steps: [`${k}(sin²(${deg}°) + cos²(${deg}°)) + ${add}`, `${k} × 2 + ${add}`, `= ${k * 2 + add}`],
        wrongStep: 1,
        explanation: t.trigWhy,
        repair: `sin²(${deg}°) + cos²(${deg}°) = 1 → ${k} × 1 + ${add} = ${k + add}.`,
        transfer: `${t.trigTask}: ${kk}sin²(${deg2}°) + ${kk}cos²(${deg2}°) + ${add2}.`,
        answer: ans, unit: '',
        hints: [t.trigHint, `${kk} × (sin²(${deg2}°) + cos²(${deg2}°)) + ${add2}`, `${kk} × 1 + ${add2}`],
        solution: `${kk} × 1 + ${add2} = ${ans}`
      },
      n, language,
      [`${k}(sin²(${deg}°) + cos²(${deg}°)) + ${add}`, `${k} × 1 + ${add}`, `= ${k + add}`],
      [`${k}sin²(${deg}°) + cos²(${deg}°) + ${add}`, `${k} + ${add}`, `= ${k + add}`],
      ['', '', `= ${k}`]
    );
  }

  if (topic === 'derivative') {
    const a = 2 + (n % 4), b = 1 + Math.floor(n / 4), right = 12 * a + b;
    const aa = a + 1, bb = b + 2, ans = 12 * aa + bb;
    return vary(
      {
        id, topic,
        task: `${t.derivTask}: f(x) = ${a}x³ + ${b}x.`,
        steps: [`(x³)' = 3x², (x)' = 1`, `f'(x) = ${3 * a}x³ + ${b}`, `f'(2) = ${3 * a} × 8 + ${b} = ${24 * a + b}`],
        wrongStep: 1,
        explanation: t.derivWhy,
        repair: `f'(x) = ${3 * a}x² + ${b}; f'(2) = ${3 * a} × 4 + ${b} = ${right}.`,
        transfer: `${t.derivTask}: f(x) = ${aa}x³ + ${bb}x.`,
        answer: ans, unit: '',
        hints: [t.derivHint, `f'(x) = ${3 * aa}x² + ${bb}`, `f'(2) = ${3 * aa} × 4 + ${bb}`],
        solution: `${3 * aa} × 2² + ${bb} = ${ans}`
      },
      n, language,
      [`f'(x) = ${3 * a}x² + ${b}`, `f'(2) = ${3 * a} × 4 + ${b}`, `f'(2) = ${right}`],
      [`f'(x) = ${a}x² + ${b}`, `f'(2) = ${a} × 4 + ${b}`, `f'(2) = ${4 * a + b}`],
      ['', '', `f'(2) = ${3 * a} × 4 + 0 = ${12 * a}`]
    );
  }

  if (topic === 'integrals') {
    const a = 1 + (n % 4), b = 2 + n, right = 8 * a + 2 * b;
    const aa = a + 1, bb = b + 3, ans = 8 * aa + 2 * bb;
    return vary(
      {
        id, topic,
        task: `${t.intTask}: ∫₀² (${3 * a}x² + ${b}) dx.`,
        steps: [`(x³)' = 3x²`, `F(x) = ${3 * a}x³ + ${b}x`, `F(2) − F(0) = ${24 * a + 2 * b}`],
        wrongStep: 1,
        explanation: t.intWhy,
        repair: `F(x) = ${a}x³ + ${b}x; F(2) − F(0) = ${8 * a} + ${2 * b} = ${right}.`,
        transfer: `${t.intTask}: ∫₀² (${3 * aa}x² + ${bb}) dx.`,
        answer: ans, unit: '',
        hints: [t.intHint, `F(x) = ${aa}x³ + ${bb}x`, `F(2) = ${8 * aa} + ${2 * bb} = ${ans}`],
        solution: `${8 * aa} + ${2 * bb} = ${ans}`
      },
      n, language,
      [`F(x) = ${a}x³ + ${b}x`, `F(2) = ${8 * a} + ${2 * b}`, `= ${right}`],
      [`F(x) = ${a}x³`, `F(2) = ${8 * a}`, `= ${8 * a}`],
      ['', '', `F(2) = ${4 * a} + ${2 * b} = ${4 * a + 2 * b}`]
    );
  }

  if (topic === 'planimetry') {
    const a = 4 + 2 * (n % 4), b = 3 + Math.floor(n / 4), s = (a * b) / 2;
    const aa = a + 2, bb = b + 1, ans = (aa * bb) / 2;
    return vary(
      {
        id, topic,
        task: `${t.planTask}: a = ${a}, b = ${b}. ${t.planFind}`,
        steps: [`a × b = ${a} × ${b} = ${a * b}`, `S = a × b = ${a * b}`, `S = ${a * b}`],
        wrongStep: 1,
        explanation: t.planWhy,
        repair: `S = (${a} × ${b}) / 2 = ${s}.`,
        transfer: `${t.planTask}: a = ${aa}, b = ${bb}. ${t.planFind}`,
        answer: ans, unit: '',
        hints: [t.planHint, `a × b = ${aa * bb}`, `S = ${aa * bb} / 2`],
        solution: `(${aa} × ${bb}) / 2 = ${ans}`
      },
      n, language,
      [`a × b = ${a * b}`, `S = ${a * b} / 2`, `S = ${s}`],
      [`a + b = ${a + b}`, `S = (${a} + ${b}) / 2`, `S = ${(a + b) / 2}`],
      ['', '', `S = ${a * b} / 4 = ${(a * b) / 4}`]
    );
  }

  if (topic === 'vectors') {
    const ax = 2 + (n % 5), ay = 3 + Math.floor(n / 5), bx = 4 + n, by = 2;
    const dot = ax * bx + ay * by;
    const ax2 = ax + 1, ay2 = ay + 1, bx2 = bx + 2, by2 = by + 1;
    const ans = ax2 * bx2 + ay2 * by2;
    return vary(
      {
        id, topic,
        task: `${t.vecTask}: a⃗(${ax}; ${ay}), b⃗(${bx}; ${by}).`,
        steps: [`a⃗ · b⃗ = x₁x₂ + y₁y₂`, `a⃗ · b⃗ = (${ax} + ${bx}) + (${ay} + ${by})`, `= ${ax + bx + ay + by}`],
        wrongStep: 1,
        explanation: t.vecWhy,
        repair: `a⃗ · b⃗ = ${ax} × ${bx} + ${ay} × ${by} = ${ax * bx} + ${ay * by} = ${dot}.`,
        transfer: `${t.vecTask}: a⃗(${ax2}; ${ay2}), b⃗(${bx2}; ${by2}).`,
        answer: ans, unit: '',
        hints: [t.vecHint, `${ax2} × ${bx2} + ${ay2} × ${by2}`, `${ax2 * bx2} + ${ay2 * by2} = ${ans}`],
        solution: `${ax2 * bx2} + ${ay2 * by2} = ${ans}`
      },
      n, language,
      [`x₁x₂ = ${ax * bx}, y₁y₂ = ${ay * by}`, `a⃗ · b⃗ = ${ax * bx} + ${ay * by}`, `= ${dot}`],
      [`x₁y₂ = ${ax * by}, y₁x₂ = ${ay * bx}`, `a⃗ · b⃗ = ${ax * by} + ${ay * bx}`, `= ${ax * by + ay * bx}`],
      ['', '', `= ${ax * bx} − ${ay * by} = ${ax * bx - ay * by}`]
    );
  }

  const a = 5 + (n % 4), h = 3 * (1 + Math.floor(n / 4)), v = (a * a * h) / 3;
  const aa = a + 1, hh = h + 3, ans = (aa * aa * hh) / 3;
  return vary(
    {
      id, topic,
      task: `${t.stereoTask} a = ${a}, ${t.stereoHeight} h = ${h}. ${t.stereoFind}`,
      steps: [`S = a² = ${a * a}`, `V = S × h = ${a * a} × ${h}`, `V = ${a * a * h}`],
      wrongStep: 1,
      explanation: t.stereoWhy,
      repair: `V = (${a * a} × ${h}) / 3 = ${v}.`,
      transfer: `${t.stereoTask} a = ${aa}, ${t.stereoHeight} h = ${hh}. ${t.stereoFind}`,
      answer: ans, unit: '',
      hints: [t.stereoHint, `S = ${aa}² = ${aa * aa}`, `V = (${aa * aa} × ${hh}) / 3`],
      solution: `(${aa}² × ${hh}) / 3 = ${ans}`
    },
    n, language,
    [`S = a² = ${a * a}`, `S × h = ${a * a * h}`, `V = ${v}`],
    [`S = 4a = ${4 * a}`, `S × h = ${4 * a * h}`, `V = ${(4 * a * h) / 3}`],
    ['', '', `V = ${a * a * h} / 2 = ${(a * a * h) / 2}`]
  );
}

export function formatLabTask(task: string): string {
  return task
    .replace(/\.\s*(Найдите x|x-ті табыңыз|x ni toping)\.?$/i, '')
    .replace(/^(Вычислите значение выражения|Өрнектің мәнін есептеңіз|Ifodaning qiymatini hisoblang):\s*/i, '')
    .replace(/\.$/, '');
}

export function parseNumericAnswer(raw: string): number | null {
  const input = raw.trim().replace(',', '.');
  if (input.length > 48) return null;
  const fraction = input.match(/^([+-]?\d+(?:\.\d+)?)\s*\/\s*([+-]?\d+(?:\.\d+)?)$/);
  if (fraction) {
    const denominator = Number(fraction[2]);
    if (!denominator) return null;
    const v = Number(fraction[1]) / denominator;
    return Number.isFinite(v) ? v : null;
  }
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)\s*%?$/.test(input)) return null;
  const v = input.endsWith('%') ? Number(input.slice(0, -1)) / 100 : Number(input);
  return Number.isFinite(v) ? v : null;
}

export function checkAnswer(raw: string, expected: number) {
  const value = parseNumericAnswer(raw);
  return value !== null && Math.abs(value - expected) <= 1e-6;
}

export const progressSchema = z.object({
  version: z.literal(1),
  records: z.array(z.object({
    topic: z.enum(topicIds),
    challenge: z.string(),
    independent: z.boolean(),
    date: z.string().datetime()
  }).strict().refine(r => {
    const suffix = r.challenge.slice(r.topic.length + 1);
    return r.challenge.startsWith(r.topic + '-') && /^(0|[1-9]\d*)$/.test(suffix) && Number(suffix) < variantsPerTopic;
  }, 'Challenge must match topic and variant range')).max(60)
}).strict();

export type Progress = z.infer<typeof progressSchema>;

export function recommendTopic(progress: Progress): LabTopic {
  return labTopics.reduce((best, topic) => {
    const count = (id: LabTopic) =>
      new Set(progress.records.filter((r) => r.topic === id && r.independent).map((r) => r.challenge)).size;
    return count(topic) < count(best) ? topic : best;
  }, labTopics[0]);
}

export function nextSeed(progress: Progress, topic: LabTopic): number {
  const seen = new Set(progress.records.filter((r) => r.topic === topic).map((r) => r.challenge));
  for (let seed = 0; seed < variantsPerTopic; seed++) if (!seen.has(`${topic}-${seed}`)) return seed;
  return progress.records.filter((r) => r.topic === topic).length % variantsPerTopic;
}

export function reviewSchedule(progress: Progress, now: number) {
  if (!Number.isFinite(now)) throw new Error('Invalid time');
  return labTopics.map((topic) => {
    const records = progress.records
      .filter((r) => r.topic === topic)
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    const latest = records.at(-1);
    const independent = new Set(records.filter((r) => r.independent).map((r) => r.challenge)).size;
    const days = latest?.independent ? (independent >= 2 ? 7 : 2) : 0;
    const dueAt = latest ? Date.parse(latest.date) + days * 86400000 : null;
    return { topic, days, dueAt, due: dueAt !== null && dueAt <= now, practiced: !!latest };
  });
}

export function buildBaselineRoadmap(
  progress: Progress,
  targetScore: number,
  weeksLeft: number,
  language: Language
) {
  const counts = labTopics.map((topic) => {
    const solo = new Set(progress.records.filter((r) => r.topic === topic && r.independent).map((r) => r.challenge)).size;
    const assisted = progress.records.filter((r) => r.topic === topic && !r.independent).length;
    return { topic, title: topicName(topic, language), solo, assisted };
  });
  const weak = counts.filter(c => c.solo < 2).sort((a, b) => a.solo - b.solo || b.assisted - a.assisted).slice(0, 4);
  const strong = counts.filter((c) => c.solo >= 2).map((c) => c.topic);
  const perWeek = Math.max(2, Math.ceil(labTopics.length * (targetScore / 20) / Math.max(1, Math.min(weeksLeft, 8))));
  return {
    targetScore,
    weeksLeft,
    weakTopics: weak.map((w) => w.topic),
    masteredTopics: strong,
    priorityModules: weak.map((w, idx) => ({
      topic: w.topic,
      title: w.title,
      soloCount: w.solo,
      phase: idx < 2 ? 1 : 2
    })),
    topicsPerWeek: perWeek
  };
}

export function exportProgress(progress: Progress) {
  return JSON.stringify(
    {
      product: 'BilimAI',
      notice: 'Practice history only; not a mastery assessment. No names or answer text.',
      ...progress
    },
    null,
    2
  );
}

export function resolveVerifiedChallenge(input: {
  topic: LabTopic;
  seed: number;
  language: Language;
  task: string;
  steps: string[];
  wrongStep: number;
}): Challenge {
  const challenge = makeChallenge(input.topic, input.seed, input.language);
  if (
    challenge.wrongStep !== input.wrongStep ||
    challenge.task !== input.task ||
    challenge.steps.length !== input.steps.length ||
    challenge.steps.some((step, idx) => step !== input.steps[idx])
  ) {
    throw new Error('Challenge context mismatch');
  }
  return challenge;
}

