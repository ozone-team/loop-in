"use server"

import {prisma} from "@/lib/prisma";
import {slugify} from "@/lib/slug";

export async function GetBoardDetails(board: string) {
    return prisma.board.findFirst({
        include: {
            categories: true,
        },
        where: {
            id: board
        }
    });
}

interface SaveBoardDto {
    title: string;
    description: string;
    categories: string[];
    showInRoadmap: boolean;
}

export async function SaveBoard(board: string, data: SaveBoardDto) {

    if(!data.title.trim()){
        throw new Error("Title is required")
    }

    const boards = await prisma.board.findMany();

    return prisma.board.update({
        where: {
            id: board
        },
        data: {
            id: slugify(data.title),
            title: data.title,
            description: data.description,
            categories: {
                deleteMany: {},
                createMany: {
                    data: data.categories.map((c) => ({
                        id: slugify(c),
                        title: c
                    }))
                }
            },
            index: boards.length,
            show_in_roadmap: data.showInRoadmap
        }
    });
}


export async function DeleteBoard(board_id: string){
    return prisma.board.delete({
        where: {
            id: board_id
        }
    })
}
