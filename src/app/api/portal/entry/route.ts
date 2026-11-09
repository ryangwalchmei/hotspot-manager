import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { entrySchema,normalMac,validateRedirectUri } from '@/lib/captive';
import { config } from '@/lib/config';
export const runtime='nodejs';
export async function GET(request:NextRequest){
 try{
 const env=config();
 const input=entrySchema.parse(Object.fromEntries(request.nextUrl.searchParams));
 if(normalMac(input.ap_mac)!==env.AP_MAC.toLowerCase()) return NextResponse.json({error:'AP não cadastrado'}, {status:403});
 validateRedirectUri(input.redirect_uri,env.AP_ALLOWED_HOST);
 if(input.ip!==env.AP_ALLOWED_HOST) return NextResponse.json({error:'IP de AP inválido'},{status:403});
 // O contexto recebido é uma alegação do navegador: a autorização só ocorre após pagamento validado.
 const attempt=await db.portalAttempt.create({data:{clientMac:normalMac(input.mac),apMac:normalMac(input.ap_mac),apIp:input.ip,userHash:input.user_hash,apTimestamp:input.ts,redirectUri:input.redirect_uri,continueUrl:input.continue,expiresAt:new Date(Date.now()+15*60*1000)}});
 return NextResponse.redirect(new URL(`/portal?attempt=${encodeURIComponent(attempt.id)}`,env.PUBLIC_BASE_URL));
 }catch {return NextResponse.json({error:'Solicitação inválida ou configuração ausente'},{status:400});}
}
