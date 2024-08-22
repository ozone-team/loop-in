"use server"

import {prisma} from "@/lib/prisma";
import {slugify} from "@/lib/slug";

interface CreateBoardDto {
    title: string;
    description: string;
    categories: string[];
    showInRoadmap: boolean;
}

export async function CreateBoard(data: CreateBoardDto) {

    const id = slugify(data.title);

    const boards = await prisma.board.findMany();

    return prisma.board.upsert({
        create: {
            id: id,
            title: data.title.trim(),
            description: data.description.trim(),
            categories: {
                createMany: {
                    data: data.categories.map(category => ({
                        id: id,
                        title: category.trim()
                    }))
                }
            },
            show_in_roadmap: data.showInRoadmap,
            index: boards.length
        },
        update: {
            title: data.title.trim(),
            description: data.description.trim(),
            categories: {
                deleteMany: {},
                createMany: {
                    data: data.categories.map(category => ({
                        id: id,
                        title: category.trim()
                    }))
                }
            },
            show_in_roadmap: data.showInRoadmap
        },
        where: {
            id: id
        },
        include: {
            categories: true
        }
    })

}