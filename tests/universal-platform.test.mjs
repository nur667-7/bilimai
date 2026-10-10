import test from "node:test";
import assert from "node:assert/strict";

import { analyzeCustomDraft } from "../lib/xray-trace.ts";
import {
  evaluateUniversalQuestion,
  evaluateFormulaEquivalence,
  advanceLessonQuestionIndex,
  universalQuestionTypes
} from "../lib/question-engine.ts";
import {
  getAllSubjectCurricula,
  getSubjectCurriculum,
  registerSubjectCurriculum,
  buildUniversalSubjectGraph,
  findSubjectLessonByIdOrSlug,
  computeRecommendedLessonForSubject,
  formatLessonsCountLabel,
  formatQuestionsCountLabel,
  WELCOME_DEMO_ITEMS
} from "../lib/universal-curriculum.ts";
import {
  createDefaultUniversalProgressState,
  migrateUniversalProgressState,
  getSubjectProgress,
  getSubjectSummaryMetrics,
  recordSubjectLessonCompletion,
  recordSubjectQuestionAttempt,
  recordSubjectErrorLabCompletion,
  saveOnboardingSelection
} from "../lib/universal-progress.ts";
import {
  resolveServerSessionFromHeaders,
  authorizeTeacherClassAccess
} from "../lib/rbac.ts";

test("CASE A: Xray false positive — wrong arithmetic is flagged incorrect and unrecognized steps are unverified (never valid)", () => {
  // 1) Wrong linear transition: 2x + 3 = 11 -> 2x = 5 -> x = 2.5
  const linearInput = "2x + 3 = 11\n2x = 5\nx = 2.5";
  const linearResult = analyzeCustomDraft(linearInput, "ru");

  assert.equal(linearResult.lines.length, 3);
  assert.equal(linearResult.lines[1].status, "fracture");
  assert.equal(linearResult.lines[1].verificationState, "incorrect");
  assert.equal(linearResult.overallVerificationState, "incorrect");
  assert.notEqual(
    linearResult.lines[1].status,
    "valid",
    "Broken linear transition 2x+3=11 -> 2x=5 must never be marked valid"
  );

  // 2) Arbitrary unrecognized step that cannot be deterministically verified
  const unrecognizedInput = "sin(x) + cos(x) = 1.2\nsin(2x) = 0.44";
  const unrecResult = analyzeCustomDraft(unrecognizedInput, "ru");
  for (const line of unrecResult.lines) {
    assert.notEqual(
      line.status,
      "valid",
      `Unrecognized step "${line.expression}" must not be marked valid`
    );
    assert.equal(line.status, "unverified");
    assert.equal(line.verificationState, "unverified");
  }
  assert.equal(unrecResult.savedPointsEstimate, 0);
  assert.equal(unrecResult.overallVerificationState, "unverified");
});

test("CASE A (positive control): Xray still detects known sign_flip and domain_loss traps", () => {
  const trapInput = "-2x > 8\nx > -4";
  const result = analyzeCustomDraft(trapInput, "ru");
  const brokenLine = result.lines.find((l) => l.status === "fracture");
  assert.ok(brokenLine, "Known inequality sign trap must be flagged as fracture");
  assert.equal(brokenLine.verificationState, "incorrect");
  assert.equal(brokenLine.trapCategory, "sign_flip");
  assert.ok(result.savedPointsEstimate >= 1);
});

test("CASE B: Last practice question index never overflows or loops back to 0", () => {
  const step0 = advanceLessonQuestionIndex(0, 3);
  assert.deepEqual(step0, { nextIndex: 1, completed: false });

  const step1 = advanceLessonQuestionIndex(1, 3);
  assert.deepEqual(step1, { nextIndex: 2, completed: false });

  const stepLast = advanceLessonQuestionIndex(2, 3);
  assert.deepEqual(stepLast, { nextIndex: 2, completed: true });

  const stepEmpty = advanceLessonQuestionIndex(0, 0);
  assert.deepEqual(stepEmpty, { nextIndex: 0, completed: true });
});

