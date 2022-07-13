import { Router } from "express";
import { CreateTeacherController } from "../controllers/CreateTeacherController";

const createTeacherController = new CreateTeacherController();

const teacherRoutes = Router();

teacherRoutes.post("/", createTeacherController.handle);

export { teacherRoutes };