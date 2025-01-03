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
import { QuoteService } from './quote.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { AdminLevel } from 'src/auth/decorators/admin.decorator'
import { CreateQuoteDto, UpdateQuoteDto } from './dto/quote.dto'
import { Quote } from './quote.entity'

/**
 * Quote controller
 *
 * @description
 * Handles quote related operations
 */
@Controller('quote')
export class QuoteController {
	/**
	 * @constructor
	 * @param {QuoteService} quoteService - Quote service
	 */
	constructor(private readonly quoteService: QuoteService) {}

	/**
	 * Find a random quote
	 *
	 * @returns {Promise<Quote>} - A randomly selected quote
	 */
	@Get('/random-quote')
	async findRandomQuote(): Promise<Quote> {
		return await this.quoteService.findRandomQuote()
	}

	/**
	 * Find all quotes
	 *
	 * @returns {Promise<Quote[]>} - List of all quotes
	 */
	@Get('/all-quotes')
	async findQuotes(): Promise<Quote[]> {
		return await this.quoteService.findQuotes()
	}

	/**
	 * Create a new quote
	 *
	 * @param {CreateQuoteDto} dto - Data transfer object for creating a quote
	 * @returns {Promise<Quote>} - The created quote
	 */
	@UsePipes(new ValidationPipe())
	@Auth()
	@AdminLevel('admin-level-one')
	@Post('/new-quote')
	async createQuote(@Body() dto: CreateQuoteDto): Promise<Quote> {
		return await this.quoteService.createQuote(dto)
	}

	/**
	 * Update an existing quote
	 *
	 * @param {string} id - The ID of the quote to update
	 * @param {UpdateQuoteDto} dto - Data transfer object for updating a quote
	 * @returns {Promise<Quote>} - The updated quote
	 */
	@UsePipes(new ValidationPipe())
	@Auth()
	@AdminLevel('admin-level-one')
	@Patch('/update-quote/:id')
	async updateQuote(
		@Param('id') id: string,
		@Body() dto: UpdateQuoteDto
	): Promise<Quote> {
		return await this.quoteService.updateQuote({ ...dto, id: +id })
	}

	/**
	 * Delete a quote by ID
	 *
	 * @param {string} id - The ID of the quote to delete
	 * @returns {Promise<Quote>} - The deleted quote
	 */
	@Auth()
	@AdminLevel('admin-level-one')
	@Delete('/delete-quote/:id')
	async deleteQuote(@Param('id') id: string): Promise<Quote> {
		return await this.quoteService.deleteQuote(+id)
	}
}
