import {createAvatar} from "@dicebear/core";
import {thumbs} from "@dicebear/collection";
import files from "@/lib/files";
import path from "node:path";

export function GenerateUserAvatar(seed: string){
    const avatar = createAvatar(thumbs, {
        seed: seed
    }).toString();

    return files.save(avatar, path.join('avatars', `${seed}.svg`));
}
