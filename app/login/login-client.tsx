"use client";
import { useEffect, useState } from "react";
import { ArrowRight, GraduationCap, UserCheck } from "lucide-react";
import { ThemeToggleButton, useAniqTheme } from "@/components/hero-canvas";
import { PixelBrandMark } from "@/components/pixel-mosaic";
import type { Language } from "@/lib/curriculum";
import {
  createDemoProfile,
  loadUserProfile,
  resolveReturnHref,
  saveUserProfile,
  type UserProfile
} from "@/lib/user-profile";
import { useAuxiliaryPageNavigation } from "@/lib/use-study-navigation";

const loginCopy = {
  ru: {
    title: "Профиль в BilimAI",
    sub: "Локальный профиль сохраняет прогресс по темам, историю пробных вариантов ЕНТ и настройки плана в этом браузере. Регистрация необязательна.",
    tryWithoutAuth: "Продолжить без входа →",
    idLabel: "Email или ID ученика",
    idPlaceholder: "student@bilimai.dpdns.org или 1001",
    passLabel: "Пароль",
    passPlaceholder: "Минимум 6 символов",
    submitBtn: "Войти в профиль",
    demoTitle: "Быстрый демо-профиль (1 клик, без пароля)",
    demoStudent: "Ученик 11 кл. (ID 1001)",
    demoTeacher: "Учитель математики",
    noAccount: "Нет профиля?",
    registerLink: "Создать профиль",
    backHome: "← Вернуться к занятию",
    privacyNote: "Тренажёр полностью доступен без входа. Подробнее в",
    privacyLink: "политике конфиденциальности"
  },
  kk: {
    title: "BilimAI профилі",
    sub: "Жергілікті профиль тақырыптар бойынша прогресті, ҰБТ нұсқаларының тарихын және жоспар баптауларын осы браузерде сақтайды. Тіркелу міндетті емес.",
    tryWithoutAuth: "Кірусіз жалғастыру →",
    idLabel: "Email немесе оқушы ID-і",
    idPlaceholder: "student@bilimai.dpdns.org немесе 1001",
    passLabel: "Құпиясөз",
    passPlaceholder: "Кемінде 6 таңба",
    submitBtn: "Профильге кіру",
    demoTitle: "Жылдам демо-профиль (1 басу, құпиясөзсіз)",
    demoStudent: "11-сынып оқушысы (ID 1001)",
    demoTeacher: "Математика мұғалімі",
    noAccount: "Профиліңіз жоқ па?",
    registerLink: "Профиль ашу",
    backHome: "← Сабаққа оралу",
    privacyNote: "Тренажер кірусіз де толық қолжетімді. Толығырақ:",
    privacyLink: "құпиялылық саясаты"
  },
  uz: {
    title: "BilimAI profili",
    sub: "Mahalliy profil mavzular bo‘yicha progressni, sinov variantlari tarixini va reja sozlamalarini shu brauzerda saqlaydi. Ro‘yxatdan o‘tish majburiy emas.",
    tryWithoutAuth: "Kirishsiz davom etish →",
    idLabel: "Email yoki o‘quvchi ID raqami",
    idPlaceholder: "student@bilimai.dpdns.org yoki 1001",
    passLabel: "Parol",
    passPlaceholder: "Kamida 6 belgi",
    submitBtn: "Profilga kirish",
    demoTitle: "Tezkor demo-profil (1 bosish, parolsiz)",
    demoStudent: "11-sinf o‘quvchisi (ID 1001)",
    demoTeacher: "Matematika o‘qituvchisi",
    noAccount: "Profilingiz yo‘qmi?",
    registerLink: "Profil yaratish",
    backHome: "← Mashg‘ulotga qaytish",
    privacyNote: "Trenajyor ro‘yxatdan o‘tmasdan ham to‘liq ishlaydi. Batafsil:",
    privacyLink: "maxfiylik siyosati"
  }
} as const;

export function LoginClient({ initialLang = "ru" }: { initialLang?: Language }) {
  const { dark, toggleTheme } = useAniqTheme();
  const { lang, changeLanguage: handleLangChange } = useAuxiliaryPageNavigation(initialLang);
  const [identifier, setIdentifier] = useState("");
  const [returnHref, setReturnHref] = useState<string>(`/?lang=${initialLang}`);

  const c = loginCopy[lang];

  useEffect(() => {
    setReturnHref(resolveReturnHref(lang));
  }, [lang]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const existing = loadUserProfile();
    const trimmed = identifier.trim() || "1001";
    const isTeacher =
      trimmed.toLowerCase().includes("teacher") || trimmed.toLowerCase().includes("ustaz");
    const profile: UserProfile =
      existing && existing.identifier === trimmed
        ? existing
        : {
            ...createDemoProfile(isTeacher ? "teacher" : "student", lang),
            identifier: trimmed,
            name: trimmed.includes("@")
              ? trimmed.split("@")[0]
              : isTeacher
                ? "Учитель"
                : `Ученик #${trimmed}`
          };
    saveUserProfile(profile);
    window.location.href = isTeacher ? "/teacher" : resolveReturnHref(lang);
  }

  function handleDemoLogin(role: "student" | "teacher") {
    const profile = createDemoProfile(role, lang);
    saveUserProfile(profile);
    window.location.href = role === "teacher" ? "/teacher" : resolveReturnHref(lang);
  }

  const registerHref = `/register?lang=${lang}&returnTo=${encodeURIComponent(returnHref)}`;

  return (
    <main className="aniq-auth-shell">
      <div className="aniq-auth-topbar">
        <a href={returnHref} className="aniq-btn aniq-btn-ghost text-xs">
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
        <div className="aniq-auth-card" data-testid="local-profile-card">
          <div className="aniq-auth-header-row">
            <a className="aniq-brand-logo" href={returnHref}>
              <PixelBrandMark size={24} />
              <span>
                Bilim<span className="text-brand">AI</span>
              </span>
            </a>
            <a href={returnHref} className="aniq-auth-skip-link">
              {c.tryWithoutAuth}
            </a>
          </div>

          <div
            data-testid="honest-storage-badge"
            style={{
              display: "inline-block",
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              background: "rgba(56, 86, 245, 0.1)",
              color: "var(--accent, #3856f5)",
              marginBottom: 8
            }}
          >
            Локальный профиль на этом устройстве (localStorage · без пароля)
          </div>

          <h1 className="aniq-auth-title">{c.title}</h1>
          <p className="aniq-auth-sub">{c.sub}</p>

          <form onSubmit={handleSubmit} className="aniq-auth-form">
            <div className="aniq-field-group">
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
              className="aniq-btn aniq-btn-secondary w-full justify-center text-xs"
            >
              <GraduationCap size={15} />
              {c.demoStudent}
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("teacher")}
              className="aniq-btn aniq-btn-secondary w-full justify-center text-xs"
            >
              <UserCheck size={15} />
              {c.demoTeacher}
            </button>
          </div>

          <div className="aniq-auth-footer">
            <div>
              {c.noAccount}{" "}
              <a className="aniq-auth-inline-link" href={registerHref}>
                {c.registerLink}
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
