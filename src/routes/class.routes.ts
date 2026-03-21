import { Router } from "express";
import { CreateClassController } from "../controllers/class/CreateClassController";
import { CreateTeacherClassController } from "../controllers/teacherClass/CreateTeacherClassController";
import { CreateStudentClassController } from "../controllers/studentClass/CreateStudentClassController";
import { UpdateClassController } from "../controllers/class/UpdateClassController";
import { DeleteClassController } from "../controllers/class/DeleteClassController";
import { ListClassStudentController } from "../controllers/class/ListClassStudentController";
import { ListClassTeacherWithStudentController } from "../controllers/class/ListClassTeacherWithStudentController";
import { authorize } from "../middlewares/rbacMiddleware";
import { requireSameSchool } from "../middlewares/scopeMiddleware";

const createClassController = new CreateClassController();
const createTeacherClassController = new CreateTeacherClassController();
const createStudentClassController = new CreateStudentClassController();
const updateClassController = new UpdateClassController();
const deleteClassController = new DeleteClassController();
const listClassStudentController = new ListClassStudentController();
const listClassTeacherWithStudentController = new ListClassTeacherWithStudentController();

const classRoutes = Router();

classRoutes.post("/", authorize("super_admin", "network_admin", "school_admin"), requireSameSchool, createClassController.handle);
// POST /teacher e /student usam classId no body (não schoolId), portanto a validação de escopo
// requer lookup no banco — deve ser feita no service layer.
classRoutes.post("/teacher", authorize("super_admin", "network_admin", "school_admin"), createTeacherClassController.handle);
classRoutes.post("/student", authorize("super_admin", "network_admin", "school_admin"), createStudentClassController.handle);
classRoutes.put("/:id", authorize("super_admin", "network_admin", "school_admin"), updateClassController.handle);
classRoutes.delete("/:id", authorize("super_admin", "network_admin", "school_admin"), deleteClassController.handle);
classRoutes.get("/listStudents", authorize("super_admin", "network_admin", "school_admin", "teacher", "student"), listClassStudentController.handle);
classRoutes.get("/listTeachers", authorize("super_admin", "network_admin", "school_admin", "teacher", "student"), listClassTeacherWithStudentController.handle);

export { classRoutes };
