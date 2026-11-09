"use client";
import { useState } from 'react';
type Plan={id:string;name:string;priceCents:number;durationSeconds:number};
export function CheckoutForm({attemptId,plans}:{attemptId:string;plans:Plan[]}){
 const [planId,setPlanId]=useState(plans[0]?.id??'');const [email,setEmail]=useState('');const [pending,setPending]=useState(false);const [error,setError]=useState('');
 async function checkout(e:React.FormEvent){e.preventDefault();setPending(true);setError('');try{
 const r=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({attemptId,planId,email})});const body=await r.json();if(!r.ok)throw new Error(body.error||'Erro ao criar pedido');window.location.assign(`/checkout/${body.id}`);
 }catch(e){setError(e instanceof Error?e.message:'Erro desconhecido');setPending(false);}}
 return <form onSubmit={checkout}>{plans.map(p=><label className="plan" key={p.id} style={{display:'block'}}><input type="radio" name="plan" style={{width:'auto'}} checked={planId===p.id} onChange={()=>setPlanId(p.id)}/> <b>{p.name}</b> — {(p.priceCents/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</label>)}<label>E-mail para identificação do pagamento<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="cliente@exemplo.com"/></label><button disabled={pending||!planId}>{pending?'Gerando Pix…':'Gerar Pix'}</button>{error&&<p className="error">{error}</p>}</form>;
}
