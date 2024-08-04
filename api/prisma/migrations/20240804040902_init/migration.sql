/*
  Warnings:

  - You are about to drop the column `accessTokens` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "accessTokens",
ADD COLUMN     "accessToken" TEXT;
