"use client";

import {createContext, useContext, useState} from "react";
import {useDisclosure} from "@nextui-org/react";
import NewPostModal from "@/components/posts/newPostModal";
import SignInPromptModal from "@/components/auth/signInPromptModal";

interface ModalsProviderProps {
    children: React.ReactNode
}

interface ModalsContextProps {
    newPost: modalProps;
    signInPrompt: {
        onOpen: (message?: string) => void;
        onClose: () => void;
        isOpen: boolean;
    };
}

interface modalProps {
    onOpen: () => void;
    onClose: () => void;
    isOpen: boolean;
}

const ModalsContext = createContext<ModalsContextProps>({
    newPost: {
        onOpen: () => {},
        onClose: () => {},
        isOpen: false
    },
    signInPrompt: {
        onOpen: () => {},
        onClose: () => {},
        isOpen: false
    }
});

export const ModalsProvider = (props: ModalsProviderProps) => {

    const newPost = useDisclosure();

    const signInPrompt = useDisclosure();
    const [signInMessage, setSignInMessage] = useState<string|undefined>();

    return (
        <ModalsContext.Provider
            value={{
                newPost,
                signInPrompt: {
                    onOpen: (message?: string) => {
                        setSignInMessage(message);
                        signInPrompt.onOpen();
                    },
                    onClose: signInPrompt.onClose,
                    isOpen: signInPrompt.isOpen
                }
            }}
        >
            {props.children}
            <NewPostModal isOpen={newPost.isOpen} onClose={newPost.onClose} />
            <SignInPromptModal isOpen={signInPrompt.isOpen} onClose={signInPrompt.onClose} message={signInMessage} />
        </ModalsContext.Provider>
    )

}

export const useModals = () => {
    return useContext(ModalsContext);
}