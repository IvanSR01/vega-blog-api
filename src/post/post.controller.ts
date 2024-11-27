import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { PostService } from './post.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CreatePostDto, UpdatePostDto } from './dto/post.dto'
import { UserData } from 'src/user/decorators/user.decorator'

/**
 * Controller for managing posts
 */
@Controller('post')
export class PostController {
	constructor(private readonly postService: PostService) {}

	/**
	 * Get a list of posts.
	 * @param {number} [limit] - Number of posts to fetch.
	 * @param {string} [search] - Search term for post titles.
	 * @param {string} [sort] - Sort criteria.
	 * @returns {Promise<Post[]>} - List of posts.
	 */
	@Get('/')
	async getPosts(
		@Query('limit') limit?: number,
		@Query('search') search?: string,
		@Query('sort') sort?: string
	) {
		return await this.postService.findPosts({
			limit,
			tag: null,
			search,
			sort
		})
	}

	/**
	 * Get posts by tag.
	 * @param {string} tag - Tag name.
	 * @param {number} [limit] - Number of posts to fetch.
	 * @param {string} [search] - Search term for post titles.
	 * @param {string} [sort] - Sort criteria.
	 * @returns {Promise<Post[]>} - List of posts with the specified tag.
	 */
	@Get('/by-tag/:tag')
	async getPostsByTag(
		@Param('tag') tag: string,
		@Query('limit') limit?: number,
		@Query('search') search?: string,
		@Query('sort') sort?: string
	) {
		return await this.postService.findPosts({
			limit,
			tag,
			search,
			sort
		})
	}

	/**
	 * Get the most viewed posts.
	 * @param {number} [limit] - Number of posts to fetch.
	 * @returns {Promise<Post[]>} - List of most viewed posts.
	 */
	@Get('/most-viewed')
	async getMostViewedPosts(@Query('limit') limit?: number) {
		return await this.postService.findMostViewedPosts(limit)
	}

	/**
	 * Get a post by its ID.
	 * @param {number} id - Post ID.
	 * @returns {Promise<Post>} - Post with the specified ID.
	 */
	@Get('/by-id/:id')
	async getById(@Param('id') id: number) {
		return await this.postService.findPostById(id)
	}
	/**
	 * Get posts by author ID.
	 * @param {number} id - Author ID.
	 * @returns {Promise<Post[]>} - List of posts by the specified author.
	 */
	@Get('/by-author/:id')
	async getByAuthor(@Param('id') id: number) {
		return await this.postService.findByAuthor(id)
	}


	/**
	 * Create a new post.
	 * @param {CreatePostDto} dto - Post data transfer object.
	 * @param {number} id - Author ID.
	 * @returns {Promise<Post>} - The created post.
	 */
	@Auth()
	@UsePipes(new ValidationPipe())
	@Post('/new')
	async createPost(@Body() dto: CreatePostDto, @UserData('id') id: number) {
		return await this.postService.createPost({ ...dto, authorId: id })
	}

	/**
	 * Update an existing post.
	 * @param {UpdatePostDto} dto - Post data transfer object.
	 * @param {number} id - Author ID.
	 * @returns {Promise<Post>} - The updated post.
	 */
	@Auth()
	@UsePipes(new ValidationPipe())
	@Put('/update')
	async updatePost(@Body() dto: UpdatePostDto, @UserData('id') id: number) {
		return await this.postService.updatePost({ ...dto, authorId: id })
	}

	/**
	 * Delete a post by its ID.
	 * @param {number} id - Post ID.
	 * @param {number} userId - User ID.
	 * @returns {Promise<void>} - Promise indicating the completion of the deletion.
	 */
	@Auth()
	@UsePipes(new ValidationPipe())
	@Delete('/delete/:id')
	async deletePost(@Param('id') id: number, @UserData('id') userId: number) {
		return await this.postService.deletePost(id, userId)
	}
}
