import {GetConfig} from "@/lib/config";
import {render} from "@react-email/render";
import MagicLinkEmail from "../../../emails/magic-link";
import mailer from "@/lib/mailer";

interface SendMagicEmailDto {
    email: string;
    link: string;
}

export async function SendMagicEmail(data: SendMagicEmailDto){

    const {site_name, site_logo} = await GetConfig('site_name', 'site_logo');

    const html = await render(<MagicLinkEmail link={data.link} site_name={site_name} site_logo={site_logo} />);

    await mailer.sendMail({
        to: data.email,
        subject: `[${site_name}] Magic Login Link`,
        html,
        text: `Click the link below to log in: ${data.link}`
    });

}