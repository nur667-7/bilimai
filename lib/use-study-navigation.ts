"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { untTopicIds, type Language, type TopicId } from "./lessons.ts";
import { UNT_SUBJECTS, type UntSubjectId } from "./unt-all-subjects.ts";
import { loadNavContext, loadUserProfile, saveNavContext } from "./user-profile.ts";
import {
  buildStudyHref,
  isValidWorkspaceTab,
  VALID_WORKSPACE_TABS,
  type WorkspaceTab
} from "./study-store.ts";

export { buildStudyHref, isValidWorkspaceTab, VALID_WORKSPACE_TABS, type WorkspaceTab };

export function scrollWorkspaceTop() {
  if (typeof window === "undefined") return;
  requestAnimationFrame(() => {
    const el =
      document.getElementById("workspace-stage-top") ??
      document.getElementById("workspace-anchor");
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < 0 || rect.top > 220) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
}

export interface UseStudyNavigationOptions {
  initialLang?: Language;
  initialTab?: WorkspaceTab;
  initialTopic?: TopicId;
  initialSubjectId?: UntSubjectId;
  initialVariantNumber?: number;
  onBeforeNavigate?: () => void;
  onMarkInteracted?: () => void;
}

export function useStudyNavigation({
  initialLang = "ru",
  initialTab = "today",
  initialTopic = "linear",
  initialSubjectId = "math",
  initialVariantNumber = 1,
  onBeforeNavigate,
  onMarkInteracted
}: UseStudyNavigationOptions) {
  const router = useRouter();
  const [lang, setLang] = useState<Language>(initialLang);
  const [tab, setTab] = useState<WorkspaceTab>(initialTab);
  const [topic, setTopic] = useState<TopicId>(initialTopic);
  const [examSubjectId, setExamSubjectId] = useState<UntSubjectId>(initialSubjectId);
  const [examVariantNumber, setExamVariantNumber] = useState<number>(initialVariantNumber);

  const isTodaySection = tab === "today" || tab === "roadmap";
  const isLearnSection =
    tab === "lesson" || tab === "practice" || tab === "ai" || tab === "xray" || tab === "graph";
  const isLessonOrPracticeOrAi = tab === "lesson" || tab === "practice" || tab === "ai";
  const isExamSection = tab === "exam";
  const isProfileSection = tab === "profile";

  const commitNavigation = useCallback(
    (
      nextLang: Language,
      nextTab: WorkspaceTab,
      nextTopic: TopicId,
      nextSubject: UntSubjectId,
      mode: "push" | "replace"
    ) => {
      const href = buildStudyHref({
        lang: nextLang,
        tab: nextTab,
        topic: nextTopic,
        subject: nextSubject
      });

      saveNavContext({
        tab: nextTab,
        topic: nextTopic,
        subject: nextSubject,
        lang: nextLang
      });

      try {
        if (typeof window !== "undefined") {
          const statePayload = {
            lang: nextLang,
            tab: nextTab,
            topic: nextTopic,
            subject: nextSubject
          };
          const currentRelative = `${window.location.pathname}${window.location.search}`;
          if (currentRelative !== href) {
            if (mode === "push") {
              window.history.pushState(statePayload, "", href);
            } else {
              window.history.replaceState(statePayload, "", href);
            }
          }
        }
      } catch {}
    },
    []
  );

  // Sync <html lang="...">
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  // Initial URL & saved navigation context hydration
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const hasUrlLang = params.has("lang");
    const hasUrlTopic = params.has("topic");
    const hasUrlSubject = params.has("subject");

    try {
      const storedProfile = loadUserProfile();
      if (storedProfile && storedProfile.name && !hasUrlLang) {
        setLang(storedProfile.preferredLanguage);
      }
    } catch {}

    try {
      const savedNav = loadNavContext();
      if (savedNav) {
        onMarkInteracted?.();
        if (!hasUrlTopic && (untTopicIds as readonly string[]).includes(savedNav.topic)) {
          setTopic(savedNav.topic as TopicId);
        }
        if (!hasUrlSubject && UNT_SUBJECTS.some((s) => s.id === savedNav.subject)) {
          setExamSubjectId(savedNav.subject as UntSubjectId);
        }
      }
    } catch {}

    try {
      const qLang = params.get("lang");
      if (qLang === "ru" || qLang === "kk" || qLang === "uz") {
        setLang(qLang);
      }
      const qSubject = params.get("subject");
      if (qSubject && UNT_SUBJECTS.some((s) => s.id === qSubject)) {
        setExamSubjectId(qSubject as UntSubjectId);
      }
      const qVariant = Number(params.get("variant"));
      if (Number.isInteger(qVariant) && qVariant >= 1 && qVariant <= 10) {
        setExamVariantNumber(qVariant);
      }
      const qTopic = params.get("topic");
      if (qTopic && (untTopicIds as readonly string[]).includes(qTopic)) {
        setTopic(qTopic as TopicId);
      }
      const qTab = params.get("tab");
      if (isValidWorkspaceTab(qTab)) {
        setTab(qTab);
      } else if (hasUrlTopic) {
        setTab("lesson");
      }
    } catch {}
  }, [onMarkInteracted]);

  // Listen to browser Back / Forward buttons (popstate)
  useEffect(() => {
    if (typeof window === "undefined") return;
    function onPopState() {
      const params = new URLSearchParams(window.location.search);

      const qLang = params.get("lang");
      if (qLang === "ru" || qLang === "kk" || qLang === "uz") {
        setLang(qLang);
      }

      const qSubject = params.get("subject");
      if (qSubject && UNT_SUBJECTS.some((s) => s.id === qSubject)) {
        setExamSubjectId(qSubject as UntSubjectId);
      } else {
        setExamSubjectId("math");
      }

      const qTopic = params.get("topic");
      if (qTopic && (untTopicIds as readonly string[]).includes(qTopic)) {
        setTopic(qTopic as TopicId);
      } else {
        setTopic("linear");
      }

      const qTab = params.get("tab");
      if (isValidWorkspaceTab(qTab)) {
        setTab(qTab);
      } else if (qTopic && (untTopicIds as readonly string[]).includes(qTopic)) {
        setTab("lesson");
      } else {
        setTab("today");
      }
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const handleTabChange = useCallback(
    (nextTabRaw: string) => {
      const nextTab: WorkspaceTab = isValidWorkspaceTab(nextTabRaw) ? nextTabRaw : "today";
      onMarkInteracted?.();
      setTab(nextTab);
      commitNavigation(lang, nextTab, topic, examSubjectId, "push");
      scrollWorkspaceTop();
    },
    [lang, topic, examSubjectId, commitNavigation, onMarkInteracted]
  );

  const selectTopic = useCallback(
    (id: TopicId) => {
      onBeforeNavigate?.();
      onMarkInteracted?.();
      setTopic(id);
      const nextTab: WorkspaceTab = isLessonOrPracticeOrAi ? tab : "lesson";
      if (!isLessonOrPracticeOrAi) setTab("lesson");
      commitNavigation(lang, nextTab, id, examSubjectId, "push");
      scrollWorkspaceTop();
    },
    [lang, tab, examSubjectId, isLessonOrPracticeOrAi, commitNavigation, onBeforeNavigate, onMarkInteracted]
  );

  const openTopicLesson = useCallback(
    (id: TopicId) => {
      onBeforeNavigate?.();
      onMarkInteracted?.();
      setTopic(id);
      setTab("lesson");
      commitNavigation(lang, "lesson", id, examSubjectId, "push");
      scrollWorkspaceTop();
    },
    [lang, examSubjectId, commitNavigation, onBeforeNavigate, onMarkInteracted]
  );

  const handleSubjectChange = useCallback(
    (nextSubject: UntSubjectId) => {
      onMarkInteracted?.();
      setExamSubjectId(nextSubject);
      commitNavigation(lang, tab, topic, nextSubject, "replace");
    },
    [lang, tab, topic, commitNavigation, onMarkInteracted]
  );

  const selectLanguage = useCallback(
    (nextLang: Language) => {
      onBeforeNavigate?.();
      setLang(nextLang);
      commitNavigation(nextLang, tab, topic, examSubjectId, "replace");
    },
    [tab, topic, examSubjectId, commitNavigation, onBeforeNavigate]
  );

  const returnToPath = useMemo(
    () =>
      buildStudyHref({
        lang,
        tab,
        topic,
        subject: examSubjectId
      }),
    [lang, tab, topic, examSubjectId]
  );

  return {
    lang,
    tab,
    topic,
    examSubjectId,
    examVariantNumber,
    isTodaySection,
    isLearnSection,
    isLessonOrPracticeOrAi,
    isExamSection,
    isProfileSection,
    returnToPath,
    setTopic,
    handleTabChange,
    selectTopic,
    openTopicLesson,
    handleSubjectChange,
    selectLanguage
  };
}

/**
 * Lightweight hook for auxiliary pages (/lab, /login, /register, /welcome)
 * to sync language & query params via Next.js router instead of raw history.replaceState.
 */
export function useAuxiliaryPageNavigation(initialLang: Language = "ru") {
  const router = useRouter();
  const pathname = usePathname();
  const [lang, setLang] = useState<Language>(initialLang);

  const updateQueryParams = useCallback(
    (updates: Record<string, string | null>, mode: "push" | "replace" = "replace") => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      for (const [k, v] of Object.entries(updates)) {
        if (v === null || v === "") {
          params.delete(k);
        } else {
          params.set(k, v);
        }
      }
      const qs = params.toString();
      const href = qs ? `${pathname}?${qs}` : pathname;
      try {
        const currentRelative = `${window.location.pathname}${window.location.search}`;
        if (currentRelative !== href) {
          if (mode === "push") {
            window.history.pushState(updates, "", href);
          } else {
            window.history.replaceState(updates, "", href);
          }
        }
      } catch {}
    },
    [pathname]
  );

  const changeLanguage = useCallback(
    (nextLang: Language) => {
      setLang(nextLang);
      if (typeof document !== "undefined") {
        document.documentElement.lang = nextLang;
      }
      updateQueryParams({ lang: nextLang }, "replace");
    },
    [updateQueryParams]
  );

  const navigateToRoute = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router]
  );

  return {
    lang,
    setLang,
    changeLanguage,
    updateQueryParams,
    navigateToRoute
  };
}
