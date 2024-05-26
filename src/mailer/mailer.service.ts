import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendMail(): void {
    this.mailerService.sendMail({
      to: 'tarea2sdtester@gmail.com',
      from: 'tarea2sdtester@gmail.com',
      subject: 'Update',
      text: 'This is an update',
      html: '<b>This is an update</b>',
    });
  }
}
