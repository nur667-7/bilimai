import test from 'node:test';
import assert from 'node:assert/strict';
import { pilotAPI } from '../lib/pilot-api.ts';
import {
  inputSchema,
  roadmapInputSchema,
  labDiagnoseInputSchema,
  buildLabDiagnosePreview,
  buildExplainPreview,
  MAX_TUTOR_DIALOGUE_TURNS,
  explain
} from '../lib/claude.ts';
import {
  makeChallenge,
  buildBaselineRoadmap,
  progressSchema,
  resolveVerifiedChallenge,
  analyzeErrorCauseHistory,
  buildSmartDailySession
} from '../lib/error-lab.ts';
import { lessons } from '../lib/lessons.ts';
import {
  studyStoreReducer,
  createInitialStudyStoreState,
  getTopicPracticeSession,
  buildStudyHref,
  isValidWorkspaceTab
} from '../lib/study-store.ts';

test('logarithm, progression and pyramid distractors cannot equal their correct steps', () => {
  for (const lang of ['ru', 'kk', 'uz'])
    for (let seed = 0; seed < 24; seed++) {
      const log = makeChallenge('functions', seed, lang);
      const [, base, shift] = log.task.match(/log_(\d+)\(x − (\d+)\)/).map(Number);
      assert.equal(log.answer, base ** 2 + shift + 5);
      assert.notEqual(base ** 2, base * 2);
      assert.notEqual(base ** 2, 2 ** base);
      const prog = makeChallenge('progressions', seed, lang);
      const [, first, difference] = prog.task.match(/a₁ = (\d+), d = (\d+)/).map(Number);
      assert.equal(prog.answer, first + 2 + 6 * (difference + 1));
      assert.notEqual(first, difference);
      assert.notEqual(first + 5 * difference, first * 5 * difference);
      const pyramid = makeChallenge('stereometry', seed, lang);
      const [, side, height] = pyramid.task.match(/a = (\d+), .*h = (\d+)/).map(Number);
      assert.equal(pyramid.answer, ((side + 1) ** 2 * (height + 3)) / 3);
      assert.notEqual(side ** 2, 4 * side);
    }
});

test('stored progress rejects mismatched and nonexistent challenges; fully practiced roadmap is consistent', () => {
  const record = { topic: 'linear', challenge: 'linear-0', independent: true, date: '2026-10-08T12:00:00.000Z' };
  for (const challenge of ['linear-24', 'linear-00', 'percent-0', 'linear--1']) {
    assert.equal(progressSchema.safeParse({ version: 1, records: [{ ...record, challenge }] }).success, false);
  }
  const empty = { version: 1, records: [] };
  assert.ok(buildBaselineRoadmap(empty, 50, 6, 'ru').topicsPerWeek > buildBaselineRoadmap(empty, 20, 6, 'ru').topicsPerWeek);
  const topics = [
    'linear',
    'inequalities',
    'systems',
    'percent',
    'probability',
    'combinatorics',
    'radicals',
    'quadratic',
    'progressions',
    'functions',
    'trigonometry',
    'derivative',
    'integrals',
    'planimetry',
    'vectors',
    'stereometry'
  ];
  const full = { version: 1, records: topics.flatMap((topic) => [0, 1].map((seed) => ({ ...record, topic, challenge: topic + '-' + seed }))) };
  assert.deepEqual(buildBaselineRoadmap(full, 45, 6, 'ru').weakTopics, []);
  const input = {
    language: 'ru',
    targetScore: 45,
    weeksLeft: 6,
    weakTopics: ['linear'],
    masteredTopics: ['linear'],
    goalNote: 'Подготовиться',
    adult: true,
    consent: true
  };
  assert.equal(roadmapInputSchema.safeParse(input).success, false);
  assert.equal(roadmapInputSchema.safeParse({ ...input, weakTopics: ['percent', 'percent'] }).success, false);
});

