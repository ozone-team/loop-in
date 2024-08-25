"use server"

import {auth} from "@/lib/auth";
import {slugify} from "@/lib/slug";
import {prisma} from "@/lib/prisma";

interface UpdatePostDto {
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

export async function UpdatePost(id: string, data:UpdatePostDto) {

    const session = await auth();

    let slug = slugify(data.title.trim());

    // check if the slug is new
    if(id !== slug) {
        const existing = await prisma.post.findMany({
            where: {
                slug
            }
        });

        if(existing.length){
            slug = slug + "-" + (existing.length + 1)
        }
    }

    return prisma.post.update({
        data: {
            id: slug,
            title: data.title.trim(),
            description: data.content.trim(),
            category_id: data.category,
            board_id: data.board,
            updated_by_id: session?.user?.id,
            updated_at: new Date(),
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
            },
            tags: {
                deleteMany: {},
                createMany: {
                    data: data.tags.map(tag => ({
                        tag_id: tag
                    }))
                }
            },
            activity: {
                create: {
                    type: 'updated',
                    created_by_id: session?.user?.id,
                    description: `${session?.user?.name || 'Anonymous User'} updated this post`
                }
            },
        },
        where: {
            id: id
        }
    })

}