import Image from "next/image";
import {prisma} from "@/lib/prisma";
import StatusColumn from "@/components/boards/statusColumn";

export default async function Home() {

    const statuses = await prisma.status.findMany({
        where: {
            show_in_roadmap: true,
        },
        include: {
            posts: {
                include: {
                    category: true,
                    tags: {
                        select: {
                            tag: true
                        }
                    },
                    created_by: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    }
                },
                where: {
                    board: {
                        show_in_roadmap: true
                    }
                }
            }
        },
        orderBy: {
            index: 'asc'
        }
    })

    return (
        <main className={'container p-4'}>
            <h1 className={'text-lg'}>Roadmap</h1>
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
    );
}


