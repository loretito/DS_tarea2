import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '../kafka/consumer.service';

@Injectable()
export class DeliveryRequestConsumer implements OnModuleInit {
  constructor(private readonly consumerService: ConsumerService) {}

  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['delivery-request'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            value: message.value.toString(),
            topic: topic.toString(),
            partition: partition.toString(),
          });
        },
      },
    );
  }
}
