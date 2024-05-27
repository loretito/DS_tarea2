import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SendTopicService } from './sendTopic.service';
import { ProductData } from '../../interface';
import { RequestStatusService } from './requestStatus.service';

@Controller()
export class AppController {
  constructor(
    private readonly sendTopicService: SendTopicService,
    private readonly requestStatusService: RequestStatusService,
  ) {}

  @Post('/delivery-request')
  deliveryRequest(@Body() body: ProductData) {
    this.sendTopicService.deliveryRequest(body);
    return 'Pedido de entrega creado';
  }

  @Get('/status/:id')
  async getStatus(@Param('id') id: string) {
    return await this.requestStatusService.checkProductStatus(id);
  }

  //  @Get('/test')
  //  async testComsumeCompleted() {
  //    await this.requestStatusService.testConsumeCompletedTopic();
  //    return 'Consumed Completed topic';
  //  }
}
