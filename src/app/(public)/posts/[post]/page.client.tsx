"use client";

import {IconChevronUp, IconEdit, IconEye, IconEyeOff, IconTagFilled, IconTrash} from "@tabler/icons-react";
import {Badge, Button, Chip, Textarea, useDisclosure, User} from "@nextui-org/react";
import FileItem from "@/components/files/fileItem";
import {formatDistanceToNow} from "date-fns";
import {useSession} from "next-auth/react";
import {Post, Prisma} from "@prisma/client";
import {useMutation, useQuery} from "@tanstack/react-query";
import {DeletePost, GetPost, VoteForPost, WatchPost} from "@/app/(public)/posts/[post]/actions";
import queryClient from "@/lib/queryClient";
import {useModals} from "@/components/providers/modals.provider";
import {useMemo, useState} from "react";
import DeleteButton from "@/components/buttons/deleteButton";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import LogActivityItem from "@/components/activity/logActivityItem";
import CommentItem from "@/components/comments/commentItem";
import CommentInput from "@/components/comments/commentInput";
import Link from "next/link";
import PostStatus from "@/components/posts/postStatus";
import {PostDetails} from "@/types/posts";
import EditPostModal from "@/components/posts/editPostModal";


interface PostPageClientProps {
    post: PostDetails
}

