import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PostService } from 'src/post/post.service'
import { UserService } from 'src/user/user.service'
import { Repository } from 'typeorm'
import { Comment } from './comment.entity'
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto'

/**
 * Comment service
 *
 * @description
 * Service for managing comments
 */
@Injectable()
export class CommentService {
	/**
	 * Constructor
	 *
	 * @param {Repository<Comment>} commentRepository - Comment repository
	 * @param {PostService} postService - Post service
	 * @param {UserService} userService - User service
	 */
	constructor(
		@InjectRepository(Comment)
		private readonly commentRepository: Repository<Comment>,
		private readonly postService: PostService,
		private readonly userService: UserService
	) {}

	/**
	 * Find comments by post id
	 *
	 * @param {number} postId - Post id
	 * @returns {Promise<Comment[]>} - Comments
	 */
	async findCommentsByPostId(postId: number): Promise<Comment[]> {
		return await this.commentRepository.find({
			where: {
				post: { id: postId }
			},
			relations: {
				author: true,
				post: true
			}
		})
	}

	/**
	 * Find comment by id
	 *
	 * @param {number} id - Comment id
	 * @returns {Promise<Comment>} - Comment
	 */
	async findCommentById(id: number): Promise<Comment> {
		return await this.commentRepository.findOne({ where: { id } })
	}

	/**
	 * Find comments by user id
	 *
	 * @param {number} userId - User id
	 * @returns {Promise<Comment[]>} - Comments
	 */
	async findCommentsByUserId(userId: number): Promise<Comment[]> {
		return await this.commentRepository.find({
			where: {
				author: { id: userId }
			},
			relations: {
				author: true,
				post: true
			}
		})
	}

	/**
	 * Create comment
	 *
	 * @param {CreateCommentDto} dto - Create comment dto
	 * @returns {Promise<Comment>} - Created comment
	 */
	async createComment(dto: CreateCommentDto): Promise<Comment> {
		const post = await this.postService.findPostById(dto.postId)

		if (!post) throw new NotFoundException('Post not found')

		const author = await this.userService.findOneById(dto.authorId)

		if (!author) throw new NotFoundException('User not found')

		return await this.commentRepository.save({
			...dto,
			author,
			post
		})
	}

	/**
	 * Update comment
	 *
	 * @param {UpdateCommentDto} dto - Update comment dto
	 * @returns {Promise<void>} - Result of update operation
	 */
	async updateComment(dto: UpdateCommentDto): Promise<void> {
		const comment = await this.findCommentById(dto.id)

		if (!comment) throw new NotFoundException('Comment not found')

		await this.commentRepository.save({ ...comment, ...dto })
	}

	/**
	 * Delete comment
	 *
	 * @param {number} id - Comment id
	 * @returns {Promise<void>} - Result of delete operation
	 */
	async deleteComment(id: number): Promise<void> {
		await this.commentRepository.delete({ id })
	}
}
