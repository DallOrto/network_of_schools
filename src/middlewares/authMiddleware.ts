import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../error/AppError";

interface TokenPayload {
  id: string;
  document: string;
  role: "super_admin" | "network_admin" | "school_admin" | "teacher" | "student";
  networkId?: string;
  schoolId?: string;
}

export function authMiddleware(request: Request, response: Response, next: NextFunction): void {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Token not provided", 401));
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return next(new AppError("JWT secret not configured", 500));
  }

  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;
    request.user = {
      id: decoded.id,
      document: decoded.document,
      role: decoded.role,
      networkId: decoded.networkId,
      schoolId: decoded.schoolId,
    };
    next();
  } catch {
    next(new AppError("Invalid token", 401));
  }
}