test('shared API rejects unauthorised, malformed and oversized requests before provider or reservation', async () => {
  const env = { APP_ORIGIN: 'https://example.test', PILOT_ALLOWED_USER_IDS: 'pilot' };
  let calls = 0;
  const generate = async () => {
    calls++;
    return {};
  };
  const request = (body = '{}', origin = env.APP_ORIGIN) =>
    new Request(env.APP_ORIGIN, { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body });
  const user = async () => ({ userId: 'pilot' });
  for (const [req, identity, status] of [
    [request('{}', 'https://other.test'), user, 403],
    [request(), async () => null, 401],
    [request(), async () => ({ userId: 'other' }), 403],
    [request('not json'), user, 400],
    [request('x'.repeat(4097)), user, 413]
  ]) {
    const res = await pilotAPI(req, env, identity, inputSchema, generate);
    assert.equal(res.status, status);
    assert.equal(res.headers.get('cache-control'), 'no-store');
  }
  assert.equal(calls, 0);
});

test('shared API fails closed (503) when live key is set without DB or QUOTA_HASH_SECRET', async () => {
  const validBody = JSON.stringify({
    topic: 'linear',
    language: 'ru',
    question: 'Почему меняется знак?',
    adult: true,
    consent: true
  });
  const req = () =>
    new Request('https://bilimai.dpdns.org/api/explain', {
      method: 'POST',
      headers: { origin: 'https://bilimai.dpdns.org', 'content-type': 'application/json' },
      body: validBody
    });
  let liveCalled = 0;
  const resNoDb = await pilotAPI(
    req(),
    { ANTHROPIC_API_KEY: 'sk-ant-test', ANTHROPIC_MODEL: 'claude-test' },
    async () => ({ userId: 'u1' }),
    inputSchema,
    async () => {
      liveCalled++;
      return { explanation: 'x', hint: 'y' };
    },
    () => ({ explanation: 'preview', hint: 'preview' })
  );
  assert.equal(resNoDb.status, 503);
  const bodyNoDb = await resNoDb.json();
  assert.equal(bodyNoDb.reasonCode, 'missing_live_safeguards');
  assert.equal(liveCalled, 0);
});

