# Arquitetura (MVP)

## Componentes
- Next.js 15 (App Router): portal do cliente, API, checkout, polling do pedido.
- PostgreSQL/Prisma: planos, tentativas de portal, pedidos, pagamentos e sessões.
- Mercado Pago Payments API (Pix): pagamento, QR Code e webhook assinado.
- Intelbras Zeus OS: autenticação por redirecionamento do navegador e HMAC.

## Sequência
1. AP redireciona navegador a `/api/portal/entry` com contexto de autenticação.
2. Backend valida AP configurado e URL de retorno estritamente allowlisted, persiste PortalAttempt (TTL 15 minutos).
3. Cliente escolhe plano e informa e-mail, criando Order PENDING e Pix.
4. Mercado Pago envia POST webhook; backend verifica assinatura, consulta API Mercado Pago, confere ID, valor, moeda, vendedor (se configurado), marca Order PAID.
5. Página consulta status; cliente aciona autorização no mesmo dispositivo. Backend gera HMAC e retorna redirect_uri com tempo restante.
6. O AP autentica o cliente. A aplicação NÃO recebe confirmação do sucesso do AP no protocolo simples.

## Limitações importantes
- Não é possível afirmar que a sessão está ACTIVE: modelo permanece READY até implementar accounting/callback validado.
- startsAt no MVP é o primeiro pedido de autorização, NÃO a confirmação da associação de rede; o tempo de uso pode diminuir se o retorno falhar.
- Contexto da tentativa não é criptograficamente autenticado na entrada: não confiar no MAC como identidade e não permitir associação de sessão a usuário diferente; testar integração de autenticação real em laboratório antes de comercializar.
- O fluxo de autenticação exige browser no MESMO dispositivo conectado ao AP. O botão de autorização é deliberado; automatização da navegação deve ser feita após validação do AP.
- Payer e-mail é coletado apenas para gerar Pix; implementar política de privacidade e validações adicionais conforme operação.
- Sem admin, rate limiting, proteção antifraude e conciliação programada: NÃO expor produção comercial antes de concluir esses controles.

## Fontes
- https://backend.intelbras.com/sites/default/files/2022-07/Captive_specs_ptBR%20%281%29.pdf
- https://manuais.intelbras.com.br/manual-zeus-v4/
- https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
