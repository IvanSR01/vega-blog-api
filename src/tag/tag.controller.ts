import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { TagService } from './tag.service'
import { AdminLevel } from 'src/auth/decorators/admin.decorator'
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto'
/**
 * Tag controller
 *
 * @description
 * Handles tag related operations
 */
@Controller('tag')
export class TagController {
	/**
	 * Service for managing tags
	 */
	constructor(private readonly tagService: TagService) {}

	/**
	 * Find tags
	 *
	 * @param {number} [limit] - Limit of tags to return
	 * @returns {Promise<Tag[]>} - Found tags
	 */
	@Get('/')
	async findTags(@Query('limit') limit?: number) {
		return await this.tagService.findTags(limit)
	}

	/**
	 * Create a new tag
	 *
	 * @param {CreateTagDto} tag - Tag data
	 * @returns {Promise<Tag>} - Created tag
	 */
	@UsePipes(new ValidationPipe())
	@Post('/new')
	async createTag(@Body() tag: CreateTagDto) {
		return await this.tagService.createTag(tag)
	}


	/**
	 * Update a tag
	 *
	 * @param {UpdateTagDto} dto - Tag data
	 * @returns {Promise<void>} - Result of update operation
	 */
	@AdminLevel('admin-level-one')
	@Patch('/update')
	async updateTag(@Body() dto: UpdateTagDto) {
		return await this.tagService.updateTag(dto)
	}

	/**
	 * Delete a tag
	 *
	 * @param {number} id - Tag id
	 * @returns {Promise<void>} - Result of delete operation
	 */
	@AdminLevel('admin-level-one')
	@Delete('/delete/:id')
	async deleteTag(@Param('id') id: number) {
		return await this.tagService.deleteTag(id)
	}
}

