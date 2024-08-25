"use server"

import { prisma } from '@/lib/prisma';
import {z} from 'zod';

interface UpdateUserOptions {
    name: string;
    email: string;
}

export async function UpdateUser(id: string, data: UpdateUserOptions){

    // use zod to check if the email is valid
    const {success} = z.string().email().safeParse(data.email);

    if(!success){
        throw new Error('Invalid email address');
    }

    // update the user
    return prisma.user.update({
        where: {
            id
        },
        data: {
            name: data.name,
            email: data.email
        }
    })

}