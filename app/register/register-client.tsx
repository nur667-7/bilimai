"use client";
import { useState } from "react";
import { ArrowRight, GraduationCap, UserCheck } from "lucide-react";
import { ThemeToggleButton, useAniqTheme } from "@/components/hero-canvas";
import type { Language } from "@/lib/curriculum";
import {
  kzUniversities,
  saveUserProfile,
  type UniversityId,
  type UserProfile
} from "@/lib/user-profile";

const registerCopy = {
  ru: {
    title: "Создать профиль в BilimAI",
    sub: "Профиль сохраняет ваш прогресс по темам и пробным вариантам ЕНТ локально в браузере. Регистрация необязательна.",
    tryWithoutAuth: "Попробовать без регистрации →",
    roleLabel: "Ваша роль",
    roleStudent: "Ученик / Абитуриент ЕНТ",
    roleTeacher: "Учитель математики",
    nameLabel: "Имя или псевдоним",
    namePlaceholder: "Алихан Нурланов",
    idLabel: "Email или школьный ID",
    idPlaceholder: "student@bilimai.dpdns.org или 1001",
    passLabel: "Пароль (мин. 6 символов)",
    passPlaceholder: "Минимум 6 символов",
    optionalToggle: "Необязательно: класс и ориентир вуза (можно изменить позже в «Моём плане»)",
    gradeLabel: "Класс обучения",
    uniLabel: "Ориентир ВУЗа РК (справочник НЦТ 2024–2025)",
    targetScoreLabel: "Целевой балл по профильной математике (из 50)",
    submitBtn: "Сохранить профиль и начать",
    hasAccount: "Уже есть профиль?",
    loginLink: "Войти",
    backHome: "← К занятиям",
    privacyNote: "Данные хранятся локально в браузере (localStorage). Подробнее в",
    privacyLink: "политике конфиденциальности"
  },
  kk: {
    title: "BilimAI профилін ашу",
    sub: "Профиль тақырыптар мен ҰБТ нұсқалары бойынша прогресті браузерде сақтайды. Тіркелу міндетті емес.",
    tryWithoutAuth: "Тіркеусіз байқап көру →",
    roleLabel: "Сіздің рөліңіз",
    roleStudent: "Оқушы / ҰБТ талапкері",
    roleTeacher: "Математика мұғалімі",
    nameLabel: "Аты-жөні немесе лақап ат",
    namePlaceholder: "Әлихан Нұрланов",
    idLabel: "Email немесе мектеп ID-і",
    idPlaceholder: "student@bilimai.dpdns.org немесе 1001",
    passLabel: "Құпиясөз (кемінде 6 таңба)",
    passPlaceholder: "Кемінде 6 таңба",
    optionalToggle: "Міндетті емес: сынып және ЖОО бағдары («Менің жоспарымда» өзгертуге болады)",
    gradeLabel: "Оқу сыныбы",
    uniLabel: "ҚР ЖОО бағдары (ҰТО 2024–2025 анықтамалығы)",
    targetScoreLabel: "Профильдік математикадан мақсатты балл (50-ден)",
    submitBtn: "Профильді сақтау және бастау",
    hasAccount: "Профиліңіз бар ма?",
    loginLink: "Кіру",
    backHome: "← Сабақтарға",
    privacyNote: "Деректер браузерде (localStorage) сақталады. Толығырақ:",
    privacyLink: "құпиялылық саясаты"
  },
  uz: {
    title: "BilimAI da profil yaratish",
    sub: "Profil mavzular va sinov variantlari bo‘yicha progressni brauzerda saqlaydi. Ro‘yxatdan o‘tish majburiy emas.",
    tryWithoutAuth: "Ro‘yxatdan o‘tmasdan sinab ko‘rish →",
    roleLabel: "Rolingiz",
    roleStudent: "O‘quvchi / Abituriyent",
    roleTeacher: "Matematika o‘qituvchisi",
    nameLabel: "Ism yoki taxallus",
    namePlaceholder: "Sardor Alimov",
    idLabel: "Email yoki o‘quvchi ID raqami",
    idPlaceholder: "student@bilimai.dpdns.org yoki 1001",
    passLabel: "Parol (kamida 6 belgi)",
    passPlaceholder: "Kamida 6 belgi",
    optionalToggle: "Ixtiyoriy: sinf va OTM mo‘ljali (keyinroq «Mening rejam»da o‘zgartirish mumkin)",
    gradeLabel: "O‘quv sinfi",
    uniLabel: "OTM mo‘ljali (2024–2025 ma’lumotnomasi)",
    targetScoreLabel: "Matematikadan maqsadli ball (50 dan)",
    submitBtn: "Profilni saqlash va boshlash",
    hasAccount: "Profilingiz bormi?",
    loginLink: "Kirish",
    backHome: "← Mashg‘ulotlarga",
    privacyNote: "Ma’lumotlar brauzerda (localStorage) saqlanadi. Batafsil:",
    privacyLink: "maxfiylik siyosati"
  }
} as const;

