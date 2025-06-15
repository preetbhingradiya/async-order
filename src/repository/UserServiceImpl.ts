import prisma from "../config/prisma";
import {
  CreateUserDTO,
  LoginDto,
  LoginResponse,
  UserResponse,
} from "../dto/index.dto";
import bcrypt from "bcrypt";
import { IUserService } from "../service/user.service";
import { generateAccessToken, generateRefreshToken } from "../util/jwtToken";
import { v4 as uuidv4 } from "uuid";

export class UserServiceImpl implements IUserService {
  async createUser(userDto: CreateUserDTO): Promise<UserResponse> {
    let { name, email, password } = userDto;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return new UserResponse("User already exists", 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return new UserResponse("User created successfully", 200);
  }

  async loginUser(logiDto: LoginDto): Promise<LoginResponse> {
    try {
      let { email, password } = logiDto;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (!existingUser) return new LoginResponse("User Not found", 404);

      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isPasswordValid)
        return new LoginResponse(
          "Login credentials are incorrect. Please check email or password.",
          401
        );

      const jti = uuidv4();

      const payload = { userId: existingUser.id, jti };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      await prisma.token.create({
        data: {
            userId : existingUser.id,
            jti,
        },
      });

      return new LoginResponse(
        "Login sucessfully",
        200,
        accessToken,
        refreshToken
      );
    } catch (error) {
      throw new LoginResponse(error.message, 500);
    }
  }
}
