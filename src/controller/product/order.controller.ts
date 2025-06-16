import { TokenDTO } from "../../dto/index.dto";
import { CreateOrderDTO } from "../../dto/user/createOrder.dto";
import { IOrderService } from "../../service/product/order.service";

export class OrderController {
  private orderservice: IOrderService;

  constructor(orderservice: IOrderService) {
    this.orderservice = orderservice;
  }

  createOrder(user: TokenDTO, createOrdetDto: CreateOrderDTO) {
    return this.orderservice.createOrder(user, createOrdetDto);
  }
}
