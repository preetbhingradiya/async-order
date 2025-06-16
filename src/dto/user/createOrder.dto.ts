import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateOrderDTO {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsInt()
  @Min(1)
  quantity: number;

  constructor(productName: string, quantity: number) {
    this.productName = productName;
    this.quantity = quantity;
  }
}
