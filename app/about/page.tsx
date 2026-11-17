import type { Metadata } from "next";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { StudioFooter } from "@/components/studio-footer";
import { StudioHeader } from "@/components/studio-header";
import { BRAND, buildWhatsAppUrl } from "@/lib/justslide-data";

export const metadata: Metadata = {
  title: "О студии JustSlide (@anelii.y) — Наша философия и стандарты",
  description:
    "Студия презентаций JustSlide (@anelii.y, Анели Продакшн) в Алматы и Казахстане: почему мы делаем журнальные слайды от 80 ₸ для учёбы и от 9 900 ₸ для бизнеса быстрее агентств.",
  alternates: {
    canonical: `${BRAND.siteUrl}/about`
  }
};

export default function AboutPage() {
  const waHref = buildWhatsAppUrl(
    "Здравствуйте! Хочу обсудить презентацию с командой JustSlide (@anelii.y)"
  );

  return (
    <>
      <StudioHeader activePath="/about" />

      <main className="mx-auto max-w-4xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20 lg:px-8">
        <p className="text-sm font-semibold text-[#2F80FF]">Студия</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
          {BRAND.name} ({BRAND.handle}) — презентации без лишнего пафоса
        </h1>

        <p className="font-serif-display mt-6 text-2xl leading-snug text-zinc-900">
          Слайды не должны стоить 120 000 ₸ и делаться две недели, чтобы
          выглядеть достойно.
        </p>

        <div className="mt-8 space-y-5 text-base leading-relaxed text-zinc-600">
          <p>
            <strong>{BRAND.name}</strong> (публичный фасад{" "}
            <strong>{BRAND.handle}</strong> / {BRAND.legacyAlias}) выросла из
            простой боли в Казахстане: студентам и учителям предлагают либо
            устаревшие шаблоны «как из Word 2007», либо ценники от 5 000 ₸ с
            ожиданием 2 дня, а малому бизнесу и стартапам агентства выставляют
            счета от 70 000 до 150 000 ₸.
          </p>
          <p>
            Мы построили собственный модульный конвейер журнальной вёрстки 16:9
            с жёстким контролем типографики, контраста и грамотного казахского и
            русского языка. Это позволяет нам держать честные цены:{" "}
            <strong>80 ₸/слайд</strong> для учёбы (от 15 минут) и{" "}
            <strong>от 9 900 ₸</strong> для бизнеса (от 4 часов).
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-[#F7F8FA] p-7">
            <h2 className="text-lg font-bold text-zinc-950">
              Наши принципы вёрстки
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                <span>Чистая сетка 16:9 без перекрытий текста и визуального шума</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                <span>Точный казахский и русский языки (стандарты МОН РК и ГОСТ)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                <span>2 раунда бесплатных правок в каждом тарифе</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-[#EFF5FF] p-7">
            <h2 className="text-lg font-bold text-zinc-950">
              Официальные контакты
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-700">
              <li>
                <strong>WhatsApp Business:</strong>{" "}
                <a
                  href={BRAND.whatsappDirect}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#2F80FF] underline"
                >
                  {BRAND.phoneDisplay}
                </a>
              </li>
              <li>
                <strong>Threads:</strong>{" "}
                <a
                  href={BRAND.threadsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#2F80FF] underline"
                >
                  {BRAND.handle}
                </a>
              </li>
              <li>
                <strong>Instagram:</strong>{" "}
                <a
                  href={BRAND.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#2F80FF] underline"
                >
                  {BRAND.handle}
                </a>
              </li>
            </ul>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#2F80FF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#126DFB]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>Написать в студию</span>
            </a>
          </div>
        </div>
      </main>

      <StudioFooter />
    </>
  );
}
