import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Button, Checkbox, Input, PopoverContent, PopoverTrigger} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {HexColorPicker} from "react-colorful";
import {Popover} from "@nextui-org/popover";
import {useMutation} from "@tanstack/react-query";
import {CreateStatus} from "@/components/statuses/createStatusModal.actions";
import queryClient from "@/lib/queryClient";
import ErrorNotice from "@/components/notices/errorNotice";

interface CreateStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateStatusModal = (props:CreateStatusModalProps) => {

    const [title, setTitle] = useState('');
    const [color, setColor] = useState('#858a93');
    const [isDefault, setIsDefault] = useState(false);
    const [showInRoadmap, setShowInRoadmap] = useState(false);

    const {mutate, isPending, error} = useMutation({
        mutationFn: async () => {
            console.log("Create Status", title, color, isDefault)
            const result = await CreateStatus({
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

    useEffect(() => {
        setTitle('')
        setColor('#858a93')
        setIsDefault(false)
    }, [props.isOpen])

    return (
        <Modal
            isOpen={props.isOpen}
            onClose={props.onClose}
            title={'Create Status'}
        >
            <ModalContent>
                <ModalHeader>
                    Create Status
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
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default CreateStatusModal