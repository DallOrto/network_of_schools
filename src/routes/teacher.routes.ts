import { Router } from "express";
import { CreateTeacherController } from "../controllers/teacher/CreateTeacherController";
import { ListTeacherController } from "../controllers/teacher/ListTeacherController";
import { UpdateTeacherController } from "../controllers/teacher/UpdateTeacherController";
import { DeleteTeacherController } from "../controllers/teacher/DeleteTeacherController";
import { authorize } from "../middlewares/rbacMiddleware";
import { requireSelf, requireSameSchool, injectScope } from "../middlewares/scopeMiddleware";

const createTeacherController = new CreateTeacherController();
const listTeacherController = new ListTeacherController();
const updateTeacherController = new UpdateTeacherController();
const deleteTeacherController = new DeleteTeacherController();

const teacherRoutes = Router();

teacherRoutes.post("/", authorize("super_admin", "network_admin", "school_admin"), injectScope, requireSameSchool, createTeacherController.handle);
teacherRoutes.get("/list", authorize("super_admin", "network_admin", "school_admin", "teacher", "student"), listTeacherController.handle);
teacherRoutes.put("/:id", authorize("super_admin", "network_admin", "school_admin", "teacher"), requireSelf, updateTeacherController.handle);
teacherRoutes.delete("/:id", authorize("super_admin", "network_admin", "school_admin"), deleteTeacherController.handle);

export { teacherRoutes };
