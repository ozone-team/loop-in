"use server"

import files from "@/lib/files";


export async function UploadFile(form: FormData) {

    let file = form.get("file") as File;
    let folder = form.get('folder') as string || 'user-uploads'

   return await files.save(file, `${folder}/${file.name}`)

}