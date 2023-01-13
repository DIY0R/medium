import Router, { Express } from "express";
import users from "./users";
import posts from "./posts";

const router: Express = Router();

router.use("/user", users);
router.use("/posts", posts);

export default router;
