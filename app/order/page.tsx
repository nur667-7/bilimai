import type { Metadata } from "next";
import { Check, MessageCircle } from "lucide-react";
import { OrderForm } from "@/components/order-form";
import { StudioFooter } from "@/components/studio-footer";
import { StudioHeader } from "@/components/studio-header";
import { BRAND, buildWhatsAppUrl } from "@/lib/justslide-data";

export const metadata: Metadata = {
  title: "Заказать презентацию онлайн — Бриф студии JustSlide (@anelii.y)",
  description:
    "Быстрая заявка на презентацию в JustSlide (@anelii.y): учебные слайды от 80 ₸ за 15 минут, ҚМЖ 500 ₸, бизнес-КП и Pitch Deck от 9 900 ₸.",
  alternates: {
    canonical: `${BRAND.siteUrl}/order`
  }
};

export default function OrderPage() {
  const quickWa = buildWhatsAppUrl(
    "Здравствуйте! Хочу быстро обсудить заказ презентации в JustSlide (@anelii.y)"
  );

  return (
    <>
      <StudioHeader activePath="/order" />

      <main className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20 lg:px-8">
        <p className="text-sm font-semibold text-[#2F80FF]">Заказать дизайн</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
          Расскажите о вашей презентации
        </h1>
        <p className="mt-3 max-w-2xl text-base text-zinc-600">
          Заполните короткий бриф — он сразу сформируется в удобное сообщение
          для нашего WhatsApp Business ({BRAND.phoneDisplay}). Ответим в течение
          5 минут.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <div className="rounded-3xl bg-[#F7F8FA] p-6 sm:p-8 lg:col-span-8">
            <OrderForm />
          </div>

          <aside className="space-y-5 lg:col-span-4">
            <div className="rounded-3xl bg-[#EFF5FF] p-6">
              <div className="text-xs font-semibold text-[#2F80FF]">
                Что вы получаете
              </div>
              <ul className="mt-3 space-y-2.5 text-sm text-zinc-800">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                  <span>Фиксированная цена до начала работы</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                  <span>Учёба и ҚМЖ — от 15 минут; Бизнес — от 4 часов</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                  <span>Титульный лист, план и литература — 0 ₸</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                  <span>2 бесплатных раунда правок включены</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]" aria-hidden="true" />
                  <span>Оплата Kaspi после превью (или счёт ИП)</span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl bg-[#F7F8FA] p-6">
              <div className="text-sm font-bold text-zinc-950">
                Проще написать напрямую?
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-600">
                Просто скиньте тему или файл Word в WhatsApp — мы сами зададим
                нужные вопросы.
              </p>
              <a
                href={quickWa}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1EBE5B]"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>WhatsApp {BRAND.phoneDisplay}</span>
              </a>
            </div>
          </aside>
        </div>
      </main>

      <StudioFooter />
    </>
  );
}
