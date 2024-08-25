"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {useEffect} from "react";

interface TiptapProps {
    content: string
    onChange: (content: {html: string, plain: string}) => void
}

const Tiptap = (props:TiptapProps) => {

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Type something...',
            }),
        ],
        content: props.content || '',
        onUpdate({ editor }) {
            let html = editor.getHTML()
            let plain = editor.getText()
            props.onChange({html, plain})
        },
        onCreate({ editor }) {
            editor.commands.setContent(props.content)
        },
        shouldRerenderOnTransaction: false
    });

    useEffect(() => {
        if(editor && editor.isEditable){
            editor.commands.setContent(props.content)
        }
    }, [editor, props.content]);


    return <EditorContent className={'prose'} editor={editor} />
}

export default Tiptap
