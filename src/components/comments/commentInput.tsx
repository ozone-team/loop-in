"use client"

import {Button, Textarea} from "@nextui-org/react";
import {useRef, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {GetPost} from "@/app/(public)/posts/[post]/actions";
import queryClient from "@/lib/queryClient";
import toast from "react-hot-toast";
import {SubmitComment} from "@/components/comments/commentInput.actions";
import {IconFiles, IconPaperclip} from "@tabler/icons-react";
import Dropzone from "react-dropzone";
import UploadFileItem from "@/components/files/uploadFileItem";

interface CommentInputProps {
    postId: string
    hasComments: boolean
}

const CommentInput = (props: CommentInputProps) => {

    const fileRef = useRef<HTMLInputElement>(null);

    const [comment, setComment] = useState('');
    const [media, setMedia] = useState<FileUploadItem[]>([]);

    const {mutate: submitComment, isPending: isSubmittingComment} = useMutation({
        mutationKey: ['submit-comment', props.postId],
        mutationFn: async () => {
            // Submit comment
            return await SubmitComment(props.postId, comment)
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['post', props.postId], data)
            setComment('')
        },
        onError: (error) => {
            console.error(error)
            toast.error('Failed to submit comment: ' + error.message)
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
                        className: 'flex flex-col items-end space-y-2 relative'
                    })}
                >
                    {
                        isDragActive ?
                            <div className={'absolute top-0 left-0 flex flex-col items-center space-y-2 justify-center w-full h-full rounded-xl bg-primary-500/50 z-10'}>
                                <IconFiles className={'text-white'} size={24} />
                                <p className={'text-white font-medium'}>Drop files to upload</p>
                            </div>
                            :
                            <></>
                    }
                    <Textarea
                        placeholder={props.hasComments ? 'Write a comment' : 'Be the first to write a comment'}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    {
                        media.length ?
                            <div className={'grid grid-cols-4 items-start gap-4 w-full'}>
                                {
                                    media.map((file, ix) => (
                                        <UploadFileItem
                                            file={file.file}
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

                    <div className={'flex flex-row items-center justify-end space-x-2'}>
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
                            onClick={() => submitComment()}
                            isLoading={isSubmittingComment}
                        >
                            Post Comment
                        </Button>
                    </div>
                </div>
            )}
        </Dropzone>
    )

}

export default CommentInput

