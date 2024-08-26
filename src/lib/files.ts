import { PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import path from "node:path";

const S3 = new S3Client({
    region: "auto",
    endpoint: process.env.S3_URL as string,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    },
    forcePathStyle: true
});


class Files {

    async saveBuffer(buffer: ArrayBuffer, file_path: string, contentType: string) {

        let filename = path.basename(file_path);
        let pathname = path.dirname(file_path);

        filename = `${Date.now()}-${filename}`;

        file_path = path.join(pathname, filename);

        await this.ToS3({
            data: buffer,
            file_path: file_path,
            contentType: contentType,
            acl: 'public-read'
        });
        return this.GetPublicUrl(file_path);
    }

    async save(file: File, file_path: string) {
        const data = await file.arrayBuffer();

        // first we prefix the file with the current timestamp to prevent collisions
        let filename = path.basename(file_path);
        let pathname = path.dirname(file_path);

        filename = `${Date.now()}-${filename}`;

        file_path = path.join(pathname, filename);

        await this.ToS3({
            data: data,
            file_path: file_path,
            contentType: file.type,
            acl: 'public-read'
        });
        return this.GetPublicUrl(file_path);
    }

    GetPublicUrl(path:string){

        if(process.env.S3_URL_OUTPUT){
            let url = process.env.S3_URL_OUTPUT;
            url = url.replace('[url]', process.env.S3_PUBLIC_URL as string);
            url = url.replace('[object]', path);
            url = url.replace('[bucket]', process.env.S3_BUCKET as string);
            return url;
        }

        return `${process.env.S3_PUBLIC_URL}/${path}`;
    }

    async ToS3(options: ToS3Options){
        return await S3.send(new PutObjectCommand({
            Bucket: process.env.S3_BUCKET as string,
            Key: `${options.file_path}`,
            Body: new Uint8Array(options.data),
            ContentType: options.contentType,
            ACL: (options.acl || 'public-read') as any,
            CacheControl: 'no-cache',
            ContentDisposition: options.contentDisposition,
        }));
    }
}

type ACL = 'private' | 'public-read' | 'public-read-write' | 'authenticated-read' | 'aws-exec-read' | 'bucket-owner-read' | 'bucket-owner-full-control' | 'log-delivery-write';
interface ToS3Options {
    data: ArrayBufferLike,
    file_path: string;
    contentType: string;
    acl?: ACL;
    contentDisposition?: string;
}

const files = new Files()

export default files;