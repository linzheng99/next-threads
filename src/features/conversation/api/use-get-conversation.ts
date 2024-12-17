import { useQuery } from "convex/react"

import { api } from "@/convex/_generated/api"
import { type Id } from "@/convex/_generated/dataModel"

interface UseGetConversationProps {
  id: Id<"conversations">
}

export const useGetConversation = ({ id }: UseGetConversationProps) => {
  const data = useQuery(api.conversations.get, { conversationId: id })
  const isLoading = data === undefined

  return { data, isLoading }
}
