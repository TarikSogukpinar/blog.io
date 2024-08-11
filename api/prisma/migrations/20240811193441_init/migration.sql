/*
  Warnings:

  - You are about to drop the column `tokenHash` on the `BlacklistedToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `BlacklistedToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `BlacklistedToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "BlacklistedToken_tokenHash_key";

-- AlterTable
ALTER TABLE "BlacklistedToken" DROP COLUMN "tokenHash",
ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistedToken_token_key" ON "BlacklistedToken"("token");
