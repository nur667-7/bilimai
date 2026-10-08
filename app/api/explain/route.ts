import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";
import { explain, inputSchema, quotaSQL, ProviderError } from "../../../lib/claude";
import { lessons } from "../../../lib/lessons";
export const dynamic="force-dynamic";
const reply=(status:number,data:unknown)=>Response.json(data,{status,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
export async function POST(request:Request) {
  // Trust identity headers only behind Sites dispatch. Do not expose the Worker directly.
  if(!env.APP_ORIGIN || request.headers.get("origin")!==env.APP_ORIGIN) return reply(403,{error:"origin"});
  const user=await getChatGPTUser(); if(!user) return reply(401,{error:"signin"});
  const allowed=(env.PILOT_ALLOWED_USER_IDS??"").split(",").map(s=>s.trim()).filter(Boolean);
  if(!allowed.includes(user.userId)) return reply(403,{error:"pilot"});
  if(request.headers.get("content-type")?.split(";")[0]!=="application/json") return reply(415,{error:"content_type"});
  if(Number(request.headers.get("content-length"))>4096) return reply(413,{error:"too_large"});
  let input;
  try { const reader=request.body?.getReader(); if(!reader) return reply(400,{error:"input"}); let bytes=0;const chunks:Uint8Array[]=[];while(true){const part=await reader.read();if(part.done)break;bytes+=part.value.length;if(bytes>4096){await reader.cancel();return reply(413,{error:"too_large"});}chunks.push(part.value);} const body=new Uint8Array(bytes);let offset=0;for(const chunk of chunks){body.set(chunk,offset);offset+=chunk.length;}input=inputSchema.parse(JSON.parse(new TextDecoder().decode(body))); }
  catch {return reply(400,{error:"input"});}
  if(!env.ANTHROPIC_API_KEY || !env.ANTHROPIC_MODEL || !env.DB || !env.QUOTA_HASH_SECRET) return reply(503,{error:"not_configured"});
  try {
    const hash=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(env.QUOTA_HASH_SECRET+":"+user.userId));
    const uid=Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,"0")).join("");
    const now=new Date();const day=now.toISOString().slice(0,10),minute=Math.floor(now.getTime()/60000);
    const result=await env.DB.prepare(quotaSQL).bind(crypto.randomUUID(),uid,day,minute,uid,day,uid,minute,day).run();
    if(!result.meta.changes) return reply(429,{error:"quota"});
    const lesson=lessons[input.language].find(l=>l.id===input.topic)!;
    const answer=await explain(input,`${lesson.title}. ${lesson.rule}. ${lesson.example}. ${lesson.steps.join(" ")}`,{key:env.ANTHROPIC_API_KEY,model:env.ANTHROPIC_MODEL});
    return reply(200,{...answer,source:"claude"});
  }catch(error){return reply(error instanceof ProviderError && error.code==="timeout"?504:502,{error:"temporarily_unavailable"});}
}
