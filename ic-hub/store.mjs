// IC Hub uses its own D1 binding. No BilimAI education tables are touched.
export const id = prefix => prefix + '-' + crypto.randomUUID();
export const now = () => new Date().toISOString();
export const periodOf = value => new Date(new Date(value).getTime() + 5 * 3600000).toISOString().slice(0, 7);
export const dayOf = value => new Date(new Date(value).getTime() + 5 * 3600000).toISOString().slice(0, 10);
export class Problem extends Error { constructor(message, status = 409) { super(message); this.status = status; } }
export function must(ok, message, status = 409) { if (!ok) throw new Problem(message, status); }
export const kinds = ['account','worker','engagement','contract','site','slot','shift','photo','issue','issuePhoto','penalty','act','claim','payment','quote','notice','audit','finding'];
export function seedData(clock = Date.now()) {
  const data = Object.fromEntries(kinds.map(k => [k, []]));
  for (const [uid, name, role] of [['manager','Менеджер IC Line','manager'],['mvp-contractor','Субподрядчик MVP','contractor'],['mvp-operator','Оператор MVP','operator'],['mvp-client','Клиент MVP','client']])
    data.account.push({id:uid,name,role,login:uid,company:'Демонстрация IC Line',active:true,created_by:'manager'});
  const date=dayOf(clock), year=date.slice(0,4), start=new Date(clock).toISOString(), end=new Date(clock+2*3600000).toISOString();
  data.worker.push({id:'mvp-operator',user_id:'mvp-operator',contractor_id:'mvp-contractor',iin_hash:'DEMO-NO-REAL-IIN',iin_last4:'ДЕМО',tax_status:'ACTIVE',tax_valid_until:`${+year+1}-12-31`,training_date:`${year}-01-01`,evidence:'Демонстрационные допуски. Личность и государственные данные не проверены.'});
  data.engagement.push({id:'mvp-operator:mvp-contractor',worker_id:'mvp-operator',contractor_id:'mvp-contractor',active:true});
  data.contract.push({id:'K-DEMO',manager_id:'manager',client_id:'mvp-client',name:'Демонстрационный договор IC Line',reference:'MVP-DEMO-SHIFT',city:'Алматы',segment:'Демо',monthly_net:500000,vat_rate:16,start_date:`${year}-01-01`,end_date:`${+year+1}-12-31`,client_bin:'',payment_days:10,sla_hours:2,sla_penalty:5000,terms:'Все начальные записи являются демонстрацией, а не реальными услугами.',status:'active'});
  data.site.push({id:'OBJ-DEMO',contract_id:'K-DEMO',name:'Демо-объект · первая смена',city:'Алматы',address:'Демонстрационный адрес — задайте реальное место',area:100,contractor_id:'mvp-contractor',monthly_budget:200000,vendor_hourly_rate:3000,building_id:'DEMO',lat:43.264,lon:76.929,require_training:false,require_photos:true,checklist:['Убрать полы','Очистить урны'],zones:['Основная зона'],qr_token:crypto.randomUUID()});
  data.slot.push({id:'SLOT-DEMO',site_id:'OBJ-DEMO',zone:'Основная зона',planned_start:start,planned_end:end,wage:2500,vendor_rate:3000,status:'assigned'});
  data.shift.push({id:'S-DEMO',slot_id:'SLOT-DEMO',site_id:'OBJ-DEMO',zone:'Основная зона',operator_id:'mvp-operator',planned_start:start,planned_end:end,wage:2500,vendor_rate:3000,status:'planned',fact_start:null,fact_end:null,earned:0,vendor_earned:0,report:'',checklist:[],estimated_end:false,rejection_note:''});
  for(const uid of ['manager','mvp-contractor','mvp-operator','mvp-client'])data.notice.push({id:id('N'),user_id:uid,text:'Демо-данные добавлены один раз. Изменения, фото и отметки сохраняются на сервере.',related_id:'S-DEMO',read:false,created_at:now()});
  return data;
}
export async function ensureSeed(db) {
  let meta=await db.prepare("SELECT * FROM ic_meta WHERE id='state'").first();
  if(!meta){await db.prepare("INSERT OR IGNORE INTO ic_meta(id,revision,mutation_id,seed_version) VALUES('state',0,'initial',0)").run();meta=await db.prepare("SELECT * FROM ic_meta WHERE id='state'").first();}
  if(meta.seed_version>=1)return;
  const marker=id('seed'),data=seedData();
  const statements=[db.prepare("UPDATE ic_meta SET seed_version=1,revision=revision+1,mutation_id=? WHERE id='state' AND seed_version=0").bind(marker)];
  for(const kind of kinds)for(const row of data[kind])statements.push(db.prepare("INSERT INTO ic_records(kind,id,data) SELECT ?,?,? WHERE (SELECT mutation_id FROM ic_meta WHERE id='state')=? ON CONFLICT(kind,id) DO NOTHING").bind(kind,row.id,JSON.stringify(row),marker));
  await db.batch(statements);
}
export async function readStore(db) {
  const result=await db.batch([db.prepare("SELECT revision FROM ic_meta WHERE id='state'"),db.prepare('SELECT kind,id,data FROM ic_records')]);
  const data=Object.fromEntries(kinds.map(k=>[k,[]]));
  for(const row of result[1].results)data[row.kind]?.push(JSON.parse(row.data));
  return {revision:result[0].results[0].revision,data};
}
export async function mutate(db,fn) {
  for(let attempt=0;attempt<3;attempt++) {
    const {revision,data}=await readStore(db),previous=new Map();
    for(const kind of kinds)for(const row of data[kind])previous.set(kind+':'+row.id,JSON.stringify(row));
    const files=[],result=await fn(data,files),changes=[];
    for(const kind of kinds)for(const row of data[kind]){const json=JSON.stringify(row);if(json!==previous.get(kind+':'+row.id))changes.push([kind,row.id,json]);}
    if(!changes.length&&!files.length)return result;
    const marker=id('mutation');
    const statements=[db.prepare("UPDATE ic_meta SET revision=revision+1,mutation_id=? WHERE id='state' AND revision=?").bind(marker,revision)];
    for(const [kind,uid,json]of changes)statements.push(db.prepare("INSERT INTO ic_records(kind,id,data) SELECT ?,?,? WHERE (SELECT mutation_id FROM ic_meta WHERE id='state')=? ON CONFLICT(kind,id) DO UPDATE SET data=excluded.data").bind(kind,uid,json,marker));
    for(const f of files)statements.push(db.prepare("INSERT INTO ic_files(id,mime,content) SELECT ?,?,? WHERE (SELECT mutation_id FROM ic_meta WHERE id='state')=?").bind(f.id,f.mime,f.bytes.buffer,marker));
    const saved=await db.batch(statements);
    if(saved[0].meta.changes===1)return result;
  }
  throw new Problem('Данные изменились одновременно с другим устройством. Обновите страницу и повторите.',409);
}
export const find=(data,kind,uid)=>data[kind].find(r=>r.id===uid);
export function audit(data,user,action,target){data.audit.push({id:id('AUD'),user_id:user.id,action,target,created_at:now()});}
export function notify(data,user_id,text,related_id){if(user_id)data.notice.push({id:id('N'),user_id,text,related_id,read:false,created_at:now()});}
