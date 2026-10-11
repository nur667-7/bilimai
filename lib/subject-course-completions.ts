import type { Language } from "./lessons.ts";
import type { UniversalQuestion } from "./question-engine.ts";
import type { UntSubjectId } from "./unt-all-subjects.ts";

function tr(ru: string, kk?: string, uz?: string): Record<Language, string> {
  return {
    ru,
    kk: kk ?? ru,
    uz: uz ?? ru
  };
}

export interface SecondErrorLabBlueprint {
  title: Record<Language, string>;
  taskPrompt: Record<Language, string>;
  steps: Record<Language, [string, string, string]>;
  brokenStepIndex: 0 | 1 | 2;
  errorCategory: string;
  whyBroken: Record<Language, string>;
  correctedStep: Record<Language, string>;
}

/**
 * Additional verified trilingual practice questions for all 11 non-math subjects
 * so every lesson has 3 full questions (basic, intermediate, advanced = 9 questions per course).
 */
export const ADDITIONAL_LESSON_QUESTIONS: Record<string, UniversalQuestion[]> = {
  phys_energy_mkt: [
    {
      id: "phys-q5b",
      subjectId: "physics",
      topicId: "phys_energy_mkt",
      lessonId: "physics-lesson-phys_energy_mkt",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "При увеличении абсолютной температуры идеального одноатомного газа в 4 раза средняя квадратичная скорость его молекул:",
        "Идеал бір атомды газдың абсолют температурасын 4 есе арттырғанда молекулалардың орташа квадраттық жылдамдығы:",
        "Ideal bir atomli gazning absolyut harorati 4 marta ortsa, molekulalarning o‘rtacha kvadratik tezligi:"
      ),
      options: {
        ru: ["увеличится в 4 раза", "увеличится в 2 раза", "уменьшится в 2 раза", "увеличится в 16 раз"],
        kk: ["4 есе артады", "2 есе артады", "2 есе кемиді", "16 есе артады"],
        uz: ["4 marta ortadi", "2 marta ortadi", "2 marta kamayadi", "16 marta ortadi"]
      },
      correctIndex: 1,
      explanation: tr(
        "По формуле МКТ v_кв = √(3RT/M) скорость пропорциональна корню из абсолютной температуры √T. При росте T в 4 раза скорость увеличивается в √4 = 2 раза.",
        "v_кв = √(3RT/M) формуласы бойынша жылдамдық √T-ге пропорционал. T 4 есе өскенде жылдамдық √4 = 2 есе артады.",
        "v_kv = √(3RT/M) formulasiga ko‘ra tezlik √T ga proporsional. T 4 marta ortsa, tezlik √4 = 2 marta ortadi."
      ),
      hint: tr(
        "Вспомните, что абсолютная температура T стоит под знаком квадратного корня.",
        "Абсолют температура T квадрат түбір астында тұрғанын ескеріңіз.",
        "Absolyut harorat T kvadrat ildiz ostida turishini eslang."
      ),
      errorCategory: "formula_power_confusion"
    }
  ],
  phys_electrodynamics: [
    {
      id: "phys-q7",
      subjectId: "physics",
      topicId: "phys_electrodynamics",
      lessonId: "physics-lesson-phys_electrodynamics",
      type: "numeric",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "К источнику тока с ЭДС ε = 12 В и внутренним сопротивлением r = 1 Ом подключили резистор сопротивлением R = 5 Ом. Чему равна сила тока I в цепи (в А)?",
        "ЭҚК ε = 12 В және ішкі кедергісі r = 1 Ом ток көзіне R = 5 Ом резистор қосылды. Тізбектегі ток күші I (А) неге тең?",
        "EYuK ε = 12 V va ichki qarshiligi r = 1 Om manbaga R = 5 Om rezistor ulandi. Zanjirdagi tok kuchi I (A) nechaga teng?"
      ),
      numericAnswer: 2,
      tolerance: 0.01,
      unit: "А",
      explanation: tr(
        "По закону Ома для полной цепи: I = ε / (R + r) = 12 / (5 + 1) = 2 А.",
        "Толық тізбек үшін Ом заңы бойынша: I = ε / (R + r) = 12 / (5 + 1) = 2 А.",
        "To‘liq zanjir uchun Om qonuniga ko‘ra: I = ε / (R + r) = 12 / (5 + 1) = 2 A."
      ),
      hint: tr(
        "Не забудьте сложить внешнее сопротивление R и внутреннее сопротивление источника r.",
        "Сыртқы кедергі R мен ішкі кедергі r-ді қосуды ұмытпаңыз.",
        "Tashqi qarshilik R va ichki qarshilik r ni qo‘shishni unutmang."
      ),
      errorCategory: "internal_resistance_omitted"
    },
    {
      id: "phys-q8",
      subjectId: "physics",
      topicId: "phys_electrodynamics",
      lessonId: "physics-lesson-phys_electrodynamics",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Два одинаковых резистора по 6 Ом каждый соединены параллельно. Чему равно их общее эквивалентное сопротивление R_общ?",
        "Әрқайсысы 6 Ом болатын екі бірдей резистор параллель қосылған. Олардың жалпы кедергісі R_жалпы неге тең?",
        "Har biri 6 Om bo‘lgan ikkita bir xil rezistor parallel ulangan. Ularning umumiy qarshiligi R_um nechaga teng?"
      ),
      options: {
        ru: ["12 Ом", "3 Ом", "6 Ом", "0,33 Ом"],
        kk: ["12 Ом", "3 Ом", "6 Ом", "0,33 Ом"],
        uz: ["12 Om", "3 Om", "6 Om", "0,33 Om"]
      },
      correctIndex: 1,
      explanation: tr(
        "При параллельном соединении: 1/R_общ = 1/6 + 1/6 = 2/6 = 1/3 ⇒ R_общ = 3 Ом (не 1/3 Ом и не 12 Ом).",
        "Параллель қосқанда: 1/R_жалпы = 1/6 + 1/6 = 1/3 ⇒ R_жалпы = 3 Ом.",
        "Parallel ulanganda: 1/R_um = 1/6 + 1/6 = 1/3 ⇒ R_um = 3 Om."
      ),
      hint: tr(
        "При параллельном соединении двух одинаковых резисторов общее сопротивление в 2 раза меньше одного резистора.",
        "Екі бірдей резисторды параллель қосқанда жалпы кедергі 2 есе кемиді.",
        "Ikkita bir xil rezistor parallel ulanganda umumiy qarshilik 2 marta kamayadi."
      ),
      errorCategory: "reciprocal_resistance_inversion"
    }
  ],

  hkz_ancient_saka: [
    {
      id: "hkz-q1b",
      subjectId: "history_kz",
      topicId: "hkz_ancient_saka",
      lessonId: "history_kz-lesson-hkz_ancient_saka",
      type: "single_choice",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "С какой археологической культурой эпохи энеолита на территории Северного Казахстана связано самое раннее в мире одомашнивание лошади?",
        "Солтүстік Қазақстан аумағындағы жылқыны алғаш қолға үйрету энеолит дәуірінің қай археологиялық мәдениетімен байланысты?",
        "Shimoliy Qozog‘iston hududida otni ilk bor xonakilashtirish eneolit davrining qaysi arxeologik madaniyati bilan bog‘liq?"
      ),
      options: {
        ru: ["Андроновская культура", "Ботайская культура", "Бегазы-Дандыбаевская культура", "Тасмолинская культура"],
        kk: ["Андронов мәдениеті", "Ботай мәдениеті", "Беғазы-Дәндібай мәдениеті", "Тасмола мәдениеті"],
        uz: ["Andronov madaniyati", "Botay madaniyati", "Beg‘azi-Dandibay madaniyati", "Tasmola madaniyati"]
      },
      correctIndex: 1,
      explanation: tr(
        "Ботайская культура (IV–III тыс. до н. э., Северо-Казахстанская область, открыта В. Ф. Зайбертом) доказала первичное одомашнивание лошади в степях Казахстана.",
        "Ботай мәдениеті (б.з.б. IV–III мыңж., СҚО, В. Ф. Зайберт ашқан) жылқының алғаш қолға үйретілгенін дәлелдеді.",
        "Botay madaniyati (mil. avv. IV–III mingyillik) otning ilk bor xonakilashtirilganini isbotladi."
      ),
      hint: tr(
        "Вспомните знаменитое поселение эпохи энеолита в Айыртауском районе СКО.",
        "СҚО Айыртау ауданындағы әйгілі энеолит қонысын еске түсіріңіз.",
        "Shimoliy Qozog‘istondagi mashhur eneolit manzilgohini eslang."
      ),
      errorCategory: "archaeological_period_mixup"
    },
    {
      id: "hkz-q1c",
      subjectId: "history_kz",
      topicId: "hkz_ancient_saka",
      lessonId: "history_kz-lesson-hkz_ancient_saka",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "В каком кургане в 1969 году археологом Кемалем Акишевым был обнаружен знаменитый сакский «Золотой человек» (V–IV вв. до н. э.)?",
        "1969 жылы археолог Кемал Ақышев атақты сақ «Алтын адамын» (б.з.б. V–IV ғғ.) қай қорғаннан тапты?",
        "1969-yilda arxeolog Kemal Akishev mashhur sak «Oltin odam»ini qaysi qo‘rg‘ondan topgan?"
      ),
      options: {
        ru: ["Курган Берел", "Курган Иссык (Есик)", "Курган Шиликты", "Курган Бесшатыр"],
        kk: ["Берел қорғаны", "Есік қорғаны", "Шілікті қорғаны", "Бесшатыр қорғаны"],
        uz: ["Berel qo‘rg‘oni", "Issiq (Esik) qo‘rg‘oni", "Shilikti qo‘rg‘oni", "Besshatir qo‘rg‘oni"]
      },
      correctIndex: 1,
      explanation: tr(
        "В 1969 году К. Акишев обнаружил «Золотого человека» и серебряную чашу с 26 знаками рунического письма в кургане Иссык (Есик) близ Алматы.",
        "1969 жылы К. Ақышев Алматы маңындағы Есік қорғанынан «Алтын адамды» және 26 таңбалы күміс тостағанды тапты.",
        "1969-yilda K. Akishev Olmaota yaqinidagi Issiq qo‘rg‘onidan «Oltin odam»ni topdi."
      ),
      hint: tr(
        "Курган расположен в Жетысу (Алматинская область) и дал название одноимённому городу и озеру.",
        "Қорған Жетісуда (Алматы облысы) орналасқан.",
        "Qo‘rg‘on Yettisuvda joylashgan."
      ),
      errorCategory: "saka_monument_confusion"
    }
  ],
  hkz_khanate: [
    {
      id: "hkz-q2b",
      subjectId: "history_kz",
      topicId: "hkz_khanate",
      lessonId: "history_kz-lesson-hkz_khanate",
      type: "single_choice",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "При каком казахском хане при участии трёх великих биев (Толе би, Казыбек би, Айтеке би) был составлен свод законов «Жеті жарғы»?",
        "Төле би, Қазыбек би және Әйтеке бидің қатысуымен «Жеті жарғы» заңдар жинағы қай ханның тұсында қабылданды?",
        "Tole biy, Qazibek biy va Ayteke biy ishtirokida «Jeti jarg‘i» qonunlar to‘plami qaysi xon davrida qabul qilingan?"
      ),
      options: {
        ru: ["Касым-хан", "Тауке-хан", "Есим-хан", "Хакназар-хан"],
        kk: ["Қасым хан", "Тәуке хан", "Есім хан", "Хақназар хан"],
        uz: ["Qosim xon", "Tauke xon", "Yesim xon", "Haqnazar xon"]
      },
      correctIndex: 1,
      explanation: tr(
        "Свод законов «Жеті жарғы» («Семь установлений») был принят в конце XVII — начале XVIII века при Тауке-хане (1680–1715 гг.) в урочище Культобе.",
        "«Жеті жарғы» заңдар жинағы Тәуке ханның тұсында (1680–1715 жж.) Күлтөбеде қабылданды.",
        "«Jeti jarg‘i» qonunlar to‘plami Tauke xon davrida (1680–1715) qabul qilingan."
      ),
      hint: tr(
        "Не путайте с «Қасым ханның қасқа жолы» и «Есім ханның ескі жолы».",
        "«Қасым ханның қасқа жолы» мен «Есім ханның ескі жолынан» ажыратыңыз.",
        "Qosim xon va Yesim xon qonunlaridan farqlang."
      ),
      errorCategory: "ruler_law_code_confusion"
    },
    {
      id: "hkz-q2c",
      subjectId: "history_kz",
      topicId: "hkz_khanate",
      lessonId: "history_kz-lesson-hkz_khanate",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "В каком году состоялась знаменитая Орбулакская битва, в которой отряд Салкам Жангир-хана (600 воинов) и Жалантос-батыра остановил 50-тысячное войско Эрдэни-батура?",
        "Салқам Жәңгір ханның 600 сарбазы мен Жалаңтөс батырдың қолы Батыр қонтайшының 50 мыңдық әскерін тоқтатқан Орбұлақ шайқасы қай жылы болды?",
        "Salqam Jangir xonning 600 jangchisi va Jalantos botir 50 minglik qo‘shinni to‘xtatgan Orbuloq jangi qaysi yilda bo‘lgan?"
      ),
      options: {
        ru: ["1509 г.", "1643 г.", "1726 г.", "1729 г."],
        kk: ["1509 ж.", "1643 ж.", "1726 ж.", "1729 ж."],
        uz: ["1509-y.", "1643-y.", "1726-y.", "1729-y."]
      },
      correctIndex: 1,
      explanation: tr(
        "Орбулакская битва произошла в 1643 году в Джунгарском Алатау: Жангир-хан применил окопную тактику и огнестрельное оружие, а подошедшие 20 тыс. воинов Жалантоса Бахадура решили исход сражения.",
        "Орбұлақ шайқасы 1643 жылы өтті: Жәңгір хан ор қазу тактикасын қолданып, Жалаңтөс Баһадүрдің 20 мың әскері көмекке келді.",
        "Orbuloq jangi 1643-yilda bo‘lib o‘tgan."
      ),
      hint: tr(
        "Это середина XVII века; 1726 и 1729 гг. — это Булантинская и Аныракайская битвы.",
        "Бұл XVII ғасырдың ортасы; 1726 және 1729 жж. — Бұланты мен Аңырақай шайқастары.",
        "Bu XVII asr o‘rtasi; 1726 va 1729-yillar — Bulanti va Aniraqay janglari."
      ),
      errorCategory: "chronology_battle_confusion"
    }
  ],
  hkz_alash_independence: [
    {
      id: "hkz-q3b",
      subjectId: "history_kz",
      topicId: "hkz_alash_independence",
      lessonId: "history_kz-lesson-hkz_alash_independence",
      type: "single_choice",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "Кто был главным редактором общенациональной газеты «Қазақ» (1913–1918 гг.) и автором реформы казахского алфавита («Төте жазу»)?",
        "«Қазақ» жалпыұлттық газетінің (1913–1918 жж.) бас редакторы және қазақ әліпбиі реформасының («Төте жазу») авторы кім?",
        "«Qazaq» umummilliy gazetasining (1913–1918) bosh muharriri va qozoq alifbosi islohoti («Tote jazu») muallifi kim?"
      ),
      options: {
        ru: ["Ахмет Байтурсынов", "Мустафа Шокай", "Сакен Сейфуллин", "Турар Рыскулов"],
        kk: ["Ахмет Байтұрсынұлы", "Мұстафа Шоқай", "Сәкен Сейфуллин", "Тұрар Рысқұлов"],
        uz: ["Axmet Baytursinov", "Mustafo Shoqay", "Saken Seyfullin", "Turar Risqulov"]
      },
      correctIndex: 0,
      explanation: tr(
        "Ахмет Байтурсынов («Ұлт ұстазы») издавал в Оренбурге газету «Қазақ» с 1913 года и разработал фонетическую реформу казахской письменности.",
        "Ахмет Байтұрсынұлы («Ұлт ұстазы») 1913 жылдан Орынборда «Қазақ» газетін шығарып, төте жазу әліпбиін жасады.",
        "Axmet Baytursinov 1913-yildan Orenburgda «Qazaq» gazetasini nashr etgan."
      ),
      hint: tr(
        "Основоположник казахского языкознания и автор сборника басен «Қырық мысал» и «Маса».",
        "Қазақ тіл білімінің негізін қалаушы, «Қырық мысал» мен «Маса» жинақтарының авторы.",
        "Qozoq tilshunosligi asoschisi, «Qiriq misal» va «Masa» muallifi."
      ),
      errorCategory: "alash_leader_role_mixup"
    },
    {
      id: "hkz-q3c",
      subjectId: "history_kz",
      topicId: "hkz_alash_independence",
      lessonId: "history_kz-lesson-hkz_alash_independence",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Когда на республиканском референдуме была принята действующая Конституция Республики Казахстан?",
        "Қазақстан Республикасының қолданыстағы Конституциясы республикалық референдумда қашан қабылданды?",
        "Qozog‘iston Respublikasining amaldagi Konstitutsiyasi respublika referendumida qachon qabul qilingan?"
      ),
      options: {
        ru: ["25 октября 1990 года", "16 декабря 1991 года", "28 января 1993 года", "30 августа 1995 года"],
        kk: ["1990 ж. 25 қазан", "1991 ж. 16 желтоқсан", "1993 ж. 28 қаңтар", "1995 ж. 30 тамыз"],
        uz: ["1990-yil 25-oktabr", "1991-yil 16-dekabr", "1993-yil 28-yanvar", "1995-yil 30-avgust"]
      },
      correctIndex: 3,
      explanation: tr(
        "Первая Конституция независимого Казахстана была принята 28 января 1993 г. Верховным Советом, а действующая Конституция РК — 30 августа 1995 года на всенародном референдуме.",
        "Тәуелсіз Қазақстанның алғашқы Конституциясы 1993 ж. 28 қаңтарда, ал қолданыстағы Конституциясы 1995 ж. 30 тамызда референдумда қабылданды.",
        "Qozog‘istonning amaldagi Konstitutsiyasi 1995-yil 30-avgustda referendumda qabul qilingan."
      ),
      hint: tr(
        "28 января 1993 г. — первая Конституция, а действующая была принята на референдуме летом 1995 года.",
        "1993 ж. 28 қаңтар — бірінші Конституция, ал қолданыстағысы 1995 жылы жазда қабылданды.",
        "1993-yil 28-yanvar — birinchi Konstitutsiya, amaldagisi esa 1995-yil yozida qabul qilingan."
      ),
      errorCategory: "state_act_date_confusion"
    }
  ],

  eng_tenses: [
    {
      id: "eng-q2b",
      subjectId: "english",
      topicId: "eng_tenses",
      lessonId: "english-lesson-eng_tenses",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Choose the correct tense form: «By the time we arrived at the station, the train ___ already ___ .»",
        "Дұрыс шақ формасын таңдаңыз: «By the time we arrived at the station, the train ___ already ___ .»",
        "To‘g‘ri zamon shaklini tanlang: «By the time we arrived at the station, the train ___ already ___ .»"
      ),
      options: {
        ru: ["has / left", "had / left", "was / leaving", "did / leave"],
        kk: ["has / left", "had / left", "was / leaving", "did / leave"],
        uz: ["has / left", "had / left", "was / leaving", "did / leave"]
      },
      correctIndex: 1,
      explanation: tr(
        "Действие, завершившимися ДО другого действия в прошлом (`By the time we arrived`), выражается через Past Perfect: `had + V3` (`had already left`).",
        "Өткен шақтағы бір іс-әрекетке дейін аяқталған әрекет Past Perfect (`had + V3` — `had already left`) арқылы беріледі.",
        "O‘tgan zamondagi biror harakatdan oldin tugallangan ish-harakat Past Perfect (`had + V3`) bilan ifodalanadi."
      ),
      hint: tr(
        "Маркер `By the time + Past Simple` требует предпрошедшего времени (Past Perfect).",
        "`By the time + Past Simple` құрылымы Past Perfect (`had + V3`) шағын талап етеді.",
        "`By the time + Past Simple` qurilmasi Past Perfect (`had + V3`) zamonini talab qiladi."
      ),
      errorCategory: "past_perfect_sequence_error"
    }
  ],
  eng_conditionals: [
    {
      id: "eng-q3b",
      subjectId: "english",
      topicId: "eng_conditionals",
      lessonId: "english-lesson-eng_conditionals",
      type: "single_choice",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "Choose the correct Second Conditional form: «If I ___ more free time now, I ___ learn a third foreign language.»",
        "Second Conditional-дың дұрыс формасын таңдаңыз: «If I ___ more free time now, I ___ learn a third foreign language.»",
        "Second Conditional to‘g‘ri shaklini tanlang: «If I ___ more free time now, I ___ learn a third foreign language.»"
      ),
      options: {
        ru: ["have / will", "had / would", "had had / would have", "would have / had"],
        kk: ["have / will", "had / would", "had had / would have", "would have / had"],
        uz: ["have / will", "had / would", "had had / would have", "would have / had"]
      },
      correctIndex: 1,
      explanation: tr(
        "Нереальное условие в настоящем (маркер `now`) строится по формуле Second Conditional: `If + Past Simple (had), would + V1 (would learn)`.",
        "Қазіргі уақыттағы нереалды шарт (`now`) Second Conditional формуласымен жасалады: `If + Past Simple (had), would + V1`.",
        "Hozirgi zamondagi noreal shart (`now`) Second Conditional formulasi bilan yasaladi: `If + Past Simple (had), would + V1`."
      ),
      hint: tr(
        "Маркер `now` показывает, что ситуация относится к настоящему, но является гипотетической (Second Conditional).",
        "`now` сөзі жағдайдың қазіргі уақытқа қатысты гипотетикалық екенін білдіреді (Second Conditional).",
        "`now` so‘zi vaziyat hozirgi zamonga oid faraz ekanini ko‘rsatadi."
      ),
      errorCategory: "conditional_type_mismatch"
    },
    {
      id: "eng-q3c",
      subjectId: "english",
      topicId: "eng_conditionals",
      lessonId: "english-lesson-eng_conditionals",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Choose the correct Third Conditional form: «If Dana ___ the alarm clock last night, she ___ the morning flight.»",
        "Third Conditional-дың дұрыс формасын таңдаңыз: «If Dana ___ the alarm clock last night, she ___ the morning flight.»",
        "Third Conditional to‘g‘ri shaklini tanlang: «If Dana ___ the alarm clock last night, she ___ the morning flight.»"
      ),
      options: {
        ru: [
          "would have set / hadn't missed",
          "had set / wouldn't have missed",
          "set / wouldn't miss",
          "has set / won't miss"
        ],
        kk: [
          "would have set / hadn't missed",
          "had set / wouldn't have missed",
          "set / wouldn't miss",
          "has set / won't miss"
        ],
        uz: [
          "would have set / hadn't missed",
          "had set / wouldn't have missed",
          "set / wouldn't miss",
          "has set / won't miss"
        ]
      },
      correctIndex: 1,
      explanation: tr(
        "Нереальное условие в прошлом (`last night`) — Third Conditional: в придаточном `If + had V3` (`had set`), в главном `wouldn't have + V3` (`wouldn't have missed`).",
        "Өткен шақтағы орындалмаған шарт (`last night`) — Third Conditional: `If + had V3` (`had set`), басыңқы бөлікте `wouldn't have + V3`.",
        "O‘tgan zamondagi noreal shart (`last night`) — Third Conditional: `If + had V3`, asosiy gapda `wouldn't have + V3`."
      ),
      hint: tr(
        "После союза `If` никогда не ставится `would have` — там должен быть Past Perfect (`had + V3`).",
        "`If` жалғаулығынан кейін `would have` қойылмайды — онда `had + V3` тұруы тиіс.",
        "`If` bog‘lovchisidan keyin `would have` ishlatilmaydi, u yerda `had + V3` bo‘lishi shart."
      ),
      errorCategory: "would_in_if_clause"
    }
  ],
  eng_passive_reported: [
    {
      id: "eng-q4b",
      subjectId: "english",
      topicId: "eng_passive_reported",
      lessonId: "english-lesson-eng_passive_reported",
      type: "single_choice",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "Choose the correct Passive Voice form: «Look! The main bridge ___ right now, so we must take a detour.»",
        "Ырықсыз етістің (Passive Voice) дұрыс формасын таңдаңыз: «Look! The main bridge ___ right now, so we must take a detour.»",
        "Passive Voice to‘g‘ri shaklini tanlang: «Look! The main bridge ___ right now, so we must take a detour.»"
      ),
      options: {
        ru: ["is repairing", "is being repaired", "has been repaired", "was repaired"],
        kk: ["is repairing", "is being repaired", "has been repaired", "was repaired"],
        uz: ["is repairing", "is being repaired", "has been repaired", "was repaired"]
      },
      correctIndex: 1,
      explanation: tr(
        "Маркеры `Look!` и `right now` указывают на процесс в момент речи, а подлежащее `bridge` испытывает действие на себе ⇒ Present Continuous Passive: `is being + V3` (`is being repaired`).",
        "`Look!` және `right now` сөйлеу сәтіндегі процесті білдіреді ⇒ Present Continuous Passive: `is being + V3` (`is being repaired`).",
        "`Look!` va `right now` nutq paytidagi jarayonni bildiradi ⇒ Present Continuous Passive: `is being repaired`."
      ),
      hint: tr(
        "Формула Present Continuous Passive: `am/is/are + being + V3`.",
        "Present Continuous Passive формуласы: `am/is/are + being + V3`.",
        "Present Continuous Passive formulasi: `am/is/are + being + V3`."
      ),
      errorCategory: "passive_continuous_omitted_being"
    },
    {
      id: "eng-q4c",
      subjectId: "english",
      topicId: "eng_passive_reported",
      lessonId: "english-lesson-eng_passive_reported",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Transform into Reported Speech: Aigerim said: «I will submit my research paper tomorrow.»",
        "Төлеу сөзге (Reported Speech) айналдырыңыз: Aigerim said: «I will submit my research paper tomorrow.»",
        "O‘zlashtirma gapga (Reported Speech) aylantiring: Aigerim said: «I will submit my research paper tomorrow.»"
      ),
      options: {
        ru: [
          "Aigerim said that she will submit her research paper tomorrow.",
          "Aigerim said that she would submit her research paper the next day.",
          "Aigerim said that she submitted her research paper yesterday.",
          "Aigerim told that she would submit her research paper tomorrow."
        ],
        kk: [
          "Aigerim said that she will submit her research paper tomorrow.",
          "Aigerim said that she would submit her research paper the next day.",
          "Aigerim said that she submitted her research paper yesterday.",
          "Aigerim told that she would submit her research paper tomorrow."
        ],
        uz: [
          "Aigerim said that she will submit her research paper tomorrow.",
          "Aigerim said that she would submit her research paper the next day.",
          "Aigerim said that she submitted her research paper yesterday.",
          "Aigerim told that she would submit her research paper tomorrow."
        ]
      },
      correctIndex: 1,
      explanation: tr(
        "При переводе в косвенную речь после `said` в прошедшем времени: `will` переходит в `would`, а обстоятельство `tomorrow` обязательно заменяется на `the next day` (`the following day`).",
        "Өткен шақтағы `said` етістігінен кейін `will → would`, ал `tomorrow → the next day` болып өзгереді.",
        "O‘tgan zamondagi `said` fe’lidan keyin `will → would`, `tomorrow → the next day` ga o‘zgaradi."
      ),
      hint: tr(
        "Проверьте одновременный сдвиг модального глагола `will → would` и наречия времени `tomorrow → the next day`.",
        "`will → would` және `tomorrow → the next day` өзгерістерін қатар тексеріңіз.",
        "`will → would` va `tomorrow → the next day` o‘zgarishlarini tekshiring."
      ),
      errorCategory: "reported_speech_time_adverb"
    }
  ],

  inf_num_logic: [
    {
      id: "inf-q1b",
      subjectId: "informatics",
      topicId: "inf_num_logic",
      lessonId: "informatics-lesson-inf_num_logic",
      type: "single_choice",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "При каких значениях логических переменных A и B импликация (A → B) принимает ЛОЖНОЕ значение (равна 0)?",
        "A және B логикалық айнымалыларының қандай мәндерінде (A → B) импликациясы ЖАЛҒАН (0-ге тең) болады?",
        "A va B mantiqiy o‘zgaruvchilarning qanday qiymatlarida (A → B) implikatsiya YOLG‘ON (0 ga teng) bo‘ladi?"
      ),
      options: {
        ru: ["A = 0, B = 0", "A = 0, B = 1", "A = 1, B = 0", "A = 1, B = 1"],
        kk: ["A = 0, B = 0", "A = 0, B = 1", "A = 1, B = 0", "A = 1, B = 1"],
        uz: ["A = 0, B = 0", "A = 0, B = 1", "A = 1, B = 0", "A = 1, B = 1"]
      },
      correctIndex: 2,
      explanation: tr(
        "Импликация A → B (эквивалентная ¬A ∨ B) ложна в единственном случае: когда из истинной посылки (A = 1) следует ложное заключение (B = 0).",
        "Импликация A → B (¬A ∨ B) тек бір жағдайда ғана жалған болады: A = 1 және B = 0 болғанда.",
        "Implikatsiya A → B faqat bitta holatda yolg‘on bo‘ladi: A = 1 va B = 0 bo‘lganda."
      ),
      hint: tr(
        "Из истины (1) не может следовать ложь (0).",
        "Ақиқаттан (1) жалған (0) шықпайды.",
        "Rostdan (1) yolg‘on (0) kelib chiqmaydi."
      ),
      errorCategory: "logic_implication_table"
    },
    {
      id: "inf-q1c",
      subjectId: "informatics",
      topicId: "inf_num_logic",
      lessonId: "informatics-lesson-inf_num_logic",
      type: "numeric",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Переведите шестнадцатеричное число 2F₁₆ в десятичную систему счисления.",
        "2F₁₆ он алтылық санын ондық санау жүйесіне ауыстырыңыз.",
        "2F₁₆ o‘n oltilik sonini o‘nlik sanoq sistemasiga o‘tkazing."
      ),
      numericAnswer: 47,
      tolerance: 0,
      explanation: tr(
        "В 16-ричной системе цифра F = 15. Тогда 2F₁₆ = 2·16¹ + 15·16⁰ = 32 + 15 = 47₁₀.",
        "16-лық жүйеде F = 15. Сонда 2F₁₆ = 2·16¹ + 15·16⁰ = 32 + 15 = 47₁₀.",
        "16-lik sanoq sistemasida F = 15. U holda 2F₁₆ = 2·16¹ + 15·16⁰ = 32 + 15 = 47₁₀."
      ),
      hint: tr(
        "Помните, что A=10, B=11, C=12, D=13, E=14, F=15, а старший разряд умножается на 16.",
        "A=10, B=11, C=12, D=13, E=14, F=15 екенін және жоғары разряд 16-ға көбейтілетінін ескеріңіз.",
        "F=15 ekanini va katta xona 16 ga ko‘paytirilishini hisobga oling."
      ),
      errorCategory: "hex_digit_conversion"
    }
  ],
  inf_python_loops: [
    {
      id: "inf-q2b",
      subjectId: "informatics",
      topicId: "inf_python_loops",
      lessonId: "informatics-lesson-inf_python_loops",
      type: "single_choice",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "Чему равно значение выражения `2 ** 3 ** 2` в языке программирования Python?",
        "Python программалау тіліндегі `2 ** 3 ** 2` өрнегінің мәні неге тең?",
        "Python dasturlash tilidagi `2 ** 3 ** 2` ifodaning qiymati nechaga teng?"
      ),
      options: {
        ru: ["64", "512", "36", "256"],
        kk: ["64", "512", "36", "256"],
        uz: ["64", "512", "36", "256"]
      },
      correctIndex: 1,
      explanation: tr(
        "Оператор возведения в степень `**` в Python правоассоциативен (вычисляется справа налево): сначала `3 ** 2 = 9`, затем `2 ** 9 = 512` (а не `(2 ** 3) ** 2 = 64`).",
        "Python-да `**` дәреже операторы оңнан солға қарай орындалады: алдымен `3 ** 2 = 9`, содан соң `2 ** 9 = 512`.",
        "Python-da `**` daraja operatori o‘ngdan chapga bajariladi: `3 ** 2 = 9`, so‘ng `2 ** 9 = 512`."
      ),
      hint: tr(
        "В Python цепочка степеней `a ** b ** c` раскрывается справа налево как `a ** (b ** c)`.",
        "Python-да `a ** b ** c` тізбегі оңнан солға қарай `a ** (b ** c)` ретінде есептеледі.",
        "Python-da `a ** b ** c` o‘ngdan chapga `a ** (b ** c)` tarzida hisoblanadi."
      ),
      errorCategory: "operator_associativity_python"
    },
    {
      id: "inf-q2c",
      subjectId: "informatics",
      topicId: "inf_python_loops",
      lessonId: "informatics-lesson-inf_python_loops",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Что выведет код на Python: `s = [10, 20, 30, 40, 50]; print(s[1:4])`?",
        "Python коды экранға не шығарады: `s = [10, 20, 30, 40, 50]; print(s[1:4])`?",
        "Python kodi ekranga nima chiqaradi: `s = [10, 20, 30, 40, 50]; print(s[1:4])`?"
      ),
      options: {
        ru: ["[10, 20, 30, 40]", "[20, 30, 40]", "[20, 30, 40, 50]", "[10, 20, 30]"],
        kk: ["[10, 20, 30, 40]", "[20, 30, 40]", "[20, 30, 40, 50]", "[10, 20, 30]"],
        uz: ["[10, 20, 30, 40]", "[20, 30, 40]", "[20, 30, 40, 50]", "[10, 20, 30]"]
      },
      correctIndex: 1,
      explanation: tr(
        "Индексация списков в Python начинается с 0 (`s[1] = 20`), а правая граница среза `4` не включается: берутся элементы с индексами 1, 2 и 3 → `[20, 30, 40]`.",
        "Python-да индексация 0-ден басталады (`s[1] = 20`), ал `4` оң жақ шекарасы кірмейді: 1, 2, 3 индекстері алынады → `[20, 30, 40]`.",
        "Python-da indeksatsiya 0 dan boshlanadi (`s[1] = 20`) va `4` chegara kirmaydi → `[20, 30, 40]`."
      ),
      hint: tr(
        "Помните два правила среза `s[start:stop]`: счёт с нуля и исключение индекса `stop`.",
        "`s[start:stop]` кесіндісінде индекс 0-ден басталады және `stop` индексі кірмейді.",
        "`s[start:stop]` kesmasida sanoq 0 dan boshlanadi va `stop` indeksi kirmaydi."
      ),
      errorCategory: "python_slice_bounds"
    }
  ],
  inf_sql_db: [
    {
      id: "inf-q3b",
      subjectId: "informatics",
      topicId: "inf_sql_db",
      lessonId: "informatics-lesson-inf_sql_db",
      type: "single_choice",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "Какое ограничение поля в реляционной БД гарантирует, что значения в столбце уникальны и НЕ могут содержать `NULL`?",
        "Реляциялық ДҚ-да бағандағы мәндердің бірегей болуын және `NULL` болмауын қандай шектеу қамтамасыз етеді?",
        "Relyatsion MBda ustundagi qiymatlarning noyob bo‘lishini va `NULL` bo‘lmasligini qaysi cheklov ta’minlaydi?"
      ),
      options: {
        ru: ["FOREIGN KEY", "PRIMARY KEY", "DEFAULT", "CHECK"],
        kk: ["FOREIGN KEY", "PRIMARY KEY", "DEFAULT", "CHECK"],
        uz: ["FOREIGN KEY", "PRIMARY KEY", "DEFAULT", "CHECK"]
      },
      correctIndex: 1,
      explanation: tr(
        "`PRIMARY KEY` (первичный ключ) однозначно идентифицирует каждую запись таблицы и автоматически объединяет свойства `UNIQUE` и `NOT NULL`.",
        "`PRIMARY KEY` (бастапқы кілт) кестедегі әр жазбаны бірегей анықтайды және `UNIQUE` пен `NOT NULL` қасиеттерін біріктіреді.",
        "`PRIMARY KEY` (birlamchi kalit) har bir yozuvni noyob aniqlaydi hamda `UNIQUE` va `NOT NULL` xossalarini birlashtiradi."
      ),
      hint: tr(
        "Этот ключ является главным идентификатором строки в таблице.",
        "Бұл кілт кестедегі жолдың негізгі идентификаторы болып табылады.",
        "Bu kalit jadvaldagi qatorning asosiy identifikatori hisoblanadi."
      ),
      errorCategory: "sql_key_constraint_confusion"
    },
    {
      id: "inf-q3c",
      subjectId: "informatics",
      topicId: "inf_sql_db",
      lessonId: "informatics-lesson-inf_sql_db",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "В каком порядке должны следовать ключевые секции в корректном SQL-запросе на выборку и группировку?",
        "Дұрыс құрылған SQL сұранысында негізгі секциялар қандай ретпен жазылуы тиіс?",
        "To‘g‘ri tuzilgan SQL so‘rovida asosiy bo‘limlar qanday tartibda yozilishi kerak?"
      ),
      options: {
        ru: [
          "SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY",
          "SELECT → WHERE → FROM → HAVING → GROUP BY → ORDER BY",
          "FROM → SELECT → GROUP BY → WHERE → ORDER BY → HAVING",
          "SELECT → FROM → GROUP BY → WHERE → HAVING → ORDER BY"
        ],
        kk: [
          "SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY",
          "SELECT → WHERE → FROM → HAVING → GROUP BY → ORDER BY",
          "FROM → SELECT → GROUP BY → WHERE → ORDER BY → HAVING",
          "SELECT → FROM → GROUP BY → WHERE → HAVING → ORDER BY"
        ],
        uz: [
          "SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY",
          "SELECT → WHERE → FROM → HAVING → GROUP BY → ORDER BY",
          "FROM → SELECT → GROUP BY → WHERE → ORDER BY → HAVING",
          "SELECT → FROM → GROUP BY → WHERE → HAVING → ORDER BY"
        ]
      },
      correctIndex: 0,
      explanation: tr(
        "Синтаксический порядок SQL строго фиксирован: `SELECT ... FROM ... WHERE (фильтр строк до группировки) GROUP BY ... HAVING (фильтр групп) ORDER BY ...`.",
        "SQL синтаксистік реті қатаң бекітілген: `SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY`.",
        "SQL sintaktik tartibi qat’iy: `SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY`."
      ),
      hint: tr(
        "`WHERE` всегда идёт до `GROUP BY`, а `HAVING` — сразу после `GROUP BY`.",
        "`WHERE` әрқашан `GROUP BY`-ға дейін, ал `HAVING` — `GROUP BY`-дан кейін жазылады.",
        "`WHERE` har doim `GROUP BY` dan oldin, `HAVING` esa `GROUP BY` dan keyin keladi."
      ),
      errorCategory: "sql_clause_order"
    }
  ],

  chem_atom_bonds: [
    {
      id: "chem-q1b",
      subjectId: "chemistry",
      topicId: "chem_atom_bonds",
      lessonId: "chemistry-lesson-chem_atom_bonds",
      type: "single_choice",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "Укажите электронную конфигурацию внешнего и предвнешнего уровней атома хрома Cr (порядковый номер Z = 24) в основном состоянии:",
        "Хром атомының Cr (реттік нөмірі Z = 24) негізгі күйдегі сыртқы және сыртқының алдындағы деңгейлерінің электрондық конфигурациясын көрсетіңіз:",
        "Xrom atomining Cr (tartib raqami Z = 24) asosiy holatdagi tashqi va tashqidan oldingi pog‘onalari elektron konfiguratsiyasini ko‘rsating:"
      ),
      options: {
        ru: ["3d⁴ 4s²", "3d⁵ 4s¹", "3d⁶ 4s⁰", "3p⁶ 4s²"],
        kk: ["3d⁴ 4s²", "3d⁵ 4s¹", "3d⁶ 4s⁰", "3p⁶ 4s²"],
        uz: ["3d⁴ 4s²", "3d⁵ 4s¹", "3d⁶ 4s⁰", "3p⁶ 4s²"]
      },
      correctIndex: 1,
      explanation: tr(
        "У атома хрома (Z = 24) наблюдается «проскок» одного электрона с 4s-подуровня на 3d-подуровень ради энергетически устойчивого полузаполненного d⁵-состояния: [Ar] 3d⁵ 4s¹.",
        "Хром атомында (Z = 24) жартылай толған тұрақты d⁵ күйіне жету үшін 4s-тен 3d-ге электронның «секіруі» байқалады: [Ar] 3d⁵ 4s¹.",
        "Xrom atomida (Z = 24) barqaror d⁵ holat uchun 4s dan 3d ga elektron ko‘chishi kuzatiladi: [Ar] 3d⁵ 4s¹."
      ),
      hint: tr(
        "Вспомните правило проскока электрона у Cr (Z=24) и Cu (Z=29).",
        "Cr (Z=24) және Cu (Z=29) атомдарындағы электронның секіру ережесін еске түсіріңіз.",
        "Cr (Z=24) va Cu (Z=29) atomlarida elektron ko‘chishi qoidasini eslang."
      ),
      errorCategory: "electron_configuration_exception"
    },
    {
      id: "chem-q1c",
      subjectId: "chemistry",
      topicId: "chem_atom_bonds",
      lessonId: "chemistry-lesson-chem_atom_bonds",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "В каком ряду записаны вещества ТОЛЬКО с ковалентной полярной связью?",
        "Қай қатарда ТЕК ковалентті полюсті байланысы бар заттар жазылған?",
        "Qaysi qatorda FAQAT kovalent qutbli bog‘lanishli moddalar berilgan?"
      ),
      options: {
        ru: ["NaCl, KBr, CaO", "H₂O, NH₃, HCl", "O₂, N₂, Cl₂", "Na, Fe, Cu"],
        kk: ["NaCl, KBr, CaO", "H₂O, NH₃, HCl", "O₂, N₂, Cl₂", "Na, Fe, Cu"],
        uz: ["NaCl, KBr, CaO", "H₂O, NH₃, HCl", "O₂, N₂, Cl₂", "Na, Fe, Cu"]
      },
      correctIndex: 1,
      explanation: tr(
        "Ковалентная полярная связь образуется между атомами РАЗНЫХ неметаллов (H₂O, NH₃, HCl). В NaCl/KBr/CaO связь ионная, а в O₂/N₂/Cl₂ — ковалентная неполярная.",
        "Ковалентті полюсті байланыс ӘРТҮРЛІ бейметалл атомдары арасында түзіледі (H₂O, NH₃, HCl).",
        "Kovalent qutbli bog‘lanish HAR XIL metallmas atomlari orasida hosil bo‘ladi (H₂O, NH₃, HCl)."
      ),
      hint: tr(
        "Ищите молекулы, состоящие из разных неметаллов.",
        "Әртүрлі бейметалдардан тұратын молекулаларды табыңыз.",
        "Har xil metallmaslardan tuzilgan molekulalarni toping."
      ),
      errorCategory: "chemical_bond_type_mixup"
    }
  ],
  chem_stoichiometry_solutions: [
    {
      id: "chem-q2b",
      subjectId: "chemistry",
      topicId: "chem_stoichiometry_solutions",
      lessonId: "chemistry-lesson-chem_stoichiometry_solutions",
      type: "numeric",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "В 160 г воды растворили 40 г соли. Чему равна массовая доля ω растворённого вещества в полученном растворе (в %)?",
        "160 г суға 40 г тұз ерітілді. Алынған ерітіндідегі еріген заттың массалық үлесі ω (%) неге тең?",
        "160 g suvda 40 g tuz eritildi. Hosil bo‘lgan eritmadagi erigan moddaning massa ulushi ω (%) nechaga teng?"
      ),
      numericAnswer: 20,
      tolerance: 0.1,
      unit: "%",
      explanation: tr(
        "Масса всего раствора равна m_р-ра = m_воды + m_соли = 160 + 40 = 200 г. Массовая доля ω = (40 / 200) · 100% = 20% (частая ошибка — делить 40 на 160 и получать 25%).",
        "Ерітінді массасы m_ер-ді = 160 + 40 = 200 г. Массалық үлес ω = (40 / 200) · 100% = 20%.",
        "Eritma massasi m_er = 160 + 40 = 200 g. Massa ulushi ω = (40 / 200) · 100% = 20%."
      ),
      hint: tr(
        "Делите массу соли на массу ВСЕГО раствора (вода + соль), а не только на массу воды.",
        "Тұз массасын су массасына емес, БҮКІЛ ерітінді массасына (су + тұз) бөліңіз.",
        "Tuz massasini faqat suvga emas, balki BUTUN eritma massasiga (suv + tuz) bo‘ling."
      ),
      errorCategory: "solution_mass_denominator"
    },
    {
      id: "chem-q2c",
      subjectId: "chemistry",
      topicId: "chem_stoichiometry_solutions",
      lessonId: "chemistry-lesson-chem_stoichiometry_solutions",
      type: "numeric",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Какой объём углекислого газа CO₂ (в литрах при н.у.) выделится при полном термическом разложении 50 г карбоната кальция CaCO₃ (M = 100 г/моль)?",
        "50 г кальций карбонаты CaCO₃ (M = 100 г/моль) толық термиялық ыдырағанда (қ.ж.) қанша литр көмірқышқыл газы CO₂ бөлінеді?",
        "50 g kalsiy karbonat CaCO₃ (M = 100 g/mol) to‘liq termik parchalanganda (n.sh.da) necha litr CO₂ gazi ajralib chiqadi?"
      ),
      numericAnswer: 11.2,
      tolerance: 0.1,
      unit: "л",
      explanation: tr(
        "По реакции CaCO₃ → CaO + CO₂↑ из 1 моль CaCO₃ образуется 1 моль CO₂. Количество вещества n(CaCO₃) = 50 / 100 = 0,5 моль ⇒ V(CO₂) = 0,5 · 22,4 = 11,2 л.",
        "CaCO₃ → CaO + CO₂↑ реакциясы бойынша n(CaCO₃) = 50 / 100 = 0,5 моль ⇒ V(CO₂) = 0,5 · 22,4 = 11,2 л.",
        "CaCO₃ → CaO + CO₂↑ reaksiyasiga ko‘ra n(CaCO₃) = 50 / 100 = 0,5 mol ⇒ V(CO₂) = 0,5 · 22,4 = 11,2 l."
      ),
      hint: tr(
        "Найдите количество вещества n = m / M и умножьте на молярный объём газа при н.у. (22,4 л/моль).",
        "Зат мөлшерін n = m / M тауып, газдың молярлық көлеміне (22,4 л/моль) көбейтіңіз.",
        "Modda miqdorini n = m / M topib, molyar hajmga (22,4 l/mol) ko‘paytiring."
      ),
      errorCategory: "molar_volume_stoichiometry"
    }
  ],
  chem_redox_organic: [
    {
      id: "chem-q3b",
      subjectId: "chemistry",
      topicId: "chem_redox_organic",
      lessonId: "chemistry-lesson-chem_redox_organic",
      type: "numeric",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "Чему равна степень окисления атома марганца в перманганате калия KMnO₄ (введите целое число)?",
        "Калий перманганатындағы KMnO₄ марганец атомының тотығу дәрежесі неге тең (бүтін сан енгізіңіз)?",
        "Kaliy permanganat KMnO₄ tarkibidagi marganes atomining oksidlanish darajasi nechaga teng?"
      ),
      numericAnswer: 7,
      tolerance: 0,
      explanation: tr(
        "Сумма степеней окисления в нейтральной молекуле равна 0: (+1) + x + 4·(−2) = 0 ⇒ x − 7 = 0 ⇒ x = +7.",
        "Молекуладағы тотығу дәрежелерінің қосындысы 0-ге тең: (+1) + x + 4·(−2) = 0 ⇒ x = +7.",
        "Molekuladagi oksidlanish darajalari yig‘indisi 0 ga teng: (+1) + x + 4·(−2) = 0 ⇒ x = +7."
      ),
      hint: tr(
        "У калия степень окисления +1, у кислорода −2, а всего атомов кислорода четыре.",
        "Калийдің тотығу дәрежесі +1, оттектікі −2 (4 атом).",
        "Kaliyning oksidlanish darajasi +1, kislorodniki −2 (4 ta atom)."
      ),
      errorCategory: "oxidation_state_calculation"
    },
    {
      id: "chem-q3c",
      subjectId: "chemistry",
      topicId: "chem_redox_organic",
      lessonId: "chemistry-lesson-chem_redox_organic",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Какой класс органических соединений даёт качественную реакцию «серебряного зеркала» с аммиачным раствором оксида серебра [Ag(NH₃)₂]OH?",
        "Органикалық қосылыстардың қай класы күміс оксидінің аммиактағы ерітіндісімен [Ag(NH₃)₂]OH «күміс айна» сапалық реакциясын береді?",
        "Organik birikmalarning qaysi sinfi [Ag(NH₃)₂]OH bilan «kumush ko‘zgu» sifat reaksiyasini beradi?"
      ),
      options: {
        ru: ["Алканы", "Альдегиды (и муравьиная кислота)", "Кетоны", "Одноатомные спирты"],
        kk: ["Алкандар", "Альдегидтер (және құмырсқа қышқылы)", "Кетондар", "Бір атомды спирттер"],
        uz: ["Alkanlar", "Aldegidlar (va chumoli kislota)", "Ketonlar", "Bir atomli спиртлар"]
      },
      correctIndex: 1,
      explanation: tr(
        "Альдегидная группа −CHO легко окисляется реактивом Толленса ([Ag(NH₃)₂]OH) до карбоксильной группы с выделением металлического серебра Ag↓.",
        "Альдегид тобы −CHO Толленс реактивімен ([Ag(NH₃)₂]OH) тотығып, металдық күміс Ag↓ тұнбаға түседі.",
        "Aldegid guruh −CHO Tollens reaktivi bilan oksidlanib, metall kumush Ag↓ ajralib chiqadi."
      ),
      hint: tr(
        "Кетоны не окисляются реактивом Толленса, а соединения с группой −CHO окисляются.",
        "Кетондар бұл реакцияға түспейді, ал −CHO тобы бар қосылыстар тотығады.",
        "Ketonlar bu reaksiyaga kirishmaydi, −CHO guruhli moddalar esa oksidlanadi."
      ),
      errorCategory: "organic_qualitative_reagent"
    }
  ],

  bio_cell_dna: [
    {
      id: "bio-q1b",
      subjectId: "biology",
      topicId: "bio_cell_dna",
      lessonId: "biology-lesson-bio_cell_dna",
      type: "single_choice",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "Какие органоиды эукариотической клетки являются ДВУМЕМБРАННЫМИ и имеют собственную кольцевую ДНК и рибосомы 70S?",
        "Эукариоттық жасушаның қай органоидтары ҚОС МЕМБРАНАЛЫ болып табылады және өздерінің сақиналы ДНҚ-сы мен 70S рибосомалары бар?",
        "Eukariot hujayraning qaysi organoidlari QO‘SH MEMBRANALI bo‘lib, o‘z halqali DNKsi va 70S ribosomalariga ega?"
      ),
      options: {
        ru: ["Рибосомы и клеточный центр", "Митохондрии и пластиды (хлоропласты)", "Лизосомы и аппарат Гольджи", "Эндоплазматическая сеть и вакуоли"],
        kk: ["Рибосомалар мен жасуша орталығы", "Митохондриялар мен пластидтер (хлоропластар)", "Лизосомалар мен Гольджи жиынтығы", "ЭПТ мен вакуольдер"],
        uz: ["Ribosomalar va hujayra markazi", "Mitoxondriyalar va plastidalar (xloroplastlar)", "Lizosomalar va Golji majmuasi", "EPT va vakuolalar"]
      },
      correctIndex: 1,
      explanation: tr(
        "Митохондрии и пластиды (хлоропласты, хромопласты, лейкопласты) — полуавтономные двумембранные органоиды клетки. Рибосомы — немембранные, а ЭПС, комплекс Гольджи и лизосомы — одномембранные.",
        "Митохондриялар мен пластидтер — жартылай автономды қос мембраналы органоидтар.",
        "Mitoxondriyalar va plastidalar — yarim avtonom qo‘sh membranali organoidlardir."
      ),
      hint: tr(
        "Вспомните полуавтономные энергетические и фотосинтезирующие органоиды клетки.",
        "Жасушаның жартылай автономды энергетикалық және фотосинтездеуші органоидтарын еске түсіріңіз.",
        "Hujayraning yarim avtonom energetik va fotosintezlovchi organoidlarini eslang."
      ),
      errorCategory: "organelle_membrane_classification"
    },
    {
      id: "bio-q1c",
      subjectId: "biology",
      topicId: "bio_cell_dna",
      lessonId: "biology-lesson-bio_cell_dna",
      type: "numeric",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Сколько всего молекул АТФ образуется при полном (гликолиз + кислородный этап в митохондриях) расщеплении 1 молекулы глюкозы?",
        "1 молекула глюкоза толық (гликолиз + митохондриядағы оттекті кезең) ыдырағанда барлығы неше молекула АТФ түзіледі?",
        "1 molekula glyukoza to‘liq (glikoliz + kislorodli bosqich) parchalanganda jami nechta ATF molekulasi hosil bo‘ladi?"
      ),
      numericAnswer: 38,
      tolerance: 0,
      explanation: tr(
        "При гликолизе (бескислородном этапе) образуется 2 молекулы АТФ, а на кислородном этапе в митохондриях — 36 молекул АТФ. Суммарный выход полного окисления 1 молекулы глюкозы равен 2 + 36 = 38 молекул АТФ.",
        "Гликолизде 2 АТФ, ал оттекті кезеңде 36 АТФ түзіледі. Толық ыдырауда барлығы 2 + 36 = 38 молекула АТФ түзіледі.",
        "Glikolizda 2 ta ATF, kislorodli bosqichda 36 ta ATF — jami 2 + 36 = 38 ta ATF hosil bo‘ladi."
      ),
      hint: tr(
        "Сложите выход бескислородного этапа (2 АТФ) и кислородного этапа (36 АТФ).",
        "Оттексіз кезең (2 АТФ) мен оттекті кезең (36 АТФ) нәтижесін қосыңыз.",
        "Kislorodsiz bosqich (2 ATF) va kislorodli bosqich (36 ATF) yig‘indisini toping."
      ),
      errorCategory: "atp_yield_stage_confusion"
    }
  ],
  bio_mendel_genetics: [
    {
      id: "bio-q2b",
      subjectId: "biology",
      topicId: "bio_mendel_genetics",
      lessonId: "biology-lesson-bio_mendel_genetics",
      type: "single_choice",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "Какое расщепление по фенотипу и генотипу наблюдается в потомстве при моногибридном АНАЛИЗИРУЮЩЕМ скрещивании гетерозиготы (Aa × aa)?",
        "Гетерозиготалы дарақты талдаушы будандастырғанда (Aa × aa) ұрпақта фенотипі мен генотипі бойынша қандай ажырау байқалады?",
        "Geterozigotali organizmni tahliliy chatishtirganda (Aa × aa) avlodda fenotip va genotip bo‘yicha qanday ajralish kuzatiladi?"
      ),
      options: {
        ru: ["3 : 1", "1 : 1 (50% Aa : 50% aa)", "1 : 2 : 1", "9 : 3 : 3 : 1"],
        kk: ["3 : 1", "1 : 1 (50% Aa : 50% aa)", "1 : 2 : 1", "9 : 3 : 3 : 1"],
        uz: ["3 : 1", "1 : 1 (50% Aa : 50% aa)", "1 : 2 : 1", "9 : 3 : 3 : 1"]
      },
      correctIndex: 1,
      explanation: tr(
        "В анализирующем скрещивании гетерозиготы Aa (гаметы A и a) с рецессивной гомозиготой aa (гамета a) потомство состоит из 50% Aa и 50% aa, то есть расщепление 1 : 1.",
        "Aa (гаметалары A және a) мен aa (гаметасы a) будандастырылғанда 50% Aa және 50% aa алынады, яғни 1 : 1.",
        "Aa va aa chatishtirilganda 50% Aa va 50% aa, ya’ni 1 : 1 nisbatda ajralish kuzatiladi."
      ),
      hint: tr(
        "Рецессивный родитель `aa` даёт только один тип гамет (`a`), поэтому соотношение потомков повторяет соотношение гамет `Aa`.",
        "Рецессивті ата-ана `aa` тек бір типті гамета (`a`) береді.",
        "Retsessiv ota-ona `aa` faqat bitta tipdagi gameta (`a`) beradi."
      ),
      errorCategory: "test_cross_ratio_confusion"
    },
    {
      id: "bio-q2c",
      subjectId: "biology",
      topicId: "bio_mendel_genetics",
      lessonId: "biology-lesson-bio_mendel_genetics",
      type: "numeric",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Сколько типов гамет образует дигетерозиготный организм с генотипом AaBb при независимом наследовании генов?",
        "Гендер тәуелсіз тұқым қуалағанда генотипі AaBb дигетерозиготалы организм гаметалардың неше типін түзеді?",
        "Genlar mustaqil irsiylanganda genotipi AaBb bo‘lgan digeterozigotali organizm necha xil tipdagi gameta hosil qiladi?"
      ),
      numericAnswer: 4,
      tolerance: 0,
      explanation: tr(
        "Число типов гамет определяется по формуле 2ⁿ, где n — число гетерозиготных пар аллелей. Для дигетерозиготы AaBb (n = 2) образуется 2² = 4 типа гамет: AB, Ab, aB, ab.",
        "Гамета типтерінің саны 2ⁿ формуласымен анықталады (n — гетерозиготалы жұптар саны). AaBb үшін n = 2 ⇒ 2² = 4 гамета типі (AB, Ab, aB, ab).",
        "Gameta tiplari soni 2ⁿ formulasi bilan topiladi. AaBb uchun n = 2 ⇒ 2² = 4 xil gameta (AB, Ab, aB, ab)."
      ),
      hint: tr(
        "Используйте формулу 2ⁿ, где n — количество гетерозиготных пар генов.",
        "2ⁿ формуласын қолданыңыз (мұндағы n — гетерозиготалы ген жұптарының саны).",
        "2ⁿ formulasidan foydalaning (n — geterozigotali juftlar soni)."
      ),
      errorCategory: "gamete_count_formula"
    }
  ],
  bio_human_physiology: [
    {
      id: "bio-q3b",
      subjectId: "biology",
      topicId: "bio_human_physiology",
      lessonId: "biology-lesson-bio_human_physiology",
      type: "single_choice",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "В каком отделе сердца человека начинается БОЛЬШОЙ круг кровообращения и в каком отделе он заканчивается?",
        "Адамдағы ҮЛКЕН қанайналым шеңбері жүректің қай бөлігінен басталып, қай бөлігінде аяқталады?",
        "Odamda KATTA qon aylanish doirasi yurakning qaysi bo‘lmasidan boshlanib, qaysi bo‘lmasida tugaydi?"
      ),
      options: {
        ru: [
          "Начинается в правом желудочке → заканчивается в левом предсердии",
          "Начинается в левом желудочке → заканчивается в правом предсердии",
          "Начинается в левом предсердии → заканчивается в правом желудочке",
          "Начинается в правом предсердии → заканчивается в левом желудочке"
        ],
        kk: [
          "Оң жақ қарыншадан басталып → сол жақ жүрекшеде аяқталады",
          "Сол жақ қарыншадан басталып → оң жақ жүрекшеде аяқталады",
          "Сол жақ жүрекшеден басталып → оң жақ қарыншада аяқталады",
          "Оң жақ жүрекшеден басталып → сол жақ қарыншада аяқталады"
        ],
        uz: [
          "O‘ng qorinchadan boshlanib → chap bo‘lmachada tugaydi",
          "Chap qorinchadan boshlanib → o‘ng bo‘lmachada tugaydi",
          "Chap bo‘lmachadan boshlanib → o‘ng qorinchada tugaydi",
          "O‘ng bo‘lmachadan boshlanib → chap qorinchada tugaydi"
        ]
      },
      correctIndex: 1,
      explanation: tr(
        "Большой круг кровообращения начинается в левом желудочке (выброс артериальной крови в аорту) и заканчивается в правом предсердии (возврат венозной крови по полым венам).",
        "Үлкен қанайналым шеңбері сол жақ қарыншадан (қолқа арқылы) басталып, оң жақ жүрекшеде (қуыс веналар арқылы) аяқталады.",
        "Katta qon aylanish doirasi chap qorinchadan (aorta orqali) boshlanib, o‘ng bo‘lmachada tugaydi."
      ),
      hint: tr(
        "Любой круг кровообращения начинается в желудочке и заканчивается в предсердии противоположной стороны.",
        "Кез келген қанайналым шеңбері қарыншадан басталып, қарама-қарсы жақтағы жүрекшеде аяқталады.",
        "Har qanday qon aylanish doirasi qorinchadan boshlanib, qarama-qarshi tomondagi bo‘lmachada tugaydi."
      ),
      errorCategory: "heart_chamber_circuit_mixup"
    },
    {
      id: "bio-q3c",
      subjectId: "biology",
      topicId: "bio_human_physiology",
      lessonId: "biology-lesson-bio_human_physiology",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Какое вещество в норме ПОЛНОСТЬЮ реабсорбируется (обратно всасывается) в извитых канальцах нефрона и отсутствует во вторичной моче здорового человека?",
        "Қалыпты жағдайда нефронның иірім өзекшелерінде ТОЛЫҚТАЙ реабсорбцияланатын (қайта сіңірілетін) және екінші реттік зәрде болмайтын зат қайсы?",
        "Me’yorda nefron kanalchalarida TO‘LIQ reabsorbsiyalanadigan (qayta so‘riladigan) va ikkilamchi siydikda bo‘lmaydigan modda qaysi?"
      ),
      options: {
        ru: ["Мочевина", "Глюкоза", "Мочевая кислота", "Избыток ионов натрия и хлора"],
        kk: ["Несепнәр (мочевина)", "Глюкоза", "Зәр қышқылы", "Натрий мен хлор иондарының артық мөлшері"],
        uz: ["Mochevina", "Glyukoza", "Siydik kislotasi", "Ortiqcha natriy va xlor ionlari"]
      },
      correctIndex: 1,
      explanation: tr(
        "Глюкоза и аминокислоты проходят в первичную мочу при ультрафильтрации в капсуле Боумена — Шумлянского, но затем полностью реабсорбируются в извитых канальцах нефрона обратно в кровь.",
        "Глюкоза мен аминқышқылдары бірінші реттік зәрге өтеді, бірақ нефрон өзекшелерінде қанға толықтай қайта сіңіріледі (реабсорбция).",
        "Glyukoza birlamchi siydikka o‘tadi, ammo nefron kanalchalarida qonga to‘liq qayta so‘riladi."
      ),
      hint: tr(
        "Это главный энергетический углевод крови, потеря которого с мочой является признаком патологии.",
        "Бұл қандағы негізгі энергетикалық көмірсу.",
        "Bu qondagi asosiy energetik uglevoddir."
      ),
      errorCategory: "nephron_reabsorption_confusion"
    }
  ],

  geo_cartography_scale: [
    {
      id: "geo-q1b",
      subjectId: "geography",
      topicId: "geo_cartography_scale",
      lessonId: "geography-lesson-geo_cartography_scale",
      type: "numeric",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "Два города расположены на одной параллели: первый на 30° в. д., второй на 75° в. д. На сколько часов различается местное солнечное время между ними?",
        "Екі қала бір параллельде орналасқан: біріншісі 30° ш. б., екіншісі 75° ш. б. Олардың жергілікті уақыты неше сағатқа ерекшеленеді?",
        "Ikkita shahar bitta parallelda joylashgan: birinchisi 30° sh. u., ikkinchisi 75° sh. u. Ularning mahalliy vaqti necha soatga farq qiladi?"
      ),
      numericAnswer: 3,
      tolerance: 0,
      unit: "ч",
      explanation: tr(
        "Земля поворачивается на 15° долготы за 1 час. Разность долгот Δλ = 75° − 30° = 45°. Разница во времени Δt = 45° / 15° = 3 часа.",
        "Жер 1 сағатта 15° бойлыққа бұрылады. Бойлық айырмасы Δλ = 75° − 30° = 45° ⇒ Δt = 45° / 15° = 3 сағат.",
        "Yer 1 soatda 15° uzunlikka buriladi. Δλ = 75° − 30° = 45° ⇒ Δt = 45° / 15° = 3 soat."
      ),
      hint: tr(
        "Разделите разность долгот в градусах на 15° (угловую скорость вращения Земли в час).",
        "Бойлықтар айырмасын 15°-қа бөліңіз.",
        "Uzunliklar farqini 15° ga bo‘ling."
      ),
      errorCategory: "time_zone_longitude_division"
    },
    {
      id: "geo-q1c",
      subjectId: "geography",
      topicId: "geo_cartography_scale",
      lessonId: "geography-lesson-geo_cartography_scale",
      type: "numeric",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Туристы шли из лагеря строго по азимуту 45° (на северо-восток). По какому обратному азимуту (в градусах) им нужно возвращаться в лагерь по тому же пути?",
        "Туристер лагерьден 45° азимут бойынша (солтүстік-шығысқа) жүрді. Дәл сол жолмен лагерьге қайту үшін кері азимут неше градус болуы керек?",
        "Turistlar lagerdan 45° azimut bo‘yicha (shimoli-sharqqa) yurishdi. Xuddi shu yo‘l bilan qaytish uchun teskari azimut necha gradus bo‘lishi kerak?"
      ),
      numericAnswer: 225,
      tolerance: 0,
      unit: "°",
      explanation: tr(
        "Обратный азимут отличается от прямого на 180°: если прямой азимут меньше 180°, к нему прибавляют 180° ⇒ 45° + 180° = 225° (юго-запад).",
        "Кері азимут тура азимуттан 180°-қа ерекшеленеді: 45° + 180° = 225° (оңтүстік-батыс).",
        "Teskari azimut to‘g‘ri azimutdan 180° ga farq qiladi: 45° + 180° = 225° (janubi-g‘arb)."
      ),
      hint: tr(
        "Прибавьте 180° к прямому азимуту.",
        "Тура азимутқа 180° қосыңыз.",
        "To‘g‘ri azimutga 180° qo‘shing."
      ),
      errorCategory: "back_azimuth_calculation"
    }
  ],
  geo_atmosphere_temp: [
    {
      id: "geo-q2b",
      subjectId: "geography",
      topicId: "geo_atmosphere_temp",
      lessonId: "geography-lesson-geo_atmosphere_temp",
      type: "numeric",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "У подножия холма атмосферное давление составляет 760 мм рт. ст., а на его вершине — 720 мм рт. ст. Определите относительную высоту холма в метрах (считая изменение давления 1 мм рт. ст. на каждые 10,5 м).",
        "Төбенің етегінде атмосфералық қысым 760 мм сын. бағ., ал шыңында 720 мм сын. бағ. Төбенің салыстырмалы биіктігін метрмен табыңыз (әр 10,5 м сайын қысым 1 мм сын. бағ. өзгереді).",
        "Tepalik etagida atmosfera bosimi 760 mm sim. ust., cho‘qqisida esa 720 mm sim. ust. Tepalikning nisbiy balandligini metrda toping (har 10,5 m da 1 mm sim. ust.)."
      ),
      numericAnswer: 420,
      tolerance: 1,
      unit: "м",
      explanation: tr(
        "Разность давлений ΔP = 760 − 720 = 40 мм рт. ст. Умножаем на барическую ступень 10,5 м/мм рт. ст.: h = 40 · 10,5 = 420 м.",
        "Қысым айырмасы ΔP = 760 − 720 = 40 мм сын. бағ. Биіктік h = 40 · 10,5 = 420 м.",
        "Bosimlar farqi ΔP = 760 − 720 = 40 mm sim. ust. Balandlik h = 40 · 10,5 = 420 m."
      ),
      hint: tr(
        "Найдите разность давлений (760 − 720) и умножьте её на 10,5 м.",
        "Қысымдар айырмасын (760 − 720) тауып, 10,5 м-ге көбейтіңіз.",
        "Bosimlar farqini (760 − 720) topib, 10,5 m ga ko‘paytiring."
      ),
      errorCategory: "barometric_step_error"
    },
    {
      id: "geo-q2c",
      subjectId: "geography",
      topicId: "geo_atmosphere_temp",
      lessonId: "geography-lesson-geo_atmosphere_temp",
      type: "numeric",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "При температуре +20 °C в 1 м³ воздуха содержится 12 г водяного пара, а максимальная влагоёмкость при этой температуре равна 17,3 г/м³ (округлим до 15 г/м³ в учебном расчёте). Если максимум равен 15 г/м³, чему равна относительная влажность воздуха (в %)?",
        "Егер 1 м³ ауада 12 г су буы болса, ал осы температурадағы максималды мүмкін мөлшері 15 г/м³ болса, ауаның салыстырмалы ылғалдылығы неше пайыз (%)?",
        "Agar 1 m³ havoda 12 g suv bug‘i bo‘lsa va maksimal sig‘im 15 g/m³ bo‘lsa, havoning nisbiy namligi necha foiz (%)?"
      ),
      numericAnswer: 80,
      tolerance: 0.5,
      unit: "%",
      explanation: tr(
        "Относительная влажность φ = (абсолютная влажность / максимальная влагоёмкость) · 100% = (12 / 15) · 100% = 80%.",
        "Салыстырмалы ылғалдылық φ = (12 / 15) · 100% = 80%.",
        "Nisbiy namlik φ = (12 / 15) · 100% = 80%."
      ),
      hint: tr(
        "Разделите фактическое содержание пара (12) на максимально возможное (15) и умножьте на 100%.",
        "Нақты су буы мөлшерін (12) максималды мөлшерге (15) бөліп, 100%-ға көбейтіңіз.",
        "Haqiqiy bug‘ miqdorini (12) maksimal miqdorga (15) bo‘lib, 100% ga ko‘paytiring."
      ),
      errorCategory: "relative_humidity_ratio"
    }
  ],
  geo_kz_economy: [
    {
      id: "geo-q3b",
      subjectId: "geography",
      topicId: "geo_kz_economy",
      lessonId: "geography-lesson-geo_kz_economy",
      type: "single_choice",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "Где расположена самая низкая абсолютная отметка рельефа Казахстана (−132 м ниже уровня Мирового океана)?",
        "Қазақстан жер бедерінің ең төменгі абсолюттік нүктесі (−132 м) қайда орналасқан?",
        "Qozog‘iston relyefining eng past absolyut nuqtasi (−132 m) qayerda joylashgan?"
      ),
      options: {
        ru: ["Прикаспийская низменность", "Впадина Карагие (полуостров Мангышлак)", "Туранская низменность", "Котловина озера Балхаш"],
        kk: ["Каспий маңы ойпаты", "Қарақия ойысы (Маңғыстау түбегі)", "Тұран ойпаты", "Балқаш көлінің қазаншұңқыры"],
        uz: ["Kaspiybo‘yi pasttekisligi", "Qoragiyo botig‘i (Mang‘ishloq yarimoroli)", "Turon pasttekisligi", "Balxash ko‘li botig‘i"]
      },
      correctIndex: 1,
      explanation: tr(
        "Впадина Карагие (Батыр) в Мангистауской области — самая низкая точка Казахстана и всего СНГ (−132 м ниже уровня моря).",
        "Маңғыстау облысындағы Қарақия (Батыр) ойысы — Қазақстанның ең төменгі нүктесі (−132 м).",
        "Mang‘istau viloyatidagi Qoragiyo botig‘i — Qozog‘istonning eng past nuqtasi (−132 m)."
      ),
      hint: tr(
        "Вспомните глубокую карстово-тектоническую впадину в Мангистауской области.",
        "Маңғыстау облысындағы терең ойысты еске түсіріңіз.",
        "Mang‘istau viloyatidagi chuqur botiqni eslang."
      ),
      errorCategory: "kz_relief_extremes"
    },
    {
      id: "geo-q3c",
      subjectId: "geography",
      topicId: "geo_kz_economy",
      lessonId: "geography-lesson-geo_kz_economy",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Какой экономический район Казахстана является главным центром титано-магниевой, свинцово-цинковой промышленности и каскада ГЭС на Иртыше (Бухтарминская, Шульбинская, Усть-Каменогорская)?",
        "Қазақстанның қай экономикалық ауданы титан-магний, қорғасын-мырыш өнеркәсібінің және Ертіс бойындағы СЭС каскадының (Бұқтырма, Шүлбі, Өскемен) басты орталығы болып табылады?",
        "Qozog‘istonning qaysi iqtisodiy rayoni titan-magniy, qo‘rg‘oshin-rux sanoati va Irtishdagi GESlar kaskadining asosiy markazi hisoblanadi?"
      ),
      options: {
        ru: ["Западный Казахстан", "Восточный Казахстан", "Северный Казахстан", "Центральный Казахстан"],
        kk: ["Батыс Қазақстан", "Шығыс Қазақстан", "Солтүстік Қазақстан", "Орталық Қазақстан"],
        uz: ["G‘arbiy Qozog‘iston", "Sharqiy Qozog‘iston", "Shimoliy Qozog‘iston", "Markaziy Qozog‘iston"]
      },
      correctIndex: 1,
      explanation: tr(
        "Восточный Казахстан обладает мощными гидроэнергетическими ресурсами реки Иртыш и полиметаллическими рудами Рудного Алтая, что обусловило размещение энергоёмкой цветной металлургии.",
        "Шығыс Қазақстан Кенді Алтайдың полиметалл кендері мен Ертістің арзан гидроэнергиясына бай, сондықтан мұнда түсті металлургия мен СЭС каскады орналасқан.",
        "Sharqiy Qozog‘iston Rudali Oltoy polimetall rudalari va Irtish gidroenergiyasiga boy bo‘lgani uchun rangli metallurgiya markazi hisoblanadi."
      ),
      hint: tr(
        "Энергоёмкие производства титана и магния привязаны к дешёвой электроэнергии ГЭС на Иртыше.",
        "Титан мен магний өндірісі Ертістегі арзан СЭС электр энергиясына жақын орналасқан.",
        "Titan va magniy ishlab chiqarish Irtishdagi GESlar yaqinida joylashgan."
      ),
      errorCategory: "economic_region_specialization"
    }
  ],

  wh_ancient_civilizations: [
    {
      id: "wh-q1b",
      subjectId: "world_history",
      topicId: "wh_ancient_civilizations",
      lessonId: "world_history-lesson-wh_ancient_civilizations",
      type: "single_choice",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "Чьи реформы в Афинах в 594 г. до н. э. отменили долговое рабство («сисахфия» — стряхивание бремени) и заложили основы афинской демократии?",
        "Б.з.б. 594 жылы Афинада қарыз құлдығын жойып («сисахфия»), афиналық демократияның негізін қалаған реформатор кім?",
        "Mil. avv. 594-yilda Afinada qarz qulligini bekor qilib («sisaxfiya»), Afina demokratiyasi asoslarini yaratgan islohotchi kim?"
      ),
      options: {
        ru: ["Ликург", "Солон", "Драконт", "Александр Македонский"],
        kk: ["Ликург", "Солон", "Драконт", "Александр Македонский"],
        uz: ["Likurg", "Solon", "Drakont", "Aleksandr Makedonskiy"]
      },
      correctIndex: 1,
      explanation: tr(
        "Архонт Солон в 594 г. до н. э. провёл «сисахфию» (отмену долговых камней и личной кабалы граждан за долги) и учредил Совет четырёхсот и суд присяжных (гелиэю).",
        "Архонт Солон б.з.б. 594 жылы қарыз құлдығын жойып, Төрт жүздік кеңесі мен алқабилер сотын (гелиэя) құрды.",
        "Arxont Solon mil. avv. 594-yilda qarz qulligini bekor qilib, To‘rt yuzlar kengashini ta’sis etdi."
      ),
      hint: tr(
        "Ликург — легендарный законодатель Спарты, а реформатор Афин 594 г. до н. э. входил в число «семи мудрецов» Греции.",
        "Ликург — Спарта заңгері, ал б.з.б. 594 ж. Афина реформаторы Грекияның «жеті данышпанының» бірі болған.",
        "Likurg — Sparta qonunchisi, mil. avv. 594-yilgi Afina islohotchisi esa «yetti donishmand»dan biri bo‘lgan."
      ),
      errorCategory: "ancient_polis_reformer_mixup"
    },
    {
      id: "wh-q1c",
      subjectId: "world_history",
      topicId: "wh_ancient_civilizations",
      lessonId: "world_history-lesson-wh_ancient_civilizations",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Какая магистратура в Римской республике избиралась из числа плебеев и обладала правом «вето» («запрещаю») на решения сената и консулов?",
        "Рим республикасында плебейлер арасынан сайланып, сенат пен консулдардың шешіміне «вето» («тыйым саламын») құқығына ие болған лауазым қайсы?",
        "Rim respublikasida plebeylar orasidan saylanib, senat va konsullar qaroriga «veto» («taqiqlayman») huquqiga ega bo‘lgan lavozim qaysi?"
      ),
      options: {
        ru: ["Диктатор", "Народный трибун", "Цензор", "Претор"],
        kk: ["Диктатор", "Халық трибуны", "Цензор", "Претор"],
        uz: ["Diktator", "Xalq tribuni", "Senzor", "Pretor"]
      },
      correctIndex: 1,
      explanation: tr(
        "Народные трибуны защищали права плебеев: их личность была неприкосновенна, а произнесённое ими слово «Veto!» отменяло распоряжение магистрата или постановление Сената.",
        "Халық трибундары плебейлердің құқығын қорғап, «Вето!» құқығы арқылы магистраттар мен Сенат шешімдерінің күшін жоя алды.",
        "Xalq tribunlari plebeylar huquqini himoya qilib, «Veto!» huquqiga ega bo‘lgan."
      ),
      hint: tr(
        "Эта должность появилась в результате борьбы плебеев с патрициями за гражданское равноправие.",
        "Бұл лауазым плебейлердің патрицийлермен күресі нәтижесінде пайда болды.",
        "Bu lavozim plebeylarning patritsiylar bilan kurashi natijasida paydo bo‘lgan."
      ),
      errorCategory: "roman_magistracy_confusion"
    }
  ],
  wh_modern_revolutions: [
    {
      id: "wh-q2b",
      subjectId: "world_history",
      topicId: "wh_modern_revolutions",
      lessonId: "world_history-lesson-wh_modern_revolutions",
      type: "single_choice",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "Какой документ, принятый Национальным учредительным собранием Франции 26 августа 1789 года, провозгласил народный суверенитет, презумпцию невиновности и равенство всех граждан перед законом?",
        "1789 жылы 26 тамызда Францияның Құрылтай жиналысы қабылдаған, халық егемендігі мен заң алдындағы теңдікті жариялаған тарихи құжат қайсы?",
        "1789-yil 26-avgustda Fransiya Ta’sis majlisi tomonidan qabul qilingan, xalq suvereniteti va qonun oldida tenglikni e’lon qilgan hujjat qaysi?"
      ),
      options: {
        ru: [
          "Великая хартия вольностей",
          "Декларация прав человека и гражданина",
          "Гражданский кодекс Наполеона",
          "Вестфальский мирный трактат"
        ],
        kk: [
          "Еркіндіктің ұлы хартиясы",
          "Адам және азамат құқықтарының декларациясы",
          "Наполеонның азаматтық кодексі",
          "Вестфалия бейбіт трактаты"
        ],
        uz: [
          "Erkinliklarning buyuk xartiyasi",
          "Inson va fuqaro huquqlari deklaratsiyasi",
          "Napoleon fuqarolik kodeksi",
          "Vestfaliya tinchlik shartnomasi"
        ]
      },
      correctIndex: 1,
      explanation: tr(
        "Декларация прав человека и гражданина (26 августа 1789 г.) стала программным документом Великой французской революции, закрепившим естественные права и разделение властей.",
        "Адам және азамат құқықтарының декларациясы (1789 ж. 26 тамыз) Ұлы француз революциясының басты құжаты болды.",
        "Inson va fuqaro huquqlari deklaratsiyasi (1789-yil 26-avgust) Buyuk fransuz inqilobining dasturiy hujjati bo‘ldi."
      ),
      hint: tr(
        "Великая хартия вольностей — это Англия (1215 г.), Кодекс Наполеона — 1804 г.",
        "Еркіндіктің ұлы хартиясы — Англия (1215 ж.), ал Наполеон кодексі — 1804 ж.",
        "Erkinliklarning buyuk xartiyasi — Angliya (1215-y.), Napoleon kodeksi — 1804-y."
      ),
      errorCategory: "constitutional_charter_mixup"
    },
    {
      id: "wh-q2c",
      subjectId: "world_history",
      topicId: "wh_modern_revolutions",
      lessonId: "world_history-lesson-wh_modern_revolutions",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Кто из французских философов эпохи Просвещения в трактате «О духе законов» (1748 г.) классически обосновал разделение государственной власти на законодательную, исполнительную и судебную?",
        "Ағартушылық дәуірінің қай француз философы «Заңдар рухы туралы» (1748 ж.) еңбегінде билікті заң шығарушы, атқарушы және сот тармақтарына бөлу теориясын негіздеді?",
        "Ma’rifatparvarlik davrining qaysi fransuz faylasufi «Qonunlar ruhi to‘g‘risida» (1748-y.) asarida hokimiyatлар bo‘linishi nazariyasini asoslab berdi?"
      ),
      options: {
        ru: ["Шарль Луи Монтескьё", "Жан-Жак Руссо", "Вольтер", "Дени Дидро"],
        kk: ["Шарль Луи Монтескьё", "Жан-Жак Руссо", "Вольтер", "Дени Дидро"],
        uz: ["Sharl Lui Monteskyo", "Jan-Jak Russo", "Volter", "Deni Didro"]
      },
      correctIndex: 0,
      explanation: tr(
        "Шарль Луи Монтескьё в труде «О духе законов» сформулировал принцип сдержек и противовесов между тремя независимыми ветвями власти.",
        "Шарль Луи Монтескьё «Заңдар рухы туралы» еңбегінде биліктің үш тармағы арасындағы тежемелік әрі тепе-теңдік принципін тұжырымдады.",
        "Sharl Lui Monteskyo «Qonunlar ruhi to‘g‘risida» asarida uch hokimiyat bo‘linishi tamoyilini asosladi."
      ),
      hint: tr(
        "Руссо — автор «Общественного договора», а автор «О духе законов» — Монтескьё.",
        "Руссо — «Қоғамдық шарт» авторы, ал «Заңдар рухы туралы» еңбектің авторы — Монтескьё.",
        "Russo — «Ijtimoiy shartnoma» muallifi, «Qonunlar ruhi to‘g‘risida» asari muallifi esa — Monteskyo."
      ),
      errorCategory: "enlightenment_thinker_work"
    }
  ],
  wh_20th_century_intl: [
    {
      id: "wh-q3b",
      subjectId: "world_history",
      topicId: "wh_20th_century_intl",
      lessonId: "world_history-lesson-wh_20th_century_intl",
      type: "single_choice",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "Какая международная организация была создана в 1919 году по итогам Парижской мирной конференции (Версальского договора) для поддержания мира и безопасности?",
        "1919 жылы Париж бейбіт конференциясының (Версаль шартының) қорытындысы бойынша бейбітшілік пен қауіпсіздікті сақтау үшін қандай халықаралық ұйым құрылды?",
        "1919-yilda Parij tinchlik konferensiyasi (Versal shartnomasi) yakuniga ko‘ra tinchlikni saqlash uchun qaysi xalqaro tashkilot tuzilgan?"
      ),
      options: {
        ru: ["Организация Объединённых Наций (ООН)", "Лига Наций", "НАТО", "Совет Европы"],
        kk: ["Біріккен Ұлттар Ұйымы (БҰҰ)", "Ұлттар Лигасы", "НАТО", "Еуропа Кеңесі"],
        uz: ["Birlashgan Millatlar Tashkiloti (BMT)", "Millatlar Ligasi", "NATO", "Yevropa Kengashi"]
      },
      correctIndex: 1,
      explanation: tr(
        "Лига Наций была учреждена в 1919 году по инициативе президента США Вудро Вильсона («14 пунктов») в рамках Версальско-Вашингтонской системы; ООН была создана в 1945 году.",
        "Ұлттар Лигасы 1919 жылы Версаль-Вашингтон жүйесі аясында құрылды; ал БҰҰ 1945 жылы құрылды.",
        "Millatlar Ligasi 1919-yilda Versal-Vashington tizimi doirasida tuzilgan; BMT esa 1945-yilda tashkil topgan."
      ),
      hint: tr(
        "ООН появилась после Второй мировой войны (1945 г.), а после Первой мировой войны (1919 г.) — её предшественница.",
        "БҰҰ Екінші дүниежүзілік соғыстан кейін (1945 ж.), ал Бірінші дүниежүзілік соғыстан кейін (1919 ж.) оның ізашары құрылды.",
        "BMT Ikkinchi jahon urushidan keyin (1945-y.), Birinchi jahon urushidan keyin (1919-y.) esa uning o‘tmishdoshi tuzilgan."
      ),
      errorCategory: "international_system_era"
    },
    {
      id: "wh-q3c",
      subjectId: "world_history",
      topicId: "wh_20th_century_intl",
      lessonId: "world_history-lesson-wh_20th_century_intl",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Как называлась программа экономической помощи США странам Европы после Второй мировой войны, выдвинутая госсекретарём США в 1947 году?",
        "Екінші дүниежүзілік соғыстан кейін Еуропа елдеріне экономикалық көмек көрсету туралы 1947 жылы АҚШ мемлекеттік хатшысы ұсынған бағдарлама қалай аталды?",
        "Ikkinchi jahon urushidan keyin Yevropa davlatlariga iqtisodiy yordam ko‘rsatish bo‘yicha 1947-yilda AQSh davlat kotibi ilgari surgan dastur qanday atalgan?"
      ),
      options: {
        ru: ["План Дауэса", "План Маршалла", "План Шлиффена", "Программа ленд-лиза"],
        kk: ["Дауэс жоспары", "Маршалл жоспары", "Шлиффен жоспары", "Ленд-лиз бағдарламасы"],
        uz: ["Daues rejasi", "Marshall rejasi", "Shliffen rejasi", "Lend-liz dasturi"]
      },
      correctIndex: 1,
      explanation: tr(
        "«План Маршалла» (1947–1948 гг., Программа восстановления Европы) предусматривал масштабную финансовую и промышленную помощь послевоенной Европе; план Дауэса (1924 г.) относился к репарациям после Первой мировой войны.",
        "«Маршалл жоспары» (1947–1948 жж.) соғыстан кейінгі Еуропа экономикасын қалпына келтіруге бағытталды; ал Дауэс жоспары 1924 жылы қабылданған.",
        "«Marshall rejasi» (1947–1948) urushdan keyingi Yevropa iqtisodiyotini tiklashga qaratilgan edi."
      ),
      hint: tr(
        "План Дауэса — 1924 год, ленд-лиз — годы Второй мировой войны (1941–1945), а послевоенное восстановление 1947 г. носит имя госсекретаря Джорджа Маршалла.",
        "Дауэс жоспары — 1924 ж., ал 1947 жылғы бағдарлама АҚШ мемлекеттік хатшысы Джордж Маршаллдың есімімен аталады.",
        "1947-yilgi dastur AQSh davlat kotibi Jorj Marshall nomi bilan ataladi."
      ),
      errorCategory: "postwar_program_mixup"
    }
  ],

  law_constitution_rk: [
    {
      id: "law-q1b",
      subjectId: "law",
      topicId: "law_constitution_rk",
      lessonId: "law-lesson-law_constitution_rk",
      type: "single_choice",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "Согласно действующей Конституции Республики Казахстан (с учётом реформы 2022 года), на какой срок избирается Президент РК?",
        "Қазақстан Республикасының қолданыстағы Конституциясына сәйкес (2022 жылғы реформаны ескере отырып), ҚР Президенті қандай мерзімге сайланады?",
        "Qozog‘iston Respublikasining amaldagi Konstitutsiyasiga muvofiq (2022-yilgi islohotni hisobga olgan holda), QR Prezidenti qancha muddatga saylanadi?"
      ),
      options: {
        ru: [
          "На 5 лет с правом одного переизбрания",
          "На один 7-летний срок без права повторного избрания",
          "На 4 года без ограничений",
          "На 6 лет не более двух раз подряд"
        ],
        kk: [
          "Қайта сайлану құқығымен 5 жылға",
          "Қайта сайлану құқығынсыз бір реттік 7 жылдық мерзімге",
          "Шектеусіз 4 жылға",
          "Қатарынан екі реттен аспайтын 6 жылға"
        ],
        uz: [
          "Qayta saylanish huquqi bilan 5 yilga",
          "Qayta saylanish huquqisiz bir martalik 7 yillik muddatga",
          "Cheklovsiz 4 yilga",
          "Ketma-ket ikki martadan ko‘p bo‘lmagan 6 yilga"
        ]
      },
      correctIndex: 1,
      explanation: tr(
        "По конституционной реформе 2022 года Президент Республики Казахстан избирается гражданами РК на один 7-летний срок; одно и то же лицо не может быть избрано Президентом более одного раза.",
        "2022 жылғы конституциялық реформа бойынша ҚР Президенті қайта сайлану құқығынсыз бір реттік 7 жылдық мерзімге сайланады.",
        "2022-yilgi konstitutsiyaviy islohotga ko‘ra QR Prezidenti qayta saylanish huquqisiz bir martalik 7 yillik muddatga saylanadi."
      ),
      hint: tr(
        "Вспомните конституционную поправку об однократном мандате главы государства.",
        "Мемлекет басшысының бір реттік мандаты туралы конституциялық норманы еске түсіріңіз.",
        "Davlat rahbarining bir martalik mandati haqidagi konstitutsiyaviy normani eslang."
      ),
      errorCategory: "constitutional_term_reform"
    },
    {
      id: "law-q1c",
      subjectId: "law",
      topicId: "law_constitution_rk",
      lessonId: "law-lesson-law_constitution_rk",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Из каких двух палат состоит Парламент Республики Казахстан — высший представительный орган, осуществляющий законодательную власть?",
        "Заң шығару билігін жүзеге асыратын жоғары өкілді орган — Қазақстан Республикасының Парламенті қандай екі палатадан тұрады?",
        "Qonun chiqaruvchi hokimiyatni amalga oshiruvchi oliy vakillik organi — Qozog‘iston Respublikasi Parlamenti qaysi ikki palatadan iborat?"
      ),
      options: {
        ru: ["Сенат и Мажилис", "Конституционный Суд и Мажилис", "Верховный Совет и Сенат", "Правительство и Маслихат"],
        kk: ["Сенат және Мәжіліс", "Конституциялық Сот және Мәжіліс", "Жоғарғы Кеңес және Сенат", "Үкімет және Мәслихат"],
        uz: ["Senat va Majilis", "Konstitutsiyaviy Sud va Majilis", "Oliy Kengash va Senat", "Hukumat va Maslixat"]
      },
      correctIndex: 0,
      explanation: tr(
        "Согласно статье 50 Конституции РК, Парламент состоит из двух палат: Сената (верхняя палата) и Мажилиса (нижняя палата), действующих на постоянной основе.",
        "ҚР Конституциясының 50-бабына сәйкес Парламент тұрақты негізде жұмыс істейтін екі палатадан — Сенат пен Мәжілістен тұрады.",
        "QR Konstitutsiyasining 50-moddasiga muvofiq Parlament doimiy asosda ishlaydigan ikki palata — Senat va Majilisdan iborat."
      ),
      hint: tr(
        "Маслихаты — это местные представительные органы, а палаты Парламента РК закреплены в Разделе IV Конституции.",
        "Мәслихаттар — жергілікті өкілді органдар, ал Парламент палаталары Конституцияның IV бөлімінде көрсетілген.",
        "Maslixatlar — mahalliy vakillik organlari, Parlament palatalari esa Konstitutsiyaning IV bo‘limida belgilangan."
      ),
      errorCategory: "branch_organ_confusion"
    }
  ],
  law_civil_capacity: [
    {
      id: "law-q2b",
      subjectId: "law",
      topicId: "law_civil_capacity",
      lessonId: "law-lesson-law_civil_capacity",
      type: "single_choice",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "В какой момент возникает гражданская ПРАВОСПОСОБНОСТЬ физического лица согласно Гражданскому кодексу РК?",
        "ҚР Азаматтық кодексіне сәйкес жеке тұлғаның азаматтық ҚҰҚЫҚ ҚАБІЛЕТТІЛІГІ қай сәтте пайда болады?",
        "QR Fuqarolik kodeksiga muvofiq jismoniy shaxsning fuqarolik HUQUQ LAYOQATI qaysi paytda vujudga keladi?"
      ),
      options: {
        ru: ["С момента рождения (и прекращается смертью)", "По достижении 14 лет", "При получении удостоверения личности в 16 лет", "По достижении совершеннолетия в 18 лет"],
        kk: ["Туған сәттен бастап (және қайтыс болғанда тоқтайды)", "14 жасқа толғанда", "16 жаста жеке куәлік алғанда", "18 жаста кәмелетке толғанда"],
        uz: ["Tug‘ilgan paytdan boshlab (va vafot etganda tugaydi)", "14 yoshga to‘lganda", "16 yoshda guvohnoma olganda", "18 yoshda voyaga yetganda"]
      },
      correctIndex: 0,
      explanation: tr(
        "Правоспособность (способность иметь гражданские права и нести обязанности) возникает в момент рождения человека, тогда как полная дееспособность (способность своими действиями приобретать права) наступает в 18 лет.",
        "Құқық қабілеттілік (құқықтарға ие болу қабілеті) адам туған сәттен бастап пайда болады, ал толық әрекет қабілеттілік 18 жаста басталады.",
        "Huquq layoqati inson tug‘ilgan paytdan boshlanadi, to‘liq muomala layoqati esa 18 yoshda vujudga keladi."
      ),
      hint: tr(
        "Не путайте правоспособность (иметь права с рождения) и дееспособность (самостоятельно совершать сделки с 18 лет).",
        "Құқық қабілеттілік (туғаннан) пен әрекет қабілеттілікті (18 жастан) шатастырмаңыз.",
        "Huquq layoqati (tug‘ilgandan) va muomala layoqatini (18 yoshdan) adashtirmang."
      ),
      errorCategory: "legal_vs_active_capacity"
    },
    {
      id: "law-q2c",
      subjectId: "law",
      topicId: "law_civil_capacity",
      lessonId: "law-lesson-law_civil_capacity",
      type: "numeric",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Какова нормальная продолжительность рабочего времени в неделю (в часах) для совершеннолетних работников по Трудовому кодексу РК?",
        "ҚР Еңбек кодексі бойынша кәмелетке толған жұмыскерлер үшін аптасына қалыпты жұмыс уақытының ұзақтығы неше сағаттан аспауы тиіс?",
        "QR Mehnat kodeksiga ko‘ra voyaga yetgan xodimlar uchun haftalik normal ish vaqti davomiyligi necha soatdan oshmasligi kerak?"
      ),
      numericAnswer: 40,
      tolerance: 0,
      unit: "ч",
      explanation: tr(
        "По статье 68 Трудового кодекса РК нормальная продолжительность рабочего времени не должна превышать 40 часов в неделю (для работников от 14 до 16 лет — не более 24 ч, от 16 до 18 лет — не более 36 ч).",
        "ҚР Еңбек кодексінің 68-бабы бойынша қалыпты жұмыс уақыты аптасына 40 сағаттан аспауы тиіс (16–18 жаста — 36 сағаттан, 14–16 жаста — 24 сағаттан аспайды).",
        "QR Mehnat kodeksining 68-moddasiga ko‘ra normal ish vaqti haftasiga 40 soatdan oshmasligi kerak."
      ),
      hint: tr(
        "Стандартная пятидневная рабочая неделя по 8 часов в день.",
        "Күніне 8 сағаттан бес күндік стандартты жұмыс аптасы.",
        "Kuniga 8 soatdan besh kunlik standart ish haftasi."
      ),
      errorCategory: "labor_code_hours_limit"
    }
  ],
  law_criminal_admin: [
    {
      id: "law-q3b",
      subjectId: "law",
      topicId: "law_criminal_admin",
      lessonId: "law-lesson-law_criminal_admin",
      type: "numeric",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "С какого общего возраста (полных лет) наступает административная ответственность физических лиц по КоАП РК и общая уголовная ответственность по УК РК?",
        "ҚР ӘҚБтК бойынша әкімшілік жауаптылық және ҚР ҚК бойынша жалпы қылмыстық жауаптылық неше жастан басталады?",
        "QR MJtK bo‘yicha ma’muriy javobgarlik va QR JK bo‘yicha umumiy jinoiy javobgarlik necha yoshdan boshlanadi?"
      ),
      numericAnswer: 16,
      tolerance: 0,
      unit: "лет",
      explanation: tr(
        "Общий возраст как административной (КоАП РК), так и уголовной ответственности (УК РК) составляет 16 лет; лишь за отдельные тяжкие и особо тяжкие преступления уголовная ответственность наступает с 14 лет.",
        "Әкімшілік (ӘҚБтК) және жалпы қылмыстық (ҚК) жауаптылықтың жалпы жасы — 16 жас (тек ауыр қылмыстардың жекелеген түрлері бойынша қылмыстық жауаптылық 14 жастан басталады).",
        "Ma’muriy va umumiy jinoiy javobgarlik yoshi — 16 yosh (faqat ayrim og‘ir jinoyatlar uchun 14 yoshdan)."
      ),
      hint: tr(
        "14 лет — это пониженный возраст только для отдельных тяжких уголовных преступлений, а общий возраст на 2 года старше.",
        "14 жас — тек ауыр қылмыстар үшін төмендетілген шек, ал жалпы жауаптылық 2 жас үлкен.",
        "14 yosh — faqat og‘ir jinoyatlar uchun, umumiy yosh esa 2 yosh katta."
      ),
      errorCategory: "responsibility_age_threshold"
    },
    {
      id: "law-q3c",
      subjectId: "law",
      topicId: "law_criminal_admin",
      lessonId: "law-lesson-law_criminal_admin",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Как называется элемент состава правонарушения, характеризующий психическое отношение лица к содеянному (вина в форме умысла или неосторожности, мотив и цель)?",
        "Құқық бұзушылық құрамының тұлғаның өз іс-әрекетіне психикалық қатынасын (қасақаналық немесе абайсыздық түріндегі кінә, уәж және мақсат) сипаттайтын элементі қалай аталады?",
        "Huquqbuzarlik tarkibining shaxsning o‘z qilmishiga ruhiy munosabatini (qasd yoki ehtiyotsizlik shaklidagi ayb, motiv va maqsad) ifodalovchi elementi qanday ataladi?"
      ),
      options: {
        ru: ["Объект правонарушения", "Объективная сторона", "Субъект правонарушения", "Субъективная сторона"],
        kk: ["Құқық бұзушылық объектісі", "Объективтік жағы", "Құқық бұзушылық субъектісі", "Субъективтік жағы"],
        uz: ["Huquqbuzarlik obyekti", "Obyektiv tomoni", "Huquqbuzarlik subyekti", "Subyektiv tomoni"]
      },
      correctIndex: 3,
      explanation: tr(
        "Вина (умысел или неосторожность), мотив и цель образуют субъективную сторону правонарушения. Деяние, вред и причинная связь относятся к объективной стороне.",
        "Кінә (қасақаналық немесе абайсыздық), уәж және мақсат құқық бұзушылықтың субъективтік жағын құрайды.",
        "Ayb (qasd yoki ehtiyotsizlik), motiv va maqsad huquqbuzarlikning subyektiv tomonini tashkil etadi."
      ),
      hint: tr(
        "Внутреннее психическое отношение субъекта (вина, мотив, цель) — это внутренняя, субъективная сторона.",
        "Тұлғаның ішкі психикалық қатынасы (кінә, уәж, мақсат) — бұл субъективтік жағы.",
        "Shaxsning ichki ruhiy munosabati (ayb, motiv, maqsad) — bu subyektiv tomoni."
      ),
      errorCategory: "offense_element_confusion"
    }
  ],

  ml_percentages_discounts: [
    {
      id: "ml-q1b",
      subjectId: "math_lit",
      topicId: "ml_percentages_discounts",
      lessonId: "math_lit-lesson-ml_percentages_discounts",
      type: "numeric",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "К 200 г 15%-ного раствора сахара добавили 100 г чистой воды. Какова концентрация сахара в полученном растворе (в %)?",
        "200 г 15%-дық қант ерітіндісіне 100 г таза су қосылды. Алынған ерітіндідегі қанттың концентрациясы неше пайыз (%)?",
        "200 g 15% li shakar eritmasiga 100 g toza suv qo‘shildi. Hosil bo‘lgan eritmadagi shakar konsentratsiyasi necha foiz (%)?"
      ),
      numericAnswer: 10,
      tolerance: 0.1,
      unit: "%",
      explanation: tr(
        "Масса чистого сахара не изменилась: m_сахара = 200 · 0,15 = 30 г. Новая масса раствора равна 200 + 100 = 300 г. Новая концентрация ω = (30 / 300) · 100% = 10%.",
        "Таза қант массасы: m = 200 · 0,15 = 30 г. Жаңа ерітінді массасы: 200 + 100 = 300 г ⇒ ω = (30 / 300) · 100% = 10%.",
        "Toza shakar massasi: m = 200 · 0,15 = 30 g. Yangi eritma massasi: 200 + 100 = 300 g ⇒ ω = (30 / 300) · 100% = 10%."
      ),
      hint: tr(
        "Сначала найдите массу сухого вещества в граммах (200 · 0,15), а затем разделите её на новую общую массу раствора (300 г).",
        "Алдымен құрғақ заттың массасын табыңыз (200 · 0,15), содан соң оны жаңа жалпы массаға (300 г) бөліңіз.",
        "Avval quruq modda massasini toping (200 · 0,15), so‘ng uni yangi umumiy massaga (300 g) bo‘ling."
      ),
      errorCategory: "percent_base_change"
    },
    {
      id: "ml-q1c",
      subjectId: "math_lit",
      topicId: "ml_percentages_discounts",
      lessonId: "math_lit-lesson-ml_percentages_discounts",
      type: "numeric",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Вкладчик положил на депозит 100 000 тенге под 10% годовых с ежегодной капитализацией (сложные проценты). Какая сумма (в тенге) будет на счёте ровно через 2 года?",
        "Салымшы депозитке жылдық 10% күрделі пайызбен (жыл сайынғы капитализациямен) 100 000 теңге салды. Дәл 2 жылдан кейін шотта қанша теңге болады?",
        "Omonatchi depozitga yillik 10% murakkab foiz bilan 100 000 tenge qo‘ydi. Roppa-rosa 2 yildan keyin hisobda qancha tenge bo‘ladi?"
      ),
      numericAnswer: 121000,
      tolerance: 1,
      unit: "тг",
      explanation: tr(
        "Через 1 год сумма составит 100 000 · 1,1 = 110 000 тг. За второй год 10% начисляются уже на 110 000 тг: 110 000 · 1,1 = 121 000 тг (а не 120 000 тг).",
        "1-жылдан соң: 100 000 · 1,1 = 110 000 тг. 2-жылдан соң: 110 000 · 1,1 = 121 000 тг (120 000 тг емес).",
        "1-yildan so‘ng: 100 000 · 1,1 = 110 000 tg. 2-yildan so‘ng: 110 000 · 1,1 = 121 000 tg."
      ),
      hint: tr(
        "По формуле сложных процентов S = S₀ · (1 + p/100)² = 100 000 · 1,1².",
        "Күрделі пайыз формуласы бойынша S = S₀ · (1 + p/100)² = 100 000 · 1,1².",
        "Murakkab foiz formulasiga ko‘ra S = S₀ · (1 + p/100)² = 100 000 · 1,1²."
      ),
      errorCategory: "compound_interest_linear_trap"
    }
  ],
  ml_tables_statistics: [
    {
      id: "ml-q2b",
      subjectId: "math_lit",
      topicId: "ml_tables_statistics",
      lessonId: "math_lit-lesson-ml_tables_statistics",
      type: "numeric",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "Найдите размах R числового ряда результатов измерений: 14, 8, 23, 11, 29, 17.",
        "Өлшеу нәтижелерінің сандық қатарының өзгеріс ауқымын R табыңыз: 14, 8, 23, 11, 29, 17.",
        "O‘lchov natijalari sonli qatorining o‘zgarish kengligi R ni toping: 14, 8, 23, 11, 29, 17."
      ),
      numericAnswer: 21,
      tolerance: 0,
      explanation: tr(
        "Размах ряда R равен разности между наибольшим и наименьшим значениями выборки: x_max = 29, x_min = 8 ⇒ R = 29 − 8 = 21.",
        "Өзгеріс ауқымы R ең үлкен және ең кіші мәндердің айырмасына тең: x_max = 29, x_min = 8 ⇒ R = 29 − 8 = 21.",
        "O‘zgarish kengligi R eng katta va eng kichik qiymatlar ayirmasiga teng: 29 − 8 = 21."
      ),
      hint: tr(
        "Вычтите минимальное число ряда из максимального (не путайте с разностью крайних записанных чисел 17 − 14).",
        "Қатардағы ең үлкен саннан ең кіші санды азайтыңыз.",
        "Qatordagi eng katta sondan eng kichik sonni ayiring."
      ),
      errorCategory: "range_unsorted_endpoints"
    },
    {
      id: "ml-q2c",
      subjectId: "math_lit",
      topicId: "ml_tables_statistics",
      lessonId: "math_lit-lesson-ml_tables_statistics",
      type: "numeric",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Среднее арифметическое четырёх чисел равно 15. К этому набору добавили число 25. Чему равно среднее арифметическое нового набора из пяти чисел?",
        "Төрт санның арифметикалық ортасы 15-ке тең. Осы жиынтыққа 25 санын қосты. Бес саннан тұратын жаңа жиынтықтың арифметикалық ортасы неге тең?",
        "To‘rtta sonning o‘rta arifmetigi 15 ga teng. Bu to‘plamga 25 soni qo‘shildi. Beshta sondan iborat yangi to‘plamning o‘rta arifmetigi nechaga teng?"
      ),
      numericAnswer: 17,
      tolerance: 0,
      explanation: tr(
        "Сумма первых четырёх чисел равна 4 · 15 = 60. После добавления 25 новая сумма пяти чисел равна 60 + 25 = 85. Новое среднее арифметическое равно 85 / 5 = 17.",
        "Алғашқы төрт санның қосындысы 4 · 15 = 60. Жаңа қосынды 60 + 25 = 85 ⇒ жаңа арифметикалық орта 85 / 5 = 17.",
        "Dastlabki to‘rtta son yig‘indisi 4 · 15 = 60. Yangi yig‘indi 60 + 25 = 85 ⇒ yangi o‘rta arifmetik 85 / 5 = 17."
      ),
      hint: tr(
        "Нельзя просто усреднять 15 и 25! Сначала восстановите сумму первых четырёх чисел: 4 · 15 = 60.",
        "15 пен 25-ті тікелей орташалауға болмайды! Алдымен төрт санның қосындысын табыңыз: 4 · 15 = 60.",
        "Avval to‘rtta son yig‘indisini toping: 4 · 15 = 60, so‘ng 25 ni qo‘shib 5 ga bo‘ling."
      ),
      errorCategory: "weighted_mean_sum_recovery"
    }
  ],
  ml_logic_sequences: [
    {
      id: "ml-q3b",
      subjectId: "math_lit",
      topicId: "ml_logic_sequences",
      lessonId: "math_lit-lesson-ml_logic_sequences",
      type: "numeric",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "Какой цифрой оканчивается десятичная запись числа 7²⁰²⁵?",
        "7²⁰²⁵ санының ондық жазылуы қандай цифрмен аяқталады?",
        "7²⁰²⁵ sonining o‘nlik yozuvi qaysi raqam bilan tugaydi?"
      ),
      numericAnswer: 7,
      tolerance: 0,
      explanation: tr(
        "Последние цифры степеней семёрки повторяются с периодом 4: 7¹→7, 7²→9, 7³→3, 7⁴→1. Разделим показатель 2025 на 4: 2025 = 4·506 + 1 (остаток 1). Значит, последняя цифра та же, что у 7¹, то есть 7.",
        "7 дәрежелерінің соңғы цифрлары 4 периодпен қайталанады: 7, 9, 3, 1. 2025-ті 4-ке бөлгенде қалдық 1 ⇒ соңғы цифры 7¹ сияқты 7-ге тең.",
        "7 darajalarining oxirgi raqamlari 4 davr bilan takrorlanadi: 7, 9, 3, 1. 2025 ni 4 ga bo‘lganda qoldiq 1 ⇒ oxirgi raqam 7."
      ),
      hint: tr(
        "Цикл последних цифр степеней числа 7 равен четырём (7, 9, 3, 1). Найдите остаток от деления 2025 на 4.",
        "7 санының дәрежелерінің соңғы цифрлар циклі 4-ке тең (7, 9, 3, 1). 2025-ті 4-ке бөлгендегі қалдықты табыңыз.",
        "7 darajalarining oxirgi raqamlar davri 4 ga teng (7, 9, 3, 1). 2025 ni 4 ga bo‘lgandagi qoldiqni toping."
      ),
      errorCategory: "last_digit_cycle_modulo"
    },
    {
      id: "ml-q3c",
      subjectId: "math_lit",
      topicId: "ml_logic_sequences",
      lessonId: "math_lit-lesson-ml_logic_sequences",
      type: "numeric",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "На клетчатой бумаге с размером клетки 1 × 1 см изображён многоугольник, внутри которого находится В = 5 узлов сетки, а на его границе — Г = 8 узлов. Найдите площадь многоугольника по формуле Пика (в см²).",
        "1 × 1 см торкөзді қағазда ішінде В = 5 түйін және шекарасында Г = 8 түйін орналасқан көпбұрыш берілген. Пик формуласы бойынша көпбұрыштың ауданын (см²) табыңыз.",
        "1 × 1 sm katakli qog‘ozda ichida В = 5 ta tugun va chegarasida Г = 8 ta tugun bo‘lgan ko‘pburchak berilgan. Pik formulasi bo‘yicha yuzani (sm²) toping."
      ),
      numericAnswer: 8,
      tolerance: 0,
      unit: "см²",
      explanation: tr(
        "По формуле Пика: S = В + Г/2 − 1 = 5 + 8/2 − 1 = 5 + 4 − 1 = 8 см².",
        "Пик формуласы бойынша: S = В + Г/2 − 1 = 5 + 8/2 − 1 = 8 см².",
        "Pik formulasiga ko‘ra: S = В + Г/2 − 1 = 5 + 8/2 − 1 = 8 sm²."
      ),
      hint: tr(
        "Примените формулу Пика: S = В + Г/2 − 1 (не забудьте вычесть 1).",
        "Пик формуласын қолданыңыз: S = В + Г/2 − 1 (1-ді азайтуды ұмытпаңыз).",
        "Pik formulasini qo‘llang: S = В + Г/2 − 1."
      ),
      errorCategory: "picks_theorem_minus_one"
    }
  ],

  rl_main_idea_thesis: [
    {
      id: "rl-q1b",
      subjectId: "reading_lit",
      topicId: "rl_main_idea_thesis",
      lessonId: "reading_lit-lesson-rl_main_idea_thesis",
      type: "single_choice",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "Чем в анализе текста ГЛАВНАЯ МЫСЛЬ (тезис автора) отличается от ТЕМЫ текста?",
        "Мәтінді талдауда НЕГІЗГІ ОЙ (автор тезисі) мәтін ТАҚЫРЫБЫНАН несімен ерекшеленеді?",
        "Matn tahlilida ASOSIY FIKR (muallif tezisi) matn MAVZUSIDAN nimasi bilan farq qiladi?"
      ),
      options: {
        ru: [
          "Тема называет предмет разговора («о чём текст?»), а главная мысль формулирует ключевой вывод и оценку автора («что именно автор утверждает об этом предмете?»)",
          "Тема всегда записана в последнем предложении, а главная мысль — в заголовке",
          "Главная мысль перечисляет все второстепенные даты и имена из текста",
          "Между темой и главной мыслью нет никакого различия"
        ],
        kk: [
          "Тақырып әңгіме өзегін («мәтін не туралы?») атайды, ал негізгі ой автордың басты тұжырымы мен қорытындысын («автор ол туралы не айтқысы келді?») білдіреді",
          "Тақырып әрқашан соңғы сөйлемде, ал негізгі ой тақырыпта болады",
          "Негізгі ой мәтіндегі барлық қосымша даталар мен есімдерді тізіп шығады",
          "Тақырып пен негізгі ойдың арасында айырмашылық жоқ"
        ],
        uz: [
          "Mavzu suhbat predmetini («matn nima haqida?») bildiradi, asosiy fikr esa muallifning bosh xulosasini («muallif бу haqda nimani ta’kidlaydi?») ifodalaydi",
          "Mavzu har doim oxirgi gapda, asosiy fikr esa sarlavhada bo‘ladi",
          "Asosiy fikr barcha ikkinchi darajali sanalarni sanab o‘tadi",
          "Mavzu va asosiy fikr o‘rtasida farq yo‘q"
        ]
      },
      correctIndex: 0,
      explanation: tr(
        "Тема — это объект рассмотрения (например, «Экология Арала»), а главная мысль — целостное суждение автора, ради которого написан текст.",
        "Тақырып — қарастырылатын нысан, ал негізгі ой — автордың сол нысан бойынша дәлелдейтін басты тұжырымы.",
        "Mavzu — ko‘rib chiqilayotgan obyekt, asosiy fikr esa muallifning shu obyekt bo‘yicha asosiy xulosasidir."
      ),
      hint: tr(
        "Тема отвечает на вопрос «о чём?», а тезис — «что именно утверждается?».",
        "Тақырып «не туралы?», ал тезис «не дәлелденеді?» деген сұраққа жауап береді.",
        "Mavzu «nima haqida?», tezis esa «nima tasdiqlanmoqda?» savoliga javob beradi."
      ),
      errorCategory: "topic_vs_thesis_confusion"
    },
    {
      id: "rl-q1c",
      subjectId: "reading_lit",
      topicId: "rl_main_idea_thesis",
      lessonId: "reading_lit-lesson-rl_main_idea_thesis",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Прочитайте фрагмент: «Строительство Кокаральской плотины в 2005 году позволило поднять уровень Малого Арала с 38 до 42 метров, снизить солёность воды более чем вдвое и восстановить промысел свыше 20 видов рыб». Какую роль играют числа во второй части предложения по отношению к первой?",
        "Үзіндіні оқыңыз: «2005 жылы Көкарал бөгетінің салынуы Кіші Арал деңгейін 38-ден 42 метрге дейін көтеруге, судың тұздылығын екі еседен астам төмендетуге және 20-дан астам балық түрінің кәсіпшілігін қалпына келтіруге мүмкіндік берді». Сөйлемдегі сандық деректер қандай рөл атқарады?",
        "Parchani o‘qing: «2005-yilda Ko‘korol to‘g‘onining qurilishi Kichik Orol sathini 38 dan 42 metrgacha ko‘tarishga, suv sho‘rlanishini ikki barobardan ko‘proq kamaytirishga va 20 dan ortiq baliq turini tiklashga imkon berdi». Raqamli ma’lumotlar qanday vazifani bajaradi?"
      ),
      options: {
        ru: [
          "Опровергают необходимость строительства плотины",
          "Служат фактическими аргументами, доказывающими эффективность построенной плотины",
          "Показывают, что проблема Аральского моря не имеет решения",
          "Являются художественной метафорой без точного смысла"
        ],
        kk: [
          "Бөгет салудың қажеттілігін жоққа шығарады",
          "Салынған бөгеттің тиімділігін дәлелдейтін нақты фактілік аргументтер қызметін атқарады",
          "Арал мәселесінің шешімі жоқ екенін көрсетеді",
          "Нақты мағынасы жоқ көркем метафора болып табылады"
        ],
        uz: [
          "To‘g‘on qurish zarurligini инkor etadi",
          "Qurilgan to‘g‘onning samaradorligini исbotlovchi aniq faktik argumentlar vazifasini bajaradi",
          "Orol muammosining yechimi yo‘qligini ko‘rsatadi",
          "Aniq ma’noga ega bo‘lmagan badiiy metafora hisoblanadi"
        ]
      },
      correctIndex: 1,
      explanation: tr(
        "Конкретные показатели (рост уровня до 42 м, снижение солёности, 20 видов рыб) выступают фактическими аргументами, подтверждающими положительный результат проекта.",
        "Нақты көрсеткіштер (42 м деңгей, тұздылықтың кемуі, 20 балық түрі) жобаның оң нәтижесін растайтын фактілік аргументтер болып табылады.",
        "Aniq ko‘rsatkichlar loyihaning ijobiy natijasini tasdiqlovchi faktik argumentlar hisoblanadi."
      ),
      hint: tr(
        "Посмотрите, усиливают или опровергают эти цифры главный тезис о пользе плотины.",
        "Бұл цифрлар бөгеттің пайдасы туралы тезисті растай ма, әлде жоққа шығара ма?",
        "Bu raqamlar to‘g‘on foydasi haqidagi tezisni tasdiqlaydimi yoki инkor etadimi?"
      ),
      errorCategory: "argument_function_identification"
    }
  ],
  rl_fact_vs_opinion: [
    {
      id: "rl-q2b",
      subjectId: "reading_lit",
      topicId: "rl_fact_vs_opinion",
      lessonId: "reading_lit-lesson-rl_fact_vs_opinion",
      type: "single_choice",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "В тексте сказано: «У большинства подростков, использующих смартфоны менее чем за час до сна, наблюдается задержка выработки мелатонина». Какое утверждение корректно передаёт смысл текста без логического искажения?",
        "Мәтінде былай делінген: «Ұйқыға дейін бір сағаттан аз уақыт қалғанда смартфон қолданатын жасөспірімдердің көпшілігінде мелатонин бөлінуінің кешігуі байқалады». Қай тұжырым мәтін мағынасын логикалық бұрмалаусыз дәл береді?",
        "Matnda aytilishicha: «Uyqudan oldin bir soatdan kam vaqt qolganda smartfon ishlatadigan o‘smirlarning aksariyatida melatonin ajralishining kechikishi kuzatiladi». Qaysi fikr matn ma’nosini buzmasdan ifodalaydi?"
      ),
      options: {
        ru: [
          "Использование смартфона в любое время дня полностью прекращает выработку мелатонина у всех людей",
          "Вечернее использование экрана перед сном у значительной части подростков негативно влияет на биоритмы засыпания",
          "Смартфоны являются единственной причиной бессонницы в современном мире",
          "Ни один подросток не может уснуть после использования смартфона"
        ],
        kk: [
          "Смартфонды тәуліктің кез келген уақытында қолдану барлық адамдарда мелатонин бөлінуін толық тоқтатады",
          "Ұйқы алдында экранды қолдану жасөспірімдердің едәуір бөлігінде ұйықтау биоритміне кері әсер етеді",
          "Смартфондар — қазіргі әлемдегі ұйқысыздықтың жалғыз себебі",
          "Бірде-бір жасөспірім смартфоннан кейін ұйықтай алмайды"
        ],
        uz: [
          "Smartfonni kunning istalgan vaqtida ishlatish barcha odamlarda melatonin ajralishini butunlay to‘xtatadi",
          "Uyqu oldidan ekrandan foydalanish o‘smirlarning katta qismida uxlash bioritmiga salbiy ta’sir ko‘rsatadi",
          "Smartfonlar — zamonaviy dunyoda uyqusizlikning yagona sababidir",
          "Birorta ham o‘smir smartfondan keyin uxlay olmaydi"
        ]
      },
      correctIndex: 1,
      explanation: tr(
        "Вариант 2 точно сохраняет объём суждения («у большинства подростков» → «у значительной части подростков») и условие («перед сном»), тогда как остальные три варианта содержат ложные абсолютные обобщения («у всех», «единственная», «ни один»).",
        "2-нұсқа пікір көлемін («көпшілігінде» → «едәуір бөлігінде») және шартты («ұйқы алдында») дәл сақтайды.",
        "2-variant fikr hajmini va shartni («uyqu oldidan») buzmasdan saqlaydi."
      ),
      hint: tr(
        "Отбросьте варианты со словами «всех», «единственной», «ни один».",
        "«Барлық», «жалғыз», «бірде-бір» деген үзілді-кесілді сөздері бар нұсқаларды алып тастаңыз.",
        "«Barcha», «yagona», «birorta ham» kabi keskin so‘zli variantlarni chiqarib tashlang."
      ),
      errorCategory: "quantifier_distortion_trap"
    },
    {
      id: "rl-q2c",
      subjectId: "reading_lit",
      topicId: "rl_fact_vs_opinion",
      lessonId: "reading_lit-lesson-rl_fact_vs_opinion",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Какой приём критического чтения помогает отличить ПРОВЕРЯЕМЫЙ ФАКТ от АВТОРСКОЙ ОЦЕНКИ в публицистическом тексте?",
        "Публицистикалық мәтінде ТЕКСЕРІЛЕТІН ФАКТІНІ АВТОРЛЫҚ БАҒАЛАУДАН ажыратуға сыни оқудың қандай тәсілі көмектеседі?",
        "Publitsistik matnda TEKSHIRILADIGAN FAKTNI MUALLIF BAHOSIDAN ajratishga qaysi usul yordam beradi?"
      ),
      options: {
        ru: [
          "Проверить, можно ли объективно верифицировать утверждение по документам, статистике или измерениям независимо от эмоций автора",
          "Посчитать количество слов в предложении: длинные предложения всегда являются фактами",
          "Посмотреть, есть ли в предложении вводное слово «во-первых»",
          "Считать любое утверждение с прилагательным ложным"
        ],
        kk: [
          "Тұжырымды автордың эмоциясына қарамастан құжаттар, статистика немесе өлшемдер арқылы объективті тексеруге болатынын анықтау",
          "Сөйлемдегі сөздер санын есептеу: ұзын сөйлемдер әрқашан факт болады",
          "Сөйлемде «біріншіден» деген қыстырма сөз бар-жоғын қарау",
          "Сын есімі бар кез келген сөйлемді жалған деп санау"
        ],
        uz: [
          "Fikrni muallif hissiyotidan qat’i nazar hujjatlar, statistika yoki o‘lchovlar orqali obyektiv tekshirish mumkinligini aniqlash",
          "Gapdagi so‘zlar sonini sanash: uzun gaplar doim fakt bo‘ladi",
          "Gapda «birinchidan» kirish so‘zi bor-yo‘qligini tekshirish",
          "Sifat qatnashgan har qanday gapni yolg‘on deb hisoblash"
        ]
      },
      correctIndex: 0,
      explanation: tr(
        "Критерий факта — объективная верифицируемость (дата, измерение, зафиксированное событие), а критерий мнения — субъективная ценностная или эмоциональная шкала («лучший», «удивительный», «неприятный»).",
        "Фактінің өлшемі — объективті тексерілу мүмкіндігі, ал пікірдің белгісі — субъективті бағалау.",
        "Fakt mezoni — obyektiv tekshirilish imkoniyati, fikr belgisi esa — subyektiv baholashdir."
      ),
      hint: tr(
        "Факт можно доказать или опровергнуть точными данными, а мнение выражает отношение.",
        "Фактіні нақты дерекпен дәлелдеуге болады, ал пікір көзқарасты білдіреді.",
        "Faktni aniq ma’lumot bilan исbotlash mumkin, fikr esa munosabatni bildiradi."
      ),
      errorCategory: "fact_opinion_criterion"
    }
  ],
  rl_comparative_texts: [
    {
      id: "rl-q3b",
      subjectId: "reading_lit",
      topicId: "rl_comparative_texts",
      lessonId: "reading_lit-lesson-rl_comparative_texts",
      type: "single_choice",
      difficulty: "intermediate",
      maxPoints: 1,
      prompt: tr(
        "К какому функциональному типу речи относится фрагмент, построенный по схеме «Тезис → Система доказательств (почему?) → Вывод»?",
        "«Тезис → Дәлелдер жүйесі (неліктен?) → Қорытынды» сызбасы бойынша құрылған үзінді сөйлеудің қай типіне жатады?",
        "«Tezis → Dalillar tizimi (nega?) → Xulosa» sxemasi асоsida qurilgan parcha nutqning qaysi turiga kiradi?"
      ),
      options: {
        ru: ["Повествование", "Описание", "Рассуждение", "Диалог"],
        kk: ["Баяндау", "Сипаттау", "Пайымдау", "Диалог"],
        uz: ["Hikoya (bayon)", "Tasvir", "Muhokama", "Dialog"]
      },
      correctIndex: 2,
      explanation: tr(
        "Рассуждение раскрывает причинно-следственные связи и отвечает на вопрос «почему?», опираясь на структуру «тезис — аргументы — вывод». Повествование отвечает на вопрос «что произошло сначала и потом?», а описание — «каков предмет?».",
        "Пайымдау себеп-салдарлық байланыстарды ашып, «тезис — аргументтер — қорытынды» құрылымына сүйенеді.",
        "Muhokama sabab-oqibat bog‘lanishlarini ochib beradi va «tezis — argumentlar — xulosa» tuzilmasiga tayanadi."
      ),
      hint: tr(
        "Если текст объясняет причины и доказывает мысль — это рассуждение.",
        "Егер мәтін себептерді түсіндіріп, ойды дәлелдесе — бұл пайымдау.",
        "Agar matn sabablarni tushuntirib, fikrni исbotlasa — bu muhokama."
      ),
      errorCategory: "speech_type_confusion"
    },
    {
      id: "rl-q3c",
      subjectId: "reading_lit",
      topicId: "rl_comparative_texts",
      lessonId: "reading_lit-lesson-rl_comparative_texts",
      type: "single_choice",
      difficulty: "advanced",
      maxPoints: 1,
      prompt: tr(
        "Автор текста А утверждает, что дистанционное обучение экономит время на дорогу, но снижает живую социализацию школьников. Автор текста Б пишет, что онлайн-платформы расширяют доступ к курсам, однако требуют очных лабораторных практикумов. В чём позиции обоих авторов СОВПАДАЮТ?",
        "А мәтінінің авторы қашықтан оқыту жолға кететін уақытты үнемдейді, бірақ оқушылардың тірі қарым-қатынасын төмендетеді дейді. Б мәтінінің авторы онлайн-платформалар курстарға қолжетімділікті арттырады, алайда күндізгі зертханалық практикумдарды қажет етеді деп жазады. Екі автордың ұстанымы неде СӘЙКЕС КЕЛЕДІ?",
        "A matn muallifi masofaviy ta’lim vaqtni tejaydi, ammo jonli muloqotni kamaytiradi deydi. B matn muallifi onlayn platformalar imkoniyatni kengaytiradi, lekin kunduzgi amaliyotlarni talab qiladi deb yozadi. Ikki muallif pozitsiyasi nimada MOS KELADI?"
      ),
      options: {
        ru: [
          "Оба автора считают, что традиционные школы нужно полностью закрыть",
          "Оба автора признают преимущества онлайн-формата, но подчёркивают, что он не может полностью заменить очное взаимодействие и практику",
          "Оба автора категорически отвергают любые цифровые технологии в образовании",
          "Оба автора обсуждают только стоимость интернет-тарифов"
        ],
        kk: [
          "Екі автор да дәстүрлі мектептерді толық жабу керек деп санайды",
          "Екі автор да онлайн-форматтың артықшылықтарын мойындайды, бірақ ол күндізгі қарым-қатынас пен практиканы толық алмастыра алмайтынын атап өтеді",
          "Екі автор да білім берудегі цифрлық технологияларды мүлдем жоққа шығарады",
          "Екі автор да тек интернет тарифтерінің бағасын талқылайды"
        ],
        uz: [
          "Har ikki muallif an’anaviy maktablarni butunlay yopish kerak deb hisoblaydi",
          "Har ikki muallif onlayn format afzalliklarini tan oladi, biroq u jonli muloqot va amaliyotni to‘liq bosa olmasligini ta’kidlaydi",
          "Har ikki muallif raqamli texnologiyalarni butunlay rad etadi",
          "Har ikki muallif faqat internet narxlarini муhokama qiladi"
        ]
      },
      correctIndex: 1,
      explanation: tr(
        "Оба автора придерживаются взвешенной позиции (тезис с уступкой «плюс, однако ограничение»): признают пользу онлайн-обучения и одновременно указывают на незаменимость очной составляющей.",
        "Екі автор да салмақты ұстанымда: онлайн оқытудың пайдасын мойындай отырып, күндізгі форматтың орны бөлек екенін көрсетеді.",
        "Har ikki muallif onlayn ta’lim foydasini tan olgan holda kunduzgi muloqot va amaliyot zarurligini ko‘rsatadi."
      ),
      hint: tr(
        "Найдите общее логическое ядро обоих рассуждений: «польза онлайн + необходимость офлайн-элемента».",
        "Екі пайымдаудың ортақ логикалық өзегін табыңыз: «онлайн пайдасы + офлайн қажеттілігі».",
        "Ikki mulohazaning umumiy mantiqiy o‘zagini toping: «onlayn foydasi + oflayn zarurligi»."
      ),
      errorCategory: "comparative_synthesis_mismatch"
    }
  ]
};

