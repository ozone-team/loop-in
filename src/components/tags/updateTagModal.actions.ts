"use server"

import {prisma} from "@/lib/prisma";

interface UpdateTagDto {
    title: string;
    color: string;
}

export async function UpdateTag(id: string, data: UpdateTagDto) {

    return prisma.tag.update({
        where: {
            id
        },
        data
    });

}