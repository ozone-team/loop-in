"use client"

import { Tag} from "@prisma/client";
import {Button, useDisclosure} from "@nextui-org/react";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {GetTags} from "@/app/(public)/admin/tags/actions";
import CreateTagModal from "@/components/tags/createTagModal";
import {IconTagFilled} from "@tabler/icons-react";
import UpdateTagModal from "@/components/tags/updateteTagModal";

interface TagSettingsPageClientProps {
    tags: Tag[];
}

const TagSettingsPageClient = (props:TagSettingsPageClientProps) => {

    const {isOpen: createTagOpen, onClose: closeCreateTag, onOpen: openCreateTag} = useDisclosure()
    const [selectedTag, setSelectedTag] = useState<Tag|undefined>()

    const {data: tags} = useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            return GetTags();
        },
        initialData: props.tags || []
    })

    return (
        <div>
            <div className={'flex flex-row items-center justify-between mb-4'}>
                <h1 className={'text-3xl'}>Tags</h1>
                <Button
                    size={'sm'}
                    color={'primary'}
                    onClick={() => openCreateTag()}
                >
                    New Tag
                </Button>
            </div>
            {
                !tags.length ?
                    <div className={'p-6 w-full border border-dashed rounded-xl flex flex-col items-center space-y-2 bg-foreground-50'}>
                        <p className={'text-sm text-foreground-500'}>
                            No Tags Found
                        </p>
                        <Button
                            size={'sm'}
                            variant={'flat'}
                            onClick={() => openCreateTag()}
                        >
                            New Tag
                        </Button>
                    </div>
                    :
                    <div className={'flex flex-row items-stretch gap-4 flex-wrap'}>
                        {tags.map((tag) => (
                            <div
                                key={tag.id}
                                className={'flex flex-row items-center space-x-2 p-3 rounded-lg border border-foreground-100 hover:bg-foreground-50 transition-all cursor-pointer'}
                                onClick={() => setSelectedTag(tag)}
                            >
                                <IconTagFilled color={tag.color} />
                                <p>{tag.title}</p>
                            </div>
                        ))
                        }
                    </div>
            }
            <CreateTagModal
                isOpen={createTagOpen}
                onClose={closeCreateTag}
            />
            <UpdateTagModal
                isOpen={Boolean(selectedTag)}
                onClose={()=>setSelectedTag(undefined)}
                tag={selectedTag}
            />
        </div>
    )

}

export default TagSettingsPageClient