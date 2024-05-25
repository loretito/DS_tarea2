import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class CreateTopicService {
  async createTopic() {
    const kafka = new Kafka({
      clientId: 'kafka',
      brokers: ['localhost:9092', 'localhost:9092'],
    });
    const admin = kafka.admin();

    await admin.createTopics({
      topics: [
        { topic: 'delivery-request', numPartitions: 3, replicationFactor: 1 },
        { topic: 'delivered', numPartitions: 3, replicationFactor: 1 },
      ],
    });

    admin.disconnect();
  }
}
