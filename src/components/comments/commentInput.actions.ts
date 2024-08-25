"use server"


import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import {GetPost} from "@/app/(public)/posts/[post]/actions";
import {SendCommentUpdate} from "@/app/(actions)/send-comment-update";

interface SubmitCommentDto {
    body: string;
    media: {
        name: string;
        size: number;
        mime: string;
        url: string;
    }[];
}

export async function SubmitComment(post_id: string, data: SubmitCommentDto){

    const session = await auth()

    if(!session?.user){
        throw new Error("You must be logged in to comment")
    }

    const comment = await prisma.comment.create({
        data: {
            body: data.body.trim(),
            created_by_id: session.user.id,
            post_id: post_id,
            media: {
                createMany: {
                    data: data.media.map((m) => ({
                        name: m.name,
                        size: m.size,
                        mime: m.mime,
                        url: m.url
                    }))
                }
            }
        }
    });

    SendCommentUpdate(post_id, {
        comment_id: comment.id,
        body: data.body,
        commenter: {
            id: session.user.id,
            name: session.user.name,
            image: session.user.image
        }
    })


    return await GetPost(post_id)

}