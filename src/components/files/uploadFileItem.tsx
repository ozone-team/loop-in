import { useMutation } from "@tanstack/react-query";
import {useEffect} from "react";
import {Button, Spinner} from "@nextui-org/react";
import {IconX} from "@tabler/icons-react";
import Image from 'next/image';
import {FileIcon} from "@/components/files/file-icons";
import {UploadFile} from "@/app/(actions)/upload-file";

interface UploadFileItemProps {
    file: File;
    onDelete: () => void;
    onUploaded: (url: string) => void;
}

const UploadFileItem = (props: UploadFileItemProps) => {

    const {mutate:upload, isPending, error, isSuccess} = useMutation({
        mutationKey: ['upload-file', props.file.name],
        mutationFn: async () => {
            const formData = new FormData();
            formData.append('file', props.file);
            return await UploadFile(formData)
        },
        onSuccess: (url) => {
            props.onUploaded(url)
        },
        onError: (error) => {
            console.error(error)
            props.onDelete()
        }
    })

    useEffect(() => {
        if(!isPending && !isSuccess){
            upload()
        }
    }, [props.file])

    return (
        <div className={'relative group'}>
            {
                (isPending) ?
                    <div className={'w-full z-10 h-full rounded-xl absolute top-0 left-0 grid place-items-center bg-background/80 border border-foreground-200'}>
                        <Spinner size={'sm'} color={'primary'} />
                    </div>
                    :
                    <></>
            }
            {
                props.file.type.startsWith('image') ?
                    <Image
                        src={URL.createObjectURL(props.file)} width={128} height={128}
                        className={'w-full max-h-28 relative z-0 object-contain rounded-lg border border-foreground-100'}
                        alt={props.file.name}
                        aria-label={props.file.name}
                        title={props.file.name}
                    />
                    :
                    <div
                        className={'bg-foreground-100 p-4 rounded-xl flex flex-col space-y-2 items-center justify-center'}
                        aria-label={props.file.name}
                        title={props.file.name}
                    >
                        <FileIcon filename={props.file.name} className={'text-foreground-600'} />
                        <p className={'text-xs text-foreground-600 text-wrap w-full text-center overflow-ellipsis overflow-hidden'}>{props.file.name}</p>
                    </div>

            }
            <Button
                isIconOnly={true}
                size={'sm'}
                variant={'light'}
                color={'danger'}
                className={'absolute top-2 right-2 group-hover:opacity-100 opacity-0 z-20 transition-all bg-black/40'}
                aria-label={'Remove Media'}
                title={'Remove Media'}
                onClick={() => props.onDelete()}
            >
                <IconX size={17}/>
            </Button>
        </div>
    )

}



export default UploadFileItem