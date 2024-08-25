/*
  Warnings:

  - You are about to drop the column `activeAccount` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "activeAccount",
ADD COLUMN     "isActiveAccount" BOOLEAN NOT NULL DEFAULT true;
