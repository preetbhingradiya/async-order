import {
  CreateUserDTO,
  UserResponse,
  LoginDto,
  LoginResponse,
} from "../dto/index.dto";

export interface IUserService {
  createUser(userDto: CreateUserDTO): Promise<UserResponse>;
  loginUser(userDto: LoginDto): Promise<LoginResponse>;
}
