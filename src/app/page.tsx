'use client'

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import PageLoader from "@/components/page-loader";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";

export default function Home() {
  const router = useRouter()
  const { data, isLoading } = useGetWorkspaces()
  const [open, setOpen] = useCreateWorkspaceModal()
  // 缓存依赖 类似 Vue 里面的计算属性, 当依赖的值发生变化时, 缓存值会重新计算, 避免不必要的重复渲染, 也避免了下面的 useEffect 的重复执行
  const workspaceId = useMemo(() => data?.[0]?._id as string ?? '', [data])

  useEffect(() => {
    if (isLoading) return

    if (workspaceId) {
      // 使用 replace 而不是 push 可以避免在浏览器历史记录中添加新的条目
      router.replace(`/workspace/${workspaceId}`)
    } else if (!open) {
      setOpen(true)
    }
  }, [workspaceId, isLoading, open, setOpen])

  if (isLoading) return <PageLoader />
}
