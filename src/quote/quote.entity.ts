import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

/**
 * Quote entity
 *
 * @description
 * Represents a quote in the system
 */
@Entity()
export class Quote {

	/**
	 * Quote id
	 */
	@PrimaryGeneratedColumn()
	id: number

	/**
	 * Quote text
	 */
	@Column()
	text: string

	/**
	 * Quote author
	 */
	@Column()
	author: string
}

