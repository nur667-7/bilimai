import type { Metadata } from "next";
import Study, { type WorkspaceTab } from "./study";
import { untTopicIds, type Language, type TopicId } from "@/lib/lessons";
import { UNT_SUBJECTS, type UntSubjectId } from "@/lib/unt-all-subjects";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://bilimai.dpdns.org/",
    languages: {
      ru: "https://bilimai.dpdns.org/?lang=ru",
      kk: "https://bilimai.dpdns.org/?lang=kk",
      uz: "https://bilimai.dpdns.org/?lang=uz"
    }
  }
};

const VALID_TABS: readonly WorkspaceTab[] = [
  "today",
  "lesson",
  "practice",
  "ai",
  "xray",
  "exam",
  "graph",
  "roadmap",
  "profile"
];

export default async function Home({
  searchParams
}: {
  searchParams?: Promise<{
    lang?: string;
    tab?: string;
    topic?: string;
    subject?: string;
    variant?: string;
  }>;
}) {
  const resolved = searchParams ? await searchParams : {};

  const rawLang = resolved?.lang;
  const initialLang: Language =
    rawLang === "kk" || rawLang === "uz" || rawLang === "ru" ? rawLang : "ru";

  const rawTopic = resolved?.topic;
  const hasExplicitTopic = Boolean(
    rawTopic && (untTopicIds as readonly string[]).includes(rawTopic)
  );
  const initialTopic: TopicId = hasExplicitTopic
    ? (rawTopic as TopicId)
    : "linear";

  const rawTab = resolved?.tab;
  const initialTab: WorkspaceTab =
    rawTab && (VALID_TABS as readonly string[]).includes(rawTab)
      ? (rawTab as WorkspaceTab)
      : hasExplicitTopic
        ? "lesson"
        : "today";

  const rawSubject = resolved?.subject;
  const initialSubjectId: UntSubjectId =
    rawSubject && UNT_SUBJECTS.some((s) => s.id === rawSubject)
      ? (rawSubject as UntSubjectId)
      : "math";

  const rawVariant = Number(resolved?.variant);
  const initialVariantNumber =
    Number.isInteger(rawVariant) && rawVariant >= 1 && rawVariant <= 10
      ? rawVariant
      : 1;

  return (
    <Study
      initialLang={initialLang}
      initialTab={initialTab}
      initialTopic={initialTopic}
      initialSubjectId={initialSubjectId}
      initialVariantNumber={initialVariantNumber}
    />
  );
}
