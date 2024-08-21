import {GetConfig} from "@/lib/config";
import SiteSettingsPageClient from "@/app/(public)/admin/page.client";

const SiteSettingsPage = async () => {

    let {site_name, site_logo} = await GetConfig('site_name', 'site_logo');

    return (
        <SiteSettingsPageClient
            siteName={site_name}
            siteLogo={site_logo}
        />
    )

}

export default SiteSettingsPage