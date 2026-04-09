import { Request, Response, NextFunction } from "express";
import { AppError } from "../error/AppError";

/**
 * Injeta automaticamente schoolId e/ou networkId no body a partir do JWT.
 * - school_admin: injeta schoolId
 * - network_admin: injeta networkId
 * - super_admin: não injeta nada (deve informar no body)
 */
export function injectScope(req: Request, _res: Response, next: NextFunction): void {
  const user = req.user!;

  if (user.role === "school_admin" && user.schoolId) {
    req.body.schoolId = user.schoolId;
  }

  if (user.role === "network_admin" && user.networkId) {
    req.body.networkId = user.networkId;
  }

  next();
}

/**
 * Garante que teacher e student só modificam seus próprios dados.
 * Admins (super_admin, network_admin, school_admin) passam livremente.
 */
export function requireSelf(req: Request, _res: Response, next: NextFunction): void {
  const user = req.user!;
  const targetId = req.params.id;

  const isAdmin = ["super_admin", "network_admin", "school_admin"].includes(user.role);

  if (!isAdmin && targetId !== user.id) {
    return next(new AppError("Acesso negado: você só pode modificar seus próprios dados", 403));
  }

  next();
}

/**
 * Garante que school_admin só cria recursos na própria escola.
 * Verifica req.body.schoolId contra req.user.schoolId.
 * super_admin e network_admin passam livremente.
 */
export function requireSameSchool(req: Request, _res: Response, next: NextFunction): void {
  const user = req.user!;

  if (user.role === "super_admin" || user.role === "network_admin") {
    return next();
  }

  const targetSchoolId = req.body.schoolId as string | undefined;

  if (targetSchoolId && targetSchoolId !== user.schoolId) {
    return next(new AppError("Acesso negado: recurso pertence a outra escola", 403));
  }

  next();
}

/**
 * Garante que network_admin só edita a própria rede.
 * Verifica req.params.id contra req.user.networkId.
 * super_admin passa livremente.
 */
export function requireSameNetwork(req: Request, _res: Response, next: NextFunction): void {
  const user = req.user!;

  if (user.role === "super_admin") {
    return next();
  }

  if (req.params.id !== user.networkId) {
    return next(new AppError("Acesso negado: você não administra esta rede", 403));
  }

  next();
}