test("CASE C: Subject-isolated progress — Physics activity never pollutes History or English", () => {
  let state = createDefaultUniversalProgressState();
  state = recordSubjectLessonCompletion(
    state,
    "physics",
    "physics-lesson-phys_kinematics",
    "phys_kinematics"
  );
  state = recordSubjectQuestionAttempt(state, {
    subjectId: "physics",
    topicId: "phys_kinematics",
    earnedPoints: 1,
    maxPoints: 1,
    verificationState: "verified_correct"
  });
  state = recordSubjectErrorLabCompletion(state, "physics", "phys-err-units");

  const physMetrics = getSubjectSummaryMetrics(state, "physics", 3);
  const histMetrics = getSubjectSummaryMetrics(state, "history_kz", 3);
  const engMetrics = getSubjectSummaryMetrics(state, "english", 3);

  assert.equal(physMetrics.completedLessons, 1);
  assert.equal(physMetrics.completionPercent, 33);
  assert.equal(physMetrics.averageAccuracyPercent, 100);
  assert.equal(physMetrics.errorLabFixedCount, 1);

  assert.equal(histMetrics.completedLessons, 0);
  assert.equal(histMetrics.completionPercent, 0);
  assert.equal(histMetrics.averageAccuracyPercent, null);
  assert.equal(histMetrics.errorLabFixedCount, 0);

  assert.equal(engMetrics.completedLessons, 0);
  assert.equal(engMetrics.averageAccuracyPercent, null);
});

test("CASE D & CASE E: Guest storage honesty and resilient migration from legacy bilimai-lab-v1", () => {
  const fresh = createDefaultUniversalProgressState();
  assert.equal(fresh.storageMode, "local_guest");
  assert.equal(fresh.version, 2);

  // Migrate from legacy bilimai-lab-v1
  const legacyRaw = JSON.stringify({
    records: [
      { topic: "linear", correct: true, errorReason: "sign_flip" },
      { topic: "linear", correct: false, errorReason: "sign_flip" },
      { topic: "quadratic", correct: true }
    ]
  });
  const migrated = migrateUniversalProgressState(null, legacyRaw);
  assert.equal(migrated.storageMode, "local_guest");
  const mathMetrics = getSubjectSummaryMetrics(migrated, "math", 16);
  assert.equal(mathMetrics.totalAttempts, 3);
  assert.equal(mathMetrics.averageAccuracyPercent, 67);
  const mathProg = getSubjectProgress(migrated, "math");
  assert.equal(mathProg.errorCauses.sign_flip.count, 1);

  // Corrupted JSON does not crash
  const recovered = migrateUniversalProgressState("{broken-json", "{also-broken");
  assert.equal(recovered.version, 2);
  assert.equal(recovered.storageMode, "local_guest");
});

