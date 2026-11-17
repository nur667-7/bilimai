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
import { InstagramIcon } from "@/components/brand-mark";
import { StudioFooter } from "@/components/studio-footer";
import { StudioHeader } from "@/components/studio-header";
import {
  BRAND,
  MARKET_COMPARISON,
  SERVICE_PAGES,
  buildWhatsAppUrl,
  getServicePageBySlug
} from "@/lib/justslide-data";

export function generateStaticParams() {
  return SERVICE_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePageBySlug(slug);
  if (!page) {
    return { title: "Услуга не найдена" };
  }
  const canonical = `${BRAND.siteUrl}/services/${page.slug}`;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: { canonical },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: canonical,
      siteName: BRAND.name,
      type: "article",
      locale: "ru_KZ",
      alternateLocale: ["kk_KZ"],
      images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: page.h1 }]
    }
  };
}

export default async function ServiceDetailPageView({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getServicePageBySlug(slug);
  if (!page) notFound();

  const canonical = `${BRAND.siteUrl}/services/${page.slug}`;
  const waHref = buildWhatsAppUrl(page.whatsappPrefill);
  const siblings = SERVICE_PAGES.filter((p) => p.slug !== page.slug);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: page.metaTitle,
        description: page.metaDescription,
        about: { "@id": `${BRAND.siteUrl}/#organization` }
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a }
        }))
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: BRAND.name, item: `${BRAND.siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Услуги", item: `${BRAND.siteUrl}/services` },
          { "@type": "ListItem", position: 3, name: page.navLabel, item: canonical }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <StudioHeader activePath="/services" />

      <main className="mx-auto max-w-4xl px-4 pt-12 pb-10 sm:px-6 sm:pt-16 lg:px-8">
        <a
          href="/services"
          className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-zinc-500 hover:text-[#2F80FF]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Все услуги и калькулятор {BRAND.name}</span>
        </a>

        <article className="mt-4 rounded-3xl bg-[#F7F8FA] p-6 sm:p-9">
          <span className="inline-block rounded-full bg-white px-3.5 py-1 text-xs font-semibold text-[#2F80FF] ring-1 ring-zinc-200/80">
            {page.badge}
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            {page.h1}
          </h1>

          {/* Direct Answer-First Capsule */}
          <div className="mt-5 rounded-2xl bg-white p-5 text-sm leading-relaxed text-zinc-700 ring-1 ring-zinc-200/80">
            {page.answerCapsule}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#2F80FF] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#126DFB]"
            >
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Заказать в WhatsApp · {BRAND.phoneDisplay}</span>
            </a>

            <a
              href={BRAND.threadsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-50"
            >
              <AtSign className="h-4 w-4" aria-hidden="true" />
              <span>Threads {BRAND.handle}</span>
              <ExternalLink className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
            </a>

            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-50"
            >
              <InstagramIcon className="h-4 w-4" />
              <span>Instagram {BRAND.handle}</span>
              <ExternalLink className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
            </a>
          </div>

          <ul className="mt-7 space-y-3 text-sm text-zinc-700">
            {page.highlights.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#2F80FF]"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        {page.sections.map((sec) => (
          <section
            key={sec.heading}
            className="mt-6 rounded-3xl bg-[#F7F8FA] p-6 sm:p-8"
          >
            <h2 className="text-xl font-bold text-zinc-950">{sec.heading}</h2>
            <p className="mt-2.5 max-w-[68ch] text-sm leading-relaxed text-zinc-600">
              {sec.body}
            </p>
            {sec.bullets && (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700">
                {sec.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {(page.slug === "ceny-sravnenie" || page.slug === "business-kp") && (
          <section className="mt-6 rounded-3xl bg-[#F7F8FA] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-zinc-950">
              Сравнение с рынком Казахстана (2026)
            </h2>
            <div className="mt-4 space-y-2.5">
              {MARKET_COMPARISON.map((row) => (
                <div
                  key={row.provider}
                  className={`rounded-2xl p-4 sm:grid sm:grid-cols-12 sm:items-center sm:gap-3 ${
                    row.highlight
                      ? "bg-[#EFF5FF] ring-1 ring-[#2F80FF]"
                      : "bg-white ring-1 ring-zinc-200/80"
                  }`}
                >
                  <div className="text-sm font-bold text-zinc-950 sm:col-span-4">
                    {row.provider}
                  </div>
                  <div className="mt-1 text-xs text-zinc-700 sm:col-span-4 sm:mt-0">
                    Учёба: {row.study15} · Бизнес: {row.biz15}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500 sm:col-span-4 sm:mt-0">
                    {row.speed}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section
          lang="kk"
          className="mt-6 rounded-3xl bg-[#EFF5FF] p-6 sm:p-8"
        >
          <h2 className="text-xl font-bold text-zinc-950">{page.kzHeading}</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">
            {page.kzBody}
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-[#F7F8FA] p-6 sm:p-8">
          <h2 className="text-xl font-bold text-zinc-950">Частые вопросы</h2>
          <div className="mt-4 space-y-3">
            {page.faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl bg-white p-4 ring-1 ring-zinc-200/80"
              >
                <h3 className="text-sm font-bold text-zinc-950">{faq.q}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-[#F7F8FA] p-6">
          <h2 className="text-sm font-bold text-zinc-950">
            Другие направления {BRAND.name}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {siblings.map((sib) => (
              <a
                key={sib.slug}
                href={`/services/${sib.slug}`}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-zinc-800 ring-1 ring-zinc-200 hover:ring-[#2F80FF]"
              >
                <span>{sib.navLabel}</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>
      </main>

      <StudioFooter />
    </>
  );
}
