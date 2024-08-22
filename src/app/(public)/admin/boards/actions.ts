"use server"

import {prisma} from "@/lib/prisma";

export async function GetBoards(){
    return prisma.board.findMany({
        orderBy: {
            index: 'asc'
        }
    });
}

export async function UpdateBoardOrder(boards:{id: string, index: number}[]){
    for (const board of boards) {
        await prisma.board.update({
            where: {
                id: board.id
            },
            data: {
                index: board.index
            }
        });
    }
    return GetBoards();
}