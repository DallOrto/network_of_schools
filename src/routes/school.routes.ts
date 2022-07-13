import { Router } from "express";
import { CreateSchoolController } from "../controllers/CreateSchoolController";



const createSchoolController = new CreateSchoolController();

const schoolRoutes = Router();

schoolRoutes.post("/", createSchoolController.handle);

export { schoolRoutes };