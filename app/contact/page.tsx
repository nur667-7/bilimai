import type { Metadata } from "next";
import {
  ArrowRight,
  AtSign,
  Clock,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone
} from "lucide-react";
import { InstagramIcon } from "@/components/brand-mark";
import { StudioFooter } from "@/components/studio-footer";
import { StudioHeader } from "@/components/studio-header";
import { BRAND, buildWhatsAppUrl } from "@/lib/justslide-data";

export const metadata: Metadata = {
  title: "Контакты студии JustSlide (@anelii.y) — WhatsApp, Threads, Instagram",
  description:
    "Контакты студии презентаций JustSlide (@anelii.y, Анели Продакшн) в Алматы и по всему Казахстану: WhatsApp Business +7 700 919 14 02, Threads и Instagram @anelii.y, режим работы ежедневно 09:00–23:00.",
  alternates: {
    canonical: `${BRAND.siteUrl}/contact`
  }
};

export default function ContactPage() {
  const waHref = buildWhatsAppUrl(
    "Здравствуйте! Пишу со страницы контактов JustSlide (@anelii.y):"
  );

  return (
    <>
      <StudioHeader activePath="/contact" />

      <main className="mx-auto max-w-5xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20 lg:px-8">
        <p className="text-sm font-semibold text-[#2F80FF]">Связаться</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
          Контакты студии {BRAND.name}
        </h1>
        <p className="mt-3 text-base text-zinc-500">
          {BRAND.city} и весь Казахстан · те же данные, что в 2ГИС, Kaspi и
          Threads ({BRAND.handle})
        </p>

        {/* Two-column Desique-style contact layout (no form clutter) */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Left Column: Operational Channels */}
          <div className="space-y-5 rounded-3xl bg-[#F7F8FA] p-7 sm:p-8">
            <div>
              <div className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                Телефон и WhatsApp Business
              </div>
              <a
                href={BRAND.phoneTel}
                className="mt-1.5 inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-zinc-950 tabular-nums hover:text-[#2F80FF]"
              >
                <Phone className="h-5 w-5 text-[#2F80FF]" aria-hidden="true" />
                <span>{BRAND.phoneDisplay}</span>
              </a>
              <div className="mt-3">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1EBE5B]"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Написать в WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="border-t border-zinc-200/80 pt-5">
              <div className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                География
              </div>
              <div className="mt-1.5 flex items-start gap-2 text-sm text-zinc-700">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]"
                  aria-hidden="true"
                />
                <span>{BRAND.coverage}</span>
              </div>
            </div>

            <div className="border-t border-zinc-200/80 pt-5">
              <div className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                Режим работы
              </div>
              <div className="mt-1.5 flex items-center gap-2 text-sm text-zinc-700">
                <Clock
                  className="h-4 w-4 shrink-0 text-[#2F80FF]"
                  aria-hidden="true"
                />
                <span>{BRAND.hours}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Socials & Mode of Work */}
          <div className="flex flex-col justify-between space-y-6 rounded-3xl bg-[#F7F8FA] p-7 sm:p-8">
            <div>
              <div className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                Соцсети и портфолио в реальном времени
              </div>
              <div className="mt-3 space-y-3">
                <a
                  href={BRAND.threadsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[52px] items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 ring-1 ring-zinc-200/80 transition-colors hover:ring-[#2F80FF]"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <AtSign className="h-4 w-4 text-zinc-900" aria-hidden="true" />
                    <span>Threads · {BRAND.handle}</span>
                  </span>
                  <ExternalLink
                    className="h-4 w-4 text-zinc-400"
                    aria-hidden="true"
                  />
                </a>

                <a
                  href={BRAND.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[52px] items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 ring-1 ring-zinc-200/80 transition-colors hover:ring-[#2F80FF]"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <InstagramIcon className="h-4 w-4 text-zinc-900" />
                    <span>Instagram · {BRAND.handle}</span>
                  </span>
                  <ExternalLink
                    className="h-4 w-4 text-zinc-400"
                    aria-hidden="true"
                  />
                </a>
              </div>

              <div className="mt-6 border-t border-zinc-200/80 pt-5">
                <div className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                  Формат работы и оплаты
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                  Удалённо по всему Казахстану и миру · быстрая сдача файлов
                  PDF, PPTX и DOCX в WhatsApp. Оплата Kaspi, Kaspi Pay или по
                  счёту для ТОО и ИП (АВР/ЭСФ по запросу).
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200/80">
              <div className="text-sm font-bold text-zinc-950">
                Нужен точный расчёт или подробный бриф?
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                Заполните короткую заявку на 7 полей — она сразу откроется в
                WhatsApp готовым сообщением.
              </p>
              <a
                href="/order"
                className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-[#2F80FF] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#126DFB]"
              >
                <span>Перейти к брифу /order</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Verified Platforms Strip */}
        <section className="mt-8 rounded-3xl bg-[#F7F8FA] p-6 sm:p-8">
          <div className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            Официальное присутствие {BRAND.name} ({BRAND.handle})
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2.5 text-sm font-semibold text-zinc-800">
            <span className="rounded-full bg-white px-4 py-2 ring-1 ring-zinc-200/80">
              2ГИС · Казахстан
            </span>
            <a
              href={BRAND.kaspiAdUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-4 py-2 ring-1 ring-zinc-200/80 hover:ring-[#2F80FF]"
            >
              Kaspi Объявления №124183239 →
            </a>
            <a
              href={BRAND.threadsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-4 py-2 ring-1 ring-zinc-200/80 hover:ring-[#2F80FF]"
            >
              Threads {BRAND.handle}
            </a>
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-4 py-2 ring-1 ring-zinc-200/80 hover:ring-[#2F80FF]"
            >
              Instagram {BRAND.handle}
            </a>
            <a
              href={BRAND.whatsappDirect}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25D366] px-4 py-2 text-white hover:bg-[#1EBE5B]"
            >
              WhatsApp {BRAND.phoneDisplay}
            </a>
          </div>
        </section>
      </main>

      <StudioFooter />
    </>
  );
}
