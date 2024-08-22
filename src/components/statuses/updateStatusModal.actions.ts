"use server"

import {prisma} from "@/lib/prisma";
import {slugify} from "@/lib/slug";

interface UpdateStatusDto {
    title: string;
    color: string;
    isDefault: boolean;
    showInRoadmap: boolean;
}

export async function UpdateStatus(id: string, data:UpdateStatusDto){

    if(!data.title.trim()){
        throw new Error("Title is required");
    }

    const status = await prisma.status.update({
        data: {
            id: slugify(data.title.trim()),
            title: data.title,
            color: data.color,
            is_default: data.isDefault,
            show_in_roadmap: data.showInRoadmap
        },
        where: {
            id: id
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

}

export async function DeleteStatus(id: string){
    await prisma.status.delete({
        where: {
            id: id
        }
    })
}