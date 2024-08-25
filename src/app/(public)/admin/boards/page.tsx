import {prisma} from "@/lib/prisma";
import BoardSettingsPageClient from "@/app/(public)/admin/boards/page.client";
import {GetConfig} from "@/lib/config";

export async function generateMetadata() {

    const {site_name} = await GetConfig('site_name');

    return {
        title: `Boards | ${site_name}`
    }

}

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