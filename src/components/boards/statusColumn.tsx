import {Status} from "@prisma/client";
import {Divider, ScrollShadow} from "@nextui-org/react";
import {IconCircleDotted} from "@tabler/icons-react";
import Link from "next/link";
import {formatDistanceToNow} from "date-fns";
import {StatusWithPosts} from "@/types/status";

interface StatusColumnProps {
    status: StatusWithPosts;
}

const StatusColumn = (props:StatusColumnProps) => {

    return (
        <div
            key={props.status.id}
            className={'flex flex-col rounded-xl border border-foreground-100'}
        >
            <div className={'p-4 bg-foreground-50 rounded-t-xl flex flex-row items-center space-x-2'}>
                <div
                    style={{
                        backgroundColor: props.status.color,
                        width: 8,
                        height: 8,
                        borderRadius: 4
                    }}
                />
                <h2>{props.status.title}</h2>
            </div>
            <Divider
                className={'h-0.5'}
                style={{
                    backgroundColor: props.status.color,
                }}
            />
            {!props.status.posts.length ?
                <div className={'flex flex-col items-center p-12'}>
                    <div className={'rounded-full bg-foreground-50 w-16 grid place-items-center h-16'}>
                        <IconCircleDotted strokeWidth={1.5} size={32} className={'text-primary-500'} />
                    </div>
                    <p className={'text-sm my-2'}>No posts</p>
                </div>
                :
                <ScrollShadow className={'max-h-[450px]'}>
                    <div className={'flex flex-col gap-4 p-2'}>
                        {
                            props.status.posts.map((post) => (
                                <Link href={`/posts/${post.id}`}
                                      className={'border border-foreground-100 p-2 rounded-lg w-full'} key={post.id}>
                                    <h3 className={'text-base'}>{post.title}</h3>
                                    <p className={'line-clamp-2 text-foreground-500 w-full text-sm'}>
                                        {post.description}
                                    </p>
                                    <p className={'text-xs mt-2'}>
                                        {formatDistanceToNow(post.created_at!, {
                                            addSuffix: true,
                                        })}
                                    </p>
                                </Link>
                            ))
                        }
                    </div>
                </ScrollShadow>

            }
        </div>
    )

}

export default StatusColumn