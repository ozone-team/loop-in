"use client";

import {Button, Input} from "@nextui-org/react";
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {signIn} from "next-auth/react";
import Link from "next/link";
import ErrorNotice from "@/components/notices/errorNotice";

interface SignInPageClientProps {

}

const SignInPageClient = (props:SignInPageClientProps) => {

    const [email, setEmail] = useState('');

    const {mutate, isPending, isSuccess, error} = useMutation({
        mutationKey: ['signin'],
        mutationFn: async () => {
            console.log('signing in...')
            await signIn('email', {email, redirect: false})
            return true;
        }
    })

    if(isSuccess) {
        return (
            <div className={'flex flex-col space-y-4'}>
                <div className={'flex flex-col space-y-2 items-center bg-success-50 rounded-xl p-4'}>
                    <p>Check your email for a magic link to sign in.</p>
                </div>
                <Button
                    size={'sm'}
                    variant={'light'}
                    href={'/'}
                    as={Link}
                    className={'self-center'}
                >
                    Back to site
                </Button>
            </div>
        )
    }

    return (
        <div className={'flex flex-col space-y-4'}>
            <div className={'flex flex-col space-y-2'}>
                <Input
                    placeholder={'name@email.com'}
                    type={'email'}
                    autoComplete={'email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                    className={'w-full capitalize'}
                    color={'primary'}
                    onClick={() => mutate()}
                    isLoading={isPending}
                >
                    Continue
                </Button>
            </div>
            {
                error && (
                    <ErrorNotice message={error.message} />
                )
            }
            <div className={'bg-foreground-100 text-sm text-foreground-600 rounded-xl p-6 flex flex-col space-y-2'}>
                <p>We’ll email you a magic link for a password-free sign in.</p>
            </div>
            <Button
                size={'sm'}
                variant={'light'}
                href={'/'}
                as={Link}
                className={'self-center'}
            >
                Back to site
            </Button>
        </div>
    )

}

export default SignInPageClient;