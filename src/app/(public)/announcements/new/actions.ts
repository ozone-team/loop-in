"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import {SendAnnouncementEmail} from "@/app/(actions)/send-announcement-email";

interface AnnouncementDto {
    title: string;
    content: string;
    content_plain: string;
}

export async function PublishAnnouncement(data: AnnouncementDto){

    let id = slugify(data.title.trim())

    const session = await auth()

    if(!session?.user?.is_admin){
        throw new Error('Unauthorized')
    }

    const announcement = await prisma.announcement.create({
        data: {
            id,
            title: data.title,
            body: data.content,
            body_plain: data.content_plain,
            created_by_id: session?.user?.id
        },
    });

    SendAnnouncementEmail({announcement}).then(() => {
        console.log('Email sent')
    }).catch((e) => {
        console.error(e)
    })

    return announcement;


}