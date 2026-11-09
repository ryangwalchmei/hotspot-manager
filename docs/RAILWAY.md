# Railway: implantação

1. Crie projeto Railway e serviço PostgreSQL pelo template oficial.
2. Crie serviço `web` conectado ao repositório privado GitHub, branch main.
3. `DATABASE_URL` referenciando a variável interna PostgreSQL do Railway, sem TCP público.
4. Defina `PUBLIC_BASE_URL=https://<dominio-publico>` e variáveis AP_* e MP_* em segredo.
5. Configure PORT=3000 se necessário, domínio público com TLS e health check `/api/health`.
6. O Dockerfile roda `prisma migrate deploy` no início. Para produção, prefira pre-deploy migrations com controle de concorrência.
7. Configure URL de webhook `https://<dominio>/api/webhooks/mercadopago` no Mercado Pago.
8. Publique `portal.seudominio` com CNAME apontando ao domínio Railway e valide TLS antes de modificar o AP.
9. Restrinja bancos de dados e políticas de backup; não abra PostgreSQL publicamente.

Não registrar em logs segredos, qr code Pix ou dados completos de dispositivos.
