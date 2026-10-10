import { useCallback, useEffect, useMemo, useReducer } from "react";
import { untTopicIds, type Language, type TopicId } from "./lessons.ts";
import {
  analyzeErrorCauseHistory,
  buildBaselineRoadmap,
  buildSmartDailySession,
  checkAnswer,
  getTopicErrorReasonId,
  makeChallenge,
  parseNumericAnswer,
  progressSchema,
  reviewSchedule,
  type ErrorCauseSummaryItem,
  type Progress,
  type SmartDailySession
} from "./error-lab.ts";
import {
  emptyUntStorage,
  untStorageKey,
  untStorageSchema,
  type UntAttemptSummary,
  type UntStorage
} from "./unt-exam.ts";
import {
  clearUserProfile,
  loadUserProfile,
  saveUserProfile,
  type UniversityId,
  type UserProfile
} from "./user-profile.ts";
import type { UntSubjectId } from "./unt-all-subjects.ts";

export type WorkspaceTab =
  | "today"
  | "lesson"
  | "practice"
  | "ai"
  | "xray"
  | "exam"
  | "graph"
  | "roadmap"
  | "profile";

export const VALID_WORKSPACE_TABS: readonly WorkspaceTab[] = [
  "today",
  "lesson",
  "practice",
  "ai",
  "xray",
  "exam",
  "graph",
  "roadmap",
  "profile"
];

export function isValidWorkspaceTab(value: string | null | undefined): value is WorkspaceTab {
  return Boolean(value && (VALID_WORKSPACE_TABS as readonly string[]).includes(value));
}

export function buildStudyHref(params: {
  lang: Language;
  tab: string;
  topic: TopicId;
  subject?: UntSubjectId;
}): string {
  const search = new URLSearchParams();
  search.set("lang", params.lang);
  if (params.tab && params.tab !== "today") {
    search.set("tab", params.tab);
  }
  if (
    params.topic &&
    (params.topic !== "linear" || params.tab === "lesson" || params.tab === "practice")
  ) {
    search.set("topic", params.topic);
  }
  if (params.subject && params.subject !== "math") {
    search.set("subject", params.subject);
  }
  const qs = search.toString();
  return qs ? `/?${qs}` : "/";
}

export const LAB_STORAGE_KEY = "bilimai-lab-v1";
export const PLAN_PREFS_STORAGE_KEY = "bilimai-plan-prefs-v1";
export const PRACTICE_SESSION_STORAGE_KEY = "bilimai-practice-v1";

export type ClaudeRoadmap = {
  summary: string;
  priorityModules: { topic: TopicId; reason: string; recommendedAction: string }[];
  weeklyMilestones: string[];
  dailyHabit: string;
  source?: string;
};

export interface TutorAnswerPayload {
  explanation: string;
  hint: string;
  errorType?: string;
  socraticQuestion?: string;
  nextAction?: string;
  source?: string;
}

export interface TutorDialogueTurn {
  question: string;
  answer: TutorAnswerPayload;
}

export interface PracticeAttemptState {
  checks: number;
  helped: boolean;
  wasWrong: boolean;
  completed: boolean;
}

export interface TopicPracticeSession {
  attempts: Record<string, PracticeAttemptState>;
  activeQ: number;
  answers: Record<number, string>;
  checkedMap: Record<number, boolean>;
  expandedErrorMap: Record<number, boolean>;
  practiceNotice: boolean;
  practiceSeed: number;
  transferInput: string;
  transferStatus: "" | "right" | "wrong" | "invalid";
  showTransferRule: boolean;
}

