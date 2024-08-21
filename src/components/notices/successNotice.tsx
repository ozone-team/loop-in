
interface SuccessNoticeProps {
    message: string;
}

const SuccessNotice = ({ message }: SuccessNoticeProps) => {
    return (
        <div
            className={'bg-success-100 text-success-900 border-l-4 border-success-500 p-4 text-sm'}
            role={'alert'}
        >
            {message}
        </div>
    );
}

export default SuccessNotice;