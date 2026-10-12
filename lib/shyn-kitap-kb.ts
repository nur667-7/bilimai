import type { Language } from "./curriculum.ts";
import type { UntSubjectId } from "./unt-all-subjects.ts";
import type { ContentBlock, UniversalDifficulty } from "./universal-curriculum.ts";
import type { UniversalQuestion } from "./question-engine.ts";

function tr<T = string>(ru: T, kk?: T, uz?: T): Record<Language, T> {
  return {
    ru,
    kk: kk ?? ru,
    uz: uz ?? ru
  };
}

export interface ShynKitapGoldenRule {
  title: Record<Language, string>;
  formulaOrRule: Record<Language, string>;
  example: Record<Language, string>;
}

export interface ShynKitapReferenceTable {
  caption: Record<Language, string>;
  headers: Record<Language, [string, string, string]>;
  rows: Record<Language, [string, string, string][]>;
}

export interface ShynKitapTrap {
  trap: Record<Language, string>;
  whyWrong: Record<Language, string>;
  howToAvoid: Record<Language, string>;
}

export interface ShynKitapUnitGuidebook {
  unitId: string;
  unitNumber: number;
  subjectId: UntSubjectId;
  gradeRange: string;
  colorTheme: "emerald" | "cobalt" | "amber" | "violet";
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  goldenRules: ShynKitapGoldenRule[];
  referenceTable: ShynKitapReferenceTable;
  untTraps: ShynKitapTrap[];
}

export interface ShynKitapExtraLessonSpec {
  topicId: string;
  moduleIndex: 0 | 1 | 2;
  sectionTitle: Record<Language, string>;
  title: Record<Language, string>;
  difficulty: UniversalDifficulty;
  prereqs: string[];
  goal: Record<Language, string>;
  simpleExplanation: Record<Language, string>;
  detailedExplanation: Record<Language, string>;
  workedExample: {
    problem: Record<Language, string>;
    steps: Record<Language, string[]>;
    takeaway: Record<Language, string>;
  };
  blocks: ContentBlock[];
  summary: Record<Language, string>;
  questions: UniversalQuestion[];
}