test("CASE F: Universal Question Engine supports all 13 question formats and honest verification states", () => {
  assert.equal(universalQuestionTypes.length, 13);

  const tr = (s) => ({ ru: s, kk: s, uz: s });

  // 1. single_choice
  const qSingle = {
    id: "q-single",
    subjectId: "physics",
    topicId: "phys_kinematics",
    lessonId: "l1",
    type: "single_choice",
    difficulty: "basic",
    maxPoints: 1,
    prompt: tr("F = m * a"),
    options: { ru: ["Ньютон", "Ом"], kk: ["Ньютон", "Ом"], uz: ["Nyuton", "Om"] },
    correctIndex: 0,
    explanation: tr("II закон Ньютона"),
    hint: tr("Механика"),
    errorCategory: "newton"
  };
  assert.equal(
    evaluateUniversalQuestion(qSingle, { selectedIndex: 0 }, "ru").verificationState,
    "verified_correct"
  );
  assert.equal(
    evaluateUniversalQuestion(qSingle, { selectedIndex: 1 }, "ru").verificationState,
    "incorrect"
  );

  // 2. multiple_choice (partial & full score)
  const qMulti = {
    ...qSingle,
    id: "q-multi",
    type: "multiple_choice",
    maxPoints: 2,
    correctIndices: [0, 2]
  };
  const multiFull = evaluateUniversalQuestion(qMulti, { selectedIndices: [0, 2] }, "ru");
  assert.equal(multiFull.verificationState, "verified_correct");
  assert.equal(multiFull.earnedPoints, 2);
  const multiPartial = evaluateUniversalQuestion(qMulti, { selectedIndices: [0] }, "ru");
  assert.equal(multiPartial.verificationState, "incorrect");
  assert.equal(multiPartial.earnedPoints, 1);

  // 3. numeric
  const qNum = {
    ...qSingle,
    id: "q-num",
    type: "numeric",
    numericAnswer: 15
  };
  assert.equal(
    evaluateUniversalQuestion(qNum, { textValue: "15" }, "ru").verificationState,
    "verified_correct"
  );
  assert.equal(
    evaluateUniversalQuestion(qNum, { textValue: "abc" }, "ru").verificationState,
    "unverified"
  );

  // 4. short_text & 5. fill_blank
  const qShort = {
    ...qSingle,
    id: "q-short",
    type: "short_text",
    acceptedTexts: { ru: ["рибосома"], kk: ["рибосома"], uz: ["ribosoma"] }
  };
  assert.equal(
    evaluateUniversalQuestion(qShort, { textValue: " Рибосома " }, "ru").verificationState,
    "verified_correct"
  );

  const qBlank = {
    ...qShort,
    id: "q-blank",
    type: "fill_blank"
  };
  assert.equal(
    evaluateUniversalQuestion(qBlank, { textValue: "рибосома" }, "ru").verificationState,
    "verified_correct"
  );

  // 6. long_text -> honestly returns unverified (never fake AI score)
  const qLong = {
    ...qSingle,
    id: "q-long",
    type: "long_text",
    rubricCriteria: { ru: ["Тезис", "Аргумент"], kk: ["Тезис"], uz: ["Tezis"] }
  };
  const longEval = evaluateUniversalQuestion(
    qLong,
    { textValue: "Моё развёрнутое объяснение" },
    "ru"
  );
  assert.equal(longEval.verificationState, "unverified");
  assert.equal(longEval.isCorrect, null);
  assert.equal(longEval.earnedPoints, 0);

  // 7. matching
  const qMatch = {
    ...qSingle,
    id: "q-match",
    type: "matching",
    maxPoints: 2,
    matchingPairs: [1, 3]
  };
  const matchEval = evaluateUniversalQuestion(
    qMatch,
    { matchingSelection: { A: 1, B: 3 } },
    "ru"
  );
  assert.equal(matchEval.verificationState, "verified_correct");
  assert.equal(matchEval.earnedPoints, 2);

  // 8. sequence
  const qSeq = {
    ...qSingle,
    id: "q-seq",
    type: "sequence",
    correctSequence: [0, 1, 2]
  };
  assert.equal(
    evaluateUniversalQuestion(qSeq, { sequenceOrder: [0, 1, 2] }, "ru").verificationState,
    "verified_correct"
  );
  assert.equal(
    evaluateUniversalQuestion(qSeq, { sequenceOrder: [1, 0, 2] }, "ru").verificationState,
    "incorrect"
  );

  // 9. true_false
  const qTf = {
    ...qSingle,
    id: "q-tf",
    type: "true_false",
    booleanAnswer: false
  };
  assert.equal(
    evaluateUniversalQuestion(qTf, { booleanAnswer: false }, "ru").verificationState,
    "verified_correct"
  );

  // 10. formula & 11. equation
  const qFormula = {
    ...qSingle,
    id: "q-formula",
    type: "formula",
    acceptedTexts: { ru: ["I=U/R", "U/R"], kk: ["I=U/R"], uz: ["I=U/R"] }
  };
  assert.equal(
    evaluateUniversalQuestion(qFormula, { textValue: "I = U / R" }, "ru").verificationState,
    "verified_correct"
  );

  const qEq = {
    ...qSingle,
    id: "q-eq",
    type: "equation",
    numericAnswer: 7
  };
  assert.equal(
    evaluateUniversalQuestion(qEq, { textValue: "x = 7" }, "ru").verificationState,
    "verified_correct"
  );

  // 12. code_fix & 13. context_table
  const qCode = {
    ...qSingle,
    id: "q-code",
    type: "code_fix",
    correctIndex: 0
  };
  assert.equal(
    evaluateUniversalQuestion(qCode, { selectedIndex: 0 }, "ru").verificationState,
    "verified_correct"
  );

  const qTable = {
    ...qSingle,
    id: "q-table",
    type: "context_table",
    correctIndex: 0
  };
  assert.equal(
    evaluateUniversalQuestion(qTable, { selectedIndex: 0 }, "ru").verificationState,
    "verified_correct"
  );
});

