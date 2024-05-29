import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mailer.service';
import { MonitorEmailTopicService } from 'src/producer/monitorEmailTopic.service';
import { RequestStatusService } from 'src/producer/requestStatus.service';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: 'tarea2sdtester@gmail.com',
          pass: 'kitg exyy pync ouew',
        },
      },
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    KafkaModule,
  ],
  providers: [MailService, MonitorEmailTopicService, RequestStatusService],
  exports: [MailService],
})
export class MailModule {}
