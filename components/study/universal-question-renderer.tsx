"use client";

import { useState, useEffect, useRef } from "react";
import type { Locale } from "@/lib/curriculum";
import {
  evaluateUniversalQuestion,
  type UniversalQuestion,
  type UniversalQuestionAnswerInput,
  type UniversalQuestionEvaluation
} from "@/lib/question-engine";

interface UniversalQuestionRendererProps {
  question: UniversalQuestion;
  locale: Locale;
  onEvaluated?: (
    evaluation: UniversalQuestionEvaluation,
    question: UniversalQuestion,
    attemptId: string
  ) => void;
  onNextQuestion?: () => void;
  nextButtonLabel?: string;
}

const UI_TEXT: Record<
  Locale,
  {
    checkBtn: string;
    hintBtn: string;
    hideHintBtn: string;
    resetBtn: string;
    nextBtn: string;
    placeholderNumeric: string;
    placeholderShort: string;
    placeholderLong: string;
    moveUp: string;
    moveDown: string;
    selectMatch: string;
    statusVerifiedCorrect: string;
    statusIncorrect: string;
    statusUnverified: string;
    statusUnsupported: string;
    rubricTitle: string;
    typeBadges: Record<UniversalQuestion["type"], string>;
  }
> = {
  ru: {
    checkBtn: "Проверить ответ",
    hintBtn: "Подсказка",
    hideHintBtn: "Скрыть подсказку",
    resetBtn: "Попробовать снова",
    nextBtn: "Следующий шаг →",
    placeholderNumeric: "Введите число (например: 12 или 2.5)",
    placeholderShort: "Введите краткий ответ...",
    placeholderLong: "Напишите развёрнутое объяснение и сверьте по критериям...",
    moveUp: "↑ Выше",
    moveDown: "↓ Ниже",
    selectMatch: "— Выберите соответствие —",
    statusVerifiedCorrect: "ПРОВЕРЕНО: ВЕРНО",
    statusIncorrect: "ОШИБКА НАЙДЕНА",
    statusUnverified: "САМОПРОВЕРКА ПО КРИТЕРИЯМ",
    statusUnsupported: "ФОРМАТ НЕ ВЕРИФИЦИРОВАН",
    rubricTitle: "Критерии самопроверки:",
    typeBadges: {
      single_choice: "Один ответ",
      multiple_choice: "Несколько ответов",
      numeric: "Числовой ответ",
      short_text: "Краткий ответ",
      long_text: "Развёрнутый ответ",
      matching: "Соответствие A/B",
      sequence: "Хронология / Порядок",
      fill_blank: "Заполнение пропуска",
      true_false: "Верно / Неверно",
      formula: "Формула",
      equation: "Уравнение",
      code_fix: "Разбор кода",
      context_table: "Анализ таблицы"
    }
  },
  kk: {
    checkBtn: "Жауапты тексеру",
    hintBtn: "Кеңес",
    hideHintBtn: "Кеңесті жасыру",
    resetBtn: "Қайта көру",
    nextBtn: "Келесі қадам →",
    placeholderNumeric: "Санды енгізіңіз (мысалы: 12 немесе 2.5)",
    placeholderShort: "Қысқа жауап енгізіңіз...",
    placeholderLong: "Толық түсіндірме жазып, критерийлермен салыстырыңыз...",
    moveUp: "↑ Жоғары",
    moveDown: "↓ Төмен",
    selectMatch: "— Сәйкестікті таңдаңыз —",
    statusVerifiedCorrect: "ТЕКСЕРІЛДІ: ДҰРЫС",
    statusIncorrect: "ҚАТЕ ТАБЫЛДЫ",
    statusUnverified: "КРИТЕРИЙ БОЙЫНША ӨЗІН-ӨЗІ ТЕКСЕРУ",
    statusUnsupported: "ФОРМАТ ТЕКСЕРІЛМЕДІ",
    rubricTitle: "Өзін-өзі тексеру критерийлері:",
    typeBadges: {
      single_choice: "Бір жауап",
      multiple_choice: "Бірнеше жауап",
      numeric: "Сандық жауап",
      short_text: "Қысқа жауап",
      long_text: "Толық жауап",
      matching: "Сәйкестендіру A/B",
      sequence: "Хронология / Реттілік",
      fill_blank: "Бос орынды толтыру",
      true_false: "Рас / Жалған",
      formula: "Формула",
      equation: "Теңдеу",
      code_fix: "Кодты талдау",
      context_table: "Кестені талдау"
    }
  },
  uz: {
    checkBtn: "Javobni tekshirish",
    hintBtn: "Maslahat",
    hideHintBtn: "Maslahatni yashirish",
    resetBtn: "Qayta urinish",
    nextBtn: "Keyingi qadam →",
    placeholderNumeric: "Sonni kiriting (masalan: 12 yoki 2.5)",
    placeholderShort: "Qisqa javob kiriting...",
    placeholderLong: "Batafsil izoh yozing va mezonlar bilan solishtiring...",
    moveUp: "↑ Yuqoriga",
    moveDown: "↓ Pastga",
    selectMatch: "— Moslikni tanlang —",
    statusVerifiedCorrect: "TEKSHIRILDI: TO‘G‘RI",
    statusIncorrect: "XATO TOPILDI",
    statusUnverified: "MEZONLAR BO‘YICHA O‘ZINI TEKSHIRISH",
    statusUnsupported: "FORMAT TEKSHIRILMADI",
    rubricTitle: "O‘z-o‘zini tekshirish mezonlari:",
    typeBadges: {
      single_choice: "Bitta javob",
      multiple_choice: "Bir nechta javob",
      numeric: "Sonli javob",
      short_text: "Qisqa javob",
      long_text: "Batafsil javob",
      matching: "Moslashtirish A/B",
      sequence: "Xronologiya / Tartib",
      fill_blank: "Bo‘sh joyni to‘ldirish",
      true_false: "To‘g‘ri / Noto‘g‘ri",
      formula: "Formula",
      equation: "Tenglama",
      code_fix: "Kod tahlili",
      context_table: "Jadval tahlili"
    }
  }
};