test('lab-diagnose rejects mismatched seed and step payload and serves exact seed repair when matched', async () => {
  const c4 = makeChallenge('linear', 4, 'ru');
  const c1 = makeChallenge('linear', 1, 'ru');

  const runDiagnose = (payload) =>
    pilotAPI(
      new Request('https://bilimai.dpdns.org/api/lab-diagnose', {
        method: 'POST',
        headers: { origin: 'https://bilimai.dpdns.org', 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      }),
      { APP_ORIGIN: 'https://bilimai.dpdns.org' },
      async () => ({ userId: 'u1' }),
      labDiagnoseInputSchema,
      async (input) => {
        const ch = resolveVerifiedChallenge(input);
        return buildLabDiagnosePreview(input, ch);
      },
      (input) => {
        const ch = resolveVerifiedChallenge(input);
        return buildLabDiagnosePreview(input, ch);
      }
    );

  const badRes = await runDiagnose({
    topic: 'linear',
    seed: 1,
    language: 'ru',
    task: c4.task,
    steps: c4.steps,
    wrongStep: c4.wrongStep,
    stepFound: true,
    adult: true,
    consent: true
  });
  assert.equal(badRes.status, 400);
  const badJson = await badRes.json();
  assert.equal(badJson.reasonCode, 'context_mismatch');

  const goodRes = await runDiagnose({
    topic: 'linear',
    seed: 4,
    language: 'ru',
    task: c4.task,
    steps: c4.steps,
    wrongStep: c4.wrongStep,
    stepFound: true,
    adult: true,
    consent: true
  });
  assert.equal(goodRes.status, 200);
  const goodJson = await goodRes.json();
  assert.equal(goodJson.source, 'preview');
  assert.equal(goodJson.reasonCode, 'demo_preview_mode');
  assert.ok(goodJson.stepCheck.includes(c4.repair));
  assert.equal(goodJson.stepCheck.includes(c1.repair), false);
});

test('provider body limit cancels oversized streamed output', async () => {
  let cancelled = false;
  const stream = new ReadableStream({
    pull(c) {
      c.enqueue(new Uint8Array(28001));
    },
    cancel() {
      cancelled = true;
    }
  });
  await assert.rejects(
    explain({ topic: 'linear', language: 'ru', question: 'Почему?', adult: true, consent: true }, 'ref', { key: 'mock', model: 'mock' }, async () => new Response(stream)),
    (e) => e.code === 'invalid'
  );
  assert.equal(cancelled, true);
});

test('unified studyStoreReducer deterministically manages practice answers, transfer problems, weak topics, and URL href building', () => {
  let state = createInitialStudyStoreState();
  assert.equal(state.hydrated, false);
  assert.deepEqual(state.weakTopics, []);

  // Select and check practice answer for topic "linear"
  state = studyStoreReducer(state, {
    type: 'SELECT_OPTION',
    topic: 'linear',
    qIdx: 0,
    value: 'x = 5'
  });
  state = studyStoreReducer(state, {
    type: 'CHECK_QUESTION',
    topic: 'linear',
    qIdx: 0
  });

  const linearSession = getTopicPracticeSession(state, 'linear');
  assert.equal(linearSession.answers[0], 'x = 5');
  assert.equal(linearSession.checkedMap[0], true);
  assert.equal(state.hasInteracted, true);

  // Switching or checking another topic preserves "linear" session independently
  const quadSession = getTopicPracticeSession(state, 'quadratic');
  assert.deepEqual(quadSession.answers, {});
  assert.equal(getTopicPracticeSession(state, 'linear').answers[0], 'x = 5');

  // Verify transfer problem and record lab progress
  const ch0 = makeChallenge('linear', 0, 'ru');
  state = studyStoreReducer(state, {
    type: 'SET_TRANSFER_INPUT',
    topic: 'linear',
    value: String(ch0.answer)
  });
  state = studyStoreReducer(state, {
    type: 'CHECK_TRANSFER',
    topic: 'linear',
    expectedAnswer: ch0.answer
  });
  assert.equal(getTopicPracticeSession(state, 'linear').transferStatus, 'right');
  assert.equal(state.labProgress.records.length, 1);
  assert.equal(state.labProgress.records[0].topic, 'linear');

  // Toggle weak topic and reset topic session
  state = studyStoreReducer(state, { type: 'TOGGLE_WEAK_TOPIC', topic: 'trigonometry' });
  assert.deepEqual(state.weakTopics, ['trigonometry']);
  state = studyStoreReducer(state, { type: 'RESET_TOPIC_SESSION', topic: 'linear' });
  assert.deepEqual(getTopicPracticeSession(state, 'linear').answers, {});

  // Navigation href builder & workspace tab validator
  assert.equal(isValidWorkspaceTab('lesson'), true);
  assert.equal(isValidWorkspaceTab('unknown'), false);
  assert.equal(buildStudyHref({ lang: 'ru', tab: 'today', topic: 'linear', subject: 'math' }), '/?lang=ru');
  assert.equal(
    buildStudyHref({ lang: 'kk', tab: 'lesson', topic: 'quadratic', subject: 'physics' }),
    '/?lang=kk&tab=lesson&topic=quadratic&subject=physics'
  );
});

test('Stage-1 Personalization: error cause history verification, smart daily session queue with anti-fatigue rotation, and contextual multi-turn AI tutor', () => {
  // 1. Personal Error Cause History & Verification
  const unverifiedProgress = {
    version: 1,
    records: [
      {
        topic: 'inequalities',
        challenge: 'inequalities-0',
        independent: false,
        date: '2026-10-09T10:00:00.000Z',
        wrongAnswer: 'x > -5',
        hintsUsed: 2,
        errorReason: 'sign_flip',
        verifiedClean: false
      }
    ]
  };
  assert.equal(progressSchema.safeParse(unverifiedProgress).success, true);

  const causesBefore = analyzeErrorCauseHistory(unverifiedProgress, 'ru');
  assert.equal(causesBefore.length, 1);
  assert.equal(causesBefore[0].reasonId, 'sign_flip');
  assert.equal(causesBefore[0].topic, 'inequalities');
  assert.equal(causesBefore[0].verifiedClean, false);
  assert.equal(causesBefore[0].lastWrongAnswer, 'x > -5');
  assert.ok(causesBefore[0].personalMessage.includes('знак неравенства'));

  // Smart Daily Session prioritizes the unverified error cause
  const sessionUnverified = buildSmartDailySession(unverifiedProgress, 'ru', Date.parse('2026-10-10T10:00:00.000Z'));
  assert.equal(sessionUnverified.dominantCause?.topic, 'inequalities');
  assert.equal(sessionUnverified.steps.length, 3);
  assert.equal(sessionUnverified.steps[0].badge, '01 · Повторить');
  assert.equal(sessionUnverified.steps[1].badge, '02 · Разобрать ошибку');
  assert.equal(sessionUnverified.steps[1].topic, 'inequalities');
  assert.equal(sessionUnverified.steps[2].badge, '03 · Новая задача');
  assert.ok(sessionUnverified.headline.includes('8'));

  // Clean independent solve on inequalities transitions verifiedClean to true
  const verifiedProgress = {
    version: 1,
    records: [
      ...unverifiedProgress.records,
      {
        topic: 'inequalities',
        challenge: 'inequalities-1',
        independent: true,
        date: '2026-10-10T11:00:00.000Z',
        hintsUsed: 0,
        errorReason: 'sign_flip',
        verifiedClean: true
      }
    ]
  };
  const causesAfter = analyzeErrorCauseHistory(verifiedProgress, 'ru');
  assert.equal(causesAfter[0].verifiedClean, true);

  // 2. Anti-fatigue rotation: 2 consecutive records on 'inequalities' rotates review topic
  const sessionRotated = buildSmartDailySession(verifiedProgress, 'ru', Date.parse('2026-10-10T12:00:00.000Z'));
  assert.equal(sessionRotated.antiFatigueRotated, true);
  assert.notEqual(sessionRotated.steps[0].topic, 'inequalities');

  // 3. Contextual Multi-Turn Tutor Dialogue schema and preview modes
  assert.equal(MAX_TUTOR_DIALOGUE_TURNS, 6);
  const contextualInput = {
    topic: 'inequalities',
    language: 'ru',
    question: 'Покажи на более простом примере без дробей.',
    taskContext: {
      taskText: '−3x > 12',
      learnerAttempt: 'x > −4',
      stage: 'practice',
      errorReason: 'sign_flip',
      hintsAlreadyShown: ['Разделите обе части на −3.']
    },
    history: [
      { role: 'user', text: 'Почему мой ответ x > -4 неверный?' },
      { role: 'assistant', text: 'При делении на −3 знак неравенства меняется.' }
    ],
    followUpMode: 'simpler_example',
    adult: true,
    consent: true
  };
  assert.equal(inputSchema.safeParse(contextualInput).success, true);

  const previewSimpler = buildExplainPreview(contextualInput, lessons.ru.find((l) => l.id === 'inequalities'));
  assert.equal(previewSimpler.errorType, 'sign_flip');
  assert.ok(previewSimpler.socraticQuestion && previewSimpler.socraticQuestion.length > 10);
  assert.ok(previewSimpler.nextAction && previewSimpler.nextAction.length > 10);

  const previewSocratic = buildExplainPreview(
    { ...contextualInput, followUpMode: 'socratic_question' },
    lessons.ru.find((l) => l.id === 'inequalities')
  );
  assert.ok(previewSocratic.explanation.includes('x > −4'));
});


