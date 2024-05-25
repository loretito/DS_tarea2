import { Injectable } from '@nestjs/common';
import { ProductData } from 'interface';
import { ProducerService } from 'src/kafka/producer.service';

Injectable();
export class CompleteTopicService {
  constructor(private readonly producerService: ProducerService) {}

  async sendComplete(data: ProductData) {
    const record = {
      topic: 'complete',
      messages: [{ key: null, value: JSON.stringify(data) }],
    };

    await this.producerService.produce(record);
  }
}