export interface StudyStoreState {
  hydrated: boolean;
  hasInteracted: boolean;
  userProfile: UserProfile | null;
  labProgress: Progress;
  untStorage: UntStorage;
  weakTopics: TopicId[];
  targetScore: number | null;
  weeksLeft: number | null;
  showExamplePlan: boolean;
  goalNote: string;
  rmBusy: boolean;
  rmError: string;
  aiRoadmap: ClaudeRoadmap | null;
  practiceByTopic: Partial<Record<TopicId, TopicPracticeSession>>;
  // AI Tutor state for current topic (with multi-turn history up to 3 exchanges)
  question: string;
  consent: boolean;
  busy: boolean;
  error: string;
  answer: TutorAnswerPayload | null;
  aiHistory: TutorDialogueTurn[];
}

export const emptyProgress: Progress = { version: 1, records: [] };

export function createEmptyTopicPracticeSession(): TopicPracticeSession {
  return {
    attempts: {},
    activeQ: 0,
    answers: {},
    checkedMap: {},
    expandedErrorMap: {},
    practiceNotice: false,
    practiceSeed: 0,
    transferInput: "",
    transferStatus: "",
    showTransferRule: false
  };
}

export function createInitialStudyStoreState(): StudyStoreState {
  return {
    hydrated: false,
    hasInteracted: false,
    userProfile: null,
    labProgress: emptyProgress,
    untStorage: emptyUntStorage,
    weakTopics: [],
    targetScore: null,
    weeksLeft: null,
    showExamplePlan: false,
    goalNote: "",
    rmBusy: false,
    rmError: "",
    aiRoadmap: null,
    practiceByTopic: {},
    question: "",
    consent: false,
    busy: false,
    error: "",
    answer: null,
    aiHistory: []
  };
}

export function getTopicPracticeSession(
  state: StudyStoreState,
  topic: TopicId
): TopicPracticeSession {
  const saved = state.practiceByTopic[topic];
  return { ...createEmptyTopicPracticeSession(), ...saved, attempts: saved?.attempts ?? {} };
}

export type StudyStoreAction =
  | {
      type: "HYDRATE";
      payload: Partial<
        Pick<
          StudyStoreState,
          | "userProfile"
          | "labProgress"
          | "untStorage"
          | "weakTopics"
          | "targetScore"
          | "weeksLeft"
          | "hasInteracted"
          | "practiceByTopic"
        >
      >;
    }
  | { type: "MARK_INTERACTED" }
  | { type: "RESET_TOPIC_SESSION"; topic: TopicId }
  | { type: "SET_ACTIVE_QUESTION"; topic: TopicId; activeQ: number }
  | { type: "SELECT_OPTION"; topic: TopicId; qIdx: number; value: string }
  | {
      type: "CHECK_QUESTION";
      topic: TopicId;
      qIdx: number;
      isCorrect?: boolean;
      wrongAnswerText?: string;
    }
  | { type: "RETRY_QUESTION"; topic: TopicId; qIdx: number }
  | { type: "EXPAND_ERROR_NOTE"; topic: TopicId; qIdx: number }
  | { type: "SET_TRANSFER_INPUT"; topic: TopicId; value: string }
  | { type: "CHECK_TRANSFER"; topic: TopicId; expectedAnswer: number }
  | { type: "SHOW_TRANSFER_RULE"; topic: TopicId }
  | { type: "NEXT_TRANSFER_VARIANT"; topic: TopicId }
  | { type: "SET_AI_QUESTION"; question: string }
  | { type: "SET_CONSENT"; consent: boolean }
  | { type: "AI_REQUEST_START" }
  | { type: "AI_REQUEST_SUCCESS"; topic?: TopicId; question?: string; answer: TutorAnswerPayload }
  | { type: "AI_REQUEST_ERROR"; error: string }
  | { type: "CLEAR_AI_ERROR" }
  | { type: "RESET_AI_DIALOGUE" }
  | { type: "COMPLETE_UNT_EXAM"; summary: UntAttemptSummary }
  | { type: "TOGGLE_WEAK_TOPIC"; topic: TopicId }
  | { type: "SET_TARGET_SCORE"; targetScore: number | null }
  | { type: "SET_WEEKS_LEFT"; weeksLeft: number | null }
  | { type: "SET_SHOW_EXAMPLE_PLAN"; show: boolean }
  | { type: "SET_GOAL_NOTE"; goalNote: string }
  | { type: "ROADMAP_REQUEST_START" }
  | { type: "ROADMAP_REQUEST_SUCCESS"; roadmap: ClaudeRoadmap }
  | { type: "ROADMAP_REQUEST_ERROR"; error: string }
  | { type: "CLEAR_ROADMAP_ERROR" }
  | { type: "UPDATE_USER_PROFILE"; profile: UserProfile | null };

