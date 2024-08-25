import {Prisma} from "@prisma/client";

type AnnouncementItem = Prisma.AnnouncementGetPayload<{
    include: {
        created_by: true
    }
}>