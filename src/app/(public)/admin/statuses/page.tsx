import {prisma} from "@/lib/prisma";
import StatusSettingsPageClient from "./page.client";


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