"use client";

import { useState } from "react";
import { Calculator, MessageCircle, Minus, Plus } from "lucide-react";
import { BRAND, buildWhatsAppUrl } from "@/lib/justslide-data";

type Track = "study" | "business";
type StudyMode = "static" | "animated" | "report" | "kmzh" | "video";
type BizPack = "redesign" | "turnkey" | "pitch";

const STUDY_MODES: {
  id: StudyMode;
  label: string;
  rateText: string;
  unit: string;
  rate: number;
  min: number;
  max: number;
  defaultQty: number;
}[] = [
  {
    id: "static",
    label: "Стандарт 16:9",
    rateText: "80 ₸ / слайд",
    unit: "слайдов",
    rate: 80,
    min: 5,
    max: 40,
    defaultQty: 15
  },
  {
    id: "animated",
    label: "Анимация Morph",
    rateText: "150 ₸ / слайд",
    unit: "слайдов",
    rate: 150,
    min: 5,
    max: 40,
    defaultQty: 15
  },
  {
    id: "kmzh",
    label: "ҚМЖ (МОН РК)",
    rateText: "500 ₸ / урок",
    unit: "уроков",
    rate: 500,
    min: 1,
    max: 10,
    defaultQty: 1
  },
  {
    id: "report",
    label: "БЖБ/ТЖБ · Реферат",
    rateText: "100 ₸ / стр.",
    unit: "стр.",
    rate: 100,
    min: 2,
    max: 30,
    defaultQty: 10
  },
  {
    id: "video",
    label: "ИИ-видео",
    rateText: "3 500 ₸ / мин",
    unit: "мин.",
    rate: 3500,
    min: 1,
    max: 5,
    defaultQty: 1
  }
];

const BIZ_PACKS: {
  id: BizPack;
  label: string;
  slides: string;
  price: number;
  agencyRef: number;
  eta: string;
}[] = [
  {
    id: "redesign",
    label: "Бизнес-Редизайн",
    slides: "до 10 слайдов",
    price: 9900,
    agencyRef: 70000,
    eta: "от 4 часов"
  },
  {
    id: "turnkey",
    label: "КП «Под ключ»",
    slides: "до 15 слайдов",
    price: 19900,
    agencyRef: 120000,
    eta: "1 день"
  },
  {
    id: "pitch",
    label: "Pitch Deck / Тендер",
    slides: "до 20 слайдов",
    price: 34900,
    agencyRef: 150000,
    eta: "1–2 дня"
  }
];

