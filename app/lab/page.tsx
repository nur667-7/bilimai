import type { Metadata } from "next";
import type { Language } from "@/lib/curriculum";
import { labTopics, type LabTopic } from "@/lib/error-lab";
import ErrorLab from "./error-lab";

export const metadata: Metadata = {
  title: "Тренировка поиска ошибки в решении — BilimAI",
  description:
    "Найдите первый неверный шаг в решении задачи ЕНТ, изучите исправление математического инварианта и решите задачу самостоятельно на закрепление.",
  alternates: {
    canonical: "https://bilimai.dpdns.org/lab"
  }
};

export default async function LabPage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string; topic?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const initialLang: Language =
    params.lang === "kk" || params.lang === "uz" || params.lang === "ru" ? params.lang : "ru";
  const initialTopic: LabTopic =
    params.topic && (labTopics as readonly string[]).includes(params.topic)
      ? (params.topic as LabTopic)
      : "linear";
  return <ErrorLab initialLang={initialLang} initialTopic={initialTopic} />;
}
