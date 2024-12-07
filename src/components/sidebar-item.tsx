import { cva, type VariantProps } from "class-variance-authority";
import {type LucideIcon } from 'lucide-react';
import Link from "next/link";
import { type IconType } from "react-icons/lib";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";

const sidebarItemVariants = cva(
  'flex items-center justify-start gap-1.5 rounded-md p-2 h-7 px-[18px] text-sm font-normal overflow-hidden',
  {
    variants: {
      variant: {
        default: 'text-[#f9edffcc]',
        active: 'text-[#481349] bg-white/90 hover:bg-white/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface SidebarItemProps {
  id: string
  label: string
  icon: LucideIcon | IconType
  variant?: VariantProps<typeof sidebarItemVariants>['variant']
}

const SidebarItem = ({ id, label, icon: Icon, variant = 'default' }: SidebarItemProps) => {
  const workspaceId = useWorkspaceId()

  return (
    <Button 
      variant="transparent"
      size="sm"
      className={cn(sidebarItemVariants({ variant}))}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className="size-4 shrink-0" />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  )
}

export default SidebarItem;
