import { Router } from "express";
import { CreateStudentController } from "../controllers/CreateStudentController";



const createStudentController = new CreateStudentController();

const studentRoutes = Router();

studentRoutes.post("/", createStudentController.handle);

export { studentRoutes };