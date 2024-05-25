import { Injectable } from '@nestjs/common';
import { ProductData } from 'interface';
import { ProducerService } from 'src/kafka/producer.service';

Injectable();
export class RequestStatusService {
  constructor(private readonly producerService: ProducerService) {}

  async sendRequestStatus(data: ProductData) {
    const record = {
      topic: 'request-status',
      messages: [{ key: null, value: JSON.stringify(data) }],
    };

    await this.producerService.produce(record);
  }
}
