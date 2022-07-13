import { Router } from "express";
import { networkRoutes } from "./network.routes";
import { schoolRoutes } from "./school.routes";
import { teacherRoutes } from "./teacher.routes";
import { studentRoutes } from "./student.routes";

const routes = Router();

routes.use("/networks", networkRoutes);
routes.use("/schools", schoolRoutes);
routes.use("/teachers", teacherRoutes);
routes.use("/students", studentRoutes);

export { routes };
