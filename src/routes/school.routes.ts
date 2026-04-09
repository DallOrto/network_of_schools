import { Router } from "express";
import { CreateSchoolController } from "../controllers/school/CreateSchoolController";
import { ListSchoolController } from "../controllers/school/ListSchoolController";
import { UpdateSchoolController } from "../controllers/school/UpdateSchoolController";
import { authorize } from "../middlewares/rbacMiddleware";
import { injectScope } from "../middlewares/scopeMiddleware";

const createSchoolController = new CreateSchoolController();
const listSchoolController = new ListSchoolController();
const updateSchoolController = new UpdateSchoolController();

const schoolRoutes = Router();

schoolRoutes.post("/", authorize("super_admin", "network_admin"), injectScope, createSchoolController.handle);
schoolRoutes.get("/list", authorize("super_admin", "network_admin", "school_admin", "teacher", "student"), listSchoolController.handle);
schoolRoutes.put("/:id", authorize("super_admin", "network_admin"), updateSchoolController.handle);

export { schoolRoutes };
