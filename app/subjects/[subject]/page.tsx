import type { Metadata } from "next";
import { getSubjectCurriculum } from "@/lib/universal-curriculum";
import { SubjectOverviewClient } from "./subject-overview-client";

export async function generateMetadata({
  params
}: {
  params: Promise<{ subject: string }>;
}): Promise<Metadata> {
  const { subject } = await params;
  const curriculum = getSubjectCurriculum(subject);
  const title = curriculum ? `${curriculum.title.ru} — Уроки, Практика и ИИ-репетитор | BilimAI` : "Предмет | BilimAI";
  const description = curriculum
    ? curriculum.description.ru
    : "Интерактивные уроки, разбор ошибок, карта знаний и практика по любому предмету в BilimAI.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://bilimai.dpdns.org/subjects/${subject}`
    }
  };
}

export default async function SubjectOverviewPage({
  params
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = await params;
  return <SubjectOverviewClient subjectId={subject} />;
}
