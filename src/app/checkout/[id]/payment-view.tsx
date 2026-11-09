"use client";
import {useEffect,useState} from 'react';
type Status={status:string;pixCode?:string|null;pixQrBase64?:string|null;session?:{status:string}|null};
export function PaymentView({id}:{id:string}){
 const [data,setData]=useState<Status|null>(null);const [error,setError]=useState('');const [busy,setBusy]=useState(false);
 useEffect(()=>{let stopped=false;async function poll(){try{const r=await fetch(`/api/orders/${id}/status`,{cache:'no-store'});if(!r.ok)throw new Error('Pedido não encontrado');const payload=await r.json();if(!stopped)setData(payload);}catch{if(!stopped)setError('Não foi possível atualizar o pagamento.')}}poll();const t=setInterval(poll,4000);return()=>{stopped=true;clearInterval(t);};},[id]);
 async function authorize(){setBusy(true);setError('');try{const r=await fetch(`/api/orders/${id}/authorize`,{method:'POST'});const body=await r.json();if(!r.ok)throw new Error(body.error||'Falha na autorização');window.location.assign(body.redirect);}catch(e){setError(e instanceof Error?e.message:'Falha inesperada');setBusy(false);}}
 return <div>{data?.status==='PAID'?<><h2>Pagamento confirmado!</h2><button disabled={busy} onClick={authorize}>{busy?'Conectando…':'Conectar à internet'}</button><p className="muted">Acesse este botão no mesmo dispositivo conectado ao Wi-Fi.</p></>:<><p>Aguardando pagamento...</p>{data?.pixQrBase64&&<img className="qr" alt="QR Code Pix" src={`data:image/png;base64,${data.pixQrBase64}`}/>}<p>Pix Copia e Cola:</p><textarea style={{width:'100%',height:110}} readOnly value={data?.pixCode||''}/><p className="muted">A confirmação é consultada automaticamente.</p></>}{error&&<p className="error">{error}</p>}</div>;
}
