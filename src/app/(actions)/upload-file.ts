"use server"

import * as fs from "node:fs";
import path from "node:path";

export async function UploadFile(form: FormData) {

    let file = form.get("file") as File;
    let folder = form.get('folder') as string || 'user-uploads'

    if(!file) {
        throw new Error("File is required")
    }

    // prefix the file with a hash to prevent collisions
    let filename = `${Date.now()}-${file.name}`;

    let save_path = path.join(process.cwd(), 'public', 'uploads', folder, filename);

    let save_dir = path.dirname(save_path);

    if(!fs.existsSync(save_dir)) {
        fs.mkdirSync(save_dir, {recursive: true})
    }

    let buffer = await file.arrayBuffer();

    fs.writeFileSync(save_path, Buffer.from(buffer));

    let public_url = new URL(process.env.APP_URL as string)
    public_url.pathname = path.join('/', 'uploads', folder, filename)

    return public_url.toString();

}