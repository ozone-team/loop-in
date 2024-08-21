
interface ErrorNoticeProps {
    message: string;
}

const ErrorNotice = ({ message }: ErrorNoticeProps) => {
    return (
        <div
            className={'bg-danger-100 text-danger-800 border rounded-xl border-danger-200 p-4 text-sm'}
            role={'alert'}
        >
            {message}
        </div>
    );
}

export default ErrorNotice;