import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailService } from './mailer.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { MonitorEmailTopicService } from 'src/producer/monitorEmailTopic.service';
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
  controllers: [MailerController],
  providers: [MailService, MonitorEmailTopicService],
  exports: [MailService],
})
export class MailModule {}
