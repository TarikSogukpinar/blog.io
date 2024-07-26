-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "encrypted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "encryptionKey" TEXT;
