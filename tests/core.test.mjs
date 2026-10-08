import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import {
  inputSchema,
  roadmapInputSchema,
  labDiagnoseInputSchema,
  explain,
  generateRoadmap,
  diagnoseLabError,
  buildExplainPreview,
  buildRoadmapPreview,
  buildLabDiagnosePreview,
  ProviderError,
  quotaSQL
} from '../lib/claude.ts';
import { lessons, untTopicIds } from '../lib/lessons.ts';

const input = { topic: 'linear', language: 'ru', question: 'Почему вычитаем 6?', adult: true, consent: true };
const config = { key: 'TEST_ONLY_NOT_REAL', model: 'test-model' };

test('rejects missing consent, minors, unknown topics, oversize questions and extra fields', () => {
  for (const patch of [
    { consent: false },
    { adult: false },
    { topic: 'medical' },
    { question: 'x'.repeat(601) },
    { question: '  ' },
    { apiKey: 'client key' }
  ])
    assert.equal(inputSchema.safeParse({ ...input, ...patch }).success, false);
  for (const topic of untTopicIds) {
    assert.equal(inputSchema.safeParse({ ...input, topic }).success, true);
  }
});

test('Claude explain request is bounded and references stay in the system context', async () => {
  const result = await explain(input, '3x + 6 = 21', config, async (url, options) => {
    assert.equal(url, 'https://api.anthropic.com/v1/messages');
    assert.equal(options.headers['x-api-key'], config.key);
    const body = JSON.parse(options.body);
    assert.equal(body.max_tokens, 800);
    assert.equal(body.model, 'test-model');
    assert.equal(body.tools, undefined);
    assert.match(body.system, /3x \+ 6 = 21/);
    assert.equal(body.system.includes(input.question), false);
    assert.equal(JSON.parse(body.messages[0].content).learnerQuestion, input.question);
    return Response.json({
      stop_reason: 'end_turn',
      content: [{ type: 'text', text: JSON.stringify({ explanation: 'Вычитаем 6 с обеих сторон.', hint: 'Сохраняем равенство.' }) }]
    });
  });
  assert.equal(result.hint, 'Сохраняем равенство.');
});

test('Claude generateRoadmap validates input and parses structured UNT roadmap response', async () => {
  const rmInput = {
    language: 'kk',
    targetScore: 45,
    weeksLeft: 6,
    weakTopics: ['quadratic', 'trigonometry', 'derivative'],
    masteredTopics: ['linear'],
    goalNote: 'ҰБТ-дан 45+ балл жинау керек, тригонометрия қиын.',
    consent: true,
    adult: true
  };
  assert.equal(roadmapInputSchema.safeParse(rmInput).success, true);
  assert.equal(roadmapInputSchema.safeParse({ ...rmInput, targetScore: 10 }).success, false);
  assert.equal(roadmapInputSchema.safeParse({ ...rmInput, weakTopics: [] }).success, true);

  const roadmap = await generateRoadmap(rmInput, '10 UNT modules ref', config, async (url, options) => {
    assert.equal(url, 'https://api.anthropic.com/v1/messages');
    const body = JSON.parse(options.body);
    assert.equal(body.max_tokens, 900);
    assert.match(body.system, /10 UNT modules ref/);
    return Response.json({
      stop_reason: 'end_turn',
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            summary: '6 апталық ҰБТ дайындық жоспары: алдымен квадрат теңдеулер мен тригонометрия.',
            priorityModules: [
              {
                topic: 'quadratic',
                reason: 'Виет теоремасында таңба қателері жиі кездеседі.',
                recommendedAction: 'Қателер зертханасында 5 есепті көмексіз шығару.'
              },
              {
                topic: 'trigonometry',
                reason: 'Негізгі тепе-теңдікті жылдам ықшамдау керек.',
                recommendedAction: 'Негізгі формулаларды қайталап, 4 жаттығу орындау.'
              }
            ],
            weeklyMilestones: [
              '1–2 апта: Квадрат теңдеулер мен тригонометрия.',
              '3–4 апта: Туынды және экстремум есептері.',
              '5–6 апта: Толық ҰБТ нұсқаларын уақытқа шешу.'
            ],
            dailyHabit: 'Күн сайын зертханада 3 қате қадамды талдау.'
          })
        }
      ]
    });
  });
  assert.equal(roadmap.priorityModules.length, 2);
  assert.equal(roadmap.priorityModules[0].topic, 'quadratic');
});

