"use client"

import {useRef, useState} from "react";
import {Button, Input, Spinner} from "@nextui-org/react";
import Image from "next/image";
import {useMutation} from "@tanstack/react-query";
import SuccessNotice from "@/components/notices/successNotice";
import ErrorNotice from "@/components/notices/errorNotice";
import {UpdateSiteSettings, UploadSiteLogo} from "@/app/(public)/admin/actions";

interface SiteSettingsPageClientProps {
    siteName: string;
    siteLogo: string;
}


const SiteSettingsPageClient = (props: SiteSettingsPageClientProps) => {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [siteName, setSiteName] = useState(props.siteName);
    const [siteLogo, setSiteLogo] = useState(props.siteLogo);

    const {mutate: uploadImage, isPending: isUploadingImage} = useMutation({
        mutationFn: async (file: File) => {
            const fd = new FormData();
            fd.append('site_logo', file);
            return await UploadSiteLogo(fd)
        },
        onError: (error) => {
            console.error(error)
            alert('Failed to upload image')
        },
        onSuccess: (data) => {
            setSiteLogo(data)
        }
    })

    const {mutate, isPending, error, isSuccess} = useMutation({
        mutationFn: async () => {
            await UpdateSiteSettings({
                siteName,
                siteLogo
            })
        },
    })

    return (
        <div className={'flex flex-col items-start space-y-4'}>
            <div className={'relative rounded-lg'}>
                <Image
                    src={siteLogo}
                    alt={'Site Logo'}
                    width={256}
                    height={256}
                    className={'w-24 h-24 rounded-lg object-contain border cursor-pointer relative z-0'}
                    onClick={() => fileInputRef.current?.click()}
                />
                {
                    isUploadingImage ?
                        <div className={'absolute w-full h-full z-10 flex flex-col items-center justify-center'}>
                            <Spinner size={'sm'} className={'relative'} />
                        </div>
                        :
                        <></>
                }
            </div>

            <input
                hidden={true}
                className={'hidden'}
                type={'file'}
                accept={'image/*'}
                ref={fileInputRef}
                onChange={e=>{
                    if(e.target.files?.length) {
                        uploadImage(e.target.files[0])
                    }
                }}
            />
            <Input label={"Site Name"} value={siteName} onChange={e => setSiteName(e.target.value)} />
            <Button
                size={'sm'}
                color={'primary'}
                onClick={() => mutate()}
                isLoading={isPending}
                isDisabled={!siteName?.trim()}
            >
                Save
            </Button>
            {
                isSuccess ?
                    <SuccessNotice message={'Site settings saved successfully.'} />
                    :
                    <></>
            }
            {
                error ?
                    <ErrorNotice message={error.message} />
                    :
                    <></>
            }
        </div>
    )

}

export default SiteSettingsPageClient