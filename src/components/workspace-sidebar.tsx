import { HashIcon, MessageSquareText, SendHorizonal } from "lucide-react";

import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import WorkspaceSection from "@/features/workspaces/components/workspace-section";
import { useChannelId } from "@/hooks/use-channel-id";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import PageError from "./page-error";
import PageLoader from "./page-loader";
import SidebarItem from "./sidebar-item";
import UserItem from "./user-item";
import WorkspaceHeader from "./workspace-header";

const WorkspaceSidebar = () => {
  const memberId = useMemberId()
  const workspaceId = useWorkspaceId()
  const channelId = useChannelId()
  const [, setCreateChannelOpen] = useCreateChannelModal()

  const { data: member, isLoading: isMemberLoading } = useCurrentMember({
    workspaceId,
  })
  const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace({
    id: workspaceId,
  })
  const { data: channels, isLoading: isChannelsLoading } = useGetChannels({
    workspaceId,
  })
  const { data: members, isLoading: isMembersLoading } = useGetMembers({
    workspaceId,
  })

  if (isMemberLoading || isWorkspaceLoading || isChannelsLoading || isMembersLoading) {
    return <PageLoader className="bg-[#5e2c5f]" />
  }

  if (!member || !workspace) {
    return <PageError className="bg-[#5e2c5f]" message="not found workspace" />
  }

  return (
    <div className="w-full h-full">
      <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"} />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem id="threads" label="Threads" icon={MessageSquareText} />
        <SidebarItem id="drafts" label="Drafts & Sent" icon={SendHorizonal} />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New channel"
        onNew={member.role === 'admin' ? () => setCreateChannelOpen(true) : undefined}
      >
        {channels?.map((channel) => (
          <SidebarItem
            key={channel._id}
            id={channel._id}
            label={channel.name}
            icon={HashIcon}
            variant={channelId === channel._id ? 'active' : 'default'}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection label="Direct Messages" hint="New Direct Message" onNew={() => {}}>
        {members?.map((member) => (
          <UserItem
            key={member._id}
            id={member._id}
            label={member.user.name}
            image={member.user.image}
            variant={memberId === member._id ? 'active' : 'default'}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
}

export default WorkspaceSidebar;
