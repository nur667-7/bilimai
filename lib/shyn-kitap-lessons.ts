import type { Language } from "./curriculum.ts";
import type { UntSubjectId } from "./unt-all-subjects.ts";
import type { ContentBlock, UniversalModule } from "./universal-curriculum.ts";

function tr(ru: string, kk?: string, uz?: string): Record<Language, string> {
  return {
    ru,
    kk: kk ?? ru,
    uz: uz ?? ru
  };
}

export const MATH_TOPIC_SHYN_KITAP_NOTES: Record<
  string,
  {
    detailedExplanation: Record<Language, string>;
    extraBlocks: ContentBlock[];
  }
> = {
  probability: {
    detailedExplanation: tr(
      "В «Шың-кітап» задачи по теории вероятностей делятся на 3 класса: 1) Классическая вероятность P(A) = m / n; 2) Сложение несовместных событий («ИЛИ»): P(A ∪ B) = P(A) + P(B) и противоположное событие («хотя бы один раз»): P = 1 − P(ни разу); 3) Умножение независимых событий («И одновременно»): P(A ∩ B) = P(A) · P(B).",
      "«Шың-кітап» бойынша ықтималдық есептері 3 топқа бөлінеді: 1) Классикалық формула P(A) = m / n; 2) Үйлесімсіз оқиғаларды қосу («НЕМЕСЕ»): P(A ∪ B) = P(A) + P(B) және қарама-қарсы оқиға («кемінде бір рет»): P = 1 − P(бірде-бір рет емес); 3) Тәуелсіз оқиғаларды көбейту («ЖӘНЕ»): P(A ∩ B) = P(A) · P(B).",
      "«Shyn-kitap» bo‘yicha ehtimollik masalalari 3 turga bo‘linadi: 1) Klassik formula P(A) = m / n; 2) Qo‘shish («YOKI»): P(A) + P(B) va qarama-qarshi hodisa P = 1 − P(hech biri); 3) Ko‘paytirish («VA»): P(A) · P(B)."
    ),
    extraBlocks: [
      {
        type: "table",
        title: tr("Шың-кітап: Сложение («ИЛИ») vs Умножение («И») вероятностей", "Шың-кітап: Ықтималдықтарды қосу («НЕМЕСЕ») және көбейту («ЖӘНЕ»)", "Shyn-kitap: Ehtimolliklarni qo‘shish va ko‘paytirish"),
        body: tr(
          "• Противоположное событие: P(A̅) = 1 − P(A).\n• Два стрелка попадают независимо (P₁ и P₂): вероятность, что попадут ОБА = P₁·P₂; вероятность, что попадёт ХОТЯ БЫ ОДИН = 1 − (1 − P₁)(1 − P₂).",
          "• Қарама-қарсы оқиға: P(A̅) = 1 − P(A).\n• Екі мергеннің ЕКЕУІ ДЕ тигізу ықтималдығы = P₁·P₂; КЕМІНДЕ БІРЕУІ тигізуі = 1 − (1 − P₁)(1 − P₂).",
          "• Qarama-qarshi hodisa: P(A̅) = 1 − P(A).\n• Kamida bittasi tegishi = 1 − (1 − P₁)(1 − P₂)."
        )
      }
    ]
  },
  quadratic: {
    detailedExplanation: tr(
      "По «Шың-кітап» для уравнения ax² + bx + c = 0: 1) При D = b² − 4ac > 0 два корня; при D = 0 один кратный корень x = −b/(2a); при D < 0 действительных корней нет. 2) По теореме Виета x₁ + x₂ = −b/a и x₁x₂ = c/a. 3) Частные случаи НЦТ: если a + b + c = 0, то x₁ = 1, x₂ = c/a; если a − b + c = 0, то x₁ = −1, x₂ = −c/a.",
      "«Шың-кітап» бойынша ax² + bx + c = 0 теңдеуінде: 1) D = b² − 4ac > 0 болса 2 түбір; D = 0 болса x = −b/(2a); D < 0 болса нақты түбір жоқ. 2) Виет теоремасы: x₁ + x₂ = −b/a, x₁x₂ = c/a. 3) ҰБТ жылдам ережесі: егер a + b + c = 0 болса, онда x₁ = 1, x₂ = c/a; егер a − b + c = 0 болса, онда x₁ = −1, x₂ = −c/a.",
      "«Shyn-kitap» bo‘yicha ax² + bx + c = 0: 1) D = b² − 4ac; 2) Viyet teoremasi: x₁ + x₂ = −b/a, x₁x₂ = c/a; 3) Agar a + b + c = 0 bo‘lsa, x₁ = 1, x₂ = c/a."
    ),
    extraBlocks: [
      {
        type: "formula",
        title: tr("Шың-кітап: Коэффициентный лайфхак (за 5 секунд на ЕНТ)", "Шың-кітап: Коэффициенттер қосындысы әдісі (5 секундта)", "Shyn-kitap: Koeffitsiyentlar yig‘indisi usuli"),
        body: tr(
          "• Если a + b + c = 0 ⇒ x₁ = 1, x₂ = c/a (например, 5x² − 13x + 8 = 0 ⇒ x₁ = 1, x₂ = 8/5).\n• Если a − b + c = 0 ⇒ x₁ = −1, x₂ = −c/a.\n• Сумма квадратов корней: x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂.",
          "• Егер a + b + c = 0 ⇒ x₁ = 1, x₂ = c/a (мысалы, 5x² − 13x + 8 = 0 ⇒ x₁ = 1, x₂ = 8/5).\n• Егер a − b + c = 0 ⇒ x₁ = −1, x₂ = −c/a.\n• Түбірлер квадратының қосындысы: x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂.",
          "• Agar a + b + c = 0 ⇒ x₁ = 1, x₂ = c/a.\n• Agar a − b + c = 0 ⇒ x₁ = −1, x₂ = −c/a."
        )
      }
    ]
  },
  progressions: {
    detailedExplanation: tr(
      "В «Шың-кітап» сопоставляются две прогрессии: Арифметическая (каждый член отличается на +d: aₙ = a₁ + (n−1)d, Sₙ = (a₁ + aₙ)n/2, среднее арифметическое aₙ = (aₙ₋₁ + aₙ₊₁)/2) и Геометрическая (каждый член умножается на q: bₙ = b₁·qⁿ⁻¹, Sₙ = b₁(qⁿ − 1)/(q − 1), среднее геометрическое bₙ² = bₙ₋₁·bₙ₊₁; при |q| < 1 сумма S = b₁/(1 − q)).",
      "«Шың-кітап» бойынша екі прогрессия: Арифметикалық (aₙ = a₁ + (n−1)d, Sₙ = (a₁ + aₙ)n/2, сипаттамалық қасиеті aₙ = (aₙ₋₁ + aₙ₊₁)/2) және Геометриялық (bₙ = b₁·qⁿ⁻¹, Sₙ = b₁(qⁿ − 1)/(q − 1), bₙ² = bₙ₋₁·bₙ₊₁; |q| < 1 болғанда S = b₁/(1 − q)).",
      "«Shyn-kitap» bo‘yicha Arifmetik (aₙ = a₁ + (n−1)d, Sₙ = (a₁ + aₙ)n/2) va Geometrik progressiya (bₙ = b₁·qⁿ⁻¹, |q| < 1 da S = b₁/(1 − q))."
    ),
    extraBlocks: [
      {
        type: "table",
        title: tr("Шың-кітап: Сравнение арифметической и геометрической прогрессий", "Шың-кітап: Арифметикалық және геометриялық прогрессиялар кестесі", "Shyn-kitap: Arifmetik va geometrik progressiyalar jadvali"),
        body: tr(
          "• Переход от k-го к n-му члену АП: aₙ = aₖ + (n − k)d ⇒ d = (aₙ − aₖ)/(n − k).\n• Сумма бесконечно убывающей ГП (|q| < 1): S = b₁ / (1 − q).\n• Перевод периодической дроби 0,(36): b₁ = 0,36, q = 0,01 ⇒ S = 0,36 / 0,99 = 4/11.",
          "• АП-да k-шы мүшеден n-ші мүшеге өту: aₙ = aₖ + (n − k)d ⇒ d = (aₙ − aₖ)/(n − k).\n• Шексіз кемімелі ГП қосындысы: S = b₁ / (1 − q).\n• Периодты бөлшек: 0,(36) = 36/99 = 4/11.",
          "• AP: d = (aₙ − aₖ)/(n − k).\n• Cheksiz kamayuvchi GP: S = b₁ / (1 − q)."
        )
      }
    ]
  },
  inequalities: {
    detailedExplanation: tr(
      "Метод интервалов по «Шың-кітап»: 1) Перенести всё влево, разложить числитель и знаменатель на линейные множители вида (x − xᵢ); 2) Нанести нули числителя и знаменателя на ось (нули знаменателя ВСЕГДА выколоты!); 3) Если множитель стоит в ЧЁТНОЙ степени (x − a)², вокруг точки a знак НЕ меняется (образуется петелька).",
      "«Шың-кітап» бойынша интервалдар әдісі: 1) Барлық мүшені солға шығарып, (x − xᵢ) көбейткіштеріне жіктеу; 2) Алым мен бөлім нөлдерін сан осіне салу (бөлім нөлдері ӘРҚАШАН боялмайды!); 3) Егер көбейткіш ЖҰП дәрежеде (x − a)² болса, a нүктесі арқылы өткенде таңба ӨЗГЕРМЕЙДІ.",
      "«Shyn-kitap» bo‘yicha intervallar usuli: 1) Ko‘paytuvchilarga ajratish; 2) Maxraj nollari har doim ochiq nuqta bo‘ladi; 3) Juft darajali (x − a)² omilda ishora o‘zgarmaydi."
    ),
    extraBlocks: [
      {
        type: "formula",
        title: tr("Шың-кітап: Неравенства с модулем |f(x)| < a и |f(x)| > a", "Шың-кітап: Модульді теңсіздіктер |f(x)| < a және |f(x)| > a", "Shyn-kitap: Modulli tengsizliklar"),
        body: tr(
          "• |f(x)| < a (при a > 0) ⇔ двойное неравенство (система): −a < f(x) < a.\n• |f(x)| > a (при a > 0) ⇔ совокупность двух лучей: f(x) > a ИЛИ f(x) < −a.\n• Ловушка ЕНТ: неравенство |f(x)| < −2 НЕ имеет решений (модуль неотрицателен).",
          "• |f(x)| < a (a > 0) ⇔ қос теңсіздік (жүйе): −a < f(x) < a.\n• |f(x)| > a (a > 0) ⇔ жиынтық: f(x) > a НЕМЕСЕ f(x) < −a.\n• ҰБТ қақпаны: |f(x)| < −2 теңсіздігінің шешімі жоқ.",
          "• |f(x)| < a ⇔ −a < f(x) < a.\n• |f(x)| > a ⇔ f(x) > a yoki f(x) < −a."
        )
      }
    ]
  },
  systems: {
    detailedExplanation: tr(
      "По «Шың-кітап» системы уравнений решаются тремя приёмами: 1) Алгебраическое сложение (уравнивание коэффициентов с противоположными знаками); 2) Подстановка; 3) Симметрические системы {x + y = u, xy = v}, которые сводятся к квадратному уравнению t² − ut + v = 0 по обратной теореме Виета.",
      "«Шың-кітап» бойынша теңдеулер жүйесін шешудің 3 әдісі: 1) Алгебралық қосу әдісі; 2) Алмастыру әдісі; 3) Симметриялы жүйелер {x + y = u, xy = v} — кері Виет теоремасы арқылы t² − ut + v = 0 квадрат теңдеуіне келтіріледі.",
      "«Shyn-kitap» bo‘yicha tenglamalar sistemasini yechishning 3 usuli: 1) Qo‘shish; 2) O‘rniga qo‘yish; 3) Simmetrik sistemalar {x + y = u, xy = v}."
    ),
    extraBlocks: [
      {
        type: "formula",
        title: tr("Шың-кітап: Полезные тождества для нелинейных систем ЕНТ", "Шың-кітап: Сызықтық емес жүйелерге арналған тепе-теңдіктер", "Shyn-kitap: Nochiziqli sistemalar uchun ayniyatlar"),
        body: tr(
          "• x² + y² = (x + y)² − 2xy.\n• x³ + y³ = (x + y)((x + y)² − 3xy).\n• Условие отсутствия решений линейной системы {a₁x + b₁y = c₁, a₂x + b₂y = c₂}: a₁/a₂ = b₁/b₂ ≠ c₁/c₂ (параллельные прямые).",
          "• x² + y² = (x + y)² − 2xy.\n• x³ + y³ = (x + y)((x + y)² − 3xy).\n• Сызықтық жүйенің шешімі болмау шарты: a₁/a₂ = b₁/b₂ ≠ c₁/c₂.",
          "• x² + y² = (x + y)² − 2xy.\n• Yechim yo‘qlik sharti: a₁/a₂ = b₁/b₂ ≠ c₁/c₂."
        )
      }
    ]
  },
  combinatorics: {
    detailedExplanation: tr(
      "В «Шың-кітап» выбор формулы комбинаторики определяется двумя вопросами: 1) Важен ли порядок элементов? Если ДА (шифры, призовые места, числа из цифр) — Размещения Aₙᵏ = n!/(n−k)! или Перестановки Pₙ = n!. Если НЕТ (команда, дежурные, хор, треугольники по точкам) — Сочетания Cₙᵏ = n!/(k!(n−k)!). 2) Бином Ньютона: (a + b)ⁿ = Σ Cₙᵏ aⁿ⁻ᵏ bᵏ.",
      "«Шың-кітап» бойынша комбинаторика формуласын таңдау: 1) Элементтердің реті маңызды ма? ИӘ болса (код, жүлделі орындар, сан құрастыру) — Орналастыру Aₙᵏ = n!/(n−k)! немесе Алмастыру Pₙ = n!. ЖОҚ болса (команда, кезекшілер, қол алысу) — Теру Cₙᵏ = n!/(k!(n−k)!). 2) Ньютон биномы: (a + b)ⁿ = Σ Cₙᵏ aⁿ⁻ᵏ bᵏ.",
      "«Shyn-kitap» bo‘yicha kombinatorika: tartib muhim bo‘lsa — Aₙᵏ = n!/(n−k)!, tartib muhim bo‘lmasa — Cₙᵏ = n!/(k!(n−k)!)."
    ),
    extraBlocks: [
      {
        type: "table",
        title: tr("Шың-кітап: Шпаргалка комбинаторики для ЕНТ", "Шың-кітап: ҰБТ комбинаторика кестесі", "Shyn-kitap: UNT kombinatorika jadvali"),
        body: tr(
          "• 0! = 1; Cₙ⁰ = Cₙⁿ = 1; Cₙ¹ = n; Cₙᵏ = Cₙⁿ⁻ᵏ.\n• Число диагоналей выпуклого n-угольника: D = n(n − 3) / 2.\n• Сумма всех биномиальных коэффициентов разложения (a + b)ⁿ равна 2ⁿ.",
          "• 0! = 1; Cₙ⁰ = Cₙⁿ = 1; Cₙ¹ = n; Cₙᵏ = Cₙⁿ⁻ᵏ.\n• Дөңес n-бұрыштың диагональдар саны: D = n(n − 3) / 2.\n• (a + b)ⁿ жіктелуінің барлық биномдық коэффициенттерінің қосындысы = 2ⁿ.",
          "• 0! = 1; Cₙᵏ = Cₙⁿ⁻ᵏ.\n• n-burchak diagonallari soni: D = n(n − 3) / 2."
        )
      }
    ]
  },
  radicals: {
    detailedExplanation: tr(
      "По «Шың-кітап» преобразование корней и степеней опирается на 3 правила: 1) Извлечение корня чётной степени даёт модуль: √(A²) = |A|; 2) Избавление от иррациональности в знаменателе дроби m / (√a ± √b) выполняется умножением на сопряжённое выражение (√a ∓ √b), что в знаменателе даёт разность квадратов (a − b); 3) Сложный радикал √(A ± 2√B) сворачивается в |√x ± √y|, где x + y = A и x·y = B.",
      "«Шың-кітап» бойынша түбірлер мен дәрежелерді түрлендірудің 3 алтын ережесі: 1) Жұп дәрежелі түбірден модуль шығады: √(A²) = |A|; 2) Бөлімдегі иррационалдықтан құтылу үшін m / (√a ± √b) бөлшегін түйіндес (√a ∓ √b) өрнегіне көбейтеміз; 3) Күрделі түбір √(A ± 2√B) = |√x ± √y|, мұндағы x + y = A және x·y = B.",
      "«Shyn-kitap» bo‘yicha ildizlar: 1) √(A²) = |A|; 2) Maxrajni irratsionallikdan qutqarish uchun qo‘shma (√a ∓ √b) ifodaga ko‘paytiriladi; 3) √(A ± 2√B) = |√x ± √y|."
    ),
    extraBlocks: [
      {
        type: "formula",
        title: tr("Шың-кітап: Формула сложного радикала и ФСУ", "Шың-кітап: Күрделі түбір формуласы және ҚКФ", "Shyn-kitap: Murakkab ildiz formulasi"),
        body: tr(
          "• √(7 + 2√10): ищем числа с суммой 7 и произведением 10 ⇒ 5 и 2 ⇒ ответ √5 + √2.\n• a³ − b³ = (a − b)(a² + ab + b²); a³ + b³ = (a + b)(a² − ab + b²).\n• a^(−n) = 1 / aⁿ; a^(m/n) = ⁿ√(aᵐ).",
          "• √(7 + 2√10): қосындысы 7, көбейтіндісі 10 болатын сандар 5 пен 2 ⇒ жауабы √5 + √2.\n• a³ − b³ = (a − b)(a² + ab + b²); a³ + b³ = (a + b)(a² − ab + b²).",
          "• √(7 + 2√10) = √5 + √2.\n• a³ ± b³ = (a ± b)(a² ∓ ab + b²)."
        )
      }
    ]
  },
  functions: {
    detailedExplanation: tr(
      "По «Шың-кітап» для логарифма logₐ b = c (где aᶜ = b) обязательно выполнение ОДЗ: b > 0, a > 0, a ≠ 1. Ключевые свойства: logₐ(xy) = logₐx + logₐy; logₐ(x/y) = logₐx − logₐy; log_(aⁿ)(xᵐ) = (m/n)logₐx; основное логарифмическое тождество a^(logₐb) = b; переход к новому основанию logₐb = log_c(b)/log_c(a), откуда logₐb · log_b(a) = 1.",
      "«Шың-кітап» бойынша logₐ b = c логарифмінің АОО-сы: b > 0, a > 0, a ≠ 1. Негізгі қасиеттері: logₐ(xy) = logₐx + logₐy; logₐ(x/y) = logₐx − logₐy; log_(aⁿ)(xᵐ) = (m/n)logₐx; негізгі логарифмдік тепе-теңдік a^(logₐb) = b; жаңа негізге көшу logₐb · log_b(a) = 1.",
      "«Shyn-kitap» bo‘yicha logₐ b = c uchun aniqlanish sohasi: b > 0, a > 0, a ≠ 1. Xossalari: logₐ(xy) = logₐx + logₐy; log_(aⁿ)(xᵐ) = (m/n)logₐx; a^(logₐb) = b."
    ),
    extraBlocks: [
      {
        type: "table",
        title: tr("Шың-кітап: ОДЗ функций и логарифмические неравенства", "Шың-кітап: Функциялардың АОО-сы және логарифмдік теңсіздіктер", "Shyn-kitap: Funksiyalar aniqlanish sohasi"),
        body: tr(
          "• При a > 1: logₐ f(x) > logₐ g(x) ⇔ { f(x) > g(x), g(x) > 0 }.\n• При 0 < a < 1: logₐ f(x) > logₐ g(x) ⇔ { f(x) < g(x), f(x) > 0 } (знак меняется!).\n• Область определения y = √(f(x)) ⇒ f(x) ≥ 0; y = 1/√(f(x)) ⇒ f(x) > 0.",
          "• a > 1 болғанда: logₐ f(x) > logₐ g(x) ⇔ { f(x) > g(x), g(x) > 0 }.\n• 0 < a < 1 болғанда: logₐ f(x) > logₐ g(x) ⇔ { f(x) < g(x), f(x) > 0 } (таңба ауысады!).",
          "• a > 1 da ishora saqlanadi; 0 < a < 1 da ishora o‘zgaradi va f(x) > 0 sharti qo‘yiladi."
        )
      }
    ]
  },
  trigonometry: {
    detailedExplanation: tr(
      "По «Шың-кітап» тригонометрия на ЕНТ держится на 4 блоках: 1) Основное тождество sin²x + cos²x = 1, tg x · ctg x = 1; 2) Формулы двойного угла: sin 2x = 2 sin x cos x, cos 2x = cos²x − sin²x = 2cos²x − 1 = 1 − 2sin²x; 3) Формулы приведения (при π±x и 2π±x функция НЕ меняется, при π/2±x и 3π/2±x меняется на кофункцию; знак — по исходной функции); 4) Множество значений a sin x + b cos x ∈ [−√(a²+b²); √(a²+b²)].",
      "«Шың-кітап» бойынша ҰБТ тригонометриясының 4 тірегі: 1) Негізгі тепе-теңдік sin²x + cos²x = 1, tg x · ctg x = 1; 2) Қос бұрыш формулалары: sin 2x = 2 sin x cos x, cos 2x = cos²x − sin²x; 3) Келтіру формулалары (π±x, 2π±x-те атауы өзгермейді; π/2±x, 3π/2±x-те кофункцияға ауысады); 4) a sin x + b cos x өрнегінің мәндер жиыны [−√(a²+b²); √(a²+b²)].",
      "«Shyn-kitap» bo‘yicha trigonometriya: 1) sin²x + cos²x = 1; 2) sin 2x = 2 sin x cos x, cos 2x = cos²x − sin²x; 3) a sin x + b cos x ∈ [−√(a²+b²); √(a²+b²)]."
    ),
    extraBlocks: [
      {
        type: "table",
        title: tr("Шың-кітап: Табличные углы и оценка 3sin x + 4cos x", "Шың-кітап: Негізгі бұрыштар және 3sin x + 4cos x бағалауы", "Shyn-kitap: Asosiy burchaklar va 3sin x + 4cos x"),
        body: tr(
          "• sin 30° = cos 60° = 1/2; sin 45° = cos 45° = √2/2; sin 60° = cos 30° = √3/2.\n• Наибольшее значение y = 3sin x − 4cos x равно √(3² + (−4)²) = 5, наименьшее равно −5.\n• Период функции y = sin(kx + b) равен T = 2π/|k|, а для y = tg(kx + b) равен T = π/|k|.",
          "• sin 30° = cos 60° = 1/2; sin 45° = cos 45° = √2/2; sin 60° = cos 30° = √3/2.\n• y = 3sin x − 4cos x ең үлкен мәні √(3² + 4²) = 5, ең кіші мәні −5.\n• y = sin(kx + b) периоды T = 2π/|k|, ал y = tg(kx + b) периоды T = π/|k|.",
          "• y = 3sin x − 4cos x ning eng katta qiymati √(3² + 4²) = 5.\n• sin(kx) davri T = 2π/|k|, tg(kx) davri T = π/|k|."
        )
      }
    ]
  },
  derivative: {
    detailedExplanation: tr(
      "По «Шың-кітап» у производной f′(x) три применения на ЕНТ: 1) Геометрический смысл: угловой коэффициент касательной k = tg α = f′(x₀), уравнение касательной y = f(x₀) + f′(x₀)(x − x₀); 2) Физический смысл: скорость v(t) = s′(t), ускорение a(t) = v′(t) = s″(t) (при остановке тела v(t) = 0); 3) Экстремумы: в точке максимума f′(x) меняет знак с «+» на «−», в точке минимума — с «−» на «+».",
      "«Шың-кітап» бойынша туындының ҰБТ-дағы 3 қолданысы: 1) Геометриялық мағынасы: k = tg α = f′(x₀), жанама теңдеуі y = f(x₀) + f′(x₀)(x − x₀); 2) Физикалық мағынасы: жылдамдық v(t) = s′(t), үдеу a(t) = v′(t) (дене тоқтағанда v(t) = 0); 3) Экстремум: максимум нүктесінде f′(x) таңбасы «+»-тен «−»-ке, минимумда «−»-тен «+»-ке ауысады.",
      "«Shyn-kitap» bo‘yicha hosilaning 3 qo‘llanilishi: 1) Geometrik ma’nosi: k = tg α = f′(x₀); 2) Fizik ma’nosi: v(t) = s′(t), a(t) = v′(t); 3) Ekstremum nuqtalarida f′(x) = 0."
    ),
    extraBlocks: [
      {
        type: "formula",
        title: tr("Шың-кітап: Правила дифференцирования произведения и сложной функции", "Шың-кітап: Көбейтінді мен күрделі функция туындысы", "Shyn-kitap: Ko‘paytma va murakkab funksiya hosilasi"),
        body: tr(
          "• (u · v)′ = u′v + uv′; (u / v)′ = (u′v − uv′) / v².\n• Сложная функция: (f(kx + b))′ = k · f′(kx + b) (например, (sin 3x)′ = 3 cos 3x).\n• (√x)′ = 1 / (2√x); (ln x)′ = 1/x; (eˣ)′ = eˣ.",
          "• (u · v)′ = u′v + uv′; (u / v)′ = (u′v − uv′) / v².\n• Күрделі функция: (f(kx + b))′ = k · f′(kx + b) (мысалы, (sin 3x)′ = 3 cos 3x).\n• (√x)′ = 1 / (2√x); (ln x)′ = 1/x; (eˣ)′ = eˣ.",
          "• (u · v)′ = u′v + uv′; (sin 3x)′ = 3 cos 3x; (√x)′ = 1 / (2√x)."
        )
      }
    ]
  },
  integrals: {
    detailedExplanation: tr(
      "По «Шың-кітап» первообразная F(x) удовлетворяет условию F′(x) = f(x). Определённый интеграл вычисляется по формуле Ньютона-Лейбница: ∫ₐᵇ f(x)dx = F(b) − F(a). Площадь фигуры, ограниченной сверху графиком y = f(x) и снизу y = g(x) на [a; b], равна S = ∫ₐᵇ (f(x) − g(x))dx (пределы a и b находятся из уравнения пересечения f(x) = g(x)).",
      "«Шың-кітап» бойынша алғашқы функция F′(x) = f(x) шартын қанағаттандырады. Анықталған интеграл Ньютон-Лейбниц формуласымен есептеледі: ∫ₐᵇ f(x)dx = F(b) − F(a). Қисықсызықты трапеция ауданы: S = ∫ₐᵇ (f(x) − g(x))dx (шектері f(x) = g(x) теңдеуінен табылады).",
      "«Shyn-kitap» bo‘yicha boshlang‘ich funksiya F′(x) = f(x). Nyuton-Leybnits formulasi: ∫ₐᵇ f(x)dx = F(b) − F(a). Yuzani topish: S = ∫ₐᵇ (f(x) − g(x))dx."
    ),
    extraBlocks: [
      {
        type: "formula",
        title: tr("Шың-кітап: Экспресс-формула площади параболического сегмента", "Шың-кітап: Параболалық сегмент ауданының жедел формуласы", "Shyn-kitap: Parabolik segment yuzining tezkor formulasi"),
        body: tr(
          "• Табличная первообразная: ∫ xⁿ dx = xⁿ⁺¹/(n + 1) + C; ∫ dx/cos²x = tg x + C.\n• Лайфхак Шың-кітап: площадь фигуры между параболой y = ax² + bx + c и прямой с абсциссами пересечения x₁ < x₂ равна S = |a| · (x₂ − x₁)³ / 6 (экономит 3 минуты на ЕНТ!).",
          "• Кестелік интеграл: ∫ xⁿ dx = xⁿ⁺¹/(n + 1) + C.\n• Шың-кітап лайфхакы: парабола мен түзу қиылысқандағы (x₁ < x₂) фигура ауданы: S = |a| · (x₂ − x₁)³ / 6!",
          "• Shyn-kitap layfxaki: parabola va to‘g‘ri chiziq orasidagi yuza S = |a| · (x₂ − x₁)³ / 6."
        )
      }
    ]
  },
  planimetry: {
    detailedExplanation: tr(
      "По «Шың-кітап» в планиметрии ЕНТ ключевую роль играют 5 формул площади треугольника (S = ½ah, S = ½ab sin γ, формула Герона, S = p·r, S = abc/(4R)), теорема синусов a/sin α = 2R и теорема косинусов c² = a² + b² − 2ab cos γ. В прямоугольном треугольнике радиус описанной окружности R = c/2 (половина гипотенузы), а вписанной r = (a + b − c)/2.",
      "«Шың-кітап» бойынша планиметрияда үшбұрыш ауданының 5 формуласы (S = ½ah, S = ½ab sin γ, Герон формуласы, S = p·r, S = abc/(4R)), синустар теоремасы a/sin α = 2R және косинустар теоремасы c² = a² + b² − 2ab cos γ қолданылады. Тікбұрышты үшбұрышта R = c/2, ал r = (a + b − c)/2.",
      "«Shyn-kitap» bo‘yicha uchburchak yuzining 5 formulasi, sinuslar teoremasi a/sin α = 2R va kosinuslar teoremasi. To‘g‘ri burchakli uchburchakda R = c/2, r = (a + b − c)/2."
    ),
    extraBlocks: [
      {
        type: "table",
        title: tr("Шың-кітап: Радиусы r и R и пифагоровы тройки ЕНТ", "Шың-кітап: r мен R радиустары және Пифагор үштіктері", "Shyn-kitap: r va R radiuslari hamda Pifagor uchliklari"),
        body: tr(
          "• Пифагоровы тройки: (3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25).\n• Правильный треугольник со стороной a: S = a²√3 / 4, R = a√3 / 3, r = a√3 / 6 (R = 2r).\n• В описанном четырёхугольнике a + c = b + d; во вписанном α + γ = 180°.",
          "• Пифагор үштіктері: (3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25).\n• Дұрыс үшбұрыш: S = a²√3 / 4, R = a√3 / 3, r = a√3 / 6 (R = 2r).",
          "• Pifagor uchliklari: (3, 4, 5), (5, 12, 13), (8, 15, 17).\n• Muntazam uchburchak: S = a²√3 / 4, R = 2r."
        )
      }
    ]
  },
  vectors: {
    detailedExplanation: tr(
      "По «Шың-кітап» для вектора AB с началом A(x₁, y₁, z₁) и концом B(x₂, y₂, z₂) координаты находятся вычитанием КОНЕЦ минус НАЧАЛО: AB = (x₂ − x₁; y₂ − y₁; z₂ − z₁). Длина |a| = √(x² + y² + z²). Скалярное произведение a·b = x₁x₂ + y₁y₂ + z₁z₂ = |a|·|b|·cos φ. Условие перпендикулярности (φ = 90°): a·b = 0; условие коллинеарности: x₁/x₂ = y₁/y₂ = z₁/z₂.",
      "«Шың-кітап» бойынша AB векторының координаталары: СОҢЫ азайту БАСЫ: AB = (x₂ − x₁; y₂ − y₁; z₂ − z₁). Ұзындығы |a| = √(x² + y² + z²). Скаляр көбейтінді a·b = x₁x₂ + y₁y₂ + z₁z₂ = |a|·|b|·cos φ. Перпендикулярлық шарты: a·b = 0; коллинеарлық шарты: x₁/x₂ = y₁/y₂ = z₁/z₂.",
      "«Shyn-kitap» bo‘yicha AB vektor koordinatalari: OXIRI minus BOSHI. Skalyar ko‘paytma a·b = x₁x₂ + y₁y₂ + z₁z₂. Perpendikulyarlik sharti: a·b = 0."
    ),
    extraBlocks: [
      {
        type: "formula",
        title: tr("Шың-кітап: Косинус угла между векторами и середина отрезка", "Шың-кітап: Векторлар арасындағы бұрыш косинусы", "Shyn-kitap: Vektorlar orasidagi burchak kosinusi"),
        body: tr(
          "• cos φ = (x₁x₂ + y₁y₂ + z₁z₂) / (√(x₁²+y₁²+z₁²) · √(x₂²+y₂²+z₂²)).\n• Координаты середины отрезка AB: M((x₁+x₂)/2; (y₁+y₂)/2; (z₁+z₂)/2).\n• |a ± b|² = |a|² ± 2(a·b) + |b|².",
          "• cos φ = (x₁x₂ + y₁y₂ + z₁z₂) / (|a| · |b|).\n• Кесінді ортасының координаталары: M((x₁+x₂)/2; (y₁+y₂)/2; (z₁+z₂)/2).\n• |a ± b|² = |a|² ± 2(a·b) + |b|².",
          "• cos φ = (a · b) / (|a| · |b|).\n• Kesma o‘rtasi: M((x₁+x₂)/2; (y₁+y₂)/2)."
        )
      }
    ]
  },
  stereometry: {
    detailedExplanation: tr(
      "По «Шың-кітап» все тела стереометрии делятся на две группы: 1) Призма и Цилиндр (два равных основания): V = S_осн · h, S_бок = P_осн · h (для цилиндра 2πRh); 2) Пирамида и Конус (одно основание и вершина): V = ⅓ S_осн · h, S_бок = ½ P_осн · l (для конуса πRl, где l = √(R² + h²) — образующая). Для шара и сферы: V = (4/3)πR³, S = 4πR². Диагональ куба d = a√3.",
      "«Шың-кітап» бойынша стереометрия денелері 2 топқа бөлінеді: 1) Призма мен Цилиндр: V = S_таб · h, S_бүйір = P_таб · h (цилиндр үшін 2πRh); 2) Пирамида мен Конус: V = ⅓ S_таб · h, S_бүйір = ½ P_таб · l (конус үшін πRl, мұндағы l = √(R² + h²)). Шар мен сфера: V = (4/3)πR³, S = 4πR². Куб диагоналі d = a√3.",
      "«Shyn-kitap» bo‘yicha: 1) Prizma va Silindr: V = S_asos · h; 2) Piramida va Konus: V = ⅓ S_asos · h, konus yon sirti S = πRl; Shar hajmi V = (4/3)πR³, sfera yuzi S = 4πR²."
    ),
    extraBlocks: [
      {
        type: "table",
        title: tr("Шың-кітап: Подобие объёмов и площадей при масштабировании", "Шың-кітап: Көлемдер мен аудандардың ұқсастық коэффициенті", "Shyn-kitap: Hajmlar va yuzalarning o‘xshashlik koeffitsiyenti"),
        body: tr(
          "• При увеличении всех линейных размеров тела в k раз: площадь поверхности растёт в k² раз, а объём — в k³ раз!\n• Диагональ прямоугольного параллелепипеда: d² = a² + b² + c².\n• Радиус шара, вписанного в куб со стороной a: r = a/2; описанного около куба: R = a√3 / 2.",
          "• Дененің сызықтық өлшемдерін k есе арттырғанда: бетінің ауданы k² есе, ал көлемі k³ есе артады!\n• Тікбұрышты параллелепипед диагоналі: d² = a² + b² + c².\n• Кубқа іштей сызылған шар радиусы r = a/2, сырттай сызылған шар радиусы R = a√3 / 2.",
          "• Chiziqli o‘lchamlar k marta ortsa: yuza k² marta, hajm k³ marta ortadi!\n• Parallelepiped diagonali: d² = a² + b² + c²."
        )
      }
    ]
  }
};

