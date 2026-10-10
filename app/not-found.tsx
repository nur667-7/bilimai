import { ArrowLeft, BookOpen, Compass } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main
      data-testid="not-found-page"
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        background: "var(--bg)",
        color: "var(--ink)"
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 540,
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: 16,
          padding: "clamp(24px, 5vw, 36px)",
          boxShadow: "var(--shadow-sm)"
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--mono)",
            fontSize: "0.78rem",
            fontWeight: 700,
            color: "var(--accent)",
            marginBottom: 12
          }}
        >
          <span>404</span>
          <span aria-hidden="true">·</span>
          <span>Страница не найдена / Бет табылмады</span>
        </div>

        <h1
          style={{
            margin: "0 0 10px",
            fontSize: "clamp(1.35rem, 3vw, 1.75rem)",
            fontWeight: 800,
            lineHeight: 1.2
          }}
        >
          Такого адреса на платформе нет
        </h1>

        <p
          style={{
            margin: "0 0 22px",
            fontSize: "0.94rem",
            lineHeight: 1.55,
            color: "var(--muted)"
          }}
        >
          Возможно, ссылка устарела или в адресе опечатка. Выберите предмет в каталоге или вернитесь на главную страницу обучения.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10
          }}
        >
          <a
            href="/subjects"
            data-testid="not-found-subjects-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              minHeight: 44,
              padding: "10px 16px",
              borderRadius: 10,
              background: "var(--accent)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.88rem",
              textDecoration: "none"
            }}
          >
            <BookOpen size={16} aria-hidden="true" />
            <span>Каталог предметов</span>
          </a>

          <a
            href="/welcome"
            data-testid="not-found-welcome-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              minHeight: 44,
              padding: "10px 16px",
              borderRadius: 10,
              background: "var(--bg)",
              color: "var(--ink)",
              border: "1px solid var(--line)",
              fontWeight: 600,
              fontSize: "0.88rem",
              textDecoration: "none"
            }}
          >
            <Compass size={16} aria-hidden="true" />
            <span>Обзор платформы</span>
          </a>

          <a
            href="/"
            data-testid="not-found-home-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              minHeight: 44,
              padding: "10px 16px",
              borderRadius: 10,
              background: "transparent",
              color: "var(--muted)",
              border: "1px solid var(--line)",
              fontWeight: 600,
              fontSize: "0.88rem",
              textDecoration: "none"
            }}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>К обучению</span>
          </a>
        </div>
      </section>
    </main>
  );
}
