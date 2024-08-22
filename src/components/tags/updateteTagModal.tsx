"use client"

import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Button, Input, PopoverContent, PopoverTrigger} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {Popover} from "@nextui-org/popover";
import {HexColorPicker} from "react-colorful";
import {useMutation} from "@tanstack/react-query";
import {CreateTag} from "@/components/tags/createTagModal.actions";
import queryClient from "@/lib/queryClient";
import ErrorNotice from "@/components/notices/errorNotice";
import {Tag} from "@prisma/client";
import {UpdateTag} from "@/components/tags/updateTagModal.actions";

interface UpdateTagModalProps {
    isOpen: boolean;
    onClose: () => void;
    tag?: Tag;
}

const UpdateTagModal = (props: UpdateTagModalProps) => {

    const [title, setTitle] = useState('');
    const [color, setColor] = useState('#858a93');

    const {mutate, isPending, error} = useMutation({
        mutationKey: ['update-tag', props.tag?.id],
        mutationFn: async () => {
            console.log("Create Tag", title, color)
            if(!props.tag){
                throw new Error("NO_TAG_SELECTED")
            }
            let result = UpdateTag(props.tag.id, {
                title: title.trim(),
                color: color
            })
            await queryClient.refetchQueries({
                queryKey: ['tags']
            });
            return result;
        },
        onSuccess: () => {
            props.onClose()
        }
    });

    useEffect(() => {
        setTitle(props.tag?.title || '');
        setColor(props.tag?.color || '#858a93');
    }, [props.tag]);

    return (
        <Modal
            isOpen={props.isOpen}
            onClose={props.onClose}
        >
            <ModalContent>
                <ModalHeader>
                    Update Tag
                </ModalHeader>
                <ModalBody>
                    <Input
                        label={'Title'}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div>
                        <p className={'text-xs text-foreground-500 mb-0'}>Color</p>
                        <Popover>
                            <PopoverTrigger>
                                <Button
                                    variant={'light'}
                                    size={'sm'}
                                    className={'justify-start p-0.5'}
                                    startContent={(
                                        <div
                                            className={'w-6 h-6 rounded-full'}
                                            style={{
                                                backgroundColor: color,
                                            }}
                                        />
                                    )}
                                >
                                    {color}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className={'p-0.5'}>
                                <HexColorPicker color={color} onChange={setColor}/>
                            </PopoverContent>
                        </Popover>
                    </div>
                    {
                        error && (
                            <ErrorNotice message={error.message} />
                        )
                    }
                </ModalBody>
                <ModalFooter>
                    <Button
                        size={'sm'}
                        variant={'flat'}
                        onClick={props.onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        size={'sm'}
                        color={'primary'}
                        onClick={() => {
                            // Create tag
                            mutate();
                        }}
                    >
                        Save Tag
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )

}

export default UpdateTagModal