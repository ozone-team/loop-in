import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {formatDistanceToNow} from "date-fns";
import {IconChevronUp} from "@tabler/icons-react";
import {User} from "@nextui-org/react";
import {Prisma} from "@prisma/client";
import FileItem from "@/components/files/fileItem";
import {auth} from "@/lib/auth";
import PostPageClient from "@/app/(public)/posts/[post]/page.client";

const PostPage = async (props:PageProps<{post: string}>) => {

    const post = await prisma.post.findFirst({
        where: {
            id: props.params.post
        },
        include: {
            status: true,
            comments: {
                include: {
                    created_by: true
                }
            },
            created_by: true,
            media: true,
            votes: {
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    }
                }
            },
            activity: {
                include: {
                    created_by: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    }
                }
            }
        }
    });

    if(!post){
        notFound()
    }

    return (
        <PostPageClient
            post={post}
        />
    )
}

export default PostPage