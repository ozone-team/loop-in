import {auth} from "@/lib/auth";
import notFound from "@/app/(public)/not-found";
import NewAnnouncementPageClient from "@/app/(public)/announcements/new/page.client";
import {GetConfig} from "@/lib/config";

export async function generateMetadata() {

    const {site_name} = await GetConfig('site_name');
    const session = await auth();

    if(!session?.user?.is_admin){
        return {
            title: `Unauthorized | ${site_name}`
        }
    }

    return {
        title: `New Announcement | ${site_name}`
    }

}

const NewAnnouncementPage = async () => {

    const session = await auth();

    if(!session?.user?.is_admin){
        return notFound()
    }

    return (
        <NewAnnouncementPageClient />
    )

}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default NewAnnouncementPage