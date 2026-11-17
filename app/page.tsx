import {
  ArrowRight,
  AtSign,
  Check,
  ChevronDown,
  Clock,
  MapPin,
  MessageCircle,
  Phone
} from "lucide-react";
import { InstagramIcon } from "@/components/brand-mark";
import { PortfolioCard } from "@/components/portfolio-card";
import { StudioCalculator } from "@/components/studio-calculator";
import { StudioFooter } from "@/components/studio-footer";
import { StudioHeader } from "@/components/studio-header";
import {
  BRAND,
  BUSINESS_MODULES,
  BUSINESS_TIERS,
  CORE_SERVICES,
  HOME_FAQS,
  MARKET_COMPARISON,
  PORTFOLIO_ITEMS,
  PROCESS_STEPS,
  SERVICE_PAGES,
  STUDY_TIERS,
  buildWhatsAppUrl
} from "@/lib/justslide-data";

const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a
    }
  }))
};

export default function HomePage() {
  const heroWa = buildWhatsAppUrl(
    "Здравствуйте! Хочу заказать презентацию в JustSlide (@anelii.y)"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
      />

      <StudioHeader activePath="/" />

      <main>
        {/* 1. ATMOSPHERIC HERO (Desique-level airy sky-blue aura + grotesque H1 + serif punchline) */}
        <section className="justslide-hero-aura border-b border-zinc-100">
          <div className="mx-auto max-w-7xl px-4 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-24 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[#2F80FF]">
                Сильные презентации для людей, педагогов и бизнеса
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl lg:text-[58px] lg:leading-[1.06]">
                {BRAND.name} — студия презентаций в Алматы и Казахстане
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600 sm:text-xl">
                Учебные слайды и ҚМЖ от 80 ₸ за 15 минут. Коммерческие
                предложения, редизайн и Pitch Deck для бизнеса от 9 900 ₸.
              </p>

              <p className="font-serif-display mt-7 text-2xl leading-snug text-zinc-950 sm:text-3xl">
                Журнальный уровень вёрстки без агентских наценок в 120 000 ₸
              </p>

              <div className="mt-4">
                <a
                  href={heroWa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[36px] items-center gap-1.5 text-sm font-semibold text-[#2F80FF] hover:underline"
                >
                  <span>Напишите нам в WhatsApp ({BRAND.phoneDisplay})</span>
                </a>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a
                  href="/order"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#2F80FF] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#126DFB] active:scale-[0.99]"
                >
                  Заказать презентацию
                </a>
                <a
                  href="/work"
                  className="inline-flex min-h-[52px] items-center gap-1.5 px-3 text-sm font-semibold text-zinc-800 hover:text-[#2F80FF]"
                >
                  <span>Смотреть работы</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#calculator"
                  className="inline-flex min-h-[52px] items-center gap-1.5 px-3 text-sm font-medium text-zinc-600 hover:text-[#2F80FF]"
                >
                  <span>Калькулятор цены →</span>
                </a>
              </div>

              {/* Clean factual trust bar */}
              <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4 border-t border-zinc-200/70 pt-6 sm:grid-cols-4">
                <div>
                  <div className="text-xl font-bold text-zinc-950 tabular-nums">
                    80 ₸
                  </div>
                  <div className="mt-0.5 text-xs text-zinc-500">
                    за учебный слайд
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-zinc-950 tabular-nums">
                    9 900 ₸
                  </div>
                  <div className="mt-0.5 text-xs text-zinc-500">
                    бизнес-редизайн
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-zinc-950 tabular-nums">
                    15 мин
                  </div>
                  <div className="mt-0.5 text-xs text-zinc-500">
                    быстрый старт
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-zinc-950">
                    Қаз / Рус
                  </div>
                  <div className="mt-0.5 text-xs text-zinc-500">
                    МОН РК и B2B
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. STUDIO TOOL FEATURE — INTERACTIVE CALCULATOR */}
        <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-24 lg:px-8">
          <StudioCalculator />
        </section>

        {/* 3. PORTFOLIO SHOWCASE ("Избранные работы" — Plug-and-play for user templates) */}
        <section
          aria-labelledby="portfolio-heading"
          className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-28 lg:px-8"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#2F80FF]">Портфолио</p>
              <h2
                id="portfolio-heading"
                className="mt-1.5 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl"
              >
                Стили и форматы работ
              </h2>
            </div>
            <a
              href="/work"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-zinc-700 hover:text-[#2F80FF]"
            >
              <span>Смотреть все</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PORTFOLIO_ITEMS.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* 4. SERVICES GRID ("Чем занимаемся" — 2x2 borderless numbered cards) */}
        <section
          aria-labelledby="services-heading"
          className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-28 lg:px-8"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#2F80FF]">Услуги</p>
              <h2
                id="services-heading"
                className="mt-1.5 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl"
              >
                Чем занимаемся
              </h2>
            </div>
            <a
              href="/services"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-zinc-700 hover:text-[#2F80FF]"
            >
              <span>Подробнее о тарифах</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {CORE_SERVICES.map((srv) => (
              <a
                key={srv.num}
                href={`/services/${srv.slug}`}
                className="group flex flex-col justify-between rounded-3xl bg-[#F7F8FA] p-7 transition-colors hover:bg-[#EFF4FC] sm:p-8"
              >
                <div>
                  <span className="font-mono text-sm font-semibold text-zinc-400">
                    {srv.num}
                  </span>
                  <h3 className="mt-3 text-xl font-bold tracking-tight text-zinc-950 group-hover:text-[#2F80FF] sm:text-2xl">
                    {srv.title}
                  </h3>
                  <p className="mt-2.5 max-w-[46ch] text-sm leading-relaxed text-zinc-600">
                    {srv.subtitle}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200/80 pt-4 text-sm">
                  <span className="font-bold text-zinc-950 tabular-nums">
                    {srv.priceFrom}
                  </span>
                  <span className="text-xs font-medium text-zinc-500">
                    {srv.turnaround} →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 5. PRICING: STUDY & BUSINESS MODULAR TIERS */}
        <section
          id="pricing"
          aria-labelledby="pricing-heading"
          className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-28 lg:px-8"
        >
          <p className="text-sm font-semibold text-[#2F80FF]">Тарифы 2026</p>
          <h2
            id="pricing-heading"
            className="mt-1.5 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl"
          >
            Прозрачные цены для учёбы и бизнеса
          </h2>

          {/* Study Row */}
          <div className="mt-8">
            <h3 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">
              Учёба, дипломы и педагоги (Қаз / Рус)
            </h3>
            <div className="mt-4 grid gap-5 lg:grid-cols-3">
              {STUDY_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className={`flex flex-col justify-between rounded-3xl p-7 ${
                    tier.highlighted
                      ? "bg-[#EFF5FF] ring-2 ring-[#2F80FF]"
                      : "bg-[#F7F8FA]"
                  }`}
                >
                  <div>
                    <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#2F80FF] ring-1 ring-zinc-200/70">
                      {tier.badge}
                    </span>
                    <h4 className="mt-4 text-xl font-bold text-zinc-950">
                      {tier.name}
                    </h4>
                    <div className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 tabular-nums">
                      {tier.price}
                    </div>
                    <div className="mt-1 text-xs font-medium text-zinc-500 tabular-nums">
                      {tier.unitNote} · {tier.turnaround}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                      {tier.description}
                    </p>
                    <ul className="mt-5 space-y-2.5 text-sm text-zinc-700">
                      {tier.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2">
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]"
                            aria-hidden="true"
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href={buildWhatsAppUrl(tier.whatsappText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-6 inline-flex min-h-[46px] w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                      tier.highlighted
                        ? "bg-[#2F80FF] text-white hover:bg-[#126DFB]"
                        : "bg-zinc-950 text-white hover:bg-zinc-800"
                    }`}
                  >
                    Заказать в WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Business Row */}
          <div className="mt-12">
            <h3 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">
              Бизнес, коммерческие предложения и Pitch Deck (в 5–7× выгоднее
              агентств)
            </h3>
            <div className="mt-4 grid gap-5 lg:grid-cols-3">
              {BUSINESS_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className={`flex flex-col justify-between rounded-3xl p-7 ${
                    tier.highlighted
                      ? "bg-zinc-950 text-white"
                      : "bg-[#F7F8FA] text-zinc-950"
                  }`}
                >
                  <div>
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        tier.highlighted
                          ? "bg-[#2F80FF] text-white"
                          : "bg-white text-[#2F80FF] ring-1 ring-zinc-200/70"
                      }`}
                    >
                      {tier.badge}
                    </span>
                    <h4 className="mt-4 text-xl font-bold">{tier.name}</h4>
                    <div className="mt-2 text-3xl font-bold tracking-tight tabular-nums">
                      {tier.price}
                    </div>
                    <div
                      className={`mt-1 text-xs font-medium tabular-nums ${
                        tier.highlighted ? "text-zinc-300" : "text-zinc-500"
                      }`}
                    >
                      {tier.unitNote} · {tier.turnaround}
                    </div>
                    <p
                      className={`mt-3 text-sm leading-relaxed ${
                        tier.highlighted ? "text-zinc-300" : "text-zinc-600"
                      }`}
                    >
                      {tier.description}
                    </p>
                    <ul
                      className={`mt-5 space-y-2.5 text-sm ${
                        tier.highlighted ? "text-zinc-200" : "text-zinc-700"
                      }`}
                    >
                      {tier.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2">
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]"
                            aria-hidden="true"
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href={buildWhatsAppUrl(tier.whatsappText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-6 inline-flex min-h-[46px] w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                      tier.highlighted
                        ? "bg-[#2F80FF] text-white hover:bg-[#126DFB]"
                        : "bg-zinc-950 text-white hover:bg-zinc-800"
                    }`}
                  >
                    Обсудить проект в WhatsApp
                  </a>
                </div>
              ))}
            </div>

            {/* Business Add-on Modules (Desique strategy at fair price) */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {BUSINESS_MODULES.map((mod) => (
                <div
                  key={mod.name}
                  className="rounded-2xl bg-[#F7F8FA] p-4 ring-1 ring-zinc-200/70"
                >
                  <div className="text-sm font-semibold text-zinc-950">
                    {mod.name}
                  </div>
                  <div className="mt-2 flex items-baseline justify-between gap-2">
                    <span className="text-base font-bold text-[#2F80FF] tabular-nums">
                      {mod.price}
                    </span>
                    <span className="text-[11px] text-zinc-400 line-through">
                      {mod.marketComparison}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Comparison Table */}
          <div className="mt-10 rounded-3xl bg-[#F7F8FA] p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-bold text-zinc-950">
                Честное сравнение с рынком Казахстана (2026)
              </h3>
              <a
                href="/services/ceny-sravnenie"
                className="text-xs font-semibold text-[#2F80FF] hover:underline"
              >
                Полный разбор рынка →
              </a>
            </div>
            <div className="mt-4 space-y-2.5">
              {MARKET_COMPARISON.map((row) => (
                <div
                  key={row.provider}
                  className={`rounded-2xl p-4 sm:grid sm:grid-cols-12 sm:items-center sm:gap-3 ${
                    row.highlight
                      ? "bg-[#EFF5FF] ring-1 ring-[#2F80FF]"
                      : "bg-white ring-1 ring-zinc-200/70"
                  }`}
                >
                  <div className="text-sm font-bold text-zinc-950 sm:col-span-4">
                    {row.provider}
                  </div>
                  <div className="mt-1 text-xs text-zinc-700 tabular-nums sm:col-span-3 sm:mt-0">
                    <span className="text-zinc-400 sm:hidden">Учёба: </span>
                    {row.study15}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-zinc-900 tabular-nums sm:col-span-3 sm:mt-0">
                    <span className="font-normal text-zinc-400 sm:hidden">
                      Бизнес:{" "}
                    </span>
                    {row.biz15}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500 sm:col-span-2 sm:mt-0">
                    {row.speed}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. PROCESS WALKTHROUGH (01-05) */}
        <section
          aria-labelledby="process-heading"
          className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-28 lg:px-8"
        >
          <p className="text-sm font-semibold text-[#2F80FF]">Процесс</p>
          <h2
            id="process-heading"
            className="mt-1.5 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl"
          >
            Как мы работаем
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.num}
                className="flex flex-col justify-between rounded-3xl bg-[#F7F8FA] p-6"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-[#2F80FF]">
                      {step.num}
                    </span>
                    <span className="text-[11px] font-medium text-zinc-500">
                      {step.duration}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-zinc-950">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. STUDIO PHILOSOPHY + KAZAKH BILINGUAL BLOCK */}
        <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-28 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-[#F7F8FA] p-8 sm:p-10">
              <p className="text-sm font-semibold text-[#2F80FF]">О студии</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
                Почему {BRAND.name} ({BRAND.handle})
              </h2>
              <p className="font-serif-display mt-4 text-xl leading-snug text-zinc-900">
                Мы убрали аренду пафосных офисов и ожидание по 2 недели. Вы
                платите только за сильную структуру, чистую сетку 16:9 и
                скорость.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                Каждую презентацию — будь то СРСП за 1 200 ₸, открытый урок с
                ҚМЖ или коммерческое предложение для ТОО за 19 900 ₸ — мы
                проверяем по чек-листу типографики, контраста и грамотного
                казахского и русского языка.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/about"
                  className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[#2F80FF] hover:underline"
                >
                  <span>Подробнее о студии →</span>
                </a>
              </div>
            </div>

            <div
              lang="kk"
              className="rounded-3xl bg-[#EFF5FF] p-8 sm:p-10"
            >
              <p className="text-sm font-semibold text-[#2F80FF]">
                Қазақша ақпарат · {BRAND.name} ({BRAND.handle})
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
                Презентация, ҚМЖ және бизнес-слайдтар жасату
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-700">
                Оқушыларға, студенттерге, мұғалімдерге және бизнеске арналған
                заманауи презентацияларды <strong>15 минуттан бастап</strong>{" "}
                дайындаймыз. Қарапайым слайд —{" "}
                <strong className="tabular-nums">80 ₸</strong> (титулка, жоспар,
                әдебиеттер — тегін), анимациялық слайд —{" "}
                <strong className="tabular-nums">150 ₸</strong>, ҚМЖ —{" "}
                <strong className="tabular-nums">500 ₸</strong>, «Ашық сабақ»
                комбо — <strong className="tabular-nums">1 700 ₸</strong>,
                бизнес-презентация —{" "}
                <strong className="tabular-nums">9 900 ₸</strong>-ден.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={heroWa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#2F80FF] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#126DFB]"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>WhatsApp-қа жазу · {BRAND.phoneDisplay}</span>
                </a>
                <a
                  href="/services/kmzh-ashyq-sabaq"
                  className="inline-flex min-h-[44px] items-center px-2 text-sm font-semibold text-zinc-900 underline"
                >
                  ҚМЖ және ашық сабақ →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 8. DIRECT CONTACTS & GEOGRAPHY (Desique-style "Где мы") */}
        <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-28 lg:px-8">
          <div className="rounded-3xl bg-[#F7F8FA] p-8 sm:p-10">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-[#2F80FF]">
                  Где мы работаем
                </p>
                <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
                  Алматы и весь Казахстан
                </h2>
                <p className="mt-3 max-w-[44ch] text-sm leading-relaxed text-zinc-600">
                  Работаем онлайн с клиентами в Алматы, Астане, Шымкенте,
                  Караганде, Актобе и всех городах РК. Файлы и правки — прямо в
                  WhatsApp, оплата Kaspi или по счёту ИП.
                </p>
                <div className="mt-5 space-y-2.5 text-sm text-zinc-700">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                    <span>{BRAND.coverage}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                    <span>{BRAND.hours}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                    <a
                      href={BRAND.phoneTel}
                      className="font-semibold tabular-nums hover:text-[#2F80FF]"
                    >
                      {BRAND.phoneDisplay}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-2xl bg-white p-6 ring-1 ring-zinc-200/80">
                <div>
                  <div className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                    Официальные каналы {BRAND.name}
                  </div>
                  <div className="mt-4 space-y-3 text-sm">
                    <a
                      href={BRAND.whatsappDirect}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-center justify-between rounded-xl bg-zinc-50 px-4 py-2.5 font-semibold text-zinc-950 hover:bg-[#EFF5FF]"
                    >
                      <span className="inline-flex items-center gap-2.5">
                        <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
                        <span>WhatsApp Business</span>
                      </span>
                      <span className="text-xs text-zinc-500 tabular-nums">
                        {BRAND.phoneDisplay} →
                      </span>
                    </a>
                    <a
                      href={BRAND.threadsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-center justify-between rounded-xl bg-zinc-50 px-4 py-2.5 font-semibold text-zinc-950 hover:bg-[#EFF5FF]"
                    >
                      <span className="inline-flex items-center gap-2.5">
                        <AtSign className="h-4 w-4 text-zinc-900" aria-hidden="true" />
                        <span>Threads {BRAND.handle}</span>
                      </span>
                      <span className="text-xs text-zinc-500">
                        threads.com/@anelii.y →
                      </span>
                    </a>
                    <a
                      href={BRAND.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-center justify-between rounded-xl bg-zinc-50 px-4 py-2.5 font-semibold text-zinc-950 hover:bg-[#EFF5FF]"
                    >
                      <span className="inline-flex items-center gap-2.5">
                        <InstagramIcon className="h-4 w-4 text-zinc-900" />
                        <span>Instagram {BRAND.handle}</span>
                      </span>
                      <span className="text-xs text-zinc-500">
                        instagram.com/anelii.y →
                      </span>
                    </a>
                  </div>
                </div>
                <a
                  href="/contact"
                  className="mt-4 inline-flex min-h-[40px] items-center text-sm font-semibold text-[#2F80FF] hover:underline"
                >
                  Все контакты и реквизиты →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 9. FAQ ACCORDION */}
        <section
          id="faq"
          aria-labelledby="faq-heading"
          className="mx-auto max-w-4xl px-4 pt-20 sm:px-6 sm:pt-28 lg:px-8"
        >
          <p className="text-sm font-semibold text-[#2F80FF]">FAQ</p>
          <h2
            id="faq-heading"
            className="mt-1.5 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl"
          >
            Частые вопросы
          </h2>

          <div className="mt-8 divide-y divide-zinc-200 border-y border-zinc-200">
            {HOME_FAQS.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="flex min-h-[44px] cursor-pointer items-center justify-between gap-4 text-left text-base font-semibold text-zinc-950">
                  <span>{item.q}</span>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-zinc-400 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-2.5 max-w-[68ch] pb-2 text-sm leading-relaxed text-zinc-600">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* 10. USEFUL GUIDES TEASER (SEO/GEO Cluster Links) */}
        <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-28 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#2F80FF]">Полезное</p>
              <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
                Гайды и обзоры студии
              </h2>
            </div>
            <a
              href="/useful"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-zinc-700 hover:text-[#2F80FF]"
            >
              <span>Все материалы →</span>
            </a>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_PAGES.map((p) => (
              <a
                key={p.slug}
                href={`/services/${p.slug}`}
                className="flex flex-col justify-between rounded-2xl bg-[#F7F8FA] p-5 transition-colors hover:bg-[#EFF5FF]"
              >
                <div>
                  <div className="text-xs font-semibold text-[#2F80FF]">
                    {p.badge}
                  </div>
                  <div className="mt-1.5 text-base font-bold text-zinc-950">
                    {p.navLabel}
                  </div>
                </div>
                <div className="mt-3 text-xs font-semibold text-zinc-500">
                  {p.priceHighlight} →
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 11. PRE-FOOTER CTA BANNER (Desique "За дизайном сюда") */}
        <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-28 lg:px-8">
          <div className="justslide-hero-aura rounded-3xl border border-zinc-200/80 p-8 text-center sm:p-14">
            <p className="text-sm font-semibold text-[#2F80FF]">
              Готовы начать?
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
              За презентацией сюда
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-zinc-600">
              Расскажите о задаче — сделаем расчёт за 2 минуты и соберём
              сильные слайды без переплат.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/order"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#2F80FF] px-8 py-3 text-sm font-semibold text-white hover:bg-[#126DFB]"
              >
                Заказать презентацию
              </a>
              <a
                href={heroWa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-zinc-950 ring-1 ring-zinc-200 hover:bg-zinc-50"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
                <span>WhatsApp {BRAND.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <StudioFooter />
    </>
  );
}