const PostPageClient = (props: PostPageClientProps) => {

    const router = useRouter();
    const {data: session} = useSession();
    const {isOpen:editOpen, onOpen:openEdit, onClose:closeEdit} = useDisclosure();
    const modals = useModals();

    const {data: post} = useQuery({
        queryKey: ['post', props.post.id],
        queryFn: async () => {
            return await GetPost(props.post.id)
        },
        initialData: props.post,
        refetchOnWindowFocus: 'always',
        refetchOnMount: 'always',
        refetchInterval: 6000
    });

    const {mutate: vote} = useMutation({
        mutationKey: ['vote-for-post', post.id],
        onMutate: async () => {
            if (!session?.user) {
                modals.signInPrompt.onOpen("You need to be signed in to vote")
                return;
            }

            // Optimistically update the post
            if (post.votes.some((vote) => vote.user.id === session.user.id)) {
                queryClient.setQueryData(['post', post.id], {
                    ...post,
                    votes: post.votes.filter((vote) => vote.user.id !== session.user.id)
                })
            } else {
                queryClient.setQueryData(['post', post.id], {
                    ...post,
                    votes: [
                        ...post.votes,
                        {
                            user: {
                                id: session.user.id,
                                name: session.user.name,
                                image: session.user.image
                            }
                        }
                    ]
                })
            }

            return await VoteForPost(post.id);
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['post', post.id], data)
        },
        onError: (error) => {
            console.error(error)
        },
    });

    const {mutate: deletePost, isPending: isDeletingPost} = useMutation({
        mutationKey: ['delete-post', post.id],
        mutationFn: async () => {
            await DeletePost(post.id)
            router.push(`/board/${post.board_id}`)
        },
        onError: (error) => {
            console.error(error)
            toast.error('Failed to delete post: ' + error.message)
        },
        onSuccess: () => {
            toast.success('Post deleted successfully')
        }
    });

    const {mutate: watchPost, isPending: isPendingWatchPost} = useMutation({
        mutationKey: ['watch-post', post.id],
        mutationFn: async () => {
            // Watch the post

            if(!session?.user){
                modals.signInPrompt.onOpen("You need to be signed in to watch a post")
                return;
            }

            return await WatchPost(post.id)
        },
        onError: (error) => {
            console.error(error)
            toast.error('Failed to watch post: ' + error.message)
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['post', post.id], data)
        }
    })


    const canModifyPost = useMemo(() => {
        return (session?.user && session?.user?.id === post.created_by?.id) || session?.user?.is_admin
    }, [session, post?.created_by?.id])

    const isWatching = useMemo(() => {
        return post?.watching?.some((watch) => watch.user_id === session?.user?.id)
    }, [post.watching, session?.user?.id]);

    const activity = useMemo(() => {
        let log_activity = post.activity.map((activity) => ({
            entity: 'log',
            data: activity
        }))

        let comments_activity = post.comments.map((comment) => ({
            entity: 'comment',
            data: comment
        }))

        return [
            ...log_activity,
            ...comments_activity
        ].sort((a,b) => {
            return new Date(a.data.created_at) > new Date(b.data.created_at) ? -1 : 1
        }) as {entity: 'log' | 'comment', data: any}[]

    }, [post])

    return (
        <div className={'container py-8 grid grid-cols-[1fr_384px] gap-12 mobile:grid-cols-1 mobile:gap-4 mobile:px-6'}>
            <div>
                <div className={'flex flex-row items-center space-x-2 mb-4'}>
                    <div
                        className={'flex flex-col items-center p-2 rounded-xl border border-foreground-100 cursor-pointer hover:bg-foreground-50 transition-all group hover:text-primary-500 data-[voted]:bg-primary-500 data-[voted]:text-white active:border-primary-100'}
                        data-voted={post.votes.some((vote) => vote.user.id === session?.user?.id) || undefined}
                        onClick={() => vote()}
                    >
                        <IconChevronUp
                            className={'group-hover:-translate-y-0.5 transition-all group-active:-translate-y-1'}
                        />
                        <p>{post.votes.length || 0}</p>
                    </div>
                    <div>
                        <h1 className={'text-xl mb-2'}>{post.title}</h1>
                        <div className={'flex flex-row items-center space-x-2'}>
                            <PostStatus post={post} status={post.status || undefined}/>
                            {
                                post.category ?
                                    <Chip variant={'flat'}>
                                        {post.category.title}
                                    </Chip>
                                    :
                                    <></>
                            }
                        </div>
                    </div>
                </div>
                <User
                    name={post.created_by?.name || 'Anonymous'}
                    avatarProps={{
                        size: 'sm',
                        src: post.created_by?.image || undefined
                    }}
                />
                <div className={'p-4 border border-foreground-100 rounded-xl'}>
                    <p className={'mb-4'}>
                        {post.description}
                    </p>
                    <div className={'flex flex-row items-start justify-start flex-wrap w-full gap-4'}>
                        {
                            post.media.map((media) => (
                                <FileItem key={media.url} file={media}/>
                            ))
                        }
                    </div>
                    <div className={'flex flex-row items-start justify-start gap-2 mt-4'}>
                        {
                            post.tags.map(({tag}) => (
                                <Chip
                                    key={tag.id}
                                    variant={'flat'}
                                    startContent={(
                                        <IconTagFilled size={18} color={tag.color}/>
                                    )}
                                >
                                    {tag.title}
                                </Chip>
                            ))
                        }
                    </div>
                </div>
                <div className={'flex flex-row items-center mt-2 space-x-2'}>
                    <p className={'text-xs text-foreground-500'}>
                        Posted {formatDistanceToNow(post.created_at, {addSuffix: true})}
                    </p>
                    <div className={'flex-grow'}/>
                    {
                        canModifyPost ?
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
                                    Edit Post
                                </Button>
                                <DeleteButton
                                    onDelete={() => deletePost()}
                                    isDeleting={isDeletingPost}
                                    confirmLabel={'Are you sure you want to delete this post?'}
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
                <div className={'mt-6'}>
                    <h2 className={'mb-2'}>Activity</h2>
                    {
                        session?.user ?
                            <CommentInput postId={post.id} hasComments={post.comments.length > 0}/>
                            :
                            <div className={'bg-foreground-100 rounded-xl p-4 mb-4'}>
                                <p className={'text-sm text-foreground-500'}><Link
                                    className={'text-primary-500 hover:underline font-medium'} href={'/signin'}>Sign
                                    in</Link> to leave a comment</p>
                            </div>
                    }

                    <div className={'flex flex-col items-start border-l border-l-foreground-200 space-y-5'}>
                        {
                            activity.map((activity) => {
                                if (activity.entity === 'log') {
                                    return (
                                        <LogActivityItem
                                            key={activity.data.id}
                                            activity={activity.data}
                                        />
                                    )
                                } else {
                                    return (
                                        <CommentItem
                                            key={activity.data.id}
                                            comment={activity.data}
                                        />
                                    )
                                }
                            })
                        }
                    </div>
                </div>
            </div>
            <div className={'flex flex-col items-end space-y-2'}>
                <Button
                    size={'sm'}
                    variant={'light'}
                    className={'text-foreground-800 border-foreground-200 border'}
                    startContent={isWatching ? (
                        <IconEyeOff size={18}/>
                    ) : (
                        <IconEye size={18}/>
                    )}
                    onClick={() => watchPost()}
                    isLoading={isPendingWatchPost}
                >
                    {isWatching ? 'Stop Watching' : 'Watch'}
                </Button>
                <div
                    className={'border border-foreground-100 rounded-xl p-4 flex flex-col space-y-2 items-start w-full'}>
                    <p className={'text-sm text-foreground-500 uppercase'}>Voters</p>
                    {
                        post.votes.length === 0 ?
                            <p className={'text-xs py-2 text-foreground-400'}>No votes</p>
                            :
                            <div className={'flex flex-col space-y-2 items-start'}>
                                {(post.votes.slice(0, 10)).map((vote) => (
                                    <User
                                        key={vote.user.name}
                                        name={vote.user.name}
                                        avatarProps={{
                                            size: 'sm',
                                            src: vote.user.image || undefined
                                        }}
                                    />
                                ))}
                                {
                                    post.votes.length > 10 ?
                                        <p className={'text-xs text-foreground-500'}>and {post.votes.length - 10} more</p>
                                        :
                                        <></>
                                }
                            </div>
                    }
                </div>
            </div>
            <EditPostModal isOpen={editOpen} onClose={closeEdit} post={post} />
        </div>
    )

}

export default PostPageClient