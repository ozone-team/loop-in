"use server"

import {Announcement, Prisma} from "@prisma/client";
import {prisma} from "@/lib/prisma";
import AnnouncementEmail from "../../../emails/announcement";
import {render} from "@react-email/render";
import {GetConfig} from "@/lib/config";
import mailer from "@/lib/mailer";

interface SendAnnouncementEmailDto {
    announcement: Announcement
}

export async function SendAnnouncementEmail({announcement}: SendAnnouncementEmailDto){
    // send email to all users

    let users = await prisma.user.findMany({})
    const {site_name, site_logo} = await GetConfig('site_name', 'site_logo');

    for(let user of users){
        // send email
        if(process.env.NODE_ENV === 'production' && user.id === announcement.created_by_id) {
            continue;
        }

        const email = await render(
            <AnnouncementEmail
                site_name={site_name}
                site_logo={site_logo}
                title={announcement.title}
                body={announcement.body}
                link={`${process.env.APP_URL}/announcements/${announcement.id}`}
                intended_for={user.email}
            />
        )

        await mailer.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: `${site_name} Announcement: ${announcement.title}`,
            html: email
        }).catch((e) => {
            console.error(e)
        });
    }

    return true;

}
