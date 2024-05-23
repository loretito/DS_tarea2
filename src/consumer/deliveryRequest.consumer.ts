import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '../kafka/consumer.service';
import { ProductData } from 'interface';
//import sql from './db-connection';

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
          // await this.saveProduct(productData);
          console.log({
            value: message.value.toString(),
            topic: topic.toString(),
            partition: partition.toString(),
          });
        },
      },
    );
  }
  // private async saveProduct(product: ProductData) {
  //   const { name, price, email, status } = product;
  //   try {
  //     await sql`
  //     INSERT INTO "order" (product_name, price, email, status)
  //     VALUES (${name}, ${price}, ${email}, ${status});
  //   `;
  //     console.log(`Recibido producto: ${name}`);
  //   } catch (error) {
  //     console.error(`Error saving product: ${error}`);
  //   }
  // }
}