function updateTopicPractice(
  state: StudyStoreState,
  topic: TopicId,
  updater: (prev: TopicPracticeSession) => TopicPracticeSession
): StudyStoreState {
  const prevSession = getTopicPracticeSession(state, topic);
  const nextSession = updater(prevSession);
  return {
    ...state,
    practiceByTopic: {
      ...state.practiceByTopic,
      [topic]: nextSession
    }
  };
}

function markPracticeHelp(state: StudyStoreState, topic: TopicId, id: string): StudyStoreState {
  return updateTopicPractice(state, topic, (session) => {
    const existing = session.attempts[id];
    return {
      ...session,
      attempts: {
        ...session.attempts,
        [id]: {
          checks: existing?.checks ?? 0,
          wasWrong: existing?.wasWrong ?? false,
          completed: existing?.completed ?? false,
          helped: true
        }
      }
    };
  });
}

function recordPracticeCheck(
  state: StudyStoreState, topic: TopicId, id: string, source: "lesson" | "transfer", correct: boolean, wrongAnswer?: string
): StudyStoreState {
  const session = getTopicPracticeSession(state, topic);
  const oldRecords = state.labProgress.records.filter((r) => r.challenge === id);
  const prior = session.attempts[id] ?? {
    checks: oldRecords.length,
    helped: oldRecords.some((r) => (r.hintsUsed ?? 0) > 0),
    wasWrong: oldRecords.some((r) => r.correct === false || Boolean(r.wrongAnswer)),
    completed: oldRecords.some((r) => r.correct === true || r.independent)
  };
  const independent = correct && prior.checks === 0 && !prior.helped && !prior.wasWrong && !prior.completed;
  const next = updateTopicPractice(state, topic, (s) => ({
    ...s,
    attempts: { ...s.attempts, [id]: { checks: prior.checks + 1, helped: prior.helped, wasWrong: prior.wasWrong || !correct, completed: prior.completed || correct } }
  }));
  // Rechecking a completed task does not add a duplicate success or repair evidence.
  if (correct && prior.completed) return { ...next, hasInteracted: true };
  const record = {
    topic, challenge: id, source, correct, independent,
    date: new Date().toISOString(), hintsUsed: prior.helped ? 1 : 0,
    ...(!correct ? { wrongAnswer: (wrongAnswer ?? session.answers[session.activeQ] ?? "").slice(0, 120), errorReason: getTopicErrorReasonId(topic) } : {}),
    // A first, unassisted new task is evidence; retrying the same task is not.
    verifiedClean: independent
  };
  return { ...next, hasInteracted: true, labProgress: { version: 1, records: [...state.labProgress.records, record].slice(-60) } };
}

