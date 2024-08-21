/*
  Warnings:

  - You are about to drop the column `authorId` on the `Post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorUuid` to the `Post` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `Post` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropIndex
DROP INDEX "Post_authorId_idx";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "authorId",
ADD COLUMN     "authorUuid" TEXT NOT NULL,
ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Post_uuid_key" ON "Post"("uuid");

-- CreateIndex
CREATE INDEX "Post_authorUuid_idx" ON "Post"("authorUuid");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorUuid_fkey" FOREIGN KEY ("authorUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
