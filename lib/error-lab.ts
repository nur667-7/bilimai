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

export const errorReasonIds = [
  'balance_shift',
  'sign_flip',
  'term_combine',
  'percent_base',
  'sample_space',
  'order_factor',
  'root_squaring',
  'vieta_sign',
  'index_shift',
  'domain_loss',
  'pythagorean_id',
  'power_rule',
  'antiderivative_power',
  'half_area',
  'dot_product_ops',
  'pyramid_third'
] as const;

export type ErrorReasonId = (typeof errorReasonIds)[number];

const topicToErrorReason: Record<LabTopic, ErrorReasonId> = {
  linear: 'balance_shift',
  inequalities: 'sign_flip',
  systems: 'term_combine',
  percent: 'percent_base',
  probability: 'sample_space',
  combinatorics: 'order_factor',
  radicals: 'root_squaring',
  quadratic: 'vieta_sign',
  progressions: 'index_shift',
  functions: 'domain_loss',
  trigonometry: 'pythagorean_id',
  derivative: 'power_rule',
  integrals: 'antiderivative_power',
  planimetry: 'half_area',
  vectors: 'dot_product_ops',
  stereometry: 'pyramid_third'
};

export function getTopicErrorReasonId(topic: LabTopic): ErrorReasonId {
  return topicToErrorReason[topic];
}

export interface ErrorCauseCopy {
  shortLabel: string;
  personalMessage: string;
  explanation: string;
}

