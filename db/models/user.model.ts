import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import PostModel, { DislikePostModel, LikePostModel } from "./post.model";
@Entity()
export default class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
    unique: true,
    length: 50,
  })
  email: string;

  @Column({
    select: false,
    nullable: true,
    length: 100,
  })
  password: string;

  @OneToMany(() => PostModel, (post) => post.user, { cascade: true })
  posts: PostModel[];

  @OneToMany(() => LikePostModel, (likePost) => likePost.user, {
    cascade: true,
  })
  likePost: LikePostModel[];

  @OneToMany(() => DislikePostModel, (dislikePost) => dislikePost.user, {
    cascade: true,
  })
  dislikePost: DislikePostModel[];
}
console.log(UserModel);
