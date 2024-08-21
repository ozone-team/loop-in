
import {prisma} from "@/lib/prisma";
import Navbar from "@/components/layout/navbar";
import {Suspense} from "react";
import {auth} from "@/lib/auth";
import {ModalsProvider} from "@/components/providers/modals.provider";

const PublicLayout = async ({ children }: any) => {

    const boards = await prisma.board.findMany({
        orderBy: {
            index: 'asc'
        }
    });

    const {value: site_name} = await prisma.config.findFirstOrThrow({
        where: {
            key: 'site_name'
        }
    })

    const session = await auth();

    return (
        <ModalsProvider>
            <div>
                <Navbar
                    boards={boards}
                    siteName={site_name}
                    user={session?.user}
                />
                <div>
                    {children}
                </div>
            </div>
        </ModalsProvider>

    )

}

export default PublicLayout