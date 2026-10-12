"use client";

import { useState } from "react";
import {
  FileText,
  Landmark,
  MapPin
} from "lucide-react";
import type { Locale } from "@/lib/curriculum";
import { getSubjectShynKitapGuidebook } from "@/lib/universal-curriculum";

function tr(ru: string, kk: string, uz: string): Record<Locale, string> {
  return { ru, kk, uz };
}

export interface HistoryTimelineEra {
  id: string;
  period: Record<Locale, string>;
  title: Record<Locale, string>;
  context: Record<Locale, string>;
  keyEvents: {
    date: string;
    event: Record<Locale, string>;
    significance: Record<Locale, string>;
  }[];
  figures: Record<Locale, string[]>;
  primarySource: {
    title: Record<Locale, string>;
    excerpt: Record<Locale, string>;
  };
  microCheck: {
    prompt: Record<Locale, string>;
    options: Record<Locale, string[]>;
    correctIndex: number;
    explanation: Record<Locale, string>;
  };
}

export interface HistoryMapRegion {
  id: string;
  name: Record<Locale, string>;
  svgCoords: { cx: number; cy: number; labelX: number; labelY: number; path: string };
  tribesAndStates: Record<Locale, string>;
  monuments: Record<Locale, string[]>;
  capitalsAndCities: Record<Locale, string[]>;
  historicalRole: Record<Locale, string>;
  microCheck: {
    prompt: Record<Locale, string>;
    options: Record<Locale, string[]>;
    correctIndex: number;
    explanation: Record<Locale, string>;
  };
}

export interface HistoryEraComparisonRow {
  criterion: Record<Locale, string>;
  kasym: Record<Locale, string>;
  esim: Record<Locale, string>;
  tauke: Record<Locale, string>;
  alash: Record<Locale, string>;
}

export interface HistoryCauseEffectChain {
  id: string;
  period: string;
  cause: Record<Locale, string>;
  event: Record<Locale, string>;
  optionsConsequence: Record<Locale, string[]>;
  correctIndex: number;
  explanation: Record<Locale, string>;
}

