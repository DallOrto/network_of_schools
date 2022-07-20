import { Router } from "express";
import { CreateStudentController } from "../controllers/student/CreateStudentController";
import { ListStudentController } from "../controllers/student/ListStudentController";
import { ListStudentInNetworkController } from "../controllers/student/ListStudentInNetworkController";
import { UpdateStudentController } from "../controllers/student/UpdateStudentController";



const createStudentController = new CreateStudentController();
const listStudentController = new ListStudentController();
const listStudentInNetworkController = new ListStudentInNetworkController();
const updateStudentController = new UpdateStudentController();

const studentRoutes = Router();

studentRoutes.post("/", createStudentController.handle);
studentRoutes.get("/list", listStudentController.handle);
studentRoutes.get("/listInNetwork", listStudentInNetworkController.handle);
studentRoutes.put("/:id", updateStudentController.handle);


export { studentRoutes };