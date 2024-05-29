import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ProductData } from 'interface';
import { ReadOnlyConsumerService } from 'src/kafka/read-only.consumer';
import { findProductById } from 'src/consumer/db-connection';
import { MailService } from 'src/mailer/mailer.service';

@Injectable()
export class RequestStatusService implements OnModuleInit {
  private readonly logger = new Logger(RequestStatusService.name);
  private readonly topics = ['COMPLETED', 'DELIVERED', 'PREPARED', 'RECEIVED'];

  constructor(
    private readonly readOnlyConsumerService: ReadOnlyConsumerService,
    private readonly mailService: MailService,
  ) {
    this.logger.log('RequestStatusService created');
  }

  async onModuleInit() {
    this.monitorTopics();
  }

  private async monitorTopics() {
    for (const topic of this.topics) {
      this.readOnlyConsumerService.readMessages(
        topic,
        async ({ message }) => {
          const data: ProductData = JSON.parse(message.value.toString());
          const status = this.mapTopicToStatus(topic);
          await this.mailService.sendMail(data.bd_id.toString(), status, data.email, data);
          this.logger.log(`Correo enviado: ${data.bd_id} - ${status}`);
        },
        `monitor-group-${topic}`,
      );
    }
  }

  async checkProductStatus(productId: string): Promise<{message: string, status: string, statusCode: number}> {
    for (const topic of this.topics) {
      const status = await this.checkTopicForProduct(topic, productId);
      
      if (status) {
        const productData = await this.getProductDetailsFromKafka(topic, productId);
        if (productData) {
          await this.mailService.sendMail(productData.bd_id.toString(), status, productData.email, productData);
        }
        return {
          message: `Status fetched from Kafka topics: ${status} 🖥️✅`,
          status: 'Found',
          statusCode: 200
        };
      }
    }

    this.logger.log(
      `Producto no encontrado en topics. Buscando en base de datos para ID: ${productId}`,
    );
    const productData = await findProductById(productId);
    if (productData) {
      await this.mailService.sendMail(productData.bd_id.toString(), productData.status, productData.email, productData);
      return {
        message: `Status fetched from database: ${productData.status} 📂`,
        status: 'Found',
        statusCode: 200
      };
    }

    throw new NotFoundException({
      message: 'Order not found 🛑',
      status: 'Not Found',
      statusCode: 404
    });
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
          if (data.bd_id === +productId) {
            resolve(this.mapTopicToStatus(topic));
          }
        },
        consumerGroup,
      );

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

  private async getProductDetailsFromKafka(topic: string, productId: string): Promise<ProductData | null> {
    return new Promise(async (resolve) => {
      const consumerGroup = `read-only-group-${topic}-details-${Date.now()}`;
      await this.readOnlyConsumerService.readMessages(
        topic,
        async ({ message }) => {
          const data: ProductData = JSON.parse(message.value.toString());
          if (data.bd_id === +productId) {
            resolve(data);
          }
        },
        consumerGroup,
      );

      setTimeout(() => resolve(null), 10000);
    });
  }
}
