import {format} from "date-fns";
import Link from "next/link";
import {Prisma} from "@prisma/client";
import {AnnouncementItem} from "@/types/announcements";

interface AnnouncementListItemProps {
    announcement: AnnouncementItem
}

const AnnouncementListItem = ({announcement}: AnnouncementListItemProps) => {
    return (
        <Link key={announcement.id} href={`/announcements/${announcement.id}`}>
            <div className={'w-full p-4 border border-foreground-100 rounded-xl hover:bg-foreground-50 transition-all'}>
                <h3 className={'text-lg font-semibold'}>{announcement.title}</h3>
                <p className={'line-clamp-2 text-sm text-foreground-600'}>
                    {announcement.body_plain}
                </p>
                <p className={'text-xs text-foreground-500 mt-2'}>
                    {announcement.created_by?.name || 'Anonymous'} - {format(announcement.created_at, 'MMM dd y h:mma')}
                </p>
            </div>
        </Link>
    )
}

export default AnnouncementListItem