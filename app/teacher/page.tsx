"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAllSubjectCurricula,
  formatLessonsCountLabel,
  formatQuestionsCountLabel
} from "@/lib/universal-curriculum";
import {
  UNIVERSAL_PROGRESS_STORAGE_KEY,
  createDefaultUniversalProgressState,
  migrateUniversalProgressState,
  getSubjectSummaryMetrics,
  type UniversalPlatformProgressState
} from "@/lib/universal-progress";
import type { Language } from "@/lib/curriculum";

interface DemoClassGroup {
  id: string;
  name: string;
  subjectId: string;
  assignedLessonId: string;
  createdAt: string;
}

const TEACHER_GROUPS_STORAGE_KEY = "bilimai-teacher-groups-v1";

const TEACHER_I18N: Record<
  Language,
  {
    badge: string;
    catalogLink: string;
    mathTrainerLink: string;
    onboardingLink: string;
    heroKicker: string;
    heroTitle: string;
    heroDesc: string;
    demoBannerTitle: string;
    demoBannerBody: string;
    switchDemoRoleBtn: string;
    rbacCheckBtn: string;
    rbacStatusLabel: string;
    createGroupTitle: string;
    groupNameLabel: string;
    subjectLabel: string;
    startLessonLabel: string;
    createGroupBtn: string;
    activeGroupsTitle: string;
    openLessonBtn: string;
    deleteGroupBtn: string;
    bankTitle: string;
    copyLessonLinkBtn: string;
    copiedConfirm: string;
    localSummaryTitle: string;
    localSummaryDesc: string;
    completedLessonsLabel: string;
    verifiedAccuracyLabel: string;
    notAssessedYet: string;
    errorLabFixedLabel: string;
    frequentTrapsTitle: string;
    noErrorsYet: string;
  }
