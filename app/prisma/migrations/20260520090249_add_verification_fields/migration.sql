-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verificationAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "verificationCode" TEXT,
ADD COLUMN     "verificationExpiry" TIMESTAMP(3);
