"use client"

import {Board, Prisma, Status} from "@prisma/client";
import StatusColumn from "@/components/boards/statusColumn";
import {StatusWithPosts} from "@/types/status";
import {useQuery} from "@tanstack/react-query";
import {GetBoard} from "@/app/(public)/board/[board]/actions";
import {useState} from "react";
import {useLocalStorage} from "usehooks-ts";
import {Divider, Tab, Tabs} from "@nextui-org/react";
import {IconLayoutKanban, IconLayoutList} from "@tabler/icons-react";
import StatusSection from "@/components/boards/statusSection";


interface BoardPageClientProps {
    board: Board;
    statuses: StatusWithPosts[];
}


export const BoardPageClient = (props: BoardPageClientProps) => {

    const [view, setView] = useLocalStorage<'list' | 'kanban'>('board-view', 'kanban');

    const {data} = useQuery({
        queryKey: ['board', props.board.id],
        queryFn: async () => {
            return await GetBoard(props.board.id)
        },
        initialData: props,
        refetchInterval: 30000,
        refetchOnWindowFocus: true,
        refetchOnMount: true
    })

    return (
        <main className={'container p-4'}>
            <div className={'w-full flex flex-row justify-between py-2 items-center'}>
                <h1>{data.board.title}</h1>
                <Tabs
                    size={'sm'}
                    selectedKey={view}
                    onSelectionChange={(key) => setView(key as 'list' | 'kanban')}
                >
                    <Tab title={(<IconLayoutKanban size={18} />)} key={'kanban'} />
                    <Tab title={(<IconLayoutList size={18} />)} key={'list'} />
                </Tabs>
            </div>
            {
                view === 'kanban' ? (
                    <div className={'grid grid-cols-3 gap-4 items-start justify-center'}>
                        {
                            data.statuses.map((status) => (
                                <StatusColumn
                                    key={status.id}
                                    status={status}
                                />
                            ))
                        }
                    </div>
                ) : (
                    <div className={'flex flex-col space-y-2'}>
                        {
                            data.statuses.map((status) => (
                                <StatusSection
                                    key={status.id}
                                    status={status}
                                />
                            ))
                        }
                    </div>
                )
            }

        </main>

    )

}


export default BoardPageClient