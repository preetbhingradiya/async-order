import amqp from "amqplib";
import prisma from "../../config/prisma";

export async function relayOutbox() {
  const connection = await amqp.connect("amqps://ajhzoere:ot9fzLVrH99-Qn66gWmlFWIJdwap1X12@campbell.lmq.cloudamqp.com/ajhzoere");
  const channel = await connection.createChannel(); 
  await channel.assertQueue("order_events");

  const outboxItems = await prisma.outboxMessage.findMany({
    where: { processed: false },
    take: 10,
  });

  for (const item of outboxItems) {
    channel.sendToQueue(
      "order_events",
      Buffer.from(JSON.stringify(item.payload))
    );

    await prisma.outboxMessage.update({
      where: { id: item.id },
      data: { processed: true },
    });

    const orderId = (item.payload as any).orderId;
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "RELAYED" },
      });
    }
  }
  console.log(outboxItems);

  await channel.close();
  await connection.close();
}
