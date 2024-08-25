import { useMutation } from "@tanstack/react-query";
import {useEffect, useMemo} from "react";
import {Button, Spinner} from "@nextui-org/react";
import {IconX} from "@tabler/icons-react";
import Image from 'next/image';
import {FileIcon} from "@/components/files/file-icons";
import {UploadFile} from "@/app/(actions)/upload-file";

interface UploadFileItemProps {
    file: File | null;
    record?: FileRecord;
    onDelete: () => void;
    onUploaded: (url: string) => void;
}

const UploadFileItem = (props: UploadFileItemProps) => {

    const {mutate:upload, isPending, error, isSuccess} = useMutation({
        mutationKey: ['upload-file', props.file?.name],
        mutationFn: async () => {
            if(!props.file) return;
            const formData = new FormData();
            formData.append('file', props.file);
            return await UploadFile(formData)
        },
        onSuccess: (url) => {
            if(url) props.onUploaded(url)
        },
        onError: (error) => {
            console.error(error)
            props.onDelete()
        },
    })

    useEffect(() => {
        if(!isPending && !isSuccess && props.file){
            upload()
        }
    }, [props.file])

    const isImage = useMemo(() => {
        return props.record?.mime.startsWith('image') || props.file?.type.startsWith('image')
    }, [props.file, props.record])

    const fileDetails = useMemo(() => ({
        name: props.file?.name || props.record?.name || '',
        size: props.file?.size || props.record?.size,
        mime: props.file?.type || props.record?.mime,
        url: props.file ? URL.createObjectURL(props.file) : props.record?.url
    }), [props.file, props.record])

    return (
        <div className={'relative group/ufi'}>
            {
                (isPending) ?
                    <div className={'w-full z-10 h-full rounded-xl absolute top-0 left-0 grid place-items-center bg-background/80 border border-foreground-200'}>
                        <Spinner size={'sm'} color={'primary'} />
                    </div>
                    :
                    <></>
            }
            {
                isImage ?
                    <Image
                        src={fileDetails.url || ''} width={128} height={128}
                        className={'w-full max-h-28 max-w-28 relative z-0 object-contain rounded-lg border border-foreground-100'}
                        alt={fileDetails.name}
                        aria-label={fileDetails.name}
                        title={fileDetails.name}
                    />
                    :
                    <div
                        className={'bg-foreground-100 max-w-28 nax-h-28 p-4 rounded-xl flex flex-col space-y-2 items-center justify-center'}
                        aria-label={fileDetails.name}
                        title={fileDetails.name}
                    >
                        <FileIcon filename={fileDetails.name} className={'text-foreground-600'} />
                        <p className={'text-xs text-foreground-600 text-wrap w-full text-center overflow-ellipsis overflow-hidden'}>
                            {fileDetails.name}
                        </p>
                    </div>

            }
            <Button
                isIconOnly={true}
                size={'sm'}
                variant={'light'}
                color={'danger'}
                className={'absolute top-2 right-2 group-hover/ufi:opacity-100 opacity-0 z-20 transition-all bg-black/40'}
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