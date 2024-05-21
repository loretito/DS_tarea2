import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SendTopicService } from './sendTopic.service';
import { CreateTopicService } from './createTopic.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import { DeliveryRequestConsumer } from '../consumer/deliveryRequest.consumer';

@Module({
  imports: [KafkaModule],
  controllers: [AppController],
  providers: [CreateTopicService, SendTopicService, DeliveryRequestConsumer],
})
export class AppModule {
  constructor(private readonly creaTopicService: CreateTopicService) {
    this.creaTopicService.createTopic();
  }
}
