import {prisma} from "@/lib/prisma";
import {auth} from "@/lib/auth";
import {IconAlertTriangle} from "@tabler/icons-react";
import ProfilePageClient from "@/app/(public)/profile/page.client";

const ProfilePage = async () => {

    const session = await auth();

    if(!session?.user){
        return (
            <div className={'container flex py-12 space-y-5 flex-col items-center'}>
                <IconAlertTriangle size={32} />
                <h1>Not logged in</h1>
            </div>
        )
    }

    return (
        <ProfilePageClient
            name={session.user.name}
            email={session.user.email}
        />
    )

}

export default ProfilePage