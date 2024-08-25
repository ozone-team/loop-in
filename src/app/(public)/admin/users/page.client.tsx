"use client";

import {ListUsers} from "@/app/(public)/admin/users/actions";
import {
    Button,
    Dropdown, DropdownItem, DropdownMenu,
    DropdownTrigger, Pagination, Spinner,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
    User
} from "@nextui-org/react";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {useEffect, useMemo, useState} from "react";
import {TableColumn} from "@nextui-org/table";
import queryClient from "@/lib/queryClient";
import {IconCheck, IconDots, IconEdit, IconUserX, IconX} from "@tabler/icons-react";
import EditUserModal from "@/components/users/editUserModal";
import {UserListItem} from "@/types/users";
import {useDebounceValue} from "usehooks-ts";
import { useSession } from "next-auth/react";

const UsersPageClient = () => {

    const {data: session} = useSession();

    const [selectedUser, setSelectedUser] = useState<UserListItem|undefined>(undefined)

    const [search, setSearch] = useState<string>('')
    const [sort, setSort] = useState<string>('name')
    const [page, setPage] = useState<number>(0)

    const [dbSearch] = useDebounceValue(search, 500)

    const {data, isPending} = useQuery({
        queryKey: ['users', {search: dbSearch, sort, page}],
        queryFn: async () => {
            return await ListUsers({
                search: dbSearch,
                sort,
                page
            })
        },
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        if(data && (page < data.pages)){
            queryClient.prefetchQuery({
                queryKey: ['users', {search, sort, page: page + 1}],
                queryFn: async () => {
                    return await ListUsers({
                        search,
                        sort,
                        page: page + 1
                    })
                }
            })
        }
    }, [data, page])


    return (
        <div>
            <Table
                removeWrapper={true}
            >
                <TableHeader>
                    <TableColumn>
                        Name
                    </TableColumn>
                    <TableColumn>
                        Email
                    </TableColumn>
                    <TableColumn>
                        Account Verified
                    </TableColumn>
                    <TableColumn>
                        # Posts
                    </TableColumn>
                    <TableColumn>
                        {' '}
                    </TableColumn>
                </TableHeader>
                <TableBody
                    isLoading={isPending}
                    loadingContent={<Spinner/>}
                    items={data?.data || []}
                >
                    {(item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <User name={item.name} avatarProps={{src: item.image || ''}}/>
                            </TableCell>
                            <TableCell>
                                <p>{item.email}</p>
                            </TableCell>
                            <TableCell>
                                {
                                    item.emailVerified ?
                                        <IconCheck className={'text-success-500'} size={18}/>
                                        :
                                        <IconX className={'text-danger-500'} size={18}/>
                                }
                            </TableCell>
                            <TableCell>
                                {item._count?.created_posts || 0}
                            </TableCell>
                            <TableCell>
                                <div
                                    className={'w-full flex flex-row justify-end'}
                                >
                                    <Dropdown
                                        placement={'bottom-end'}
                                        showArrow={true}
                                    >
                                        <DropdownTrigger>
                                            <Button size={'sm'} variant={'light'} isIconOnly={true}>
                                                <IconDots size={18} />
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            disabledKeys={item?.id === session?.user?.id ? ['ban-user'] : []}
                                        >
                                            <DropdownItem
                                                key={'edit-user'}
                                                startContent={(
                                                    <IconEdit size={18} />
                                                )}
                                                variant={'flat'}
                                                onClick={()=>setSelectedUser(item)}
                                            >
                                                Edit User
                                            </DropdownItem>
                                            <DropdownItem
                                                key={'ban-user'}
                                                color={'danger'}
                                                className={'text-danger-500'}
                                                variant={'flat'}
                                                startContent={(
                                                    <IconUserX size={18} />
                                                )}
                                            >
                                                Ban User
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className={'flex flex-row items-center justify-between'}>
                {
                    data ?
                        <Pagination
                            size={'sm'}
                            showControls={true}
                            total={data.pages || 0}
                            page={page}
                            onChange={setPage}
                            variant={'bordered'}
                            key={data?.pages}
                        />
                        :
                        <div />
                }
                <p className={'text-xs text-foreground-500'}>
                    {data?.record_count || 'loading'} users
                </p>
            </div>
            <EditUserModal
                user={selectedUser}
                onClose={()=>setSelectedUser(undefined)}
            />
        </div>
    )

}

export default UsersPageClient;