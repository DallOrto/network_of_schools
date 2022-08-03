import { Router } from "express";
import { CreateSchoolController } from "../controllers/school/CreateSchoolController";
import { ListSchoolController } from "../controllers/school/ListSchoolController";



const createSchoolController = new CreateSchoolController();
const listSchoolController = new ListSchoolController();

const schoolRoutes = Router();

schoolRoutes.post("/", createSchoolController.handle);
schoolRoutes.get("/list", listSchoolController.handle);

export { schoolRoutes };