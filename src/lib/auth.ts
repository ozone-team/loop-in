import type {GetServerSidePropsContext, NextApiRequest, NextApiResponse,} from "next"
import type {NextAuthOptions} from "next-auth"
import {getServerSession} from "next-auth"
import {prisma} from "@/lib/prisma";
import {PrismaAdapter} from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import {thumbs} from "@dicebear/collection";
import {createAvatar} from "@dicebear/core";
import files from "@/lib/files";
import path from "node:path";

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const config = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: +(process.env.EMAIL_SERVER_PORT || 587),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
        })
    ],
    callbacks: {
        async session({session, token, user}) {

            console.log("Session Callback")

            let dbUser = await prisma.user.findFirst({
                where: {
                    email: user.email!
                }
            });

            if(dbUser){

                let updateData:Record<any,any> = {};

                if(!dbUser.name){
                    updateData['name'] = user.email.split('@')[0];
                }

                if(!dbUser.image){

                    const avatar = createAvatar(thumbs, {
                        seed: user.email.split('@')[0]
                    }).toString();

                    updateData['image'] = files.save(avatar, path.join('avatars', `${user.id}.svg`));
                }

                dbUser = await prisma.user.update({
                    where: {
                        id: dbUser.id
                    },
                    data: updateData
                });
            }


            session.user = {
                id: user.id,
                name: user.name,
                image: user.image,
                email: user.email,
                is_admin: dbUser?.isAdmin || false
            };
            return session;
        },
        async signIn({user, account, profile}) {

            let u = await prisma.user.findFirst({
                where: {
                    email: user.email!
                }
            });

            // check if the user is banned
            if(u && u.isBanned) {
                console.debug('User is banned', u);
                return false
            }

            return true
        }
    }
} satisfies NextAuthOptions

// Use it in server contexts
export function auth(
    ...args:
        | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
        | [NextApiRequest, NextApiResponse]
        | []
) {
    return getServerSession(...args, config)
}