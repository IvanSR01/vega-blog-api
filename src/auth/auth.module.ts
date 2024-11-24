import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtAuthGuard } from './guard/jwt-auth.guard'
import { UserModule } from 'src/user/user.module'
import { JwtStrategy } from './strategies/jwt.strategy'
import { OnlyAdminGuard } from './guard/admin.guard'

@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET'),
				signOptions: { expiresIn: '1h' }
			}),
			inject: [ConfigService]
		}),
		ConfigModule,
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		JwtStrategy,
		JwtAuthGuard,
		OnlyAdminGuard
	]
})
export class AuthModule {}
