import type { VerificationState } from "./xray-trace";

export const UNIVERSAL_PROGRESS_STORAGE_KEY = "bilimai-universal-v2";

export type UserLearnerRole = "student" | "applicant" | "self_learner" | "teacher";
export type UserLearningGoal = "school" | "exam" | "from_scratch" | "practice_gaps";
export type UserInitialLevel = "beginner" | "intermediate" | "advanced" | "check_level";

export interface OnboardingProfileState {
  completed: boolean;
  role: UserLearnerRole;
  goal: UserLearningGoal;
  selectedSubjects: string[];
  level: UserInitialLevel;
  updatedAt?: string;
}

export interface TopicAccuracyStat {
  earned: number;
  max: number;
  attempts: number;
  lastVerificationState?: VerificationState;
  lastAttemptAt?: string;
}

export interface SubjectErrorCauseStat {
  category: string;
  count: number;
  lastSeenAt: string;
}

export interface SubjectLearningProgress {
  subjectId: string;
  completedLessonIds: string[];
  activeLessonId?: string;
  topicStats: Record<string, TopicAccuracyStat>;
  errorCauses: Record<string, SubjectErrorCauseStat>;
  completedErrorLabIds: string[];
  diagnosticCompleted: boolean;
  diagnosticScorePercent?: number;
  lastStudiedAt?: string;
}

export interface UniversalPlatformProgressState {
  version: 2;
  /**
   * Explicit honesty flag: without a server session this state is stored locally on the current device.
   */
  storageMode: "local_guest" | "cloud_synced";
  activeSubjectId: string;
  onboarding: OnboardingProfileState;
  subjects: Record<string, SubjectLearningProgress>;
}

export function createEmptySubjectProgress(subjectId: string): SubjectLearningProgress {
  return {
    subjectId,
    completedLessonIds: [],
    topicStats: {},
    errorCauses: {},
    completedErrorLabIds: [],
    diagnosticCompleted: false
  };
}

export function createDefaultUniversalProgressState(): UniversalPlatformProgressState {
  return {
    version: 2,
    storageMode: "local_guest",
    activeSubjectId: "math",
    onboarding: {
      completed: false,
      role: "student",
      goal: "school",
      selectedSubjects: ["math", "physics", "english"],
      level: "beginner"
    },
    subjects: {}
  };
}

/**
 * Safely migrates raw JSON or legacy v1 progress objects into UniversalPlatformProgressState v2.
 * Never throws on corrupted or partial input (CASE E).
 */
