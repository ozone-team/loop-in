"use server"

import {prisma} from "@/lib/prisma";
import {slugify} from "@/lib/slug";
import {auth} from "@/lib/auth";
import {GetConfig} from "@/lib/config";

export async function GetBoardsWithCategories(){
    return prisma.board.findMany({
        orderBy: {
            index: 'asc'
        },
        include: {
            categories: true
        }
    });
}

interface CreatePostDto {
    title: string;
    content: string;
    board: string;
    category?: string;
    media: {
       name: string;
       size: number;
       mime: string;
       url: string;
    }[];
    tags: string[];
}

export async function CreatePost(data: CreatePostDto){
    // Create a new post

    const session = await auth();

    let slug = slugify(data.title.trim());

    const statuses = await prisma.status.findMany();

    const status = statuses.find(status => status.is_default) || statuses[0];

    // check if there are any posts with the same title (& therefore slug)
    const existing = await prisma.post.findMany({
        where: {
            title: data.title.trim()
        }
    });

    if(existing.length){
        slug = slug + "-" + (existing.length + 1)
    }

    const {moderation} = await GetConfig('moderation');

    let isApproved = () => {
        switch (moderation){
            case 'approve-all': return true;
            case 'approve-none': return false;
            case 'approve-users': return Boolean(session?.user);
            default: return true;
        }
    }

    return prisma.post.create({
        data: {
            id: slug,
            title: data.title.trim(),
            description: data.content.trim(),
            category_id: data.category,
            board_id: data.board,
            created_by_id: session?.user?.id,
            media: {
                createMany: {
                    data: data.media.map((m) => ({
                        name: m.name,
                        size: m.size,
                        mime: m.mime,
                        url: m.url
                    }))
                }
            },
            status_id: status.id,
            tags: {
                createMany: {
                    data: data.tags.map(tag => ({
                        tag_id: tag
                    }))
                }
            },
            activity: {
                create: {
                    type: 'create',
                    created_by_id: session?.user?.id,
                    description: `${session?.user?.name || 'Anonymous User'} created this post`
                }
            },
            watching: session?.user?.id ? {
                create: {
                    user_id: session?.user?.id
                }
            } : undefined,
            is_approved: isApproved()
        }
    });
}

export async function ListTags(){
    return prisma.tag.findMany();
}