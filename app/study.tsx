"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { z } from "zod";
import { SiteFooter } from "@/components/site-footer";
import { useAniqTheme } from "@/components/hero-canvas";
import {
  LearnSubnav,
  MobileBottomNav,
  StudyHeader
} from "@/components/study/study-header";
import { TodayPlanView } from "@/components/study/today-plan-view";
import { LessonPracticeView } from "@/components/study/lesson-practice-view";
import { ProfileView } from "@/components/study/profile-view";
import { lessons, untTopicIds, type Language, type TopicId } from "@/lib/lessons";
import { getTopicErrorReasonId } from "@/lib/error-lab";
import { UNT_SUBJECTS, type UntSubjectId } from "@/lib/unt-all-subjects";
import { buildBjorkInterleavedList } from "@/lib/scientific-pedagogy";
import { getStudyErrorText, getTopicAiPrompts, studyCopy } from "@/lib/study-copy";
import { useStudyStore } from "@/lib/study-store";
import {
  useStudyNavigation,
  type WorkspaceTab
} from "@/lib/use-study-navigation";
import { UntExamView } from "@/app/unt-exam-view";
import { KnowledgeGraphView } from "@/app/knowledge-graph-view";
import { XrayTrapView } from "@/app/xray-trap-view";

export type { WorkspaceTab };

type WebContext = {
  registerTool: (
    tool: {
      name: string;
      description: string;
      inputSchema: object;
      annotations: object;
      execute: (input: unknown) => unknown;
    },
    options: { signal: AbortSignal }
  ) => void | Promise<void>;
};

export interface StudyProps {
  initialLang?: Language;
  initialTab?: WorkspaceTab;
  initialTopic?: TopicId;
  initialSubjectId?: UntSubjectId;
  initialVariantNumber?: number;
}

