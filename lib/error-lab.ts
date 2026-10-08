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
    percent: 'Проценты и пропорции',
    probability: 'Вероятность и комбинаторика',
    quadratic: 'Квадратные уравнения (Виет)',
    progressions: 'Прогрессии (aₙ и Sₙ)',
    functions: 'Степени и логарифмы',
    trigonometry: 'Тригонометрия',
    derivative: 'Производная и экстремумы',
    planimetry: 'Планиметрия (площади)',
    stereometry: 'Стереометрия (объёмы)'
  },
  kk: {
    linear: 'Сызықтық теңдеулер',
    percent: 'Пайыздар мен пропорциялар',
    probability: 'Ықтималдық және комбинаторика',
    quadratic: 'Квадрат теңдеулер (Виет)',
    progressions: 'Прогрессиялар (aₙ және Sₙ)',
    functions: 'Дәрежелер мен логарифмдер',
    trigonometry: 'Тригонометрия',
    derivative: 'Туынды және экстремумдар',
    planimetry: 'Планиметрия (аудандар)',
    stereometry: 'Стереометрия (көлемдер)'
  },
  uz: {
    linear: 'Chiziqli tenglamalar',
    percent: 'Foizlar va proporsiyalar',
    probability: 'Ehtimollik va kombinatorika',
    quadratic: 'Kvadrat tenglamalar (Viyet)',
    progressions: 'Progressiyalar (aₙ va Sₙ)',
    functions: 'Darajalar va logarifmlar',
    trigonometry: 'Trigonometriya',
    derivative: 'Hosila va ekstremumlar',
    planimetry: 'Planimetriya (yuzalar)',
    stereometry: 'Stereometriya (hajmlar)'
  }
};

