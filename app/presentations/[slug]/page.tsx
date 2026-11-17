import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  CheckCircle2,
  ExternalLink,
  MessageCircle
} from "lucide-react";
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
  buildWhatsAppOrderUrl,
  getClusterPageBySlug
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

export function generateStaticParams() {
  return ANELI_CLUSTER_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getClusterPageBySlug(slug);
  if (!page) {
    return {
      title: "Раздел не найден · Анели Продакшн (@anelii.y)"
    };
  }
  const canonical = `${ANELI_HUB_URL}/${page.slug}`;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: {
      canonical
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: canonical,
      siteName: "BilimAI · Анели Продакшн (@anelii.y)",
      type: "article",
      locale: "ru_KZ",
      alternateLocale: ["kk_KZ"],
      images: [
        {
          url: "/og-cover.svg",
          width: 1200,
          height: 630,
          alt: page.h1
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: ["/og-cover.svg"]
    }
  };
}

export default async function PresentationClusterPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getClusterPageBySlug(slug);
  if (!page) {
    notFound();
  }

  const canonical = `${ANELI_HUB_URL}/${page.slug}`;
  const waHref = buildWhatsAppOrderUrl(page.whatsappPrefill);
  const siblings = ANELI_CLUSTER_PAGES.filter((p) => p.slug !== page.slug);
  const showComparison =
    page.slug === "ceny-sravnenie" || page.slug === "studentam";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["ProfessionalService", "Organization"],
        "@id": `${ANELI_HUB_URL}#organization`,
        name: "Анели Продакшн (@anelii.y)",
        alternateName: ["Анели Продакшн", "Aneli Production", "@anelii.y", "anelii.y"],
        url: ANELI_HUB_URL,
        telephone: ANELI_WHATSAPP_E164,
        priceRange: "80–12000 KZT",
        areaServed: { "@type": "Country", name: "Kazakhstan" },
        availableLanguage: ["Russian", "Kazakh"],
        sameAs: [ANELI_THREADS_URL, ANELI_INSTAGRAM_URL, ANELI_WHATSAPP_DIRECT],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: ANELI_WHATSAPP_E164,
          url: ANELI_WHATSAPP_DIRECT,
          availableLanguage: ["Russian", "Kazakh"],
          areaServed: "KZ"
        }
      },
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: page.metaTitle,
        description: page.metaDescription,
        inLanguage: ["ru-KZ", "kk-KZ"],
        isPartOf: { "@id": `${ANELI_HUB_URL}#webpage` },
        about: { "@id": `${ANELI_HUB_URL}#organization` }
      },
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        mainEntity: page.faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a
          }
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
            name: "Анели Продакшн (@anelii.y)",
            item: ANELI_HUB_URL
          },
          {
            "@type": "ListItem",
            position: 3,
            name: page.shortNavLabel,
            item: canonical
          }
        ]
      }
    ]
  };

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <header
        style={{
          borderBottom: "1px solid var(--bilimai-border, #D8E0EE)",
          backgroundColor: "var(--bilimai-surface, #FFFFFF)"
        }}
      >
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <a
            href="/presentations"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium hover:underline"
            style={{ color: "var(--bilimai-text-muted, #475569)" }}
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Все услуги и калькулятор · @anelii.y</span>
          </a>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold sm:text-sm"
            style={{
              backgroundColor: "var(--bilimai-brand, #254EDB)",
              color: "#FFFFFF"
            }}
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>WhatsApp {ANELI_WHATSAPP_PHONE}</span>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Hero + Answer Capsule */}
        <article
          className="rounded-xl p-6 sm:p-8"
          style={{
            backgroundColor: "var(--bilimai-surface, #FFFFFF)",
            border: "1px solid var(--bilimai-border, #D8E0EE)"
          }}
        >
          <span
            className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold"
            style={{
              backgroundColor: "var(--bilimai-selected-bg, #E0E7FF)",
              color: "var(--bilimai-selected-text, #1E3A8A)"
            }}
          >
            {page.badge}
          </span>

          <h1
            className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl"
            style={{ lineHeight: 1.2 }}
          >
            {page.h1}
          </h1>

          {/* Direct Answer-First Capsule */}
          <div
            className="mt-4 rounded-lg p-4 text-sm leading-relaxed"
            style={{
              backgroundColor: "var(--bilimai-surface-raised, #EEF2F9)",
              border: "1px solid var(--bilimai-border, #D8E0EE)",
              color: "var(--bilimai-text, #0F172A)"
            }}
          >
            {page.answerCapsule}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
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
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium"
              style={{
                backgroundColor: "var(--bilimai-surface-raised, #EEF2F9)",
                border: "1px solid var(--bilimai-border, #D8E0EE)",
                color: "var(--bilimai-text, #0F172A)"
              }}
            >
              <AtSign className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Threads @anelii.y</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />
            </a>

            <a
              href={ANELI_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium"
              style={{
                backgroundColor: "var(--bilimai-surface-raised, #EEF2F9)",
                border: "1px solid var(--bilimai-border, #D8E0EE)",
                color: "var(--bilimai-text, #0F172A)"
              }}
            >
              <InstagramGlyph />
              <span>Instagram @anelii.y</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />
            </a>
          </div>

          {/* Highlights */}
          <ul
            className="mt-6 space-y-2.5 text-sm"
            style={{ color: "var(--bilimai-text-muted, #475569)" }}
          >
            {page.highlights.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: "var(--bilimai-success-border, #059669)" }}
                  aria-hidden="true"
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </article>

        {/* Detailed Practical Sections */}
        {page.sections.map((section) => (
          <section
            key={section.heading}
            className="mt-6 rounded-xl p-6 sm:p-8"
            style={{
              backgroundColor: "var(--bilimai-surface, #FFFFFF)",
              border: "1px solid var(--bilimai-border, #D8E0EE)"
            }}
          >
            <h2 className="text-xl font-semibold">{section.heading}</h2>
            {section.paragraphs.map((p) => (
              <p
                key={p}
                className="mt-2.5 max-w-[68ch] text-sm leading-relaxed"
                style={{ color: "var(--bilimai-text-muted, #475569)" }}
              >
                {p}
              </p>
            ))}
            {section.bullets && (
              <ul
                className="mt-3 list-disc space-y-2 pl-5 text-sm"
                style={{ color: "var(--bilimai-text-muted, #475569)" }}
              >
                {section.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {/* Market comparison table on comparison & student pages */}
        {showComparison && (
          <section
            className="mt-6 rounded-xl p-6 sm:p-8"
            style={{
              backgroundColor: "var(--bilimai-surface, #FFFFFF)",
              border: "1px solid var(--bilimai-border, #D8E0EE)"
            }}
          >
            <h2 className="text-xl font-semibold">
              Таблица сравнения цен (15 слайдов, Казахстан 2026)
            </h2>
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
                  <div className="text-sm font-semibold sm:col-span-4">
                    {item.segment}
                  </div>
                  <div className="mt-1 text-xs sm:col-span-4 sm:mt-0">
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
        )}

        {/* Compact Pricing Reminder */}
        <section
          className="mt-6 rounded-xl p-6 sm:p-8"
          style={{
            backgroundColor: "var(--bilimai-surface, #FFFFFF)",
            border: "1px solid var(--bilimai-border, #D8E0EE)"
          }}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-semibold">
              Актуальный прайс Анели Продакшн (@anelii.y)
            </h2>
            <a
              href="/presentations#calculator"
              className="text-xs font-semibold underline"
              style={{ color: "var(--bilimai-brand, #254EDB)" }}
            >
              Открыть онлайн-калькулятор →
            </a>
          </div>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {ANELI_SERVICES.slice(0, 6).map((service) => (
              <div
                key={service.id}
                className="flex items-baseline justify-between gap-3 rounded-lg p-3 text-sm"
                style={{
                  backgroundColor: "var(--bilimai-surface-raised, #EEF2F9)",
                  border: "1px solid var(--bilimai-border, #D8E0EE)"
                }}
              >
                <span className="font-medium">{service.nameRu}</span>
                <span className="shrink-0 font-semibold tabular-nums">
                  {service.unitPrice}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Kazakh Bilingual Block */}
        <section
          lang="kk"
          className="mt-6 rounded-xl p-6 sm:p-8"
          style={{
            backgroundColor: "var(--bilimai-surface, #FFFFFF)",
            border: "1px solid var(--bilimai-border, #D8E0EE)"
          }}
        >
          <h2 className="text-xl font-semibold">{page.kzHeading}</h2>
          <p
            className="mt-2 max-w-[68ch] text-sm leading-relaxed"
            style={{ color: "var(--bilimai-text-muted, #475569)" }}
          >
            {page.kzBody}
          </p>
        </section>

        {/* FAQ */}
        <section
          className="mt-6 rounded-xl p-6 sm:p-8"
          style={{
            backgroundColor: "var(--bilimai-surface, #FFFFFF)",
            border: "1px solid var(--bilimai-border, #D8E0EE)"
          }}
        >
          <h2 className="text-xl font-semibold">Частые вопросы (FAQ)</h2>
          <div className="mt-4 space-y-3">
            {page.faqs.map((item) => (
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

        {/* Sibling Cluster Links */}
        <section
          aria-label="Другие направления"
          className="mt-6 rounded-xl p-6"
          style={{
            backgroundColor: "var(--bilimai-surface, #FFFFFF)",
            border: "1px solid var(--bilimai-border, #D8E0EE)"
          }}
        >
          <h2 className="text-base font-semibold">
            Смотрите также другие направления @anelii.y
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {siblings.map((sib) => (
              <a
                key={sib.slug}
                href={`/presentations/${sib.slug}`}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold"
                style={{
                  backgroundColor: "var(--bilimai-surface-raised, #EEF2F9)",
                  border: "1px solid var(--bilimai-border, #D8E0EE)",
                  color: "var(--bilimai-text, #0F172A)"
                }}
              >
                <span>{sib.shortNavLabel}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </a>
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
              className="underline"
            >
              WhatsApp {ANELI_WHATSAPP_PHONE}
            </a>
            <a
              href={ANELI_THREADS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Threads @anelii.y
            </a>
            <a
              href={ANELI_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Instagram @anelii.y
            </a>
            <a href="/presentations" className="underline">
              Прайс и калькулятор
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
