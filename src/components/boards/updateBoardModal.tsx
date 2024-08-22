import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {
    Button, Checkbox,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input, PopoverContent,
    PopoverTrigger,
    Textarea
} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {IconPlus, IconX} from "@tabler/icons-react";
import {Board} from "@prisma/client";
import {DeleteBoard, GetBoardDetails, SaveBoard} from "@/components/boards/updateBoardModal.actions";
import {useMutation, useQuery} from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import AsyncModal from "@/components/modals/AsyncModal";
import {Popover} from "@nextui-org/popover";
import DeleteButton from "@/components/buttons/deleteButton";

interface CreateBoardModalProps {
    isOpen: boolean;
    onClose: () => void;
    board?: Board;
}

const UpdateBoardModal = (props:CreateBoardModalProps) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [showInRoadmap, setShowInRoadmap] = useState(false);

    const [newCategory, setNewCategory] = useState('');

    const {data: board, isPending: isLoadingBoard} = useQuery({
        queryKey: ['board', props.board?.id],
        queryFn: async () => {
            if(!props.board?.id) return null;
            return GetBoardDetails(props.board!.id);
        },
        initialData: props.board ? {
            ...props.board,
            categories: []
        } : undefined,
        enabled: Boolean(props.board?.id)
    })

    useEffect(() => {
        setCategories(board?.categories?.map((c) => c.title) || [])
        setTitle(board?.title || '')
        setDescription(board?.description || '')
        setShowInRoadmap(board?.show_in_roadmap || false)
    }, [board])

    const {mutate, isPending, isError} = useMutation({
        mutationKey: ['updateBoard', props.board?.id],
        mutationFn: async () => {
            return await SaveBoard(props.board!.id, {
                title,
                description,
                categories,
                showInRoadmap: showInRoadmap,
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['boards']
            })
            props.onClose();
        }
    });

    const {mutate: deleteBoard, isPending: isDeleting, error: deleteError} = useMutation({
        mutationFn: async () => {
            if(!props.board?.id) throw new Error('No board id provided');
            await DeleteBoard(props.board.id)
            await queryClient.refetchQueries({
                queryKey: ['boards']
            });
        },
        onSuccess: () => {
            props.onClose();
        },
        mutationKey: ['delete-board', props.board?.id]
    })

    return (
        <AsyncModal
            isOpen={props.isOpen}
            onClose={props.onClose}
            title={'Create Board'}
            isLoading={isLoadingBoard}
        >
            <ModalContent>
                <ModalHeader>
                    Update Board
                </ModalHeader>
                <ModalBody>
                    <Input
                        label={"Board Title"}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Textarea
                        value={description}
                        label={"Board Description"}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Checkbox
                        isSelected={showInRoadmap}
                        onValueChange={setShowInRoadmap}
                    >
                        Show In Roadmap
                    </Checkbox>
                    <div className={'flex flex-col space-y-2'}>
                        <p className={'text-sm text-foreground-500'}>Categories</p>
                        {
                            categories.map((c, ix) => (
                                <Input
                                    key={ix}
                                    value={c}
                                    onChange={(e) => {
                                        const newCategories = [...categories];
                                        newCategories[ix] = e.target.value;
                                        setCategories(newCategories)
                                    }}
                                    endContent={(
                                        <Button
                                            size={'sm'}
                                            isIconOnly={true}
                                            color={'danger'}
                                            variant={'light'}
                                            onClick={() => {
                                                const newCategories = [...categories];
                                                newCategories.splice(ix, 1);
                                                setCategories(newCategories)
                                            }}
                                        >
                                            <IconX size={18} />
                                        </Button>
                                    )}
                                />
                            ))
                        }
                        <Input
                            placeholder={"Add Category"}
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            endContent={(
                                <Button
                                    size={'sm'}
                                    isIconOnly={true}
                                    color={'primary'}
                                    variant={'light'}
                                    onClick={() => {
                                        setCategories([...categories, newCategory]);
                                        setNewCategory('')
                                    }}
                                >
                                    <IconPlus size={18} />
                                </Button>
                            )}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <DeleteButton
                        onDelete={() => {
                            deleteBoard();
                        }}
                        isDeleting={isDeleting}
                        confirmLabel={'Are you sure you want to delete this board?'}
                    />
                    <div className={'flex-grow'} />
                    <Button
                        size={'sm'}
                        variant={'flat'}
                        onClick={props.onClose}
                    >
                        Close
                    </Button>
                    <Button
                        color={'primary'}
                        onClick={() => {
                            mutate()
                        }}
                        isLoading={isPending}
                        size={'sm'}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </AsyncModal>
    )

}

export default UpdateBoardModal;