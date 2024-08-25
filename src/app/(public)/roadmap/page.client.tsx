"use client";

import StatusColumn from "@/components/boards/statusColumn";
import {GetRoadmap} from "@/app/(public)/roadmap/actions";
import {useQuery} from "@tanstack/react-query";
import {RoadmapStatus} from "@/types/posts";
import { ScrollShadow } from "@nextui-org/react";

interface RoadmapPageClientProps {
    statuses: RoadmapStatus[]
}

const RoadmapPageClient = (props:RoadmapPageClientProps) => {

    const {data: statuses} = useQuery({
        queryKey: ['roadmap'],
        queryFn: async () => {
            return await GetRoadmap()
        },
        initialData: props.statuses,
        refetchOnMount: true,
        refetchOnWindowFocus: true
    })

    return (
        <main className={'container p-4'}>
            <h1 className={'text-lg mb-4'}>Roadmap</h1>
            <ScrollShadow className={'w-full'} orientation={'horizontal'}>
                <div
                    style={{
                        //@ts-ignore
                        "--mobile-cols": props.statuses.length
                    }}
                    className={'grid grid-cols-3 gap-4 items-start justify-center mobile:grid-cols-[repeat(var(--mobile-cols),minmax(60vw,1fr))] mobile:justify-start'}
                >
                    {
                        statuses.map((status) => (
                            <StatusColumn
                                key={status.id}
                                status={status}
                            />
                        ))
                    }
                </div>
            </ScrollShadow>
        </main>
    )

}

export default RoadmapPageClient