export function studyStoreReducer(
  state: StudyStoreState,
  action: StudyStoreAction
): StudyStoreState {
  switch (action.type) {
    case "HYDRATE":
      return {
        ...state,
        ...action.payload,
        hydrated: true
      };

    case "MARK_INTERACTED":
      return state.hasInteracted ? state : { ...state, hasInteracted: true };

    case "RESET_TOPIC_SESSION":
      return {
        ...updateTopicPractice(state, action.topic, (prev) => ({ ...createEmptyTopicPracticeSession(), attempts: prev.attempts })),
        answer: null,
        aiHistory: [],
        error: "",
        busy: false,
        question: ""
      };

    case "SET_ACTIVE_QUESTION":
      return updateTopicPractice(state, action.topic, (s) => ({
        ...s,
        activeQ: action.activeQ,
        practiceNotice: false
      }));

    case "SELECT_OPTION":
      return updateTopicPractice(state, action.topic, (s) => ({
        ...s,
        practiceNotice: false,
        answers: { ...s.answers, [action.qIdx]: action.value }
      }));

    case "CHECK_QUESTION": {
      const curr = getTopicPracticeSession(state, action.topic);
      if (curr.answers[action.qIdx] === undefined) {
        return updateTopicPractice(state, action.topic, (s) => ({
          ...s,
          practiceNotice: true
        }));
      }
      if (curr.checkedMap[action.qIdx]) return state;
      const nextState = updateTopicPractice(state, action.topic, (s) => ({
        ...s,
        practiceNotice: false,
        checkedMap: { ...s.checkedMap, [action.qIdx]: true }
      }));

      if (action.isCorrect === undefined) return { ...nextState, hasInteracted: true };
      // Lesson questions are fixed across transfers and languages; never share a lab seed ID.
      return recordPracticeCheck(nextState, action.topic, `lesson-${action.topic}-${action.qIdx}`, "lesson", action.isCorrect, action.wrongAnswerText);
    }

    case "RETRY_QUESTION":
      return updateTopicPractice(state, action.topic, (s) => {
        const nextChecked = { ...s.checkedMap };
        const nextExpanded = { ...s.expandedErrorMap };
        const nextAnswers = { ...s.answers };
        delete nextChecked[action.qIdx];
        delete nextExpanded[action.qIdx];
        delete nextAnswers[action.qIdx];
        return {
          ...s,
          checkedMap: nextChecked,
          expandedErrorMap: nextExpanded,
          answers: nextAnswers,
          practiceNotice: false
        };
      });

    case "EXPAND_ERROR_NOTE": {
      const next = updateTopicPractice(state, action.topic, (s) => ({
        ...s, expandedErrorMap: { ...s.expandedErrorMap, [action.qIdx]: true }
      }));
      return markPracticeHelp(next, action.topic, `lesson-${action.topic}-${action.qIdx}`);
    }

    case "SET_TRANSFER_INPUT":
      return updateTopicPractice(state, action.topic, (s) => ({
        ...s,
        transferInput: action.value,
        transferStatus: ""
      }));

    case "CHECK_TRANSFER": {
      const curr = getTopicPracticeSession(state, action.topic);
      if (!curr.transferInput.trim() || parseNumericAnswer(curr.transferInput) === null) {
        return updateTopicPractice(state, action.topic, (s) => ({
          ...s,
          transferStatus: "invalid"
        }));
      }
      if (curr.transferStatus === "right") return state;
      const isRight = checkAnswer(curr.transferInput, action.expectedAnswer);
      const nextState = updateTopicPractice(state, action.topic, (s) => ({
        ...s,
        transferStatus: isRight ? "right" : "wrong"
      }));
      return recordPracticeCheck(nextState, action.topic, `transfer-${action.topic}-${curr.practiceSeed}`, "transfer", isRight, isRight ? undefined : curr.transferInput);
    }

    case "SHOW_TRANSFER_RULE": {
      const next = updateTopicPractice(state, action.topic, (s) => ({ ...s, showTransferRule: true }));
      return markPracticeHelp(next, action.topic, `transfer-${action.topic}-${getTopicPracticeSession(state, action.topic).practiceSeed}`);
    }

    case "NEXT_TRANSFER_VARIANT":
      return updateTopicPractice(state, action.topic, (s) => ({
        ...s,
        practiceSeed: (s.practiceSeed + 1) % 24,
        transferInput: "",
        transferStatus: "",
        showTransferRule: false
      }));

    case "SET_AI_QUESTION":
      return {
        ...state,
        question: action.question,
        error: ""
      };

    case "SET_CONSENT":
      return {
        ...state,
        consent: action.consent
      };

    case "AI_REQUEST_START":
      return {
        ...state,
        busy: true,
        error: "",
        answer: null
      };

    case "AI_REQUEST_SUCCESS": {
      const turnQuestion = (action.question ?? state.question).trim();
      const nextHistory: TutorDialogueTurn[] = turnQuestion
        ? [...state.aiHistory, { question: turnQuestion, answer: action.answer }].slice(-3)
        : state.aiHistory;
      let next: StudyStoreState = { ...state, busy: false, error: "", answer: action.answer, aiHistory: nextHistory };
      if (action.topic) {
        const session = getTopicPracticeSession(state, action.topic);
        next = markPracticeHelp(next, action.topic, `lesson-${action.topic}-${session.activeQ}`);
        next = markPracticeHelp(next, action.topic, `transfer-${action.topic}-${session.practiceSeed}`);
      }
      return next;
    }

    case "AI_REQUEST_ERROR":
      return {
        ...state,
        busy: false,
        error: action.error
      };

    case "CLEAR_AI_ERROR":
      return state.error ? { ...state, error: "" } : state;

    case "RESET_AI_DIALOGUE":
      return {
        ...state,
        question: "",
        answer: null,
        aiHistory: [],
        error: "",
        busy: false
      };

    case "COMPLETE_UNT_EXAM": {
      const nextUntStorage: UntStorage = {
        version: 1,
        lastAttempt: action.summary,
        history: [action.summary, ...state.untStorage.history].slice(0, 20)
      };
      return {
        ...state,
        hasInteracted: true,
        untStorage: nextUntStorage,
        weakTopics:
          (!action.summary.subjectId || action.summary.subjectId === "math") && action.summary.weakTopics.length > 0 ? action.summary.weakTopics : state.weakTopics
      };
    }

    case "TOGGLE_WEAK_TOPIC": {
      const exists = state.weakTopics.includes(action.topic);
      const nextWeak = exists
        ? state.weakTopics.filter((id) => id !== action.topic)
        : [...state.weakTopics, action.topic];
      return {
        ...state,
        hasInteracted: true,
        weakTopics: nextWeak
      };
    }

    case "SET_TARGET_SCORE":
      return {
        ...state,
        targetScore: action.targetScore !== null && Number.isFinite(action.targetScore) ? Math.max(0, Math.min(50, action.targetScore)) : null
      };

    case "SET_WEEKS_LEFT":
      return {
        ...state,
        weeksLeft: action.weeksLeft !== null && Number.isFinite(action.weeksLeft) ? Math.max(1, Math.min(24, action.weeksLeft)) : null
      };

    case "SET_SHOW_EXAMPLE_PLAN":
      return {
        ...state,
        showExamplePlan: action.show
      };

    case "SET_GOAL_NOTE":
      return {
        ...state,
        goalNote: action.goalNote,
        rmError: ""
      };

    case "ROADMAP_REQUEST_START":
      return {
        ...state,
        rmBusy: true,
        rmError: "",
        aiRoadmap: null
      };

    case "ROADMAP_REQUEST_SUCCESS":
      return {
        ...state,
        rmBusy: false,
        rmError: "",
        aiRoadmap: action.roadmap
      };

    case "ROADMAP_REQUEST_ERROR":
      return {
        ...state,
        rmBusy: false,
        rmError: action.error
      };

    case "CLEAR_ROADMAP_ERROR":
      return state.rmError ? { ...state, rmError: "" } : state;

    case "UPDATE_USER_PROFILE":
      return {
        ...state,
        userProfile: action.profile,
        targetScore: action.profile?.targetScore ?? null,
        weeksLeft: action.profile ? state.weeksLeft : null
      };

    default:
      return state;
  }
}

