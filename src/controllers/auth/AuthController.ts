import { Request, Response } from "express";
import { LoginRequest } from "../../domain/dtos/auth/AuthDTO";
import { AuthRepository } from "../../repositories/auth/AuthRepository";
import { AuthService } from "../../services/auth/AuthService";

class AuthController {
  async handle(request: Request, response: Response) {
    const { document, password, role }: LoginRequest = request.body;

    const authService = new AuthService(new AuthRepository());
    const result = await authService.execute({ document, password, role });

    return response.status(200).json(result);
  }
}

export { AuthController };