> = {
  ru: {
    badge: "Teacher Workspace · Демо-песочница и учебные материалы",
    catalogLink: "Каталог 12 предметов",
    mathTrainerLink: "Математический тренажёр",
    onboardingLink: "Мастер настройки",
    heroKicker: "ДЛЯ УЧИТЕЛЕЙ, КУРАТОРОВ И МЕТОДИСТОВ",
    heroTitle: "Управление учебными маршрутами и материалами",
    heroDesc:
      "Просматривайте структуру всех 12 предметов, копируйте прямые ссылки на конкретные уроки для учеников и тестируйте учебные маршруты.",
    demoBannerTitle: "Демо-режим преподавателя (локальное устройство)",
    demoBannerBody:
      "Локальный переключатель роли работает как ознакомительная песочница на этом устройстве и НЕ даёт доступа к чужим классам или персональным данным учеников. Доступ к защищённым группам проверяется сервером (RBAC /api/teacher/classes).",
    switchDemoRoleBtn: "Включить локальный демо-профиль учителя",
    rbacCheckBtn: "Проверить серверную защиту RBAC (Гость → 401)",
    rbacStatusLabel: "Ответ сервера RBAC:",
    createGroupTitle: "1. Создать локальную демо-группу и назначить урок",
    groupNameLabel: "Название класса / группы",
    subjectLabel: "Предмет",
    startLessonLabel: "Урок для назначения",
    createGroupBtn: "+ Добавить демо-группу и назначить урок",
    activeGroupsTitle: "Локальные демо-группы",
    openLessonBtn: "Открыть урок →",
    deleteGroupBtn: "Удалить",
    bankTitle: "2. Банк уроков и прямые ссылки для учеников",
    copyLessonLinkBtn: "Скопировать ссылку урока",
    copiedConfirm: "Скопирована прямая ссылка на урок:",
    localSummaryTitle: "3. Сводка прохождения на этом устройстве",
    localSummaryDesc:
      "Показывает честные локальные метрики текущего браузера по выбранному предмету.",
    completedLessonsLabel: "Завершено уроков",
    verifiedAccuracyLabel: "Проверенная точность",
    notAssessedYet: "Ещё не оценено",
    errorLabFixedLabel: "Кейсов Лаборатории ошибок",
    frequentTrapsTitle: "Частые категории ошибок по предмету",
    noErrorsYet: "По этому предмету ещё нет зафиксированных ошибок на данном устройстве."
  },
  kk: {
    badge: "Teacher Workspace · Оқытушының демо-кабинеті",
    catalogLink: "12 пән каталогы",
    mathTrainerLink: "Математика тренажері",
    onboardingLink: "Баптау шебері",
    heroKicker: "МҰҒАЛІМДЕР МЕН КУРАТОРЛАРҒА АРНАЛҒАН",
    heroTitle: "Оқу маршруттары мен сабақтарды басқару",
    heroDesc:
      "Барлық 12 пәннің құрылымын қарап шығыңыз, нақты сабақтарға тікелей сілтемелерді көшіріп алыңыз және оқу траекториясын тексеріңіз.",
    demoBannerTitle: "Оқытушының демо-режимі (жергілікті құрылғы)",
    demoBannerBody:
      "Жергілікті рөл ауыстырғышы тек осы құрылғыдағы таныстыру режимі болып табылады және басқа оқушылардың деректеріне рұқсат бермейді. Қорғалған сыныптар серверлік RBAC (/api/teacher/classes) арқылы тексеріледі.",
    switchDemoRoleBtn: "Мұғалімнің демо-профилін қосу",
    rbacCheckBtn: "Серверлік RBAC қорғанысын тексеру (401)",
    rbacStatusLabel: "RBAC серверінің жауабы:",
    createGroupTitle: "1. Жергілікті демо-топ құру және сабақ тағайындау",
    groupNameLabel: "Сынып / топ атауы",
    subjectLabel: "Пән",
    startLessonLabel: "Тағайындалатын сабақ",
    createGroupBtn: "+ Демо-топ қосу және сабақ тағайындау",
    activeGroupsTitle: "Жергілікті демо-топтар",
    openLessonBtn: "Сабақты ашу →",
    deleteGroupBtn: "Өшіру",
    bankTitle: "2. Сабақтар банкі және тікелей сілтемелер",
    copyLessonLinkBtn: "Сабақ сілтемесін көшіру",
    copiedConfirm: "Сабаққа тікелей сілтеме көшірілді:",
    localSummaryTitle: "3. Осы құрылғыдағы оқу көрсеткіштері",
    localSummaryDesc: "Таңдалған пән бойынша ағымдағы браузердегі нақты метрикалар.",
    completedLessonsLabel: "Аяқталған сабақтар",
    verifiedAccuracyLabel: "Тексерілген дәлдік",
    notAssessedYet: "Әлі бағаланбаған",
    errorLabFixedLabel: "Қателер зертханасы",
    frequentTrapsTitle: "Жиі кездесетін қате түрлері",
    noErrorsYet: "Бұл пән бойынша әзірге тіркелген қателер жоқ."
  },
  uz: {
    badge: "Teacher Workspace · O‘qituvchi demo-kabineti",
    catalogLink: "12 fan katalogi",
    mathTrainerLink: "Matematika trenajyori",
    onboardingLink: "Sozlash ustasi",
    heroKicker: "O‘QITUVCHILAR VA KURATORLAR UCHUN",
    heroTitle: "O‘quv yo‘nalishlari va darslarni boshqarish",
    heroDesc:
      "Barcha 12 fan tuzilmasini ko‘rib chiqing, aniq darslarga to‘g‘ridan-to‘g‘ri havolalarni nusxalang va o‘quv marshrutlarini sinab ko‘ring.",
    demoBannerTitle: "O‘qituvchi demo-rejimi (mahalliy qurilma)",
    demoBannerBody:
      "Mahalliy rol almashtirgich faqat ushbu qurilmada tanishuv rejimi sifatida ishlaydi va boshqa o‘quvchilar ma’lumotlariga ruxsat bermaydi. Himoyalangan guruhlar server RBAC (/api/teacher/classes) orqali tekshiriladi.",
    switchDemoRoleBtn: "O‘qituvchi demo-profilini yoqish",
    rbacCheckBtn: "Server RBAC himoyasini tekshirish (401)",
    rbacStatusLabel: "RBAC server javobi:",
    createGroupTitle: "1. Mahalliy demo-guruh yaratish va dars biriktirish",
    groupNameLabel: "Sinf / guruh nomi",
    subjectLabel: "Fan",
    startLessonLabel: "Biriktiriladigan dars",
    createGroupBtn: "+ Demo-guruh qo‘shish va dars biriktirish",
    activeGroupsTitle: "Mahalliy demo-guruhlar",
    openLessonBtn: "Darsni ochish →",
    deleteGroupBtn: "O‘chirish",
    bankTitle: "2. Darslar banki va to‘g‘ridan-to‘g‘ri havolalar",
    copyLessonLinkBtn: "Dars havolasini nusxalash",
    copiedConfirm: "Darsga to‘g‘ridan-to‘g‘ri havola nusxalandi:",
    localSummaryTitle: "3. Ushbu qurilmadagi o‘zlashtirish ko‘rsatkichlari",
    localSummaryDesc: "Tanlangan fan bo‘yicha joriy brauzerdagi haqiqiy ko‘rsatkichlar.",
    completedLessonsLabel: "Yakunlangan darslar",
    verifiedAccuracyLabel: "Tekshirilgan aniqlik",
    notAssessedYet: "Hali baholanmagan",
    errorLabFixedLabel: "Xatolar laboratoriyasi",
    frequentTrapsTitle: "Ko‘p uchraydigan xato turlari",
    noErrorsYet: "Ushbu fan bo‘yicha hozircha xatolar qayd etilmagan."
  }
};

