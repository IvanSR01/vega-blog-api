import { Controller, Param, Post } from '@nestjs/common'
import { PostReactionService } from './post-reaction.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { UserData } from 'src/user/decorators/user.decorator'

/**
 * Controller for managing post reactions
 */
@Controller('post/post-reaction')
export class PostReactionController {
	constructor(
		/**
		 * Service for managing post reactions
		 */
		private readonly postReactionService: PostReactionService
	) {}

	/**
	 * Toggle like post
	 *
	 * @param postId - Post id
	 * @param id - User id
	 *
	 * @returns {Promise<void>} - Promise
	 */
	@Auth()
	@Post('/like/:postId')
	async toggleLikePost(
		@Param('postId') postId: number,
		@UserData('id') id: number
	) {
		return await this.postReactionService.toggleLikePost(postId, id)
	}

	/**
	 * Toggle dislike post
	 *
	 * @param postId - Post id
	 * @param id - User id
	 *
	 * @returns {Promise<void>} - Promise
	 */
	@Auth()
	@Post('/dislike/:postId')
	async toggleDislikePost(
		@Param('postId') postId: number,
		@UserData('id') id: number
	) {
		return await this.postReactionService.toggleDislikePost(postId, id)
	}

	/**
	 * Toggle favorite post
	 *
	 * @param postId - Post id
	 * @param id - User id
	 *
	 * @returns {Promise<void>} - Promise
	 */
	@Auth()
	@Post('/favorite/:postId')
	async toggleFavoritePost(
		@Param('postId') postId: number,
		@UserData('id') id: number
	) {
		return await this.postReactionService.toggleFavoritePost(postId, id)
	}
}

