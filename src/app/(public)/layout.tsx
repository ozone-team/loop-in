
import {prisma} from "@/lib/prisma";
import Navbar from "@/components/layout/navbar";
import {Suspense} from "react";
import {auth} from "@/lib/auth";
import {ModalsProvider} from "@/components/providers/modals.provider";
import {GetConfig} from "@/lib/config";

const PublicLayout = async ({ children }: any) => {

    const boards = await prisma.board.findMany({
        orderBy: {
            index: 'asc'
        }
    });

    const config = await GetConfig('site_name', 'site_logo');

    const session = await auth();

    return (
        <ModalsProvider>
            <div className={'mobile:overflow-x-hidden w-full'}>
                <Navbar
                    logo={config.site_logo || '/logo.svg'}
                    boards={boards}
                    siteName={config.site_name}
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