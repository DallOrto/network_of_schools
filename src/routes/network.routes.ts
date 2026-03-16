import { Router } from "express";
import { CreateNetworkController } from "../controllers/network/CreateNetworkController";
import { UpdateNetworkController } from "../controllers/network/UpdateNetworkController";
import { ListNetworkController } from "../controllers/network/ListNetworkController";

const createNetworkController = new CreateNetworkController();
const updateNetworkController = new UpdateNetworkController();
const listNetworkController = new ListNetworkController();

const networkRoutes = Router();

networkRoutes.post("/", createNetworkController.handle);
networkRoutes.put("/:id", updateNetworkController.handle);
networkRoutes.get("/list", listNetworkController.handle);

export { networkRoutes };