import { PaymentView } from './payment-view';
export default async function Checkout({params}:{params:Promise<{id:string}>}){const {id}=await params;return <main><h1>Pagamento Pix</h1><p>Após a confirmação, este dispositivo poderá concluir a autenticação no AP.</p><PaymentView id={id}/></main>}
