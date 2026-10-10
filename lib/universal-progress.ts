import type { VerificationState } from "./xray-trace.ts";

export const UNIVERSAL_PROGRESS_STORAGE_KEY = "bilimai-universal-v2";

export type UserLearnerRole = "student" | "applicant" | "self_learner" | "teacher";
export type UserLearningGoal = "school" | "exam" | "from_scratch" | "practice_gaps" | "skill";
export type UserInitialLevel = "beginner" | "intermediate" | "advanced" | "check_level" | "continue";

export type LessonProgressStatus = "not_started" | "viewed" | "started" | "completed";

export interface LessonStateRecord {
  lessonId: string;
  status: LessonProgressStatus;
  viewedAt?: string;
  startedAt?: string;
  completedAt?: string;
}

export type LearningEventType =
  | "lesson_viewed"
  | "lesson_started"
  | "lesson_completed"
  | "assessment_attempted"
  | "answer_verified"
  | "topic_mastered"
  | "diagnostic_completed"
  | "error_lab_completed";

export interface LearningEvent {
  id: string;
  type: LearningEventType;
  subjectId: string;
  lessonId?: string;
  topicId?: string;
  questionId?: string;
  verificationState?: VerificationState;
  timestamp: string;
}

export interface DiagnosticQuestionResponseRecord {
  questionId: string;
  topicId: string;
  difficulty: "basic" | "intermediate" | "advanced";
  verificationState: VerificationState | "skipped";
  earnedPoints: number;
  maxPoints: number;
}

export interface DiagnosticAttemptRecord {
  id: string;
  subjectId: string;
  version: string;
  completedAt: string;
  scorePercent: number;
  verifiedCorrectCount: number;
  incorrectCount: number;
  unverifiedOrSkippedCount: number;
  totalQuestions: number;
  confidenceLevel: "low" | "medium" | "high";
  weakTopicIds: string[];
  recommendedLessonId: string;
  recommendationReason: Record<"ru" | "kk" | "uz", string>;
  responses: DiagnosticQuestionResponseRecord[];
}

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
  lessonStates: Record<string, LessonStateRecord>;
  activeLessonId?: string;
  recommendedLessonId?: string;
  topicStats: Record<string, TopicAccuracyStat>;
  errorCauses: Record<string, SubjectErrorCauseStat>;
  completedErrorLabIds: string[];
  diagnosticCompleted: boolean;
  diagnosticScorePercent?: number;
  lastDiagnostic?: DiagnosticAttemptRecord;
  diagnosticHistory: DiagnosticAttemptRecord[];
  processedAttemptIds: string[];
  events: LearningEvent[];
  lastStudiedAt?: string;
}

export interface UniversalPlatformProgressState {
  version: 2;
  /**
   * Explicit honesty flag: without a server session this state is stored locally on the current device.
   */
  storageMode: "local_guest" | "cloud_synced";
  /**
   * Explicit migration marker so legacy bilimai-lab-v1 is never re-applied on reload (P0-002).
   */
  legacyV1Migrated: boolean;
  migratedLegacyRecordKeys: string[];
  activeSubjectId: string;
  onboarding: OnboardingProfileState;
  subjects: Record<string, SubjectLearningProgress>;
}

export function createEmptySubjectProgress(subjectId: string): SubjectLearningProgress {
  return {
    subjectId,
    completedLessonIds: [],
    lessonStates: {},
    topicStats: {},
    errorCauses: {},
    completedErrorLabIds: [],
    diagnosticCompleted: false,
    diagnosticHistory: [],
    processedAttemptIds: [],
    events: []
  };
}

