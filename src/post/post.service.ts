import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Post } from './post.entity'
import { Repository } from 'typeorm'
import { CreatePostDto, FindPostDto, UpdatePostDto } from './dto/post.dto'
import { TagService } from 'src/tag/tag.service'
import { UserService } from 'src/user/user.service'

/**
 * Posts service
 *
 * @description
 * Service for managing posts
 */
@Injectable()
export class PostService {
	/**
	 * Constructor
	 *
	 * @param {Repository<Post>} postRepository - Post repository
	 * @param {TagService} tagService - Tag service
	 * @param {UserService} userService - User service
	 */
	constructor(
		@InjectRepository(Post) private readonly postRepository: Repository<Post>,
		private readonly tagService: TagService,
		private readonly userService: UserService
	) {}

	/**
	 * Find posts
	 *
	 * @param {FindPostDto} findPostDto - Search options
	 * @returns {Promise<Post[]>} - Posts
	 */
	async findPosts({
		limit,
		tag: tagName,
		search,
		sort: sortBy
	}: FindPostDto): Promise<Post[]> {
		const where: any = {}

		if (tagName) {
			where.tag = { name: tagName }
		}
		const order: any = {}

		if (sortBy) {
			const [field, orderDirection] = sortBy.split('_')

			order[field] = orderDirection
		} else {
			order.createdAt = 'DESC'
		}

		return (
			await this.postRepository.find({
				where,
				take: limit ? +limit : undefined,
				order,
				relations: {
					author: true,
					tag: true,
					likes: true,
					dislikes: true,
					favorites: true
				}
			})
		)?.filter(post =>
			search ? post.title.toLowerCase().includes(search?.toLowerCase()) : true
		)
	}
	/**
	 * Find post by id
	 *
	 * @param {number} id - Post id
	 * @returns {Promise<Post>} - Post
	 */
	async findPostById(id: number): Promise<Post> {
		const post = await this.postRepository.findOne({
			where: { id },
			relations: {
				author: true,
				tag: true,
				likes: true,
				dislikes: true,
				favorites: true
			}
		})

		if (!post) throw new NotFoundException('Post not found')

		await this.postRepository.update({ id }, { viewCount: post.viewCount + 1 })

		return post
	}

	/**
	 * Find most viewed posts
	 *
	 * @param {number} limit - Limit of posts
	 * @returns {Promise<Post[]>} - Posts
	 */
	async findMostViewedPosts(limit?: number): Promise<Post[]> {
		return await this.postRepository.find({
			take: limit,
			order: { viewCount: 'DESC' },
			relations: {
				author: true,
				tag: true,
				likes: true,
				dislikes: true,
				favorites: true
			}
		})
	}

	/**
	 * Find posts by author id
	 *
	 * @param {number} id - Author id
	 * @returns {Promise<Post[]>} - Posts
	 */
	async findByAuthor(id: number): Promise<Post[]> {
		const user = await this.userService.findOneById(+id)
		if (!user) {
			throw new NotFoundException('User not found')
		}

		return await this.postRepository.find({
			where: {
				author: {
					id: user.id
				}
			},
			relations: {
				author: true,
				tag: true,
				likes: true,
				dislikes: true
			}
		})
	}

	/**
	 * Create post
	 *
	 * @param {CreatePostDto} createPostDto - Post data
	 * @returns {Promise<Post>} - Post
	 */
	async createPost({ authorId, tag, ...post }: CreatePostDto): Promise<Post> {
		const user = await this.userService.findOneById(authorId)

		if (!user) {
			throw new NotFoundException('User not found')
		}

		const tagEntity = await this.tagService.findTagByName(tag)

		if (!tagEntity) {
			throw new NotFoundException('Tag not found')
		}

		await this.tagService.setPostCount(tagEntity.name)

		return await this.postRepository.save({
			...post,
			author: user,
			tag: tagEntity,
			likes: [],
			dislikes: [],
			favorites: []
		})
	}

	/**
	 * Update post
	 *
	 * @param {UpdatePostDto} updatePostDto - Post data
	 * @returns {Promise<Post>} - Post
	 */
	async updatePost({
		id,
		authorId,
		tag,
		...updates
	}: UpdatePostDto): Promise<Post> {
		const post = await this.findPostById(id)

		if (!post) {
			throw new NotFoundException('Post not found')
		}

		const author = await this.userService.findOneById(authorId)

		if (!author) {
			throw new NotFoundException('User not found')
		}

		const tagEntity = await this.tagService.findTagByName(tag)

		if (!tagEntity) {
			throw new NotFoundException('Tag not found')
		}

		return this.postRepository.save({
			...post,
			...updates,
			author,
			tag: tagEntity,
			likes: post.likes,
			dislikes: post.dislikes
		})
	}

	/**
	 * Delete post
	 *
	 * @param {number} id - Post id
	 * @param {number} userId - User id
	 * @returns {Promise<void>} - Promise
	 */
	async deletePost(id: number, userId: number): Promise<void> {
		const post = await this.findPostById(id)
		const user = await this.userService.findOneById(userId)
		if (!post) throw new NotFoundException('Post not found')

		if (!user) throw new NotFoundException('User not found')

		if (post.author.id !== user.id && !user.role.includes('admin'))
			throw new ConflictException('You are not the author of this post')

		await this.postRepository.delete({ id })
	}
}
