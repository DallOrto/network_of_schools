import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authRoutes } from "./auth.routes";
import { networkRoutes } from "./network.routes";
import { schoolRoutes } from "./school.routes";
import { teacherRoutes } from "./teacher.routes";
import { studentRoutes } from "./student.routes";
import { classRoutes } from "./class.routes";

const routes = Router();

routes.use("/auth", authRoutes);

routes.use(authMiddleware);

routes.use("/networks", networkRoutes);
routes.use("/schools", schoolRoutes);
routes.use("/teachers", teacherRoutes);
routes.use("/students", studentRoutes);
routes.use("/classes", classRoutes);

export { routes };
