import { Injectable, Logger } from '@nestjs/common';
import { ProductData } from 'interface';
import { ReadOnlyConsumerService } from 'src/kafka/read-only.consumer';
import { MailService } from 'src/mailer/mailer.service';

@Injectable()
export class MonitorEmailTopicService {
  private readonly logger = new Logger(MonitorEmailTopicService.name);
  private readonly topics = ['COMPLETED', 'DELIVERED', 'PREPARED', 'RECEIVED'];

  constructor(
    private readonly mailService: MailService,
    private readonly readOnlyConsumerService: ReadOnlyConsumerService,
  ) {
    this.logger.log('MonitorEmailTopicService created');
  }

  async monitorTopics() {
    for (const topic of this.topics) {
      this.readOnlyConsumerService.readMessages(
        topic,
        async ({ message }) => {
          const data: ProductData = JSON.parse(message.value.toString());
          const status = this.mapTopicToStatus(topic);
          const emailMessage = `Update producto id ${data.bd_id}: ${status}`;
          this.mailService.sendMail(data.bd_id.toString(), status, data.email, data);
          this.logger.log(`Correo enviado: ${emailMessage}`);
        },
        `monitor-group-${topic}`,
      );
    }
  }

  private mapTopicToStatus(topic: string): string {
    switch (topic) {
      case 'COMPLETED':
        return 'Completed';
      case 'DELIVERED':
        return 'Delivered';
      case 'PREPARED':
        return 'Prepared';
      case 'RECEIVED':
        return 'Received';
      default:
        return 'Unknown';
    }
  }
}
