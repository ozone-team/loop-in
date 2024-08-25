import {prisma} from "@/lib/prisma";
import PostsPageClient from "@/app/(public)/posts/page.client";
import {ListPosts} from "@/app/(public)/posts/actions";
import { GetConfig } from "@/lib/config";

export async function generateMetadata() {

    const {site_name} = await GetConfig('site_name');

    return {
        title: `Posts | ${site_name}`
    }

}

const PostsPage = async () => {

    const boards = await prisma.board.findMany({
        orderBy: {
            index: 'asc'
        }
    });

    const statuses = await prisma.status.findMany({
        orderBy: {
            index: 'asc'
        }
    });

    const posts = await ListPosts();

    return (
        <PostsPageClient
            posts={posts}
            statuses={statuses}
            boards={boards}
        />
    )


}

export default PostsPage