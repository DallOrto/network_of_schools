import { Router } from "express";
import { CreateStudentController } from "../controllers/student/CreateStudentController";



const createStudentController = new CreateStudentController();

const studentRoutes = Router();

studentRoutes.post("/", createStudentController.handle);

export { studentRoutes };