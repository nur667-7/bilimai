import {dayOf,kinds,periodOf} from './store.mjs';
import {quote,actFingerprint} from './domain.mjs';

// Additional examples are explicit demo records, separate from the live trial
// shift. Stable IDs and INSERT ... DO NOTHING preserve subsequent user edits.
export function accountDemoData(clock=Date.now()) {
 const data=Object.fromEntries(kinds.map(k=>[k,[]]));
 const workday=dayOf(clock-86400000),oldDay=dayOf(clock-172800000),year=workday.slice(0,4);
 const at=(day,hour)=>new Date(`${day}T${String(hour).padStart(2,'0')}:00:00+05:00`).toISOString();
 const stamp=new Date(clock).toISOString(),period=periodOf(at(workday,12));
 const contract=(uid,name,reference,amount)=>({id:uid,manager_id:'manager',client_id:'mvp-client',name,reference,city:'Алматы',segment:'Демо',monthly_net:amount,vat_rate:16,start_date:`${year}-01-01`,end_date:`${+year+1}-12-31`,client_bin:'',payment_days:10,sla_hours:168,sla_penalty:5000,terms:'Демонстрационные данные для показа кабинетов. Не реальные услуги и платежи.',status:'active'});
 data.contract.push(contract('K-EXAMPLE-SERVICE','Демо · обслуживание бизнес-центра','DEMO-SERVICE',300000),contract('K-EXAMPLE-QUALITY','Демо · обслуживание магазина','DEMO-QUALITY',200000));
 const site=(uid,cid,name,budget,zone)=>({id:uid,contract_id:cid,name,city:'Алматы',address:'Демонстрационный объект, адрес условный',area:600,contractor_id:'mvp-contractor',monthly_budget:budget,vendor_hourly_rate:3000,building_id:uid,lat:43.264,lon:76.929,require_training:false,require_photos:false,checklist:['Убрать полы','Очистить урны'],zones:[zone],qr_token:crypto.randomUUID()});
 data.site.push(site('OBJ-EXAMPLE-OFFICE','K-EXAMPLE-SERVICE','Демо · бизнес-центр «Орбита»',150000,'Холл'),site('OBJ-EXAMPLE-SHOP','K-EXAMPLE-QUALITY','Демо · магазин «Витрина»',120000,'Торговый зал'));
 for(const [uid,sid,hour] of [['S-EXAMPLE-01','OBJ-EXAMPLE-OFFICE',6],['S-EXAMPLE-02','OBJ-EXAMPLE-OFFICE',9],['S-EXAMPLE-03','OBJ-EXAMPLE-SHOP',13],['S-EXAMPLE-04','OBJ-EXAMPLE-OFFICE',16]]) {
  const s=data.site.find(s=>s.id===sid),start=at(workday,hour),end=at(workday,hour+2),slot='SLOT-'+uid;
  data.slot.push({id:slot,site_id:sid,zone:s.zones[0],planned_start:start,planned_end:end,wage:2500,vendor_rate:3000,status:'assigned'});
  data.shift.push({id:uid,slot_id:slot,site_id:sid,zone:s.zones[0],operator_id:'mvp-operator',planned_start:start,planned_end:end,fact_start:start,fact_end:end,wage:2500,vendor_rate:3000,status:'approved',approved_minutes:120,earned:2500,vendor_earned:6000,report:'Демо: уборка выполнена, результат принят менеджером.',checklist:s.checklist,estimated_end:false,rejection_note:'Демонстрационная приёмка',gps:{demo:true}});
 }
 data.slot.push({id:'SLOT-EXAMPLE-REVIEW',site_id:'OBJ-EXAMPLE-SHOP',zone:'Торговый зал',planned_start:at(oldDay,13),planned_end:at(oldDay,15),wage:2500,vendor_rate:3000,status:'assigned'});
 data.shift.push({id:'S-EXAMPLE-REVIEW',slot_id:'SLOT-EXAMPLE-REVIEW',site_id:'OBJ-EXAMPLE-SHOP',zone:'Торговый зал',operator_id:'mvp-operator',planned_start:at(oldDay,13),planned_end:at(oldDay,15),fact_start:at(oldDay,13),fact_end:at(oldDay,15),wage:2500,vendor_rate:3000,status:'needs_review',earned:0,vendor_earned:0,report:'Демо: оператор забыл отметку выхода — требуется проверка минут.',checklist:[],estimated_end:true,rejection_note:'',gps:{demo:true}});
 const closed={id:'Z-EXAMPLE-CLOSED',site_id:'OBJ-EXAMPLE-SHOP',zone:'Торговый зал',contractor_id:'mvp-contractor',operator_ids:['mvp-operator'],penalty_amount:5000,created_by:'mvp-client',title:'Демо · урны у касс не убраны вовремя',description:'Пример замечания с просроченным устранением и одним удержанием.',created_at:at(workday,14),deadline:at(workday,16),resolved_at:at(workday,18),resolution:'Демо: замечание устранено, клиент принял результат.',status:'closed'};
 data.issue.push(closed,{id:'Z-EXAMPLE-OPEN',site_id:'OBJ-EXAMPLE-SHOP',zone:'Торговый зал',contractor_id:'mvp-contractor',operator_ids:['mvp-operator'],penalty_amount:5000,created_by:'mvp-client',title:'Демо · проверить чистоту витрины',description:'Учебное замечание для перехода в работу и загрузки фото устранения.',created_at:stamp,deadline:new Date(clock+168*3600000).toISOString(),resolved_at:null,resolution:'',status:'open'});
 data.penalty.push({id:'FINE-EXAMPLE-01',issue_id:closed.id,site_id:closed.site_id,contractor_id:'mvp-contractor',period,amount:5000,reason:'Демо: нарушение срока устранения замечания',voided:false,created_at:at(workday,17)});
 data.claim.push({id:'CLAIM-EXAMPLE-OFFICE',site_id:'OBJ-EXAMPLE-OFFICE',contractor_id:'mvp-contractor',period,amount:18000,approved_amount:18000,status:'accepted',note:'Демо: три принятые смены по два часа.',review_note:'Демо: 6 часов × 3 000 ₸.'});
 // The quality site retains an unreviewed shift, so its final claim is not
 // fabricated; the fine is visible in the overall contractor balance.
 data.payment.push({id:'PAY-EXAMPLE-VENDOR',kind:'vendor',related_id:'CLAIM-EXAMPLE-OFFICE',recipient_id:'mvp-contractor',period,amount:6000,reference:'DEMO-VENDOR-PAYMENT',paid_at:at(workday,19),created_by:'manager'},{id:'PAY-EXAMPLE-OPERATOR',kind:'operator',related_id:'mvp-operator',recipient_id:'mvp-operator',period,amount:2500,reference:'DEMO-OPERATOR-PAYMENT',paid_at:at(workday,20),created_by:'mvp-contractor'});
 const c=data.contract[0];
 data.act.push({id:'AVR-EXAMPLE-OFFICE',contract_id:c.id,period,revision:1,net:100000,vat:16000,total:116000,status:'sent',note:'Демо: акт по принятым работам бизнес-центра.',client_note:'',created_at:at(workday,19),sent_at:at(workday,19),accepted_at:null,fingerprint:actFingerprint(data,c,period),snapshot:{client:'Клиент MVP',reference:c.reference,sites:[data.site[0].name],approved_shifts:3,hours:6,vat_rate:16}});
 const input={name:'Демо · предложение для нового офиса',city:'Алматы',segment:'Офис',area:800,payroll_net:94000,chemistry:5000,hygiene:3000,inventory:2000,equipment:1000,uniform:1000,gross_up_rate:6,commission_rate:10.1,admin_rate:1,margin_rate:15,vat_rate:16,client_budget:200000,budget_includes_vat:true};
 data.quote.push({id:'Q-EXAMPLE-OFFICE',manager_id:'manager',name:input.name,city:input.city,segment:input.segment,payload:input,result:quote(input),converted_contract_id:null});
 for(const user_id of ['manager','mvp-contractor','mvp-operator','mvp-client'])data.notice.push({id:'N-EXAMPLE-'+user_id,user_id,text:'Добавлены демопримеры: принятые смены, начисления, замечания и акт. Это не реальные операции.',related_id:'AVR-EXAMPLE-OFFICE',read:false,created_at:stamp});
 data.audit.push({id:'AUD-DEMO-ACCOUNTS-V2',user_id:'manager',action:'Добавлен связанный демонстрационный набор кабинетов v2',target:'demo-accounts-v2',created_at:stamp});
 return data;
}
export function accountDemoSQL(clock=Date.now()) {
 const data=accountDemoData(clock),q=value=>"'"+String(value).replaceAll("'","''")+"'",statements=[];
 for(const kind of kinds)for(const row of data[kind])statements.push(`INSERT INTO ic_records(kind,id,data) VALUES(${q(kind)},${q(row.id)},${q(JSON.stringify(row))}) ON CONFLICT(kind,id) DO NOTHING;`);
 statements.push("UPDATE ic_meta SET revision=revision+1 WHERE id='state' AND NOT EXISTS(SELECT 1 FROM ic_meta WHERE id='demo-accounts-v2');");
 statements.push("INSERT OR IGNORE INTO ic_meta(id,revision,mutation_id,seed_version) VALUES('demo-accounts-v2',0,'demo-accounts-v2',2);");
 return statements.join('\n');
}
