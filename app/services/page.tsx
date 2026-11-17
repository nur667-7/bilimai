import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { StudioCalculator } from "@/components/studio-calculator";
import { StudioFooter } from "@/components/studio-footer";
import { StudioHeader } from "@/components/studio-header";
import {
  BRAND,
  BUSINESS_MODULES,
  BUSINESS_TIERS,
  SERVICE_PAGES,
  STUDY_TIERS,
  buildWhatsAppUrl
} from "@/lib/justslide-data";

export const metadata: Metadata = {
  title:
    "Услуги и цены на презентации в Казахстане — Учёба от 80 ₸/слайд и Бизнес от 9 900 ₸",
  description:
    "Полный прайс студии JustSlide (@anelii.y): учебные презентации 80 ₸/слайд за 15 мин, анимация 150 ₸/слайд, ҚМЖ 500 ₸, бизнес-редизайн 9 900 ₸, КП под ключ 19 900 ₸, Pitch Deck 34 900 ₸. WhatsApp +7 700 919 14 02.",
  alternates: {
    canonical: `${BRAND.siteUrl}/services`
  }
};

export default function ServicesPage() {
  return (
    <>
      <StudioHeader activePath="/services" />

      <main className="mx-auto max-w-7xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-[#2F80FF]">Услуги и цены</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
            Тарифы {BRAND.name} для учёбы, педагогов и бизнеса
          </h1>
          <p className="mt-3 text-base leading-relaxed text-zinc-600">
            Прозрачные цены без скрытых наценок: вы сразу видите стоимость до
            начала работы, получаете 2 раунда правок бесплатно и оплачиваете
            через Kaspi или счёт ИП.
          </p>
        </div>

        <div className="mt-10">
          <StudioCalculator />
        </div>

        {/* Study & Teachers */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
            Для студентов, школьников и учителей
          </h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
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
                  <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#2F80FF]">
                    {tier.badge}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-zinc-950">
                    {tier.name}
                  </h3>
                  <div className="mt-2 text-3xl font-bold text-zinc-950 tabular-nums">
                    {tier.price}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500 tabular-nums">
                    {tier.unitNote} · {tier.turnaround}
                  </div>
                  <p className="mt-3 text-sm text-zinc-600">
                    {tier.description}
                  </p>
                  <ul className="mt-5 space-y-2 text-sm text-zinc-700">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={buildWhatsAppUrl(tier.whatsappText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-[46px] w-full items-center justify-center rounded-full bg-[#2F80FF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#126DFB]"
                >
                  Заказать в WhatsApp
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Business */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
            Для бизнеса, стартапов и тендеров
          </h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
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
                        : "bg-white text-[#2F80FF]"
                    }`}
                  >
                    {tier.badge}
                  </span>
                  <h3 className="mt-4 text-xl font-bold">{tier.name}</h3>
                  <div className="mt-2 text-3xl font-bold tabular-nums">
                    {tier.price}
                  </div>
                  <div
                    className={`mt-1 text-xs tabular-nums ${
                      tier.highlighted ? "text-zinc-300" : "text-zinc-500"
                    }`}
                  >
                    {tier.unitNote} · {tier.turnaround}
                  </div>
                  <p
                    className={`mt-3 text-sm ${
                      tier.highlighted ? "text-zinc-300" : "text-zinc-600"
                    }`}
                  >
                    {tier.description}
                  </p>
                  <ul
                    className={`mt-5 space-y-2 text-sm ${
                      tier.highlighted ? "text-zinc-200" : "text-zinc-700"
                    }`}
                  >
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={buildWhatsAppUrl(tier.whatsappText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-[46px] w-full items-center justify-center rounded-full bg-[#2F80FF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#126DFB]"
                >
                  Обсудить в WhatsApp
                </a>
              </div>
            ))}
          </div>

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
        </section>

        {/* Detailed service pages */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
            Подробно по направлениям
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_PAGES.map((p) => (
              <a
                key={p.slug}
                href={`/services/${p.slug}`}
                className="flex flex-col justify-between rounded-2xl bg-[#F7F8FA] p-5 hover:bg-[#EFF5FF]"
              >
                <div>
                  <div className="text-xs font-semibold text-[#2F80FF]">
                    {p.badge}
                  </div>
                  <div className="mt-1.5 text-base font-bold text-zinc-950">
                    {p.navLabel}
                  </div>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#2F80FF]">
                  <span>{p.priceHighlight}</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </section>
      </main>

      <StudioFooter />
    </>
  );
}
