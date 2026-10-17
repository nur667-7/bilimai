import QRCode from 'qrcode';
import {ensureSeed,readStore,mutate,Problem,must,find,periodOf,now} from './store.mjs';
import {account,role,siteFor,shiftFor,contractFor,timers,pick} from './domain.mjs';
import {action} from './actions.mjs';
import {bootstrap} from './state.mjs';
const response=(value,status=200,extra={})=>Response.json(value,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extra}});
const hex=buffer=>Array.from(new Uint8Array(buffer),b=>b.toString(16).padStart(2,'0')).join('');
const hash=text=>crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)).then(hex);
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function body(request){
 const reader=request.body?.getReader();must(reader,'Нужно тело запроса',422);const chunks=[];let size=0;
 for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>4*1024*1024){await reader.cancel();throw new Problem('Запрос слишком большой. Уменьшите фотографии.',413);}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 try{const result=JSON.parse(new TextDecoder().decode(bytes));must(result&&typeof result==='object'&&!Array.isArray(result),'Нужен JSON-объект',422);return result;}catch(e){if(e instanceof Problem)throw e;throw new Problem('Некорректный JSON',422);}
}
async function auth(db,request,data){const raw=request.headers.get('cookie')?.match(/(?:^|;\s*)ic_hub_session=([^;]+)/)?.[1];if(!raw)return null;const session=await db.prepare('SELECT * FROM ic_sessions WHERE token_hash=? AND expires>?').bind(await hash(raw),now()).first();if(!session)return null;const user=find(data,'account',session.user_id);return user?.active?{user,session}:null;}
const page=(title,content)=>new Response(`<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${escape(title)}</title><style>body{font:17px system-ui;color:#293450;background:#f6f5fc;padding:24px}main{max-width:740px;margin:20px auto;background:white;border-radius:22px;padding:28px}h1{font-size:28px}p{line-height:1.8}.qr{width:100%;max-width:360px;margin:auto}.qr svg{width:100%;height:auto}a{overflow-wrap:anywhere;color:#6553d5}button{padding:14px;background:#6553d5;border:0;border-radius:10px;color:white}table{border-collapse:collapse;width:100%}td,th{padding:12px;border:1px solid #ddd;text-align:left}@media print{button{display:none}}</style><main>${content}</main></html>`,{headers:{'Content-Type':'text/html;charset=utf-8','Cache-Control':'private, no-store'}});
async function qrPage(request,data,user,path){
 role(user,'manager','contractor');const url=new URL(request.url),parts=path.split('/').filter(Boolean);let site,shift;
 if(parts[0]==='shifts'){shift=shiftFor(data,user,parts[1]);must(['planned','working'].includes(shift.status),'QR доступен для назначенной или работающей смены');site=siteFor(data,user,shift.site_id);}else site=siteFor(data,user,parts[1]);
 const complaint=url.searchParams.get('kind')==='complaint',params=new URLSearchParams(complaint?{complaint:site.id}:{attendance:`ICLINE:${site.id}:${site.qr_token}`});if(shift){params.set('shift',shift.id);params.set('operator',shift.operator_id);}
 const link=url.origin+'/ic-hub/#'+params,svg=await QRCode.toString(link,{type:'svg',errorCorrectionLevel:'M'});
 return page('QR '+site.name,`<h1>${escape(site.name)}</h1><p>${escape(site.address)}</p>${shift?`<p>${escape(account(data,shift.operator_id).name)} · ${escape(shift.zone)}</p>`:''}<div class="qr">${svg}</div><p>${complaint?'Клиент сканирует QR и прикладывает фото замечания.':'Оператор сканирует код с телефона. Назначение, GPS и факт смены проверяются сервером.'}</p><p><a href="${escape(link)}">Открыть ${complaint?'замечание':'назначенную смену'}</a></p><p>HTTPS уже включён. Профиль сертификата и одна Wi-Fi сеть не нужны.</p><button onclick="window.print()">Распечатать QR</button>`);
}
async function api(request,env){
 const db=env.IC_DB;must(db,'База IC Hub не подключена',503);await ensureSeed(db);
 const url=new URL(request.url),path=url.pathname.slice('/api/ic-hub'.length),write=!['GET','HEAD'].includes(request.method);
 if(write){const origin=request.headers.get('origin');must(!origin||origin===url.origin,'Недопустимый источник запроса',403);}
 const {data}=await readStore(db);
 if(path==='/health')return response({status:'ok',app:'ic-hub',version:7,storage:'Cloudflare D1',demo:true});
 if(path==='/ops/login-accounts'&&request.method==='GET')return response(data.account.filter(a=>a.active).map(a=>pick(a,'id name role')));
 if(path==='/ops/login'&&request.method==='POST'){
  const input=await body(request),user=account(data,input.user_id);const raw=crypto.randomUUID()+crypto.randomUUID(),csrf=crypto.randomUUID();await db.batch([db.prepare('DELETE FROM ic_sessions WHERE expires<?').bind(now()),db.prepare('INSERT INTO ic_sessions(token_hash,user_id,csrf,expires) VALUES(?,?,?,?)').bind(await hash(raw),user.id,csrf,new Date(Date.now()+28800000).toISOString())]);
  return response({user:pick(user,'id name role'),csrf},200,{'Set-Cookie':`ic_hub_session=${raw}; Path=/api/ic-hub; HttpOnly; SameSite=Strict; Max-Age=28800${url.protocol==='https:'?'; Secure':''}`});
 }
 const signed=await auth(db,request,data);
 if(path==='/auth/me')return response(signed?{user:pick(signed.user,'id name role'),csrf:signed.session.csrf}:{user:null,csrf:''});
 must(signed,'Войдите в свой кабинет',401);const {user,session}=signed;
 if(write)must(request.headers.get('X-CSRF-Token')===session.csrf,'Обновите страницу: сессия изменилась',403);
 if(path==='/auth/logout'&&request.method==='POST'){await db.prepare('DELETE FROM ic_sessions WHERE token_hash=?').bind(session.token_hash).run();return response({ok:true},200,{'Set-Cookie':'ic_hub_session=; Path=/api/ic-hub; HttpOnly; SameSite=Strict; Max-Age=0'});}
 const op=path.replace(/^\/ops\//,'');must(path.startsWith('/ops/'),'Маршрут не найден',404);
 const period=url.searchParams.get('period')||periodOf(Date.now());must(/^\d{4}-(0[1-9]|1[0-2])$/.test(period),'Неверный период',422);
 if(op==='state'&&request.method==='GET')return response(await mutate(db,d=>{const current=account(d,user.id);timers(d);return bootstrap(d,current,period);}));
 if(/^(sites|shifts)\/[^/]+\/qr$/.test(op)&&request.method==='GET')return qrPage(request,data,user,op);
 if(/^(photos|issue-photos)\//.test(op)&&request.method==='GET'){
  const [kind,uid]=op.split('/');if(kind==='photos'){const photo=find(data,'photo',uid);must(photo,'Фото не найдено',404);shiftFor(data,user,photo.shift_id);}else{const photo=find(data,'issuePhoto',uid);must(photo,'Фото не найдено',404);const issue=find(data,'issue',photo.issue_id);siteFor(data,user,issue.site_id);must(user.role!=='operator'||issue.operator_ids.includes(user.id)||issue.created_by===user.id,'Фото не найдено',404);}
  const file=await db.prepare('SELECT mime,content FROM ic_files WHERE id=?').bind(uid).first();must(file,'Файл не найден',404);return new Response(file.content,{headers:{'Content-Type':file.mime,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
 }
 if(/^acts\/[^/]+\/download$/.test(op)&&request.method==='GET'){
  role(user,'manager','client');const act=find(data,'act',op.split('/')[1]);must(act,'Акт не найден',404);contractFor(data,user,act.contract_id);must(user.role==='manager'||!['draft','superseded'].includes(act.status),'Акт не найден',404);return page('Акт '+act.id,`<h1>Акт выполненных работ</h1><p>${escape(act.id)} · ${escape(act.period)} · редакция ${act.revision}</p><p>${escape(act.snapshot.client)}<br>Договор ${escape(act.snapshot.reference)}</p><table><tr><th>Услуги без НДС</th><td>${act.net} ₸</td></tr><tr><th>НДС ${act.snapshot.vat_rate}%</th><td>${act.vat} ₸</td></tr><tr><th>Итого</th><td>${act.total} ₸</td></tr></table><p>${escape(act.note)}</p><p>Статус: ${escape(act.status)}. Документ не подписан ЭЦП.</p><button onclick="window.print()">Печать / PDF</button>`);
 }
 if(op==='report.csv'&&request.method==='GET'){
  role(user,'manager','contractor');const state=bootstrap(data,user,period),rows=[['Раздел','ID','Данные']];for(const key of ['contracts','sites','shifts','issues','acts','claims','payments','penalties'])for(const row of state[key])rows.push([key,row.id,JSON.stringify(row)]);const csv='\uFEFF'+rows.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(';')).join('\r\n');return new Response(csv,{headers:{'Content-Type':'text/csv;charset=utf-8','Content-Disposition':`attachment; filename="ic-hub-${period}.csv"`,'Cache-Control':'no-store'}});
 }
 must(['POST','PUT'].includes(request.method),'Маршрут не найден',404);const input=await body(request);
 return response(await mutate(db,(d,files)=>{const current=account(d,user.id);timers(d);return action(d,files,current,op,input,request.method,env,url.origin);}));
}
export async function handleHub(request,env){
 try{
  const url=new URL(request.url);let result;
  if(url.pathname==='/ic-hub')return Response.redirect(url.origin+'/ic-hub/'+url.search,308);
  if(url.pathname.startsWith('/api/ic-hub'))result=await api(request,env);
  else{must(env.ASSETS,'Статические файлы ещё не загружены',503);if(url.pathname==='/ic-hub/')url.pathname='/ic-hub/index.html';result=await env.ASSETS.fetch(new Request(url,request));}
  const headers=new Headers(result.headers);headers.set('Permissions-Policy','camera=(self), geolocation=(self), microphone=()');headers.set('X-Content-Type-Options','nosniff');headers.set('Referrer-Policy','no-referrer');headers.set('X-Frame-Options','DENY');headers.set('X-Robots-Tag','noindex, nofollow');if(new URL(request.url).protocol==='https:')headers.set('Strict-Transport-Security','max-age=31536000');return new Response(result.body,{status:result.status,headers});
 }catch(error){if(!(error instanceof Problem))console.error('IC Hub request failed',error.message);return response({detail:error instanceof Problem?error.message:'Сервер не смог сохранить данные. Повторите позже.'},error instanceof Problem?error.status:500);}
}
export async function runHubTimers(db){if(!db)return;await ensureSeed(db);await mutate(db,data=>{timers(data);return null;});}
