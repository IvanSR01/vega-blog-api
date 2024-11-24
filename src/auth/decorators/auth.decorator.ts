import { UseGuards, applyDecorators } from '@nestjs/common'
import { JwtAuthGuard } from '../guard/jwt-auth.guard'

export function Auth() {

	return applyDecorators(
		UseGuards(JwtAuthGuard)
	)
}
