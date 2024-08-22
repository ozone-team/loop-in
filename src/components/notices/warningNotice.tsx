import {cn} from "@nextui-org/react";

interface WarningNoticeProps {
    message: string;
    className?: string;
}

const WarningNotice = (props: WarningNoticeProps) => {
    return (
        <div
            className={cn('bg-warning-100 text-warning-800 border rounded-xl border-warning-200 p-4 text-sm', props.className)}
            role={'alert'}
        >
            {props.message}
        </div>
    );
}

export default WarningNotice;