import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
import {Button, Tab, Tabs} from "@nextui-org/react";
import AdminSideNav from "@/components/layout/adminSideNav";


const AdminLayout = async ({ children }: any) => {

    const session = await auth();

    if(!session){
        redirect(`/api/auth/signin?redirect=${process.env.APP_URL}/admin`)
    }

    if(!session?.user?.is_admin){
        return (
            <div>
                <p>Unauthorised</p>
            </div>
        )
    }

    return (
        <div className={'container grid grid-cols-[128px_2fr] p-4 gap-4'}>
            <div>
                <AdminSideNav />
            </div>
            <div>
                {children}
            </div>
        </div>
    )

}

export default AdminLayout