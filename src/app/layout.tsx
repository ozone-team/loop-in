import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import {GetConfig} from "@/lib/config";

const inter = Inter({subsets: ["latin"]});


export async function generateMetadata() {
    const config = await GetConfig('site_name')
    return {
        title: config.site_name,
        description: 'Customer feedback boards for your products and services',
        creator: 'Ozone Team <hello@ozoneteam.net>',
        keywords: 'feedback, customer feedback, product feedback, feedback boards, feedback tool',
        image: '/logo.svg',
    } as Metadata
};

interface RootLayoutProps {
    children: React.ReactNode
}

export default async function RootLayout({children}: Readonly<RootLayoutProps>) {

    const config = await GetConfig('site_logo')

    return (
        <html lang="en">
        <head>
            <link rel={'icon'} href={config.site_logo || '/logo.svg'} type={'image/x-icon'} sizes={'any'}/>
        </head>
        <body className={inter.className + ' mobile:overflow-x-hidden'}>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}
