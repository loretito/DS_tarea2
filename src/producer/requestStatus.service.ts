import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
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
          await this.mailService.sendMail(
            data.bd_id.toString(),
            status,
            data.email.trim(),
            data,
          ); // Asegúrate de que el correo esté limpio
          this.logger.log(`Correo enviado: ${data.bd_id} - ${status}`);
        },
        `monitor-group-${topic}`,
      );
    }
  }

  async checkProductStatus(
    productId: number,
  ): Promise<{ message: string; status: string; statusCode: number }> {
    for (const topic of this.topics) {
      const status = await this.checkTopicForProduct(
        topic,
        productId.toString(),
      );

      if (status) {
        const productData = await this.getProductDetailsFromKafka(
          topic,
          productId.toString(),
        );
        if (productData) {
          await this.mailService.sendMail(
            productData.bd_id.toString(),
            status,
            productData.email.trim(),
            productData,
          ); // Asegúrate de que el correo esté limpio
          return {
            message: `Status fetched from Kafka topics: ${status} 🖥️✅`,
            status: 'Found',
            statusCode: 200,
          };
        }
      }
    }

    this.logger.log(
      `Producto no encontrado en topics. Buscando en base de datos para ID: ${productId}`,
    );
    const product = await findProductById(productId);
    //console.log('findProductById result:', JSON.stringify(product, null, 2)); // Aquí imprimes el objeto
    const status = product.status; // Aquí accedes a la propiedad status
    const email = product.email; // Aquí accedes a la propiedad email
    const name = product.product_name; // Aquí accedes a la propiedad product_name
    const id = product.bd_id; // Aquí accedes a la propiedad bd_id
    const price = product.price; // Aquí accedes a la propiedad price
    if (status) {
      await this.mailService.sendMail(id.toString(), status, email.trim(), {
        bd_id: id,
        name,
        price,
        email,
        status,
      }); // Asegúrate de que el correo esté limpio
      return {
        message: `Status fetched from database: ${status} 📂`,
        status: 'Found',
        statusCode: 200,
      };
    }

    throw new NotFoundException({
      message: 'Order not found 🛑',
      status: 'Not Found',
      statusCode: 404,
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

  private async getProductDetailsFromKafka(
    topic: string,
    productId: string,
  ): Promise<ProductData | null> {
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
