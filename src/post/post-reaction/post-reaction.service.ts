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
	async toggleLikePost(postId: number, userId: number): Promise<boolean> {
		const post = await this.postService.findPostById(postId)
		if (!post) {
			throw new NotFoundException('Post not found')
		}
		const user = await this.userService.findOneById(userId)

		if (!user) throw new NotFoundException('User not found')
		console.log(post.likes && post.likes.some(user => user.id === userId))
		if (post.likes && post.likes.some(user => user.id === userId)) {
			post.likes = post.likes.filter(user => user.id !== userId)
		} else {
			if (post.dislikes && post.dislikes.some(user => user.id === userId)) {
				post.dislikes = post.dislikes.filter(user => user.id !== userId)
			}
			post.likes.push(user)
		}

		await this.postRepository.save(post)
		return post.likes.some(user => user.id === userId)
	}

	/**
	 * Toggle dislike post
	 *
	 * @param {number} postId - Post id
	 * @param {number} userId - User id
	 * @returns {Promise<void>} - Promise
	 */
	async toggleDislikePost(postId: number, userId: number): Promise<boolean> {
		const post = await this.postService.findPostById(postId)
		if (!post) {
			throw new NotFoundException('Post not found')
		}
		const user = await this.userService.findOneById(userId)

		if (!user) throw new NotFoundException('User not found')

		if (post.dislikes && post.dislikes.some(user => user.id === userId)) {
			post.dislikes = post.dislikes.filter(user => user.id !== userId)
		} else {
			if (post.likes && post.likes.some(user => user.id === userId)) {
				post.likes = post.likes.filter(user => user.id !== userId)
			}
			post.dislikes.push(user)
		}
		await this.postRepository.save(post)
		return post.dislikes.some(user => user.id === userId)
	}

	/**
	 * Toggle favorite post
	 *
	 * @param {number} postId - Post id
	 * @param {number} userId - User id
	 * @returns {Promise<void>} - Promise
	 */
	async toggleFavoritePost(postId: number, userId: number): Promise<boolean> {
		const post = await this.postService.findPostById(postId)
		if (!post) {
			throw new NotFoundException('Post not found')
		}
		const user = await this.userService.findOneById(userId)

		if (!user) throw new NotFoundException('User not found')

			if (post.favorites && post.favorites.some(user => user.id === userId)) {
			post.favorites = post.favorites.filter(user => user.id !== userId)
		} else {
			if(!post.favorites) post.favorites = []

			post.favorites?.push(user)
		}
		await this.postRepository.save(post)
		return post.favorites.some(user => user.id === userId)
	}

	/**
	 * Find posts liked by user
	 *
	 * @param {number} userId - User id
	 * @returns {Promise<Post[]>} - Posts
	 */
	async findUserLikePosts(userId: number): Promise<Post[]> {
		return await this.postRepository.find({
			where: { likes: { id: userId } },
			relations: {
				author: true,
				tag: true,
				likes: true,
				dislikes: true
			}
		})
	}
	/**
	 * Find posts favorited by user
	 *
	 * @param {number} userId - User id
	 * @returns {Promise<Post[]>} - Posts
	 */
	async findFavoritePosts(userId: number): Promise<Post[]> {
		return await this.postRepository.find({
			where: { favorites: { id: userId } },
			relations: {
				author: true,
				tag: true,
				likes: true,
				dislikes: true
			}
		})
	}
}
