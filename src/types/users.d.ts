import {Prisma} from '@prisma/client';

type UserListItem = Prisma.UserGetPayload<{
    include: {
        _count: {
            select: {
                created_posts: true,
                created_comments: true
            }
        }
    }
}>