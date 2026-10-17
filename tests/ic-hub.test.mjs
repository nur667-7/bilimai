import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {ensureSeed,readStore,mutate,seedData} from '../ic-hub/store.mjs';
import {validateGPS,validateSchedule,timers,quote,eligible} from '../ic-hub/domain.mjs';
import {bootstrap} from '../ic-hub/state.mjs';
import {handleHub,runHubTimers} from '../ic-hub/server.mjs';
import {accountDemoData,accountDemoSQL} from '../ic-hub/demo-accounts.mjs';

// Execute the actual prepared SQL and transaction batches against SQLite, not a
// mocked state object. Production uses the same SQL via the Cloudflare D1 binding.
function database(){
 const sql=new DatabaseSync(':memory:');sql.exec(readFileSync(new URL('../ic-hub/drizzle/0000_many_moon_knight.sql',import.meta.url),'utf8'));
 const db={prepare(query){let args=[];const p={bind(...values){args=values.map(v=>v instanceof ArrayBuffer?new Uint8Array(v):v);return p;},async first(){return sql.prepare(query).get(...args)||null;},async run(){const r=sql.prepare(query).run(...args);return {meta:{changes:Number(r.changes)}};},query,get args(){return args;}};return p;},async batch(statements){sql.exec('BEGIN IMMEDIATE');try{const results=statements.map(p=>/^\s*SELECT/i.test(p.query)?{results:sql.prepare(p.query).all(...p.args)}:{meta:{changes:Number(sql.prepare(p.query).run(...p.args).changes)}});sql.exec('COMMIT');return results;}catch(e){sql.exec('ROLLBACK');throw e;}}};return db;
}
const fixture=()=>({IC_DB:database(),IC_IDENTITY_SECRET:'unit-test-key-only'});
async function client(env,uid){let cookie='',csrf='';return {async request(path,body,method=body?'POST':'GET'){
 const headers={'Content-Type':'application/json','Origin':'https://example.test',Cookie:cookie,'X-CSRF-Token':csrf};const r=await handleHub(new Request('https://example.test/api/ic-hub'+path,{method,headers,...(body?{body:JSON.stringify(body)}:{})}),env);if(r.headers.get('set-cookie'))cookie=r.headers.get('set-cookie').split(';')[0];const text=await r.text();let value;try{value=JSON.parse(text);}catch{value=text;}if(value.csrf)csrf=value.csrf;return {status:r.status,value,headers:r.headers};},async login(){const r=await this.request('/ops/login',{user_id:uid});assert.equal(r.status,200);return this;}};}
const png='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==';

test('IC Hub account demo is linked, financially consistent and visible to all roles',()=>{
 const clock=Date.parse('2026-10-17T07:00:00Z'),base=seedData(clock),extra=accountDemoData(clock);
 for(const kind of Object.keys(base))base[kind].push(...extra[kind]);
 const state=uid=>bootstrap(base,base.account.find(a=>a.id===uid),'2026-10');
 assert.equal(state('mvp-operator').payroll[0].earned,10000);
 assert.equal(state('mvp-operator').payroll[0].paid,2500);
 assert.equal(state('mvp-operator').payroll[0].balance,7500);
 assert.equal(state('mvp-contractor').summary.vendor_balance,13000);
 assert.equal(state('mvp-client').summary.acts_to_accept,1);
 assert.equal(state('mvp-client').issues.length,2);
 assert.equal(state('manager').quotes.length,1);
 assert.equal(state('manager').acts[0].stale,false);
 for(const s of base.shift)validateSchedule(base,s.operator_id,base.site.find(site=>site.id===s.site_id),Date.parse(s.planned_start),Date.parse(s.planned_end),s.id);
});
test('IC Hub account demo SQL is idempotent and preserves edited records',()=>{
 const sql=new DatabaseSync(':memory:');sql.exec(readFileSync(new URL('../ic-hub/drizzle/0000_many_moon_knight.sql',import.meta.url),'utf8'));
 sql.exec("INSERT INTO ic_meta(id) VALUES('state')");
 const seed=accountDemoSQL(Date.parse('2026-10-17T07:00:00Z'));sql.exec(seed);
 const count=sql.prepare('SELECT COUNT(*) n FROM ic_records').get().n;
 sql.prepare("UPDATE ic_records SET data=? WHERE kind='site' AND id='OBJ-EXAMPLE-OFFICE'").run('{"id":"OBJ-EXAMPLE-OFFICE","name":"Edited by user"}');
 sql.exec(accountDemoSQL(Date.parse('2026-10-18T07:00:00Z')));
 assert.equal(sql.prepare('SELECT COUNT(*) n FROM ic_records').get().n,count);
 assert.equal(JSON.parse(sql.prepare("SELECT data FROM ic_records WHERE kind='site' AND id='OBJ-EXAMPLE-OFFICE'").get().data).name,'Edited by user');
 assert.equal(sql.prepare("SELECT revision FROM ic_meta WHERE id='state'").get().revision,1);
});
test('IC Hub permits an explicit demo assignment without falsifying a worker tax admission',async()=>{
 const env=fixture(),manager=await client(env,'manager');await manager.login();
 const created=await manager.request('/ops/accounts',{name:'Demo unverified worker',login:'demo-unverified-worker',role:'operator',contractor_id:'mvp-contractor',iin:'223456789012'});assert.equal(created.status,200);
 const start=new Date(Date.now()+86400000).toISOString(),end=new Date(Date.now()+93600000).toISOString();
 const slot=await manager.request('/ops/slots',{site_id:'OBJ-DEMO',zone:'Основная зона',planned_start:start,planned_end:end,wage:2500});assert.equal(slot.status,200);
 const payload={slot_id:slot.value.id,site_id:'OBJ-DEMO',zone:'Основная зона',operator_id:created.value.id,planned_start:start,planned_end:end,wage:2500};
 assert.equal((await manager.request('/ops/shifts',payload)).status,409);
 const assigned=await manager.request('/ops/shifts',{...payload,demo_only:true});assert.equal(assigned.status,200);
 const d=(await readStore(env.IC_DB)).data,w=d.worker.find(w=>w.user_id===created.value.id),s=d.shift.find(s=>s.id===assigned.value.id);
 assert.equal(w.tax_status,'UNKNOWN');assert.equal(w.tax_valid_until,null);assert.equal(s.demo_only,true);
 assert.doesNotThrow(()=>eligible(d,w,d.site[0],Date.now(),true));
 d.contract[0].reference='REAL-CONTRACT';assert.throws(()=>eligible(d,w,d.site[0],Date.now(),true),/только на демо/);
});

