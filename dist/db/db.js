"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myDataSource = exports.DBCONNECTINFO = void 0;
const typeorm_1 = require("typeorm");
const post_model_1 = __importStar(require("./models/post.model"));
const user_model_1 = __importDefault(require("./models/user.model"));
const sslparam_1 = require("./sslparam");
exports.DBCONNECTINFO = Object.assign({ type: "postgres", host: process.env.DB_HOST || "", port: process.env.DB_PORT || "", username: process.env.DB_USER || "", password: process.env.DB_PASSWORD || "", database: process.env.DB_NAME || "", synchronize: true, logging: true, entities: [post_model_1.default, user_model_1.default, post_model_1.LikePostModel, post_model_1.DislikePostModel], subscribers: [] }, (0, sslparam_1.sslparam)());
exports.myDataSource = new typeorm_1.DataSource(exports.DBCONNECTINFO);
