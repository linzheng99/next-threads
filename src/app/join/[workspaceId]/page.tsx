"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import VerificationInput from 'react-verification-input'
import { toast } from "sonner"

import PageError from "@/components/page-error"
import PageLoader from "@/components/page-loader"
import { Button } from "@/components/ui/button"
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-info-workspace"
import { useJoinWorkspace } from "@/features/workspaces/api/use-join-workspace"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { cn } from "@/lib/utils"

const JoinPage = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const { data, isLoading } = useGetWorkspaceInfo(workspaceId)
  const { name, isMember } = data ?? {}
  const { mutate, isPending } = useJoinWorkspace()

  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`)
    }
  }, [isMember, router, workspaceId])

  if (isLoading) return <PageLoader />
  if (!data) return <PageError message="Workspace not found" />


  async function handleJoin(joinCode: string) {
    await mutate(
      { workspaceId, joinCode },
      {
        onSuccess: (id) => { 
          router.push(`/workspace/${id}`)
          toast.success("Joined workspace successfully")
        },
        onError: () => {
          toast.error("Failed to join workspace")
        }
      },

    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-y-4 bg-white">
      <Image src="/hash_logo.jpg" alt="logo" width={200} height={200} />
      <div className="text-3xl font-bold">Join {name}</div>
      <div className="text-sm text-gray-500">
        Enter the workspace code to join
      </div>
      <VerificationInput
        onComplete={handleJoin}
        length={6}
        placeholder="_"
        classNames={{
          container: cn('flex gap-x-2', isPending && 'opacity-50 cursor-not-allowed'),
          character: cn('uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500', isPending && 'opacity-50 cursor-not-allowed'),
          characterFilled: 'bg-white text-black',
          characterInactive: 'bg-muted',
          characterSelected: 'bg-white text-black',
        }}
        autoFocus
      />
      <div className="flex gap-x-2">
        <Button variant="outline" asChild size="lg">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  )
}

export default JoinPage
