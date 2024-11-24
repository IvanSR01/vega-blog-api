import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'

export class CreateTagDto {
	@IsNotEmpty()
	@IsString()
	name: string
}

export class UpdateTagDto extends PartialType(CreateTagDto) {
	@IsNotEmpty()
	@IsNumber()
	id: number
}
