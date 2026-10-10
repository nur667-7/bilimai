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
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/\s+/g, "");
}

type ExprNode =
  | { kind: "num"; value: number }
  | { kind: "var"; name: string }
  | { kind: "unary"; op: "-" | "+"; arg: ExprNode }
  | { kind: "bin"; op: "+" | "-" | "*" | "/" | "^"; left: ExprNode; right: ExprNode };

function tokenizeMathExpr(raw: string): string[] | null {
  const s = normalizeFormula(raw);
  if (!s) return null;
  const tokens: string[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === "+" || ch === "-" || ch === "*" || ch === "/" || ch === "^" || ch === "(" || ch === ")") {
      tokens.push(ch);
      i++;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let numStr = "";
      let dotCount = 0;
      while (i < s.length && /[0-9.]/.test(s[i])) {
        if (s[i] === ".") dotCount++;
        if (dotCount > 1) return null;
        numStr += s[i];
        i++;
      }
      if (numStr === ".") return null;
      tokens.push(numStr);
      // Implicit multiplication e.g. 2x or 2(x+1)
      if (i < s.length && (/[a-zа-я_]/i.test(s[i]) || s[i] === "(")) {
        tokens.push("*");
      }
      continue;
    }
    if (/[a-zа-я_]/i.test(ch)) {
      let idStr = "";
      while (i < s.length && /[a-zа-я0-9_]/i.test(s[i])) {
        idStr += s[i];
        i++;
      }
      tokens.push(idStr);
      if (i < s.length && s[i] === "(") {
        // Function calls like sin(x) are not supported in elementary algebraic parser -> unverified
        return null;
      }
      continue;
    }
    return null;
  }
  return tokens.length > 0 ? tokens : null;
}

function parseMathExpression(raw: string): { ast: ExprNode; vars: Set<string> } | null {
  const maybeTokens = tokenizeMathExpr(raw);
  if (!maybeTokens) return null;
  const tokens: string[] = maybeTokens;
  let pos = 0;
  const vars = new Set<string>();

  function parseAddSub(): ExprNode | null {
    let left = parseMulDiv();
    if (!left) return null;
    while (pos < tokens.length && (tokens[pos] === "+" || tokens[pos] === "-")) {
      const op = tokens[pos++] as "+" | "-";
      const right = parseMulDiv();
      if (!right) return null;
      left = { kind: "bin", op, left, right };
    }
    return left;
  }

  function parseMulDiv(): ExprNode | null {
    let left = parsePower();
    if (!left) return null;
    while (pos < tokens.length && (tokens[pos] === "*" || tokens[pos] === "/")) {
      const op = tokens[pos++] as "*" | "/";
      const right = parsePower();
      if (!right) return null;
      left = { kind: "bin", op, left, right };
    }
    return left;
  }

  function parsePower(): ExprNode | null {
    const base = parseUnary();
    if (!base) return null;
    if (pos < tokens.length && tokens[pos] === "^") {
      pos++;
      const exp = parsePower();
      if (!exp) return null;
      return { kind: "bin", op: "^", left: base, right: exp };
    }
    return base;
  }

  function parseUnary(): ExprNode | null {
    if (pos < tokens.length && (tokens[pos] === "+" || tokens[pos] === "-")) {
      const op = tokens[pos++] as "+" | "-";
      const arg = parseUnary();
      if (!arg) return null;
      return { kind: "unary", op, arg };
    }
    return parsePrimary();
  }

  function parsePrimary(): ExprNode | null {
    if (pos >= tokens.length) return null;
    const tok = tokens[pos++];
    if (tok === "(") {
      const inner = parseAddSub();
      if (!inner || pos >= tokens.length || tokens[pos++] !== ")") return null;
      return inner;
    }
    if (/^[0-9]/.test(tok)) {
      const val = Number(tok);
      if (!Number.isFinite(val)) return null;
      return { kind: "num", value: val };
    }
    if (/^[a-zа-я_]/i.test(tok)) {
      vars.add(tok);
      return { kind: "var", name: tok };
    }
    return null;
  }

  const ast = parseAddSub();
  if (!ast || pos !== tokens.length) return null;
  return { ast, vars };
}

