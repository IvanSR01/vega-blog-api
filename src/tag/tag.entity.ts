// tag.entity.ts

import { Post } from 'src/post/post.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

/**
 * Tag entity
 *
 * @description
 * Represents a tag in the system
 */
@Entity()
export class Tag {
	/**
	 * Tag id
	 */
	@PrimaryGeneratedColumn()
	id: number

	/**
	 * Tag name, must be unique
	 */
	@Column({
		unique: true
	})
	name: string

	/**
	 * View count of the tag
	 */
	@Column({
		default: 0
	})
	postCount: number

	/**
	 * Posts that the tag is related to
	 */
	@OneToMany(() => Post, post => post.tag)
	posts: Post[]
}
