// tag.entity.ts

import { Post } from 'src/post/post.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Tag {
	@PrimaryGeneratedColumn()
	id: number

	@Column({
		unique: true
	})
	name: string

	@Column({
		default: 0
	})
	viewCount: number

	@OneToMany(() => Post, post => post.tag)
	posts: Post[]
}
