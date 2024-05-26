import { Injectable, Logger } from '@nestjs/common';
import { ProductData } from 'interface';
import { ReadOnlyConsumerService } from 'src/kafka/read-only.consumer';
import { findProductById } from 'src/consumer/db-connection';

@Injectable()
export class RequestStatusService {
  private readonly logger = new Logger(RequestStatusService.name);
  private readonly topics = ['COMPLETED', 'DELIVERED', 'PREPARED', 'RECEIVED'];

  constructor(
    private readonly readOnlyConsumerService: ReadOnlyConsumerService,
  ) {
    this.logger.log('RequestStatusService created');
  }

  async checkProductStatus(productId: string): Promise<string> {
    for (const topic of this.topics) {
      const status = await this.checkTopicForProduct(topic, productId);
      if (status) {
        return `Status fetched from Kafka topics: ${status} ✅`;
      }
    }

    this.logger.log(
      `Producto no encontrado en topics. Buscando en base de datos para ID: ${productId}`,
    );
    const status = await findProductById(productId);
    if (status) {
      return `Status fetched from database: ${status} 📦`;
    }

    return 'Order not found 🛑';
  }

  private async checkTopicForProduct(
    topic: string,
    productId: string,
  ): Promise<string | null> {
    return new Promise(async (resolve) => {
      const consumerGroup = `read-only-group-${topic}-${Date.now()}`;
      await this.readOnlyConsumerService.readMessages(
        topic,
        async ({ message }) => {
          const data: ProductData = JSON.parse(message.value.toString());
          this.logger.log(
            `Checking message in topic ${topic}: ${JSON.stringify(data)}`,
          );
          if (data.bd_id === +productId) {
            resolve(this.mapTopicToStatus(topic));
          }
        },
        consumerGroup,
      );

      // Resolviendo null después de un timeout
      setTimeout(() => resolve(null), 10000);
    });
  }

  private mapTopicToStatus(topic: string): string {
    switch (topic) {
      case 'COMPLETED':
        return 'Completed';
      case 'DELIVERED':
        return 'Delivered';
      case 'PREPARED':
        return 'Prepared';
      case 'RECEIVED':
        return 'Received';
      default:
        return 'Unknown';
    }
  }
}
