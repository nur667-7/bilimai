import type { PortfolioItem } from "@/lib/justslide-data";

export function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-[#F7F8FA] p-3 transition-colors hover:bg-[#F0F4FA]">
      {/* 16:9 Slide Frame — renders real image once uploaded to /public/portfolio/, else crisp studio slide preview */}
      <div
        className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl p-5 sm:p-6"
        style={{
          backgroundColor: item.previewBg,
          color: item.previewInk
        }}
      >
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span
                className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase"
                style={{
                  backgroundColor: item.previewAccent,
                  color: "#FFFFFF"
                }}
              >
                {item.previewKicker}
              </span>
              <span className="text-[11px] font-semibold opacity-60 tabular-nums">
                16:9 · JustSlide
              </span>
            </div>

            <div className="my-auto py-3">
              <div className="max-w-[24ch] text-lg font-bold leading-snug tracking-tight sm:text-xl">
                {item.previewHeadline}
              </div>
            </div>

            <div className="flex items-end justify-between gap-2 border-t border-current/10 pt-3">
              <div>
                <div className="text-xl font-bold leading-none tabular-nums sm:text-2xl">
                  {item.previewMetric}
                </div>
                <div className="mt-1 text-[11px] opacity-70">
                  {item.previewMetricLabel}
                </div>
              </div>
              <div className="flex gap-1.5" aria-hidden="true">
                <span
                  className="h-2 w-8 rounded-full opacity-90"
                  style={{ backgroundColor: item.previewAccent }}
                />
                <span className="h-2 w-3 rounded-full bg-current opacity-20" />
                <span className="h-2 w-3 rounded-full bg-current opacity-20" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Meta Footer */}
      <div className="flex flex-1 flex-col justify-between px-2 pt-4 pb-2">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs font-medium text-zinc-500">
            <span className="text-[#2F80FF]">{item.category}</span>
            <span className="tabular-nums">
              {item.slidesCount} · {item.turnaround}
            </span>
          </div>
          <h3 className="mt-1.5 text-base font-bold tracking-tight text-zinc-950">
            {item.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-zinc-600">
            {item.subtitle}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-zinc-200/80 pt-3 text-sm">
          <span className="font-bold text-zinc-950 tabular-nums">
            {item.priceTag}
          </span>
          <a
            href="/order"
            className="font-semibold text-[#2F80FF] hover:underline"
          >
            Заказать такой стиль →
          </a>
        </div>
      </div>
    </article>
  );
}
