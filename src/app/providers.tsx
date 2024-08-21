"use client"

import {QueryClientProvider} from "@tanstack/react-query";
import reactQueryClient from "@/lib/queryClient";
import {SessionProvider} from "next-auth/react";
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";

interface ProvidersProps {
    children: React.ReactNode;
}

const Providers = (props:ProvidersProps) => {

    return (
        <SessionProvider>
            <QueryClientProvider client={reactQueryClient}>
                <NextUIProvider>
                    <NextThemesProvider attribute="class" defaultTheme="dark">
                {props.children}
                    </NextThemesProvider>
                </NextUIProvider>
            </QueryClientProvider>
        </SessionProvider>
    )

}

export default Providers;