const errorCauseCatalog: Record<Language, Record<ErrorReasonId, ErrorCauseCopy>> = {
  ru: {
    balance_shift: {
      shortLabel: 'Перенос слагаемого без смены знака',
      personalMessage: 'Ты терял равносильность при переносе слагаемого между частями уравнения. Сегодня проверим именно это.',
      explanation: 'При переносе числа через знак «=» его знак меняется на противоположный (или одно и то же число вычитается из обеих частей).'
    },
    sign_flip: {
      shortLabel: 'Знак неравенства при делении на отрицательное число',
      personalMessage: 'Ты забывал менять знак неравенства при делении на отрицательное число. Сегодня проверим именно это.',
      explanation: 'При делении или умножении обеих частей неравенства на отрицательное число знак (<, >, ≤, ≥) разворачивается.'
    },
    term_combine: {
      shortLabel: 'Сложение коэффициентов в системе уравнений',
      personalMessage: 'При сложении уравнений системы ты терял удвоение коэффициента (2x вместо x). Сегодня закрепим этот шаг.',
      explanation: 'При почленном сложении (x + y) и (x − y) переменные y взаимно уничтожаются, а коэффициенты при x складываются: 2x.'
    },
    percent_base: {
      shortLabel: 'Доля процента от исходной величины',
      personalMessage: 'Ты вычитал число процентов напрямую из цены вместо расчёта доли в тенге. Сегодня проверим это правило.',
      explanation: 'Процент всегда берётся от исходной базы: сначала находим сумму скидки P × (r / 100), затем вычитаем её.'
    },
    sample_space: {
      shortLabel: 'Полное число исходов в знаменателе вероятности',
      personalMessage: 'В задачах на вероятность ты ставил в знаменатель только часть шаров вместо всех возможных исходов.',
      explanation: 'Классическая вероятность P = m / n требует в знаменателе n сумму всех равновозможных исходов.'
    },
    order_factor: {
      shortLabel: 'Деление на 2! в формуле сочетаний C(n, 2)',
      personalMessage: 'В сочетаниях ты забывал разделить произведение n(n − 1) на 2!, учитывая порядок дважды.',
      explanation: 'Поскольку порядок выбора в группе не важен, число пар равно C(n, 2) = n(n − 1) / 2.'
    },
    root_squaring: {
      shortLabel: 'Возведение в квадрат при избавлении от корня',
      personalMessage: 'При решении иррационального уравнения ты умножал правую часть на 2 вместо возведения в квадрат.',
      explanation: 'Для перехода от √A = r при r ≥ 0 обе части возводятся в квадрат: A = r².'
    },
    vieta_sign: {
      shortLabel: 'Знак суммы корней по теореме Виета',
      personalMessage: 'Ты путал знак суммы корней x₁ + x₂ = −p в приведённом квадратном уравнении. Сегодня проверим именно это.',
      explanation: 'Для уравнения x² − Sx + P = 0 сумма корней равна +S (второй коэффициент с противоположным знаком).'
    },
    index_shift: {
      shortLabel: 'Множитель (n − 1) в формуле прогрессии',
      personalMessage: 'В арифметической прогрессии ты прибавлял n·d вместо (n − 1)·d. Сегодня проверим это на новой задаче.',
      explanation: 'От первого до n-го члена ровно (n − 1) шагов: aₙ = a₁ + (n − 1)d.'
    },
    domain_loss: {
      shortLabel: 'Определение логарифма и проверка ОДЗ',
      personalMessage: 'Ты путал основание и показатель степени при переходе от log_a(f(x)) = b к f(x) = a^b и проверке ОДЗ.',
      explanation: 'Равенство log_a(x − c) = b при x > c означает, что основание a возводится в степень b: x − c = a^b.'
    },
    pythagorean_id: {
      shortLabel: 'Основное тригонометрическое тождество',
      personalMessage: 'При выражении cos²α через sin²α ты ставил плюс вместо вычитания из единицы.',
      explanation: 'Из тождества sin²α + cos²α = 1 всегда следует cos²α = 1 − sin²α.'
    },
    power_rule: {
      shortLabel: 'Показатель степени (n − 1) в производной',
      personalMessage: 'При дифференцировании xⁿ ты выносил степень n, но забывал уменьшить показатель на единицу.',
      explanation: 'По правилу производной степенной функции (a·xⁿ)′ = a·n·xⁿ⁻¹, а производная константы равна 0.'
    },
    antiderivative_power: {
      shortLabel: 'Интегрирование степенной функции x^(n+1)/(n+1)',
      personalMessage: 'В первообразной ты применял правило производной вместо увеличения степени на 1 и деления на (n + 1).',
      explanation: 'Первообразная от a·xⁿ равна a·xⁿ⁺¹ / (n + 1) + C.'
    },
    half_area: {
      shortLabel: 'Множитель 1/2 в площади треугольника',
      personalMessage: 'Ты вычислял площадь прямоугольного треугольника как произведение катетов a·b, забывая разделить на 2.',
      explanation: 'Прямоугольный треугольник составляет половину прямоугольника: S = (a × b) / 2.'
    },
    dot_product_ops: {
      shortLabel: 'Попарное произведение координат в скалярном произведении',
      personalMessage: 'В скалярном произведении векторов ты складывал одноимённые координаты вместо их умножения.',
      explanation: 'Скалярное произведение равно сумме попарных произведений координат: a⃗ · b⃗ = x₁x₂ + y₁y₂.'
    },
    pyramid_third: {
      shortLabel: 'Коэффициент 1/3 в объёме пирамиды',
      personalMessage: 'В стереометрии ты находил объём призмы S·h вместо объёма пирамиды (S·h) / 3.',
      explanation: 'Объём любой пирамиды равен одной трети произведения площади основания на высоту: V = (S × h) / 3.'
    }
  },
  kk: {
    balance_shift: {
      shortLabel: 'Мүшені таңбасын өзгертпей көшіру',
      personalMessage: 'Сен теңдеу мүшесін екінші жаққа көшіргенде таңбаны өзгертуді ұмыттың. Бүгін дәл осыны тексереміз.',
      explanation: 'Санды «=» таңбасы арқылы көшіргенде оның таңбасы қарама-қарсыға өзгереді.'
    },
    sign_flip: {
      shortLabel: 'Теріс санға бөлгенде теңсіздік таңбасы',
      personalMessage: 'Сен теңсіздікті теріс санға бөлгенде таңбаны өзгертуді бірнеше рет ұмыттың. Бүгін осы ережені тексереміз.',
      explanation: 'Теңсіздіктің екі жағын теріс санға бөлгенде теңсіздік таңбасы (<, >) қарама-қарсыға ауысады.'
    },
    term_combine: {
      shortLabel: 'Теңдеулер жүйесіндегі коэффициенттерді қосу',
      personalMessage: 'Теңдеулерді мүшелеп қосқанда x коэффициентін екі еселеуді (2x) жіберіп алдың.',
      explanation: '(x + y) және (x − y) теңдеулерін қосқанда y жойылып, 2x шығады.'
    },
    percent_base: {
      shortLabel: 'Бастапқы шамадан пайыздық үлес',
      personalMessage: 'Сен жеңілдік сомасын есептемей, пайыз санын бағадан тікелей азайттың.',
      explanation: 'Алдымен бастапқы бағадан жеңілдік сомасын тауып, содан кейін ғана оны азайтамыз.'
    },
    sample_space: {
      shortLabel: 'Ықтималдық бөліміндегі барлық нәтижелер саны',
      personalMessage: 'Ықтималдық есебінде бөліміне барлық шарлардың орнына тек бір түсті шарларды жаздың.',
      explanation: 'P = m / n формуласында n — барлық тең мүмкіндікті нәтижелердің қосындысы.'
    },
    order_factor: {
      shortLabel: 'Терулер формуласында 2!-ға бөлу',
      personalMessage: 'Терулер санын есептегенде n(n − 1) көбейтіндісін 2-ге бөлуді ұмыттың.',
      explanation: 'Рет маңызды болмағандықтан, C(n, 2) = n(n − 1) / 2 формуласы қолданылады.'
    },
    root_squaring: {
      shortLabel: 'Түбірден құтылу үшін квадраттау',
      personalMessage: 'Түбір теңдеуінде оң жақты квадраттаудың орнына 2-ге көбейттің.',
      explanation: '√A = r теңдеуінде екі жағы да квадратталады: A = r².'
    },
    vieta_sign: {
      shortLabel: 'Виет теоремасындағы түбірлер қосындысының таңбасы',
      personalMessage: 'Виет теоремасы бойынша түбірлер қосындысының таңбасын шатастырдың. Бүгін осыны бекітеміз.',
      explanation: 'x² − Sx + P = 0 теңдеуі үшін түбірлер қосындысы x₁ + x₂ = +S болады.'
    },
    index_shift: {
      shortLabel: 'Прогрессия формуласындағы (n − 1) көбейткіші',
      personalMessage: 'Арифметикалық прогрессияда (n − 1)·d орнына n·d қостың.',
      explanation: 'n-ші мүше формуласы: aₙ = a₁ + (n − 1)d.'
    },
    domain_loss: {
      shortLabel: 'Логарифм анықтамасы және АОО (ОДЗ)',
      personalMessage: 'log_a(f(x)) = b теңдеуінен f(x) = a^b түріне өту кезінде дәрежені шатастырдың.',
      explanation: 'log_a(x − c) = b теңдігі x − c = a^b дегенді білдіреді (x > c).'
    },
    pythagorean_id: {
      shortLabel: 'Негізгі тригонометриялық тепе-теңдік',
      personalMessage: 'cos²α өрнегін тапқанда 1-ден sin²α-ны азайтудың орнына қостың.',
      explanation: 'sin²α + cos²α = 1 тепе-теңдігінен cos²α = 1 − sin²α шығады.'
    },
    power_rule: {
      shortLabel: 'Туындыдағы (n − 1) дәреже көрсеткіші',
      personalMessage: 'xⁿ туындысын тапқанда дәрежені 1-ге кемітуді ұмыттың.',
      explanation: 'Дәрежелік функция туындысы: (a·xⁿ)′ = a·n·xⁿ⁻¹.'
    },
    antiderivative_power: {
      shortLabel: 'Алғашқы функциядағы x^(n+1)/(n+1) ережесі',
      personalMessage: 'Интегралдауда дәрежені 1-ге арттырып, (n + 1)-ге бөлу ережесінен қателестің.',
      explanation: 'a·xⁿ функциясының алғашқы функциясы: a·xⁿ⁺¹ / (n + 1) + C.'
    },
    half_area: {
      shortLabel: 'Үшбұрыш ауданындағы 1/2 көбейткіші',
      personalMessage: 'Тікбұрышты үшбұрыш ауданын тапқанда катеттер көбейтіндісін 2-ге бөлуді ұмыттың.',
      explanation: 'Тікбұрышты үшбұрыш ауданы: S = (a × b) / 2.'
    },
    dot_product_ops: {
      shortLabel: 'Скаляр көбейтіндіде координаталарды көбейту',
      personalMessage: 'Векторлардың скаляр көбейтіндісінде координаталарды көбейтудің орнына қостың.',
      explanation: 'Скаляр көбейтінді формуласы: a⃗ · b⃗ = x₁x₂ + y₁y₂.'
    },
    pyramid_third: {
      shortLabel: 'Пирамида көлеміндегі 1/3 коэффициенті',
      personalMessage: 'Пирамида көлемін есептегенде S·h көбейтіндісін 3-ке бөлуді ұмыттың.',
      explanation: 'Пирамида көлемі: V = (S × h) / 3.'
    }
  },
  uz: {
    balance_shift: {
      shortLabel: 'Hadni ishorasini o‘zgartirmay ko‘chirish',
      personalMessage: 'Tenglama hadini ikkinchi tomonga o‘tkazishda ishorani o‘zgartirishni unutdingiz. Bugun shuni tekshiramiz.',
      explanation: 'Son «=» белгиси орқали o‘tkazilganda uning ishorasi teskarisiga o‘zgaradi.'
    },
    sign_flip: {
      shortLabel: 'Manfiy songa bo‘lganda tengsizlik ishorasi',
      personalMessage: 'Tengsizlikni manfiy songa bo‘lganda ishorani o‘zgartirishni unutdingiz. Bugun aynan shuni mashq qilamiz.',
      explanation: 'Tengsizlikning ikkala tomonini manfiy songa bo‘lganda ishora (<, >) teskarisiga o‘zgaradi.'
    },
    term_combine: {
      shortLabel: 'Tenglamalar sistemasida koeffitsiyentlarni qo‘shish',
      personalMessage: 'Tenglamalarni hadlab qo‘shganda 2x koeffitsiyentini yo‘qotdingiz.',
      explanation: '(x + y) va (x − y) tenglamalarini qo‘shganda y qisqarib, 2x hosil bo‘ladi.'
    },
    percent_base: {
      shortLabel: 'Boshlang‘ich miqdordan foiz ulushi',
      personalMessage: 'Chegirma miqdorini hisoblamasdan, foiz sonini narxdan to‘g‘ridan-to‘g‘ri ayirdingiz.',
      explanation: 'Avval boshlang‘ich narxdan chegirma summasini topib, so‘ng uni ayiramiz.'
    },
    sample_space: {
      shortLabel: 'Ehtimollik maxrajidagi barcha natijalar soni',
      personalMessage: 'Ehtimollik masalasida maxrajga barcha sharlar o‘rniga faqat bir qismini yozdingiz.',
      explanation: 'P = m / n formulasida n — barcha teng imkoniyatli natijalar yig‘indisi.'
    },
    order_factor: {
      shortLabel: 'Guruhlash formulasida 2! ga bo‘lish',
      personalMessage: 'C(n, 2) ni hisoblashda n(n − 1) ko‘paytmasini 2 ga bo‘lishni unutdingiz.',
      explanation: 'Tartib muhim bo‘lmagani uchun C(n, 2) = n(n − 1) / 2.'
    },
    root_squaring: {
      shortLabel: 'Ildizdan qutulish uchun kvadratga oshirish',
      personalMessage: 'Ildizli tenglamada o‘ng tomonni kvadratga oshirish o‘rniga 2 ga ko‘paytirdingiz.',
      explanation: '√A = r tenglamada ikkala tomon kvadratga oshiriladi: A = r².'
    },
    vieta_sign: {
      shortLabel: 'Viyet teoremasida ildizlar yig‘indisi ishorasi',
      personalMessage: 'Viyet teoremasi bo‘yicha ildizlar yig‘indisi ishorasida adashdingiz. Bugun shuni tekshiramiz.',
      explanation: 'x² − Sx + P = 0 tenglama uchun ildizlar yig‘indisi x₁ + x₂ = +S ga teng.'
    },
    index_shift: {
      shortLabel: 'Progressiya formulasidagi (n − 1) ko‘paytuvchi',
      personalMessage: 'Arifmetik progressiyada (n − 1)·d o‘rniga n·d qo‘shdingiz.',
      explanation: 'n-chi had formulasi: aₙ = a₁ + (n − 1)d.'
    },
    domain_loss: {
      shortLabel: 'Logarifm ta’rifi va aniqlanish sohasi',
      personalMessage: 'log_a(f(x)) = b dan f(x) = a^b ga o‘tishda asos va darajani adashtirdingiz.',
      explanation: 'log_a(x − c) = b tenglik x − c = a^b degani (x > c).'
    },
    pythagorean_id: {
      shortLabel: 'Asosiy trigonometrik ayniyat',
      personalMessage: 'cos²α ni topishda 1 dan sin²α ni ayirish o‘rniga qo‘shdingiz.',
      explanation: 'sin²α + cos²α = 1 ayniyatdan cos²α = 1 − sin²α kelib chiqadi.'
    },
    power_rule: {
      shortLabel: 'Hosilada (n − 1) daraja ko‘rsatkichi',
      personalMessage: 'xⁿ hosilasini topishda darajani 1 ga kamaytirishni unutdingiz.',
      explanation: 'Darajali funksiya hosilasi: (a·xⁿ)′ = a·n·xⁿ⁻¹.'
    },
    antiderivative_power: {
      shortLabel: 'Boshlang‘ich funksiyada x^(n+1)/(n+1) qoidasi',
      personalMessage: 'Integrallashda darajani 1 ga oshirib, (n + 1) ga bo‘lish qoidasida adashdingiz.',
      explanation: 'a·xⁿ funksiyaning boshlang‘ich funksiyasi: a·xⁿ⁺¹ / (n + 1) + C.'
    },
    half_area: {
      shortLabel: 'Uchburchak yuzasida 1/2 ko‘paytuvchi',
      personalMessage: 'To‘g‘ri burchakli uchburchak yuzasini topishda katetlar ko‘paytmasini 2 ga bo‘lishni unutdingiz.',
      explanation: 'To‘g‘ri burchakli uchburchak yuzasi: S = (a × b) / 2.'
    },
    dot_product_ops: {
      shortLabel: 'Skalyar ko‘paytmada koordinatalarni ko‘paytirish',
      personalMessage: 'Vektorlarning skalyar ko‘paytmasida koordinatalarni ko‘paytirish o‘rniga qo‘shdingiz.',
      explanation: 'Skalyar ko‘paytma formulasi: a⃗ · b⃗ = x₁x₂ + y₁y₂.'
    },
    pyramid_third: {
      shortLabel: 'Piramida hajmida 1/3 koeffitsiyent',
      personalMessage: 'Piramida hajmini hisoblashda S·h ko‘paytmani 3 ga bo‘lishni unutdingiz.',
      explanation: 'Piramida hajmi: V = (S × h) / 3.'
    }
  }
};

