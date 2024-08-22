import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Button} from "@nextui-org/react";
import Link from "next/link";
import {IconLogin, IconMoodSuprised} from "@tabler/icons-react";

interface SignInPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
}

const SignInPromptModal = (props:SignInPromptModalProps) => {

    return (
        <Modal
            isOpen={props.isOpen}
            onClose={props.onClose}
        >
            <ModalContent>
                <ModalHeader />
                <ModalBody className={'flex flex-col items-center'}>
                    <div className={'grid place-items-center w-16 h-16 rounded-full bg-foreground-100 text-primary-500'}>
                        <IconMoodSuprised />
                    </div>
                    <p className={'text-center'}>{props.message || 'You need to be signed in to continue'}</p>
                    <Button
                        className={'mt-2'}
                        variant={'solid'}
                        as={Link}
                        href={`/signin`}
                        color={'primary'}
                    >
                        Create an account
                    </Button>
                    <p className={'text-sm'}>Already have an account? <Link href={'/signin'} className={'text-primary-500 hover:underline'}>Sign In</Link></p>
                </ModalBody>
                <ModalFooter />
            </ModalContent>
        </Modal>
    )

}

export default SignInPromptModal