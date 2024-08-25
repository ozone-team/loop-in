"use client";

import {StatusWithPosts} from "@/types/status";
import {Chip, Divider, useDisclosure} from "@nextui-org/react";
import {IconCircleDotted, IconTagFilled} from "@tabler/icons-react";
import Link from "next/link";
import {formatDistanceToNow} from "date-fns";
import PostItem from "@/components/posts/postListItem";

interface StatusSectionProps {
    status: StatusWithPosts;
}

const StatusSection = ({status}:StatusSectionProps) => {

    const {isOpen, onOpen, onClose} = useDisclosure({
        defaultOpen: true
    });

    return (
        <div
            data-open={isOpen || undefined}
            className={'flex flex-col rounded-xl border border-foreground-100 group'}
        >
            <div
                className={'p-4 flex flex-row items-center space-x-2 hover:bg-foreground-100 transition-all cursor-pointer group-data-[open]:rounded-b-none rounded-xl'}
                onClick={isOpen ? onClose : onOpen}
            >
                <div
                    style={{
                        backgroundColor: status.color,
                        width: 8,
                        height: 8,
                        borderRadius: 4
                    }}
                />
                <h2>{status.title}</h2>
            </div>
            <Divider
                className={'h-0.5 group-data-[open]:max-h-none max-h-0 transition-all'}
                style={{
                    backgroundColor: status.color,
                }}
            />
            <div className={'transition-all max-h-0 group-data-[open]:max-h-none overflow-hidden'}>
                {!status.posts.length ?
                    <div className={'flex flex-col items-center p-12'}>
                        <div className={'rounded-full bg-foreground-50 w-16 grid place-items-center h-16'}>
                            <IconCircleDotted strokeWidth={1.5} size={32} className={'text-primary-500'} />
                        </div>
                        <p className={'text-sm my-2'}>No posts</p>
                    </div>
                    :
                    <div className={'flex flex-col gap-4 p-2'}>
                        {
                            status.posts.map((post) => (
                                <PostItem post={post} key={post.id}/>
                            ))
                        }
                    </div>
                }
            </div>
        </div>
    )

}

export default StatusSection;