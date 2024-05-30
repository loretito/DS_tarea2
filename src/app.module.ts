import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SendTopicService } from './producer-consumer/sendTopic.producer';
import { CreateTopicService } from './producer-consumer/createTopic.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import { DeliveryRequestConsumer } from './producer-consumer/deliveryRequest.consumer';
import { RequestStatusService } from './producer-consumer/requestStatus.consumer';
import { ReadOnlyConsumerService } from 'src/kafka/read-only.consumer';
import { ProducerService } from './kafka/producer.service';
import { MailModule } from 'src/mailer/mail.module';
import { ConfigModule } from '@nestjs/config';
import { MonitorEmailTopicService } from './producer-consumer/monitorEmailTopic.consumer';

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
    RequestStatusService,
    ReadOnlyConsumerService,
    ProducerService,
    MonitorEmailTopicService,
  ],
})
export class AppModule {
  constructor(
    private readonly createTopicService: CreateTopicService,
    private readonly monitorEmailTopicService: MonitorEmailTopicService,
  ) {}

  async onModuleInit() {
    await this.createTopicService.createTopics();
    setTimeout(async () => {
      await this.monitorEmailTopicService.monitorTopics();
    }, 3000); // Espera 3 segundos antes de iniciar el monitoreo
  }
}
