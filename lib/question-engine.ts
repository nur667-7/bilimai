import type { Language } from "./curriculum.ts";
import { checkAnswer, parseNumericAnswer } from "./error-lab.ts";
import type { VerificationState } from "./xray-trace.ts";

export const universalQuestionTypes = [
  "single_choice",
  "multiple_choice",
  "numeric",
  "short_text",
  "long_text",
  "matching",
  "sequence",
  "fill_blank",
  "true_false",
  "formula",
  "equation",
  "code_fix",
  "context_table"
] as const;

export type UniversalQuestionType = (typeof universalQuestionTypes)[number];

export interface UniversalTableData {
  headers: Record<Language, string[]>;
  rows: Record<Language, string[][]>;
}

export interface UniversalQuestion {
  id: string;
  subjectId: string;
  topicId: string;
  lessonId: string;
  type: UniversalQuestionType;
  difficulty: "basic" | "intermediate" | "advanced";
  maxPoints: 1 | 2;
  prompt: Record<Language, string>;
  contextTitle?: Record<Language, string>;
  contextBody?: Record<Language, string>;
  contextPassage?: Record<Language, string>;
  codeSnippet?: string;
  tableData?: UniversalTableData;
  options?: Record<Language, string[]>;
  correctIndex?: number;
  correctIndices?: number[];
  numericAnswer?: number;
  unit?: string;
  acceptedTexts?: Record<Language, string[]>;
  booleanAnswer?: boolean;
  matchingLeft?: Record<Language, [string, string]>;
  matchingRight?: Record<Language, [string, string, string, string]>;
  matchingPairs?: [number, number];
  sequenceItems?: Record<Language, string[]>;
  correctSequence?: number[];
  rubricCriteria?: Record<Language, string[]>;
  explanation: Record<Language, string>;
  hint: Record<Language, string>;
  errorCategory: string;
  optionDiagnoses?: Record<Language, string[]>;
}

export interface UniversalQuestionAnswerInput {
  selectedIndex?: number;
  selectedIndices?: number[];
  textValue?: string;
  matchingSelection?: { A?: number; B?: number };
  sequenceOrder?: number[];
  booleanAnswer?: boolean;
}

export type UniversalLearnerResponse =
  | { type: "single_choice"; selectedIndex: number }
  | { type: "multiple_choice"; selectedIndices: number[] }
  | { type: "numeric"; rawInput: string }
  | { type: "short_text"; text: string }
  | { type: "long_text"; text: string }
  | { type: "matching"; pairs: [number | null, number | null] }
  | { type: "sequence"; order: number[] }
  | { type: "fill_blank"; text: string }
  | { type: "true_false"; value: boolean }
  | { type: "formula"; expression: string }
  | { type: "equation"; expression: string }
  | { type: "code_fix"; selectedIndex?: number; fixedCode?: string }
  | { type: "context_table"; selectedIndex?: number; rawInput?: string }
  | { type: string; [key: string]: unknown };

export interface QuestionEvaluationResult {
  verificationState: VerificationState;
  isCorrect: boolean | null;
  earnedPoints: number;
  maxPoints: number;
  feedback: string;
  hint: string;
  errorCategory: string;
  verificationBasis: string;
}

export type UniversalQuestionEvaluation = QuestionEvaluationResult;

function normalizeToken(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/−/g, "-")
    .replace(/\s+/g, " ");
}

function normalizeFormula(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/−/g, "-")
    .replace(/·/g, "*")
    .replace(/\s+/g, "");
}

