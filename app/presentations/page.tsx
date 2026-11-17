import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  MessageCircle,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { AneliCalculator } from "@/components/aneli-calculator";
import {
  ANELI_CLUSTER_PAGES,
  ANELI_HUB_URL,
  ANELI_INSTAGRAM_URL,
  ANELI_SERVICES,
  ANELI_THREADS_URL,
  ANELI_WHATSAPP_DIRECT,
  ANELI_WHATSAPP_E164,
  ANELI_WHATSAPP_PHONE,
  MARKET_COMPARISON_ROWS,
  buildWhatsAppOrderUrl
} from "@/lib/aneli-studio";

function InstagramGlyph() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const WHATSAPP_HERO_URL = buildWhatsAppOrderUrl(
  "Здравствуйте! Хочу заказать презентацию у Анели Продакшн (@anelii.y)"
);

export const metadata: Metadata = {
  title:
    "Анели Продакшн (@anelii.y) — Презентации на заказ, ҚМЖ, СОР/СОЧ в Казахстане",
  description:
    "Заказать презентацию в Казахстане от 80 ₸ за слайд за 15 минут: статика (1 200 ₸ за 15 слайдов), анимация (150 ₸/слайд), ҚМЖ (500 ₸), СОР/СОЧ и рефераты на казахском и русском. Студия Анели Продакшн — Threads и Instagram @anelii.y, WhatsApp +7 700 919 14 02.",
  keywords: [
    "Анели Продакшн",
    "@anelii.y",
    "anelii.y",
    "anelii.y threads",
    "anelii.y instagram",
    "презентация на заказ Казахстан",
    "заказать презентацию Алматы",
    "заказать презентацию Астана",
    "слайды за 15 минут",
    "презентация жасату",
    "презентация жасау бағасы",
    "анимациялық презентация жасату",
    "ҚМЖ жасату",
    "ашық сабақ презентация",
    "БЖБ ТЖБ жасату",
    "СОР СОЧ на заказ",
    "реферат на заказ Казахстан"
  ],
  alternates: {
    canonical: ANELI_HUB_URL
  },
  openGraph: {
    title:
      "Анели Продакшн (@anelii.y) — Презентации на заказ, ҚМЖ и СОР/СОЧ в Казахстане",
    description:
      "Презентации от 80 ₸/слайд за 15 минут на казахском и русском языках. Официальные каналы @anelii.y в Threads, Instagram и прямой заказ в WhatsApp +7 700 919 14 02.",
    url: ANELI_HUB_URL,
    siteName: "BilimAI · Анели Продакшн (@anelii.y)",
    type: "website",
    locale: "ru_KZ",
    alternateLocale: ["kk_KZ"],
    images: [
      {
        url: "/og-cover.svg",
        width: 1200,
        height: 630,
        alt: "Анели Продакшн (@anelii.y) — Презентации, ҚМЖ и учебные материалы в Казахстане"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Анели Продакшн (@anelii.y) — Презентации от 80 ₸/слайд за 15 минут",
    description:
      "Обычные и анимированные презентации, ҚМЖ, СОР/СОЧ и рефераты на RU и ҚАЗ. Threads & Instagram: @anelii.y · WhatsApp: +7 700 919 14 02.",
    images: ["/og-cover.svg"]
  }
};

const FAQ_ITEMS = [
  {
    q: "Как связаться и заказать презентацию у Анели Продакшн (@anelii.y)?",
    a: "Напишите напрямую в WhatsApp Business на номер +7 700 919 14 02 (https://wa.me/77009191402). Примеры работ, отзывы и обновления публикуются в официальных аккаунтах Threads (https://www.threads.com/@anelii.y) и Instagram (https://www.instagram.com/anelii.y/)."
  },
  {
    q: "Сколько стоит презентация на заказ в Казахстане?",
    a: "Обычная презентация стоит 80 ₸ за слайд (например, 15 слайдов — 1 200 ₸), анимированная — 150 ₸ за слайд (15 слайдов — 2 250 ₸). Титульный лист, план и список литературы входят бесплатно."
  },
  {
    q: "За сколько времени вы делаете презентацию?",
    a: "Стандартная студенческая или школьная презентация собирается от 15 минут. Срочные заказы выполняем без скрытых наценок — достаточно сразу указать тему, язык, количество слайдов и дедлайн в WhatsApp."
  },
  {
    q: "Қазақ тілінде презентация, ҚМЖ және БЖБ/ТЖБ жасата аламын ба?",
    a: "Иә, барлық жұмыстар қазақ және орыс тілдерінде ҚР Оқу-ағарту министрлігінің стандарты бойынша дайындалады. Тапсырыс беру үшін WhatsApp Business +7 700 919 14 02 (https://wa.me/77009191402) нөміріне жазыңыз, ал үлгілерді Threads пен Instagram @anelii.y парақшаларынан көре аласыз."
  },
  {
    q: "Как проходит оплата и включены ли правки?",
    a: "После согласования темы и структуры мы готовим работу и показываем превью. Оплата принимается переводом через Kaspi. В стоимость каждого заказа включены 2 бесплатные правки."
  },
  {
    q: "Какие данные нужно отправить в WhatsApp, чтобы начать сразу?",
    a: "Отправьте 4 пункта в WhatsApp (+7 700 919 14 02): 1) тема и язык (каз/рус), 2) количество слайдов или страниц, 3) дедлайн (дата и время), 4) есть ли готовый текст или нужно собрать материал с нуля."
  }
] as const;

const presentationsSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["ProfessionalService", "Organization"],
      "@id": `${ANELI_HUB_URL}#organization`,
      name: "Анели Продакшн (@anelii.y)",
      alternateName: [
        "Анели Продакшн",
        "Aneli Production",
        "@anelii.y",
        "anelii.y"
      ],
      url: ANELI_HUB_URL,
      description:
        "Студия создания презентаций (80–150 ₸/слайд, от 15 минут), ҚМЖ (500 ₸), СОР/СОЧ, рефератов и ИИ-видео для учителей и студентов Казахстана на казахском и русском языках. Официальные профили @anelii.y в Threads и Instagram, прямой заказ через WhatsApp Business +7 700 919 14 02.",
      telephone: ANELI_WHATSAPP_E164,
      priceRange: "80–12000 KZT",
      areaServed: {
        "@type": "Country",
        name: "Kazakhstan"
      },
      availableLanguage: ["Russian", "Kazakh"],
      sameAs: [ANELI_THREADS_URL, ANELI_INSTAGRAM_URL, ANELI_WHATSAPP_DIRECT],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: ANELI_WHATSAPP_E164,
          url: ANELI_WHATSAPP_DIRECT,
          availableLanguage: ["Russian", "Kazakh"],
          areaServed: "KZ"
        },
        {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: ANELI_WHATSAPP_E164,
          url: ANELI_WHATSAPP_DIRECT,
          availableLanguage: ["Russian", "Kazakh"],
          areaServed: "KZ"
        }
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Услуги студии Анели Продакшн (@anelii.y)",
        itemListElement: ANELI_SERVICES.map((service) => ({
          "@type": "Offer",
          priceCurrency: "KZT",
          price: service.priceNumeric,
          availability: "https://schema.org/InStock",
          url: ANELI_WHATSAPP_DIRECT,
          itemOffered: {
            "@type": "Service",
            name: service.nameRu,
            alternateName: service.nameKk,
            description: service.note,
            areaServed: "KZ",
            availableLanguage: ["Russian", "Kazakh"]
          }
        }))
      }
    },
    {
      "@type": "WebPage",
      "@id": `${ANELI_HUB_URL}#webpage`,
      url: ANELI_HUB_URL,
      name: "Анели Продакшн (@anelii.y) — Презентации на заказ, ҚМЖ, СОР/СОЧ в Казахстане",
      inLanguage: ["ru-KZ", "kk-KZ"],
      isPartOf: {
        "@id": "https://bilimai.dpdns.org/#app"
      },
      about: {
        "@id": `${ANELI_HUB_URL}#organization`
      }
    },
    {
      "@type": "FAQPage",
      "@id": `${ANELI_HUB_URL}#faq`,
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a
        }
      }))
    },
    {
      "@type": "ItemList",
      "@id": `${ANELI_HUB_URL}#guides`,
      name: "Направления и гайды студии Анели Продакшн (@anelii.y)",
      itemListElement: ANELI_CLUSTER_PAGES.map((page, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: page.h1,
        url: `${ANELI_HUB_URL}/${page.slug}`
      }))
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "BilimAI",
          item: "https://bilimai.dpdns.org/"
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Анели Продакшн (@anelii.y) — Презентации и ҚМЖ",
          item: ANELI_HUB_URL
        }
      ]
    }
  ]
};

