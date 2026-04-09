import { Router } from "express";
import { CreateStudentController } from "../controllers/student/CreateStudentController";
import { ListStudentController } from "../controllers/student/ListStudentController";
import { ListStudentInNetworkController } from "../controllers/student/ListStudentInNetworkController";
import { UpdateStudentController } from "../controllers/student/UpdateStudentController";
import { DeleteStudentController } from "../controllers/student/DeleteStudentController";
import { ListEnrollmentAttemptController } from "../controllers/enrollmentAttempt/ListEnrollmentAttemptController";
import { authorize } from "../middlewares/rbacMiddleware";
import { requireSelf, requireSameSchool, injectScope } from "../middlewares/scopeMiddleware";

const createStudentController = new CreateStudentController();
const listStudentController = new ListStudentController();
const listStudentInNetworkController = new ListStudentInNetworkController();
const updateStudentController = new UpdateStudentController();
const deleteStudentController = new DeleteStudentController();
const listEnrollmentAttemptController = new ListEnrollmentAttemptController();

const studentRoutes = Router();

studentRoutes.post("/", authorize("super_admin", "network_admin", "school_admin"), injectScope, requireSameSchool, createStudentController.handle);
studentRoutes.get("/list", authorize("super_admin", "network_admin", "school_admin", "teacher", "student"), listStudentController.handle);
studentRoutes.get("/listInNetwork", authorize("super_admin", "network_admin"), listStudentInNetworkController.handle);
studentRoutes.put("/:id", authorize("super_admin", "network_admin", "school_admin", "student"), requireSelf, updateStudentController.handle);
studentRoutes.delete("/:id", authorize("super_admin", "network_admin", "school_admin"), deleteStudentController.handle);
studentRoutes.get("/:document/enrollment-attempts", authorize("super_admin", "network_admin", "school_admin"), listEnrollmentAttemptController.handle);

export { studentRoutes };
