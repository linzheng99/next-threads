import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"

import { useCreateChannel } from "../api/use-create-channel"
import { useCreateChannelModal } from "../store/use-create-channel-modal"

export default function CreateChannelModal() {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const [open, setOpen] = useCreateChannelModal()
  const [name, setName] = useState('')
  const { mutate, isPending } = useCreateChannel()

  function handleClose() {
    setOpen(false)
    setName('')
  }

  function handleChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value.replace(/\s+/g, '-').toLowerCase()
    setName(name)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    await mutate({ name, workspaceId }, {
      onSuccess: (id) => {
        router.push(`/workspace/${workspaceId}/channel/${id}`)
        toast.success('Channel created successfully')
        handleClose()
      },
      onError: () => {
        toast.error('Failed to create channel')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Channel</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={name}
            onChange={handleChangeName}
            disabled={isPending}
            minLength={3}
            maxLength={80}
            autoFocus
            required
            placeholder="e.g. plan-budget"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

  )
}
