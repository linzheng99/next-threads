'use client'

import dynamic from 'next/dynamic';
import type Quill from 'quill';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { type Id } from '@/convex/_generated/dataModel';
import { useCreateMessage } from '@/features/messages/api/use-create-message';
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

interface MemberInputProps {
  placeholder: string
  conversationId: Id<"conversations">
}

type CreateMessageValues = {
  conversationId: Id<"conversations">
  workspaceId: Id<"workspaces">
  body: string
  image: Id<"_storage"> | undefined
}

const MemberInput = ({ placeholder, conversationId }: MemberInputProps) => {
  const [editorKey, setEditorKey] = useState(0)
  const [isPending, setIsPending] = useState(false)

  const editorRef = useRef<Quill | null>(null)
  const workspaceId = useWorkspaceId()

  const { mutate: createMessage } = useCreateMessage()
  const { mutate: generateUploadUrl } = useGenerateUploadUrl()

  async function handleSubmit({
    body,
    image
  }: {
    body: string
    image: File | null
  }) {


    try {
      setIsPending(true)
      editorRef.current?.enable(false)

      const values: CreateMessageValues = {
        conversationId,
        workspaceId,
        body,
        image: undefined
      }

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true })
        if (!url) {
          throw new Error('Failed to generate upload url')
        }

        const result = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': image.type
          },
          body: image
        })

        if (!result.ok) {
          throw new Error('Failed to upload image')
        }

        const { storageId } = await result.json()
        values.image = storageId
      }

      await createMessage(values, { throwError: true })
      setEditorKey(prev => prev + 1)
    } catch {
      toast.error('Failed to create message')
    } finally {
      setIsPending(false)
      editorRef.current?.enable(true)
    }
  }

  return (
    <div className="w-full px-5">
      <Editor
        key={editorKey}
        variant='create'
        onSubmit={handleSubmit}
        innerRef={editorRef}
        disabled={isPending}
        placeholder={placeholder}
      />
    </div>
  );
}

export default MemberInput;
