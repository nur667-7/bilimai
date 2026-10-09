"use client";
import { useState } from "react";
import { ArrowRight, GraduationCap, Sparkles, UserCheck } from "lucide-react";
import { ThemeToggleButton, useAniqTheme } from "@/components/hero-canvas";
import type { Language } from "@/lib/curriculum";
import {
  createDemoProfile,
  loadUserProfile,
  saveUserProfile,
  type UserProfile
} from "@/lib/user-profile";

const loginCopy = {
  ru: {
    title: "Вход в платформу Aniq AI",
    sub: "Войдите по Email или ID ученика, чтобы синхронизировать Радар гранта РК, граф 16 тем и Рентген черновика",
    idLabel: "Email или ID ученика",
    idPlaceholder: "student@aniq.kz или 1001",
    passLabel: "Пароль",
    passPlaceholder: "••••••••",
    submitBtn: "Войти в кабинет",
    demoTitle: "Быстрый демо-вход за 1 клик (без пароля):",
    demoStudent: "Ученик 11 кл. (ID 1001 · Цель КБТУ)",
    demoTeacher: "Учитель математики",
    noAccount: "Нет аккаунта?",
    registerLink: "Создать аккаунт бесплатно",
    backHome: "← На главную"
  },
  kk: {
    title: "Aniq AI платформасына кіру",
    sub: "ҚР грант радарын, 16 тақырып графын және шешім рентгенін сақтау үшін Email немесе оқушы ID-ін енгізіңіз",
    idLabel: "Email немесе оқушы ID-і",
    idPlaceholder: "student@aniq.kz немесе 1001",
    passLabel: "Құпиясөз",
    passPlaceholder: "••••••••",
    submitBtn: "Кабинетке кіру",
    demoTitle: "1 басумен жылдам демо-кіру:",
    demoStudent: "11-сынып оқушысы (ID 1001 · ҚБТУ)",
    demoTeacher: "Математика мұғалімі",
    noAccount: "Аккаунтыңыз жоқ па?",
    registerLink: "Тегін тіркелу",
    backHome: "← Басты бетке"
  },
  uz: {
    title: "Aniq AI platformasiga kirish",
    sub: "Grant radari, 16 mavzu xaritasi va qoralama rentgenini saqlash uchun Email yoki o‘quvchi ID raqamini kiriting",
    idLabel: "Email yoki o‘quvchi ID raqami",
    idPlaceholder: "student@aniq.kz yoki 1001",
    passLabel: "Parol",
    passPlaceholder: "••••••••",
    submitBtn: "Kabinetga kirish",
    demoTitle: "1 босишда тезкор демо-кириш:",
    demoStudent: "11-sinf o‘quvchisi (ID 1001 · QBTU)",
    demoTeacher: "Matematika o‘qituvchisi",
    noAccount: "Akkauntingiz yo‘qmi?",
    registerLink: "Bepul ro‘yxatdan o‘tish",
    backHome: "← Bosh sahifaga"
  }
} as const;

export default function LoginPage() {
  const { dark, toggleTheme } = useAniqTheme();
  const [lang, setLang] = useState<Language>("ru");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const c = loginCopy[lang];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const existing = loadUserProfile();
    const trimmed = identifier.trim() || "1001";
    const isTeacher = trimmed.toLowerCase().includes("teacher") || trimmed.toLowerCase().includes("ustaz");
    const profile: UserProfile = existing && existing.identifier === trimmed
      ? existing
      : {
          ...createDemoProfile(isTeacher ? "teacher" : "student", lang),
          identifier: trimmed,
          name:
            trimmed.includes("@")
              ? trimmed.split("@")[0]
              : isTeacher
                ? "Учитель математики"
                : `Абитуриент #${trimmed}`
        };
    saveUserProfile(profile);
    window.location.href = `/?lang=${lang}`;
  }

  function handleDemoLogin(role: "student" | "teacher") {
    const profile = createDemoProfile(role, lang);
    saveUserProfile(profile);
    window.location.href = `/?lang=${lang}`;
  }

  return (
    <main className="aniq-auth-shell">
      <div className="aurora" aria-hidden="true">
        <div
          className="blob"
          style={{ width: 420, height: 420, background: "#7fdcff", top: "-10%", left: "-8%" }}
        />
        <div
          className="blob"
          style={{
            width: 380,
            height: 380,
            background: "#b9a8ff",
            bottom: "-12%",
            right: "-8%",
            animationDelay: "-8s"
          }}
        />
      </div>

      <div className="aniq-auth-topbar">
        <a href={`/?lang=${lang}`} className="aniq-btn aniq-btn-ghost text-xs">
          {c.backHome}
        </a>
        <div className="flex items-center gap-2">
          <div className="lang-switcher" role="group" aria-label="Язык">
            {(["ru", "kk", "uz"] as const).map((l) => (
              <button
                key={l}
                type="button"
                className={`lang-btn ${lang === l ? "active" : ""}`}
                onClick={() => setLang(l)}
              >
                {l === "ru" ? "РУС" : l === "kk" ? "ҚАЗ" : "OʻZB"}
              </button>
            ))}
          </div>
          <ThemeToggleButton dark={dark} onToggle={toggleTheme} />
        </div>
      </div>

      <div className="aniq-auth-container">
        <a className="aniq-brand-logo justify-center mb-7" href={`/?lang=${lang}`}>
          <span className="aniq-logo-badge">A</span>
          <span>
            Aniq<span className="text-brand">AI</span>
          </span>
          <span className="brand-sub">ЕНТ · ҰБТ</span>
        </a>

        <div className="aniq-card aniq-glass">
          <h1 className="aniq-auth-title">{c.title}</h1>
          <p className="aniq-auth-sub">{c.sub}</p>

          <form onSubmit={handleSubmit} className="aniq-auth-form">
            <div>
              <label htmlFor="login-identifier" className="aniq-label">
                {c.idLabel}
              </label>
              <input
                id="login-identifier"
                type="text"
                required
                autoComplete="username"
                placeholder={c.idPlaceholder}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="aniq-input"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="aniq-label">
                {c.passLabel}
              </label>
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                placeholder={c.passPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="aniq-input"
              />
            </div>

            <button type="submit" className="aniq-btn aniq-btn-primary w-full justify-center">
              {c.submitBtn}
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="aniq-demo-divider">
            <span>{c.demoTitle}</span>
          </div>

          <div className="aniq-demo-buttons">
            <button
              type="button"
              onClick={() => handleDemoLogin("student")}
              className="aniq-btn aniq-btn-ghost w-full justify-center text-xs"
            >
              <GraduationCap size={15} />
              {c.demoStudent}
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("teacher")}
              className="aniq-btn aniq-btn-ghost w-full justify-center text-xs"
            >
              <UserCheck size={15} />
              {c.demoTeacher}
            </button>
          </div>

          <div className="aniq-auth-footer">
            {c.noAccount}{" "}
            <a className="text-brand font-semibold hover:underline" href={`/register?lang=${lang}`}>
              {c.registerLink}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
