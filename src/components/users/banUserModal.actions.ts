"use server"

import {prisma} from "@/lib/prisma"

export async function BanUser(id: string) {
    return prisma.user.update({
        where: {
            id
        },
        data: {
            isBanned: true
        }
    })
}