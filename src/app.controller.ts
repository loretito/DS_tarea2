import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SendTopicService } from './producer/sendTopic.service';
import { ProductData } from '../interface';
import { RequestStatusService } from './producer/requestStatus.service';

@Controller()
export class AppController {
  constructor(
    private readonly sendTopicService: SendTopicService,
    private readonly requestStatusService: RequestStatusService,
  ) {}

  @Post('/delivery-request')
  async deliveryRequest(@Body() body: ProductData) {
    await this.sendTopicService.deliveryRequest(body);
    return 'Pedido de entrega creado';
  }

  @Get('/status/:id')
  async getStatus(@Param('id') id: string) {
    return await this.requestStatusService.checkProductStatus(+id);
  }
}
