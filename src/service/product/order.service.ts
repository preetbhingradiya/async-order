import { TokenDTO } from "../../dto/index.dto";
import { CreateOrderDTO } from "../../dto/user/createOrder.dto";

export interface IOrderService{
    createOrder(user : TokenDTO,createOrdetDto : CreateOrderDTO) : Promise<any>;
}