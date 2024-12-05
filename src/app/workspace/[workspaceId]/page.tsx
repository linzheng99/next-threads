'use client'

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"

export default function WorkspacePage() {
  const workspaceId = useWorkspaceId()

  return <div>WorkspacePage: {workspaceId}</div>
}
