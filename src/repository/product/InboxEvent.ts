import amqp from "amqplib"
import prisma from "../../config/prisma";

async function consume (){
    const connection = await amqp.connect(
        "amqps://ajhzoere:ot9fzLVrH99-Qn66gWmlFWIJdwap1X12@campbell.lmq.cloudamqp.com/ajhzoere"
    );
    const channel = await connection.createChannel();
    await channel.assertQueue('order_events');

    await channel.consume('order_events', async(msg)=>{
        if(msg){
            const content = msg.content.toString();
            const payload = JSON.parse(content);
            const orderId = (payload as any).orderId;

            const existing = await prisma.inboxMessage.findFirst({where : {orderId}})

            if (existing) {
                console.log(`Duplicate message ${orderId} ignored`);
                channel.ack(msg);
                return;
            }


        }
    })
}