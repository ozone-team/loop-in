"use server"
import {Prisma} from "@prisma/client";

import {prisma} from "@/lib/prisma";
import {PostListItem} from "@/types/posts";

interface ListPostsOptions {
    statuses?: string[];
    board?: string;
    page?: number;
}

export async function ListPosts(options?: ListPostsOptions){

    let where: Prisma.PostWhereInput = {};

    if(options?.board){
        where.board_id = options.board;
    }

    if(options?.statuses?.length){
        where.status = {
            id: {
                in: options.statuses
            }
        }
    }

    const params:Prisma.PostFindManyArgs = {
        where: where,
        orderBy: {
            created_at: 'desc'
        },
        include: {
            status: true,
            category: true,
            created_by: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            },
            media: true,
            votes: {
                select: {
                    user_id: true
                }
            },
            tags: {
                select: {
                    tag: true
                }
            }
        },
        take: 10,
        skip: options?.page ? (options.page * 10) : 0
    }

    const posts = await prisma.post.findMany(params);

    return posts as PostListItem[];

}