export function createDefaultUniversalProgressState(): UniversalPlatformProgressState {
  return {
    version: 2,
    storageMode: "local_guest",
    legacyV1Migrated: false,
    migratedLegacyRecordKeys: [],
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

function isValidGoal(val: unknown): val is UserLearningGoal {
  return (
    val === "school" ||
    val === "exam" ||
    val === "from_scratch" ||
    val === "practice_gaps" ||
    val === "skill"
  );
}

function isValidLevel(val: unknown): val is UserInitialLevel {
  return (
    val === "beginner" ||
    val === "intermediate" ||
    val === "advanced" ||
    val === "check_level" ||
    val === "continue"
  );
}

/**
 * Safely migrates raw JSON or legacy v1 progress objects into UniversalPlatformProgressState v2.
 * Strictly idempotent: repeated reloads with the same legacyLabRaw never duplicate attempts or points (P0-002).
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

      if (obj.storageMode === "cloud_synced" || obj.storageMode === "local_guest") {
        base.storageMode = obj.storageMode;
      }

      if (typeof obj.legacyV1Migrated === "boolean") {
        base.legacyV1Migrated = obj.legacyV1Migrated;
      }

      if (Array.isArray(obj.migratedLegacyRecordKeys)) {
        base.migratedLegacyRecordKeys = Array.from(
          new Set(obj.migratedLegacyRecordKeys.filter((k): k is string => typeof k === "string"))
        );
      }

      if (typeof obj.activeSubjectId === "string" && obj.activeSubjectId.trim().length > 0) {
        base.activeSubjectId = obj.activeSubjectId.trim();
      }

      if (obj.onboarding && typeof obj.onboarding === "object") {
        const onb = obj.onboarding as Record<string, unknown>;
        base.onboarding = {
          completed: Boolean(onb.completed),
          role:
            onb.role === "student" ||
            onb.role === "applicant" ||
            onb.role === "self_learner" ||
            onb.role === "teacher"
              ? onb.role
              : "student",
          goal: isValidGoal(onb.goal) ? onb.goal : "school",
          selectedSubjects: Array.isArray(onb.selectedSubjects)
            ? onb.selectedSubjects.filter((s): s is string => typeof s === "string" && s.length > 0)
            : ["math"],
          level: isValidLevel(onb.level) ? onb.level : "beginner",
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

          if (s.lessonStates && typeof s.lessonStates === "object") {
            for (const [lId, lVal] of Object.entries(s.lessonStates as Record<string, unknown>)) {
              if (!lVal || typeof lVal !== "object") continue;
              const lv = lVal as Record<string, unknown>;
              const status: LessonProgressStatus =
                lv.status === "viewed" ||
                lv.status === "started" ||
                lv.status === "completed" ||
                lv.status === "not_started"
                  ? lv.status
                  : "not_started";
              clean.lessonStates[lId] = {
                lessonId: lId,
                status,
                viewedAt: typeof lv.viewedAt === "string" ? lv.viewedAt : undefined,
                startedAt: typeof lv.startedAt === "string" ? lv.startedAt : undefined,
                completedAt: typeof lv.completedAt === "string" ? lv.completedAt : undefined
              };
            }
          }

          if (typeof s.activeLessonId === "string") {
            clean.activeLessonId = s.activeLessonId;
          }
          if (typeof s.recommendedLessonId === "string") {
            clean.recommendedLessonId = s.recommendedLessonId;
          }

          if (s.topicStats && typeof s.topicStats === "object") {
            for (const [tId, tVal] of Object.entries(s.topicStats as Record<string, unknown>)) {
              if (!tVal || typeof tVal !== "object") continue;
              const tv = tVal as Record<string, unknown>;
              const verState =
                tv.lastVerificationState === "verified_correct" ||
                tv.lastVerificationState === "incorrect" ||
                tv.lastVerificationState === "unverified" ||
                tv.lastVerificationState === "unsupported"
                  ? tv.lastVerificationState
                  : undefined;
              clean.topicStats[tId] = {
                earned:
                  typeof tv.earned === "number" && Number.isFinite(tv.earned)
                    ? Math.max(0, tv.earned)
                    : 0,
                max:
                  typeof tv.max === "number" && Number.isFinite(tv.max) ? Math.max(0, tv.max) : 0,
                attempts:
                  typeof tv.attempts === "number" && Number.isFinite(tv.attempts)
                    ? Math.max(0, tv.attempts)
                    : 0,
                lastVerificationState: verState,
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
                count:
                  typeof cv.count === "number" && Number.isFinite(cv.count)
                    ? Math.max(0, cv.count)
                    : 1,
                lastSeenAt:
                  typeof cv.lastSeenAt === "string" ? cv.lastSeenAt : new Date().toISOString()
              };
            }
          }

          if (Array.isArray(s.completedErrorLabIds)) {
            clean.completedErrorLabIds = Array.from(
              new Set(s.completedErrorLabIds.filter((x): x is string => typeof x === "string"))
            );
          }

          clean.diagnosticCompleted = Boolean(s.diagnosticCompleted);
          if (
            typeof s.diagnosticScorePercent === "number" &&
            Number.isFinite(s.diagnosticScorePercent)
          ) {
            clean.diagnosticScorePercent = Math.max(
              0,
              Math.min(100, Math.round(s.diagnosticScorePercent))
            );
          }

          if (s.lastDiagnostic && typeof s.lastDiagnostic === "object") {
            clean.lastDiagnostic = s.lastDiagnostic as DiagnosticAttemptRecord;
          }
          if (Array.isArray(s.diagnosticHistory)) {
            clean.diagnosticHistory = s.diagnosticHistory.filter(
              (d): d is DiagnosticAttemptRecord => Boolean(d && typeof d === "object")
            );
          }
          if (Array.isArray(s.processedAttemptIds)) {
            clean.processedAttemptIds = Array.from(
              new Set(s.processedAttemptIds.filter((x): x is string => typeof x === "string"))
            );
          }
          if (Array.isArray(s.events)) {
            clean.events = s.events.filter(
              (ev): ev is LearningEvent => Boolean(ev && typeof ev === "object")
            );
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

  // Idempotent migration from legacy bilimai-lab-v1 (math progress)
  if (legacyLabRaw && !base.legacyV1Migrated) {
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
        const migratedSet = new Set<string>(base.migratedLegacyRecordKeys);

        if (Array.isArray(lObj.completedLessons)) {
          for (const id of lObj.completedLessons) {
            if (typeof id === "string" && id.trim().length > 0) {
              const cleanId = id.trim();
              if (!mathProgress.completedLessonIds.includes(cleanId)) {
                mathProgress.completedLessonIds.push(cleanId);
              }
              if (!mathProgress.lessonStates[cleanId]) {
                mathProgress.lessonStates[cleanId] = {
                  lessonId: cleanId,
                  status: "completed",
                  completedAt: new Date().toISOString()
                };
              }
            }
          }
        }

        if (lObj.diagnosticDone === true) {
          mathProgress.diagnosticCompleted = true;
        }

        if (Array.isArray(lObj.records)) {
          for (let idx = 0; idx < lObj.records.length; idx++) {
            const rec = lObj.records[idx];
            if (!rec || typeof rec !== "object") continue;
            const r = rec as Record<string, unknown>;
            // Skip corrupted records that do not specify a boolean `correct` field
            if (typeof r.correct !== "boolean") continue;

            const rawTopic =
              typeof r.topic === "string" && r.topic.trim().length > 0
                ? r.topic.trim()
                : typeof r.topicId === "string" && r.topicId.trim().length > 0
                  ? r.topicId.trim()
                  : "general";
            const recordTimestamp =
              typeof r.timestamp === "string" && r.timestamp.trim().length > 0
                ? r.timestamp.trim()
                : typeof r.date === "string" && r.date.trim().length > 0
                  ? r.date.trim()
                  : typeof r.createdAt === "string" && r.createdAt.trim().length > 0
                    ? r.createdAt.trim()
                    : undefined;
            const errorReason =
              typeof r.errorReason === "string" && r.errorReason.trim().length > 0
                ? r.errorReason.trim()
                : typeof r.errorCategory === "string" && r.errorCategory.trim().length > 0
                  ? r.errorCategory.trim()
                  : undefined;

            const dedupKey =
              typeof r.id === "string" && r.id.trim().length > 0
                ? `id:${r.id.trim()}`
                : `idx:${idx}|topic:${rawTopic}|correct:${String(r.correct)}|err:${errorReason ?? ""}|ts:${recordTimestamp ?? ""}`;

            if (migratedSet.has(dedupKey)) {
              continue;
            }
            migratedSet.add(dedupKey);

            const correct = r.correct === true;
            const prevTopic = mathProgress.topicStats[rawTopic] ?? {
              earned: 0,
              max: 0,
              attempts: 0
            };
            mathProgress.topicStats[rawTopic] = {
              earned: prevTopic.earned + (correct ? 1 : 0),
              max: prevTopic.max + 1,
              attempts: prevTopic.attempts + 1,
              lastVerificationState: correct ? "verified_correct" : "incorrect",
              lastAttemptAt: recordTimestamp ?? prevTopic.lastAttemptAt
            };

            if (!correct && errorReason) {
              const prevErr = mathProgress.errorCauses[errorReason];
              mathProgress.errorCauses[errorReason] = {
                category: errorReason,
                count: (prevErr?.count ?? 0) + 1,
                lastSeenAt: recordTimestamp ?? prevErr?.lastSeenAt ?? new Date().toISOString()
              };
            }

            if (recordTimestamp) {
              mathProgress.lastStudiedAt = recordTimestamp;
            }
          }
        }

        base.subjects.math = mathProgress;
        base.legacyV1Migrated = true;
        base.migratedLegacyRecordKeys = Array.from(migratedSet);
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
 * Records that a lesson was viewed or started without marking it completed or altering accuracy (P0-001).
 */
export function recordSubjectLessonInteraction(
  state: UniversalPlatformProgressState,
  subjectId: string,
  lessonId: string,
  stage: "viewed" | "started"
): UniversalPlatformProgressState {
  const current = getSubjectProgress(state, subjectId);
  const now = new Date().toISOString();
  const prevLessonState = current.lessonStates[lessonId];
  const nextStatus: LessonProgressStatus =
    prevLessonState?.status === "completed"
      ? "completed"
      : stage === "started" || prevLessonState?.status === "started"
        ? "started"
        : "viewed";

  const nextLessonState: LessonStateRecord = {
    lessonId,
    status: nextStatus,
    viewedAt: prevLessonState?.viewedAt ?? now,
    startedAt: stage === "started" ? prevLessonState?.startedAt ?? now : prevLessonState?.startedAt,
    completedAt: prevLessonState?.completedAt
  };

  const event: LearningEvent = {
    id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: stage === "started" ? "lesson_started" : "lesson_viewed",
    subjectId,
    lessonId,
    timestamp: now
  };

  return {
    ...state,
    subjects: {
      ...state.subjects,
      [subjectId]: {
        ...current,
        activeLessonId: lessonId,
        lessonStates: {
          ...current.lessonStates,
          [lessonId]: nextLessonState
        },
        events: [...current.events.slice(-99), event],
        lastStudiedAt: now
      }
    }
  };
}

/**
 * Records a completed lesson strictly within the specified subjectId (CASE C isolation).
 * P0-001 FIX: Completing a lesson NEVER adds fake question attempts, points, or "verified_correct" accuracy!
 */
export function recordSubjectLessonCompletion(
  state: UniversalPlatformProgressState,
  subjectId: string,
  lessonId: string,
  topicId?: string
): UniversalPlatformProgressState {
  const current = getSubjectProgress(state, subjectId);
  const now = new Date().toISOString();
  const completedLessonIds = current.completedLessonIds.includes(lessonId)
    ? current.completedLessonIds
    : [...current.completedLessonIds, lessonId];

  const prevLessonState = current.lessonStates[lessonId];
  const nextLessonState: LessonStateRecord = {
    lessonId,
    status: "completed",
    viewedAt: prevLessonState?.viewedAt ?? now,
    startedAt: prevLessonState?.startedAt ?? now,
    completedAt: prevLessonState?.completedAt ?? now
  };

  const event: LearningEvent = {
    id: `ev-lesson-done-${ lessonId }-${Date.now()}`,
    type: "lesson_completed",
    subjectId,
    lessonId,
    topicId,
    timestamp: now
  };

  return {
    ...state,
    subjects: {
      ...state.subjects,
      [subjectId]: {
        ...current,
        completedLessonIds,
        lessonStates: {
          ...current.lessonStates,
          [lessonId]: nextLessonState
        },
        activeLessonId: lessonId,
        events: [...current.events.slice(-99), event],
        lastStudiedAt: now
      }
    }
  };
}

/**
 * Records a question attempt strictly inside its subjectId without mutating any other subject.
 * E2E-014 FIX: Deduplicates by optional `attemptId` so double-clicking "Check Answer" never creates duplicate attempts or points.
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
    attemptId?: string;
    questionId?: string;
  }
): UniversalPlatformProgressState {
  const {
    subjectId,
    topicId,
    earnedPoints,
    maxPoints,
    verificationState,
    errorCategory,
    attemptId,
    questionId
  } = params;
  const current = getSubjectProgress(state, subjectId);

  if (attemptId && current.processedAttemptIds.includes(attemptId)) {
    return state;
  }

  const now = new Date().toISOString();
  const prevTopic = current.topicStats[topicId] ?? { earned: 0, max: 0, attempts: 0 };

  // Only count deterministic verified_correct / incorrect attempts toward mastery denominator
  const countsTowardScore =
    verificationState === "verified_correct" || verificationState === "incorrect";

  const nextEarned = countsTowardScore
    ? prevTopic.earned + Math.max(0, earnedPoints)
    : prevTopic.earned;
  const nextMax = countsTowardScore ? prevTopic.max + Math.max(1, maxPoints) : prevTopic.max;

  const nextTopic: TopicAccuracyStat = {
    earned: nextEarned,
    max: nextMax,
    attempts: prevTopic.attempts + 1,
    lastVerificationState: verificationState,
    lastAttemptAt: now
  };

  const nextErrorCauses = { ...current.errorCauses };
  if (verificationState === "incorrect" && errorCategory) {
    const prevErr = nextErrorCauses[errorCategory];
    nextErrorCauses[errorCategory] = {
      category: errorCategory,
      count: (prevErr?.count ?? 0) + 1,
      lastSeenAt: now
    };
  }

  const newEvents: LearningEvent[] = [
    {
      id: `ev-attempt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: countsTowardScore ? "answer_verified" : "assessment_attempted",
      subjectId,
      topicId,
      questionId,
      verificationState,
      timestamp: now
    }
  ];

  const wasMastered = prevTopic.max > 0 && Math.round((prevTopic.earned / prevTopic.max) * 100) >= 80;
  const isNowMastered = nextMax > 0 && Math.round((nextEarned / nextMax) * 100) >= 80;
  if (!wasMastered && isNowMastered) {
    newEvents.push({
      id: `ev-mastered-${topicId}-${Date.now()}`,
      type: "topic_mastered",
      subjectId,
      topicId,
      timestamp: now
    });
  }

  const nextProcessedAttemptIds = attemptId
    ? [...current.processedAttemptIds.slice(-199), attemptId]
    : current.processedAttemptIds;

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
        processedAttemptIds: nextProcessedAttemptIds,
        events: [...current.events.slice(-98), ...newEvents],
        lastStudiedAt: now
      }
    }
  };
}

/**
 * Records a structured diagnostic attempt with explainable recommendation (Section 10 & P1-003).
 */
export function recordSubjectDiagnosticAttempt(
  state: UniversalPlatformProgressState,
  record: DiagnosticAttemptRecord
): UniversalPlatformProgressState {
  const current = getSubjectProgress(state, record.subjectId);
  const now = record.completedAt || new Date().toISOString();

  const event: LearningEvent = {
    id: `ev-diag-${record.id}`,
    type: "diagnostic_completed",
    subjectId: record.subjectId,
    lessonId: record.recommendedLessonId,
    timestamp: now
  };

  return {
    ...state,
    subjects: {
      ...state.subjects,
      [record.subjectId]: {
        ...current,
        diagnosticCompleted: true,
        diagnosticScorePercent: record.scorePercent,
        recommendedLessonId: record.recommendedLessonId,
        lastDiagnostic: record,
        diagnosticHistory: [...current.diagnosticHistory.slice(-19), record],
        events: [...current.events.slice(-99), event],
        lastStudiedAt: now
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
  const now = new Date().toISOString();
  const completedErrorLabIds = current.completedErrorLabIds.includes(caseId)
    ? current.completedErrorLabIds
    : [...current.completedErrorLabIds, caseId];

  const event: LearningEvent = {
    id: `ev-errlab-${caseId}-${Date.now()}`,
    type: "error_lab_completed",
    subjectId,
    timestamp: now
  };

  return {
    ...state,
    subjects: {
      ...state.subjects,
      [subjectId]: {
        ...current,
        completedErrorLabIds,
        events: [...current.events.slice(-99), event],
        lastStudiedAt: now
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
      selectedSubjects:
        onboarding.selectedSubjects.length > 0 ? onboarding.selectedSubjects : ["math"],
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
  verifiedAttempts: number;
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
    verifiedAttempts: totalMax,
    errorLabFixedCount,
    topErrorCategories
  };
}
