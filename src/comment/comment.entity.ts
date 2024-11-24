import { Post } from 'src/post/post.entity'
import { User } from 'src/user/user.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Comment {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	content: string

	@ManyToOne(() => User, user => user.comments)
	author: User

	@ManyToOne(() => Post, post => post.comments)
	post: Post

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	createAt: Date
}
