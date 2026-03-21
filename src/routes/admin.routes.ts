import { Router } from "express";
import { CreateAdminController } from "../controllers/admin/CreateAdminController";
import { authorize } from "../middlewares/rbacMiddleware";

const createAdminController = new CreateAdminController();

const adminRoutes = Router();

adminRoutes.post("/", authorize("super_admin", "network_admin"), createAdminController.handle);

export { adminRoutes };
