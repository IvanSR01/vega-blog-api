import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Tag } from './tag.entity'
import { Repository } from 'typeorm'
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto'

@Injectable()
export class TagService {
	constructor(
		@InjectRepository(Tag) private readonly tagRepository: Repository<Tag>
	) {}

	async findTags(limit?: number): Promise<Tag[]> {
		return (await this.tagRepository.find({ take: limit })).sort(
			(a, b) => b.viewCount - a.viewCount
		)
	}

	async findTagByName(name: string): Promise<Tag> {
		return await this.tagRepository.findOne({ where: { name } })
	}

	async createTag(tag: CreateTagDto): Promise<Tag> {
		return await this.tagRepository.save(tag)
	}

	async setViewCount(name: string): Promise<Tag> {
		const tag = await this.findTagByName(name)

		if (!tag) throw new NotFoundException('Tag not found')

		tag.viewCount += 1
		return await this.tagRepository.save(tag)
	}

	async updateTag(dto: UpdateTagDto): Promise<Tag> {
		const tag = await this.tagRepository.findOne({ where: { id: dto.id } })

		if (!tag) throw new NotFoundException('Tag not found')

		return await this.tagRepository.save({ ...tag, ...dto })
	}

	async deleteTag(id: number): Promise<void> {
		await this.tagRepository.delete({ id })
	}
}
