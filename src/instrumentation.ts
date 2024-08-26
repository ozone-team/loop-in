import {GetConfig, UpdateConfig} from "./lib/config";
import {prisma} from "@/lib/prisma";
import {slugify} from "@/lib/slug";


export async function register() {
    await Seed().catch((e) => {
        console.error("Failed to seed database:\n",e);
        process.exit(1);
    });
}

async function Seed(){

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

    await UpdateConfig({
        site_name: process.env.SITE_NAME || 'Loop In',
        site_logo: process.env.SITE_LOGO || `${process.env.APP_URL}/logo.svg`
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
