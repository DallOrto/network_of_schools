import { Router } from "express";
import { CreateClassController } from "../controllers/CreateClassController";
import { CreateTeacherClassController } from "../controllers/CreateTeacherClassController";



const createClassController = new CreateClassController();
const createTeacherClassController = new CreateTeacherClassController();


const classRoutes = Router();

classRoutes.post("/", createClassController.handle);
classRoutes.post("/teacher", createTeacherClassController.handle)

export { classRoutes };