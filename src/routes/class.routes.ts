import { Router } from "express";
import { CreateClassController } from "../controllers/class/CreateClassController";
import { CreateTeacherClassController } from "../controllers/teacherClass/CreateTeacherClassController";
import { CreateStudentClassController } from "../controllers/studentClass/CreateStudentClassController";
import { UpdateClassController } from "../controllers/class/UpdateClassController";
import { ListClassStudentController } from "../controllers/class/ListClassStudentController";
import { ListClassTeacherWithStudentController } from "../controllers/class/ListClassTeacherWithStudentController";

const createClassController = new CreateClassController();
const createTeacherClassController = new CreateTeacherClassController();
const createStudentClassController = new CreateStudentClassController();
const updateClassController = new UpdateClassController();
const listClassStudentController = new ListClassStudentController();
const listClassTeacherWithStudentController =
  new ListClassTeacherWithStudentController();

const classRoutes = Router();

classRoutes.post("/", createClassController.handle);
classRoutes.post("/teacher", createTeacherClassController.handle);
classRoutes.post("/student", createStudentClassController.handle);
classRoutes.put("/:id", updateClassController.handle);
classRoutes.get("/listStudents", listClassStudentController.handle);
classRoutes.get("/listTeachers", listClassTeacherWithStudentController.handle);

export { classRoutes };
