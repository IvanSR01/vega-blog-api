import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'
export class FindPostDto {
	@IsOptional()
	@IsNumber()
	limit?: number

	@IsOptional()
	@IsString()
	tag?: string

	@IsOptional()
	@IsString()
	search?: string

	@IsOptional()
	@IsString()
	sort?: string
}

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  cover: string;

  @IsOptional()
  @IsString()
  tag?: string;

  authorId: number;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {
	@IsNotEmpty()
	@IsNumber()
	id: number
}