import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { UserService } from './user/user.service'

/**
 * App service
 *
 * @description
 * This service is responsible for running scheduled tasks
 *
 * @class
 * @author Purnama Budi
 */
@Injectable()
export class AppService {
	/**
	 * Constructor
	 *
	 * @param {UserService} userService - User service
	 */
	constructor(private readonly userService: UserService) {}

	/**
	 * Check user statuses
	 *
	 * @description
	 * This function checks user statuses and updates them if necessary
	 *
	 * @returns {Promise<void>} - Promise of the operation
	 */
	@Cron('0 0 * * *')
	async checkUserStatuses(): Promise<void> {
		const now = new Date()
		const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
		const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

		const users = await this.userService.findAll()

		for (const user of users) {
			const lastPostDate = user.posts?.length
				? user.posts.sort(
						(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
					)[0].createdAt
				: null

			if (!lastPostDate) {
				user.accountInfo.status = 'non-active'
			} else if (lastPostDate < monthAgo) {
				user.accountInfo.status = 'non-active'
			} else if (lastPostDate < weekAgo) {
				user.accountInfo.status = 'slow-active'
			} else {
				user.accountInfo.status = 'active'
			}

			user.accountInfo.statusUpdate = now
			await this.userService.updateUser(user.id, user)
		}
	}
}

