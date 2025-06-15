import express from "express";
import { UserController } from "../controller/user/user.controller";
import { UserServiceImpl } from "../repository/UserServiceImpl";
import { plainToInstance } from "class-transformer";
import { validationError } from "../util/errorHandler";
import {CreateUserDTO, LoginDto} from "../dto/index.dto"
import { AuthenticatedRequest, authenticationToken } from "../middleware/auth.middleware";
export const userRouter = express.Router();

const userService = new UserServiceImpl();
const controller = new UserController(userService);

userRouter.post("/register", async (req, res) => {
  const userDto = plainToInstance(CreateUserDTO, req.body);

  const error = await validationError(userDto);

  if (error != null) {
    res.status(404).json(error);
    return;
  }

  const response = await controller.createUser(userDto);
  res.status(response.statusCode).json(response);
});

userRouter.post("/login", async (req, res) => {
  const loginDto = plainToInstance(LoginDto, req.body);

  const error = await validationError(loginDto);

  if (error != null) {
    res.status(404).json(error);
    return;
  }

  const response = await controller.login(loginDto);
  res.status(response.statusCode).json(response);
});

userRouter.use(authenticationToken);
userRouter.get("/profile", async (req:AuthenticatedRequest, res)=>{
  const response = await controller.getUserProfile(req.user);
  res.status(response.statusCode).json(response)
})

userRouter.post("/logout", async (req : AuthenticatedRequest, res)=>{
  const response = await controller.logoutUser(req.user);
  res.status(response.statusCode).json(response)
})