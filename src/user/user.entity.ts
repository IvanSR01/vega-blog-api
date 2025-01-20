// user.entity.ts

import { Comment } from 'src/comment/comment.entity'
import { Post } from 'src/post/post.entity'
import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm'

const defaultDescription =
	'Meet Jonathan Doe, a passionate writer and blogger with a love for technology and travel. Jonathan holds a degree in Computer Science and  has spent years working in the tech industry, gaining a deep understanding of the impact technology has on our lives.'

/**
 * User entity representing a user in the system.
 */
@Entity()
export class User {
	/**
	 * Primary key for the user.
	 */
	@PrimaryGeneratedColumn()
	id: number

	/**
	 * Unique email for the user.
	 */
	@Column({ unique: true }) 
	email: string

	/**
	 * Role of the user, can be 'user', 'admin-level-one', or 'admin-level-two'.
	 */
	@Column({
		default: 'user'
	})
	role: 'user' | 'admin-level-one' | 'admin-level-two'

	/**
	 * Password for the user.
	 */
	@Column()
	password: string

	/**
	 * First name of the user.
	 */
	@Column({
		default: 'Jonathan'
	})
	firstName: string

	/**
	 * Last name of the user.
	 */
	@Column({
		default: 'Doe'
	})
	lastName: string

	/**
	 * Optional middle name of the user.
	 */
	@Column({ nullable: true })
	middleName?: string

	/**
	 * Job title of the user.
	 */
	@Column({
		default: 'Collaborator & Editor'
	})
	jobTitle: string

	/**
	 * Description about the user.
	 */
	@Column({ default: defaultDescription })
	description: string

	/**
	 * Social media links for the user.
	 */
	@Column({
		default: {},
		type: 'jsonb'
	})
	social: {
		facebook?: string
		twitter?: string
		instagram?: string
		youtube?: string
	}

	@Column({
		default: {},
		type: 'jsonb'
	})
	accountInfo: {
		status: 'active' | 'slow-active' | 'non-active' | 'banned'
		statusUpdate: Date
		comment?: string
	}

	/**
	 * Avatar image URL for the user.
	 */
	@Column({
		default: ''
	})
	avatar: string

	/**
	 * Posts authored by the user.
	 */
	@OneToMany(() => Post, post => post.author)
	@JoinTable()
	posts: Post[]

	/**
	 * Users who subscribed to this user.
	 */
	@ManyToMany(() => User, user => user.subscriptions)
	@JoinTable()
	subscribers: User[]

	/**
	 * Users whom this user is subscribed to.
	 */
	@ManyToMany(() => User, user => user.subscribers)
	@JoinTable()
	subscriptions: User[]

	/**
	 * Posts liked by the user.
	 */
	@ManyToMany(() => Post, post => post.likes)
	@JoinTable()
	likes: Post[]

	/**
	 * Posts disliked by the user.
	 */
	@ManyToMany(() => Post, post => post.dislikes)
	@JoinTable()
	dislikes: Post[]

	/**
	 * Favorite posts of the user.
	 */
	@ManyToMany(() => Post, post => post.favorites)
	@JoinTable()
	favorites: Post[]

	/**
	 * Comments made by the user.
	 */
	@OneToMany(() => Comment, comment => comment.author)
	@JoinTable()
	comments: Comment[]
}
