import {NextRequest,NextResponse} from 'next/server';import {db} from '@/lib/db';import {config} from '@/lib/config';import {fetchPayment,verifyWebhookSignature} from '@/lib/mercadopago';
export const runtime='nodejs';
export async function POST(req:NextRequest){
 try{
 const env=config();const body=await req.json();
 if(body.type!=='payment')return NextResponse.json({ok:true});
 const id=String(body?.data?.id??'');
 if(!verifyWebhookSignature({signature:req.headers.get('x-signature'),requestId:req.headers.get('x-request-id'),paymentId:req.nextUrl.searchParams.get('data.id')??id,secret:env.MP_WEBHOOK_SECRET}))return NextResponse.json({error:'Assinatura inválida'},{status:401});
 const payment=await fetchPayment(env.MP_ACCESS_TOKEN,id);
 const order=await db.order.findUnique({where:{paymentId:id}});
 if(!order||payment.external_reference!==order.id||Math.round(payment.transaction_amount*100)!==order.amountCents||payment.currency_id!=='BRL'||(env.MP_COLLECTOR_ID&&String(payment.collector_id)!==env.MP_COLLECTOR_ID))return NextResponse.json({error:'Pagamento incompatível'},{status:400});
 if(payment.status==='approved')await db.order.updateMany({where:{id:order.id,status:'PENDING'},data:{status:'PAID',paidAt:new Date()}});
 return NextResponse.json({ok:true});
 }catch(e){console.error('Payment webhook failed',e);return NextResponse.json({error:'Erro temporário'},{status:500});}
}
