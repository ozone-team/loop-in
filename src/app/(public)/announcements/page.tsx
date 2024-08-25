import { prisma } from "@/lib/prisma"
import AnnouncementListItem from "@/components/announcements/announcementListItem";
import {GetConfig} from "@/lib/config";

export async function generateMetadata() {

    const {site_name} = await GetConfig('site_name');

    return {
        title: `Announcements | ${site_name}`
    }

}

const Announcements = async () => {

    const announcements = await prisma.announcement.findMany({
        orderBy: {
            created_at: 'desc'
        },
        include: {
            created_by: true
        }
    })

    return (
        <div className={'flex flex-col space-y-2 container py-8'}>
            <h1 className={'text-xl'}>Announcements</h1>
            {
                announcements.map((announcement) => (
                    <AnnouncementListItem key={announcement.id} announcement={announcement} />
                ))
            }
        </div>
    )

}

export default Announcements