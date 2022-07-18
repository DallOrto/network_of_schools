import { Router } from "express";
import { CreateClassController } from "../controllers/CreateClassController";
import { CreateTeacherClassController } from "../controllers/CreateTeacherClassController";
import { CreateStudentClassController } from "../controllers/CreateStudentClassController";



const createClassController = new CreateClassController();
const createTeacherClassController = new CreateTeacherClassController();
const createStudentClassController = new CreateStudentClassController();


const classRoutes = Router();

classRoutes.post("/", createClassController.handle);
classRoutes.post("/teacher", createTeacherClassController.handle)
classRoutes.post("/student", createStudentClassController.handle)

export { classRoutes };