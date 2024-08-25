import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {GetConfig} from "@/lib/config";
import BoardPageClient from "@/app/(public)/board/[board]/page.client";
import {GetBoard} from "@/app/(public)/board/[board]/actions";

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

    const {board, statuses} = await GetBoard(props.params.board);

    if (!board) {
        return notFound()
    }

    return (
        <BoardPageClient
            board={board}
            statuses={statuses}
        />
    )
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default BoardPage