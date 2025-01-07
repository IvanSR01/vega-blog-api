import { Module } from '@nestjs/common'
import { TagModule } from './tag/tag.module'
import { PostModule } from './post/post.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user/user.entity'
import { Tag } from './tag/tag.entity'
import { CommentModule } from './comment/comment.module'
import { Post } from './post/post.entity'
import { Comment } from './comment/comment.entity'
import { UploadModule } from './upload/upload.module'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { QuoteModule } from './quote/quote.module'
import { ScheduleModule } from '@nestjs/schedule'
import { AppService } from './app.service'
import { Quote } from './quote/quote.entity'

/**
 * AppModule
 *
 * @description
 * Main application module that imports and configures other modules.
 */
@Module({
	imports: [
		/**
		 * ConfigModule
		 *
		 * @description
		 * Loads environment variables from .env file.
		 */
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env'
		}),
		/**
		 * TypeOrmModule
		 *
		 * @description
		 * Configures TypeORM for PostgreSQL with connection settings from environment variables.
		 */
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get<string>('DB_HOST'),
				port: configService.get<number>('DB_PORT'),
				username: configService.get<string>('DB_USER'),
				password: configService.get<string>('DB_PASSWORD'),
				database: configService.get<string>('DB_NAME'),
				entities: [User, Tag, Post, Comment, Quote],
				synchronize: true
			})
		}),
		/**
		 * AuthModule
		 *
		 * @description
		 * Module for auth.
		 */
		AuthModule,
		/**
		 * TagModule
		 *
		 * @description
		 * Module for managing tags.
		 */
		TagModule,
		/**
		 * PostModule
		 *
		 * @description
		 * Module for managing posts.
		 */
		PostModule,
		/**
		 * CommentModule
		 *
		 * @description
		 * Module for managing comments.
		 */
		CommentModule,
		/**
		 * UploadModule
		 *
		 * @description
		 * Module for handling file uploads.
		 */
		UploadModule,
		/**
		 * UserModule
		 *
		 * @description
		 * Module for managing users.
		 */
		UserModule,
		QuoteModule,
		ScheduleModule.forRoot()
	],
	providers: [AppService]
})
export class AppModule {}