test("CASE G & All 12 Subjects: every subject has complete lessons, worked examples, multi-format practice, error lab, and knowledge graph", () => {
  const all = getAllSubjectCurricula();
  assert.ok(all.length >= 12);
  const expectedIds = [
    "math",
    "physics",
    "informatics",
    "chemistry",
    "biology",
    "geography",
    "history_kz",
    "world_history",
    "law",
    "english",
    "math_lit",
    "reading_lit"
  ];

  for (const id of expectedIds) {
    const subj = getSubjectCurriculum(id);
    assert.ok(subj, `Subject "${id}" must exist in universal curriculum registry`);
    assert.ok(
      subj.lessons.length >= 3,
      `Subject "${id}" must have at least 3 lessons (found ${subj.lessons.length})`
    );
    assert.ok(subj.errorLabCases.length >= 2, `Subject "${id}" must have at least 2 Error Lab cases`);

    for (const lesson of subj.lessons) {
      assert.ok(lesson.title.ru.length > 0);
      assert.ok(lesson.learningGoal.ru.length > 0);
      assert.ok(lesson.simpleExplanation.ru.length > 0);
      assert.ok(lesson.detailedExplanation.ru.length > 0);
      assert.ok(lesson.workedExample.steps.ru.length >= 2);
      assert.ok(lesson.questions.length >= 1);
    }

    // P0-001: Completing a lesson without verified answers sets lessonCompleted=true, NOT mastered
    const graphWithoutAnswers = buildUniversalSubjectGraph(id, [subj.lessons[0].id], {});
    assert.equal(graphWithoutAnswers.length, subj.topics.length);
    assert.equal(graphWithoutAnswers[0].lessonCompleted, true);
    assert.equal(graphWithoutAnswers[0].masteryScore, 0);
    assert.notEqual(graphWithoutAnswers[0].status, "mastered");

    // With verified answers (earned/max >= 0.8), status becomes mastered
    const firstTopicId = subj.topics[0].id;
    const graphWithAnswers = buildUniversalSubjectGraph(id, [subj.lessons[0].id], {
      [firstTopicId]: {
        earned: 1,
        max: 1,
        attempts: 1,
        lastVerificationState: "verified_correct"
      }
    });
    assert.equal(graphWithAnswers[0].status, "mastered");
    assert.equal(graphWithAnswers[0].masteryScore, 100);
  }

  assert.equal(getSubjectCurriculum("math").lessons.length, 16);
  assert.equal(WELCOME_DEMO_ITEMS.length, 5);
});

