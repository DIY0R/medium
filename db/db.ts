import { DataSource, DataSourceOptions } from "typeorm";
import PostModel, {
  DislikePostModel,
  LikePostModel,
} from "./models/post.model";
import UserModel from "./models/user.model";
import { sslparam } from "./sslparam";

export const DBCONNECTINFO = {
  type: "postgres",
  host: process.env.DB_HOST || "",
  port: process.env.DB_PORT || "",
  username: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "",
  synchronize: true,
  logging: true,
  entities: [PostModel, UserModel, LikePostModel, DislikePostModel],
  subscribers: [],
  ...sslparam(),
};

export const myDataSource = new DataSource(DBCONNECTINFO as DataSourceOptions);
