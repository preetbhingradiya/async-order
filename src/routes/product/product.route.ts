import express from "express";
import { OrderServiceImpl } from "../../repository/product/orderServiceImpl";
import { CreateOrderDTO } from "../../dto/user/createOrder.dto";
import { plainToInstance } from "class-transformer";
import { validationError } from "../../util/errorHandler";
import { OrderController } from "../../controller/product/order.controller";
import { AuthenticatedRequest, authenticationToken } from "../../middleware/auth.middleware";
import { relayOutbox } from "../../repository/product/relayOutbox";
export const orderRouter = express.Router();

const orderService = new OrderServiceImpl();
const controller = new OrderController(orderService);

orderRouter.use(authenticationToken)
orderRouter.post("/create-order", async (req:AuthenticatedRequest, res) => {
  const orderDto = plainToInstance(CreateOrderDTO, req.body);

  const error = await validationError(orderDto);

  if (error != null) {
    res.status(404).json(error);
    return;
  }

  const response = await controller.createOrder(req.user, orderDto);
  res.status(response.statusCode).json(response);
});

setInterval(relayOutbox, 5000);  // poll every 5 seconds