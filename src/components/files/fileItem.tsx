import { useMutation } from "@tanstack/react-query";
import {useEffect} from "react";
import {Button, Spinner} from "@nextui-org/react";
import {IconX} from "@tabler/icons-react";
import Image from 'next/image';
import {FileIcon} from "@/components/files/file-icons";
import {UploadFile} from "@/app/(actions)/upload-file";
import {PostMedia} from "@prisma/client";
import Link from "next/link";

interface FileItemProps {
    file: PostMedia;
}

const FileItem = (props: FileItemProps) => {

    return (
        <Link title={props.file.name} aria-label={props.file.name} href={props.file.url} target={"_blank"} className={'relative group'}>
            {
                props.file.mime.startsWith('image') ?
                    <Image
                        src={props.file.url}
                        width={128}
                        height={128}
                        className={'max-h-28 w-28 relative z-0 object-contain rounded-lg border border-foreground-100'}
                        alt={props.file.name}
                        aria-label={props.file.name}
                        title={props.file.name}
                    />
                    :
                    <div
                        className={'bg-foreground-100 p-4 w-28 h-28 rounded-xl flex flex-col space-y-2 items-center justify-center'}
                        aria-label={props.file.name}
                        title={props.file.name}
                    >
                        <FileIcon filename={props.file.name} className={'text-foreground-600'} />
                        <p className={'text-xs text-foreground-600 text-wrap w-full text-center overflow-ellipsis line-clamp-2 overflow-hidden'}>{props.file.name}</p>
                    </div>

            }
        </Link>
    )

}



export default FileItem