export const HISTORY_KZ_TIMELINE_ERAS: HistoryTimelineEra[] = [
  {
    id: "saka_bronze",
    period: tr("I тыс. до н.э. — III в. н.э.", "Б.з.б. I мыңжылдық — б.з. III ғ.", "Mil. avv. I mingyillik — mil. III asr"),
    title: tr("Ранний железный век: саки, уйсуни, кангюи и гунны", "Ерте темір дәуірі: сақтар, үйсіндер, қаңлылар мен ғұндар", "Ilk temir davri: saklar, uysunlar, qang‘lilar va xunnlar"),
    context: tr(
      "Переход к кочевому скотоводству, формирование всаднической культуры и «звериного стиля» в искусстве. Территория Казахстана становится центром ранних государственных объединений.",
      "Көшпелі мал шаруашылығына көшу, салт атты мәдениет пен өнердегі «аң стилінің» қалыптасуы.",
      "Ko‘chmanchi chorvachilikka o‘tish va san’atda «hayvon uslubi»ning shakllanishi."
    ),
    keyEvents: [
      {
        date: "VIII–III вв. до н.э.",
        event: tr("Расселение сакских союзов племён (тиграхауда, парадарайя, хаомаварга)", "Сақ тайпалық одақтарының (тиграхауда, парадарайя, хаомаварга) қоныстануы", "Sak qabilaviy ittifoqlarining joylashuvi"),
        significance: tr("Курганы Иссык («Золотой человек»), Бесшатыр, Берель, Шиликты и Тасмолинская культура.", "Есік («Алтын адам»), Бесшатыр, Берел, Шілікті обалары және Тасмола мәдениеті.", "Issiq («Oltin odam»), Besshatir, Berel va Shilikti qo‘rg‘onlari.")
      },
      {
        date: "530 г. до н.э.",
        event: tr("Отражение саками-массагетами под предводительством царицы Томирис похода Кира II", "Томирис патшайым бастаған массагеттердің ІІ Кир әскерін талқандауы", "Malika Tomiris boshchiligidagi massagetlarning Kir II qo‘shinini тор-mor etishi"),
        significance: tr("Сохранение независимости племён Великой степи от Ахеменидской державы.", "Ұлы дала тайпаларының Ахеменидтер империясынан тәуелсіздігін сақтап қалуы.", "Buyuk dasht qabilalarining Ahamoniylar davlatidan mustaqilligini saqlab qolishi.")
      },
      {
        date: "209 г. до н.э.",
        event: tr("Возвышение державы Хунну (гуннов) при шаньюе Модэ", "Мөде тәңірқұт тұсында Ғұн мемлекетінің күшеюі", "Mode shanyuy davrida Xunn davlatining yuksalishi"),
        significance: tr("Начало Великого переселения народов и военно-десятичной системы управления (24 рода).", "Халықтардың ұлы қоныс аударуының басталуы және ондық әскери жүйе.", "Xalqlarning buyuk ko‘chishi boshlanishi va o‘nlik harbiy tizim.")
      }
    ],
    figures: {
      ru: ["Царица Томирис", "Подвиг Ширака", "Шаньюй Модэ", "Шаньюй Чжичжи", "Кунби уйсуней"],
      kk: ["Томирис патшайым", "Шырақтың ерлігі", "Мөде тәңірқұт", "Шөже (Чжичжи) тәңірқұт", "Үйсін күнбиі"],
      uz: ["Malika Tomiris", "Shiroq jasorati", "Mode shanyuy", "Chjichji shanyuy", "Uysun kunbiyi"]
    },
    primarySource: {
      title: tr("Бехистунская надпись Дария I и «История» Геродота", "І Дарийдің Бехистун жазбасы және Геродоттың «Тарихы»", "Doro I ning Behistun yozuvi va Gerodotning «Tarix» asari"),
      excerpt: tr(
        "Древнеперсидские клинописные источники называют саков «могучими мужами» и выделяют три группы: тиграхауда (в остроконечных шапках — Жетысу), парадарайя (заморские — Приаралье) и хаомаварга (долина Мургаба).",
        "Ежелгі парсы сына жазуларында сақтар «құдіретті ерлер» деп аталып, үш топқа бөлінеді: тиграхауда (Жетісу), парадарайя (Арал маңы) және хаомаварга.",
        "Qadimgi fors manbalarida saklar uch guruhga ajratiladi: tigraxauda (Jetisuv), paradarayya (Orolbo‘yi) va xaomavarga."
      )
    },
    microCheck: {
      prompt: tr(
        "К какой группе сакских племён относится памятник Иссыкский курган («Золотой человек») в Жетысу?",
        "Жетісудағы Есік обасы («Алтын адам») сақ тайпаларының қай тобына жатады?",
        "Jetisuvdagi Issiq qo‘rg‘oni («Oltin odam») sak qabilalarining qaysi guruhiga mansub?"
      ),
      options: {
        ru: ["Саки-тиграхауда", "Саки-парадарайя", "Саки-хаомаварга", "Аргиппеи"],
        kk: ["Сақ-тиграхаудалар", "Сақ-парадарайялар", "Сақ-хаомаваргалар", "Аргиппейлер"],
        uz: ["Sak-tigraxauda", "Sak-paradarayya", "Sak-xaomavarga", "Argippeylar"]
      },
      correctIndex: 0,
      explanation: tr(
        "Саки-тиграхауда («носящие остроконечные шапки») населяли Жетысу и предгорья Тянь-Шаня, где расположен курган Иссык.",
        "Сақ-тиграхаудалар («шошақ бөріктілер») Жетісу мен Тянь-Шань баурайын мекендеген.",
        "Sak-tigraxauda Jetisuv va Tyan-Shan etaklarida yashagan."
      )
    }
  },
  {
    id: "turkic_golden_horde",
    period: tr("VI–XV вв. (552–1465 гг.)", "VI–XV ғғ. (552–1465 жж.)", "VI–XV asrlar (552–1465-y.)"),
    title: tr("Тюркские каганаты, Караханиды и Улус Джучи (Ак-Орда)", "Түрік қағанаттары, Қарахан мемлекеті және Жошы ұлысы (Ақ Орда)", "ido-Turkiy xoqonliklar, Qoraxoniylar va Jo‘ji ulusi (Oq O‘rda)"),
    context: tr(
      "От основания Тюркского каганата Бумын-каганом (552 г.) и Атлаxской битвы (751 г.) до расцвета городской культуры Великого Шёлкового пути (Отрар, Туркестан, Сыгнак, Тараз) и становления Ак-Орды как прямой политической предшественницы Казахского ханства.",
      "Бумын қаған негізін қалаған Түрік қағанатынан (552 ж.) бастап, Атлах шайқасы (751 ж.), Қарахан дәуірі мен Қазақ хандығының тікелей ізашары — Ақ Орданың нығаюы.",
      "Bumin xoqon asos solgan Turkiy xoqonlikdan (552-y.) Atlax jangi (751-y.), Qoraxoniylar davri va Oq O‘rdaning shakllanishigacha."
    ),
    keyEvents: [
      {
        date: "552 г. / 603 г.",
        event: tr("Образование Тюркского каганата (Бумын) и распад на Западно-Тюркский (столица Суяб) и Восточно-Тюркский каганаты", "Түрік қағанатының құрылуы (552 ж.) және Батыс Түрік қағанатының (астанасы Суяб) бөлінуі (603 ж.)", "Turkiy xoqonlikning tashkil topishi (552-y.) va G‘arbiy Turkiy xoqonlikka bo‘linishi (603-y.)"),
        significance: tr("Утверждение тюркской государственности и письменности (Орхоно-Енисейские памятники в честь Кюль-тегина и Бильге-кагана).", "Түркі мемлекеттілігі мен Орхон-Енисей руникалық жазуының орнығуы.", "Turkiy davlatchilik va Orxon-Yenisey yozuvining qaror topishi.")
      },
      {
        date: "751 г. / 960 г.",
        event: tr("Атлахская (Таласская) битва при поддержке карлуков и объявление ислама государственной религией Караханидов (Муса-каган, 960 г.)", "Атлах (Талас) шайқасы (751 ж.) және Қарахан мемлекетінде исламның мемлекеттік дін болып жариялануы (960 ж.)", "Atlax (Talas) jangi (751-y.) va Qoraxoniylar davlatida islomning davlat dini deb e’lon qilinishi (960-y.)"),
        significance: tr("Ренессанс науки и литературы: Аль-Фараби (Отрар), Юсуф Баласагуни («Кутадгу билиг»), Махмуд Кашгари («Дивани лугат ат-турк»), Ходжа Ахмед Ясави.", "Ғылым мен мәдениеттің өрлеуі: Әл-Фараби, Жүсіп Баласағұн, Махмұд Қашқари, Қожа Ахмет Ясауи.", "Ilm-fan uyg‘onishi: Al-Farobiy, Yusuf Xos Hojib, Mahmud Koshg‘ariy, Ahmad Yassaviy.")
      },
      {
        date: "XIV в. (Урус-хан)",
        event: tr("Укрепление Ак-Орды (столица Сыгнак) при хане Урусе в Восточном Дешт-и-Кипчаке", "Шығыс Дешті Қыпшақта Ұрыс хан тұсында Ақ Орданың (астанасы Сығанақ) тәуелсіздігінің нығаюы", "Urus xon davrida Oq O‘rdaning (poytaxti Sig‘noq) mustahkamlanishi"),
        significance: tr("Ак-Орда объединила племена, составившие этническую и политическую основу Казахского ханства; Урус-хан — предок Керея и Жанибека.", "Ақ Орда Қазақ хандығының тікелей саяси және этникалық негізі болды.", "Oq O‘rda Qozoq xonligining bevosita siyosiy asosiga aylandi.")
      }
    ],
    figures: {
      ru: ["Бумын-каган", "Сулук-каган (Тюргеши)", "Абу Наср аль-Фараби", "Юсуф Баласагуни", "Хан Урус (Ак-Орда)"],
      kk: ["Бумын қаған", "Сұлу қаған (Түргештер)", "Әбу Насыр әл-Фараби", "Жүсіп Баласағұн", "Ұрыс хан (Ақ Орда)"],
      uz: ["Bumin xoqon", "Sulu xoqon", "Abu Nasr al-Farobiy", "Yusuf Xos Hojib", "Urus xon (Oq O‘rda)"]
    },
    primarySource: {
      title: tr("«Кутадгу билиг» («Благодатное знание», XI в.) Юсуфа Баласагуни", "Жүсіп Баласағұнның «Құтты білік» дастаны (XI ғ.)", "Yusuf Xos Hojibning «Qutadg‘u bilig» asari (XI asr)"),
      excerpt: tr(
        "Первое энциклопедическое произведение на тюркском языке о справедливом государственном управлении, законе и ценности научного знания, преподнесённое правителю Караханидов в Кашгаре.",
        "Түркі тіліндегі әділ мемлекеттік басқару, заң үстемдігі және білім құндылығы туралы алғашқы энциклопедиялық еңбек.",
        "Turkiy tildagi adolatli davlat boshqaruvi, qonun va ilm qadri haqidagi ilk qomusiy asar."
      )
    },
    microCheck: {
      prompt: tr(
        "Какой город был столицей Ак-Орды при хане Урусе и главным торгово-политическим центром низовьев Сырдарьи?",
        "Ұрыс хан тұсында Ақ Орданың астанасы және Сырдария бойындағы басты саяси орталық болған қала:",
        "Urus xon davrida Oq O‘rda poytaxti bo‘lgan Sirdaryo bo‘yidagi shahar:"
      ),
      options: {
        ru: ["Сыгнак", "Суяб", "Сарай-Бату", "Оренбург"],
        kk: ["Сығанақ", "Суяб", "Сарай-Бату", "Орынбор"],
        uz: ["Sig‘noq", "Suyob", "Saroy-Botu", "Orenburg"]
      },
      correctIndex: 0,
      explanation: tr(
        "Столицей Ак-Орды (и позднее центром борьбы за присырдарьинские города) был город Сыгнак («гавань Дешт-и-Кипчака»).",
        "Ақ Орданың астанасы Сығанақ қаласы («Дешті Қыпшақтың порты») болды.",
        "Oq O‘rdaning poytaxti Sig‘noq shahri bo‘lgan."
      )
    }
  },
  {
    id: "kazakh_khanate",
    period: tr("1465 г. — начало XVIII в.", "1465 ж. — XVIII ғ. басы", "1465-y. — XVIII asr boshi"),
    title: tr("Казахское ханство: от основания до «Жеті жарғы»", "Қазақ хандығы: құрылуынан «Жеті жарғыға» дейін", "Qozoq xonligi: tashkil topishidan «Jeti jarg‘i»gacha"),
    context: tr(
      "Откочёвка султанов Керея и Жанибека из ханства Абулхаира в Западное Жетысу (Козыбасы, 1465 г.) положила начало Казахскому ханству. При Касыме, Хакназаре, Тауекеле, Есиме и Тауке сформировались единая этническая территория и три великих свода обычного права.",
      "Керей мен Жәнібек сұлтандардың Әбілқайыр хандығынан Батыс Жетісуға (Қозыбасы, 1465 ж.) көшуі Қазақ хандығының бастауы болды.",
      "Kerey va Janibek sultonlarning G‘arbiy Jetisuvga (Qo‘ziboshi, 1465-y.) ko‘chishi Qozoq xonligiga asos soldi."
    ),
    keyEvents: [
      {
        date: "1465–1466 гг.",
        event: tr("Основание Казахского ханства Кереем и Жанибеком в долине Чу и урочище Козыбасы", "Керей мен Жәнібектің Шу мен Қозыбасыда Қазақ хандығын құруы", "Kerey va Janibek tomonidan Chu va Qo‘ziboshida Qozoq xonligining tuzilishi"),
        significance: tr("Правитель Могулистана Есен-Буга выделил земли в Западном Жетысу для укрепления границ.", "Моғолстан ханы Есен-бұға Батыс Жетісудан жер берді.", "Mo‘g‘uliston xoni Esen-bug‘a G‘arbiy Jetisuvdan yer ajratdi.")
      },
      {
        date: "1511–1521 гг.",
        event: tr("Расцвет при Касым-хане: население достигло 1 млн человек, свод «Қасым ханның қасқа жолы»", "Қасым хан тұсындағы өрлеу: халық саны 1 млн-ға жетті, «Қасым ханның қасқа жолы»", "Qosim xon davrida yuksalish: aholi 1 mln kishiga yetdi, «Qosim xonning qasqa yo‘li»"),
        significance: tr("Столица перенесена в Сыгнак и Туркестан; ханство стало известно в Европе (записки Сигизмунда Герберштейна).", "Хандықтың шекарасы кеңейіп, Батыс Еуропаға танылды.", "Xonlik hududi kengayib, Yevropaga tanildi.")
      },
      {
        date: "1643 г. / 1680–1715 гг.",
        event: tr("Орбулакская битва (Жангир-хан, 600 воинов против 50 тыс. джунгар) и правление Тауке-хана («Жеті жарғы»)", "Орбұлақ шайқасы (1643 ж., Жәңгір хан) және Тәуке ханның билігі (1680–1715 жж., «Жеті жарғы»)", "Orbulak jangi (1643-y., Jangir xon) va Tauke xon davri («Jeti jarg‘i»)"),
        significance: tr("Укрепление единства трёх жузов при участии биев Толе би (Старший жуз), Казыбек би (Средний жуз) и Айтеке би (Младший жуз).", "Төле би, Қазыбек би және Әйтеке бидің қатысуымен үш жүздің бірлігі нығайды.", "Tole biy, Qazibek biy va Ayteke biy ishtirokida uch juz birligi mustahkamlandi.")
      }
    ],
    figures: {
      ru: ["Керей-хан и Жанибек-хан", "Бурундук-хан", "Касым-хан", "Хакназар-хан", "Есим-хан", "Жангир-хан", "Тауке-хан"],
      kk: ["Керей хан мен Жәнібек хан", "Бұрындық хан", "Қасым хан", "Хақназар хан", "Есім хан", "Жәңгір хан", "Тәуке хан"],
      uz: ["Kerey xon va Janibek xon", "Burunduq xon", "Qosim xon", "Haqnazar xon", "Yesim xon", "Jangir xon", "Tauke xon"]
    },
    primarySource: {
      title: tr("«Тарих-и Рашиди» Мухаммеда Хайдара Дулати (XVI в.)", "Мұхаммед Хайдар Дулатидің «Тарих-и Рашиди» еңбегі (XVI ғ.)", "Muhammad Haydar Dulatiyning «Tarixi Rashidiy» asari (XVI asr)"),
      excerpt: tr(
        "«В 870 году хиджры (1465–1466 гг.) власть султанов Гирея и Джанибека окрепла в Козыбасы... После смерти Шайбани-хана у Касым-хана было более миллиона подданных и триста тысяч войска».",
        "«870 хиджра жылында (1465–1466 жж.) Керей мен Жәнібек сұлтандардың билігі Қозыбасыда нығайды... Қасым ханның қол астында миллионнан астам халық болды».",
        "«870-hijriy yilda (1465–1466-y.) Kerey va Janibek sultonlar hokimiyati Qo‘ziboshida mustahkamlandi...»"
      )
    },
    microCheck: {
      prompt: tr(
        "В каком труде впервые указана дата образования Казахского ханства (870 год хиджры / 1465–1466 гг.) и место Козыбасы?",
        "Қазақ хандығының құрылған жылы (870 хиджра / 1465–1466 жж.) мен Қозыбасы орны алғаш рет қай еңбекте жазылған?",
        "Qozoq xonligi tashkil topgan sana (1465–1466-y.) va Qo‘ziboshi joyi ilk bor qaysi asarda keltirilgan?"
      ),
      options: {
        ru: [
          "«Тарих-и Рашиди» Мухаммеда Хайдара Дулати",
          "«Жами ат-таварих» Кадыргали Жалаири",
          "«Кутадгу билиг» Юсуфа Баласагуни",
          "«Дивани лугат ат-турк» Махмуда Кашгари"
        ],
        kk: [
          "Мұхаммед Хайдар Дулатидің «Тарих-и Рашиди» еңбегі",
          "Қадырғали Жалайыридің «Жамиғ ат-тауарих» жинағы",
          "Жүсіп Баласағұнның «Құтты білік» дастаны",
          "Махмұд Қашқаридің «Диуани лұғат ат-түрк» сөздігі"
        ],
        uz: [
          "Muhammad Haydar Dulatiyning «Tarixi Rashidiy» asari",
          "Qodirg‘ali Jaloiriyning «Jome at-tavorix» asari",
          "Yusuf Xos Hojibning «Qutadg‘u bilig» asari",
          "Mahmud Koshg‘ariyning «Devonu lug‘otit turk» asari"
        ]
      },
      correctIndex: 0,
      explanation: tr(
        "Именно в «Тарих-и Рашиди» М.Х. Дулати приводит дату 870 г. хиджры (1465–1466 гг.) и местность Чу и Козыбасы.",
        "М.Х. Дулати «Тарих-и Рашиди» еңбегінде 870 хиджра жылын (1465–1466 жж.) және Шу мен Қозыбасы өңірін көрсеткен.",
        "M.X. Dulatiy «Tarixi Rashidiy» asarida 1465–1466-yillar va Qo‘ziboshi hududini ko‘rsatgan."
      )
    }
  },
  {
    id: "liberation_alash",
    period: tr("XVIII в. — 1917–1920 гг.", "XVIII ғ. — 1917–1920 жж.", "XVIII asr — 1917–1920-y."),
    title: tr("Отражение джунгарского нашествия, восстания и движение «Алаш»", "Жоңғар шапқыншылығына қарсы күрес, көтерілістер және «Алаш» қозғалысы", "Jung‘or bosqiniga qarshi kurash, qo‘zg‘olonlar va «Alash» harakati"),
    context: tr(
      "Победы ополчения трёх жузов в Булантинской (1728 г.) и Аныракайской (1729/1730 г.) битвах, дипломатия Абылай-хана, национально-освободительные восстания Сырыма Датулы, Исатая и Махамбета, Кенесары Касымулы (1837–1847 гг.), восстание 1916 года и создание партии «Алаш» и правительства Алаш-Орда (1917 г.).",
      "Бұланты (1728 ж.) мен Аңырақай (1729/1730 ж.) шайқастарындағы жеңістер, Абылай хан саясаты, Кенесары Қасымұлы көтерілісі (1837–1847 жж.) және 1917 жылғы «Алаш» партиясы мен Алашорда үкіметі.",
      "Bulanti (1728-y.) va Aniraqay (1729/1730-y.) janglaridagi g‘alabalar, Abilay xon diplomatiyasi, Kenesari Qosimuli qo‘zg‘oloni (1837–1847-y.) hamda 1917-yildagi «Alash» partiyasi."
    ),
    keyEvents: [
      {
        date: "1728 г. / 1729–1730 гг.",
        event: tr("Победы казахского ополчения (Абулхаир-хан, Богенбай, Кабанбай, Наурызбай) в Булантинской и Аныракайской битвах", "Бұланты (1728 ж.) және Аңырақай (1729–1730 жж.) шайқастарындағы қазақ жасақтарының жеңісі", "Bulanti (1728-y.) va Aniraqay (1729–1730-y.) janglaridagi g‘alabalar"),
        significance: tr("Перелом в войне против Джунгарского ханства после «Годов Великого бедствия» («Ақтабан шұбырынды», 1723–1727 гг.).", "«Ақтабан шұбырынды, Алқакөл сұламадан» кейін жоңғарларға қарсы соғыста түбегейлі бетбұрыс жасалды.", "Jung‘orlarga qarshi urushda tub burilish yasaldi.")
      },
      {
        date: "1837–1847 гг.",
        event: tr("Национально-освободительное восстание под предводительством хана Кенесары Касымулы (охватило все три жуза)", "Кенесары Қасымұлы бастаған ұлт-азаттық көтеріліс (үш жүзді түгел қамтыды)", "Kenesari Qosimuli boshchiligidagi milliy-ozodlik qo‘zg‘oloni"),
        significance: tr("В 1841 году Кенесары избран ханом, восстановлены ханский совет и суд биев.", "1841 жылы Кенесары хан сайланып, хандық мемлекеттілік қалпына келтірілді.", "1841-yilda Kenesari xon etib saylandi.")
      },
      {
        date: "Июль / Декабрь 1917 г.",
        event: tr("I Всеказахский съезд (оформление партии «Алаш») и II Всеказахский съезд в Оренбурге (образование правительства Алаш-Орда во главе с А. Букейхановым)", "Орынбордағы І және ІІ жалпықазақ съездері: «Алаш» партиясы мен Ә. Бөкейханов бастаған Алашорда үкіметінің құрылуы", "Orenburgdagi I va II umumqozoq syezdlari: «Alash» partiyasi va A. Bukeyxanov boshchiligidagi Alash-O‘rda"),
        significance: tr("Курс на национально-территориальную автономию, демократическую республику, просвещение и сохранение земель.", "Ұлттық-аумақтық автономия, жерді сақтау және демократиялық мемлекет құру бағдарламасы.", "Milliy-hududiy avtonomiya va demokratik davlat dasturi.")
      }
    ],
    figures: {
      ru: ["Абылай-хан", "Кенесары Касымулы", "Шокан Уалиханов", "Ыбырай Алтынсарин", "Абай Кунанбайулы", "Алихан Букейханов", "Ахмет Байтурсынов", "Мырзакулы (Міржақып) Дулатов"],
      kk: ["Абылай хан", "Кенесары Қасымұлы", "Шоқан Уәлиханов", "Ыбырай Алтынсарин", "Абай Құнанбайұлы", "Әлихан Бөкейханов", "Ахмет Байтұрсынұлы", "Міржақып Дулатұлы"],
      uz: ["Abilay xon", "Kenesari Qosimuli", "Shoqan Ualixanov", "Ibiray Altinsarin", "Abay Qunanboyuli", "Alixon Bukeyxanov", "Axmet Baytursinov", "Mirjaqip Dulatov"]
    },
    primarySource: {
      title: tr("Газета «Қазақ» (1913–1918 гг., Оренбург) и проект программы партии «Алаш»", "«Қазақ» газеті (1913–1918 жж., Орынбор) және «Алаш» партиясы бағдарламасының жобасы", "«Qazaq» gazetasi (1913–1918-y., Orenburg) va «Alash» partiyasi dasturi"),
      excerpt: tr(
        "Редактор газеты «Қазақ» — Ахмет Байтурсынов. Проект программы партии «Алаш» из 10 разделов провозглашал демократическую федеративную республику, равенство граждан, отделение религии от государства и бесплатное обучение на родном языке.",
        "«Қазақ» газетінің редакторы — Ахмет Байтұрсынұлы. 10 бөлімнен тұратын «Алаш» бағдарламасы демократиялық республика мен ана тілінде білім алуды жариялады.",
        "«Qazaq» gazetasi muharriri — Axmet Baytursinov. «Alash» dasturi 10 bo‘limdan iborat bo‘lib, demokratik respublikani e’lon qilgan."
      )
    },
    microCheck: {
      prompt: tr(
        "Кто был главным редактором общенациональной газеты «Қазақ», издававшейся в Оренбурге с 1913 года?",
        "1913 жылдан бастап Орынборда шыққан жалпыұлттық «Қазақ» газетінің бас редакторы кім болды?",
        "1913-yildan Orenburgda nashr etilgan «Qazaq» gazetasining bosh muharriri kim bo‘lgan?"
      ),
      options: {
        ru: ["Ахмет Байтурсынов", "Мухамеджан Тынышпаев", "Турар Рыскулов", "Жангир Букеев"],
        kk: ["Ахмет Байтұрсынұлы", "Мұхамеджан Тынышпаев", "Тұрар Рысқұлов", "Жәңгір Бөкейұлы"],
        uz: ["Axmet Baytursinov", "Muxamedjan Tinishpayev", "Turar Risqulov", "Jangir Bukeyev"]
      },
      correctIndex: 0,
      explanation: tr(
        "Главным редактором газеты «Қазақ» (Оренбург, 1913–1918 гг.) был просветитель и реформатор казахской письменности Ахмет Байтурсынов.",
        "«Қазақ» газетінің бас редакторы — қазақ тіл білімі мен әліпбиінің реформаторы Ахмет Байтұрсынұлы.",
        "«Qazaq» gazetasi bosh muharriri — Axmet Baytursinov bo‘lgan."
      )
    }
  },
  {
    id: "modern_independence",
    period: tr("1986–1995 гг. и современность", "1986–1995 жж. және қазіргі кезең", "1986–1995-y. va hozirgi davr"),
    title: tr("Декабрьские события 1986 г. и становление Независимого Казахстана", "1986 ж. Желтоқсан оқиғасы және Тәуелсіз Қазақстанның қалыптасуы", "1986-yil Dekabr voqealari va Mustaqil Qozog‘istonning qaror topishi"),
    context: tr(
      "От выступления молодёжи в декабре 1986 года и закрытия Семипалатинского ядерного полигона (29.08.1991) до принятия Конституционного закона о государственной независимости РК (16.12.1991), вступления в ООН (02.03.1992), введения тенге (15.11.1993) и Конституции РК (30.08.1995).",
      "1986 жылғы Желтоқсан қозғалысынан және Семей полигонының жабылуынан (29.08.1991) ҚР Тәуелсіздік заңына (16.12.1991), БҰҰ-ға кіруге (02.03.1992), теңгеге (15.11.1993) және ҚР Конституциясына (30.08.1995) дейін.",
      "1986-yil Dekabr voqealari va Semipalatinsk poligonining yopilishidan (29.08.1991) Mustaqillik qonuni (16.12.1991), BMTga a’zolik (02.03.1992), tenge (15.11.1993) va Konstitutsiyagacha (30.08.1995)."
    ),
    keyEvents: [
      {
        date: "25 октября 1990 г. / 29 августа 1991 г.",
        event: tr("Декларация о государственном суверенитете (25.10.1990) и закрытие Семипалатинского испытательного ядерного полигона (29.08.1991)", "Мемлекеттік егемендік туралы декларация (25.10.1990) және Семей ядролық сынақ полигонының жабылуы (29.08.1991)", "Davlat suvereniteti deklaratsiyasi (25.10.1990) va Semipalatinsk yadro poligonining yopilishi (29.08.1991)"),
        significance: tr("Закрепление верховенства законов республики и антиядерная инициатива международного масштаба (движение «Невада — Семипалатинск» во главе с О. Сулейменовым).", "Республика заңдарының үстемдігі және О. Сүлейменов бастаған «Невада — Семей» қозғалысының жеңісі.", "Respublika suvereniteti va «Nevada — Semipalatinsk» harakati.")
      },
      {
        date: "16 декабря 1991 г. / 2 марта 1992 г.",
        event: tr("Конституционный закон «О государственной независимости РК» (16.12.1991) и вступление Казахстана в ООН (02.03.1992)", "«ҚР мемлекеттік тәуелсіздігі туралы» Конституциялық заң (16.12.1991) және БҰҰ-ға мүше болу (02.03.1992)", "«QR davlat mustaqilligi to‘g‘risida»gi Konstitutsiyaviy qonun (16.12.1991) va BMTga a’zolik (02.03.1992)"),
        significance: tr("Международно-правовое признание суверенного государства; 4 июня 1992 г. утверждены Государственные символы РК.", "Егемен мемлекеттің халықаралық мойындалуы; 1992 ж. 4 маусымда ҚР Мемлекеттік рәміздері бекітілді.", "Mustaqil davlatning xalqaro tan olinishi; 1992-yil 4-iyunda davlat ramzlari tasdiqlandi.")
      },
      {
        date: "15 ноября 1993 г. / 30 августа 1995 г.",
        event: tr("Введение национальной валюты — тенге (15.11.1993) и принятие действующей Конституции РК на всенародном референдуме (30.08.1995)", "Ұлттық валюта — теңгенің енгізілуі (15.11.1993) және бүкілхалықтық референдумда ҚР Конституциясының қабылдануы (30.08.1995)", "Milliy valyuta — tengening kiritilishi (15.11.1993) va referendumda QR Konstitutsiyasining qabul qilinishi (30.08.1995)"),
        significance: tr("Формирование финансовой самостоятельности и конституционных основ Республики Казахстан.", "Қаржылық дербестік пен ҚР конституциялық негіздерінің бекітілуі.", "Moliyaviy mustaqillik va konstitutsiyaviy asoslarning mustahkamlanishi.")
      }
    ],
    figures: {
      ru: ["Кайрат Рыскулбеков (Халык Кахарманы)", "Олжас Сулейменов («Невада — Семипалатинск»)", "Токтар Аубакиров (первый космонавт, 02.10.1991)", "Талгат Мусабаев", "Шафик Чокин"],
      kk: ["Қайрат Рысқұлбеков (Халық Қаһарманы)", "Олжас Сүлейменов («Невада — Семей»)", "Тоқтар Әубәкіров (тұңғыш ғарышкер, 02.10.1991)", "Талғат Мұсабаев", "Шапық Шөкин"],
      uz: ["Qayrat Risqulbekov", "Oljas Suleymenov («Nevada — Semipalatinsk»)", "Toqtar Aubakirov (1991-y.)", "Talg‘at Musabayev", "Shafik Chokin"]
    },
    primarySource: {
      title: tr("Конституционный закон «О государственной независимости Республики Казахстан» (16 декабря 1991 г.)", "«Қазақстан Республикасының мемлекеттік тәуелсіздігі туралы» Конституциялық заң (1991 ж. 16 желтоқсан)", "«Qozog‘iston Respublikasining davlat mustaqilligi to‘g‘risida»gi Konstitutsiyaviy qonun (1991-yil 16-dekabr)"),
      excerpt: tr(
        "Статья 1: «Республика Казахстан — независимое, демократическое и правовое государство. Она обладает всей полнотой власти на своей территории, самостоятельно определяет и проводит внутреннюю и внешнюю политику».",
        "1-бап: «Қазақстан Республикасы — тәуелсіз, демократиялық және құқықтық мемлекет. Ол өз аумағында биліктің толық иесі болып табылады».",
        "1-modda: «Qozog‘iston Respublikasi — mustaqil, demokratik va huquqiy davlatdir»."
      )
    },
    microCheck: {
      prompt: tr(
        "Укажите точную хронологическую последовательность событий Независимого Казахстана:",
        "Тәуелсіз Қазақстан оқиғаларының дәл хронологиялық ретін көрсетіңіз:",
        "Mustaqil Qozog‘iston voqealarining aniq xronologik tartibini ko‘rsating:"
      ),
      options: {
        ru: [
          "Декларация о суверенитете (1990) → Закон о Независимости (1991) → Вступление в ООН (1992) → Введение тенге (1993)",
          "Закон о Независимости (1991) → Введение тенге (1992) → Вступление в ООН (1993) → Конституция (1995)",
          "Вступление в ООН (1991) → Декларация о суверенитете (1992) → Введение тенге (1993)",
          "Декларация о суверенитете (1990) → Введение тенге (1991) → Закон о Независимости (1992)"
        ],
        kk: [
          "Егемендік декларациясы (1990) → Тәуелсіздік заңы (1991) → БҰҰ-ға кіру (1992) → Теңгенің енгізілуі (1993)",
          "Тәуелсіздік заңы (1991) → Теңгенің енгізілуі (1992) → БҰҰ-ға кіру (1993)",
          "БҰҰ-ға кіру (1991) → Егемендік декларациясы (1992) → Теңге (1993)",
          "Егемендік декларациясы (1990) → Теңге (1991) → Тәуелсіздік заңы (1992)"
        ],
        uz: [
          "Suverenitet deklaratsiyasi (1990) → Mustaqillik qonuni (1991) → BMTga a’zolik (1992) → Tenge (1993)",
          "Mustaqillik qonuni (1991) → Tenge (1992) → BMTga a’zolik (1993)",
          "BMTga a’zolik (1991) → Deklaratsiya (1992) → Tenge (1993)",
          "Deklaratsiya (1990) → Tenge (1991) → Mustaqillik qonuni (1992)"
        ]
      },
      correctIndex: 0,
      explanation: tr(
        "25 октября 1990 г. (Декларация) → 16 декабря 1991 г. (Независимость) → 2 марта 1992 г. (ООН) → 15 ноября 1993 г. (Тенге).",
        "25.10.1990 (Декларация) → 16.12.1991 (Тәуелсіздік) → 02.03.1992 (БҰҰ) → 15.11.1993 (Теңге).",
        "25.10.1990 (Deklaratsiya) → 16.12.1991 (Mustaqillik) → 02.03.1992 (BMT) → 15.11.1993 (Tenge)."
      )
    }
  }
];

