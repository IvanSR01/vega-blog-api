import {
	ConflictException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import {
	TypeLoginUser,
	TypeValidateGitHubUser,
	TypeValidateGoogleUser
} from 'src/types/auth.types'
import { TypeUserData } from 'src/types/user.types'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { User } from 'src/user/user.entity'
import { UserService } from 'src/user/user.service'
import { CloseSessionDto, CreateGoogleDto, LoginUserDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}


	async login(dto: LoginUserDto) {
		const user = await this.userService.findOneByEmail(dto.email)
		if (!user) {
			throw new UnauthorizedException('User not found')
		}
		const isValid = await bcrypt.compare(dto.password, user.password)
		if (!isValid) {
			throw new UnauthorizedException('Invalid password')
		}
		return {
			tokens: await this.validatePayload(user),
			...user
		}
	}

	async registration(dto: CreateUserDto) {
		const oldUser = (await this.userService.findOneByEmail(dto.email))
		if (oldUser)
			throw new ConflictException('Email or username is already in use')
		const user = await this.userService.createUser({
			...dto,
			password: await bcrypt.hash(dto.password, await bcrypt.genSalt(10)),
		})
		return {
			tokens: await this.validatePayload(user as TypeUserData),
			...user
		}
	}


	async updateTokens(refreshToken: string) {
		const payload = this.jwtService.decode(refreshToken)
		console.log(payload, refreshToken)
		const user = await this.userService.findOneById(payload.sub)

		if (!user) {
			throw new UnauthorizedException('Invalid token')
		}

		return this.generateToken(payload)
	}


	async validatePayload(user: TypeUserData): TypeLoginUser {
		const payload = {
			email: user.email,
			sub: user.id,
		}
		return this.generateToken(payload)
	}

	private async generateToken(payload: JWTTokenPayload) {
		// Убедимся, что свойство exp отсутствует
		const { exp, ...restPayload } = payload
		return {
			accessToken: this.jwtService.sign(restPayload, { expiresIn: '1year' }),
			refreshToken: this.jwtService.sign(restPayload, { expiresIn: '30d' })
		}
	}

}