export const SHYN_KITAP_GUIDEBOOKS: Record<UntSubjectId, ShynKitapUnitGuidebook[]> = {
  history_kz: [
    {
      unitId: "hkz-unit-1",
      unitNumber: 1,
      subjectId: "history_kz",
      gradeRange: "5–6 сынып · Ежелгі және орта ғасырлар",
      colorTheme: "emerald",
      title: tr(
        "Раздел 1. Древний и средневековый Казахстан (Шың-кітап)",
        "1-бөлім. Ежелгі және ортағасырлық Қазақстан (Шың-кітап)",
        "1-bo‘lim. Qadimgi va o‘rta asrlar Qozog‘istoni (Shyn-kitap)"
      ),
      subtitle: tr(
        "Ботай, Андроновская культура, саки, гунны, Тюркские каганаты, Караханиды и Золотая Орда",
        "Ботай, Андронов мәдениеті, сақтар, ғұндар, Түрік қағанаттары, Қарахан мемлекеті және Алтын Орда",
        "Botay, Andronov madaniyati, saklar, xunnlar, Turk xoqonliklari, Qoraxoniylar va Oltin O‘rda"
      ),
      goldenRules: [
        {
          title: tr("Алтын ереже №1: Расселение сакских племён", "Алтын ереже №1: Сақ тайпаларының қоныстануы", "Oltin qoida №1: Sak qabilalarining joylashuvi"),
          formulaOrRule: tr(
            "Тиграхауда (острошапочные) → Жетысу и Тянь-Шань (Иссык, Бесшатыр); Парадарайя (заморские) → Приаралье и низовья Сырдарьи (Чирик-Рабат); Хаомаварга → долина Мургаба; Аримаспы/Исседоны → Центральный и Восточный Казахстан (Тасмолинская культура, Шиликты, Берел).",
            "Тиграхауда (шошақ бөріктілер) → Жетісу мен Тянь-Шань (Есік, Бесшатыр); Парадарайя (теңіздің арғы бетіндегілер) → Арал маңы мен Сырдария төменгі ағысы (Шірік-Рабат); Хаомаварга → Мұрғаб аңғары; Аримаспы/Исседондар → Орталық және Шығыс Қазақстан (Тасмола, Шілікті, Берел).",
            "Tigraxauda → Jetisu va Tyan-Shan (Issiq, Besshatir); Paradarayya → Orolbo‘yi va Sirdaryo quyi oqimi (Chirik-Rabot); Xaomavarga → Murg‘ob vodiysi."
          ),
          example: tr(
            "Курган Иссык (1969 г., К. Акишев) — саки-тиграхауда (V–IV вв. до н. э.); Шиликты (З. Самашев) — древнейший Золотой человек (VIII–VII вв. до н. э.).",
            "Есік обасы (1969 ж., К. Ақышев) — сақ-тиграхауда (б.з.б. V–IV ғғ.); Шілікті (З. Самашев) — ең ежелгі Алтын адам (б.з.б. VIII–VII ғғ.).",
            "Issiq qo‘rg‘oni (1969-y., K. Akishev) — sak-tigraxauda; Shilikti (Z. Samashev) — eng qadimgi Oltin odam."
          )
        },
        {
          title: tr("Алтын ереже №2: Хронологическая цепочка каганатов", "Алтын ереже №2: Қағанаттар хронологиясы", "Oltin qoida №2: Xoqonliklar xronologiyasi"),
          formulaOrRule: tr(
            "Тюркский (552–603, Бумын) → Западно-Тюркский (603–704, Суяб) → Тюргешский (704–756, Ушлик, Сулук, Атлахская битва 751 г.) → Карлукский (756–940) → Караханиды (942–1212, Сатук Богра-хан, ислам — 960 г. при Мусе).",
            "Түрік (552–603, Бумын) → Батыс Түрік (603–704, Суяб) → Түргеш (704–756, Үшлік, Сұлу, 751 ж. Атлах шайқасы) → Қарлұқ (756–940) → Қарахан (942–1212, Сатұқ Боғра хан, 960 ж. Мұса кезінде ислам мемлекеттік дін).",
            "Turk (552–603) → G‘arбий Turk (603–704, Suyab) → Turgesh (704–756, 751-y. Atlax jangi) → Qarluq (756–940) → Qoraxoniylar (942–1212, 960-y. islom)."
          ),
          example: tr(
            "751 г. — Атлахская (Таласская) битва: арабы + карлуки разгромили войска империи Тан.",
            "751 ж. — Атлах (Талас) шайқасы: арабтар мен қарлұқтар Тан империясы әскерін талқандады.",
            "751-y. — Atlax (Talas) jangi: arablar va qarluqlar Tan imperiyasi qo‘shinini тор-mor etdi."
          )
        }
      ],
      referenceTable: {
        caption: tr("Столицы и правители средневековых государств Казахстана", "Ортағасырлық мемлекеттердің астаналары мен билеушілері", "O‘rta asr davlatlarining poytaxtlari va hukmdorlari"),
        headers: tr(["Государство и годы", "Столица", "Ключевой правитель / факт"], ["Мемлекет және жылдары", "Астанасы", "Негізгі билеуші / дерек"], ["Davlat va yillari", "Poytaxti", "Asosiy hukmdor / fakt"]),
        rows: {
          ru: [
            ["Западно-Тюркский каганат (603–704)", "Суяб (летняя — Минг-Булак)", "Шегу, Тон-ябгу («он ок будун»)"],
            ["Огузское государство (IX – сер. XI в.)", "Янгикент (низовья Сырдарьи)", "Титул — джабгу, войско — сюбаши"],
            ["Кимакский каганат (IX – нач. XI в.)", "Имакия (на Иртыше)", "16 племён, Сев.-Вост. и Центр. РК"],
            ["Государство Караханидов (942–1212)", "Баласагун, Тараз, Кашгар", "Сатук Богра-хан; 960 г. — ислам (Муса); икта и вакф"],
            ["Ак-Орда (XIII–XV вв.)", "Сыгнак", "Расцвет при Урус-хане (1360–1370-е гг.)"]
          ],
          kk: [
            ["Батыс Түрік қағанаты (603–704)", "Суяб (жазғы — Мыңбұлақ)", "Шегу, Тон-жабғу («он оқ бұдұн»)"],
            ["Оғыз мемлекеті (IX – XI ғ. ортасы)", "Жаңакент (Сырдария бойы)", "Лауазымы — жабғу, әскербасы — сюбашы"],
            ["Қимақ қағанаты (IX – XI ғ. басы)", "Имақия (Ертіс бойы)", "Солт.-Шығыс және Орталық Қазақстан"],
            ["Қарахан мемлекеті (942–1212)", "Баласағұн, Тараз, Қашғар", "Сатұқ Боғра хан; 960 ж. — ислам (Мұса); иқта мен уақыф"],
            ["Ақ Орда (XIII–XV ғғ.)", "Сығанақ", "Ұрыс хан тұсында күшейді (1360–1370 жж.)"]
          ],
          uz: [
            ["G‘arbiy Turk xoqonligi (603–704)", "Suyab (Mingbuloq)", "Shegu, Ton-yabg‘u («on oq budun»)"],
            ["O‘g‘uz davlati (IX – XI asr o‘rtasi)", "Yangikent (Sirdaryo bo‘yi)", "Unvoni — jabg‘u, qo‘shinboshi — syubashi"],
            ["Kimoq xoqonligi (IX – XI asr boshi)", "Imakiya (Irtish bo‘yi)", "Shim.-Sharqiy va Markaziy Qozog‘iston"],
            ["Qoraxoniylar davlati (942–1212)", "Balasag‘un, Taroz, Qashg‘ar", "Satuq Bog‘raxon; 960-y. — islom (Muso); iqto va vaqf"],
            ["Oq O‘rda (XIII–XV asrlar)", "Sig‘noq", "Urusxon davrida yuksaldi"]
          ]
        }
      },
      untTraps: [
        {
          trap: tr("Путаница между трудами Юсуфа Баласагуни и Махмуда Кашгари (XI в.)", "Жүсіп Баласағұн мен Махмұд Қашқари еңбектерін шатастыру", "Yusuf Xos Hojib va Mahmud Qoshg‘ariy asarlarini adashtirish"),
          whyWrong: tr("В дистракторах НЦТ автором «Дивани лугат ат-турк» часто указывают Баласагуни.", "ҰБТ дистракторларында «Диуани лұғат ат-түрік» авторы ретінде Баласағұнды береді.", "Testda «Devonu lug‘otit turk» muallifi sifatida Balasag‘uniy ko‘rsatiladi."),
          howToAvoid: tr("Юсуф Баласагуни → «Кутадгу билиг» (Благодатное знание); Махмуд Кашгари → «Дивани лугат ат-турк» (Словарь тюркских наречий); Ходжа Ахмед Ясави → «Дивани Хикмет».", "Жүсіп Баласағұн → «Құтты білік»; Махмұд Қашқари → «Диуани лұғат ат-түрік»; Қожа Ахмет Ясауи → «Диуани Хикмет».", "Yusuf Balasag‘uniy → «Qutadg‘u bilig»; Mahmud Qoshg‘ariy → «Devonu lug‘otit turk»; Ahmad Yassaviy → «Devoni Hikmat».")
        }
      ]
    },
    {
      unitId: "hkz-unit-2",
      unitNumber: 2,
      subjectId: "history_kz",
      gradeRange: "7–11 сынып · Қазақ хандығы, Алаш және Тәуелсіздік",
      colorTheme: "amber",
      title: tr(
        "Раздел 2. Казахское ханство, восстания XVIII–XIX вв., «Алаш» и Независимость",
        "2-бөлім. Қазақ хандығы, XVIII–XIX ғғ. көтерілістер, «Алаш» және Тәуелсіздік",
        "2-bo‘lim. Qozoq xonligi, XVIII–XIX asr qo‘zg‘olonlari, «Alash» va Mustaqillik"
      ),
      subtitle: tr(
        "Законы ханов, Анракайская битва, восстание Кенесары, правительство Алаш-Орда и суверенный Казахстан",
        "Хандар заңдары, Аңырақай шайқасы, Кенесары көтерілісі, Алаш Орда және тәуелсіз Қазақстан",
        "Xonlar qonunlari, Aniroqay jangi, Kenesari qo‘zg‘oloni, Alash O‘rda va mustaqil Qozog‘iston"
      ),
      goldenRules: [
        {
          title: tr("Алтын ереже №3: Три свода законов Казахского ханства", "Алтын ереже №3: Қазақ хандығының үш заңдар жинағы", "Oltin qoida №3: Qozoq xonligining uch qonunlar to‘plami"),
          formulaOrRule: tr(
            "Касым-хан (1511–1518/23) → «Қасым ханның қасқа жолы» (5 разделов, столица Сарайчик, 1 млн чел.); Есим-хан (1598–1628) → «Есім ханның ескі жолы» (столица Туркестан); Тауке-хан (1680–1715/18) → «Жеті жарғы» (7 разделов, Култобе, Толе би, Казыбек би, Айтеке би).",
            "Қасым хан (1511–1518/23) → «Қасым ханның қасқа жолы» (5 бөлім); Есім хан (1598–1628) → «Есім ханның ескі жолы» (Түркістан); Тәуке хан (1680–1715/18) → «Жеті жарғы» (Күлтөбе, Төле би, Қазыбек би, Әйтеке би).",
            "Qosimxon → «Qosim xonning qasqa yo‘li»; Yesimxon → «Yesim xonning eski yo‘li»; Taukexon → «Jeti jarg‘i»."
          ),
          example: tr(
            "Орбулакская битва (1643 г.) — Жангир-хан с 600 воинами и Жалантос батыр (20 тыс. войска) против 50-тысячного войска Эрдэни-Батура.",
            "Орбұлақ шайқасы (1643 ж.) — Жәңгір хан (600 сарбаз) және Жалаңтөс батыр (20 мың әскер).",
            "Orbuloq jangi (1643-y.) — Jangirxon (600 askar) va Jalantos botir."
          )
        }
      ],
      referenceTable: {
        caption: tr("Национально-освободительные восстания и реформы XVIII–XX вв.", "XVIII–XX ғғ. ұлт-азаттық көтерілістер мен реформалар", "XVIII–XX asr milliy-ozodlik qo‘zg‘olonlari va islohotlari"),
        headers: tr(["Годы", "Событие / Восстание", "Руководители и итог"], ["Жылдары", "Оқиға / Көтеріліс", "Басшылары мен нәтижесі"], ["Yillari", "Voqea / Qo‘zg‘olon", "Rahbarlari va natijasi"]),
        rows: {
          ru: [
            ["1783–1797 гг.", "Восстание в Младшем жузе", "Сырым Датулы (возврат земель между Уралом и Волгой)"],
            ["1822 / 1824 гг.", "Уставы Сперанского и Эссена", "Ликвидация ханской власти в Среднем (1822) и Младшем (1824) жузах"],
            ["1836–1838 гг.", "Восстание в Букеевской Орде", "Исатай Тайманулы и Махамбет Утемисулы (битва при Акбулаке)"],
            ["1837–1847 гг.", "Общенациональное восстание", "Хан Кенесары Касымулы (охватило все три жуза)"],
            ["1916 г.", "Национально-освободительное восстание", "Амангельды Иманов (Тургай), Бекболат Ашекеев (Жетысу)"],
            ["Июль / Дек. 1917 г.", "Партия «Алаш» и Алаш-Орда", "Алихан Букейханов (Семипалатинск, газета «Қазақ» 1913–1918)"]
          ],
          kk: [
            ["1783–1797 жж.", "Кіші жүздегі көтеріліс", "Сырым Датұлы (Жайық пен Еділ аралығындағы жер мәселесі)"],
            ["1822 / 1824 жж.", "Сперанский мен Эссен жарғылары", "Орта жүзде (1822) және Кіші жүзде (1824) хандық билікті жою"],
            ["1836–1838 жж.", "Бөкей Ордасындағы көтеріліс", "Исатай Тайманұлы мен Махамбет Өтемісұлы (Ақбұлақ шайқасы)"],
            ["1837–1847 жж.", "Жалпыұлттық көтеріліс", "Кенесары Қасымұлы (үш жүзді түгел қамтыды)"],
            ["1916 ж.", "Ұлт-азаттық көтеріліс", "Амангелді Иманов (Торғай), Бекболат Әшекеев (Жетісу)"],
            ["1917 ж. шілде / желтоқсан", "«Алаш» партиясы мен Алаш Орда", "Әлихан Бөкейханов (Семей, «Қазақ» газеті 1913–1918)"]
          ],
          uz: [
            ["1783–1797-yy.", "Kichik juzdagi qo‘zg‘olon", "Sirim Datuli"],
            ["1822 / 1824-yy.", "Speranskiy va Essen nizomlari", "O‘rta (1822) va Kichik (1824) juzlarda xonlik hokimiyatining tugatilishi"],
            ["1836–1838-yy.", "Bo‘key O‘rdasidagi qo‘zg‘olon", "Isatay Taymanuli va Maxambet O‘temisuli"],
            ["1837–1847-yy.", "Umummilliy qo‘zg‘olon", "Kenesari Qosimuli (uchala juzni qamrab oldi)"],
            ["1916-y.", "Milliy-ozodlik qo‘zg‘oloni", "Amangeldi Imanov (To‘rg‘ay), Bekbolat Ashekeyev (Jetisu)"],
            ["1917-y. iyul / dekabr", "«Alash» partiyasi va Alash O‘rda", "Alixon Bo‘keyxanov (Semey, «Qazaq» gazetasi)"]
          ]
        }
      },
      untTraps: [
        {
          trap: tr("Путаница дат принятия Декларации о суверенитете (1990) и Конституционного закона о независимости (1991)", "Егемендік декларациясы (1990) мен Тәуелсіздік туралы заң (1991) даталарын шатастыру", "Suverenitet deklaratsiyasi (1990) va Mustaqillik qonuni (1991) sanalarini adashtirish"),
          whyWrong: tr("Ученики часто выбирают 25 октября 1991 г. или 16 декабря 1990 г.", "Оқушылар 1991 ж. 25 қазан немесе 1990 ж. 16 желтоқсан деп шатастырады.", "O‘quvchilar 1991-yil 25-oktabr yoki 1990-yil 16-dekabrni tanlab xato qiladi."),
          howToAvoid: tr("25 октября 1990 г. — Декларация о государственном суверенитете; 16 декабря 1991 г. — Конституционный закон о государственной независимости РК; 2 марта 1992 г. — вступление в ООН; 15 ноября 1993 г. — введение тенге; 30 августа 1995 г. — действующая Конституция РК.", "1990 ж. 25 қазан — Егемендік декларациясы; 1991 ж. 16 желтоқсан — Тәуелсіздік заңы; 1992 ж. 2 наурыз — БҰҰ; 1993 ж. 15 қараша — теңге; 1995 ж. 30 тамыз — Конституция.", "1990-y. 25-oktabr — Suverenitet deklaratsiyasi; 1991-y. 16-dekabr — Mustaqillik qonuni; 1992-y. 2-mart — BMT; 1993-y. 15-noyabr — tenge; 1995-y. 30-avgust — Konstitutsiya.")
        }
      ]
    }
  ],
  math: [
    {
      unitId: "math-unit-1",
      unitNumber: 1,
      subjectId: "math",
      gradeRange: "7–9 сынып · Алгебра негізі (Шың-кітап)",
      colorTheme: "emerald",
      title: tr(
        "Раздел 1. Уравнения, неравенства, системы и прогрессии (Шың-кітап)",
        "1-бөлім. Теңдеулер, теңсіздіктер, жүйелер және прогрессиялар (Шың-кітап)",
        "1-bo‘lim. Tenglamalar, tengsizliklar, sistemalar va progressiyalar (Shyn-kitap)"
      ),
      subtitle: tr(
        "Метод интервалов, теорема Виета, текстовые задачи на проценты и формулы n-го члена и суммы прогрессий",
        "Интервалдар әдісі, Виет теоремасы, пайыздық есептер және прогрессия формулалары",
        "Intervallar usuli, Viyet teoremasi, foizli masalalar va progressiya formulalari"
      ),
      goldenRules: [
        {
          title: tr("Алтын ереже №1: Метод интервалов и смена знака", "Алтын ереже №1: Интервалдар әдісі және таңба ауысуы", "Oltin qoida №1: Intervallar usuli va ishora o‘zgarishi"),
          formulaOrRule: tr(
            "При делении или умножении неравенства на отрицательное число знак неравенства меняется на противоположный. В дробно-рациональном неравенстве P(x)/Q(x) ≥ 0 нули знаменателя Q(x) = 0 ВСЕГДА выколоты (круглые скобки).",
            "Теңсіздікті теріс санға көбейткенде немесе бөлгенде таңба қарама-қарсыға ауысады. Бөлшек-рационал P(x)/Q(x) ≥ 0 теңсіздігінде бөлімнің нөлдері Q(x) = 0 ӘРҚАШАН шешімнен шығарылады.",
            "Tengsizlikni manfiy songa ko‘paytirganda yoki bo‘lganda ishora qarama-qarshisiga o‘zgaradi. Kasr-ratsional P(x)/Q(x) ≥ 0 tengsizlikda maxraj nollari Q(x) = 0 doimo chiqarib tashlanadi."
          ),
          example: tr(
            "(x − 4)/(x + 2) ≤ 0 ⇒ x ∈ (−2; 4] (точка −2 выколота, точка 4 закрашена).",
            "(x − 4)/(x + 2) ≤ 0 ⇒ x ∈ (−2; 4] (−2 нүктесі ашық, 4 нүктесі боялған).",
            "(x − 4)/(x + 2) ≤ 0 ⇒ x ∈ (−2; 4]."
          )
        },
        {
          title: tr("Алтын ереже №2: Теорема Виета и сумма квадратов корней", "Алтын ереже №2: Виет теоремасы және түбірлер квадраттарының қосындысы", "Oltin qoida №2: Viyet teoremasi va ildizlar kvadratlari yig‘indisi"),
          formulaOrRule: tr(
            "Для x² + px + q = 0 (при D ≥ 0): x₁ + x₂ = −p, x₁·x₂ = q. Полезное тождество НЦТ: x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂ = p² − 2q.",
            "x² + px + q = 0 үшін (D ≥ 0): x₁ + x₂ = −p, x₁·x₂ = q. ҰБТ-да жиі келетін тепе-теңдік: x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂ = p² − 2q.",
            "x² + px + q = 0 uchun: x₁ + x₂ = −p, x₁·x₂ = q. Muhim ayniyat: x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂ = p² − 2q."
          ),
          example: tr(
            "Для x² − 6x + 7 = 0: x₁ + x₂ = 6, x₁x₂ = 7 ⇒ x₁² + x₂² = 36 − 14 = 22.",
            "x² − 6x + 7 = 0 үшін: x₁ + x₂ = 6, x₁x₂ = 7 ⇒ x₁² + x₂² = 36 − 14 = 22.",
            "x² − 6x + 7 = 0 uchun: x₁² + x₂² = 36 − 14 = 22."
          )
        }
      ],
      referenceTable: {
        caption: tr("Формулы прогрессий и комбинаторики Шың-кітап", "Шың-кітап: прогрессиялар мен комбинаторика формулалары", "Shyn-kitap: progressiyalar va kombinatorika formulalari"),
        headers: tr(["Раздел", "Формула", "Ключевое свойство"], ["Бөлім", "Формула", "Негізгі қасиеті"], ["Bo‘lim", "Formula", "Asosiy xossasi"]),
        rows: {
          ru: [
            ["Арифметическая прогрессия", "aₙ = a₁ + (n − 1)d; Sₙ = (a₁ + aₙ)n / 2", "Характеристическое свойство: aₙ = (aₙ₋₁ + aₙ₊₁) / 2"],
            ["Геометрическая прогрессия", "bₙ = b₁ · qⁿ⁻¹; Sₙ = b₁(qⁿ − 1)/(q − 1)", "При |q| < 1 бесконечно убывающая сумма: S = b₁ / (1 − q)"],
            ["Размещения и Сочетания", "Aₙᵏ = n! / (n − k)!; Cₙᵏ = n! / (k!(n − k)!)", "Если порядок НЕ важен (комиссия, рукопожатия) — Cₙᵏ"]
          ],
          kk: [
            ["Арифметикалық прогрессия", "aₙ = a₁ + (n − 1)d; Sₙ = (a₁ + aₙ)n / 2", "Ортаңғы мүше қасиеті: aₙ = (aₙ₋₁ + aₙ₊₁) / 2"],
            ["Геометриялық прогрессия", "bₙ = b₁ · qⁿ⁻¹; Sₙ = b₁(qⁿ − 1)/(q − 1)", "|q| < 1 кемімелі прогрессия қосындысы: S = b₁ / (1 − q)"],
            ["Орналастыру мен Теру", "Aₙᵏ = n! / (n − k)!; Cₙᵏ = n! / (k!(n − k)!)", "Реті маңызды емес болса (команда, қол алысу) — Cₙᵏ"]
          ],
          uz: [
            ["Arifmetik progressiya", "aₙ = a₁ + (n − 1)d; Sₙ = (a₁ + aₙ)n / 2", "Xarakteristik xossa: aₙ = (aₙ₋₁ + aₙ₊₁) / 2"],
            ["Geometrik progressiya", "bₙ = b₁ · qⁿ⁻¹; Sₙ = b₁(qⁿ − 1)/(q − 1)", "|q| < 1 cheksiz kamayuvchi yig‘indi: S = b₁ / (1 − q)"],
            ["O‘rinlashtirish va Kombinatsiya", "Aₙᵏ = n! / (n − k)!; Cₙᵏ = n! / (k!(n − k)!)", "Tartib muhim bo‘lmasa — Cₙᵏ"]
          ]
        }
      },
      untTraps: [
        {
          trap: tr("Потеря модуля при извлечении чётного корня: √(x²) = x вместо |x|", "Жұп дәрежелі түбірден модульді жоғалту: √(x²) = |x|", "Juft ildizdan modulni yo‘qotish: √(x²) = |x|"),
          whyWrong: tr("При отрицательном x выражение √(x²) положительно и равно −x.", "Теріс x үшін √(x²) мәні оң сан (−x) болады.", "Manfiy x uchun √(x²) musbat (−x) bo‘ladi."),
          howToAvoid: tr("Всегда заменяйте √(f(x)²) на |f(x)| и раскрывайте модуль с учётом знака подмодульного выражения.", "Әрқашан √(f(x)²) өрнегін |f(x)| деп жазып, таңбасын тексеріңіз.", "Har doim √(f(x)²) ni |f(x)| deb yozing.")
        }
      ]
    },
    {
      unitId: "math-unit-2",
      unitNumber: 2,
      subjectId: "math",
      gradeRange: "10–11 сынып · Логарифм, Тригонометрия, Анализ және Геометрия",
      colorTheme: "cobalt",
      title: tr(
        "Раздел 2. Логарифмы, тригонометрия, матанализ и стереометрия (Шың-кітап)",
        "2-бөлім. Логарифм, тригонометрия, матанализ және стереометрия (Шың-кітап)",
        "2-bo‘lim. Logarifm, trigonometriya, matanaliz va stereometriya (Shyn-kitap)"
      ),
      subtitle: tr(
        "ОДЗ логарифмов, формулы приведения, касательная, интеграл Ньютона-Лейбница и объёмы многогранников",
        "Логарифм АОО, келтіру формулалары, жанама, Ньютон-Лейбниц интегралы және көлемдер",
        "Logarifm aniqlanish sohasi, keltirish formulalari, urinma, integral va hajmlar"
      ),
      goldenRules: [
        {
          title: tr("Алтын ереже №3: Логарифмические неравенства при 0 < a < 1", "Алтын ереже №3: 0 < a < 1 болғандағы логарифмдік теңсіздіктер", "Oltin qoida №3: 0 < a < 1 da logarifmik tengsizliklar"),
          formulaOrRule: tr(
            "Решение logₐ f(x) > logₐ g(x) всегда начинается с системы ОДЗ: f(x) > 0 и g(x) > 0. Если основание 0 < a < 1, функция убывает и знак меняется: f(x) < g(x).",
            "logₐ f(x) > logₐ g(x) шешу әрқашан АОО-дан басталады: f(x) > 0, g(x) > 0. Егер 0 < a < 1 болса, теңсіздік таңбасы кері ауысады: f(x) < g(x).",
            "logₐ f(x) > logₐ g(x) yechimi har doim f(x) > 0, g(x) > 0 dan boshlanadi. Agar 0 < a < 1 bo‘lsa, ishora o‘zgaradi: f(x) < g(x)."
          ),
          example: tr(
            "log₀.₅(x − 2) > −1 ⇔ { x − 2 > 0; x − 2 < (0.5)⁻¹ = 2 } ⇔ x ∈ (2; 4).",
            "log₀.₅(x − 2) > −1 ⇔ { x − 2 > 0; x − 2 < 2 } ⇔ x ∈ (2; 4).",
            "log₀.₅(x − 2) > −1 ⇔ x ∈ (2; 4)."
          )
        }
      ],
      referenceTable: {
        caption: tr("Производная, интеграл и объёмы тел в ЕНТ", "ҰБТ-дағы туынды, интеграл және денелер көлемі", "UNTdagi hosila, integral va jismlar hajmi"),
        headers: tr(["Тема", "Формула Шың-кітап", "Применение в ЕНТ"], ["Тақырып", "Шың-кітап формуласы", "ҰБТ-да қолданылуы"], ["Mavzu", "Shyn-kitap formulasi", "UNTda qo‘llanilishi"]),
        rows: {
          ru: [
            ["Уравнение касательной", "y = f(x₀) + f′(x₀)(x − x₀); k = tg α = f′(x₀)", "В точках экстремума f′(x) = 0 и меняет знак"],
            ["Формула Ньютона-Лейбница", "∫ₐᵇ f(x)dx = F(b) − F(a)", "Площадь криволинейной трапеции: S = ∫ₐᵇ (f_верх − f_ниж)dx"],
            ["Объёмы фигур", "Призма/Цилиндр: V = S_осн·h; Пирамида/Конус: V = ⅓S_осн·h", "Шар: V = (4/3)πR³, S_сферы = 4πR²"]
          ],
          kk: [
            ["Жанама теңдеуі", "y = f(x₀) + f′(x₀)(x − x₀); k = tg α = f′(x₀)", "Экстремум нүктесінде f′(x) = 0 және таңбасын ауыстырады"],
            ["Ньютон-Лейбниц формуласы", "∫ₐᵇ f(x)dx = F(b) − F(a)", "Қисықсызықты трапеция ауданы: S = ∫ₐᵇ (f_жоғ − f_төм)dx"],
            ["Көлем формулалары", "Призма/Цилиндр: V = S_таб·h; Пирамида/Конус: V = ⅓S_таб·h", "Шар: V = (4/3)πR³, Сфера ауданы: S = 4πR²"]
          ],
          uz: [
            ["Urinma tenglamasi", "y = f(x₀) + f′(x₀)(x − x₀); k = tg α = f′(x₀)", "Ekstremum nuqtasida f′(x) = 0"],
            ["Nyuton-Leybnits formulasi", "∫ₐᵇ f(x)dx = F(b) − F(a)", "Egri chiziqli trapetsiya yuzi: S = ∫ₐᵇ (f_yuq − f_past)dx"],
            ["Jismlar hajmi", "Prizma/Silindr: V = S_asos·h; Piramida/Konus: V = ⅓S_asos·h", "Shar: V = (4/3)πR³, Sfera yuzi: S = 4πR²"]
          ]
        }
      },
      untTraps: [
        {
          trap: tr("Забытый множитель 1/3 в объёме пирамиды и конуса", "Пирамида мен конус көлемінде 1/3 көбейткішін ұмыту", "Piramida va konus hajmida 1/3 ko‘paytuvchini unutish"),
          whyWrong: tr("Дистракторы НЦТ всегда содержат число S_осн · h (объём призмы).", "ҰБТ дистракторларында әрқашан S_таб · h (призма көлемі) беріледі.", "Variantlarda har doim S_asos · h beriladi."),
          howToAvoid: tr("Если у тела есть острая вершина (пирамида, конус) — всегда делите произведение площади основания и высоты на 3!", "Дененің төбесі үшкір болса (пирамида, конус) — әрқашан 3-ке бөліңіз!", "Agar jismning uchi bo‘lsa (piramida, konus) — har doim 3 ga bo‘ling!")
        }
      ]
    }
  ],
  physics: [
    {
      unitId: "phys-unit-1",
      unitNumber: 1,
      subjectId: "physics",
      gradeRange: "7–11 сынып · Механика, МКТ, Электродинамика және Кванттық физика",
      colorTheme: "cobalt",
      title: tr(
        "Справочник Шың-кітап: Полный свод законов Физики ЕНТ",
        "Шың-кітап анықтамалығы: ҰБТ Физика заңдарының толық жинағы",
        "Shyn-kitap qo‘llanmasi: UNT Fizika qonunlarining to‘liq to‘plami"
      ),
      subtitle: tr(
        "Механика, термодинамика, законы Ома и Ампера/Лоренца, оптика и уравнение фотоэффекта Эйнштейна",
        "Механика, термодинамика, Ом және Ампер/Лоренц заңдары, оптика және Эйнштейн фотоэффект теңдеуі",
        "Mexanika, termodinamika, Om va Amper/Lorens qonunlari, optika va Eynshteyn fotoeffekt tenglamasi"
      ),
      goldenRules: [
        {
          title: tr("Алтын ереже: Перевод в СИ перед любой подстановкой", "Алтын ереже: Есептеу алдында ХБЖ-ға (СИ) айналдыру", "Oltin qoida: Hisoblashdan oldin SI tizimiga o‘tkazish"),
          formulaOrRule: tr(
            "36 км/ч = 10 м/с (делим на 3,6); T(K) = t(°C) + 273; 1 мкКл = 10⁻⁶ Кл; 1 мГн = 10⁻³ Гн; 1 эВ = 1,6·10⁻¹⁹ Дж.",
            "36 км/сағ = 10 м/с (3,6-ға бөлеміз); T(K) = t(°C) + 273; 1 мкКл = 10⁻⁶ Кл; 1 мГн = 10⁻³ Гн; 1 эВ = 1,6·10⁻¹⁹ Дж.",
            "36 km/soat = 10 m/s (3,6 ga bo‘lamiz); T(K) = t(°C) + 273; 1 mkKl = 10⁻⁶ Kl."
          ),
          example: tr(
            "При v = 72 км/ч = 20 м/с и m = 2 кг кинетическая энергия Eₖ = mv²/2 = 2·400/2 = 400 Дж.",
            "v = 72 км/сағ = 20 м/с және m = 2 кг болса, Eₖ = mv²/2 = 400 Дж.",
            "v = 72 km/soat = 20 m/s va m = 2 kg bo‘lsa, Eₖ = 400 J."
          )
        }
      ],
      referenceTable: {
        caption: tr("Главные формулы Физики ЕНТ (Шың-кітап)", "ҰБТ Физикасының негізгі формулалары (Шың-кітап)", "UNT Fizikasining asosiy formulalari (Shyn-kitap)"),
        headers: tr(["Раздел", "Формула", "Закон / Условие"], ["Бөлім", "Формула", "Заң / Шарт"], ["Bo‘lim", "Formula", "Qonun / Shart"]),
        rows: {
          ru: [
            ["Механика", "F = ma; p = mv; Eₖ = mv²/2; Eₚ = mgh", "Закон сохранения импульса и энергии"],
            ["МКТ и Термодинамика", "pV = νRT; Q = ΔU + A; η = (T₁ − T₂)/T₁", "В изохорном процессе (V=const) A = 0, в изотермическом (T=const) ΔU = 0"],
            ["Электродинамика", "I = ε/(R + r); F_A = BIl sinα; F_L = qvB sinα", "При параллельном соединении U = const, при последовательном I = const"],
            ["Оптика и Кванты", "1/F = 1/d + 1/f; hν = A_вых + mv²/2", "Закон радиоактивного распада: N = N₀ · 2^(−t/T)"]
          ],
          kk: [
            ["Механика", "F = ma; p = mv; Eₖ = mv²/2; Eₚ = mgh", "Импульс пен энергияның сақталу заңы"],
            ["МКТ және Термодинамика", "pV = νRT; Q = ΔU + A; η = (T₁ − T₂)/T₁", "Изохоралық процесте (V=const) A = 0, изотермалықта (T=const) ΔU = 0"],
            ["Электродинамика", "I = ε/(R + r); F_A = BIl sinα; F_L = qvB sinα", "Параллель жалғауда U = const, тізбектей жалғауда I = const"],
            ["Оптика және Кванттар", "1/F = 1/d + 1/f; hν = A_шығ + mv²/2", "Радиоактивті ыдырау заңы: N = N₀ · 2^(−t/T)"]
          ],
          uz: [
            ["Mexanika", "F = ma; p = mv; Eₖ = mv²/2; Eₚ = mgh", "Impuls va energiyaning saqlanish qonuni"],
            ["MKT va Termodinamika", "pV = νRT; Q = ΔU + A; η = (T₁ − T₂)/T₁", "Izoxorik jarayonda A = 0, izotermik jarayonda ΔU = 0"],
            ["Elektrodinamika", "I = ε/(R + r); F_A = BIl sinα; F_L = qvB sinα", "Parallel ulanishda U = const, ketma-ket ulanishda I = const"],
            ["Optika va Kvantlar", "1/F = 1/d + 1/f; hν = A_chiq + mv²/2", "Radioaktiv yemirilish qonuni: N = N₀ · 2^(−t/T)"]
          ]
        }
      },
      untTraps: [
        {
          trap: tr("Подстановка температуры в °C вместо Кельвинов в формулу КПД Карно η = (T₁ − T₂)/T₁", "Карно ПӘК-і формуласына Кельвин орнына °C қою", "Karno FIK formulasiga Kelvin o‘rniga °C qo‘yish"),
          whyWrong: tr("Разность T₁ − T₂ в °C и K одинакова, но в знаменателе стоит абсолютная температура T₁ = t₁ + 273!", "Алымындағы T₁ − T₂ айырмасы бірдей болғанымен, бөлімінде T₁ = t₁ + 273 тұруы шарт!", "Maxrajda mutlaq harorat T₁ = t₁ + 273 bo‘lishi shart!"),
          howToAvoid: tr("Всегда переводите t₁ и t₂ в Кельвины (+273) перед делением на T₁.", "Бөлу алдында t₁ мен t₂ мәндеріне міндетті түрде 273 қосыңыз.", "Bo‘lishdan oldin t₁ va t₂ ga albatta 273 qo‘shing.")
        }
      ]
    }
  ],
  informatics: [
    {
      unitId: "inf-unit-1",
      unitNumber: 1,
      subjectId: "informatics",
      gradeRange: "7–11 сынып · Санау жүйелері, Логика, Python, SQL және Желілер",
      colorTheme: "violet",
      title: tr(
        "Справочник Шың-кітап: Информатика, Python и Архитектура сетей",
        "Шың-кітап анықтамалығы: Информатика, Python және Желі архитектурасы",
        "Shyn-kitap qo‘llanmasi: Informatika, Python va Tarmoq arxitekturasi"
      ),
      subtitle: tr(
        "Системы счисления, кодирование информации, вентили и импликация, алгоритмы Python, SQL и маски IP-сетей",
        "Санау жүйелері, ақпаратты кодтау, логикалық элементтер, Python алгоритмдері, SQL және IP-желілер",
        "Sanoq sistemalari, axborotni kodlash, mantiqiy elementlar, Python algoritmlari, SQL va IP-tarmoqlar"
      ),
      goldenRules: [
        {
          title: tr("Алтын ереже: Импликация A → B и range(start, stop, step) в Python", "Алтын ереже: A → B импликациясы және Python-дағы range(start, stop, step)", "Oltin qoida: A → B implikatsiyasi va Pythonda range(start, stop, step)"),
          formulaOrRule: tr(
            "Импликация A → B ложна ТОЛЬКО в одном случае: когда из истины следует ложь (1 → 0 = 0). В Python верхняя граница в range(a, b) и срезе s[a:b] НЕ включается (до b − 1).",
            "A → B импликациясы ТЕК БІР жағдайда жалған: 1 → 0 = 0. Python-да range(a, b) және s[a:b] жоғарғы шекарасы b кірмейді (b − 1-ге дейін).",
            "A → B implikatsiyasi FAQAT 1 → 0 = 0 holatda yolg‘on. Pythonda range(a, b) va s[a:b] da yuqori chegara b kirmaydi."
          ),
          example: tr(
            "list(range(2, 9, 3)) даёт [2, 5, 8]; s = 'PYTHON'; s[1:4] даёт 'YTH'.",
            "list(range(2, 9, 3)) → [2, 5, 8]; s = 'PYTHON'; s[1:4] → 'YTH'.",
            "list(range(2, 9, 3)) → [2, 5, 8]; s = 'PYTHON'; s[1:4] → 'YTH'."
          )
        }
      ],
      referenceTable: {
        caption: tr("Формулы кодирования, сетей и SQL (Шың-кітап)", "Шың-кітап: кодтау, желілер және SQL формулалары", "Shyn-kitap: kodlash, tarmoqlar va SQL formulalari"),
        headers: tr(["Тема", "Формула / Синтаксис", "Пояснение НЦТ"], ["Тақырып", "Формула / Синтаксис", "ҰБТ түсіндірмесі"], ["Mavzu", "Formula / Sintaksis", "UNT izohi"]),
        rows: {
          ru: [
            ["Объём информации", "N = 2ⁱ; I_граф = M·N·i; I_звук = f·i·t·k", "k = 1 (моно), k = 2 (стерео); 1 байт = 8 бит, 1 Кбайт = 1024 байт"],
            ["SQL-запросы", "SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ...", "WHERE фильтрует строки ДО группировки, HAVING — группы ПОСЛЕ GROUP BY"],
            ["IP-адрес и Маска", "Адрес сети = IP & Маска; Хостов = 2^(32−n) − 2", "Вычитаем 2 адреса: адрес самой сети (все 0) и широковещательный broadcast (все 1)"]
          ],
          kk: [
            ["Ақпарат көлемі", "N = 2ⁱ; I_граф = M·N·i; I_дыбыс = f·i·t·k", "k = 1 (моно), k = 2 (стерео); 1 байт = 8 бит, 1 Кбайт = 1024 байт"],
            ["SQL сұраныстары", "SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ...", "WHERE топтауға дейін жолдарды сүзеді, HAVING — GROUP BY-дан кейін"],
            ["IP-адрес және Маска", "Желі адресі = IP & Маска; Хост саны = 2^(32−n) − 2", "Желі адресі (0) мен broadcast (1) есепке алынбайды (−2)"]
          ],
          uz: [
            ["Axborot hajmi", "N = 2ⁱ; I_graf = M·N·i; I_ovoz = f·i·t·k", "k = 1 (mono), k = 2 (stereo); 1 bayt = 8 bit"],
            ["SQL so‘rovlari", "SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ...", "WHERE guruhlashdan oldin, HAVING — GROUP BY dan keyin filtrlaydi"],
            ["IP-manzil va Maska", "Tarmoq manzili = IP & Maska; Xostlar = 2^(32−n) − 2", "Tarmoq manzili va broadcast chiqarib tashlanadi (−2)"]
          ]
        }
      },
      untTraps: [
        {
          trap: tr("Деление `/` вместо `//` в Python", "Python-да `//` орнына `/` бөлу амалы", "Pythonda `//` o‘rniga `/` bo‘lish amali"),
          whyWrong: tr("Оператор `/` всегда возвращает `float` (например, `8 / 2` даёт `4.0`), а `//` — целую часть (`8 // 3` даёт `2`).", "`/` операторы әрқашан `float` қайтарады (`8 / 2 = 4.0`), ал `//` бүтін бөлікті береді.", "`/` operatori har doim `float` qaytaradi (`8 / 2 = 4.0`)."),
          howToAvoid: tr("При разборе цифр числа в цикле `while n > 0:` всегда используйте `n % 10` (последняя цифра) и `n //= 10` (отбросить последнюю цифру).", "Сан цифрларын талдағанда `n % 10` және `n //= 10` қолданыңыз.", "Son raqamlarini ajratishda `n % 10` va `n //= 10` ishlating.")
        }
      ]
    }
  ],
  chemistry: [
    {
      unitId: "chem-unit-1",
      unitNumber: 1,
      subjectId: "chemistry",
      gradeRange: "7–11 сынып · Жалпы, Бейорганикалық және Органикалық химия",
      colorTheme: "emerald",
      title: tr(
        "Справочник Шың-кітап: Общая, Неорганическая и Органическая химия",
        "Шың-кітап анықтамалығы: Жалпы, Бейорганикалық және Органикалық химия",
        "Shyn-kitap qo‘llanmasi: Umumiy, Noorganik va Organik kimyo"
      ),
      subtitle: tr(
        "Строение атома, ОВР, кинетика Вант-Гоффа, равновесие Ле Шателье, гидролиз, электролиз и органика",
        "Атом құрылысы, ТТР, Вант-Гофф кинетикасы, Ле Шателье тепе-теңдігі, гидролиз, электролиз және органика",
        "Atom tuzilishi, OQR, Vant-Goff kinetikasi, Le Shatelye muvozanati, gidroliz, elektroliz va organika"
      ),
      goldenRules: [
        {
          title: tr("Алтын ереже: Окислитель vs Восстановитель и проскок электрона", "Алтын ереже: Тотықтырғыш vs Тотықсыздандырғыш және электрон секіруі", "Oltin qoida: Oksidlovchi vs Qaytaruvchi va elektron sakrashi"),
          formulaOrRule: tr(
            "Восстановитель отдаёт электроны и повышает степень окисления (окисляется); Окислитель принимает электроны и понижает степень окисления (восстанавливается). У Cr (Z=24: ...3d⁵4s¹) и Cu (Z=29: ...3d¹⁰4s¹) на внешнем 4s-подуровне всего 1 электрон!",
            "Тотықсыздандырғыш электрон беріп, тотығу дәрежесін арттырады; Тотықтырғыш электрон қосып алып, тотығу дәрежесін төмендетеді. Cr (Z=24) пен Cu (Z=29) сыртқы 4s-деңгейшесінде 1 электрон болады!",
            "Qaytaruvchi elektron beradi (oksidlanadi); Oksidlovchi elektron oladi (qaytariladi). Cr (Z=24) va Cu (Z=29) da 4s pog‘onachada 1 ta elektron bor!"
          ),
          example: tr(
            "Правило Вант-Гоффа: v₂ = v₁ · γ^((T₂ − T₁)/10). При нагреве на 30°C и γ = 2 скорость растёт в 2³ = 8 раз.",
            "Вант-Гофф ережесі: v₂ = v₁ · γ^((T₂ − T₁)/10). 30°C-қа қыздырғанда (γ = 2) жылдамдық 2³ = 8 есе артады.",
            "Vant-Goff qoidasi: v₂ = v₁ · γ^((T₂ − T₁)/10)."
          )
        }
      ],
      referenceTable: {
        caption: tr("Гидролиз солей, качественные реакции и гомологические ряды (Шың-кітап)", "Шың-кітап: Тұздар гидролизі, сапалық реакциялар және органика", "Shyn-kitap: Tuzlar gidrolizi, sifat reaksiyalari va organika"),
        headers: tr(["Раздел", "Формула / Признак", "Важное правило ЕНТ"], ["Бөлім", "Формула / Белгісі", "ҰБТ ережесі"], ["Bo‘lim", "Formula / Belgisi", "UNT qoidasi"]),
        rows: {
          ru: [
            ["Гидролиз солей", "Среда определяется СИЛЬНЫМ ионом", "Na₂CO₃ → pH > 7 (щелочная); CuCl₂ → pH < 7 (кислая); NaCl → pH = 7 (не гидролизуется)"],
            ["Качественные реакции", "Ba²⁺ + SO₄²⁻ → BaSO₄↓ (белый); Ag⁺ + Cl⁻ → AgCl↓ (белый творож.)", "Fe³⁺ + CNS⁻ → кроваво-красный; Альдегиды + Ag₂O → «серебряное зеркало»"],
            ["Углеводороды", "Алканы CₙH₂ₙ₊₂ (sp³); Алкены CₙH₂ₙ (sp²); Алкины CₙH₂ₙ₋₂ (sp)", "Правило Марковникова: H присоединяется к более гидрогенизированному атому C"]
          ],
          kk: [
            ["Тұздар гидролизі", "Ортаны КҮШТІ ион анықтайды", "Na₂CO₃ → pH > 7 (сілтілік); CuCl₂ → pH < 7 (қышқылдық); NaCl → pH = 7"],
            ["Сапалық реакциялар", "Ba²⁺ + SO₄²⁻ → BaSO₄↓ (ақ тұнба); Ag⁺ + Cl⁻ → AgCl↓", "Fe³⁺ + CNS⁻ → қан-қызыл; Альдегидтер + Ag₂O → «күміс айна»"],
            ["Көмірсутектер", "Алкан CₙH₂ₙ₊₂ (sp³); Алкен CₙH₂ₙ (sp²); Алкин CₙH₂ₙ₋₂ (sp)", "Марковников ережесі: сутек сутегі көп көміртек атомына қосылады"]
          ],
          uz: [
            ["Tuzlar gidrolizi", "Muhitni KUCHLI ion belgilaydi", "Na₂CO₃ → pH > 7 (ishqoriy); CuCl₂ → pH < 7 (kislotali); NaCl → pH = 7"],
            ["Sifat reaksiyalari", "Ba²⁺ + SO₄²⁻ → BaSO₄↓ (oq); Ag⁺ + Cl⁻ → AgCl↓", "Fe³⁺ + CNS⁻ → to‘q qizil; Aldegidlar + Ag₂O → «kumush ko‘zgu»"],
            ["Uglevodorodlar", "Alkan CₙH₂ₙ₊₂ (sp³); Alken CₙH₂ₙ (sp²); Alkin CₙH₂ₙ₋₂ (sp)", "Markovnikov qoidasi: vodorod vodorodi ko‘p uglerodga birikadi"]
          ]
        }
      },
      untTraps: [
        {
          trap: tr("Влияние давления на равновесие реакций без изменения числа молей газа", "Газ моль саны өзгермейтін реакцияларда қысымның әсері", "Gaz mol soni o‘zgarmaydigan reaksiyalarda bosim ta’siri"),
          whyWrong: tr("В реакции H₂(г) + I₂(г) ⇄ 2HI(г) слева 2 моль газа и справа 2 моль газа (Δν = 0).", "H₂(г) + I₂(г) ⇄ 2HI(г) реакциясында сол жақта да, оң жақта да 2 моль газ бар (Δν = 0).", "H₂(g) + I₂(g) ⇄ 2HI(g) reaksiyasida Δν = 0."),
          howToAvoid: tr("Если сумма коэффициентов газов слева и справа равна (Δν_газ = 0), изменение давления НЕ смещает равновесие!", "Газ коэффициенттерінің қосындысы тең болса, қысым тепе-теңдікті ығыстырмайды!", "Gaz koeffitsiyentlari yig‘indisi teng bo‘lsa, bosim muvozanatni siljitmaydi!")
        }
      ]
    }
  ],
  biology: [
    {
      unitId: "bio-unit-1",
      unitNumber: 1,
      subjectId: "biology",
      gradeRange: "7–11 сынып · Цитология, Генетика, Ботаника, Зоо және Анатомия",
      colorTheme: "emerald",
      title: tr(
        "Справочник Шың-кітап: Цитология, Генетика, Ботаника, Зоология и Анатомия",
        "Шың-кітап анықтамалығы: Цитология, Генетика, Ботаника, Зоология және Анатомия",
        "Shyn-kitap qo‘llanmasi: Sitologiya, Genetika, Botanika, Zoologiya va Anatomiya"
      ),
      subtitle: tr(
        "Органоиды, энергетический обмен (38 АТФ), митоз и мейоз (2n4c), законы Менделя и Моргана, отделы растений и системы органов",
        "Органоидтар, энергетикалық алмасу (38 АТФ), митоз бен мейоз (2n4c), Мендель мен Морган заңдары, өсімдіктер мен анатомия",
        "Organoidlar, energetik almashinuv (38 ATF), mitoz va meyoz (2n4c), Mendel va Morgan qonunlari, botanika va anatomiya"
      ),
      goldenRules: [
        {
          title: tr("Алтын ереже: Выход АТФ и формулы хромосом в митозе/мейозе", "Алтын ереже: АТФ шығымы және митоз/мейоздағы хромосома формуласы", "Oltin qoida: ATF chiqimi va mitoz/meyozda xromosoma formulasi"),
          formulaOrRule: tr(
            "Энергетический обмен 1 молекулы глюкозы: подготовительный этап = 0 АТФ (100% тепло), гликолиз (бескислородный, в цитоплазме) = 2 АТФ, кислородный этап (в митохондриях) = 36 АТФ, суммарно = 38 АТФ. В анафазе митоза у полюсов временно 4n4c, в гаметах после мейоза II — 1n1c.",
            "1 молекула глюкоза ыдырағанда: дайындық кезеңі = 0 АТФ, гликолиз (цитоплазмада) = 2 АТФ, оттекті кезең (митохондрияда) = 36 АТФ, барлығы = 38 АТФ. Митоз анафазасында 4n4c, гаметаларда мейоз II-ден кейін 1n1c.",
            "1 molekula glyukoza parchalanishida: tayyorgarlik = 0 ATF, glikoliz = 2 ATF, kislorodli bosqich = 36 ATF, jami = 38 ATF."
          ),
          example: tr(
            "Двойное оплодотворение у цветковых (С. Г. Навашин): 1-й спермий (n) + яйцеклетка (n) = зигота (2n); 2-й спермий (n) + центральная клетка (2n) = триплоидный эндосперм (3n).",
            "Гүлді өсімдіктердегі қосарлы ұрықтану (С. Г. Навашин): 1-спермий (n) + жұмыртқа жасуша (n) = зигота (2n); 2-спермий (n) + орталық жасуша (2n) = эндосперм (3n).",
            "Gulli o‘simliklarda qo‘sh urug‘lanish: zigota (2n) + triploid endosperm (3n)."
          )
        }
      ],
      referenceTable: {
        caption: tr("Сравнительная таблица биологии ЕНТ (Шың-кітап)", "Шың-кітап: ҰБТ биологиясының салыстырмалы кестесі", "Shyn-kitap: UNT biologiyasi solishtirma jadvali"),
        headers: tr(["Раздел / Объект", "Ключевая характеристика", "Частый вопрос ЕНТ"], ["Бөлім / Нысан", "Негізгі сипаттамасы", "ҰБТ сұрағы"], ["Bo‘lim / Obyekt", "Asosiy xususiyati", "UNT savoli"]),
        rows: {
          ru: [
            ["Органоиды клетки", "Без мембраны: рибосомы, клеточный центр; 2 мембраны: митохондрии, пластиды", "Лизосомы, ЭПС, аппарат Гольджи, вакуоли — одномембранные"],
            ["Жизненный цикл растений", "У мхов преобладает гаметофит (n); у папоротников, голо- и покрытосеменных — спорофит (2n)", "Эндосперм голосеменных гаплоидный (n), а цветковых — триплоидный (3n)"],
            ["Круги кровообращения", "Малый круг: правый желудочек → лёгкие → левое предсердие", "В лёгочной артерии течёт венозная кровь, а в лёгочных венах — артериальная!"]
          ],
          kk: [
            ["Жасуша органоидтары", "Мембранасыз: рибосома, жасуша орталығы; 2 мембраналы: митохондрия, пластидтер", "Лизосома, ЭПТ, Гольджи жиынтығы, вакуоль — бірмембраналы"],
            ["Өсімдіктер тіршілік циклі", "Мүктерде гаметофит (n) басым; қырықжапырақ, ашық және жабық тұқымдыларда — спорофит (2n)", "Ашық тұқымдылар эндоспермі гаплоидты (n), гүлді өсімдіктердікі — триплоидты (3n)"],
            ["Қанайналым шеңберлері", "Кіші шеңбер: оң қарынша → өкпе → сол жүрекше", "Өкпе артериясында вена қаны, ал өкпе веналарында артерия қаны ағады!"]
          ],
          uz: [
            ["Hujayra organoidlari", "Membranasiz: ribosoma, hujayra markazi; 2 membranali: mitoxondriya, plastidalar", "Lizosoma, EPT, Golji majmuasi, vakuola — bir membranali"],
            ["O‘simliklar hayot sikli", "Yo‘sinlarda gametofit (n) ustun; qirqquloq va urug‘lilarda — sporofit (2n)", "Ochiq urug‘lilar endospermi (n), yopiq urug‘lilarniki — (3n)"],
            ["Qon aylanish doiralari", "Kichik doira: o‘ng qorincha → o‘pka → chap bo‘lmacha", "O‘pka arteriyasida venoz qon, o‘pka venalarida arterial qon oqadi!"]
          ]
        }
      },
      untTraps: [
        {
          trap: tr("Определение артерии как сосуда «с артериальной кровью»", "Артерияны «тек артерия қаны ағатын тамыр» деп ойлау", "Arteriyani «faqat arterial qon oqadigan tomir» deb o‘ylash"),
          whyWrong: tr("Лёгочная артерия несёт венозную кровь от сердца к лёгким.", "Өкпе артериясы жүректен өкпеге вена қанын тасымалдайды.", "O‘pka arteriyasi yurakdan o‘pkaga venoz qon olib boradi."),
          howToAvoid: tr("Артерии — это любые сосуды, идущие ОТ сердца (независимо от состава крови); вены — сосуды, идущие К сердцу.", "Артерия — жүректен ШЫҒАТЫН тамыр; вена — жүрекке КЕЛЕТІН тамыр.", "Arteriya — yurakdan CHIQUVCHI tomir; vena — yurakka KELUVCHI tomir.")
        }
      ]
    }
  ],
  geography: [
    {
      unitId: "geo-unit-1",
      unitNumber: 1,
      subjectId: "geography",
      gradeRange: "7–11 сынып · Физикалық география, Қазақстан географиясы және Геоэкономика",
      colorTheme: "emerald",
      title: tr(
        "Справочник Шың-кітап: География Казахстана, Геосистемы и Геоэкономика",
        "Шың-кітап анықтамалығы: Қазақстан географиясы, Геожүйелер және Геоэкономика",
        "Shyn-kitap qo‘llanmasi: Qozog‘iston geografiyasi, Geotizimlar va Geoikqtisodiyot"
      ),
      subtitle: tr(
        "Масштаб, амплитуда, падение и уклон рек, границы и заповедники Казахстана, демография и экономические районы РК",
        "Масштаб, амплитуда, өзен құламасы мен еңістігі, Қазақстан шекарасы мен қорықтары, демография және экономикалық аудандар",
        "Masshtab, amplituda, daryo nishabligi, Qozog‘iston chegaralari va qo‘riqxonalari, demografiya va iqtisodiy rayonlar"
      ),
      goldenRules: [
        {
          title: tr("Алтын ереже: Перевод численного масштаба (отбрасываем 5 нулей → км)", "Алтын ереже: Сандық масштабты атаулыға айналдыру (5 нөлді сызу → км)", "Oltin qoida: Sonli masshtabni nomliga o‘tkazish (5 ta nolni o‘chirish → km)"),
          formulaOrRule: tr(
            "В 1 км = 100 000 см (5 нулей), в 1 м = 100 см (2 нуля). Падение реки H = H₁ − H₂ (в м); Уклон реки i = H / L (см/км или м/км). Площадь на карте меняется пропорционально КВАДРАТУ масштаба: S_мест = S_карт · M².",
            "1 км = 100 000 см (5 нөл), 1 м = 100 см (2 нөл). Өзен құламасы H = H₁ − H₂; Еңістігі i = H / L. Картадағы аудан масштабтың КВАДРАТЫНА пропорционал: S_жер = S_карт · M².",
            "1 km = 100 000 sm (5 ta nol). Daryo tushishi H = H₁ − H₂; Nishabligi i = H / L."
          ),
          example: tr(
            "Исток на высоте 1800 м, устье −20 м, длина 2000 км ⇒ падение H = 1800 − (−20) = 1820 м; уклон i = 1820 / 2000 = 0,91 м/км.",
            "Бастауы 1800 м, сағасы −20 м, ұзындығы 2000 км ⇒ құламасы H = 1820 м; еңістігі i = 0,91 м/км.",
            "Boshlanishi 1800 m, quyilishi −20 m, uzunligi 2000 km ⇒ tushishi H = 1820 m."
          )
        }
      ],
      referenceTable: {
        caption: tr("Географические рекорды, границы и экономические районы Казахстана (Шың-кітап)", "Шың-кітап: Қазақстанның географиялық рекордтары, шекарасы және аудандары", "Shyn-kitap: Qozog‘istonning geografik rekordlari, chegarasi va rayonlari"),
        headers: tr(["Категория", "Объекты и показатели", "Факт для ЕНТ"], ["Санат", "Нысандар мен көрсеткіштер", "ҰБТ дерегі"], ["Toifa", "Obyektlar va ko‘rsatkichlar", "UNT fakti"]),
        rows: {
          ru: [
            ["Крайние точки высоты РК", "Высшая: пик Хан-Тенгри (6995 м); Низшая: впадина Карагие (−132 м)", "Высшая точка Сарыарки — г. Аксоран (1565 м), Алтая — г. Белуха (4506 м)"],
            ["Сухопутные границы РК", "Россия (~7591 км), Китай (~1782 км), Узбекистан (~2354 км), Кыргызстан (~1241 км), Туркменистан (~426 км)", "Самая длинная непрерывная сухопутная граница в мире — с РФ"],
            ["Заповедники Казахстана (10)", "Старейший — Аксу-Жабаглы (1926 г.); Коргалжынский и Наурзумский — в списке ЮНЕСКО", "Каратауский (2004 г.) — самый молодой; в Коргалжынском охраняют розового фламинго"]
          ],
          kk: [
            ["ҚР биіктік нүктелері", "Ең биік: Хан Тәңірі шыңы (6995 м); Ең төмен: Қарақия ойысы (−132 м)", "Сарыарқаның ең биік нүктесі — Ақсораң (1565 м), Алтайдікі — Мұзтау (4506 м)"],
            ["ҚР құрлық шекарасы", "Ресей (~7591 км), Қытай (~1782 км), Өзбекстан (~2354 км), Қырғызстан (~1241 км), Түрікменстан (~426 км)", "Әлемдегі ең ұзын үздіксіз құрлық шекарасы — Ресеймен"],
            ["Қазақстан қорықтары (10)", "Ең көнесі — Ақсу-Жабағылы (1926 ж.); Қорғалжын мен Наурызым — ЮНЕСКО тізімінде", "Қаратау (2004 ж.) — ең жасы; Қорғалжында қоқиқаз қорғалады"]
          ],
          uz: [
            ["QR balandlik nuqtalari", "Eng baland: Xon-Tangri cho‘qqisi (6995 m); Eng past: Qoragiya botig‘i (−132 m)", "Sariarqaning eng baland nuqtasi — Oqsoran (1565 m)"],
            ["QR quruqlik chegarasi", "Rossiya (~7591 km), Xitoy (~1782 km), O‘zbekiston (~2354 km), Qirg‘iziston (~1241 km), Turkmaniston (~426 km)", "Eng uzun quruqlik chegarasi — Rossiya bilan"],
            ["Qozog‘iston qo‘riqxonalari (10)", "Eng qadimgisi — Oqsu-Jabag‘ili (1926-y.); Qo‘rg‘aljin va Naurizim — YUNESKO ro‘yxatida", "Qoratov (2004-y.) — eng yoshi"]
          ]
        }
      },
      untTraps: [
        {
          trap: tr("Определение годовой амплитуды при отрицательной зимней температуре", "Қысқы температура теріс болғанда жылдық амплитуданы есептеу", "Qishki harorat manfiy bo‘lganda yillik amplitudani hisoblash"),
          whyWrong: tr("При t_июля = +24°C и t_января = −16°C ученики вычитают 24 − 16 = 8°C.", "t_шілде = +24°C және t_қаңтар = −16°C болғанда 24 − 16 = 8°C деп қателеседі.", "24 − 16 = 8°C deb xato qilishadi."),
          howToAvoid: tr("Вычитание отрицательного числа даёт сложение модулей: A = 24 − (−16) = 40°C!", "Теріс санды азайту модульдерді қосуды береді: A = 24 − (−16) = 40°C!", "A = 24 − (−16) = 40°C!")
        }
      ]
    }
  ],
  world_history: [
    {
      unitId: "wh-unit-1",
      unitNumber: 1,
      subjectId: "world_history",
      gradeRange: "5–11 сынып · Ежелгі дүние, Орта ғасырлар, Жаңа және Қазіргі заман",
      colorTheme: "amber",
      title: tr(
        "Справочник Шың-кітап: Всемирная история от Древнего Востока до XX века",
        "Шың-кітап анықтамалығы: Ежелгі Шығыстан XX ғасырға дейінгі Дүниежүзі тарихы",
        "Shyn-kitap qo‘llanmasi: Qadimgi Sharqdan XX asrgacha Jahon tarixi"
      ),
      subtitle: tr(
        "Античность, сословные монархии Средневековья, Реформация, буржуазные революции, мировые войны и международные договоры",
        "Антикалық дәуір, Орта ғасырлар, Реформация, буржуазиялық революциялар, дүниежүзілік соғыстар және халықаралық шарттар",
        "Antik davr, O‘rta asrlar, Reformatsiya, burjua inqiloblari, jahon urushlari va xalqaro shartnomalar"
      ),
      goldenRules: [
        {
          title: tr("Алтын ереже: Сословно-представительные органы и Хартия 1215 г.", "Алтын ереже: Сословиелік-өкілдік органдар және 1215 ж. Хартия", "Oltin qoida: Tabaqaviy-vakillik organlari va 1215-y. Xartiya"),
          formulaOrRule: tr(
            "Англия: 1215 г. — «Великая хартия вольностей» (Иоанн Безземельный), 1265 г. — Парламент (Симон де Монфор); Франция: 1302 г. — Генеральные штаты (Филипп IV Красивый); Испания — Кортесы; Россия: 1549 г. — Земский собор; Польша — Сейм.",
            "Англия: 1215 ж. — «Еркіндіктің ұлы хартиясы», 1265 ж. — Парламент; Франция: 1302 ж. — Бас штаттар (IV Филипп); Испания — Кортестер; Ресей: 1549 ж. — Зем соборы.",
            "Angliya: 1215-y. — «Erkinlikning buyuk xartiyasi», 1265-y. — Parlament; Fransiya: 1302-y. — Bosh shtatlar; Ispaniya — Korteslar."
          ),
          example: tr(
            "Версальско-Вашингтонская система (1919–1922) завершила Первую мировую войну; Ялтинско-Потсдамская (1945) — Вторую мировую войну.",
            "Версаль-Вашингтон жүйесі (1919–1922) І ДЖС-ны, ал Ялта-Потсдам жүйесі (1945) ІІ ДЖС-ны қорытындылады.",
            "Versal-Vashington tizimi (1919–1922) I jahon urushini, Yalta-Potsdam (1945) — II jahon urushini yakunladi."
          )
        }
      ],
      referenceTable: {
        caption: tr("Ключевые вехи и международные договоры Всемирной истории (Шың-кітап)", "Шың-кітап: Дүниежүзі тарихының негізгі даталары мен шарттары", "Shyn-kitap: Jahon tarixining asosiy sanalari va shartnomalari"),
        headers: tr(["Эпоха / Год", "Событие / Документ", "Историческое значение"], ["Дәуір / Жыл", "Оқиға / Құжат", "Тарихи маңызы"], ["Davr / Yil", "Voqea / Hujjat", "Tarixiy ahamiyati"]),
        rows: {
          ru: [
            ["509 г. до н. э. / 594 г. до н. э.", "Республика в Риме / Реформы Солона в Афинах", "В Афинах отменено долговое рабство; в Риме — борьба патрициев и плебеев"],
            ["1517 г. / 1648 г.", "95 тезисов Мартина Лютера / Вестфальский мир", "Начало Реформации в Германии; итог Тридцатилетней войны"],
            ["4 июля 1776 г. / 1789 г.", "Декларация независимости США / ВФР", "Томас Джефферсон (США); взятие Бастилии 14 июля 1789 г. (Франция)"],
            ["1919 г. / 1945 г. / 1949 г.", "Версальский мир / Создание ООН / Создание НАТО", "Лига Наций (1919); Устав ООН в Сан-Франциско (1945); ОВД создана в 1955 г."]
          ],
          kk: [
            ["Б.з.б. 509 ж. / Б.з.б. 594 ж.", "Рим республикасы / Афиныдағы Солон реформасы", "Афиныда қарыз құлдығы жойылды; Римде патрицийлер мен плебейлер күресі"],
            ["1517 ж. / 1648 ж.", "Мартин Лютердің 95 тезисі / Вестфаль бітімі", "Германияда Реформацияның басталуы; Отыз жылдық соғыс қорытындысы"],
            ["1776 ж. 4 шілде / 1789 ж.", "АҚШ Тәуелсіздік декларациясы / ҰФР", "Томас Джефферсон (АҚШ); 1789 ж. 14 шілдеде Бастилияны алу"],
            ["1919 ж. / 1945 ж. / 1949 ж.", "Версаль шарты / БҰҰ құрылуы / НАТО құрылуы", "Ұлттар Лигасы (1919); БҰҰ Жарғысы (1945); ВШҰ 1955 ж. құрылды"]
          ],
          uz: [
            ["Mil. avv. 509-y. / 594-y.", "Rim respublikasi / Afinada Solon islohoti", "Afinada qarz qulligi bekor qilindi"],
            ["1517-y. / 1648-y.", "Martin Lyuterning 95 tezisi / Vestfaliya sulhi", "Germaniyada Reformatsiya boshlanishi; O‘ttiz yillik urush yakuni"],
            ["1776-y. 4-iyul / 1789-y.", "AQSH Mustaqillik deklaratsiyasi / BFI", "Tomas Jefferson (AQSH); 1789-y. 14-iyulda Bastiliyaning olinishi"],
            ["1919-y. / 1945-y. / 1949-y.", "Versal shartnomasi / BMT tuzilishi / NATO", "Millatlar Ligasi (1919); BMT Ustavi (1945); VSH 1955-y. tuzildi"]
          ]
        }
      },
      untTraps: [
        {
          trap: tr("Путаница между конференцией в Тегеране (1943), Ялте (февраль 1945) и Потсдаме (июль–август 1945)", "Тегеран (1943), Ялта (1945 ақпан) және Потсдам (1945 шілде-тамыз) конференцияларын шатастыру", "Tehron (1943), Yalta (1945 fevral) va Potsdam (1945 iyul-avgust) konferensiyalarini adashtirish"),
          whyWrong: tr("Решение об открытии Второго фронта в Нормандии часто приписывают Ялтинской конференции.", "Екінші майданды ашу туралы шешімді Ялта конференциясымен шатастырады.", "Ikkinchi frontni ochish qarorini Yalta bilan adashtirishadi."),
          howToAvoid: tr("Тегеран (ноябрь–декабрь 1943) → открытие Второго фронта; Ялта (февраль 1945) → принципы ООН и вступление СССР в войну с Японией; Потсдам (июль–август 1945) → демилитаризация и денацификация Германии.", "Тегеран (1943) → Екінші майдан; Ялта (1945 ақпан) → БҰҰ және Жапонияға қарсы соғыс; Потсдам (1945 шілде-тамыз) → Германияны демилитаризациялау.", "Tehron (1943) → Ikkinchi front; Yalta (1945) → BMT; Potsdam (1945) → Germaniyani demilitarizatsiyalash.")
        }
      ]
    }
  ],
  law: [
    {
      unitId: "law-unit-1",
      unitNumber: 1,
      subjectId: "law",
      gradeRange: "9–11 сынып · ТГП, ҚР Конституциясы, Азаматтық, Еңбек және Қылмыстық құқық",
      colorTheme: "cobalt",
      title: tr(
        "Справочник Шың-кітап: Основы права и Законодательство РК",
        "Шың-кітап анықтамалығы: Құқық негіздері және ҚР Заңнамасы",
        "Shyn-kitap qo‘llanmasi: Huquq asoslari va QR Qonunchiligi"
      ),
      subtitle: tr(
        "Норма права (гипотеза, диспозиция, санкция), Конституция РК, Гражданский, Трудовой, Семейный, Административный и Уголовный кодексы РК",
        "Құқық нормасы (гипотеза, диспозиция, санкция), ҚР Конституциясы, Азаматтық, Еңбек, Отбасы, Әкімшілік және Қылмыстық кодекстер",
        "Huquq normasi (gipoteza, dispozitsiya, sanksiya), QR Konstitutsiyasi, Fuqarolik, Mehnat, Oila, Ma’muriy va Jinoyat kodekslari"
      ),
      goldenRules: [
        {
          title: tr("Алтын ереже: Структура нормы права и возрасты правовой ответственности в РК", "Алтын ереже: Құқық нормасының құрылымы және ҚР-дағы жауапкершілік жасы", "Oltin qoida: Huquq normasi tuzilishi va QRda javobgarlik yoshi"),
          formulaOrRule: tr(
            "Гипотеза («Если...») — условие действия нормы; Диспозиция («то должен / имеет право...») — само правило поведения; Санкция («иначе...») — мера ответственности. Общий возраст уголовной (УК РК) и административной (КоАП РК) ответственности — 16 лет (за тяжкие и особо тяжкие преступления по ст. 15 УК РК — с 14 лет).",
            "Гипотеза («Егер...») — норманың қолданылу шарты; Диспозиция («онда міндетті / құқылы...») — мінез-құлық ережесі; Санкция («әйтпесе...») — жауапкершілік шарасы. Қылмыстық және әкімшілік жауапкершіліктің жалпы жасы — 16 жас (ауыр қылмыстар үшін — 14 жастан).",
            "Gipoteza («Agar...») — shart; Dispozitsiya — xulq-atvor qoidasi; Sanksiya — javobgarlik chorasi. Umumiy jinoiy va ma’muriy javobgarlik yoshi — 16 yosh (og‘ir jinoyatlar uchun — 14 yoshdan)."
          ),
          example: tr(
            "Президент РК избирается сроком на 7 лет однократно (без права повторного избрания); обращения граждан напрямую проверяет Конституционный Суд РК (с 2023 г.).",
            "ҚР Президенті 7 жылға бір рет қана сайланады (қайта сайлану құқығынсыз); азаматтардың өтініштерін Конституциялық Сот қарайды.",
            "QR Prezidenti 7 yil muddatga bir marta saylanadi."
          )
        }
      ],
      referenceTable: {
        caption: tr("Возрастные пороги и нормы права Республики Казахстан (Шың-кітап)", "Шың-кітап: Қазақстан Республикасы құқығындағы жас шектері мен нормалар", "Shyn-kitap: Qozog‘iston Respublikasi huquqidagi yosh chegaralari va normalar"),
        headers: tr(["Отрасль права РК", "Возраст / Норма", "Ключевая деталь для ЕНТ"], ["Құқық саласы", "Жас шегі / Норма", "ҰБТ үшін маңызды дерек"], ["Huquq sohasi", "Yosh chegarasi / Norma", "UNT uchun muhim деталь"]),
        rows: {
          ru: [
            ["Гражданское право (ГК РК)", "До 14 лет — малолетние; 14–18 лет — несовершеннолетние; с 18 лет — полная дееспособность", "Эмансипация с 16 лет (или при вступлении в брак); правоспособность — с момента рождения"],
            ["Трудовое право (ТК РК)", "Трудовой договор — с 16 лет (с 15/14 лет с письменного согласия родителя)", "Рабочее время: 14–16 лет — до 24 ч/нед; 16–18 лет — до 36 ч/нед; норма — 40 ч/нед"],
            ["Семейное право (КоБСиС РК)", "Брачный возраст — 18 лет (снижение не более чем на 2 года при уважительных причинах)", "Учёт мнения ребёнка в суде обязателен с 10 лет"]
          ],
          kk: [
            ["Азаматтық құқық (ҚР АК)", "14 жасқа дейін — жас балалар; 14–18 жас — кәмелетке толмағандар; 18 жастан — толық әрекет қабілеттілік", "Эмансипация 16 жастан; құқық қабілеттілік туған сәттен басталады"],
            ["Еңбек құқығы (ҚР ЕК)", "Еңбек шарты — 16 жастан (ата-ана келісімімен 15/14 жастан)", "Жұмыс уақыты: 14–16 жас — аптасына 24 сағ; 16–18 жас — 36 сағ; қалыпты — 40 сағ"],
            ["Отбасы құқығы", "Неке жасы — 18 жас (дәлелді себеппен ең көбі 2 жылға төмендетіледі)", "Баланың пікірін ескеру 10 жастан бастап міндетті"]
          ],
          uz: [
            ["Fuqarolik huquqi (QR FK)", "14 yoshgacha — kichik yoshdagilar; 14–18 yosh — voyaga yetmaganlar; 18 yoshdan — to‘liq muomala layoqati", "Emansipatsiya 16 yoshdan; huquq layoqati tug‘ilgan paytdan boshlanadi"],
            ["Mehnat huquqi (QR MK)", "Mehnat shartnomasi — 16 yoshdan (ota-ona roziligi bilan 15/14 yoshdan)", "Ish vaqti: 14–16 yosh — haftasiga 24 soat; 16–18 yosh — 36 soat; norma — 40 soat"],
            ["Oila huquqi", "Nikoh yoshi — 18 yosh", "Bolaning fikrini hisobga olish 10 yoshdan majburiy"]
          ]
        }
      },
      untTraps: [
        {
          trap: tr("Путаница между правоспособностью и дееспособностью гражданина", "Азаматтың құқық қабілеттілігі мен әрекет қабілеттілігін шатастыру", "Fuqaroning huquq layoqati va muomala layoqatini adashtirish"),
          whyWrong: tr("В тестах часто утверждают, что правоспособность наступает с 18 лет.", "Тестте құқық қабілеттілік 18 жастан басталады деген дистрактор беріледі.", "Testda huquq layoqati 18 yoshdan boshlanadi degan xato variant beriladi."),
          howToAvoid: tr("Правоспособность (способность ИМЕТЬ права) возникает с момента рождения; полная Дееспособность (способность СВОИМИ ДЕЙСТВИЯМИ осуществлять права) — с 18 лет.", "Құқық қабілеттілік — туған сәттен; толық Әрекет қабілеттілік — 18 жастан басталады.", "Huquq layoqati — tug‘ilgan paytdan; to‘liq Muomala layoqati — 18 yoshdan.")
        }
      ]
    }
  ],
  english: [
    {
      unitId: "eng-unit-1",
      unitNumber: 1,
      subjectId: "english",
      gradeRange: "5–11 сынып · Grammar, Conditionals, Modals, Verbals & Reading",
      colorTheme: "violet",
      title: tr(
        "Справочник Шың-кітап: Грамматика и Лексика Английского языка ЕНТ",
        "Шың-кітап анықтамалығы: ҰБТ Ағылшын тілі грамматикасы мен лексикасы",
        "Shyn-kitap qo‘llanmasi: UNT Ingliz tili grammatikasi va leksikasi"
      ),
      subtitle: tr(
        "Conditionals (0/1/2/3/Mixed), Reported Speech, Passive Voice, Past Modals, Gerund vs Infinitive и инверсия",
        "Conditionals (0/1/2/3/Mixed), Reported Speech, Passive Voice, Past Modals, Gerund vs Infinitive және инверсия",
        "Conditionals (0/1/2/3/Mixed), Reported Speech, Passive Voice, Past Modals, Gerund vs Infinitive va inversiya"
      ),
      goldenRules: [
        {
          title: tr("Алтын ереже: Запрет на will / would после if, when, unless, as soon as", "Алтын ереже: if, when, unless, as soon as-тан кейін will / would қолданбау", "Oltin qoida: if, when, unless, as soon as dan keyin will / would ishlatmaslik"),
          formulaOrRule: tr(
            "В придаточных предложениях условия и времени (после if, unless, when, as soon as, before, after, until) будущее время выражается через Present Simple (Type 1), нереальное настоящее — через Past Simple / were (Type 2), нереальное прошлое — через Past Perfect had + V₃ (Type 3).",
            "Шарт және мезгіл бағыныңқы сөйлемдерде (if, unless, when, as soon as-тан кейін) will / would қолданылмайды: Type 1 → Present Simple; Type 2 → Past Simple (were); Type 3 → Past Perfect (had + V₃).",
            "Shart va payt ergash gaplarda (if, unless, when dan keyin) will / would ishlatilmaydi: Type 1 → Present Simple; Type 2 → Past Simple; Type 3 → Past Perfect."
          ),
          example: tr(
            "If he had studied harder (Past Perfect), he would have passed the exam (would have V₃).",
            "If he had studied harder (Past Perfect), he would have passed the exam (would have V₃).",
            "If he had studied harder, he would have passed the exam."
          )
        }
      ],
      referenceTable: {
        caption: tr("Формулы грамматики Английского языка для ЕНТ (Шың-кітап)", "Шың-кітап: ҰБТ Ағылшын тілі грамматикалық кестесі", "Shyn-kitap: UNT Ingliz tili grammatik jadvali"),
        headers: tr(["Конструкция", "Формула", "Пример / Ловушка ЕНТ"], ["Құрылым", "Формула", "Мысал / ҰБТ тұзағы"], ["Konstruksiya", "Formula", "Misol / UNT tuzog‘i"]),
        rows: {
          ru: [
            ["Conditionals 1 / 2 / 3", "1: If + V₁, will + V₁; 2: If + V₂, would + V₁; 3: If + had V₃, would have V₃", "Mixed: If + had V₃ (прошлое), would + V₁ now (настоящее)"],
            ["Past Modals of Deduction", "must have V₃ (95% да); can't have V₃ (невозможно); might have V₃ (возможно)", "should have V₃ — упрёк/сожаление («следовало сделать, но не сделал»)"],
            ["Gerund vs Infinitive", "enjoy, avoid, suggest, mind, look forward to + V-ing", "После make/let в Active — V₁ (made him go), но в Passive — to V₁ (was made to go!)"]
          ],
          kk: [
            ["Conditionals 1 / 2 / 3", "1: If + V₁, will + V₁; 2: If + V₂, would + V₁; 3: If + had V₃, would have V₃", "Mixed: If + had V₃ (өткен), would + V₁ now (қазіргі)"],
            ["Past Modals of Deduction", "must have V₃ (нақты болды); can't have V₃ (мүмкін емес); might have V₃ (мүмкін)", "should have V₃ — өкініш («істеу керек еді, бірақ істемеді»)"],
            ["Gerund vs Infinitive", "enjoy, avoid, suggest, mind, look forward to + V-ing", "Active-те make/let + V₁ (made him go), ал Passive-те to V₁ (was made to go!)"]
          ],
          uz: [
            ["Conditionals 1 / 2 / 3", "1: If + V₁, will + V₁; 2: If + V₂, would + V₁; 3: If + had V₃, would have V₃", "Mixed: If + had V₃, would + V₁ now"],
            ["Past Modals of Deduction", "must have V₃ (aniq); can't have V₃ (mumkin emas); might have V₃ (ehtimol)", "should have V₃ — afsus («qilish kerak edi»)"],
            ["Gerund vs Infinitive", "enjoy, avoid, suggest, mind, look forward to + V-ing", "Active: make/let + V₁, lekin Passive: was made to go!"]
          ]
        }
      },
      untTraps: [
        {
          trap: tr("Предлог `to` как часть фразового глагола `look forward to`, `be used to`, `object to`", "`look forward to`, `be used to`, `object to` тіркестеріндегі `to` демеулігі", "`look forward to`, `be used to`, `object to` birikmalaridagi `to` predlogi"),
          whyWrong: tr("Ученики видят `to` и автоматически ставят инфинитив `V₁` (`look forward to meet`).", "Оқушылар `to`-ны көріп, инфинитив `V₁` қояды (`look forward to meet`).", "O‘quvchilar `to` ni ko‘rib `V₁` qo‘yishadi."),
          howToAvoid: tr("После `look forward to`, `be/get used to`, `object to` слово `to` — это предлог, поэтому после него ставится ГЕРУНДИЙ (`V-ing`): `look forward to meeting you`!", "Бұл тіркестерде `to` — предлог, сондықтан одан кейін `V-ing` (герундий) келеді: `look forward to meeting you`!", "Bu birikmalarda `to` — predlog, shuning uchun `V-ing` ishlatiladi!")
        }
      ]
    }
  ],
  math_lit: [
    {
      unitId: "ml-unit-1",
      unitNumber: 1,
      subjectId: "math_lit",
      gradeRange: "5–11 сынып · Математикалық сауаттылық (Міндетті пән, 10 сұрақ)",
      colorTheme: "amber",
      title: tr(
        "Справочник Шың-кітап: Математическая грамотность (10/10 баллов ЕНТ)",
        "Шың-кітап анықтамалығы: Математикалық сауаттылық (ҰБТ 10/10 балл)",
        "Shyn-kitap qo‘llanmasi: Matematik savodxonlik (UNT 10/10 ball)"
      ),
      subtitle: tr(
        "Проценты и сплавы, статистика, комбинаторика, движение, формула Пика, круги Эйлера и угол между стрелками часов",
        "Пайыздар мен қоспалар, статистика, комбинаторика, қозғалыс, Пик формуласы, Эйлер дөңгелектері және сағат тілдері",
        "Foizlar va qotishmalar, statistika, kombinatorika, harakat, Pik formulasi, Eyler doiralari va soat millari burchagi"
      ),
      goldenRules: [
        {
          title: tr("Алтын ереже: 4 экспресс-формулы Математической грамотности НЦТ", "Алтын ереже: Математикалық сауаттылықтың 4 жедел формуласы", "Oltin qoida: Matematik savodxonlikning 4 ta tezkor formulasi"),
          formulaOrRule: tr(
            "1) Средняя скорость туда-обратно: v_ср = 2v₁v₂ / (v₁ + v₂) (НЕ полусумма!). 2) Рукопожатия / матчи в 1 круг: N = n(n − 1) / 2. 3) Формула Пика для площади на клетках: S = В + Г/2 − 1 (В — узлы внутри, Г — узлы на границе). 4) Угол между стрелками часов: α = |30·H − 5,5·M|.",
            "1) Орташа жылдамдық: v_орт = 2v₁v₂ / (v₁ + v₂). 2) Қол алысу / 1 айналым ойындары: N = n(n − 1) / 2. 3) Торкөздегі аудан (Пик формуласы): S = І + Ш/2 − 1. 4) Сағат тілдері арасындағы бұрыш: α = |30·H − 5,5·M|.",
            "1) O‘rtacha tezlik: v_o‘rt = 2v₁v₂ / (v₁ + v₂). 2) Qo‘l berib ko‘rishish: N = n(n − 1) / 2. 3) Pik formulasi: S = I + Ch/2 − 1. 4) Soat millari burchagi: α = |30·H − 5,5·M|."
          ),
          example: tr(
            "В 04:20 угол между часовой и минутной стрелками равен |30·4 − 5,5·20| = |120 − 110| = 10°.",
            "Сағат 04:20-да тілдер арасындағы бұрыш: |30·4 − 5,5·20| = |120 − 110| = 10°.",
            "Soat 04:20 da millar orasidagi burchak: |30·4 − 5,5·20| = 10°."
          )
        }
      ],
      referenceTable: {
        caption: tr("Шпаргалка формул Математической грамотности (Шың-кітап)", "Шың-кітап: Математикалық сауаттылық формулалар кестесі", "Shyn-kitap: Matematik savodxonlik formulalar jadvali"),
        headers: tr(["Тип задачи ЕНТ", "Формула", "Пример расчёта"], ["ҰБТ есеп түрі", "Формула", "Есептеу мысалы"], ["UNT masala turi", "Formula", "Hisoblash misoli"]),
        rows: {
          ru: [
            ["Двойное изменение цены (+p%, затем −q%)", "k = (1 + p/100)·(1 − q/100)", "+20% и −20% дают 1,2 · 0,8 = 0,96 (снижение на 4%, а не 0%!)"],
            ["Распилы бревна и этажи", "Кусков = Распилов + 1; Пролётов = Этажей − 1", "9 распилов одного бревна дают 10 поленьев"],
            ["Круги Эйлера-Венна (2 множества)", "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)", "Англ. (18) + Нем. (12) − Оба (5) = 25 учеников"]
          ],
          kk: [
            ["Бағаның екі рет өзгеруі (+p%, сосын −q%)", "k = (1 + p/100)·(1 − q/100)", "+20% және −20% → 1,2 · 0,8 = 0,96 (4%-ға арзандайды!)"],
            ["Бөрене кесу және қабаттар", "Бөлік саны = Кесу + 1; Аралық = Қабат − 1", "1 бөренені 9 рет кессе, 10 бөлік шығады"],
            ["Эйлер-Венн дөңгелектері", "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)", "Ағылш. (18) + Нем. (12) − Екеуі (5) = 25 оқушы"]
          ],
          uz: [
            ["Narxning ikki marta o‘zgarishi (+p%, −q%)", "k = (1 + p/100)·(1 − q/100)", "+20% va −20% → 1,2 · 0,8 = 0,96 (4% ga kamayadi!)"],
            ["Yog‘och arralash va qavatlar", "Bo‘laklar = Kesish + 1", "9 marta arralansa, 10 bo‘lak chiqadi"],
            ["Eyler-Venn doiralari", "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)", "18 + 12 − 5 = 25 o‘quvchi"]
          ]
        }
      },
      untTraps: [
        {
          trap: tr("Средняя скорость как среднее арифметическое (v₁ + v₂)/2", "Орташа жылдамдықты (v₁ + v₂)/2 деп табу", "O‘rtacha tezlikni (v₁ + v₂)/2 deb topish"),
          whyWrong: tr("На более медленном участке тело тратит больше времени, поэтому средняя скорость всегда меньше полусуммы.", "Баяу бөлікте уақыт көп кетеді, сондықтан орташа жылдамдық жарты қосындыдан кіші болады.", "Sekin qismda ko‘p vaqt ketadi."),
          howToAvoid: tr("Всегда делите ВЕСЬ путь на ВСЁ время: v_ср = S_общ / t_общ (а при равных участках пути — 2v₁v₂ / (v₁ + v₂)).", "Әрқашан БАРЛЫҚ жолды БАРЛЫҚ уақытқа бөліңіз: v_орт = S_жалпы / t_жалпы.", "Har doim JAMI yo‘lni JAMI vaqtga bo‘ling.")
        }
      ]
    }
  ],
  reading_lit: [
    {
      unitId: "rl-unit-1",
      unitNumber: 1,
      subjectId: "reading_lit",
      gradeRange: "5–11 сынып · Оқу сауаттылығы (Міндетті пән, 10 сұрақ)",
      colorTheme: "emerald",
      title: tr(
        "Справочник Шың-кітап: Грамотность чтения и Анализ текстов ЕНТ",
        "Шың-кітап анықтамалығы: Оқу сауаттылығы және Мәтін талдау",
        "Shyn-kitap qo‘llanmasi: O‘qish savodxonligi va Matn tahlili"
      ),
      subtitle: tr(
        "Тезис vs деталь, логические связи абзацев, стили и типы речи, тропы и алгоритм отсева дистракторов НЦТ",
        "Тезис пен деталь, абзацтардың логикалық байланысы, стильдер мен мәтін түрлері және дистракторларды сүзу",
        "Tezis va detal, xatboshilarning mantiqiy bog‘lanishi, uslublar va distraktorlarni saralash"
      ),
      goldenRules: [
        {
          title: tr("Алтын ереже: Фильтр категоричных кванторов в ответах НЦТ", "Алтын ереже: ҰБТ жауаптарындағы үзілді-кесілді сөздер сүзгісі", "Oltin qoida: UNT javoblaridagi keskin umumlashtiruvchi so‘zlar filtri"),
          formulaOrRule: tr(
            "Если в варианте ответа стоят слова «всегда», «исключительно только», «абсолютно все», «полностью невозможно», «никогда», а в исходном тексте автор выражался мягче («часто», «как правило», «в большинстве случаев») — этот вариант в 95% случаев является ЛОЖНЫМ дистрактором.",
            "Егер жауап нұсқасында «әрқашан», «тек қана», «мүлдем мүмкін емес», «ешқашан» деген сөздер болса, ал автор мәтінде жұмсақ («жиі», «көбінесе») жазса — бұл нұсқа ҚАТЕ дистрактор.",
            "Agar javob variantida «har doim», «faqatgina», «hech qachon» so‘zlari bo‘lsa-yu, matnda muallif «ko‘pincha» degan bo‘lsa — bu XATO distraktor."
          ),
          example: tr(
            "Верный ответ по Грамотности чтения всегда является точной смысловой перифразой текста (через синонимы без искажения объёма понятия).",
            "Дұрыс жауап әрқашан мәтіндегі ойдың синонимдермен берілген дәл мазмұны болады.",
            "To‘g‘ri javob har doim matndagi fikrning sinonimlar orqali aniq ifodasidir."
          )
        }
      ],
      referenceTable: {
        caption: tr("Типы и стили речи в заданиях Грамотности чтения (Шың-кітап)", "Шың-кітап: Оқу сауаттылығындағы мәтін түрлері мен стильдер", "Shyn-kitap: O‘qish savodxonligidagi matn turlari va uslublar"),
        headers: tr(["Категория", "Главный вопрос / Признак", "Как узнать в ЕНТ"], ["Санат", "Негізгі сұрағы / Белгісі", "ҰБТ-да қалай тануға болады"], ["Toifa", "Asosiy savoli / Belgisi", "UNTda qanday aniqlash mumkin"]),
        rows: {
          ru: [
            ["Повествование / Описание / Рассуждение", "Что произошло? / Каков предмет? / Почему?", "Рассуждение строится по схеме: Тезис → Аргументы (доказательства) → Вывод"],
            ["Научный vs Публицистический стиль", "Точность и термины vs Призыв и оценка", "Научный: объективность, статистика; Публицистический: обращение к обществу, риторические вопросы"],
            ["Логическая связь абзацев", "Причина-следствие, антитеза, иллюстрация", "«Однако / Напротив» — противопоставление; «Следовательно / Поэтому» — вывод"]
          ],
          kk: [
            ["Әңгімелеу / Сипаттау / Пайымдау", "Не болды? / Қандай? / Неліктен?", "Пайымдау құрылымы: Тезис → Дәлелдер (аргументтер) → Қорытынды"],
            ["Ғылыми vs Публицистикалық стиль", "Терминдер мен дәлдік vs Қоғамдық үндеу", "Ғылыми: объективті деректер; Публицистикалық: бағалау, риторикалық сұрақтар"],
            ["Абзацтардың логикалық байланысы", "Себеп-салдар, қарсы қою, мысалмен ашу", "«Алайда / Керісінше» — қарсы қою; «Сондықтан / Демек» — қорытынды"]
          ],
          uz: [
            ["Hikoya / Tasvir / Muhokama", "Nima bo‘ldi? / Qanday? / Nima uchun?", "Muhokama tuzilishi: Tezis → Dalillar → Xulosa"],
            ["Ilmiy vs Publitsistik uslub", "Atamalar va aniqlik vs Jamiyatga murojaat", "Ilmiy: xolislik, statistika; Publitsistik: baholash, ritorik savollar"],
            ["Xatboshilar mantiqiy bog‘lanishi", "Sabab-oqibat, зиддият, misol keltirish", "«Biroq / Aksincha» — qarama-qarshi qo‘yish; «Shuning uchun» — xulosa"]
          ]
        }
      },
      untTraps: [
        {
          trap: tr("Выбор яркого примера из одного абзаца вместо главной мысли всего текста", "Бүкіл мәтіннің негізгі ойының орнына бір абзацтағы жеке мысалды таңдау", "Butun matnning asosiy g‘oyasi o‘rniga bitta xatboshidagi misolni tanlash"),
          whyWrong: tr("Частный пример иллюстрирует только один аргумент, но не охватывает вступление и итоговый вывод автора.", "Жеке мысал тек бір дәлелді ашады, бірақ бүкіл мәтіннің қорытындысын қамтымайды.", "Xususiy misol butun matn xulosasini qamrab olmaydi."),
          howToAvoid: tr("Проверяйте: объединяет ли выбранный вариант первый абзац (постановку проблемы) и последний абзац (вывод автора).", "Таңдалған нұсқа бірінші абзац (мәселе) пен соңғы абзацты (қорытынды) біріктіре ме, соны тексеріңіз.", "Tanlangan variant birinchi va oxirgi xatboshini birlashtirishini tekshiring.")
        }
      ]
    }
  ]
};

