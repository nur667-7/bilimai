import { topicIds, type TopicId, type Language } from "./curriculum.ts";
export type { TopicId, Language } from "./curriculum.ts";

export type Lesson = {
  id: TopicId;
  section: string;
  title: string;
  intro: string;
  rule: string;
  example: string;
  steps: string[];
  questions: { text: string; options: string[]; correct: number; why: string }[];
};

export const untTopicIds = topicIds;

export const lessons: Record<Language, Lesson[]> = {
  kk: [
    {
      id: "linear",
      section: "Алгебра · ҰБТ базасы",
      title: "Сызықтық теңдеулер",
      intro: "Екі жақтың теңдігін сақтап, белгісіз айнымалыны табамыз.",
      rule: "Теңдеудің екі жағына бірдей амал қолданамыз. Тек нөлден өзге санға бөлуге болады.",
      example: "3x + 6 = 21",
      steps: [
        "Екі жақтан 6-ны азайтамыз: 3x = 15.",
        "Екі жақты 3-ке бөлеміз: x = 5.",
        "Тексереміз: 3 × 5 + 6 = 21."
      ],
      questions: [
        { text: "2x + 4 = 14. x неге тең?", options: ["3", "5", "7"], correct: 1, why: "4-ті азайтамыз: 2x = 10. 2-ге бөлеміз: x = 5." },
        { text: "5x − 10 = 15. x-ті табыңыз.", options: ["1", "3", "5"], correct: 2, why: "10-ды қосамыз: 5x = 25. 5-ке бөлеміз: x = 5." },
        { text: "Қай амал теңдікті сақтайды?", options: ["Тек сол жаққа 4 қосу", "Екі жақтан 4 азайту", "Екі жақты нөлге бөлу"], correct: 1, why: "Екі жаққа бірдей рұқсат етілген амал қолдану теңдікті сақтайды." }
      ]
    },
    {
      id: "percent",
      section: "Мат. сауаттылық · ҰБТ",
      title: "Пайыздар және пропорциялар",
      intro: "Пайызды үлеске айналдырып, өзгерістер мен қоспаларды есептейміз.",
      rule: "N санының p пайызы — N × p / 100. p% жеңілдіктен кейін бастапқы бағаның (100 − p)% бөлігі қалады.",
      example: "200 000 теңге бағасына 15% жеңілдік",
      steps: [
        "Жеңілдік: 200 000 × 15 / 100 = 30 000 теңге.",
        "Соңғы баға: 200 000 − 30 000 = 170 000 теңге.",
        "Тексеру: 200 000-ның 85 пайызы = 170 000 теңге."
      ],
      questions: [
        { text: "150-дің 20 пайызы нешеге тең?", options: ["20", "30", "120"], correct: 1, why: "150 × 20 / 100 = 30." },
        { text: "Баға 100 000 теңге, жеңілдік 10%. Қанша төлейсіз?", options: ["10 000 теңге", "90 000 теңге", "110 000 теңге"], correct: 1, why: "Жеңілдік 10 000 теңге. 100 000 − 10 000 = 90 000 теңге." },
        { text: "Баға 80-нен 100-ге өсті. Неше пайызға?", options: ["20%", "25%", "80%"], correct: 1, why: "Өсім 20. Бастапқы баға 80: 20 / 80 × 100 = 25%." }
      ]
    },
    {
      id: "probability",
      section: "Мат. сауаттылық · ҰБТ",
      title: "Классикалық ықтималдық",
      intro: "Нәтижелердің мүмкіндігі бірдей болғанда ықтималдықты есептейміз.",
      rule: "Ықтималдық = қолайлы нәтижелер саны / барлық тең мүмкіндікті нәтижелер саны. Мәні 0 мен 1 аралығында.",
      example: "Әділ ойын сүйегінде жұп сан түсуі",
      steps: [
        "Мүмкіндігі бірдей 6 нәтиже бар: 1, 2, 3, 4, 5, 6.",
        "Қолайлы 3 нәтиже: 2, 4, 6.",
        "Ықтималдық: 3 / 6 = 1 / 2 = 50%."
      ],
      questions: [
        { text: "Әділ ойын сүйегінде 6 түсу ықтималдығы?", options: ["1/2", "1/6", "1/3"], correct: 1, why: "Алты нәтижеден біреуі қолайлы: 1/6." },
        { text: "Қапта 3 қызыл және 2 көк шар бар. Көк шар түсу ықтималдығы?", options: ["2/3", "3/5", "2/5"], correct: 2, why: "Барлығы 5 шар, көк шар саны 2: ықтималдық 2/5." },
        { text: "Ықтималдық 1,2 болуы мүмкін бе?", options: ["Иә", "Жоқ"], correct: 1, why: "Ықтималдық 1-ден үлкен болмайды." }
      ]
    },
    {
      id: "quadratic",
      section: "Алгебра · ҰБТ",
      title: "Квадрат теңдеулер және Виет теоремасы",
      intro: "Дискриминант пен Виет теоремасы арқылы түбірлерді жылдам табамыз.",
      rule: "Келтірілген x² + px + q = 0 теңдеуі үшін Виет теоремасы: x₁ + x₂ = −p (қарама-қарсы таңбамен) және x₁ × x₂ = q.",
      example: "x² − 7x + 12 = 0",
      steps: [
        "Түбірлердің қосындысы: x₁ + x₂ = 7.",
        "Түбірлердің көбейтіндісі: x₁ × x₂ = 12.",
        "Сандарды табамыз: x₁ = 3, x₂ = 4 (үлкен түбірі 4)."
      ],
      questions: [
        { text: "x² − 5x + 6 = 0 теңдеуінің түбірлерінің қосындысы неге тең?", options: ["−5", "5", "6"], correct: 1, why: "Виет теоремасы бойынша x₁ + x₂ = −(−5) = 5." },
        { text: "x² − 8x + 15 = 0 теңдеуінің үлкен түбірін табыңыз.", options: ["3", "5", "8"], correct: 1, why: "3 + 5 = 8 және 3 × 5 = 15, үлкен түбірі 5." },
        { text: "D < 0 болғанда нақты түбірлер саны нешеу?", options: ["Екеу", "Біреу", "Нақты түбір жоқ"], correct: 2, why: "Дискриминант теріс болса, нақты сандар жиынында түбір болмайды." }
      ]
    },
    {
      id: "progressions",
      section: "Алгебра · ҰБТ",
      title: "Арифметикалық және геометриялық прогрессия",
      intro: "Тізбектің n-ші мүшесін және қосындысын формуламен есептейміз.",
      rule: "Арифметикалық прогрессияның n-ші мүшесі: aₙ = a₁ + (n − 1)d. Айырым d тек (n − 1) қадамға көбейтіледі.",
      example: "a₁ = 4, d = 3 болса, a₆ мүшесін табу",
      steps: [
        "Қадам саны: n − 1 = 6 − 1 = 5.",
        "Өсімді есептейміз: 5 × 3 = 15.",
        "Алтыншы мүше: a₆ = 4 + 15 = 19."
      ],
      questions: [
        { text: "a₁ = 2, d = 4. Прогрессияның 5-ші мүшесі a₅ неге тең?", options: ["18", "22", "16"], correct: 0, why: "a₅ = 2 + (5 − 1) × 4 = 2 + 16 = 18." },
        { text: "Неге формулада n емес, (n − 1) қолданылады?", options: ["Бірінші мүшеден n-ші мүшеге дейін n − 1 қадам бар", "Жай шартты белгі", "Тек жұп сандар үшін"], correct: 0, why: "a₁-ден бастағанда әр келесі мүшеге өту бір қадам, сондықтан n-ші мүшеге дейін n − 1 қадам." },
        { text: "b₁ = 3, q = 2 геометриялық прогрессияның b₄ мүшесі?", options: ["12", "24", "48"], correct: 1, why: "b₄ = b₁ × q³ = 3 × 8 = 24." }
      ]
    },
    {
      id: "functions",
      section: "Алгебра · ҰБТ",
      title: "Дәрежелер және логарифмдер",
      intro: "Логарифм анықтамасы мен мүмкін мәндер облысын (ММО) қолданамыз.",
      rule: "log_b(A) = k теңдеуі A = b^k дегенді білдіреді (мұндағы A > 0, b > 0, b ≠ 1).",
      example: "log₂(x − 3) = 4",
      steps: [
        "Анықтама бойынша: x − 3 = 2⁴.",
        "Дәрежені есептейміз: 2⁴ = 16.",
        "x = 16 + 3 = 19 (тексереміз: 19 − 3 = 16 > 0)."
      ],
      questions: [
        { text: "log₃(x − 1) = 2 теңдеуін шешіңіз.", options: ["7", "10", "9"], correct: 1, why: "x − 1 = 3² = 9, демек x = 10." },
        { text: "log₅(25) мәні неге тең?", options: ["2", "5", "1"], correct: 0, why: "5² = 25 болғандықтан, log₅(25) = 2." },
        { text: "Логарифм астындағы өрнек қандай болуы шарт?", options: ["Кез келген сан", "Қатаң оң (> 0)", "Теріс (< 0)"], correct: 1, why: "Логарифм тек оң сандар үшін анықталған (A > 0)." }
      ]
    },
    {
      id: "trigonometry",
      section: "Тригонометрия · ҰБТ",
      title: "Негізгі тригонометриялық тепе-теңдік",
      intro: "Негізгі тригонометриялық тепе-теңдік арқылы өрнектерді ықшамдаймыз.",
      rule: "Кез келген α бұрышы үшін: sin²α + cos²α = 1. Ортақ көбейткішті жақша сыртына шығару есепті бірден ықшамдайды.",
      example: "5 sin²(25°) + 5 cos²(25°) + 3",
      steps: [
        "5 көбейткішін жақша сыртына шығарамыз: 5 × (sin²(25°) + cos²(25°)) + 3.",
        "Негізгі тепе-теңдікті қолданамыз: 5 × 1 + 3.",
        "Нәтиже: 5 + 3 = 8."
      ],
      questions: [
        { text: "4 sin²α + 4 cos²α өрнегінің мәні неге тең?", options: ["1", "4", "8"], correct: 1, why: "4 × (sin²α + cos²α) = 4 × 1 = 4." },
        { text: "7 sin²(18°) + 7 cos²(18°) − 2 мәнін табыңыз.", options: ["5", "7", "9"], correct: 0, why: "7 × 1 − 2 = 5." },
        { text: "cos²α неге тең?", options: ["1 + sin²α", "1 − sin²α", "sin²α − 1"], correct: 1, why: "sin²α + cos²α = 1 тепе-теңдігінен cos²α = 1 − sin²α." }
      ]
    },
    {
      id: "derivative",
      section: "Мат. талдау · ҰБТ",
      title: "Туынды және функция экстремумдары",
      intro: "Дәрежелік функцияның туындысын және жанаманың бұрыштық коэффициентін табамыз.",
      rule: "(xⁿ)' = n × xⁿ⁻¹, ал (cx)' = c және тұрақты санның туындысы (C)' = 0.",
      example: "f(x) = 2x³ + 5x функциясы үшін f'(2) мәнін табу",
      steps: [
        "Туындыны табамыз: f'(x) = 2 × 3x² + 5 = 6x² + 5.",
        "x = 2 мәнін қоямыз: f'(2) = 6 × 2² + 5.",
        "Есептейміз: 6 × 4 + 5 = 29."
      ],
      questions: [
        { text: "f(x) = x³ + 4x функциясының туындысы f'(x)?", options: ["3x² + 4", "x² + 4", "3x³ + 4"], correct: 0, why: "(x³)' = 3x², (4x)' = 4." },
        { text: "f(x) = 3x² − 7 функциясы үшін f'(2) мәнін табыңыз.", options: ["12", "5", "6"], correct: 0, why: "f'(x) = 6x, ал (−7)' = 0. Сонда f'(2) = 6 × 2 = 12." },
        { text: "Экстремум нүктесінің қажетті шарты қандай?", options: ["f(x) = 0", "f'(x) = 0 немесе жоқ", "f'(x) > 0"], correct: 1, why: "Стационар нүктелерде туынды нөлге тең болады." }
      ]
    },
    {
      id: "planimetry",
      section: "Геометрия · ҰБТ",
      title: "Планиметрия: үшбұрыштар мен аудандар",
      intro: "Тікбұрышты үшбұрыштың ауданы мен Пифагор теоремасын есептейміз.",
      rule: "Тікбұрышты үшбұрыштың ауданы катеттер көбейтіндісінің жартысына тең: S = (a × b) / 2.",
      example: "Катеттері a = 6 және b = 8 болатын тікбұрышты үшбұрыш ауданы",
      steps: [
        "Катеттердің көбейтіндісі: 6 × 8 = 48 (тік төртбұрыш ауданы).",
        "Екіге бөлеміз: S = 48 / 2 = 24.",
        "Жауабы: 24 кв. бірлік."
      ],
      questions: [
        { text: "Катеттері 4 және 5 болатын тікбұрышты үшбұрыштың ауданы?", options: ["20", "10", "9"], correct: 1, why: "S = (4 × 5) / 2 = 10." },
        { text: "Катеттері 3 және 4 болса, гипотенуза неге тең?", options: ["5", "7", "6"], correct: 0, why: "Пифагор теоремасы: c² = 3² + 4² = 25, c = 5." },
        { text: "Неге формулада көбейтінді 2-ге бөлінеді?", options: ["Тікбұрышты үшбұрыш — тік төртбұрыштың дәл жартысы", "Периметрді табу үшін", "Тек теңқабырғалы үшбұрыш үшін"], correct: 0, why: "Диагональ тік төртбұрышты тең екі тікбұрышты үшбұрышқа бөледі." }
      ]
    },
    {
      id: "stereometry",
      section: "Геометрия · ҰБТ",
      title: "Стереометрия: көлемдер мен кеңістік денелері",
      intro: "Пирамида, призма және цилиндр көлемдерінің арақатынасын түсінеміз.",
      rule: "Пирамиданың көлемі табан ауданы мен биіктік көбейтіндісінің үштен біріне тең: V = (1/3) × S_табан × h.",
      example: "Табан қабырғасы a = 4, биіктігі h = 6 болатын дұрыс төртбұрышты пирамида көлемі",
      steps: [
        "Табан ауданы (шаршы): S = 4² = 16.",
        "Призма көлеміндей көбейтінді: 16 × 6 = 96.",
        "Үшке бөлеміз: V = 96 / 3 = 32."
      ],
      questions: [
        { text: "Табан ауданы 12, биіктігі 5 пирамиданың көлемі?", options: ["60", "20", "30"], correct: 1, why: "V = (12 × 5) / 3 = 20." },
        { text: "Қабырғасы 3-ке тең кубтың көлемі нешеге тең?", options: ["9", "27", "18"], correct: 1, why: "V = a³ = 3³ = 27." },
        { text: "Бірдей табан мен биіктікте пирамида көлемі призма көлемінен неше есе кіші?", options: ["2 есе", "3 есе", "4 есе"], correct: 1, why: "Пирамида формуласында 1/3 коэффициенті бар." }
      ]
    }
  ],
  ru: [
    {
      id: "linear",
      section: "Алгебра · База ЕНТ",
      title: "Линейные уравнения",
      intro: "Находим неизвестное, сохраняя равенство двух сторон.",
      rule: "С обеими сторонами выполняем одно и то же действие. Делить можно только на ненулевое число.",
      example: "3x + 6 = 21",
      steps: [
        "Вычтем 6 с обеих сторон: 3x = 15.",
        "Разделим обе стороны на 3: x = 5.",
        "Проверим: 3 × 5 + 6 = 21."
      ],
      questions: [
        { text: "2x + 4 = 14. Чему равен x?", options: ["3", "5", "7"], correct: 1, why: "Вычитаем 4: 2x = 10. Делим на 2: x = 5." },
        { text: "5x − 10 = 15. Найдите x.", options: ["1", "3", "5"], correct: 2, why: "Прибавляем 10: 5x = 25. Делим на 5: x = 5." },
        { text: "Какой шаг сохраняет равенство?", options: ["Прибавить 4 только слева", "Вычесть 4 с обеих сторон", "Разделить обе стороны на ноль"], correct: 1, why: "Одинаковое допустимое действие с обеими сторонами сохраняет равенство." }
      ]
    },
    {
      id: "percent",
      section: "Мат. грамотность · ЕНТ",
      title: "Проценты и пропорции",
      intro: "Переводим проценты в доли и считаем изменения цены и сплавов.",
      rule: "p% от числа N — это N × p / 100. После скидки p% остаётся (100 − p)% исходной цены.",
      example: "Скидка 15% на цену 200 000 тенге",
      steps: [
        "Скидка: 200 000 × 15 / 100 = 30 000 тенге.",
        "Итог: 200 000 − 30 000 = 170 000 тенге.",
        "Проверка: 85% × 200 000 = 170 000 тенге."
      ],
      questions: [
        { text: "Сколько составляет 20% от 150?", options: ["20", "30", "120"], correct: 1, why: "150 × 20 / 100 = 30." },
        { text: "Цена 100 000 тенге, скидка 10%. Сколько заплатить?", options: ["10 000 тенге", "90 000 тенге", "110 000 тенге"], correct: 1, why: "Скидка 10 000 тенге. Итог: 100 000 − 10 000 = 90 000 тенге." },
        { text: "Цена выросла с 80 до 100. На сколько процентов?", options: ["20%", "25%", "80%"], correct: 1, why: "Рост 20 делим на исходную цену 80: 20 / 80 × 100 = 25%." }
      ]
    },
    {
      id: "probability",
      section: "Мат. грамотность · ЕНТ",
      title: "Классическая вероятность",
      intro: "Считаем шансы, когда исходы равновероятны.",
      rule: "Вероятность = число подходящих исходов / число всех равновероятных исходов. Значение лежит от 0 до 1.",
      example: "Честный кубик: выпадет чётное число",
      steps: [
        "Всего 6 равновероятных исходов: 1, 2, 3, 4, 5, 6.",
        "Подходят 3 исхода: 2, 4, 6.",
        "Вероятность: 3 / 6 = 1 / 2 = 50%."
      ],
      questions: [
        { text: "Шанс получить 6 на честном кубике?", options: ["1/2", "1/6", "1/3"], correct: 1, why: "Один подходящий исход из шести: 1/6." },
        { text: "В мешке 3 красных и 2 синих шара. Шанс синего?", options: ["2/3", "3/5", "2/5"], correct: 2, why: "Всего 5 шаров, синих 2: вероятность 2/5." },
        { text: "Может ли вероятность равняться 1,2?", options: ["Да", "Нет"], correct: 1, why: "Вероятность не больше 1." }
      ]
    },
    {
      id: "quadratic",
      section: "Алгебра · ЕНТ",
      title: "Квадратные уравнения и теорема Виета",
      intro: "Находим корни через дискриминант и теорему Виета без ошибок в знаках.",
      rule: "Для приведённого уравнения x² + px + q = 0 по теореме Виета: x₁ + x₂ = −p (с противоположным знаком) и x₁ × x₂ = q.",
      example: "x² − 7x + 12 = 0",
      steps: [
        "Сумма корней: x₁ + x₂ = 7.",
        "Произведение корней: x₁ × x₂ = 12.",
        "Подбираем корни: x₁ = 3, x₂ = 4 (больший корень равен 4)."
      ],
      questions: [
        { text: "Чему равна сумма корней уравнения x² − 5x + 6 = 0?", options: ["−5", "5", "6"], correct: 1, why: "По теореме Виета x₁ + x₂ = −(−5) = 5." },
        { text: "Найдите больший корень уравнения x² − 8x + 15 = 0.", options: ["3", "5", "8"], correct: 1, why: "Корни 3 и 5 (3 + 5 = 8, 3 × 5 = 15), больший равен 5." },
        { text: "Сколько действительных корней при D < 0?", options: ["Два", "Один", "Ни одного"], correct: 2, why: "При отрицательном дискриминанте действительных корней нет." }
      ]
    },
    {
      id: "progressions",
      section: "Алгебра · ЕНТ",
      title: "Арифметическая и геометрическая прогрессии",
      intro: "Вычисляем n-й член и сумму прогрессии по формуле шагов.",
      rule: "Формула n-го члена арифметической прогрессии: aₙ = a₁ + (n − 1)d. Разность d умножается на (n − 1) шагов.",
      example: "Найти a₆, если a₁ = 4 и d = 3",
      steps: [
        "Число шагов от первого до шестого члена: 6 − 1 = 5.",
        "Прирост за 5 шагов: 5 × 3 = 15.",
        "Шестой член: a₆ = 4 + 15 = 19."
      ],
      questions: [
        { text: "a₁ = 2, d = 4. Чему равен пятый член a₅?", options: ["18", "22", "16"], correct: 0, why: "a₅ = 2 + (5 − 1) × 4 = 18." },
        { text: "Почему разность d умножается на (n − 1), а не на n?", options: ["От 1-го до n-го члена ровно n − 1 шагов", "Это приближённая формула", "Только для чётных n"], correct: 0, why: "Первый член уже задан, поэтому переходов между членами на один меньше." },
        { text: "В геометрической прогрессии b₁ = 3, q = 2. Найдите b₄.", options: ["12", "24", "48"], correct: 1, why: "b₄ = b₁ × q³ = 3 × 8 = 24." }
      ]
    },
    {
      id: "functions",
      section: "Алгебра · ЕНТ",
      title: "Степени и логарифмы",
      intro: "Решаем показательные и логарифмические уравнения с учётом ОДЗ.",
      rule: "Запись log_b(A) = k означает A = b^k при обязательном условии ОДЗ: A > 0, b > 0, b ≠ 1.",
      example: "log₂(x − 3) = 4",
      steps: [
        "По определению логарифма: x − 3 = 2⁴.",
        "Возводим основание в степень: 2⁴ = 16.",
        "Находим x = 16 + 3 = 19 (ОДЗ: 19 − 3 = 16 > 0)."
      ],
      questions: [
        { text: "Решите уравнение log₃(x − 1) = 2.", options: ["7", "10", "9"], correct: 1, why: "x − 1 = 3² = 9, значит x = 10." },
        { text: "Чему равен log₅(25)?", options: ["2", "5", "1"], correct: 0, why: "5² = 25, поэтому логарифм равен 2." },
        { text: "Какое условие ОДЗ обязательно для подлогарифмического выражения A?", options: ["Любое число", "Строго больше нуля (A > 0)", "Меньше нуля (A < 0)"], correct: 1, why: "Логарифм определён только для положительных чисел." }
      ]
    },
    {
      id: "trigonometry",
      section: "Тригонометрия · ЕНТ",
      title: "Основное тригонометрическое тождество",
      intro: "Упрощаем выражения через основное тригонометрическое тождество.",
      rule: "Для любого угла α выполняется тождество: sin²α + cos²α = 1. Вынесение общего множителя сразу сворачивает сумму квадратов в единицу.",
      example: "5 sin²(25°) + 5 cos²(25°) + 3",
      steps: [
        "Выносим 5 за скобки: 5 × (sin²(25°) + cos²(25°)) + 3.",
        "Заменяем скобку на 1: 5 × 1 + 3.",
        "Получаем ответ: 8."
      ],
      questions: [
        { text: "Чему равно выражение 4 sin²α + 4 cos²α?", options: ["1", "4", "8"], correct: 1, why: "4 × (sin²α + cos²α) = 4 × 1 = 4." },
        { text: "Вычислите 7 sin²(18°) + 7 cos²(18°) − 2.", options: ["5", "7", "9"], correct: 0, why: "7 × 1 − 2 = 5." },
        { text: "Как выразить cos²α через sin²α?", options: ["1 + sin²α", "1 − sin²α", "sin²α − 1"], correct: 1, why: "Из sin²α + cos²α = 1 следует cos²α = 1 − sin²α." }
      ]
    },
    {
      id: "derivative",
      section: "Матанализ · ЕНТ",
      title: "Производная и точки экстремума",
      intro: "Находим производную функции, угловой коэффициент касательной и экстремумы.",
      rule: "Производная степенной функции: (xⁿ)' = n × xⁿ⁻¹. Производная линейного члена (cx)' = c, а константы (C)' = 0.",
      example: "Найти f'(2) для функции f(x) = 2x³ + 5x",
      steps: [
        "Берём производную: f'(x) = 2 × 3x² + 5 = 6x² + 5.",
        "Подставляем x = 2: f'(2) = 6 × 2² + 5.",
        "Вычисляем: 6 × 4 + 5 = 29."
      ],
      questions: [
        { text: "Найдите производную функции f(x) = x³ + 4x.", options: ["3x² + 4", "x² + 4", "3x³ + 4"], correct: 0, why: "(x³)' = 3x², а (4x)' = 4." },
        { text: "Для f(x) = 3x² − 7 вычислите f'(2).", options: ["12", "5", "6"], correct: 0, why: "f'(x) = 6x, константа −7 даёт 0. При x = 2 получаем 12." },
        { text: "Какое условие выполняется в стационарной точке экстремума?", options: ["f(x) = 0", "f'(x) = 0", "f'(x) > 0"], correct: 1, why: "В точках гладкого экстремума производная равна нулю." }
      ]
    },
    {
      id: "planimetry",
      section: "Геометрия · ЕНТ",
      title: "Планиметрия: треугольники и площади",
      intro: "Считаем площади фигур и применяем теорему Пифагора без потери коэффициентов.",
      rule: "Площадь прямоугольного треугольника равна половине произведения катетов: S = (a × b) / 2.",
      example: "Площадь прямоугольного треугольника с катетами a = 6 и b = 8",
      steps: [
        "Умножаем катеты (площадь прямоугольника): 6 × 8 = 48.",
        "Делим пополам: S = 48 / 2 = 24.",
        "Ответ: 24 кв. ед."
      ],
      questions: [
        { text: "Найдите площадь прямоугольного треугольника с катетами 4 и 5.", options: ["20", "10", "9"], correct: 1, why: "S = (4 × 5) / 2 = 10." },
        { text: "Катеты равны 3 и 4. Чему равна гипотенуза?", options: ["5", "7", "6"], correct: 0, why: "По теореме Пифагора c² = 3² + 4² = 25, откуда c = 5." },
        { text: "Почему произведение катетов делится на 2?", options: ["Прямоугольный треугольник — половина прямоугольника", "Для перевода единиц", "Только для равнобедренных треугольников"], correct: 0, why: "Диагональ делит прямоугольник со сторонами a и b на два равных треугольника." }
      ]
    },
    {
      id: "stereometry",
      section: "Геометрия · ЕНТ",
      title: "Стереометрия: объёмы пространственных тел",
      intro: "Различаем формулы объёма призмы, пирамиды, цилиндра и конуса.",
      rule: "Объём пирамиды равен одной трети произведения площади основания на высоту: V = (1/3) × S_осн × h.",
      example: "Объём правильной четырёхугольной пирамиды со стороной основания a = 4 и высотой h = 6",
      steps: [
        "Площадь квадратного основания: S = 4² = 16.",
        "Произведение площади основания на высоту: 16 × 6 = 96.",
        "Делим на 3: V = 96 / 3 = 32."
      ],
      questions: [
        { text: "Площадь основания пирамиды 12, высота 5. Найдите объём.", options: ["60", "20", "30"], correct: 1, why: "V = (12 × 5) / 3 = 20." },
        { text: "Чему равен объём куба с ребром 3?", options: ["9", "27", "18"], correct: 1, why: "V = a³ = 3³ = 27." },
        { text: "Во сколько раз объём пирамиды меньше объёма призмы с тем же основанием и высотой?", options: ["В 2 раза", "В 3 раза", "В 4 раза"], correct: 1, why: "В формуле объёма пирамиды и конуса стоит множитель 1/3." }
      ]
    }
  ],
  uz: [
    {
      id: "linear",
      section: "Algebra · Imtihon bazasi",
      title: "Chiziqli tenglamalar",
      intro: "Tenglikni saqlagan holda noma’lum sonni topamiz.",
      rule: "Tenglamaning ikkala tomoniga bir xil amal qo‘llaymiz. Faqat noldan farqli songa bo‘lish mumkin.",
      example: "3x + 6 = 21",
      steps: [
        "Ikkala tomondan 6 ni ayiramiz: 3x = 15.",
        "Ikkala tomonni 3 ga bo‘lamiz: x = 5.",
        "Tekshiramiz: 3 × 5 + 6 = 21."
      ],
      questions: [
        { text: "2x + 4 = 14. x nechaga teng?", options: ["3", "5", "7"], correct: 1, why: "4 ni ayiramiz: 2x = 10. 2 ga bo‘lamiz: x = 5." },
        { text: "5x − 10 = 15. x ni toping.", options: ["1", "3", "5"], correct: 2, why: "10 ni qo‘shamiz: 5x = 25. 5 ga bo‘lamiz: x = 5." },
        { text: "Qaysi amal tenglikni saqlaydi?", options: ["Faqat chap tomonga 4 qo‘shish", "Ikkala tomondan 4 ayirish", "Ikkala tomonni nolga bo‘lish"], correct: 1, why: "Ikkala tomonga bir xil ruxsat etilgan amal qo‘llanadi." }
      ]
    },
    {
      id: "percent",
      section: "Mat. savodxonlik",
      title: "Foizlar va proporsiyalar",
      intro: "Foizni ulushga aylantiramiz va narx o‘zgarishini hisoblaymiz.",
      rule: "N sonning p foizi — N × p / 100. p% chegirmadan keyin boshlang‘ich narxning (100 − p)% qismi qoladi.",
      example: "200 000 so‘m narxga 15% chegirma",
      steps: [
        "Chegirma: 200 000 × 15 / 100 = 30 000 so‘m.",
        "Yakuniy narx: 200 000 − 30 000 = 170 000 so‘m.",
        "Tekshiruv: 200 000 ning 85 foizi = 170 000 so‘m."
      ],
      questions: [
        { text: "150 ning 20 foizi nechaga teng?", options: ["20", "30", "120"], correct: 1, why: "150 × 20 / 100 = 30." },
        { text: "Narx 100 000 so‘m, chegirma 10%. Qancha to‘lanadi?", options: ["10 000 so‘m", "90 000 so‘m", "110 000 so‘m"], correct: 1, why: "Chegirma 10 000 so‘m. 100 000 − 10 000 = 90 000 so‘m." },
        { text: "Narx 80 dan 100 ga oshdi. Necha foizga?", options: ["20%", "25%", "80%"], correct: 1, why: "O‘sish 20. Boshlang‘ich narx 80: 20 / 80 × 100 = 25%." }
      ]
    },
    {
      id: "probability",
      section: "Mat. savodxonlik",
      title: "Klassik ehtimollik",
      intro: "Teng ehtimolli natijalar uchun imkoniyatni hisoblaymiz.",
      rule: "Ehtimollik = mos natijalar soni / barcha teng ehtimolli natijalar soni. Qiymat 0 dan 1 gacha.",
      example: "Adolatli o‘yin kubigida juft son tushishi",
      steps: [
        "6 ta teng ehtimolli natija: 1, 2, 3, 4, 5, 6.",
        "3 tasi mos keladi: 2, 4, 6.",
        "Ehtimollik: 3 / 6 = 1 / 2 = 50%."
      ],
      questions: [
        { text: "Adolatli kubikda 6 tushish ehtimoli?", options: ["1/2", "1/6", "1/3"], correct: 1, why: "Oltita natijadan bittasi mos: 1/6." },
        { text: "Xaltada 3 qizil va 2 ko‘k shar bor. Ko‘k shar ehtimoli?", options: ["2/3", "3/5", "2/5"], correct: 2, why: "Jami 5 shar, 2 tasi ko‘k: 2/5." },
        { text: "Ehtimollik 1,2 bo‘lishi mumkinmi?", options: ["Ha", "Yo‘q"], correct: 1, why: "Ehtimollik 1 dan katta bo‘lmaydi." }
      ]
    },
    {
      id: "quadratic",
      section: "Algebra",
      title: "Kvadrat tenglamalar va Viyet teoremasi",
      intro: "Diskriminant va Viyet teoremasi orqali ildizlarni ishora xatosisiz topamiz.",
      rule: "Keltirilgan x² + px + q = 0 tenglama uchun Viyet teoremasi: x₁ + x₂ = −p (qarama-qarshi ishora bilan) va x₁ × x₂ = q.",
      example: "x² − 7x + 12 = 0",
      steps: [
        "Ildizlar yig‘indisi: x₁ + x₂ = 7.",
        "Ildizlar ko‘paytmasi: x₁ × x₂ = 12.",
        "Ildizlar: x₁ = 3, x₂ = 4 (katta ildiz 4)."
      ],
      questions: [
        { text: "x² − 5x + 6 = 0 tenglama ildizlari yig‘indisi nechaga teng?", options: ["−5", "5", "6"], correct: 1, why: "Viyet teoremasiga ko‘ra x₁ + x₂ = −(−5) = 5." },
        { text: "x² − 8x + 15 = 0 tenglamaning katta ildizini toping.", options: ["3", "5", "8"], correct: 1, why: "Ildizlar 3 va 5, kattasi 5." },
        { text: "D < 0 bo‘lganda haqiqiy ildizlar soni nechta?", options: ["Ikkita", "Bitta", "Haqiqiy ildiz yo‘q"], correct: 2, why: "Diskriminant manfiy bo‘lsa, haqiqiy ildizlar mavjud emas." }
      ]
    },
    {
      id: "progressions",
      section: "Algebra",
      title: "Arifmetik va geometrik progressiyalar",
      intro: "Progressiyaning n-chi hadini va yig‘indisini qadamlar formulasi bilan topamiz.",
      rule: "Arifmetik progressiyaning n-chi hadi: aₙ = a₁ + (n − 1)d. Ayirma d faqat (n − 1) qadamga ko‘paytiriladi.",
      example: "a₁ = 4, d = 3 bo‘lsa, a₆ ni topish",
      steps: [
        "Qadamlar soni: 6 − 1 = 5.",
        "O‘sish miqdori: 5 × 3 = 15.",
        "Oltinchi had: a₆ = 4 + 15 = 19."
      ],
      questions: [
        { text: "a₁ = 2, d = 4. Beshinchi had a₅ nechaga teng?", options: ["18", "22", "16"], correct: 0, why: "a₅ = 2 + (5 − 1) × 4 = 18." },
        { text: "Nega formulada n emas, (n − 1) ishlatiladi?", options: ["1-haddan n-hadgacha n − 1 ta qadam bor", "Shartli qoida", "Faqat juft sonlar uchun"], correct: 0, why: "Birinchi had berilgan, shuning uchun o‘tishlar soni bittaga kam." },
        { text: "b₁ = 3, q = 2 geometrik progressiyaning b₄ hadini toping.", options: ["12", "24", "48"], correct: 1, why: "b₄ = b₁ × q³ = 3 × 8 = 24." }
      ]
    },
    {
      id: "functions",
      section: "Algebra",
      title: "Darajalar va logarifmlar",
      intro: "Aniqlanish sohasini (AS) hisobga olib, logarifmik tenglamalarni yechamiz.",
      rule: "log_b(A) = k ifodasi A = b^k deganidir (bunda A > 0, b > 0, b ≠ 1 bo‘lishi shart).",
      example: "log₂(x − 3) = 4",
      steps: [
        "Ta’rifga ko‘ra: x − 3 = 2⁴.",
        "Darajani hisoblaymiz: 2⁴ = 16.",
        "x = 16 + 3 = 19 (tekshiruv: 19 − 3 = 16 > 0)."
      ],
      questions: [
        { text: "log₃(x − 1) = 2 tenglamani yeching.", options: ["7", "10", "9"], correct: 1, why: "x − 1 = 3² = 9, demak x = 10." },
        { text: "log₅(25) nechaga teng?", options: ["2", "5", "1"], correct: 0, why: "5² = 25 bo‘lgani uchun javob 2." },
        { text: "Logarifm ostidagi ifoda A qanday bo‘lishi shart?", options: ["Ixtiyoriy son", "Qat’iy musbat (A > 0)", "Manfiy (A < 0)"], correct: 1, why: "Logarifm faqat musbat sonlar uchun aniqlangan." }
      ]
    },
    {
      id: "trigonometry",
      section: "Trigonometriya",
      title: "Asosiy trigonometrik ayniyat",
      intro: "Asosiy trigonometrik ayniyat yordamida ifodalarni soddalashtiramiz.",
      rule: "Har qanday α burchak uchun: sin²α + cos²α = 1. Umumiy ko‘paytuvchini qavsdan tashqariga chiqarish hisobni soddalashtiradi.",
      example: "5 sin²(25°) + 5 cos²(25°) + 3",
      steps: [
        "5 ni qavsdan tashqariga chiqaramiz: 5 × (sin²(25°) + cos²(25°)) + 3.",
        "Asosiy ayniyatni qo‘llaymiz: 5 × 1 + 3.",
        "Natija: 8."
      ],
      questions: [
        { text: "4 sin²α + 4 cos²α ifodaning qiymati nechaga teng?", options: ["1", "4", "8"], correct: 1, why: "4 × (sin²α + cos²α) = 4 × 1 = 4." },
        { text: "7 sin²(18°) + 7 cos²(18°) − 2 ni hisoblang.", options: ["5", "7", "9"], correct: 0, why: "7 × 1 − 2 = 5." },
        { text: "cos²α ni sin²α orqali qanday ifodalaymiz?", options: ["1 + sin²α", "1 − sin²α", "sin²α − 1"], correct: 1, why: "sin²α + cos²α = 1 ayniyatdan cos²α = 1 − sin²α kelib chiqadi." }
      ]
    },
    {
      id: "derivative",
      section: "Mat. analiz",
      title: "Hosila va funksiya ekstremumlari",
      intro: "Darajali funksiya hosilasini va urinma burchak koeffitsiyentini topamiz.",
      rule: "(xⁿ)' = n × xⁿ⁻¹, (cx)' = c va o‘zgarmas son hosilasi (C)' = 0.",
      example: "f(x) = 2x³ + 5x funksiya uchun f'(2) ni topish",
      steps: [
        "Hosilani topamiz: f'(x) = 2 × 3x² + 5 = 6x² + 5.",
        "x = 2 qiymatni qo‘yamiz: f'(2) = 6 × 2² + 5.",
        "Hisoblaymiz: 6 × 4 + 5 = 29."
      ],
      questions: [
        { text: "f(x) = x³ + 4x funksiyaning hosilasi f'(x)?", options: ["3x² + 4", "x² + 4", "3x³ + 4"], correct: 0, why: "(x³)' = 3x², (4x)' = 4." },
        { text: "f(x) = 3x² − 7 uchun f'(2) ni hisoblang.", options: ["12", "5", "6"], correct: 0, why: "f'(x) = 6x, (−7)' = 0. f'(2) = 12." },
        { text: "Statsionar ekstremum nuqtasida qanday shart bajariladi?", options: ["f(x) = 0", "f'(x) = 0", "f'(x) > 0"], correct: 1, why: "Ekstremum nuqtasida hosila nolga teng bo‘ladi." }
      ]
    },
    {
      id: "planimetry",
      section: "Geometriya",
      title: "Planimetriya: uchburchaklar va yuzalar",
      intro: "To‘g‘ri burchakli uchburchak yuzasi va Pifagor teoremasini qo‘llaymiz.",
      rule: "To‘g‘ri burchakli uchburchak yuzasi katetlar ko‘paytmasining yarmiga teng: S = (a × b) / 2.",
      example: "Katetlari a = 6 va b = 8 bo‘lgan to‘g‘ri burchakli uchburchak yuzasi",
      steps: [
        "Katetlarni ko‘paytiramiz: 6 × 8 = 48.",
        "Ikkiga bo‘lamiz: S = 48 / 2 = 24.",
        "Javob: 24 kv. birlik."
      ],
      questions: [
        { text: "Katetlari 4 va 5 bo‘lgan to‘g‘ri burchakli uchburchak yuzasi?", options: ["20", "10", "9"], correct: 1, why: "S = (4 × 5) / 2 = 10." },
        { text: "Katetlari 3 va 4 bo‘lsa, gipotenuza nechaga teng?", options: ["5", "7", "6"], correct: 0, why: "Pifagor teoremasi: c² = 3² + 4² = 25, c = 5." },
        { text: "Nega katetlar ko‘paytmasi 2 ga bo‘linadi?", options: ["To‘g‘ri burchakli uchburchak — to‘g‘ri to‘rtburchakning yarmi", "Perimetr topish uchun", "Faqat teng yonli uchburchak uchun"], correct: 0, why: "Diagonal to‘g‘ri to‘rtburchakni ikkita teng uchburchakka ajratadi." }
      ]
    },
    {
      id: "stereometry",
      section: "Geometriya",
      title: "Stereometriya: fazoviy jismlar hajmi",
      intro: "Piramida va prizma hajmlari formulalarini farqlaymiz.",
      rule: "Piramida hajmi asos yuzasi va balandlik ko‘paytmasining uchdan biriga teng: V = (1/3) × S_asos × h.",
      example: "Asos tomoni a = 4, balandligi h = 6 bo‘lgan muntazam to‘rtburchakli piramida hajmi",
      steps: [
        "Kvadrat asos yuzasi: S = 4² = 16.",
        "Asos yuzasini balandlikka ko‘paytiramiz: 16 × 6 = 96.",
        "Uchga bo‘lamiz: V = 96 / 3 = 32."
      ],
      questions: [
        { text: "Asos yuzasi 12, balandligi 5 bo‘lgan piramida hajmi?", options: ["60", "20", "30"], correct: 1, why: "V = (12 × 5) / 3 = 20." },
        { text: "Qirrasi 3 ga teng kubning hajmi nechaga teng?", options: ["9", "27", "18"], correct: 1, why: "V = a³ = 3³ = 27." },
        { text: "Bir xil asos va balandlikka ega piramida hajmi prizma hajmidan necha marta kichik?", options: ["2 marta", "3 marta", "4 marta"], correct: 1, why: "Piramida hajmi formulasida 1/3 koeffitsiyenti bor." }
      ]
    }
  ]
};