export function getErrorCauseCopy(reasonId: ErrorReasonId, language: Language): ErrorCauseCopy {
  return errorCauseCatalog[language][reasonId];
}

export const progressRecordSchema = z
  .object({
    topic: z.enum(topicIds),
    challenge: z.string(),
    independent: z.boolean(),
    source: z.enum(["lab", "lesson", "transfer"]).optional(),
    correct: z.boolean().optional(),
    date: z.string().datetime(),
    wrongAnswer: z.string().max(120).optional(),
    hintsUsed: z.number().int().min(0).max(10).optional(),
    errorReason: z.enum(errorReasonIds).optional(),
    verifiedClean: z.boolean().optional()
  })
  .strict()
  .refine((r) => {
    const prefix = r.source === "lesson" ? `lesson-${r.topic}-` : r.source === "transfer" ? `transfer-${r.topic}-` : `${r.topic}-`;
    const suffix = r.challenge.slice(prefix.length);
    return r.challenge.startsWith(prefix) && /^(0|[1-9]\d*)$/.test(suffix) && Number(suffix) < (r.source === "lesson" ? 3 : variantsPerTopic);
  }, 'Challenge must match topic and variant range');

export const progressSchema = z.object({
  version: z.literal(1),
  records: z.array(progressRecordSchema).max(60)
}).strict();

