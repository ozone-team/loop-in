"use client"

import { Prisma } from "@prisma/client"
import {Avatar, cn} from "@nextui-org/react";
import {formatDistanceToNow} from "date-fns";

interface CommentActivityItemProps {
    comment: Prisma.CommentGetPayload<{
        include: {
            created_by: {
                select: {
                    id: true;
                    name: true;
                    image: true;
                }
            }
        }
    }>
}
const CommentActivityItem = ({ comment }: CommentActivityItemProps) => {

    return (
        <div
            className={'flex flex-row group items-center space-x-2 -translate-x-3.5'}
        >
            <Avatar
                src={comment.created_by?.image || ''}
                alt={comment.created_by?.name || ''}
                className={'w-[26px] h-[26px]'}
            />
            <div>
                <p className={cn('text-xs uppercase font-medium')}>{comment.created_by?.name || '[Deleted User]'}</p>
                <p className={'text-sm'}>
                    {comment.body}
                </p>
                <p className={'text-xs text-foreground-500'}>
                    {formatDistanceToNow(comment.created_at!, {
                        addSuffix: true,
                    })}
                </p>
            </div>
        </div>
    )

}

export default CommentActivityItem