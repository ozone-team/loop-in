import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {GetConfig} from "@/lib/config";
import BoardPageClient from "@/app/(public)/board/[board]/page.client";

export const generateMetadata = async (props: { params: { board: string } }) => {

    const {site_name} = await GetConfig('site_name');

    const board = await prisma.board.findFirst({
        where: {
            id: props.params.board
        }
    });

    if (!board) {
        return {
            title: "Board not found"
        }
    }

    return {
        title: board.title + " | " + site_name
    }
}

const BoardPage = async (props: { params: { board: string } }) => {

    const board = await prisma.board.findFirst({
        where: {
            id: props.params.board
        },
    });

    if (!board) {
        return notFound()
    }

    const statuses = await prisma.status.findMany({
        orderBy: {
            index: 'asc'
        },
        include: {
            posts: {
                include: {
                    category: true,
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
                    board_id: board.id
                },
                orderBy: {
                    created_at: 'desc'
                }
            }
        }
    });

    console.log(statuses);


    return (
        <BoardPageClient
            board={board}
            statuses={statuses}
        />
    )
}

export default BoardPage