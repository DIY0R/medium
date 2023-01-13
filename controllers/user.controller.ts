import UserModel from "../db/models/user.model";
import { Repository } from "typeorm";
import { myDataSource } from "../db/db";
import { jwtCreate, jwTgenerateInterface } from "../utils/generateJwt";
import { Body } from "node-fetch";
import bcrypt from "bcrypt";
import ApiError from "../error/ApiError";
import { NextFunction } from "express";
import {
  TypedRequestBody,
  TypedRequestQuery,
  TypedResponse,
} from "../types/ReqRes";

interface userInterface {
  email?: string;
  name?: string;
  password?: string;
  role?: string;
}

export class UserControllers {
  constructor(private readonly jwt: jwTgenerateInterface) {}

  login = async (
    req: TypedRequestBody<Pick<userInterface, "email" | "password">>,
    res: TypedResponse<{ token: string }>,
    next: NextFunction
  ) => {
    const { email, password } = req.body;

    const userModel = await myDataSource.getRepository(UserModel);
    if (!email || !password)
      return next(ApiError.forbidden("Некорректный email или password"));

    const user = await userModel
      .createQueryBuilder("user")
      .where("user.email=:email", { email })
      .select("user.id")
      .addSelect("user.password")
      .addSelect("user.email")
      .groupBy("user.id")
      .getOne();

    if (!user) return next(ApiError.forbidden("Пользователь не найден"));
    let comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return next(ApiError.forbidden("Указан неверный пароль"));
    }
    const token = this.jwt.genererate(
      user.id,
      user.email,
      process.env.SECRET_KEY as string
    );
    return res.json({ token });
  };

  registration = async (
    req: TypedRequestBody<userInterface>,
    res: TypedResponse<{ token: string }>,
    next: NextFunction
  ) => {
    const user = await myDataSource.getRepository(UserModel);
    const { email, password, name } = req.body;

    if (!email || !password || !name)
      return next(ApiError.forbidden("Некорректный email,password или name"));

    const candidate = await user.findOne({ where: { email } });
    if (candidate)
      return next(
        ApiError.forbidden("Пользователь с таким email уже существует")
      );

    const hashPassword = await bcrypt.hash(password, 5);
    const userCreate = new UserModel();
    Object.assign(userCreate, { name, email, password: hashPassword });
    const userNew = await user.save(userCreate);
    const token = this.jwt.genererate(
      userNew.id,
      userNew.email,
      process.env.SECRET_KEY as string
    );
    return res.json({ token });
  };

  async getUsers(
    req: TypedRequestQuery<{ limit: number; page: number }>,
    res: TypedResponse<UserModel[]>,
    next: NextFunction
  ) {
    let { limit, page } = req.query;
    if (isNaN(limit) || isNaN(page))
      return next(ApiError.badRequest("Не правильно задан параметры"));
    page = page || 1;
    limit = limit || 2;
    let offset = page * limit - limit;
    const user = await myDataSource.getRepository(UserModel);
    const allUsers = await user
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
  }
}

export const userControllers = new UserControllers(jwtCreate);
