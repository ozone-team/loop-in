import type {GetServerSidePropsContext, NextApiRequest, NextApiResponse,} from "next"
import type {NextAuthOptions} from "next-auth"
import {getServerSession} from "next-auth"
import {prisma} from "@/lib/prisma";
import {PrismaAdapter} from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import {SendMagicEmail} from "@/app/(actions)/send-magic-email";
import { GenerateUserAvatar } from "./avatars";

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const config = {
    adapter: PrismaAdapter(prisma) as any,
    secret: process.env.AUTH_SECRET || 'my_secret',
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
            sendVerificationRequest: async (params) => {

                let u = await prisma.user.findFirst({
                    where: {
                        email: params.identifier
                    }
                });

                if(u && u.isBanned){
                    throw new Error('USER_BANNED');
                }

                await SendMagicEmail({
                    email: params.identifier,
                    link: params.url
                });
            }
        })
    ],
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        async session({session, token, user}) {

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
                    updateData['image'] = GenerateUserAvatar(user.id);
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
                name: user.name || user.email.split('@')[0],
                image: user.image || GenerateUserAvatar(user.id),
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
                return `${process.env.APP_URL}/signin?error=USER_BANNED`;
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