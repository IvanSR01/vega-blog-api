import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Tag } from './tag.entity'
import { Repository } from 'typeorm'
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto'

/**
 * Service for managing tags.
 *
 * @description
 * This service provides methods to create, update, find, and delete tags.
 */
@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>
  ) {}

  /**
   * Find tags with an optional limit, sorted by view count in descending order.
   *
   * @param {number} [limit] - Optional limit for the number of tags to retrieve.
   * @returns {Promise<Tag[]>} - List of tags.
   */
  async findTags(limit?: number): Promise<Tag[]> {
    return (await this.tagRepository.find({ take: limit })).sort(
      (a, b) => b.postCount - a.postCount
    )
  }

  /**
   * Find a tag by name.
   *
   * @param {string} name - Name of the tag.
   * @returns {Promise<Tag>} - The found tag.
   */
  async findTagByName(name: string): Promise<Tag> {
    return await this.tagRepository.findOne({ where: { name } })
  }

  /**
   * Create a new tag.
   *
   * @param {CreateTagDto} tag - Data transfer object for creating a tag.
   * @returns {Promise<Tag>} - The created tag.
   */
  async createTag(tag: CreateTagDto): Promise<Tag> {
    return await this.tagRepository.save(tag)
  }

  /**
   * Increment the view count of a tag by name.
   *
   * @param {string} name - Name of the tag.
   * @returns {Promise<Tag>} - The updated tag with incremented view count.
   * @throws {NotFoundException} - If the tag is not found.
   */
  async setPostCount(name: string): Promise<Tag> {
    const tag = await this.findTagByName(name)

    if (!tag) throw new NotFoundException('Tag not found')

    tag.postCount += 1
    return await this.tagRepository.save(tag)
  }

  /**
   * Update a tag by its ID.
   *
   * @param {UpdateTagDto} dto - Data transfer object for updating a tag.
   * @returns {Promise<Tag>} - The updated tag.
   * @throws {NotFoundException} - If the tag is not found.
   */
  async updateTag(dto: UpdateTagDto): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { id: dto.id } })

    if (!tag) throw new NotFoundException('Tag not found')

    return await this.tagRepository.save({ ...tag, ...dto })
  }

  /**
   * Delete a tag by its ID.
   *
   * @param {number} id - ID of the tag to delete.
   * @returns {Promise<void>} - Result of the delete operation.
   */
  async deleteTag(id: number): Promise<void> {
    await this.tagRepository.delete({ id })
  }
}
