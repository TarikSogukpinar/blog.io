/*
  Warnings:

  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "provider",
ADD COLUMN     "image" TEXT;
