import { Router } from "express";
import { CreateStudentController } from "../controllers/student/CreateStudentController";
import { ListStudentController } from "../controllers/student/ListStudentController";
import { ListStudentInNetworkController } from "../controllers/student/ListStudentInNetworkController";



const createStudentController = new CreateStudentController();
const listStudentController = new ListStudentController();
const listStudentInNetworkController = new ListStudentInNetworkController();

const studentRoutes = Router();

studentRoutes.post("/", createStudentController.handle);
studentRoutes.get("/list", listStudentController.handle);
studentRoutes.get("/listInNetwork", listStudentInNetworkController.handle);


export { studentRoutes };