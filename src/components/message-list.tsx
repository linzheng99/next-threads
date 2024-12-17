import { differenceInMinutes, format, isToday, isYesterday } from "date-fns"
import { Loader } from "lucide-react";
import { useState } from "react";

import { type Id } from "@/convex/_generated/dataModel";
import ChannelHero from "@/features/channels/components/channel-hero";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import MemberHero from "@/features/members/components/member-hero";
import { type GetMessagesResultType } from "@/features/messages/api/use-get-messages"
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import Message from "./message"

const TIME_THRESHOLD = 5;

interface MessageListProps {
  memberName?: string
  memberImage?: string
  channelName?: string
  channelCreationTime?: number
  variant?: 'channel' | 'thread' | 'conversation'
  data?: GetMessagesResultType | undefined
  loadMore: () => void
  isLoadingMore?: boolean
  canLoadMore?: boolean
}

function formatDateLabel(dateStr: string) {
  const date = new Date(dateStr)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'EEEE, MMMM d, yyyy')
}

const MessageList = ({
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  variant,
  data,
  loadMore,
  isLoadingMore,
  canLoadMore,
}: MessageListProps) => {
  const workspaceId = useWorkspaceId()
  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null)
  const { data: currentMember } = useCurrentMember({ workspaceId })

  const groupedMessages = data?.reduce((group, message) => {
    const date = new Date(message._creationTime)
    const dateKey = format(date, 'yyyy-MM-dd')
    if (!group[dateKey]) {
      group[dateKey] = []
    }
    group[dateKey].unshift(message)
    return group
  }, {} as Record<string, typeof data>)

  return (
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
                hideTreadButton={variant === 'thread'}
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
            // Intersection Observer 是一个现代的 JavaScript API，用于检测元素是否进入视口，或者与另一个元素相交
            const observer = new IntersectionObserver(
              ([entry]) => {
                // 当 div 进入视口时，Intersection Observer 的回调函数会被触发
                if (entry.isIntersecting && canLoadMore) {
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
        isLoadingMore && (
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full z-10 border text-xs">
              <Loader className="size-4 animate-spin" />
            </span>
          </div>
        )
      }
      {
        variant === 'channel' && channelCreationTime && channelName && (
          <ChannelHero name={channelName} creationTime={channelCreationTime} />
        )
      }
      {
        variant === 'conversation' && (
          <MemberHero name={memberName} image={memberImage} />
        )
      }
    </div>
  );
}

export default MessageList;
