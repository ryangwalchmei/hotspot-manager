# Especificação de produto — Hotspot Pago

## Objetivo
Vender acesso temporal à internet, sem senha Wi-Fi compartilhada, com pagamento Pix, válido somente no dispositivo que iniciou o portal.

## Regras
- Planos em centavos e segundos, persistidos no servidor; navegador não escolhe preço.
- Pedido começa PENDING, só vira PAID após consulta API do Mercado Pago com verificação de assinatura do webhook.
- Uma cobrança por pedido, identificador externo e chave de idempotência.
- Autorização apenas para pedidos PAID; tempo restante calculado no backend.
- Cada AP deve ter MAC, host e segredo cadastrados fora do código.
- QR Pix e consulta de status acessíveis sem internet graças ao Walled Garden.
- Proibido acesso à LAN administrativa pelos clientes.

## Critérios de aceite do MVP
- [ ] AP real redireciona contexto correto para portal HTTPS.
- [ ] AP autoriza com HMAC no firmware instalado.
- [ ] Cobrança Pix de sandbox retorna QR e confirmação autenticada.
- [ ] Cliente consegue autenticar no mesmo dispositivo.
- [ ] Acesso expira no prazo contratado, mesmo em reconexões.
- [ ] Erros e webhooks repetidos não criam acesso indevido.
- [ ] Backup restaurado com sucesso e credenciais fora do Git.

## Backlog para produção
- Autenticação forte e painel administrativo com RBAC.
- Rate limit e antiabuso na entrada do portal, criação de Pix e status.
- Fluxo de reconexão com direito ainda válido, tentativa fresca do AP.
- Workers de conciliação de pagamentos e sessões.
- Confirmação de sessão ativa via equipamento/RADIUS accounting.
- Integração de observabilidade, audit log, política de privacidade, LGPD e retenção.
- Teste de carga e isolamento de rede.
