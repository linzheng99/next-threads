import { useParams } from "next/navigation"

import { type Id } from "@/convex/_generated/dataModel"

export function useWorkspaceId() {
  const params = useParams()
  return params.workspaceId as Id<"workspaces">
}
