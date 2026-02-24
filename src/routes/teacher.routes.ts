import { Router } from "express";
import { CreateTeacherController } from "../controllers/teacher/CreateTeacherController";
import { ListTeacherController } from "../controllers/teacher/ListTeacherController";
import { UpdateTeacherController } from "../controllers/teacher/UpdateTeacherController";
import { DeleteTeacherController } from "../controllers/teacher/DeleteTeacherController";

const createTeacherController = new CreateTeacherController();
const listTeacherController = new ListTeacherController();
const updateTeacherController = new UpdateTeacherController();
const deleteTeacherController = new DeleteTeacherController();

const teacherRoutes = Router();

teacherRoutes.post("/", createTeacherController.handle);
teacherRoutes.get("/list", listTeacherController.handle);
teacherRoutes.put("/:id", updateTeacherController.handle);
teacherRoutes.delete("/:id", deleteTeacherController.handle);

export { teacherRoutes };