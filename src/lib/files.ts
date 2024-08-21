import * as fs from "node:fs";
import path from "node:path";


class Files {
    save(data: any, file_path: string) {

        let abs_path = path.join(process.cwd(),'public','uploads',file_path);

        // create the folder path if it doesn't exist
        let folder = path.dirname(abs_path);
        if(!fs.existsSync(folder)){
            fs.mkdirSync(folder, { recursive: true });
        }

        // save raw file to path
        fs.writeFileSync(abs_path, data);
        let url = new URL(process.env.APP_URL as string);
        url.pathname = path.join('uploads',file_path);

        return url.toString();
    }
}

const files = new Files()

export default files;