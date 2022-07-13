import { Router } from "express";
import { networkRoutes } from "./network.routes";
import { schoolRoutes } from "./school.routes";
import { teacherRoutes } from "./teacher.routes";

const routes = Router();

routes.use("/networks", networkRoutes);
routes.use("/schools", schoolRoutes);
routes.use("/teachers", teacherRoutes);

export { routes };