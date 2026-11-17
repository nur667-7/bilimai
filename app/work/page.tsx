import type { Metadata } from "next";
import { AtSign, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/brand-mark";
import { PortfolioCard } from "@/components/portfolio-card";
import { StudioFooter } from "@/components/studio-footer";
import { StudioHeader } from "@/components/studio-header";
import { BRAND, PORTFOLIO_ITEMS, buildWhatsAppUrl } from "@/lib/justslide-data";

export const metadata: Metadata = {
  title: "Портфолио и стили презентаций — Работы JustSlide (@anelii.y)",
  description:
    "Примеры стилей и форматов презентаций студии JustSlide (@anelii.y): журнальная вёрстка 16:9, коммерческие предложения B2B, Pitch Deck, ҚМЖ + Ашық сабақ и Morph-анимация.",
  alternates: {
    canonical: `${BRAND.siteUrl}/work`
  }
};

export default function WorkPage() {
  const waHref = buildWhatsAppUrl(
    "Здравствуйте! Посмотрел(а) работы JustSlide, хочу заказать презентацию в похожем стиле:"
  );

  return (
    <>
      <StudioHeader activePath="/work" />

      <main className="mx-auto max-w-7xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-[#2F80FF]">Портфолио</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
            Работы и стили презентаций {BRAND.name}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-zinc-600">
            Ниже — ключевые дизайн-системы, в которых мы собираем слайды для
            студентов, учителей и компаний Казахстана. Живые свежие кейсы и
            видео-разборы «До/После» ежедневно выходят в Threads и Instagram{" "}
            <strong>{BRAND.handle}</strong>.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href={BRAND.threadsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#F7F8FA] px-5 py-2 text-sm font-semibold text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-100"
            >
              <AtSign className="h-4 w-4" aria-hidden="true" />
              <span>Кейсы в Threads {BRAND.handle}</span>
            </a>
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#F7F8FA] px-5 py-2 text-sm font-semibold text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-100"
            >
              <InstagramIcon className="h-4 w-4" />
              <span>Кейсы в Instagram {BRAND.handle}</span>
            </a>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PORTFOLIO_ITEMS.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-14 rounded-3xl bg-[#F7F8FA] p-8 text-center sm:p-10">
          <h2 className="text-2xl font-bold text-zinc-950">
            Хотите увидеть живой пример именно по вашей теме?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-600">
            Напишите в WhatsApp вашу нишу или предмет — сразу скинем 2–3
            релевантных PDF/видео-примера из нашего архива.
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#2F80FF] px-7 py-3 text-sm font-semibold text-white hover:bg-[#126DFB]"
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Запросить примеры в WhatsApp ({BRAND.phoneDisplay})</span>
          </a>
        </div>
      </main>

      <StudioFooter />
    </>
  );
}
