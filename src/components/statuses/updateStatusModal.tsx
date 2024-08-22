import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Button, Checkbox, Input, PopoverContent, PopoverTrigger} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {HexColorPicker} from "react-colorful";
import {Popover} from "@nextui-org/popover";
import {useMutation} from "@tanstack/react-query";
import {CreateStatus} from "@/components/statuses/createStatusModal.actions";
import queryClient from "@/lib/queryClient";
import ErrorNotice from "@/components/notices/errorNotice";
import {Status} from "@prisma/client";
import {DeleteStatus, UpdateStatus} from "@/components/statuses/updateStatusModal.actions";
import {DeleteBoard} from "@/components/boards/updateBoardModal.actions";
import DeleteButton from "@/components/buttons/deleteButton";

interface UpdateStatusModalProps {
    status?: Status;
    isOpen: boolean;
    onClose: () => void;
}

const UpdateStatusModal = (props:UpdateStatusModalProps) => {

    const [title, setTitle] = useState('');
    const [color, setColor] = useState('#858a93');
    const [isDefault, setIsDefault] = useState(false);
    const [showInRoadmap, setShowInRoadmap] = useState(false);

    const {mutate, isPending, error} = useMutation({
        mutationFn: async () => {
            console.log("Create Status", title, color, isDefault)

            if(!props.status){
                throw new Error("NO_STATUS_SELECTED")
            }

            const result = await UpdateStatus(props.status!.id, {
                title: title.trim(),
                color: color,
                isDefault: isDefault,
                showInRoadmap: showInRoadmap
            })
            await queryClient.refetchQueries({
                queryKey: ['statuses']
            });
            return result;
        },
        onSuccess: () => {
            props.onClose()
        }
    })

    const {mutate: deleteBoard, isPending: isDeleting, error: deleteError} = useMutation({
        mutationFn: async () => {
            if(!props.status?.id) throw new Error('No board id provided');
            let result = await DeleteStatus(props.status.id)
            await queryClient.refetchQueries({
                queryKey: ['statuses']
            });
        },
        onSuccess: () => {
            props.onClose();
        },
        mutationKey: ['delete-board', props.status?.id]
    })

    useEffect(() => {
        if(props.status){
            setTitle(props.status.title )
            setColor(props.status.color)
            setIsDefault(props.status.is_default)
            setShowInRoadmap(props.status.show_in_roadmap)
        }
    }, [props.status])

    return (
        <Modal
            isOpen={props.isOpen}
            onClose={props.onClose}
            title={'Update Status'}
        >
            <ModalContent>
                <ModalHeader>
                    Update Status
                </ModalHeader>
                <ModalBody>
                    <Input
                        label={"Status Title"}
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
                    <Checkbox
                        isSelected={isDefault}
                        onChange={(e) => setIsDefault(e.target.checked)}
                    >
                        Default Status
                    </Checkbox>
                    <Checkbox
                        isSelected={showInRoadmap}
                        onChange={(e) => setShowInRoadmap(e.target.checked)}
                    >
                        Show In Roadmap
                    </Checkbox>
                    {
                        error ?
                            <ErrorNotice message={error.message} />
                            :
                            <></>
                    }
                </ModalBody>
                <ModalFooter>
                    <DeleteButton
                        onDelete={()=>deleteBoard()}
                        isDeleting={isDeleting}
                        confirmLabel={'Are you sure you want to delete this status?'}
                    />
                    <div className={'flex-grow'} />
                    <Button
                        size={'sm'}
                        variant={'flat'}
                        onClick={()=>props.onClose()}
                    >
                        Cancel
                    </Button>
                    <Button
                        size={'sm'}
                        color={'primary'}
                        onClick={()=>mutate()}
                        isLoading={isPending}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default UpdateStatusModal