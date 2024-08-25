import {GetConfig} from "@/lib/config";
import UsersPageClient from "./page.client";

export async function generateMetadata() {

    const {site_name} = await GetConfig('site_name');

    return {
        title: `Users | ${site_name}`
    }

}

const UsersPage = () => {

    return (
        <UsersPageClient />
    )

}



export default UsersPage