function fmt(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function StudioCalculator() {
  const [track, setTrack] = useState<Track>("study");

  // Study state
  const [studyMode, setStudyMode] = useState<StudyMode>("static");
  const [qty, setQty] = useState<number>(15);
  const [addKmzh, setAddKmzh] = useState<boolean>(false);
  const [lang, setLang] = useState<"kk" | "ru">("ru");

  // Business state
  const [bizPack, setBizPack] = useState<BizPack>("turnkey");
  const [extraSlides, setExtraSlides] = useState<boolean>(false);
  const [secondLang, setSecondLang] = useState<boolean>(false);
  const [bizAnim, setBizAnim] = useState<boolean>(false);
  const [bizSos, setBizSos] = useState<boolean>(false);

  const activeStudy = STUDY_MODES.find((m) => m.id === studyMode) ?? STUDY_MODES[0];
  const canAddKmzh = studyMode === "static" || studyMode === "animated";
  const studyTotal = qty * activeStudy.rate + (canAddKmzh && addKmzh ? 500 : 0);
  const studyAgencyRef =
    studyMode === "static" || studyMode === "animated"
      ? Math.max(4900, qty * 350) + (canAddKmzh && addKmzh ? 1500 : 0)
      : null;

  const activeBiz = BIZ_PACKS.find((p) => p.id === bizPack) ?? BIZ_PACKS[1];
  const bizTotal =
    activeBiz.price +
    (extraSlides ? 4500 : 0) +
    (secondLang ? 6500 : 0) +
    (bizAnim ? 5900 : 0) +
    (bizSos ? 5000 : 0);
  const bizAgencyRef =
    activeBiz.agencyRef +
    (extraSlides ? 30000 : 0) +
    (secondLang ? 35000 : 0) +
    (bizAnim ? 25000 : 0);

  const total = track === "study" ? studyTotal : bizTotal;
  const savings =
    track === "study"
      ? studyAgencyRef && studyAgencyRef > studyTotal
        ? studyAgencyRef - studyTotal
        : null
      : bizAgencyRef - bizTotal;

  const waMessage =
    track === "study"
      ? `Здравствуйте! Расчёт на сайте JustSlide (${BRAND.handle}): ${activeStudy.label}, ${qty} ${activeStudy.unit}${canAddKmzh && addKmzh ? " + ҚМЖ (500 ₸)" : ""}, язык: ${lang === "kk" ? "Қазақша" : "Русский"}. Итого: ${fmt(studyTotal)} ₸. Тема:`
      : `Здравствуйте! Бизнес-расчёт на сайте JustSlide (${BRAND.handle}): ${activeBiz.label} (${activeBiz.slides})${extraSlides ? " + 5 слайдов" : ""}${secondLang ? " + 2-й язык" : ""}${bizAnim ? " + Morph-анимация" : ""}${bizSos ? " + Срочно за 3 часа" : ""}. Итого: ${fmt(bizTotal)} ₸. Компания / задача:`;

  return (
    <div
      id="calculator"
      className="rounded-3xl bg-[#F7F8FA] p-6 sm:p-8 lg:p-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F80FF]">
            <Calculator className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Интерактивный калькулятор JustSlide</span>
          </span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            Рассчитайте точную стоимость за 10 секунд
          </h2>
        </div>

        {/* Segment switcher */}
        <div
          className="inline-flex rounded-full bg-white p-1 shadow-xs ring-1 ring-zinc-200"
          role="tablist"
          aria-label="Сегмент расчёта"
        >
          <button
            type="button"
            role="tab"
            aria-selected={track === "study"}
            onClick={() => setTrack("study")}
            className={`min-h-[40px] cursor-pointer rounded-full px-4 text-sm font-semibold transition-colors ${
              track === "study"
                ? "bg-[#2F80FF] text-white"
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            Учёба и педагоги
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={track === "business"}
            onClick={() => setTrack("business")}
            className={`min-h-[40px] cursor-pointer rounded-full px-4 text-sm font-semibold transition-colors ${
              track === "business"
                ? "bg-[#2F80FF] text-white"
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            Бизнес и Pitch Deck
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Left Controls */}
        <div className="space-y-5 lg:col-span-7">
          {track === "study" ? (
            <>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Формат работы">
                {STUDY_MODES.map((m) => {
                  const selected = m.id === studyMode;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => {
                        setStudyMode(m.id);
                        setQty(m.defaultQty);
                        if (m.id !== "static" && m.id !== "animated") setAddKmzh(false);
                      }}
                      className={`min-h-[44px] cursor-pointer rounded-2xl px-4 py-2 text-left text-xs font-semibold transition-all sm:text-sm ${
                        selected
                          ? "bg-white text-zinc-950 ring-2 ring-[#2F80FF]"
                          : "bg-white/70 text-zinc-700 ring-1 ring-zinc-200 hover:bg-white"
                      }`}
                    >
                      <div>{m.label}</div>
                      <div className="text-[11px] font-medium text-zinc-500 tabular-nums">
                        {m.rateText}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200/80">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="js-qty-range"
                    className="text-sm font-semibold text-zinc-800"
                  >
                    Объём ({activeStudy.unit})
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Уменьшить"
                      disabled={qty <= activeStudy.min}
                      onClick={() => setQty((q) => Math.max(activeStudy.min, q - 1))}
                      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-zinc-200 text-zinc-900 disabled:opacity-40"
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <span className="min-w-[3ch] text-center text-lg font-bold tabular-nums">
                      {qty}
                    </span>
                    <button
                      type="button"
                      aria-label="Увеличить"
                      disabled={qty >= activeStudy.max}
                      onClick={() => setQty((q) => Math.min(activeStudy.max, q + 1))}
                      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-zinc-200 text-zinc-900 disabled:opacity-40"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <input
                  id="js-qty-range"
                  type="range"
                  min={activeStudy.min}
                  max={activeStudy.max}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="mt-3 w-full accent-[#2F80FF]"
                />

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-500">Язык:</span>
                    {(["ru", "kk"] as const).map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setLang(code)}
                        className={`min-h-[34px] cursor-pointer rounded-full px-3 text-xs font-semibold ${
                          lang === code
                            ? "bg-zinc-950 text-white"
                            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                        }`}
                      >
                        {code === "kk" ? "Қазақша" : "Русский"}
                      </button>
                    ))}
                  </div>

                  {canAddKmzh && (
                    <label className="flex min-h-[34px] cursor-pointer items-center gap-2 text-xs font-semibold text-zinc-800">
                      <input
                        type="checkbox"
                        checked={addKmzh}
                        onChange={(e) => setAddKmzh(e.target.checked)}
                        className="h-4 w-4 accent-[#2F80FF]"
                      />
                      <span>+ ҚМЖ к уроку (+500 ₸)</span>
                    </label>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-2.5 sm:grid-cols-3" role="radiogroup" aria-label="Бизнес-тариф">
                {BIZ_PACKS.map((p) => {
                  const selected = p.id === bizPack;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setBizPack(p.id)}
                      className={`min-h-[44px] cursor-pointer rounded-2xl p-4 text-left transition-all ${
                        selected
                          ? "bg-white text-zinc-950 ring-2 ring-[#2F80FF]"
                          : "bg-white/70 text-zinc-700 ring-1 ring-zinc-200 hover:bg-white"
                      }`}
                    >
                      <div className="text-sm font-bold">{p.label}</div>
                      <div className="mt-0.5 text-xs text-zinc-500">
                        {p.slides} · {p.eta}
                      </div>
                      <div className="mt-2 text-base font-bold text-[#2F80FF] tabular-nums">
                        {fmt(p.price)} ₸
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200/80">
                <div className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                  Дополнительные модули (как в агентствах, но в 5× дешевле)
                </div>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  <label className="flex min-h-[40px] cursor-pointer items-center gap-2.5 rounded-xl bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-800">
                    <input
                      type="checkbox"
                      checked={extraSlides}
                      onChange={(e) => setExtraSlides(e.target.checked)}
                      className="h-4 w-4 accent-[#2F80FF]"
                    />
                    <span>+5 доп. слайдов (+4 500 ₸)</span>
                  </label>
                  <label className="flex min-h-[40px] cursor-pointer items-center gap-2.5 rounded-xl bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-800">
                    <input
                      type="checkbox"
                      checked={secondLang}
                      onChange={(e) => setSecondLang(e.target.checked)}
                      className="h-4 w-4 accent-[#2F80FF]"
                    />
                    <span>Второй язык ҚАЗ/РУС/ENG (+6 500 ₸)</span>
                  </label>
                  <label className="flex min-h-[40px] cursor-pointer items-center gap-2.5 rounded-xl bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-800">
                    <input
                      type="checkbox"
                      checked={bizAnim}
                      onChange={(e) => setBizAnim(e.target.checked)}
                      className="h-4 w-4 accent-[#2F80FF]"
                    />
                    <span>Morph-анимация (+5 900 ₸)</span>
                  </label>
                  <label className="flex min-h-[40px] cursor-pointer items-center gap-2.5 rounded-xl bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-800">
                    <input
                      type="checkbox"
                      checked={bizSos}
                      onChange={(e) => setBizSos(e.target.checked)}
                      className="h-4 w-4 accent-[#2F80FF]"
                    />
                    <span>Срочно за 3 часа (+5 000 ₸)</span>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Summary Box */}
        <div className="flex flex-col justify-between rounded-2xl bg-white p-6 ring-1 ring-zinc-200/80 lg:col-span-5">
          <div>
            <div className="text-xs font-semibold text-zinc-500">
              {track === "study"
                ? "Итого · Титулка, план и литература — 0 ₸"
                : `Итого · Срок ${activeBiz.eta} · 2 раунда правок`}
            </div>
            <div className="mt-2 text-4xl font-bold tracking-tight text-zinc-950 tabular-nums">
              {fmt(total)} ₸
            </div>
            {savings && savings > 0 && (
              <div className="mt-2.5 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 tabular-nums">
                Экономия ~{fmt(savings)} ₸ против студий и агентств РК
              </div>
            )}
            <p className="mt-3 text-xs leading-relaxed text-zinc-500">
              {track === "study"
                ? "Оплата переводом через Kaspi после показа превью. Готовность от 15 минут."
                : "Оплата Kaspi Pay или по счёту для ТОО/ИП. Передаём PDF + редактируемый PPTX."}
            </p>
          </div>

          <div className="mt-6 space-y-2.5">
            <a
              href={buildWhatsAppUrl(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#2F80FF] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#126DFB]"
            >
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Отправить расчёт в WhatsApp</span>
            </a>
            <a
              href="/order"
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-zinc-100 px-5 py-2.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-200"
            >
              Заполнить подробный бриф на сайте →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
