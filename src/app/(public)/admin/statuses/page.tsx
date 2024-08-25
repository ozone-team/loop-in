import {prisma} from "@/lib/prisma";
import StatusSettingsPageClient from "./page.client";
import {GetConfig} from "@/lib/config";

export async function generateMetadata() {

    const {site_name} = await GetConfig('site_name');

    return {
        title: `Tags | ${site_name}`
    }

}

const StatusSettingsPage = async () => {

    const statuses = await prisma.status.findMany({
        orderBy: {
            index: 'asc'
        }
    })

    return (
        <StatusSettingsPageClient
            statuses={statuses}
        />
    )

}

export default StatusSettingsPage;