import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '../kafka/consumer.service';
import { ProductData } from 'interface';
import sql from './db-connection';

@Injectable()
export class DeliveryRequestConsumer implements OnModuleInit {
  constructor(private readonly consumerService: ConsumerService) {}

  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['delivery-request'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const productData: ProductData = JSON.parse(message.value.toString());
          productData.status = 'RECEIVED';
          const order = await this.saveProduct(productData);

          console.log({
            order_id: order,
            value: message.value.toString(),
            topic: topic.toString(),
            partition: partition.toString(),
          });
        },
      },
    );
  }
  private async saveProduct(product: ProductData) {
    const { name, price, email, status } = product;
    console.log('holaa');
    try {
      console.log(`Momento guardar: ${name}`);
      const id = await sql`
      INSERT INTO "order" (product_name, price, email, "status")
      VALUES (${name}, ${price}, ${email}, ${status})
      returning bd_id;
    `;
      console.log(`Recibido producto: ${name}`);

      return id;
    } catch (error) {
      console.error(`Error saving product: ${error}`);
    }
  }
}