export const SHYN_KITAP_MODULES_BY_SUBJECT: Record<Exclude<UntSubjectId, "math">, UniversalModule[]> = {
  history_kz: [
    {
      id: "history_kz-mod-1",
      subjectId: "history_kz",
      title: tr("Модуль 1. Древний и средневековый Казахстан (Шың-кітап: VI в. до н. э. – XV в.)", "1-модуль. Ежелгі және ортағасырлық Қазақстан (Шың-кітап)", "1-modul. Qadimgi va o‘rta asrlar Qozog‘istoni (Shyn-kitap)"),
      summary: tr("Археология, саки, уйсуни, гунны, Тюркские каганаты, Караханиды, наука и культура, Ак-Орда.", "Археология, сақтар, үйсіндер, ғұндар, Түрік қағанаттары, Қарахан мемлекеті, Ақ Орда.", "Arxeologiya, saklar, uysunlar, xunnlar, Turk xoqonliklari, Qoraxoniylar, Oq O‘rda."),
      description: tr("Археология, саки, уйсуни, гунны, Тюркские каганаты, Караханиды, наука и культура, Ак-Орда.", "Археология, сақтар, үйсіндер, ғұндар, Түрік қағанаттары, Қарахан мемлекеті, Ақ Орда.", "Arxeologiya, saklar, uysunlar, xunnlar, Turk xoqonliklari, Qoraxoniylar, Oq O‘rda."),
      topicIds: ["hkz_ancient_saka", "hkz_medieval_turkic"]
    },
    {
      id: "history_kz-mod-2",
      subjectId: "history_kz",
      title: tr("Модуль 2. Казахское ханство и освободительная борьба XV–XIX вв. (Шың-кітап)", "2-модуль. Қазақ хандығы және XV–XIX ғғ. ұлт-азаттық күрес (Шың-кітап)", "2-modul. Qozoq xonligi va XV–XIX asr ozodlik kurashi (Shyn-kitap)"),
      summary: tr("Образование ханства, своды законов ханов, джунгарские войны, Абылай-хан и восстания Сырыма, Исатая и Кенесары.", "Хандықтың құрылуы, заңдар жинағы, жоңғар шапқыншылығы, Абылай хан және Кенесары көтерілісі.", "Xonlikning tashkil topishi, qonunlar, jung‘or urushlari, Abilayxon va Kenesari qo‘zg‘oloni."),
      description: tr("Образование ханства, своды законов ханов, джунгарские войны, Абылай-хан и восстания Сырыма, Исатая и Кенесары.", "Хандықтың құрылуы, заңдар жинағы, жоңғар шапқыншылығы, Абылай хан және Кенесары көтерілісі.", "Xonlikning tashkil topishi, qonunlar, jung‘or urushlari, Abilayxon va Kenesari qo‘zg‘oloni."),
      topicIds: ["hkz_khanate", "hkz_jungar_revolts"]
    },
    {
      id: "history_kz-mod-3",
      subjectId: "history_kz",
      title: tr("Модуль 3. Казахстан в XX–XXI вв.: «Алаш», советский период и Независимость", "3-модуль. XX–XXI ғғ. Қазақстан: «Алаш», кеңестік кезең және Тәуелсіздік", "3-modul. XX–XXI asr Qozog‘istoni: «Alash», sovet davri va Mustaqillik"),
      summary: tr("Партия «Алаш», индустриализация, Казахстан в ВОВ (1941–1945), Желтоксан и суверенный Казахстан.", "«Алаш» қозғалысы, индустрияландыру, ҰОС батырлары, Желтоқсан және Тәуелсіз Қазақстан.", "«Alash» harakati, Ikkinchi jahon urushi qahramonlari va Mustaqil Qozog‘iston."),
      description: tr("Партия «Алаш», индустриализация, Казахстан в ВОВ (1941–1945), Желтоксан и суверенный Казахстан.", "«Алаш» қозғалысы, индустрияландыру, ҰОС батырлары, Желтоқсан және Тәуелсіз Қазақстан.", "«Alash» harakati, Ikkinchi jahon urushi qahramonlari va Mustaqil Qozog‘iston."),
      topicIds: ["hkz_alash_independence", "hkz_soviet_ww2"]
    }
  ],
  physics: [
    {
      id: "physics-mod-1",
      subjectId: "physics",
      title: tr("Модуль 1. Механика: кинематика, динамика и законы сохранения (Шың-кітап)", "1-модуль. Механика: кинематика, динамика және сақталу заңдары (Шың-кітап)", "1-modul. Mexanika: kinematika, dinamika va saqlanish qonunlari (Shyn-kitap)"),
      summary: tr("Равноускоренное движение, законы Ньютона, импульс, работа и механическая энергия.", "Теңүдемелі қозғалыс, Ньютон заңдары, импульс және механикалық энергия.", "Tekis tezlanuvchan harakat, Nyuton qonunlari, impuls va energiya."),
      description: tr("Равноускоренное движение, законы Ньютона, импульс, работа и механическая энергия.", "Теңүдемелі қозғалыс, Ньютон заңдары, импульс және механикалық энергия.", "Tekis tezlanuvchan harakat, Nyuton qonunlari, impuls va energiya."),
      topicIds: ["phys_kinematics", "phys_dynamics"]
    },
    {
      id: "physics-mod-2",
      subjectId: "physics",
      title: tr("Модуль 2. МКТ, Термодинамика и Электромагнетизм (Шың-кітап)", "2-модуль. МКТ, Термодинамика және Электромагнетизм (Шың-кітап)", "2-modul. MKT, Termodinamika va Elektromagnetizm (Shyn-kitap)"),
      summary: tr("Изопроцессы, КПД тепловых машин Карно, законы Ома, Джоуля-Ленца, силы Ампера и Лоренца.", "Изопроцестер, Карно ПӘК-і, Ом заңы, Ампер мен Лоренц күштері.", "Izoprotsesslar, Karno FIK, Om qonuni, Amper va Lorens kuchlari."),
      description: tr("Изопроцессы, КПД тепловых машин Карно, законы Ома, Джоуля-Ленца, силы Ампера и Лоренца.", "Изопроцестер, Карно ПӘК-і, Ом заңы, Ампер мен Лоренц күштері.", "Izoprotsesslar, Karno FIK, Om qonuni, Amper va Lorens kuchlari."),
      topicIds: ["phys_ohm_dc", "phys_thermo_mkt", "phys_magnetism_emi"]
    },
    {
      id: "physics-mod-3",
      subjectId: "physics",
      title: tr("Модуль 3. Оптика, фотоэффект Эйнштейна и ядерная физика (Шың-кітап)", "3-модуль. Оптика, Эйнштейн фотоэффектісі және ядролық физика (Шың-кітап)", "3-modul. Optika, Eynshteyn fotoeffekti va yadro fizikasi (Shyn-kitap)"),
      summary: tr("Формула тонкой линзы, преломление света, уравнение фотоэффекта и период полураспада.", "Жұқа линза формуласы, фотоэффект теңдеуі және жартылай ыдырау периоды.", "Yupqa linza formulasi, fotoeffekt tenglamasi va yarim yemirilish davri."),
      description: tr("Формула тонкой линзы, преломление света, уравнение фотоэффекта и период полураспада.", "Жұқа линза формуласы, фотоэффект теңдеуі және жартылай ыдырау периоды.", "Yupqa linza formulasi, fotoeffekt tenglamasi va yarim yemirilish davri."),
      topicIds: ["phys_optics_quantum"]
    }
  ],
  informatics: [
    {
      id: "informatics-mod-1",
      subjectId: "informatics",
      title: tr("Модуль 1. Системы счисления, кодирование и алгебра логики (Шың-кітап)", "1-модуль. Санау жүйелері, кодтау және логика алгебрасы (Шың-кітап)", "1-modul. Sanoq sistemalari, kodlash va mantiq algebrasi (Shyn-kitap)"),
      summary: tr("Двоичная/шестнадцатеричная системы, формула Хартли, объём звука/графики и таблицы истинности.", "Екілік/оналтылық жүйе, Хартли формуласы, дыбыс/графика көлемі және ақиқаттық кестелері.", "Ikkilik/o‘n oltilik sanoq, Xartli formulasi va rostlik jadvallari."),
      description: tr("Двоичная/шестнадцатеричная системы, формула Хартли, объём звука/графики и таблицы истинности.", "Екілік/оналтылық жүйе, Хартли формуласы, дыбыс/графика көлемі және ақиқаттық кестелері.", "Ikkilik/o‘n oltilik sanoq, Xartli formulasi va rostlik jadvallari."),
      topicIds: ["inf_num_systems_logic", "inf_info_encoding"]
    },
    {
      id: "informatics-mod-2",
      subjectId: "informatics",
      title: tr("Модуль 2. Алгоритмизация и структуры данных на Python (Шың-кітап)", "2-модуль. Python тілінде алгоритмдеу және деректер құрылымы (Шың-кітап)", "2-modul. Pythonda algoritmlash va ma’lumotlar tuzilmasi (Shyn-kitap)"),
      summary: tr("Циклы for/while, срезы строк и списков, рекурсия, бинарный поиск и сложность алгоритмов.", "for/while циклдері, тізім мен жол кесінділері, рекурсия және бинарлық іздеу.", "for/while sikllari, ro‘yxat va satr kesimlari, rekursiya va binar qidiruv."),
      description: tr("Циклы for/while, срезы строк и списков, рекурсия, бинарный поиск и сложность алгоритмов.", "for/while циклдері, тізім мен жол кесінділері, рекурсия және бинарлық іздеу.", "for/while sikllari, ro‘yxat va satr kesimlari, rekursiya va binar qidiruv."),
      topicIds: ["inf_python_loops_arrays", "inf_python_strings_algos"]
    },
    {
      id: "informatics-mod-3",
      subjectId: "informatics",
      title: tr("Модуль 3. Реляционные БД (SQL), компьютерные сети и кибербезопасность", "3-модуль. Деректер қоры (SQL), компьютерлік желілер және киберқауіпсіздік", "3-modul. Ma’lumotlar bazasi (SQL), tarmoqlar va kiberxavfsizlik"),
      summary: tr("SQL-агрегация, нормальные формы БД, модель OSI, расчёт адреса сети по IP и маске.", "SQL сұраныстары, ДҚ қалыпты формалары, OSI моделі, IP мен маска бойынша желі адресі.", "SQL so‘rovlari, OSI modeli, IP va maska bo‘yicha tarmoq manzili."),
      description: tr("SQL-агрегация, нормальные формы БД, модель OSI, расчёт адреса сети по IP и маске.", "SQL сұраныстары, ДҚ қалыпты формалары, OSI моделі, IP мен маска бойынша желі адресі.", "SQL so‘rovlari, OSI modeli, IP va maska bo‘yicha tarmoq manzili."),
      topicIds: ["inf_sql_databases", "inf_networks_security"]
    }
  ],
  chemistry: [
    {
      id: "chemistry-mod-1",
      subjectId: "chemistry",
      title: tr("Модуль 1. Общая химия: атом, ОВР, кинетика и равновесие (Шың-кітап)", "1-модуль. Жалпы химия: атом, ТТР, кинетика және тепе-теңдік (Шың-кітап)", "1-modul. Umumiy kimyo: atom, OQR, kinetika va muvozanat (Shyn-kitap)"),
      summary: tr("Электронные конфигурации, электронный баланс ОВР, правило Вант-Гоффа и принцип Ле Шателье.", "Электрондық конфигурация, ТТР балансы, Вант-Гофф ережесі және Ле Шателье принципі.", "Elektron konfiguratsiya, OQR balansi, Vant-Goff qoidasi va Le Shatelye prinsipi."),
      description: tr("Электронные конфигурации, электронный баланс ОВР, правило Вант-Гоффа и принцип Ле Шателье.", "Электрондық конфигурация, ТТР балансы, Вант-Гофф ережесі және Ле Шателье принципі.", "Elektron konfiguratsiya, OQR balansi, Vant-Goff qoidasi va Le Shatelye prinsipi."),
      topicIds: ["chem_atomic_bonds", "chem_redox_balance", "chem_kinetics_equilibrium"]
    },
    {
      id: "chemistry-mod-2",
      subjectId: "chemistry",
      title: tr("Модуль 2. Растворы, электролиты, гидролиз и стехиоometria (Шың-кітап)", "2-модуль. Ерітінділер, электролиттер, гидролиз және стехиометрия (Шың-кітап)", "2-modul. Eritmalar, elektrolitlar, gidroliz va stexiometriya (Shyn-kitap)"),
      summary: tr("Молярная масса, объём газа 22,4 л/моль, РИО, гидролиз солей, электролиз и качественные реакции.", "Молярлық масса, 22,4 л/моль, ИАР, тұздар гидролизі, электролиз және сапалық реакциялар.", "Molyar massa, 22,4 l/mol, tuzlar gidrolizi, elektroliz va sifat reaksiyalari."),
      description: tr("Молярная масса, объём газа 22,4 л/моль, РИО, гидролиз солей, электролиз и качественные реакции.", "Молярлық масса, 22,4 л/моль, ИАР, тұздар гидролизі, электролиз және сапалық реакциялар.", "Molyar massa, 22,4 l/mol, tuzlar gidrolizi, elektroliz va sifat reaksiyalari."),
      topicIds: ["chem_stoichiometry_moles", "chem_hydrolysis_electrolysis"]
    },
    {
      id: "chemistry-mod-3",
      subjectId: "chemistry",
      title: tr("Модуль 3. Органическая химия и расчётные задачи на выход продукта", "3-модуль. Органикалық химия және өнім шығымына есептер", "3-modul. Organik kimyo va mahsulot unumiga doir masalalar"),
      summary: tr("Углеводороды, спирты, альдегиды, правила Марковникова и Зайцева, расчёт выхода реакции η.", "Көмірсутектер, спирттер, альдегидтер, Марковников ережесі және реакция шығымы η.", "Uglevodorodlar, spirtlar, aldegidlar, Markovnikov qoidasi va reaksiya unumi η."),
      description: tr("Углеводороды, спирты, альдегиды, правила Марковникова и Зайцева, расчёт выхода реакции η.", "Көмірсутектер, спирттер, альдегидтер, Марковников ережесі және реакция шығымы η.", "Uglevodorodlar, spirtlar, aldegidlar, Markovnikov qoidasi va reaksiya unumi η."),
      topicIds: ["chem_organic_yield"]
    }
  ],
  biology: [
    {
      id: "biology-mod-1",
      subjectId: "biology",
      title: tr("Модуль 1. Цитология, метаболизм, митоз и мейоз (Шың-кітап)", "1-модуль. Цитология, метаболизм, митоз және мейоз (Шың-кітап)", "1-modul. Sitologiya, metabolizm, mitoz va meyoz (Shyn-kitap)"),
      summary: tr("Органоиды клетки, фотосинтез, гликолиз и клеточное дыхание (38 АТФ), формулы митоза и мейоза.", "Жасуша органоидтары, фотосинтез, тыныс алу (38 АТФ), митоз бен мейоз формулалары.", "Hujayra organoidlari, fotosintez, nafas olish (38 ATF), mitoz va meyoz."),
      description: tr("Органоиды клетки, фотосинтез, гликолиз и клеточное дыхание (38 АТФ), формулы митоза и мейоза.", "Жасуша органоидтары, фотосинтез, тыныс алу (38 АТФ), митоз бен мейоз формулалары.", "Hujayra organoidlari, fotosintez, nafas olish (38 ATF), mitoz va meyoz."),
      topicIds: ["bio_cell_organelles", "bio_metabolism_atp", "bio_mitosis_meiosis"]
    },
    {
      id: "biology-mod-2",
      subjectId: "biology",
      title: tr("Модуль 2. Генетика, ботаника и зоология (Шың-кітап)", "2-модуль. Генетика, ботаника және зоология (Шың-кітап)", "2-modul. Genetika, botanika va zoologiya (Shyn-kitap)"),
      summary: tr("Законы Менделя и Моргана, группы крови AB0, жизненные циклы растений и эволюция позвоночных.", "Мендель мен Морган заңдары, AB0 қан топтары, өсімдіктер циклі және омыртқалылар.", "Mendel va Morgan qonunlari, AB0 qon guruhlari, o‘simliklar va umurtqalilar."),
      description: tr("Законы Менделя и Моргана, группы крови AB0, жизненные циклы растений и эволюция позвоночных.", "Мендель мен Морган заңдары, AB0 қан топтары, өсімдіктер циклі және омыртқалылар.", "Mendel va Morgan qonunlari, AB0 qon guruhlari, o‘simliklar va umurtqalilar."),
      topicIds: ["bio_mendel_genetics", "bio_botany_zoology"]
    },
    {
      id: "biology-mod-3",
      subjectId: "biology",
      title: tr("Модуль 3. Анатомия человека, эволюция и экология (правило 10%)", "3-модуль. Адам анатомиясы, эволюция және экология (10% ережесі)", "3-modul. Odam anatomiyasi, evolyutsiya va ekologiya (10% qoidasi)"),
      summary: tr("Круги кровообращения, нервная и эндокринная регуляция, гомологи/аналоги и пирамида энергии Линдемана.", "Қанайналым шеңберлері, жүйке мен гуморальдық реттелу, эволюция және Линдеман пирамидасы.", "Qon aylanish doiralari, asab va endokrin tizim, evolyutsiya va Lindeman qoidasi."),
      description: tr("Круги кровообращения, нервная и эндокринная регуляция, гомологи/аналоги и пирамида энергии Линдемана.", "Қанайналым шеңберлері, жүйке мен гуморальдық реттелу, эволюция және Линдеман пирамидасы.", "Qon aylanish doiralari, asab va endokrin tizim, evolyutsiya va Lindeman qoidasi."),
      topicIds: ["bio_anatomy_ecology"]
    }
  ],
  geography: [
    {
      id: "geography-mod-1",
      subjectId: "geography",
      title: tr("Модуль 1. Картография, литосфера, атмосфера и гидросфера (Шың-кітап)", "1-модуль. Картография, литосфера, атмосфера және гидросфера (Шың-кітап)", "1-modul. Kartografiya, litosfera, atmosfera va gidrosfera (Shyn-kitap)"),
      summary: tr("Масштаб карты, высотный градиент температуры, падение и уклон рек, солёность океана.", "Карта масштабы, температура градиенті, өзен құламасы мен еңістігі.", "Karta masshtabi, harorat gradiyenti, daryo tushishi va nishabligi."),
      description: tr("Масштаб карты, высотный градиент температуры, падение и уклон рек, солёность океана.", "Карта масштабы, температура градиенті, өзен құламасы мен еңістігі.", "Karta masshtabi, harorat gradiyenti, daryo tushishi va nishabligi."),
      topicIds: ["geo_map_scale_coords", "geo_atmosphere_climate", "geo_litho_hydrosphere"]
    },
    {
      id: "geography-mod-2",
      subjectId: "geography",
      title: tr("Модуль 2. Физическая и экономическая география Казахстана (Шың-кітап)", "2-модуль. Қазақстанның физикалық және экономикалық географиясы (Шың-кітап)", "2-modul. Qozog‘istonning tabiiy va iqtisodiy geografiyasi (Shyn-kitap)"),
      summary: tr("Границы, крайние точки, 10 государственных заповедников и экономические районы РК.", "Шекаралар, шеткі нүктелер, 10 мемлекеттік қорық және ҚР экономикалық аудандары.", "Chegaralar, chekka nuqtalar, 10 ta davlat qo‘riqxonasi va QR iqtisodiy rayonlari."),
      description: tr("Границы, крайние точки, 10 государственных заповедников и экономические районы РК.", "Шекаралар, шеткі нүктелер, 10 мемлекеттік қорық және ҚР экономикалық аудандары.", "Chegaralar, chekka nuqtalar, 10 ta davlat qo‘riqxonasi va QR iqtisodiy rayonlari."),
      topicIds: ["geo_kz_economy_regions", "geo_kz_nature_reserves"]
    },
    {
      id: "geography-mod-3",
      subjectId: "geography",
      title: tr("Модуль 3. Население мира, политическая карта и геоэкономика", "3-модуль. Дүниежүзі халқы, саяси карта және геоэкономика", "3-modul. Dunyo aholisi, siyosiy xarita va geoikqtisodiyot"),
      summary: tr("Демографическая формула естественного прироста, формы правления (монархии и республики) и международные организации.", "Табиғи өсім формуласы, басқару формалары (монархия мен республика) және халықаралық ұйымдар.", "Tabiiy o‘sish formulasi, boshqaruv shakllari va xalqaro tashkilotlar."),
      description: tr("Демографическая формула естественного прироста, формы правления (монархии и республики) и международные организации.", "Табиғи өсім формуласы, басқару формалары (монархия мен республика) және халықаралық ұйымдар.", "Tabiiy o‘sish formulasi, boshqaruv shakllari va xalqaro tashkilotlar."),
      topicIds: ["geo_demography_geopolitics"]
    }
  ],
  world_history: [
    {
      id: "world_history-mod-1",
      subjectId: "world_history",
      title: tr("Модуль 1. Древний мир и Средневековье Запада и Востока (Шың-кітап)", "1-модуль. Ежелгі дүние және Батыс пен Шығыс орта ғасырлары (Шың-кітап)", "1-modul. Qadimgi dunyo va O‘rta asrlar (Shyn-kitap)"),
      summary: tr("Законы Хаммурапи, античный полис и Рим, феодализм, Византия, Халифат и сословные монархии.", "Хаммурапи заңдары, антикалық полис пен Рим, феодализм, Византия және сословиелік монархиялар.", "Xammurapi qonunlari, antik polis va Rim, feodalizm, Vizantiya va tabaqaviy monarxiyalar."),
      description: tr("Законы Хаммурапи, античный полис и Рим, феодализм, Византия, Халифат и сословные монархии.", "Хаммурапи заңдары, антикалық полис пен Рим, феодализм, Византия және сословиелік монархиялар.", "Xammurapi qonunlari, antik polis va Rim, feodalizm, Vizantiya va tabaqaviy monarxiyalar."),
      topicIds: ["wh_antiquity_polis", "wh_medieval_feudalism"]
    },
    {
      id: "world_history-mod-2",
      subjectId: "world_history",
      title: tr("Модуль 2. Новое время: ВГО, Реформация, Просвещение и XIX век (Шың-кітап)", "2-модуль. Жаңа заман: ҰГA, Реформация, Ағартушылық және XIX ғасыр (Шың-кітап)", "2-modul. Yangi davr: Buyuk geografik kashfiyotlar, Reformatsiya va XIX asr"),
      summary: tr("Великие географические открытия, Реформация Лютера, промышленный переворот, война за независимость США и ВФР.", "Ұлы географиялық ашулар, Реформация, өнеркәсіп төңкерісі, АҚШ және Француз революциясы.", "Buyuk geografik kashfiyotlar, Reformatsiya, sanoat to‘ntarishi, AQSH va Fransiya inqilobi."),
      description: tr("Великие географические открытия, Реформация Лютера, промышленный переворот, война за независимость США и ВФР.", "Ұлы географиялық ашулар, Реформация, өнеркәсіп төңкерісі, АҚШ және Француз революциясы.", "Buyuk geografik kashfiyotlar, Reformatsiya, sanoat to‘ntarishi, AQSH va Fransiya inqilobi."),
      topicIds: ["wh_industrial_enlightenment", "wh_reformation_revolutions"]
    },
    {
      id: "world_history-mod-3",
      subjectId: "world_history",
      title: tr("Модуль 3. Новейшая история: Мировые войны, Холодная война и ООН", "3-модуль. Қазіргі заман: Дүниежүзілік соғыстар, Қырғи-қабақ соғыс және БҰҰ", "3-modul. Eng yangi tarix: Jahon urushlari, Sovuq urush va BMT"),
      summary: tr("Версальско-Вашингтонская и Ялтинско-Потсдамская системы, создание ООН, НАТО, ОВД и деколонизация.", "Версаль-Вашингтон және Ялта-Потсдам жүйелері, БҰҰ, НАТО және деколонизация.", "Versal-Vashington va Yalta-Potsdam tizimlari, BMT, NATO va dekolonizatsiya."),
      description: tr("Версальско-Вашингтонская и Ялтинско-Потсдамская системы, создание ООН, НАТО, ОВД и деколонизация.", "Версаль-Вашингтон және Ялта-Потсдам жүйелері, БҰҰ, НАТО және деколонизация.", "Versal-Vashington va Yalta-Potsdam tizimlari, BMT, NATO va dekolonizatsiya."),
      topicIds: ["wh_20c_treaties_un", "wh_ww2_cold_war"]
    }
  ],
  law: [
    {
      id: "law-mod-1",
      subjectId: "law",
      title: tr("Модуль 1. Теория государства и права и Конституция РК (Шың-кітап)", "1-модуль. Мемлекет және құқық теориясы мен ҚР Конституциясы (Шың-кітап)", "1-modul. Davlat va huquq nazariyasi hamda QR Konstitutsiyasi (Shyn-kitap)"),
      summary: tr("Структура нормы права (гипотеза, диспозиция, санкция), форма государства и ветви власти по Конституции РК.", "Құқық нормасының құрылымы, мемлекет нысаны және ҚР Конституциясы бойынша билік тармақтары.", "Huquq normasi tuzilishi va QR Konstitutsiyasi bo‘yicha hokimiyat tarmoqlari."),
      description: tr("Структура нормы права (гипотеза, диспозиция, санкция), форма государства и ветви власти по Конституции РК.", "Құқық нормасының құрылымы, мемлекет нысаны және ҚР Конституциясы бойынша билік тармақтары.", "Huquq normasi tuzilishi va QR Konstitutsiyasi bo‘yicha hokimiyat tarmoqlari."),
      topicIds: ["law_constitution_branches", "law_theory_norm"]
    },
    {
      id: "law-mod-2",
      subjectId: "law",
      title: tr("Модуль 2. Гражданское, Трудовое и Семейное право РК (Шың-кітап)", "2-модуль. ҚР Азаматтық, Еңбек және Отбасы құқығы (Шың-кітап)", "2-modul. QR Fuqarolik, Mehnat va Oila huquqi (Shyn-kitap)"),
      summary: tr("Правоспособность и дееспособность (14/18 лет), трудовой договор, рабочее время несовершеннолетних и брак.", "Құқық және әрекет қабілеттілік (14/18 жас), еңбек шарты, жұмыс уақыты және неке.", "Huquq va muomala layoqati, mehnat shartnomasi, ish vaqti va nikoh."),
      description: tr("Правоспособность и дееспособность (14/18 лет), трудовой договор, рабочее время несовершеннолетних и брак.", "Құқық және әрекет қабілеттілік (14/18 жас), еңбек шарты, жұмыс уақыты және неке.", "Huquq va muomala layoqati, mehnat shartnomasi, ish vaqti va nikoh."),
      topicIds: ["law_civil_capacity", "law_labor_family"]
    },
    {
      id: "law-mod-3",
      subjectId: "law",
      title: tr("Модуль 3. Административное, Уголовное и Процессуальное право РК", "3-модуль. ҚР Әкімшілік, Қылмыстық және Іс жүргізу құқығы", "3-modul. QR Ma’muriy, Jinoyat va Protsessual huquqi"),
      summary: tr("Разграничение проступка и преступления, возраст ответственности (16/14 лет), необходимая оборона и презумпция невиновности.", "Теріс қылық пен қылмыс, жауапкершілік жасы (16/14 жас), қажетті қорғану және кінәсіздік презумпциясы.", "Huquqbuzarlik va jinoyat, javobgarlik yoshi (16/14 yosh) va aybsizlik prezumpsiyasi."),
      description: tr("Разграничение проступка и преступления, возраст ответственности (16/14 лет), необходимая оборона и презумпция невиновности.", "Теріс қылық пен қылмыс, жауапкершілік жасы (16/14 жас), қажетті қорғану және кінәсіздік презумпциясы.", "Huquqbuzarlik va jinoyat, javobgarlik yoshi (16/14 yosh) va aybsizlik prezumpsiyasi."),
      topicIds: ["law_criminal_admin_age", "law_procedural_presumption"]
    }
  ],
  english: [
    {
      id: "english-mod-1",
      subjectId: "english",
      title: tr("Модуль 1. Система времён, Conditionals и Subjunctive Mood (Шың-кітап)", "1-модуль. Шақтар жүйесі, Conditionals және Subjunctive Mood (Шың-кітап)", "1-modul. Zamonlar tizimi, Conditionals va Subjunctive Mood (Shyn-kitap)"),
      summary: tr("Zero, First, Second, Third & Mixed Conditionals, конструкции I wish / If only.", "Conditionals (0, 1, 2, 3, Mixed) және I wish / If only құрылымдары.", "Conditionals (0, 1, 2, 3, Mixed) va I wish / If only konstruksiyalari."),
      description: tr("Zero, First, Second, Third & Mixed Conditionals, конструкции I wish / If only.", "Conditionals (0, 1, 2, 3, Mixed) және I wish / If only құрылымдары.", "Conditionals (0, 1, 2, 3, Mixed) va I wish / If only konstruksiyalari."),
      topicIds: ["eng_conditionals", "eng_modals_wish"]
    },
    {
      id: "english-mod-2",
      subjectId: "english",
      title: tr("Модуль 2. Reported Speech, Passive Voice, Gerund & Infinitive (Шың-кітап)", "2-модуль. Reported Speech, Passive Voice, Gerund & Infinitive (Шың-кітап)", "2-modul. Reported Speech, Passive Voice, Gerund & Infinitive (Shyn-kitap)"),
      summary: tr("Согласование времён в косвенной речи, страдательный залог и выбор между V-ing и to V.", "Төлеу сөздегі шақтардың қиысуы, ырықсыз етіс және V-ing пен to V таңдауы.", "O‘zlashtirma gapda zamonlar moslashuvi, majhul nisbat va V-ing / to V."),
      description: tr("Согласование времён в косвенной речи, страдательный залог и выбор между V-ing и to V.", "Төлеу сөздегі шақтардың қиысуы, ырықсыз етіс және V-ing пен to V таңдауы.", "O‘zlashtirma gapda zamonlar moslashuvi, majhul nisbat va V-ing / to V."),
      topicIds: ["eng_reported_passive", "eng_gerund_infinitive"]
    },
    {
      id: "english-mod-3",
      subjectId: "english",
      title: tr("Модуль 3. Reading Comprehension, Articles, Phrasal Verbs & Inversion", "3-модуль. Reading Comprehension, Артикльдер, Phrasal Verbs және Инверсия", "3-modul. Reading Comprehension, Artikllar, Phrasal Verbs va Inversiya"),
      summary: tr("Академическое чтение, артикли с географическими названиями, фразовые глаголы и инверсия.", "Академиялық оқылым, географиялық атаулармен артикльдер, фразалық етістіктер мен инверсия.", "Akademik o‘qish, artikllar, frazali fe’llar va inversiya."),
      description: tr("Академическое чтение, артикли с географическими названиями, фразовые глаголы и инверсия.", "Академиялық оқылым, географиялық атаулармен артикльдер, фразалық етістіктер мен инверсия.", "Akademik o‘qish, artikllar, frazali fe’llar va inversiya."),
      topicIds: ["eng_reading_vocabulary", "eng_articles_phrasals_inversion"]
    }
  ],
  math_lit: [
    {
      id: "math_lit-mod-1",
      subjectId: "math_lit",
      title: tr("Модуль 1. Проценты, пропорции, движение и совместная работа (Шың-кітап)", "1-модуль. Пайыздар, пропорциялар, қозғалыс және бірлескен жұмыс (Шың-кітап)", "1-modul. Foizlar, proporsiyalar, harakat va birgalikdagi ish (Shyn-kitap)"),
      summary: tr("Двойное изменение цены, сплавы, средняя скорость, движение по реке и прохождение поезда.", "Баға өзгерісі, қоспалар, орташа жылдамдық, өзендегі қозғалыс және пойыз есептері.", "Narx o‘zgarishi, qotishmalar, o‘rtacha tezlik va poyezd masalalari."),
      description: tr("Двойное изменение цены, сплавы, средняя скорость, движение по реке и прохождение поезда.", "Баға өзгерісі, қоспалар, орташа жылдамдық, өзендегі қозғалыс және пойыз есептері.", "Narx o‘zgarishi, qotishmalar, o‘rtacha tezlik va poyezd masalalari."),
      topicIds: ["ml_percent_proportions", "ml_motion_work_mixtures"]
    },
    {
      id: "math_lit-mod-2",
      subjectId: "math_lit",
      title: tr("Модуль 2. Таблицы, статистика и числовые закономерности (Шың-кітап)", "2-модуль. Кестелер, статистика және сандық заңдылықтар (Шың-кітап)", "2-modul. Jadvallar, statistika va sonli qonuniyatlar (Shyn-kitap)"),
      summary: tr("Среднее, медиана, мода, размах, последняя цифра степени и задачи на распилы/интервалы.", "Орта мән, медиана, мода, өзгеріс ауқымы, дәреженің соңғы цифры және аралықтар.", "O‘rta qiymat, mediana, moda, darajaning oxirgi raqami va oraliqlar."),
      description: tr("Среднее, медиана, мода, размах, последняя цифра степени и задачи на распилы/интервалы.", "Орта мән, медиана, мода, өзгеріс ауқымы, дәреженің соңғы цифры және аралықтар.", "O‘rta qiymat, mediana, moda, darajaning oxirgi raqami va oraliqlar."),
      topicIds: ["ml_tables_statistics", "ml_number_patterns_last_digit"]
    },
    {
      id: "math_lit-mod-3",
      subjectId: "math_lit",
      title: tr("Модуль 3. Логика, комбинаторика, формула Пика и круги Эйлера", "3-модуль. Логика, комбинаторика, Пик формуласы және Эйлер дөңгелектері", "3-modul. Mantiq, kombinatorika, Pik formulasi va Eyler doiralari"),
      summary: tr("Рукопожатия, формула Пика на клетчатой решётке, круги Эйлера-Венна и угол между стрелками часов.", "Қол алысу, торкөздегі Пик формуласы, Эйлер-Венн дөңгелектері және сағат тілдері арасындағы бұрыш.", "Qo‘l berib ko‘rishish, Pik formulasi, Eyler-Venn doiralari va soat millari burchagi."),
      description: tr("Рукопожатия, формула Пика на клетчатой решётке, круги Эйлера-Венна и угол между стрелками часов.", "Қол алысу, торкөздегі Пик формуласы, Эйлер-Венн дөңгелектері және сағат тілдері арасындағы бұрыш.", "Qo‘l berib ko‘rishish, Pik formulasi, Eyler-Venn doiralari va soat millari burchagi."),
      topicIds: ["ml_combinatorics_logic", "ml_geometry_pick_clocks"]
    }
  ],
  reading_lit: [
    {
      id: "reading_lit-mod-1",
      subjectId: "reading_lit",
      title: tr("Модуль 1. Главный тезис, аргументация и логика абзацев (Шың-кітап)", "1-модуль. Негізгі тезис, аргументация және абзац логикасы (Шың-кітап)", "1-modul. Asosiy tezis, argumentatsiya va xatboshi mantiqi (Shyn-kitap)"),
      summary: tr("Разграничение тезиса и иллюстрации, причинно-следственные связи и антитеза между абзацами.", "Тезис пен мысалды ажырату, абзацтар арасындағы себеп-салдар және қарсы қою.", "Tezis va misolni farqlash, xatboshilar orasidagi sabab-oqibat."),
      description: tr("Разграничение тезиса и иллюстрации, причинно-следственные связи и антитеза между абзацами.", "Тезис пен мысалды ажырату, абзацтар арасындағы себеп-салдар және қарсы қою.", "Tezis va misolni farqlash, xatboshilar orasidagi sabab-oqibat."),
      topicIds: ["rl_main_idea_thesis", "rl_paragraph_logic"]
    },
    {
      id: "reading_lit-mod-2",
      subjectId: "reading_lit",
      title: tr("Модуль 2. Стили речи, подтекст и средства выразительности (Шың-кітап)", "2-модуль. Сөйлеу стильдері, астарлы ой және көркемдегіш құралдар (Шың-кітап)", "2-modul. Nutq uslublari, tagma’no va tasviriy vositalar (Shyn-kitap)"),
      summary: tr("Факт vs мнение, научный и публицистический стили, метафора, гипербола, ирония и имплицитный смысл.", "Дерек пен пікір, ғылыми және публицистикалық стиль, метафора, гипербола және астарлы мағына.", "Fakt va fikr, ilmiy va publitsistik uslub, metafora va yashirin ma’no."),
      description: tr("Факт vs мнение, научный и публицистический стили, метафора, гипербола, ирония и имплицитный смысл.", "Дерек пен пікір, ғылыми және публицистикалық стиль, метафора, гипербола және астарлы мағына.", "Fakt va fikr, ilmiy va publitsistik uslub, metafora va yashirin ma’no."),
      topicIds: ["rl_fact_vs_opinion", "rl_implicit_tropes"]
    },
    {
      id: "reading_lit-mod-3",
      subjectId: "reading_lit",
      title: tr("Модуль 3. Сравнительный синтез текстов и фильтр дистракторов НЦТ", "3-модуль. Мәтіндерді салыстырмалы синтездеу және ҰБТ дистракторлар сүзгісі", "3-modul. Matnlarni qiyosiy sintezlash va UNT distraktorlar filtri"),
      summary: tr("Сопоставление двух и трёх текстов, отсев ловушек категоричности («всегда», «только», «никогда»).", "Екі-үш мәтінді салыстыру, үзілді-кесілді жалпылау тұзақтарын («әрқашан», «тек») сүзу.", "Ikki-uch matnni solishtirish va keskin umumlashtirish tuzoqlarini saralash."),
      description: tr("Сопоставление двух и трёх текстов, отсев ловушек категоричности («всегда», «только», «никогда»).", "Екі-үш мәтінді салыстыру, үзілді-кесілді жалпылау тұзақтарын («әрқашан», «тек») сүзу.", "Ikki-uch matnni solishtirish va keskin umumlashtirish tuzoqlarini saralash."),
      topicIds: ["rl_comparative_texts", "rl_distractor_filter"]
    }
  ]
};
