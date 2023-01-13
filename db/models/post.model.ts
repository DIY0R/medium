import User from "./user.model";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export default class PostModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    nullable: false,
  })
  title: string;

  @Column({
    nullable: false,
    type: "text",
  })
  text: string;

  @Column({
    length: 50,
    nullable: false,
  })
  time: string;

  @OneToMany(() => LikePostModel, (likePost) => likePost.post, {
    cascade: true,
  })
  like: LikePostModel[];

  @OneToMany(() => DislikePostModel, (dislikePost) => dislikePost.post, {
    cascade: true,
  })
  dislike: DislikePostModel[];

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: "CASCADE",
  })
  user: User;
}

@Entity()
export class LikePostModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PostModel, (postModel) => postModel.like, {
    onDelete: "CASCADE",
  })
  post: PostModel;

  @ManyToOne(() => User, (user) => user.likePost, {
    onDelete: "CASCADE",
  })
  user: User;
}

@Entity()
export class DislikePostModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PostModel, (postModel) => postModel.dislike, {
    onDelete: "CASCADE",
  })
  post: PostModel;

  @ManyToOne(() => User, (user) => user.dislikePost, {
    onDelete: "CASCADE",
  })
  user: User;
}