export const HISTORY_KZ_MAP_REGIONS: HistoryMapRegion[] = [
  {
    id: "zhetysu",
    name: tr("Жетысу (Семиречье) и Юг", "Жетісу және Оңтүстік өңір", "Jetisuv va Janubiy hudud"),
    svgCoords: {
      cx: 410,
      cy: 195,
      labelX: 410,
      labelY: 225,
      path: "M 330 165 L 485 155 L 500 220 L 345 230 Z"
    },
    tribesAndStates: tr(
      "Саки-тиграхауда, Уйсуни (столица Чигучен), Западно-Тюркский и Тюргешский каганаты, Карлуки, Караханиды, Могулистан, основание Казахского ханства (Козыбасы, 1465 г.), Старший жуз.",
      "Сақ-тиграхаудалар, Үйсіндер (Чигучен), Батыс Түрік және Түргеш қағанаттары, Қарахан мемлекеті, Моғолстан, Қазақ хандығының құрылған жері (Қозыбасы, 1465 ж.), Ұлы жүз.",
      "Sak-tigraxauda, Uysunlar, G‘arbiy Turkiy xoqonlik, Qoraxoniylar, Qozoq xonligi tashkil topgan hudud (Qo‘ziboshi, 1465-y.)."
    ),
    monuments: {
      ru: ["Курган Иссык («Золотой человек»)", "Царские курганы Бесшатыр (долина р. Или)", "Петроглифы Тамгалы", "Мавзолей Айша-Биби (Тараз)"],
      kk: ["Есік обасы («Алтын адам»)", "Бесшатыр патша қорғандары (Іле аңғары)", "Таңбалы петроглифтері", "Айша бибі кесенесі (Тараз)"],
      uz: ["Issiq qo‘rg‘oni («Oltin odam»)", "Besshatir qo‘rg‘onlari", "Tamg‘ali petrogliflari", "Oysha Bibi maqbarasi"]
    },
    capitalsAndCities: {
      ru: ["Суяб", "Баласагун", "Тараз", "Козыбасы (долина Чу)", "Алматы (столица 1929–1997 гг.)"],
      kk: ["Суяб", "Баласағұн", "Тараз", "Қозыбасы (Шу аңғары)", "Алматы (1929–1997 жж. астана)"],
      uz: ["Suyob", "Balasag‘un", "Taroz", "Qo‘ziboshi", "Olmaota (1929–1997-y. poytaxt)"]
    },
    historicalRole: tr(
      "Колыбель образования Казахского ханства (1465 г.), ключевой участок Великого Шёлкового пути и место Орбулакской (1643 г.) и Аныракайской (1729/1730 г.) битв.",
      "Қазақ хандығының алтын бесігі (1465 ж.), Ұлы Жібек жолының өзегі және Орбұлақ (1643 ж.) пен Аңырақай (1729/1730 ж.) шайқастары өткен өңір.",
      "Qozoq xonligi beshigi (1465-y.), Buyuk Ipak yo‘li markazi hamda Orbulak (1643-y.) va Aniraqay janglari hududi."
    ),
    microCheck: {
      prompt: tr(
        "Какое событие произошло в Западном Жетысу (долина Чу и Козыбасы) в 1465 году?",
        "1465 жылы Батыс Жетісуда (Шу мен Қозыбасы) қандай тарихи оқиға болды?",
        "1465-yilda G‘arbiy Jetisuvda (Chu va Qo‘ziboshi) qanday tarixiy voqea yuz berdi?"
      ),
      options: {
        ru: [
          "Основание Казахского ханства султанами Кереем и Жанибеком",
          "Атлахская битва между арабами и войсками Танской империи",
          "Принятие Конституции КАССР",
          "Введение национальной валюты тенге"
        ],
        kk: [
          "Керей мен Жәнібек сұлтандардың Қазақ хандығын құруы",
          "Атлах шайқасы",
          "ҚАКСР Конституциясының қабылдануы",
          "Ұлттық валюта теңгенің енгізілуі"
        ],
        uz: [
          "Kerey va Janibek sultonlar tomonidan Qozoq xonligining tashkil etilishi",
          "Atlax jangi",
          "QASSR Konstitutsiyasining qabul qilinishi",
          "Tengening muomalaga kiritilishi"
        ]
      },
      correctIndex: 0,
      explanation: tr(
        "Согласно «Тарих-и Рашиди», в 1465–1466 гг. в Западном Жетысу (Чу и Козыбасы) Керей и Жанибек основали Казахское ханство.",
        "«Тарих-и Рашиди» бойынша 1465–1466 жж. Батыс Жетісуда (Шу мен Қозыбасы) Қазақ хандығы құрылды.",
        "1465–1466-yillarda G‘arbiy Jetisuvda Qozoq xonligi tashkil topgan."
      )
    }
  },
  {
    id: "syrdarya_aral",
    name: tr("Приаралье и долина Сырдарьи", "Арал маңы және Сырдария бойы", "Orolbo‘yi va Sirdaryo vodiysi"),
    svgCoords: {
      cx: 235,
      cy: 190,
      labelX: 235,
      labelY: 222,
      path: "M 155 155 L 320 160 L 325 225 L 165 225 Z"
    },
    tribesAndStates: tr(
      "Саки-парадарайя (заморские), массагеты (Томирис), государство Кангюй, государство Огузов (столица Янгикент), Ак-Орда (столица Сыгнак), Казахское ханство (столица Туркестан).",
      "Сақ-парадарайялар, массагеттер (Томирис), Қаңлы мемлекеті, Оғыз мемлекеті (Жаңакент), Ақ Орда (Сығанақ), Қазақ хандығы (Түркістан).",
      "Sak-paradarayya, massagetlar, Qang‘li davlati, O‘g‘uzlar (Yangikent), Oq O‘rda (Sig‘noq), Qozoq xonligi (Turkiston)."
    ),
    monuments: {
      ru: ["Чирик-Рабат и Бабиш-Молда (саки Приаралья)", "Городище Отрар (родина Аль-Фараби)", "Мавзолей Ходжи Ахмеда Ясави (Туркестан)"],
      kk: ["Шірік-Рабат пен Бәбіш-Молда", "Отырар қалашығы (Әл-Фарабидің отаны)", "Қожа Ахмет Ясауи кесенесі (Түркістан)"],
      uz: ["Chirik-Rabot va Babish-Molda", "O‘tror shaharchasi (Al-Farobiy vatani)", "Xoja Ahmad Yassaviy maqbarasi (Turkiston)"]
    },
    capitalsAndCities: {
      ru: ["Янгикент (Огузы)", "Сыгнак (Ак-Орда)", "Туркестан / Ясы (духовная и политическая столица Казахского ханства)", "Кызылорда (столица КАССР в 1925–1929 гг.)"],
      kk: ["Жаңакент (Оғыздар)", "Сығанақ (Ақ Орда)", "Түркістан / Йасы (Қазақ хандығының астанасы)", "Қызылорда (1925–1929 жж. астана)"],
      uz: ["Yangikent", "Sig‘noq (Oq O‘rda)", "Turkiston (Qozoq xonligi poytaxti)", "Qizilo‘rda (1925–1929-y. poytaxt)"]
    },
    historicalRole: tr(
      "Стратегическая зона присырдарьинских городов (Сыгнак, Сауран, Отрар, Туркестан, Сузак), за которые Казахское ханство вело вековую борьбу как за зимние пастбища и центры ремесла и торговли.",
      "Қазақ хандығы қысқы жайылым мен сауда орталығы ретінде күрескен Сыр бойы қалаларының (Сығанақ, Сауран, Отырар, Түркістан) өзегі.",
      "Sirdaryo bo‘yi shaharlari (Sig‘noq, Sauran, O‘tror, Turkiston) — qishki yaylov va savdo markazi."
    ),
    microCheck: {
      prompt: tr(
        "Какой город был столицей Казахского ханства в XVII — начале XVIII вв. (при Есим-хане и Тауке-хане)?",
        "XVII — XVIII ғ. басында (Есім хан мен Тәуке хан тұсында) Қазақ хандығының астанасы болған қала:",
        "XVII — XVIII asr boshlarida (Yesim xon va Tauke xon davrida) Qozoq xonligi poytaxti bo‘lgan shahar:"
      ),
      options: {
        ru: ["Туркестан (Ясы)", "Суяб", "Сарайшык", "Семипалатинск"],
        kk: ["Түркістан (Йасы)", "Суяб", "Сарайшық", "Семей"],
        uz: ["Turkiston (Yassi)", "Suyob", "Saroyshiq", "Semipalatinsk"]
      },
      correctIndex: 0,
      explanation: tr(
        "С XVII века постоянной политической и духовной столицей Казахского ханства стал город Туркестан.",
        "XVII ғасырдан бастап Түркістан қаласы Қазақ хандығының саяси және рухани астанасы болды.",
        "XVII asrdan boshlab Turkiston shahri Qozoq xonligining poytaxti bo‘lgan."
      )
    }
  },
  {
    id: "saryarka_center",
    name: tr("Сарыарка и Северный Казахстан", "Сарыарқа және Солтүстік Қазақстан", "Sariarqa va Shimoliy Qozog‘iston"),
    svgCoords: {
      cx: 315,
      cy: 105,
      labelX: 315,
      labelY: 132,
      path: "M 210 60 L 420 60 L 415 150 L 215 150 Z"
    },
    tribesAndStates: tr(
      "Ботайская энеолитическая культура (одомашнивание лошади), Бегазы-Дандыбаевская культура эпохи бронзы, Тасмолинская культура саков («курганы с усами»), Кыпчакское ханство, Средний жуз.",
      "Ботай энеолит мәдениеті (жылқыны қолға үйрету), Беғазы-Дәндібай қола мәдениеті, Тасмола мәдениеті («мұртты обалар»), Қыпшақ хандығы, Орта жүз.",
      "Botay eneolit madaniyati (otni xonakilashtirish), Beg‘azi-Dandibay va Tasmola madaniyati («mo‘ylovli qo‘rg‘onlar»), O‘rta juz."
    ),
    monuments: {
      ru: ["Поселение Ботай (IV–III тыс. до н.э. — доместикация лошади)", "Мавзолеи Бегазы и Дандыбай (поздняя бронза)", "Тасмолинские «курганы с усами»", "Мавзолей Алаша-хана и Жошы-хана (Улытау)"],
      kk: ["Ботай қонысы (жылқыны қолға үйрету)", "Беғазы-Дәндібай кесенелері", "Тасмола «мұртты обалары»", "Алаша хан және Жошы хан кесенелері (Ұлытау)"],
      uz: ["Botay manzilgohi", "Beg‘azi-Dandibay yodgorliklari", "Tasmola «mo‘ylovli qo‘rg‘onlari»", "Alasha xon va Jo‘ji xon maqbaralari (Ulitov)"]
    },
    capitalsAndCities: {
      ru: ["Бозок (средневековое городище)", "Улытау (ставка Жошы-хана и место курултаев)", "Астана (столица Республики Казахстан с декабря 1997 г.)"],
      kk: ["Бозоқ (ортағасырлық қалашық)", "Ұлытау (Жошы хан ордасы мен құрылтайлар орны)", "Астана (1997 ж. желтоқсаннан бастап ҚР астанасы)"],
      uz: ["Bozoq", "Ulitov", "Ostona (1997-yil dekabrdan QR poytaxti)"]
    },
    historicalRole: tr(
      "Центр древней металлургии (Жезказган, Атасу), место всеказахских курултаев в Улытау и расположение современной столицы РК — Астаны (перенос столицы в 1997 г.).",
      "Ежелгі металлургия орталығы, Ұлытаудағы жалпықазақ құрылтайлары өткен жер және ҚР қазіргі астанасы — Астана орналасқан өңір.",
      "Qadimgi metallurgiya markazi, Ulitov qurultoylari va QRning hozirgi poytaxti — Ostona joylashgan hudud."
    ),
    microCheck: {
      prompt: tr(
        "Чем всемирно известно энеолитическое поселение Ботай в Северном Казахстане?",
        "Солтүстік Қазақстандағы энеолит дәуірінің Ботай қонысы әлемге несімен танымал?",
        "Shimoliy Qozog‘istondagi eneolit davriga oid Botay manzilgohi nima bilan mashhur?"
      ),
      options: {
        ru: [
          "Древнейшим одомашниванием (доместикацией) лошади человеком в IV–III тыс. до н.э.",
          "Находкой Иссыкского «Золотого человека»",
          "Принятием свода законов «Жеті жарғы»",
          "Строительством мавзолея Ходжи Ахмеда Ясави"
        ],
        kk: [
          "Б.з.б. IV–III мыңжылдықта жылқыны алғаш қолға үйретумен",
          "Есік «Алтын адамының» табылуымен",
          "«Жеті жарғы» заңдар жинағының қабылдануымен",
          "Қожа Ахмет Ясауи кесенесінің салынуымен"
        ],
        uz: [
          "Mil. avv. IV–III mingyillikda otning ilk bor xonakilashtirilishi bilan",
          "Issiq «Oltin odami» topilishi bilan",
          "«Jeti jarg‘i» qonunlari qabul qilinishi bilan",
          "Ahmad Yassaviy maqbarasi qurilishi bilan"
        ]
      },
      correctIndex: 0,
      explanation: tr(
        "Поселение Ботай (открыто В.Ф. Зайбертом) доказало, что Северный Казахстан был центром первичного одомашнивания лошади.",
        "В.Ф. Зайберт ашқан Ботай қонысы Солтүстік Қазақстанның жылқыны алғаш қолға үйреткен орталық екенін дәлелдеді.",
        "Botay manzilgohi otning ilk bor xonakilashtirilgan markazi ekanini isbotlagan."
      )
    }
  },
  {
    id: "east_altai",
    name: tr("Восточный Казахстан и Алтай", "Шығыс Қазақстан және Алтай", "Sharqiy Qozog‘iston va Oltoy"),
    svgCoords: {
      cx: 485,
      cy: 115,
      labelX: 485,
      labelY: 142,
      path: "M 425 70 L 545 80 L 535 152 L 420 148 Z"
    },
    tribesAndStates: tr(
      "Аримаспы («стерегущие золото грифов»), Кимакский каганат (столица Имакия на Иртыше), Найманское ханство, восточный центр Алаш-Орды (город Алаш / Семипалатинск).",
      "Аримаспылар («алтын қорыған грифтер»), Қимақ қағанаты (Ертіс бойындағы Имақия), Найман хандығы, Алашорданың шығыс орталығы (Семей / Алаш қаласы).",
      "Arimasplar, Kimaklar xoqonligi (Irtish bo‘yidagi Imakiya), Nayman xonligi, Alash-O‘rda markazi (Semey)."
    ),
    monuments: {
      ru: ["Шиликтинский «Золотой человек» (VIII–VII вв. до н.э., открыт С. Черниковым и А. Толеубаевым)", "Берельские курганы с вечной мерзлотой (Катон-Карагай, открыты З. Самашевым)", "Курган Елеке Сазы"],
      kk: ["Шілікті «Алтын адамы» (б.з.б. VIII–VII ғғ., С. Черников пен Ә. Төлеубаев зерттеген)", "Мәңгі тоң басқан Берел қорғандары (З. Самашев)", "Елеке Сазы обасы"],
      uz: ["Shilikti «Oltin odami» (mil. avv. VIII–VII asrlar)", "Abadiy muzlikdagi Berel qo‘rg‘onlari", "Yeleke Sazi qo‘rg‘oni"]
    },
    capitalsAndCities: {
      ru: ["Имакия (Кимакский каганат)", "Семипалатинск / Алаш-кала (временная столица Алаш-Орды, родина просвещения Абая и Шакарима)"],
      kk: ["Имақия (Қимақ қағанаты)", "Семей / Алаш қаласы (Алашорданың орталығы, Абай мен Шәкәрім өңірі)"],
      uz: ["Imakiya (Kimaklar xoqonligi)", "Semey / Alash-qala (Alash-O‘rda markazi)"]
    },
    historicalRole: tr(
      "Древнейшие царские курганы раннесакского времени (Шиликты, VIII в. до н.э.), уникальные погребения в линзах мерзлоты (Берель), духовный центр Абая и столица автономии Алаш.",
      "Ең көне сақ патша қорғандары (Шілікті), Берел ескерткіштері, Абай руханиятының ордасы және Алаш автономиясының астанасы.",
      "Eng qadimgi sak qo‘rg‘onlari (Shilikti), Berel yodgorliklari va Alash avtonomiyasi markazi."
    ),
    microCheck: {
      prompt: tr(
        "Какой город был выбран временным местопребыванием правительства Алаш-Орды в декабре 1917 года?",
        "1917 жылы желтоқсанда Алашорда үкіметінің уақытша орналасқан астанасы болып қай қала таңдалды?",
        "1917-yil dekabrda Alash-O‘rda hukumatining vaqtinchalik markazi sifatida qaysi shahar tanlangan?"
      ),
      options: {
        ru: ["Семипалатинск (Алаш-кала)", "Верный", "Ташкент", "Астрахань"],
        kk: ["Семей (Алаш қаласы)", "Верный", "Ташкент", "Астрахан"],
        uz: ["Semipalatinsk (Alash-qala)", "Verniy", "Toshkent", "Astraxan"]
      },
      correctIndex: 0,
      explanation: tr(
        "На II Всеказахском съезде временным центром автономии Алаш был объявлен город Семипалатинск (получивший название Алаш).",
        "Екінші жалпықазақ съезінде Алаш автономиясының уақытша орталығы болып Семей (Алаш) қаласы белгіленді.",
        "Ikkinchi umumqozoq syezdida Semipalatinsk (Alash) shahri Alash avtonomiyasi markazi deb belgilangan."
      )
    }
  },
  {
    id: "west_ural",
    name: tr("Западный Казахстан (Жайык и Мангыстау)", "Батыс Қазақстан (Жайық пен Маңғыстау)", "G‘arbiy Qozog‘iston (Jayiq va Mang‘istov)"),
    svgCoords: {
      cx: 110,
      cy: 135,
      labelX: 110,
      labelY: 165,
      path: "M 40 85 L 195 85 L 190 175 L 45 175 Z"
    },
    tribesAndStates: tr(
      "Савроматы и сарматы (VIII в. до н.э. — IV в. н.э.), Ногайская Орда (столица Сарайшык), Букеевская (Внутренняя) Орда (1801 г.), Младший жуз.",
      "Савроматтар мен сарматтар, Ноғай Ордасы (астанасы Сарайшық), Бөкей (Ішкі) Ордасы (1801 ж.), Кіші жүз.",
      "Savromatlar va sarmatlar, No‘g‘ay O‘rdasi (Saroyshiq), Bukey O‘rdasi (1801-y.), Kichik juz."
    ),
    monuments: {
      ru: ["Курган Аралтобе («Золотой воин» сарматов, Атырауская обл.)", "Святилища Байте и Теренозек", "Подземные мечети Мангыстау (Бекет-Ата, Шакпак-Ата)", "Городище Сарайшык на р. Жайык"],
      kk: ["Аралтөбе обасы (сармат «Алтын адамы», Атырау обл.)", "Бәйте мен Тереңөзек ғибадатханалары", "Маңғыстау жерасты мешіттері (Бекет ата, Шақпақ ата)", "Жайық бойындағы Сарайшық қалашығы"],
      uz: ["Aralto‘be qo‘rg‘oni (sarmat «Oltin jangchisi»)", "Mang‘istov yerosti masjidlari (Beket ota)", "Saroyshiq shaharchasi"]
    },
    capitalsAndCities: {
      ru: ["Сарайшык (столица Ногайской Орды и ставка Касым-хана)", "Ханская Ставка Букеевской Орды (первая светская школа Жангир-хана, 1841 г.)", "Оренбург (первая столица КАССР в 1920–1925 гг.)"],
      kk: ["Сарайшық (Ноғай Ордасының астанасы және Қасым ханның ордасы)", "Бөкей Ордасының Хан ордасы (1841 ж. Жәңгір хан мектебі)", "Орынбор (1920–1925 жж. ҚАКСР алғашқы астанасы)"],
      uz: ["Saroyshiq", "Bukey O‘rdasi Xon qarorgohi (1841-y.)", "Orenburg (1920–1925-y. QASSR poytaxti)"]
    },
    historicalRole: tr(
      "Территория восстаний Сырыма Датулы (1783–1797 гг.) и Исатая Тайманулы и Махамбета Утемисулы (1836–1838 гг.), а также реформ просвещения в Букеевской Орде.",
      "Сырым Датұлы (1783–1797 жж.) және Исатай Тайманұлы мен Махамбет Өтемісұлы (1836–1838 жж.) көтерілістерінің бесігі.",
      "Sirim Datuli (1783–1797-y.) hamda Isatay Taymanuli va Maxambet Utemisuli (1836–1838-y.) qo‘zg‘olonlari hududi."
    ),
    microCheck: {
      prompt: tr(
        "Какие племена населяли территорию Западного Казахстана, Южного Приуралья и Поволжья в VIII в. до н.э. — IV в. н.э. (памятник Аралтобе)?",
        "Б.з.б. VIII ғ. — б.з. IV ғ. Батыс Қазақстан мен Жайық бойын мекендеген тайпалар (Аралтөбе ескерткіші):",
        "Mil. avv. VIII asr — mil. IV asrda G‘arbiy Qozog‘iston hududida yashagan qabilalar (Aralto‘be yodgorligi):"
      ),
      options: {
        ru: ["Савроматы и сарматы", "Каракитаи", "Тюргеши", "Карлуки"],
        kk: ["Савроматтар мен сарматтар", "Қарақытайлар", "Түргештер", "Қарлұқтар"],
        uz: ["Savromatlar va sarmatlar", "Qoraxitoylar", "Turgeshlar", "Qorluqlar"]
      },
      correctIndex: 0,
      explanation: tr(
        "Западный Казахстан в эпоху раннего железа населяли племена савроматов и сарматов, оставившие курган Аралтобе.",
        "Батыс Қазақстанды ерте темір дәуірінде савромат-сармат тайпалары мекендеген (Аралтөбе обасы).",
        "G‘arbiy Qozog‘istonda savromat va sarmat qabilalari yashagan."
      )
    }
  }
];

