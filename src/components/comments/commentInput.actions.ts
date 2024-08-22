"use server"


import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function SubmitComment(post_id: string, body: string){

    const session = await auth()

    if(!session?.user){
        throw new Error("You must be logged in to comment")
    }

    return prisma.comment.create({
        data: {
            body: body,
            created_by_id: session.user.id,
            post_id: post_id
        }
    })

}