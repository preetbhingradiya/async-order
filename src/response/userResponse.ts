export class Response {
  message: string;
  statusCode: number;
  data? : any

  constructor(message: string, statusCode: number, data ?: any) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data
  }
}

export class GetUserResponse {
  statusCode: number;
  message: string;
  data: any;

  constructor(statusCode: number, message: string, data: any) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export class LoginResponse{
  message : string;
  statusCode : number;
  accessToken : string;
  refreshToken : string

  constructor(message :string, statusCode : number, accessToken ?: string, refreshToken ?: string){
    this.message = message;
    this.statusCode = statusCode;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  } 
}