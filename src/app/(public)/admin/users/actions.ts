"use server"

import {prisma} from "@/lib/prisma";
import {Prisma} from "@prisma/client";

interface ListUsersOptions {
    page?: number;
    search?: string;
    sort?: string;
}

export async function ListUsers(props:ListUsersOptions){

    let where:Prisma.UserWhereInput = {};
    let orderBy:Prisma.UserOrderByWithRelationInput = {}

    if(props.search){
        where.name = {
            contains: props.search
        }
    }

    switch (props.sort) {
        case 'name':
            orderBy.name = 'asc';
            break;
        case 'name-desc':
            orderBy.name = 'desc';
            break;
        case 'email':
            orderBy.email = 'asc';
            break;
        case 'email-desc':
            orderBy.email = 'desc';
            break;
        case 'created_at':
            orderBy.createdAt = 'asc';
            break;
        case 'created_at-desc':
            orderBy.createdAt = 'desc';
            break
        case 'updated_at':
            orderBy.updatedAt = 'asc';
            break;
        case 'updated_at-desc':
            orderBy.updatedAt = 'desc';
            break;
        default:
            orderBy.name = 'asc';
            break;
    }

    const total = await prisma.user.count();

    const users = await prisma.user.findMany({
        take: 10,
        skip: props.page ? (props.page * 10) : 0,
        where: where,
        orderBy: orderBy,
        include: {
            _count: {
                select: {
                    created_posts: true,
                    created_comments: true
                }
            }
        }
    })

    return {
        data: users,
        page: props.page || 0,
        record_count: total,
        pages: Math.ceil(total / 10)
    };

}