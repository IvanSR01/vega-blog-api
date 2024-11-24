import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { CommentService } from './comment.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto'
import { UserData } from 'src/user/decorators/user.decorator'

/**
 * Comment controller
 *
 * @description
 * Handles comment related operations
 */
@Controller('comment')
export class CommentController {
	/**
	 * Creates an instance of CommentController
	 * @param {CommentService} commentService
	 */
	constructor(private readonly commentService: CommentService) {}

	/**
	 * Finds comments by post id
	 *
	 * @param {number} id
	 * @returns {Promise<Comment[]>}
	 */
	@Get('/post/:id')
	async findCommentsByPostId(@Param('id') id: number) {
		return await this.commentService.findCommentsByPostId(id)
	}

	/**
	 * Finds a single comment by id
	 *
	 * @param {number} id
	 * @returns {Promise<Comment>}
	 */
	@Get('/by-id/:id')
	async findCommentById(@Param('id') id: number) {
		return await this.commentService.findCommentById(id)	
	}

	/**
	 * Finds comments by user id
	 *
	 * @param {number} id
	 * @returns {Promise<Comment[]>}
	 */
	@Get('/get-current-user-comments')
	async findCommentsByUserId(@UserData('id') id: number) {
		return await this.commentService.findCommentsByUserId(id)
	}

	/**
	 * Creates a new comment
	 *
	 * @param {CreateCommentDto} dto
	 * @param {number} id
	 * @returns {Promise<Comment>}
	 */
	@Auth()
	@Post('/new')
	async createComment(
		@Body() dto: CreateCommentDto,
		@UserData('id') id: number
	) {
		return await this.commentService.createComment({ ...dto, authorId: id })
	}

	/**
	 * Updates a single comment
	 *
	 * @param {UpdateCommentDto} dto
	 * @param {number} id
	 * @returns {Promise<Comment>}
	 */
	@Auth()
	@Put('/update')
	async updateComment(
		@Body() dto: UpdateCommentDto,
		@UserData('id') id: number
	) {
		return await this.commentService.updateComment({ ...dto, authorId: id })
	}

	/**
	 * Deletes a single comment
	 *
	 * @param {number} id
	 * @returns {Promise<void>}
	 */
	@Auth()
	@Delete('/delete/:id')
	async deleteComment(@Param('id') id: number) {
		return await this.commentService.deleteComment(id)
	}
}
