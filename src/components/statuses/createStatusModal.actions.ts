"use server"

import {prisma} from "@/lib/prisma";
import {slugify} from "@/lib/slug";

interface CreateStatusDto {
    title: string;
    color: string;
    isDefault: boolean;
    showInRoadmap: boolean;
}

export async function CreateStatus(data: CreateStatusDto) {

    if(!data.title.trim()){
        throw new Error("Title is required");
    }

    const statuses = await prisma.status.findMany();

    const status = await prisma.status.upsert({
        create: {
            id: slugify(data.title),
            title: data.title,
            color: data.color,
            is_default: data.isDefault,
            index: statuses.length,
            show_in_roadmap: data.showInRoadmap
        },
        update: {
            title: data.title,
            color: data.color,
            is_default: data.isDefault,
        },
        where: {
            id: slugify(data.title)
        }
    });

    if(data.isDefault){
        await prisma.status.updateMany({
            where: {
                id: {
                    not: status.id,
                }
            },
            data: {
                is_default: false
            }
        })
    }

    return status;

}