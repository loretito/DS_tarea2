import { Injectable, Logger } from '@nestjs/common';
import { ProductData } from 'interface';
import { ConsumerService } from 'src/kafka/consumer.service';

@Injectable()
export class RequestStatusService {
  private readonly logger = new Logger(RequestStatusService.name);
  private readonly topics = ['COMPLETED', 'DELIVERED', 'PREPARED', 'RECEIVED'];

  constructor(private readonly consumerService: ConsumerService) {
    this.logger.log('RequestStatusService created');
    if (!this.consumerService) {
      this.logger.error('ConsumerService is not defined');
    } else {
      this.logger.log('ConsumerService is defined');
    }

    if (typeof this.consumerService.consume !== 'function') {
      this.logger.error('ConsumerService.consume is not a function');
    } else {
      this.logger.log('ConsumerService.consume is a function');
    }
  }

  async checkProductStatus(productId: string): Promise<string> {
    for (const topic of this.topics) {
      const status = await this.checkTopicForProduct(topic, productId);
      if (status) {
        return status;
      }
    }
    return 'Producto no encontrado';
  }

  private async checkTopicForProduct(
    topic: string,
    productId: string,
  ): Promise<string | null> {
    return new Promise(async (resolve) => {
      const consumerGroup = `status-check-group-${topic}`;
      await this.consumerService.consume(
        { topics: [topic] },
        {
          eachMessage: async ({ message }) => {
            const data: ProductData = JSON.parse(message.value.toString());
            this.logger.log(
              `Checking message in topic ${topic}: ${JSON.stringify(data)}`,
            );
            if (data.bd_id === +productId) {
              resolve(this.mapTopicToStatus(topic));
            }
          },
        },
        consumerGroup,
      );
      setTimeout(() => resolve(null), 10000);
    });
  }

  private mapTopicToStatus(topic: string): string {
    switch (topic) {
      case 'COMPLETED':
        return 'Completado';
      case 'DELIVERED':
        return 'Entregado';
      case 'PREPARED':
        return 'Preparado';
      case 'RECEIVED':
        return 'Recibido';
      default:
        return 'Desconocido';
    }
  }

  async testConsumeCompletedTopic() {
    this.logger.log('Testing consume of COMPLETED topic');
    await this.consumerService.consumeTopic('COMPLETED');
  }
}
