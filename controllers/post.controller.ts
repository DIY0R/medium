import { NextFunction } from "express";
import { myDataSource } from "../db/db";
import PostModel, {
  DislikePostModel,
  LikePostModel,
} from "../db/models/post.model";
import UserModel from "../db/models/user.model";
import ApiError from "../error/ApiError";
import {
  IAuthRequest,
  TypedRequestQuery,
  TypedResponse,
} from "../types/ReqRes";

interface Post {
  title: string;
  text: string;
}
interface dpLikeModel extends LikePostModel {
  userId: number;
}
class PostControllers {
  create = async (
    req: IAuthRequest,
    res: TypedResponse<object>,
    next: NextFunction
  ) => {
    const { title, text } = req.body as Post;
    if (!title || !text)
      return next(ApiError.badRequest("Не коректный данный поста"));

    let time = "";
    const words = text.trim().split(/\s+/).length;
    const wpm = 210;
    if (words < wpm) time = "<1";
    time = Math.ceil(words / wpm).toString();

    const postModel = await myDataSource.getRepository(PostModel);
    const userСurrent = await myDataSource
      .getRepository(UserModel)
      .findOne({ where: { id: req.user.id } });
    if (!userСurrent)
      return next(ApiError.badRequest("Не найден пользователь"));

    await postModel.query(`INSERT INTO post_model (title, text, "userId",time)
    VALUES ('${title}','${text}', ${req.user.id},'${time}');`);

    res.json({ id: req.user.id });
  };

  async reactionSet(
    req: IAuthRequest,
    res: TypedResponse<object>,
    next: NextFunction
  ) {
    try {
      const { like, postId } = req.body as { like: number; postId: number };

      const likeAndDis = async (modelName: string, sortModelName: string) => {
        await myDataSource.query(
          `delete from ${sortModelName} where "userId" = ${req.user.id} and "postId" = ${postId}; `
        );
        const likemodel = await myDataSource.query(
          `select "userId" from ${modelName} where "userId" = ${req.user.id} and "postId" = ${postId}`
        );
        if (likemodel.length) return { like: "вы уже оставили реакцию" };
        await myDataSource.query(`INSERT INTO ${modelName} ("postId", "userId")
           VALUES (${postId}, ${req.user.id});`);
        return { like: true };
      };
      if (like) {
        const resultLike = await likeAndDis(
          "like_post_model",
          "dislike_post_model"
        );
        return res.json(resultLike);
      }
      const resultLike = await likeAndDis(
        "dislike_post_model",
        "like_post_model"
      );
      return res.json(resultLike);
    } catch {
      return next(ApiError.internal("Error возможно не существующий пост"));
    }
  }
  async getOne(
    req: TypedRequestQuery<{ id: number }>,
    res: TypedResponse<PostModel | null>,
    next: NextFunction
  ) {
    let { id } = req.query;
    if (!id) return next(ApiError.clientError("вы не ввели id"));

    const postMode = await myDataSource
      .getRepository(PostModel)
      .createQueryBuilder("post")
      .where("post.id = :id", { id })
      .loadRelationCountAndMap("post.like", "post.like")
      .loadRelationCountAndMap("post.dislike", "post.dislike")
      .getOne();
    return res.json(postMode);
  }
  async getAll(
    req: TypedRequestQuery<{ limit: number; page: number }>,
    res: TypedResponse<PostModel[]>,
    next: NextFunction
  ) {
    let { limit, page } = req.query;
    console.log(limit, page);
    if (isNaN(limit) || isNaN(page))
      return next(ApiError.clientError("Не правильно задан параметры"));
    page = page || 1;
    limit = limit || 2;
    let offset = page * limit - limit;
    const postMode = await myDataSource
      .getRepository(PostModel)
      .createQueryBuilder("post")
      .innerJoinAndSelect("post.user", "user")
      .loadRelationCountAndMap("post.like", "post.like")
      .loadRelationCountAndMap("post.dislike", "post.dislike")
      .orderBy("post.id", "ASC")
      .skip(offset)
      .take(limit)
      .getMany();
    return res.json(postMode);
  }
}

export const postControllers = new PostControllers();
