"use client"

import {Board} from "@prisma/client";
import {keepPreviousData, useMutation, useQuery} from "@tanstack/react-query";
import {GetBoards, UpdateBoardOrder} from "@/app/(public)/admin/boards/actions";
import {useEffect, useState} from "react";
import {createSwapy} from "swapy";
import queryClient from "@/lib/queryClient";
import {IconGridDots} from "@tabler/icons-react";
import {Button, useDisclosure} from "@nextui-org/react";
import CreateBoardModal from "@/components/boards/createBoardModal";
import UpdateBoardModal from "@/components/boards/updateBoardModal";

interface BoardSettingsPageClientProps {
    boards: Board[];
}

const BoardSettingsPageClient = (props: BoardSettingsPageClientProps) => {

    const {isOpen: createBoardOpen, onClose: closeCreateBoard, onOpen: openCreateBoard} = useDisclosure()
    const [selectedBoard, setSelectedBoard] = useState<Board|undefined>()

    const {data: boards, isPending: isLoadingBoards} = useQuery({
        queryKey: ['boards'],
        queryFn: async () => {
            return GetBoards();
        },
        initialData: props.boards,
        placeholderData: keepPreviousData
    })

    const {mutate: updateBoardOrder} = useMutation({
        mutationFn: async (boards: { id: string, index: number }[]) => {
            return UpdateBoardOrder(boards)
        },
    })

    useEffect(() => {
        const container = document.getElementById('board-swapy-container');
        const swapy = createSwapy(container)
        swapy.onSwap(({data: {array}}) => {
            const boards = array.map((a) => ({
                index: Number(a.slot),
                id: a.item!
            }))
            updateBoardOrder(boards)
        })
    }, [boards])


    return (
        <div>
            <div className={'flex flex-row items-center justify-between mb-4'}>
                <h1 className={'text-3xl'}>Boards</h1>
                <Button
                    size={'sm'}
                    color={'primary'}
                    onClick={()=>openCreateBoard()}
                >
                    New Board
                </Button>
            </div>
            <div
                className={'flex flex-col items-stretch w-full gap-2'}
                id={'board-swapy-container'}
                key={boards?.length}
            >
                {
                    boards.map((board, index) => (
                        <div
                            data-swapy-slot={index}
                            key={index}
                        >
                            <div
                                className={'rounded-xl border border-foreground-200 bg-background cursor-pointer grid grid-cols-[64px_1fr] group'}
                                data-swapy-item={board.id}
                            >
                                <div className={'h-full bg-foreground-50 p-4 cursor-grab active:cursor-grabbing grid place-items-center rounded-l-xl'} data-swapy-handle>
                                    <IconGridDots />
                                </div>
                                <div
                                    className={'p-4 group-hover:bg-foreground-50 transition-all'}
                                    onClick={()=>setSelectedBoard(board)}
                                >
                                    <p>{board.title}</p>
                                    <p className={'text-foreground-500 text-sm'}>{board.description}</p>
                                </div>
                            </div>
                        </div>

                    ))
                }
            </div>
            <CreateBoardModal
                isOpen={createBoardOpen}
                onClose={() => closeCreateBoard()}
            />
            <UpdateBoardModal
                isOpen={Boolean(selectedBoard)}
                onClose={()=>setSelectedBoard(undefined)}
                board={selectedBoard}
            />
        </div>
    )

}

export default BoardSettingsPageClient;