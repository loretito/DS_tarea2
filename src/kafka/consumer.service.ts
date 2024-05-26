import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import {
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
} from 'kafkajs';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly kafka = new Kafka({
    clientId: 'kafka-consumer',
    brokers: ['localhost:9092'],
  });
  private readonly consumers: Consumer[] = [];
  private readonly logger = new Logger(ConsumerService.name);

  async consume(
    topic: ConsumerSubscribeTopics,
    config: ConsumerRunConfig,
    consumerGroup: string = 'nestjs-kafka',
    fromBeginning: boolean = false,
  ) {
    const consumer = this.kafka.consumer({ groupId: consumerGroup });
    await consumer.connect();
    await consumer.subscribe({ ...topic, fromBeginning });
    await consumer.run(config);
    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }

  async consumeTopic(
    topic: string,
    consumerGroup: string = 'nestjs-kafka-test',
    fromBeginning: boolean = true,
  ) {
    const consumer = this.kafka.consumer({ groupId: consumerGroup });
    await consumer.connect();
    await consumer.subscribe({ topics: [topic], fromBeginning });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        this.logger.log(
          `Received message on ${topic} [${partition}] / ${message.offset}: ${message.value.toString()}`,
        );
        try {
          const data = JSON.parse(message.value.toString());
          this.logger.log(
            `Parsed message data: ${JSON.stringify(data, null, 2)}`,
          );
        } catch (error) {
          this.logger.error(`Error parsing message: ${error.message}`);
        }
      },
    });

    this.consumers.push(consumer);
  }
}
