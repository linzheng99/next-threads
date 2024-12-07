import { MessageSquareText, SendHorizonal } from "lucide-react";

import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import PageError from "./page-error";
import PageLoader from "./page-loader";
import SidebarItem from "./sidebar-item";
import WorkspaceHeader from "./workspace-header";

const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId()

  const { data: member, isLoading: isMemberLoading } = useCurrentMember({
    workspaceId,
  })
  const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace({
    id: workspaceId,
  })

  if (isMemberLoading || isWorkspaceLoading) {
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
    </div>
  );
}

export default WorkspaceSidebar;
