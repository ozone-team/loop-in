"use client";

import {Modal, ModalBody, ModalContent, ModalHeader} from "@nextui-org/modal";
import {Input, Select, SelectItem, Textarea} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import {NewPost_GetBoards} from "@/components/posts/newPostModal.actions";

interface NewPostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewPostModal = (props: NewPostModalProps) => {

    const params = useParams();

    const [title, setTitle] = useState<string>('');
    const [board, setBoard] = useState<string | null>(null);
    const [content, setContent] = useState<string>('');
    const [media, setMedia] = useState<string | null>(null);

    useEffect(() => {
        setBoard((params.board as string) || null)
        setTitle('')
    }, [props.isOpen])

    const {data, isPending: loadingBoards} = useQuery({
        queryKey: ['boards'],
        queryFn: async () => {
            return await NewPost_GetBoards();
        }
    })

    return (
        <Modal
            size={'xl'}
            isOpen={props.isOpen}
            onClose={props.onClose}
            title={'New Post'}
        >
            <ModalContent>
                <ModalHeader>
                    New Post
                </ModalHeader>
                <ModalBody>
                    <Input
                        placeholder={"Post Title"}
                        size={'lg'}
                    />
                    <Select
                        items={data || []}
                        isLoading={loadingBoards}
                        value={board || undefined}
                        onChange={(e) => setBoard(e.target.value)}
                        placeholder={"Select a board"}
                    >
                        {(item) => (
                            <SelectItem key={item.id} value={item.id}>
                                {item.title}
                            </SelectItem>
                        )}
                    </Select>
                    <Textarea
                        placeholder={"Post Content"}
                        size={'md'}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    )

}

export default NewPostModal