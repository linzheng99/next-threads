import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { Loader, X } from "lucide-react";
import dynamic from 'next/dynamic'
import type Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";

import Message from "@/components/message";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { type Id } from "@/convex/_generated/dataModel";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useCreateMessage } from "../api/use-create-message";
import { useGetMessage } from "../api/use-get-message";
import { useGetMessages } from "../api/use-get-messages";

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })
const TIME_THRESHOLD = 5;

interface ThreadProps {
  messageId: Id<'messages'>
  onClose: () => Promise<void>
}

type CreateMessageValues = {
  channelId: Id<'channels'>
  workspaceId: Id<'workspaces'>
  parentMessageId: Id<'messages'>
  body: string
  image: Id<"_storage"> | undefined
}

const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkspaceId()
  const channelId = useChannelId()
  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null)
  const [editorKey, setEditorKey] = useState(0)
  const [isPending, setIsPending] = useState(false)

  const editorRef = useRef<Quill | null>(null)
  const { mutate: createMessage } = useCreateMessage()
  const { mutate: generateUploadUrl } = useGenerateUploadUrl()

  const { data: message, isLoading: isMessageLoading } = useGetMessage({ id: messageId })
  const { data: currentMember, isLoading: isCurrentMemberLoading } = useCurrentMember({ workspaceId })
  const { results, status, loadMore } = useGetMessages({ channelId, parentMessageId: messageId })

  if (isMessageLoading || isCurrentMemberLoading || status === 'LoadingFirstPage') return <PageLoader />
  if (!message) return <PageError message="Message not found" />

  const groupedMessages = results?.reduce((group, message) => {
    const date = new Date(message._creationTime)
    const dateKey = format(date, 'yyyy-MM-dd')
    if (!group[dateKey]) {
      group[dateKey] = []
    }
    group[dateKey].unshift(message)
    return group
  }, {} as Record<string, typeof results>)

  function formatDateLabel(dateStr: string) {
    const date = new Date(dateStr)
    if (isToday(date)) return 'Today'
    if (isYesterday(date)) return 'Yesterday'
    return format(date, 'EEEE, MMMM d, yyyy')
  }

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
        channelId,
        workspaceId,
        parentMessageId: messageId,
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
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b h-[49px]">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <X className="size-4 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto message-scrollbar">
        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-white px-4 py-1 rounded-full z-10 border text-xs">{formatDateLabel(dateKey)}</span>
            </div>
            {messages.map((message, index) => {
              // 是否开启紧凑模式
              // 1. 前一条消息存在
              // 2. 前一条消息和当前消息是同一个人
              // 3. 前一条消息和当前消息的时间差小于 TIME_THRESHOLD 分钟
              const prevMessage = messages[index - 1]
              const isCompact =
                prevMessage &&
                prevMessage.user?._id === message.user?._id &&
                differenceInMinutes(new Date(message._creationTime), new Date(prevMessage._creationTime)) < TIME_THRESHOLD

              return (
                <Message
                  key={message._id}
                  id={message._id}
                  memberId={message.memberId}
                  authorName={message.user.name}
                  authorImage={message.user.image}
                  isAuthor={currentMember?._id === message.memberId}
                  reactions={message.reactions}
                  body={message.body}
                  image={message.image}
                  updatedAt={message.updatedAt}
                  createdAt={message._creationTime}
                  isEditing={editingId === message._id}
                  setIdEditing={setEditingId}
                  isCompact={isCompact}
                  hideTreadButton={true}
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                  threadTimestamp={message.threadTimestamp}
                  threadName={message.threadName}
                />
              )
            })}
          </div>
        ))}
        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && status === 'CanLoadMore') {
                    loadMore()
                  }
                },
                { threshold: 1.0 }
              )
              observer.observe(el)

              return () => observer.disconnect()
            }
          }}
        >
        </div>
        {
          status === 'LoadingMore' && (
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-white px-4 py-1 rounded-full z-10 border text-xs">
                <Loader className="size-4 animate-spin" />
              </span>
            </div>
          )
        }
        <Message
          id={message._id}
          memberId={message.memberId}
          authorName={message.user.name}
          authorImage={message.user.image}
          isAuthor={currentMember?._id === message.memberId}
          reactions={message.reactions}
          body={message.body}
          image={message.image}
          updatedAt={message.updatedAt}
          createdAt={message._creationTime}
          isEditing={editingId === message._id}
          setIdEditing={setEditingId}
          hideTreadButton={true}
        />
      </div>
      <div className="px-4">
        <Editor
          key={editorKey}
          onSubmit={handleSubmit}
          disabled={isPending}
          innerRef={editorRef}
          placeholder="Reply to this message"
        />
      </div>
    </div>
  );
}

export default Thread;
