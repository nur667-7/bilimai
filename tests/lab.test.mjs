import test from 'node:test';
import assert from 'node:assert/strict';
import {
  makeChallenge,
  parseNumericAnswer,
  checkAnswer,
  progressSchema,
  recommendTopic,
  nextSeed,
  reviewSchedule,
  exportProgress,
  buildBaselineRoadmap,
  labTopics
} from '../lib/error-lab.ts';
import { buildLabDiagnosePreview } from '../lib/claude.ts';
import { lessons } from '../lib/lessons.ts';

test('all 1152 localized lab variants across 16 UNT topics have valid transfer answers, varied error positions, and exact seed-bound preview diagnosis', () => {
  assert.equal(labTopics.length, 16);
  for (const lang of ['ru', 'kk', 'uz']) {
    for (const topic of labTopics) {
      const lesson = lessons[lang].find((l) => l.id === topic);
      assert.ok(lesson);
      const positions = new Set();
      const ids = new Set();
      const transfers = new Set();
      for (let seed = 0; seed < 24; seed++) {
        const c = makeChallenge(topic, seed, lang);
        positions.add(c.wrongStep);
        ids.add(c.id);
        transfers.add(c.transfer);
        assert.equal(c.steps.length, 3);
        assert.equal(c.hints.length, 3);
        assert.ok(c.explanation.length > 15);
        assert.ok(Number.isFinite(c.answer));
        assert.ok(checkAnswer(String(c.answer), c.answer));
        assert.equal(checkAnswer(String(c.answer + 1), c.answer), false);

        // Verify pre-discovery preview never spoils repair
        const prePreview = buildLabDiagnosePreview(
          {
            topic,
            seed,
            language: lang,
            task: c.task,
            steps: c.steps,
            wrongStep: c.wrongStep,
            selectedStep: (c.wrongStep + 1) % 3,
            stepFound: false,
            consent: true,
            adult: true
          },
          c
        );
        assert.equal(prePreview.stepCheck.includes(c.repair), false);
        assert.equal(prePreview.diagnosis.includes(c.repair), false);

        // Verify post-discovery preview contains THIS exact challenge's repair (and not seed=1 when seed=4)
        const postPreview = buildLabDiagnosePreview(
          {
            topic,
            seed,
            language: lang,
            task: c.task,
            steps: c.steps,
            wrongStep: c.wrongStep,
            selectedStep: c.wrongStep,
            stepFound: true,
            consent: true,
            adult: true
          },
          c
        );
        assert.ok(postPreview.stepCheck.includes(c.repair));
        if (seed === 4) {
          const seed1 = makeChallenge(topic, 1, lang);
          assert.notEqual(c.repair, seed1.repair);
          assert.equal(postPreview.stepCheck.includes(seed1.repair), false);
        }
      }
      assert.equal(ids.size, 24);
      assert.equal(transfers.size, 24);
      assert.deepEqual([...positions].sort(), [0, 1, 2]);
    }
  }
  assert.equal(makeChallenge('linear', 24, 'ru').id, makeChallenge('linear', 0, 'ru').id);
  assert.throws(() => makeChallenge('linear', NaN, 'ru'));
  assert.throws(() => makeChallenge('linear', -1, 'ru'));
});

test('numeric entry accepts equivalent fractions and local decimals, rejects expressions and invalid values', () => {
  assert.ok(checkAnswer('2/6', 1 / 3));
  assert.ok(checkAnswer('0,5', 0.5));
  assert.ok(checkAnswer('50%', 0.5));
  assert.ok(checkAnswer(' 7 ', 7));
  for (const value of ['', 'NaN', 'Infinity', '3/0', '0/0', '1+1', '0x10', '<script>', '1e10', '1/2/3', '1,2,3', '9'.repeat(49)])
    assert.equal(parseNumericAnswer(value), null);
  assert.equal(checkAnswer('0.333', 1 / 3), false);
});

test('recommendation and baseline UNT roadmap prioritize unpracticed or assisted topics', () => {
  const record = (topic, challenge, independent = true) => ({
    topic,
    challenge,
    independent,
    date: '2026-10-08T12:00:00.000Z'
  });
  const p = {
    version: 1,
    records: [
      record('linear', 'linear-0'),
      record('linear', 'linear-1'),
      record('percent', 'percent-0'),
      record('probability', 'probability-0', false)
    ]
  };
  assert.equal(recommendTopic(p), 'inequalities');
  assert.equal(recommendTopic({ version: 1, records: [] }), 'linear');
  assert.equal(progressSchema.safeParse(p).success, true);
  assert.equal(progressSchema.safeParse({ ...p, records: Array(61).fill(p.records[0]) }).success, false);

  const roadmap = buildBaselineRoadmap(p, 45, 6, 'ru');
  assert.equal(roadmap.targetScore, 45);
  assert.ok(roadmap.masteredTopics.includes('linear'));
  assert.equal(roadmap.priorityModules.length, 4);
});

test('new practice picks an unseen task and safely cycles after finite pool', () => {
  const records = Array.from({ length: 24 }, (_, i) => ({
    topic: 'quadratic',
    challenge: `quadratic-${i}`,
    independent: true,
    date: '2026-10-08T12:00:00.000Z'
  }));
  assert.equal(nextSeed({ version: 1, records: records.slice(0, 3) }, 'quadratic'), 3);
  assert.equal(nextSeed({ version: 1, records }, 'quadratic'), 0);
  assert.equal(nextSeed({ version: 1, records }, 'stereometry'), 0);
});

test('review schedule handles 2/7-day boundaries across all 16 UNT topics', () => {
  const start = Date.parse('2026-10-08T12:00:00.000Z'),
    day = 86400000;
  const record = (challenge, date, independent = true) => ({
    topic: 'linear',
    challenge,
    independent,
    date: new Date(date).toISOString()
  });
  const p = { version: 1, records: [record('linear-0', start)] };
  const sched = reviewSchedule(p, start + day);
  assert.equal(sched.length, 16);
  assert.equal(sched[0].due, false);
  assert.equal(reviewSchedule(p, start + 2 * day)[0].due, true);
  assert.equal(reviewSchedule(p, start)[1].dueAt, null);
  const p2 = { version: 1, records: [record('linear-0', start), record('linear-1', start + 2 * day)] };
  assert.equal(reviewSchedule(p2, start + 8 * day)[0].due, false);
  assert.equal(reviewSchedule(p2, start + 9 * day)[0].due, true);
  p2.records.push(record('linear-2', start + 3 * day, false));
  assert.equal(reviewSchedule(p2, start + 3 * day)[0].due, true);
  assert.throws(() => reviewSchedule(p, NaN));
  assert.equal(JSON.parse(exportProgress(p)).records.length, 1);
  assert.equal(JSON.parse(exportProgress(p)).product, 'BilimAI');
});
