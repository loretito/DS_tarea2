import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendMail(id: string, status: string): void {
    this.mailerService.sendMail({
      to: 'tarea2sdtester@gmail.com',
      from: 'tarea2sdtester@gmail.com',
      subject: `Update product ${id}`,
      text: `Your product with id ${id} has been updated`,
      html: `Your product with id ${id} has been updated to ${status}`,
    });
  }
}
