import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Put,
	Query
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { TypeUserData } from 'src/types/user.types'
import { UserData } from './decorators/user.decorator'
import { UserService } from './user.service'

/**
 * Controller for managing users
 *
 * @description
 * This controller handles all the operations related to users
 */
@Controller('user')
export class UserController {
	/**
	 * Constructor
	 *
	 * @param {UserService} userService - Service for managing users
	 */
	constructor(private readonly userService: UserService) {}

	/**
	 * Find all users
	 *
	 * @param {string} [search] - Search term for first name or last name
	 * @returns {Promise<User[]>} - List of users
	 */
	@Get()
	async findAll(@Query('search') search?: string) {
		return await this.userService.findAll(search)
	}

	/**
	 * Find a user by ID
	 *
	 * @param {number} id - User ID
	 * @returns {Promise<User>} - User
	 */
	@Get(`/by-id/:id`)
	@Auth()
	async findOneById(@Param('id') id: number) {
		return await this.userService.findOneById(id)
	}

	/**
	 * Get the current user profile
	 *
	 * @param {number} id - Current user ID
	 * @returns {Promise<User>} - Current user
	 */
	@Get('info-profile')
	@Auth()
	async profile(@UserData('id') id: number) {
		return await this.userService.findOneById(id)
	}

	/**
	 * Update the current user profile
	 *
	 * @param {number} id - Current user ID
	 * @param {TypeUserData} dto - User data to update
	 * @returns {Promise<User>} - Updated user
	 */
	@Put('update-profile')
	@Auth()
	async updateProfile(@UserData('id') id: number, @Body() dto: TypeUserData) {
		return await this.userService.updateUser(id, dto)
	}

	/**
	 * Delete the current user
	 *
	 * @param {number} id - Current user ID
	 * @returns {Promise<any>} - Result of delete operation
	 */
	@Delete('delete-profile')
	@Auth()
	async deleteProfile(@UserData('id') id: number) {
		return await this.userService.deleteUser(id)
	}
}
