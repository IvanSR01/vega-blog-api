import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserService } from 'src/user/user.service'
import { Repository } from 'typeorm'
import { Post } from '../post.entity'
import { PostService } from '../post.service'

/**
 * Service for managing post reactions
 *
 * @description
 * This service is responsible for managing post reactions (likes, dislikes, favorites)
 */
@Injectable()
export class PostReactionService {
	/**
	 * @constructor
	 * @param {Repository<Post>} postRepository - Post repository
	 * @param {UserService} userService - User service
	 * @param {PostService} postService - Post service
	 */
	constructor(
		@InjectRepository(Post) private readonly postRepository: Repository<Post>,
		private readonly userService: UserService,
		private readonly postService: PostService
	) {}

	/**
	 * Toggle like post
	 *
	 * @param {number} postId - Post id
	 * @param {number} userId - User id
	 * @returns {Promise<void>} - Promise
	 */
	async toggleLikePost(postId: number, userId: number): Promise<void> {
		const post = await this.postService.findPostById(postId)
		if (!post) {
			throw new NotFoundException('Post not found')
		}
		const user = await this.userService.findOneById(userId)

		if (!user) throw new NotFoundException('User not found')

		if (post.likes && post.likes.includes(user)) {
			post.likes = post.likes.filter(user => user.id !== userId)
			user.likes = user.likes.filter(post => post.id !== postId)
		} else {
			if (post.dislikes && post.dislikes.includes(user)) {
				post.dislikes = post.dislikes.filter(user => user.id !== userId)
				user.dislikes = user.dislikes.filter(post => post.id !== postId)
			}
			post.likes.push(user)
			user.likes.push(post)
		}
		await this.postRepository.save(post)
		await this.userService.updateUser(user.id, user)
	}

	/**
	 * Toggle dislike post
	 *
	 * @param {number} postId - Post id
	 * @param {number} userId - User id
	 * @returns {Promise<void>} - Promise
	 */
	async toggleDislikePost(postId: number, userId: number): Promise<void> {
		const post = await this.postService.findPostById(postId)
		if (!post) {
			throw new NotFoundException('Post not found')
		}
		const user = await this.userService.findOneById(userId)

		if (!user) throw new NotFoundException('User not found')

		if (post.dislikes && post.dislikes.includes(user)) {
			post.dislikes = post.dislikes.filter(user => user.id !== userId)
			user.dislikes = user.dislikes.filter(post => post.id !== postId)
		} else {
			if (post.likes && post.likes.includes(user)) {
				post.likes = post.likes.filter(user => user.id !== userId)
				user.likes = user.likes.filter(post => post.id !== postId)
			}
			post.dislikes.push(user)
			user.dislikes.push(post)
		}
		await this.postRepository.save(post)
		await this.userService.updateUser(user.id, user)
	}

	/**
	 * Toggle favorite post
	 *
	 * @param {number} postId - Post id
	 * @param {number} userId - User id
	 * @returns {Promise<void>} - Promise
	 */
	async toggleFavoritePost(postId: number, userId: number): Promise<void> {
		const post = await this.postService.findPostById(postId)
		if (!post) {
			throw new NotFoundException('Post not found')
		}
		const user = await this.userService.findOneById(userId)

		if (!user) throw new NotFoundException('User not found')

		if (user.favorites && user.favorites.includes(post)) {
			user.favorites = user.favorites.filter(post => post.id !== postId)
		} else {
			user.favorites.push(post)
		}
		await this.postRepository.save(post)
		await this.userService.updateUser(user.id, user)
	}
}
