import {Prisma} from "@prisma/client";

type StatusWithPosts = Prisma.StatusGetPayload<{
    include: {
        posts: {
            include: {
                category: true,
                board: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                status: {
                    select: {
                        id: true,
                        title: true,
                        color: true,
                    }
                },
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