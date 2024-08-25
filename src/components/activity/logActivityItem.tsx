"use client";

import { Prisma } from "@prisma/client";
import {IconArrowBadgeRight, IconPencil, IconPlus, IconProps, IconStatusChange, TablerIcon} from "@tabler/icons-react";
import {useMemo} from "react";
import {cn} from "@nextui-org/react";
import {formatDistanceToNow} from "date-fns";

interface LogActivityItemProps {
    activity: Prisma.PostActivityGetPayload<{
        include: {
            created_by: {
                select: {
                    id: true;
                    name: true;
                    image: true;
                };
            };
        };
    }>;
}

const ActivityIcons:Record<string, TablerIcon> = {
    create: IconPlus,
    update: IconPencil,
    status: IconStatusChange,
}



interface ActivityIconProps extends IconProps {
    type: string;
}

const ActivityIcon = (props: ActivityIconProps) => {
    const Icon = ActivityIcons[props.type];
    if(!Icon){
        return <IconArrowBadgeRight {...props} />
    }
    return <Icon {...props} />
}

const LogActivityItem = ({activity}: LogActivityItemProps) => {

    const statusTextDef = 'group-data-[type="create"]:text-success-500 group-data-[type="update"]:text-primary-500 group-data-[type="status"]:text-amber-500'

    return (
        <div
            className={'flex flex-row group items-start space-x-2 -translate-x-3.5'}
            data-type={activity.type.toLowerCase()}
        >
            <div className={'rounded-full bg-background border border-foreground-100 p-1'}>
                <ActivityIcon
                    type={activity.type}
                    size={16}
                    className={cn(statusTextDef)}
                />
            </div>
            <div className={'py-1.5'}>
                <p className={cn('text-xs uppercase font-medium', statusTextDef)}>
                    {activity.type}
                </p>
                <p className={'text-sm py-1'}>
                    {activity.description}
                </p>
                <p className={'text-xs text-foreground-500 mt-2'}>
                    {formatDistanceToNow(activity.created_at!, {
                        addSuffix: true,
                    })}
                </p>
            </div>
        </div>

    )

}

export default LogActivityItem;