"use client";

import {UserListItem} from "@/types/users";
import {useEffect, useState} from "react";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Button, Input} from "@nextui-org/react";
import {UpdateUser} from "@/components/users/editUserModal.actions";
import queryClient from "@/lib/queryClient";
import {useMutation} from "@tanstack/react-query";
import toast from "react-hot-toast";
import ErrorNotice from "@/components/notices/errorNotice";

interface EditUserModalProps {
    user?: UserListItem;
    onClose: () => void;
}

const EditUserModal = ({ user, onClose }: EditUserModalProps) => {

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const {mutate, isPending, error} = useMutation({
        mutationFn: async () => {
            if(!user){
                throw new Error('No user to update');
            }
            await UpdateUser(user?.id, {
                email: email.trim(),
                name: name.trim()
            })
            await queryClient.refetchQueries({
                queryKey: ['users']
            })
        },
        onSuccess: () => {
            toast.success('User updated');
            onClose();
        },
        onError: (e) => {
            toast.error('Failed to update user')
        }
    })

    useEffect(() => {
        if(user){
            setName(user?.name || '');
            setEmail(user?.email);
        }
    }, [user]);

    return (
        <Modal
            isOpen={Boolean(user)}
            onClose={onClose}
        >
            <ModalContent>
                <ModalHeader>
                    Edit User
                </ModalHeader>
                <ModalBody className={'flex flex-col items-stretch space-y-2'}>
                    <Input
                        label={'Name'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        label={'Email'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        description={"Warning, changing the email address of the user will change their login"}
                    />
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
                        color={'primary'}
                        onClick={() => {
                            mutate()
                        }}
                        isLoading={isPending}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )

}

export default EditUserModal;