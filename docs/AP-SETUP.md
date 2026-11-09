# Procedimento de instalação Intelbras AP 1250 AC Outdoor

1. Inspecione firmware no painel Zeus OS e anote a versão. NÃO atualize às cegas.
2. Crie SSID de clientes aberto, isolado da LAN, em VLAN exclusiva caso o roteador suporte.
3. Habilite Captive Portal Externo para este SSID.
4. URL do portal: `https://SEU-DOMINIO/api/portal/entry`.
5. Configure senha/chave do Captive Externo, coincidente com `AP_SHARED_SECRET`.
6. Configure `AP_MAC` normalizado e `AP_ALLOWED_HOST` igual ao endereço de retorno documentado e validado na rede.
7. Walled Garden deve permitir host do portal e endpoints efetivamente necessários ao Pix; revise exceções DNS, scripts e conteúdo.
8. Configure QoS compatível com firmware e os limites contratados.
9. Verifique se o browser cautivo consegue voltar para `redirect_uri` local (ex.: `http://10.0.0.1:2061/cp/itbcaptive.cgi`).
10. Teste com 60 segundos de sessão, repetição, expiração, reconexão e reinício do AP.

**Atenção**: a especificação do Zeus OS tem variantes conforme firmware e tipo de autenticação. Ajuste parâmetros após captura real no laboratório. Nunca exponha a gestão do AP na WAN.
