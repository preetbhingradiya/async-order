/*
  Warnings:

  - You are about to drop the column `createdAt` on the `InboxMessage` table. All the data in the column will be lost.
  - You are about to drop the column `payload` on the `InboxMessage` table. All the data in the column will be lost.
  - You are about to drop the column `sent` on the `OutboxMessage` table. All the data in the column will be lost.
  - Added the required column `orderId` to the `InboxMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receivedAt` to the `InboxMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InboxMessage" DROP COLUMN "createdAt",
DROP COLUMN "payload",
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "processedAt" TIMESTAMP(3),
ADD COLUMN     "receivedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "OutboxMessage" DROP COLUMN "sent",
ADD COLUMN     "processed" BOOLEAN NOT NULL DEFAULT false;
