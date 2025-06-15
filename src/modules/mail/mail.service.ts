import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER, // 보내는 이메일
      pass: process.env.MAIL_PASS, // 앱 비밀번호
    },
  });

  async sendVerificationCode(email: string, code: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"예약 시스템" <${process.env.MAIL_USER}>`,
        to: email,
        subject: '비밀번호 재설정 인증 코드',
        html: `
                <div>
                  <p><b>인증 코드:</b> ${code}</p>
                  <p>이 코드는 5분 동안 유효합니다.</p>
                </div>
              `,
      });
      console.log('Email sent: ', info.response);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('이메일 전송에 실패했습니다.');
    }
  }
}
