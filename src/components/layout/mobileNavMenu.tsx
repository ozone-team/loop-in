"use client"

import {Modal, ModalBody, ModalHeader} from "@nextui-org/modal";
import {Avatar, Button, ModalContent, useDisclosure} from "@nextui-org/react";
import { Session } from "next-auth";
import Image from "next/image";
import {Board} from "@prisma/client";
import Link from "next/link";
import {IconArticle, IconPlus} from "@tabler/icons-react";
import {signOut} from "next-auth/react";
import {usePathname} from "next/navigation";
import {useModals} from "@/components/providers/modals.provider";

interface MobileNavMenuProps {
    isOpen: boolean;
    onClose: () => void;
    site: string;
    logo: string;
    user?: Session['user']
    boards: Board[];
}

const MobileNavMenu = (props:MobileNavMenuProps) => {

    const modals = useModals();
    const pathname = usePathname();

    return (
        <Modal
            isOpen={props.isOpen}
            onClose={props.onClose}
            placement={'top-center'}
        >
            <ModalContent>
                <ModalHeader className={'flex flex-row items-center space-x-2'}>
                    <Image
                        width={48}
                        height={48}
                        className={'w-8 h-8 object-contain'}
                        src={props.logo}
                        alt={''}
                        onError={e => {
                            // destroy the image element if it fails to load
                            e.currentTarget.remove()
                        }}
                    />
                    <p className={''}>
                        {props.site}
                    </p>
                </ModalHeader>
                <ModalBody className={'flex flex-col px-4'}>
                    <Button
                        variant={'light'}
                        className={'border border-foreground-200 rounded-xl'}
                        onClick={()=>{
                            modals.newPost.onOpen()
                        }}

                        startContent={(
                            <IconPlus size={18} />
                        )}
                    >
                        New Post
                    </Button>
                    {
                        props?.user?.is_admin ?
                            <Button
                                variant={'light'}
                                className={'border border-foreground-200 rounded-xl'}
                                as={Link}
                                href={'/announcements/new'}
                                startContent={(
                                    <IconArticle size={18} />
                                )}
                            >
                                New Announcement
                            </Button>
                            :
                            <></>
                    }
                    <Button
                        variant={'light'}
                        className={'rounded-none'}
                        as={Link}
                        href={'/'}
                    >
                        Home
                    </Button>
                    <Button
                        variant={'light'}
                        className={'rounded-none'}
                        as={Link}
                        href={'/roadmap'}
                    >
                        Roadmap
                    </Button>
                    {
                        props.boards.map((board) => (
                            <Button
                                key={board.id}
                                variant={'light'}
                                className={'rounded-none'}
                                as={Link}
                                href={`/board/${board.id}`}
                            >
                                {board.title}
                            </Button>
                        ))
                    }
                    {
                        !props.user ?
                            <>
                                <Button
                                    variant={'solid'}
                                    className={''}
                                    as={Link}
                                    href={'/signin'}
                                    color={'primary'}
                                >
                                    Sign In
                                </Button>

                            </>

                            :
                            <>
                                <Button
                                    variant={'light'}
                                    className={''}
                                    as={Link}
                                    href={'/profile'}
                                    startContent={(
                                        <Avatar
                                            className={'absolute left-2'}
                                            size={'sm'}
                                            src={props.user.image}
                                        />
                                    )}
                                >
                                    Profile
                                </Button>
                                <Button
                                    variant={'light'}
                                    className={'rounded-none text-danger-500'}
                                    onClick={() => {
                                        signOut({
                                            redirect: true,
                                            callbackUrl: pathname
                                        })
                                    }}
                                >
                                    Sign Out
                                </Button>
                            </>
                    }
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default MobileNavMenu;