"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DislikePostModel = exports.LikePostModel = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const typeorm_1 = require("typeorm");
let PostModel = class PostModel {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PostModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 50,
        nullable: false,
    }),
    __metadata("design:type", String)
], PostModel.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false,
        type: "text",
    }),
    __metadata("design:type", String)
], PostModel.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 50,
        nullable: false,
    }),
    __metadata("design:type", String)
], PostModel.prototype, "time", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => LikePostModel, (likePost) => likePost.post, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], PostModel.prototype, "like", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => DislikePostModel, (dislikePost) => dislikePost.post, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], PostModel.prototype, "dislike", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_model_1.default, (user) => user.posts, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", user_model_1.default)
], PostModel.prototype, "user", void 0);
PostModel = __decorate([
    (0, typeorm_1.Entity)()
], PostModel);
exports.default = PostModel;
let LikePostModel = class LikePostModel {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LikePostModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PostModel, (postModel) => postModel.like, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", PostModel)
], LikePostModel.prototype, "post", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_model_1.default, (user) => user.likePost, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", user_model_1.default)
], LikePostModel.prototype, "user", void 0);
LikePostModel = __decorate([
    (0, typeorm_1.Entity)()
], LikePostModel);
exports.LikePostModel = LikePostModel;
let DislikePostModel = class DislikePostModel {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DislikePostModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PostModel, (postModel) => postModel.dislike, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", PostModel)
], DislikePostModel.prototype, "post", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_model_1.default, (user) => user.dislikePost, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", user_model_1.default)
], DislikePostModel.prototype, "user", void 0);
DislikePostModel = __decorate([
    (0, typeorm_1.Entity)()
], DislikePostModel);
exports.DislikePostModel = DislikePostModel;
