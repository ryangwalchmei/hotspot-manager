import type { ReactNode } from 'react';
import './style.css';
export const metadata={title:'Conecta Wi-Fi',description:'Portal de acesso à internet'};
export default function Layout({children}:{children:ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}