export function migrateUniversalProgressState(
  rawInput: unknown,
  legacyLabRaw?: unknown
): UniversalPlatformProgressState {
  const base = createDefaultUniversalProgressState();

  try {
    const parsed =
      typeof rawInput === "string"
        ? JSON.parse(rawInput)
        : rawInput && typeof rawInput === "object"
          ? rawInput
          : null;

    if (parsed && typeof parsed === "object") {
      const obj = parsed as Record<string, unknown>;

      if (typeof obj.activeSubjectId === "string" && obj.activeSubjectId.trim().length > 0) {
        base.activeSubjectId = obj.activeSubjectId.trim();
      }

      if (obj.onboarding && typeof obj.onboarding === "object") {
        const onb = obj.onboarding as Record<string, unknown>;
        base.onboarding = {
          completed: Boolean(onb.completed),
          role:
            onb.role === "student" || onb.role === "applicant" || onb.role === "self_learner" || onb.role === "teacher"
              ? onb.role
              : "student",
          goal:
            onb.goal === "school" || onb.goal === "exam" || onb.goal === "from_scratch" || onb.goal === "practice_gaps"
              ? onb.goal
              : "school",
          selectedSubjects: Array.isArray(onb.selectedSubjects)
            ? onb.selectedSubjects.filter((s): s is string => typeof s === "string" && s.length > 0)
            : ["math"],
          level:
            onb.level === "beginner" ||
            onb.level === "intermediate" ||
            onb.level === "advanced" ||
            onb.level === "check_level"
              ? onb.level
              : "beginner",
          updatedAt: typeof onb.updatedAt === "string" ? onb.updatedAt : undefined
        };
        if (base.onboarding.selectedSubjects.length === 0) {
          base.onboarding.selectedSubjects = ["math"];
        }
      }

      if (obj.subjects && typeof obj.subjects === "object") {
        const rawSubjects = obj.subjects as Record<string, unknown>;
        for (const [subjId, subjVal] of Object.entries(rawSubjects)) {
          if (!subjVal || typeof subjVal !== "object") continue;
          const s = subjVal as Record<string, unknown>;
          const clean = createEmptySubjectProgress(subjId);
          if (Array.isArray(s.completedLessonIds)) {
            clean.completedLessonIds = Array.from(
              new Set(s.completedLessonIds.filter((x): x is string => typeof x === "string"))
            );
          }
          if (typeof s.activeLessonId === "string") {
            clean.activeLessonId = s.activeLessonId;
          }
          if (s.topicStats && typeof s.topicStats === "object") {
            for (const [tId, tVal] of Object.entries(s.topicStats as Record<string, unknown>)) {
              if (!tVal || typeof tVal !== "object") continue;
              const tv = tVal as Record<string, unknown>;
              clean.topicStats[tId] = {
                earned: typeof tv.earned === "number" && Number.isFinite(tv.earned) ? Math.max(0, tv.earned) : 0,
                max: typeof tv.max === "number" && Number.isFinite(tv.max) ? Math.max(0, tv.max) : 0,
                attempts:
                  typeof tv.attempts === "number" && Number.isFinite(tv.attempts) ? Math.max(0, tv.attempts) : 0,
                lastAttemptAt: typeof tv.lastAttemptAt === "string" ? tv.lastAttemptAt : undefined
              };
            }
          }
          if (s.errorCauses && typeof s.errorCauses === "object") {
            for (const [cId, cVal] of Object.entries(s.errorCauses as Record<string, unknown>)) {
              if (!cVal || typeof cVal !== "object") continue;
              const cv = cVal as Record<string, unknown>;
              clean.errorCauses[cId] = {
                category: cId,
                count: typeof cv.count === "number" && Number.isFinite(cv.count) ? Math.max(0, cv.count) : 1,
                lastSeenAt: typeof cv.lastSeenAt === "string" ? cv.lastSeenAt : new Date().toISOString()
              };
            }
          }
          if (Array.isArray(s.completedErrorLabIds)) {
            clean.completedErrorLabIds = Array.from(
              new Set(s.completedErrorLabIds.filter((x): x is string => typeof x === "string"))
            );
          }
          clean.diagnosticCompleted = Boolean(s.diagnosticCompleted);
          if (typeof s.diagnosticScorePercent === "number" && Number.isFinite(s.diagnosticScorePercent)) {
            clean.diagnosticScorePercent = Math.max(0, Math.min(100, Math.round(s.diagnosticScorePercent)));
          }
          if (typeof s.lastStudiedAt === "string") {
            clean.lastStudiedAt = s.lastStudiedAt;
          }
          base.subjects[subjId] = clean;
        }
      }
    }
  } catch {
    // Corrupted JSON falls back cleanly to default v2 state
  }

  // Optional migration from legacy bilimai-lab-v1 (math progress)
  if (legacyLabRaw) {
    try {
      const legacy =
        typeof legacyLabRaw === "string"
          ? JSON.parse(legacyLabRaw)
          : legacyLabRaw && typeof legacyLabRaw === "object"
            ? legacyLabRaw
            : null;
      if (legacy && typeof legacy === "object") {
        const lObj = legacy as Record<string, unknown>;
        const mathProgress = base.subjects.math ?? createEmptySubjectProgress("math");
        if (Array.isArray(lObj.completedLessons)) {
          for (const id of lObj.completedLessons) {
            if (typeof id === "string" && !mathProgress.completedLessonIds.includes(id)) {
              mathProgress.completedLessonIds.push(id);
            }
          }
        }
        if (lObj.diagnosticDone === true) {
          mathProgress.diagnosticCompleted = true;
        }
        if (Array.isArray(lObj.records)) {
          for (const rec of lObj.records) {
            if (!rec || typeof rec !== "object") continue;
            const r = rec as Record<string, unknown>;
            const topicId = typeof r.topic === "string" ? r.topic : "general";
            const correct = r.correct === true;
            const prevTopic = mathProgress.topicStats[topicId] ?? { earned: 0, max: 0, attempts: 0 };
            mathProgress.topicStats[topicId] = {
              earned: prevTopic.earned + (correct ? 1 : 0),
              max: prevTopic.max + 1,
              attempts: prevTopic.attempts + 1,
              lastVerificationState: correct ? "verified_correct" : "incorrect"
            };
            if (!correct && typeof r.errorReason === "string" && r.errorReason.trim()) {
              const cat = r.errorReason.trim();
              const prevErr = mathProgress.errorCauses[cat];
              mathProgress.errorCauses[cat] = {
                category: cat,
                count: (prevErr?.count ?? 0) + 1,
                lastSeenAt: new Date().toISOString()
              };
            }
          }
        }
        base.subjects.math = mathProgress;
      }
    } catch {
      // Ignore malformed legacy payload
    }
  }

  return base;
}

export function getSubjectProgress(
  state: UniversalPlatformProgressState,
  subjectId: string
): SubjectLearningProgress {
  return state.subjects[subjectId] ?? createEmptySubjectProgress(subjectId);
}

/**
 * Records a completed lesson strictly within the specified subjectId (CASE C isolation).
 */
