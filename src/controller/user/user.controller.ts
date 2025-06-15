import { CreateUserDTO, UserResponse, LoginDto, LoginResponse } from "../../dto/index.dto";
import { IUserService } from "../../service/user.service";

export class UserController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  createUser(userDto: CreateUserDTO) : Promise<UserResponse>{
    return this.userService.createUser(userDto);
  }

  login(loginDto : LoginDto) : Promise<LoginResponse>{
    return this.userService.loginUser(loginDto)
  }
}
