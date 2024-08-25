import {Prisma} from "@prisma/client";
import {useEffect, useRef, useState} from "react";
import Dropzone from "react-dropzone";
import {IconFiles, IconPaperclip} from "@tabler/icons-react";
import {Button, Textarea} from "@nextui-org/react";
import UploadFileItem from "@/components/files/uploadFileItem";
import {useMutation} from "@tanstack/react-query";
import {UpdateComment} from "@/components/comments/editCommentPanel.actions";
import toast from "react-hot-toast";

type CommentDetails = Prisma.CommentGetPayload<{
    include: {
        created_by: {
            select: {
                id: true;
                name: true;
                image: true;
            }
        },
        votes: {
            select: {
                user_id: true
            }
        },
        media: true
    }
}>

interface EditCommentPanelProps {
    comment: CommentDetails
    onUpdate: (data: CommentDetails) => void;
    onClose: () => void;
}

const EditCommentPanel = (props: EditCommentPanelProps) => {

    const fileRef = useRef<HTMLInputElement>(null);

    const [comment, setComment] = useState(props.comment.body);
    const [media, setMedia] = useState<FileUploadItem[]>(props?.comment?.media?.map((m) => ({
        record: {
            name: m.name,
            size: m.size,
            mime: m.mime,
            url: m.url,
        },
        url: m.url,
    })) || []);

    useEffect(() => {
        SetStates()
    }, [props.comment]);

    function SetStates(){
        setComment(props.comment.body)
        setMedia(props?.comment?.media?.map((m) => ({
            record: {
                name: m.name,
                size: m.size,
                mime: m.mime,
                url: m.url,
            },
            url: m.url,
        })) || [])
    }

    const {mutate: saveComment, isPending: isSavingComment} = useMutation({
        mutationKey: ['save-comment', props.comment.id],
        mutationFn: async () => {
            // Save comment
            return await UpdateComment(props.comment.id, {
                body: comment,
                media: media.map(m => ({
                    name: m.file?.name || m.record?.name || '',
                    size: m.file?.size || m.record?.size || 0,
                    mime: m.file?.type || m.record?.mime || 'application/octet-stream',
                    url: m.url || m.record?.url || ''
                }))
            })
        },
        onSuccess: (data) => {
            // Update the comment
            console.log('Comment updated')
            props.onUpdate(data)
            toast.success('Comment updated')
        },
        onError: (error) => {
            console.error(error)
            toast.error('Failed to update comment: ' + error.message)
        }
    })

    return (
        <Dropzone
            onDrop={acceptedFiles => setMedia(o => [...o, ...(acceptedFiles.map(f => ({file: f})))])}
            accept={{
                'image/*': ['.png', '.jpg', '.bmp', '.jpeg'],
                'video/*': ['.mp4', '.avi', '.mov', '.mkv'],
                'audio/*': ['.mp3', '.wav', '.ogg', '.flac'],
                'application/pdf': ['.pdf'],
                'application/msword': ['.doc', '.docx'],
                'application/vnd.ms-excel': ['.xls', '.xlsx'],
                'application/vnd.ms-powerpoint': ['.ppt', '.pptx'],
                'application/zip': ['.zip', '.rar', '.7z'],
                'text/plain': ['.txt', '.log'],
                'text/csv': ['.csv'],
            }}
            noClick={true}
        >
            {({getRootProps, getInputProps, isDragActive}) => (
                <div
                    {...getRootProps({
                        className: 'flex flex-col items-end space-y-2 relative w-full py-3'
                    })}
                >
                    {
                        isDragActive ?
                            <div
                                className={'absolute top-0 left-0 flex flex-col items-center space-y-2 justify-center w-full h-full rounded-xl bg-primary-500/50 z-10'}>
                                <IconFiles className={'text-white'} size={24}/>
                                <p className={'text-white font-medium'}>Drop files to upload</p>
                            </div>
                            :
                            <></>
                    }
                    <Textarea
                        placeholder={'Edit your comment...'}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    {
                        media.length ?
                            <div className={'flex flex-row items-start justify-start flex-wrap gap-4'}>
                                {
                                    media.map((file, ix) => (
                                        <UploadFileItem
                                            file={file.file || null}
                                            record={file.record}
                                            onDelete={() => setMedia(o => o.filter((_, i) => i !== ix))}
                                            key={ix}
                                            onUploaded={(url) => {
                                                setMedia(o => o.map((f, i) => i === ix ? {
                                                    ...f,
                                                    url
                                                } : f))
                                            }}
                                        />
                                    ))
                                }
                            </div>
                            :
                            <></>
                    }
                    <div className={'flex flex-row items-center justify-end space-x-2 w-full'}>
                        <Button
                            size={'sm'}
                            variant={'flat'}
                            onClick={() => {
                                props.onClose()
                                SetStates()
                            }}
                        >
                            Cancel
                        </Button>
                        <div className={'flex-grow'} />
                        <input
                            {...getInputProps()}
                            ref={fileRef}
                        />
                        <Button
                            size={'sm'}
                            isIconOnly={true}
                            variant={'flat'}
                            onClick={() => fileRef.current?.click()}
                        >
                            <IconPaperclip size={18}/>
                        </Button>
                        <Button
                            size={'sm'}
                            color={'primary'}
                            onClick={() => saveComment()}
                            isLoading={isSavingComment}
                        >
                            Update Comment
                        </Button>
                    </div>
                </div>
            )}
        </Dropzone>

    )

}

export default EditCommentPanel;