"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = require("../controllers/post.controller");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = (0, express_1.default)();
router.post("/create", authMiddleware_1.default, post_controller_1.postControllers.create);
router.post("/reaction", authMiddleware_1.default, post_controller_1.postControllers.reactionSet);
router.get("/getOne", authMiddleware_1.default, post_controller_1.postControllers.getOne);
router.get("/getAll", authMiddleware_1.default, post_controller_1.postControllers.getAll);
exports.default = router;
