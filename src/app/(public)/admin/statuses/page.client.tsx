"use client"

import {Board, Status} from "@prisma/client";
import {Button, Chip, useDisclosure} from "@nextui-org/react";
import {useEffect, useMemo, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {GetStatuses, UpdateStatusOrder} from "@/app/(public)/admin/statuses/actions";
import {createSwapy} from "swapy";
import {IconGridDots} from "@tabler/icons-react";
import CreateStatusModal from "@/components/statuses/createStatusModal";
import UpdateStatusModal from "@/components/statuses/updateStatusModal";
import WarningNotice from "@/components/notices/warningNotice";


interface StatusSettingsPageClientProps {
    statuses: Status[]
}

const StatusSettingsPageClient = (props: StatusSettingsPageClientProps) => {

    const {isOpen: createStatusOpen, onClose: closeCreateStatus, onOpen: openCreateStatus} = useDisclosure()
    const [selectedStatus, setSelectedStatus] = useState<Status | undefined>()

    const {data: statuses} = useQuery({
        queryKey: ['statuses'],
        queryFn: async () => {
            return GetStatuses();
        },
        initialData: props.statuses
    })

    useEffect(() => {
        if (!statuses?.length) return;
        const container = document.getElementById('status-swapy-container');
        const swapy = createSwapy(container, {
            continuousMode: true
        })
        swapy.onSwap(({data: {array}}) => {
            const newStatuses = array.map((a) => ({
                index: Number(a.slot),
                id: a.item!
            }))
            console.log("Status Swap", newStatuses)
            UpdateStatusOrder(newStatuses)
        })
    }, [statuses])

    const hasDefaultStatus = useMemo(() => {
        return statuses?.some((status) => status.is_default)
    }, [statuses])

    return (
        <div>
            <div className={'flex flex-row items-center justify-between mb-4'}>
                <h1 className={'text-3xl'}>Statuses</h1>
                <Button
                    size={'sm'}
                    color={'primary'}
                    onClick={() => openCreateStatus()}
                >
                    New Status
                </Button>
            </div>
            {
                !hasDefaultStatus && (
                    <WarningNotice
                        message={"No default status configured, the first status in the list will be used"}
                        className={'mb-4'}
                    />
                )
            }
            <div
                className={'flex flex-col items-stretch w-full gap-2'}
                id={'status-swapy-container'}
                key={statuses?.length}
            >
                {
                    statuses.map((status, index) => (
                        <div
                            data-swapy-slot={index}
                            key={index}
                        >
                            <div
                                className={'rounded-xl border border-foreground-200 bg-background cursor-pointer grid grid-cols-[64px_1fr] group'}
                                data-swapy-item={status.id}
                            >
                                <div
                                    className={'h-full bg-foreground-50 p-4 cursor-grab active:cursor-grabbing grid place-items-center rounded-l-xl border-r-4'}
                                    style={{
                                        borderRightColor: status.color
                                    }}
                                    data-swapy-handle
                                >
                                    <IconGridDots/>
                                </div>
                                <div
                                    className={'p-4 group-hover:bg-foreground-50 transition-all flex flex-row justify-between'}
                                    onClick={() => setSelectedStatus(status)}
                                >
                                    <p>{status.title}</p>
                                    {
                                        status.is_default ?
                                            <Chip size={'sm'} variant={'flat'}>
                                                Default Status
                                            </Chip>
                                            :
                                            <></>
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <CreateStatusModal
                isOpen={createStatusOpen}
                onClose={closeCreateStatus}
            />
            <UpdateStatusModal
                isOpen={Boolean(selectedStatus)}
                onClose={() => setSelectedStatus(undefined)}
                status={selectedStatus}
            />
        </div>
    )

}

export default StatusSettingsPageClient;