function coerceLearnerResponse(
  question: UniversalQuestion,
  raw: UniversalLearnerResponse | UniversalQuestionAnswerInput | null | undefined
): UniversalLearnerResponse | null {
  if (!raw || typeof raw !== "object") return null;
  if ("type" in raw && typeof raw.type === "string") {
    return raw as UniversalLearnerResponse;
  }
  const input = raw as UniversalQuestionAnswerInput;
  switch (question.type) {
    case "single_choice":
      return { type: "single_choice", selectedIndex: input.selectedIndex ?? -1 };
    case "multiple_choice":
      return { type: "multiple_choice", selectedIndices: input.selectedIndices ?? [] };
    case "numeric":
      return { type: "numeric", rawInput: input.textValue ?? "" };
    case "short_text":
      return { type: "short_text", text: input.textValue ?? "" };
    case "long_text":
      return { type: "long_text", text: input.textValue ?? "" };
    case "fill_blank":
      return { type: "fill_blank", text: input.textValue ?? "" };
    case "formula":
      return { type: "formula", expression: input.textValue ?? "" };
    case "equation":
      return { type: "equation", expression: input.textValue ?? "" };
    case "true_false":
      return {
        type: "true_false",
        value:
          typeof input.booleanAnswer === "boolean"
            ? input.booleanAnswer
            : input.selectedIndex === 0
      };
    case "matching":
      return {
        type: "matching",
        pairs: [input.matchingSelection?.A ?? null, input.matchingSelection?.B ?? null]
      };
    case "sequence":
      return { type: "sequence", order: input.sequenceOrder ?? [] };
    case "code_fix":
      return {
        type: "code_fix",
        selectedIndex: input.selectedIndex,
        fixedCode: input.textValue
      };
    case "context_table":
      return {
        type: "context_table",
        selectedIndex: input.selectedIndex,
        rawInput: input.textValue
      };
  }
}

/**
 * Evaluates any universal question deterministically and honestly reports
 * verificationState: "verified_correct" | "incorrect" | "unverified" | "unsupported".
 */
