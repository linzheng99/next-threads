'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import PageError from '@/components/page-error'
import PageLoader from '@/components/page-loader'
import { type Id } from '@/convex/_generated/dataModel'
import { useCreateOrGetConversation } from '@/features/conversation/api/use-create-or-get-conversation'
import { useMemberId } from '@/hooks/use-member-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import MemberConversationClient from './client'

const MemberPage = () => {
  const memberId = useMemberId()
  const workspaceId = useWorkspaceId()

  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null)
  const { mutate, isPending } = useCreateOrGetConversation()

  useEffect(() => {
    void mutate({
      memberId,
      workspaceId,
    }, {
      onSuccess: (conversationId) => {
        setConversationId(conversationId)
      },
      onError: () => {
        toast.error("Failed to create or get conversation")
      }
    })
  }, [mutate, memberId, workspaceId])

  if (isPending) {
    return <PageLoader />
  }

  if (!conversationId) {
    return <PageError message="conversation not found" />
  }

  return <MemberConversationClient id={conversationId} />
}

export default MemberPage;
