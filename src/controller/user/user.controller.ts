import { CreateUserDTO, LoginDto, TokenDTO } from "../../dto/index.dto";
import { ErrorException } from "../../response/errorException";
import { GetUserResponse, LoginResponse, Response } from "../../response/userResponse";
import { IUserService } from "../../service/user.service";

export class UserController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  createUser(userDto: CreateUserDTO) : Promise<Response | ErrorException>{
    return this.userService.createUser(userDto);
  }

  login(loginDto : LoginDto) : Promise<LoginResponse | ErrorException>{
    return this.userService.loginUser(loginDto)
  }

  getUserProfile(user : TokenDTO) : Promise<GetUserResponse | ErrorException>{
    return this.userService.getUserProfile(user);
  }

  logoutUser(user : TokenDTO) : Promise<Response> {
    return this.userService.logoutUser(user);
  }
}
