import type { Metadata } from "next";
import Link from "next/link";
import { getAllSubjectCurricula } from "@/lib/universal-curriculum";

export const metadata: Metadata = {
  title: "Каталог всех предметов (12 курсов) — BilimAI",
  description:
    "Выберите предмет для изучения: математика, физика, информатика, химия, биология, география, история Казахстана, всемирная история, основы права, английский язык, математическая грамотность и грамотность чтения.",
  alternates: {
    canonical: "https://bilimai.dpdns.org/subjects"
  }
};

export default function SubjectsCatalogPage() {
  const curricula = getAllSubjectCurricula();

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
            maxWidth: 1180,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12
          }}
        >
          <Link
            href="/welcome"
            style={{
              fontWeight: 800,
              fontSize: 18,
              textDecoration: "none",
              color: "inherit"
            }}
          >
            BilimAI · Платформа предметов
          </Link>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 14 }}>
            <Link href="/welcome" style={{ textDecoration: "none", color: "var(--muted, #57544e)", fontWeight: 600 }}>
              Обзор платформы
            </Link>
            <Link href="/" style={{ textDecoration: "none", color: "var(--accent, #3856f5)", fontWeight: 700 }}>
              Рабочая тетрадь →
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 16px 80px", display: "grid", gap: 24 }}>
        <div>
          <h1 style={{ margin: "0 0 8px", fontSize: "clamp(24px, 3vw, 34px)" }}>
            Каталог учебных предметов BilimAI
          </h1>
          <p style={{ margin: 0, fontSize: 16, color: "var(--muted, #57544e)", maxWidth: 760 }}>
            Каждый предмет включает пошаговые уроки с объяснениями и примерами, практику разных форматов, Лабораторию ошибок, Карту знаний и ИИ-репетитора.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: 16
          }}
        >
          {curricula.map((subj) => {
            const totalQuestions = subj.lessons.reduce((sum, l) => sum + l.questions.length, 0);
            return (
              <article
                key={subj.id}
                data-testid={`catalog-subject-card-${subj.id}`}
                style={{
                  background: "var(--surface, #fff)",
                  border: "1px solid var(--border, #e4e1d8)",
                  borderRadius: 18,
                  padding: "18px 20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 14
                }}
              >
                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 800,
                        padding: "3px 9px",
                        borderRadius: 999,
                        background: `${subj.accentColor}18`,
                        color: subj.accentColor
                      }}
                    >
                      {subj.badge}
                    </span>
                    <span style={{ fontSize: 12.5, color: "var(--muted, #65635d)" }}>
                      {subj.lessons.length} уроков · {totalQuestions} заданий
                    </span>
                  </div>

                  <h2 style={{ margin: 0, fontSize: 19 }}>{subj.title.ru}</h2>
                  <p style={{ margin: 0, fontSize: 14, color: "var(--muted, #57544e)", lineHeight: 1.45 }}>
                    {subj.description.ru}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Link
                    href={`/subjects/${subj.id}`}
                    style={{
                      flex: "1 1 auto",
                      textAlign: "center",
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: "var(--accent, #3856f5)",
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: 14
                    }}
                  >
                    Открыть предмет →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
