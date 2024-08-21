"use client";

import {createContext, useContext} from "react";
import {useDisclosure} from "@nextui-org/react";
import NewPostModal from "@/components/posts/newPostModal";

interface ModalsProviderProps {
    children: React.ReactNode
}

interface ModalsContextProps {
    newPost: modalProps
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
    }
});

export const ModalsProvider = (props: ModalsProviderProps) => {

    const newPost = useDisclosure();

    return (
        <ModalsContext.Provider
            value={{
                newPost
            }}
        >
            {props.children}
            <NewPostModal isOpen={newPost.isOpen} onClose={newPost.onClose} />
        </ModalsContext.Provider>
    )

}

export const useModals = () => {
    return useContext(ModalsContext);
}