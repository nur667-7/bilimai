"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/curriculum";
import {
  getSubjectCurriculum,
  getAllSubjectCurricula,
  buildUniversalSubjectGraph,
  type UniversalSubjectCurriculum,
  type UniversalLesson
} from "@/lib/universal-curriculum";
import {
  advanceLessonQuestionIndex,
  type UniversalQuestion,
  type UniversalQuestionEvaluation
} from "@/lib/question-engine";
import {
  UNIVERSAL_PROGRESS_STORAGE_KEY,
  createDefaultUniversalProgressState,
  migrateUniversalProgressState,
  getSubjectProgress,
  getSubjectSummaryMetrics,
  recordSubjectLessonCompletion,
  recordSubjectQuestionAttempt,
  recordSubjectErrorLabCompletion,
  type UniversalPlatformProgressState
} from "@/lib/universal-progress";
import { UniversalQuestionRenderer } from "@/components/study/universal-question-renderer";

type SubjectWorkspaceTab = "overview" | "lesson" | "practice" | "error_lab" | "map" | "tutor" | "diagnostic";

const LOCALE_STORAGE_KEY = "bilimai-locale-v1";

export function SubjectOverviewClient({ subjectId }: { subjectId: string }) {
  const [locale, setLocale] = useState<Locale>("ru");
  const [activeTab, setActiveTab] = useState<SubjectWorkspaceTab>("overview");
  const [progressState, setProgressState] = useState<UniversalPlatformProgressState>(() =>
    createDefaultUniversalProgressState()
  );

  const curriculum: UniversalSubjectCurriculum | null = useMemo(
    () => getSubjectCurriculum(subjectId),
    [subjectId]
  );
  const allSubjects = useMemo(() => getAllSubjectCurricula(), []);

  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [lessonQuestionIndex, setLessonQuestionIndex] = useState(0);
  const [lessonQuestionsFinished, setLessonQuestionsFinished] = useState(false);
  const [explanationDepth, setExplanationDepth] = useState<"simple" | "detailed">("simple");

  // Practice state
  const [practiceQuestionIndex, setPracticeQuestionIndex] = useState(0);

  // Error lab state
  const [selectedStepIdx, setSelectedStepIdx] = useState<number | null>(null);

  // Diagnostic state
  const [diagIndex, setDiagIndex] = useState(0);
  const [diagEarned, setDiagEarned] = useState(0);
  const [diagMax, setDiagMax] = useState(0);
  const [diagDone, setDiagDone] = useState(false);

  // AI Tutor state
  const [tutorInput, setTutorInput] = useState("");
  const [tutorLoading, setTutorLoading] = useState(false);
  const [tutorMessages, setTutorMessages] = useState<
    Array<{ role: "user" | "assistant"; text: string; modeLabel?: string }>
  >([]);

  useEffect(() => {
    try {
      const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (savedLocale === "ru" || savedLocale === "kk" || savedLocale === "uz") {
        setLocale(savedLocale);
      }
      const rawV2 = window.localStorage.getItem(UNIVERSAL_PROGRESS_STORAGE_KEY);
      const rawLegacy = window.localStorage.getItem("bilimai-lab-v1");
      const migrated = migrateUniversalProgressState(rawV2, rawLegacy);
      migrated.activeSubjectId = subjectId;
      setProgressState(migrated);
      window.localStorage.setItem(UNIVERSAL_PROGRESS_STORAGE_KEY, JSON.stringify(migrated));
    } catch {
      // ignore storage errors
    }
  }, [subjectId]);

  const updateProgress = (updater: (prev: UniversalPlatformProgressState) => UniversalPlatformProgressState) => {
    setProgressState((prev) => {
      const next = updater(prev);
      try {
        window.localStorage.setItem(UNIVERSAL_PROGRESS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleLocaleChange = (nextLocale: Locale) => {
    setLocale(nextLocale);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    } catch {
      // ignore
    }
  };

  if (!curriculum) {
    return (
      <main style={{ maxWidth: 920, margin: "40px auto", padding: "0 20px" }}>
        <h1>Предмет не найден</h1>
        <p>Выберите предмет из каталога BilimAI.</p>
        <Link href="/subjects" style={{ color: "var(--accent, #3856f5)", fontWeight: 600 }}>
          ← Перейти в каталог предметов
        </Link>
      </main>
    );
  }

  const currentLesson: UniversalLesson =
    curriculum.lessons[Math.min(selectedLessonIndex, curriculum.lessons.length - 1)] ??
    curriculum.lessons[0];

  const allPracticeQuestions: UniversalQuestion[] = curriculum.lessons.flatMap((l) => l.questions);
  const currentPracticeQuestion: UniversalQuestion | undefined =
    allPracticeQuestions[Math.min(practiceQuestionIndex, Math.max(0, allPracticeQuestions.length - 1))];

  const subjectProgress = getSubjectProgress(progressState, curriculum.id);
  const summaryMetrics = getSubjectSummaryMetrics(
    progressState,
    curriculum.id,
    curriculum.lessons.length
  );
  const graphNodes = buildUniversalSubjectGraph(
    curriculum.id,
    subjectProgress.completedLessonIds,
    subjectProgress.topicStats
  );
  const recommendedNode = graphNodes.find((n) => n.status === "recommended" || n.status === "gap") ?? graphNodes[0];

  const openLessonByIndex = (idx: number) => {
    setSelectedLessonIndex(idx);
    setLessonQuestionIndex(0);
    setLessonQuestionsFinished(false);
    setActiveTab("lesson");
  };

  const handleLessonQuestionNext = () => {
    const step = advanceLessonQuestionIndex(lessonQuestionIndex, currentLesson.questions.length);
    setLessonQuestionIndex(step.nextIndex);
    if (step.completed) {
      setLessonQuestionsFinished(true);
    }
  };

  const handleCompleteCurrentLesson = () => {
    updateProgress((prev) =>
      recordSubjectLessonCompletion(prev, curriculum.id, currentLesson.id, currentLesson.topicId)
    );
    setLessonQuestionsFinished(true);
  };

  const handleQuestionEvaluated = (evaluation: UniversalQuestionEvaluation, q: UniversalQuestion) => {
    updateProgress((prev) =>
      recordSubjectQuestionAttempt(prev, {
        subjectId: curriculum.id,
        topicId: q.topicId,
        earnedPoints: evaluation.earnedPoints,
        maxPoints: evaluation.maxPoints,
        verificationState: evaluation.verificationState,
        errorCategory: evaluation.errorCategory
      })
    );
  };

  const askTutor = async (promptText: string, modeLabel?: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || tutorLoading) return;
    setTutorMessages((prev) => [...prev, { role: "user", text: trimmed, modeLabel }]);
    setTutorInput("");
    setTutorLoading(true);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          lessonTitle: `${curriculum.title[locale]} — ${currentLesson.title[locale]}`,
          problemPrompt: currentLesson.workedExample.problem[locale],
          correctAnswer: currentLesson.workedExample.takeaway[locale],
          studentAnswer: trimmed,
          followUpQuestion: trimmed
        })
      });
      const data = (await res.json()) as {
        explanation?: string;
        nextStepPrompt?: string;
        fallbackUsed?: boolean;
      };
      const reply = data.explanation
        ? `${data.explanation}${data.nextStepPrompt ? `\n\n👉 ${data.nextStepPrompt}` : ""}`
        : currentLesson.detailedExplanation[locale];
      setTutorMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: reply,
          modeLabel: data.fallbackUsed ? "Локальный педагогический разбор" : "ИИ-репетитор BilimAI"
        }
      ]);
    } catch {
      setTutorMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `${currentLesson.simpleExplanation[locale]}\n\nПример: ${currentLesson.workedExample.steps[locale].join(" → ")}`,
          modeLabel: "Локальный педагогический разбор"
        }
      ]);
    } finally {
      setTutorLoading(false);
    }
  };

  const activeErrorLab = curriculum.errorLabCases[0];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg, #f7f5ef)", color: "var(--ink, #171717)" }}>
      {/* Top Universal Navigation Bar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "rgba(247, 245, 239, 0.94)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--border, #e4e1d8)",
          padding: "10px 16px"
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/welcome"
              style={{
                fontWeight: 800,
                fontSize: 18,
                textDecoration: "none",
                color: "var(--ink, #171717)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "var(--accent, #3856f5)",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 800
                }}
              >
                B
              </span>
              <span>BilimAI</span>
            </Link>

            <Link
              href="/subjects"
              style={{
                fontSize: 13.5,
                color: "var(--muted, #65635d)",
                textDecoration: "none",
                fontWeight: 600
              }}
            >
              Все предметы (12)
            </Link>

            <select
              aria-label="Выбор предмета"
              value={curriculum.id}
              onChange={(e) => {
                window.location.href = `/subjects/${e.target.value}`;
              }}
              style={{
                padding: "6px 10px",
                borderRadius: 10,
                border: "1px solid var(--border, #dcd8ce)",
                background: "var(--surface, #fff)",
                fontSize: 13.5,
                fontWeight: 600
              }}
            >
              {allSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.badge} · {s.title[locale]}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div
              role="group"
              aria-label="Язык интерфейса"
              style={{
                display: "inline-flex",
                borderRadius: 10,
                border: "1px solid var(--border, #dcd8ce)",
                overflow: "hidden",
                background: "var(--surface, #fff)"
              }}
            >
              {(["ru", "kk", "uz"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLocaleChange(lang)}
                  style={{
                    padding: "6px 10px",
                    border: "none",
                    background: locale === lang ? "var(--accent, #3856f5)" : "transparent",
                    color: locale === lang ? "#fff" : "inherit",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {lang === "ru" ? "RU" : lang === "kk" ? "ҚАЗ" : "OʻZB"}
                </button>
              ))}
            </div>

            <Link
              href={`/?subject=${curriculum.id}`}
              style={{
                padding: "7px 12px",
                borderRadius: 10,
                border: "1px solid var(--border, #dcd8ce)",
                background: "var(--surface, #fff)",
                textDecoration: "none",
                color: "inherit",
                fontSize: 13,
                fontWeight: 600
              }}
            >
              Рабочая тетрадь
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 16px 80px", display: "grid", gap: 22 }}>
        {/* Subject Hero & 4 Primary CTAs */}
        <section
          data-testid="subject-overview-hero"
          style={{
            background: "var(--surface, #ffffff)",
            border: "1px solid var(--border, #e4e1d8)",
            borderRadius: 20,
            padding: "22px 24px",
            display: "grid",
            gap: 16
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: `${curriculum.accentColor}18`,
                  color: curriculum.accentColor,
                  fontWeight: 800,
                  fontSize: 12
                }}
              >
                {curriculum.badge}
              </span>
              <span style={{ fontSize: 13, color: "var(--muted, #65635d)" }}>
                {curriculum.lessons.length} уроков · {allPracticeQuestions.length} интерактивных заданий
              </span>
            </div>

            <div
              data-testid="subject-isolated-progress-pill"
              style={{
                fontSize: 13,
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: 999,
                background: "var(--bg, #f7f5ef)",
                border: "1px solid var(--border, #e4e1d8)"
              }}
            >
              Прогресс по предмету: {summaryMetrics.completedLessons} из {summaryMetrics.totalLessons} уроков (
              {summaryMetrics.completionPercent}%)
              {summaryMetrics.averageAccuracyPercent !== null
                ? ` · Точность ${summaryMetrics.averageAccuracyPercent}%`
                : " · Ещё не оценено"}
            </div>
          </div>

          <div>
            <h1 style={{ margin: "0 0 8px", fontSize: "clamp(22px, 3vw, 30px)", lineHeight: 1.2 }}>
              {curriculum.title[locale]}
            </h1>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: "var(--muted, #57544e)" }}>
              {curriculum.description[locale]}
            </p>
          </div>

          {/* Available levels */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(curriculum.levels[locale] ?? curriculum.levels.ru).map((lvl, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: 12.5,
                  padding: "5px 11px",
                  borderRadius: 999,
                  background: "var(--bg, #f7f5ef)",
                  color: "var(--ink, #171717)"
                }}
              >
                Уровень {idx + 1}: {lvl}
              </span>
            ))}
          </div>

          {/* 4 Required Primary Buttons from Part VII */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingTop: 4 }}>
            <button
              type="button"
              data-testid="cta-start-first-lesson"
              onClick={() => openLessonByIndex(0)}
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                border: "none",
                background: "var(--accent, #3856f5)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer"
              }}
            >
              Начать с первого урока
            </button>

            <button
              type="button"
              data-testid="cta-check-level"
              onClick={() => {
                setDiagIndex(0);
                setDiagEarned(0);
                setDiagMax(0);
                setDiagDone(false);
                setActiveTab("diagnostic");
              }}
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid var(--accent, #3856f5)",
                background: "rgba(56, 86, 245, 0.08)",
                color: "var(--accent, #3856f5)",
                fontWeight: 700,
                fontSize: 14.5,
                cursor: "pointer"
              }}
            >
              Проверить уровень (5–10 минут)
            </button>

            <button
              type="button"
              data-testid="cta-open-topic-map"
              onClick={() => setActiveTab("map")}
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid var(--border, #dcd8ce)",
                background: "var(--surface, #fff)",
                fontWeight: 600,
                fontSize: 14.5,
                cursor: "pointer"
              }}
            >
              Открыть карту тем
            </button>

            <button
              type="button"
              data-testid="cta-go-practice"
              onClick={() => setActiveTab("practice")}
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid var(--border, #dcd8ce)",
                background: "var(--surface, #fff)",
                fontWeight: 600,
                fontSize: 14.5,
                cursor: "pointer"
              }}
            >
              Перейти к практике
            </button>
          </div>
        </section>

        {/* Subject Workspace Mode Tabs */}
        <nav
          aria-label="Разделы предмета"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            borderBottom: "1px solid var(--border, #e4e1d8)",
            paddingBottom: 10
          }}
        >
          {(
            [
              { id: "overview", label: "Обзор курса" },
              { id: "lesson", label: "Урок" },
              { id: "practice", label: "Практика" },
              { id: "error_lab", label: "Лаборатория ошибок" },
              { id: "map", label: "Карта знаний" },
              { id: "tutor", label: "ИИ-репетитор" },
              { id: "diagnostic", label: "Диагностика" }
            ] as Array<{ id: SubjectWorkspaceTab; label: string }>
          ).map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                data-testid={`subject-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "9px 15px",
                  borderRadius: 10,
                  border: active ? "1px solid var(--accent, #3856f5)" : "1px solid var(--border, #dcd8ce)",
                  background: active ? "var(--accent, #3856f5)" : "var(--surface, #fff)",
                  color: active ? "#fff" : "inherit",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer"
                }}
              >
                {tab.label}
              </button>
            );
          })}

          <Link
            href={`/?mode=exam&subject=${curriculum.id}`}
            style={{
              marginLeft: "auto",
              padding: "9px 14px",
              borderRadius: 10,
              border: "1px dashed var(--border, #c5c0b4)",
              background: "transparent",
              color: "var(--muted, #57544e)",
              textDecoration: "none",
              fontSize: 13.5,
              fontWeight: 600
            }}
          >
            Тренажёр ЕНТ по предмету →
          </Link>
        </nav>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gap: 18 }}>
            {recommendedNode && (
              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: 16,
                  background: "rgba(56, 86, 245, 0.07)",
                  border: "1px solid rgba(56, 86, 245, 0.25)",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12
                }}
              >
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent, #3856f5)" }}>
                    РЕКОМЕНДУЕМЫЙ СЛЕДУЮЩИЙ ШАГ
                  </span>
                  <div style={{ fontSize: 17, fontWeight: 700, marginTop: 2 }}>
                    {recommendedNode.title[locale]}
                  </div>
                  <div style={{ fontSize: 13.5, color: "var(--muted, #57544e)" }}>
                    Раздел: {recommendedNode.sectionTitle[locale]} · ~12 минут
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const idx = curriculum.lessons.findIndex((l) => l.id === recommendedNode.lessonId);
                    openLessonByIndex(idx >= 0 ? idx : 0);
                  }}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 10,
                    border: "none",
                    background: "var(--accent, #3856f5)",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Открыть урок →
                </button>
              </div>
            )}

            <section
              style={{
                background: "var(--surface, #fff)",
                border: "1px solid var(--border, #e4e1d8)",
                borderRadius: 18,
                padding: "18px 20px",
                display: "grid",
                gap: 12
              }}
            >
              <h2 style={{ margin: 0, fontSize: 19 }}>Программа предмета ({curriculum.lessons.length} уроков)</h2>
              <div style={{ display: "grid", gap: 10 }}>
                {curriculum.lessons.map((lesson, idx) => {
                  const isDone = subjectProgress.completedLessonIds.includes(lesson.id);
                  const topicStat = subjectProgress.topicStats[lesson.topicId];
                  return (
                    <div
                      key={lesson.id}
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "12px 14px",
                        borderRadius: 14,
                        border: "1px solid var(--border, #e4e1d8)",
                        background: isDone ? "rgba(22, 163, 74, 0.05)" : "var(--bg, #f7f5ef)"
                      }}
                    >
                      <div style={{ display: "grid", gap: 3 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted, #65635d)" }}>
                            Урок {idx + 1} · {lesson.sectionTitle[locale]}
                          </span>
                          {isDone && (
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                padding: "2px 8px",
                                borderRadius: 999,
                                background: "rgba(22, 163, 74, 0.15)",
                                color: "#15803d"
                              }}
                            >
                              ✓ Завершён
                            </span>
                          )}
                          {topicStat && topicStat.max > 0 && (
                            <span style={{ fontSize: 12, color: "var(--muted, #65635d)" }}>
                              Точность: {Math.round((topicStat.earned / topicStat.max) * 100)}%
                            </span>
                          )}
                        </div>
                        <strong style={{ fontSize: 16 }}>{lesson.title[locale]}</strong>
                        <span style={{ fontSize: 13.5, color: "var(--muted, #57544e)" }}>
                          Цель: {lesson.learningGoal[locale]}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => openLessonByIndex(idx)}
                        style={{
                          padding: "9px 14px",
                          borderRadius: 10,
                          border: "1px solid var(--accent, #3856f5)",
                          background: "var(--surface, #fff)",
                          color: "var(--accent, #3856f5)",
                          fontWeight: 600,
                          fontSize: 13.5,
                          cursor: "pointer"
                        }}
                      >
                        {isDone ? "Повторить урок" : "Изучить →"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: INTERACTIVE LESSON ENGINE (Part IX) */}
        {activeTab === "lesson" && (
          <section
            data-testid="interactive-lesson-engine"
            style={{
              background: "var(--surface, #fff)",
              border: "1px solid var(--border, #e4e1d8)",
              borderRadius: 20,
              padding: "22px 24px",
              display: "grid",
              gap: 18
            }}
          >
            {/* Lesson selector bar */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent, #3856f5)" }}>
                  Урок {selectedLessonIndex + 1} из {curriculum.lessons.length}
                </span>
                <span style={{ fontSize: 13, color: "var(--muted, #65635d)" }}>
                  · {currentLesson.sectionTitle[locale]} · ~{currentLesson.estimatedMinutes} мин
                </span>
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {curriculum.lessons.map((l, idx) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => openLessonByIndex(idx)}
                    style={{
                      padding: "6px 11px",
                      borderRadius: 8,
                      border:
                        idx === selectedLessonIndex
                          ? "1px solid var(--accent, #3856f5)"
                          : "1px solid var(--border, #dcd8ce)",
                      background: idx === selectedLessonIndex ? "var(--accent, #3856f5)" : "transparent",
                      color: idx === selectedLessonIndex ? "#fff" : "inherit",
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    #{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: 23 }}>{currentLesson.title[locale]}</h2>
              <p style={{ margin: 0, fontSize: 15, color: "var(--muted, #57544e)" }}>
                <strong>Цель урока:</strong> {currentLesson.learningGoal[locale]}
              </p>
            </div>

            {/* Step 1: Theory & Explanation Toggle («Объясни проще» / «Подробный разбор») */}
            <div
              style={{
                padding: "16px 18px",
                borderRadius: 16,
                background: "var(--bg, #f7f5ef)",
                display: "grid",
                gap: 12
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <strong style={{ fontSize: 15 }}>1. Ключевое объяснение</strong>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => setExplanationDepth("simple")}
                    style={{
                      padding: "6px 11px",
                      borderRadius: 8,
                      border: "1px solid var(--border, #dcd8ce)",
                      background: explanationDepth === "simple" ? "var(--accent, #3856f5)" : "var(--surface, #fff)",
                      color: explanationDepth === "simple" ? "#fff" : "inherit",
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Объясни проще
                  </button>
                  <button
                    type="button"
                    onClick={() => setExplanationDepth("detailed")}
                    style={{
                      padding: "6px 11px",
                      borderRadius: 8,
                      border: "1px solid var(--border, #dcd8ce)",
                      background: explanationDepth === "detailed" ? "var(--accent, #3856f5)" : "var(--surface, #fff)",
                      color: explanationDepth === "detailed" ? "#fff" : "inherit",
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Глубокий разбор
                  </button>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55 }}>
                {explanationDepth === "simple"
                  ? currentLesson.simpleExplanation[locale]
                  : currentLesson.detailedExplanation[locale]}
              </p>

              {currentLesson.contentBlocks.map((block, bIdx) => (
                <div
                  key={bIdx}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1px solid var(--border, #dcd8ce)",
                    background: block.type === "code" ? "#161922" : "var(--surface, #fff)",
                    color: block.type === "code" ? "#f8f8f2" : "inherit"
                  }}
                >
                  <strong style={{ display: "block", fontSize: 13.5, marginBottom: 4 }}>
                    {block.title[locale]}
                  </strong>
                  <pre
                    style={{
                      margin: 0,
                      whiteSpace: "pre-wrap",
                      fontFamily:
                        block.type === "code" || block.type === "formula"
                          ? "var(--font-mono, monospace)"
                          : "inherit",
                      fontSize: 14.5,
                      lineHeight: 1.5
                    }}
                  >
                    {block.body[locale]}
                  </pre>
                </div>
              ))}
            </div>

            {/* Step 2: Worked Example */}
            <div
              style={{
                padding: "16px 18px",
                borderRadius: 16,
                border: "1px solid var(--border, #e4e1d8)",
                display: "grid",
                gap: 10
              }}
            >
              <strong style={{ fontSize: 15 }}>2. Пошаговый пример с разбором</strong>
              <div style={{ fontSize: 15.5, fontWeight: 600 }}>
                {currentLesson.workedExample.problem[locale]}
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                {(currentLesson.workedExample.steps[locale] ?? currentLesson.workedExample.steps.ru).map(
                  (stepText, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        padding: "9px 12px",
                        borderRadius: 10,
                        background: "var(--bg, #f7f5ef)",
                        fontSize: 14.5
                      }}
                    >
                      {stepText}
                    </div>
                  )
                )}
              </div>
              <div style={{ fontSize: 14, color: "var(--accent, #3856f5)", fontWeight: 600 }}>
                📌 Вывод: {currentLesson.workedExample.takeaway[locale]}
              </div>
            </div>

            {/* Step 3: Interactive Micro-Practice inside Lesson (with CASE B safe completion) */}
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <strong style={{ fontSize: 16 }}>
                  3. Проверка понимания ({Math.min(lessonQuestionIndex + 1, currentLesson.questions.length)} из{" "}
                  {currentLesson.questions.length})
                </strong>
                {lessonQuestionsFinished && (
                  <span
                    data-testid="lesson-questions-completed-badge"
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: "rgba(22, 163, 74, 0.14)",
                      color: "#15803d"
                    }}
                  >
                    Все задания урока пройдены ✓
                  </span>
                )}
              </div>

              {currentLesson.questions[lessonQuestionIndex] && (
                <UniversalQuestionRenderer
                  question={currentLesson.questions[lessonQuestionIndex]}
                  locale={locale}
                  onEvaluated={handleQuestionEvaluated}
                  onNextQuestion={handleLessonQuestionNext}
                  nextButtonLabel={
                    lessonQuestionIndex + 1 < currentLesson.questions.length
                      ? "Следующий вопрос урока →"
                      : "К итогу урока →"
                  }
                />
              )}
            </div>

            {/* Step 4: Lesson Summary & Completion Button */}
            <div
              style={{
                padding: "16px 18px",
                borderRadius: 16,
                background: "rgba(22, 163, 74, 0.07)",
                border: "1px solid rgba(22, 163, 74, 0.25)",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12
              }}
            >
              <div>
                <strong style={{ display: "block", fontSize: 15 }}>Итог урока</strong>
                <span style={{ fontSize: 14.5 }}>{currentLesson.summary[locale]}</span>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  data-testid="complete-lesson-btn"
                  onClick={handleCompleteCurrentLesson}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 10,
                    border: "none",
                    background: "#15803d",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {subjectProgress.completedLessonIds.includes(currentLesson.id)
                    ? "Урок завершён ✓"
                    : "Завершить урок"}
                </button>

                {selectedLessonIndex + 1 < curriculum.lessons.length && (
                  <button
                    type="button"
                    onClick={() => openLessonByIndex(selectedLessonIndex + 1)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 10,
                      border: "1px solid var(--accent, #3856f5)",
                      background: "var(--surface, #fff)",
                      color: "var(--accent, #3856f5)",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Следующий урок →
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: UNIVERSAL PRACTICE */}
        {activeTab === "practice" && currentPracticeQuestion && (
          <section style={{ display: "grid", gap: 14 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10
              }}
            >
              <h2 style={{ margin: 0, fontSize: 20 }}>
                Практика по предмету ({practiceQuestionIndex + 1} из {allPracticeQuestions.length})
              </h2>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {allPracticeQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setPracticeQuestionIndex(idx)}
                    style={{
                      padding: "6px 11px",
                      borderRadius: 8,
                      border:
                        idx === practiceQuestionIndex
                          ? "1px solid var(--accent, #3856f5)"
                          : "1px solid var(--border, #dcd8ce)",
                      background: idx === practiceQuestionIndex ? "var(--accent, #3856f5)" : "var(--surface, #fff)",
                      color: idx === practiceQuestionIndex ? "#fff" : "inherit",
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    #{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <UniversalQuestionRenderer
              question={currentPracticeQuestion}
              locale={locale}
              onEvaluated={handleQuestionEvaluated}
              onNextQuestion={() => {
                const next = advanceLessonQuestionIndex(practiceQuestionIndex, allPracticeQuestions.length);
                setPracticeQuestionIndex(next.completed ? 0 : next.nextIndex);
              }}
            />
          </section>
        )}

        {/* TAB 4: SUBJECT ERROR LAB */}
        {activeTab === "error_lab" && activeErrorLab && (
          <section
            data-testid="subject-error-lab"
            style={{
              background: "var(--surface, #fff)",
              border: "1px solid var(--border, #e4e1d8)",
              borderRadius: 20,
              padding: "22px 24px",
              display: "grid",
              gap: 16
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "rgba(220, 38, 38, 0.1)",
                  color: "#b91c1c"
                }}
              >
                ЛАБОРАТОРИЯ ОШИБОК · {curriculum.badge}
              </span>
              <h2 style={{ margin: "8px 0 4px", fontSize: 21 }}>{activeErrorLab.title[locale]}</h2>
              <p style={{ margin: 0, fontSize: 15, color: "var(--muted, #57544e)" }}>
                {activeErrorLab.taskPrompt[locale]} Нажмите на строку, где допущена первая логическая или предметная ошибка:
              </p>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              {(activeErrorLab.steps[locale] ?? activeErrorLab.steps.ru).map((stepLine, idx) => {
                const isSelected = selectedStepIdx === idx;
                const isBroken = idx === activeErrorLab.brokenStepIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    data-testid={`error-lab-step-${idx}`}
                    onClick={() => {
                      setSelectedStepIdx(idx);
                      if (idx === activeErrorLab.brokenStepIndex) {
                        updateProgress((prev) =>
                          recordSubjectErrorLabCompletion(prev, curriculum.id, activeErrorLab.id)
                        );
                      }
                    }}
                    style={{
                      textAlign: "left",
                      padding: "13px 15px",
                      borderRadius: 12,
                      border: isSelected
                        ? isBroken
                          ? "2px solid #15803d"
                          : "2px solid #b91c1c"
                        : "1px solid var(--border, #dcd8ce)",
                      background: isSelected
                        ? isBroken
                          ? "rgba(22, 163, 74, 0.09)"
                          : "rgba(220, 38, 38, 0.08)"
                        : "var(--bg, #f7f5ef)",
                      fontSize: 15,
                      cursor: "pointer"
                    }}
                  >
                    {stepLine}
                  </button>
                );
              })}
            </div>

            {selectedStepIdx !== null && (
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: 14,
                  background:
                    selectedStepIdx === activeErrorLab.brokenStepIndex
                      ? "rgba(22, 163, 74, 0.08)"
                      : "rgba(245, 158, 11, 0.1)",
                  border:
                    selectedStepIdx === activeErrorLab.brokenStepIndex
                      ? "1px solid rgba(22, 163, 74, 0.35)"
                      : "1px solid rgba(245, 158, 11, 0.4)",
                  display: "grid",
                  gap: 8
                }}
              >
                <strong>
                  {selectedStepIdx === activeErrorLab.brokenStepIndex
                    ? "✓ Точно! Вы нашли сломанный шаг."
                    : "Этот шаг корректен или является следствием. Проверьте другой шаг."}
                </strong>
                <p style={{ margin: 0, fontSize: 14.5 }}>{activeErrorLab.whyBroken[locale]}</p>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#15803d" }}>
                  Верная запись: {activeErrorLab.correctedStep[locale]}
                </div>
              </div>
            )}

            <div style={{ paddingTop: 6 }}>
              <h3 style={{ margin: "0 0 10px", fontSize: 17 }}>Задача на закрепление без этой ловушки:</h3>
              <UniversalQuestionRenderer
                question={activeErrorLab.transferQuestion}
                locale={locale}
                onEvaluated={handleQuestionEvaluated}
              />
            </div>
          </section>
        )}

        {/* TAB 5: UNIVERSAL KNOWLEDGE MAP */}
        {activeTab === "map" && (
          <section
            data-testid="subject-knowledge-map"
            style={{
              background: "var(--surface, #fff)",
              border: "1px solid var(--border, #e4e1d8)",
              borderRadius: 20,
              padding: "22px 24px",
              display: "grid",
              gap: 16
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: 21 }}>
                Карта знаний и пререквизитов · {curriculum.title[locale]}
              </h2>
              <p style={{ margin: 0, fontSize: 14.5, color: "var(--muted, #57544e)" }}>
                Каждая тема связана с базовыми темами (пререквизитами) и показывает текущий уровень освоения.
              </p>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {graphNodes.map((node, idx) => {
                const statusLabels: Record<typeof node.status, { text: string; color: string; bg: string }> = {
                  mastered: { text: "Освоено", color: "#15803d", bg: "rgba(22, 163, 74, 0.12)" },
                  review: { text: "Повторить", color: "#b45309", bg: "rgba(245, 158, 11, 0.14)" },
                  gap: { text: "Пробел", color: "#b91c1c", bg: "rgba(220, 38, 38, 0.12)" },
                  recommended: { text: "Учить следующим", color: "#3856f5", bg: "rgba(56, 86, 245, 0.12)" },
                  unassessed: { text: "Ещё не оценено", color: "#65635d", bg: "rgba(101, 99, 93, 0.12)" }
                };
                const st = statusLabels[node.status];
                return (
                  <div
                    key={node.id}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 14,
                      border: "1px solid var(--border, #e4e1d8)",
                      background: "var(--bg, #f7f5ef)",
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12
                    }}
                  >
                    <div style={{ display: "grid", gap: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            padding: "3px 9px",
                            borderRadius: 999,
                            background: st.bg,
                            color: st.color
                          }}
                        >
                          {st.text}
                        </span>
                        <span style={{ fontSize: 12.5, color: "var(--muted, #65635d)" }}>
                          Узел #{idx + 1} · {node.sectionTitle[locale]}
                        </span>
                      </div>
                      <strong style={{ fontSize: 16 }}>{node.title[locale]}</strong>
                      <div style={{ fontSize: 13, color: "var(--muted, #57544e)" }}>
                        {node.prerequisites.length > 0
                          ? `Требует базу: ${node.prerequisites.join(", ")}`
                          : "Базовая стартовая тема (без пререквизитов)"}
                        {node.unlocks.length > 0 ? ` → Открывает: ${node.unlocks.join(", ")}` : ""}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const lIdx = curriculum.lessons.findIndex((l) => l.id === node.lessonId);
                        openLessonByIndex(lIdx >= 0 ? lIdx : 0);
                      }}
                      style={{
                        padding: "9px 14px",
                        borderRadius: 10,
                        border: "1px solid var(--accent, #3856f5)",
                        background: "var(--surface, #fff)",
                        color: "var(--accent, #3856f5)",
                        fontWeight: 600,
                        fontSize: 13.5,
                        cursor: "pointer"
                      }}
                    >
                      К уроку темы →
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* TAB 6: SUBJECT AI TUTOR */}
        {activeTab === "tutor" && (
          <section
            data-testid="subject-ai-tutor"
            style={{
              background: "var(--surface, #fff)",
              border: "1px solid var(--border, #e4e1d8)",
              borderRadius: 20,
              padding: "22px 24px",
              display: "grid",
              gap: 16
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: 21 }}>
                ИИ-репетитор · {curriculum.title[locale]}
              </h2>
              <p style={{ margin: 0, fontSize: 14.5, color: "var(--muted, #57544e)" }}>
                Задайте вопрос по текущей теме «{currentLesson.title[locale]}» или выберите быстрое действие:
              </p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                { label: "Объясни проще", prompt: `Объясни проще тему «${currentLesson.title[locale]}» на бытовом примере.` },
                { label: "Дай подсказку, но не ответ", prompt: `Дай наводящую подсказку без готового ответа по задаче: ${currentLesson.workedExample.problem[locale]}` },
                { label: "Проверь мой ход мысли", prompt: `Проверь мой ход рассуждений по теме «${currentLesson.title[locale]}» и укажи, на что обратить внимание.` },
                { label: "Дай похожую задачу", prompt: `Придумай одну короткую тренировочную задачу по теме «${currentLesson.title[locale]}».` }
              ].map((btn, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => askTutor(btn.prompt, btn.label)}
                  style={{
                    padding: "8px 13px",
                    borderRadius: 999,
                    border: "1px solid var(--border, #dcd8ce)",
                    background: "var(--bg, #f7f5ef)",
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {tutorMessages.length === 0 && (
                <div
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    background: "var(--bg, #f7f5ef)",
                    fontSize: 14.5,
                    color: "var(--muted, #57544e)"
                  }}
                >
                  Нажмите на одну из кнопок выше или напишите свой вопрос — репетитор разберёт тему пошагово, не выдавая сухой ответ без объяснения.
                </div>
              )}
              {tutorMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "12px 15px",
                    borderRadius: 14,
                    background: msg.role === "user" ? "rgba(56, 86, 245, 0.08)" : "var(--bg, #f7f5ef)",
                    border: "1px solid var(--border, #e4e1d8)",
                    whiteSpace: "pre-wrap",
                    fontSize: 14.5,
                    lineHeight: 1.5
                  }}
                >
                  {msg.modeLabel && (
                    <span style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--accent, #3856f5)", marginBottom: 4 }}>
                      {msg.modeLabel}
                    </span>
                  )}
                  {msg.text}
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void askTutor(tutorInput);
              }}
              style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
            >
              <input
                type="text"
                value={tutorInput}
                onChange={(e) => setTutorInput(e.target.value)}
                placeholder="Напишите свой вопрос или шаг рассуждения..."
                style={{
                  flex: "1 1 260px",
                  padding: "11px 14px",
                  borderRadius: 12,
                  border: "1px solid var(--border, #dcd8ce)",
                  fontSize: 15
                }}
              />
              <button
                type="submit"
                disabled={tutorLoading}
                style={{
                  padding: "11px 18px",
                  borderRadius: 12,
                  border: "none",
                  background: "var(--accent, #3856f5)",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                {tutorLoading ? "Разбираем..." : "Спросить ИИ"}
              </button>
            </form>
          </section>
        )}

        {/* TAB 7: DIAGNOSTIC CHECK */}
        {activeTab === "diagnostic" && (
          <section
            data-testid="subject-diagnostic"
            style={{
              background: "var(--surface, #fff)",
              border: "1px solid var(--border, #e4e1d8)",
              borderRadius: 20,
              padding: "22px 24px",
              display: "grid",
              gap: 16
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: 21 }}>
                Экспресс-диагностика по предмету · {curriculum.title[locale]}
              </h2>
              <p style={{ margin: 0, fontSize: 14.5, color: "var(--muted, #57544e)" }}>
                Ответьте на вопросы ключевых разделов, чтобы BilimAI определил ваш стартовый уровень и построил персональный маршрут.
              </p>
            </div>

            {!diagDone && allPracticeQuestions[diagIndex] ? (
              <UniversalQuestionRenderer
                question={allPracticeQuestions[diagIndex]}
                locale={locale}
                onEvaluated={(ev, q) => {
                  handleQuestionEvaluated(ev, q);
                  setDiagEarned((prev) => prev + ev.earnedPoints);
                  setDiagMax((prev) => prev + ev.maxPoints);
                }}
                onNextQuestion={() => {
                  const step = advanceLessonQuestionIndex(diagIndex, Math.min(5, allPracticeQuestions.length));
                  if (step.completed) {
                    setDiagDone(true);
                  } else {
                    setDiagIndex(step.nextIndex);
                  }
                }}
                nextButtonLabel="Следующий диагностический вопрос →"
              />
            ) : (
              <div
                style={{
                  padding: "18px 20px",
                  borderRadius: 16,
                  background: "rgba(22, 163, 74, 0.08)",
                  border: "1px solid rgba(22, 163, 74, 0.3)",
                  display: "grid",
                  gap: 10
                }}
              >
                <strong style={{ fontSize: 18 }}>
                  Диагностика завершена! Ваш результат:{" "}
                  {diagMax > 0 ? Math.round((diagEarned / diagMax) * 100) : 0}%
                </strong>
                <p style={{ margin: 0, fontSize: 14.5 }}>
                  Карта знаний обновлена. Рекомендуем перейти к теме «{recommendedNode?.title[locale]}».
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => openLessonByIndex(0)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 10,
                      border: "none",
                      background: "var(--accent, #3856f5)",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Начать рекомендуемый урок →
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("map")}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 10,
                      border: "1px solid var(--border, #dcd8ce)",
                      background: "var(--surface, #fff)",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Посмотреть карту знаний
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
