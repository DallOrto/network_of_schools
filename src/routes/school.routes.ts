import { Router } from "express";
import { CreateSchoolController } from "../controllers/school/CreateSchoolController";
import { ListSchoolController } from "../controllers/school/ListSchoolController";
import { UpdateSchoolController } from "../controllers/school/UpdateSchoolController";



const createSchoolController = new CreateSchoolController();
const listSchoolController = new ListSchoolController();
const updateSchoolController = new UpdateSchoolController();

const schoolRoutes = Router();

schoolRoutes.post("/", createSchoolController.handle);
schoolRoutes.get("/list", listSchoolController.handle);
schoolRoutes.put("/:id", updateSchoolController.handle);

export { schoolRoutes };