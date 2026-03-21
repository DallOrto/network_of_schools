import { Router } from "express";
import { CreateNetworkController } from "../controllers/network/CreateNetworkController";
import { UpdateNetworkController } from "../controllers/network/UpdateNetworkController";
import { ListNetworkController } from "../controllers/network/ListNetworkController";
import { authorize } from "../middlewares/rbacMiddleware";
import { requireSameNetwork } from "../middlewares/scopeMiddleware";

const createNetworkController = new CreateNetworkController();
const updateNetworkController = new UpdateNetworkController();
const listNetworkController = new ListNetworkController();

const networkRoutes = Router();

networkRoutes.post("/", authorize("super_admin"), createNetworkController.handle);
networkRoutes.get("/list", authorize("super_admin", "network_admin"), listNetworkController.handle);
networkRoutes.put("/:id", authorize("super_admin", "network_admin"), requireSameNetwork, updateNetworkController.handle);

export { networkRoutes };