function evalAst(node: ExprNode, env: Record<string, number>): number {
  switch (node.kind) {
    case "num":
      return node.value;
    case "var":
      return env[node.name] ?? NaN;
    case "unary": {
      const v = evalAst(node.arg, env);
      return node.op === "-" ? -v : v;
    }
    case "bin": {
      const l = evalAst(node.left, env);
      const r = evalAst(node.right, env);
      switch (node.op) {
        case "+":
          return l + r;
        case "-":
          return l - r;
        case "*":
          return l * r;
        case "/":
          return r === 0 ? NaN : l / r;
        case "^":
          return Math.pow(l, r);
      }
    }
  }
}

/**
 * Evaluates whether a candidate formula is algebraically/commutatively equivalent to any accepted formula.
 * Supports rearranged equations (e.g. `F = m * a`, `a * m = F`, `m = F / a`) and returns `"unverified"`
 * if the expression cannot be parsed deterministically (E2E-010).
 */
export function evaluateFormulaEquivalence(
  candidateRaw: string,
  acceptedForms: string[]
): "verified_correct" | "incorrect" | "unverified" {
  const normCand = normalizeFormula(candidateRaw);
  if (!normCand) return "unverified";

  const normAccepted = acceptedForms.map(normalizeFormula).filter(Boolean);
  if (normAccepted.includes(normCand)) {
    return "verified_correct";
  }

  // Split candidate by '='
  const candParts = normCand.split("=");
  if (candParts.length > 2 || candParts.some((p) => p.length === 0)) {
    return "unverified";
  }

  const parsedCandLeft = parseMathExpression(candParts[0]);
  if (!parsedCandLeft) return "unverified";
  const parsedCandRight = candParts.length === 2 ? parseMathExpression(candParts[1]) : null;
  if (candParts.length === 2 && !parsedCandRight) return "unverified";

  const candVars = new Set<string>([
    ...parsedCandLeft.vars,
    ...(parsedCandRight ? parsedCandRight.vars : [])
  ]);

  const seedVectors = [
    [2.3, 3.7, 5.1, 7.3, 11.2],
    [4.1, 1.9, 6.7, 2.9, 8.3],
    [7.9, 2.7, 3.3, 5.9, 4.7]
  ];

  for (const acc of normAccepted) {
    const accParts = acc.split("=");
    if (accParts.length > 2 || accParts.some((p) => p.length === 0)) continue;
    const parsedAccLeft = parseMathExpression(accParts[0]);
    if (!parsedAccLeft) continue;
    const parsedAccRight = accParts.length === 2 ? parseMathExpression(accParts[1]) : null;
    if (accParts.length === 2 && !parsedAccRight) continue;

    // Case 1: Both candidate and accepted are pure expressions (no '=')
    if (candParts.length === 1 && accParts.length === 1) {
      const allVars = Array.from(new Set([...candVars, ...parsedAccLeft.vars])).sort();
      let allMatch = true;
      for (const vec of seedVectors) {
        const env: Record<string, number> = {};
        allVars.forEach((v, idx) => {
          env[v] = vec[idx % vec.length] + idx * 0.41;
        });
        const vCand = evalAst(parsedCandLeft.ast, env);
        const vAcc = evalAst(parsedAccLeft.ast, env);
        if (!Number.isFinite(vCand) || !Number.isFinite(vAcc) || Math.abs(vCand - vAcc) > 1e-6) {
          allMatch = false;
          break;
        }
      }
      if (allMatch) return "verified_correct";
    }

    // Case 2: Accepted is an equality `LHS = RHS` (e.g. `f = m * a` where one side is a single variable)
    if (accParts.length === 2 && parsedAccRight) {
      const lhsSingleVar =
        parsedAccLeft.ast.kind === "var" && !parsedAccRight.vars.has(parsedAccLeft.ast.name)
          ? parsedAccLeft.ast.name
          : null;
      const rhsSingleVar =
        parsedAccRight.ast.kind === "var" && !parsedAccLeft.vars.has(parsedAccRight.ast.name)
          ? parsedAccRight.ast.name
          : null;

      const dependentVar = lhsSingleVar ?? rhsSingleVar;
      const definingAst = lhsSingleVar ? parsedAccRight.ast : rhsSingleVar ? parsedAccLeft.ast : null;
      const indepVars = Array.from(
        lhsSingleVar ? parsedAccRight.vars : rhsSingleVar ? parsedAccLeft.vars : []
      ).sort();

      if (dependentVar && definingAst) {
        // 2a: Candidate is a pure expression (e.g. `a * m` when accepted has `F = m * a`)
        if (candParts.length === 1) {
          let exprMatches = true;
          for (const vec of seedVectors) {
            const env: Record<string, number> = {};
            indepVars.forEach((v, idx) => {
              env[v] = vec[idx % vec.length] + idx * 0.37;
            });
            const vCand = evalAst(parsedCandLeft.ast, env);
            const vDef = evalAst(definingAst, env);
            if (!Number.isFinite(vCand) || !Number.isFinite(vDef) || Math.abs(vCand - vDef) > 1e-6) {
              exprMatches = false;
              break;
            }
          }
          if (exprMatches) return "verified_correct";
        }

        // 2b: Candidate is an equality `L_cand = R_cand` (e.g. `a * m = F` or `m = F / a`)
        if (candParts.length === 2 && parsedCandRight) {
          const expectedVarSet = new Set([dependentVar, ...indepVars]);
          const sameVars =
            candVars.size === expectedVarSet.size &&
            Array.from(candVars).every((v) => expectedVarSet.has(v));

          if (sameVars) {
            let eqMatches = true;
            for (const vec of seedVectors) {
              const env: Record<string, number> = {};
              indepVars.forEach((v, idx) => {
                env[v] = vec[idx % vec.length] + idx * 0.37;
              });
              env[dependentVar] = evalAst(definingAst, env);
              const lVal = evalAst(parsedCandLeft.ast, env);
              const rVal = evalAst(parsedCandRight.ast, env);
              if (!Number.isFinite(lVal) || !Number.isFinite(rVal) || Math.abs(lVal - rVal) > 1e-6) {
                eqMatches = false;
                break;
              }
            }

            // Anti-tautology check: perturbing dependentVar must break candidate equality
            if (eqMatches) {
              const perturbEnv: Record<string, number> = {};
              indepVars.forEach((v, idx) => {
                perturbEnv[v] = seedVectors[0][idx % seedVectors[0].length] + idx * 0.37;
              });
              perturbEnv[dependentVar] = evalAst(definingAst, perturbEnv) + 97.31;
              const lPerturb = evalAst(parsedCandLeft.ast, perturbEnv);
              const rPerturb = evalAst(parsedCandRight.ast, perturbEnv);
              if (Number.isFinite(lPerturb) && Number.isFinite(rPerturb) && Math.abs(lPerturb - rPerturb) > 1e-3) {
                return "verified_correct";
              }
            }
          }
        }
      }
    }
  }

  return "incorrect";
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
      if (typeof idx !== "number" || idx < 0) {
        return {
          verificationState: "unverified",
          isCorrect: null,
          earnedPoints: 0,
          maxPoints: question.maxPoints,
          feedback:
            lang === "kk"
              ? "Жауап нұсқасын таңдаңыз."
              : lang === "uz"
                ? "Javob variantini tanlang."
                : "Выберите вариант ответа.",
          hint: baseHint,
          errorCategory: question.errorCategory,
          verificationBasis: "No option selected."
        };
      }
      const ok = idx === question.correctIndex;
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
      if (picked.length === 0) {
        return {
          verificationState: "unverified",
          isCorrect: null,
          earnedPoints: 0,
          maxPoints: question.maxPoints,
          feedback:
            lang === "kk"
              ? "Кемінде бір нұсқаны таңдаңыз."
              : lang === "uz"
                ? "Kamida bitta variantni tanlang."
                : "Выберите хотя бы один вариант ответа.",
          hint: baseHint,
          errorCategory: question.errorCategory,
          verificationBasis: "No options selected."
        };
      }
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
      const trimmed = String(raw ?? "").trim();

      if (question.type === "equation" && question.numericAnswer !== undefined) {
        // Also support equivalent equation forms like `7 = x` or `2x = 14` when numericAnswer is defined
        const eqState = evaluateFormulaEquivalence(trimmed, [`x=${question.numericAnswer}`, `${question.numericAnswer}`]);
        if (eqState === "verified_correct") {
          return {
            verificationState: "verified_correct",
            isCorrect: true,
            earnedPoints: question.maxPoints,
            maxPoints: question.maxPoints,
            feedback: baseExplanation,
            hint: baseHint,
            errorCategory: question.errorCategory,
            verificationBasis:
              lang === "kk"
                ? "Теңдеудің түбірін эквиваленттік тексеру."
                : lang === "uz"
                  ? "Tenglama ildizini ekvivalentlik bo‘yicha tekshirish."
                  : "Детерминированная проверка корня и тождественной записи уравнения."
          };
        }
      }

      const cleaned = trimmed.replace(/^\s*[a-z]\s*=\s*/i, "").trim();
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
      const accepted = [
        ...(question.acceptedTexts?.[lang] ?? []),
        ...(question.acceptedTexts?.ru ?? [])
      ].map(normalizeToken);
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
      const rawExpr = (response as { expression: string }).expression ?? "";
      const acceptedList = [
        ...(question.acceptedTexts?.[lang] ?? []),
        ...(question.acceptedTexts?.ru ?? [])
      ];
      const eqResult = evaluateFormulaEquivalence(rawExpr, acceptedList);
      if (eqResult === "unverified") {
        return {
          verificationState: "unverified",
          isCorrect: null,
          earnedPoints: 0,
          maxPoints: question.maxPoints,
          feedback:
            lang === "kk"
              ? "Формула танылмады. Алгебралық өрнекті тексеріңіз (мысалы: F = m * a)."
              : lang === "uz"
                ? "Formula aniqlanmadi. Algebraik ifodani tekshiring (masalan: F = m * a)."
                : "Формула не распознана парсером (статус: Unverified). Проверьте скобки и знаки операций (например: F = m * a).",
          hint: baseHint,
          errorCategory: question.errorCategory,
          verificationBasis: "Formula expression could not be deterministically parsed."
        };
      }
      const ok = eqResult === "verified_correct";
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
            ? "Формуланың алгебралық эквиваленттілігін тексеру."
            : lang === "uz"
              ? "Formulaning algebraik ekvivalentligini tekshirish."
              : "Алгебраическая сверка формулы с учётом коммутативности и эквивалентных выражений величин."
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
      if (pairs[0] === null && pairs[1] === null) {
        return {
          verificationState: "unverified",
          isCorrect: null,
          earnedPoints: 0,
          maxPoints: question.maxPoints,
          feedback:
            lang === "kk"
              ? "A және B үшін сәйкестікті таңдаңыз."
              : lang === "uz"
                ? "A va B uchun moslikni tanlang."
                : "Выберите соответствие для пунктов A и B.",
          hint: baseHint,
          errorCategory: question.errorCategory,
          verificationBasis: "No matching pairs selected."
        };
      }
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
      if (typeof r.selectedIndex === "number" && r.selectedIndex >= 0 && question.correctIndex !== undefined) {
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
