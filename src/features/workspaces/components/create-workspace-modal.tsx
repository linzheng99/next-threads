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

import { useCreateWorkspace } from "../api/use-create-workspace"
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal"

export default function CreateWorkspaceModal() {
  const router = useRouter()
  const [open, setOpen] = useCreateWorkspaceModal()
  const [name, setName] = useState('')
  const { mutate, isPending } = useCreateWorkspace()

  function handleClose() {
    setOpen(false)
    setName('')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    await mutate({ name }, {
      onSuccess: (id) => {
        toast.success('Workspace created successfully')
        router.push(`/workspace/${id}`)
        handleClose()
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Workspace</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            minLength={3}
            autoFocus
            required
            placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

  )
}
