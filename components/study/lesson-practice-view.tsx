"use client";

import { ArrowRight, Check, CheckCircle2, RotateCcw, Sparkles, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PixelProgressBar } from "@/components/pixel-mosaic";
import { getOptionFeedback, lessons, type Language, type Lesson, type TopicId } from "@/lib/lessons";
import { formatLabTask, type Challenge, type ErrorCauseSummaryItem } from "@/lib/error-lab";
import type { StudyCopyLang } from "@/lib/study-copy";
import type { TopicPracticeSession, TutorAnswerPayload, TutorDialogueTurn } from "@/lib/study-store";
import type { WorkspaceTab } from "@/lib/use-study-navigation";

const optionLetters = ["A", "B", "C", "D"];

export interface LessonPracticeViewProps {
  lang: Language;
  tab: WorkspaceTab;
  topic: TopicId;
  topicIndex: number;
  lesson: Lesson;
  nextTopicObj: Lesson;
  nextTopicId: TopicId;
  topicHasActivity: boolean;
  solvedCount: number;
  checkedCount: number;
  soloReviews: number;
  practice: TopicPracticeSession;
  transferChallenge: Challenge;
  topicErrorCause: ErrorCauseSummaryItem | null;
  topicAiPrompts: { placeholder: string; quick: string[] };
  question: string;
  consent: boolean;
  busy: boolean;
  error: string;
  answer: TutorAnswerPayload | null;
  aiHistory: TutorDialogueTurn[];
  t: StudyCopyLang;
  onSelectTopic: (topic: TopicId) => void;
  onTabChange: (tab: string) => void;
  onSetActiveQ: (qIdx: number) => void;
  onSelectOption: (qIdx: number, value: string) => void;
  onCheckQuestion: (qIdx: number, isCorrect?: boolean, wrongAnswerText?: string) => void;
  onRetryQuestion: (qIdx: number) => void;
  onExpandErrorNote: (qIdx: number) => void;
  onSetTransferInput: (value: string) => void;
  onCheckTransfer: () => void;
  onShowTransferRule: () => void;
  onNextTransferVariant: () => void;
  onSetQuestion: (q: string) => void;
  onSetConsent: (c: boolean) => void;
  onClearAiError: () => void;
  onRunExplainQuery: (
    questionText: string,
    followUpMode?: "simpler_example" | "socratic_question"
  ) => void;
  onResetAiDialogue: () => void;
  onAskWithPrefill: (prefilled: string) => void;
}

