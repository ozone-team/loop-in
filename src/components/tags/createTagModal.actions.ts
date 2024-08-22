"use server"

import {slugify} from "@/lib/slug";
import {prisma} from "@/lib/prisma";

interface CreateTagDto {
    title: string;
    color: string;
}

export async function CreateTag(data: CreateTagDto) {

    if(!data.title.trim()) {
        throw new Error("Title is required")
    }

    let id = slugify(data.title.trim());

    return prisma.tag.create({
        data: {
            id,
            title: data.title,
            color: data.color
        }
    });
}