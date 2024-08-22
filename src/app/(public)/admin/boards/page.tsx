import {prisma} from "@/lib/prisma";
import BoardSettingsPageClient from "@/app/(public)/admin/boards/page.client";


const BoardsSettingsPage = async () => {

    const boards = await prisma.board.findMany({
        orderBy: {
            index: 'asc'
        }
    });

    return (
        <BoardSettingsPageClient boards={boards}/>
    )

}

export default BoardsSettingsPage;