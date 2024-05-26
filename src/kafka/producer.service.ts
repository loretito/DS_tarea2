import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  private readonly kafka = new Kafka({
    clientId: 'kafka-producer',
    brokers: ['localhost:9092'],
  });
  private readonly producer: Producer = this.kafka.producer();
  private readonly logger = new Logger(ProducerService.name);

  async onModuleInit() {
    try {
      await this.producer.connect();
      this.logger.log('Kafka producer connected');
    } catch (error) {
      this.logger.error('Failed to connect Kafka producer', error);
    }
  }

  async produce(record: ProducerRecord) {
    try {
      await this.producer.send(record);
      this.logger.log(`Message sent to topic ${record.topic}`);
    } catch (error) {
      this.logger.error(`Failed to send message to topic ${record.topic}`, error);
    }
  }

  async onApplicationShutdown() {
    try {
      await this.producer.disconnect();
      this.logger.log('Kafka producer disconnected');
    } catch (error) {
      this.logger.error('Failed to disconnect Kafka producer', error);
    }
  }
}
