import { Router } from "express";
import { CreateTeacherController } from "../controllers/teacher/CreateTeacherController";
import { ListTeacherController } from "../controllers/teacher/ListTeacherController";

const createTeacherController = new CreateTeacherController();
const listTeacherController = new ListTeacherController();

const teacherRoutes = Router();

teacherRoutes.post("/", createTeacherController.handle);
teacherRoutes.get("/list", listTeacherController.handle);

export { teacherRoutes };