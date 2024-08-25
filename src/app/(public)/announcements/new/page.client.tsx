"use client"

import {Button, Input} from "@nextui-org/react";
import Tiptap from "@/components/rich-text-editor/tiptap";
import {useMutation} from "@tanstack/react-query";
import { useState } from "react";
import {PublishAnnouncement} from "@/app/(public)/announcements/new/actions";

const NewAnnouncementPageClient = () => {

    const [title, setTitle] = useState('')
    const [body, setBody] = useState<{html: string, plain: string}>({html: '', plain: ''})

    const {mutate, isPending} = useMutation({
        mutationKey: ['create-announcement'],
        mutationFn: async (data) => {
            // return await CreateAnnouncement(data)
            await PublishAnnouncement({
                title,
                content: body.html,
                content_plain: body.plain
            })
        },
    })

    return (
        <div className={'container max-w-2xl py-8 flex flex-col items-stretch mobile:px-4'}>
            <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={"Announcement Title"}
                className={'w-full bg-transparent mb-4 h-auto text-4xl'}
                classNames={{
                    input: 'text-4xl',
                    inputWrapper: '!h-auto py-2 bg-transparent shadow-none'
                }}
                size={'lg'}
            />
            <Tiptap
                onChange={setBody}
                content={body.html}
            />
            <Button
                color={'primary'}
                className={'self-end mt-4'}
                onClick={() => {
                    mutate()
                }}
                isLoading={isPending}
            >
                Publish Announcement
            </Button>
        </div>
    )

}

export default NewAnnouncementPageClient