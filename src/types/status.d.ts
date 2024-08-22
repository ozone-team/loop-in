import {Prisma} from "@prisma/client";

type StatusWithPosts = Prisma.StatusGetPayload<{
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
            }
        }
    }
}>