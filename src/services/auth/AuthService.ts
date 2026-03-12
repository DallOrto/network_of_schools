import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginRequest, LoginResponse } from "../../domain/dtos/auth/AuthDTO";
import { IAuthRepository } from "../../domain/interfaces/repositories/auth/IAuthRepository";
import { AppError } from "../../error/AppError";

class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  async execute({ document, password, role }: LoginRequest): Promise<LoginResponse> {
    const user =
      role === "teacher"
        ? await this.authRepository.findTeacherByDocument(document)
        : await this.authRepository.findStudentByDocument(document);

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

    const token = jwt.sign(
      { id: user.id, document: user.document, role },
      secret,
      { expiresIn: "1d" }
    );

    return { token };
  }
}

export { AuthService };
