import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px 16px",
        background: "var(--bg, #f7f5ef)",
        color: "var(--ink, #171717)"
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          background: "var(--surface, #fff)",
          border: "1px solid var(--border, #e4e1d8)",
          borderRadius: 20,
          padding: "28px 26px",
          display: "grid",
          gap: 14,
          textAlign: "center"
        }}
      >
        <span
          style={{
            justifySelf: "center",
            padding: "4px 12px",
            borderRadius: 999,
            background: "rgba(56, 86, 245, 0.1)",
            color: "var(--accent, #3856f5)",
            fontWeight: 800,
            fontSize: 12
          }}
        >
          404 · СТРАНИЦА НЕ НАЙДЕНА
        </span>
        <h1 style={{ margin: 0, fontSize: 24 }}>Такой страницы нет в BilimAI</h1>
        <p style={{ margin: 0, fontSize: 15, color: "var(--muted, #57544e)", lineHeight: 1.5 }}>
          Перейдите в каталог всех 12 предметов, откройте главную рабочую зону или вернитесь на страницу обзора платформы.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, paddingTop: 4 }}>
          <Link
            href="/subjects"
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              background: "var(--accent, #3856f5)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14
            }}
          >
            Каталог предметов (12)
          </Link>
          <Link
            href="/welcome"
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid var(--border, #dcd8ce)",
              background: "var(--surface, #fff)",
              color: "inherit",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14
            }}
          >
            Обзор BilimAI
          </Link>
          <Link
            href="/"
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid var(--border, #dcd8ce)",
              background: "var(--surface, #fff)",
              color: "inherit",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14
            }}
          >
            К урокам →
          </Link>
        </div>
      </div>
    </main>
  );
}
