import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {formatDistanceToNow} from "date-fns";
import {IconChevronUp} from "@tabler/icons-react";
import {User} from "@nextui-org/react";
import {Prisma} from "@prisma/client";
import FileItem from "@/components/files/fileItem";
import {auth} from "@/lib/auth";
import PostPageClient from "@/app/(public)/posts/[post]/page.client";
import {GetPost} from "@/app/(public)/posts/[post]/actions";
import {GetConfig} from "@/lib/config";

export async function generateMetadata(props:PageProps<{post: string}>) {

    const post = await GetPost(props.params.post)
    const {site_name} = await GetConfig('site_name');

    if(!post){
        return {
            title: `Post not found | ${site_name}`
        }
    }

    return {
        title: `${post.title} | ${site_name}`
    }

}

const PostPage = async (props:PageProps<{post: string}>) => {

    const post = await GetPost(props.params.post)

    if(!post){
        notFound()
    }

    return (
        <PostPageClient
            post={post}
        />
    )
}

export const revalidate = 0;

export const dynamic = 'force-dynamic';

export default PostPage