export function RegisterClient({ initialLang = "ru" }: { initialLang?: Language }) {
  const { dark, toggleTheme } = useAniqTheme();
  const [lang, setLang] = useState<Language>(initialLang);
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [grade, setGrade] = useState<"8" | "9" | "10" | "11">("11");
  const [targetUni, setTargetUni] = useState<UniversityId>("kbtu");
  const [targetScore, setTargetScore] = useState(42);
  const [password, setPassword] = useState("");

  const c = registerCopy[lang];

  function handleLangChange(nextLang: Language) {
    setLang(nextLang);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", nextLang);
      window.history.replaceState({}, "", url.toString());
    }
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    const profile: UserProfile = {
      id: `${role}-${Date.now().toString(36)}`,
      name: name.trim() || (role === "teacher" ? "Учитель математики" : "Абитуриент ЕНТ"),
      identifier: identifier.trim() || "1001",
      role,
      grade: role === "teacher" ? "teacher" : grade,
      targetUniversity: targetUni,
      targetScore,
      preferredLanguage: lang,
      trapBlitzBestStreak: 0,
      disarmedTrapsCount: 0,
      createdAt: new Date().toISOString()
    };
    saveUserProfile(profile);
    window.location.href = `/?lang=${lang}`;
  }

  return (
    <main className="aniq-auth-shell">
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
                onClick={() => handleLangChange(l)}
              >
                {l === "ru" ? "РУС" : l === "kk" ? "ҚАЗ" : "OʻZB"}
              </button>
            ))}
          </div>
          <ThemeToggleButton dark={dark} onToggle={toggleTheme} />
        </div>
      </div>

      <div className="aniq-auth-container">
        <div className="aniq-auth-card">
          <div className="aniq-auth-header-row">
            <a className="aniq-brand-logo" href={`/?lang=${lang}`}>
              <span className="aniq-logo-badge">B</span>
              <span>
                Bilim<span className="text-brand">AI</span>
              </span>
              <span className="brand-sub">ЕНТ · ҰБТ</span>
            </a>
            <a href={`/?lang=${lang}`} className="aniq-auth-skip-link">
              {c.tryWithoutAuth}
            </a>
          </div>

          <h1 className="aniq-auth-title">{c.title}</h1>
          <p className="aniq-auth-sub">{c.sub}</p>

          <form onSubmit={handleRegister} className="aniq-auth-form">
            <div className="aniq-field-group">
              <span className="aniq-label">{c.roleLabel}</span>
              <div className="aniq-role-grid">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  aria-pressed={role === "student"}
                  className={`aniq-role-card ${role === "student" ? "active" : ""}`}
                >
                  <GraduationCap size={18} />
                  <span>{c.roleStudent}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  aria-pressed={role === "teacher"}
                  className={`aniq-role-card ${role === "teacher" ? "active" : ""}`}
                >
                  <UserCheck size={18} />
                  <span>{c.roleTeacher}</span>
                </button>
              </div>
            </div>

            <div className="aniq-field-group">
              <label htmlFor="reg-name" className="aniq-label">
                {c.nameLabel}
              </label>
              <input
                id="reg-name"
                type="text"
                required
                autoComplete="name"
                placeholder={c.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="aniq-input"
              />
            </div>

            <div className="aniq-field-group">
              <label htmlFor="reg-id" className="aniq-label">
                {c.idLabel}
              </label>
              <input
                id="reg-id"
                type="text"
                required
                autoComplete="username"
                placeholder={c.idPlaceholder}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="aniq-input"
              />
            </div>

            <div className="aniq-field-group">
              <label htmlFor="reg-pass" className="aniq-label">
                {c.passLabel}
              </label>
              <input
                id="reg-pass"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder={c.passPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="aniq-input"
              />
            </div>

            {role === "student" && (
              <details className="aniq-optional-details">
                <summary className="aniq-optional-summary">{c.optionalToggle}</summary>
                <div className="aniq-optional-body">
                  <div className="aniq-field-group">
                    <label htmlFor="reg-grade" className="aniq-label">
                      {c.gradeLabel}
                    </label>
                    <select
                      id="reg-grade"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value as "8" | "9" | "10" | "11")}
                      className="aniq-input"
                    >
                      <option value="8">8 класс</option>
                      <option value="9">9 класс</option>
                      <option value="10">10 класс</option>
                      <option value="11">11 класс (ЕНТ / ҰБТ)</option>
                    </select>
                  </div>

                  <div className="aniq-field-group">
                    <label htmlFor="reg-uni" className="aniq-label">
                      {c.uniLabel}
                    </label>
                    <select
                      id="reg-uni"
                      value={targetUni}
                      onChange={(e) => setTargetUni(e.target.value as UniversityId)}
                      className="aniq-input aniq-select-full"
                    >
                      {kzUniversities.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name[lang]} — ГОП {u.gopCode}, ориентир {u.minMathScore}/50
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="aniq-field-group">
                    <label htmlFor="reg-score" className="aniq-label">
                      {c.targetScoreLabel}: <strong>{targetScore}/50</strong>
                    </label>
                    <input
                      id="reg-score"
                      type="range"
                      min={25}
                      max={50}
                      step={1}
                      value={targetScore}
                      onChange={(e) => setTargetScore(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </details>
            )}

            <button type="submit" className="aniq-btn aniq-btn-primary w-full justify-center">
              {c.submitBtn}
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="aniq-auth-footer">
            <div>
              {c.hasAccount}{" "}
              <a className="aniq-auth-inline-link" href={`/login?lang=${lang}`}>
                {c.loginLink}
              </a>
            </div>
            <p className="text-xs text-muted mt-2">
              {c.privacyNote}{" "}
              <a className="underline" href="/privacy">
                {c.privacyLink}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
