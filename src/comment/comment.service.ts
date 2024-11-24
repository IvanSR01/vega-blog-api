import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PostService } from 'src/post/post.service'
import { UserService } from 'src/user/user.service'
import { Repository } from 'typeorm'
import { Comment } from './comment.entity'
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto'

@Injectable()
export class CommentService {
	constructor(
		@InjectRepository(Comment)
		private readonly commentRepository: Repository<Comment>,
		private readonly postService: PostService,
		private readonly userService: UserService
	) {}

	async findCommentsByPostId(postId: number): Promise<Comment[]> {
		return await this.commentRepository.find({
			where: {
				post: { id: postId }
			}
		})
	}

	async findCommentById(id: number): Promise<Comment> {
		return await this.commentRepository.findOne({ where: { id } })
	}

	async findCommentsByUserId(userId: number): Promise<Comment[]> {
		return await this.commentRepository.find({
			where: {
				author: { id: userId }
			}
		})
	}

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

	async updateComment(dto: UpdateCommentDto): Promise<void> {
		const comment = await this.findCommentById(dto.id)

		if (!comment) throw new NotFoundException('Comment not found')

		await this.commentRepository.save({ ...comment, ...dto })
	}

	async deleteComment(id: number): Promise<void> {
		await this.commentRepository.delete({ id })
	}
}
