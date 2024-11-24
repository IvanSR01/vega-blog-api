import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>
	) {}

	/**
	 * Find a user by ID
	 * @param {number} id - User ID
	 * @returns {Promise<User>} - User found
	 */
	async findOneById(id: number): Promise<User> {
		return this.userRepository.findOne({
			where: { id },
			relations: {
				likes: true,
				dislikes: true,
				favorites: true,
				subscriptions: true,
				subscribers: true
			}
		})
	}

	/**
	 * Find a user by email
	 * @param {string} email - User email
	 * @returns {Promise<User | null>} - User found or null
	 */
	async findOneByEmail(email: string) {
		return await this.userRepository.findOneBy({ email })
	}

	/**
	 * Find all users, optionally filtered by search term
	 * @param {string} [search] - Search term for first name or last name
	 * @returns {Promise<User[]>} - List of users
	 */
	async findAll(search?: string) {
		return await this.userRepository.find({
			where: {
				firstName: search ? search : undefined,
				lastName: search ? search : undefined
			}
		})
	}

	/**
	 * Create a new user
	 * @param {CreateUserDto} dto - Data transfer object for user creation
	 * @returns {Promise<User | ConflictException>} - Created user or conflict exception
	 */
	async createUser(dto: CreateUserDto) {
		const user = await this.findOneByEmail(dto.email)
		if (!user) {
			return await this.userRepository.save({
				...dto,
				password: await bcrypt.hash(dto.password, await bcrypt.genSalt(10)),
				likes: [],
				dislikes: [],
				favorites: [],
				subscriptions: [],
				subscribers: []
			})
		}
		return new ConflictException('Email or username is already in use')
	}

	/**
	 * Update user details
	 * @param {number} id - User ID
	 * @param {Partial<User>} dto - Partial user data to update
	 * @returns {Promise<any>} - Result of update operation
	 */
	async updateUser(id: number, dto: Partial<User>) {
		return await this.userRepository.update({ id }, dto)
	}

	/**
	 * Delete a user by ID
	 * @param {number} id - User ID
	 * @returns {Promise<any>} - Result of delete operation
	 */
	async deleteUser(id: number) {
		return await this.userRepository.delete({ id: id })
	}

	/**
	 * Toggle subscription between user and author
	 * @param {number} userId - User ID
	 * @param {number} authorId - Author ID
	 * @throws {NotFoundException} - If user or author not found
	 */
	async toggleSubscription(userId: number, authorId: number) {
		const user = await this.findOneById(userId)

		if (!user) throw new NotFoundException('User not found')

		const author = await this.findOneById(authorId)

		if (!author) throw new NotFoundException('Author not found')

		if (user.subscriptions && user.subscriptions.includes(author)) {
			user.subscriptions = user.subscriptions.filter(
				user => user.id !== author.id
			)
			author.subscriptions = author.subscriptions.filter(
				author => author.id !== user.id
			)
		} else {
			user.subscriptions.push(author)
			author.subscriptions.push(user)
		}
	}
}
