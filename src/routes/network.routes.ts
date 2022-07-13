import { Router } from "express";
import { CreateNetworkController } from "../controllers/CreateNetworkController";



const createNetworkController = new CreateNetworkController();

const networkRoutes = Router();

networkRoutes.post("/", createNetworkController.handle);

export { networkRoutes };