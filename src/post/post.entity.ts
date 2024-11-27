import { Comment } from 'src/comment/comment.entity'
import { Tag } from 'src/tag/tag.entity'
import { User } from 'src/user/user.entity'
import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm'

/**
 * Post entity
 *
 * @description
 * Represents a post in the system
 */
@Entity()
export class Post {
	/**
	 * Post id
	 */
	@PrimaryGeneratedColumn()
	id: number

	/**
	 * Post title
	 */
	@Column()
	title: string

	/**
	 * Post content
	 */
	@Column()
	content: string

	/**
	 * Post cover
	 */
	@Column()
	cover: string

	/**
	 * Post tag
	 */
	@ManyToOne(() => Tag, tag => tag.posts)
	tag: Tag

	/**
	 * Post creation date
	 */
	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	createdAt: Date

	/**
	 * Post likes
	 */
	@ManyToMany(() => User, user => user.likes)
	@JoinTable()
	likes: User[]

	/**
	 * Post dislikes
	 */
	@ManyToMany(() => User, user => user.dislikes)
	@JoinTable()
	dislikes: User[]

	/**
	 * Post view count
	 */
	@Column({
		default: 0
	})
	viewCount: number

	/**
	 * Post author
	 */
	@ManyToOne(() => User, user => user.posts)
	@JoinTable()
	author: User

	/**
	 * Post comments
	 */
	@OneToMany(() => Comment, comment => comment.post)
	@JoinTable()
	comments: Comment[]

	/**
	 * Post favorites
	 */
	@ManyToMany(() => User, user => user.favorites)
	@JoinTable()
	favorites: User[]
}
