import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { StudioFooter } from "@/components/studio-footer";
import { StudioHeader } from "@/components/studio-header";
import { BRAND, SERVICE_PAGES } from "@/lib/justslide-data";

export const metadata: Metadata = {
  title: "Полезное: гайды по презентациям, ГОСТ и ҚМЖ (Приказ №130) — JustSlide",
  description:
    "Бесплатные чек-листы и руководства студии JustSlide (@anelii.y): оформление презентаций по ГОСТ, структура ҚМЖ по Приказу №130 МОН РК, сильный первый экран коммерческого предложения и обзор цен в Казахстане 2026.",
  alternates: {
    canonical: `${BRAND.siteUrl}/useful`
  }
};

export default function UsefulPage() {
  return (
    <>
      <StudioHeader activePath="/useful" />

      <main className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20 lg:px-8">
        <p className="text-sm font-semibold text-[#2F80FF]">Полезное</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
          Журнал и бесплатные чек-листы {BRAND.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-zinc-600">
          Практические стандарты, по которым мы сами собираем слайды и учебные
          материалы в Казахстане.
        </p>

        {/* 3 Actionable Editorial Checklists */}
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <article className="rounded-3xl bg-[#F7F8FA] p-7">
            <span className="text-xs font-semibold text-[#2F80FF]">
              Чек-лист · ВУЗы РК
            </span>
            <h2 className="mt-2 text-xl font-bold text-zinc-950">
              Идеальная студенческая презентация (16:9)
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                <span>Не более 40–60 слов на слайд: тезисы и цифры вместо сплошного Word-текста.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                <span>Крупный кегль: заголовки 24–32pt, основной текст от 16pt.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                <span>Обязательно: титульный лист, план, выводы и список литературы (в JustSlide — бесплатно).</span>
              </li>
            </ul>
          </article>

          <article lang="kk" className="rounded-3xl bg-[#F7F8FA] p-7">
            <span className="text-xs font-semibold text-[#2F80FF]">
              Стандарт · 130-бұйрық МОН РК
            </span>
            <h2 className="mt-2 text-xl font-bold text-zinc-950">
              ҚМЖ және ашық сабақ құрылымы
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                <span>Бөлім, оқу мақсаты, сабақтың нақты мақсаты және бағалау критерийлері.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                <span>Сабақ кезеңдері: Ұйымдастыру → Негізгі бөлім → Бекіту → Рефлексия.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                <span>Әр тапсырмаға нақты дескриптор және ҚБ балдары (ҚМЖ — 500 ₸).</span>
              </li>
            </ul>
          </article>

          <article className="rounded-3xl bg-[#F7F8FA] p-7">
            <span className="text-xs font-semibold text-[#2F80FF]">
              B2B · Продажи и инвесторы
            </span>
            <h2 className="mt-2 text-xl font-bold text-zinc-950">
              5 правил сильного КП / Pitch Deck
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                <span>1-й экран сразу отвечает: кто вы, какую проблему решаете и в чём выгода.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                <span>1 слайд = 1 ключевая мысль + визуальное доказательство (цифры, схема, кейс).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                <span>Последний экран: чёткий тариф и прямой QR / ссылка в WhatsApp.</span>
              </li>
            </ul>
          </article>
        </div>

        {/* Dedicated Guides Grid */}
        <h2 className="mt-16 text-2xl font-bold tracking-tight text-zinc-950">
          Подробные обзоры и направления
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_PAGES.map((page) => (
            <a
              key={page.slug}
              href={`/services/${page.slug}`}
              className="flex flex-col justify-between rounded-2xl bg-[#F7F8FA] p-6 transition-colors hover:bg-[#EFF5FF]"
            >
              <div>
                <div className="text-xs font-semibold text-[#2F80FF]">
                  {page.badge}
                </div>
                <h3 className="mt-2 text-base font-bold text-zinc-950">
                  {page.h1}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                  {page.metaDescription}
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#2F80FF]">
                <span>Читать полностью</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      </main>

      <StudioFooter />
    </>
  );
}