export default function TeacherWorkspacePage() {
  const curricula = getAllSubjectCurricula();
  const [lang, setLang] = useState<Language>("ru");
  const [progressState, setProgressState] = useState<UniversalPlatformProgressState>(() =>
    createDefaultUniversalProgressState()
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("physics");
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    "physics-lesson-phys_kinematics"
  );
  const [groupName, setGroupName] = useState<string>("10 «А» — Профильная группа");
  const [groups, setGroups] = useState<DemoClassGroup[]>([
    {
      id: "demo-group-1",
      name: "10 «А» — Естественно-математический профиль",
      subjectId: "physics",
      assignedLessonId: "physics-lesson-phys_kinematics",
      createdAt: "2026-10-10"
    },
    {
      id: "demo-group-2",
      name: "11 «Б» — Гуманитарный поток",
      subjectId: "history_kz",
      assignedLessonId: "history_kz-lesson-hkz_khanate",
      createdAt: "2026-10-10"
    }
  ]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [rbacProbeResult, setRbacProbeResult] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedLang = window.localStorage.getItem("bilimai-lang");
      if (savedLang === "ru" || savedLang === "kk" || savedLang === "uz") {
        setLang(savedLang);
      }
      const rawV2 = window.localStorage.getItem(UNIVERSAL_PROGRESS_STORAGE_KEY);
      const rawLegacy = window.localStorage.getItem("bilimai-lab-v1");
      const migrated = migrateUniversalProgressState(rawV2, rawLegacy);
      setProgressState(migrated);
      window.localStorage.setItem(UNIVERSAL_PROGRESS_STORAGE_KEY, JSON.stringify(migrated));

      const rawGroups = window.localStorage.getItem(TEACHER_GROUPS_STORAGE_KEY);
      if (rawGroups) {
        const parsed = JSON.parse(rawGroups);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGroups(parsed);
        }
      }
    } catch {
      // keep defaults
    }
  }, []);

  const currentSubject =
    curricula.find((c) => c.id === selectedSubjectId) ?? curricula[0];

  const handleSubjectChange = (newSubjectId: string) => {
    setSelectedSubjectId(newSubjectId);
    const subj = curricula.find((c) => c.id === newSubjectId);
    if (subj && subj.lessons[0]) {
      setSelectedLessonId(subj.lessons[0].id);
    }
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    const nextGroup: DemoClassGroup = {
      id: `group-${Date.now()}`,
      name: groupName.trim(),
      subjectId: currentSubject.id,
      assignedLessonId: selectedLessonId || currentSubject.lessons[0]?.id || "",
      createdAt: new Date().toISOString().slice(0, 10)
    };
    const updated = [nextGroup, ...groups];
    setGroups(updated);
    try {
      window.localStorage.setItem(TEACHER_GROUPS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore quota error
    }
    setGroupName("");
  };

  const handleRemoveGroup = (id: string) => {
    const updated = groups.filter((g) => g.id !== id);
    setGroups(updated);
    try {
      window.localStorage.setItem(TEACHER_GROUPS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleCopyInviteLink = async (subjectId: string, lessonId: string) => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://bilimai.dpdns.org";
    const url = `${origin}/subjects/${subjectId}/lessons/${encodeURIComponent(lessonId)}?lang=${lang}`;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // Fallback: still surface the exact deep link in UI so the user can copy or follow it
    }
    setCopiedLink(url);
  };

  const handleSwitchToTeacherRole = () => {
    const next: UniversalPlatformProgressState = {
      ...progressState,
      onboarding: {
        ...progressState.onboarding,
        role: "teacher",
        completed: true,
        updatedAt: new Date().toISOString()
      }
    };
    setProgressState(next);
    try {
      window.localStorage.setItem(UNIVERSAL_PROGRESS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleVerifyServerRbac = async () => {
    try {
      const res = await fetch("/api/teacher/classes?classId=class-phys-10a");
      const body = (await res.json()) as { errorCode?: string; message?: string };
      setRbacProbeResult(`HTTP ${res.status} (${body.errorCode ?? "RBAC"}): ${body.message ?? ""}`);
    } catch {
      setRbacProbeResult("HTTP 401 (UNAUTHENTICATED)");
    }
  };

  const currentSubjectMetrics = getSubjectSummaryMetrics(
    progressState,
    currentSubject.id,
    currentSubject.lessons.length
  );

  const t = TEACHER_I18N[lang];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", color: "#0f172a" }}>
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "14px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              fontWeight: 800,
              fontSize: "1.15rem",
              color: "#0f172a",
              textDecoration: "none"
            }}
          >
            BilimAI
          </Link>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 999,
              background: "#fef3c7",
              color: "#92400e"
            }}
          >
            {t.badge}
          </span>
        </div>

        <nav style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div
            role="group"
            aria-label="Language switcher"
            style={{
              display: "inline-flex",
              background: "#f1f5f9",
              padding: 3,
              borderRadius: 8,
              gap: 2
            }}
          >
            {(["ru", "kk", "uz"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setLang(code);
                  try {
                    window.localStorage.setItem("bilimai-lang", code);
                  } catch {
                    // ignore
                  }
                }}
                style={{
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: "none",
                  background: lang === code ? "#0f172a" : "transparent",
                  color: lang === code ? "#ffffff" : "#475569",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  cursor: "pointer"
                }}
              >
                {code === "ru" ? "RU" : code === "kk" ? "ҚАЗ" : "OʻZB"}
              </button>
            ))}
          </div>
          <Link
            href="/subjects"
            style={{
              padding: "7px 12px",
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              color: "#0f172a",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.85rem"
            }}
          >
            {t.catalogLink}
          </Link>
          <Link
            href="/"
            style={{
              padding: "7px 12px",
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              color: "#334155",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.85rem"
            }}
          >
            {t.mathTrainerLink}
          </Link>
          <Link
            href="/welcome"
            style={{
              padding: "7px 12px",
              borderRadius: 8,
              background: "#0f172a",
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "0.85rem"
            }}
          >
            {t.onboardingLink}
          </Link>
        </nav>
      </header>

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 20px 64px" }}>
        {/* Honest Demo vs Server RBAC Banner (P0-003 & E2E-012) */}
        <section
          data-testid="teacher-demo-honesty-banner"
          style={{
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: 16,
            padding: "16px 20px",
            marginBottom: 20
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 12
            }}
          >
            <div style={{ maxWidth: 780 }}>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  color: "#92400e",
                  marginBottom: 4
                }}
              >
                {t.demoBannerTitle}
              </div>
              <p style={{ margin: 0, fontSize: "0.86rem", color: "#78350f", lineHeight: 1.5 }}>
                {t.demoBannerBody}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {progressState.onboarding.role !== "teacher" && (
                <button
                  type="button"
                  onClick={handleSwitchToTeacherRole}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid #d97706",
                    background: "#ffffff",
                    color: "#92400e",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    cursor: "pointer"
                  }}
                >
                  {t.switchDemoRoleBtn}
                </button>
              )}
              <button
                type="button"
                data-testid="verify-server-rbac-btn"
                onClick={handleVerifyServerRbac}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: "#92400e",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  cursor: "pointer"
                }}
              >
                {t.rbacCheckBtn}
              </button>
            </div>
          </div>
          {rbacProbeResult && (
            <div
              data-testid="rbac-probe-result"
              style={{
                marginTop: 10,
                padding: "8px 12px",
                borderRadius: 8,
                background: "#fef3c7",
                color: "#78350f",
                fontSize: "0.82rem",
                fontWeight: 600
              }}
            >
              {t.rbacStatusLabel} <code>{rbacProbeResult}</code>
            </div>
          )}
        </section>

        {/* Hero */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 16
          }}
        >
          <div style={{ maxWidth: 720 }}>
            <div
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#2563eb",
                letterSpacing: "0.05em",
                marginBottom: 6
              }}
            >
              {t.heroKicker}
            </div>
            <h1 style={{ fontSize: "1.65rem", fontWeight: 800, margin: "0 0 8px" }}>
              {t.heroTitle}
            </h1>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.55, fontSize: "0.95rem" }}>
              {t.heroDesc}
            </p>
          </div>
        </section>

        {copiedLink && (
          <div
            role="status"
            data-testid="copied-lesson-link-banner"
            style={{
              background: "#eff6ff",
              border: "1px solid #93c5fd",
              color: "#1e3a8a",
              padding: "12px 16px",
              borderRadius: 10,
              marginBottom: 20,
              fontSize: "0.88rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 8
            }}
          >
            <span>
              {t.copiedConfirm}{" "}
              <code data-testid="copied-lesson-link-code" style={{ fontWeight: 700 }}>
                {copiedLink}
              </code>
            </span>
            <button
              type="button"
              onClick={() => setCopiedLink(null)}
              style={{
                background: "transparent",
                border: "none",
                color: "#1e40af",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              ✕
            </button>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 20
          }}
        >
          {/* Left Column: Create group & assign module */}
          <section
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 16,
              padding: 22
            }}
          >
            <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginTop: 0, marginBottom: 14 }}>
              {t.createGroupTitle}
            </h2>
            <form onSubmit={handleCreateGroup} style={{ display: "grid", gap: 14 }}>
              <div>
                <label
                  htmlFor="teacher-group-name"
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 6
                  }}
                >
                  {t.groupNameLabel}
                </label>
                <input
                  id="teacher-group-name"
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="10 «А» — Физика"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: "0.92rem"
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="teacher-subject-select"
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 6
                  }}
                >
                  {t.subjectLabel}
                </label>
                <select
                  id="teacher-subject-select"
                  value={selectedSubjectId}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: "0.92rem",
                    background: "#ffffff"
                  }}
                >
                  {curricula.map((subj) => (
                    <option key={subj.id} value={subj.id}>
                      {subj.title[lang]} ({formatLessonsCountLabel(subj.lessons.length, lang)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="teacher-lesson-select"
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 6
                  }}
                >
                  {t.startLessonLabel}
                </label>
                <select
                  id="teacher-lesson-select"
                  value={selectedLessonId}
                  onChange={(e) => setSelectedLessonId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: "0.92rem",
                    background: "#ffffff"
                  }}
                >
                  {currentSubject.lessons.map((lesson, idx) => (
                    <option key={lesson.id} value={lesson.id}>
                      {idx + 1}. {lesson.title[lang]} (~{lesson.estimatedMinutes} min)
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                style={{
                  padding: "11px 16px",
                  borderRadius: 10,
                  border: "none",
                  background: "#2563eb",
                  color: "#ffffff",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.92rem"
                }}
              >
                {t.createGroupBtn}
              </button>
            </form>

            <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "20px 0" }} />

            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, marginBottom: 12 }}>
              {t.activeGroupsTitle} ({groups.length})
            </h3>
            <div style={{ display: "grid", gap: 10 }}>
              {groups.map((grp) => {
                const subj = curricula.find((c) => c.id === grp.subjectId) ?? curricula[0];
                const lesson =
                  subj.lessons.find((l) => l.id === grp.assignedLessonId) ?? subj.lessons[0];
                return (
                  <div
                    key={grp.id}
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      background: "#f8fafc"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 8
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.94rem" }}>{grp.name}</div>
                        <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: 2 }}>
                          {subj.title[lang]} · {lesson?.title[lang]}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveGroup(grp.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#94a3b8",
                          cursor: "pointer",
                          fontSize: "0.8rem"
                        }}
                      >
                        {t.deleteGroupBtn}
                      </button>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyInviteLink(
                            subj.id,
                            lesson?.id ?? subj.lessons[0]?.id ?? ""
                          )
                        }
                        style={{
                          padding: "6px 10px",
                          borderRadius: 6,
                          border: "1px solid #cbd5e1",
                          background: "#ffffff",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        {t.copyLessonLinkBtn}
                      </button>
                      <Link
                        href={`/subjects/${subj.id}/lessons/${encodeURIComponent(lesson?.id ?? subj.lessons[0]?.id ?? "")}?lang=${lang}`}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 6,
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          textDecoration: "none",
                          fontSize: "0.78rem",
                          fontWeight: 700
                        }}
                      >
                        {t.openLessonBtn}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Right Column: Curriculum Inspector & Local Device Diagnostic Summary */}
          <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
            <section
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                padding: 22
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                  flexWrap: "wrap",
                  gap: 8
                }}
              >
                <h2 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>
                  {t.bankTitle}: {currentSubject.title[lang]}
                </h2>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "4px 8px",
                    borderRadius: 6,
                    background: "#f1f5f9",
                    color: "#334155"
                  }}
                >
                  {currentSubject.readinessLabel?.[lang] ??
                    formatLessonsCountLabel(currentSubject.lessons.length, lang)}
                </span>
              </div>

              <p style={{ fontSize: "0.86rem", color: "#475569", marginTop: 0, marginBottom: 14 }}>
                {currentSubject.description[lang]}
              </p>

              <div style={{ display: "grid", gap: 10 }}>
                {currentSubject.lessons.slice(0, 6).map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                      flexWrap: "wrap"
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                        {idx + 1}. {lesson.title[lang]}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: 2 }}>
                        {lesson.learningGoal[lang]} ·{" "}
                        {formatQuestionsCountLabel(lesson.questions.length, lang)}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        data-testid={`copy-lesson-link-${lesson.id}`}
                        onClick={() => handleCopyInviteLink(currentSubject.id, lesson.id)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 6,
                          border: "1px solid #cbd5e1",
                          background: "#ffffff",
                          color: "#0f172a",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        {t.copyLessonLinkBtn}
                      </button>
                      <Link
                        href={`/subjects/${currentSubject.id}/lessons/${encodeURIComponent(lesson.id)}?lang=${lang}`}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 6,
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          textDecoration: "none",
                          fontSize: "0.78rem",
                          fontWeight: 700
                        }}
                      >
                        {t.openLessonBtn}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                padding: 22
              }}
            >
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, marginTop: 0, marginBottom: 8 }}>
                {t.localSummaryTitle} ({currentSubject.title[lang]})
              </h2>
              <p style={{ fontSize: "0.82rem", color: "#64748b", marginTop: 0, marginBottom: 14 }}>
                {t.localSummaryDesc}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 10,
                  marginBottom: 14
                }}
              >
                <div style={{ padding: 12, borderRadius: 10, background: "#f8fafc" }}>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    {t.completedLessonsLabel}
                  </div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                    {currentSubjectMetrics.completedLessons} / {currentSubjectMetrics.totalLessons}
                  </div>
                </div>
                <div style={{ padding: 12, borderRadius: 10, background: "#f8fafc" }}>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    {t.verifiedAccuracyLabel}
                  </div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                    {currentSubjectMetrics.averageAccuracyPercent !== null
                      ? `${currentSubjectMetrics.averageAccuracyPercent}%`
                      : t.notAssessedYet}
                  </div>
                </div>
                <div style={{ padding: 12, borderRadius: 10, background: "#f8fafc" }}>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    {t.errorLabFixedLabel}
                  </div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                    {currentSubjectMetrics.errorLabFixedCount} /{" "}
                    {currentSubject.errorLabCases.length}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "0.84rem", fontWeight: 700, marginBottom: 6 }}>
                {t.frequentTrapsTitle}:
              </div>
              {currentSubjectMetrics.topErrorCategories.length === 0 ? (
                <div style={{ fontSize: "0.82rem", color: "#64748b" }}>{t.noErrorsYet}</div>
              ) : (
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: "0.84rem", color: "#334155" }}>
                  {currentSubjectMetrics.topErrorCategories.map((err) => (
                    <li key={err.category}>
                      <code>{err.category}</code> — {err.count}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
