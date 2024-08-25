"use client"

import {QueryClientProvider} from "@tanstack/react-query";
import reactQueryClient from "@/lib/queryClient";
import {SessionProvider} from "next-auth/react";
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {Toaster} from "react-hot-toast";

interface ProvidersProps {
    children: React.ReactNode;
}

const Providers = (props: ProvidersProps) => {

    return (
        <SessionProvider>
            <QueryClientProvider client={reactQueryClient}>
                <NextUIProvider>
                    <NextThemesProvider attribute={"class"} defaultTheme={"system"} enableSystem={true}>
                        {props.children}
                        <Toaster/>
                    </NextThemesProvider>
                </NextUIProvider>
                <ReactQueryDevtools initialIsOpen={false}/>
            </QueryClientProvider>
        </SessionProvider>
    )

}

export default Providers;