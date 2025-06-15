import jwt, { SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import { AccessToken, AccessTokenExpire, RefreshToken, RefreshTokenExpire } from "../constant";
import { ErrorException } from "../response/errorException";

export function generateAccessToken(payload: object): string {
  const secret = AccessToken;
  const expiresIn = (AccessTokenExpire) as StringValue;

  if (!secret) throw new ErrorException(404, "Missing JWT_ACCESS_SECRET");

  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign(payload, secret, options);
}

export function generateRefreshToken(payload: object): string {
  const secret = RefreshToken;
  const expiresIn = (RefreshTokenExpire) as StringValue;

  if (!secret) throw new ErrorException(404,"Missing JWT_REFRESH_SECRET");

  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign(payload, secret, options);
}
