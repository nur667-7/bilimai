import type { Metadata } from "next";
import { StudioFooter } from "@/components/studio-footer";
import { StudioHeader } from "@/components/studio-header";
import { BRAND } from "@/lib/justslide-data";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: `Условия конфиденциальности и обработки материалов клиентов студии презентаций ${BRAND.name} (${BRAND.handle}).`,
  alternates: {
    canonical: `${BRAND.siteUrl}/privacy`
  }
};

export default function PrivacyPage() {
  return (
    <>
      <StudioHeader />
      <main className="mx-auto max-w-3xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20">
        <p className="text-sm font-semibold text-[#2F80FF]">Документы</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
          Политика конфиденциальности {BRAND.name}
        </h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-zinc-600">
          <p>
            Сайт студии <strong>{BRAND.name} ({BRAND.handle})</strong> не
            собирает и не хранит персональные данные в скрытых базах данных:
            форма брифа на странице <code>/order</code> формирует сообщение на
            вашем устройстве и передаётся в WhatsApp только после вашего явного
            нажатия.
          </p>
          <p>
            Все исходные тексты, финансовые показатели, учебные работы и
            коммерческие предложения клиентов используются исключительно для
            выполнения вашего заказа и не передаются третьим лицам. Для
            корпоративных заказов по запросу подписывается соглашение о
            неразглашении (NDA).
          </p>
          <p>
            По вопросам удаления файлов заказа напишите в WhatsApp Business:{" "}
            <a
              href={BRAND.whatsappDirect}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#2F80FF] underline"
            >
              {BRAND.phoneDisplay}
            </a>
            .
          </p>
        </div>
      </main>
      <StudioFooter />
    </>
  );
}
