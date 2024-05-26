import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class ReadOnlyConsumerService implements OnModuleInit {
  private readonly kafka = new Kafka({
    clientId: 'kafka-read-only-consumer',
    brokers: ['localhost:9092'],
  });
  private readonly logger = new Logger(ReadOnlyConsumerService.name);

  private consumers: Consumer[] = [];

  async onModuleInit() {
    this.logger.log('ReadOnlyConsumerService initialized');
  }

  async readMessages(
    topic: string,
    handler: (payload: EachMessagePayload) => Promise<void>,
    groupId: string = 'read-only-group',
  ) {
    const consumer = this.kafka.consumer({ groupId });

    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async (payload) => {
        await handler(payload);
      },
      autoCommit: false,
    });

    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
