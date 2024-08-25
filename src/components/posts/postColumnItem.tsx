import {Chip} from "@nextui-org/react";
import { Prisma } from "@prisma/client";
import {IconTagFilled} from "@tabler/icons-react";
import {formatDistanceToNow} from "date-fns";
import Link from "next/link";
import {PostListItem} from "@/types/posts";


interface PostColumnItemProps {
    post: PostListItem
}

const PostColumnItem = ({post}: PostColumnItemProps) => {

    return (
        <Link href={`/posts/${post.id}`}
              className={'border border-foreground-100 p-2 rounded-lg w-full transition-all hover:bg-foreground-50'} key={post.id}>
            <h3 className={'text-base'}>{post.title}</h3>
            <p className={'line-clamp-2 text-foreground-500 w-full text-sm'}>
                {post.description}
            </p>
            <div className={'flex flex-row items-start gap-2 py-2'}>
                {
                    post.tags.map(({tag}) => (
                        <Chip
                            size={'sm'}
                            key={tag.id}
                            variant={'flat'}
                            startContent={(
                                <IconTagFilled size={16} color={tag.color}/>
                            )}
                        >
                            {tag.title}
                        </Chip>
                    ))
                }
            </div>
            <p className={'text-xs mt-2'}>
                {formatDistanceToNow(post.created_at!, {
                    addSuffix: true,
                })} by {post.created_by?.name || 'Anonymous'}
            </p>
        </Link>
    )

}

export default PostColumnItem