export type ProgressRecord = z.infer<typeof progressRecordSchema>;
export type Progress = z.infer<typeof progressSchema>;

export interface ErrorCauseSummaryItem {
  reasonId: ErrorReasonId;
  topic: LabTopic;
  topicTitle: string;
  shortLabel: string;
  personalMessage: string;
  explanation: string;
  occurrences: number;
  hintsTotal: number;
  lastWrongAnswer?: string;
  lastDate: string;
  verifiedClean: boolean;
}

export function analyzeErrorCauseHistory(
  progress: Progress,
  language: Language
): ErrorCauseSummaryItem[] {
  const byTopic = new Map<LabTopic, ProgressRecord[]>();
  for (const r of progress.records) {
    const list = byTopic.get(r.topic) ?? [];
    list.push(r);
    byTopic.set(r.topic, list);
  }

  const summaries: ErrorCauseSummaryItem[] = [];
  for (const [topic, records] of byTopic.entries()) {
    const sorted = [...records].sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    const errorRecords = sorted.filter(
      (r) => r.correct === false || Boolean(r.wrongAnswer) || (r.correct === undefined && !r.independent && r.verifiedClean !== true)
    );
    if (errorRecords.length === 0) continue;

    const latestError = errorRecords.at(-1)!;
    const reasonId = latestError.errorReason ?? getTopicErrorReasonId(topic);
    const copy = getErrorCauseCopy(reasonId, language);

    // Verified clean if the learner solved at least one subsequent task on this topic independently with 0 hints
    const lastErrorTime = Date.parse(latestError.date);
    const solvedCleanAfterError = sorted.some(
      (r) =>
        Date.parse(r.date) > lastErrorTime &&
        r.independent &&
        (r.hintsUsed ?? 0) === 0 &&
        !r.wrongAnswer &&
        r.challenge !== latestError.challenge
    );
    const verifiedClean = solvedCleanAfterError;
    const hintsTotal = sorted.reduce((acc, r) => acc + (r.hintsUsed ?? (r.independent ? 0 : 1)), 0);

    summaries.push({
      reasonId,
      topic,
      topicTitle: topicName(topic, language),
      shortLabel: copy.shortLabel,
      personalMessage: copy.personalMessage,
      explanation: copy.explanation,
      occurrences: errorRecords.length,
      hintsTotal,
      lastWrongAnswer: latestError.wrongAnswer,
      lastDate: latestError.date,
      verifiedClean
    });
  }

  // Sort: unverified causes first, then by higher occurrences, then by most recent date
  return summaries.sort((a, b) => {
    if (a.verifiedClean !== b.verifiedClean) return a.verifiedClean ? 1 : -1;
    if (b.occurrences !== a.occurrences) return b.occurrences - a.occurrences;
    return Date.parse(b.lastDate) - Date.parse(a.lastDate);
  });
}

