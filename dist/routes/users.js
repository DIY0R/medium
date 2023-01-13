"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = (0, express_1.default)();
router.post("/registration", user_controller_1.userControllers.registration);
router.post("/login", user_controller_1.userControllers.login);
router.get("/all", authMiddleware_1.default, user_controller_1.userControllers.getUsers);
exports.default = router;
