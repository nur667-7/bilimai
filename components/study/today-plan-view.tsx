"use client";

import { ArrowRight, Calendar, GitBranch, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PixelKnowledgeMosaic, PixelProgressBar } from "@/components/pixel-mosaic";
import { SubjectIcon } from "@/app/unt-exam-view";
import { untTopicIds, type Language, type Lesson, type TopicId } from "@/lib/lessons";
import { buildBaselineRoadmap, reviewSchedule, topicName } from "@/lib/error-lab";
import { UNT_SUBJECTS, type UntSubjectId } from "@/lib/unt-all-subjects";
import type { StudyCopyLang } from "@/lib/study-copy";
import type { ClaudeRoadmap } from "@/lib/study-store";
import type { WorkspaceTab } from "@/lib/use-study-navigation";

export type BaselineRoadmap = ReturnType<typeof buildBaselineRoadmap>;
export type ReviewScheduleItem = ReturnType<typeof reviewSchedule>[number];

export interface TodayPlanViewProps {
  lang: Language;
  tab: WorkspaceTab;
  lesson: Lesson;
  examSubjectId: UntSubjectId;
  hasLearningHistory: boolean;
  isPlanAssessed: boolean;
  showExamplePlan: boolean;
  topicHasActivity: boolean;
  solvedCount: number;
  checkedCount: number;
  soloReviews: number;
  continueModeLabel: string;
  baseline: BaselineRoadmap;
  nextDueReview: ReviewScheduleItem | null;
  interleavedQueue: { topic: TopicId; title: string }[];
  targetScore: number;
  weeksLeft: number;
  weakTopics: TopicId[];
  goalNote: string;
  consent: boolean;
  rmBusy: boolean;
  rmError: string;
  aiRoadmap: ClaudeRoadmap | null;
  t: StudyCopyLang;
  onSubjectChange: (subjectId: UntSubjectId) => void;
  onTabChange: (tab: string) => void;
  onOpenTopicLesson: (topic: TopicId) => void;
  onSetShowExamplePlan: (show: boolean) => void;
  onSetTargetScore: (score: number) => void;
  onSetWeeksLeft: (weeks: number) => void;
  onToggleWeakTopic: (topic: TopicId) => void;
  onSetGoalNote: (note: string) => void;
  onSetConsent: (consent: boolean) => void;
  onClearRoadmapError: () => void;
  onAskRoadmap: () => void;
}

