"use client"

import {Status} from "@prisma/client";
import {useSession} from "next-auth/react";
import {useMemo} from "react";
import {useQuery} from "@tanstack/react-query";
import {ListStatuses} from "@/components/posts/postStatus.actions";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {IconArrowBadgeRight, IconArrowBadgeRightFilled, IconChevronDown} from "@tabler/icons-react";

interface PostStatusProps {
    status?: Status;
}

const PostStatus = (props: PostStatusProps) => {

    const {data: session} = useSession();

    const canEdit = useMemo(() => {
        return session?.user?.is_admin
    }, [session]);

    const {data: statuses} = useQuery({
        queryKey: ['selectable-statuses'],
        queryFn: async () => {
            return ListStatuses();
        },
        enabled: canEdit
    })

    return (
        <div className={'flex flex-row items-center space-x-1'}>

            {
                (statuses?.length && canEdit) ? (
                        <Dropdown>
                            <DropdownTrigger>
                                <div className={'flex flex-row cursor-pointer space-x-2'}>
                                    <p
                                        className={'text-sm font-medium uppercase'}
                                        style={{
                                            color: props.status?.color
                                        }}
                                    >
                                        {props.status?.title || 'No Status Assigned'}
                                    </p>
                                    <IconChevronDown className={'text-foreground-400'} size={18}/>
                                </div>

                            </DropdownTrigger>
                            <DropdownMenu
                                items={statuses || []}
                            >
                                {(status) => (
                                    <DropdownItem
                                        variant={'flat'}
                                        key={status.id}
                                        startContent={props.status?.id === status.id ? (
                                            <IconArrowBadgeRightFilled size={18} color={status.color}/>
                                        ) : <IconArrowBadgeRight size={18} color={status.color}/>}
                                    >
                                        <p>{status.title}</p>
                                    </DropdownItem>
                                )}
                            </DropdownMenu>
                        </Dropdown>
                    ) :
                    (
                        <p
                            className={'text-sm font-medium uppercase'}
                            style={{
                                color: props.status?.color
                            }}
                        >
                            {props.status?.title || 'No Status Assigned'}
                        </p>
                    )
            }
        </div>

    )

}

export default PostStatus