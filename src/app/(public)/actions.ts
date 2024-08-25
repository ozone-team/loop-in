"use server"

import {prisma} from "@/lib/prisma";

export async function GetLatestPosts(){

    const posts = await prisma.post.findMany({
        orderBy: {
            created_at: 'desc'
        },
        take: 5,
        include: {
            category: true,
            board: {
                select: {
                    id: true,
                    title: true
                }
            },
            status: {
                select: {
                    id: true,
                    title: true,
                    color: true,
                }
            },
            tags: {
                select: {
                    tag: true
                }
            },
            created_by: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        }
    });

    return posts;

}

export async function GetLatestAnnouncements() {
    const announcements = await prisma.announcement.findMany({
        orderBy: {
            created_at: 'desc'
        },
        take: 5,
        include: {
            created_by: true
        }
    })
    return announcements
}