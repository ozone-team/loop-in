import {Button, ButtonProps, PopoverContent, PopoverProps, PopoverTrigger, useDisclosure} from "@nextui-org/react";
import {Popover} from "@nextui-org/popover";

interface DeleteButtonProps {
    onDelete: () => void;
    isDeleting?: boolean;
    buttonProps?: ButtonProps;
    confirmLabel?: string;
    deleteButtonLabel?: string;
    classNames?: {
        button?: string;
        confirmLabel?: string;
    }
    popoverProps?: Omit<PopoverProps, 'children'>
}

const DeleteButton = (props:DeleteButtonProps) => {

    const {isOpen: confirmOpen, onClose: closeConfirm, onOpen: openConfirm} = useDisclosure();

    return (
        <Popover
            {...props.popoverProps}
            isOpen={confirmOpen && !props.isDeleting}
            onOpenChange={(open) => {
                if(open) {
                    openConfirm();
                } else {
                    closeConfirm();
                }
            }}
        >
            <PopoverTrigger>
                <Button
                    color={'danger'}
                    size={'sm'}
                    {...props.buttonProps}
                    isLoading={props.isDeleting || props.buttonProps?.isLoading}
                >
                    {props.deleteButtonLabel || 'Delete'}
                </Button>
            </PopoverTrigger>
            <PopoverContent className={'flex flex-col items-end p-3 space-y-2'}>
                <p className={'text-xs'}>{props.confirmLabel || 'Are you sure you want to delete this?'}</p>
                <div className={'flex flex-row items-center space-x-2'}>
                    <Button
                        size={'sm'}
                        color={'default'}
                        variant={'flat'}
                        onClick={()=>closeConfirm()}
                    >
                        Cancel
                    </Button>
                    <Button
                        size={'sm'}
                        color={'danger'}
                        onClick={() => {
                            props.onDelete();
                            closeConfirm();
                        }}
                    >
                        Yes, delete it
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )

}

export default DeleteButton