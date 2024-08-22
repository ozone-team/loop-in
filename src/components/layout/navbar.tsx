"use client"

import {Board, Prisma} from "@prisma/client";
import {prisma} from "@/lib/prisma";
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tab, Tabs, User} from "@nextui-org/react";
import {Session} from "next-auth";
import {useMemo} from "react";
import Link from "next/link";
import {PlusFilledIcon} from "@nextui-org/shared-icons";
import {IconDoorExit, IconKey, IconPlus, IconSettings, IconUser} from "@tabler/icons-react";
import {useParams, usePathname} from "next/navigation";
import {useModals} from "@/components/providers/modals.provider";
import Image from "next/image";

interface NavbarProps {
    boards: Board[];
    siteName: string;
    user?: Session['user']
    logo: string;
}

interface ProfileDropdownItem {
    key: string;
    title: string;
    href: string;
    icon: any;
    color?: "default" | "danger" | "primary" | "secondary" | "success" | "warning" | undefined;
}

const Navbar = (props: NavbarProps) => {

    const modals = useModals();
    const pathname = usePathname();

    const items = useMemo(() => {

        if (props.user) {
            return [
                {
                    key: 'profile',
                    icon: IconUser,
                    title: 'Profile',
                    href: '/profile'
                },
                props.user.is_admin ?
                    {
                        key: 'admin',
                        icon: IconSettings,
                        title: 'Admin',
                        href: '/admin'
                    }
                    : undefined,
                {
                    key: 'logout',
                    icon: IconDoorExit,
                    color: 'danger',
                    title: 'Logout',
                    href: '/api/auth/signout'
                }
            ].filter(Boolean) as ProfileDropdownItem[];
        } else {
            return [
                {
                    key: 'login',
                    title: 'Login',
                    href: '/signin',
                    icon: IconKey,
                    color: 'primary'
                }
            ] as ProfileDropdownItem[]
        }

    }, [props.user])

    return (
        <div className={'flex flex-row items-center justify-center p-4 border-b border-b-foreground-100'}>
            <div className={'container flex flex-row items-center w-full justify-between space-x-6'}>
                <div className={'flex flex-row items-center space-x-2'}>
                    <Image
                        width={64}
                        height={64}
                        className={'w-16 h-16 object-contain'}
                        src={props.logo}
                        alt={''}
                        onError={e => {
                            // destroy the image element if it fails to load
                            e.currentTarget.remove()
                        }}
                    />
                    <p>{props.siteName}</p>
                </div>

                <Tabs
                    selectedKey={(pathname as string)}
                >
                    <Tab
                        key={'/roadmap'}
                        title={"Roadmap"}
                        as={Link}
                        href={'/roadmap'}
                    />
                    {
                        props.boards.map((board) => (
                            <Tab
                                key={`/board/${board.id}`}
                                title={board.title}
                                as={Link}
                                href={`/board/${board.id}`}
                            />
                        ))
                    }
                </Tabs>
                <div className={'flex flex-row items-center space-x-2'}>
                    <Button
                        variant={'light'}
                        startContent={(
                            <IconPlus size={18}/>
                        )}
                        size={'sm'}
                        onClick={() => modals.newPost.onOpen()}
                    >
                        New Post
                    </Button>
                    <Dropdown>
                        <DropdownTrigger>
                            <User
                                className={'cursor-pointer'}
                                name={props.user?.name || 'Account'}
                                avatarProps={{
                                    src: props.user?.image || undefined,
                                    size: 'sm'
                                }}
                            />
                        </DropdownTrigger>
                        <DropdownMenu
                            items={items}
                        >
                            {(item) => (
                                <DropdownItem
                                    as={Link}
                                    href={item.href}
                                    color={item.color || 'default'}
                                    startContent={(
                                        <item.icon size={18}/>
                                    )}
                                >
                                    {item.title}
                                </DropdownItem>
                            )}
                        </DropdownMenu>
                    </Dropdown>
                </div>

            </div>
        </div>
    )

}

export default Navbar