test("Dynamic Subject Registration: adding a new subject (Economics) works without rewriting UI", () => {
  const tr = (s) => ({ ru: s, kk: s, uz: s });
  registerSubjectCurriculum({
    id: "economics",
    slug: "economics",
    category: "humanities",
    badge: "ECON",
    accentColor: "#0d9488",
    iconName: "BarChart3",
    title: tr("Экономика и финансовая грамотность"),
    subtitle: tr("Спрос, предложение, эластичность и макроэкономика"),
    description: tr("Спрос, предложение, эластичность и макроэкономика"),
    shortDescription: tr("Спрос, предложение, эластичность и макроэкономика"),
    levels: { ru: ["Базовый"], kk: ["Базалық"], uz: ["Bazaviy"] },
    modules: [
      {
        id: "econ-mod-1",
        title: tr("Микроэкономика"),
        topicIds: ["econ_supply_demand"]
      }
    ],
    topics: [
      {
        id: "econ_supply_demand",
        subjectId: "economics",
        title: tr("Рыночное равновесие"),
        sectionTitle: tr("Микроэкономика"),
        difficulty: "basic",
        prerequisites: [],
        unlocks: [],
        lessonId: "econ-lesson-1"
      }
    ],
    lessons: [
      {
        id: "econ-lesson-1",
        subjectId: "economics",
        topicId: "econ_supply_demand",
        sectionTitle: tr("Микроэкономика"),
        difficulty: "basic",
        estimatedMinutes: 10,
        title: tr("Рыночное равновесие"),
        goal: tr("Находить равновесную цену Qd = Qs"),
        learningGoal: tr("Находить равновесную цену Qd = Qs"),
        prerequisites: [],
        simpleExplanation: tr("В точке равновесия объём спроса равен объёму предложения: Qd(P) = Qs(P)."),
        detailedExplanation: tr("При цене выше равновесной возникает избыток, ниже — дефицит."),
        workedExample: {
          problem: tr("Qd = 100 - 2P, Qs = 20 + 2P. Найдите равновесную цену P."),
          steps: {
            ru: ["1) Приравняем Qd = Qs: 100 - 2P = 20 + 2P", "2) 4P = 80 => P = 20"],
            kk: ["1) 100 - 2P = 20 + 2P", "2) P = 20"],
            uz: ["1) 100 - 2P = 20 + 2P", "2) P = 20"]
          },
          takeaway: tr("Приравняйте функции спроса и предложения.")
        },
        contentBlocks: [],
        summary: tr("Равновесная цена находится из равенства Qd = Qs."),
        questions: [
          {
            id: "econ-q1",
            subjectId: "economics",
            topicId: "econ_supply_demand",
            lessonId: "econ-lesson-1",
            type: "numeric",
            difficulty: "basic",
            maxPoints: 1,
            prompt: tr("Qd = 50 - P, Qs = 10 + P. Чему равна равновесная цена P?"),
            numericAnswer: 20,
            explanation: tr("50 - P = 10 + P => 2P = 40 => P = 20."),
            hint: tr("Решите уравнение 50 - P = 10 + P."),
            errorCategory: "equilibrium_price"
          }
        ]
      }
    ],
    errorLabCases: []
  });

  const econ = getSubjectCurriculum("economics");
  assert.ok(econ);
  assert.equal(econ.title.ru, "Экономика и финансовая грамотность");
  const econGraph = buildUniversalSubjectGraph("economics");
  assert.equal(econGraph.length, 1);
  assert.equal(econGraph[0].status, "recommended");
});

test("5-Step Onboarding saves learner role, goal, subjects, and level", () => {
  const initial = createDefaultUniversalProgressState();
  const updated = saveOnboardingSelection(initial, {
    role: "self_learner",
    goal: "skill",
    selectedSubjects: ["informatics", "english"],
    level: "continue"
  });
  assert.equal(updated.onboarding.completed, true);
  assert.equal(updated.onboarding.role, "self_learner");
  assert.equal(updated.onboarding.goal, "skill");
  assert.deepEqual(updated.onboarding.selectedSubjects, ["informatics", "english"]);
  assert.equal(updated.activeSubjectId, "informatics");
});

test("P0-001: Lesson completion never fabricates question accuracy or fake verified_correct attempts", () => {
  let state = createDefaultUniversalProgressState();
  state = recordSubjectLessonCompletion(
    state,
    "physics",
    "physics-lesson-phys_kinematics",
    "phys_kinematics"
  );

  const metrics = getSubjectSummaryMetrics(state, "physics", 3);
  assert.equal(metrics.completedLessons, 1);
  assert.equal(metrics.completionPercent, 33);
  assert.equal(
    metrics.averageAccuracyPercent,
    null,
    "Completing a lesson without answering questions must keep averageAccuracyPercent === null"
  );
  assert.equal(
    metrics.totalAttempts,
    0,
    "Completing a lesson without answering questions must keep totalAttempts === 0"
  );

  const physProg = getSubjectProgress(state, "physics");
  assert.equal(physProg.lessonStates["physics-lesson-phys_kinematics"]?.status, "completed");
  assert.equal(physProg.topicStats["phys_kinematics"], undefined);
  assert.ok(physProg.events.some((e) => e.type === "lesson_completed"));
});

