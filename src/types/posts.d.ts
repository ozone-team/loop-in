import {Prisma} from "@prisma/client";

type PostDetails = Prisma.PostGetPayload<{
    include: {
        status: true,
        comments: {
            include: {
                created_by: true
            }
        },
        created_by: true,
        media: true,
        category: true,
        votes: {
            select: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        },
        activity: {
            include: {
                created_by: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        },
        watching: {
            select: {
                user_id: true
            }
        },
        tags: {
            select: {
                tag: true
            }
        }
    }
}>

type RoadmapStatus = StatusGetPayload<{
    where: {
        show_in_roadmap: true,
    },
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
            },
            where: {
                board: {
                    show_in_roadmap: true
                }
            }
        }
    },
    orderBy: {
        index: 'asc'
    }
}>

type PostListItem = Prisma.PostGetPayload<{
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
}>
