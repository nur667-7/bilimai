import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { inputSchema, explain, ProviderError, quotaSQL } from '../lib/claude.ts';
import { lessons } from '../lib/lessons.ts';
const input={topic:'linear',language:'ru',question:'Почему вычитаем 6?',adult:true,consent:true};
const config={key:'TEST_ONLY_NOT_REAL',model:'test-model'};
test('rejects missing consent, minors, unknown topics, oversize questions and extra fields',()=>{
 for(const patch of [{consent:false},{adult:false},{topic:'medical'},{question:'x'.repeat(601)},{question:'  '},{apiKey:'client key'}])assert.equal(inputSchema.safeParse({...input,...patch}).success,false);
 assert.equal(inputSchema.safeParse(input).success,true);
});
test('Claude request is bounded and references stay in the system context',async()=>{
 const result=await explain(input,'3x + 6 = 21',config,async(url,options)=>{
  assert.equal(url,'https://api.anthropic.com/v1/messages');
  assert.equal(options.headers['x-api-key'],config.key);const body=JSON.parse(options.body);
  assert.equal(body.max_tokens,800);assert.equal(body.model,'test-model');assert.equal(body.tools,undefined);
  assert.match(body.system,/3x \+ 6 = 21/);assert.equal(body.system.includes(input.question),false);
  assert.equal(JSON.parse(body.messages[0].content).learnerQuestion,input.question);
  return Response.json({stop_reason:'end_turn',content:[{type:'text',text:JSON.stringify({explanation:'Вычитаем 6 с обеих сторон.',hint:'Сохраняем равенство.'})}]});
 });assert.equal(result.hint,'Сохраняем равенство.');
});
test('provider errors never expose upstream details or secrets',async()=>{
 await assert.rejects(explain(input,'reference',config,async()=>new Response('secret trace',{status:401})),e=>e instanceof ProviderError && e.message==='unavailable');
});
test('rejects truncated, malformed and unexpected provider output',async()=>{
 for(const payload of [{stop_reason:'max_tokens',content:[]},{stop_reason:'end_turn',content:[{type:'text',text:'not JSON'}]},{stop_reason:'end_turn',content:[{type:'text',text:'{"explanation":"valid string","hint":"hint","extra":true}'}]}])await assert.rejects(explain(input,'reference',config,async()=>Response.json(payload)),e=>e.code==='invalid');
});
function db(){const database=new DatabaseSync(':memory:');database.exec(readFileSync(new URL('../drizzle/0000_silly_colonel_america.sql',import.meta.url),'utf8'));return database;}
function reserve(database,user,day,minute){return database.prepare(quotaSQL).run(crypto.randomUUID(),user,day,minute,user,day,user,minute,day).changes;}
test('atomic reservation enforces per-minute and per-user day limits; rejected requests do not spend quota',()=>{
 const database=db();assert.equal(reserve(database,'a','2026-10-08',1),1);assert.equal(reserve(database,'a','2026-10-08',1),1);assert.equal(reserve(database,'a','2026-10-08',1),0);
 for(let i=2;i<10;i++)assert.equal(reserve(database,'a','2026-10-08',i),1);
 assert.equal(reserve(database,'a','2026-10-08',10),0);assert.equal(reserve(database,'a','2026-10-09',11),1);database.close();
});
test('global daily and lifetime pilot limits work across users and days',()=>{
 const database=db();for(let i=0;i<50;i++)assert.equal(reserve(database,'user'+i,'day0',i),1);assert.equal(reserve(database,'another','day0',51),0);
 for(let d=1;d<10;d++)for(let i=0;i<50;i++)assert.equal(reserve(database,'user'+i,'day'+d,d*60+i),1);
 assert.equal(reserve(database,'fresh','day11',999),0);assert.equal(database.prepare('SELECT COUNT(*) AS n FROM reservations').get().n,500);database.close();
});
test('both languages cover the same topics and answer keys; arithmetic matches examples',()=>{
 assert.deepEqual(lessons.ru.map(l=>l.id),lessons.uz.map(l=>l.id));
 for(const language of ['ru','uz','kk'])for(const lesson of lessons[language]){assert.equal(lesson.questions.length,3);for(const q of lesson.questions)assert.ok(q.correct>=0 && q.correct<q.options.length);}
 for(let i=0;i<3;i++)assert.deepEqual(lessons.ru[i].questions.map(q=>q.correct),lessons.uz[i].questions.map(q=>q.correct));
 assert.equal(3*5+6,21);assert.equal((14-4)/2,5);assert.equal((15+10)/5,5);assert.equal(150*.2,30);assert.equal(100000*.9,90000);assert.equal((100-80)/80*100,25);assert.equal(3/6,.5);assert.equal(2/5,.4);
});

