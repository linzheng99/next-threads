"use client"

import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useWorkspaceId } from "../../../hooks/use-workspace-id";
import { useGetWorkspace } from "../api/use-get-workspace";
import { useGetWorkspaces } from "../api/use-get-workspaces";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";


const WorkspaceSwitcher = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const [, setOpen] = useCreateWorkspaceModal()

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId })
  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();

  const isLoading = workspaceLoading || workspacesLoading

  const filteredWorkspaces = workspaces?.filter((w) => w._id !== workspaceId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <Button className="size-9 bg-[#ababad] hover:bg-[#ababad]/80 text-slate-800 font-semibold text-xl">
          {
            isLoading ? <Loader2 className="animate-spin size-5 shrink-0" /> : workspace?.name.charAt(0).toUpperCase()
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        {/* Active Workspace */}
        <DropdownMenuItem>
          <div className="flex flex-col capitalize cursor-pointer" onClick={() => router.push(`/workspace/${workspaceId}`)}>
            {workspace?.name}
            <span className="text-xs text-muted-foreground">
              Active Workspace
            </span>
          </div>
        </DropdownMenuItem>
        {/* Other Workspaces */}
        {filteredWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace._id}
            onClick={() => router.push(`/workspace/${workspace._id}`)}
            className="cursor-pointer capitalize overflow-hidden"
          >
            <div className="size-9 rounded-md text-lg bg-[#616061] text-white relative overflow-hidden flex items-center justify-center">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <p className="truncate">
              {workspace.name}
            </p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        {/* Create Workspace */}
        <DropdownMenuItem onClick={() => setOpen(true)}>
          <div className="size-9 rounded-md text-lg bg-[#f2f2f2] text-slate-800 relative overflow-hidden flex items-center justify-center">
            <Plus className="size-4" />
          </div>
          Create Workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default WorkspaceSwitcher;
