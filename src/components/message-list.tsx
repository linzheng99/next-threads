import { differenceInMinutes, format, isToday, isYesterday } from "date-fns"

import { type GetMessagesResultType } from "@/features/message/api/use-get-messages"

import ChannelHero from "./channel-hero";
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
                isAuthor={false}
                reactions={message.reactions}
                body={message.body}
                image={message.image}
                updatedAt={message.updatedAt}
                createdAt={message._creationTime}
                idEditing={false}
                setIdEditing={() => { }}
                isCompact={isCompact}
                hideTreadButton={false}
                threadCount={message.threadCount}
                threadImage={message.threadImage}
                threadTimestamp={message.threadTimestamp}
              />
            )
          })}
        </div>
      ))}
      {
        variant === 'channel' && channelCreationTime && channelName && (
          <ChannelHero name={channelName} creationTime={channelCreationTime} />
        )
      }
    </div>
  );
}

export default MessageList;