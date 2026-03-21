import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginRequest, LoginResponse } from "../../domain/dtos/auth/AuthDTO";
import { AuthUser, IAuthRepository } from "../../domain/interfaces/repositories/auth/IAuthRepository";
import { AppError } from "../../error/AppError";

const ADMIN_ROLES = ["super_admin", "network_admin", "school_admin"] as const;

class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  async execute({ document, password, role }: LoginRequest): Promise<LoginResponse> {
    let user: AuthUser | null = null;

    if (role === "teacher") {
      user = await this.authRepository.findTeacherByDocument(document);
    } else if (role === "student") {
      user = await this.authRepository.findStudentByDocument(document);
    } else if ((ADMIN_ROLES as readonly string[]).includes(role)) {
      user = await this.authRepository.findAdminByDocument(document);
      if (user && user.role !== role) {
        user = null;
      }
    }

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
      role,
    };

    if (user.schoolId) payload.schoolId = user.schoolId;
    if (user.networkId) payload.networkId = user.networkId;

    const token = jwt.sign(payload, secret, { expiresIn: "1d" });

    return { token };
  }
}

export { AuthService };
