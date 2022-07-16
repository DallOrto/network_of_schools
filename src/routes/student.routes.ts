import { Router } from "express";
import { CreateStudentController } from "../controllers/student/CreateStudentController";
import { ListStudentController } from "../controllers/student/ListStudentController";



const createStudentController = new CreateStudentController();
const listStudentController = new ListStudentController();

const studentRoutes = Router();

studentRoutes.post("/", createStudentController.handle);
studentRoutes.get("/list", listStudentController.handle);

export { studentRoutes };