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
exports.postControllers = void 0;
const db_1 = require("../db/db");
const post_model_1 = __importDefault(require("../db/models/post.model"));
const user_model_1 = __importDefault(require("../db/models/user.model"));
const ApiError_1 = __importDefault(require("../error/ApiError"));
class PostControllers {
    constructor() {
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { title, text } = req.body;
            if (!title || !text)
                return next(ApiError_1.default.badRequest("Не коректный данный поста"));
            let time = "";
            const words = text.trim().split(/\s+/).length;
            const wpm = 210;
            if (words < wpm)
                time = "<1";
            time = Math.ceil(words / wpm).toString();
            const postModel = yield db_1.myDataSource.getRepository(post_model_1.default);
            const userСurrent = yield db_1.myDataSource
                .getRepository(user_model_1.default)
                .findOne({ where: { id: req.user.id } });
            if (!userСurrent)
                return next(ApiError_1.default.badRequest("Не найден пользователь"));
            yield postModel.query(`INSERT INTO post_model (title, text, "userId",time)
    VALUES ('${title}','${text}', ${req.user.id},'${time}');`);
            res.json({ id: req.user.id });
        });
    }
    reactionSet(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { like, postId } = req.body;
                const likeAndDis = (modelName, sortModelName) => __awaiter(this, void 0, void 0, function* () {
                    yield db_1.myDataSource.query(`delete from ${sortModelName} where "userId" = ${req.user.id} and "postId" = ${postId}; `);
                    const likemodel = yield db_1.myDataSource.query(`select "userId" from ${modelName} where "userId" = ${req.user.id} and "postId" = ${postId}`);
                    if (likemodel.length)
                        return { like: "вы уже оставили реакцию" };
                    yield db_1.myDataSource.query(`INSERT INTO ${modelName} ("postId", "userId")
           VALUES (${postId}, ${req.user.id});`);
                    return { like: true };
                });
                if (like) {
                    const resultLike = yield likeAndDis("like_post_model", "dislike_post_model");
                    return res.json(resultLike);
                }
                const resultLike = yield likeAndDis("dislike_post_model", "like_post_model");
                return res.json(resultLike);
            }
            catch (_a) {
                return next(ApiError_1.default.internal("Error возможно не существующий пост"));
            }
        });
    }
    getOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id } = req.query;
            if (!id)
                return next(ApiError_1.default.clientError("вы не ввели id"));
            const postMode = yield db_1.myDataSource
                .getRepository(post_model_1.default)
                .createQueryBuilder("post")
                .where("post.id = :id", { id })
                .loadRelationCountAndMap("post.like", "post.like")
                .loadRelationCountAndMap("post.dislike", "post.dislike")
                .getOne();
            return res.json(postMode);
        });
    }
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { limit, page } = req.query;
            console.log(limit, page);
            if (isNaN(limit) || isNaN(page))
                return next(ApiError_1.default.clientError("Не правильно задан параметры"));
            page = page || 1;
            limit = limit || 2;
            let offset = page * limit - limit;
            const postMode = yield db_1.myDataSource
                .getRepository(post_model_1.default)
                .createQueryBuilder("post")
                .innerJoinAndSelect("post.user", "user")
                .loadRelationCountAndMap("post.like", "post.like")
                .loadRelationCountAndMap("post.dislike", "post.dislike")
                .orderBy("post.id", "ASC")
                .skip(offset)
                .take(limit)
                .getMany();
            return res.json(postMode);
        });
    }
}
exports.postControllers = new PostControllers();