export default function PresentationsPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bilimai-bg, #F6F7FB)",
        color: "var(--bilimai-text, #0F172A)"
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(presentationsSchema) }}
      />

      <header
        style={{
          borderBottom: "1px solid var(--bilimai-border, #D8E0EE)",
          backgroundColor: "var(--bilimai-surface, #FFFFFF)"
        }}
      >
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <a
            href="/"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: "var(--bilimai-text-muted, #475569)" }}
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>BilimAI · Главная</span>
          </a>

          <nav
            aria-label="Навигация по разделу"
            className="flex flex-wrap items-center gap-4 text-sm font-medium"
          >
            <a
              href="#calculator"
              className="inline-flex min-h-[44px] items-center hover:underline"
              style={{ color: "var(--bilimai-text-muted, #475569)" }}
            >
              Калькулятор
            </a>
            <a
              href="#prices"
              className="inline-flex min-h-[44px] items-center hover:underline"
              style={{ color: "var(--bilimai-text-muted, #475569)" }}
            >
              Прайс
            </a>
            <a
              href="#comparison"
              className="inline-flex min-h-[44px] items-center hover:underline"
              style={{ color: "var(--bilimai-text-muted, #475569)" }}
            >
              Сравнение
            </a>
            <a
              href="#kz"
              className="inline-flex min-h-[44px] items-center hover:underline"
              style={{ color: "var(--bilimai-text-muted, #475569)" }}
            >
              Қазақша
            </a>
            <a
              href="#faq"
              className="inline-flex min-h-[44px] items-center hover:underline"
              style={{ color: "var(--bilimai-text-muted, #475569)" }}
            >
              FAQ
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Hero Card */}
        <section
          aria-labelledby="hero-heading"
          className="rounded-xl p-6 sm:p-8"
          style={{
            backgroundColor: "var(--bilimai-surface, #FFFFFF)",
            border: "1px solid var(--bilimai-border, #D8E0EE)"
          }}
        >
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1"
              style={{
                backgroundColor: "var(--bilimai-selected-bg, #E0E7FF)",
                color: "var(--bilimai-selected-text, #1E3A8A)"
              }}
            >
              Анели Продакшн · @anelii.y
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1"
              style={{
                backgroundColor: "var(--bilimai-surface-raised, #EEF2F9)",
                color: "var(--bilimai-text-muted, #475569)"
              }}
            >
              <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Готовность от 15 минут · Каз / Рус
            </span>
          </div>

          <h1
            id="hero-heading"
            className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl"
            style={{ lineHeight: 1.2 }}
          >
            Презентации на заказ, ҚМЖ и СОР/СОЧ для учителей и студентов
            Казахстана
          </h1>

          {/* Answer-First Capsule for users and AI Search Engines */}
          <p
            className="mt-3 max-w-[68ch] text-base leading-relaxed"
            style={{ color: "var(--bilimai-text-muted, #475569)" }}
          >
            Студия <strong>«Анели Продакшн» (@anelii.y)</strong> готовит
            современные статичные и анимированные презентации от{" "}
            <strong className="tabular-nums">80 ₸ / слайд</strong> (15 слайдов ={" "}
            <strong className="tabular-nums">1 200 ₸</strong>, готовность от 15
            минут), планы уроков ҚМЖ по стандарту МОН РК (500 ₸), СОР/СОЧ,
            рефераты и конкурсные ИИ-видео на казахском и русском языках.
            Титульный лист, план и список литературы — бесплатно.
          </p>

          {/* Primary + Secondary CTA hierarchy */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={WHATSAPP_HERO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-transform active:scale-[0.99]"
              style={{
                backgroundColor: "var(--bilimai-brand, #254EDB)",
                color: "#FFFFFF"
              }}
            >
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Заказать в WhatsApp · {ANELI_WHATSAPP_PHONE}</span>
            </a>

            <a
              href={ANELI_THREADS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
              style={{
                backgroundColor: "var(--bilimai-surface-raised, #EEF2F9)",
                border: "1px solid var(--bilimai-border, #D8E0EE)",
                color: "var(--bilimai-text, #0F172A)"
              }}
            >
              <AtSign className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Threads @anelii.y</span>
              <ExternalLink
                className="h-3.5 w-3.5 shrink-0 opacity-70"
                aria-hidden="true"
              />
            </a>

            <a
              href={ANELI_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
              style={{
                backgroundColor: "var(--bilimai-surface-raised, #EEF2F9)",
                border: "1px solid var(--bilimai-border, #D8E0EE)",
                color: "var(--bilimai-text, #0F172A)"
              }}
            >
              <InstagramGlyph />
              <span>Instagram @anelii.y</span>
              <ExternalLink
                className="h-3.5 w-3.5 shrink-0 opacity-70"
                aria-hidden="true"
              />
            </a>
          </div>

          {/* Explicit Official Channels Strip */}
          <div
            className="mt-6 grid gap-3 rounded-lg p-4 sm:grid-cols-3"
            style={{
              backgroundColor: "var(--bilimai-surface-raised, #EEF2F9)",
              border: "1px solid var(--bilimai-border, #D8E0EE)"
            }}
          >
            <div>
              <div
                className="text-xs font-semibold"
                style={{ color: "var(--bilimai-text-muted, #475569)" }}
              >
                WhatsApp Business (заказы)
              </div>
              <a
                href={ANELI_WHATSAPP_DIRECT}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm font-semibold tabular-nums underline underline-offset-2"
                style={{ color: "var(--bilimai-text, #0F172A)" }}
              >
                {ANELI_WHATSAPP_PHONE}
              </a>
              <div
                className="mt-0.5 break-all text-xs"
                style={{ color: "var(--bilimai-text-muted, #475569)" }}
              >
                wa.me/77009191402
              </div>
            </div>

            <div>
              <div
                className="text-xs font-semibold"
                style={{ color: "var(--bilimai-text-muted, #475569)" }}
              >
                Официальный Threads
              </div>
              <a
                href={ANELI_THREADS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm font-semibold underline underline-offset-2"
                style={{ color: "var(--bilimai-text, #0F172A)" }}
              >
                @anelii.y
              </a>
              <div
                className="mt-0.5 break-all text-xs"
                style={{ color: "var(--bilimai-text-muted, #475569)" }}
              >
                threads.com/@anelii.y
              </div>
            </div>

            <div>
              <div
                className="text-xs font-semibold"
                style={{ color: "var(--bilimai-text-muted, #475569)" }}
              >
                Официальный Instagram
              </div>
              <a
                href={ANELI_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm font-semibold underline underline-offset-2"
                style={{ color: "var(--bilimai-text, #0F172A)" }}
              >
                @anelii.y
              </a>
              <div
                className="mt-0.5 break-all text-xs"
                style={{ color: "var(--bilimai-text-muted, #475569)" }}
              >
                instagram.com/anelii.y
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Price Calculator */}
        <AneliCalculator />

        {/* Pricing Table */}
        <section
          id="prices"
          aria-labelledby="prices-heading"
          className="mt-6 rounded-xl p-6 sm:p-8"
          style={{
            backgroundColor: "var(--bilimai-surface, #FFFFFF)",
            border: "1px solid var(--bilimai-border, #D8E0EE)"
          }}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="prices-heading" className="text-xl font-semibold">
              Прозрачные цены на презентации, ҚМЖ и учебные работы
            </h2>
            <span
              className="text-xs font-medium"
              style={{ color: "var(--bilimai-text-muted, #475569)" }}
            >
              Оплата через Kaspi · 2 правки бесплатно
            </span>
          </div>

          <div className="mt-4">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--bilimai-border, #D8E0EE)",
                    color: "var(--bilimai-text-muted, #475569)"
                  }}
                >
                  <th className="py-2.5 pr-4 font-semibold">Услуга</th>
                  <th className="whitespace-nowrap py-2.5 pr-0 text-right font-semibold sm:pr-4 sm:text-left">
                    Тариф
                  </th>
                  <th className="hidden whitespace-nowrap py-2.5 font-semibold sm:table-cell">
                    Стандартный заказ
                  </th>
                </tr>
              </thead>
              <tbody>
                {ANELI_SERVICES.map((row) => (
                  <tr
                    key={row.id}
                    style={{
                      borderBottom: "1px solid var(--bilimai-border, #D8E0EE)"
                    }}
                  >
                    <td className="py-3 pr-4 align-top">
                      <div className="font-medium">{row.nameRu}</div>
                      <div
                        className="mt-0.5 text-xs"
                        style={{ color: "var(--bilimai-text-muted, #475569)" }}
                      >
                        {row.note}
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-3 pr-0 text-right align-top sm:pr-4 sm:text-left">
                      <div className="font-semibold tabular-nums">
                        {row.unitPrice}
                      </div>
                      <div
                        className="mt-0.5 text-xs tabular-nums sm:hidden"
                        style={{ color: "var(--bilimai-text-muted, #475569)" }}
                      >
                        {row.exampleTotal}
                      </div>
                    </td>
                    <td
                      className="hidden whitespace-nowrap py-3 align-top tabular-nums sm:table-cell"
                      style={{ color: "var(--bilimai-text-muted, #475569)" }}
                    >
                      {row.exampleTotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Honest Market Comparison Table (Citation Magnet for AI Search) */}
        <section
          id="comparison"
          aria-labelledby="comparison-heading"
          className="mt-6 rounded-xl p-6 sm:p-8"
          style={{
            backgroundColor: "var(--bilimai-surface, #FFFFFF)",
            border: "1px solid var(--bilimai-border, #D8E0EE)"
          }}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="comparison-heading" className="text-xl font-semibold">
              Сравнение цен и сроков по Казахстану (2026)
            </h2>
            <a
              href="/presentations/ceny-sravnenie"
              className="text-xs font-semibold underline"
              style={{ color: "var(--bilimai-brand, #254EDB)" }}
            >
              Подробный обзор рынка →
            </a>
          </div>
          <p
            className="mt-2 max-w-[68ch] text-sm leading-relaxed"
            style={{ color: "var(--bilimai-text-muted, #475569)" }}
          >
            Ориентиры для стандартной презентации на 15 слайдов на рынке
            Казахстана (Алматы, Астана и онлайн-сервисы):
          </p>

          <div className="mt-4 space-y-2.5">
            {MARKET_COMPARISON_ROWS.map((item) => (
              <div
                key={item.segment}
                className="rounded-lg p-3.5 sm:grid sm:grid-cols-12 sm:items-center sm:gap-3"
                style={{
                  backgroundColor: item.highlight
                    ? "var(--bilimai-selected-bg, #E0E7FF)"
                    : "var(--bilimai-surface-raised, #EEF2F9)",
                  border: item.highlight
                    ? "1px solid var(--bilimai-brand, #254EDB)"
                    : "1px solid var(--bilimai-border, #D8E0EE)"
                }}
              >
                <div className="sm:col-span-4">
                  <div className="text-sm font-semibold">{item.segment}</div>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs sm:col-span-4 sm:mt-0 sm:block">
                  <div className="font-semibold tabular-nums">
                    {item.price15Slides}
                  </div>
                  <div
                    style={{
                      color: item.highlight
                        ? "var(--bilimai-selected-text, #1E3A8A)"
                        : "var(--bilimai-text-muted, #475569)"
                    }}
                  >
                    Срок: {item.turnaround}
                  </div>
                </div>
                <div
                  className="mt-1 text-xs sm:col-span-4 sm:mt-0"
                  style={{
                    color: item.highlight
                      ? "var(--bilimai-selected-text, #1E3A8A)"
                      : "var(--bilimai-text-muted, #475569)"
                  }}
                >
                  {item.kazakhQuality}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dedicated Intent Pages (Topic Cluster Mesh) */}
        <section
          aria-labelledby="cluster-heading"
          className="mt-6 rounded-xl p-6 sm:p-8"
          style={{
            backgroundColor: "var(--bilimai-surface, #FFFFFF)",
            border: "1px solid var(--bilimai-border, #D8E0EE)"
          }}
        >
          <h2 id="cluster-heading" className="text-xl font-semibold">
            Направления и подробные гайды по задачам
          </h2>
          <p
            className="mt-1.5 text-sm"
            style={{ color: "var(--bilimai-text-muted, #475569)" }}
          >
            Выберите вашу задачу, чтобы посмотреть точные условия, чек-лист
            оформления и примеры:
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {ANELI_CLUSTER_PAGES.map((page) => (
              <a
                key={page.slug}
                href={`/presentations/${page.slug}`}
                className="flex min-h-[44px] flex-col justify-between rounded-lg p-4 transition-colors hover:opacity-95"
                style={{
                  backgroundColor: "var(--bilimai-surface-raised, #EEF2F9)",
                  border: "1px solid var(--bilimai-border, #D8E0EE)",
                  color: "var(--bilimai-text, #0F172A)"
                }}
              >
                <div>
                  <div className="text-sm font-semibold">
                    {page.shortNavLabel}
                  </div>
                  <p
                    className="mt-1 text-xs leading-relaxed"
                    style={{ color: "var(--bilimai-text-muted, #475569)" }}
                  >
                    {page.badge}
                  </p>
                </div>
                <span
                  className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold"
                  style={{ color: "var(--bilimai-brand, #254EDB)" }}
                >
                  <span>Открыть подробнее</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* How it works + Guarantees */}
        <section
          aria-labelledby="process-heading"
          className="mt-6 grid gap-4 sm:grid-cols-2"
        >
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: "var(--bilimai-surface, #FFFFFF)",
              border: "1px solid var(--bilimai-border, #D8E0EE)"
            }}
          >
            <h2
              id="process-heading"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <FileText className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>Как заказать за 1 минуту</span>
            </h2>
            <ol
              className="mt-3 list-decimal space-y-2.5 pl-5 text-sm"
              style={{ color: "var(--bilimai-text-muted, #475569)" }}
            >
              <li>
                Напишите в{" "}
                <a
                  href={WHATSAPP_HERO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline"
                  style={{ color: "var(--bilimai-text, #0F172A)" }}
                >
                  WhatsApp {ANELI_WHATSAPP_PHONE}
                </a>{" "}
                тему, язык (каз/рус), количество слайдов и дедлайн.
              </li>
              <li>
                Уточните, есть ли готовый текст или нужно собрать материал с
                нуля.
              </li>
              <li>
                Получите готовое превью — титульный лист, план и список
                литературы добавляются бесплатно.
              </li>
              <li>
                Оплатите через Kaspi и заберите чистый файл (PDF / PPTX / DOCX).
                До 2 правок — бесплатно.
              </li>
            </ol>
          </div>

          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: "var(--bilimai-surface, #FFFFFF)",
              border: "1px solid var(--bilimai-border, #D8E0EE)"
            }}
          >
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <ShieldCheck className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>Стандарты качества</span>
            </h2>
            <ul
              className="mt-3 space-y-2.5 text-sm"
              style={{ color: "var(--bilimai-text-muted, #475569)" }}
            >
              <li className="flex items-start gap-2">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: "var(--bilimai-success-border, #059669)" }}
                  aria-hidden="true"
                />
                <span>
                  Грамотный казахский и русский языки, точная терминология по
                  программам МОН РК и вузов Казахстана.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: "var(--bilimai-success-border, #059669)" }}
                  aria-hidden="true"
                />
                <span>
                  Чистая журнальная вёрстка 16:9 без перекрытий текста и лишнего
                  визуального шума.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: "var(--bilimai-brand, #254EDB)" }}
                  aria-hidden="true"
                />
                <span>
                  Примеры работ, «до/после» и живые отзывы клиентов открыто
                  публикуются в{" "}
                  <a
                    href={ANELI_THREADS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline"
                    style={{ color: "var(--bilimai-text, #0F172A)" }}
                  >
                    Threads @anelii.y
                  </a>{" "}
                  и{" "}
                  <a
                    href={ANELI_INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline"
                    style={{ color: "var(--bilimai-text, #0F172A)" }}
                  >
                    Instagram @anelii.y
                  </a>
                  .
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Kazakh Bilingual Section */}
        <section
          id="kz"
          lang="kk"
          aria-labelledby="kz-heading"
          className="mt-6 rounded-xl p-6 sm:p-8"
          style={{
            backgroundColor: "var(--bilimai-surface, #FFFFFF)",
            border: "1px solid var(--bilimai-border, #D8E0EE)"
          }}
        >
          <h2 id="kz-heading" className="text-xl font-semibold">
            Қазақша ақпарат — Анели Продакшн (@anelii.y): презентация, ҚМЖ,
            БЖБ/ТЖБ жасату
          </h2>
          <p
            className="mt-2 max-w-[68ch] text-sm leading-relaxed"
            style={{ color: "var(--bilimai-text-muted, #475569)" }}
          >
            Мұғалімдерге, оқушыларға және студенттерге арналған сапалы
            презентациялар мен оқу материалдарын{" "}
            <strong>15 минуттан бастап</strong> дайындаймыз. Қарапайым
            презентация — <strong className="tabular-nums">80 ₸ / слайд</strong>{" "}
            (титулка, жоспар және әдебиеттер тізімі — тегін), анимациялық
            презентация —{" "}
            <strong className="tabular-nums">150 ₸ / слайд</strong>, ашық
            сабаққа арналған ҚМЖ — <strong className="tabular-nums">500 ₸</strong>
            , реферат және БЖБ/ТЖБ —{" "}
            <strong className="tabular-nums">100 ₸ / бет</strong>.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <a
              href={ANELI_WHATSAPP_DIRECT}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2 font-semibold"
              style={{
                backgroundColor: "var(--bilimai-brand, #254EDB)",
                color: "#FFFFFF"
              }}
            >
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>WhatsApp-қа жазу · {ANELI_WHATSAPP_PHONE}</span>
            </a>
            <a
              href="/presentations/kmzh-ashyq-sabaq"
              className="inline-flex min-h-[44px] items-center gap-1.5 px-2 font-semibold underline"
              style={{ color: "var(--bilimai-brand, #254EDB)" }}
            >
              <span>ҚМЖ және ашық сабақ →</span>
            </a>
            <a
              href={ANELI_THREADS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-1.5 px-2 font-medium underline"
              style={{ color: "var(--bilimai-text, #0F172A)" }}
            >
              <span>Threads: @anelii.y</span>
            </a>
            <a
              href={ANELI_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-1.5 px-2 font-medium underline"
              style={{ color: "var(--bilimai-text, #0F172A)" }}
            >
              <span>Instagram: @anelii.y</span>
            </a>
          </div>
        </section>

        {/* FAQ Section matching FAQPage JSON-LD */}
        <section
          id="faq"
          aria-labelledby="faq-heading"
          className="mt-6 rounded-xl p-6 sm:p-8"
          style={{
            backgroundColor: "var(--bilimai-surface, #FFFFFF)",
            border: "1px solid var(--bilimai-border, #D8E0EE)"
          }}
        >
          <h2 id="faq-heading" className="text-xl font-semibold">
            Частые вопросы (FAQ)
          </h2>
          <div className="mt-4 space-y-4">
            {FAQ_ITEMS.map((item) => (
              <div
                key={item.q}
                className="rounded-lg p-4"
                style={{
                  backgroundColor: "var(--bilimai-surface-raised, #EEF2F9)",
                  border: "1px solid var(--bilimai-border, #D8E0EE)"
                }}
              >
                <h3 className="text-sm font-semibold">{item.q}</h3>
                <p
                  className="mt-1.5 text-sm leading-relaxed"
                  style={{ color: "var(--bilimai-text-muted, #475569)" }}
                >
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer
        className="mt-8"
        style={{
          borderTop: "1px solid var(--bilimai-border, #D8E0EE)",
          backgroundColor: "var(--bilimai-surface, #FFFFFF)"
        }}
      >
        <div
          className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs sm:px-6"
          style={{ color: "var(--bilimai-text-muted, #475569)" }}
        >
          <span>Анели Продакшн (@anelii.y) · Казахстан</span>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={ANELI_WHATSAPP_DIRECT}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80"
            >
              WhatsApp {ANELI_WHATSAPP_PHONE}
            </a>
            <a
              href={ANELI_THREADS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80"
            >
              Threads @anelii.y
            </a>
            <a
              href={ANELI_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80"
            >
              Instagram @anelii.y
            </a>
            <a href="/about" className="underline hover:opacity-80">
              О BilimAI
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
