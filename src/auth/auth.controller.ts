import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { AuthService } from './auth.service'
import { Auth } from './decorators/auth.decorator'
import { LoginUserDto } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService
	) {}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async register(@Body() createUserDto: CreateUserDto) {
		return await this.authService.registration(createUserDto)
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() loginUserDto: LoginUserDto) {
		return await this.authService.login(loginUserDto)
	}

	@Auth()
	@Post('refresh-token')
	@HttpCode(HttpStatus.OK)
	async refreshToken(@Body() tokenUserDto: any) {
		return await this.authService.updateTokens(tokenUserDto.refreshToken)
	}

}
