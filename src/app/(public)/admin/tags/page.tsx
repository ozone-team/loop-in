import {prisma} from "@/lib/prisma";
import TagSettingsPageClient from "@/app/(public)/admin/tags/page.client";


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