export const MATH_SHYN_KITAP_ENRICHMENTS: Record<
  string,
  {
    detailedExplanation: Record<Language, string>;
    extraBlocks: ContentBlock[];
  }
> = {
  linear: {
    detailedExplanation: tr(
      "По методике «Шың-кітап» решение любого линейного уравнения ax = b и сводящихся к нему дробных уравнений строится на трёх шагах: 1) раскрыть скобки и привести к общему знаменателю (указав ОДЗ: знаменатель ≠ 0); 2) перенести слагаемые с переменной влево, а числа вправо со сменой знака; 3) исследовать коэффициент a: при a ≠ 0 корень единственный x = b/a; при a = 0 и b = 0 — бесконечно много корней (x ∈ ℝ); при a = 0 и b ≠ 0 — корней нет (∅).",
      "«Шың-кітап» әдістемесі бойынша ax = b сызықтық теңдеуін шешу 3 қадамнан тұрады: 1) жақшаларды ашып, ортақ бөлімге келтіру (АОО: бөлімі ≠ 0); 2) белгісізі бар мүшелерді солға, бос сандарды оңға таңбасын өзгертіп көшіру; 3) a коэффициентін талдау: a ≠ 0 болса x = b/a жалғыз түбір; a = 0, b = 0 болса шексіз көп шешім (x ∈ ℝ); a = 0, b ≠ 0 болса түбір жоқ (∅).",
      "«Shyn-kitap» metodikasi bo‘yicha ax = b chiziqli tenglamani yechish 3 qadamdan iborat: 1) qavslarni ochish va umumiy maxrajga keltirish (maxraj ≠ 0); 2) noma’lumli hadlarni chapga, sonlarni o‘ngga ishorasini o‘zgartirib o‘tkazish; 3) a ≠ 0 da x = b/a yagona ildiz; a = 0, b = 0 da cheksiz ko‘p yechim; a = 0, b ≠ 0 da yechim yo‘q (∅)."
    ),
    extraBlocks: [
      {
        type: "table",
        title: tr("Шың-кітап: Исследование уравнения ax = b с параметром", "Шың-кітап: ax = b параметрлі теңдеуін зерттеу", "Shyn-kitap: ax = b parametrli tenglamani текshirish"),
        body: tr(
          "1) a ≠ 0 ⇒ единственный корень x = b / a.\n2) a = 0 и b = 0 (0·x = 0) ⇒ x — любое действительное число (∞ решений).\n3) a = 0 и b ≠ 0 (0·x = 5) ⇒ решений нет (x ∈ ∅).\nЛовушка ЕНТ: в уравнении (k² − 4)x = k − 2 при k = 2 получаем 0·x = 0 (бесконечно много корней), а при k = −2 получаем 0·x = −4 (нет корней).",
          "1) a ≠ 0 ⇒ жалғыз түбір x = b / a.\n2) a = 0 және b = 0 (0·x = 0) ⇒ x — кез келген нақты сан (шексіз көп шешім).\n3) a = 0 және b ≠ 0 (0·x = 5) ⇒ шешімі жоқ (x ∈ ∅).\nҰБТ қақпаны: (k² − 4)x = k − 2 теңдеуінде k = 2 болса 0·x = 0 (шексіз шешім), ал k = −2 болса 0·x = −4 (шешім жоқ).",
          "1) a ≠ 0 ⇒ yagona ildiz x = b / a.\n2) a = 0 va b = 0 ⇒ cheksiz ko‘p yechim.\n3) a = 0 va b ≠ 0 ⇒ yechim yo‘q."
        )
      }
    ]
  },
  percent: {
    detailedExplanation: tr(
      "В задачах ЕНТ и «Шың-кітап» на проценты, сплавы и растворы действует закон сохранения массы чистого вещества: m₁·ω₁ + m₂·ω₂ = (m₁ + m₂)·ω_итог. При последовательном изменении величины на +p% и −q% нельзя складывать проценты напрямую: нужно перемножать коэффициенты изменения k = (1 + p/100)·(1 − q/100). При высушивании фруктов/грибов неизменной остаётся масса СУХОГО вещества.",
      "ҰБТ мен «Шың-кітап» пайыз, қоспа және ерітінді есептерінде таза зат массасының сақталу заңы қолданылады: m₁·ω₁ + m₂·ω₂ = (m₁ + m₂)·ω_қорыт. Шама тізбектей +p% және −q%-ға өзгергенде пайыздарды қосуға болмайды: k = (1 + p/100)·(1 − q/100) коэффициенттерін көбейтеміз. Жемістерді кептіру есептерінде ҚҰРҒАҚ заттың массасы өзгеріссіз қалады.",
      "UNT va «Shyn-kitap» foiz va eritma masalalarida sof modda massasining saqlanish qonuni ishlaydi: m₁·ω₁ + m₂·ω₂ = (m₁ + m₂)·ω_yakuniy. Ketma-ket o‘zgarishda k = (1 + p/100)·(1 − q/100) koeffitsiyentlar ko‘paytiriladi."
    ),
    extraBlocks: [
      {
        type: "table",
        title: tr("Шың-кітап: 3 золотые схемы задач на проценты и смеси", "Шың-кітап: Пайыз бен қоспа есептерінің 3 алтын сұлбасы", "Shyn-kitap: Foiz va aralashma masalalarining 3 oltin sxemasi"),
        body: tr(
          "• Смешивание растворов: ω_итог = (m₁ω₁ + m₂ω₂) / (m₁ + m₂).\n• Добавление чистой воды (ω = 0%): m_воды увеличивает только знаменатель.\n• Сложные проценты (вклад/инфляция за n лет): Sₙ = S₀ · (1 + p/100)ⁿ.",
          "• Ерітінділерді араластыру: ω_қорыт = (m₁ω₁ + m₂ω₂) / (m₁ + m₂).\n• Таза су қосу (ω = 0%): су массасы тек бөлімге қосылады.\n• Күрделі пайыз (n жылдағы салым): Sₙ = S₀ · (1 + p/100)ⁿ.",
          "• Eritmalarni aralashtirish: ω_yakuniy = (m₁ω₁ + m₂ω₂) / (m₁ + m₂).\n• Murakkab foiz: Sₙ = S₀ · (1 + p/100)ⁿ."
        )
      }
    ]
  }
};
