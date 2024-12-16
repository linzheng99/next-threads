import { usePaginatedQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { type Id } from '@/convex/_generated/dataModel'

const BATCH_SIZE = 20

interface UseGetMessagesProps {
  channelId?: Id<"channels">
  parentMessageId?: Id<"messages">
  conversationId?: Id<"conversations">
}

export type GetMessagesResultType = typeof api.message.get._returnType['page']

export const useGetMessages = ({
  channelId,
  parentMessageId,
  conversationId,
}: UseGetMessagesProps) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.message.get,
    {
      channelId,
      parentMessageId,
      conversationId,
    },
    {
      initialNumItems: BATCH_SIZE,
    }
  )

  return {
    results,
    status,
    loadMore: () => loadMore(BATCH_SIZE),
  }
}
