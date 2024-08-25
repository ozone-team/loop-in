"use server"

import {prisma} from "@/lib/prisma";
import {auth} from "@/lib/auth";

export async function LikeComment(comment_id: number) {

    const session = await auth();

    if (!session?.user) {
        throw new Error("You must be logged in to like a comment");
    }

    // check if already liked
    const liked = await prisma.commentVote.findFirst({
        where: {
            comment_id,
            user_id: session.user.id
        }
    });

    if(liked) {
        await prisma.commentVote.delete({
            where: {
                comment_id_user_id: {
                    comment_id,
                    user_id: session.user.id
                }
            }
        });
    } else {
        await prisma.commentVote.create({
            data: {
                user_id: session.user.id,
                comment_id
            }
        });
    }

    return !liked;

}