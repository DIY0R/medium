"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userControllers = exports.UserControllers = void 0;
const user_model_1 = __importDefault(require("../db/models/user.model"));
const db_1 = require("../db/db");
const generateJwt_1 = require("../utils/generateJwt");
const bcrypt_1 = __importDefault(require("bcrypt"));
const ApiError_1 = __importDefault(require("../error/ApiError"));
class UserControllers {
    constructor(jwt) {
        this.jwt = jwt;
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const userModel = yield db_1.myDataSource.getRepository(user_model_1.default);
            if (!email || !password)
                return next(ApiError_1.default.forbidden("Некорректный email или password"));
            const user = yield userModel
                .createQueryBuilder("user")
                .where("user.email=:email", { email })
                .select("user.id")
                .addSelect("user.password")
                .addSelect("user.email")
                .groupBy("user.id")
                .getOne();
            if (!user)
                return next(ApiError_1.default.forbidden("Пользователь не найден"));
            let comparePassword = yield bcrypt_1.default.compare(password, user.password);
            if (!comparePassword) {
                return next(ApiError_1.default.forbidden("Указан неверный пароль"));
            }
            const token = this.jwt.genererate(user.id, user.email, process.env.SECRET_KEY);
            return res.json({ token });
        });
        this.registration = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.myDataSource.getRepository(user_model_1.default);
            const { email, password, name } = req.body;
            if (!email || !password || !name)
                return next(ApiError_1.default.forbidden("Некорректный email,password или name"));
            const candidate = yield user.findOne({ where: { email } });
            if (candidate)
                return next(ApiError_1.default.forbidden("Пользователь с таким email уже существует"));
            const hashPassword = yield bcrypt_1.default.hash(password, 5);
            const userCreate = new user_model_1.default();
            Object.assign(userCreate, { name, email, password: hashPassword });
            const userNew = yield user.save(userCreate);
            const token = this.jwt.genererate(userNew.id, userNew.email, process.env.SECRET_KEY);
            return res.json({ token });
        });
    }
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { limit, page } = req.query;
            if (isNaN(limit) || isNaN(page))
                return next(ApiError_1.default.badRequest("Не правильно задан параметры"));
            page = page || 1;
            limit = limit || 2;
            let offset = page * limit - limit;
            const user = yield db_1.myDataSource.getRepository(user_model_1.default);
            const allUsers = yield user
                .createQueryBuilder("user")
                .leftJoinAndSelect("user.posts", "posts")
                .leftJoin("posts.like", "like")
                .leftJoin("posts.dislike", "dislike")
                .loadRelationCountAndMap("user.like", "posts.like")
                .select("count(like.id)", "total_likes")
                .addSelect("count(dislike.id)", "dislike_likes")
                .addSelect("user.id", "id")
                .addSelect("user.name", "name")
                .addSelect("user.email", "email")
                .orderBy("user.id", "ASC")
                .skip(offset)
                .take(limit)
                .groupBy("user.id")
                .getRawMany();
            return res.json(allUsers);
        });
    }
}
exports.UserControllers = UserControllers;
exports.userControllers = new UserControllers(generateJwt_1.jwtCreate);
