import { Injectable } from '@nestjs/common';
import { ProductData } from './interface';
import { kafka } from './kafka';

@Injectable()
export class SendTopicService {
  async deliveryRequest(data: ProductData) {
    const producer = kafka.producer();
    await producer.connect();

    await producer.send({
      topic: 'deliveryRequest',
      messages: [
        {
          key: null,
          value: JSON.stringify(data),
        },
      ],
    });
  }
}
