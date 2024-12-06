'use client'

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"

export default function WorkspacePage() {
  const workspaceId = useWorkspaceId()
  const { data, isLoading } = useGetWorkspace({ id: workspaceId })

  return <div>WorkspacePage: {workspaceId}</div>
}
