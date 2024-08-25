import {GetLatestAnnouncements, GetLatestPosts} from "@/app/(public)/actions";
import HomePageClient from "@/app/page.client";

const HomePage = async () => {

    const latestPosts = await GetLatestPosts()
    const latestAnnouncements = await GetLatestAnnouncements()

    return (
        <HomePageClient
            latestPosts={latestPosts}
            latestAnnouncements={latestAnnouncements}
        />
    )

}

export const revalidate = 60;

export default HomePage