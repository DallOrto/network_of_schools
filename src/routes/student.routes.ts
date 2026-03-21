import { Router } from "express";
import { CreateStudentController } from "../controllers/student/CreateStudentController";
import { ListStudentController } from "../controllers/student/ListStudentController";
import { ListStudentInNetworkController } from "../controllers/student/ListStudentInNetworkController";
import { UpdateStudentController } from "../controllers/student/UpdateStudentController";
import { DeleteStudentController } from "../controllers/student/DeleteStudentController";
import { authorize } from "../middlewares/rbacMiddleware";
import { requireSelf, requireSameSchool } from "../middlewares/scopeMiddleware";

const createStudentController = new CreateStudentController();
const listStudentController = new ListStudentController();
const listStudentInNetworkController = new ListStudentInNetworkController();
const updateStudentController = new UpdateStudentController();
const deleteStudentController = new DeleteStudentController();

const studentRoutes = Router();

studentRoutes.post("/", authorize("super_admin", "network_admin", "school_admin"), requireSameSchool, createStudentController.handle);
studentRoutes.get("/list", authorize("super_admin", "network_admin", "school_admin", "teacher", "student"), listStudentController.handle);
studentRoutes.get("/listInNetwork", authorize("super_admin", "network_admin"), listStudentInNetworkController.handle);
studentRoutes.put("/:id", authorize("super_admin", "network_admin", "school_admin", "student"), requireSelf, updateStudentController.handle);
studentRoutes.delete("/:id", authorize("super_admin", "network_admin", "school_admin"), deleteStudentController.handle);

export { studentRoutes };
