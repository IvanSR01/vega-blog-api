import { Comment } from "src/comment/comment.entity";
import { Tag } from "src/tag/tag.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Post {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	title: string

	@Column()
	content: string

	@Column()
	cover: string

	@ManyToOne(() => Tag, tag => tag.posts)
	tag: Tag

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	createdAt: Date

	@ManyToMany(() => User, user => user.likes)
	likes: User[]


	@ManyToMany(() => User, user => user.dislikes)
	dislikes: User[]


	@Column({
		default: 0
	})
	viewCount: number

	@ManyToOne(() => User, user => user.posts)
	author: User

	@OneToMany(() => Comment, comment => comment.post)
	comments: Comment[]
}