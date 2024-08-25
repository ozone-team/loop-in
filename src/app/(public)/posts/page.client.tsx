"use client"

import {PostListItem} from "@/types/posts";
import {Board, Status} from "@prisma/client";
import {Button, useDisclosure} from "@nextui-org/react";
import {useEffect, useState} from "react";
import { IconCheck } from "@tabler/icons-react";
import {useInfiniteQuery} from "@tanstack/react-query";
import {ListPosts} from "@/app/(public)/posts/actions";
import queryClient from "@/lib/queryClient";
import PostItem from "@/components/posts/postListItem";

interface PostsPageClientProps {
    posts: PostListItem[];
    statuses: Status[];
    boards: Board[];
}

const PostsPageClient = (props: PostsPageClientProps) => {


    const [board, setBoard] = useState<string | null>(null);
    const [statuses, setStatuses] = useState<string[]>(props.statuses.map(s => s.id));

    function ToggleStatus(status: string) {
        if (statuses.includes(status)) {
            setStatuses(statuses.filter(s => s !== status));
        } else {
            setStatuses([...statuses, status])
        }
    }

    const {data, isPending, fetchNextPage, isFetchingNextPage, hasNextPage} = useInfiniteQuery({
        queryKey: ['posts', {board, statuses}],
        queryFn: async ({pageParam}) => {
            return await ListPosts({
                page: pageParam,
                statuses,
                board: board || undefined
            })
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if (lastPage.length < 10) {
                return undefined
            }
            return lastPageParam + 1
        },
        refetchOnWindowFocus: false,
        initialData: {
            pages: [props.posts],
            pageParams: [0],
        },
    })

    useEffect(() => {
        // queryClient.prefetchInfiniteQuery({
        //     queryKey: ['posts', {board, statuses}],
        //     queryFn: async ({pageParam}) => {
        //         return await ListPosts({
        //             page: pageParam + 1,
        //             statuses,
        //             board: board || undefined
        //         })
        //     },
        //     initialPageParam: 0,
        // })
    }, [data])

    return (
        <div className={'grid grid-cols-[256px_1fr] gap-4 relative container py-4 mobile:grid-cols-1'}>
            <div className={'flex flex-col w-full items-stretch space-y-4 sticky top-0'}>
                <div className={'w-full border-foreground-100 border rounded-xl p-3'}>
                    <p className={'uppercase text-xs mb-2'}>Boards</p>
                    <div className={'flex flex-col w-full'}>
                        <Button
                            size={'sm'}
                            variant={'light'}
                            className={'justify-start'}
                            onClick={() => setBoard(null)}
                            endContent={!board ? <IconCheck size={16} className={'absolute right-2'} /> : ''}
                        >
                            All Boards
                        </Button>
                        {props.boards.map(b => (
                            <Button
                                size={'sm'}
                                key={b.id}
                                variant={'light'}
                                className={'justify-start'}
                                onClick={() => setBoard(b.id)}
                                endContent={b.id === board ? <IconCheck size={16} className={'absolute right-2'} /> : ''}
                            >
                                {b.title}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className={'w-full border-foreground-100 border rounded-xl p-3'}>
                    <p className={'uppercase text-xs mb-2'}>Status</p>
                    <div className={'flex flex-col w-full space-y-1'}>
                        {props.statuses.map(s => (
                            <Button
                                size={'sm'}
                                key={s.id}
                                variant={'light'}
                                className={'justify-start'}
                                onClick={() => ToggleStatus(s.id)}
                                endContent={statuses.includes(s.id) ? <IconCheck size={16} color={s.color} className={'absolute right-2'} /> : ''}
                            >
                                {s.title}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
            <div className={'flex flex-col space-y-2'}>
                {
                    data.pages.map((page) => page.map((post: PostListItem) => (
                        <PostItem key={post.id} post={post}/>
                    )))
                }
                {
                    hasNextPage ?
                        <Button
                            onClick={() => fetchNextPage()}
                            isLoading={isFetchingNextPage}
                            variant={'light'}
                            size={'sm'}
                            className={'mt-6 self-center'}
                        >
                            Load More Posts
                        </Button>
                        :
                        <p className={'text-sm text-foreground-500 w-full text-center pt-6'}>That&apos;s everything</p>
                }

            </div>
        </div>
    )

}

export default PostsPageClient