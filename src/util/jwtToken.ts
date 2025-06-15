import jwt, { SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import { LoginResponse } from "../dto/index.dto";

export function generateAccessToken(payload: object): string {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const expiresIn = (process.env.ACCESS_TOKEN_EXPIRE || "1d") as StringValue;

  if (!secret) throw new LoginResponse("Missing JWT_ACCESS_SECRET", 404);

  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign(payload, secret, options);
}

export function generateRefreshToken(payload: object): string {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  const expiresIn = (process.env.REFRESH_TOKEN_EXPIRE || "7d") as StringValue;

  if (!secret) throw new LoginResponse("Missing JWT_REFRESH_SECRET", 404);

  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign(payload, secret, options);
}
