"use server"

import {prisma} from "@/lib/prisma";
import {render} from "@react-email/render";
import PostUpdate from "../../../emails/post-update";
import {GetConfig} from "@/lib/config";
import mailer from "@/lib/mailer";

interface PostUpdateDto {
    title: string;
    body: string;
}

export async function SendPostUpdate(id: string, data: PostUpdateDto){

    const config = await GetConfig()

    let watches = await prisma.postWatches.findMany({
        select: {
            user: {
                select: {
                    name: true,
                    email: true
                },
            }
        },
        where: {
            post_id: id
        }
    });

    const {site_name, site_logo} = await GetConfig('site_name', 'site_logo');


    for(let watch of watches) {
        const email = await render(<PostUpdate
                site_name={site_name}
                site_logo={site_logo}
                title={data.title}
                body={data.body}
                link={`${process.env.APP_URL}/posts/${id}`}
                intended_for={watch.user.email}
                preview={data.title + ', ' + data.body}
            />
        )

        await mailer.sendMail({
            to: watch.user.email,
            subject: `[${config.site_name}] ${data.title}`,
            html: email,
            text: data.body,
        })

    }



}