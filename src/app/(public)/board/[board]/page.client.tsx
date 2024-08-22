"use client"

import {Board, Prisma, Status} from "@prisma/client";
import StatusColumn from "@/components/boards/statusColumn";
import {StatusWithPosts} from "@/types/status";


interface BoardPageClientProps {
    board: Board;
    statuses: StatusWithPosts[];
}


export const BoardPageClient = (props: BoardPageClientProps) => {

    return (
        <main className={'container p-4'}>
            <div className={'grid grid-cols-3 gap-4 items-start justify-center'}>
                {
                    props.statuses.map((status) => (
                        <StatusColumn
                            key={status.id}
                            status={status}
                        />
                    ))
                }
            </div>
        </main>

    )

}



export default BoardPageClient