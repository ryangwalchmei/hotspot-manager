CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'REFUNDED');
CREATE TYPE "SessionStatus" AS ENUM ('READY', 'ACTIVE', 'EXPIRED', 'REVOKED');
CREATE TABLE "Plan" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "priceCents" INTEGER NOT NULL,
  "durationSeconds" INTEGER NOT NULL,
  "downloadKbps" INTEGER,
  "uploadKbps" INTEGER,
  "enabled" BOOLEAN NOT NULL DEFAULT true
);
CREATE TABLE "PortalAttempt" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "clientMac" TEXT NOT NULL,
  "apMac" TEXT NOT NULL,
  "apIp" TEXT NOT NULL,
  "userHash" TEXT NOT NULL,
  "apTimestamp" TEXT NOT NULL,
  "redirectUri" TEXT NOT NULL,
  "continueUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "PortalAttempt_clientMac_createdAt_idx" ON "PortalAttempt"("clientMac","createdAt");
CREATE TABLE "Order" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "planId" TEXT NOT NULL REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "attemptId" TEXT NOT NULL REFERENCES "PortalAttempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "amountCents" INTEGER NOT NULL,
  "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "paymentId" TEXT UNIQUE,
  "pixCode" TEXT,
  "pixQrBase64" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "paidAt" TIMESTAMP(3)
);
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status","createdAt");
CREATE TABLE "AccessSession" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "orderId" TEXT NOT NULL UNIQUE REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "status" "SessionStatus" NOT NULL DEFAULT 'READY',
  "startsAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "WebhookEvent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
