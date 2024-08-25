import {prisma} from "@/lib/prisma";
import TagSettingsPageClient from "@/app/(public)/admin/tags/page.client";
import {GetConfig} from "@/lib/config";

export async function generateMetadata() {

    const {site_name} = await GetConfig('site_name');

    return {
        title: `Tags | ${site_name}`
    }

}

const TagsSettingsPage = async () => {

    const tags = await prisma.tag.findMany({
        orderBy: {
            title: 'asc'
        }
    });

    return (
        <TagSettingsPageClient tags={tags} />
    )

}

export default TagsSettingsPage;