export function UniversalQuestionRenderer({
  question,
  locale,
  onEvaluated,
  onNextQuestion,
  nextButtonLabel
}: UniversalQuestionRendererProps) {
  const ui = UI_TEXT[locale];
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [textValue, setTextValue] = useState<string>("");
  const [matchingSelection, setMatchingSelection] = useState<{ A?: number; B?: number }>({});
  const [sequenceOrder, setSequenceOrder] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [evaluation, setEvaluation] = useState<UniversalQuestionEvaluation | null>(null);
  const lastSubmittedSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    setSelectedIndex(undefined);
    setSelectedIndices([]);
    setTextValue("");
    setMatchingSelection({});
    if (question.sequenceItems) {
      const items = question.sequenceItems[locale] ?? question.sequenceItems.ru;
      // Start with a deterministic shifted order so the learner actively orders the sequence
      const indices = items.map((_, i) => i);
      if (indices.length >= 2) {
        setSequenceOrder([indices[1], indices[0], ...indices.slice(2)]);
      } else {
        setSequenceOrder(indices);
      }
    } else {
      setSequenceOrder([]);
    }
    setShowHint(false);
    setEvaluation(null);
    lastSubmittedSignatureRef.current = null;
  }, [question.id, locale, question.sequenceItems]);

  const handleToggleMulti = (idx: number) => {
    setSelectedIndices((prev) =>
      prev.includes(idx) ? prev.filter((item) => item !== idx) : [...prev, idx]
    );
  };

  const handleMoveSequence = (pos: number, delta: -1 | 1) => {
    const target = pos + delta;
    if (target < 0 || target >= sequenceOrder.length) return;
    const copy = [...sequenceOrder];
    const temp = copy[pos];
    copy[pos] = copy[target];
    copy[target] = temp;
    setSequenceOrder(copy);
  };

  const handleCheck = () => {
    const input: UniversalQuestionAnswerInput = {
      selectedIndex,
      selectedIndices,
      textValue,
      matchingSelection,
      sequenceOrder
    };
    const attemptId = `${question.id}::${JSON.stringify(input)}`;
    const result = evaluateUniversalQuestion(question, input, locale);
    setEvaluation(result);
    if (lastSubmittedSignatureRef.current === attemptId) {
      return;
    }
    lastSubmittedSignatureRef.current = attemptId;
    onEvaluated?.(result, question, attemptId);
  };

  const options = question.options ? question.options[locale] ?? question.options.ru : [];
  const sequenceItems = question.sequenceItems
    ? question.sequenceItems[locale] ?? question.sequenceItems.ru
    : [];
  const matchingLeft = question.matchingLeft
    ? question.matchingLeft[locale] ?? question.matchingLeft.ru
    : null;
  const matchingChoices = question.matchingRight
    ? question.matchingRight[locale] ?? question.matchingRight.ru
    : [];

  return (
    <div
      className="universal-question-card"
      data-testid={`universal-question-${question.id}`}
      style={{
        border: "1px solid var(--border, #e4e1d8)",
        borderRadius: 16,
        padding: "18px 20px",
        background: "var(--surface, #ffffff)",
        display: "grid",
        gap: 14
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 999,
            background: "rgba(56, 86, 245, 0.1)",
            color: "var(--accent, #3856f5)"
          }}
        >
          {ui.typeBadges[question.type]}
        </span>
        <span style={{ fontSize: 12, color: "var(--muted, #65635d)" }}>
          {question.maxPoints} {question.maxPoints === 1 ? "балл" : "балла"}
        </span>
      </div>

      {question.contextTitle && (
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            background: "var(--bg, #f7f5ef)",
            fontSize: 14,
            lineHeight: 1.5
          }}
        >
          <strong style={{ display: "block", marginBottom: 4 }}>
            {question.contextTitle[locale] ?? question.contextTitle.ru}
          </strong>
          {question.contextBody && (
            <p style={{ margin: 0 }}>{question.contextBody[locale] ?? question.contextBody.ru}</p>
          )}
        </div>
      )}

      {question.codeSnippet && (
        <pre
          style={{
            margin: 0,
            padding: "12px 14px",
            borderRadius: 12,
            background: "#161922",
            color: "#f8f8f2",
            fontSize: 13.5,
            overflowX: "auto",
            fontFamily: "var(--font-mono, monospace)"
          }}
        >
          <code>{question.codeSnippet}</code>
        </pre>
      )}

      <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5 }}>
        {question.prompt[locale] ?? question.prompt.ru}
      </div>

      {/* Render inputs based on question.type */}
      {(question.type === "single_choice" ||
        question.type === "true_false" ||
        question.type === "code_fix" ||
        question.type === "context_table") &&
        options.length > 0 && (
          <div style={{ display: "grid", gap: 8 }}>
            {options.map((opt, idx) => {
              const active = selectedIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  style={{
                    textAlign: "left",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: active
                      ? "2px solid var(--accent, #3856f5)"
                      : "1px solid var(--border, #dcd8ce)",
                    background: active ? "rgba(56, 86, 245, 0.08)" : "var(--surface, #fff)",
                    fontSize: 15,
                    lineHeight: 1.45,
                    cursor: "pointer",
                    fontWeight: active ? 600 : 400,
                    color: "inherit"
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

      {question.type === "multiple_choice" && options.length > 0 && (
        <div style={{ display: "grid", gap: 8 }}>
          {options.map((opt, idx) => {
            const checked = selectedIndices.includes(idx);
            return (
              <label
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "11px 14px",
                  borderRadius: 12,
                  border: checked
                    ? "2px solid var(--accent, #3856f5)"
                    : "1px solid var(--border, #dcd8ce)",
                  background: checked ? "rgba(56, 86, 245, 0.08)" : "var(--surface, #fff)",
                  cursor: "pointer",
                  fontSize: 15
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleToggleMulti(idx)}
                  style={{ width: 18, height: 18 }}
                />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>
      )}

      {(question.type === "numeric" ||
        question.type === "short_text" ||
        question.type === "fill_blank" ||
        question.type === "formula" ||
        question.type === "equation") && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <input
            type="text"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder={
              question.type === "numeric" ? ui.placeholderNumeric : ui.placeholderShort
            }
            style={{
              flex: "1 1 220px",
              padding: "11px 14px",
              borderRadius: 12,
              border: "1px solid var(--border, #dcd8ce)",
              fontSize: 16,
              background: "var(--surface, #fff)",
              color: "inherit"
            }}
          />
          {question.unit && (
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--muted, #65635d)" }}>
              {question.unit}
            </span>
          )}
        </div>
      )}

      {question.type === "long_text" && (
        <textarea
          rows={4}
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder={ui.placeholderLong}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid var(--border, #dcd8ce)",
            fontSize: 15,
            background: "var(--surface, #fff)",
            color: "inherit"
          }}
        />
      )}

      {question.type === "matching" && matchingLeft && (
        <div style={{ display: "grid", gap: 12 }}>
          {(["A", "B"] as const).map((rowKey, rowIdx) => {
            const label = matchingLeft[rowIdx] ?? "";
            return (
              <div
                key={rowKey}
                style={{
                  display: "grid",
                  gap: 6,
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: "var(--bg, #f7f5ef)"
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  {rowKey}) {label}
                </span>
                <select
                  value={matchingSelection[rowKey] ?? ""}
                  onChange={(e) =>
                    setMatchingSelection((prev) => ({
                      ...prev,
                      [rowKey]: e.target.value === "" ? undefined : Number(e.target.value)
                    }))
                  }
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid var(--border, #dcd8ce)",
                    fontSize: 14.5,
                    background: "var(--surface, #fff)",
                    color: "inherit"
                  }}
                >
                  <option value="">{ui.selectMatch}</option>
                  {matchingChoices.map((choice, cIdx) => (
                    <option key={cIdx} value={cIdx}>
                      {cIdx + 1}) {choice}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      )}

      {question.type === "sequence" && sequenceOrder.length > 0 && (
        <div style={{ display: "grid", gap: 8 }}>
          {sequenceOrder.map((itemIdx, pos) => (
            <div
              key={itemIdx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid var(--border, #dcd8ce)",
                background: "var(--bg, #f7f5ef)"
              }}
            >
              <span style={{ fontSize: 14.5 }}>
                <strong>{pos + 1}.</strong> {sequenceItems[itemIdx]}
              </span>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button
                  type="button"
                  disabled={pos === 0}
                  onClick={() => handleMoveSequence(pos, -1)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "1px solid var(--border, #dcd8ce)",
                    background: "var(--surface, #fff)",
                    cursor: pos === 0 ? "not-allowed" : "pointer",
                    opacity: pos === 0 ? 0.5 : 1,
                    fontSize: 12
                  }}
                >
                  {ui.moveUp}
                </button>
                <button
                  type="button"
                  disabled={pos === sequenceOrder.length - 1}
                  onClick={() => handleMoveSequence(pos, 1)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "1px solid var(--border, #dcd8ce)",
                    background: "var(--surface, #fff)",
                    cursor: pos === sequenceOrder.length - 1 ? "not-allowed" : "pointer",
                    opacity: pos === sequenceOrder.length - 1 ? 0.5 : 1,
                    fontSize: 12
                  }}
                >
                  {ui.moveDown}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
        <button
          type="button"
          className="primary"
          onClick={handleCheck}
          style={{
            padding: "11px 18px",
            borderRadius: 12,
            border: "none",
            background: "var(--accent, #3856f5)",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer"
          }}
        >
          {ui.checkBtn}
        </button>

        <button
          type="button"
          className="ghost"
          onClick={() => setShowHint((prev) => !prev)}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid var(--border, #dcd8ce)",
            background: "transparent",
            fontSize: 14,
            cursor: "pointer",
            color: "inherit"
          }}
        >
          {showHint ? ui.hideHintBtn : ui.hintBtn}
        </button>

        {evaluation && onNextQuestion && (
          <button
            type="button"
            onClick={onNextQuestion}
            style={{
              padding: "11px 16px",
              borderRadius: 12,
              border: "1px solid var(--accent, #3856f5)",
              background: "rgba(56, 86, 245, 0.08)",
              color: "var(--accent, #3856f5)",
              fontWeight: 600,
              fontSize: 14.5,
              cursor: "pointer"
            }}
          >
            {nextButtonLabel ?? ui.nextBtn}
          </button>
        )}
      </div>

      {showHint && (
        <div
          style={{
            padding: "11px 14px",
            borderRadius: 12,
            background: "rgba(245, 158, 11, 0.1)",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            fontSize: 14.5,
            lineHeight: 1.5
          }}
        >
          💡 {question.hint[locale] ?? question.hint.ru}
        </div>
      )}

      {evaluation && (
        <div
          data-testid="universal-question-feedback"
          data-verification-state={evaluation.verificationState}
          style={{
            padding: "14px 16px",
            borderRadius: 12,
            border:
              evaluation.verificationState === "verified_correct"
                ? "1px solid rgba(22, 163, 74, 0.4)"
                : evaluation.verificationState === "incorrect"
                  ? "1px solid rgba(220, 38, 38, 0.4)"
                  : "1px solid rgba(217, 119, 6, 0.45)",
            background:
              evaluation.verificationState === "verified_correct"
                ? "rgba(22, 163, 74, 0.08)"
                : evaluation.verificationState === "incorrect"
                  ? "rgba(220, 38, 38, 0.08)"
                  : "rgba(245, 158, 11, 0.09)",
            display: "grid",
            gap: 8
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
            <strong
              style={{
                fontSize: 13,
                letterSpacing: "0.03em",
                color:
                  evaluation.verificationState === "verified_correct"
                    ? "#15803d"
                    : evaluation.verificationState === "incorrect"
                      ? "#b91c1c"
                      : "#b45309"
              }}
            >
              {evaluation.verificationState === "verified_correct"
                ? ui.statusVerifiedCorrect
                : evaluation.verificationState === "incorrect"
                  ? ui.statusIncorrect
                  : evaluation.verificationState === "unverified"
                    ? ui.statusUnverified
                    : ui.statusUnsupported}
            </strong>
            <span style={{ fontSize: 12, color: "var(--muted, #65635d)" }}>
              {evaluation.verificationBasis}
            </span>
          </div>

          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.5 }}>
            {evaluation.feedback}
          </p>

          {question.rubricCriteria && (
            <div style={{ marginTop: 4 }}>
              <strong style={{ fontSize: 13 }}>{ui.rubricTitle}</strong>
              <ul style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: 14 }}>
                {(question.rubricCriteria[locale] ?? question.rubricCriteria.ru).map((crit, cIdx) => (
                  <li key={cIdx}>{crit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
