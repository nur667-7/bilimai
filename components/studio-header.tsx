import { Menu } from "lucide-react";
import { JustSlideMark } from "@/components/brand-mark";
import { BRAND } from "@/lib/justslide-data";

const NAV_LINKS = [
  { href: "/work", label: "Работы" },
  { href: "/useful", label: "Полезное" },
  { href: "/services", label: "Услуги" },
  { href: "/about", label: "Студия" },
  { href: "/contact", label: "Контакты" }
] as const;

export function StudioHeader({ activePath = "/" }: { activePath?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand */}
        <a
          href="/"
          className="inline-flex min-h-[44px] items-center gap-2.5 text-lg font-bold tracking-tight text-zinc-950"
        >
          <JustSlideMark size={34} />
          <span>{BRAND.name}</span>
        </a>

        {/* Desktop Nav */}
        <nav
          aria-label="Основная навигация"
          className="hidden items-center gap-7 text-sm font-medium md:flex"
        >
          {NAV_LINKS.map((item) => {
            const isActive =
              activePath === item.href || activePath.startsWith(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-[#2F80FF]"
                style={{ color: isActive ? "#09090B" : "#52525B" }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right CTA + Mobile Menu */}
        <div className="flex items-center gap-2">
          <a
            href="/order"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#2F80FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#126DFB] active:scale-[0.99]"
          >
            <span className="hidden sm:inline">Заказать презентацию</span>
            <span className="sm:hidden">Заказать</span>
          </a>

          <details className="relative md:hidden">
            <summary
              aria-label="Открыть меню"
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </summary>
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex min-h-[44px] items-center rounded-xl px-3.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={BRAND.whatsappDirect}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex min-h-[44px] items-center justify-center rounded-xl bg-[#25D366] px-3.5 text-sm font-semibold text-white"
              >
                WhatsApp {BRAND.phoneDisplay}
              </a>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
