import { Router } from "express";
import { CreateStudentController } from "../controllers/student/CreateStudentController";
import { ListStudentController } from "../controllers/student/ListStudentController";
import { ListStudentInNetworkController } from "../controllers/student/ListStudentInNetworkController";
import { UpdateStudentController } from "../controllers/student/UpdateStudentController";
import { DeleteStudentController } from "../controllers/student/DeleteStudentController";

const createStudentController = new CreateStudentController();
const listStudentController = new ListStudentController();
const listStudentInNetworkController = new ListStudentInNetworkController();
const updateStudentController = new UpdateStudentController();
const deleteStudentController = new DeleteStudentController();

const studentRoutes = Router();

studentRoutes.post("/", createStudentController.handle);
studentRoutes.get("/list", listStudentController.handle);
studentRoutes.get("/listInNetwork", listStudentInNetworkController.handle);
studentRoutes.put("/:id", updateStudentController.handle);
studentRoutes.delete("/:id", deleteStudentController.handle);

export { studentRoutes };