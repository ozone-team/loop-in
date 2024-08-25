"use client"

import {UserListItem} from "@/types/users";
import {useEffect, useMemo, useState} from "react";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Button} from "@nextui-org/react";
import toast from "react-hot-toast";
import queryClient from "@/lib/queryClient";
import {useMutation} from "@tanstack/react-query";
import {BanUser} from "./banUserModal.actions";


interface BanUserModalProps {
    user?: UserListItem;
    onClose: () => void;
}

const BanUserModal = ({user, onClose}: BanUserModalProps) => {

    const {mutate, isPending, error} = useMutation({
        mutationFn: async () => {
            if (!user) {
                throw new Error('No user to update');
            }
            await BanUser(user?.id)
            await queryClient.refetchQueries({
                queryKey: ['users']
            })
        },
        onSuccess: () => {
            toast.success('User banned');
            onClose();
        },
        onError: (e) => {
            toast.error('Failed to ban user')
        }
    })

    return (
        <Modal
            isOpen={Boolean(user)}
            onClose={onClose}
        >
            <ModalContent>
                <ModalHeader>
                    Ban User
                </ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to ban this user?</p>
                    <p>They will not be able to login, post or comment</p>
                </ModalBody>
                <ModalFooter>
                    <Button
                        onClick={onClose}
                        variant={'flat'}
                        size={'sm'}
                    >
                        Cancel
                    </Button>
                    <Button
                        color={'danger'}
                        size={'sm'}
                        onClick={() => {
                            mutate()
                        }}
                        isLoading={isPending}
                    >
                        Ban User
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )

}

export default BanUserModal;