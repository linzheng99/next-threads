'use client'

import dynamic from 'next/dynamic';
import type Quill from 'quill';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { useCreateMessage } from '@/features/message/api/use-create-message';
import { useChannelId } from '@/hooks/use-channel-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

interface ChannelInputProps {
  placeholder: string
}

const ChannelInput = ({ placeholder }: ChannelInputProps) => {
  const [editorKey, setEditorKey] = useState(0)
  const [isPending, setIsPending] = useState(false)

  const editorRef = useRef<Quill | null>(null)
  const channelId = useChannelId()
  const workspaceId = useWorkspaceId()

  const { mutate: createMessage } = useCreateMessage()

  async function handleSubmit({
    body,
    image
  }: {
    body: string
    image: File | null
  }) {
    console.log({ body, image })

    try {
      setIsPending(true)
      await createMessage({ channelId, workspaceId, body }, { throwError: true })

      setEditorKey(prev => prev + 1)
    } catch {
      toast.error('Failed to create message')
    } finally {
      setIsPending(false)
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

export default ChannelInput;
