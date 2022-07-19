import { Router } from "express";
import { CreateNetworkController } from "../controllers/network/CreateNetworkController";



const createNetworkController = new CreateNetworkController();

const networkRoutes = Router();

networkRoutes.post("/", createNetworkController.handle);

export { networkRoutes };