import test from 'node:test';
import assert from 'node:assert/strict';
import { makeChallenge, parseNumericAnswer, checkAnswer, progressSchema, recommendTopic } from '../lib/error-lab.ts';
const topics=['linear','percent','probability'];
test('all 216 localized lab variants have correct transfer answers and varied first-error positions',()=>{
 for(const lang of ['ru','kk','uz'])for(const topic of topics){const positions=new Set();const ids=new Set();const transfers=new Set();for(let seed=0;seed<24;seed++){
  const c=makeChallenge(topic,seed,lang);positions.add(c.wrongStep);ids.add(c.id);transfers.add(c.transfer);assert.equal(c.steps.length,3);assert.equal(c.hints.length,3);assert.ok(c.explanation.length>15);
  if(topic==='linear'){const m=c.transfer.match(/^(\d+)x \+ (\d+) = (\d+)/);assert.ok(m);assert.equal(Number(m[1])*c.answer+Number(m[2]),Number(m[3]));}
  if(topic==='percent'){const ns=c.transfer.match(/\d+/g).map(Number);const paid=c.answer;assert.equal(paid+ns[0]*ns[1]/100,ns[0]);assert.ok(paid>0&&paid<ns[0]);}
  if(topic==='probability'){const ns=c.transfer.match(/\d+/g).map(Number);assert.equal(c.answer*(ns[0]+ns[1]),ns[1]);assert.ok(c.answer>0&&c.answer<1);assert.ok(ns[0]!==ns[1]);}
  assert.ok(checkAnswer(String(c.answer),c.answer));assert.equal(checkAnswer(String(c.answer+1),c.answer),false);
 }assert.equal(ids.size,24);assert.equal(transfers.size,24);assert.deepEqual([...positions].sort(),[0,1,2]);}
 assert.equal(makeChallenge('linear',24,'ru').id,makeChallenge('linear',0,'ru').id);
 assert.throws(()=>makeChallenge('linear',NaN,'ru'));assert.throws(()=>makeChallenge('linear',-1,'ru'));
});
test('numeric entry accepts equivalent fractions and local decimals, rejects expressions and invalid values',()=>{
 assert.ok(checkAnswer('2/6',1/3));assert.ok(checkAnswer('0,5',.5));assert.ok(checkAnswer('50%',.5));assert.ok(checkAnswer(' 7 ',7));
 for(const value of ['','NaN','Infinity','3/0','0/0','1+1','0x10','<script>','1e10','1/2/3','1,2,3','9'.repeat(49)])assert.equal(parseNumericAnswer(value),null);
 assert.equal(checkAnswer('0.333',1/3),false);
});
test('recommendation considers distinct independent challenges, not assisted repetitions',()=>{
 const record=(topic,challenge,independent=true)=>({topic,challenge,independent,date:'2026-10-08T12:00:00.000Z'});
 const p={version:1,records:[record('linear','linear-0'),record('linear','linear-0'),record('percent','percent-0'),record('probability','probability-0',false)]};
 assert.equal(recommendTopic(p),'probability');assert.equal(recommendTopic({version:1,records:[]}),'linear');
 assert.equal(progressSchema.safeParse(p).success,true);assert.equal(progressSchema.safeParse({...p,records:Array(61).fill(p.records[0])}).success,false);assert.equal(progressSchema.safeParse({version:2,records:[]}).success,false);
});