export const HISTORY_KZ_ERA_COMPARISON: HistoryEraComparisonRow[] = [
  {
    criterion: tr("Период и правитель / авторы", "Кезеңі және билеуші / авторлары", "Davri va hukmdor / mualliflar"),
    kasym: tr("Начало XVI в. (1511–1521 гг.), Касым-хан", "XVI ғ. басы (1511–1521 жж.), Қасым хан", "XVI asr boshi (1511–1521-y.), Qosim xon"),
    esim: tr("Первая треть XVII в. (1598–1628 гг.), Есим-хан", "XVII ғ. басы (1598–1628 жж.), Есім хан", "XVII asr boshi (1598–1628-y.), Yesim xon"),
    tauke: tr("Конец XVII — нач. XVIII в., Тауке-хан + Толе би, Казыбек би, Айтеке би", "XVII ғ. соңы — XVIII ғ. басы, Тәуке хан + Төле би, Қазыбек би, Әйтеке би", "XVII asr oxiri, Tauke xon + Tole biy, Qazibek biy, Ayteke biy"),
    alash: tr("1917 г., А. Букейханов, А. Байтурсынов, М. Дулатов и др.", "1917 ж., Ә. Бөкейханов, А. Байтұрсынұлы, М. Дулатұлы", "1917-y., A. Bukeyxanov, A. Baytursinov, M. Dulatov")
  },
  {
    criterion: tr("Название правового документа", "Құқықтық құжаттың атауы", "Huquqiy hujjat nomi"),
    kasym: tr("«Қасым ханның қасқа жолы» («Светлый путь Касым-хана»)", "«Қасым ханның қасқа жолы»", "«Qosim xonning qasqa yo‘li»"),
    esim: tr("«Есім ханның ескі жолы» («Древний путь Есим-хана»)", "«Есім ханның ескі жолы»", "«Yesim xonning eski yo‘li»"),
    tauke: tr("«Жеті жарғы» («Семь установлений»)", "«Жеті жарғы»", "«Jeti jarg‘i» («Yetti nizom»)"),
    alash: tr("Проект программы партии «Алаш» (опубликован в газете «Қазақ»)", "«Алаш» партиясы бағдарламасының жобасы («Қазақ» газеті)", "«Alash» partiyasi dasturi loyihasi («Qazaq» gazetasi)")
  },
  {
    criterion: tr("Структура и ключевые нормы", "Құрылымы мен негізгі нормалары", "Tuzilishi va asosiy normalari"),
    kasym: tr("5 отделов: имущественный, уголовный, воинский, посольский этикет, законы общественности (асар, жылу).", "5 бөлім: мүлік, қылмыс, әскери, елшілік жоралары, жұртшылық заңы.", "5 bo‘lim: mulk, jinoyat, harbiy, elchilik va jamoatchilik qonunlari."),
    esim: tr("Усиление роли народного собрания (маслихата/курултая) и прав биев в управлении степью.", "Құрылтайдың және билер кеңесінің саяси рөлін күшейту.", "Qurultoy va biylar kengashining siyosiy rolini kuchaytirish."),
    tauke: tr("7 разделов: земельный закон, семейно-брачный, воинский, судебный, уголовный (принцип куна), закон о вдовах (әменгерлік).", "7 бөлім: жер дауы, отбасы-неке, әскери, сот, құн дауы, жесір дауы.", "7 bo‘lim: yer, oila, harbiy, sud, xun (tovon) va bevalar haqidagi qonunlar."),
    alash: tr("10 разделов: федеративная демократическая республика, разделение властей, земство, земля — народу, светский суд и школа.", "10 бөлім: демократиялық федеративтік республика, жер мәселесі, зайырлы сот пен мектеп.", "10 bo‘lim: demokratik federativ respublika, yer masalasi, dunyoviy sud va maktab.")
  }
];

