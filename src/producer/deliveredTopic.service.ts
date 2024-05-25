import { Injectable } from '@nestjs/common';
import { ProducerService } from 'src/kafka/producer.service';

@Injectable()
export class DeliveredTopicService {
  constructor(private readonly producerService: ProducerService) {}

  async sendDelivered(data: any) {
    const record = {
      topic: 'delivered',
      messages: [{ key: null, value: JSON.stringify(data) }],
    };

    await this.producerService.produce(record);
  }
}
