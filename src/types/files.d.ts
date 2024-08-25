interface FileUploadItem {
    file?: File
    record?: FileRecord;
    url?: string;
}

type FileRecord = {
    name: string
    size: number
    mime: string
    url: string;
}