import {createAvatar} from "@dicebear/core";
import {thumbs} from "@dicebear/collection";
import files from "@/lib/files";
import path from "node:path";

export async function GenerateUserAvatar(seed: string){
    const avatar = createAvatar(thumbs, {
        seed: seed
    }).toString();

    let buffer = Buffer.from(avatar);

    return await files.saveBuffer(buffer, path.join('avatars', `${seed}.svg`), 'image/svg+xml');
}
