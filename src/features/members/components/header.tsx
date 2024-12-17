import { ChevronDown } from "lucide-react";

import MemberAvatar from "@/components/member-avatar";
import { Button } from "@/components/ui/button";

interface MemberHeaderProps {
  memberName?: string
  memberImage?: string
  onClick?: () => void
}

const MemberHeader = ({ memberName, memberImage, onClick }: MemberHeaderProps) => {

  return (
    <div className="flex items-center border-b px-4 py-5 h-[49px] gap-0.5">
      <MemberAvatar name={memberName || 'Member'} image={memberImage} className="size-8" />
      <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={onClick}>
        <span className="text-xl font-semibold">{memberName}</span>
        <ChevronDown className="size-4" />
      </Button>
    </div>
  );
}

export default MemberHeader;
