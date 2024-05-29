import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ProductData } from 'interface';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendMail(id: string, status: string, email: string, productData: ProductData): void {
    const { name, price } = productData;
    console.log('Sending email to:', email);
    //this.mailerService.sendMail({
    //  to: email, 
    //  from: 'tarea2sdtester@gmail.com',
    //  subject: `Update on Your Order ${id}`,
    //  text: `Your product with id ${id} has been updated to ${status}. Details: Name: ${name}, Price: ${price}`,
    //  html: `
    //    <div style="font-family: Arial, sans-serif; color: #333;">
    //      <div style="background-color: #028391; color: #fff; padding: 10px; text-align: center;">
    //        <h1>Product Update</h1>
    //      </div>
    //      <div style="padding: 20px;">
    //        <p>Dear Customer,</p>
    //        <p>Your product with the following details has been updated to <strong>${status}</strong>:</p>
    //        <table style="width: 100%; border-collapse: collapse;">
    //          <tr style="background-color: #f6f6f6;">
    //            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Order ID</th>
    //            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${id}</td>
    //          </tr>
    //          <tr>
    //            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Name</th>
    //            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${name}</td>
    //          </tr>
    //          <tr style="background-color: #f6f6f6;">
    //            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Price</th>
    //            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${price}</td>
    //          </tr>
    //          <tr>
    //            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Status</th>
    //            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>${status}</strong></td>
    //          </tr>
    //        </table>
    //        <p>Thank you for your business.</p>
    //        <p>Sincerely,</p>
    //        <p>The Two Tilines Team</p>
    //      </div>
    //      <div style="background-color: #028391; color: #fff; padding: 10px; text-align: center;">
    //        <p>&copy; 2024 Tarea2SD. All rights reserved.</p>
    //      </div>
    //    </div>
    //  `,
    //});
  }
}
