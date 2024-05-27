import { Injectable, Logger } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class CreateTopicService {
  private readonly kafka = new Kafka({
    clientId: 'kafka-admin-client',
    brokers: ['localhost:9092'],
  });
  private readonly admin = this.kafka.admin();
  private readonly logger = new Logger(CreateTopicService.name);

  async createTopics() {
    try {
      await this.admin.connect();

      const topicsToCreate = [
        { topic: 'RECEIVED', numPartitions: 6, replicationFactor: 1 },
        { topic: 'PREPARED', numPartitions: 6, replicationFactor: 1 },
        { topic: 'DELIVERED', numPartitions: 6, replicationFactor: 1 },
        { topic: 'COMPLETED', numPartitions: 6, replicationFactor: 1 },
      ];

      const created = await this.admin.createTopics({
        topics: topicsToCreate,
        waitForLeaders: true, // Esperar hasta que los líderes estén asignados
      });

      if (created) {
        this.logger.log('Tópicos creados exitosamente');
      } else {
        this.logger.log('Los tópicos ya existen o no se crearon');
      }
    } catch (error) {
      this.logger.error('Error al crear los tópicos', error);
    } finally {
      await this.admin.disconnect();
    }
  }
}
