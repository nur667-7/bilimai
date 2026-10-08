import test from 'node:test';
import assert from 'node:assert/strict';
import { pilotAPI } from '../lib/pilot-api.ts';
import { inputSchema, roadmapInputSchema, explain } from '../lib/claude.ts';
import { makeChallenge, buildBaselineRoadmap, progressSchema } from '../lib/error-lab.ts';

test('logarithm, progression and pyramid distractors cannot equal their correct steps', () => {
  for (const lang of ['ru','kk','uz']) for (let seed=0; seed<24; seed++) {
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
    assert.equal(pyramid.answer, (side+1)**2*(height+3)/3);
    assert.notEqual(side**2, 4*side);
  }
});

test('stored progress rejects mismatched and nonexistent challenges; fully practiced roadmap is consistent', () => {
  const record = {topic:'linear', challenge:'linear-0', independent:true, date:'2026-10-08T12:00:00.000Z'};
  for (const challenge of ['linear-24','linear-00','percent-0','linear--1']) {
    assert.equal(progressSchema.safeParse({version:1,records:[{...record,challenge}]}).success,false);
  }
  const empty = {version:1,records:[]};
  assert.ok(buildBaselineRoadmap(empty,50,6,'ru').topicsPerWeek > buildBaselineRoadmap(empty,20,6,'ru').topicsPerWeek);
  const topics=['linear','percent','probability','quadratic','progressions','functions','trigonometry','derivative','planimetry','stereometry'];
  const full={version:1,records:topics.flatMap(topic=>[0,1].map(seed=>({...record,topic,challenge:topic+'-'+seed})))};
  assert.deepEqual(buildBaselineRoadmap(full,45,6,'ru').weakTopics,[]);
  const input={language:'ru',targetScore:45,weeksLeft:6,weakTopics:['linear'],masteredTopics:['linear'],goalNote:'Подготовиться',adult:true,consent:true};
  assert.equal(roadmapInputSchema.safeParse(input).success,false);
  assert.equal(roadmapInputSchema.safeParse({...input,weakTopics:['percent','percent']}).success,false);
});

test('shared API rejects unauthorised, malformed and oversized requests before provider or reservation', async () => {
  const env={APP_ORIGIN:'https://example.test',PILOT_ALLOWED_USER_IDS:'pilot'};
  let calls=0;
  const generate=async()=>{calls++;return {};};
  const request=(body='{}',origin=env.APP_ORIGIN)=>new Request(env.APP_ORIGIN,{method:'POST',headers:{origin,'content-type':'application/json'},body});
  const user=async()=>({userId:'pilot'});
  for(const [req,identity,status] of [[request('{}','https://other.test'),user,403],[request(),async()=>null,401],[request(),async()=>({userId:'other'}),403],[request('not json'),user,400],[request('x'.repeat(4097)),user,413]]) {
    const res=await pilotAPI(req,env,identity,inputSchema,generate);
    assert.equal(res.status,status);
    assert.equal(res.headers.get('cache-control'),'no-store');
  }
  assert.equal(calls,0);
});

test('provider body limit cancels oversized streamed output', async () => {
  let cancelled=false;
  const stream=new ReadableStream({pull(c){c.enqueue(new Uint8Array(28001));},cancel(){cancelled=true;}});
  await assert.rejects(explain({topic:'linear',language:'ru',question:'Почему?',adult:true,consent:true},'ref',{key:'mock',model:'mock'},async()=>new Response(stream)),e=>e.code==='invalid');
  assert.equal(cancelled,true);
});
