import { Module } from '@nestjs/common'
import { PostController } from './post.controller'
import { PostService } from './post.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Post } from './post.entity'
import { PostReactionService } from './post-reaction/post-reaction.service'
import { PostReactionController } from './post-reaction/post-reaction.controller'
import { TagModule } from 'src/tag/tag.module'
import { UserModule } from 'src/user/user.module'

@Module({
	imports: [TypeOrmModule.forFeature([Post]), TagModule, UserModule],
	controllers: [PostController, PostReactionController],
	providers: [PostService, PostReactionService],
	exports: [PostService]
})
export class PostModule {}
