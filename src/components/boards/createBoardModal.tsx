import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Button, Checkbox, Input, Textarea} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {IconPlus, IconX} from "@tabler/icons-react";
import {useMutation} from "@tanstack/react-query";
import {CreateBoard} from "@/components/boards/createBoardModal.actions";
import queryClient from "@/lib/queryClient";
import ErrorNotice from "@/components/notices/errorNotice";

interface CreateBoardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateBoardModal = (props:CreateBoardModalProps) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [showInRoadmap, setShowInRoadmap] = useState(false);

    const [newCategory, setNewCategory] = useState('');

    const {mutate: createBoard, isPending, error} = useMutation({
        mutationFn: async () => {
            console.log("Create Board", title, description, categories)
            const result = await CreateBoard({
                title: title.trim(),
                description: description.trim(),
                categories: categories.map(c => c.trim()),
                showInRoadmap: showInRoadmap,
            })
            await queryClient.refetchQueries({
                queryKey: ['boards']
            });
            return result;
        },
        onSuccess: () => {
            props.onClose()
        }
    });

    useEffect(() => {
        setTitle('')
        setDescription('')
        setCategories([])
        setNewCategory('')
        setShowInRoadmap(false)
    }, [props.isOpen])

    return (
        <Modal
            isOpen={props.isOpen}
            onClose={props.onClose}
            title={'Create Board'}
        >
            <ModalContent>
                <ModalHeader>
                    Create Board
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
                            onKeyDown={(e) => {
                                if(e.key === 'Enter') {
                                    setCategories([...categories, newCategory]);
                                    setNewCategory('')
                                }
                            }}
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
                    {
                        error ?
                            <ErrorNotice message={error.message} />
                            :
                            <></>
                    }
                </ModalBody>
                <ModalFooter>
                    <Button
                        color={'primary'}
                        onClick={() => {
                            createBoard()
                        }}
                        isLoading={isPending}
                    >
                        Create Board
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )

}

export default CreateBoardModal