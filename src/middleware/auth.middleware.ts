import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AccessToken } from "../constant";
import prisma from "../config/prisma";

export interface AuthenticatedRequest extends Request {
  user?: { userId: string, jti : string, iat : number, exp : number };
}

export const authenticationToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"]; // FIXED: use headers not header
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    res.status(401).json({ statusCode : 401, message: "Access Token is required" });
    return
  }

  try {
    const payload = jwt.verify(token, AccessToken) as { userId: string, jti : string, iat : number, exp :  number };
    let validUser = await prisma.token.findFirst({
        where : { userId : payload.userId, jti : payload.jti, isRevoked : false }
    })

    if(!validUser) {
        res.status(404).json({ statusCode : 404, message  : "You are not login or expire session, please login and Try again" })
        return;
    }

    req.user = payload;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
    return
  }
};