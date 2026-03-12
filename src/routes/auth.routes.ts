import { Router } from "express";
import { AuthController } from "../controllers/auth/AuthController";

const authController = new AuthController();

const authRoutes = Router();

authRoutes.post("/login", authController.handle);

export { authRoutes };
