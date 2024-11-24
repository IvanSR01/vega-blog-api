import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateCommentDto {
	@IsNotEmpty()
	@IsString()
	content: string

	@IsNotEmpty()
	@IsNumber()
	postId: number

	authorId: number
}

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
	@IsNotEmpty()
	@IsNumber()
	id: number
}