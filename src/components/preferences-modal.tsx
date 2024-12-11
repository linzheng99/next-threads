import { DialogClose } from "@radix-ui/react-dialog"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace"
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace"
import { useConfirm } from "@/hooks/use-confirm"
import { useWorkspaceId } from "@/hooks/use-workspace-id"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface PreferencesModalProps {
  isOpen: boolean
  onClose: () => void
  initialValue: string
}

const PreferencesModal = ({ isOpen, onClose, initialValue }: PreferencesModalProps) => {
  const workspaceId = useWorkspaceId()
  const router = useRouter()
  const [name, setName] = useState(initialValue)
  const [isEditing, setIsEditing] = useState(false)
  const [DeleteDialog, confirm] = useConfirm(
    'Delete Workspace',
    'Are you sure you want to delete this workspace?',
    'destructive'
  )

  const { mutate: updateWorkspace, isPending: isUpdating } = useUpdateWorkspace()
  const { mutate: removeWorkspace, isPending: isRemoving } = useRemoveWorkspace()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await updateWorkspace({ id: workspaceId, name }, {
      onSuccess: () => {
        toast.success('Workspace updated successfully')
        setIsEditing(false)
      },
      onError: () => {
        toast.error('Failed to update workspace')
      },
    })
  }

  async function handleRemoveWorkspace() {
    const ok = await confirm()
    if (!ok) return

    await removeWorkspace({ id: workspaceId }, {
      onSuccess: () => {
        toast.success('Workspace deleted successfully')
        onClose()
        router.replace('/')
      },
      onError: () => {
        toast.error('Failed to delete workspace')
      },
    })
  }

  return (
    <>
      <DeleteDialog />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">{initialValue}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center bg-white hover:bg-gray-50 cursor-pointer rounded-md p-4 border shadow-sm">
              <div className="flex flex-col justify-between gap-2">
                <p className="text-lg font-medium">Workspace Name</p>
                <span className="text-sm">{initialValue}</span>
              </div>
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <p className="text-sm text-sky-500 hover:underline">
                    Edit
                  </p>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-xl font-medium">Edit Workspace Name</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isUpdating}
                      minLength={3}
                      autoFocus
                      required
                      placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" disabled={isUpdating}>Save</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <button className="flex gap-2 bg-white hover:bg-gray-50 cursor-pointer rounded-md p-4 text-rose-500 border shadow-sm" onClick={handleRemoveWorkspace} disabled={isRemoving}>
              <Trash className="size-4" />
              <p className="text-sm">
                Delete Workspace
              </p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PreferencesModal;
