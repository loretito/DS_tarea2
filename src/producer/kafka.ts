import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'kafkaProducer',
  brokers: ['localhost:9092', 'localhost:9092'],
});
