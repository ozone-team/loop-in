"use client"

import {Tab, Tabs} from "@nextui-org/react";
import {usePathname} from "next/navigation";
import Link from "next/link";

const AdminSideNav = () => {

    const pathname = usePathname();


    return (
        <Tabs
            isVertical={true}
            variant={'solid'}
            aria-orientation={'vertical'}
            selectedKey={pathname}
        >
            <Tab
                title={"Site Settings"}
                key={'/admin'}
                as={Link}
                href={'/admin'}
            />
            <Tab
                title={"Users"}
                key={'/admin/users'}
                as={Link}
                href={'/admin/users'}
            />
            <Tab
                title={"Boards"}
                key={'/admin/boards'}
                as={Link}
                href={'/admin/boards'}
            />
            <Tab
                title={"Statuses"}
                key={'/admin/statuses'}
                as={Link}
                href={'/admin/statuses'}
            />
            <Tab
                title={"Tags"}
                key={'/admin/tags'}
                as={Link}
                href={'/admin/tags'}
            />
        </Tabs>
    )

}

export default AdminSideNav