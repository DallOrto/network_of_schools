import { Router } from "express";
import { CreateClassController } from "../controllers/class/CreateClassController";
import { CreateTeacherClassController } from "../controllers/teacherClass/CreateTeacherClassController";
import { CreateStudentClassController } from "../controllers/studentClass/CreateStudentClassController";
import { UpdateClassController } from "../controllers/class/UpdateClassController";



const createClassController = new CreateClassController();
const createTeacherClassController = new CreateTeacherClassController();
const createStudentClassController = new CreateStudentClassController();
const updateClassController = new UpdateClassController();


const classRoutes = Router();

classRoutes.post("/", createClassController.handle);
classRoutes.post("/teacher", createTeacherClassController.handle);
classRoutes.post("/student", createStudentClassController.handle);
classRoutes.put("/:id", updateClassController.handle);

export { classRoutes };