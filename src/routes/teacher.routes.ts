import { Router } from "express";
import { CreateTeacherController } from "../controllers/teacher/CreateTeacherController";

const createTeacherController = new CreateTeacherController();

const teacherRoutes = Router();

teacherRoutes.post("/", createTeacherController.handle);

export { teacherRoutes };