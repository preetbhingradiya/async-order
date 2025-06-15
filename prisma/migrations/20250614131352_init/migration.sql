/*
  Warnings:

  - The required column `jti` was added to the `Token` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "jti" TEXT NOT NULL;
