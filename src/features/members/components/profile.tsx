import { Mail, X } from "lucide-react";
import Link from "next/link";

import MemberAvatar from "@/components/member-avatar";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { type Id } from "@/convex/_generated/dataModel";

import { useGetMember } from "../api/use-get-member";

interface ProfileProps {
  memberId: Id<'members'>
  onClose: () => void
}

const Profile = ({ memberId, onClose }: ProfileProps) => {
  const { data: member, isLoading } = useGetMember({ id: memberId })

  if (isLoading) {
    return <PageLoader />
  }

  if (!member) {
    return <PageError message="Member not found" />
  }

  return (
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
  );
}

export default Profile;
