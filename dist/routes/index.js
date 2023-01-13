"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./users"));
const posts_1 = __importDefault(require("./posts"));
const router = (0, express_1.default)();
router.use("/user", users_1.default);
router.use("/posts", posts_1.default);
exports.default = router;
