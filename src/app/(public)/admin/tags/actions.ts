"use server"

import {prisma} from "@/lib/prisma";

export async function GetTags(){
    return prisma.tag.findMany({
        orderBy: {
            title: 'asc'
        }
    })
};