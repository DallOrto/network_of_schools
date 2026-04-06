import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginRequest, LoginResponse } from "../../domain/dtos/auth/AuthDTO";
import { IAuthRepository } from "../../domain/interfaces/repositories/auth/IAuthRepository";
import { AppError } from "../../error/AppError";

class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  async execute({ document, password }: LoginRequest): Promise<LoginResponse> {
    const user = await this.authRepository.findByDocument(document);

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AppError("JWT secret not configured", 500);
    }

    const payload: Record<string, unknown> = {
      id: user.id,
      document: user.document,
      role: user.role,
    };

    if (user.schoolId) payload.schoolId = user.schoolId;
    if (user.networkId) payload.networkId = user.networkId;

    const token = jwt.sign(payload, secret, { expiresIn: "1d" });

    return { token };
  }
}

export { AuthService };
