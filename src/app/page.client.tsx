"use client";

import {useQuery} from "@tanstack/react-query";
import {GetLatestAnnouncements, GetLatestPosts} from "@/app/(public)/actions";
import PostColumnItem from "@/components/posts/postColumnItem";
import {AnnouncementItem} from "@/types/announcements";
import {PostListItem} from "@/types/posts";
import {format} from "date-fns";
import AnnouncementListItem from "@/components/announcements/announcementListItem";
import Link from "next/link";

interface HomePageClientProps {
    latestPosts: PostListItem[]
    latestAnnouncements: AnnouncementItem[]
}

const HomePageClient = (props: HomePageClientProps) => {

    const {data:latestPosts, isPending:isLoadingLatestPosts} = useQuery({
        queryKey: ['posts', 'sort:latest'],
        queryFn: async () => {
            return await GetLatestPosts()
        },
        initialData: props.latestPosts
    })

    const {data:latestAnnouncements, isPending:isLoadingLatestAnnouncements} = useQuery({
        queryKey: ['announcements', 'sort:latest'],
        queryFn: async () => {
            return await GetLatestAnnouncements()
        },
        initialData: props.latestAnnouncements
    })

    return (
        <div className={'container py-8'}>
            <section className={'grid gap-12 grid-cols-[2fr_1fr]'}>
                <div>
                    <div className={'flex flex-row items-baseline justify-between mb-2'}>
                        <p className={'text-sm uppercase text-foreground-500'}>Latest Announcements</p>
                        <Link
                            href={'/announcements'}
                            className={'text-sm text-primary-500 hover:text-primary-600'}
                        >
                            View all
                        </Link>
                    </div>

                    {
                        !latestAnnouncements.length ?
                            <div className={'w-full p-8 rounded-xl border border-foreground-100 flex flex-col items-center'}>
                                <p className={'text-sm text-foreground-500'}>No announcements yet</p>
                            </div>
                            :
                            <div className={'flex flex-col space-y-2'}>
                                {latestAnnouncements.map((announcement) => (
                                    <AnnouncementListItem key={announcement.id} announcement={announcement} />
                                ))}
                            </div>
                    }
                </div>
                <div>
                    <div className={'flex flex-row items-baseline justify-between mb-2'}>
                        <p className={'text-sm uppercase text-foreground-500'}>Latest Posts</p>
                        <Link
                            href={'/posts'}
                            className={'text-sm text-primary-500 hover:text-primary-600'}
                        >
                            View all
                        </Link>
                    </div>
                    {
                        latestPosts.length ?
                            <div className={'flex flex-col items-start space-y-2'}>
                                {latestPosts.map((post) => (
                                    <PostColumnItem post={post} key={post.id}/>
                                ))}
                            </div>
                            :
                            <div
                                className={'w-full p-8 rounded-xl border border-foreground-100 flex flex-col items-center'}>
                                <p className={'text-sm text-foreground-500'}>No posts yet</p>
                            </div>
                    }

                </div>
            </section>
        </div>
    )

}

export default HomePageClient