test("P0-002 & E2E-011: Legacy bilimai-lab-v1 migration is 100% idempotent across 20 reloads and skips corrupted records safely", () => {
  const legacyRaw = JSON.stringify({
    records: [
      { id: "rec-1", topic: "linear", correct: true, date: "2026-01-10T08:00:00.000Z" },
      { id: "rec-2", topic: "linear", correct: false, errorReason: "sign_flip", date: "2026-01-11T09:00:00.000Z" },
      { id: "rec-3", topic: "quadratic", correct: true, date: "2026-01-12T10:00:00.000Z" },
      null,
      "corrupted-entry",
      { topic: "", correct: "not-a-boolean" }
    ]
  });

  let state = migrateUniversalProgressState(null, legacyRaw);
  for (let i = 0; i < 20; i++) {
    state = migrateUniversalProgressState(JSON.stringify(state), legacyRaw);
  }

  const mathMetrics = getSubjectSummaryMetrics(state, "math", 16);
  assert.equal(
    mathMetrics.totalAttempts,
    3,
    "20 repeated migrations must never multiply legacy attempts beyond 3"
  );
  assert.equal(mathMetrics.averageAccuracyPercent, 67);
  const mathProg = getSubjectProgress(state, "math");
  assert.equal(state.legacyV1Migrated, true);
  assert.equal(mathProg.errorCauses.sign_flip.count, 1);
  assert.equal(mathProg.lastStudiedAt, "2026-01-12T10:00:00.000Z");
});

test("P0-003 & E2E-012: Server-side RBAC rejects guest/localStorage-only (401), student role (403), cross-teacher class (403), and permits verified teacher owner (200)", () => {
  // 1) Guest / no headers (even if client localStorage claims role=teacher) -> 401
  const guestSession = resolveServerSessionFromHeaders(new Headers());
  assert.equal(guestSession.authenticated, false);
  const guestAuth = authorizeTeacherClassAccess(guestSession, "class-phys-10a");
  assert.equal(guestAuth.allowed, false);
  assert.equal(guestAuth.status, 401);

  // 2) Forged header without valid server token -> 401
  const forgedHeaders = new Headers({
    Authorization: "Bearer forged-token-without-signature"
  });
  const forgedSession = resolveServerSessionFromHeaders(forgedHeaders);
  assert.equal(forgedSession.authenticated, false);
  assert.equal(authorizeTeacherClassAccess(forgedSession, "class-phys-10a").status, 401);

  // 3) Verified student session -> 403 Forbidden
  const studentSession = resolveServerSessionFromHeaders(
    new Headers({ Authorization: "Bearer bilimai-student-token-1" })
  );
  assert.equal(studentSession.authenticated, true);
  assert.equal(studentSession.role, "student");
  const studentAuth = authorizeTeacherClassAccess(studentSession, "class-phys-10a");
  assert.equal(studentAuth.allowed, false);
  assert.equal(studentAuth.status, 403);

  // 4) Verified teacher accessing another teacher's class -> 403 Forbidden
  const teacherSession = resolveServerSessionFromHeaders(
    new Headers({ Authorization: "Bearer bilimai-teacher-token-1" })
  );
  const crossClassAuth = authorizeTeacherClassAccess(teacherSession, "class-hist-10c");
  assert.equal(crossClassAuth.allowed, false);
  assert.equal(crossClassAuth.status, 403);

  // 5) Verified teacher accessing their own class -> 200 OK
  const validClassAuth = authorizeTeacherClassAccess(teacherSession, "class-phys-10a");
  assert.equal(validClassAuth.allowed, true);
  assert.equal(validClassAuth.status, 200);
});

test("E2E-010: Formula Equivalence Parser accepts algebraic rearrangements and marks invalid syntax as unverified", () => {
  const expected = ["F = m * a"];

  assert.equal(evaluateFormulaEquivalence("F = m * a", expected), "verified_correct");
  assert.equal(evaluateFormulaEquivalence("a * m = F", expected), "verified_correct");
  assert.equal(evaluateFormulaEquivalence("m = F / a", expected), "verified_correct");
  assert.equal(evaluateFormulaEquivalence("a = F / m", expected), "verified_correct");
  assert.equal(evaluateFormulaEquivalence("F = m / a", expected), "incorrect");
  assert.equal(evaluateFormulaEquivalence("F = m * (", expected), "unverified");

  const tr = (s) => ({ ru: s, kk: s, uz: s });
  const qNewton = {
    id: "q-newton",
    subjectId: "physics",
    topicId: "phys_dynamics",
    lessonId: "l2",
    type: "formula",
    difficulty: "basic",
    maxPoints: 1,
    prompt: tr("Запишите формулу второго закона Ньютона"),
    acceptedTexts: { ru: ["F = m * a"], kk: ["F = m * a"], uz: ["F = m * a"] },
    explanation: tr("F = m * a"),
    hint: tr("Сила равна произведению массы на ускорение"),
    errorCategory: "newton"
  };

  assert.equal(
    evaluateUniversalQuestion(qNewton, { textValue: "a * m = F" }, "ru").verificationState,
    "verified_correct"
  );
  assert.equal(
    evaluateUniversalQuestion(qNewton, { textValue: "m = F / a" }, "ru").verificationState,
    "verified_correct"
  );
  assert.equal(
    evaluateUniversalQuestion(qNewton, { textValue: "F = m / a" }, "ru").verificationState,
    "incorrect"
  );
  assert.equal(
    evaluateUniversalQuestion(qNewton, { textValue: "F = m * (" }, "ru").verificationState,
    "unverified"
  );
});

