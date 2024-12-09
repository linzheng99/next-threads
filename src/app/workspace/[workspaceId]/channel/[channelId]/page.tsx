"use client"

import { useChannelId } from "@/features/channels/hooks/use-channel-id"

const ChannelIdPage = () => {
  const channelId = useChannelId()

  return <div>ChannelIdPage: {channelId}</div>
}

export default ChannelIdPage
