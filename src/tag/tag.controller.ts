import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { TagService } from './tag.service'
import { AdminLevel } from 'src/auth/decorators/admin.decorator'
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto'
@Controller('tag')
export class TagController {
	constructor(private readonly tagService: TagService) {}

	@Get('/:limit')
	async findTags(@Param('limit') limit?: number) {
		return await this.tagService.findTags(limit)
	}

	@AdminLevel('admin-level-one')
	@UsePipes(new ValidationPipe())
	@Post('/new')
	async createTag(@Body() tag: CreateTagDto) {
		return await this.tagService.createTag(tag)
	}


	@AdminLevel('admin-level-one')
	@Patch('/update')
	async updateTag(@Body() dto: UpdateTagDto) {
		return await this.tagService.updateTag(dto)
	}

	@AdminLevel('admin-level-one')
	@Delete('/delete/:id')
	async deleteTag(@Param('id') id: number) {
		return await this.tagService.deleteTag(id)
	}
}
