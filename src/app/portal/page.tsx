import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { CheckoutForm } from './checkout-form';
export const dynamic='force-dynamic';
export default async function Portal({searchParams}:{searchParams:Promise<{attempt?:string}>}){
 const {attempt:id}=await searchParams;
 const attempt=id?await db.portalAttempt.findUnique({where:{id}}):null;
 if(!attempt||attempt.expiresAt<new Date()) notFound();
 const plans=await db.plan.findMany({where:{enabled:true},orderBy:{priceCents:'asc'}});
 return <main><h1>Internet liberada com Pix</h1><p>Selecione o tempo de acesso desejado.</p><CheckoutForm attemptId={attempt.id} plans={plans.map(p=>({id:p.id,name:p.name,priceCents:p.priceCents,durationSeconds:p.durationSeconds}))}/></main>;
}
