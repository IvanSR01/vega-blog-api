import { Module } from '@nestjs/common'
import { QuoteController } from './quote.controller'
import { QuoteService } from './quote.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Quote } from './quote.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Quote])],
	controllers: [QuoteController],
	providers: [QuoteService]
})
export class QuoteModule {}
