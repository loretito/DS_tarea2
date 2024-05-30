import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mailer.service';
import { MonitorEmailTopicService } from 'src/producer-consumer/monitorEmailTopic.service';
import { RequestStatusService } from 'src/producer-consumer/requestStatus.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import { timeout } from 'rxjs';

timeout(2000);
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: 'tarea2sdtester@gmail.com',
          pass: 'mkwg wtez nflg onfm',
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
