"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllSubjectCurricula } from "@/lib/universal-curriculum";
import { loadUserProfile, createDemoProfile, saveUserProfile, type UserProfile } from "@/lib/user-profile";

export default function TeacherWorkspacePage() {
  const curricula = getAllSubjectCurricula();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("math");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    setProfile(loadUserProfile());
  }, []);

  const currentSubject = curricula.find((c) => c.id === selectedSubjectId) ?? curricula[0];

  const activateTeacherRole = () => {
    const next = createDemoProfile("teacher", "ru");
    saveUserProfile(next);
    setProfile(next);
  };

  const handleCopyAssignmentLink = (path: string) => {
    const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
    setCopiedUrl(url);
    try {
      void navigator.clipboard?.writeText(url);
    } catch {
      // ignore
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg, #f7f5ef)", color: "var(--ink, #171717)" }}>
      <header
        style={{
          borderBottom: "1px solid var(--border, #e4e1d8)",
          background: "var(--surface, #fff)",
          padding: "12px 16px"
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12
          }}
        >
          <Link href="/welcome" style={{ fontWeight: 800, fontSize: 18, textDecoration: "none", color: "inherit" }}>
            BilimAI · Кабинет преподавателя
          </Link>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 14 }}>
            <Link href="/subjects" style={{ textDecoration: "none", color: "var(--muted, #57544e)", fontWeight: 600 }}>
              Все предметы (12)
            </Link>
            <Link href="/" style={{ textDecoration: "none", color: "var(--accent, #3856f5)", fontWeight: 700 }}>
              Учебная зона →
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1140, margin: "0 auto", padding: "28px 16px 80px", display: "grid", gap: 20 }}>
        {/* Honest Role / Storage Status Banner */}
        <section
          data-testid="teacher-rbac-banner"
          style={{
            background: "var(--surface, #fff)",
            border: "1px solid var(--border, #e4e1d8)",
            borderRadius: 18,
            padding: "18px 20px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12
          }}
        >
          <div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: "3px 9px",
                borderRadius: 999,
                background:
                  profile?.role === "teacher" ? "rgba(22, 163, 74, 0.14)" : "rgba(245, 158, 11, 0.15)",
                color: profile?.role === "teacher" ? "#15803d" : "#b45309"
              }}
            >
              {profile?.role === "teacher"
                ? `Роль подтверждена: Преподаватель (${profile.name})`
                : "Гостевой / Ученический режим"}
            </span>
            <h1 style={{ margin: "8px 0 4px", fontSize: 24 }}>
              Конструктор учебных заданий и модулей по 12 предметам
            </h1>
            <p style={{ margin: 0, fontSize: 14.5, color: "var(--muted, #57544e)" }}>
              Выберите предмет, просмотрите структуру уроков, пререквизитов и Лаборатории ошибок и скопируйте прямую ссылку на задание для класса.
            </p>
          </div>

          {profile?.role !== "teacher" && (
            <button
              type="button"
              onClick={activateTeacherRole}
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
              Включить локальный режим преподавателя
            </button>
          )}
        </section>

        {/* Subject Picker */}
        <section
          style={{
            background: "var(--surface, #fff)",
            border: "1px solid var(--border, #e4e1d8)",
            borderRadius: 18,
            padding: "18px 20px",
            display: "grid",
            gap: 14
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {curricula.map((c) => {
              const active = c.id === currentSubject.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedSubjectId(c.id)}
                  style={{
                    padding: "8px 13px",
                    borderRadius: 10,
                    border: active ? "1px solid var(--accent, #3856f5)" : "1px solid var(--border, #dcd8ce)",
                    background: active ? "var(--accent, #3856f5)" : "var(--bg, #f7f5ef)",
                    color: active ? "#fff" : "inherit",
                    fontWeight: 600,
                    fontSize: 13.5,
                    cursor: "pointer"
                  }}
                >
                  {c.badge} · {c.title.ru}
                </button>
              );
            })}
          </div>

          {copiedUrl && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: "rgba(22, 163, 74, 0.1)",
                color: "#15803d",
                fontSize: 13.5,
                fontWeight: 600
              }}
            >
              ✓ Ссылка для учеников скопирована: {copiedUrl}
            </div>
          )}

          <div style={{ display: "grid", gap: 10 }}>
            {currentSubject.lessons.map((lesson, idx) => (
              <div
                key={lesson.id}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid var(--border, #e4e1d8)",
                  background: "var(--bg, #f7f5ef)",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10
                }}
              >
                <div>
                  <span style={{ fontSize: 12, color: "var(--muted, #65635d)", fontWeight: 700 }}>
                    Урок {idx + 1} · {lesson.sectionTitle.ru} · {lesson.questions.length} заданий
                  </span>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{lesson.title.ru}</div>
                  <div style={{ fontSize: 13.5, color: "var(--muted, #57544e)" }}>
                    Цель: {lesson.learningGoal.ru}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => handleCopyAssignmentLink(`/subjects/${currentSubject.id}`)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid var(--border, #dcd8ce)",
                      background: "var(--surface, #fff)",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer"
                    }}
                  >
                    Скопировать ссылку урока
                  </button>
                  <Link
                    href={`/subjects/${currentSubject.id}`}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: "var(--accent, #3856f5)",
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: 13
                    }}
                  >
                    Открыть →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
