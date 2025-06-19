// import amqp from "amqplib";
// import prisma from "../../config/prisma";

// export async function inBoxEvent() {
//   console.log("Calling....");

//   const connection = await amqp.connect(
//     "amqps://ajhzoere:ot9fzLVrH99-Qn66gWmlFWIJdwap1X12@campbell.lmq.cloudamqp.com/ajhzoere"
//   );
//   const channel = await connection.createChannel();
//   await channel.assertQueue("order_events");

//   await channel.consume("order_events", async (msg) => {
//     if (msg) {
//       const content = msg.content.toString();
//       const payload = JSON.parse(content);
//       const orderId = String(payload.orderId);
//       console.log(payload);
//       // Check if already processed
//       const existing = await prisma.inboxMessage.findFirst({
//         where: { orderId },
//       });

//       if (existing) {
//         console.log(`Duplicate message ${orderId} ignored`);
//         channel.ack(msg);
//         return;
//       }

//       if (orderId) {
//         await prisma.order.update({
//           where: { id: orderId },
//           data: { status: "PROCESSING" },
//         });

//         await prisma.inboxMessage.create({
//           data: {
//             orderId,
//             eventType: "Order_Created",
//             receivedAt: new Date(),
//           },
//         });

//         const outboxRecord = await prisma.outboxMessage.findFirst({
//           where: {
//             payload: {
//               path: ["orderId"],
//               equals: orderId,
//             },
//           },
//         });

//         if (outboxRecord) {
//           await prisma.outboxMessage.update({
//             where: { id: outboxRecord.id },
//             data: { processed: true },
//           });
//         }

//         const order = await prisma.order.findUnique({
//           where: { id: orderId },
//         });

//         if (!order) {
//           console.warn(
//             `⚠️ Order with ID ${orderId} not found. Skipping update.`
//           );
//           channel.ack(msg);
//           return;
//         }

//         await prisma.order.update({
//           where: { id: orderId },
//           data: { status: "PROCESSING" },
//         });

//         sendEmail(payload.userId, payload.productId);
//       }

//       channel.ack(msg);
//     }
//   });

//   console.log("InboxEvent is now consuming messages from 'order_events'");

//   //   await channel.close();
//   //   await connection.close();
// }

// function sendEmail(userId: string, productId: string) {
//   console.log(`📧 Email sent to user ${userId} for product ${productId}`);
// }


import amqp from "amqplib";
import prisma from "../../config/prisma";

export async function inBoxEvent() {
  console.log("Calling....");

  const connection = await amqp.connect(
    "amqps://ajhzoere:ot9fzLVrH99-Qn66gWmlFWIJdwap1X12@campbell.lmq.cloudamqp.com/ajhzoere"
  );
  const channel = await connection.createChannel();
  await channel.assertQueue("order_events");

  await channel.consume("order_events", async (msg) => {
    if (msg) {
      try {
        const content = msg.content.toString();
        const payload = JSON.parse(content);
        const orderId = String(payload.orderId);
        console.log("Received message payload:", payload);

        // ✅ Check if message already processed
        const existing = await prisma.inboxMessage.findUnique({
          where: { orderId },
        });

        if (existing) {
          console.log(`🟡 Duplicate message ${orderId} ignored`);
          channel.ack(msg);
          return;
        }

        // ✅ Check if order exists before updating
        const order = await prisma.order.findUnique({
          where: { id: orderId },
        });

        if (!order) {
          console.warn(`⚠️ Order with ID ${orderId} not found. Skipping.`);
          channel.ack(msg);
          return;
        }

        // ✅ Update order status
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "PROCESSING" },
        });

        // ✅ Create inbox message
        await prisma.inboxMessage.create({
          data: {
            orderId,
            eventType: "Order_Created",
            receivedAt: new Date(),
          },
        });

        // ✅ Find and mark related outbox message as processed
        const outboxRecord = await prisma.outboxMessage.findFirst({
          where: {
            payload: {
              path: ["orderId"],
              equals: orderId,
            },
          },
        });

        if (outboxRecord) {
          await prisma.outboxMessage.update({
            where: { id: outboxRecord.id },
            data: { processed: true },
          });
        }

        // ✅ Mark inbox message as processed
        await prisma.inboxMessage.update({
          where: { orderId },
          data: { processed: true, processedAt: new Date() },
        });

        // ✅ Simulate sending email
        sendEmail(payload.userId, payload.productId);

        channel.ack(msg);
      } catch (error) {
        console.error("❌ Error processing message:", error);
      }
    }
  });

  console.log("📥 InboxEvent is now consuming messages from 'order_events'");
}

function sendEmail(userId: string, productId: string) {
  console.log(`📧 Email sent to user ${userId} for product ${productId}`);
}
