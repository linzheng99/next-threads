"use client"

import { useMemo } from "react"

import MessageList from "@/components/message-list"
import PageError from "@/components/page-error"
import PageLoader from "@/components/page-loader"
import { useGetChannel } from "@/features/channels/api/use-get-channel"
import ChannelInput from "@/features/channels/components/channel-input"
import ChannelHeader from "@/features/channels/components/header"
import { useCurrentMember } from "@/features/members/api/use-current-member"
import { useGetMessages } from "@/features/message/api/use-get-messages"
import { useChannelId } from "@/hooks/use-channel-id"
import { useWorkspaceId } from "@/hooks/use-workspace-id"

const ChannelIdPage = () => {
  const channelId = useChannelId()
  const workspaceId = useWorkspaceId()

  const { data: channel, isLoading: isChannelLoading } = useGetChannel({ id: channelId })
  const { data: member, isLoading: isMemberLoading } = useCurrentMember({ workspaceId })
  const isAdmin = useMemo(() => member?.role === 'admin', [member?.role])
  const { results, status, loadMore } = useGetMessages({ channelId })

  if (isChannelLoading || isMemberLoading || status === 'LoadingFirstPage') {
    return <PageLoader />
  }

  if (!channel || !member) {
    return <PageError message="Channel not found" />
  }


  return (
    <div className="h-full flex flex-col">
      <ChannelHeader name={channel.name} id={channel._id} workspaceId={workspaceId} isAdmin={isAdmin} />
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === 'LoadingMore'}
        canLoadMore={status === 'CanLoadMore'}
      />
      {/* <div className="flex-1">
        {JSON.stringify(results)}
      </div> */}
      <ChannelInput placeholder={`Message # ${channel.name}`} />
    </div>
  )
}

export default ChannelIdPage
