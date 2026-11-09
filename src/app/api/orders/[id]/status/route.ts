import {NextResponse} from 'next/server';import {db} from '@/lib/db';
export const dynamic='force-dynamic';
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;const o=await db.order.findUnique({where:{id},select:{id:true,status:true,pixCode:true,pixQrBase64:true,session:{select:{status:true}}}});
 if(!o)return NextResponse.json({error:'Pedido não encontrado'},{status:404});
 return NextResponse.json(o,{headers:{'Cache-Control':'no-store'}});
}
