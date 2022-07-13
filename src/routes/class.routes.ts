import { Router } from "express";
import { CreateClassController } from "../controllers/CreateClassController";



const createClassController = new CreateClassController();

const classRoutes = Router();

classRoutes.post("/", createClassController.handle);

export { classRoutes };