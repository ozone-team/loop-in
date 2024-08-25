"use server"

import {prisma} from "@/lib/prisma";

export async function GetBoard(id: string) {

    const board = await prisma.board.findFirst({
        where: {
            id: id
        },
    });

    if(!board) {
        throw new Error('Board not found');
    }

    const statuses = await prisma.status.findMany({
        orderBy: {
            index: 'asc'
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
                    board_id: id,
                    is_approved: true
                },
                orderBy: {
                    created_at: 'desc'
                }
            }
        }
    });

    return {
        board,
        statuses
    }
}