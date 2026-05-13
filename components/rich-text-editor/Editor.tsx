"use client";

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Menubar } from './Menubar';
import TextAlign from '@tiptap/extension-text-align';

export function RichTextEditor({ field }: { field?: any }) {
    const editor = useEditor({
        extensions: [StarterKit, TextAlign.configure({ types: ['heading', 'paragraph'] })],
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "min-h-[300px] focus:outline-none prose prose-sm sm:prose-base lg:prose-lg m-0 p-4 dark:prose-invert !w-full !max-w-none",
            },
        },
        onUpdate: ({ editor }) => {
            field?.onChange(JSON.stringify(editor.getJSON()));
        },
        content: field?.value ? JSON.parse(field.value) : "Some Description",
    });
    return (
        <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
            <Menubar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}