export function LessonPracticeView({
  lang,
  tab,
  topic,
  topicIndex,
  lesson,
  nextTopicObj,
  nextTopicId,
  topicHasActivity,
  solvedCount,
  checkedCount,
  soloReviews,
  practice,
  transferChallenge,
  topicErrorCause,
  topicAiPrompts,
  question,
  consent,
  busy,
  error,
  answer,
  aiHistory,
  t,
  onSelectTopic,
  onTabChange,
  onSetActiveQ,
  onSelectOption,
  onCheckQuestion,
  onRetryQuestion,
  onExpandErrorNote,
  onSetTransferInput,
  onCheckTransfer,
  onShowTransferRule,
  onNextTransferVariant,
  onSetQuestion,
  onSetConsent,
  onClearAiError,
  onRunExplainQuery,
  onResetAiDialogue,
  onAskWithPrefill
}: LessonPracticeViewProps) {
  const {
    activeQ,
    answers,
    checkedMap,
    expandedErrorMap,
    practiceNotice,
    practiceSeed,
    transferInput,
    transferStatus,
    showTransferRule
  } = practice;

  const currentQuestionObj = lesson.questions[activeQ] ?? lesson.questions[0];
  const isCurrentChecked = Boolean(checkedMap[activeQ]);
  const selectedVal = answers[activeQ];
  const isCurrentCorrect =
    isCurrentChecked && selectedVal === String(currentQuestionObj.correct);
  const diagnosticMessage =
    isCurrentChecked && selectedVal !== undefined
      ? getOptionFeedback(topic, activeQ, Number(selectedVal), lang)
      : "";

  return (
    <>
      {/* Mobile Topic Selector */}
      <div className="mobile-topic-bar">
        <label htmlFor="mobile-lesson-select">{t.mobileTopicLabel}</label>
        <select
          id="mobile-lesson-select"
          name="mobileLessonSelect"
          className="mobile-topic-select"
          value={topic}
          onChange={(e) => onSelectTopic(e.target.value as TopicId)}
        >
          {lessons[lang].map((l, idx) => (
            <option key={l.id} value={l.id}>
              {String(idx + 1).padStart(2, "0")}. {l.title}
            </option>
          ))}
        </select>
      </div>

      <div className="workspace">
        {/* Topic List: Unboxed Textbook Table of Contents (All 16 UNT Sections) */}
        <aside className="topics" aria-label={t.topics}>
          <h2 className="topics-heading">{t.topics}</h2>
          <div className="topics-list">
            {lessons[lang].map((l, i) => (
              <button
                key={l.id}
                type="button"
                className={`topic ${topic === l.id ? "active" : ""}`}
                aria-pressed={topic === l.id}
                onClick={() => onSelectTopic(l.id)}
              >
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <span className="topic-title">
                  <span>{l.title}</span>
                  <small>{l.section}</small>
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Single Main Study Surface */}
        <article className="surface" aria-label={lesson.title}>
          <header className="lesson-head">
            <div className={`lesson-meta-line ${tab !== "lesson" ? "hide-in-practice-mobile" : ""}`}>
              <span className="topic-index-label">
                {t.lessonBreadcrumbPrefix} → {String(topicIndex + 1).padStart(2, "0")}.{" "}
                {lesson.title} ({lesson.section})
              </span>
              <span className="lesson-honest-status">
                {topicHasActivity
                  ? t.statusAssessedShort(solvedCount, lesson.questions.length, soloReviews)
                  : t.statusNotAssessedShort}
              </span>
            </div>
            <h1 className="lesson-title">{lesson.title}</h1>
            <p className={`lesson-action-subtitle ${tab !== "lesson" ? "hide-in-practice-mobile" : ""}`}>
              {t.lessonActionSubtitle}
            </p>
            <p className={`lesson-intro ${tab !== "lesson" ? "hide-in-practice-mobile" : ""}`}>
              {lesson.intro}
            </p>
          </header>

          {/* Inside the lesson: 3 calm modes for the current topic */}
          <Tabs value={tab} onValueChange={onTabChange}>
            <TabsList className="tabsbar">
              <TabsTrigger value="lesson">{t.lesson}</TabsTrigger>
              <TabsTrigger value="practice">{t.practice}</TabsTrigger>
              <TabsTrigger value="ai">{t.ai}</TabsTrigger>
            </TabsList>

            {/* TAB 1: РАЗБОР */}
            <TabsContent value="lesson">
              <div className="rule">
                <span className="rule-label">{t.rule}</span>
                <p className="rule-body">{lesson.rule}</p>
              </div>

              <div className="math-stage">
                <span className="math-stage-label">{t.exampleLabel}</span>
                <div className="equation" aria-label={t.exampleLabel}>
                  {lesson.example}
                </div>
              </div>

              <div className="steps-section">
                <h2 className="steps-heading">{t.exampleSteps}</h2>
                <ol className="steps">
                  {lesson.steps.map((step, i) => (
                    <li key={step}>
                      <span className="step-number">{String(i + 1).padStart(2, "0")}</span>
                      <span className="step-text">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <p className="notebook-margin-note">{t.note}</p>

              <div className="lesson-footer-action">
                <Button
                  onClick={() => {
                    onTabChange("practice");
                    onSetActiveQ(0);
                  }}
                >
                  {t.solveSelf}
                  <ArrowRight size={16} />
                </Button>
                <button
                  type="button"
                  className="quiet-text-action"
                  onClick={() => onTabChange("ai")}
                >
                  {t.askAboutRule}
                </button>
              </div>
            </TabsContent>

            {/* TAB 2: ПРАКТИКА */}
            <TabsContent value="practice">
              <div className="practice-instruction-row mb-3">
                <p className="practice-instruction-text m-0">
                  {t.practicePurposeNote}
                </p>
                <details className="how-it-works-details">
                  <summary>{t.howItWorksToggle}</summary>
                  <p>{t.howItWorksPracticeDetails}</p>
                </details>
              </div>

              <div className="practice-header-bar">
                <div className="flex items-center gap-3">
                  <span className="practice-counter">
                    {activeQ < 3
                      ? `${t.taskProgress} ${activeQ + 1} ${t.ofLabel} ${lesson.questions.length}`
                      : t.transferTitle}
                  </span>
                  <div className="w-24 hidden sm:block">
                    <PixelProgressBar
                      value={solvedCount}
                      max={Math.max(1, lesson.questions.length)}
                      segments={6}
                      label={t.practice}
                    />
                  </div>
                </div>
                <div className="practice-step-dots" role="tablist" aria-label={t.practice}>
                  {lesson.questions.map((q, idx) => {
                    const done = checkedMap[idx] && answers[idx] === String(q.correct);
                    const hasErr = checkedMap[idx] && answers[idx] !== String(q.correct);
                    return (
                      <button
                        key={q.text}
                        type="button"
                        role="tab"
                        aria-selected={activeQ === idx}
                        className={`practice-dot ${activeQ === idx ? "active" : ""} ${done ? "done" : ""} ${hasErr ? "err" : ""}`}
                        onClick={() => onSetActiveQ(idx)}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeQ === 3}
                    className={`practice-dot extra ${activeQ === 3 ? "active" : ""} ${transferStatus === "right" ? "done" : ""}`}
                    onClick={() => onSetActiveQ(3)}
                  >
                    {t.extraTaskTab}
                  </button>
                </div>
              </div>

              {activeQ < 3 ? (
                <div className="practice-stage" key={`q-${activeQ}`}>
                  <div className="practice-math-stem" id={`q${activeQ}`}>
                    {currentQuestionObj.text}
                  </div>

                  <RadioGroup
                    className="options-stack"
                    aria-labelledby={`q${activeQ}`}
                    value={selectedVal ?? ""}
                    disabled={isCurrentChecked}
                    onValueChange={(v) => onSelectOption(activeQ, v)}
                  >
                    {currentQuestionObj.options.map((option, j) => {
                      const isSelected = selectedVal === String(j);
                      const isOptionCorrect = j === currentQuestionObj.correct;
                      const stateClass = isCurrentChecked
                        ? isOptionCorrect
                          ? "option-correct"
                          : isSelected
                            ? "option-wrong"
                            : ""
                        : "";
                      return (
                        <label
                          className={`option ${stateClass}`}
                          key={option}
                          data-selected={isSelected}
                          onClick={() => {
                            if (!isCurrentChecked) {
                              onSelectOption(activeQ, String(j));
                            }
                          }}
                        >
                          <RadioGroupItem
                            value={String(j)}
                            id={`q${activeQ}a${j}`}
                            className="sr-only"
                          />
                          <span className="option-badge">{optionLetters[j] ?? j + 1}</span>
                          <span className="option-math-text">{option}</span>
                          <span className="option-status-indicator" aria-hidden="true">
                            {isCurrentChecked ? (
                              isOptionCorrect ? (
                                <Check size={14} />
                              ) : isSelected ? (
                                <X size={14} />
                              ) : null
                            ) : isSelected ? (
                              t.selectedIndicator
                            ) : null}
                          </span>
                        </label>
                      );
                    })}
                  </RadioGroup>

                  {practiceNotice && !isCurrentChecked && selectedVal === undefined && (
                    <div role="status" className="feedback wrong">
                      {t.chooseOptionPrompt}
                    </div>
                  )}

                  {isCurrentChecked && (
                    <div
                      role="status"
                      className={`feedback ${isCurrentCorrect ? "correct" : "wrong"}`}
                    >
                      <strong className="feedback-heading">
                        {isCurrentCorrect ? t.correctTitle : t.wrongTitle}
                      </strong>
                      <p className="feedback-body">{diagnosticMessage}</p>

                      {!isCurrentCorrect && expandedErrorMap[activeQ] && (
                        <div className="error-breakdown-note">
                          <strong>{t.ruleBreakdownTitle}</strong>
                          <p>{lesson.rule}</p>
                          <p className="error-breakdown-solution">{currentQuestionObj.why}</p>
                          <a
                            className="quiet-inline-link inline-flex items-center gap-1"
                            href={`/lab?lang=${lang}&topic=${topic}`}
                          >
                            <span>{t.openLabForTopic}</span>
                            <ArrowRight size={13} />
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="practice-actions">
                    {!isCurrentChecked ? (
                      <Button
                        onClick={() => {
                          if (selectedVal === undefined) {
                            onCheckQuestion(activeQ);
                            return;
                          }
                          const isOptRight = selectedVal === String(currentQuestionObj.correct);
                          const chosenText = currentQuestionObj.options[Number(selectedVal)] ?? "";
                          onCheckQuestion(activeQ, isOptRight, isOptRight ? undefined : chosenText);
                        }}
                      >
                        <CheckCircle2 size={16} />
                        {t.checkOne}
                      </Button>
                    ) : isCurrentCorrect ? (
                      <Button onClick={() => onSetActiveQ(Math.min(3, activeQ + 1))}>
                        {t.nextTaskBtn}
                        <ArrowRight size={16} />
                      </Button>
                    ) : (
                      <>
                        {!expandedErrorMap[activeQ] && (
                          <Button onClick={() => onExpandErrorNote(activeQ)}>
                            {t.analyzeErrorBtn}
                          </Button>
                        )}
                        <Button variant="outline" onClick={() => onRetryQuestion(activeQ)}>
                          <RotateCcw size={14} />
                          {t.tryAgainBtn}
                        </Button>
                        <button
                          type="button"
                          className="quiet-text-action"
                          onClick={() => {
                            const selectedText =
                              selectedVal !== undefined
                                ? currentQuestionObj.options[Number(selectedVal)]
                                : "";
                            const promptText =
                              lang === "ru"
                                ? `В задаче «${currentQuestionObj.text}» я выбрал ответ «${selectedText}». Объясни по шагам, где ошибка и какое правило здесь работает.`
                                : lang === "kk"
                                  ? `«${currentQuestionObj.text}» есебінде мен «${selectedText}» жауабын таңдадым. Қатенің қай жерде екенін және қандай ереже қолданылатынын түсіндіріп берші.`
                                  : `«${currentQuestionObj.text}» masalasida men «${selectedText}» javobini tanladim. Xato qayerda ekanini va qaysi qoida ishlashini tushuntirib bering.`;
                            onAskWithPrefill(promptText);
                          }}
                        >
                          {t.askAiWhyBtn}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Clear completion card after all 3 practice tasks are checked */}
                  {checkedCount === lesson.questions.length && (
                    <div className="practice-summary-card mt-5">
                      <strong>{t.practiceSummaryTitle(solvedCount, lesson.questions.length)}</strong>
                      <p className="small mt-1 mb-3">{t.practiceSummarySub}</p>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <Button size="sm" onClick={() => onSetActiveQ(3)}>
                          <span>{t.practiceSummaryExtraBtn}</span>
                          <ArrowRight size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSelectTopic(nextTopicId)}
                        >
                          <span>
                            {t.nextTopicBtn}: {nextTopicObj.title}
                          </span>
                          <ArrowRight size={14} />
                        </Button>
                        <a
                          href={`/lab?lang=${lang}&topic=${topic}`}
                          className="btn-ghost-sm"
                        >
                          {t.openLabForTopic}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Step 4 inside Practice: Dynamic Transfer Problem with new numbers */
                <div className="practice-stage">
                  <div className="practice-transfer-head">
                    <span className="rule-label">{t.transferTitle}</span>
                    <span className="topic-index-label">#{practiceSeed + 1}/24</span>
                  </div>
                  <p className="lesson-intro">{t.transferSub}</p>

                  {topicErrorCause && !topicErrorCause.verifiedClean && (
                    <div className="rule mb-3" role="note">
                      <span className="rule-label">{t.errorCausePendingBadge}</span>
                      <p className="small mt-1 mb-0">
                        <strong>{topicErrorCause.personalMessage}</strong>
                      </p>
                    </div>
                  )}

                  <div className="practice-math-stem">
                    {formatLabTask(transferChallenge.transfer)}
                  </div>

                  <form
                    className="transfer-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      onCheckTransfer();
                    }}
                  >
                    <div className="transfer-input-row">
                      <input
                        id="transfer-answer-input"
                        name="transferAnswer"
                        type="text"
                        inputMode="decimal"
                        className="lab-input"
                        value={transferInput}
                        maxLength={40}
                        placeholder={transferChallenge.unit || "0"}
                        aria-label={t.transferTitle}
                        onChange={(e) => onSetTransferInput(e.target.value)}
                      />
                      <Button type="submit">{t.transferCheck}</Button>
                    </div>
                  </form>

                  {transferStatus && (
                    <div
                      role="status"
                      className={`feedback ${transferStatus === "right" ? "correct" : "wrong"}`}
                    >
                      <strong className="feedback-heading">
                        {transferStatus === "right" ? t.correctTitle : t.wrongTitle}
                      </strong>
                      <p className="feedback-body">
                        {transferStatus === "right"
                          ? `${t.transferRight} (${transferChallenge.solution})`
                          : transferStatus === "invalid"
                            ? t.transferInvalid
                            : t.transferWrong}
                      </p>
                      {transferStatus === "wrong" && showTransferRule && (
                        <div className="error-breakdown-note">
                          <strong>{t.ruleBreakdownTitle}</strong>
                          <p>{lesson.rule}</p>
                          <p className="error-breakdown-solution">{transferChallenge.hints[0]}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="practice-actions">
                    {transferStatus === "right" ? (
                      <>
                        <Button onClick={onNextTransferVariant}>
                          {t.nextTaskBtn}
                          <ArrowRight size={16} />
                        </Button>
                        <button
                          type="button"
                          className="quiet-text-action inline-flex items-center gap-1"
                          onClick={() => onSelectTopic(nextTopicId)}
                        >
                          <span>
                            {t.nextTopicBtn}: {nextTopicObj.title}
                          </span>
                          <ArrowRight size={14} />
                        </button>
                      </>
                    ) : transferStatus === "wrong" ? (
                      <>
                        {!showTransferRule && (
                          <Button onClick={onShowTransferRule}>{t.analyzeErrorBtn}</Button>
                        )}
                        <Button variant="outline" onClick={onNextTransferVariant}>
                          {t.transferNext}
                        </Button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="quiet-text-action"
                        onClick={onNextTransferVariant}
                      >
                        {t.transferNext}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* TAB 3: ИИ-ТЬЮТОР (Contextual Multi-Turn Tutor Dialogue) */}
            <TabsContent value="ai">
              <div className="ai-stage">
                <div className="lesson-meta-line mb-1">
                  <span className="rule-label">{t.aiContextAttachedLabel}</span>
                  <span className="lesson-honest-status">
                    {t.aiDialogueTurnLabel(Math.min(3, Math.max(1, aiHistory.length)), 3)}
                  </span>
                </div>
                <h2 className="steps-heading">{t.aiTitle}</h2>
                <p className="lesson-intro">{t.aiSub}</p>

                <div className="quick-prompts-block">
                  <span className="rule-label">{t.quickLabel}</span>
                  <div className="quick-prompts">
                    {topicAiPrompts.quick.map((qq) => (
                      <button
                        key={qq}
                        type="button"
                        className="quick-pill"
                        onClick={() => {
                          onSetQuestion(qq);
                          onSetConsent(true);
                          onClearAiError();
                        }}
                      >
                        {qq}
                      </button>
                    ))}
                  </div>
                </div>

                <form
                  className="ai-form"
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    onRunExplainQuery(question);
                  }}
                >
                  <label htmlFor="learner-question" className="form-label">
                    {t.question} ({lesson.title})
                  </label>
                  <textarea
                    id="learner-question"
                    name="learnerQuestion"
                    value={question}
                    maxLength={600}
                    placeholder={topicAiPrompts.placeholder}
                    onChange={(e) => onSetQuestion(e.target.value)}
                  />
                  <div className="ai-meta-row">
                    <span className="small">{t.schoolPrivacyNote}</span>
                    <span className="small">{question.length}/600</span>
                  </div>

                  <label className="checkline" onClick={onClearAiError}>
                    <Checkbox checked={consent} onCheckedChange={(v) => onSetConsent(v === true)} />
                    <span>
                      {t.consent}{" "}
                      <a href={`/privacy?lang=${lang}`} onClick={(e) => e.stopPropagation()}>
                        {t.privacy}
                      </a>
                    </span>
                  </label>

                  <div className="practice-actions">
                    <Button type="submit" disabled={busy}>
                      <Sparkles size={15} />
                      {busy ? t.loading : t.ask}
                    </Button>
                    {aiHistory.length > 0 && (
                      <button
                        type="button"
                        className="quiet-text-action"
                        onClick={onResetAiDialogue}
                      >
                        {t.aiResetDialogueBtn}
                      </button>
                    )}
                  </div>
                </form>
                <p className="small">{t.pilot}</p>
                {error && (
                  <p role="alert" className="feedback wrong">
                    {error}
                  </p>
                )}
                {answer && (
                  <section aria-live="polite" className="response">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <span className="rule-label m-0">
                        {answer.source === "claude" ? t.badgeLive : t.badgePreview}
                      </span>
                      <span className="small text-muted-foreground">
                        {t.aiDialogueTurnLabel(Math.min(3, Math.max(1, aiHistory.length)), 3)}
                      </span>
                    </div>

                    {answer.errorType && (
                      <p className="small font-medium mt-0 mb-2">
                        <strong>{t.aiErrorTypeLabel}</strong> {answer.errorType}
                      </p>
                    )}

                    <p className="response-explanation">{answer.explanation}</p>
                    <strong>
                      {lang === "ru"
                        ? "Проверь себя:"
                        : lang === "kk"
                          ? "Өзіңді тексер:"
                          : "O‘zingizni tekshiring:"}
                    </strong>
                    <p className="response-hint">{answer.hint}</p>

                    {/* Multi-Turn Contextual Follow-Up Actions */}
                    <div className="practice-actions mt-3 pt-3 border-t border-border/60">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={busy || aiHistory.length >= 3}
                        onClick={() => onRunExplainQuery(question || lesson.example, "simpler_example")}
                      >
                        {t.aiFollowUpSimplerBtn}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={busy || aiHistory.length >= 3}
                        onClick={() => onRunExplainQuery(question || lesson.example, "socratic_question")}
                      >
                        {t.aiFollowUpSocraticBtn}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          onTabChange("practice");
                          onSetActiveQ(3);
                        }}
                      >
                        <span>{t.aiFollowUpCheckSelfBtn}</span>
                        <ArrowRight size={14} />
                      </Button>
                    </div>
                  </section>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </article>
      </div>
    </>
  );
}
