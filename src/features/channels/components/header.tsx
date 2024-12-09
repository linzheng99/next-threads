import { Button } from "@/components/ui/button";
import { ChevronDown, Trash } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useUpdateChannel } from "../api/use-update-channel";
import { useRemoveChannel } from "../api/use-remove-channel";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";

interface ChannelHeaderProps {
  name: string
  id: Id<"channels">
  workspaceId: Id<"workspaces">
  isAdmin: boolean
}

const ChannelHeader = ({ name, id, workspaceId, isAdmin }: ChannelHeaderProps) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [channelName, setChannelName] = useState(name)
  const [DeleteChannelDialog, confirmDialog] = useConfirm(
    'Delete Channel',
    'Are you sure you want to delete this channel?',
    'destructive'
  )

  const { mutate: updateChannel, isPending: isUpdating } = useUpdateChannel()
  const { mutate: removeChannel, isPending: isRemoving } = useRemoveChannel()

  function handleChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value.replace(/\s+/g, '-').toLowerCase()
    setChannelName(name)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    updateChannel({ id, name: channelName, workspaceId }, {
      onSuccess: () => {
        toast.success("Channel name updated")
        setIsEditing(false)
      },
      onError: () => {
        toast.error("Failed to update channel name")
      }
    })
  }

  async function handleRemoveWorkspace() {
    const ok = await confirmDialog()
    if (!ok) return

    removeChannel({ id }, {
      onSuccess: () => {
        toast.success("Channel deleted")
        router.push(`/workspace/${workspaceId}`)
      },
      onError: () => {
        toast.error("Failed to delete channel")
      }
    })
  }


  return (
    <div className="flex items-center border-b px-4 py-5 h-[49px] gap-0.5">
      <DeleteChannelDialog />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <span className="text-xl font-semibold"># {name}</span>
            <ChevronDown className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium"># {name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center bg-white hover:bg-gray-50 cursor-pointer rounded-md p-4 border shadow-sm">
              <div className="flex flex-col justify-between gap-2">
                <p className="text-lg font-medium">Channel Name</p>
                <span className="text-sm"># {name}</span>
              </div>
              {isAdmin && (
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogTrigger asChild>
                    <p className="text-sm text-sky-500 hover:underline cursor-pointer">
                      Edit
                    </p>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-xl font-medium">Edit Channel Name</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <Input
                        value={channelName}
                        onChange={handleChangeName}
                        disabled={false}
                        minLength={3}
                        autoFocus
                        required
                        placeholder="Channel name e.g. 'Work', 'Personal', 'Home'"
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
              )}
            </div>
            {isAdmin && (
              <button className="flex gap-2 bg-white hover:bg-gray-50 cursor-pointer rounded-md p-4 text-rose-500 border shadow-sm" onClick={handleRemoveWorkspace} disabled={isRemoving}>
                <Trash className="size-4" />
                <p className="text-sm">
                  Delete Channel
                </p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ChannelHeader;
