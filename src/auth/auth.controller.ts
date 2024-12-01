import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { AuthService } from './auth.service'
import { Auth } from './decorators/auth.decorator'
import { LoginUserDto } from './dto/auth.dto'

/**
 * AuthController
 *
 * @description Handles authentication and authorization related operations
 */
@Controller('auth')
export class AuthController {
	/**
	 * Constructor
	 *
	 * @param {AuthService} authService - Instance of AuthService
	 * @param {ConfigService} configService - Instance of ConfigService
	 */
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService
	) {}

	/**
	 * Register a new user
	 *
	 * @param {CreateUserDto} createUserDto - Data transfer object for user creation
	 *
	 * @returns {Promise<User>} - Registered user
	 */
	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new ValidationPipe())
	async register(@Body() createUserDto: CreateUserDto) {
		return await this.authService.registration(createUserDto)
	}

	/**
	 * Login an existing user
	 *
	 * @param {LoginUserDto} loginUserDto - Data transfer object for user login
	 *
	 * @returns {Promise<{ accessToken: string; refreshToken: string }>} - Login response
	 */
	@Post('login')
	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe())
	async login(@Body() loginUserDto: LoginUserDto) {
		return await this.authService.login(loginUserDto)
	}

	/**
	 * Update tokens using refresh token
	 *
	 * @param {any} tokenUserDto - Refresh token
	 *
	 * @returns {Promise<{ accessToken: string; refreshToken: string }>} - Updated tokens
	 */
	@Auth()
	@Post('refresh-token')
	@HttpCode(HttpStatus.OK)
	async refreshToken(@Body() tokenUserDto: any) {
		return await this.authService.updateTokens(tokenUserDto.refreshToken)
	}

}