export const HISTORY_KZ_CAUSE_EFFECT_CHAINS: HistoryCauseEffectChain[] = [
  {
    id: "ce-1465",
    period: "1465–1466 гг.",
    cause: tr(
      "Внутренние междоусобицы в Государстве кочевых узбеков (ханство Абулхаира) и его поражение от ойратов под Сыгнаком в 1457 году",
      "Әбілқайыр хандығындағы ішкі тартыстар мен 1457 жылы Сығанақ түбінде ойраттардан жеңілуі",
      "Abulxayr xonligidagi ichki nizolar va 1457-yilda Sig‘noq яqinida oyrotlardan mag‘lubiyat"
    ),
    event: tr(
      "Откочёвка султанов Керея и Жанибека с подвластными племенами в Западное Жетысу (долину Чу и урочище Козыбасы)",
      "Керей мен Жәнібек сұлтандардың Батыс Жетісуға (Шу мен Қозыбасыға) көшуі",
      "Kerey va Janibek sultonlarning G‘arbiy Jetisuvga (Chu va Qo‘ziboshiga) ko‘chishi"
    ),
    optionsConsequence: {
      ru: [
        "Образование Казахского ханства (1465 г.) и консолидация казахских племён в единое государство",
        "Распад Тюркского каганата на Западный и Восточный в 603 году",
        "Принятие «Устава о сибирских киргизах» М.М. Сперанского (1822 г.)",
        "Перенос столицы КАССР из Оренбурга в Кызылорду"
      ],
      kk: [
        "Қазақ хандығының құрылуы (1465 ж.) және қазақ тайпаларының біртұтас мемлекетке бірігуі",
        "603 жылы Түрік қағанатының Батыс және Шығыс болып бөлінуі",
        "1822 ж. «Сібір қырғыздары туралы Жарғының» қабылдануы",
        "ҚАКСР астанасының Орынбордан Қызылордаға көшірілуі"
      ],
      uz: [
        "Qozoq xonligining tashkil topishi (1465-y.) va qozoq qabilalarining yagona davlatga birlashishi",
        "603-yilda Turkiy xoqonlikning ikkiga bo‘linishi",
        "1822-yilgi «Sibir qirg‘izlari to‘g‘risida Nizom»ning qabul qilinishi",
        "Poytaxtning Orenburgdan Qizilo‘rdaga ko‘chirilishi"
      ]
    },
    correctIndex: 0,
    explanation: tr(
      "Именно откочёвка Керея и Жанибека в Западное Жетысу в 1465–1466 гг. привела к образованию Казахского ханства.",
      "Керей мен Жәнібектің Батыс Жетісуға қоныс аударуы 1465–1466 жж. Қазақ хандығының құрылуына әкелді.",
      "Kerey va Janibekning G‘arbiy Jetisuvga ko‘chishi 1465-yilda Qozoq xonligi tuzilishiga olib keldi."
    )
  },
  {
    id: "ce-1822",
    period: "1822–1847 гг.",
    cause: tr(
      "Принятие царской администрацией «Устава о сибирских киргизах» (1822 г.) и «Устава об оренбургских киргизах» (1824 г.), ликвидировавших ханскую власть в Среднем и Младшем жузах, и строительство военных укреплений",
      "Орта және Кіші жүзде хандық билікті жойған 1822 және 1824 жылдардағы Жарғылардың қабылдануы мен әскери бекіністердің салынуы",
      "O‘rta va Kichik juzda xonlik hokimiyatini tugatgan 1822 va 1824-yillardagi Nizomlarning qabul qilinishi"
    ),
    event: tr(
      "Объединение родов всех трёх жузов под руководством султана (с 1841 г. — хана) Кенесары Касымулы",
      "Үш жүз руларының Кенесары Қасымұлы (1841 жылдан — хан) бастауымен бірігуі",
      "Uch juz urug‘larining Kenesari Qosimuli boshchiligida birlashishi"
    ),
    optionsConsequence: {
      ru: [
        "Крупнейшее антиколониальное восстание XIX века (1837–1847 гг.) за восстановление государственности Казахского ханства",
        "Орбулакская битва 1643 года под командованием Жангир-хана",
        "Образование автономии Туркестан (Коканд, 1917 г.)",
        "Подписание Петербургского договора 1881 года"
      ],
      kk: [
        "Қазақ хандығының мемлекеттілігін қалпына келтіруді көздеген XIX ғасырдағы ең ірі ұлт-азаттық көтеріліс (1837–1847 жж.)",
        "1643 жылғы Орбұлақ шайқасы",
        "1917 жылғы Түркістан (Қоқан) автономиясының құрылуы",
        "1881 жылғы Петербург шарттың жасалуы"
      ],
      uz: [
        "XIX asrdagi eng yirik milliy-ozodlik qo‘zg‘oloni (1837–1847-y.)",
        "1643-yilgi Orbulak jangi",
        "1917-yilda Turkiston muxtoriyatining tuzilishi",
        "1881-yilgi Peterburg shartnomasi"
      ]
    },
    correctIndex: 0,
    explanation: tr(
      "Ликвидация ханской власти по уставам 1822/1824 гг. и изъятие земель стали главной причиной всеказахского восстания Кенесары Касымулы (1837–1847 гг.).",
      "1822–1824 жж. реформалар мен жердің тартып алынуы Кенесары Қасымұлы көтерілісінің (1837–1847 жж.) басты себебі болды.",
      "1822–1824-yilgi islohotlar Kenesari Qosimuli qo‘zg‘olonining (1837–1847-y.) asosiy sababi bo‘lgan."
    )
  },
  {
    id: "ce-1916-1917",
    period: "1916–1917 гг.",
    cause: tr(
      "Кризис империи в Первой мировой войне, Февральская революция 1917 г. и стремление казахской национальной интеллигенции защитить земельные и политические права народа законным конституционным путём",
      "1917 жылғы Ақпан революциясы және қазақ зиялыларының халықтың жер мен саяси құқықтарын заңды жолмен қорғауға ұмтылысы",
      "1917-yilgi Fevral inqilobi va qozoq ziyolilarining xalq huquqlarini qonuniy yo‘l bilan himoya qilishga intilishi"
    ),
    event: tr(
      "Созыв Первого (июль 1917 г.) и Второго (декабрь 1917 г.) Всеказахских съездов в Оренбурге",
      "Орынборда Бірінші (1917 ж. шілде) және Екінші (1917 ж. желтоқсан) жалпықазақ съездерінің шақырылуы",
      "Orenburgda I (1917-yil iyul) va II (1917-yil dekabr) umumqozoq syezdlarining chaqirilishi"
    ),
    optionsConsequence: {
      ru: [
        "Создание партии «Алаш», провозглашение автономии «Алаш» и избрание правительства Алаш-Орда во главе с А. Букейхановым",
        "Образование Букеевской Орды в междуречье Волги и Урала (1801 г.)",
        "Принятие свода законов «Жеті жарғы»",
        "Основание города Верный (1854 г.)"
      ],
      kk: [
        "«Алаш» партиясының құрылуы, Алаш автономиясының жариялануы және Ә. Бөкейханов бастаған Алашорда үкіметінің сайлануы",
        "1801 жылы Бөкей Ордасының құрылуы",
        "«Жеті жарғы» заңдар жинағының қабылдануы",
        "1854 жылы Верный бекінісінің салынуы"
      ],
      uz: [
        "«Alash» partiyasi tuzilishi va A. Bukeyxanov boshchiligidagi Alash-O‘rda hukumatining saylanishi",
        "1801-yilda Bukey O‘rdasining tashkil topishi",
        "«Jeti jarg‘i» qonunlarining qabul qilinishi",
        "1854-yilda Verniy qal’asining qurilishi"
      ]
    },
    correctIndex: 0,
    explanation: tr(
      "На I Всеказахском съезде (июль 1917 г.) оформилась партия «Алаш», а на II съезде (декабрь 1917 г.) создано правительство Алаш-Орда.",
      "1917 ж. шілдедегі І съезде «Алаш» партиясы, ал желтоқсандағы ІІ съезде Алашорда үкіметі құрылды.",
      "1917-yil iyuldagi I syezdda «Alash» partiyasi, dekabrdagi II syezdda esa Alash-O‘rda hukumati tuzilgan."
    )
  }
];

interface OtherSubjectLabSpec {
  badge: Record<Locale, string>;
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  interactiveCards: {
    id: string;
    label: Record<Locale, string>;
    formulaOrRule: Record<Locale, string>;
    explanation: Record<Locale, string>;
    checkPrompt: Record<Locale, string>;
    options: Record<Locale, string[]>;
    correctIndex: number;
    feedback: Record<Locale, string>;
  }[];
}