export function loadStudyStoreSnapshot(): Partial<StudyStoreState> {
  if (typeof window === "undefined") return {};
  const snapshot: Partial<StudyStoreState> = {};

  try {
    const storedProfile = loadUserProfile();
    if (storedProfile && storedProfile.name) {
      snapshot.userProfile = storedProfile;
      snapshot.targetScore = storedProfile.targetScore;
    }
  } catch {}

  try {
    const rawLab = window.localStorage.getItem(LAB_STORAGE_KEY);
    if (rawLab) {
      const parsed = progressSchema.safeParse(JSON.parse(rawLab));
      if (parsed.success && parsed.data.records.length > 0) {
        snapshot.labProgress = parsed.data;
        const autoBase = buildBaselineRoadmap(parsed.data, null, null, "ru");
        snapshot.weakTopics = autoBase.weakTopics;
      }
    }
  } catch {}

  try {
    const rawUnt = window.localStorage.getItem(untStorageKey);
    if (rawUnt) {
      const parsedUnt = untStorageSchema.safeParse(JSON.parse(rawUnt));
      if (parsedUnt.success) {
        snapshot.untStorage = parsedUnt.data;
        if (parsedUnt.data.lastAttempt && parsedUnt.data.lastAttempt.weakTopics.length > 0) {
          snapshot.weakTopics = parsedUnt.data.lastAttempt.weakTopics;
        }
      }
    }
  } catch {}

  try {
    const rawPrefs = window.localStorage.getItem(PLAN_PREFS_STORAGE_KEY);
    if (rawPrefs) {
      const parsed = JSON.parse(rawPrefs) as {
        weakTopics?: string[];
        targetScore?: number;
        weeksLeft?: number;
      };
      if (Array.isArray(parsed.weakTopics)) {
        const validWeak = parsed.weakTopics.filter((t): t is TopicId =>
          (untTopicIds as readonly string[]).includes(t)
        );
        if (validWeak.length > 0) snapshot.weakTopics = validWeak;
      }
      if (typeof parsed.targetScore === "number" && parsed.targetScore >= 0 && parsed.targetScore <= 50) {
        snapshot.targetScore = parsed.targetScore;
      }
      if (parsed.targetScore === null) snapshot.targetScore = null;
      if (parsed.weeksLeft === null) snapshot.weeksLeft = null;
      if (typeof parsed.weeksLeft === "number" && parsed.weeksLeft >= 1 && parsed.weeksLeft <= 24) {
        snapshot.weeksLeft = parsed.weeksLeft;
      }
    }
  } catch {}

  try {
    const rawPractice = window.localStorage.getItem(PRACTICE_SESSION_STORAGE_KEY);
    if (rawPractice) {
      const parsed = JSON.parse(rawPractice) as Partial<Record<TopicId, TopicPracticeSession>>;
      if (parsed && typeof parsed === "object") {
        snapshot.practiceByTopic = parsed;
      }
    }
  } catch {}

  return snapshot;
}

