"use client"

import {useMemo, useState} from "react";
import {Button, Input} from "@nextui-org/react";
import {useMutation} from "@tanstack/react-query";
import {UpdateProfile} from "@/app/(public)/profile/actions";
import {signOut} from "next-auth/react";
import {useRouter} from "next/navigation";

interface ProfilePageClientProps {
    name: string;
    email: string;
}

const ProfilePageClient = (props:ProfilePageClientProps) => {

    const router = useRouter();

    const [name, setName] = useState<string>(props.name || '');
    const [email, setEmail] = useState<string>(props.email || '');

    const emailChanged = useMemo(() => {
        return email !== props.email
    }, [email, props.email])

    const {mutate, isPending, isSuccess, error} = useMutation({
        mutationFn: async () => {
            // Update the user's profile
            return await UpdateProfile({
                email,
                name
            });
        },
        onSuccess: (result) => {
            if(result.shouldSignOut){
                // Sign the user out
                signOut({
                    redirect: false,
                }).then(() => {
                    router.push('/api/auth/signin');
                });

            }
        }
    })

    return (
        <div
            className={'flex flex-col items-stretch max-w-lg container space-y-2 py-12'}
        >
            <p className={'font-medium'}>Your Profile</p>
            <p className={'text-xs !mb-4'}>Update your profile information</p>
            <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                label={'Name'}
            />
            <Input
                value={email}
                onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
                label={'Email'}
            />
            {
                emailChanged ?
                    <div className={'rounded-lg border border-amber-600 bg-amber-100 p-3 text-sm text-amber-800'}>
                        <p>Changing your email address will sign you out, and you will have to sign in with your new address</p>
                    </div>
                    :
                    <></>
            }
            <Button
                onClick={() => {
                    // Save the user's profile information
                    mutate()
                }}
                size={'sm'}
                color={'primary'}
                className={'self-end'}
                isLoading={isPending}
            >
                Save
            </Button>
            {
                isSuccess ?
                    <div className={'w-full p-2 bg-success-50 rounded-lg text-sm text-center text-success-900'}>
                        <p>Your profile has been updated</p>
                    </div>
                    :
                    <></>
            }
            {
                error ?
                    <div>
                        <p>There was an error updating your profile</p>
                        <pre>{error.message}</pre>
                    </div>
                    :
                    <></>
            }
        </div>
    )

}

export default ProfilePageClient