export function recordSubjectLessonCompletion(
  state: UniversalPlatformProgressState,
  subjectId: string,
  lessonId: string,
  topicId?: string
): UniversalPlatformProgressState {
  const current = getSubjectProgress(state, subjectId);
  const completedLessonIds = current.completedLessonIds.includes(lessonId)
    ? current.completedLessonIds
    : [...current.completedLessonIds, lessonId];

  const topicStats = { ...current.topicStats };
  if (topicId && !topicStats[topicId]) {
    topicStats[topicId] = {
      earned: 1,
      max: 1,
      attempts: 1,
      lastVerificationState: "verified_correct",
      lastAttemptAt: new Date().toISOString()
    };
  }

  return {
    ...state,
    subjects: {
      ...state.subjects,
      [subjectId]: {
        ...current,
        completedLessonIds,
        activeLessonId: lessonId,
        topicStats,
        lastStudiedAt: new Date().toISOString()
      }
    }
  };
}

/**
 * Records a question attempt strictly inside its subjectId without mutating any other subject.
 */
export function recordSubjectQuestionAttempt(
  state: UniversalPlatformProgressState,
  params: {
    subjectId: string;
    topicId: string;
    earnedPoints: number;
    maxPoints: number;
    verificationState: VerificationState;
    errorCategory?: string;
  }
): UniversalPlatformProgressState {
  const { subjectId, topicId, earnedPoints, maxPoints, verificationState, errorCategory } = params;
  const current = getSubjectProgress(state, subjectId);
  const prevTopic = current.topicStats[topicId] ?? { earned: 0, max: 0, attempts: 0 };

  // Only count deterministic verified_correct / incorrect attempts toward mastery denominator
  const countsTowardScore =
    verificationState === "verified_correct" || verificationState === "incorrect";

  const nextTopic: TopicAccuracyStat = {
    earned: countsTowardScore ? prevTopic.earned + Math.max(0, earnedPoints) : prevTopic.earned,
    max: countsTowardScore ? prevTopic.max + Math.max(1, maxPoints) : prevTopic.max,
    attempts: prevTopic.attempts + 1,
    lastVerificationState: verificationState,
    lastAttemptAt: new Date().toISOString()
  };

  const nextErrorCauses = { ...current.errorCauses };
  if (verificationState === "incorrect" && errorCategory) {
    const prevErr = nextErrorCauses[errorCategory];
    nextErrorCauses[errorCategory] = {
      category: errorCategory,
      count: (prevErr?.count ?? 0) + 1,
      lastSeenAt: new Date().toISOString()
    };
  }

  return {
    ...state,
    subjects: {
      ...state.subjects,
      [subjectId]: {
        ...current,
        topicStats: {
          ...current.topicStats,
          [topicId]: nextTopic
        },
        errorCauses: nextErrorCauses,
        lastStudiedAt: new Date().toISOString()
      }
    }
  };
}

export function recordSubjectErrorLabCompletion(
  state: UniversalPlatformProgressState,
  subjectId: string,
  caseId: string
): UniversalPlatformProgressState {
  const current = getSubjectProgress(state, subjectId);
  const completedErrorLabIds = current.completedErrorLabIds.includes(caseId)
    ? current.completedErrorLabIds
    : [...current.completedErrorLabIds, caseId];

  return {
    ...state,
    subjects: {
      ...state.subjects,
      [subjectId]: {
        ...current,
        completedErrorLabIds,
        lastStudiedAt: new Date().toISOString()
      }
    }
  };
}

export function saveOnboardingSelection(
  state: UniversalPlatformProgressState,
  onboarding: Omit<OnboardingProfileState, "completed" | "updatedAt">
): UniversalPlatformProgressState {
  const primarySubject = onboarding.selectedSubjects[0] ?? state.activeSubjectId ?? "math";
  return {
    ...state,
    activeSubjectId: primarySubject,
    onboarding: {
      ...onboarding,
      selectedSubjects: onboarding.selectedSubjects.length > 0 ? onboarding.selectedSubjects : ["math"],
      completed: true,
      updatedAt: new Date().toISOString()
    }
  };
}

export function getSubjectSummaryMetrics(
  state: UniversalPlatformProgressState,
  subjectId: string,
  totalLessonsCount: number
): {
  completedLessons: number;
  totalLessons: number;
  completionPercent: number;
  averageAccuracyPercent: number | null;
  totalAttempts: number;
  errorLabFixedCount: number;
  topErrorCategories: SubjectErrorCauseStat[];
} {
  const subj = getSubjectProgress(state, subjectId);
  const completedLessons = subj.completedLessonIds.length;
  const totalLessons = Math.max(1, totalLessonsCount);
  const completionPercent = Math.min(100, Math.round((completedLessons / totalLessons) * 100));

  let totalEarned = 0;
  let totalMax = 0;
  let totalAttempts = 0;

  for (const stat of Object.values(subj.topicStats)) {
    totalEarned += stat.earned;
    totalMax += stat.max;
    totalAttempts += stat.attempts;
  }

  const averageAccuracyPercent = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : null;
  const errorLabFixedCount = subj.completedErrorLabIds.length;
  const topErrorCategories = Object.values(subj.errorCauses).sort((a, b) => b.count - a.count);

  return {
    completedLessons,
    totalLessons,
    completionPercent,
    averageAccuracyPercent,
    totalAttempts,
    errorLabFixedCount,
    topErrorCategories
  };
}