test('Claude diagnoseLabError validates Error-Lab step context and returns structured step diagnosis', async () => {
  const labInput = {
    topic: 'quadratic',
    language: 'ru',
    task: 'x² − 7x + 10 = 0. Найдите больший корень уравнения.',
    steps: ['x₁ × x₂ = 10', 'x₁ + x₂ = −7', 'Корни: −2 и −5 → −2'],
    wrongStep: 1,
    selectedStep: 2,
    learnerAttempt: '-2',
    consent: true,
    adult: true
  };
  assert.equal(labDiagnoseInputSchema.safeParse(labInput).success, true);
  assert.equal(labDiagnoseInputSchema.safeParse({ ...labInput, wrongStep: 5 }).success, false);

  const diag = await diagnoseLabError(labInput, 'Vieta rule ref', config, async (url, options) => {
    assert.equal(url, 'https://api.anthropic.com/v1/messages');
    const body = JSON.parse(options.body);
    assert.equal(body.max_tokens, 750);
    assert.match(body.system, /Vieta rule ref/);
    return Response.json({
      stop_reason: 'end_turn',
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            diagnosis: 'Ошибка допущена во 2-м шаге: по теореме Виета сумма корней равна +7, а не −7.',
            stepCheck: 'Вы выбрали 3-й шаг, но он уже опирался на неверный знак суммы из 2-го шага.',
            nextStepHint: 'Найдите два положительных числа с суммой 7 и произведением 10.'
          })
        }
      ]
    });
  });
  assert.match(diag.diagnosis, /Виета/);

  const previewExplain = buildExplainPreview(input, lessons.ru[0]);
  assert.ok(previewExplain.explanation.length > 20);
  const titles = Object.fromEntries(lessons.ru.map((l) => [l.id, l.title]));
  const previewRm = buildRoadmapPreview(
    {
      language: 'ru',
      targetScore: 42,
      weeksLeft: 6,
      weakTopics: ['quadratic', 'trigonometry'],
      masteredTopics: ['linear'],
      goalNote: 'Набрать 42+',
      consent: true,
      adult: true
    },
    titles
  );
  assert.equal(previewRm.priorityModules.length, 2);
  const previewLab = buildLabDiagnosePreview(labInput, 'По теореме Виета сумма +7.', 'x₁ + x₂ = 7', 'Проверь знак суммы.');
  assert.ok(previewLab.diagnosis.length > 15);
});

test('provider errors never expose upstream details or secrets', async () => {
  await assert.rejects(
    explain(input, 'reference', config, async () => new Response('secret trace', { status: 401 })),
    (e) => e instanceof ProviderError && e.message === 'unavailable'
  );
});

test('rejects truncated, malformed and unexpected provider output', async () => {
  for (const payload of [
    { stop_reason: 'max_tokens', content: [] },
    { stop_reason: 'end_turn', content: [{ type: 'text', text: 'not JSON' }] },
    { stop_reason: 'end_turn', content: [{ type: 'text', text: '{"explanation":"valid string","hint":"hint","extra":true}' }] }
  ])
    await assert.rejects(explain(input, 'reference', config, async () => Response.json(payload)), (e) => e.code === 'invalid');
});

function db() {
  const database = new DatabaseSync(':memory:');
  database.exec(readFileSync(new URL('../drizzle/0000_silly_colonel_america.sql', import.meta.url), 'utf8'));
  return database;
}

function reserve(database, user, day, minute) {
  return database.prepare(quotaSQL).run(crypto.randomUUID(), user, day, minute, user, day, user, minute, day).changes;
}

test('atomic reservation enforces per-minute and per-user day limits; rejected requests do not spend quota', () => {
  const database = db();
  assert.equal(reserve(database, 'a', '2026-10-08', 1), 1);
  assert.equal(reserve(database, 'a', '2026-10-08', 1), 1);
  assert.equal(reserve(database, 'a', '2026-10-08', 1), 0);
  for (let i = 2; i < 10; i++) assert.equal(reserve(database, 'a', '2026-10-08', i), 1);
  assert.equal(reserve(database, 'a', '2026-10-08', 10), 0);
  assert.equal(reserve(database, 'a', '2026-10-09', 11), 1);
  database.close();
});

test('global daily and lifetime pilot limits work across users and days', () => {
  const database = db();
  for (let i = 0; i < 50; i++) assert.equal(reserve(database, 'user' + i, 'day0', i), 1);
  assert.equal(reserve(database, 'another', 'day0', 51), 0);
  for (let d = 1; d < 10; d++) for (let i = 0; i < 50; i++) assert.equal(reserve(database, 'user' + i, 'day' + d, d * 60 + i), 1);
  assert.equal(reserve(database, 'fresh', 'day11', 999), 0);
  assert.equal(database.prepare('SELECT COUNT(*) AS n FROM reservations').get().n, 500);
  database.close();
});

test('all three languages cover all 10 UNT topics and answer keys match across languages', () => {
  assert.equal(untTopicIds.length, 10);
  assert.deepEqual(
    lessons.ru.map((l) => l.id),
    untTopicIds
  );
  assert.deepEqual(
    lessons.kk.map((l) => l.id),
    untTopicIds
  );
  assert.deepEqual(
    lessons.uz.map((l) => l.id),
    untTopicIds
  );
  for (const language of ['ru', 'uz', 'kk']) {
    for (const lesson of lessons[language]) {
      assert.equal(lesson.questions.length, 3);
      for (const q of lesson.questions) assert.ok(q.correct >= 0 && q.correct < q.options.length);
    }
  }
  for (let i = 0; i < untTopicIds.length; i++) {
    assert.deepEqual(
      lessons.ru[i].questions.map((q) => q.correct),
      lessons.uz[i].questions.map((q) => q.correct)
    );
    assert.deepEqual(
      lessons.ru[i].questions.map((q) => q.correct),
      lessons.kk[i].questions.map((q) => q.correct)
    );
  }
});
