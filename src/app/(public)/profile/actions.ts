"use server"

import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

interface ProfileUpdateDto {
    email: string;
    name: string;
}

export async function UpdateProfile(data: ProfileUpdateDto){

    const session = await auth();

    if(!session?.user){
        throw new Error('Not logged in');
    }

    let dbUser = await prisma.user.findUniqueOrThrow({
        where: {
            id: session.user.id
        }
    });


    // check if the email has changed, if so set the user to unverified
    let emailVerified = dbUser.email === data.email ? dbUser.emailVerified : null;


    await prisma.user.update({
        where: {
            id: session.user.id
        },
        data: {
            name: data.name,
            email: data.email,
            emailVerified: emailVerified
        }
    });

    // update the user
    return {
        shouldSignOut: !emailVerified
    };


}