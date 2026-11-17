import { StudioFooter } from "@/components/studio-footer";
import { StudioHeader } from "@/components/studio-header";

export default function NotFound() {
  return (
    <>
      <StudioHeader />
      <main className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="text-sm font-semibold text-[#2F80FF]">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
          Страница не найдена
        </h1>
        <p className="mt-3 text-base text-zinc-600">
          Возможно, ссылка устарела. Перейдите на главную страницу студии
          JustSlide или посмотрите тарифы и калькулятор.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href="/"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#2F80FF] px-6 text-sm font-semibold text-white hover:bg-[#126DFB]"
          >
            На главную JustSlide
          </a>
          <a
            href="/services"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-zinc-100 px-6 text-sm font-semibold text-zinc-900 hover:bg-zinc-200"
          >
            Услуги и цены
          </a>
        </div>
      </main>
      <StudioFooter />
    </>
  );
}
