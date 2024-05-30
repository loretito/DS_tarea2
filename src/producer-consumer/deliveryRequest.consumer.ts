import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '../kafka/consumer.service';
import { ProducerService } from '../kafka/producer.service';
import { ProductData } from 'interface';
import sql from '../db/db-connection';

@Injectable()
export class DeliveryRequestConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly producerService: ProducerService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['delivery-request'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const productData: ProductData = JSON.parse(message.value.toString());
          productData.status = 'RECEIVED';

          // Guardar en la base de datos
          const orderId = await this.saveProduct(productData);

          // Reorganizar el objeto productData para que bd_id esté al principio
          const productWithIdFirst = {
            bd_id: orderId,
            name: productData.name,
            price: productData.price,
            email: productData.email,
            status: productData.status,
          };

          // Enviar al topic 'RECEIVED'
          await this.sendToReceivedTopic(productWithIdFirst);

          console.log({
            order_id: orderId,
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
    try {
      console.log(`Momento guardar: ${name}`);
      const result = await sql`
        INSERT INTO "order" (product_name, price, email, "status")
        VALUES (${name}, ${price}, ${email}, ${status})
        returning bd_id;
      `;
      const id = result[0].bd_id;
      console.log(`Recibido producto: ${name}`);
      return id;
    } catch (error) {
      console.error(`Error saving product: ${error}`);
    }
  }

  private async sendToReceivedTopic(product: ProductData) {
    try {
      await this.producerService.produce({
        topic: 'RECEIVED',
        messages: [{ value: JSON.stringify(product) }],
      });
      console.log(`Producto enviado al topic 'RECEIVED': ${product.name}`);
    } catch (error) {
      console.error(`Error sending product to RECEIVED topic: ${error}`);
    }
  }
}
