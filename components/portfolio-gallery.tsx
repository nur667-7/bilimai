"use client";

import { useState } from "react";
import { PortfolioCard } from "@/components/portfolio-card";
import type { PortfolioItem } from "@/lib/justslide-data";

const CATEGORIES = ["Все", "Бизнес", "Учёба", "Учителям", "Анимация"] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

export function PortfolioGallery({ items }: { items: PortfolioItem[] }) {
  const [active, setActive] = useState<CategoryFilter>("Все");

  const filtered =
    active === "Все" ? items : items.filter((i) => i.category === active);

  return (
    <div>
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Фильтр стилей портфолио"
      >
        {CATEGORIES.map((cat) => {
          const count =
            cat === "Все"
              ? items.length
              : items.filter((i) => i.category === cat).length;
          const selected = active === cat;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(cat)}
              className={`inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${
                selected
                  ? "bg-[#2F80FF] text-white"
                  : "bg-[#F7F8FA] text-zinc-700 ring-1 ring-zinc-200/80 hover:bg-zinc-100"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-xs tabular-nums ${
                  selected ? "text-blue-100" : "text-zinc-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <PortfolioCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
