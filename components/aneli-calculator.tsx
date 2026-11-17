"use client";

import { useState } from "react";
import { Calculator, MessageCircle, Minus, Plus } from "lucide-react";
import {
  ANELI_WHATSAPP_PHONE,
  buildWhatsAppOrderUrl
} from "@/lib/aneli-studio";

type CalcMode = "static" | "animated" | "report" | "kmzh" | "video";

const MODES: {
  id: CalcMode;
  label: string;
  rateLabel: string;
  unit: string;
  rate: number;
  min: number;
  max: number;
  defaultQty: number;
}[] = [
  {
    id: "static",
    label: "Презентация (статика)",
    rateLabel: "80 ₸ / слайд",
    unit: "слайдов",
    rate: 80,
    min: 5,
    max: 40,
    defaultQty: 15
  },
  {
    id: "animated",
    label: "Анимация (Morph)",
    rateLabel: "150 ₸ / слайд",
    unit: "слайдов",
    rate: 150,
    min: 5,
    max: 40,
    defaultQty: 15
  },
  {
    id: "report",
    label: "СОР / СОЧ / Реферат",
    rateLabel: "100 ₸ / стр.",
    unit: "страниц",
    rate: 100,
    min: 2,
    max: 30,
    defaultQty: 10
  },
  {
    id: "kmzh",
    label: "ҚМЖ (МОН РК)",
    rateLabel: "500 ₸ / урок",
    unit: "уроков",
    rate: 500,
    min: 1,
    max: 10,
    defaultQty: 1
  },
  {
    id: "video",
    label: "ИИ-видео",
    rateLabel: "3 500 ₸ / мин",
    unit: "мин.",
    rate: 3500,
    min: 1,
    max: 5,
    defaultQty: 1
  }
];

