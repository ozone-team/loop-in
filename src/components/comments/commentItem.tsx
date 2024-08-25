"use client"

import {Prisma} from "@prisma/client"
import {Avatar, Button, cn, useDisclosure} from "@nextui-org/react";
import {formatDistanceToNow} from "date-fns";
import FileItem from "@/components/files/fileItem";
import {useSession} from "next-auth/react";
import {useEffect, useMemo, useState} from "react";
import {IconEdit, IconHeart, IconHeartFilled, IconTrash} from "@tabler/icons-react";
import DeleteButton from "@/components/buttons/deleteButton";
import {useMutation} from "@tanstack/react-query";
import toast from "react-hot-toast";
import EditCommentPanel from "@/components/comments/editCommentPanel";
import {LikeComment} from "@/components/comments/commentItem.actions";

interface CommentActivityItemProps {
    comment: Prisma.CommentGetPayload<{
        include: {
            created_by: {
                select: {
                    id: true;
                    name: true;
                    image: true;
                }
            },
            votes: {
                select: {
                    user_id: true
                }
            },
            media: true
        }
    }>
}

const CommentItem = (props: CommentActivityItemProps) => {

    const [comment, setComment] = useState(props.comment);

    const [liked, setLiked] = useState(false);

    const {data: session} = useSession();

    const {isOpen: isEditing, onOpen: openEdit, onClose: closeEdit} = useDisclosure();


    const canEdit = useMemo(() => {
        return session?.user?.id === comment.created_by?.id
    }, [session, comment.created_by])

    const {mutate: deleteComment, isPending: isDeletingComment} = useMutation({
        mutationFn: async () => {
            // delete the comment
        },
        onSuccess: () => {
            toast.success("Comment deleted")
        },
        onError: (error) => {
            toast.error(error.message)
        }
    });

    useEffect(() => {
        // check if the user has liked
        if(session?.user){
            setLiked(comment.votes.some((v) => v.user_id === session.user?.id))
        }
    }, [session, comment.votes]);

    const {mutate: likeComment, isPending: isLikingComment} = useMutation({
        mutationFn: async () => {
            // like the comment
            await LikeComment(comment.id)
        },
        onSuccess: () => {
            setLiked(o=>!o)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    });

    return (
        <div
            className={'flex flex-row group items-start space-x-2 -translate-x-3.5 w-full'}
        >
            <Avatar
                src={comment.created_by?.image || ''}
                alt={comment.created_by?.name || ''}
                className={'w-[26px] h-[26px]'}
            />
            <div className={'py-1 w-full'}>
                <p className={cn('text-xs uppercase font-medium')}>{comment.created_by?.name || '[Deleted User]'}</p>
                {
                    (isEditing && canEdit) ?
                        <EditCommentPanel
                            comment={comment}
                            onUpdate={(data) => {
                                setComment(data)
                                closeEdit()
                            }}
                            onClose={closeEdit}
                        />
                        :
                        <section>
                            <p className={'text-sm py-1'}>
                                {comment.body}
                            </p>
                            {
                                comment.media?.length ?
                                    <div className={'flex flex-row items-start gap-2 flex-wrap w-full'}>
                                        {
                                            comment.media?.map((media, index) => (
                                                <FileItem
                                                    key={index}
                                                    file={media}
                                                />
                                            ))
                                        }
                                    </div>
                                    :
                                    <></>
                            }
                            <div className={'mt-2 flex flex-row items-center space-x-2'}>
                                <div className={'flex flex-row items-center space-x-1'}>
                                    {
                                        liked ?
                                            <IconHeartFilled
                                                size={16}
                                                className={'text-red-700 dark:text-red-400 cursor-pointer hover:text-red-500 dark:hover:text-red-300 transition-all'}
                                                onClick={() => likeComment()}
                                            />
                                            :
                                            <IconHeart
                                                size={16}
                                                className={'text-foreground-500 cursor-pointer hover:fill-foreground-500 transition-all'}
                                                onClick={() => likeComment()}
                                            />
                                    }
                                    {
                                        comment.votes.length ?
                                            <span className={'text-xs text-foreground-500'}>
                                                {comment.votes.length}
                                            </span>
                                            :
                                            <></>
                                    }
                                </div>

                                <p className={'text-xs text-foreground-500'}>
                                    {
                                        comment.updated_at ?
                                            'Edited ' + formatDistanceToNow(comment.updated_at, {
                                                addSuffix: true,
                                            })
                                            :
                                            formatDistanceToNow(comment.created_at!, {
                                                addSuffix: true,
                                            })
                                    }
                                </p>

                                {

                                    canEdit ?
                                        <>
                                            <Button
                                                size={'sm'}
                                                variant={'light'}
                                                className={'text-foreground-500'}
                                                startContent={(
                                                    <IconEdit size={16}/>
                                                )}
                                                onClick={() => openEdit()}
                                            >
                                                Edit
                                            </Button>
                                            <DeleteButton
                                                onDelete={() => deleteComment()}
                                                isDeleting={isDeletingComment}
                                                confirmLabel={'Are you sure you want to delete this comment?'}
                                                buttonProps={{
                                                    size: 'sm',
                                                    variant: 'light',
                                                    color: 'danger',
                                                    className: 'text-foreground-500 hover:text-danger-600',
                                                    startContent: <IconTrash size={16}/>
                                                }}
                                                popoverProps={{
                                                    placement: 'bottom-end'
                                                }}
                                            />
                                        </>
                                        :
                                        <></>
                                }
                            </div>
                        </section>
                }

            </div>
        </div>
    )

}

export default CommentItem