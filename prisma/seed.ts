/**
 * This is the Prisma script to seed the database
 * This is SEPARATE from the instrumentation.ts file.
 * Instrumentation runs on container start, this runs on docker image build
 */

import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export async function Seed(){

    const config = await GetConfig('initialised');

    if(config.initialised){
        return;
    }

    console.log("Seeding database...");

    if(process.env.ADMIN_EMAIL) {
        let uid = GenerateUserId(16);
        await prisma.user.upsert({
            create: {
                id: uid,
                email: process.env.ADMIN_EMAIL,
                name: (process.env.ADMIN_EMAIL.split('@'))[0],
                image: '',
                isAdmin: true,
            },
            update: {
                name: (process.env.ADMIN_EMAIL.split('@'))[0],
                isAdmin: true,
            },
            where: {
                email: process.env.ADMIN_EMAIL
            }
        });
    }

    await prisma.config.upsert({
        create: {
            key: 'site_name',
            value: process.env.SITE_NAME || 'Site Name'
        },
        update: {

        },
        where: {
            key: 'site_name',
        }
    });

    await prisma.config.upsert({
        create: {
            key: 'site_logo',
            value: process.env.SITE_LOGO || `${process.env.APP_URL}/logo.png`
        },
        update: {

        },
        where: {
            key: 'site_logo',
        }
    });

    const boards = [
        'Bugs',
        'Feature Requests',
    ];

    for(const board of boards) {
        await prisma.board.upsert({
            create: {
                id: slugify(board),
                title: board,
                description: '',
                index: boards.indexOf(board)
            },
            update: {
                title: board,
                index: boards.indexOf(board)
            },
            where: {
                id: slugify(board)
            }
        });
    }

    const statuses = [
        {
            title: 'Open',
            description: 'The issue is open and waiting for review.',
            color: '#ec8eff',
            is_default: true,
            show_in_roadmap: false
        },
        {
            title: 'Under Review',
            description: 'The issue is under review by the team.',
            color: '#ffae7b',
            is_default: false,
            show_in_roadmap: true
        },
        {
            title: 'Planned',
            description: 'The issue is planned to be worked on.',
            color: '#6d5bff',
            is_default: false,
            show_in_roadmap: true
        },
        {
            title: 'In Progress',
            description: 'The issue is currently being worked on.',
            color: '#7aebff',
            is_default: false,
            show_in_roadmap: true
        },
        {
            title: 'Completed',
            description: 'The issue has been completed.',
            color: '#40d384',
            is_default: false,
            show_in_roadmap: true
        },
        {
            title: 'Closed',
            description: 'The issue has been closed.',
            color: '#9c2e2e',
            is_default: false,
            show_in_roadmap: false
        }
    ];

    for(const status of statuses) {
        let id = slugify(status.title);
        await prisma.status.upsert({
            create: {
                id: id,
                title: status.title,
                color: status.color,
                is_default: status.is_default,
                show_in_roadmap: status.show_in_roadmap,
                description: status.description
            },
            update: {
                title: status.title,
                color: status.color,
                is_default: status.is_default,
                show_in_roadmap: status.show_in_roadmap,
                description: status.description
            },
            where: {
                id: id
            }
        });
    }

    await UpdateConfig({
        initialised: 'true',
        moderation: 'approve-all',
    });

    console.log("Database Seeded Successfully");

}

function GenerateUserId(length: number = 16){
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(let i = 0; i < length; i++){
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

/**
 * These need to be in the same file, as we can't import in an NPX context
 * @param fields
 * @constructor
 */
async function GetConfig(...fields: string[]) {

    // get the values of the fields from the database Config key-value pair table

    let obj: Record<string, any> = {};

    let records = await prisma.config.findMany(fields.length ? {
        where: {
            key: {
                in: fields
            }
        }
    } : undefined);

    records.forEach((record) => {
        obj[record.key] = record.value;
    });

    return obj;

}

async function UpdateConfig(data: Record<string, string>) {

    const updatePromises = Object.keys(data).map(key => {
        return prisma.config.upsert({
            where: { key },
            update: { value: data[key] },
            create: { key, value: data[key] },
        });
    });

    await Promise.all(updatePromises);
}

function slugify(str: string) {
    return str
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^a-z0-9-]/g, '');
}

Seed().catch((e) => {
    console.error(e);
    process.exit(1);
});