export function TodayPlanView({
  lang,
  tab,
  lesson,
  examSubjectId,
  hasLearningHistory,
  isPlanAssessed,
  showExamplePlan,
  topicHasActivity,
  solvedCount,
  checkedCount,
  soloReviews,
  continueModeLabel,
  baseline,
  nextDueReview,
  interleavedQueue,
  targetScore,
  weeksLeft,
  weakTopics,
  goalNote,
  consent,
  rmBusy,
  rmError,
  aiRoadmap,
  t,
  onSubjectChange,
  onTabChange,
  onOpenTopicLesson,
  onSetShowExamplePlan,
  onSetTargetScore,
  onSetWeeksLeft,
  onToggleWeakTopic,
  onSetGoalNote,
  onSetConsent,
  onClearRoadmapError,
  onAskRoadmap
}: TodayPlanViewProps) {
  return (
    <div className="today-dashboard space-y-6">
      {!hasLearningHistory && tab === "today" ? (
        /* FIRST-TIME VISITOR VIEW ON / */
        <section className="surface section-surface today-hero-card" aria-label={t.navToday}>
          <div className="today-hero-layout">
            <div className="today-hero-copy">
              <span className="rule-label">{t.todayFirstEyebrow}</span>
              <h1 className="lesson-title mt-1">{t.todayFirstTitle}</h1>
              <p className="lesson-intro mt-2">{t.todayFirstSub}</p>

              <div className="today-primary-actions mt-5">
                <Button
                  size="lg"
                  onClick={() => {
                    onSubjectChange("math");
                    onOpenTopicLesson("linear");
                  }}
                >
                  <span>{t.todayStartBtn}</span>
                  <ArrowRight size={16} />
                </Button>
                <div className="today-check-math-wrap">
                  <Button
                    variant="outline"
                    onClick={() => {
                      onSubjectChange("math");
                      onTabChange("exam");
                    }}
                  >
                    <Target size={15} />
                    <span>{t.todayCheckMathBtn}</span>
                  </Button>
                  <span className="today-check-math-sub">{t.todayCheckMathSub}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    onSubjectChange("math");
                    onTabChange("graph");
                  }}
                >
                  <GitBranch size={15} />
                  <span>{t.todayPickTopicBtn}</span>
                </Button>
              </div>

              <p className="small text-muted-foreground mt-3 mb-0">
                {t.todayOptionalRegNote}{" "}
                <a href={`/welcome?lang=${lang}`} className="quiet-inline-link">
                  {t.navHowItWorks} →
                </a>
              </p>
            </div>

            {/* Signature Pixel-Block Mosaic Illustration (Filling knowledge gaps) */}
            <div className="today-hero-visual">
              <PixelKnowledgeMosaic />
              <div className="today-hero-progress-caption">
                <span className="small">{t.topics}</span>
                <PixelProgressBar value={3} max={16} segments={16} label={t.topics} />
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* RETURNING VISITOR VIEW ON / */
        <section className="surface section-surface today-continue-card" aria-label={t.todayContinueBadge}>
          <div className="today-hero-layout">
            <div className="today-hero-copy">
              <div className="lesson-meta-line">
                <span className="rule-label">{t.todayContinueBadge}</span>
                <span className="lesson-honest-status">
                  {topicHasActivity
                    ? t.statusAssessedShort(solvedCount, lesson.questions.length, soloReviews)
                    : t.statusNotAssessedShort}
                </span>
              </div>
              <h1 className="lesson-title mt-1">
                {t.todayContinueTitle(lesson.title, continueModeLabel)}
              </h1>
              <p className="lesson-intro mt-1">{lesson.intro}</p>

              <div className="today-primary-actions mt-4">
                <Button onClick={() => onTabChange(checkedCount > 0 ? "practice" : "lesson")}>
                  <span>{t.todayContinueBtn}</span>
                  <ArrowRight size={16} />
                </Button>
                <Button variant="outline" onClick={() => onTabChange("graph")}>
                  <GitBranch size={15} />
                  <span>{t.todaySwitchTopicBtn}</span>
                </Button>
                <Button variant="outline" onClick={() => onTabChange("exam")}>
                  <Target size={15} />
                  <span>{t.navExam}</span>
                </Button>
              </div>
            </div>
            <div className="today-hero-visual">
              <PixelKnowledgeMosaic />
            </div>
          </div>

          {/* Next Scheduled Review Line + Pixel Mastery Bar */}
          <div className="today-review-strip mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
            <span className="small">
              <strong>{t.todayNextReviewLabel}</strong>{" "}
              {nextDueReview ? topicName(nextDueReview.topic, lang) : t.todayNoDueReview}
            </span>
            <div className="flex items-center gap-3">
              <PixelProgressBar
                value={baseline.masteredTopics.length}
                max={16}
                segments={16}
                label={t.topics}
              />
              {nextDueReview && (
                <a
                  href={`/lab?lang=${lang}&topic=${nextDueReview.topic}`}
                  className="quiet-inline-link text-sm"
                >
                  {t.todayNextReviewBtn}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* SUBJECT PICKER (12 UNT SUBJECTS) */}
      <section className="surface section-surface" aria-label={t.todaySubjectsTitle}>
        <header className="mb-4">
          <h2 className="steps-heading m-0">{t.todaySubjectsTitle}</h2>
          <p className="small mt-1 mb-0">{t.todaySubjectsSub}</p>
        </header>

        <div className="today-subjects-grid">
          {UNT_SUBJECTS.map((subj) => {
            const isSelected = examSubjectId === subj.id;
            const isMath = subj.id === "math";
            return (
              <div
                key={subj.id}
                className={`today-subject-card ${isSelected ? "active" : ""}`}
              >
                <div className="today-subject-top">
                  <span className="unt-subject-icon-badge">
                    <SubjectIcon subjectId={subj.id} size={17} />
                  </span>
                  <div className="today-subject-meta">
                    <strong>{subj.title[lang]}</strong>
                    <span className="small block">
                      {subj.officialQuestions}{" "}
                      {lang === "kk" ? "сұрақ" : lang === "uz" ? "savol" : "вопр."} ·{" "}
                      {subj.officialMaxPoints}{" "}
                      {lang === "kk" ? "балл" : lang === "uz" ? "ball" : "б."}
                    </span>
                  </div>
                </div>
                <div className="today-subject-actions mt-3">
                  {isMath ? (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          onSubjectChange("math");
                          onTabChange("lesson");
                        }}
                      >
                        {t.todayOpenMathLessons}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          onSubjectChange("math");
                          onTabChange("exam");
                        }}
                      >
                        {t.navExam}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => {
                        onSubjectChange(subj.id);
                        onTabChange("exam");
                      }}
                    >
                      {t.todayOpenSubjectExam(subj.shortTitle[lang])}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* МОЙ ПЛАН (Clean Empty State before Diagnostics, or Priority Today + Collapsible Details) */}
      <section className="surface section-surface" aria-label={t.rmTitle}>
        <header className="lesson-head mb-4">
          <div className="lesson-meta-line">
            <span className="rule-label">
              <Calendar size={13} className="inline mr-1" />
              {t.rmTitle}
            </span>
            {showExamplePlan && !isPlanAssessed && (
              <span className="lesson-honest-status">{t.rmExampleBadge}</span>
            )}
          </div>
          <h2 className="steps-heading m-0">{t.rmTitle}</h2>
          <p className="small mt-1 mb-0">{t.rmSub}</p>
        </header>

        {!isPlanAssessed && !showExamplePlan ? (
          /* SHORT EMPTY STATE BEFORE DIAGNOSTICS */
          <div className="plan-empty-state-box">
            <h3 className="text-base font-semibold m-0">{t.rmEmptyTitle}</h3>
            <p className="small mt-1.5 mb-4">{t.rmEmptyBody}</p>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                onClick={() => {
                  onSubjectChange("math");
                  onTabChange("exam");
                }}
              >
                <Target size={15} />
                <span>{t.rmStartDiagnosticBtn}</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onSubjectChange("math");
                  onTabChange("graph");
                }}
              >
                <GitBranch size={15} />
                <span>{t.rmChooseTopicsSelfBtn}</span>
              </Button>
              <button
                type="button"
                className="quiet-text-action"
                onClick={() => onSetShowExamplePlan(true)}
              >
                {t.rmShowExampleBtn}
              </button>
            </div>
          </div>
        ) : (
          /* ASSESSED PLAN OR EXPLICIT EXAMPLE PLAN */
          <div>
            <div className="plan-status-banner mb-4">
              <p className="small m-0">
                {isPlanAssessed
                  ? t.rmAssessedBanner(baseline.masteredTopics.length)
                  : t.rmExampleBadge}
              </p>
              {!isPlanAssessed && showExamplePlan && (
                <button
                  type="button"
                  className="quiet-inline-link"
                  onClick={() => onSetShowExamplePlan(false)}
                >
                  {t.rmHideExampleBtn}
                </button>
              )}
            </div>

            {/* Block 1: What to do TODAY (Always visible first) */}
            <div className="plan-actions-section mb-5">
              <h3 className="steps-heading">{t.rmTodayTitle}</h3>
              <p className="small mb-3">{t.rmTodaySub}</p>

              <div className="plan-priority-list">
                {baseline.priorityModules
                  .filter((m) => m.phase === 1)
                  .slice(0, 3)
                  .map((m, idx) => (
                    <div key={m.topic} className="plan-priority-row">
                      <div className="plan-priority-info">
                        <span className="step-number">{String(idx + 1).padStart(2, "0")}</span>
                        <div>
                          <strong>{m.title}</strong>
                          <span className="small block">
                            {m.soloCount > 0 ? `${m.soloCount}/2` : t.statusNotAssessedShort}
                          </span>
                        </div>
                      </div>
                      <div className="plan-priority-btns">
                        <Button size="sm" onClick={() => onOpenTopicLesson(m.topic)}>
                          {t.rmOpenLesson}
                        </Button>
                        <a
                          href={`/lab?lang=${lang}&topic=${m.topic}`}
                          className="btn-ghost-sm"
                        >
                          {t.rmOpenLab}
                        </a>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-4">
                <span className="small font-medium block mb-1.5">{t.rmInterleavedLabel}</span>
                <div className="flex flex-wrap gap-1.5">
                  {interleavedQueue.map((item, idx) => (
                    <button
                      key={`${item.topic}-${idx}`}
                      type="button"
                      className="unt-combo-chip"
                      onClick={() => onOpenTopicLesson(item.topic)}
                    >
                      <span>
                        {idx + 1}. {item.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Block 2: Collapsible Goal, Weeks & Weak Topics Settings */}
            <details className="plan-collapsible-details mb-3">
              <summary>{t.rmScheduleAndSettingsSummary}</summary>
              <div className="plan-collapsible-body">
                <div className="plan-controls-grid mb-4">
                  <label htmlFor="target-score-input" className="flex flex-col gap-1 text-sm font-medium">
                    <span>{t.rmTarget}</span>
                    <input
                      id="target-score-input"
                      name="targetScore"
                      type="number"
                      min={20}
                      max={50}
                      value={targetScore}
                      className="lab-input"
                      onChange={(e) => onSetTargetScore(Number(e.target.value))}
                    />
                  </label>
                  <label htmlFor="weeks-left-input" className="flex flex-col gap-1 text-sm font-medium">
                    <span>{t.rmWeeks}</span>
                    <input
                      id="weeks-left-input"
                      name="weeksLeft"
                      type="number"
                      min={1}
                      max={24}
                      value={weeksLeft}
                      className="lab-input"
                      onChange={(e) => onSetWeeksLeft(Number(e.target.value))}
                    />
                  </label>
                  <div className="flex flex-col justify-end pb-1">
                    <span className="small font-medium">{t.rmPaceLabel(baseline.topicsPerWeek)}</span>
                  </div>
                </div>

                <div>
                  <span className="small font-semibold block mb-2">{t.rmWeak}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {untTopicIds.map((id) => (
                      <Button
                        key={id}
                        type="button"
                        size="sm"
                        variant={weakTopics.includes(id) ? "default" : "outline"}
                        aria-pressed={weakTopics.includes(id)}
                        onClick={() => onToggleWeakTopic(id)}
                      >
                        {topicName(id, lang)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </details>

            {/* Block 3: Collapsible "How this plan works" */}
            <details className="plan-collapsible-details mb-3">
              <summary>{t.rmHowDetailsSummary}</summary>
              <div className="plan-collapsible-body">
                <p className="small mb-2">{t.rmHowDetailsBody}</p>
                <a href={`/about?lang=${lang}`} className="quiet-inline-link">
                  {t.rmHowDetailsLink}
                </a>
              </div>
            </details>

            {/* Block 4: Collapsible AI Roadmap Customizer */}
            <details className="plan-collapsible-details" open={Boolean(aiRoadmap)}>
              <summary>{t.rmAiDetailsSummary}</summary>
              <div className="plan-collapsible-body">
                <form
                  className="ai-form"
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    onAskRoadmap();
                  }}
                >
                  <div className="quick-prompts">
                    {t.rmPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className="quick-pill"
                        onClick={() => {
                          onSetGoalNote(preset);
                          onSetConsent(true);
                          onClearRoadmapError();
                        }}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  <label htmlFor="roadmap-goal" className="form-label">
                    {t.rmGoal}
                  </label>
                  <textarea
                    id="roadmap-goal"
                    name="roadmapGoal"
                    value={goalNote}
                    maxLength={400}
                    placeholder={t.rmGoalPlaceholder}
                    onChange={(e) => onSetGoalNote(e.target.value)}
                  />
                  <div className="ai-meta-row">
                    <span className="small">{t.schoolPrivacyNote}</span>
                    <span className="small">{goalNote.length}/400</span>
                  </div>

                  <label className="checkline" onClick={onClearRoadmapError}>
                    <Checkbox checked={consent} onCheckedChange={(v) => onSetConsent(v === true)} />
                    <span>
                      {t.consent}{" "}
                      <a href={`/privacy?lang=${lang}`} onClick={(e) => e.stopPropagation()}>
                        {t.privacy}
                      </a>
                    </span>
                  </label>

                  <div className="practice-actions">
                    <Button type="submit" disabled={rmBusy}>
                      <Sparkles size={15} />
                      {rmBusy ? t.loading : t.rmGenerate}
                    </Button>
                  </div>
                </form>

                {rmError && (
                  <p role="alert" className="feedback wrong mt-3">
                    {rmError}
                  </p>
                )}

                {aiRoadmap && (
                  <section aria-live="polite" className="response mt-4">
                    <span className="rule-label">
                      {aiRoadmap.source === "claude" ? t.badgeLive : t.badgePreview}
                    </span>
                    <h3 className="steps-heading mt-1 mb-2">{t.rmClaudeTitle}</h3>
                    <p className="mt-1 mb-3">{aiRoadmap.summary}</p>
                    <ul className="list-disc pl-5 my-2 space-y-1">
                      {aiRoadmap.priorityModules.map((pm) => (
                        <li key={pm.topic}>
                          <strong>{topicName(pm.topic, lang)}:</strong> {pm.reason} →{" "}
                          <em>{pm.recommendedAction}</em>
                        </li>
                      ))}
                    </ul>
                    <strong className="block mt-3">{t.rmMilestones}</strong>
                    <ol className="list-decimal pl-5 my-2 space-y-1">
                      {aiRoadmap.weeklyMilestones.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ol>
                    <strong className="block mt-3">{t.rmHabit}</strong>
                    <p className="mt-1 mb-0">{aiRoadmap.dailyHabit}</p>
                  </section>
                )}
              </div>
            </details>
          </div>
        )}
      </section>
    </div>
  );
}