function formatKzt(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function AneliCalculator() {
  const [modeId, setModeId] = useState<CalcMode>("static");
  const [qty, setQty] = useState<number>(15);
  const [addKmzh, setAddKmzh] = useState<boolean>(false);
  const [lang, setLang] = useState<"kk" | "ru">("kk");

  const activeMode = MODES.find((m) => m.id === modeId) ?? MODES[0];
  const canAddKmzh = modeId === "static" || modeId === "animated";
  const kmzhExtra = canAddKmzh && addKmzh ? 500 : 0;
  const total = qty * activeMode.rate + kmzhExtra;

  const agencyEstimate =
    modeId === "static" || modeId === "animated"
      ? Math.max(4900, qty * 350) + (kmzhExtra ? 1500 : 0)
      : null;

  function selectMode(nextId: CalcMode) {
    const next = MODES.find((m) => m.id === nextId) ?? MODES[0];
    setModeId(nextId);
    setQty(next.defaultQty);
    if (nextId !== "static" && nextId !== "animated") {
      setAddKmzh(false);
    }
  }

  const orderSummary =
    lang === "kk"
      ? `Сәлеметсіз бе! @anelii.y сайтынан есептедім: ${activeMode.label}, ${qty} ${activeMode.unit}${kmzhExtra ? " + ҚМЖ (500 ₸)" : ""}, тілі: Қазақша. Шамамен сомасы: ${formatKzt(total)} ₸. Тақырыбы:`
      : `Здравствуйте! Посчитал на сайте @anelii.y: ${activeMode.label}, ${qty} ${activeMode.unit}${kmzhExtra ? " + ҚМЖ (500 ₸)" : ""}, язык: Русский. Расчётная сумма: ${formatKzt(total)} ₸. Тема:`;

  return (
    <section
      id="calculator"
      aria-labelledby="calc-heading"
      className="mt-6 rounded-xl p-6 sm:p-8"
      style={{
        backgroundColor: "var(--bilimai-surface, #FFFFFF)",
        border: "1px solid var(--bilimai-border, #D8E0EE)"
      }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="calc-heading"
          className="flex items-center gap-2 text-xl font-semibold"
        >
          <Calculator className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>Калькулятор стоимости заказа</span>
        </h2>
        <span
          className="text-xs font-medium"
          style={{ color: "var(--bilimai-text-muted, #475569)" }}
        >
          Титульный лист, план и литература — 0 ₸
        </span>
      </div>

      {/* Mode pills */}
      <div
        className="mt-4 flex flex-wrap gap-2"
        role="radiogroup"
        aria-label="Тип услуги"
      >
        {MODES.map((m) => {
          const selected = m.id === modeId;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => selectMode(m.id)}
              className="min-h-[44px] cursor-pointer rounded-lg px-3.5 py-2 text-left text-xs font-semibold transition-colors sm:text-sm"
              style={{
                backgroundColor: selected
                  ? "var(--bilimai-selected-bg, #E0E7FF)"
                  : "var(--bilimai-surface-raised, #EEF2F9)",
                color: selected
                  ? "var(--bilimai-selected-text, #1E3A8A)"
                  : "var(--bilimai-text, #0F172A)",
                border: selected
                  ? "1px solid var(--bilimai-brand, #254EDB)"
                  : "1px solid var(--bilimai-border, #D8E0EE)"
              }}
            >
              <div>{m.label}</div>
              <div
                className="text-[11px] font-medium tabular-nums"
                style={{
                  color: selected
                    ? "var(--bilimai-selected-text, #1E3A8A)"
                    : "var(--bilimai-text-muted, #475569)"
                }}
              >
                {m.rateLabel}
              </div>
            </button>
          );
        })}
      </div>

      {/* Quantity + Language + Combo */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div
          className="rounded-lg p-4"
          style={{
            backgroundColor: "var(--bilimai-surface-raised, #EEF2F9)",
            border: "1px solid var(--bilimai-border, #D8E0EE)"
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="aneli-qty-range"
              className="text-xs font-semibold"
              style={{ color: "var(--bilimai-text-muted, #475569)" }}
            >
              Объём ({activeMode.unit})
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Уменьшить количество"
                onClick={() => setQty((q) => Math.max(activeMode.min, q - 1))}
                disabled={qty <= activeMode.min}
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  backgroundColor: "var(--bilimai-surface, #FFFFFF)",
                  border: "1px solid var(--bilimai-border, #D8E0EE)",
                  color: "var(--bilimai-text, #0F172A)"
                }}
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="min-w-[3ch] text-center text-base font-bold tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                aria-label="Увеличить количество"
                onClick={() => setQty((q) => Math.min(activeMode.max, q + 1))}
                disabled={qty >= activeMode.max}
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  backgroundColor: "var(--bilimai-surface, #FFFFFF)",
                  border: "1px solid var(--bilimai-border, #D8E0EE)",
                  color: "var(--bilimai-text, #0F172A)"
                }}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          <input
            id="aneli-qty-range"
            type="range"
            min={activeMode.min}
            max={activeMode.max}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="mt-3 w-full"
            style={{ accentColor: "var(--bilimai-brand, #254EDB)" }}
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span style={{ color: "var(--bilimai-text-muted, #475569)" }}>
              Язык работы:
            </span>
            <div className="inline-flex gap-1.5">
              {(["kk", "ru"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className="min-h-[36px] cursor-pointer rounded-md px-3 text-xs font-semibold"
                  style={{
                    backgroundColor:
                      lang === code
                        ? "var(--bilimai-brand, #254EDB)"
                        : "var(--bilimai-surface, #FFFFFF)",
                    color:
                      lang === code
                        ? "#FFFFFF"
                        : "var(--bilimai-text, #0F172A)",
                    border: "1px solid var(--bilimai-border, #D8E0EE)"
                  }}
                >
                  {code === "kk" ? "Қазақша" : "Русский"}
                </button>
              ))}
            </div>
          </div>

          {canAddKmzh && (
            <label className="mt-3 flex min-h-[36px] cursor-pointer items-center gap-2 text-xs font-medium">
              <input
                type="checkbox"
                checked={addKmzh}
                onChange={(e) => setAddKmzh(e.target.checked)}
                className="h-4 w-4"
                style={{ accentColor: "var(--bilimai-brand, #254EDB)" }}
              />
              <span>Добавить готовый ҚМЖ к открытому уроку (+500 ₸)</span>
            </label>
          )}
        </div>

        {/* Result Box */}
        <div
          className="flex flex-col justify-between rounded-lg p-4"
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
              Итоговая стоимость (оплата Kaspi после превью)
            </div>
            <div className="mt-1 text-3xl font-bold tabular-nums">
              {formatKzt(total)} ₸
            </div>
            {agencyEstimate && agencyEstimate > total && (
              <div
                className="mt-1.5 inline-block rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums"
                style={{
                  backgroundColor: "var(--bilimai-success-bg, #ECFDF5)",
                  border: "1px solid var(--bilimai-success-border, #059669)",
                  color: "var(--bilimai-success-text, #065F46)"
                }}
              >
                Выгоднее агентств РК на ~{formatKzt(agencyEstimate - total)} ₸
              </div>
            )}
          </div>

          <a
            href={buildWhatsAppOrderUrl(orderSummary)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-transform active:scale-[0.99]"
            style={{
              backgroundColor: "var(--bilimai-brand, #254EDB)",
              color: "#FFFFFF"
            }}
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Отправить расчёт в WhatsApp ({ANELI_WHATSAPP_PHONE})</span>
          </a>
        </div>
      </div>
    </section>
  );
}