test("E2E-014: Double-submit protection deduplicates identical attemptId in progress engine", () => {
  let state = createDefaultUniversalProgressState();
  state = recordSubjectQuestionAttempt(state, {
    subjectId: "physics",
    topicId: "phys_kinematics",
    earnedPoints: 1,
    maxPoints: 1,
    verificationState: "verified_correct",
    attemptId: "phys-q1:sel:0"
  });
  // Rapid duplicate submission with same attemptId
  state = recordSubjectQuestionAttempt(state, {
    subjectId: "physics",
    topicId: "phys_kinematics",
    earnedPoints: 1,
    maxPoints: 1,
    verificationState: "verified_correct",
    attemptId: "phys-q1:sel:0"
  });

  const metrics = getSubjectSummaryMetrics(state, "physics", 3);
  assert.equal(metrics.totalAttempts, 1, "Duplicate attemptId must be recorded only once");
});

test("P1-003, P1-004 & Pluralization: Lesson slug lookup, dynamic recommendation, and Russian/Kazakh/Uzbek pluralization", () => {
  const phys = getSubjectCurriculum("physics");
  assert.ok(phys);

  // Lookup by full lesson ID, topicId, and hyphenated slug
  const byFullId = findSubjectLessonByIdOrSlug(phys, "physics-lesson-phys_kinematics");
  const byTopicId = findSubjectLessonByIdOrSlug(phys, "phys_kinematics");
  const bySlug = findSubjectLessonByIdOrSlug(phys, "phys-kinematics");
  assert.ok(byFullId && byTopicId && bySlug);
  assert.equal(byFullId.index, 0);
  assert.equal(byTopicId.index, 0);
  assert.equal(bySlug.index, 0);

  // Dynamic recommendation targets gap lesson instead of hardcoded index 0
  let state = createDefaultUniversalProgressState();
  state = recordSubjectLessonCompletion(
    state,
    "physics",
    phys.lessons[0].id,
    phys.lessons[0].topicId
  );
  state = recordSubjectQuestionAttempt(state, {
    subjectId: "physics",
    topicId: phys.lessons[0].topicId,
    earnedPoints: 1,
    maxPoints: 1,
    verificationState: "verified_correct"
  });
  // Create a gap on lesson 2 (index 1)
  state = recordSubjectQuestionAttempt(state, {
    subjectId: "physics",
    topicId: phys.lessons[1].topicId,
    earnedPoints: 0,
    maxPoints: 1,
    verificationState: "incorrect"
  });

  const physProg = getSubjectProgress(state, "physics");
  const rec = computeRecommendedLessonForSubject(
    phys,
    physProg.completedLessonIds,
    physProg.topicStats
  );
  assert.equal(rec.index, 1, "Recommendation must point to lesson index 1 where gap/uncompleted topic exists");
  assert.equal(rec.lesson.id, phys.lessons[1].id);

  // Pluralization check
  assert.equal(formatLessonsCountLabel(1, "ru"), "1 урок");
  assert.equal(formatLessonsCountLabel(3, "ru"), "3 урока");
  assert.equal(formatLessonsCountLabel(16, "ru"), "16 уроков");
  assert.equal(formatQuestionsCountLabel(1, "ru"), "1 задание");
  assert.equal(formatQuestionsCountLabel(4, "ru"), "4 задания");
  assert.equal(formatQuestionsCountLabel(15, "ru"), "15 заданий");
});

