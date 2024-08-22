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
    status_change: IconStatusChange,
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

    const statusTextDef = 'group-data-[type="create"]:text-success-500 group-data-[type="update"]:text-primary-500 group-data-[type="status_change"]:text-warning-500'

    return (
        <div
            className={'flex flex-row group items-center space-x-2 -translate-x-3.5'}
            data-type={activity.type}
        >
            <div className={'rounded-full bg-background border border-foreground-100 p-1'}>
                <ActivityIcon
                    type={activity.type}
                    size={16}
                    className={cn(statusTextDef)}
                />
            </div>
            <div>
                <p className={cn('text-xs uppercase font-medium', statusTextDef)}>{activity.type}</p>
                <p className={'text-sm'}>
                    {activity.description}
                </p>
                <p className={'text-xs text-foreground-500'}>
                    {formatDistanceToNow(activity.created_at!, {
                        addSuffix: true,
                    })}
                </p>
            </div>
        </div>

    )

}

export default LogActivityItem;