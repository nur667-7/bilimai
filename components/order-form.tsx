"use client";

import { useState, type FormEvent } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";
import { BRAND, buildWhatsAppUrl } from "@/lib/justslide-data";

export function OrderForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [segment, setSegment] = useState("Учёба (студент / школьник)");
  const [tariff, setTariff] = useState("Стандарт 16:9 — 80 ₸ / слайд");
  const [volume, setVolume] = useState("15 слайдов, сегодня");
  const [language, setLanguage] = useState("Қазақша");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function composeBrief(): string {
    return [
      `Заявка с сайта JustSlide (${BRAND.handle}):`,
      `Имя: ${name.trim()}`,
      `Телефон / WhatsApp: ${phone.trim()}`,
      `Сегмент: ${segment}`,
      `Формат / тариф: ${tariff}`,
      `Объём и дедлайн: ${volume.trim() || "уточним"}`,
      `Язык: ${language}`,
      `Задача: ${details.trim()}`
    ].join("\n");
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !details.trim()) {
      setError("Заполните имя, телефон и краткое описание задачи.");
      return;
    }
    setError("");
    const url = buildWhatsAppUrl(composeBrief());
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleCopy() {
    if (!name.trim() || !details.trim()) {
      setError("Заполните имя и описание задачи перед копированием.");
      return;
    }
    setError("");
    try {
      await navigator.clipboard.writeText(composeBrief());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setError("Не удалось скопировать — нажмите «Отправить в WhatsApp».");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="order-name"
            className="block text-sm font-semibold text-zinc-900"
          >
            Имя <span className="text-[#2F80FF]">*</span>
          </label>
          <input
            id="order-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например, Айгерим или Тимур"
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950 placeholder:text-zinc-400"
          />
        </div>

        <div>
          <label
            htmlFor="order-phone"
            className="block text-sm font-semibold text-zinc-900"
          >
            Телефон / WhatsApp <span className="text-[#2F80FF]">*</span>
          </label>
          <input
            id="order-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 700 000 00 00"
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950 placeholder:text-zinc-400"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="order-segment"
            className="block text-sm font-semibold text-zinc-900"
          >
            Для кого презентация
          </label>
          <select
            id="order-segment"
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950"
          >
            <option>Учёба (студент / школьник)</option>
            <option>Учитель (ҚМЖ / Ашық сабақ / БЖБ-ТЖБ)</option>
            <option>Бизнес (КП / компания / тендер)</option>
            <option>Стартап (Pitch Deck / инвесторы)</option>
            <option>Другое</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="order-tariff"
            className="block text-sm font-semibold text-zinc-900"
          >
            Тип проекта / тариф
          </label>
          <select
            id="order-tariff"
            value={tariff}
            onChange={(e) => setTariff(e.target.value)}
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950"
          >
            <option>Стандарт 16:9 — 80 ₸ / слайд</option>
            <option>Анимация Morph — 150 ₸ / слайд</option>
            <option>Комбо «Ашық сабақ» (15 сл. + ҚМЖ) — 1 700 ₸</option>
            <option>Комбо «Ашық сабақ Анимация» — 2 750 ₸</option>
            <option>ҚМЖ — 500 ₸ · БЖБ/ТЖБ / Реферат — 100 ₸/стр.</option>
            <option>Бизнес-Редизайн (до 10 сл.) — 9 900 ₸</option>
            <option>Бизнес КП «Под ключ» (до 15 сл.) — 19 900 ₸</option>
            <option>Pitch Deck / Тендер (до 20 сл.) — 34 900 ₸</option>
            <option>ИИ-видео / визитка — от 3 500 ₸/мин</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="order-volume"
            className="block text-sm font-semibold text-zinc-900"
          >
            Объём и дедлайн
          </label>
          <input
            id="order-volume"
            type="text"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            placeholder="Например: 15 слайдов, нужно сегодня к 18:00"
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950 placeholder:text-zinc-400"
          />
        </div>

        <div>
          <label
            htmlFor="order-lang"
            className="block text-sm font-semibold text-zinc-900"
          >
            Язык презентации
          </label>
          <select
            id="order-lang"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950"
          >
            <option>Қазақша</option>
            <option>Русский</option>
            <option>English</option>
            <option>Два языка (ҚАЗ + РУС)</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="order-details"
          className="block text-sm font-semibold text-zinc-900"
        >
          Описание задачи <span className="text-[#2F80FF]">*</span>
        </label>
        <textarea
          id="order-details"
          required
          rows={4}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Тема презентации или компании, есть ли готовый текст, особые требования преподавателя или брендбук…"
          className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-950 placeholder:text-zinc-400"
        />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="submit"
          className="inline-flex min-h-[50px] cursor-pointer items-center justify-center gap-2 rounded-full bg-[#2F80FF] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#126DFB]"
        >
          <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Отправить заявку в WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-[50px] cursor-pointer items-center justify-center gap-2 rounded-full bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-200"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              <span>Бриф скопирован</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" aria-hidden="true" />
              <span>Скопировать текст брифа</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
