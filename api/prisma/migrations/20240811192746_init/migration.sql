-- CreateTable
CREATE TABLE "BlacklistedToken" (
    "id" SERIAL NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlacklistedToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistedToken_tokenHash_key" ON "BlacklistedToken"("tokenHash");

-- CreateIndex
CREATE INDEX "BlacklistedToken_expiresAt_idx" ON "BlacklistedToken"("expiresAt");
