'use client'

import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"

import PageError from "@/components/page-error"
import PageLoader from "@/components/page-loader"
import { useGetChannels } from "@/features/channels/api/use-get-channels"
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal"
import { useCurrentMember } from "@/features/members/api/use-current-member"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"

export default function WorkspacePage() {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const [channelOpen, setCreateChannelOpen] = useCreateChannelModal()

  const { data: member, isLoading: isMemberLoading } = useCurrentMember({
    workspaceId,
  })
  const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace({
    id: workspaceId,
  })
  const { data: channels, isLoading: isChannelsLoading } = useGetChannels({
    workspaceId,
  })
  const isAdmin = useMemo(() => member?.role === 'admin', [member?.role])
  const channelId = useMemo(() => channels?.[0]?._id as string || '', [channels])

  useEffect(() => {
    if (!workspace || !channels || isChannelsLoading || isWorkspaceLoading || isMemberLoading || !member) return

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`)
    } else if (!channelOpen && isAdmin) {
      setCreateChannelOpen(true)
    }

  }, [workspace, channels, channelId, isAdmin, channelOpen, setCreateChannelOpen, router, isChannelsLoading, isWorkspaceLoading, isMemberLoading, member, workspaceId])

  if (isMemberLoading || isWorkspaceLoading || isChannelsLoading) {
    return <PageLoader />
  }

  if (!workspace || !member) {
    return <PageError message="not found workspace" />
  }

  return <PageError message="not found channels" />
}
