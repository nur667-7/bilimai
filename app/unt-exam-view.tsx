"use client";
import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  GitBranch,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  UNT_OFFICIAL_SPEC,
  evaluateUntExam,
  scoreUntQuestion,
  untQuestions,
  type UntAttemptSummary,
  type UntExamEvaluation,
  type UntQuestion,
  type UntUserAnswer
} from "@/lib/unt-exam";
import { topicName } from "@/lib/error-lab";
import type { Language, TopicId } from "@/lib/lessons";

const EXAM_COPY = {
  ru: {
    specBadge: "Стандарт НЦТ РК (testcenter.kz): Мат. грамотность 10 вопр. (10 б.) + Профильная математика 40 вопр. (50 б.)",
    specSub: "Диагностический вариант ЕНТ включает все 4 официальных формата (12 заданий = 17 первичных баллов → пересчёт в шкалу 50 б.) и автоматически строит Граф пробелов.",
    filterAll: "Все (12)",
    filterFlagged: "На проверку",
    filterTwoPt: "2 балла (5)",
    filterMistakes: "Ошибки и потери",
    questionLabel: "Задание",
    ofLabel: "из",
    points1: "1 балл",
    points2: "2 балла",
    flagBtn: "На проверку",
    flaggedBtn: "Отмечено",
    formatSingle: "1 верный ответ из 4 (1 балл)",
    formatContext: "Контекстное задание ЕНТ (1 балл)",
    formatMatching: "Соответствие А и Б → 1..4 (2 балла: 1 пара = 1 б., обе = 2 б.)",
    formatMultiple: "Множественный выбор: от 1 до 3 верных из 6 (2 балла: 1 ошибка = 1 б.)",
    selectedCount: "Выбрано вариантов",
    maxThreeHint: "Максимум 3 ответа по правилам ЕНТ",
    matchingColItem: "Условие",
    matchingColChoice: "Выбор соответствия (1–4)",
    matchingOptionsRef: "Варианты для сопоставления:",
    prevBtn: "← Назад",
    nextBtn: "Далее →",
    submitExam: "Завершить и проверить вариант ЕНТ",
    resetExam: "Пройти заново",
    answeredStat: "Отвечено",
    reportTitle: "Диагностический отчёт Пробного ЕНТ",
    scaledScoreLabel: "Прогноз балла Профильной математики",
    rawScoreLabel: "Первичный балл среза",
    partialNote: "Частичный балл (1 из 2 б.) в сложных заданиях",
    partialTip: "Быстрый резерв роста: вы знаете тему, но потеряли по 1 баллу на полноте ответа или ОДЗ.",
    weakTopicsTitle: "Выявленные темы с потерей баллов (переданы во «Второй мозг»)",
    noWeakTopics: "Все 10 тем решены без потерь баллов!",
    openGraphBtn: "Открыть Граф знаний (Obsidian Второй мозг) →",
    openLessonBtn: "Повторить правило урока",
    openLabBtn: "Отработать шаг в Лаборатории (/lab)",
    statusFull: "Полный балл",
    statusPartial: "Частично верно (1 из 2 б.)",
    statusZero: "0 баллов — пробел",
    ruleTitle: "Инвариант и правило ЕНТ:",
    solutionTitle: "Пошаговый разбор:",
    trapTitle: "Типичная ловушка НЦТ:",
    lastAttemptBanner: "Последний сохранённый результат:"
  },
  kk: {
    specBadge: "ҚР ҰТО стандарты (testcenter.kz): Мат. сауаттылық 10 сұрақ (10 б.) + Бейіндік математика 40 сұрақ (50 б.)",
    specSub: "Диагностикалық ҰБТ нұсқасы барлық 4 ресми форматты қамтиды (12 тапсырма = 17 бастапқы балл → 50 балдық шкала) және Олқылықтар графын автоматты түрде құрады.",
    filterAll: "Барлығы (12)",
    filterFlagged: "Қайта қарау",
    filterTwoPt: "2 балдық (5)",
    filterMistakes: "Қателер",
    questionLabel: "Тапсырма",
    ofLabel: "/",
    points1: "1 балл",
    points2: "2 балл",
    flagBtn: "Белгілеу",
    flaggedBtn: "Белгіленді",
    formatSingle: "4 нұсқадан 1 дұрыс жауап (1 балл)",
    formatContext: "Контекстік тапсырма (1 балл)",
    formatMatching: "Сәйкестендіру А, Б → 1..4 (2 балл: 1 жұп = 1 б., екеуі = 2 б.)",
    formatMultiple: "Көп таңдаулы: 6-дан 1–3 дұрыс жауап (2 балл: 1 қате = 1 б.)",
    selectedCount: "Таңдалды",
    maxThreeHint: "ҰБТ ережесі бойынша ең көбі 3 жауап",
    matchingColItem: "Шарт",
    matchingColChoice: "Сәйкес нұсқа (1–4)",
    matchingOptionsRef: "Сәйкестендіру нұсқалары:",
    prevBtn: "← Алдыңғы",
    nextBtn: "Келесі →",
    submitExam: "ҰБТ нұсқасын аяқтап, тексеру",
    resetExam: "Қайта тапсыру",
    answeredStat: "Жауап берілді",
    reportTitle: "Байқау ҰБТ диагностикалық есебі",
    scaledScoreLabel: "Бейіндік математика болжам балы",
    rawScoreLabel: "Бастапқы балл",
    partialNote: "2 балдық тапсырмалардағы ішінара балл (2-ден 1 б.)",
    partialTip: "Жылдам өсу резерві: тақырыпты білесіз, бірақ ММО немесе толық жауапта 1 балл жоғалттыңыз.",
    weakTopicsTitle: "Балл жоғалған тақырыптар («Екінші ми» графына жіберілді)",
    noWeakTopics: "Барлық 10 тақырып қатесіз орындалды!",
    openGraphBtn: "Білім графын ашу (Obsidian Екінші ми) →",
    openLessonBtn: "Сабақ ережесін ашу",
    openLabBtn: "Қателер зертханасында (/lab) бекіту",
    statusFull: "Толық балл",
    statusPartial: "Ішінара дұрыс (2-ден 1 б.)",
    statusZero: "0 балл — олқылық",
    ruleTitle: "ҰБТ ережесі мен инварианты:",
    solutionTitle: "Қадамдық талдау:",
    trapTitle: "ҰТО жиі кездесетін тұзағы:",
    lastAttemptBanner: "Соңғы сақталған нәтиже:"
  },
  uz: {
    specBadge: "UBT standarti (testcenter.kz): Mat. savodxonlik 10 savol (10 b.) + Ixtisoslashgan matematika 40 savol (50 b.)",
    specSub: "Diagnostik variant barcha 4 rasmiy formatni o‘z ichiga oladi (12 topshiriq = 17 birlamchi ball → 50 ballik shkala) va Bo‘shliqlar grafini avtomatik yangilaydi.",
    filterAll: "Barchasi (12)",
    filterFlagged: "Belgilangan",
    filterTwoPt: "2 balli (5)",
    filterMistakes: "Xatolar",
    questionLabel: "Topshiriq",
    ofLabel: "/",
    points1: "1 ball",
    points2: "2 ball",
    flagBtn: "Belgilash",
    flaggedBtn: "Belgilandi",
    formatSingle: "4 tadan 1 ta to‘g‘ri javob (1 ball)",
    formatContext: "Kontekstli topshiriq (1 ball)",
    formatMatching: "Moslikni aniqlash A, B → 1..4 (2 ball: 1 juft = 1 b., ikkalasi = 2 b.)",
    formatMultiple: "Ko‘p tanlovli: 6 tadan 1–3 to‘g‘ri javob (2 ball: 1 xato = 1 b.)",
    selectedCount: "Tanlandi",
    maxThreeHint: "Qoida bo‘yicha ko‘pi bilan 3 ta javob",
    matchingColItem: "Shart",
    matchingColChoice: "Mos javob (1–4)",
    matchingOptionsRef: "Moslashtirish variantlari:",
    prevBtn: "← Oldingi",
    nextBtn: "Keyingi →",
    submitExam: "Sinovni yakunlash va tekshirish",
    resetExam: "Qayta boshlash",
    answeredStat: "Javob berildi",
    reportTitle: "Sinov UBT diagnostik hisoboti",
    scaledScoreLabel: "Ixtisoslashgan matematika prognoz balli",
    rawScoreLabel: "Birlamchi ball",
    partialNote: "2 balli topshiriqlarda qisman ball (2 dan 1 b.)",
    partialTip: "Tez o‘sish zaxirasi: mavzuni bilasiz, lekin AS yoki to‘liq javobda 1 ball yo‘qotdingiz.",
    weakTopicsTitle: "Ball yo‘qotilgan mavzular («Ikkinchi miya» grafiga uzatildi)",
    noWeakTopics: "Barcha 10 ta mavzu xatosiz yechildi!",
    openGraphBtn: "Bilimlar grafini ochish (Obsidian Ikkinchi miya) →",
    openLessonBtn: "Dars qoidasini ochish",
    openLabBtn: "Xatolar laboratoriyasida (/lab) ishlash",
    statusFull: "To‘liq ball",
    statusPartial: "Qisman to‘g‘ri (2 dan 1 b.)",
    statusZero: "0 ball — bo‘shliq",
    ruleTitle: "Asosiy qoida va invariant:",
    solutionTitle: "Qadam-baqadam yechim:",
    trapTitle: "Tipik imtihon tuzog‘i:",
    lastAttemptBanner: "Oxirgi saqlangan natija:"
  }
} as const;

