"use server"

import {GetConfig} from "@/lib/config";
import {prisma} from "@/lib/prisma";
import {render} from "@react-email/render";
import PostUpdate from "../../../emails/post-update";
import mailer from "@/lib/mailer";
import PostCommentEmail from "../../../emails/post-comment";

interface CommentUpdateDto {
    comment_id: number;
    body: string;
    commenter: {
        id: string;
        name: string;
        image: string;
    };
}

export async function SendCommentUpdate(post_id: string, data:CommentUpdateDto){

    const {site_name, site_logo} = await GetConfig('site_name', 'site_logo');

    const post = await prisma.post.findFirst({
        where: {
            id: post_id
        },
    });

    if(!post){
        throw new Error('Post not found');
    }

    let watches = await prisma.postWatches.findMany({
        select: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                },
            }
        },
        where: {
            post_id: post_id
        }
    });

    for(let watch of watches) {

        if(process.env.NODE_ENV === 'production' && watch.user.id === data.commenter.id) {
            continue;
        }

        const email = await render(<PostCommentEmail
                site_name={site_name}
                site_logo={site_logo}
                title={`${data.commenter.name} commented on "${post.title}"`}
                body={data.body}
                link={`${process.env.APP_URL}/posts/${post_id}#comment-${data.comment_id}`}
                intended_for={watch.user.email}
                preview={`${data.commenter.name} commented "${data.body}"`}
                commenter_image={data.commenter.image}
                commenter_name={data.commenter.name}
            />
        )

        await mailer.sendMail({
            to: watch.user.email,
            subject: `[${site_name}] ${data.commenter.name} commented on "${post.title}"`,
            html: email,
            text: data.body,
        }).catch((e) => {
            console.error(e)
        });

    }

}