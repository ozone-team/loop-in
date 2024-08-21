import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";

export const generateMetadata = async (props: { params: { board: string } }) => {

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
        title: board.title
    }
}

const BoardPage = async (props: { params: { board: string } }) => {

    const board = await prisma.board.findFirst({
        where: {
            id: props.params.board
        }
    });

    if (!board) {
        return notFound()
    }

    return (
        <div>
            <h1>{board.title}</h1>
        </div>
    )
}

export default BoardPage