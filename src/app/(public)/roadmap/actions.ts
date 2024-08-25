"use server"

import {prisma} from "@/lib/prisma";
import {RoadmapStatus} from "@/types/posts";

export async function GetRoadmap(){
    const statuses = await prisma.status.findMany({
        where: {
            show_in_roadmap: true,
        },
        include: {
            posts: {
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
                },
                where: {
                    board: {
                        show_in_roadmap: true
                    },
                    is_approved: true,
                }
            }
        },
        orderBy: {
            index: 'asc'
        }
    })

    return statuses as RoadmapStatus[]
}