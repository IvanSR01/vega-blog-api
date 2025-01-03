import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateQuoteDto {
	@IsNotEmpty()
	@IsString()
	author: string

	@IsNotEmpty()
	@IsString()
	text: string
}

export class UpdateQuoteDto extends PartialType(CreateQuoteDto) {
	id: number
}
