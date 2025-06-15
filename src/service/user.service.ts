import {
  CreateUserDTO,
  LoginDto,
  TokenDTO
} from "../dto/index.dto";
import { ErrorException, } from "../response/errorException";
import { GetUserResponse, LoginResponse, Response } from "../response/userResponse";

export interface IUserService {
  createUser(userDto: CreateUserDTO): Promise<Response | ErrorException>;
  loginUser(userDto: LoginDto): Promise<LoginResponse | ErrorException>;
  getUserProfile(user : TokenDTO) : Promise<GetUserResponse | ErrorException>;
  logoutUser(user : TokenDTO) : Promise<Response>;
}