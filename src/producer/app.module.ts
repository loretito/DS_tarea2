import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SendTopicService } from './sendTopic.service';
import { CreateTopicService } from './createTopic.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import { DeliveryRequestConsumer } from '../consumer/deliveryRequest.consumer';
import { DeliveredTopicService } from './deliveredTopic.service';
import { RequestStatusService } from './requestStatus.service';
import { CompleteTopicService } from './completeTopic.service';
import { PreparedTopicService } from './preparedTopic.service';
import { ReadOnlyConsumerService } from 'src/kafka/read-only.consumer';
import { ProducerService } from '../kafka/producer.service';
import { MailModule } from 'src/mailer/mail.module';
import { ConfigModule } from '@nestjs/config';
import { MonitorEmailTopicService } from './monitorEmailTopic.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    KafkaModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    CreateTopicService,
    SendTopicService,
    DeliveryRequestConsumer,
    DeliveredTopicService,
    RequestStatusService,
    CompleteTopicService,
    PreparedTopicService,
    ReadOnlyConsumerService,
    ProducerService,
    MonitorEmailTopicService,
  ],
})
export class AppModule {
  constructor(
    private readonly createTopicService: CreateTopicService,
    private readonly monitorEmailTopicService: MonitorEmailTopicService
  ) {
    this.createTopicService.createTopics();
    this.monitorEmailTopicService.monitorTopics();
  }
}
