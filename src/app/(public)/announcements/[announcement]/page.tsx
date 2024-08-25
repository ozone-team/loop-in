import { GetConfig } from "@/lib/config";
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import {Divider, User} from "@nextui-org/react";
import Link from "next/link";

type AnnouncementPageProps = PageProps<{announcement: string}>;

export async function generateMetadata(props: AnnouncementPageProps) {

    const {site_name} = await GetConfig('site_name');

    const announcement = await prisma.announcement.findFirst({
        where: {
            id: props.params.announcement
        },
    })

    if(!announcement){
        return {
            title: 'Announcement not found',
            description: 'The announcement you are looking for does not exist.'
        }
    }

    return {
        title: announcement.title + ' | ' + site_name,
        description: announcement.body_plain.substring(0, 128),
    }
}

const AnnouncementPage = async (props:AnnouncementPageProps) => {

    const announcement = await prisma.announcement.findFirst({
        where: {
            id: props.params.announcement
        },
        include: {
            created_by: {
                select: {
                    name: true,
                    image: true
                }
            }
        }
    })

    if(!announcement){
        notFound();
    }

    return (
        <div className={'container py-8 max-w-lg flex flex-col items-start'}>
            <User
                name={announcement.created_by.name}
                avatarProps={{
                    src: announcement.created_by.image!,
                    alt: announcement.created_by.name!,
                    size: 'sm'
                }}
                className={'mb-4'}
            />
            <h1 className={'text-4xl font-bold mb-4'}>{announcement.title}</h1>
            <div className={'prose'} dangerouslySetInnerHTML={{__html: announcement.body}} />
            <Divider className={'my-4'} />
            <Link href={'/announcements'} className={'text-primary-500'}>
                Back to Announcements
            </Link>
        </div>
    )

}

export const revalidate = 60;

export default AnnouncementPage