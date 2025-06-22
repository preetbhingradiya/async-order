import prisma from "../config/prisma";
import { CreateUserDTO, LoginDto, TokenDTO } from "../dto/index.dto";
import bcrypt from "bcrypt";
import { IUserService } from "../service/user.service";
import { generateAccessToken, generateRefreshToken } from "../util/jwtToken";
import { v4 as uuidv4 } from "uuid";
import { ErrorException } from "../response/errorException";
import {
  GetUserResponse,
  LoginResponse,
  Response,
} from "../response/userResponse";
import { CustomBloomFilter } from "../utils/CustomBloomFilter";
const bloom = new CustomBloomFilter(1000, 3);

export class UserServiceImpl implements IUserService {
  async createUser(userDto: CreateUserDTO): Promise<Response | ErrorException> {
    let { name, email, password } = userDto;

    if (!bloom.mightContain(email)) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) return new ErrorException(400, "User already exists");
    } else {
      return new ErrorException(400, "User already exists filter by Bloom");
    }
    bloom.add(email);

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return new Response("User created successfully", 200);
  }

  async loginUser(logiDto: LoginDto): Promise<LoginResponse | ErrorException> {
    try {
      let { email, password } = logiDto;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (!existingUser) return new ErrorException(404, "User not found");

      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isPasswordValid)
        return new ErrorException(
          401,
          "Login credentials are incorrect. Please check email or password."
        );

      const jti = uuidv4();

      const payload = { userId: existingUser.id, jti: jti };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      await prisma.token.create({
        data: {
          userId: existingUser.id,
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
      throw new ErrorException(500, error.message);
    }
  }

  async getUserProfile(
    user: TokenDTO
  ): Promise<GetUserResponse | ErrorException> {
    try {
      let { userId } = user;

      let userData = await prisma.user.findUnique({ where: { id: userId } });

      if (!userData) return new ErrorException(404, "User not found");

      return new GetUserResponse(200, "Fetch user data", userData);
    } catch (error) {
      throw new ErrorException(500, error.message);
    }
  }

  async logoutUser(token: any): Promise<Response> {
    try {
      await prisma.token.updateMany({
        where: {
          id: token.id,
        },
        data: {
          isRevoked: true,
        },
      });

      return new Response("User logout sucessfully", 200);
    } catch (error) {
      throw new ErrorException(500, error.message);
    }
  }
}
