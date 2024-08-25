"use client";

import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Autocomplete, Button, Chip, Divider, Input, Select, SelectItem, Textarea} from "@nextui-org/react";
import {useEffect, useMemo, useRef, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useMutation, useQuery} from "@tanstack/react-query";
import {CreatePost, GetBoardsWithCategories, ListTags} from "@/components/posts/newPostModal.actions";
import Dropzone from "react-dropzone";
import {IconFiles, IconPlus, IconTagFilled, IconX} from "@tabler/icons-react";
import Image from "next/image";
import UploadFileItem from "@/components/files/uploadFileItem";
import queryClient from "@/lib/queryClient";
import ErrorNotice from "@/components/notices/errorNotice";
import toast from "react-hot-toast";
import {PostDetails} from "@/types/posts";
import {UpdatePost} from "@/components/posts/editPostModal.actions";

interface EditPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: PostDetails
}


const EditPostModal = (props: EditPostModalProps) => {

    const params = useParams();
    const router = useRouter();

    const fileRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState<string>('');
    const [board, setBoard] = useState<string | undefined>();
    const [category, setCategory] = useState<string | undefined>();
    const [tags, setTags] = useState<string[]>([]);
    const [content, setContent] = useState<string>('');
    const [media, setMedia] = useState<FileUploadItem[]>([]);

    useEffect(() => {
        console.log(props.post)
        setBoard((props.post.board_id as string) || undefined)
        setTitle(props.post.title)
        setContent(props.post.description)
        setMedia(props.post.media.map((m) => ({
            record: m,
            url: m.url,
        })));
        setCategory(props.post.category?.id)
        setTags(props.post.tags.map((t) => t.tag.id));
    }, [props.post])

    const {data: boards, isPending: loadingBoards} = useQuery({
        queryKey: ['boards-with-categories'],
        queryFn: async () => {
            return GetBoardsWithCategories();
        }
    });

    const {data: availableTags, isPending: loadingTags} = useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            return ListTags();
        }
    })

    const categories = useMemo(() => {
        return boards?.find((b) => b.id === board)?.categories || []
    }, [board, boards])

    useEffect(() => {
        setCategory(undefined)
    }, [board]);

    const hasPendingUploads = useMemo(() => {
        return media.some(f => !f.url)
    }, [media])

    const {mutate, isPending, error} = useMutation({
        mutationFn: async () => {
            console.log("Update Post", {title, board, category, tags, content, media})
            const result = await UpdatePost(props.post.id, {
                title: title.trim(),
                board: board!,
                category: category,
                content: content.trim(),
                media: media.filter(m=>m.url).map(f => ({
                    name: f.file!.name,
                    mime: f.file!.type,
                    url: f.url!,
                    size: f.file!.size,
                })) as any[],
                tags: tags
            })
            await queryClient.refetchQueries({
                queryKey: ['board', board, 'posts']
            });
            await queryClient.refetchQueries({
                queryKey: ['post', props.post.id]
            })
            return result;
        },
        onSuccess: (post) => {
            toast.success('Post updated successfully')
            if(post.id !== props.post.id){
                router.push(`/post/${post.id}`)
            }
            props.onClose()
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    return (
        <Modal
            size={'xl'}
            isOpen={props.isOpen}
            onClose={props.onClose}
            title={'New Post'}
            scrollBehavior={'outside'}
            classNames={{
                closeButton: 'z-20'
            }}
        >
            <Dropzone
                onDrop={acceptedFiles => setMedia(o=>[...o, ...(acceptedFiles.map(f => ({file: f})))] )}
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
                    <ModalContent>
                        <div
                            {...getRootProps({
                                className: 'relative'
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
                            <ModalHeader>
                                Update Post
                            </ModalHeader>
                            <ModalBody>
                                <Select
                                    items={boards || []}
                                    isLoading={loadingBoards}
                                    selectedKeys={board ? [board] : []}
                                    onChange={(e) => setBoard(e.target.value)}
                                    isRequired={true}
                                    label={"Board"}
                                    placeholder={"Select a board"}
                                    size={'sm'}
                                >
                                    {(item) => (
                                        <SelectItem key={item.id} value={item.id}>
                                            {item.title}
                                        </SelectItem>
                                    )}
                                </Select>
                                {board ?
                                    <Select
                                        size={'sm'}
                                        items={categories}
                                        selectedKeys={category ? [category] : []}
                                        onChange={(e) => setCategory(e.target.value)}
                                        label={"Category"}
                                        placeholder={"Select a category (optional)"}
                                    >
                                        {(item) => (
                                            <SelectItem key={item.id} value={item.id}>
                                                {item.title}
                                            </SelectItem>
                                        )}
                                    </Select>
                                    :
                                    <></>
                                }
                                <Divider className={'my-2 bg-foreground-100'} />
                                <Input
                                    placeholder={"Short, descriptive title"}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    isRequired={true}
                                    size={'lg'}
                                    variant={'flat'}
                                    className={'!bg-transparent'}
                                />
                                <Textarea
                                    placeholder={"Any additional details"}
                                    size={'md'}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                                <div>
                                    <p className={'text-sm text-foreground-500'}>Media</p>
                                    <input
                                        {...getInputProps()}
                                        ref={fileRef}
                                    />
                                    {
                                        media.length ?
                                            <div className={'grid grid-cols-4 items-start gap-4 w-full'}>
                                                {
                                                    media.map((file, ix) => (
                                                        <UploadFileItem
                                                            file={file.file || null}
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
                                                <div
                                                    className={'w-full max-h-28 h-full text-foreground-400 grid place-items-center border border-foreground-200 rounded-xl hover:bg-foreground-50 transition-all cursor-pointer'}
                                                    onClick={()=>fileRef.current?.click()}
                                                    title={'Add more media'}
                                                    aria-label={'Add more media'}
                                                >
                                                    <IconPlus size={18} />
                                                </div>
                                            </div>
                                            :
                                            <div
                                                className={'w-full p-5 rounded-lg border bg-foreground-100 text-center flex flex-col border-foreground-200 border-dashed hover:bg-foreground-200 transition-all cursor-pointer relative group'}
                                                onClick={() => fileRef.current?.click()}
                                            >
                                                <p className={'text-center text-sm text-foreground-500'}>Click or drag and drop to upload media</p>
                                            </div>
                                    }
                                </div>
                                <Select
                                    items={availableTags || []}
                                    isMultiline={true}
                                    selectionMode={"multiple"}
                                    selectedKeys={tags}
                                    multiple={true}
                                    label={'Tags'}
                                    onChange={(e) => {
                                        setTags(e.target.value.split(','))
                                    }}
                                    renderValue={(items) => (
                                        <div className="flex flex-wrap gap-2">
                                            {items.map((item) => (
                                                <Chip
                                                    key={item.key}
                                                    size={'sm'}
                                                    variant={'flat'}
                                                    startContent={(
                                                        <IconTagFilled color={item.data!.color} size={16} />
                                                    )}
                                                >
                                                    {item.data!.title}
                                                </Chip>
                                            ))}
                                        </div>
                                    )}
                                >
                                    {(tag) => (
                                        <SelectItem
                                            key={tag.id}
                                            value={tag.id}
                                            startContent={(
                                                <IconTagFilled size={18} color={tag.color} />
                                            )}
                                        >
                                            {tag.title}
                                        </SelectItem>
                                    )}
                                </Select>
                                {
                                    error ?
                                        <ErrorNotice message={error.message} />
                                        :
                                        <></>
                                }
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    size={'sm'}
                                    onClick={props.onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size={'sm'}
                                    color={'primary'}
                                    isDisabled={!title || !board || hasPendingUploads}
                                    isLoading={isPending}
                                    onClick={() => mutate()}
                                >
                                    Save Post
                                </Button>
                            </ModalFooter>
                        </div>

                    </ModalContent>
                )}
            </Dropzone>
        </Modal>
    )

}

export default EditPostModal