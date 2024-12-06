import { type LucideIcon } from "lucide-react";
import { type IconType } from "react-icons/lib";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SideButtonProps {
  icon: LucideIcon | IconType
  label: string
  isActive?: boolean
}

const SideButton = ({
  icon: Icon,
  label,
  isActive
}: SideButtonProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-1 group cursor-pointer">
      <Button
        variant="transparent"
        className={cn(
          'size-9 group-hover:bg-accent/20',
          isActive && 'bg-accent/20'
        )}
      >
        <Icon className="size-5 text-white group-hover:scale-110 transition-all" />
      </Button>
      <span className="text-[11px] text-white group-hover:text-accent">{label}</span>
    </div>
  );
}

export default SideButton;