/**
 * Domain-authentic Second Error Lab Cases for all 11 non-math subjects
 * (replacing the synthetic placeholder in compileBlueprintToCurriculum).
 */
export const SECOND_ERROR_LAB_CASES: Record<Exclude<UntSubjectId, "math">, SecondErrorLabBlueprint> = {
  physics: {
    title: tr(
      "Ловушка в кинетической энергии: потеря квадрата скорости",
      "Кинетикалық энергия тұзағы: жылдамдық квадратын жоғалту",
      "Kinetik energiya tuzog‘i: tezlik kvadratini yo‘qotish"
    ),
    taskPrompt: tr(
      "Найдите ошибку в черновике: «Тело массой m = 4 кг движется со скоростью v = 5 м/с. Найдите его кинетическую энергию E_k»:",
      "Жобадағы қатені табыңыз: «Массасы m = 4 кг дене v = 5 м/с жылдамдықпен қозғалады. Оның кинетикалық энергиясын E_k табыңыз»:",
      "Qoralamadagi xatoni toping: «Massasi m = 4 kg jism v = 5 m/s tezlik bilan harakatlanmoqda. Uning kinetik energiyasi E_k ni toping»:"
    ),
    steps: {
      ru: [
        "1) Запишем дано в СИ: m = 4 кг, v = 5 м/с.",
        "2) Подставим значения в формулу без возведения скорости в квадрат: E_k = (m · v) / 2 = (4 · 5) / 2 = 10 Дж.",
        "3) Ответ: 10 Дж."
      ],
      kk: [
        "1) ХБЖ-да берілгенін жазамыз: m = 4 кг, v = 5 м/с.",
        "2) Жылдамдықты квадраттамай формулаға қоямыз: E_k = (m · v) / 2 = (4 · 5) / 2 = 10 Дж.",
        "3) Жауабы: 10 Дж."
      ],
      uz: [
        "1) XBSda berilganlarni yozamiz: m = 4 kg, v = 5 m/s.",
        "2) Tezlikni kvadratga ko‘tarmasdan formulaga qo‘yamiz: E_k = (m · v) / 2 = (4 · 5) / 2 = 10 J.",
        "3) Javob: 10 J."
      ]
    },
    brokenStepIndex: 1,
    errorCategory: "kinetic_energy_square_omitted",
    whyBroken: tr(
      "В формуле кинетической энергии E_k = m·v² / 2 скорость возводится в квадрат (v² = 25), а в шаге 2 посчитана половина импульса p/2.",
      "Кинетикалық энергия формуласында E_k = m·v² / 2 жылдамдық квадратталады (v² = 25).",
      "Kinetik energiya formulasida E_k = m·v² / 2 tezlik kvadratga ko‘tariladi (v² = 25)."
    ),
    correctedStep: tr(
      "2) Возведём скорость в квадрат: E_k = m · v² / 2 = 4 · 5² / 2 = 4 · 25 / 2 = 50 Дж.",
      "2) Жылдамдықты квадраттаймыз: E_k = m · v² / 2 = 4 · 5² / 2 = 50 Дж.",
      "2) Tezlikni kvadratga ko‘taramiz: E_k = m · v² / 2 = 4 · 5² / 2 = 50 J."
    )
  },
  history_kz: {
    title: tr(
      "Хронологическая ловушка: смешение законов Касым-хана и Тауке-хана",
      "Хронологиялық тұзақ: Қасым хан мен Тәуке хан заңдарын шатастыру",
      "Xronologik tuzoq: Qosim xon va Tauke xon qonunlarini adashtirish"
    ),
    taskPrompt: tr(
      "Проверьте рассуждение ученика при выстраивании хронологии законов Казахского ханства:",
      "Қазақ хандығы заңдарының хронологиясын құрудағы оқушы пайымдауын тексеріңіз:",
      "Qozoq xonligi qonunlari xronologiyasini tuzishdagi o‘quvchi mulohazasini tekshiring:"
    ),
    steps: {
      ru: [
        "1) Первый свод обычного права «Қасым ханның қасқа жолы» относится к началу XVI века (правление Касым-хана, 1511–1518 гг.).",
        "2) Сразу после Касым-хана в первой половине XVI века при Тауке-хане принимается свод «Жеті жарғы», а уже в XVIII веке — «Есім ханның ескі жолы».",
        "3) Получаем порядок: Касым-хан → Тауке-хан → Есим-хан."
      ],
      kk: [
        "1) Алғашқы заңдар жинағы «Қасым ханның қасқа жолы» XVI ғасырдың басына (1511–1518 жж.) жатады.",
        "2) Қасым ханнан кейін XVI ғасырда Тәуке хан «Жеті жарғыны», ал XVIII ғасырда Есім хан «Есім ханның ескі жолын» қабылдады.",
        "3) Реттілік: Қасым хан → Тәуке хан → Есім хан."
      ],
      uz: [
        "1) «Qosim xonning qasqa joli» XVI asr boshiga (1511–1518) tegishli.",
        "2) Qosim xondan keyin XVI asrda Tauke xon «Jeti jarg‘i»ni, XVIII asrda esa Yesim xon qonunlarini qabul qildi.",
        "3) Tartib: Qosim xon → Tauke xon → Yesim xon."
      ]
    },
    brokenStepIndex: 1,
    errorCategory: "khanate_chronology_inversion",
    whyBroken: tr(
      "Перепутаны века правления Есим-хана (1598–1628 гг., рубеж XVI–XVII вв.) и Тауке-хана (1680–1715 гг., конец XVII — начало XVIII в.).",
      "Есім хан (1598–1628 жж.) мен Тәуке ханның (1680–1715 жж.) билік құрған ғасырлары ауысып кеткен.",
      "Yesim xon (1598–1628) va Tauke xon (1680–1715) hukmronlik davrlari almashib ketgan."
    ),
    correctedStep: tr(
      "2) В начале XVII века принимается «Есім ханның ескі жолы» (Есим-хан, 1598–1628 гг.), и лишь на рубеже XVII–XVIII вв. при Тауке-хане (1680–1715 гг.) создаётся «Жеті жарғы».",
      "2) XVII ғасыр басында «Есім ханның ескі жолы» (1598–1628 жж.), ал XVII–XVIII ғғ. тоғысында Тәуке хан тұсында «Жеті жарғы» қабылданды.",
      "2) XVII asr boshida Yesim xon qonunlari, XVII–XVIII asr chegarasida esa Tauke xon davrida «Jeti jarg‘i» qabul qilingan."
    )
  },
  english: {
    title: tr(
      "Ловушка First Conditional: употребление will после союза if",
      "First Conditional тұзағы: if жалғаулығынан кейін will қолдану",
      "First Conditional tuzog‘i: if bog‘lovchisidan keyin will ishlatish"
    ),
    taskPrompt: tr(
      "Найдите грамматическую ошибку в разборе предложения: «If it ___ tomorrow, we will stay at home»:",
      "Сөйлемді талдаудағы грамматикалық қатені табыңыз: «If it ___ tomorrow, we will stay at home»:",
      "Gap tahlilidagi grammatik xatoni toping: «If it ___ tomorrow, we will stay at home»:"
    ),
    steps: {
      ru: [
        "1) В предложении есть маркер будущего времени `tomorrow` и главное предложение `we will stay at home`.",
        "2) Так как условие относится к завтрашнему дню, ставим Future Simple прямо после союза `If`: `If it will rain tomorrow`.",
        "3) Выбираем ответ `will rain`."
      ],
      kk: [
        "1) Сөйлемде келер шақ маркері `tomorrow` және `we will stay at home` басыңқы бөлігі бар.",
        "2) Шарт ертеңгі күнге қатысты болғандықтан, `If`-тен кейін Future Simple қоямыз: `If it will rain tomorrow`.",
        "3) `will rain` жауабын таңдаймыз."
      ],
      uz: [
        "1) Gapda kelasi zamon belgisi `tomorrow` va `we will stay at home` bosh gapi bor.",
        "2) Shart ertangi kunga tegishli bo‘lgani uchun `If` dan keyin `will rain` qo‘yamiz.",
        "3) `will rain` javobini tanlaymiz."
      ]
    },
    brokenStepIndex: 1,
    errorCategory: "will_after_if_clause",
    whyBroken: tr(
      "В английском языке в придаточных условия и времени (после `if, when, as soon as, unless, until`) будущее время заменяется на Present Simple (`rains`), даже если речь идёт о завтрашнем дне.",
      "Ағылшын тілінде шарт және мезгіл бағыныңқы сөйлемдерде (`if, when, as soon as, unless`) келер шақтың орнына Present Simple (`rains`) қолданылады.",
      "Ingliz tilida shart va payt ergash gaplarda (`if, when, unless`) kelasi zamon o‘rniga Present Simple (`rains`) ishlatiladi."
    ),
    correctedStep: tr(
      "2) В придаточном условия First Conditional после `If` используем Present Simple для 3-го лица ед. ч. (`it`): `If it rains tomorrow, we will stay at home`.",
      "2) First Conditional-да `If`-тен кейін 3-жақ жекеше түрдегі Present Simple қолданамыз: `If it rains tomorrow, we will stay at home`.",
      "2) First Conditionalda `If` dan keyin Present Simple ishlatamiz: `If it rains tomorrow, we will stay at home`."
    )
  },
  informatics: {
    title: tr(
      "Ловушка Python: правая граница range(1, n) не включается",
      "Python тұзағы: range(1, n) оң жақ шекарасы кірмейді",
      "Python tuzog‘i: range(1, n) o‘ng chegarasi kirmaydi"
    ),
    taskPrompt: tr(
      "Найдите ошибку в рассуждении при проверке цикла суммы чисел от 1 до n включительно на Python:",
      "Python-да 1-ден n-ге дейінгі сандар қосындысын есептейтін циклдегі қатені табыңыз:",
      "Python-da 1 dan n gacha sonlar yig‘indisini hisoblovchi sikldagi xatoni toping:"
    ),
    steps: {
      ru: [
        "1) Инициализируем аккумулятор `s = 0` перед циклом.",
        "2) Запускаем цикл `for i in range(1, n):`, полагая, что `i` примет все значения от `1` до `n` включительно.",
        "3) Возвращаем `return s`."
      ],
      kk: [
        "1) Цикл алдында `s = 0` айнымалысын баптаймыз.",
        "2) `for i in range(1, n):` циклі `1`-ден `n`-ді қоса алғанда барлық мәндерді өтеді деп есептейміз.",
        "3) `return s` қайтарамыз."
      ],
      uz: [
        "1) Sikldan oldin `s = 0` o‘zgaruvchisini e’lon qilamiz.",
        "2) `for i in range(1, n):` sikli `1` dan `n` ni ham qo‘shib oladi deb hisoblaymiz.",
        "3) `return s` qaytaramiz."
      ]
    },
    brokenStepIndex: 1,
    errorCategory: "off_by_one_range",
    whyBroken: tr(
      "Функция `range(start, stop)` в Python генерирует полуинтервал `[start, stop)` — число `stop` в последовательность НЕ входит, поэтому последнее слагаемое `n` теряется.",
      "Python-дағы `range(start, stop)` функциясына `stop` саны кірмейді, сондықтан соңғы `n` қосылғышы есептелмей қалады.",
      "Python-dagi `range(start, stop)` funksiyasida `stop` qiymati kirmaydi, shuning uchun `n` tushib qoladi."
    ),
    correctedStep: tr(
      "2) Чтобы включить число `n`, верхнюю границу `range` увеличиваем на 1: `for i in range(1, n + 1): s += i`.",
      "2) `n` санын қосу үшін жоғарғы шекараны 1-ге арттырамыз: `for i in range(1, n + 1): s += i`.",
      "2) `n` sonini kiritish uchun yuqori chegarani 1 ga oshiramiz: `for i in range(1, n + 1): s += i`."
    )
  },
  chemistry: {
    title: tr(
      "Ловушка растворов: деление массы соли на массу воды вместо массы раствора",
      "Ерітінді тұзағы: тұз массасын ерітінді массасының орнына су массасына бөлу",
      "Eritma tuzog‘i: tuz massasini eritma massasi o‘rniga suv massasiga bo‘lish"
    ),
    taskPrompt: tr(
      "Найдите ошибку в расчёте массовой доли: «В 160 г воды растворили 40 г соли. Найдите массовую долю соли ω (%)»:",
      "Массалық үлесті есептеудегі қатені табыңыз: «160 г суға 40 г тұз ерітілді. Тұздың массалық үлесін ω (%) табыңыз»:",
      "Massa ulushini hisoblashdagi xatoni toping: «160 g suvda 40 g tuz eritildi. Tuzning massa ulushi ω (%) ni toping»:"
    ),
    steps: {
      ru: [
        "1) Запишем массы компонентов: масса растворённого вещества m(соли) = 40 г, масса растворителя m(H₂O) = 160 г.",
        "2) Подставим в формулу массовой доли отношение массы соли к массе воды: ω = (40 / 160) · 100% = 25%.",
        "3) Ответ: 25%."
      ],
      kk: [
        "1) Компоненттер массасын жазамыз: m(тұз) = 40 г, m(H₂O) = 160 г.",
        "2) Тұз массасын су массасына бөлеміз: ω = (40 / 160) · 100% = 25%.",
        "3) Жауабы: 25%."
      ],
      uz: [
        "1) Komponentlar massasini yozamiz: m(tuz) = 40 g, m(H₂O) = 160 g.",
        "2) Tuz massasini suv massasiga bo‘lamiz: ω = (40 / 160) · 100% = 25%.",
        "3) Javob: 25%."
      ]
    },
    brokenStepIndex: 1,
    errorCategory: "solution_mass_denominator",
    whyBroken: tr(
      "В знаменателе формулы массовой доли ω = m(в-ва) / m(р-ра) должна стоять масса ВСЕГО раствора (вода + соль = 200 г), а не масса чистой воды (160 г).",
      "Массалық үлес формуласының бөлімінде су массасы (160 г) емес, БҮКІЛ ерітінді массасы (160 + 40 = 200 г) тұруы тиіс.",
      "Massa ulushi formulasining maxrajida suv massasi (160 g) emas, balki BUTUN eritma massasi (160 + 40 = 200 g) bo‘lishi shart."
    ),
    correctedStep: tr(
      "2) Найдём массу раствора m(р-ра) = 160 + 40 = 200 г и вычислим ω = (40 / 200) · 100% = 20%.",
      "2) Ерітінді массасын табамыз: m(ер-ді) = 160 + 40 = 200 г ⇒ ω = (40 / 200) · 100% = 20%.",
      "2) Eritma massasini topamiz: m(er) = 160 + 40 = 200 g ⇒ ω = (40 / 200) · 100% = 20%."
    )
  },
  biology: {
    title: tr(
      "Ловушка генетики: смешение расщепления по фенотипу и по генотипу при Aa × Aa",
      "Генетика тұзағы: Aa × Aa будандастыруда фенотип пен генотип бойынша ажырауды шатастыру",
      "Genetika tuzog‘i: Aa × Aa chatishtirishda fenotip va genotip ajralishini adashtirish"
    ),
    taskPrompt: tr(
      "Найдите ошибку в решении задачи по второму закону Менделя (полное доминирование, Aa × Aa):",
      "Мендельдің екінші заңы бойынша есеп шығарудағы қатені табыңыз (толық басымдылық, Aa × Aa):",
      "Mendelning ikkinchi qonuni bo‘yicha masala yechimidagi xatoni toping (to‘liq dominantlik, Aa × Aa):"
    ),
    steps: {
      ru: [
        "1) При скрещивании двух гетерозигот Aa × Aa в решётке Пеннета получаем 4 комбинации: 1 AA, 2 Aa и 1 aa.",
        "2) Делаем вывод: при полном доминировании расщепление потомства по ФЕНОТИПУ составляет 1 : 2 : 1.",
        "3) Выбираем ответ 1 : 2 : 1."
      ],
      kk: [
        "1) Екі гетерозиготаны Aa × Aa будандастырғанда Пеннет торында 1 AA, 2 Aa және 1 aa шығады.",
        "2) Қорытынды: толық басымдылық кезінде ФЕНОТИП бойынша ажырау 1 : 2 : 1 болады.",
        "3) 1 : 2 : 1 жауабын таңдаймыз."
      ],
      uz: [
        "1) Ikkita geterozigotani Aa × Aa chatishtirganda Pennet katagida 1 AA, 2 Aa va 1 aa hosil bo‘ladi.",
        "2) Xulosa: to‘liq dominantlikda FENOTIP bo‘yicha ajralish 1 : 2 : 1 bo‘ladi.",
        "3) 1 : 2 : 1 javobini tanlaymiz."
      ]
    },
    brokenStepIndex: 1,
    errorCategory: "phenotype_vs_genotype_ratio",
    whyBroken: tr(
      "Соотношение 1 : 2 : 1 (1 AA : 2 Aa : 1 aa) — это расщепление по ГЕНОТИПУ. При полном доминировании особи AA и Aa внешне неразличимы (доминантный признак), поэтому по ФЕНОТИПУ расщепление равно (1 + 2) : 1 = 3 : 1.",
      "1 : 2 : 1 — бұл ГЕНОТИП бойынша ажырау. Толық басымдылықта AA және Aa фенотипі бірдей болғандықтан, ФЕНОТИП бойынша ажырау 3 : 1 болады.",
      "1 : 2 : 1 — bu GENOTIP bo‘yicha ajralish. To‘liq dominantlikda AA va Aa bir xil ko‘rinishga ega bo‘lgani uchun FENOTIP bo‘yicha ajralish 3 : 1 bo‘ladi."
    ),
    correctedStep: tr(
      "2) Объединим носителей доминантного признака (1 AA + 2 Aa = 3 части) против рецессивного (1 aa): расщепление по фенотипу при полном доминировании равно 3 : 1.",
      "2) Доминантты белгі иелерін біріктіреміз (1 AA + 2 Aa = 3 бөлік): толық басымдылықта фенотип бойынша ажырау 3 : 1.",
      "2) Dominant belgili organizmlarni birlashtiramiz (1 AA + 2 Aa = 3 qism): fenotip bo‘yicha ajralish 3 : 1."
    )
  },
  geography: {
    title: tr(
      "Ловушка высотного градиента: прибавление температуры при подъёме в гору",
      "Биіктік градиенті тұзағы: тауға көтерілгенде температураны қосу",
      "Balandlik gradiyenti tuzog‘i: тог‘ga ko‘tarilganda haroratni qo‘shish"
    ),
    taskPrompt: tr(
      "Найдите ошибку в расчёте температуры на вершине горы высотой 3000 м, если у подножия (0 м) температура +24 °C:",
      "Етегінде (0 м) температура +24 °C болғанда, биіктігі 3000 м тау шыңындағы температураны есептеудегі қатені табыңыз:",
      "Etagida (0 m) harorat +24 °C bo‘lganda, balandligi 3000 m bo‘lgan tog‘ cho‘qqisidagi haroratni hisoblashdagi xatoni toping:"
    ),
    steps: {
      ru: [
        "1) По вертикальному градиенту тропосферы температура изменяется на 6 °C на каждую 1000 м высоты: Δt = (3000 / 1000) · 6 = 18 °C.",
        "2) Прибавим полученное изменение к температуре у подножия: t = +24 °C + 18 °C = +42 °C.",
        "3) Ответ: +42 °C."
      ],
      kk: [
        "1) Тропосферада әр 1000 м сайын температура 6 °C-қа өзгереді: Δt = (3000 / 1000) · 6 = 18 °C.",
        "2) Алынған өзгерісті етектегі температураға қосамыз: t = +24 °C + 18 °C = +42 °C.",
        "3) Жауабы: +42 °C."
      ],
      uz: [
        "1) Troposferada har 1000 m da harorat 6 °C ga o‘zgaradi: Δt = (3000 / 1000) · 6 = 18 °C.",
        "2) O‘zgarishni etakdagi haroratga qo‘shamiz: t = +24 °C + 18 °C = +42 °C.",
        "3) Javob: +42 °C."
      ]
    },
    brokenStepIndex: 1,
    errorCategory: "lapse_rate_sign_inversion",
    whyBroken: tr(
      "С подъёмом вверх в тропосфере воздух разрежается и охлаждается, поэтому градиент 18 °C нужно ВЫЧИТАТЬ из температуры у подножия, а не прибавлять.",
      "Тропосферада жоғары көтерілген сайын ауа суиды, сондықтан 18 °C-ты етектегі температурадан АЗАЙТУ керек.",
      "Troposferada yuqoriga ko‘tarilgan sari havo soviydi, shuning uchun 18 °C ni etakdagi haroratdan AYIRISH kerak."
    ),
    correctedStep: tr(
      "2) Вычтем понижение температуры при подъёме на 3 км: t = +24 °C − 18 °C = +6 °C.",
      "2) 3 км биіктікке көтерілгендегі температураның төмендеуін азайтамыз: t = +24 °C − 18 °C = +6 °C.",
      "2) 3 km balandlikka ko‘tarilgandagi harorat pasayishini ayiramiz: t = +24 °C − 18 °C = +6 °C."
    )
  },
  world_history: {
    title: tr(
      "Ловушка Нового времени: смешение Декларации независимости США (1776) и Конституции США (1787)",
      "Жаңа заман тұзағы: АҚШ Тәуелсіздік декларациясы (1776) мен АҚШ Конституциясын (1787) шатастыру",
      "Yangi davr tuzog‘i: AQSh Mustaqillik deklaratsiyasi (1776) va AQSh Konstitutsiyasini (1787) adashtirish"
    ),
    taskPrompt: tr(
      "Найдите ошибку в историческом разборе документов Войны за независимость США:",
      "АҚШ Тәуелсіздік соғысы құжаттарын талдаудағы тарихи қатені табыңыз:",
      "AQSh Mustaqillik urushi hujjatlarini tahlil qilishdagi tarixiy xatoni toping:"
    ),
    steps: {
      ru: [
        "1) 4 июля 1776 года Второй Континентальный конгресс в Филадельфии принял Декларацию независимости США.",
        "2) Считаем, что основным автором текста Декларации независимости 1776 года был первый король Великобритании Георг III, установивший абсолютную монархию в штатах.",
        "3) Делаем вывод об устройстве США."
      ],
      kk: [
        "1) 1776 жылы 4 шілдеде Филадельфияда Екінші Континенттік конгресс АҚШ Тәуелсіздік декларациясын қабылдады.",
        "2) 1776 жылғы Тәуелсіздік декларациясы мәтінінің негізгі авторы Британ королі III Георг болды деп есептейміз.",
        "3) Қорытынды шығарамыз."
      ],
      uz: [
        "1) 1776-yil 4-iyulda Filadelfiyada Ikkinchi Kontinental kongress AQSh Mustaqillik deklaratsiyasini qabul qildi.",
        "2) 1776-yilgi Mustaqillik deklaratsiyasi matnining asosiy muallifi Britaniya qiroli Georg III bo‘lgan deb hisoblaymiz.",
        "3) Xulosa chiqaramiz."
      ]
    },
    brokenStepIndex: 1,
    errorCategory: "historical_authorship_confusion",
    whyBroken: tr(
      "Король Великобритании Георг III был противником независимости колоний, против чьего правления и восстали 13 штатов. Основным автором текста Декларации независимости США 1776 года был просветитель Томас Джефферсон.",
      "Ұлыбритания королі III Георг отарлардың тәуелсіздігіне қарсы болды. 1776 жылғы АҚШ Тәуелсіздік декларациясының негізгі авторы — Томас Джефферсон.",
      "Buyuk Britaniya qiroli Georg III mustaqillikka qarshi bo‘lgan. 1776-yilgi AQSh Mustaqillik deklaratsiyasining asosiy muallifi — Tomas Jefferson."
    ),
    correctedStep: tr(
      "2) Основным автором Декларации независимости США (4 июля 1776 г.), провозгласившей отделение 13 колоний от британской короны и неотчуждаемые права человека, был Томас Джефферсон.",
      "2) 13 отардың тәуелсіздігін және адамның табиғи құқықтарын жариялаған 1776 жылғы АҚШ Тәуелсіздік декларациясының негізгі авторы — Томас Джефферсон.",
      "2) 13 koloniyaning mustaqilligini e’lon qilgan 1776-yilgi AQSh Mustaqillik deklaratsiyasining asosiy muallifi — Tomas Jefferson."
    )
  },
  law: {
    title: tr(
      "Правовая ловушка: смешение правоспособности (с рождения) и полной дееспособности (с 18 лет)",
      "Құқықтық тұзақ: құқық қабілеттілік (туғаннан) пен толық әрекет қабілеттілікті (18 жастан) шатастыру",
      "Huquqiy tuzoq: huquq layoqati (tug‘ilgandan) va to‘liq muomala layoqatini (18 yoshdan) adashtirish"
    ),
    taskPrompt: tr(
      "Найдите ошибку в юридической консультации по Гражданскому кодексу РК:",
      "ҚР Азаматтық кодексі бойынша заңгерлік кеңестегі қатені табыңыз:",
      "QR Fuqarolik kodeksi bo‘yicha huquqiy maslahatdagi xatoni toping:"
    ),
    steps: {
      ru: [
        "1) Разграничим понятия: правоспособность — способность иметь гражданские права, дееспособность — способность своими действиями приобретать и осуществлять права.",
        "2) Утверждаем, что полная гражданская дееспособность гражданина РК в общем порядке наступает в 14 лет при получении паспорта.",
        "3) Ответ: 14 лет."
      ],
      kk: [
        "1) Ұғымдарды ажыратамыз: құқық қабілеттілік — құқықтарға ие болу қабілеті, әрекет қабілеттілік — өз әрекеттерімен құқықтарды жүзеге асыру қабілеті.",
        "2) ҚР азаматының толық азаматтық әрекет қабілеттілігі жалпы тәртіппен 14 жаста басталады деп тұжырымдаймыз.",
        "3) Жауабы: 14 жас."
      ],
      uz: [
        "1) Tushunchalarni farqlaymiz: huquq layoqati va muomala layoqati.",
        "2) QR fuqarosining to‘liq fuqarolik muomala layoqati umumiy tartibda 14 yoshda boshlanadi deb hisoblaymiz.",
        "3) Javob: 14 yosh."
      ]
    },
    brokenStepIndex: 1,
    errorCategory: "civil_capacity_age_trap",
    whyBroken: tr(
      "В 14 лет несовершеннолетний обладает лишь частичной дееспособностью (сделки с согласия законных представителей). Полная гражданская дееспособность по ст. 17 ГК РК наступает с совершеннолетием — в 18 лет.",
      "14 жаста кәмелетке толмаған бала тек ішінара әрекет қабілеттілікке ие. ҚР АК 17-бабы бойынша толық азаматтық әрекет қабілеттілік кәмелетке толғанда — 18 жаста басталады.",
      "14 yoshda voyaga yetmagan shaxs faqat qisman muomala layoqatiga ega. QR FK 17-moddasiga ko‘ra to‘liq fuqarolik muomala layoqati 18 yoshda vujudga keladi."
    ),
    correctedStep: tr(
      "2) Согласно статье 17 Гражданского кодекса РК, гражданская дееспособность в полном объёме возникает с наступлением совершеннолетия, то есть по достижении 18-летнего возраста.",
      "2) ҚР Азаматтық кодексінің 17-бабына сәйкес толық азаматтық әрекет қабілеттілік кәмелетке толғанда, яғни 18 жасқа толғанда пайда болады.",
      "2) QR Fuqarolik kodeksining 17-moddasiga muvofiq to‘liq fuqarolik muomala layoqati 18 yoshga to‘lganda vujudga keladi."
    )
  },
  math_lit: {
    title: tr(
      "Статистическая ловушка: поиск медианы без упорядочивания ряда по возрастанию",
      "Статистикалық тұзақ: қатарды өсу ретімен сұрыптамай медиананы табу",
      "Statistik tuzoq: qatorni o‘sish tartibida saralamasdan medianani topish"
    ),
    taskPrompt: tr(
      "Найдите ошибку при вычислении медианы числового набора: 19, 7, 12, 25, 14:",
      "Сандық жиынтықтың медианасын есептеудегі қатені табыңыз: 19, 7, 12, 25, 14:",
      "Sonli to‘plam medianasini hisoblashdagi xatoni toping: 19, 7, 12, 25, 14:"
    ),
    steps: {
      ru: [
        "1) В наборе 5 чисел (нечётное количество), значит медиана — это элемент ровно посередине (3-й по счёту).",
        "2) Не сортируя ряд, берём третье число в исходной записи (19, 7, [12], 25, 14) и объявляем медианой число 12.",
        "3) Ответ: 12."
      ],
      kk: [
        "1) Жиынтықта 5 сан (тақ сан) бар, демек медиана — дәл ортасындағы (3-ші) элемент.",
        "2) Қатарды сұрыптамай-ақ, бастапқы жазылудағы үшінші санды (19, 7, [12], 25, 14) алып, медиана 12-ге тең дейміз.",
        "3) Жауабы: 12."
      ],
      uz: [
        "1) To‘plamda 5 ta son (toq) bor, demak mediana — o‘rtadagi (3-chi) element.",
        "2) Qatorni saralamasdan, dastlabki yozuvdagi uchinchi sonni (19, 7, [12], 25, 14) olib, mediana 12 ga teng deymiz.",
        "3) Javob: 12."
      ]
    },
    brokenStepIndex: 1,
    errorCategory: "median_unsorted_array",
    whyBroken: tr(
      "По определению медиана находится посередине УПОРЯДОЧЕННОГО (отсортированного по возрастанию) ряда, а не произвольно записанного набора.",
      "Анықтама бойынша медиана кездейсоқ жазылған қатардың емес, ӨСУ РЕТІМЕН СҰРЫПТАЛҒАН қатардың дәл ортасында орналасады.",
      "Ta’rifga ko‘ra mediana ixtiyoriy yozilgan qatorning emas, balki O‘SISH TARTIBIDA SARALANGAN qatorning o‘rtasida joylashadi."
    ),
    correctedStep: tr(
      "2) Сначала упорядочим числа по возрастанию: 7, 12, 14, 19, 25. Центральный (3-й) элемент упорядоченного ряда равен 14.",
      "2) Алдымен сандарды өсу ретімен орналастырамыз: 7, 12, 14, 19, 25. Реттелген қатардың ортаңғы (3-ші) мүшесі — 14.",
      "2) Avval sonlarni o‘sish tartibida joylashtiramiz: 7, 12, 14, 19, 25. Tartiblangan qatorning o‘rtadagi (3-chi) hadi — 14."
    )
  },
  reading_lit: {
    title: tr(
      "Ловушка чтения: подмена факта из текста домыслом, которого не было у автора",
      "Оқу сауаттылығы тұзағы: мәтіндегі фактіні автор айтпаған болжаммен алмастыру",
      "O‘qish savodxonligi tuzog‘i: matndagi faktni muallif aytmagan taxmin bilan almashtirish"
    ),
    taskPrompt: tr(
      "Разберите ошибку при выборе проверяемого факта по тексту о дистанционной работе:",
      "Қашықтан жұмыс істеу туралы мәтін бойынша тексерілетін фактіні таңдаудағы қатені талдаңыз:",
      "Masofaviy ish haqidagi matn bo‘yicha tekshiriladigan faktni tanlashdagi xatoni tahlil qiling:"
    ),
    steps: {
      ru: [
        "1) Читаем варианты: (А) «В 2025 году доля удалённых сотрудников в IT-секторе составила 38% по данным отчёта», (Б) «Удалённая работа намного приятнее офисной для каждого человека».",
        "2) Выбираем вариант (Б) как строгий научный факт, потому что он звучит убедительно и эмоционально близко.",
        "3) Фиксируем ответ (Б)."
      ],
      kk: [
        "1) Нұсқаларды оқимыз: (А) «Есеп деректері бойынша 2025 жылы IT-сектордағы қашықтан жұмыс істейтіндер үлесі 38% құрады», (Б) «Қашықтан жұмыс істеу әрбір адам үшін кеңседен әлдеқайда жағымды».",
        "2) (Б) нұсқасын қатаң ғылыми факт ретінде таңдаймыз, өйткені ол эмоционалды түрде тартымды естіледі.",
        "3) (Б) жауабын белгілейміз."
      ],
      uz: [
        "1) Variantlarni o‘qiymiz: (A) «Hisobotga ko‘ra 2025-yilda IT-sektorda masofaviy xodimlar ulushi 38% ni tashkil etdi», (B) «Masofaviy ish har bir inson uchun ofis ishidan ancha yoqimli».",
        "2) (B) variantini qat’iy ilmiy fakt sifatida tanlaymiz.",
        "3) (B) javobini belgilaymiz."
      ]
    },
    brokenStepIndex: 1,
    errorCategory: "fact_vs_opinion_swap",
    whyBroken: tr(
      "Утверждение (Б) содержит субъективную оценку («намного приятнее») и неподтверждённое обобщение («для каждого человека») — это оценочное суждение, а не проверяемый факт.",
      "(Б) тұжырымында субъективті бағалау («әлдеқайда жағымды») және дәлелсіз жалпылау («әрбір адам үшін») бар — бұл факт емес, бағалау пікірі.",
      "(B) fikrida subyektiv baho («ancha yoqimli») va isbotsiz umumlashtirish («har bir inson uchun») bor — bu fakt emas, balki fikrdir."
    ),
    correctedStep: tr(
      "2) Выбираем утверждение (А), так как оно содержит конкретный статистический показатель (38%), год (2025) и ссылку на верифицируемый отчёт.",
      "2) (А) тұжырымын таңдаймыз, себебі онда нақты статистикалық көрсеткіш (38%), жыл (2025) және тексерілетін есепке сілтеме бар.",
      "2) (A) fikrini tanlaymiz, chunki unda aniq statistik ko‘rsatkich (38%), yil (2025) va tekshiriladigan hisobotga havola mavjud."
    )
  }
};
