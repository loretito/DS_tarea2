import { Controller, Get } from '@nestjs/common';
import { MailService } from './mailer.service';

@Controller()
export class MailerController {
  constructor(private readonly mailService: MailService) {}

  @Get('/send-email')
  sendEmail(): void {
    return this.mailService.sendMail();
  }
}
