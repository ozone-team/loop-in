"use client";

import StatusColumn from "@/components/boards/statusColumn";
import {GetRoadmap} from "@/app/(public)/roadmap/actions";
import {useQuery} from "@tanstack/react-query";
import {RoadmapStatus} from "@/types/posts";

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
            <div className={'grid grid-cols-3 gap-4 items-start justify-center'}>
                {
                    statuses.map((status) => (
                        <StatusColumn
                            key={status.id}
                            status={status}
                        />
                    ))
                }
            </div>
        </main>
    )

}

export default RoadmapPageClient