export default function Study({
  initialLang = "ru",
  initialTab = "today",
  initialTopic = "linear",
  initialSubjectId = "math",
  initialVariantNumber = 1
}: StudyProps = {}) {
  const { dark, toggleTheme } = useAniqTheme();
  const controller = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const activeTopicRef = useRef<TopicId>(initialTopic);
  const dispatchRef = useRef<((action: { type: "RESET_TOPIC_SESSION"; topic: TopicId } | { type: "MARK_INTERACTED" } | { type: "CLEAR_ROADMAP_ERROR" }) => void) | null>(null);

  const handleBeforeNavigate = useCallback(() => {
    generation.current++;
    controller.current?.abort();
    dispatchRef.current?.({ type: "RESET_TOPIC_SESSION", topic: activeTopicRef.current });
    dispatchRef.current?.({ type: "CLEAR_ROADMAP_ERROR" });
  }, []);

  const handleMarkInteracted = useCallback(() => {
    dispatchRef.current?.({ type: "MARK_INTERACTED" });
  }, []);

  const {
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
  } = useStudyNavigation({
    initialLang,
    initialTab,
    initialTopic,
    initialSubjectId,
    initialVariantNumber,
    onBeforeNavigate: handleBeforeNavigate,
    onMarkInteracted: handleMarkInteracted
  });

  const {
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
  } = useStudyStore(topic, lang);

  useEffect(() => {
    activeTopicRef.current = topic;
    dispatchRef.current = dispatch;
  }, [topic, dispatch]);

  const current = useRef({ topic, language: lang });
  useEffect(() => {
    current.current = { topic, language: lang };
  }, [topic, lang]);

  // WebMCP tool registration for reading current lesson
  useEffect(() => {
    const ctx = (document as Document & { modelContext?: WebContext }).modelContext;
    if (!ctx?.registerTool) return;
    const life = new AbortController();
    try {
      Promise.resolve(
        ctx.registerTool(
          {
            name: "get_current_lesson",
            description:
              "Read the UNT mathematics lesson currently visible in BilimAI. Does not send anything to Claude.",
            inputSchema: { type: "object", properties: {}, additionalProperties: false },
            annotations: { readOnlyHint: true, untrustedContentHint: false },
            execute(input) {
              if (
                !input ||
                typeof input !== "object" ||
                Array.isArray(input) ||
                Object.keys(input).length
              ) {
                throw new Error("Expected an empty object");
              }
              const s = current.current;
              const l = lessons[s.language].find((x) => x.id === s.topic)!;
              return {
                topic: s.topic,
                language: s.language,
                section: l.section,
                title: l.title,
                rule: l.rule
              };
            }
          },
          { signal: life.signal }
        )
      ).catch(() => {});
    } catch {}
    return () => life.abort();
  }, []);

  useEffect(() => () => controller.current?.abort(), []);

  const lesson = lessons[lang].find((l) => l.id === topic)!;
  const topicIndex = lessons[lang].findIndex((l) => l.id === topic);
  const nextTopicObj = lessons[lang][(topicIndex + 1) % lessons[lang].length];
  const nextTopicId = nextTopicObj.id;
  const t = studyCopy[lang];

  const solvedCount = lesson.questions.filter(
    (q, i) => currentPractice.checkedMap[i] && currentPractice.answers[i] === String(q.correct)
  ).length;
  const checkedCount = Object.keys(currentPractice.checkedMap).length;

  const currentSubjectMeta = useMemo(
    () =>
      UNT_SUBJECTS.find((s) => s.id === examSubjectId) ??
      UNT_SUBJECTS.find((s) => s.id === "math")!,
    [examSubjectId]
  );

  const topicStatusInfo = useMemo(() => {
    const topicRecords = state.labProgress.records.filter((r) => r.topic === topic);
    const soloReviews = topicRecords.filter((r) => r.independent).length;
    const untRatio = state.untStorage.lastAttempt?.topicRatios?.[topic];
    const hasActivity = soloReviews > 0 || solvedCount > 0 || untRatio !== undefined;
    return { hasActivity, soloReviews };
  }, [state.labProgress.records, state.untStorage.lastAttempt, topic, solvedCount]);

  const topicErrorCause = useMemo(
    () => errorCauses.find((c) => c.topic === topic) ?? null,
    [errorCauses, topic]
  );

  const isPlanAssessed =
    state.untStorage.lastAttempt !== null ||
    state.labProgress.records.length > 0 ||
    state.weakTopics.length > 0 ||
    checkedCount > 0;

  const hasLearningHistory =
    isPlanAssessed || state.hasInteracted || Boolean(state.userProfile?.name);

  const topicAiPrompts = useMemo(
    () => getTopicAiPrompts(lang, lesson.title, lesson.example),
    [lang, lesson.title, lesson.example]
  );

  const interleavedQueue = useMemo(() => {
    const items = baseline.priorityModules.map((m) => ({
      topic: m.topic,
      title: m.title,
      phase: m.phase,
      soloCount: m.soloCount
    }));
    return buildBjorkInterleavedList(items).slice(0, 6);
  }, [baseline.priorityModules]);

  const openTopicPractice = useCallback(
    (targetTopic: TopicId) => {
      setTopic(targetTopic);
      handleTabChange("practice");
    },
    [setTopic, handleTabChange]
  );

  const runExplainQuery = useCallback(
    async (
      rawQuestion: string,
      overrideConsent?: boolean,
      followUpMode?: "simpler_example" | "socratic_question"
    ) => {
      if (state.busy) return;
      const isConsented = overrideConsent ?? state.consent;
      if (!isConsented || rawQuestion.trim().length < 3) {
        dispatch({ type: "AI_REQUEST_ERROR", error: getStudyErrorText(lang, "input") });
        return;
      }
      const version = generation.current;
      controller.current = new AbortController();
      dispatch({ type: "AI_REQUEST_START" });

      const activeQObj = lesson.questions[currentPractice.activeQ] ?? lesson.questions[0];
      const selectedIdx = currentPractice.answers[currentPractice.activeQ];
      const chosenOptionText =
        selectedIdx !== undefined ? activeQObj.options[Number(selectedIdx)] : undefined;
      const learnerAttempt =
        currentPractice.activeQ === 3 && currentPractice.transferInput.trim()
          ? currentPractice.transferInput.trim().slice(0, 120)
          : chosenOptionText
            ? chosenOptionText.slice(0, 120)
            : undefined;
      const taskText =
        currentPractice.activeQ === 3
          ? transferChallenge.transfer.slice(0, 320)
          : (activeQObj?.text ?? lesson.example).slice(0, 320);
      const hintsAlreadyShown =
        Object.keys(currentPractice.expandedErrorMap).length +
        (currentPractice.showTransferRule ? 1 : 0);

      const historyTurns = state.aiHistory
        .flatMap((turn) => [
          { role: "user" as const, text: turn.question.slice(0, 400) },
          { role: "assistant" as const, text: turn.answer.explanation.slice(0, 400) }
        ])
        .slice(-6);

      try {
        const res = await fetch("/api/explain", {
          method: "POST",
          headers: { "content-type": "application/json" },
          signal: controller.current.signal,
          body: JSON.stringify({
            topic,
            language: lang,
            question: rawQuestion.trim(),
            taskContext: {
              taskText,
              ...(learnerAttempt ? { learnerAttempt } : {}),
              stage:
                currentPractice.activeQ === 3
                  ? "transfer"
                  : checkedCount > 0
                    ? "practice"
                    : "lesson",
              errorReason: getTopicErrorReasonId(topic),
              hintsAlreadyShown: Math.min(10, hintsAlreadyShown)
            },
            ...(historyTurns.length > 0 ? { history: historyTurns } : {}),
            ...(followUpMode ? { followUpMode } : {}),
            adult: true,
            consent: true
          })
        });
        const data = z
          .object({
            error: z.string().optional(),
            explanation: z.string().optional(),
            hint: z.string().optional(),
            errorType: z.string().optional(),
            socraticQuestion: z.string().optional(),
            nextAction: z.string().optional(),
            source: z.string().optional()
          })
          .parse(await res.json());
        if (version !== generation.current) return;
        if (!res.ok) throw new Error(getStudyErrorText(lang, data.error));
        if (!data.explanation || !data.hint) throw new Error("Invalid response");
        dispatch({
          type: "AI_REQUEST_SUCCESS",
          question: rawQuestion.trim(),
          answer: {
            explanation: data.explanation,
            hint: data.hint,
            errorType: data.errorType,
            socraticQuestion: data.socraticQuestion,
            nextAction: data.nextAction,
            source: data.source
          }
        });
      } catch (e) {
        if (
          version === generation.current &&
          !(e instanceof Error && e.name === "AbortError")
        ) {
          dispatch({
            type: "AI_REQUEST_ERROR",
            error: e instanceof Error ? e.message : "Ошибка сети"
          });
        }
      }
    },
    [
      state.busy,
      state.consent,
      state.aiHistory,
      currentPractice,
      lesson,
      transferChallenge.transfer,
      checkedCount,
      lang,
      topic,
      dispatch
    ]
  );

  const askWithPrefill = useCallback(
    (prefilled: string) => {
      dispatch({ type: "SET_CONSENT", consent: true });
      dispatch({ type: "SET_AI_QUESTION", question: prefilled });
      handleTabChange("ai");
      void runExplainQuery(prefilled, true);
    },
    [dispatch, handleTabChange, runExplainQuery]
  );

  const askRoadmap = useCallback(async () => {
    if (state.rmBusy) return;
    if (!state.consent || state.goalNote.trim().length < 3) {
      dispatch({ type: "ROADMAP_REQUEST_ERROR", error: getStudyErrorText(lang, "input") });
      return;
    }
    dispatch({ type: "ROADMAP_REQUEST_START" });
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          language: lang,
          targetScore: state.targetScore,
          weeksLeft: state.weeksLeft,
          weakTopics: state.weakTopics.length > 0 ? state.weakTopics : ["linear", "quadratic"],
          masteredTopics: baseline.masteredTopics.filter(
            (item) => !state.weakTopics.includes(item)
          ),
          goalNote: state.goalNote.trim(),
          adult: true,
          consent: true
        })
      });
      const raw = await res.json();
      if (!res.ok) {
        const errObj = z.object({ error: z.string().optional() }).safeParse(raw);
        throw new Error(getStudyErrorText(lang, errObj.success ? errObj.data.error : undefined));
      }
      const parsed = z
        .object({
          summary: z.string(),
          priorityModules: z.array(
            z.object({
              topic: z.enum(untTopicIds),
              reason: z.string(),
              recommendedAction: z.string()
            })
          ),
          weeklyMilestones: z.array(z.string()),
          dailyHabit: z.string(),
          source: z.string().optional()
        })
        .parse(raw);
      dispatch({ type: "ROADMAP_REQUEST_SUCCESS", roadmap: parsed });
    } catch (e) {
      dispatch({
        type: "ROADMAP_REQUEST_ERROR",
        error: e instanceof Error ? e.message : "Ошибка сети"
      });
    }
  }, [
    state.rmBusy,
    state.consent,
    state.goalNote,
    state.targetScore,
    state.weeksLeft,
    state.weakTopics,
    baseline.masteredTopics,
    lang,
    dispatch
  ]);

  const continueModeLabel =
    checkedCount > 0 || tab === "practice"
      ? t.todayContinueModePractice(
          Math.min(currentPractice.activeQ + 1, 3),
          lesson.questions.length
        )
      : t.todayContinueModeLesson;

  return (
    <div className="textbook-shell has-mobile-bottom-nav">
      <StudyHeader
        lang={lang}
        tab={tab}
        topic={topic}
        dark={dark}
        isTodaySection={isTodaySection}
        isLearnSection={isLearnSection}
        isExamSection={isExamSection}
        isProfileSection={isProfileSection}
        t={t}
        onToggleTheme={toggleTheme}
        onSelectLanguage={selectLanguage}
        onTabChange={handleTabChange}
      />

      <main id="workspace-anchor" className="wrap main-container">
        <div id="workspace-stage-top" />

        {isLearnSection && (
          <LearnSubnav
            lang={lang}
            tab={tab}
            topic={topic}
            examSubjectId={examSubjectId}
            currentSubjectMeta={currentSubjectMeta}
            t={t}
            onTabChange={handleTabChange}
            onSubjectChange={handleSubjectChange}
          />
        )}

        {isTodaySection ? (
          <TodayPlanView
            lang={lang}
            tab={tab}
            lesson={lesson}
            examSubjectId={examSubjectId}
            hasLearningHistory={hasLearningHistory}
            isPlanAssessed={isPlanAssessed}
            showExamplePlan={state.showExamplePlan}
            topicHasActivity={topicStatusInfo.hasActivity}
            solvedCount={solvedCount}
            checkedCount={checkedCount}
            soloReviews={topicStatusInfo.soloReviews}
            continueModeLabel={continueModeLabel}
            baseline={baseline}
            smartDailySession={smartDailySession}
            errorCauses={errorCauses}
            nextDueReview={nextDueReview}
            interleavedQueue={interleavedQueue}
            targetScore={state.targetScore ?? 40}
            weeksLeft={state.weeksLeft ?? 8}
            weakTopics={state.weakTopics}
            goalNote={state.goalNote}
            consent={state.consent}
            rmBusy={state.rmBusy}
            rmError={state.rmError}
            aiRoadmap={state.aiRoadmap}
            t={t}
            onSubjectChange={handleSubjectChange}
            onTabChange={handleTabChange}
            onOpenTopicLesson={openTopicLesson}
            onOpenTopicPractice={openTopicPractice}
            onSetShowExamplePlan={(show) => dispatch({ type: "SET_SHOW_EXAMPLE_PLAN", show })}
            onSetTargetScore={(targetScore) =>
              dispatch({ type: "SET_TARGET_SCORE", targetScore })
            }
            onSetWeeksLeft={(weeksLeft) => dispatch({ type: "SET_WEEKS_LEFT", weeksLeft })}
            onToggleWeakTopic={handleToggleWeakTopic}
            onSetGoalNote={(goalNote) => dispatch({ type: "SET_GOAL_NOTE", goalNote })}
            onSetConsent={(consent) => dispatch({ type: "SET_CONSENT", consent })}
            onClearRoadmapError={() => dispatch({ type: "CLEAR_ROADMAP_ERROR" })}
            onAskRoadmap={() => void askRoadmap()}
          />
        ) : isLessonOrPracticeOrAi ? (
          <LessonPracticeView
            lang={lang}
            tab={tab}
            topic={topic}
            topicIndex={topicIndex}
            lesson={lesson}
            nextTopicObj={nextTopicObj}
            nextTopicId={nextTopicId}
            topicHasActivity={topicStatusInfo.hasActivity}
            solvedCount={solvedCount}
            checkedCount={checkedCount}
            soloReviews={topicStatusInfo.soloReviews}
            practice={currentPractice}
            transferChallenge={transferChallenge}
            topicErrorCause={topicErrorCause}
            topicAiPrompts={topicAiPrompts}
            question={state.question}
            consent={state.consent}
            busy={state.busy}
            error={state.error}
            answer={state.answer}
            aiHistory={state.aiHistory}
            t={t}
            onSelectTopic={selectTopic}
            onTabChange={handleTabChange}
            onSetActiveQ={(activeQ) =>
              dispatch({ type: "SET_ACTIVE_QUESTION", topic, activeQ })
            }
            onSelectOption={(qIdx, value) =>
              dispatch({ type: "SELECT_OPTION", topic, qIdx, value })
            }
            onCheckQuestion={(qIdx, isCorrect, wrongAnswerText) =>
              dispatch({ type: "CHECK_QUESTION", topic, qIdx, isCorrect, wrongAnswerText })
            }
            onRetryQuestion={(qIdx) => dispatch({ type: "RETRY_QUESTION", topic, qIdx })}
            onExpandErrorNote={(qIdx) => dispatch({ type: "EXPAND_ERROR_NOTE", topic, qIdx })}
            onSetTransferInput={(value) =>
              dispatch({ type: "SET_TRANSFER_INPUT", topic, value })
            }
            onCheckTransfer={() =>
              dispatch({
                type: "CHECK_TRANSFER",
                topic,
                expectedAnswer: transferChallenge.answer
              })
            }
            onShowTransferRule={() => dispatch({ type: "SHOW_TRANSFER_RULE", topic })}
            onNextTransferVariant={() => dispatch({ type: "NEXT_TRANSFER_VARIANT", topic })}
            onSetQuestion={(question) => dispatch({ type: "SET_AI_QUESTION", question })}
            onSetConsent={(consent) => dispatch({ type: "SET_CONSENT", consent })}
            onClearAiError={() => dispatch({ type: "CLEAR_AI_ERROR" })}
            onRunExplainQuery={(q, mode) => void runExplainQuery(q, mode ? true : undefined, mode)}
            onResetAiDialogue={() => dispatch({ type: "RESET_AI_DIALOGUE" })}
            onAskWithPrefill={askWithPrefill}
          />
        ) : tab === "xray" ? (
          <section className="surface section-surface" aria-label={t.subXray}>
            <XrayTrapView
              lang={lang}
              lastUntScaled50={state.untStorage.lastAttempt?.scaledScore50 ?? null}
              masteredTopicsCount={baseline.masteredTopics.length}
              weakTopics={state.weakTopics}
              userProfile={state.userProfile}
              onUpdateStats={handleUpdateUserStats}
              onSelectTopic={(tId) => openTopicLesson(tId)}
              onAskClaude={(tId, promptText) => {
                setTopic(tId);
                askWithPrefill(promptText);
              }}
            />
          </section>
        ) : tab === "graph" ? (
          <section className="surface section-surface" aria-label={t.subGraph}>
            <KnowledgeGraphView
              lang={lang}
              progress={state.labProgress}
              untAttempt={state.untStorage.lastAttempt}
              weakTopics={state.weakTopics}
              selectedTopic={topic}
              onSelectTopic={setTopic}
              onOpenLesson={openTopicLesson}
              onOpenExam={() => handleTabChange("exam")}
              onToggleWeakTopic={handleToggleWeakTopic}
            />
          </section>
        ) : tab === "exam" ? (
          <section className="surface section-surface" aria-label={t.navExam}>
            <UntExamView
              lang={lang}
              lastSavedAttempt={state.untStorage.lastAttempt}
              initialTopic={topic}
              initialSubjectId={examSubjectId}
              initialVariantNumber={examVariantNumber}
              onSubjectChange={handleSubjectChange}
              onCompleteExam={handleCompleteUntExam}
              onOpenGraph={(focusTopic) => {
                if (focusTopic) setTopic(focusTopic);
                handleTabChange("graph");
              }}
              onOpenLesson={openTopicLesson}
            />
          </section>
        ) : (
          <ProfileView
            lang={lang}
            returnToPath={returnToPath}
            userProfile={state.userProfile}
            masteredTopicsCount={baseline.masteredTopics.length}
            labRecordsCount={state.labProgress.records.length}
            examAttemptsCount={state.untStorage.history.length}
            t={t}
            onSelectLanguage={selectLanguage}
            onToggleTheme={toggleTheme}
            onLogout={handleLogoutProfile}
          />
        )}
      </main>

      <MobileBottomNav
        isTodaySection={isTodaySection}
        isLearnSection={isLearnSection}
        isExamSection={isExamSection}
        isProfileSection={isProfileSection}
        t={t}
        onTabChange={handleTabChange}
      />

      <SiteFooter lang={lang} topic={topic} compact />
    </div>
  );
}
