import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SendTopicService } from './sendTopic.service';
import { CreateTopicService } from './createTopic.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [CreateTopicService, SendTopicService],
})
export class AppModule {
  constructor(private readonly creaTopicService: CreateTopicService) {
    this.creaTopicService.createTopic();
  }
}
