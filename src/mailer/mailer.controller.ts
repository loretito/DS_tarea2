import { Controller, Get } from '@nestjs/common';
import { timeout } from 'rxjs';
import { MonitorEmailTopicService } from 'src/producer/monitorEmailTopic.service';

@Controller()
export class MailerController {
  constructor(private readonly monitorEmailTopic: MonitorEmailTopicService) {}

  @Get('/send-email')
  async sendEmail(): Promise<void> {
    timeout(2000);
    await this.monitorEmailTopic.monitorTopics();
    setTimeout(() => {
      process.exit(0);
    }, 5000);
  }
}
