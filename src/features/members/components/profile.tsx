import { ChevronDown, LogOut, Mail, ShieldCheck, Trash, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import MemberAvatar from "@/components/member-avatar";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator";
import { type Id } from "@/convex/_generated/dataModel";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useCurrentMember } from "../api/use-current-member";
import { useGetMember } from "../api/use-get-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useUpdateMember } from "../api/use-update-member";

interface ProfileProps {
  memberId: Id<'members'>
  onClose: () => void
}

const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const [RemoveDialog, confirmRemove] = useConfirm(
    "Remove member",
    "Are you sure you want to remove this member?",
    'destructive'
  )
  const [LeaveDialog, confirmLeave] = useConfirm(
    "Leave workspace",
    "Are you sure you want to leave this workspace?",
    'destructive'
  )
  const [UpdateRoleDialog, confirmUpdateRole] = useConfirm(
    "Update role",
    "Are you sure you want to update this member's role?",
  )

  const { data: member, isLoading } = useGetMember({ id: memberId })
  const { data: currentMember, isLoading: isCurrentMemberLoading } = useCurrentMember({ workspaceId })
  const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember()
  const { mutate: deleteMember, isPending: isDeletingMember } = useRemoveMember()

  const isAdmin = currentMember?.role === "admin"
  const isCurrentMember = currentMember?._id === memberId
  const isAdminAndIsCurrentMember = isAdmin && isCurrentMember
  const isAdminAndNotCurrentMember = isAdmin && !isCurrentMember
  const isCurrentMemberAndNotAdmin = isCurrentMember && !isAdmin
  const isMemberAndNotAdmin = !isCurrentMember && !isAdmin

  if (isLoading || isCurrentMemberLoading) {
    return <PageLoader />
  }

  if (!member) {
    return <PageError message="Member not found" />
  }

  const handleRemoveMember = async () => {
    const ok = await confirmRemove()
    if (!ok) return

    await deleteMember({ id: memberId }, {
      onSuccess: () => {
        toast.success("Member removed")
        onClose()
      },
      onError: () => {
        toast.error("Failed to remove member")
      }
    })
  }

  const handleLeaveWorkspace = async () => {
    const ok = await confirmLeave()
    if (!ok) return

    await deleteMember({ id: memberId }, {
      onSuccess: () => {
        onClose()
        toast.success("Member left workspace")
        setTimeout(() => {
          router.replace('/')
        }, 0)
      },
      onError: () => {
        toast.error("Failed to leave workspace")
      }
    })
  }

  const handleUpdateRole = async (role: 'admin' | 'member') => {
    const ok = await confirmUpdateRole()
    if (!ok) return

    await updateMember({ id: memberId, role }, {
      onSuccess: () => {
        toast.success("Member role updated")
      },
      onError: () => {
        toast.error("Failed to update member role")
      }
    })
  }

  return (
    <>
      <RemoveDialog />
      <LeaveDialog />
      <UpdateRoleDialog />
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b h-[49px]">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <X className="size-4 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex items-center justify-center p-4">
          <MemberAvatar name={member.user.name ?? 'Member'} image={member.user.image} className="max-w-[256px] max-h-[256px] aspect-square size-full" fallbackClassName="text-6xl" />
        </div>
        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">{member.user.name}</p>
        </div>
        {
          isAdminAndNotCurrentMember && (
            <div className="flex items-center w-full px-4 pb-4 gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full capitalize" disabled={isUpdatingMember}>
                    {member.role} <ChevronDown className="size-4 stroke-[1.5]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup value={member.role} onValueChange={(role) => handleUpdateRole(role as 'admin' | 'member')}>
                    <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">Member</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="destructive" className="w-full" onClick={handleRemoveMember} disabled={isDeletingMember}>
                <Trash className="size-4 stroke-[1.5]" />
                Remove
              </Button>
            </div>
          )
        }
        {
          isCurrentMemberAndNotAdmin && (
            <div className="flex items-center w-full px-4 pb-4 gap-2">
              <Button variant="outline" className="w-full capitalize">
                {member.role}
              </Button>
              <Button variant="destructive" className="w-full" onClick={handleLeaveWorkspace} disabled={isDeletingMember}>
                <LogOut className="size-4 stroke-[1.5]" />
                Leave
              </Button>
            </div>
          )
        }
        {
          isMemberAndNotAdmin || isAdminAndIsCurrentMember && (
            <div className="flex items-center w-full px-4 pb-4 gap-2">
              <Button variant='secondary' className="w-full capitalize">
                {
                  member?.role === "admin" ? <ShieldCheck className="size-4 stroke-[1.5]" /> : <User className="size-4 stroke-[1.5]" />
                }
                {member.role}
              </Button>
            </div>
          )
        }
        <Separator />
        <div className="flex flex-col p-4 gap-4">
          <p className="text-sm font-bold">Contact information</p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center">
              <Mail className="size-4 stroke-[1.5]" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-bold">Email Address</p>
              <Link href={`mailto:${member.user.email}`} className="text-[13px] text-muted-foreground hover:underline text-sky-600">
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
