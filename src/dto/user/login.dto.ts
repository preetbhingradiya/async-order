import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({message : 'Email should not be empty'})
  email: string;

  @IsNotEmpty({ message: 'password should not be empty' })
  password: string;
}


export class LoginResponse{
  message : string;
  statusCode : number;
  accessToken ?: string;
  refreshToken ?: string

  constructor(message :string, statusCode : number, accessToken ?: string, refreshToken ?: string){
    this.message = message;
    this.statusCode = statusCode;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  
}