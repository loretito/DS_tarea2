import { Injectable } from '@nestjs/common';
import { ProductData } from '../../interface';
import { ProducerService } from '../kafka/producer.service';

@Injectable()
export class StatusUpdateService {
  constructor(private readonly producerService: ProducerService) {}

  async sendStatusUpdate(data: ProductData) {
    const record = {
      topic: 'status-updates',
      messages: [{ key: null, value: JSON.stringify(data) }],
    };

    await this.producerService.produce(record);
  }
}
