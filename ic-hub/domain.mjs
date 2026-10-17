import { must,find,dayOf,periodOf,id,now,notify } from './store.mjs';
export const sum=(rows,key)=>rows.reduce((a,r)=>a+(+r[key]||0),0);
export const pick=(row,keys)=>Object.fromEntries(keys.split(' ').map(k=>[k,row[k]??null]));
export const money=v=>Math.round(v);
export function role(user,...roles){must(roles.includes(user.role),'Действие недоступно в вашем кабинете',403);}
export function account(data,uid,expected){const a=find(data,'account',uid);must(a?.active&&(!expected||a.role===expected),'Аккаунт недоступен',404);return a;}
export function visible(data,user){
  let sites=data.site.filter(s=>user.role==='manager'?find(data,'contract',s.contract_id)?.manager_id===user.id:user.role==='client'?find(data,'contract',s.contract_id)?.client_id===user.id:user.role==='contractor'?s.contractor_id===user.id:data.shift.some(sh=>sh.site_id===s.id&&sh.operator_id===user.id));
  const ids=new Set(sites.map(s=>s.id));
  const contracts=data.contract.filter(c=>user.role==='manager'?c.manager_id===user.id:user.role==='client'?c.client_id===user.id:sites.some(s=>s.contract_id===c.id));
  return {sites,ids,contracts,cids:new Set(contracts.map(c=>c.id))};
}
export function siteFor(data,user,uid){const s=visible(data,user).sites.find(s=>s.id===uid);must(s,'Объект недоступен',404);return s;}
export function contractFor(data,user,uid){const c=visible(data,user).contracts.find(c=>c.id===uid);must(c,'Договор недоступен',404);return c;}
export function shiftFor(data,user,uid){const s=find(data,'shift',uid);must(s,'Смена не найдена',404);siteFor(data,user,s.site_id);must(user.role!=='operator'||s.operator_id===user.id,'Смена не найдена',404);return s;}
export function eligible(data,worker,site,when){
  must(worker,'Сначала заполните рабочий профиль оператора с ИИН',422);const day=dayOf(when);
  must(worker.tax_status==='ACTIVE'&&worker.tax_valid_until>=day,'Нет подтверждённого налогового допуска на дату смены');
  must(!site.require_training||(worker.training_date&&worker.training_date<=day),'Для объекта требуется обучение до начала смены');
}
export function distance(a,b,c,d){const r=x=>x*Math.PI/180,x=Math.sin(r(c-a)/2)**2+Math.cos(r(a))*Math.cos(r(c))*Math.sin(r(d-b)/2)**2;return 6371000*2*Math.asin(Math.sqrt(x));}
export function validateGPS(g,site,clock=Date.now()){
  must(g&&Number.isFinite(g.lat)&&Number.isFinite(g.lon)&&Number.isFinite(g.accuracy)&&Math.abs(g.lat)<=90&&Math.abs(g.lon)<=180&&g.accuracy>=0,'Нужна корректная геопозиция телефона',422);
  must(Number.isFinite(Date.parse(g.recorded_at))&&Math.abs(Date.parse(g.recorded_at)-clock)<=90000,'Геопозиция устарела. Получите новый замер.');
  must(g.accuracy<=30,'Недостаточная точность GPS. Нужна погрешность до 30 м.');
  if(site){must(site.lat!==null&&site.lon!==null,'Укажите координаты объекта');const metres=distance(g.lat,g.lon,site.lat,site.lon);must(metres+g.accuracy<=50,'Вы находитесь вне подтверждённой зоны 50 м. Расстояние: '+Math.round(metres)+' м');}
}
export function interval(a,b){must(typeof a==='string'&&typeof b==='string'&&/(Z|[+-]\d\d:\d\d)$/.test(a)&&/(Z|[+-]\d\d:\d\d)$/.test(b),'Укажите время с часовым поясом',422);const start=Date.parse(a),end=Date.parse(b);must(Number.isFinite(start)&&Number.isFinite(end)&&end>start&&end-start<=86400000,'Смена должна длиться от 0 до 24 часов',422);return [start,end];}
function night(a,b){const x=new Date(a+5*3600000),y=new Date(b+5*3600000);return dayOf(a)!==dayOf(b)||x.getUTCHours()>=22||x.getUTCHours()<6||y.getUTCHours()>22||(y.getUTCHours()===22&&y.getUTCMinutes()>0);}
export function validateSchedule(data,operator,site,start,end,ignore=null){
  const others=data.shift.filter(s=>s.operator_id===operator&&s.status!=='cancelled'&&s.id!==ignore),hours={};
  for(const s of others){const a=Date.parse(s.planned_start),b=Date.parse(s.planned_end);must(!(start<b&&end>a),'Пересечение с другой сменой оператора');const earlier=b<=start,gap=earlier?start-b:a-end,other=find(data,'site',s.site_id);must(!(gap>=0&&gap<2700000&&other.id!==site.id&&(!site.building_id||site.building_id!==other.building_id)),'Между разными зданиями нужно не менее 45 минут');must(!(gap>=0&&gap<28800000&&(earlier?night(a,b):night(start,end))),'После ночной смены нужен отдых не менее 8 часов');}
  for(const [a,b]of [...others.map(s=>[Date.parse(s.planned_start),Date.parse(s.planned_end)]),[start,end]]){let t=a;while(t<b){const d=dayOf(t),next=Date.parse(d+'T00:00:00+05:00')+86400000,stop=Math.min(next,b);hours[d]=(hours[d]||0)+(stop-t)/3600000;t=stop;}}
  must(Object.values(hours).every(h=>h<=14),'Превышен лимит 14 часов за календарные сутки');
}
export function timers(data,clock=Date.now()){
  for(const s of data.shift.filter(s=>s.status==='working')){
    if(clock>=Date.parse(s.planned_end)+900000&&!s.checkout_notice_at){s.checkout_notice_at=now();notify(data,s.operator_id,'Вы завершили смену? Отметьте выход по QR.',s.id);}
    if(clock>=Date.parse(s.planned_end)+1200000){s.fact_end=s.planned_end;s.status='needs_review';s.estimated_end=true;const c=find(data,'contract',find(data,'site',s.site_id).contract_id);notify(data,c.manager_id,'Выход не подтверждён. Проверьте минуты смены.',s.id);notify(data,s.operator_id,'Смена ждёт проверки забытого выхода.',s.id);}
  }
  for(const issue of data.issue){if(clock>Date.parse(issue.deadline)&&(!issue.resolved_at||Date.parse(issue.resolved_at)>Date.parse(issue.deadline))&&issue.contractor_id&&issue.penalty_amount&&!data.penalty.some(p=>p.issue_id===issue.id)){data.penalty.push({id:id('FINE'),issue_id:issue.id,site_id:issue.site_id,contractor_id:issue.contractor_id,period:periodOf(issue.created_at),amount:issue.penalty_amount,reason:'Просрочено устранение: '+issue.title,voided:false,created_at:now()});notify(data,issue.contractor_id,'Удержание по SLA: '+issue.penalty_amount+' ₸',issue.id);}}
}
export const penalty=(data,site,period)=>sum(data.penalty.filter(p=>p.site_id===site&&p.period===period&&!p.voided),'amount');
export function quote(input){
  const keys=['payroll_net','chemistry','hygiene','inventory','equipment','uniform','gross_up_rate','commission_rate','admin_rate','margin_rate','vat_rate','client_budget'];for(const k of keys)must(Number.isFinite(input[k])&&input[k]>=0,'Проверьте числовое поле '+k,422);
  must(input.gross_up_rate<100&&input.margin_rate>0&&input.margin_rate<100&&input.vat_rate<=100&&input.client_budget>0,'Проверьте проценты и бюджет',422);
  const payroll=input.payroll_net/(1-input.gross_up_rate/100),cost=payroll+input.chemistry+input.hygiene+input.inventory+input.equipment+input.uniform;
  const partner=cost*(1+input.commission_rate/100)*(1+input.admin_rate/100),price=partner/(1-input.margin_rate/100),withVAT=price*(1+input.vat_rate/100),budget=input.client_budget/(input.budget_includes_vat?1+input.vat_rate/100:1),margin=(budget-partner)/budget*100;
  return {payroll_gross:money(payroll),cost:money(cost),partner_budget:money(partner),price_no_vat:money(price),price_with_vat:money(withVAT),profit:money(price-partner),budget_no_vat:money(budget),budget_margin:Math.round(margin*100)/100,verdict:margin>=input.margin_rate?'take':margin>=10?'revise':'decline',budget_gap:money(input.client_budget-(input.budget_includes_vat?withVAT:price))};
}
export function actFingerprint(data,c,period){return JSON.stringify({contract:c,sites:data.site.filter(s=>s.contract_id===c.id).map(s=>pick(s,'id name address contractor_id monthly_budget')),shifts:data.shift.filter(s=>find(data,'site',s.site_id)?.contract_id===c.id&&periodOf(s.planned_start)===period&&s.status!=='cancelled').map(s=>pick(s,'id status fact_start fact_end earned vendor_earned report')),issues:data.issue.filter(i=>find(data,'site',i.site_id)?.contract_id===c.id&&i.status!=='closed').map(i=>pick(i,'id status resolution'))});}