export function evaluateUniversalQuestion(
  question: UniversalQuestion,
  responseInput: UniversalLearnerResponse | UniversalQuestionAnswerInput | null | undefined,
  lang: Language
): QuestionEvaluationResult {
  const baseHint = question.hint[lang];
  const baseExplanation = question.explanation[lang];

  const response = coerceLearnerResponse(question, responseInput);
  if (!response) {
    return {
      verificationState: "unverified",
      isCorrect: null,
      earnedPoints: 0,
      maxPoints: question.maxPoints,
      feedback:
        lang === "kk"
          ? "Жауап енгізілмеген."
          : lang === "uz"
            ? "Javob kiritilmagan."
            : "Ответ не введён.",
      hint: baseHint,
      errorCategory: question.errorCategory,
      verificationBasis:
        lang === "kk"
          ? "Жауап берілген жоқ."
          : lang === "uz"
            ? "Javob berilmagan."
            : "Ответ ещё не предоставлен."
    };
  }

  if (
    !(universalQuestionTypes as readonly string[]).includes(question.type) ||
    response.type !== question.type
  ) {
    return {
      verificationState: "unsupported",
      isCorrect: null,
      earnedPoints: 0,
      maxPoints: question.maxPoints,
      feedback:
        lang === "kk"
          ? "Бұл жауап форматы автоматты тексеруде қолдау таппайды."
          : lang === "uz"
            ? "Ushbu javob formati avtomatik tekshiruvda qo‘llab-quvvatlanmaydi."
            : "Данный формат ответа не поддерживается автоматическим валидатором.",
      hint: baseHint,
      errorCategory: question.errorCategory,
      verificationBasis: "Unsupported question or response type."
    };
  }

  switch (question.type) {
    case "single_choice": {
      const idx = (response as { selectedIndex: number }).selectedIndex;
      const ok = typeof idx === "number" && idx === question.correctIndex;
      const customDiag = question.optionDiagnoses?.[lang]?.[idx];
      return {
        verificationState: ok ? "verified_correct" : "incorrect",
        isCorrect: ok,
        earnedPoints: ok ? question.maxPoints : 0,
        maxPoints: question.maxPoints,
        feedback: ok ? baseExplanation : customDiag || baseExplanation,
        hint: baseHint,
        errorCategory: question.errorCategory,
        verificationBasis:
          lang === "kk"
            ? "Кілт бойынша детерминирленген тексеру (1 дұрыс нұсқа)."
            : lang === "uz"
              ? "Kalit bo‘yicha deterministik tekshiruv (1 to‘g‘ri variant)."
              : "Детерминированная сверка с эталонным ключом (выбор 1 из вариантов)."
      };
    }

    case "multiple_choice": {
      const picked = Array.from(
        new Set((response as { selectedIndices: number[] }).selectedIndices ?? [])
      ).sort((a, b) => a - b);
      const target = [...(question.correctIndices ?? [])].sort((a, b) => a - b);
      const targetSet = new Set(target);
      const pickedSet = new Set(picked);
      let mistakes = 0;
      for (const c of targetSet) {
        if (!pickedSet.has(c)) mistakes++;
      }
      for (const p of pickedSet) {
        if (!targetSet.has(p)) mistakes++;
      }
      const exact = mistakes === 0 && picked.length > 0;
      const partial = mistakes === 1 && picked.length > 0;
      const earned = exact ? question.maxPoints : partial && question.maxPoints === 2 ? 1 : 0;
      return {
        verificationState: exact ? "verified_correct" : "incorrect",
        isCorrect: exact,
        earnedPoints: earned,
        maxPoints: question.maxPoints,
        feedback: baseExplanation,
        hint: baseHint,
        errorCategory: question.errorCategory,
        verificationBasis:
          lang === "kk"
            ? "Көп таңдаулы кілт бойынша тексеру (0/1/2 балл)."
            : lang === "uz"
              ? "Ko‘p tanlovli kalit bo‘yicha tekshiruv (0/1/2 ball)."
              : "Детерминированная сверка множества выбранных вариантов (0/1/2 балла)."
      };
    }

    case "numeric":
    case "equation": {
      const raw =
        question.type === "numeric"
          ? (response as { rawInput: string }).rawInput
          : (response as { expression: string }).expression;
      const cleaned = String(raw ?? "").replace(/^\s*x\s*=\s*/i, "").trim();
      if (parseNumericAnswer(cleaned) === null) {
        return {
          verificationState: "unverified",
          isCorrect: null,
          earnedPoints: 0,
          maxPoints: question.maxPoints,
          feedback:
            lang === "kk"
              ? "Санды немесе бөлшекті (мысалы, 3/7) енгізіңіз."
              : lang === "uz"
                ? "Son yoki kasrni (masalan, 3/7) kiriting."
                : "Введите корректное число или обыкновенную дробь (например, 3/7).",
          hint: baseHint,
          errorCategory: question.errorCategory,
          verificationBasis: "Numeric parser could not parse input as a finite number."
        };
      }
      const ok =
        question.numericAnswer !== undefined &&
        checkAnswer(cleaned, question.numericAnswer);
      return {
        verificationState: ok ? "verified_correct" : "incorrect",
        isCorrect: ok,
        earnedPoints: ok ? question.maxPoints : 0,
        maxPoints: question.maxPoints,
        feedback: baseExplanation,
        hint: baseHint,
        errorCategory: question.errorCategory,
        verificationBasis:
          lang === "kk"
            ? "Сандық мәнді дәл есептеу арқылы тексеру."
            : lang === "uz"
              ? "Sonli qiymatni aniq hisoblash orqali tekshirish."
              : "Детерминированное сравнение числового значения (с поддержкой десятичных и обыкновенных дробей)."
      };
    }

    case "short_text":
    case "fill_blank": {
      const text = normalizeToken((response as { text: string }).text ?? "");
      if (!text) {
        return {
          verificationState: "unverified",
          isCorrect: null,
          earnedPoints: 0,
          maxPoints: question.maxPoints,
          feedback:
            lang === "kk"
              ? "Қысқа жауап мәтінін енгізіңіз."
              : lang === "uz"
                ? "Qisqa javob matnini kiriting."
                : "Введите текст ответа.",
          hint: baseHint,
          errorCategory: question.errorCategory,
          verificationBasis: "Empty text response."
        };
      }
      const accepted = (question.acceptedTexts?.[lang] ?? []).map(normalizeToken);
      const ok = accepted.includes(text);
      return {
        verificationState: ok ? "verified_correct" : "incorrect",
        isCorrect: ok,
        earnedPoints: ok ? question.maxPoints : 0,
        maxPoints: question.maxPoints,
        feedback: baseExplanation,
        hint: baseHint,
        errorCategory: question.errorCategory,
        verificationBasis:
          lang === "kk"
            ? "Нормаланған терминдер сөздігімен салыстыру."
            : lang === "uz"
              ? "Normallashtirilgan atamalar ro‘yxati bilan solishtirish."
              : "Нормализованное сопоставление с допустимыми формами термина/ответа."
      };
    }

    case "formula": {
      const expr = normalizeFormula((response as { expression: string }).expression ?? "");
      const accepted = (question.acceptedTexts?.[lang] ?? []).map(normalizeFormula);
      const ok = expr.length > 0 && accepted.includes(expr);
      return {
        verificationState: ok ? "verified_correct" : "incorrect",
        isCorrect: ok,
        earnedPoints: ok ? question.maxPoints : 0,
        maxPoints: question.maxPoints,
        feedback: baseExplanation,
        hint: baseHint,
        errorCategory: question.errorCategory,
        verificationBasis:
          lang === "kk"
            ? "Канондық формула жазылуымен салыстыру."
            : lang === "uz"
              ? "Kanonik formula yozilishi bilan solishtirish."
              : "Сверка нормализованной записи формулы с эталонными тождественными формами."
      };
    }

    case "true_false": {
      const val = (response as { value: boolean }).value;
      const ok = typeof val === "boolean" && val === question.booleanAnswer;
      return {
        verificationState: ok ? "verified_correct" : "incorrect",
        isCorrect: ok,
        earnedPoints: ok ? question.maxPoints : 0,
        maxPoints: question.maxPoints,
        feedback: baseExplanation,
        hint: baseHint,
        errorCategory: question.errorCategory,
        verificationBasis:
          lang === "kk"
            ? "Ақиқат / Жалған логикалық тексеру."
            : lang === "uz"
              ? "Rost / Yolg‘on mantiqiy tekshiruv."
              : "Детерминированная проверка истинности утверждения (True / False)."
      };
    }

    case "matching": {
      const pairs = (response as { pairs: [number | null, number | null] }).pairs ?? [null, null];
      const expected = question.matchingPairs ?? [0, 1];
      let hits = 0;
      if (pairs[0] === expected[0]) hits++;
      if (pairs[1] === expected[1]) hits++;
      const exact = hits === 2;
      const earned = hits === 2 ? question.maxPoints : hits === 1 && question.maxPoints === 2 ? 1 : 0;
      return {
        verificationState: exact ? "verified_correct" : "incorrect",
        isCorrect: exact,
        earnedPoints: earned,
        maxPoints: question.maxPoints,
        feedback: baseExplanation,
        hint: baseHint,
        errorCategory: question.errorCategory,
        verificationBasis:
          lang === "kk"
            ? "Сәйкестік жұптарын тексеру (A/B → 1..4)."
            : lang === "uz"
              ? "Moslik juftliklarini tekshirish (A/B → 1..4)."
              : "Попарная проверка соответствия элементов (A/B → 1..4)."
      };
    }

    case "sequence": {
      const order = (response as { order: number[] }).order ?? [];
      const expected = question.correctSequence ?? [];
      const ok =
        order.length === expected.length &&
        order.every((item, idx) => item === expected[idx]);
      return {
        verificationState: ok ? "verified_correct" : "incorrect",
        isCorrect: ok,
        earnedPoints: ok ? question.maxPoints : 0,
        maxPoints: question.maxPoints,
        feedback: baseExplanation,
        hint: baseHint,
        errorCategory: question.errorCategory,
        verificationBasis:
          lang === "kk"
            ? "Реттілік индекстерін толық салыстыру."
            : lang === "uz"
              ? "Ketma-ketlik indekslarini to‘liq solishtirish."
              : "Точная проверка хронологической или алгоритмической последовательности."
      };
    }

    case "code_fix":
    case "context_table": {
      const r = response as { selectedIndex?: number; fixedCode?: string; rawInput?: string };
      if (typeof r.selectedIndex === "number" && question.correctIndex !== undefined) {
        const ok = r.selectedIndex === question.correctIndex;
        const customDiag = question.optionDiagnoses?.[lang]?.[r.selectedIndex];
        return {
          verificationState: ok ? "verified_correct" : "incorrect",
          isCorrect: ok,
          earnedPoints: ok ? question.maxPoints : 0,
          maxPoints: question.maxPoints,
          feedback: ok ? baseExplanation : customDiag || baseExplanation,
          hint: baseHint,
          errorCategory: question.errorCategory,
          verificationBasis:
            lang === "kk"
              ? "Код/кесте тапсырмасының эталондық кілтімен салыстыру."
              : lang === "uz"
                ? "Kod/jadval topshirig‘ining etalon kaliti bilan solishtirish."
                : "Детерминированная проверка исправления кода / ответа по таблице."
        };
      }
      if (r.fixedCode && question.acceptedTexts) {
        const norm = normalizeFormula(r.fixedCode);
        const accepted = (question.acceptedTexts[lang] ?? []).map(normalizeFormula);
        const ok = accepted.includes(norm);
        return {
          verificationState: ok ? "verified_correct" : "incorrect",
          isCorrect: ok,
          earnedPoints: ok ? question.maxPoints : 0,
          maxPoints: question.maxPoints,
          feedback: baseExplanation,
          hint: baseHint,
          errorCategory: question.errorCategory,
          verificationBasis: "Normalized code token match."
        };
      }
      return {
        verificationState: "unverified",
        isCorrect: null,
        earnedPoints: 0,
        maxPoints: question.maxPoints,
        feedback: baseExplanation,
        hint: baseHint,
        errorCategory: question.errorCategory,
        verificationBasis: "Incomplete response for code/table task."
      };
    }

    case "long_text": {
      // Honest limitation: free-form essays/explanations cannot be deterministically scored without a human or rubric verification
      return {
        verificationState: "unverified",
        isCorrect: null,
        earnedPoints: 0,
        maxPoints: question.maxPoints,
        feedback: baseExplanation,
        hint: baseHint,
        errorCategory: question.errorCategory,
        verificationBasis:
          lang === "kk"
            ? "Еркін мәтіндік жауап автоматты балл қоюсыз өзін-өзі тексеру критерийлерімен салыстырылады (Unverified)."
            : lang === "uz"
              ? "Erkin matnli javob avtomatik ball qo‘yilmasdan mezonlar asosida tekshiriladi (Unverified)."
              : "Развёрнутый текстовый ответ не оценивается фиктивным автоматическим баллом (статус: Unverified). Сверьте аргументацию с эталонными критериями ниже."
      };
    }
  }
}

export interface LessonStepTransition {
  nextIndex: number;
  completed: boolean;
}

/**
 * Safely advances through practice questions in a lesson without ever
 * accessing an out-of-bounds index or looping back to 0 unannounced (CASE B).
 */
export function advanceLessonQuestionIndex(
  currentIndex: number,
  totalQuestions: number
): LessonStepTransition {
  if (totalQuestions <= 0) {
    return { nextIndex: 0, completed: true };
  }
  const safeCurrent = Math.max(0, Math.min(currentIndex, totalQuestions - 1));
  if (safeCurrent + 1 >= totalQuestions) {
    return {
      nextIndex: totalQuestions - 1,
      completed: true
    };
  }
  return {
    nextIndex: safeCurrent + 1,
    completed: false
  };
}