export interface UntExamViewProps {
  lang: Language;
  lastSavedAttempt: UntAttemptSummary | null;
  initialTopic?: TopicId;
  onCompleteExam: (summary: UntAttemptSummary, evaluation: UntExamEvaluation) => void;
  onOpenGraph: (focusTopic?: TopicId) => void;
  onOpenLesson: (topic: TopicId) => void;
}

export function UntExamView({
  lang,
  lastSavedAttempt,
  onCompleteExam,
  onOpenGraph,
  onOpenLesson
}: UntExamViewProps) {
  const t = EXAM_COPY[lang];
  const [activeIdx, setActiveIdx] = useState(0);
  const [navFilter, setNavFilter] = useState<"all" | "flagged" | "twopt" | "mistakes">("all");
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, UntUserAnswer>>({});
  const [submittedEval, setSubmittedEval] = useState<UntExamEvaluation | null>(null);

  const currentQuestion: UntQuestion = untQuestions[activeIdx] ?? untQuestions[0];
  const currentScore = submittedEval ? submittedEval.questionScores[currentQuestion.id] : null;

  const answeredCount = untQuestions.filter((q) => {
    const sc = scoreUntQuestion(q, answers[q.id]);
    return sc.status !== "unanswered";
  }).length;

  function toggleFlag(questionId: string) {
    setFlagged((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  }

  function selectSingleAnswer(q: UntQuestion, optionIdx: number) {
    if (submittedEval) return;
    if (q.format !== "single" && q.format !== "context") return;
    setAnswers((prev) => ({
      ...prev,
      [q.id]: { format: q.format, selectedIndex: optionIdx }
    }));
  }

  function selectMatchingPair(q: UntQuestion, rowIdx: 0 | 1, choiceIdx: number) {
    if (submittedEval || q.format !== "matching") return;
    setAnswers((prev) => {
      const existing = prev[q.id];
      const currentPairs: [number | null, number | null] =
        existing && existing.format === "matching" ? [...existing.pairs] : [null, null];
      currentPairs[rowIdx] = choiceIdx;
      return {
        ...prev,
        [q.id]: { format: "matching", pairs: currentPairs }
      };
    });
  }

  function toggleMultipleOption(q: UntQuestion, optionIdx: number) {
    if (submittedEval || q.format !== "multiple") return;
    setAnswers((prev) => {
      const existing = prev[q.id];
      const currentList =
        existing && existing.format === "multiple" ? [...existing.selectedIndices] : [];
      if (currentList.includes(optionIdx)) {
        return {
          ...prev,
          [q.id]: {
            format: "multiple",
            selectedIndices: currentList.filter((i) => i !== optionIdx)
          }
        };
      }
      if (currentList.length >= 3) {
        return prev;
      }
      return {
        ...prev,
        [q.id]: {
          format: "multiple",
          selectedIndices: [...currentList, optionIdx].sort((a, b) => a - b)
        }
      };
    });
  }

  function handleSubmitExam() {
    const evaluation = evaluateUntExam(answers, untQuestions);
    setSubmittedEval(evaluation);

    const topicRatios = Object.fromEntries(
      Object.entries(evaluation.byTopic).map(([k, v]) => [k, v.ratio])
    ) as UntAttemptSummary["topicRatios"];

    const summary: UntAttemptSummary = {
      completedAt: new Date().toISOString(),
      earnedPoints: evaluation.earnedPoints,
      maxPoints: evaluation.maxPoints,
      scaledScore50: evaluation.scaledScore50,
      weakTopics: evaluation.weakTopics,
      topicRatios
    };
    onCompleteExam(summary, evaluation);
  }

  function handleResetExam() {
    setAnswers({});
    setFlagged({});
    setSubmittedEval(null);
    setNavFilter("all");
    setActiveIdx(0);
  }

  const filteredQuestions = untQuestions.filter((q) => {
    if (navFilter === "flagged") return Boolean(flagged[q.id]);
    if (navFilter === "twopt") return q.maxPoints === 2;
    if (navFilter === "mistakes" && submittedEval) {
      const sc = submittedEval.questionScores[q.id];
      return sc && sc.status !== "full";
    }
    return true;
  });

  const formatLabel =
    currentQuestion.format === "single"
      ? t.formatSingle
      : currentQuestion.format === "context"
        ? t.formatContext
        : currentQuestion.format === "matching"
          ? t.formatMatching
          : t.formatMultiple;

  return (
    <div className="unt-exam-root">
      {/* Справка по официальной спецификации ЕНТ */}
      <div className="exam-spec-banner">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <strong className="text-xs sm:text-sm">{t.specBadge}</strong>
          <span className="section-pill">
            {UNT_OFFICIAL_SPEC.profileMath.blocks.map((b) => `${b.range}: ${b.totalPoints}б`).join(" · ")}
          </span>
        </div>
        <p className="small mt-1 mb-0">{t.specSub}</p>
        {lastSavedAttempt && !submittedEval && (
          <div className="exam-saved-strip mt-2">
            <span>
              {t.lastAttemptBanner}{" "}
              <strong>
                {lastSavedAttempt.scaledScore50}/50 ({lastSavedAttempt.earnedPoints}/{lastSavedAttempt.maxPoints})
              </strong>
            </span>
            <button
              type="button"
              className="underline font-semibold text-xs"
              onClick={() => onOpenGraph(lastSavedAttempt.weakTopics[0])}
            >
              {t.openGraphBtn}
            </button>
          </div>
        )}
      </div>

      {/* Панель фильтров и матрицы номеров заданий 01..12 */}
      <div className="exam-hud-bar">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Фильтр вопросов ЕНТ">
            <Button
              type="button"
              size="sm"
              variant={navFilter === "all" ? "default" : "outline"}
              onClick={() => setNavFilter("all")}
            >
              {t.filterAll}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={navFilter === "twopt" ? "default" : "outline"}
              onClick={() => setNavFilter("twopt")}
            >
              {t.filterTwoPt}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={navFilter === "flagged" ? "default" : "outline"}
              onClick={() => setNavFilter("flagged")}
            >
              <Bookmark size={13} />
              {t.filterFlagged} ({Object.values(flagged).filter(Boolean).length})
            </Button>
            {submittedEval && (
              <Button
                type="button"
                size="sm"
                variant={navFilter === "mistakes" ? "default" : "outline"}
                onClick={() => setNavFilter("mistakes")}
              >
                <AlertTriangle size={13} />
                {t.filterMistakes}
              </Button>
            )}
          </div>
          <span className="small font-semibold tabular-nums">
            {t.answeredStat}: {answeredCount}/{untQuestions.length}
          </span>
        </div>

        <div className="exam-nav-grid" role="navigation" aria-label="Навигация по заданиям ЕНТ">
          {(filteredQuestions.length > 0 ? filteredQuestions : untQuestions).map((q) => {
            const idx = untQuestions.findIndex((item) => item.id === q.id);
            const isCurrent = idx === activeIdx;
            const sc = scoreUntQuestion(q, answers[q.id]);
            const isAnswered = sc.status !== "unanswered";
            const isFlag = Boolean(flagged[q.id]);

            let statusClass = "";
            if (submittedEval) {
              const evalScore = submittedEval.questionScores[q.id];
              if (evalScore?.status === "full") statusClass = "exam-cell-full";
              else if (evalScore?.status === "partial") statusClass = "exam-cell-partial";
              else statusClass = "exam-cell-zero";
            } else if (isAnswered) {
              statusClass = "exam-cell-answered";
            }

            return (
              <button
                key={q.id}
                type="button"
                className={`exam-nav-cell ${isCurrent ? "current" : ""} ${statusClass}`}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`${t.questionLabel} ${q.order} (${q.maxPoints === 2 ? t.points2 : t.points1})`}
                onClick={() => setActiveIdx(idx)}
              >
                <span className="tabular-nums">{String(q.order).padStart(2, "0")}</span>
                {q.maxPoints === 2 && <small className="exam-cell-2pt">2б</small>}
                {isFlag && <span className="exam-cell-flag" aria-hidden="true">⚑</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Карточка текущего вопроса ЕНТ */}
      <div className="exam-question-card" aria-live="polite">
        <div className="exam-question-meta">
          <div className="flex flex-wrap items-center gap-2">
            <span className="exam-q-number tabular-nums">
              {t.questionLabel} #{currentQuestion.order} {t.ofLabel} {untQuestions.length}
            </span>
            <span className="section-pill">{currentQuestion.untNumberRange}</span>
            <span className={`exam-weight-pill ${currentQuestion.maxPoints === 2 ? "two-pt" : ""}`}>
              {currentQuestion.maxPoints === 2 ? t.points2 : t.points1}
            </span>
            <span className="small font-semibold text-muted-foreground">
              · {topicName(currentQuestion.topic, lang)}
            </span>
          </div>
          <Button
            type="button"
            size="sm"
            variant={flagged[currentQuestion.id] ? "default" : "outline"}
            aria-pressed={Boolean(flagged[currentQuestion.id])}
            onClick={() => toggleFlag(currentQuestion.id)}
          >
            <Bookmark size={14} />
            {flagged[currentQuestion.id] ? t.flaggedBtn : t.flagBtn}
          </Button>
        </div>

        <p className="exam-format-hint">{formatLabel}</p>

        {/* Контекстная вставка для заданий №26–30 */}
        {currentQuestion.format === "context" && (
          <div className="exam-context-box">
            <strong>{currentQuestion.contextTitle[lang]}</strong>
            <p className="mt-1 mb-0">{currentQuestion.contextBody[lang]}</p>
          </div>
        )}

        <h3 className="exam-stem">{currentQuestion.prompt[lang]}</h3>

        {/* Формат 1 и 2: Single Choice / Context (1 из 4) */}
        {(currentQuestion.format === "single" || currentQuestion.format === "context") && (
          <div className="exam-options-list" role="radiogroup" aria-label={currentQuestion.prompt[lang]}>
            {currentQuestion.options[lang].map((opt, optIdx) => {
              const ans = answers[currentQuestion.id];
              const isSelected =
                (ans?.format === "single" || ans?.format === "context") &&
                ans.selectedIndex === optIdx;
              const isCorrectOption = submittedEval && currentQuestion.correctIndex === optIdx;
              const isWrongSelected = submittedEval && isSelected && !isCorrectOption;
              const letter = ["A", "B", "C", "D"][optIdx] ?? String(optIdx + 1);

              return (
                <button
                  key={opt}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={Boolean(submittedEval)}
                  className={`exam-option-btn ${isSelected ? "selected" : ""} ${
                    isCorrectOption ? "correct" : ""
                  } ${isWrongSelected ? "wrong" : ""}`}
                  onClick={() => selectSingleAnswer(currentQuestion, optIdx)}
                >
                  <span className="exam-opt-letter">{letter}</span>
                  <span className="exam-opt-text">{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Формат 3: Matching (Установление соответствия А, Б -> 1..4 на 2 балла) */}
        {currentQuestion.format === "matching" && (
          <div className="exam-matching-wrap">
            <div className="exam-matching-ref">
              <strong className="small block mb-1">{t.matchingOptionsRef}</strong>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {currentQuestion.rightOptions[lang].map((ro) => (
                  <div key={ro} className="exam-matching-chip">
                    {ro}
                  </div>
                ))}
              </div>
            </div>

            <div className="exam-matching-rows">
              {([0, 1] as const).map((rowIdx) => {
                const rowText = currentQuestion.leftItems[lang][rowIdx];
                const ans = answers[currentQuestion.id];
                const chosenIdx =
                  ans?.format === "matching" ? ans.pairs[rowIdx] : null;
                const corrIdx = currentQuestion.correctPairs[rowIdx];

                return (
                  <div key={rowText} className="exam-matching-row">
                    <div className="exam-matching-prompt">{rowText}</div>
                    <div
                      className="exam-matching-choices"
                      role="radiogroup"
                      aria-label={rowText}
                    >
                      {[0, 1, 2, 3].map((choiceIdx) => {
                        const active = chosenIdx === choiceIdx;
                        const isRight = submittedEval && corrIdx === choiceIdx;
                        const isWrong = submittedEval && active && corrIdx !== choiceIdx;
                        return (
                          <button
                            key={choiceIdx}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            disabled={Boolean(submittedEval)}
                            className={`exam-match-num-btn ${active ? "selected" : ""} ${
                              isRight ? "correct" : ""
                            } ${isWrong ? "wrong" : ""}`}
                            onClick={() =>
                              selectMatchingPair(currentQuestion, rowIdx, choiceIdx)
                            }
                          >
                            {choiceIdx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Формат 4: Multiple Choice (1..3 из 6 на 2 балла) */}
        {currentQuestion.format === "multiple" && (() => {
          const ans = answers[currentQuestion.id];
          const selectedList =
            ans?.format === "multiple" ? ans.selectedIndices : [];
          const limitReached = selectedList.length >= 3;

          return (
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <span className="small font-semibold tabular-nums">
                  {t.selectedCount}: {selectedList.length} / 3
                </span>
                <span className="small text-muted-foreground">{t.maxThreeHint}</span>
              </div>
              <div className="exam-options-list" role="group" aria-label={currentQuestion.prompt[lang]}>
                {currentQuestion.options[lang].map((opt, optIdx) => {
                  const isSelected = selectedList.includes(optIdx);
                  const isDisabled = Boolean(submittedEval) || (!isSelected && limitReached);
                  const isCorrectOpt =
                    submittedEval && currentQuestion.correctIndices.includes(optIdx);
                  const isWrongSelected =
                    submittedEval && isSelected && !isCorrectOpt;

                  return (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={isSelected}
                      disabled={isDisabled}
                      className={`exam-option-btn multi ${isSelected ? "selected" : ""} ${
                        isCorrectOpt ? "correct" : ""
                      } ${isWrongSelected ? "wrong" : ""}`}
                      onClick={() => toggleMultipleOption(currentQuestion, optIdx)}
                    >
                      <span className="exam-opt-check" aria-hidden="true">
                        {isSelected ? "✓" : ""}
                      </span>
                      <span className="exam-opt-text">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Пошаговый разбор после завершения ЕНТ */}
        {submittedEval && currentScore && (
          <div
            className={`exam-solution-box mt-4 ${
              currentScore.status === "full"
                ? "sol-full"
                : currentScore.status === "partial"
                  ? "sol-partial"
                  : "sol-zero"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <strong>
                {currentScore.status === "full"
                  ? `${t.statusFull} (${currentScore.earned}/${currentScore.max})`
                  : currentScore.status === "partial"
                    ? `${t.statusPartial}`
                    : `${t.statusZero} (0/${currentScore.max})`}
              </strong>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenLesson(currentQuestion.topic)}
                >
                  {t.openLessonBtn}
                </Button>
                <Link
                  className="cta-pill text-xs py-1 px-2.5"
                  href={`/lab?lang=${lang}&topic=${currentQuestion.topic}`}
                >
                  <FlaskConical size={13} />
                  {t.openLabBtn}
                </Link>
              </div>
            </div>
            <p className="small mb-1.5">
              <strong>{t.ruleTitle}</strong> {currentQuestion.rule[lang]}
            </p>
            <p className="small mb-1.5">
              <strong>{t.solutionTitle}</strong> {currentQuestion.explanation[lang]}
            </p>
            <p className="small m-0 text-muted-foreground">
              <strong>{t.trapTitle}</strong> {currentQuestion.trap[lang]}
            </p>
          </div>
        )}

        {/* Навигация Вперёд / Назад и Завершение */}
        <div className="exam-footer-actions">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={activeIdx === 0}
              onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
            >
              <ChevronLeft size={15} />
              {t.prevBtn}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={activeIdx === untQuestions.length - 1}
              onClick={() => setActiveIdx((i) => Math.min(untQuestions.length - 1, i + 1))}
            >
              {t.nextBtn}
              <ChevronRight size={15} />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {!submittedEval ? (
              <Button type="button" onClick={handleSubmitExam}>
                <CheckCircle2 size={16} />
                {t.submitExam}
              </Button>
            ) : (
              <>
                <Button type="button" onClick={() => onOpenGraph(submittedEval.weakTopics[0])}>
                  <GitBranch size={15} />
                  {t.openGraphBtn}
                </Button>
                <Button type="button" variant="outline" onClick={handleResetExam}>
                  <RotateCcw size={15} />
                  {t.resetExam}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Итоговая диагностическая сводка после сдачи */}
      {submittedEval && (
        <section className="exam-report-card mt-5" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold m-0">{t.reportTitle}</h3>
              <p className="small mt-0.5 mb-0">
                {t.rawScoreLabel}:{" "}
                <strong className="tabular-nums">
                  {submittedEval.earnedPoints} / {submittedEval.maxPoints}
                </strong>
              </p>
            </div>
            <div className="exam-scaled-badge tabular-nums">
              <span>{t.scaledScoreLabel}:</span>
              <strong>{submittedEval.scaledScore50} / 50</strong>
            </div>
          </div>

          <div className="exam-format-breakdown mt-3">
            <div className="exam-stat-box">
              <span className="small">№1–25 (1 б.)</span>
              <strong className="tabular-nums">
                {submittedEval.byFormat.single.earned}/{submittedEval.byFormat.single.max}
              </strong>
            </div>
            <div className="exam-stat-box">
              <span className="small">№26–30 Контекст</span>
              <strong className="tabular-nums">
                {submittedEval.byFormat.context.earned}/{submittedEval.byFormat.context.max}
              </strong>
            </div>
            <div className="exam-stat-box">
              <span className="small">№31–35 Соотв. (2 б.)</span>
              <strong className="tabular-nums">
                {submittedEval.byFormat.matching.earned}/{submittedEval.byFormat.matching.max}
              </strong>
            </div>
            <div className="exam-stat-box">
              <span className="small">№36–40 Множ. (2 б.)</span>
              <strong className="tabular-nums">
                {submittedEval.byFormat.multiple.earned}/{submittedEval.byFormat.multiple.max}
              </strong>
            </div>
          </div>

          {submittedEval.partialTwoPointCount > 0 && (
            <div className="callout mt-3">
              <strong>
                <Sparkles size={14} className="inline mr-1" />
                {t.partialNote}: {submittedEval.partialTwoPointCount}
              </strong>
              <p className="small mt-1 mb-0">{t.partialTip}</p>
            </div>
          )}

          <div className="mt-4">
            <strong className="block text-sm mb-2">{t.weakTopicsTitle}:</strong>
            {submittedEval.weakTopics.length === 0 ? (
              <p className="small text-emerald-700 font-semibold">{t.noWeakTopics}</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {submittedEval.weakTopics.map((topicId) => {
                  const st = submittedEval.byTopic[topicId];
                  return (
                    <button
                      key={topicId}
                      type="button"
                      className="exam-gap-pill"
                      onClick={() => onOpenGraph(topicId)}
                    >
                      <span>{topicName(topicId, lang)}</span>
                      <strong className="tabular-nums">
                        {st.earned}/{st.max} б.
                      </strong>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
