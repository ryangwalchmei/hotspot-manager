import { createHmac, timingSafeEqual } from 'node:crypto';
export type MpPayment = { id:number; status:string; external_reference:string; transaction_amount:number; currency_id:string; collector_id?:number; point_of_interaction?:{ transaction_data?:{ qr_code?:string;qr_code_base64?:string } } };
export async function requestPix(args:{accessToken:string;amountCents:number;orderId:string;payerEmail:string;notificationUrl:string}){
 const response=await fetch('https://api.mercadopago.com/v1/payments',{
  method:'POST',headers:{Authorization:`Bearer ${args.accessToken}`,'Content-Type':'application/json','X-Idempotency-Key':args.orderId},
  body:JSON.stringify({transaction_amount:args.amountCents/100,description:'Acesso Wi-Fi',payment_method_id:'pix',payer:{email:args.payerEmail},external_reference:args.orderId,notification_url:args.notificationUrl}),cache:'no-store'
 });
 if(!response.ok) throw new Error(`Mercado Pago create payment returned ${response.status}`);
 return response.json() as Promise<MpPayment>;
}
export async function fetchPayment(accessToken:string,id:string):Promise<MpPayment>{
 if(!/^\d+$/.test(id)) throw new Error('Invalid payment ID');
 const response=await fetch(`https://api.mercadopago.com/v1/payments/${id}`,{headers:{Authorization:`Bearer ${accessToken}`},cache:'no-store'});
 if(!response.ok) throw new Error(`Mercado Pago fetch payment returned ${response.status}`);
 return response.json() as Promise<MpPayment>;
}
export function verifyWebhookSignature(input:{signature:string|null;requestId:string|null;paymentId:string|null;secret:string}){
 if(!input.signature||!input.requestId||!input.paymentId) return false;
 const fields=Object.fromEntries(input.signature.split(',').map(s=>s.trim().split('=',2)));
 const {ts,v1}=fields;
 if(!ts||!/^[0-9a-f]{64}$/i.test(v1||'')) return false;
 // Mercado Pago signs the exact ts string and lowercased resource ID.
 const payload=`id:${input.paymentId.toLowerCase()};request-id:${input.requestId};ts:${ts};`;
 const expected=createHmac('sha256',input.secret).update(payload).digest('hex');
 return timingSafeEqual(Buffer.from(v1,'hex'),Buffer.from(expected,'hex'));
}
