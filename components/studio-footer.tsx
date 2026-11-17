import { JustSlideMark, WhatsAppGlyph } from "@/components/brand-mark";
import { BRAND, buildWhatsAppUrl } from "@/lib/justslide-data";

export function StudioFooter() {
  const floatingWa = buildWhatsAppUrl(
    "Здравствуйте! Хочу заказать презентацию в JustSlide (@anelii.y)"
  );

  return (
    <>
      <footer className="mt-24 border-t border-zinc-200 bg-[#F7F8FA]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-12">
            {/* Brand Bio */}
            <div className="md:col-span-4">
              <a
                href="/"
                className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-zinc-950"
              >
                <JustSlideMark size={32} />
                <span>{BRAND.name}</span>
              </a>
              <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-zinc-600">
                Студия презентаций ({BRAND.legacyAlias} / {BRAND.handle}) в
                Алматы и по всему Казахстану. Учебные слайды от 80 ₸ за 15
                минут, ҚМЖ 500 ₸, бизнес-КП и Pitch Deck от 9 900 ₸.
              </p>
              <p className="mt-3 text-xs text-zinc-500">{BRAND.hours}</p>
            </div>

            {/* Column 1: Contacts */}
            <div className="md:col-span-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Контакты
              </div>
              <ul className="mt-3 space-y-2.5 text-sm text-zinc-700">
                <li>
                  <a
                    href={BRAND.phoneTel}
                    className="font-semibold tabular-nums hover:text-[#2F80FF]"
                  >
                    {BRAND.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={floatingWa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#2F80FF]"
                  >
                    Написать в WhatsApp →
                  </a>
                </li>
                <li className="text-zinc-500">{BRAND.coverage}</li>
                <li>
                  <a href="/contact" className="hover:text-[#2F80FF]">
                    Страница контактов
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Services */}
            <div className="md:col-span-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Услуги
              </div>
              <ul className="mt-3 space-y-2.5 text-sm text-zinc-700">
                <li>
                  <a href="/services/studentam" className="hover:text-[#2F80FF]">
                    Студентам (от 80 ₸/слайд)
                  </a>
                </li>
                <li>
                  <a href="/services/business-kp" className="hover:text-[#2F80FF]">
                    Бизнес КП и Pitch Deck (от 9 900 ₸)
                  </a>
                </li>
                <li>
                  <a
                    href="/services/kmzh-ashyq-sabaq"
                    className="hover:text-[#2F80FF]"
                  >
                    Учителям: ҚМЖ и Ашық сабақ
                  </a>
                </li>
                <li>
                  <a href="/services/animaciya" className="hover:text-[#2F80FF]">
                    Анимация Morph и ИИ-видео
                  </a>
                </li>
                <li>
                  <a
                    href="/services"
                    className="font-medium text-[#2F80FF] hover:underline"
                  >
                    Все услуги и цены →
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Links */}
            <div className="md:col-span-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Ссылки
              </div>
              <ul className="mt-3 space-y-2.5 text-sm text-zinc-700">
                <li>
                  <a
                    href={BRAND.kaspiAdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#2F80FF]"
                  >
                    Kaspi Объявления
                  </a>
                </li>
                <li>
                  <a
                    href={BRAND.threadsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#2F80FF]"
                  >
                    Threads {BRAND.handle}
                  </a>
                </li>
                <li>
                  <a
                    href={BRAND.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#2F80FF]"
                  >
                    Instagram {BRAND.handle}
                  </a>
                </li>
                <li>
                  <a href="/work" className="hover:text-[#2F80FF]">
                    Работы и стили
                  </a>
                </li>
                <li>
                  <a href="/useful" className="hover:text-[#2F80FF]">
                    Полезное и гайды
                  </a>
                </li>
                <li>
                  <a href="/order" className="hover:text-[#2F80FF]">
                    Заказать онлайн
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-6 text-xs text-zinc-500">
            <span>
              © 2026 {BRAND.name} ({BRAND.legacyAlias} · {BRAND.handle}) ·
              Казахстан
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <a href="/privacy" className="hover:text-zinc-900">
                Конфиденциальность
              </a>
              <a href="/llms.txt" className="hover:text-zinc-900">
                llms.txt
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp CTA (Desique-style bottom-right green circle) */}
      <a
        href={floatingWa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Написать в WhatsApp ${BRAND.phoneDisplay}`}
        className="fixed right-5 bottom-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#1EBE5B] active:scale-95"
      >
        <WhatsAppGlyph className="h-7 w-7" />
      </a>
    </>
  );
}
