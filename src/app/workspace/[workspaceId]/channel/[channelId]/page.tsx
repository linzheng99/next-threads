"use client"

import PageError from "@/components/page-error"
import PageLoader from "@/components/page-loader"
import { useGetChannel } from "@/features/channels/api/use-get-channel"
import ChannelHeader from "@/features/channels/components/header"
import { useChannelId } from "@/features/channels/hooks/use-channel-id"
import { useCurrentMember } from "@/features/members/api/use-current-member"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useMemo } from "react"

const ChannelIdPage = () => {
  const channelId = useChannelId()
  const workspaceId = useWorkspaceId()

  const { data: channel, isLoading: isChannelLoading } = useGetChannel({ id: channelId })
  const { data: member, isLoading: isMemberLoading } = useCurrentMember({ workspaceId })
  const isAdmin = useMemo(() => member?.role === 'admin', [member?.role])

  if (isChannelLoading || isMemberLoading) {
    return <PageLoader />
  }

  if (!channel || !member) {
    return <PageError message="Channel not found" />
  }

  return (
    <div>
      <ChannelHeader name={channel.name} id={channel._id} workspaceId={workspaceId} isAdmin={isAdmin} />
    </div>
  )
}

export default ChannelIdPage
