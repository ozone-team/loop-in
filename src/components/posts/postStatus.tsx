"use client"

import {Status} from "@prisma/client";
import {useSession} from "next-auth/react";
import {useEffect, useMemo, useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {ListStatuses} from "@/components/posts/postStatus.actions";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {IconArrowBadgeRight, IconArrowBadgeRightFilled, IconChevronDown} from "@tabler/icons-react";
import {ChangePostStatus} from "@/app/(public)/posts/[post]/actions";
import toast from "react-hot-toast";
import queryClient from "@/lib/queryClient";
import {PostDetails} from "@/types/posts";

interface PostStatusProps {
    status?: Status;
    post: PostDetails;
}

const PostStatus = (props: PostStatusProps) => {

    const [status, setStatus] = useState<Status | undefined>(props.status);

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

    const {mutate: changeStatus} = useMutation({
        mutationKey: ['change-status', props.status?.id],
        mutationFn: async (status_id: string) => {
            return await ChangePostStatus(props.post.id, status_id)
        },
        onSuccess: (data) => {
            queryClient.refetchQueries({
                queryKey: ['roadmap']
            })
            queryClient.refetchQueries({
                queryKey: ['board']
            })
            setStatus(data)
        },
        onError: (error) => {
            toast.error('Failed to change status: ' + error.message)
        }
    })

    useEffect(() => {
        setStatus(props.status)
    }, [props.status])

    return (
        <div className={'flex flex-row items-center space-x-1'}>

            {
                (statuses?.length && canEdit) ? (
                        <Dropdown
                        >
                            <DropdownTrigger>
                                <div className={'flex flex-row cursor-pointer space-x-2'}>
                                    <p
                                        className={'text-sm font-medium uppercase'}
                                        style={{
                                            color: status?.color
                                        }}
                                    >
                                        {status?.title || 'No Status Assigned'}
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
                                        onClick={() => changeStatus(status.id)}
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
                                color: status?.color
                            }}
                        >
                            {status?.title || 'No Status'}
                        </p>
                    )
            }
        </div>

    )

}

export default PostStatus