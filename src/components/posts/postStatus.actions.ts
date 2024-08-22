"use server"

import {prisma} from "@/lib/prisma";

export async function ListStatuses(){
    return prisma.status.findMany({
        orderBy: {
            index: 'asc'
        }
    });
}

export async function UpdatePostStatus(post_id: string, status_id: string){
    return prisma.post.update({
        where: {
            id: post_id
        },
        data: {
            status_id
        }
    });
}