const OTHER_SUBJECT_ADAPTERS: Record<string, OtherSubjectLabSpec> = {
  math: {
    badge: tr("МАТЕМАТИЧЕСКАЯ ЛАБОРАТОРИЯ", "МАТЕМАТИКА ЗЕРТХАНАСЫ", "MATEMATIKA LABORATORIYASI"),
    title: tr("Формулы, ОДЗ и пошаговый контроль преобразований", "Формулалар, ММЖ және қадамдық түрлендірулерді тексеру", "Formulalar, aniqlanish sohasi va qadam-baqadam tekshiruv"),
    subtitle: tr("Выберите ключевой математический узел, проверьте область допустимых значений и выполните микро-проверку:", "Математикалық түйінді таңдап, ММЖ мен есептеуді тексеріңіз:", "Matematik bo‘limni tanlab, hisoblashni tekshiring:"),
    interactiveCards: [
      {
        id: "math-vieta",
        label: tr("Квадратные уравнения и Виета", "Квадрат теңдеулер және Виет теоремасы", "Kvadrat tenglamalar va Viyet"),
        formulaOrRule: tr("x² + px + q = 0  ⇒  x₁ + x₂ = −p,   x₁ · x₂ = q   (при D = p² − 4q ≥ 0)", "x² + px + q = 0  ⇒  x₁ + x₂ = −p,   x₁ · x₂ = q   (D ≥ 0 болғанда)", "x² + px + q = 0  ⇒  x₁ + x₂ = −p,   x₁ · x₂ = q"),
        explanation: tr("Главная ловушка ЕНТ — знак суммы корней: сумма равна коэффициенту p с противоположным знаком (−p), и применять теорему можно только при D ≥ 0.", "ҰБТ-дағы жиі қате: түбірлердің қосындысы қарама-қарсы таңбамен алынады (−p).", "Asosiy xato: ildizlar yig‘indisi qarama-qarshi ishora bilan (−p) olinadi."),
        checkPrompt: tr("Чему равна сумма корней уравнения x² − 9x + 14 = 0?", "x² − 9x + 14 = 0 теңдеуі түбірлерінің қосындысы неге тең?", "x² − 9x + 14 = 0 tenglama ildizlari yig‘indisi nimaga teng?"),
        options: {
          ru: ["9", "−9", "14", "−14"],
          kk: ["9", "−9", "14", "−14"],
          uz: ["9", "−9", "14", "−14"]
        },
        correctIndex: 0,
        feedback: tr("По теореме Виета x₁ + x₂ = −(−9) = 9 (корни 2 и 7).", "Виет теоремасы бойынша x₁ + x₂ = −(−9) = 9.", "Viyet teoremasiga ko‘ra x₁ + x₂ = 9.")
      },
      {
        id: "math-log",
        label: tr("Логарифмы и контроль ОДЗ", "Логарифмдер және ММЖ бақылауы", "Logarifmlar va aniqlanish sohasi"),
        formulaOrRule: tr("logₐ(f(x)) = b  ⇔  f(x) = aᵇ,  где обязательно f(x) > 0, a > 0, a ≠ 1", "logₐ(f(x)) = b  ⇔  f(x) = aᵇ,  мұндағы f(x) > 0, a > 0, a ≠ 1", "logₐ(f(x)) = b  ⇔  f(x) = aᵇ,  f(x) > 0"),
        explanation: tr("При сложении логарифмов logₐ(x) + logₐ(x−3) сужается ОДЗ: нужно требовать x > 3, иначе появится посторонний отрицательный корень.", "Логарифмдерді қосқанда ММЖ міндетті түрде бастапқы теңдеу бойынша тексеріледі (x > 3).", "Logarifmlarni qo‘shishda aniqlanish sohasi dastlabki tenglama bo‘yicha tekshiriladi."),
        checkPrompt: tr("Какое условие ОДЗ обязательно для выражения log₂(x − 4)?", "log₂(x − 4) өрнегі үшін қандай ММЖ шарты міндетті?", "log₂(x − 4) ifodasi uchun qanday shart majburiy?"),
        options: {
          ru: ["x > 4", "x ≥ 4", "x ≠ 4", "x > 0"],
          kk: ["x > 4", "x ≥ 4", "x ≠ 4", "x > 0"],
          uz: ["x > 4", "x ≥ 4", "x ≠ 4", "x > 0"]
        },
        correctIndex: 0,
        feedback: tr("Подлогарифмическое выражение строго положительно: x − 4 > 0 ⇒ x > 4.", "Логарифм астындағы өрнек қатаң оң болуы тиіс: x > 4.", "Logarifm ostidagi ifoda musbat bo‘lishi shart: x > 4.")
      }
    ]
  },
  physics: {
    badge: tr("ФИЗИЧЕСКИЙ СИМУЛЯТОР ВЕЛИЧИН", "ФИЗИКАЛЫҚ ШАМАЛАР МОДЕЛІ", "FIZIK KATTALIKLAR MODELI"),
    title: tr("Формулы, единицы СИ и физические зависимости", "Формулалар, ХБЖ бірліктері және физикалық тәуелділіктер", "Formulalar, SI birliklari va fizik bog‘lanishlar"),
    subtitle: tr("Проверяйте размерности в системе СИ перед подстановкой чисел:", "Сандарды қоймас бұрын ХБЖ өлшем бірліктерін тексеріңіз:", "Sonlarni qo‘yishdan oldin SI birliklarini tekshiring:"),
    interactiveCards: [
      {
        id: "phys-kinematics",
        label: tr("Механика и перевод км/ч → м/с", "Механика және км/сағ → м/с ауыстыру", "Mexanika va km/soat → m/s"),
        formulaOrRule: tr("v (м/с) = v (км/ч) / 3,6  |  Eₖ = m·v² / 2  |  F = m·a", "v (м/с) = v (км/сағ) / 3,6  |  Eₖ = m·v² / 2  |  F = m·a", "v (m/s) = v (km/soat) / 3,6  |  Eₖ = m·v² / 2"),
        explanation: tr("Чтобы перевести скорость из км/ч в м/с, делите на 3,6 (так как 1000 м / 3600 с = 1/3,6). Например, 72 км/ч = 20 м/с.", "72 км/сағ жылдамдықты 3,6-ға бөлсек, 20 м/с шығады.", "72 km/soat tezlikni 3,6 ga bo‘lsak, 20 m/s hosil bo‘ladi."),
        checkPrompt: tr("Во сколько раз увеличится кинетическая энергия тела Eₖ = mv²/2 при увеличении его скорости в 3 раза?", "Дененің жылдамдығы 3 есе артса, оның кинетикалық энергиясы неше есе артады?", "Jism tezligi 3 marta ortsa, uning kinetik energiyasi necha marta ortadi?"),
        options: {
          ru: ["В 9 раз", "В 3 раза", "В 6 раз", "В 1,5 раза"],
          kk: ["9 есе", "3 есе", "6 есе", "1,5 есе"],
          uz: ["9 marta", "3 marta", "6 marta", "1,5 marta"]
        },
        correctIndex: 0,
        feedback: tr("Кинетическая энергия пропорциональна квадрату скорости: 3² = 9 раз.", "Кинетикалық энергия жылдамдықтың квадратына пропорционал: 3² = 9 есе.", "Kinetik energiya tezlik kvadratiga proporsional: 3² = 9 marta.")
      }
    ]
  },
  chemistry: {
    badge: tr("ХИМИЧЕСКАЯ ЛАБОРАТОРИЯ", "ХИМИЯЛЫҚ ЗЕРТХАНА", "KIMYO LABORATORIYASI"),
    title: tr("Уравнения реакций, молярные расчёты и ОВР", "Реакция теңдеулері, молярлық есептеулер және ТТР", "Reaksiya tenglamalari va molyar hisoblar"),
    subtitle: tr("Контроль стехиометрических коэффициентов и количества вещества:", "Стехиометриялық коэффициенттер мен зат мөлшерін бақылау:", "Stexiometrik koeffitsiyentlar va modda miqdori:"),
    interactiveCards: [
      {
        id: "chem-stoich",
        label: tr("Количество вещества и объём газа (н.у.)", "Зат мөлшері және газ көлемі (қ.ж.)", "Modda miqdori va gaz hajmi"),
        formulaOrRule: tr("n = m / M = V / Vₘ   (при н.у. Vₘ = 22,4 л/моль)", "n = m / M = V / Vₘ   (қ.ж. Vₘ = 22,4 л/моль)", "n = m / M = V / Vₘ   (Vₘ = 22,4 l/mol)"),
        explanation: tr("По закону Авогадро 1 моль любого идеального газа при нормальных условиях занимает объём 22,4 л.", "Авогадро заңы бойынша қалыпты жағдайда 1 моль кез келген газ 22,4 л көлем алады.", "Avogadro qonuniga ko‘ra 1 mol gaz normal sharoitda 22,4 l hajmni egallaydi."),
        checkPrompt: tr("Какой объём (н.у.) занимают 2 моль кислорода O₂?", "Қалыпты жағдайда 2 моль оттегі (O₂) қандай көлем алады?", "Normal sharoitda 2 mol kislorod (O₂) qanday hajmni egallaydi?"),
        options: {
          ru: ["44,8 л", "22,4 л", "11,2 л", "32 л"],
          kk: ["44,8 л", "22,4 л", "11,2 л", "32 л"],
          uz: ["44,8 l", "22,4 l", "11,2 l", "32 l"]
        },
        correctIndex: 0,
        feedback: tr("V = n · Vₘ = 2 моль × 22,4 л/моль = 44,8 л.", "V = 2 × 22,4 = 44,8 л.", "V = 2 × 22,4 = 44,8 l.")
      }
    ]
  },
  biology: {
    badge: tr("БИОЛОГИЧЕСКИЙ АТЛАС ПРОЦЕССОВ", "БИОЛОГИЯЛЫҚ ПРОЦЕСТЕР АТЛАСЫ", "BIOLOGIK JARAYONLAR ATLASI"),
    title: tr("Клеточные структуры, комплементарность ДНК и генетика", "Жасуша құрылымы, ДНҚ комплементарлығы және генетика", "Hujayra tuzilishi, DNK va genetika"),
    subtitle: tr("Сравнение органоидов, процессов деления и правил Чаргаффа:", "Органоидтарды, бөліну процестерін және Чаргафф ережесін салыстыру:", "Organoidlar va Chargaff qoidasini solishtirish:"),
    interactiveCards: [
      {
        id: "bio-dna",
        label: tr("Правило Чаргаффа и репликация ДНК", "Чаргафф ережесі және ДНҚ репликациясы", "Chargaff qoidasi va DNK"),
        formulaOrRule: tr("А = Т (2 водородные связи),  Г = Ц (3 водородные связи)  ⇒  А + Г = Т + Ц = 50%", "А = Т (2 сутектік байланыс),  Г = Ц (3 сутектік байланыс)", "A = T,  G = S  ⇒  A + G = 50%"),
        explanation: tr("В двухцепочечной молекуле ДНК доля пуринов равна доле пиримидинов. Если аденина (А) 20%, то тимина (Т) тоже 20%, а на Г + Ц приходится 60% (по 30%).", "Егер ДНҚ-да аденин (А) 20% болса, тимин де (Т) 20%, ал гуанин (Г) мен цитозин (Ц) 30%-дан болады.", "Agar DNKda adenin (A) 20% bo‘lsa, timin (T) 20%, guanin (G) va sitozin (S) 30% dan bo‘ladi."),
        checkPrompt: tr("Если в фрагменте двухцепочечной ДНК доля нуклеотидов с тимином (Т) составляет 18%, какова доля цитозина (Ц)?", "Егер қос тізбекті ДНҚ-да тимин (Т) 18% болса, цитозиннің (Ц) үлесі қанша?", "Agar DNKda timin (T) 18% bo‘lsa, sitozin (S) ulushi qancha?"),
        options: {
          ru: ["32%", "18%", "36%", "64%"],
          kk: ["32%", "18%", "36%", "64%"],
          uz: ["32%", "18%", "36%", "64%"]
        },
        correctIndex: 0,
        feedback: tr("А = Т = 18% (в сумме 36%). На Г + Ц остаётся 100% − 36% = 64%, значит Ц = 64% / 2 = 32%.", "А = Т = 18%, ал Ц = (100% − 36%) / 2 = 32%.", "A = T = 18%, S = (100% − 36%) / 2 = 32%.")
      }
    ]
  },
  informatics: {
    badge: tr("ТРАССИРОВКА КОДА И АЛГОРИТМОВ", "КОД ЖӘНЕ АЛГОРИТМ ТРАССИРОВКАСЫ", "KOD VA ALGORITM TRASSIROVKASI"),
    title: tr("Пошаговое выполнение Python, систем счисления и логики", "Python, санау жүйелері және логиканы қадамдық тексеру", "Python, sanoq tizimlari va mantiqiy amallar"),
    subtitle: tr("Проверяйте границы range(start, stop, step) и веса разрядов:", "range(start, stop, step) шекаралары мен разряд салмағын тексеріңіз:", "range(start, stop, step) chegaralarini tekshiring:"),
    interactiveCards: [
      {
        id: "inf-python",
        label: tr("Циклы Python и функция range()", "Python циклдері және range() функциясы", "Python sikllari va range()"),
        formulaOrRule: tr("range(a, b) генерирует числа a, a+1, ..., b−1 (правая граница b НЕ включается)", "range(a, b) ішіне оң жақ шекара b КІРМЕЙДІ (a-дан b−1-ге дейін)", "range(a, b) da o‘ng chegara b kirmaydi"),
        explanation: tr("Например, sum(range(1, 5)) складывает 1 + 2 + 3 + 4 = 10 (число 5 в диапазон не входит).", "Мысалы, sum(range(1, 5)) = 1 + 2 + 3 + 4 = 10.", "Masalan, sum(range(1, 5)) = 1 + 2 + 3 + 4 = 10."),
        checkPrompt: tr("Что выведет код на Python: print(sum(range(2, 6)))?", "Python коды не шығарады: print(sum(range(2, 6)))?", "Python kodi nimani chiqaradi: print(sum(range(2, 6)))?"),
        options: {
          ru: ["14", "20", "12", "15"],
          kk: ["14", "20", "12", "15"],
          uz: ["14", "20", "12", "15"]
        },
        correctIndex: 0,
        feedback: tr("range(2, 6) даёт числа 2, 3, 4, 5. Их сумма: 2 + 3 + 4 + 5 = 14.", "2 + 3 + 4 + 5 = 14 (6 саны кірмейді).", "2 + 3 + 4 + 5 = 14.")
      }
    ]
  },
  math_literacy: {
    badge: tr("ЛАБОРАТОРИЯ МАТ. ГРАМОТНОСТИ", "МАТ. САУАТТЫЛЫҚ ЗЕРТХАНАСЫ", "MAT. SAVODXONLIK LABORATORIYASI"),
    title: tr("Таблицы, проценты, вероятность и логика данных", "Кестелер, пайыздар, ықтималдық және деректер логикасы", "Jadvallar, foizlar, ehtimollik va mantiq"),
    subtitle: tr("Разбор реальных прикладных задач обязательного блока ЕНТ (10 вопросов):", "ҰБТ міндетті блогының қолданбалы есептерін талдау:", "Majburiy blok amaliy masalalarini tahlil qilish:"),
    interactiveCards: [
      {
        id: "ml-percent",
        label: tr("Двойное изменение цены в процентах", "Бағаның пайызбен екі рет өзгеруі", "Narxning foizda ikki marta o‘zgarishi"),
        formulaOrRule: tr("S₁ = S₀ · (1 + p/100) · (1 − q/100)   (база второго процента — уже новая цена S₁!)", "S₁ = S₀ · (1 + p/100) · (1 − q/100)   (екінші пайыз жаңа бағадан есептеледі!)", "S₁ = S₀ · (1 + p/100) · (1 − q/100)"),
        explanation: tr("Повышение цены на 20%, а затем снижение на 20% НЕ возвращает цену к исходной: 1,2 × 0,8 = 0,96 (цена стала на 4% ниже начальной).", "Баға 20%-ға өсіп, кейін 20%-ға арзандаса: 1,2 × 0,8 = 0,96 (бастапқыдан 4%-ға кем).", "Narx 20% oshib, keyin 20% tushsa: 1,2 × 0,8 = 0,96 bo‘ladi."),
        checkPrompt: tr("Товар стоил 10 000 ₸. Сначала цену повысили на 10%, а затем снизили на 10%. Какова итоговая цена?", "Тауар 10 000 ₸ тұрды. Бағасы әуелі 10%-ға өсіп, соңынан 10%-ға төмендеді. Соңғы баға қандай?", "Mahsulot 10 000 ₸ edi. Narxi avval 10% oshirilib, so‘ng 10% tushirildi. Yakuniy narx qanday?"),
        options: {
          ru: ["9 900 ₸", "10 000 ₸", "9 800 ₸", "10 100 ₸"],
          kk: ["9 900 ₸", "10 000 ₸", "9 800 ₸", "10 100 ₸"],
          uz: ["9 900 ₸", "10 000 ₸", "9 800 ₸", "10 100 ₸"]
        },
        correctIndex: 0,
        feedback: tr("10 000 × 1,1 = 11 000 ₸; затем 11 000 × 0,9 = 9 900 ₸.", "10 000 × 1,1 × 0,9 = 9 900 ₸.", "10 000 × 1,1 × 0,9 = 9 900 ₸.")
      }
    ]
  },
  reading_literacy: {
    badge: tr("АНАЛИЗ ТЕКСТА И АРГУМЕНТАЦИИ", "МӘТІН ЖӘНЕ ДӘЙЕКТЕМЕ ТАЛДАУЫ", "MATN VA ARGUMENTATSIYA TAHLILI"),
    title: tr("Структура текста, тезис автора и проверка фактов", "Мәтін құрылымы, автор тезисі және фактілерді тексеру", "Matn tuzilishi, muallif tezisi va faktlar"),
    subtitle: tr("Отделяйте прямой факт в тексте от предположений и ложных обобщений:", "Мәтіндегі нақты фактіні жорамалдан ажыратыңыз:", "Matndagi aniq faktni taxmindan ajrating:"),
    interactiveCards: [
      {
        id: "rl-thesis",
        label: tr("Тезис vs Аргумент vs Иллюстрация", "Тезис vs Дәлел vs Мысал", "Tezis vs Dalil vs Misol"),
        formulaOrRule: tr("Тезис (главная мысль) → Аргумент (почему это верно) → Пример (частный случай)", "Тезис (негізгі ой) → Дәлел (неліктен) → Мысал (нақты жағдай)", "Tezis (asosiy fikr) → Dalil → Misol"),
        explanation: tr("В заданиях ЕНТ по грамотности чтения дистракторы часто подменяют главную мысль всего текста ярким примером из одного абзаца.", "Оқу сауаттылығында жиі кездесетін тұзақ — бүкіл мәтіннің негізгі ойын бір абзацтағы жеке мысалмен шатастыру.", "Asosiy fikrni bitta xatboshidagi misol bilan almashtirib qo‘ymaslik kerak."),
        checkPrompt: tr("Какой приём помогает безошибочно определить главную мысль публицистического или научного текста?", "Мәтіннің негізгі ойын дәл анықтауға қандай тәсіл көмектеседі?", "Matnning asosiy fikrini aniqlashga qaysi usul yordam beradi?"),
        options: {
          ru: [
            "Найти утверждение, которое объединяет вступление и итоговый вывод автора",
            "Выбрать первое предложение с цифрами и датами",
            "Выбрать самый длинный пример во втором абзаце",
            "Опираться на собственные знания вне текста"
          ],
          kk: [
            "Кіріспе мен қорытынды ойды біріктіретін авторлық тұжырымды табу",
            "Сандар мен даталар бар бірінші сөйлемді таңдау",
            "Екінші абзацтағы мысалды таңдау",
            "Мәтіннен тыс жеке пікірге сүйену"
          ],
          uz: [
            "Kirish va xulosani birlashtiruvchi muallif xulosasini topish",
            "Raqamlar qatnashgan birinchi gapni tanlash",
            "Ikkinchi xatboshidagi misolni tanlash",
            "Matndan tashqari fikrga tayanish"
          ]
        },
        correctIndex: 0,
        feedback: tr("Главная мысль (тезис) связывает проблемный вопрос вступления с выводом автора в финале текста.", "Негізгі ой кіріспедегі мәселе мен қорытынды тұжырымды біріктіреді.", "Asosiy fikr kirish va xulosani bog‘laydi.")
      }
    ]
  },
  geography: {
    badge: tr("КАРТОГРАФИЧЕСКИЙ И ГЕОЭКОНОМИЧЕСКИЙ ПРАКТИКУМ", "КАРТОГРАФИЯ ЖӘНЕ ГЕОЭКОНОМИКА", "KARTOGRAFIYA VA GEOIQTISODIYOT"),
    title: tr("Масштаб карты, часовые пояса и экономические районы РК", "Карта масштабы, сағаттық белдеулер және ҚР экономикалық аудандары", "Xarita masshtabi va QR iqtisodiy hududlari"),
    subtitle: tr("Перевод численного масштаба в именованный и расчёт реальных расстояний:", "Сандық масштабты атаулы масштабқа айналдыру және қашықтықты есептеу:", "Masshtab va masofalarni hisoblash:"),
    interactiveCards: [
      {
        id: "geo-scale",
        label: tr("Масштаб карты и расстояние на местности", "Карта масштабы және жергілікті қашықтық", "Xarita masshtabi va masofa"),
        formulaOrRule: tr("Чтобы перевести сантиметры масштаба 1 : N в километры, уберите 5 нулей справа (1 км = 100 000 см)", "1 : N масштабындағы сантиметрді километрге айналдыру үшін 5 нөлді алып тастаңыз (1 км = 100 000 см)", "1 : N masshtabda sm dan km ga o‘tish uchun 5 ta nol olib tashlanadi"),
        explanation: tr("Например, масштаб 1 : 2 000 000 означает: в 1 см на карте — 20 км на местности.", "Мысалы, 1 : 2 000 000 масштабы 1 см-де 20 км бар екенін білдіреді.", "Masalan, 1 : 2 000 000 masshtabda 1 sm = 20 km."),
        checkPrompt: tr("Расстояние между городами на карте масштаба 1 : 3 000 000 равно 4 см. Чему равно расстояние на местности?", "Масштабы 1 : 3 000 000 картада екі қала арасы 4 см. Жер бетіндегі нақты қашықтық қанша?", "1 : 3 000 000 masshtabli xaritada shaharlar orasi 4 sm. Haqiqiy masofa qancha?"),
        options: {
          ru: ["120 км", "12 км", "300 км", "75 км"],
          kk: ["120 км", "12 км", "300 км", "75 км"],
          uz: ["120 km", "12 km", "300 km", "75 km"]
        },
        correctIndex: 0,
        feedback: tr("В 1 см — 30 км. Значит, 4 см × 30 км/см = 120 км.", "1 см = 30 км, демек 4 × 30 = 120 км.", "1 sm = 30 km, 4 × 30 = 120 km.")
      }
    ]
  },
  law: {
    badge: tr("ПРАВОВОЙ РАЗБОР КАЗУСОВ РК", "ҚР ҚҰҚЫҚТЫҚ ЖАҒДАЯТТАР ТАЛДАУЫ", "QR HUQUQIY KAZUSLAR TAHLILI"),
    title: tr("Конституция РК, отрасли права и юридическая ответственность", "ҚР Конституциясы, құқық салалары және заңды жауапкершілік", "QR Konstitutsiyasi va huquq sohalari"),
    subtitle: tr("Разграничение дееспособности, правоспособности и видов ответственности:", "Құқық қабілеттілік пен әрекет қабілеттілікті ажырату:", "Huquq layoqati va muomala layoqati:"),
    interactiveCards: [
      {
        id: "law-capacity",
        label: tr("Правоспособность и дееспособность граждан РК", "Құқық қабілеттілік және әрекет қабілеттілік", "Huquq layoqati va muomala layoqati"),
        formulaOrRule: tr("Правоспособность — с момента рождения; полная гражданская дееспособность — с 18 лет (ст. 17 ГК РК)", "Құқық қабілеттілік — туған сәттен; толық әрекет қабілеттілік — 18 жастан (ҚР АК 17-бабы)", "Huquq layoqati — tug‘ilgandan; to‘liq muomala layoqati — 18 yoshdan"),
        explanation: tr("Частичная дееспособность несовершеннолетних наступает с 14 до 18 лет (распоряжение своим заработком, стипендией), а полная — с 18 лет (или при вступлении в брак / эмансипации).", "14 пен 18 жас аралығында ішінара әрекет қабілеттілік болады, ал толық әрекет қабілеттілік 18 жаста басталады.", "To‘liq fuqarolik muomala layoqati 18 yoshdan boshlanadi."),
        checkPrompt: tr("С какого возраста по Гражданскому кодексу РК наступает полная дееспособность гражданина в общем порядке?", "ҚР Азаматтық кодексі бойынша жалпы тәртіппен толық әрекет қабілеттілік неше жастан басталады?", "QR Fuqarolik kodeksiga ko‘ra to‘liq muomala layoqati necha yoshdan boshlanadi?"),
        options: {
          ru: ["С 18 лет", "С 16 лет", "С 14 лет", "С 21 года"],
          kk: ["18 жастан", "16 жастан", "14 жастан", "21 жастан"],
          uz: ["18 yoshdan", "16 yoshdan", "14 yoshdan", "21 yoshdan"]
        },
        correctIndex: 0,
        feedback: tr("Согласно ст. 17 Гражданского кодекса РК, способность гражданина своими действиями приобретать и осуществлять гражданские права в полном объёме возникает с 18 лет.", "ҚР АК 17-бабы бойынша толық әрекет қабілеттілік кәмелетке толғанда, яғни 18 жастан туындайды.", "QR FK 17-moddasiga ko‘ra 18 yoshdan boshlanadi.")
      }
    ]
  },
  english: {
    badge: tr("ENGLISH GRAMMAR & CONTEXT LAB", "АҒЫЛШЫН ГРАММАТИКАСЫ ЗЕРТХАНАСЫ", "INGLIZ TILI GRAMMATIKASI LABORATORIYASI"),
    title: tr("Conditionals, Reported Speech, Passive Voice & Context Clues", "Conditionals, Reported Speech және мәтіндік контекст", "Conditionals, Reported Speech va kontekst"),
    subtitle: tr("Контроль согласования времён в условных предложениях (0, 1, 2, 3, Mixed):", "Шартты сөйлемдердегі шақтардың үйлесімін тексеру:", "Shart ergash gaplarda zamon moslashuvi:"),
    interactiveCards: [
      {
        id: "eng-cond",
        label: tr("Third Conditional (нереальное прошлое)", "Third Conditional (өткен шақтағы орындалмаған шарт)", "Third Conditional (o‘tgan zamon sharti)"),
        formulaOrRule: tr("If + Past Perfect (had + V₃),  would have + V₃ (Past Participle)", "If + had + V₃,  would have + V₃", "If + had + V₃,  would have + V₃"),
        explanation: tr("Главная ошибка на ЕНТ — ставить would have + V₃ сразу после союза If. В придаточном с If используется только had + V₃!", "ҰБТ-дағы жиі қате — If-тен кейін would have қою. If бөлігінде тек had + V₃ қолданылады!", "If qismida would have emas, faqat had + V₃ ishlatiladi."),
        checkPrompt: tr("Выберите грамматически верное продолжение: «If she had studied the historical dates, she ... the exam.»", "Дұрыс нұсқаны таңдаңыз: «If she had studied the historical dates, she ... the exam.»", "To‘g‘ri javobni tanlang: «If she had studied the historical dates, she ... the exam.»"),
        options: {
          ru: ["would have passed", "would pass", "will pass", "had passed"],
          kk: ["would have passed", "would pass", "will pass", "had passed"],
          uz: ["would have passed", "would pass", "will pass", "had passed"]
        },
        correctIndex: 0,
        feedback: tr("В главной части Third Conditional после If + had studied используется would have + V₃ (would have passed).", "Third Conditional-дың басыңқы сөйлемінде would have passed қолданылады.", "Third Conditional asosiy qismida would have passed ishlatiladi.")
      }
    ]
  }
};


export interface SubjectActivityAdapterProps {
  subjectId: string;
  locale: Locale;
}

