import type { Metadata } from "next";
import {
  getSubjectCurriculum,
  findSubjectLessonByIdOrSlug
} from "@/lib/universal-curriculum";
import { SubjectOverviewClient } from "../../subject-overview-client";

export async function generateMetadata({
  params
}: {
  params: Promise<{ subject: string; lessonId: string }>;
}): Promise<Metadata> {
  const { subject, lessonId } = await params;
  const curriculum = getSubjectCurriculum(subject);
  const found = curriculum ? findSubjectLessonByIdOrSlug(curriculum, lessonId) : null;
  const title =
    curriculum && found
      ? `${found.lesson.title.ru} — ${curriculum.title.ru} | BilimAI`
      : curriculum
        ? `${curriculum.title.ru} — Урок | BilimAI`
        : "Урок | BilimAI";
  const description = found
    ? found.lesson.learningGoal.ru
    : curriculum
      ? curriculum.description.ru
      : "Пошаговый интерактивный урок, разбор примера и практика в BilimAI.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://bilimai.dpdns.org/subjects/${subject}/lessons/${lessonId}`
    }
  };
}

export default async function SubjectLessonDeepLinkPage({
  params,
  searchParams
}: {
  params: Promise<{ subject: string; lessonId: string }>;
  searchParams?: Promise<{ lang?: string; start?: string }>;
}) {
  const { subject, lessonId } = await params;
  const resolvedSearch = searchParams ? await searchParams : {};
  return (
    <SubjectOverviewClient
      subjectId={subject}
      initialStartMode={resolvedSearch.start ?? "lesson"}
      initialLessonId={lessonId}
      initialLang={resolvedSearch.lang}
    />
  );
}
