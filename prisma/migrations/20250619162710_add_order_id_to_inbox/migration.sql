/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `InboxMessage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "InboxMessage_orderId_key" ON "InboxMessage"("orderId");
