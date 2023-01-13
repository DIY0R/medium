import Router, { Express } from "express";
import { postControllers } from "../controllers/post.controller";

import authMiddleware from "../middlewares/authMiddleware";
const router: Express = Router();
router.post("/create", authMiddleware, postControllers.create);
router.post("/reaction", authMiddleware, postControllers.reactionSet);
router.get("/getOne", authMiddleware, postControllers.getOne);
router.get("/getAll", authMiddleware, postControllers.getAll);
export default router;
