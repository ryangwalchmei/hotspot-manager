import { NextRequest,NextResponse } from 'next/server';
import { z } from 'zod';import { db } from '@/lib/db';import { config } from '@/lib/config';import { requestPix } from '@/lib/mercadopago';
export const runtime='nodejs';
const schema=z.object({attemptId:z.string().min(10),planId:z.string().min(10),email:z.string().email().max(254)});
export async function POST(req:NextRequest){
 let orderId:string|undefined;
 try{
  const env=config(); const input=schema.parse(await req.json());
  const [attempt,plan]=await Promise.all([db.portalAttempt.findUnique({where:{id:input.attemptId}}),db.plan.findUnique({where:{id:input.planId}})]);
  if(!attempt||attempt.expiresAt<new Date()||!plan?.enabled) return NextResponse.json({error:'Sessão ou plano indisponível'},{status:400});
  if(plan.priceCents<=0) return NextResponse.json({error:'Plano inválido'},{status:400});
  const order=await db.order.create({data:{attemptId:attempt.id,planId:plan.id,amountCents:plan.priceCents}});orderId=order.id;
  const payment=await requestPix({accessToken:env.MP_ACCESS_TOKEN,orderId:order.id,amountCents:order.amountCents,payerEmail:input.email,notificationUrl:`${env.PUBLIC_BASE_URL}/api/webhooks/mercadopago`});
  if(!payment.id||!payment.point_of_interaction?.transaction_data?.qr_code) throw new Error('Pagamento Pix incompleto');
  await db.order.update({where:{id:order.id},data:{paymentId:String(payment.id),pixCode:payment.point_of_interaction.transaction_data.qr_code,pixQrBase64:payment.point_of_interaction.transaction_data.qr_code_base64}});
  return NextResponse.json({id:order.id},{status:201});
 }catch(e){console.error('Failed to create PIX order',orderId,e);return NextResponse.json({error:'Não foi possível gerar a cobrança'},{status:500});}
}
