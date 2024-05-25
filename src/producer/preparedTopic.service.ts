import { Injectable } from '@nestjs/common';
import { ProductData } from 'interface';
import { ProducerService } from 'src/kafka/producer.service';

Injectable();
export class PreparedTopicService {
  constructor(private readonly producerService: ProducerService) {}

  async sendPrepared(data: ProductData) {
    const record = {
      topic: 'prepared',
      messages: [{ key: null, value: JSON.stringify(data) }],
    };

    await this.producerService.produce(record);
  }
}
