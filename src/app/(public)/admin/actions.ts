"use server"

import {prisma} from "@/lib/prisma";
import {UpdateConfig} from "@/lib/config";
import files from "@/lib/files";
import path from "node:path";

interface SiteSettingsDto {
    siteName: string;
    siteLogo: string;
}

export async function UpdateSiteSettings(data: SiteSettingsDto){

    // update the values of the fields in the database Config key-value pair table

    await UpdateConfig({
        site_name: data.siteName,
        site_logo: data.siteLogo
    });

    return "Site settings updated";

}

export async function UploadSiteLogo(form: FormData){

    let image = form.get('site_logo') as File;

    let buffer = await image.arrayBuffer();

    // convert array buffer to buffer
    buffer = Buffer.from(buffer);

    // upload the image to the server
    return files.save(buffer, image.name);
}