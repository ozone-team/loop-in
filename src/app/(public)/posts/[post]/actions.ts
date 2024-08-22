"use server"

import {prisma} from "@/lib/prisma";
import {auth} from "@/lib/auth";

export async function GetPost(post: string){
    return prisma.post.findFirstOrThrow({
        where: {
            id: post
        },
        include: {
            status: true,
            comments: {
                include: {
                    created_by: true
                }
            },
            created_by: true,
            media: true,
            votes: {
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    }
                }
            },
            activity: {
                include: {
                    created_by: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    }
                }
            }
        }
    });
}

export async function VoteForPost(post_id: string){
    const session = await auth()
    if(!session?.user){
        throw new Error("You must be logged in to vote")
    }

    // check if already votes
    const vote = await prisma.postVote.findFirst({
        where: {
            user_id: session.user.id,
            post_id: post_id
        }
    })

    if(vote){
        console.debug("deleting vote")
        await prisma.postVote.delete({
            where: {
                post_id_user_id: {
                    user_id: session.user.id,
                    post_id: post_id
                }
            }
        })
    } else {
        console.debug("creating vote")
        await prisma.postVote.create({
            data: {
                user_id: session.user.id,
                post_id: post_id
            }
        })
    }

    return GetPost(post_id)
}

export async function DeletePost(post_id: string){

    const session = await auth()

    if(!session?.user){
        throw new Error("You must be logged in to delete a post")
    }

    const post = await prisma.post.findFirst({
        where: {
            id: post_id
        }
    })

    if(!post){
        throw new Error("Post not found")
    }

    if(post.created_by_id !== session.user.id || !session.user.is_admin){
        throw new Error("You do not have permission to delete this post")
    }

    return prisma.post.delete({
        where: {
            id: post_id
        }
    })

}
