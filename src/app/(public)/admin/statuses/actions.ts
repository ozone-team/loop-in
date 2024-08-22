"use server"

import {prisma} from "@/lib/prisma";

export async function GetStatuses(){
    return prisma.status.findMany({
        orderBy: {
            index: 'asc'
        }
    });
}

export async function UpdateStatusOrder(statuses: {id: string, index: number}[]){
    for (const status of statuses){
        await prisma.status.update({
            where: {
                id: status.id
            },
            data: {
                index: status.index
            }
        })
    }
    return GetStatuses();
}