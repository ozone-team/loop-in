"use server"

import {prisma} from "@/lib/prisma";
import {slugify} from "@/lib/slug";
import {auth} from "@/lib/auth";

export async function NewPost_GetBoards(){
    const boards = await prisma.board.findMany({
        orderBy: {
            index: 'asc'
        }
    });

    return boards;
}

interface CreatePostDto {
    title: string;
    content: string;
    board: string;
}

export async function CreatePost(data: CreatePostDto){
    // Create a new post

    const session = await auth();

    const slug = slugify(data.title.trim());

    const post = await prisma.post.create({
        data: {
            id: slug,
            title: data.title.trim(),
            description: data.content.trim(),
            board: data.board,
            created_by: session?.user?.id
        }
    });

    return post;
}