export function useStudyStore(topic: TopicId, lang: Language) {
  const [state, dispatch] = useReducer(studyStoreReducer, undefined, createInitialStudyStoreState);

  // Hydrate unified store from localStorage on client mount
  useEffect(() => {
    const snapshot = loadStudyStoreSnapshot();
    dispatch({ type: "HYDRATE", payload: snapshot });
  }, []);

  // Persist UNT exam storage when changed
  useEffect(() => {
    if (!state.hydrated || typeof window === "undefined") return;
    try {
      if (state.untStorage.lastAttempt || state.untStorage.history.length > 0) {
        window.localStorage.setItem(untStorageKey, JSON.stringify(state.untStorage));
      }
    } catch {}
  }, [state.hydrated, state.untStorage]);

  // Persist lab progress when transfer problems are solved in practice
  useEffect(() => {
    if (!state.hydrated || typeof window === "undefined") return;
    try {
      if (state.labProgress.records.length > 0) {
        window.localStorage.setItem(LAB_STORAGE_KEY, JSON.stringify(state.labProgress));
      }
    } catch {}
  }, [state.hydrated, state.labProgress]);

  // Persist plan preferences (weakTopics, targetScore, weeksLeft)
  useEffect(() => {
    if (!state.hydrated || typeof window === "undefined") return;
    try {
      if (state.hasInteracted || state.weakTopics.length > 0) {
        window.localStorage.setItem(
          PLAN_PREFS_STORAGE_KEY,
          JSON.stringify({
            weakTopics: state.weakTopics,
            targetScore: state.targetScore,
            weeksLeft: state.weeksLeft
          })
        );
      }
    } catch {}
  }, [state.hydrated, state.hasInteracted, state.weakTopics, state.targetScore, state.weeksLeft]);

  // Persist per-topic practice session
  useEffect(() => {
    if (!state.hydrated || typeof window === "undefined") return;
    try {
      if (Object.keys(state.practiceByTopic).length > 0) {
        window.localStorage.setItem(
          PRACTICE_SESSION_STORAGE_KEY,
          JSON.stringify(state.practiceByTopic)
        );
      }
    } catch {}
  }, [state.hydrated, state.practiceByTopic]);

  const currentPractice = useMemo(
    () => getTopicPracticeSession(state, topic),
    [state, topic]
  );

  const baseline = useMemo(
    () => buildBaselineRoadmap(state.labProgress, state.targetScore, state.weeksLeft, lang),
    [state.labProgress, state.targetScore, state.weeksLeft, lang]
  );

  const transferChallenge = useMemo(
    () => makeChallenge(topic, currentPractice.practiceSeed, lang),
    [topic, currentPractice.practiceSeed, lang]
  );

  const errorCauses: ErrorCauseSummaryItem[] = useMemo(
    () => analyzeErrorCauseHistory(state.labProgress, lang),
    [state.labProgress, lang]
  );

  const smartDailySession: SmartDailySession = useMemo(
    () => buildSmartDailySession(state.labProgress, lang),
    [state.labProgress, lang]
  );

  const nextDueReview = useMemo(() => {
    if (state.labProgress.records.length === 0) return null;
    const sched = reviewSchedule(state.labProgress, Date.now());
    const dueItem = sched.find((item) => item.practiced && item.due);
    if (dueItem) return dueItem;
    return sched.find((item) => item.practiced) ?? null;
  }, [state.labProgress]);

  const handleCompleteUntExam = useCallback((summary: UntAttemptSummary) => {
    dispatch({ type: "COMPLETE_UNT_EXAM", summary });
  }, []);

  const handleToggleWeakTopic = useCallback((id: TopicId) => {
    dispatch({ type: "TOGGLE_WEAK_TOPIC", topic: id });
  }, []);

  const handleUpdateUserStats = useCallback(
    (streak: number, disarmedTotal: number, targetUni?: UniversityId) => {
      if (!state.userProfile) return;
      const updated: UserProfile = {
        ...state.userProfile,
        trapBlitzBestStreak: Math.max(state.userProfile.trapBlitzBestStreak, streak),
        disarmedTrapsCount: disarmedTotal,
        targetUniversity: targetUni ?? state.userProfile.targetUniversity
      };
      saveUserProfile(updated);
      dispatch({ type: "UPDATE_USER_PROFILE", profile: updated });
    },
    [state.userProfile]
  );

  const handleLogoutProfile = useCallback(() => {
    clearUserProfile();
    dispatch({ type: "UPDATE_USER_PROFILE", profile: null });
  }, []);

  return {
    state,
    dispatch,
    currentPractice,
    baseline,
    transferChallenge,
    errorCauses,
    smartDailySession,
    nextDueReview,
    handleCompleteUntExam,
    handleToggleWeakTopic,
    handleUpdateUserStats,
    handleLogoutProfile
  };
}
