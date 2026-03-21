import { Request, Response, NextFunction } from "express";
import { AppError } from "../error/AppError";

type Role = "super_admin" | "network_admin" | "school_admin" | "teacher" | "student";

export function authorize(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(new AppError("Não autenticado", 401));
    }

    if (!allowedRoles.includes(user.role as Role)) {
      return next(new AppError("Acesso negado: permissão insuficiente", 403));
    }

    next();
  };
}
