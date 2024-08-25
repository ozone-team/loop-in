import * as nodemailer from 'nodemailer';

export class Mailer {

    private config = {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD
        },
        from: process.env.EMAIL_FROM
    }

    private transporter = nodemailer.createTransport(this.config);

    public async sendMail(options: nodemailer.SendMailOptions) {
        options.from = this.config.from;
        return await this.transporter.sendMail(options);
    }

}

const mailer = new Mailer();

export default mailer;