export function SubjectActivityAdapter({ subjectId, locale }: SubjectActivityAdapterProps) {
  const [historyMode, setHistoryMode] = useState<
    "timeline" | "map" | "comparison" | "sources" | "cause_effect"
  >("timeline");
  const [selectedEraIdx, setSelectedEraIdx] = useState(0);
  const [selectedRegionId, setSelectedRegionId] = useState<string>("zhetysu");
  const [selectedChainIdx, setSelectedChainIdx] = useState(0);
  const [selectedCardIdx, setSelectedCardIdx] = useState(0);
  const [studioTab, setStudioTab] = useState<"cards" | "rules" | "traps">("cards");
  const [selectedAnswer, setSelectedAnswer] = useState<Record<string, number>>({});

  if (subjectId === "history_kz" || subjectId === "world_history") {
    const activeEra = HISTORY_KZ_TIMELINE_ERAS[selectedEraIdx] ?? HISTORY_KZ_TIMELINE_ERAS[0];
    const activeRegion =
      HISTORY_KZ_MAP_REGIONS.find((r) => r.id === selectedRegionId) ?? HISTORY_KZ_MAP_REGIONS[0];
    const activeChain =
      HISTORY_KZ_CAUSE_EFFECT_CHAINS[selectedChainIdx] ?? HISTORY_KZ_CAUSE_EFFECT_CHAINS[0];

    const modeLabels: Record<typeof historyMode, Record<Locale, string>> = {
      timeline: tr("Хронология и эпохи", "Хронология және дәуірлер", "Xronologiya va davrlar"),
      map: tr("Историческая карта РК", "ҚР тарихи картасы", "QR tarixiy xaritasi"),
      comparison: tr("Сопоставление законов", "Заңдарды салыстыру", "Qonunlarni solishtirish"),
      sources: tr("Первоисточники и личности", "Дереккөздер мен тұлғалар", "Manbalar va shaxslar"),
      cause_effect: tr("Причины и следствия", "Себеп-салдар тізбегі", "Sabab va oqibat")
    };

    const eraCheckKey = `era-${activeEra.id}`;
    const regionCheckKey = `reg-${activeRegion.id}`;
    const chainCheckKey = `chain-${activeChain.id}`;

    return (
      <section
        data-testid="history-interactive-studio"
        className="editorial-fade-in"
        style={{
          background: "var(--bilimai-surface, #FFFFFF)",
          border: "1px solid var(--bilimai-border, #DCE2DD)",
          borderRadius: 16,
          padding: "20px 22px",
          display: "grid",
          gap: 16
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            borderBottom: "1px solid var(--bilimai-border, #DCE2DD)",
            paddingBottom: 14
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.04em",
                color: "var(--bilimai-brand-text, #0F5346)",
                textTransform: "uppercase"
              }}
            >
              <Landmark size={14} />
              <span>
                {locale === "kk"
                  ? "ИНТЕРАКТИВТІ ТАРИХИ ЗЕРТХАНА"
                  : locale === "uz"
                    ? "INTERAKTIV TARIXIY LABORATORIYA"
                    : "ИНТЕРАКТИВНЫЙ ИСТОРИЧЕСКИЙ ПРАКТИКУМ"}
              </span>
            </div>
            <h3 style={{ margin: "4px 0 0", fontSize: 19, color: "var(--bilimai-text, #202522)" }}>
              {locale === "kk"
                ? "Хронология, тарихи аумақтар, дереккөздер және себеп-салдар"
                : locale === "uz"
                  ? "Xronologiya, tarixiy hududlar, manbalar va sabab-oqibat"
                  : "Хронология, исторические территории, первоисточники и причинно-следственные связи"}
            </h3>
          </div>

          <div
            role="tablist"
            aria-label="Интерактивные исторические инструменты"
            style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
          >
            {(
              ["timeline", "map", "comparison", "sources", "cause_effect"] as const
            ).map((m) => {
              const active = historyMode === m;
              return (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  data-testid={`history-studio-tab-${m}`}
                  onClick={() => setHistoryMode(m)}
                  className="editorial-interactive-btn"
                  style={{
                    padding: "8px 13px",
                    minHeight: 38,
                    borderRadius: 9,
                    border: active
                      ? "1px solid var(--bilimai-selected-border, #156D5D)"
                      : "1px solid var(--bilimai-border, #DCE2DD)",
                    background: active
                      ? "var(--bilimai-brand, #156D5D)"
                      : "var(--bilimai-surface-raised, #F0F2EF)",
                    color: active ? "#FFFFFF" : "var(--bilimai-text, #202522)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  {modeLabels[m][locale]}
                </button>
              );
            })}
          </div>
        </div>

        {/* MODE 1: INTERACTIVE CHRONOLOGY TIMELINE */}
        {historyMode === "timeline" && (
          <div data-testid="history-timeline-panel" style={{ display: "grid", gap: 16 }}>
            <div
              role="group"
              aria-label="Временная шкала эпох"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
                gap: 8
              }}
            >
              {HISTORY_KZ_TIMELINE_ERAS.map((era, idx) => {
                const isSelected = idx === selectedEraIdx;
                return (
                  <button
                    key={era.id}
                    type="button"
                    data-testid={`timeline-era-btn-${idx}`}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedEraIdx(idx)}
                    className="editorial-interactive-btn"
                    style={{
                      textAlign: "left",
                      padding: "11px 13px",
                      minHeight: 62,
                      borderRadius: 11,
                      border: isSelected
                        ? "1.5px solid var(--bilimai-brand, #156D5D)"
                        : "1px solid var(--bilimai-border, #DCE2DD)",
                      background: isSelected
                        ? "var(--bilimai-selected-bg, #E6F2EF)"
                        : "var(--bilimai-surface-raised, #F0F2EF)",
                      color: "var(--bilimai-text, #202522)",
                      cursor: "pointer",
                      display: "grid",
                      gap: 3
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: isSelected
                          ? "var(--bilimai-brand-text, #0F5346)"
                          : "var(--bilimai-text-muted, #525D56)"
                      }}
                    >
                      {era.period[locale]}
                    </span>
                    <strong style={{ fontSize: 13.5, lineHeight: 1.3 }}>
                      {era.title[locale]}
                    </strong>
                  </button>
                );
              })}
            </div>

            <div
              style={{
                padding: "16px 18px",
                borderRadius: 13,
                background: "var(--bilimai-surface-raised, #F0F2EF)",
                border: "1px solid var(--bilimai-border, #DCE2DD)",
                display: "grid",
                gap: 14
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: "var(--bilimai-brand-text, #0F5346)"
                  }}
                >
                  {activeEra.period[locale]}
                </div>
                <h4 style={{ margin: "2px 0 6px", fontSize: 18 }}>{activeEra.title[locale]}</h4>
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    lineHeight: 1.55,
                    color: "var(--bilimai-text-muted, #525D56)"
                  }}
                >
                  {activeEra.context[locale]}
                </p>
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                {activeEra.keyEvents.map((ev, eIdx) => (
                  <div
                    key={eIdx}
                    style={{
                      padding: "11px 14px",
                      borderRadius: 10,
                      background: "var(--bilimai-surface, #FFFFFF)",
                      border: "1px solid var(--bilimai-border, #DCE2DD)",
                      display: "grid",
                      gap: 3
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 6,
                          background: "var(--bilimai-selected-bg, #E6F2EF)",
                          color: "var(--bilimai-selected-text, #0F5346)",
                          fontFamily: "var(--font-mono, monospace)"
                        }}
                      >
                        {ev.date}
                      </span>
                      <strong style={{ fontSize: 14.5 }}>{ev.event[locale]}</strong>
                    </div>
                    <span style={{ fontSize: 13.5, color: "var(--bilimai-text-muted, #525D56)" }}>
                      {ev.significance[locale]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Micro-check after era block */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: 11,
                  background: "var(--bilimai-surface, #FFFFFF)",
                  border: "1px solid var(--bilimai-border, #DCE2DD)",
                  display: "grid",
                  gap: 10
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700 }}>
                  {activeEra.microCheck.prompt[locale]}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 8 }}>
                  {activeEra.microCheck.options[locale].map((opt, oIdx) => {
                    const chosen = selectedAnswer[eraCheckKey];
                    const isPicked = chosen === oIdx;
                    const isRight = oIdx === activeEra.microCheck.correctIndex;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        data-testid={`timeline-microcheck-opt-${oIdx}`}
                        onClick={() =>
                          setSelectedAnswer((prev) => ({ ...prev, [eraCheckKey]: oIdx }))
                        }
                        style={{
                          textAlign: "left",
                          padding: "10px 12px",
                          minHeight: 42,
                          borderRadius: 9,
                          border: isPicked
                            ? isRight
                              ? "1.5px solid var(--bilimai-success-border, #059669)"
                              : "1.5px solid var(--bilimai-error-border, #DC2626)"
                            : "1px solid var(--bilimai-border, #DCE2DD)",
                          background: isPicked
                            ? isRight
                              ? "var(--bilimai-success-bg, #ECFDF5)"
                              : "var(--bilimai-error-bg, #FEF2F2)"
                            : "var(--bilimai-surface-raised, #F0F2EF)",
                          color: "var(--bilimai-text, #202522)",
                          fontSize: 13.5,
                          fontWeight: 500,
                          cursor: "pointer"
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {selectedAnswer[eraCheckKey] !== undefined && (
                  <div
                    role="status"
                    style={{
                      fontSize: 13.5,
                      padding: "9px 12px",
                      borderRadius: 8,
                      background:
                        selectedAnswer[eraCheckKey] === activeEra.microCheck.correctIndex
                          ? "var(--bilimai-success-bg, #ECFDF5)"
                          : "var(--bilimai-warning-bg, #FFFBEB)",
                      color:
                        selectedAnswer[eraCheckKey] === activeEra.microCheck.correctIndex
                          ? "var(--bilimai-success-text, #065F46)"
                          : "var(--bilimai-warning-text, #92400E)"
                    }}
                  >
                    <strong>
                      {selectedAnswer[eraCheckKey] === activeEra.microCheck.correctIndex
                        ? locale === "kk"
                          ? "Дұрыс! "
                          : locale === "uz"
                            ? "To‘g‘ri! "
                            : "Верно! "
                        : locale === "kk"
                          ? "Назар аударыңыз: "
                          : locale === "uz"
                            ? "Diqqat: "
                            : "Обратите внимание: "}
                    </strong>
                    {activeEra.microCheck.explanation[locale]}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: INTERACTIVE HISTORICAL MAP OF KAZAKHSTAN (SVG + Accessible Region Buttons) */}
        {historyMode === "map" && (
          <div data-testid="history-map-panel" style={{ display: "grid", gap: 16 }}>
            <div
              role="group"
              aria-label="Историко-географические регионы Казахстана (доступное управление с клавиатуры)"
              style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
            >
              {HISTORY_KZ_MAP_REGIONS.map((reg) => {
                const active = reg.id === activeRegion.id;
                return (
                  <button
                    key={reg.id}
                    type="button"
                    data-testid={`history-map-region-${reg.id}`}
                    aria-pressed={active}
                    onClick={() => setSelectedRegionId(reg.id)}
                    className="editorial-interactive-btn"
                    style={{
                      padding: "8px 13px",
                      minHeight: 40,
                      borderRadius: 9,
                      border: active
                        ? "1.5px solid var(--bilimai-brand, #156D5D)"
                        : "1px solid var(--bilimai-border, #DCE2DD)",
                      background: active
                        ? "var(--bilimai-selected-bg, #E6F2EF)"
                        : "var(--bilimai-surface-raised, #F0F2EF)",
                      color: active
                        ? "var(--bilimai-selected-text, #0F5346)"
                        : "var(--bilimai-text, #202522)",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <MapPin size={14} />
                    <span>{reg.name[locale]}</span>
                  </button>
                );
              })}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 16,
                alignItems: "start"
              }}
            >
              {/* Interactive Schematic SVG Map of Kazakhstan's 5 Historical Macro-Regions */}
              <div
                style={{
                  padding: "14px",
                  borderRadius: 13,
                  background: "var(--bilimai-surface-raised, #F0F2EF)",
                  border: "1px solid var(--bilimai-border, #DCE2DD)"
                }}
              >
                <svg
                  viewBox="0 0 580 265"
                  role="img"
                  aria-label="Интерактивная схема историко-культурных регионов Казахстана"
                  style={{ width: "100%", height: "auto", display: "block" }}
                >
                  <rect
                    x="8"
                    y="8"
                    width="564"
                    height="249"
                    rx="12"
                    fill="var(--bilimai-surface, #FFFFFF)"
                    stroke="var(--bilimai-border, #DCE2DD)"
                  />
                  {HISTORY_KZ_MAP_REGIONS.map((reg) => {
                    const isSelected = reg.id === activeRegion.id;
                    return (
                      <g
                        key={reg.id}
                        onClick={() => setSelectedRegionId(reg.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <path
                          d={reg.svgCoords.path}
                          fill={
                            isSelected
                              ? "rgba(21, 109, 93, 0.22)"
                              : "rgba(102, 113, 106, 0.1)"
                          }
                          stroke={isSelected ? "#156D5D" : "#8A968E"}
                          strokeWidth={isSelected ? "2.5" : "1.2"}
                        />
                        <circle
                          cx={reg.svgCoords.cx}
                          cy={reg.svgCoords.cy}
                          r={isSelected ? 7 : 5}
                          fill={isSelected ? "#156D5D" : "#525D56"}
                        />
                        <text
                          x={reg.svgCoords.labelX}
                          y={reg.svgCoords.labelY}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight={isSelected ? "700" : "600"}
                          fill="var(--bilimai-text, #202522)"
                        >
                          {reg.name[locale].split(" (")[0]}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Region Historical Details Card */}
              <div
                style={{
                  padding: "16px 18px",
                  borderRadius: 13,
                  background: "var(--bilimai-surface-raised, #F0F2EF)",
                  border: "1px solid var(--bilimai-border, #DCE2DD)",
                  display: "grid",
                  gap: 10
                }}
              >
                <h4 style={{ margin: 0, fontSize: 18 }}>{activeRegion.name[locale]}</h4>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
                  <strong>
                    {locale === "kk"
                      ? "Тайпалар мен мемлекеттер: "
                      : locale === "uz"
                        ? "Qabilalar va davlatlar: "
                        : "Племена и государства: "}
                  </strong>
                  {activeRegion.tribesAndStates[locale]}
                </p>
                <div style={{ fontSize: 13.5 }}>
                  <strong>
                    {locale === "kk"
                      ? "Археологиялық ескерткіштер: "
                      : locale === "uz"
                        ? "Arxeologik yodgorliklar: "
                        : "Археологические памятники: "}
                  </strong>
                  {activeRegion.monuments[locale].join(" · ")}
                </div>
                <div style={{ fontSize: 13.5 }}>
                  <strong>
                    {locale === "kk"
                      ? "Астаналар мен қалалар: "
                      : locale === "uz"
                        ? "Poytaxtlar va shaharlar: "
                        : "Столицы и города: "}
                  </strong>
                  {activeRegion.capitalsAndCities[locale].join(" · ")}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13.5,
                    color: "var(--bilimai-text-muted, #525D56)"
                  }}
                >
                  {activeRegion.historicalRole[locale]}
                </p>

                {/* Regional Micro-Check */}
                <div
                  style={{
                    paddingTop: 10,
                    borderTop: "1px solid var(--bilimai-border, #DCE2DD)",
                    display: "grid",
                    gap: 8
                  }}
                >
                  <strong style={{ fontSize: 13.5 }}>{activeRegion.microCheck.prompt[locale]}</strong>
                  <div style={{ display: "grid", gap: 6 }}>
                    {activeRegion.microCheck.options[locale].map((opt, oIdx) => {
                      const chosen = selectedAnswer[regionCheckKey];
                      const isPicked = chosen === oIdx;
                      const isRight = oIdx === activeRegion.microCheck.correctIndex;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() =>
                            setSelectedAnswer((prev) => ({ ...prev, [regionCheckKey]: oIdx }))
                          }
                          style={{
                            textAlign: "left",
                            padding: "9px 12px",
                            minHeight: 40,
                            borderRadius: 8,
                            border: isPicked
                              ? isRight
                                ? "1.5px solid var(--bilimai-success-border, #059669)"
                                : "1.5px solid var(--bilimai-error-border, #DC2626)"
                              : "1px solid var(--bilimai-border, #DCE2DD)",
                            background: isPicked
                              ? isRight
                                ? "var(--bilimai-success-bg, #ECFDF5)"
                                : "var(--bilimai-error-bg, #FEF2F2)"
                              : "var(--bilimai-surface, #FFFFFF)",
                            color: "var(--bilimai-text, #202522)",
                            fontSize: 13,
                            cursor: "pointer"
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {selectedAnswer[regionCheckKey] !== undefined && (
                    <div
                      role="status"
                      style={{
                        fontSize: 13,
                        color: "var(--bilimai-brand-text, #0F5346)",
                        fontWeight: 500
                      }}
                    >
                      {activeRegion.microCheck.explanation[locale]}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: ERA & LEGAL CODE COMPARISON TABLE */}
        {historyMode === "comparison" && (
          <div
            data-testid="history-comparison-panel"
            style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13.5,
                minWidth: 560
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "var(--bilimai-surface-raised, #F0F2EF)",
                    borderBottom: "1.5px solid var(--bilimai-border, #DCE2DD)",
                    textAlign: "left"
                  }}
                >
                  <th style={{ padding: "10px 12px" }}>
                    {locale === "kk" ? "Критерий" : locale === "uz" ? "Mezon" : "Критерий"}
                  </th>
                  <th style={{ padding: "10px 12px" }}>Қасым ханның қасқа жолы</th>
                  <th style={{ padding: "10px 12px" }}>Есім ханның ескі жолы</th>
                  <th style={{ padding: "10px 12px" }}>Жеті жарғы (Тәуке хан)</th>
                  <th style={{ padding: "10px 12px" }}>Программа «Алаш» (1917)</th>
                </tr>
              </thead>
              <tbody>
                {HISTORY_KZ_ERA_COMPARISON.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    style={{
                      borderBottom: "1px solid var(--bilimai-border, #DCE2DD)"
                    }}
                  >
                    <td style={{ padding: "10px 12px", fontWeight: 700 }}>
                      {row.criterion[locale]}
                    </td>
                    <td style={{ padding: "10px 12px" }}>{row.kasym[locale]}</td>
                    <td style={{ padding: "10px 12px" }}>{row.esim[locale]}</td>
                    <td style={{ padding: "10px 12px" }}>{row.tauke[locale]}</td>
                    <td style={{ padding: "10px 12px" }}>{row.alash[locale]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MODE 4: PRIMARY SOURCES & HISTORICAL PERSONALITIES */}
        {historyMode === "sources" && (
          <div
            data-testid="history-sources-panel"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 12
            }}
          >
            {HISTORY_KZ_TIMELINE_ERAS.map((era) => (
              <div
                key={era.id}
                style={{
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: "var(--bilimai-surface-raised, #F0F2EF)",
                  border: "1px solid var(--bilimai-border, #DCE2DD)",
                  display: "grid",
                  gap: 8
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--bilimai-brand-text, #0F5346)"
                  }}
                >
                  <FileText size={14} />
                  <span>{era.period[locale]}</span>
                </div>
                <strong style={{ fontSize: 15 }}>{era.primarySource.title[locale]}</strong>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    color: "var(--bilimai-text-muted, #525D56)"
                  }}
                >
                  {era.primarySource.excerpt[locale]}
                </p>
                <div
                  style={{
                    paddingTop: 6,
                    borderTop: "1px solid var(--bilimai-border, #DCE2DD)",
                    fontSize: 12.5,
                    color: "var(--bilimai-text, #202522)"
                  }}
                >
                  <strong>
                    {locale === "kk"
                      ? "Тұлғалар: "
                      : locale === "uz"
                        ? "Shaxslar: "
                        : "Исторические личности: "}
                  </strong>
                  {era.figures[locale].join(", ")}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODE 5: CAUSE-AND-EFFECT CHAINS */}
        {historyMode === "cause_effect" && (
          <div data-testid="history-cause-effect-panel" style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {HISTORY_KZ_CAUSE_EFFECT_CHAINS.map((ch, cIdx) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setSelectedChainIdx(cIdx)}
                  style={{
                    padding: "7px 13px",
                    minHeight: 38,
                    borderRadius: 8,
                    border:
                      cIdx === selectedChainIdx
                        ? "1.5px solid var(--bilimai-brand, #156D5D)"
                        : "1px solid var(--bilimai-border, #DCE2DD)",
                    background:
                      cIdx === selectedChainIdx
                        ? "var(--bilimai-selected-bg, #E6F2EF)"
                        : "var(--bilimai-surface-raised, #F0F2EF)",
                    color: "var(--bilimai-text, #202522)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  #{cIdx + 1}: {ch.period}
                </button>
              ))}
            </div>

            <div
              style={{
                padding: "16px 18px",
                borderRadius: 13,
                background: "var(--bilimai-surface-raised, #F0F2EF)",
                border: "1px solid var(--bilimai-border, #DCE2DD)",
                display: "grid",
                gap: 12
              }}
            >
              <div style={{ display: "grid", gap: 8 }}>
                <div
                  style={{
                    padding: "11px 14px",
                    borderRadius: 10,
                    background: "var(--bilimai-surface, #FFFFFF)",
                    border: "1px solid var(--bilimai-border, #DCE2DD)"
                  }}
                >
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: "var(--bilimai-text-muted, #525D56)",
                      display: "block"
                    }}
                  >
                    1. ИСТОРИЧЕСКАЯ ПРИЧИНА / ПРЕДПОСЫЛКА ({activeChain.period})
                  </span>
                  <strong style={{ fontSize: 14.5 }}>{activeChain.cause[locale]}</strong>
                </div>

                <div
                  style={{
                    padding: "11px 14px",
                    borderRadius: 10,
                    background: "var(--bilimai-surface, #FFFFFF)",
                    border: "1px solid var(--bilimai-border, #DCE2DD)"
                  }}
                >
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: "var(--bilimai-brand-text, #0F5346)",
                      display: "block"
                    }}
                  >
                    2. КЛЮЧЕВОЕ СОБЫТИЕ
                  </span>
                  <strong style={{ fontSize: 14.5 }}>{activeChain.event[locale]}</strong>
                </div>
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <strong style={{ fontSize: 14 }}>
                  {locale === "kk"
                    ? "3. Осы оқиғаның тарихи салдарын таңдаңыз:"
                    : locale === "uz"
                      ? "3. Ushbu voqeaning tarixiy oqibatini tanlang:"
                      : "3. Выберите достоверное историческое следствие этого события:"}
                </strong>
                {activeChain.optionsConsequence[locale].map((opt, oIdx) => {
                  const chosen = selectedAnswer[chainCheckKey];
                  const isPicked = chosen === oIdx;
                  const isRight = oIdx === activeChain.correctIndex;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() =>
                        setSelectedAnswer((prev) => ({ ...prev, [chainCheckKey]: oIdx }))
                      }
                      style={{
                        textAlign: "left",
                        padding: "11px 14px",
                        minHeight: 44,
                        borderRadius: 9,
                        border: isPicked
                          ? isRight
                            ? "1.5px solid var(--bilimai-success-border, #059669)"
                            : "1.5px solid var(--bilimai-error-border, #DC2626)"
                          : "1px solid var(--bilimai-border, #DCE2DD)",
                        background: isPicked
                          ? isRight
                            ? "var(--bilimai-success-bg, #ECFDF5)"
                            : "var(--bilimai-error-bg, #FEF2F2)"
                          : "var(--bilimai-surface, #FFFFFF)",
                        color: "var(--bilimai-text, #202522)",
                        fontSize: 13.5,
                        cursor: "pointer"
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
                {selectedAnswer[chainCheckKey] !== undefined && (
                  <div
                    role="status"
                    style={{
                      padding: "10px 12px",
                      borderRadius: 8,
                      background: "var(--bilimai-surface, #FFFFFF)",
                      border: "1px solid var(--bilimai-border, #DCE2DD)",
                      fontSize: 13.5
                    }}
                  >
                    {activeChain.explanation[locale]}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }

  const normalizedSubjectId =
    subjectId === "math_lit"
      ? "math_literacy"
      : subjectId === "reading_lit"
        ? "reading_literacy"
        : subjectId;
  const spec = OTHER_SUBJECT_ADAPTERS[normalizedSubjectId] ?? OTHER_SUBJECT_ADAPTERS.math;
  const guidebook = getSubjectShynKitapGuidebook(subjectId);
  const safeCardIdx =
    selectedCardIdx >= 0 && selectedCardIdx < spec.interactiveCards.length ? selectedCardIdx : 0;
  const activeCard = spec.interactiveCards[safeCardIdx] ?? spec.interactiveCards[0];
  const checkKey = `subj-${subjectId}-${activeCard.id}`;

  const studioTabLabels: Record<"cards" | "rules" | "traps", Record<Locale, string>> = {
    cards: tr(
      `Тренажёр формул (${spec.interactiveCards.length})`,
      `Формула жаттықтырғышы (${spec.interactiveCards.length})`,
      `Formula trenajyori (${spec.interactiveCards.length})`
    ),
    rules: tr(
      "Алтын ережелер · Шың-кітап",
      "Алтын ережелер · Шың-кітап",
      "Oltin qoidalar · Shyn-kitap"
    ),
    traps: tr(
      "ҰБТ қақпандары · Ловушки ЕНТ",
      "ҰБТ қақпандары · Қателер",
      "UNT tuzoqlari · Tipik xatolar"
    )
  };

  return (
    <section
      data-testid={`subject-interactive-adapter-${subjectId}`}
      className="editorial-fade-in"
      style={{
        background: "var(--bilimai-surface, #FFFFFF)",
        border: "1px solid var(--bilimai-border, #DCE2DD)",
        borderRadius: 16,
        padding: "18px 20px",
        display: "grid",
        gap: 14
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          borderBottom: "1px solid var(--bilimai-border, #DCE2DD)",
          paddingBottom: 12
        }}
      >
        <div>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: "0.04em",
              color: "var(--bilimai-brand-text, #0F5346)",
              textTransform: "uppercase"
            }}
          >
            {spec.badge[locale]}
          </span>
          <h3 style={{ margin: "2px 0 4px", fontSize: 18 }}>{spec.title[locale]}</h3>
          <p style={{ margin: 0, fontSize: 14, color: "var(--bilimai-text-muted, #525D56)" }}>
            {spec.subtitle[locale]}
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Режимы интерактивного практикума"
          style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
        >
          {(["cards", "rules", "traps"] as const).map((tabKey) => {
            const active = studioTab === tabKey;
            return (
              <button
                key={tabKey}
                type="button"
                role="tab"
                aria-selected={active}
                data-testid={`subject-studio-tab-${tabKey}`}
                onClick={() => setStudioTab(tabKey)}
                style={{
                  padding: "7px 12px",
                  minHeight: 38,
                  borderRadius: 9,
                  border: active
                    ? "1px solid var(--bilimai-selected-border, #156D5D)"
                    : "1px solid var(--bilimai-border, #DCE2DD)",
                  background: active
                    ? "var(--bilimai-brand, #156D5D)"
                    : "var(--bilimai-surface-raised, #F0F2EF)",
                  color: active ? "#FFFFFF" : "var(--bilimai-text, #202522)",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                {studioTabLabels[tabKey][locale]}
              </button>
            );
          })}
        </div>
      </div>

      {studioTab === "cards" && (
        <div style={{ display: "grid", gap: 12 }}>
          {spec.interactiveCards.length > 1 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {spec.interactiveCards.map((card, cIdx) => {
                const active = cIdx === safeCardIdx;
                return (
                  <button
                    key={card.id}
                    type="button"
                    data-testid={`subject-card-selector-${cIdx}`}
                    onClick={() => setSelectedCardIdx(cIdx)}
                    style={{
                      padding: "6px 12px",
                      minHeight: 36,
                      borderRadius: 999,
                      border: active
                        ? "1.5px solid var(--bilimai-brand, #156D5D)"
                        : "1px solid var(--bilimai-border, #DCE2DD)",
                      background: active
                        ? "var(--bilimai-selected-bg, #E6F2EF)"
                        : "var(--bilimai-surface, #FFFFFF)",
                      color: active
                        ? "var(--bilimai-brand-text, #0F5346)"
                        : "var(--bilimai-text, #202522)",
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    {card.label[locale]}
                  </button>
                );
              })}
            </div>
          )}

          <div
            style={{
              padding: "14px 16px",
              borderRadius: 12,
              background: "var(--bilimai-surface-raised, #F0F2EF)",
              border: "1px solid var(--bilimai-border, #DCE2DD)",
              display: "grid",
              gap: 10
            }}
          >
            <strong style={{ fontSize: 15 }}>{activeCard.label[locale]}</strong>
            <code
              style={{
                display: "block",
                padding: "10px 12px",
                borderRadius: 8,
                background: "var(--bilimai-surface, #FFFFFF)",
                border: "1px solid var(--bilimai-border, #DCE2DD)",
                fontFamily: "var(--font-mono, monospace)",
                fontSize: 14
              }}
            >
              {activeCard.formulaOrRule[locale]}
            </code>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
              {activeCard.explanation[locale]}
            </p>

            <div style={{ display: "grid", gap: 8, paddingTop: 4 }}>
              <strong style={{ fontSize: 13.5 }}>{activeCard.checkPrompt[locale]}</strong>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {activeCard.options[locale].map((opt, oIdx) => {
                  const chosen = selectedAnswer[checkKey];
                  const isPicked = chosen === oIdx;
                  const isRight = oIdx === activeCard.correctIndex;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => setSelectedAnswer((prev) => ({ ...prev, [checkKey]: oIdx }))}
                      style={{
                        padding: "8px 14px",
                        minHeight: 40,
                        borderRadius: 8,
                        border: isPicked
                          ? isRight
                            ? "1.5px solid var(--bilimai-success-border, #059669)"
                            : "1.5px solid var(--bilimai-error-border, #DC2626)"
                          : "1px solid var(--bilimai-border, #DCE2DD)",
                        background: isPicked
                          ? isRight
                            ? "var(--bilimai-success-bg, #ECFDF5)"
                            : "var(--bilimai-error-bg, #FEF2F2)"
                          : "var(--bilimai-surface, #FFFFFF)",
                        color: "var(--bilimai-text, #202522)",
                        fontSize: 13.5,
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {selectedAnswer[checkKey] !== undefined && (
                <div
                  role="status"
                  style={{ fontSize: 13, color: "var(--bilimai-brand-text, #0F5346)" }}
                >
                  {activeCard.feedback[locale]}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {studioTab === "rules" && guidebook && (
        <div
          data-testid={`subject-studio-rules-${subjectId}`}
          style={{ display: "grid", gap: 12 }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 10
            }}
          >
            {guidebook.goldenRules.map((rule) => (
              <div key={rule.id} className="shyn-rule-card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    marginBottom: 4
                  }}
                >
                  <strong style={{ fontSize: 13.5 }}>{rule.title[locale]}</strong>
                  <span className="section-pill" style={{ fontSize: 11 }}>
                    {rule.gradeBand}
                  </span>
                </div>
                <code
                  style={{
                    display: "block",
                    padding: "6px 8px",
                    borderRadius: 6,
                    background: "var(--bilimai-surface, #fff)",
                    fontSize: 12.5,
                    fontWeight: 700,
                    marginBottom: 6
                  }}
                >
                  {rule.formulaOrFact[locale]}
                </code>
                <p style={{ margin: 0, fontSize: 13, color: "var(--bilimai-text-muted, #525D56)" }}>
                  {rule.mnemonicOrTip[locale]}
                </p>
              </div>
            ))}
          </div>

          {guidebook.referenceTables[0] && (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                background: "var(--bilimai-surface-raised, #F0F2EF)",
                border: "1px solid var(--bilimai-border, #DCE2DD)",
                display: "grid",
                gap: 8
              }}
            >
              <strong style={{ fontSize: 13.5 }}>
                {guidebook.referenceTables[0].title[locale]}
              </strong>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 8
                }}
              >
                {guidebook.referenceTables[0].rows.map((row, rIdx) => (
                  <div
                    key={rIdx}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      background: "var(--bilimai-surface, #FFFFFF)",
                      border: "1px solid var(--bilimai-border, #DCE2DD)"
                    }}
                  >
                    <strong style={{ display: "block", fontSize: 12.5 }}>{row.key}</strong>
                    <span style={{ fontSize: 12.5, color: "var(--bilimai-text-muted, #525D56)" }}>
                      {row.value[locale]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {studioTab === "traps" && guidebook && (
        <div
          data-testid={`subject-studio-traps-${subjectId}`}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 10
          }}
        >
          {guidebook.untTraps.map((trap) => (
            <div key={trap.id} className="shyn-trap-card">
              <strong style={{ display: "block", fontSize: 13.5, marginBottom: 4 }}>
                ⚠ {trap.trapTitle[locale]}
              </strong>
              <p style={{ margin: "0 0 6px", fontSize: 13 }}>{trap.wrongHabit[locale]}</p>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--bilimai-brand-text, #0F5346)"
                }}
              >
                ✓ {trap.correctStrategy[locale]}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
