import { CopyIcon, RefreshCcwIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUpdateJoinCode } from "@/features/workspaces/api/use-update-join-code";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";

interface InviteModalProps {
  name: string
  joinCode: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const InviteModal = ({ name, joinCode, open, onOpenChange }: InviteModalProps) => {
  const workspaceId = useWorkspaceId()
  const { mutate, isPending } = useUpdateJoinCode()
  const [UpdateJoinCodeDialog, confirmUpdateJoinCode] = useConfirm(
    'Generate new code',
    'This will invalidate the current code and all existing invites',
  )

  async function handleCopy() {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`
    await navigator.clipboard.writeText(inviteLink)
    toast.success('Copied to clipboard')
  }

  async function handleGenerateNewCode() {
    const ok = await confirmUpdateJoinCode()
    if (!ok) return

    await mutate({ workspaceId }, {
      onSuccess: () => toast.success('New code generated'),
      onError: () => toast.error('Failed to generate new code')
    })
  }

  return (
    <>
      <UpdateJoinCodeDialog />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Invite people to
              <span className="text-[#481349] font-bold"> {name}</span>
            </DialogTitle>
            <DialogDescription>
              <span>Use the code below to invite people to your workspace</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4 p-10">
            <div className="text-4xl font-bold">{joinCode}</div>
            <Button variant="ghost" onClick={handleCopy}>
              Copy link
              <CopyIcon className="size-4" />
            </Button>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleGenerateNewCode} disabled={isPending}>
              <span>New Code</span>
              <RefreshCcwIcon className="size-4" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default InviteModal;
