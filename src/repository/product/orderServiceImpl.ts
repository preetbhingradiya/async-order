import prisma from "../../config/prisma";
import { TokenDTO } from "../../dto/index.dto";
import { CreateOrderDTO } from "../../dto/user/createOrder.dto";
import { Response } from "../../response/userResponse";
import { IOrderService } from "../../service/product/order.service";

export class OrderServiceImpl implements IOrderService {
  async createOrder(
    user: TokenDTO,
    createOrdetDto: CreateOrderDTO
  ): Promise<any | Response> {
    const { userId } = user;
    const { productName, quantity } = createOrdetDto;

    try {
      const order = await prisma.order.create({
        data: {
          userId,
          productName,
          quantity,
        },
      });

      await prisma.outboxMessage.create({
        data: {
          eventType: "ProductPending",
          payload: {
            orderId: order.id,
            userId,
            quantity,
          },
          processed: false,
          createdAt: new Date(),
        },
      });

      return new Response("Order Created sucessfully", 200, order);
    } catch (error) {
      return new Response(error.message, 500);
    }
  }
}
