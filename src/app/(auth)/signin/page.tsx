import SignInPageClient from "./page.client"
import {GetConfig} from "@/lib/config";
import Image from "next/image";
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";

const SignInPage = async (props:PageProps<{},{redirect?: string}>) => {

    const session = await auth();

    const {site_name, site_logo} = await GetConfig('site_name', 'site_logo');

    if(session?.user){
        redirect(props.searchParams.redirect || '/')
    }

    return (
        <div className={'container py-12 flex flex-col space-y-8 max-w-sm'}>
            <Image src={site_logo} alt={''} width={128} height={128} className={'max-h-8 object-contain object-left max-w-32'} />
            <h1>Sign In to {site_name}</h1>
            <SignInPageClient />
        </div>
    )

}

export default SignInPage