test('IC Hub seed is persistent, concurrent-safe and does not reset changed data',async()=>{const db=database();await Promise.all([ensureSeed(db),ensureSeed(db)]);let {data}=await readStore(db);assert.equal(data.account.length,4);assert.equal(data.shift.length,1);await mutate(db,d=>{d.site[0].address='Persisted address';});await ensureSeed(db);data=(await readStore(db)).data;assert.equal(data.site[0].address,'Persisted address');});
test('IC Hub concurrent edits retry without overwriting one another',async()=>{const db=database();await ensureSeed(db);const original=(await readStore(db)).data.site[0].monthly_budget;await Promise.all([mutate(db,async d=>{await Promise.resolve();d.site[0].monthly_budget++;}),mutate(db,async d=>{await Promise.resolve();d.site[0].monthly_budget++;})]);assert.equal((await readStore(db)).data.site[0].monthly_budget,original+2);});
test('IC Hub rejects old, inaccurate and outside GPS measurements',()=>{const site={lat:43.264,lon:76.929},clock=Date.now(),gps={...site,accuracy:3,recorded_at:new Date(clock).toISOString()};assert.doesNotThrow(()=>validateGPS(gps,site,clock));for(const g of [{...gps,accuracy:100},{...gps,lat:44},{...gps,recorded_at:new Date(clock-100000).toISOString()}])assert.throws(()=>validateGPS(g,site,clock));});
test('IC Hub schedule enforces overlap, 45-minute travel, daily cap and night rest',()=>{const d=seedData(),s=d.site[0],sh=d.shift[0];const start=Date.parse(sh.planned_start),end=Date.parse(sh.planned_end);assert.throws(()=>validateSchedule(d,sh.operator_id,s,start+60000,end+60000),/Пересечение/);const other={...s,id:'other',building_id:'another'};assert.throws(()=>validateSchedule(d,sh.operator_id,other,end+60000,end+3600000),/45 минут/);const blank={...d,shift:[]};assert.throws(()=>validateSchedule(blank,sh.operator_id,s,start,start+15*3600000),/14 часов/);sh.planned_start='2026-10-16T18:00:00Z';sh.planned_end='2026-10-16T20:00:00Z';assert.throws(()=>validateSchedule(d,sh.operator_id,s,Date.parse('2026-10-17T01:00:00Z'),Date.parse('2026-10-17T02:00:00Z')),/8 часов/);});
test('IC Hub forgotten checkout cannot create approved earnings and SLA fines occur once',()=>{const d=seedData(),s=d.shift[0],end=Date.parse(s.planned_end);s.status='working';s.fact_start=s.planned_start;timers(d,end+16*60000);assert.equal(s.status,'working');assert.ok(s.checkout_notice_at);timers(d,end+21*60000);assert.equal(s.status,'needs_review');assert.equal(s.earned,0);d.issue.push({id:'issue',deadline:new Date(end).toISOString(),created_at:s.planned_start,site_id:s.site_id,contractor_id:'mvp-contractor',penalty_amount:5000,title:'Demo',resolved_at:null});timers(d,end+22*60000);timers(d,end+23*60000);assert.equal(d.penalty.length,1);});
test('IC Hub roles redact internal finances and operator identity from clients',()=>{const d=seedData();const clientState=bootstrap(d,d.account.find(a=>a.role==='client'),d.shift[0].planned_start.slice(0,7)),op=bootstrap(d,d.account.find(a=>a.role==='operator'),d.shift[0].planned_start.slice(0,7));assert.equal(clientState.workers.length,0);assert.equal(clientState.shifts[0].operator_id,undefined);assert.equal(clientState.sites[0].monthly_budget,undefined);assert.equal(op.contracts[0].monthly_net,undefined);assert.equal(op.shifts[0].vendor_earned,undefined);});
test('IC Hub CPQ preserves net gross-up and unrounded price formula',()=>{const input={payroll_net:940000,chemistry:10000,hygiene:20000,inventory:30000,equipment:40000,uniform:0,gross_up_rate:6,commission_rate:10.1,admin_rate:1,margin_rate:15,vat_rate:16,client_budget:2000000,budget_includes_vat:true};const q=quote(input),partner=1100000*1.101*1.01;assert.equal(q.payroll_gross,1000000);assert.equal(q.cost,1100000);assert.equal(q.partner_budget,Math.round(partner));assert.equal(q.price_with_vat,Math.round(partner/.85*1.16));});
test('IC Hub API keeps cookie sessions in D1 and rejects anonymous writes and foreign origins',async()=>{const env=fixture(),c=await client(env,'manager');assert.equal((await c.request('/ops/state')).status,401);await c.login();assert.equal((await c.request('/auth/me')).value.user.id,'manager');const evil=await handleHub(new Request('https://example.test/api/ic-hub/ops/login',{method:'POST',headers:{Origin:'https://evil.test'},body:'{"user_id":"manager"}'}),env);assert.equal(evil.status,403);const noCSRF=await handleHub(new Request('https://example.test/api/ic-hub/ops/notices/read',{method:'POST',body:'{}'}),env);assert.equal(noCSRF.status,401);});
test('IC Hub assigned QR opens HTTPS application and enforces the intended shift',async()=>{const env=fixture(),manager=await client(env,'manager');await manager.login();const r=await manager.request('/ops/shifts/S-DEMO/qr');assert.equal(r.status,200);assert.match(r.value,/https:\/\/example.test\/ic-hub\/#attendance=/);assert.match(r.value,/shift=S-DEMO/);assert.match(r.value,/operator=mvp-operator/);const operator=await client(env,'mvp-operator');await operator.login();const d=(await readStore(env.IC_DB)).data,site=d.site[0],code=`https://example.test/ic-hub/#attendance=${encodeURIComponent('ICLINE:'+site.id+':'+site.qr_token)}&shift=WRONG`;assert.equal((await operator.request('/ops/shifts/S-DEMO/action',{action:'start',qr_code:code,gps:{lat:site.lat,lon:site.lon,accuracy:3,recorded_at:new Date().toISOString()}})).status,422);});
test('IC Hub start/photo/finish is atomic, persistent across clients, and duplicate-safe',async()=>{const env=fixture(),op=await client(env,'mvp-operator');await op.login();let d=(await readStore(env.IC_DB)).data;const site=d.site[0],code=`ICLINE:${site.id}:${site.qr_token}`,gps={lat:site.lat,lon:site.lon,accuracy:3,recorded_at:new Date().toISOString()};const start={action:'start',qr_code:code,gps,before_photo:png};assert.equal((await op.request('/ops/shifts/S-DEMO/action',start)).status,200);assert.equal((await op.request('/ops/shifts/S-DEMO/action',start)).status,200);assert.equal((await readStore(env.IC_DB)).data.photo.length,1);const finish={action:'finish',qr_code:code,gps,checklist:site.checklist,report:'All required work completed',after_photo:'bad'};assert.equal((await op.request('/ops/shifts/S-DEMO/action',finish)).status,422);d=(await readStore(env.IC_DB)).data;assert.equal(d.shift[0].status,'working');assert.equal(d.shift[0].report,'');finish.after_photo=png;assert.equal((await op.request('/ops/shifts/S-DEMO/action',finish)).status,200);assert.equal((await op.request('/ops/shifts/S-DEMO/action',finish)).status,200);d=(await readStore(env.IC_DB)).data;assert.equal(d.photo.length,2);assert.equal(d.shift[0].status,'submitted');const another=await client(env,'manager');await another.login();assert.equal((await another.request('/ops/state')).value.shifts[0].status,'submitted');assert.equal((await another.request('/ops/photos/'+d.photo[0].id)).status,200);});
test('IC Hub client complaints persist with photo and timely resolution avoids penalty',async()=>{const env=fixture(),clientUser=await client(env,'mvp-client');await clientUser.login();const issue=await clientUser.request('/ops/issues',{site_id:'OBJ-DEMO',zone:'Основная зона',title:'Bins dirty',description:'Please clean the bins',photo_base64:png});assert.equal(issue.status,200);const vendor=await client(env,'mvp-contractor');await vendor.login();assert.equal((await vendor.request('/ops/issues/'+issue.value.id+'/action',{status:'in_progress'})).status,200);assert.equal((await vendor.request('/ops/issues/'+issue.value.id+'/action',{status:'resolved',note:'All bins cleaned',photo_base64:png})).status,200);assert.equal((await clientUser.request('/ops/issues/'+issue.value.id+'/action',{status:'closed'})).status,200);await runHubTimers(env.IC_DB);const d=(await readStore(env.IC_DB)).data;assert.equal(d.issue[0].status,'closed');assert.equal(d.issuePhoto.length,2);assert.equal(d.penalty.length,0);});
test('IC Hub hidden accounts cannot mutate another managers or subcontractors data',async()=>{const env=fixture(),op=await client(env,'mvp-operator');await op.login();assert.equal((await op.request('/ops/accounts',{name:'Bad manager',login:'evil',role:'manager'})).status,403);const clientUser=await client(env,'mvp-client');await clientUser.login();assert.equal((await clientUser.request('/ops/slots',{site_id:'OBJ-DEMO'})).status,403);});
test('IC Hub acceptance, acts and payments persist and cannot double-pay',async()=>{
 const env=fixture(),manager=await client(env,'manager');await manager.login();
 // Completed work is an isolated test fixture, never an operation on production.
 const end=new Date().toISOString(),start=new Date(Date.parse(end)-7200000).toISOString(),period=end.slice(0,7);
 await mutate(env.IC_DB,d=>Object.assign(d.shift[0],{status:'submitted',planned_start:start,planned_end:end,fact_start:start,fact_end:end}));
 assert.equal((await manager.request('/ops/shifts/S-DEMO/action',{action:'approve'})).status,200);
 assert.equal((await manager.request('/ops/shifts/S-DEMO/action',{action:'approve'})).status,409);
 let d=(await readStore(env.IC_DB)).data;assert.equal(d.shift[0].earned,2500);assert.equal(d.shift[0].vendor_earned,6000);
 const vendor=await client(env,'mvp-contractor');await vendor.login();
 const claim=await vendor.request('/ops/claims',{site_id:'OBJ-DEMO',period,amount:6000,note:'Accepted work in test'});assert.equal(claim.status,200);
 assert.equal((await manager.request('/ops/claims/'+claim.value.id+'/action',{action:'accept',amount:6000,note:'Checked accepted work'})).status,200);
 const act=await manager.request('/ops/acts',{contract_id:'K-DEMO',period,net:100000,note:'Monthly accepted service'});assert.equal(act.status,200);
 assert.equal((await manager.request('/ops/acts/'+act.value.id+'/action',{action:'send'})).status,200);
 const customer=await client(env,'mvp-client');await customer.login();assert.equal((await customer.request('/ops/acts/'+act.value.id+'/action',{action:'accept'})).status,200);
 const payment={kind:'vendor',related_id:claim.value.id,period,amount:6001,reference:'VENDOR-OVERPAY',paid_at:end};assert.equal((await manager.request('/ops/payments',payment)).status,409);
 assert.equal((await manager.request('/ops/payments',{...payment,amount:6000,reference:'VENDOR-ONE'})).status,200);
 assert.equal((await manager.request('/ops/payments',{...payment,amount:1,reference:'VENDOR-TWO'})).status,409);
 assert.equal((await vendor.request('/ops/payments',{kind:'operator',related_id:'mvp-operator',period,amount:2500,reference:'WORKER-ONE',paid_at:end})).status,200);
 const operator=await client(env,'mvp-operator');await operator.login();assert.equal((await operator.request('/ops/state')).value.payroll[0].balance,0);
 d=(await readStore(env.IC_DB)).data;assert.equal(d.payment.length,2);assert.equal(d.act[0].status,'accepted');
});
