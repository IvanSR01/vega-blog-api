import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Quote } from './quote.entity'
import { Repository } from 'typeorm'
import { CreateQuoteDto, UpdateQuoteDto } from './dto/quote.dto'

@Injectable()
export class QuoteService {
	constructor(
		@InjectRepository(Quote) private readonly quoteRepository: Repository<Quote>
	) {}

	/**
	 * Find a random quote
	 * @returns {Promise<Quote>} - A randomly selected quote
	 */
	async findRandomQuote(): Promise<Quote> {
		const quotes = await this.quoteRepository.find()
		const randomIndex = Math.floor(Math.random() * quotes.length)

		return quotes[randomIndex]
	}

	/**
	 * Find all quotes
	 * @returns {Promise<Quote[]>} - List of all quotes
	 */
	async findQuotes(): Promise<Quote[]> {
		return await this.quoteRepository.find()
	}

	/**
	 * Create a new quote
	 * @param {CreateQuoteDto} dto - Data transfer object for creating a quote
	 * @returns {Promise<Quote>} - The created quote
	 */
	async createQuote(dto: CreateQuoteDto): Promise<Quote> {
		return await this.quoteRepository.save(dto)
	}

	/**
	 * Update an existing quote
	 * @param {UpdateQuoteDto} dto - Data transfer object for updating a quote
	 * @returns {Promise<Quote>} - The updated quote
	 * @throws {NotFoundException} - If the quote is not found
	 */
	async updateQuote({ id, ...dto }: UpdateQuoteDto) {
		const quote = await this.quoteRepository.findOne({ where: { id } })

		if (!quote) throw new NotFoundException('Quote not found')

		return await this.quoteRepository.save({ ...quote, ...dto })
	}

	/**
	 * Delete a quote by ID
	 * @param {number} id - The ID of the quote to delete
	 * @returns {Promise<Quote>} - The deleted quote
	 * @throws {NotFoundException} - If the quote is not found
	 */
	async deleteQuote(id: number) {
		const quote = await this.quoteRepository.findOne({ where: { id } })

		if (!quote) throw new NotFoundException('Quote not found')

		return await this.quoteRepository.remove(quote)
	}
}
