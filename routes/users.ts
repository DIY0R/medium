import Router, { Express } from "express";
import { userControllers } from "../controllers/user.controller";
import authMiddleware from "../middlewares/authMiddleware";
const router: Express = Router();
router.post("/registration", userControllers.registration);
router.post("/login", userControllers.login);
router.get("/all", authMiddleware, userControllers.getUsers);
export default router;
