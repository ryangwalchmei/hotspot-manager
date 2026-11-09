# Hotspot Manager — Intelbras Zeus OS + Pix

Base de implementação para venda de internet pelo Captive Portal Externo do Intelbras AP 1250 AC Outdoor.

**Status: protótipo funcional de integrações; NÃO pronto para produção ou cobrança real.** Não há teste com AP físico, segredos do Mercado Pago, CI executada ou deploy validado.

## Início local

```bash
cp .env.example .env
# editar .env com segredos exclusivamente locais
docker compose up -d postgres
npm install
npx prisma migrate deploy
npm run dev
```

O sistema precisa de pelo menos um `Plan` no PostgreSQL (use Prisma Studio ou SQL) antes de testar o portal. Para um cadastro inicial:

```bash
npx prisma studio
```

Exemplo: name `1 hora`, priceCents `200`, durationSeconds `3600`, enabled `true`.

## Testes

```bash
npm test
npm run lint
npx tsc --noEmit
```

## Documentação
- [Arquitetura e riscos](docs/ARCHITECTURE.md)
- [Especificação funcional e critérios de aceite](docs/SPECS.md)
- [Configuração do AP](docs/AP-SETUP.md)
- [Deploy no Railway](docs/RAILWAY.md)

## Segurança
Não commit de credenciais. A autorização do AP necessita validação com o firmware instalado. O webhook nunca autoriza com base apenas no corpo da notificação. Veja limitações de segurança e recursos pendentes antes de operar comercialmente.
