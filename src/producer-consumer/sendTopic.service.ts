import { Injectable } from '@nestjs/common';
import { ProductData } from '../../interface';
import { ProducerService } from '../kafka/producer.service';

@Injectable()
export class SendTopicService {
  constructor(private readonly producerService: ProducerService) {}

  async deliveryRequest(data: ProductData) {
    const record = {
      topic: 'delivery-request',
      messages: [{ key: null, value: JSON.stringify(data) }],
    };

    await this.producerService.produce(record);
  }
}
