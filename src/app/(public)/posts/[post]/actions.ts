"use server"

import {prisma} from "@/lib/prisma";
import {auth} from "@/lib/auth";
import {SendPostUpdate} from "@/app/(actions)/send-post-update";
import {GetConfig} from "@/lib/config";

export async function GetPost(post: string){
    return prisma.post.findFirstOrThrow({
        where: {
            id: post
        },
        include: {
            status: true,
            comments: {
                include: {
                    created_by: true,
                    media: true,
                    votes: {
                        select: {
                            user_id: true
                        }
                    }
                }
            },
            category: true,
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
            },
            watching: {
                select: {
                    user_id: true
                }
            },
            tags: {
                select: {
                    tag: true
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

export async function ChangePostStatus(post_id: string, status: string) {

    const session = await auth()
    if(!session?.user) {
        throw new Error("You must be logged in to change the status of a post");
    }

    if(!session.user.is_admin) {
        throw new Error("You must be an admin to change the status of a post");
    }

    const post = await prisma.post.findFirst({
        include: {
            status: true
        },
        where: {
            id: post_id
        }
    })

    if(!post) {
        throw new Error("Post not found");
    }

    if(post.status_id === status) {
        throw new Error("Post is already in this status");
    }

    const newStatus = await prisma.status.findFirstOrThrow({
        where: {
            id: status
        },
    });

    await prisma.post.update({
        where: {
            id: post_id
        },
        data: {
            status_id: status,
            activity: {
                create: {
                    type: 'status',
                    created_by_id: session.user.id,
                    description: `${session.user.name} changed the status to ${newStatus.title}`
                }
            }
        }
    })



    SendPostUpdate(post_id, {
        title: `Update to post "${post.title}"`,
        body: `The status of post "${post.title}" has been changed to <strong style="color:${newStatus.color}">${newStatus.title}</strong>`,
    })

    return newStatus;

}

export async function WatchPost(post_id: string) {

    const session = await auth()

    if(!session?.user) {
        throw new Error("You must be logged in to watch a post");
    }

    const alreadyWatching = await prisma.postWatches.findFirst({
        where: {
            post_id: post_id,
            user_id: session.user.id
        }
    })

    if(alreadyWatching){
        await prisma.postWatches.delete({
            where: {
                post_id_user_id: {
                    post_id: post_id,
                    user_id: session.user.id
                }
            }
        })
    } else {
        await prisma.postWatches.create({
            data: {
                post_id: post_id,
                user_id: session.user.id
            }
        })
    }

    return GetPost(post_id)

}