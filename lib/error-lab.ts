import { z } from 'zod';
import type { Language } from './lessons';

export type LabTopic = 'linear' | 'percent' | 'probability';
export type Challenge = { id:string; topic:LabTopic; task:string; steps:string[]; wrongStep:number; explanation:string; repair:string; transfer:string; answer:number; unit:string; hints:string[]; solution:string };
const text = {
 ru: {linear:'Сохраняй равенство',percent:'От какой цены считаем?',probability:'Сколько исходов всего?',solve:'Найдите x',subtract:'Вычитаем',both:'с обеих сторон',divide:'Делим обе стороны',discount:'Цена',off:'скидка',pay:'Сколько заплатить?',discountSum:'Сумма скидки',final:'Итоговая цена',bag:'В мешке',red:'красных и',blue:'синих шаров.',chance:'Шар выбирают случайно. Найдите вероятность синего шара.',fav:'Подходящих исходов',total:'Всего исходов',prob:'Вероятность',eqWhy:'При вычитании числа справа нужно вычесть то же число слева. Иначе равенство изменится.',pctWhy:'Процент скидки нужно умножить на исходную цену. Цена в тенге и число процентов — разные величины.',probWhy:'В знаменателе нужны все шары, а не только красные. Каждый шар одинаково вероятен.',eqHint:'Проверь действие с обеими сторонами.',pctHint:'Сначала найди сумму скидки, затем вычти её.',probHint:'Сначала посчитай все шары.'},
 kk: {linear:'Теңдікті сақта',percent:'Қай бағадан есептейміз?',probability:'Барлығы неше нәтиже бар?',solve:'x-ті табыңыз',subtract:'Азайтамыз',both:'екі жақтан',divide:'Екі жақты бөлеміз',discount:'Баға',off:'жеңілдік',pay:'Қанша төлейсіз?',discountSum:'Жеңілдік сомасы',final:'Соңғы баға',bag:'Қапта',red:'қызыл және',blue:'көк шар бар.',chance:'Шар кездейсоқ алынады. Көк шардың ықтималдығын табыңыз.',fav:'Қолайлы нәтижелер',total:'Барлық нәтижелер',prob:'Ықтималдық',eqWhy:'Оң жақтан санды азайтсақ, сол жақтан да сол санды азайтамыз. Әйтпесе теңдік өзгереді.',pctWhy:'Жеңілдік пайызын бастапқы бағаға көбейту керек. Теңгемен баға мен пайыз саны — әртүрлі шамалар.',probWhy:'Бөлімге тек қызыл емес, барлық шар кіреді. Әр шардың алыну мүмкіндігі бірдей.',eqHint:'Екі жаққа жасалған амалды тексеріңіз.',pctHint:'Алдымен жеңілдікті тауып, бағадан азайтыңыз.',probHint:'Алдымен барлық шарды санаңыз.'},
 uz: {linear:'Tenglikni saqla',percent:'Qaysi narxdan hisoblaymiz?',probability:'Jami nechta natija bor?',solve:'x ni toping',subtract:'Ayiramiz',both:'ikkala tomondan',divide:'Ikkala tomonni bo‘lamiz',discount:'Narx',off:'chegirma',pay:'Qancha to‘lanadi?',discountSum:'Chegirma summasi',final:'Yakuniy narx',bag:'Xaltada',red:'qizil va',blue:'ko‘k shar bor.',chance:'Shar tasodifiy olinadi. Ko‘k shar ehtimolini toping.',fav:'Mos natijalar',total:'Jami natijalar',prob:'Ehtimollik',eqWhy:'O‘ng tomondan sonni ayirsak, chap tomondan ham shu sonni ayiramiz. Aks holda tenglik o‘zgaradi.',pctWhy:'Chegirma foizini boshlang‘ich narxga ko‘paytirish kerak. Tengedagi narx va foiz soni turli kattaliklar.',probWhy:'Maxrajga faqat qizil emas, barcha sharlar kiradi. Har bir shar teng ehtimolli.',eqHint:'Ikkala tomonga qo‘llangan amalni tekshiring.',pctHint:'Avval chegirmani topib, narxdan ayiring.',probHint:'Avval barcha sharlarni sanang.'}
};
export function topicName(topic:LabTopic,language:Language){return text[language][topic];}
function vary(c:Challenge,n:number,language:Language,valid:string[],first:string[],last:string[]):Challenge{
 const position=n%3;
 if(position===1)return c;
 const reason={ru:{linear:['Число вычли только справа. Одинаковое действие нужно применять к обеим сторонам.','В последнем шаге нужно делить на коэффициент перед x.'],percent:['Процент — сотая доля. Нужно делить на 100, не на 10.','Скидка уменьшает цену: её вычитают, а не прибавляют.'],probability:['Спрашивают о синем шаре. Нужно считать синие, а не красные шары.','В числителе — подходящие исходы, в знаменателе — все. Дробь перевёрнута.']},kk:{linear:['Сан тек оң жақтан азайтылды. Бірдей амалды екі жаққа қолдану керек.','Соңғы қадамда x алдындағы коэффициентке бөлу керек.'],percent:['Пайыз — жүзден бір үлес. 10-ға емес, 100-ге бөлеміз.','Жеңілдік бағаны азайтады: оны қоспай, азайтамыз.'],probability:['Көк шар сұралған. Қызыл емес, көк шарларды санау керек.','Алымда қолайлы, бөлімде барлық нәтижелер болады. Бөлшек кері жазылған.']},uz:{linear:['Son faqat o‘ng tomondan ayirildi. Ikkala tomonga bir xil amal qo‘llash kerak.','Oxirgi qadamda x oldidagi koeffitsiyentga bo‘lish kerak.'],percent:['Foiz — yuzdan bir ulush. 10 ga emas, 100 ga bo‘lamiz.','Chegirma narxni kamaytiradi: uni qo‘shmaymiz, ayiramiz.'],probability:['Ko‘k shar so‘ralgan. Qizil emas, ko‘k sharlarni sanash kerak.','Suratda mos natijalar, maxrajda barcha natijalar. Kasr teskari yozilgan.']}};
 return {...c,steps:position===0?first:[...valid.slice(0,2),last[2]],wrongStep:position,explanation:reason[language][c.topic][position===0?0:1]};
}
export function makeChallenge(topic:LabTopic, seed:number, language:Language):Challenge {
 if(!Number.isSafeInteger(seed)||seed<0)throw new Error('Invalid seed');
 const n=seed%24,t=text[language],id=`${topic}-${n}`;
 if(topic==='linear'){
  const a=2+n%4,b=3+Math.floor(n/4),x=3+n%5,c=a*x+b,aa=a+1,xx=x+2,cc=aa*xx+b;
  return vary({id,topic,task:`${a}x + ${b} = ${c}. ${t.solve}.`,steps:[`${t.subtract} ${b} ${t.both}.`,`${a}x = ${c}`,`x = ${c}/${a}`],wrongStep:1,explanation:t.eqWhy,repair:`${a}x = ${c} − ${b} = ${a*x}; x = ${x}.`,transfer:`${aa}x + ${b} = ${cc}. ${t.solve}.`,answer:xx,unit:'',hints:[t.eqHint,`${aa}x = ${cc} − ${b}`,`x = (${cc} − ${b}) / ${aa}`],solution:`(${cc} − ${b}) / ${aa} = ${xx}`},n,language,[`${a}x = ${c} − ${b}`,`${a}x = ${a*x}`,`x = ${x}`],[`${a}x + ${b} = ${c} − ${b}`,`${a}x = ${c} − ${b} − ${b}`,`x = (${c} − ${b} − ${b})/${a}`],['','',`x = ${a*x}/${a+1}`]);
 }
 if(topic==='percent'){
  const price=10000+n*1000,p=10+(n%3)*5,other=price+5000,answer=other*(100-p)/100;
  return vary({id,topic,task:`${t.discount}: ${price} ₸, ${t.off} ${p}%. ${t.pay}`,steps:[`${p}% = ${p}/100`,`${t.discountSum}: ${price} − ${p}`,`${t.final}: ${price} − (${price} − ${p})`],wrongStep:1,explanation:t.pctWhy,repair:`${price} × ${p}/100 = ${price*p/100} ₸; ${price} − ${price*p/100} = ${price*(100-p)/100} ₸.`,transfer:`${t.discount}: ${other} ₸, ${t.off} ${p}%. ${t.pay}`,answer,unit:'₸',hints:[t.pctHint,`${t.discountSum}: ${other} × ${p}/100`,`${t.final}: ${other} − (${other} × ${p}/100)`],solution:`${other} × (100 − ${p}) / 100 = ${answer} ₸`},n,language,[`${p}% = ${p}/100`,`${t.discountSum}: ${price*p/100} ₸`,''],[`${p}% = ${p}/10`,`${t.discountSum}: ${price*p/10} ₸`,`${t.final}: ${price} − ${price*p/10}`],['','',`${t.final}: ${price} + ${price*p/100}`]);
 }
 const r=7+Math.floor(n/4),b=2+n%4,total=r+b,rr=r+2,bb=b+1;
 return vary({id,topic,task:`${t.bag} ${r} ${t.red} ${b} ${t.blue} ${t.chance}`,steps:[`${t.fav}: ${b}`,`${t.total}: ${r}`,`${t.prob}: ${b}/${r}`],wrongStep:1,explanation:t.probWhy,repair:`${t.total}: ${r} + ${b} = ${total}; P = ${b}/${total}.`,transfer:`${t.bag} ${rr} ${t.red} ${bb} ${t.blue} ${t.chance}`,answer:bb/(rr+bb),unit:'',hints:[t.probHint,`${t.total}: ${rr} + ${bb}`,`P = ${bb} / (${rr} + ${bb})`],solution:`P = ${bb}/${rr+bb}`},n,language,[`${t.fav}: ${b}`,`${t.total}: ${total}`,''],[`${t.fav}: ${r}`,`${t.total}: ${total}`,`${t.prob}: ${r}/${total}`],['','',`${t.prob}: ${total}/${b}`]);
}
export function parseNumericAnswer(raw:string):number|null {
 const input=raw.trim().replace(',','.');
 if(input.length>48)return null;
 const fraction=input.match(/^([+-]?\d+(?:\.\d+)?)\s*\/\s*([+-]?\d+(?:\.\d+)?)$/);
 if(fraction){const denominator=Number(fraction[2]);if(!denominator)return null;const v=Number(fraction[1])/denominator;return Number.isFinite(v)?v:null;}
 if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)\s*%?$/.test(input))return null;
 const v=input.endsWith('%')?Number(input.slice(0,-1))/100:Number(input);
 return Number.isFinite(v)?v:null;
}
export function checkAnswer(raw:string,expected:number){const value=parseNumericAnswer(raw);return value!==null && Math.abs(value-expected)<=1e-6;}
export const progressSchema=z.object({version:z.literal(1),records:z.array(z.object({topic:z.enum(['linear','percent','probability']),challenge:z.string().regex(/^(linear|percent|probability)-\d{1,2}$/),independent:z.boolean(),date:z.string().datetime()})).max(60)}).strict();
export type Progress=z.infer<typeof progressSchema>;
export function recommendTopic(progress:Progress):LabTopic{
 const topics:LabTopic[]=['linear','percent','probability'];
 return topics.reduce((best,topic)=>{
  const count=(id:LabTopic)=>new Set(progress.records.filter(r=>r.topic===id&&r.independent).map(r=>r.challenge)).size;
  return count(topic)<count(best)?topic:best;
 },topics[0]);
}

export function nextSeed(progress:Progress,topic:LabTopic):number{
 const seen=new Set(progress.records.filter(r=>r.topic===topic).map(r=>r.challenge));
 for(let seed=0;seed<24;seed++)if(!seen.has(`${topic}-${seed}`))return seed;
 return progress.records.filter(r=>r.topic===topic).length%24;
}
export function reviewSchedule(progress:Progress,now:number){
 if(!Number.isFinite(now))throw new Error('Invalid time');
 return (['linear','percent','probability'] as LabTopic[]).map(topic=>{
  const records=progress.records.filter(r=>r.topic===topic).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));
  const latest=records.at(-1);
  const independent=new Set(records.filter(r=>r.independent).map(r=>r.challenge)).size;
  const days=latest?.independent?(independent>=2?7:2):0;
  const dueAt=latest?Date.parse(latest.date)+days*86400000:null;
  return {topic,days,dueAt,due:dueAt!==null&&dueAt<=now,practiced:!!latest};
 });
}
export function exportProgress(progress:Progress){
 return JSON.stringify({product:'BilimAI',notice:'Practice history only; not a mastery assessment. No names or answer text.',...progress},null,2);
}
