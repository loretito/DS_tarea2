import { Controller, Post, Body } from '@nestjs/common';
import { SendTopicService } from './sendTopic.service';
import { ProductData } from '../../interface';

@Controller()
export class AppController {
  constructor(private readonly sendTopicService: SendTopicService) {}

  @Post('/delivery-request')
  deliveryRequest(@Body() body: ProductData) {
    this.sendTopicService.deliveryRequest(body);
    return 'Pedido de entrega creado';
  }
}
