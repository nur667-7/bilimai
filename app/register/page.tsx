"use client";
import { useState } from "react";
import { ArrowRight, GraduationCap, Sparkles, UserCheck } from "lucide-react";
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
    badge: "Открытая регистрация без ограничений · Госстандарт РК",
    title: "Создать аккаунт в BilimAI",
    sub: "Настройте свой паспорт абитуриента ЕНТ или кабинет учителя за 20 секунд — и сразу получите прогноз гранта РК и карту 16 разделов.",
    roleLabel: "Выберите вашу роль",
    roleStudent: "Ученик / Абитуриент ЕНТ",
    roleTeacher: "Учитель математики",
    nameLabel: "Имя и фамилия (или псевдоним)",
    namePlaceholder: "Алихан Нурланов",
    idLabel: "Email или школьный ID",
    idPlaceholder: "student@bilimai.dpdns.org или 1001",
    gradeLabel: "Класс обучения",
    uniLabel: "Целевой ВУЗ Казахстана (для Радара гранта)",
    targetScoreLabel: "Целевой балл по профильной математике (из 50)",
    passLabel: "Придумайте пароль (мин. 6 символов)",
    passPlaceholder: "••••••••",
    submitBtn: "Создать аккаунт и начать",
    hasAccount: "Уже есть аккаунт?",
    loginLink: "Войти",
    backHome: "← На главную"
  },
  kk: {
    badge: "Ашық тіркелу · ҚР МЖМБС стандарты",
    title: "BilimAI аккаунтын ашу",
    sub: "20 секунд ішінде ҰБТ талапкері паспортын немесе мұғалім кабинетін баптап, ҚР грант радары мен 16 бөлім картасын алыңыз.",
    roleLabel: "Рөліңізді таңдаңыз",
    roleStudent: "Оқушы / ҰБТ талапкері",
    roleTeacher: "Математика мұғалімі",
    nameLabel: "Аты-жөні (немесе лақап ат)",
    namePlaceholder: "Әлихан Нұрланов",
    idLabel: "Email немесе мектеп ID-і",
    idPlaceholder: "student@bilimai.dpdns.org немесе 1001",
    gradeLabel: "Оқу сыныбы",
    uniLabel: "Мақсатты ҚР ЖОО (Грант радары үшін)",
    targetScoreLabel: "Профильдік математикадан мақсатты балл (50-ден)",
    passLabel: "Құпиясөз ойлап табыңыз (кемінде 6 таңба)",
    passPlaceholder: "••••••••",
    submitBtn: "Аккаунт ашу және бастау",
    hasAccount: "Аккаунтыңыз бар ма?",
    loginLink: "Кіру",
    backHome: "← Басты бетке"
  },
  uz: {
    badge: "Ochiq ro‘yxatdan o‘tish · Davlat standarti",
    title: "BilimAI da akkaunt yaratish",
    sub: "20 soniyada abituriyent pasportini yoki o‘qituvchi kabinetini sozlang va grant radari hamda 16 bo‘lim xaritasiga ega bo‘ling.",
    roleLabel: "Rolingizni tanlang",
    roleStudent: "O‘quvchi / Abituriyent",
    roleTeacher: "Matematika o‘qituvchisi",
    nameLabel: "Ism va familiya",
    namePlaceholder: "Sardor Alimov",
    idLabel: "Email yoki o‘quvchi ID raqami",
    idPlaceholder: "student@bilimai.dpdns.org yoki 1001",
    gradeLabel: "O‘quv sinfi",
    uniLabel: "Maqsadli OTM (Grant radari uchun)",
    targetScoreLabel: "Matematikadan maqsadli ball (50 dan)",
    passLabel: "Parol o‘ylab toping (kamida 6 belgi)",
    passPlaceholder: "••••••••",
    submitBtn: "Akkaunt yaratish va boshlash",
    hasAccount: "Akkauntingiz bormi?",
    loginLink: "Kirish",
    backHome: "← Bosh sahifaga"
  }
} as const;

export default function RegisterPage() {
  const { dark, toggleTheme } = useAniqTheme();
  const [lang, setLang] = useState<Language>("ru");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [grade, setGrade] = useState<"8" | "9" | "10" | "11">("11");
  const [targetUni, setTargetUni] = useState<UniversityId>("kbtu");
  const [targetScore, setTargetScore] = useState(45);
  const [password, setPassword] = useState("");

  const c = registerCopy[lang];

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
      <div className="aurora" aria-hidden="true">
        <div
          className="blob"
          style={{ width: 420, height: 420, background: "#8ef0cf", top: "-10%", right: "-8%" }}
        />
        <div
          className="blob"
          style={{
            width: 380,
            height: 380,
            background: "#b9a8ff",
            bottom: "-12%",
            left: "-8%",
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

      <div className="aniq-auth-container max-w-lg">
        <a className="aniq-brand-logo justify-center mb-6" href={`/?lang=${lang}`}>
          <span className="aniq-logo-badge">B</span>
          <span>
            Bilim<span className="text-brand">AI</span>
          </span>
          <span className="brand-sub">ЕНТ · ҰБТ</span>
        </a>

        <div className="aniq-card aniq-glass">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 aniq-badge-pill">
            <span className="pulse-dot" />
            {c.badge}
          </div>
          <h1 className="aniq-auth-title">{c.title}</h1>
          <p className="aniq-auth-sub">{c.sub}</p>

          <form onSubmit={handleRegister} className="aniq-auth-form">
            <div>
              <span className="aniq-label">{c.roleLabel}</span>
              <div className="aniq-role-grid">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`aniq-role-card ${role === "student" ? "active" : ""}`}
                >
                  <GraduationCap size={18} />
                  <span>{c.roleStudent}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`aniq-role-card ${role === "teacher" ? "active" : ""}`}
                >
                  <UserCheck size={18} />
                  <span>{c.roleTeacher}</span>
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg-name" className="aniq-label">
                  {c.nameLabel}
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  placeholder={c.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="aniq-input"
                />
              </div>

              <div>
                <label htmlFor="reg-id" className="aniq-label">
                  {c.idLabel}
                </label>
                <input
                  id="reg-id"
                  type="text"
                  required
                  placeholder={c.idPlaceholder}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="aniq-input"
                />
              </div>
            </div>

            {role === "student" && (
              <>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
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

                  <div>
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
                      className="w-full accent-amber-600 mt-2"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-uni" className="aniq-label">
                    {c.uniLabel}
                  </label>
                  <select
                    id="reg-uni"
                    value={targetUni}
                    onChange={(e) => setTargetUni(e.target.value as UniversityId)}
                    className="aniq-input"
                  >
                    {kzUniversities.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name[lang]} (грант от {u.minMathScore}/50)
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label htmlFor="reg-pass" className="aniq-label">
                {c.passLabel}
              </label>
              <input
                id="reg-pass"
                type="password"
                required
                minLength={6}
                placeholder={c.passPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="aniq-input"
              />
            </div>

            <button type="submit" className="aniq-btn aniq-btn-primary w-full justify-center">
              <Sparkles size={16} />
              {c.submitBtn}
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="aniq-auth-footer">
            {c.hasAccount}{" "}
            <a className="text-brand font-semibold hover:underline" href={`/login?lang=${lang}`}>
              {c.loginLink}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
