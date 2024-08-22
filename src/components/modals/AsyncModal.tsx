import {Modal, ModalBody, ModalContent, ModalProps} from "@nextui-org/modal";
import {Spinner} from "@nextui-org/react";

interface AsyncModalProps extends ModalProps {
    isLoading: boolean;
    loader?: React.ReactNode;
}

const AsyncModal = (props:AsyncModalProps) => {

    return (
        <Modal
            {...props}
        >
            {props.isLoading ? (
                <ModalContent>
                    <ModalBody className={'p-12'}>
                        {
                            props.loader || <Spinner size={'md'} />
                        }
                    </ModalBody>
                </ModalContent>
            ) : (
                props.children
            )}
        </Modal>
    )

}

export default AsyncModal;