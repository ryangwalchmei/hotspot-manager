import { NextResponse } from 'next/server';
import {db} from '@/lib/db';import {config} from '@/lib/config';import {authorizationUrl,validateRedirectUri} from '@/lib/captive';
export const runtime='nodejs';
export async function POST(_:Request,{params}:{params:Promise<{id:string}>}){
 try{
 const {id}=await params;const env=config();
 const order=await db.order.findUnique({where:{id},include:{attempt:true,plan:true,session:true}});
 if(!order||order.status!=='PAID')return NextResponse.json({error:'Pagamento não confirmado'},{status:403});
 validateRedirectUri(order.attempt.redirectUri,env.AP_ALLOWED_HOST);
 // IMPORTANT: AP protocol is browser-redirect-based. Do not mark ACTIVE without AP accounting confirmation.
 // Absolute expiry is fixed at first attempted activation; no repeated full-duration grants.
 const current=order.session;
 if(current?.status==='REVOKED'||current?.status==='EXPIRED') return NextResponse.json({error:'Sessão encerrada'},{status:403});
 const start=current?.startsAt??new Date();
 const expiry=current?.expiresAt??new Date(start.getTime()+order.plan.durationSeconds*1000);
 const remaining=Math.floor((expiry.getTime()-Date.now())/1000);
 if(remaining<=0)return NextResponse.json({error:'Plano expirado'},{status:403});
 await db.accessSession.upsert({where:{orderId:id},create:{orderId:id,status:'READY',startsAt:start,expiresAt:expiry},update:{startsAt:start,expiresAt:expiry}});
 const redirect=authorizationUrl({uri:order.attempt.redirectUri,userHash:order.attempt.userHash,ts:order.attempt.apTimestamp,secret:env.AP_SHARED_SECRET,seconds:remaining,downloadKbps:order.plan.downloadKbps,uploadKbps:order.plan.uploadKbps,continueUrl:order.attempt.continueUrl});
 return NextResponse.json({redirect},{headers:{'Cache-Control':'no-store'}});
 }catch(e){console.error('AP authorization failed',e);return NextResponse.json({error:'Integração com AP indisponível'},{status:500});}
}
