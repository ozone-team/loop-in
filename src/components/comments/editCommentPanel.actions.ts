"use server"

import {prisma} from "@/lib/prisma";
import {auth} from "@/lib/auth";

interface UpdateCommentDto {
    body: string;
    media: {
        name: string;
        size: number;
        mime: string;
        url: string;
    }[];
}

export async function UpdateComment(comment_id: number, data: UpdateCommentDto){

    const session = await auth();

    if(!session?.user){
        throw new Error("You must be logged in to update your comment")
    }

    let comment = await prisma.comment.findFirst({
        where: {
            id: comment_id
        }
    });

    if(!comment){
        throw new Error("Comment not found");
    }

    if(comment.created_by_id !== session.user.id){
        throw new Error("You can only update your own comments");
    }

    let updated = await prisma.comment.update({
        data: {
            body: data.body,
            updated_at: new Date(),
            updated_by: {
                connect: {
                    id: session.user.id
                }
            },
            media: {
                deleteMany: {},
                createMany: {
                    data: data.media.map((m) => ({
                        name: m.name,
                        size: m.size,
                        mime: m.mime,
                        url: m.url
                    }))
                }
            }
        },
        where: {
            id: comment_id
        },
        include: {
            created_by: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            },
            votes: {
                select: {
                    user_id: true
                }
            },
            media: true
        }
    });

    return updated;

}