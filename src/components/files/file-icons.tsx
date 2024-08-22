import {
    IconFileMusic,
    IconFileTypeBmp, IconFileTypeCsv,
    IconFileTypeDocx,
    IconFileTypeJpg,
    IconFileTypePdf,
    IconFileTypePng, IconFileTypePpt,
    IconFileTypeTxt, IconFileTypeXls, IconFileTypeZip, IconMusic, IconProps, IconVideo, TablerIcon
} from "@tabler/icons-react";

// provide a mapping from file extensions to icons

const fileIcons: Record<string, TablerIcon> = {
    // documents
    pdf: IconFileTypePdf,
    docx: IconFileTypeDocx,
    doc: IconFileTypeDocx,
    xls: IconFileTypeXls,
    xlsx: IconFileTypeXls,
    ppt: IconFileTypePpt,
    pptx: IconFileTypePpt,
    csv: IconFileTypeCsv,
    // images
    png: IconFileTypePng,
    jpg: IconFileTypeJpg,
    jpeg: IconFileTypeJpg,
    bmp: IconFileTypeBmp,
    // videos
    mp4: IconVideo,
    avi: IconVideo,
    mov: IconVideo,
    mkv: IconVideo,
    // audio
    mp3: IconFileMusic,
    wav: IconFileMusic,
    ogg: IconFileMusic,
    flac: IconFileMusic,
    // misc
    zip: IconFileTypeZip,
    '7z': IconFileTypeZip,
    rar: IconFileTypeZip,
    // plain
    txt: IconFileTypeTxt,
    log: IconFileTypeTxt,
};

export function GetFileIcon(filename: string) {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (!ext) {
        return IconFileTypeTxt;
    }
    return fileIcons[ext] || IconFileTypeTxt;
}

interface FileIconProps extends IconProps {
    filename: string;
}

export const FileIcon = ({filename, ...props}: FileIconProps) => {
    const Icon = GetFileIcon(filename);
    return <Icon size={24} {...props} />;
}

export default fileIcons;