const text = {
  ru: {
    solve: 'Найдите x',
    subtract: 'Вычитаем',
    both: 'с обеих сторон',
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
    planTask: 'Катеты прямоугольного треугольника равны',
    planFind: 'Найдите площадь треугольника.',
    planWhy: 'Площадь прямоугольного треугольника равна половине произведения катетов S = (a × b) / 2, а не полному произведению.',
    planHint: 'Умножь катеты и раздели произведение на 2.',
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
    planTask: 'Тікбұрышты үшбұрыштың катеттері',
    planFind: 'Үшбұрыштың ауданын табыңыз.',
    planWhy: 'Тікбұрышты үшбұрыш ауданы катеттер көбейтіндісінің жартысына тең: S = (a × b) / 2.',
    planHint: 'Катеттерді көбейтіп, нәтижені 2-ге бөліңіз.',
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
    planTask: 'To‘g‘ri burchakli uchburchak katetlari',
    planFind: 'Uchburchak yuzasini toping.',
    planWhy: 'To‘g‘ri burchakli uchburchak yuzasi katetlar ko‘paytmasining yarmiga teng: S = (a × b) / 2.',
    planHint: 'Katetlarni ko‘paytirib, natijani 2 ga bo‘ling.',
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
    percent: ['Процент — сотая доля. Нужно делить на 100, не на 10.', 'Скидка уменьшает цену: её вычитают, а не прибавляют.'],
    probability: ['Спрашивают о синем шаре. Нужно считать синие, а не красные шары.', 'В числителе — подходящие исходы, в знаменателе — все. Дробь перевёрнута.'],
    quadratic: ['Произведение и сумма корней перепутаны местами.', 'В ответе нужно выбрать больший из двух корней, а не меньший.'],
    progressions: ['Вместо первого члена a₁ подставили разность d.', 'В последнем шаге перемножили числа вместо сложения a₁ и прироста.'],
    functions: ['Основание логарифма перепутали с показателем степени.', 'При переносе вычитаемого в правую часть нужно прибавить число, а не вычесть.'],
    trigonometry: ['При вынесении общего множителя потеряли второе слагаемое.', 'К результату тождества забыли прибавить свободное слагаемое.'],
    derivative: ['При дифференцировании ax³ забыли умножить коэффициент на 3.', 'Производная линейного члена bx равна b, а не нулю.'],
    planimetry: ['Вместо умножения катетов нашли их сумму.', 'При делении произведения катетов на 2 допустили ошибку: разделили на 4.'],
    stereometry: ['Площадь квадрата со стороной a равна a², а не периметру 4a.', 'В последнем шаге разделили на 2 вместо деления на 3 по формуле пирамиды.']
  },
  kk: {
    linear: ['Сан тек оң жақтан азайтылды. Бірдей амалды екі жаққа қолдану керек.', 'Соңғы қадамда x алдындағы коэффициентке бөлу керек.'],
    percent: ['Пайыз — жүзден бір үлес. 10-ға емес, 100-ге бөлеміз.', 'Жеңілдік бағаны азайтады: оны қоспай, азайтамыз.'],
    probability: ['Көк шар сұралған. Қызыл емес, көк шарларды санау керек.', 'Алымда қолайлы, бөлімде барлық нәтижелер болады. Бөлшек кері жазылған.'],
    quadratic: ['Түбірлердің қосындысы мен көбейтіндісі ауысып кеткен.', 'Жауапта кіші түбірді емес, үлкен түбірді таңдау керек.'],
    progressions: ['Бірінші мүше a₁ орнына d айырымы жазылған.', 'Соңғы қадамда қосудың орнына көбейту орындалған.'],
    functions: ['Логарифм негізі мен дәреже көрсеткіші ауысып кеткен.', 'Бос мүшені оң жаққа шығарғанда азайту емес, қосу керек.'],
    trigonometry: ['Ортақ көбейткішті шығарғанда екінші қосылғыш қалып қойған.', 'Соңғы қадамда бос мүшені қосу ұмытылған.'],
    derivative: ['ax³ туындысын тапқанда коэффициентті 3-ке көбейту ұмытылған.', 'bx сызықтық мүшесінің туындысы 0 емес, b болады.'],
    planimetry: ['Катеттерді көбейтудің орнына оларды қосқан.', 'Соңғы қадамда 2-ге емес, 4-ке бөлген.'],
    stereometry: ['Шаршы ауданы 4a емес, a² болады.', 'Пирамида формуласы бойынша 2-ге емес, 3-ке бөлу керек.']
  },
  uz: {
    linear: ['Son faqat o‘ng tomondan ayirildi. Ikkala tomonga bir xil amal qo‘llash kerak.', 'Oxirgi qadamda x oldidagi koeffitsiyentga bo‘lish kerak.'],
    percent: ['Foiz — yuzdan bir ulush. 10 ga emas, 100 ga bo‘lamiz.', 'Chegirma narxni kamaytiradi: uni qo‘shmaymiz, ayiramiz.'],
    probability: ['Ko‘k shar so‘ralgan. Qizil emas, ko‘k sharlarni sanash kerak.', 'Suratda mos natijalar, maxrajda barcha natijalar. Kasr teskari yozilgan.'],
    quadratic: ['Ildizlar yig‘indisi va ko‘paytmasi o‘rni almashib qolgan.', 'Javobda kichik ildiz emas, katta ildiz tanlanishi kerak.'],
    progressions: ['Birinchi had a₁ o‘rniga d ayirma qo‘yilgan.', 'Oxirgi qadamda qo‘shish o‘rniga ko‘paytirish bajarilgan.'],
    functions: ['Logarifm asosi va daraja ko‘rsatkichi almashib qolgan.', 'Ozod hadni o‘ng tomonga o‘tkazishda ayirish emas, qo‘shish kerak.'],
    trigonometry: ['Umumiy ko‘paytuvchini chiqarishda ikkinchi had tushib qolgan.', 'Oxirgi qadamda ozod hadni qo‘shish unutilgan.'],
    derivative: ['ax³ hosilasini topishda koeffitsiyentni 3 ga ko‘paytirish unutilgan.', 'bx chiziqli hadning hosilasi 0 emas, b ga teng.'],
    planimetry: ['Katetlarni ko‘paytirish o‘rniga ularni qo‘shib qo‘ygan.', 'Oxirgi qadamda 2 ga emas, 4 ga bo‘lingan.'],
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
    return vary(
      {
        id, topic,
        task: `${a}x + ${b} = ${c}. ${t.solve}.`,
        steps: [`${t.subtract} ${b} ${t.both}.`, `${a}x = ${c}`, `x = ${c}/${a}`],
        wrongStep: 1,
        explanation: t.eqWhy,
        repair: `${a}x = ${c} − ${b} = ${a * x}; x = ${x}.`,
        transfer: `${aa}x + ${b} = ${cc}. ${t.solve}.`,
        answer: xx, unit: '',
        hints: [t.eqHint, `${aa}x = ${cc} − ${b}`, `x = (${cc} − ${b}) / ${aa}`],
        solution: `(${cc} − ${b}) / ${aa} = ${xx}`
      },
      n, language,
      [`${a}x = ${c} − ${b}`, `${a}x = ${a * x}`, `x = ${x}`],
      [`${a}x + ${b} = ${c} − ${b}`, `${a}x = ${c} − ${b} − ${b}`, `x = (${c} − ${b} − ${b})/${a}`],
      ['', '', `x = ${a * x}/${a + 1}`]
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
