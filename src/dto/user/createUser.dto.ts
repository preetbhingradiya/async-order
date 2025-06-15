import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;

  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string;
}


export class UserResponse{
  message : string;
  statusCode : number;

  constructor(message :string, statusCode : number){
    this.message = message;
    this.statusCode = statusCode;
  }
}