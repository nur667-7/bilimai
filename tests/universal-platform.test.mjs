import test from "node:test";
import assert from "node:assert/strict";

import { analyzeCustomDraft } from "../lib/xray-trace.ts";
import {
  evaluateUniversalQuestion,
  advanceLessonQuestionIndex,
  universalQuestionTypes
} from "../lib/question-engine.ts";
import {
  getAllSubjectCurricula,
  getSubjectCurriculum,
  registerSubjectCurriculum,
  buildUniversalSubjectGraph,
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
    assert.ok(subj.errorLabCases.length >= 1, `Subject "${id}" must have at least 1 Error Lab case`);

    for (const lesson of subj.lessons) {
      assert.ok(lesson.title.ru.length > 0);
      assert.ok(lesson.learningGoal.ru.length > 0);
      assert.ok(lesson.simpleExplanation.ru.length > 0);
      assert.ok(lesson.detailedExplanation.ru.length > 0);
      assert.ok(lesson.workedExample.steps.ru.length >= 2);
      assert.ok(lesson.questions.length >= 1);
    }

    const graph = buildUniversalSubjectGraph(id, [subj.lessons[0].id], {});
    assert.equal(graph.length, subj.topics.length);
    assert.equal(graph[0].status, "mastered");
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
