import { Router } from "express";
import { CreateNetworkController } from "../controllers/network/CreateNetworkController";
import { UpdateNetworkController } from "../controllers/network/UpdateNetworkController";

const createNetworkController = new CreateNetworkController();
const updateNetworkController = new UpdateNetworkController();

const networkRoutes = Router();

networkRoutes.post("/", createNetworkController.handle);
networkRoutes.put("/:id", updateNetworkController.handle);

export { networkRoutes };