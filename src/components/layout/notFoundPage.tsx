


const NotFoundPage = ({message}:{message: string}) => {
    return (
        <div className={'w-full p-16 flex flex-col items-center'}>
            <h1>404 Not Found</h1>
            <p>{message}</p>
        </div>
    );
}

export default NotFoundPage;