export interface SmartDailyStep {
  id: 'review' | 'error_repair' | 'transfer_new';
  badge: string;
  title: string;
  subtitle: string;
  topic: LabTopic;
  targetTab: 'practice' | 'lab' | 'lesson';
  actionLabel: string;
}

export interface SmartDailySession {
  headline: string;
  whyChosen: string;
  estimatedMinutes: number;
  antiFatigueRotated: boolean;
  dominantCause: ErrorCauseSummaryItem | null;
  errorCauses: ErrorCauseSummaryItem[];
  steps: [SmartDailyStep, SmartDailyStep, SmartDailyStep];
  outcomeSummary: {
    soloSolvedCount: number;
    assistedCount: number;
    confirmedFixedCount: number;
    pendingCausesCount: number;
    summaryText: string;
    nextStepText: string;
  };
}

export function buildSmartDailySession(
  progress: Progress,
  language: Language,
  now: number = Date.now()
): SmartDailySession {
  const causes = analyzeErrorCauseHistory(progress, language);
  const unverifiedCauses = causes.filter((c) => !c.verifiedClean);
  const confirmedCauses = causes.filter((c) => c.verifiedClean);
  const schedule = reviewSchedule(progress, Number.isFinite(now) ? now : Date.now());
  const dueTopics = schedule.filter((s) => s.due).map((s) => s.topic);

  // Anti-fatigue check: did the learner do the last 2 tasks on the exact same topic?
  const sortedAll = [...progress.records].sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  const lastTwoSameTopic =
    sortedAll.length >= 2 && sortedAll.at(-1)!.topic === sortedAll.at(-2)!.topic
      ? sortedAll.at(-1)!.topic
      : null;

  const dominantCause = unverifiedCauses[0] ?? causes[0] ?? null;

  // Pick Topic 1: Review (due topic or assisted topic, avoiding fatigue topic if possible)
  let reviewTopic: LabTopic =
    dueTopics.find((t) => t !== lastTwoSameTopic) ??
    dueTopics[0] ??
    unverifiedCauses.find((c) => c.topic !== lastTwoSameTopic)?.topic ??
    recommendTopic(progress);

  // Pick Topic 2: Error repair (unverified cause topic or next weak topic)
  let errorTopic: LabTopic =
    dominantCause?.topic ??
    labTopics.find((t) => t !== reviewTopic) ??
    'inequalities';

  // Pick Topic 3: New independent challenge (a different topic to interleave)
  let newTopic: LabTopic =
    labTopics.find(
      (t) =>
        t !== reviewTopic &&
        t !== errorTopic &&
        !progress.records.some((r) => r.topic === t && r.independent)
    ) ??
    labTopics.find((t) => t !== reviewTopic && t !== errorTopic) ??
    'quadratic';

  const antiFatigueRotated = Boolean(lastTwoSameTopic && reviewTopic !== lastTwoSameTopic);
  const estimatedMinutes = 8;

  const soloSolvedCount = new Set(
    progress.records.filter((r) => r.independent).map((r) => r.challenge)
  ).size;
  const assistedCount = progress.records.filter((r) => !r.independent).length;

  const reviewTitle = topicName(reviewTopic, language);
  const errorTitle = topicName(errorTopic, language);
  const newTitle = topicName(newTopic, language);
  const errorShort =
    dominantCause?.shortLabel ?? getErrorCauseCopy(getTopicErrorReasonId(errorTopic), language).shortLabel;

  if (language === 'kk') {
    const headline = dominantCause
      ? `Бүгін «${errorShort.toLowerCase()}» қатесін түзетеміз — шамамен ${estimatedMinutes} минут`
      : `Бүгінгі қысқа жаттығу: «${reviewTitle}» — шамамен ${estimatedMinutes} минут`;
    const whyChosen = dominantCause
      ? `${dominantCause.personalMessage}${antiFatigueRotated ? ' Шаршамау үшін тақырыптарды кезектестіреміз.' : ''}`
      : 'Интервалдық қайталау және жаңа есепті өз бетінше шығару тізбегі.';
    return {
      headline,
      whyChosen,
      estimatedMinutes,
      antiFatigueRotated,
      dominantCause,
      errorCauses: causes,
      steps: [
        {
          id: 'review',
          badge: '01 · Қайталау',
          title: `«${reviewTitle}» қайталау — 2 есеп`,
          subtitle: dueTopics.includes(reviewTopic) ? 'Қайталау уақыты келді (2/7 күн)' : 'Ережені еске түсіру',
          topic: reviewTopic,
          targetTab: 'practice',
          actionLabel: 'Қайталауды бастау'
        },
        {
          id: 'error_repair',
          badge: '02 · Қатемен жұмыс',
          title: `1 қатені талдау: ${errorShort}`,
          subtitle: `Тақырып: «${errorTitle}»`,
          topic: errorTopic,
          targetTab: 'lab',
          actionLabel: 'Жаттығу'
        },
        {
          id: 'transfer_new',
          badge: '03 · Жаңа есеп',
          title: `Көмексіз жаңа есеп: «${newTitle}»`,
          subtitle: 'Принципті өз бетінше қолдануды тексеру',
          topic: newTopic,
          targetTab: 'practice',
          actionLabel: 'Шығарып көру'
        }
      ],
      outcomeSummary: {
        soloSolvedCount,
        assistedCount,
        confirmedFixedCount: confirmedCauses.length,
        pendingCausesCount: unverifiedCauses.length,
        summaryText:
          soloSolvedCount > 0 || assistedCount > 0
            ? `Өз бетінше шығарылды: ${soloSolvedCount} есеп · Расталған түзетулер: ${confirmedCauses.length}`
            : 'Алғашқы жаттығуды аяқтаған соң осында нәтиже мен келесі қадам пайда болады.',
        nextStepText:
          unverifiedCauses.length > 0
            ? `Келесі қадам: «${unverifiedCauses[0].topicTitle}» тақырыбында 1 жаңа есепті көмексіз шығарып, қатенің жойылғанын растау.`
            : `Келесі қадам: «${newTitle}» тақырыбына өту.`
      }
    };
  }

  if (language === 'uz') {
    const headline = dominantCause
      ? `Bugun «${errorShort.toLowerCase()}» xatosini tuzatamiz — taxminan ${estimatedMinutes} daqiqa`
      : `Bugungi qisqa mashg‘ulot: «${reviewTitle}» — taxminan ${estimatedMinutes} daqiqa`;
    const whyChosen = dominantCause
      ? `${dominantCause.personalMessage}${antiFatigueRotated ? ' Charchamaslik uchun mavzularni almashtiramiz.' : ''}`
      : 'Intervalli takrorlash va yangi masalani mustaqil yechish navbati.';
    return {
      headline,
      whyChosen,
      estimatedMinutes,
      antiFatigueRotated,
      dominantCause,
      errorCauses: causes,
      steps: [
        {
          id: 'review',
          badge: '01 · Takrorlash',
          title: `«${reviewTitle}»ni takrorlash — 2 masala`,
          subtitle: dueTopics.includes(reviewTopic) ? 'Takrorlash muddati keldi (2/7 kun)' : 'Qoidani mustahkamlash',
          topic: reviewTopic,
          targetTab: 'practice',
          actionLabel: 'Takrorlash'
        },
        {
          id: 'error_repair',
          badge: '02 · Xato tahlili',
          title: `1 ta xatoni tahlil qilish: ${errorShort}`,
          subtitle: `Mavzu: «${errorTitle}»`,
          topic: errorTopic,
          targetTab: 'lab',
          actionLabel: 'Mashq qilish'
        },
        {
          id: 'transfer_new',
          badge: '03 · Yangi masala',
          title: `Yordamsiz yangi masala: «${newTitle}»`,
          subtitle: 'Qoidani mustaqil qo‘llashni tekshirish',
          topic: newTopic,
          targetTab: 'practice',
          actionLabel: 'Sinab ko‘rish'
        }
      ],
      outcomeSummary: {
        soloSolvedCount,
        assistedCount,
        confirmedFixedCount: confirmedCauses.length,
        pendingCausesCount: unverifiedCauses.length,
        summaryText:
          soloSolvedCount > 0 || assistedCount > 0
            ? `Mustaqil yechildi: ${soloSolvedCount} masala · Tasdiqlangan tuzatishlar: ${confirmedCauses.length}`
            : 'Birinchi mashg‘ulotdan so‘ng bu yerda natija va keyingi qadam ko‘rinadi.',
        nextStepText:
          unverifiedCauses.length > 0
            ? `Keyingi qadam: «${unverifiedCauses[0].topicTitle}» mavzusida 1 ta yangi masalani yordamsiz yechib, xato tuzatilganini tasdiqlash.`
            : `Keyingi qadam: «${newTitle}» mavzusiga o‘tish.`
      }
    };
  }

  const headline = dominantCause
    ? `Сегодня исправляем: ${errorShort.toLowerCase()} — примерно ${estimatedMinutes} минут`
    : `Занятие на сегодня: «${reviewTitle}» — примерно ${estimatedMinutes} минут`;
  const whyChosen = dominantCause
    ? `${dominantCause.personalMessage}${antiFatigueRotated ? ' Чередуем со свежей темой, чтобы не вызывать усталость.' : ''}`
    : 'Короткая очередь по интервальному повторению и проверке самостоятельного переноса навыка.';

  return {
    headline,
    whyChosen,
    estimatedMinutes,
    antiFatigueRotated,
    dominantCause,
    errorCauses: causes,
    steps: [
      {
        id: 'review',
        badge: '01 · Повторить',
        title: `Повторить «${reviewTitle}» — 2 задачи`,
        subtitle: dueTopics.includes(reviewTopic) ? 'Подошёл срок интервального повторения (2/7 дней)' : 'Короткое закрепление правила',
        topic: reviewTopic,
        targetTab: 'practice',
        actionLabel: 'Начать повторение'
      },
      {
        id: 'error_repair',
        badge: '02 · Разобрать ошибку',
        title: `Разобрать 1 ошибку: ${errorShort}`,
        subtitle: `Тема: «${errorTitle}»`,
        topic: errorTopic,
        targetTab: 'lab',
        actionLabel: 'Потренироваться'
      },
      {
        id: 'transfer_new',
        badge: '03 · Новая задача',
        title: `Попробовать новую задачу: «${newTitle}»`,
        subtitle: 'Проверка самостоятельного решения без подсказок',
        topic: newTopic,
        targetTab: 'practice',
        actionLabel: 'Попробовать'
      }
    ],
    outcomeSummary: {
      soloSolvedCount,
      assistedCount,
      confirmedFixedCount: confirmedCauses.length,
      pendingCausesCount: unverifiedCauses.length,
      summaryText:
        soloSolvedCount > 0 || assistedCount > 0
          ? `Решено самостоятельно: ${soloSolvedCount} зад. · С подсказкой: ${assistedCount} · Подтверждено исправлений: ${confirmedCauses.length}`
          : 'После первого короткого занятия здесь появится разбор: что получилось самостоятельно и что проверить дальше.',
      nextStepText:
        unverifiedCauses.length > 0
          ? `Что дальше: решить 1 новую задачу по теме «${unverifiedCauses[0].topicTitle}» без подсказок, чтобы подтвердить исправление причины ошибки.`
          : `Что дальше: перейти к новой теме «${newTitle}» или закрепить результат в пробном ЕНТ.`
    }
  };
}

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
  targetScore: number | null,
  weeksLeft: number | null,
  language: Language
) {
  const counts = labTopics.map((topic) => {
    const solo = new Set(progress.records.filter((r) => r.topic === topic && r.independent).map((r) => r.challenge)).size;
    const assisted = progress.records.filter((r) => r.topic === topic && !r.independent).length;
    return { topic, title: topicName(topic, language), solo, assisted };
  });
  const weak = counts.filter(c => c.solo < 2).sort((a, b) => a.solo - b.solo || b.assisted - a.assisted).slice(0, 4);
  const strong = counts.filter((c) => c.solo >= 2).map((c) => c.topic);
  const perWeek = targetScore !== null && weeksLeft !== null ? Math.max(2, Math.ceil(labTopics.length * (targetScore / 20) / Math.max(1, Math.min(weeksLeft, 8)))) : null;
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


