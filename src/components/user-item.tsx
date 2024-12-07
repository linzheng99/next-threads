import { cva, type VariantProps } from "class-variance-authority";
import Link from 'next/link'

import { type Id } from "@/convex/_generated/dataModel";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const userItemVariants = cva(
  'flex items-center justify-start gap-1.5 rounded-md p-2 h-7 p-4 text-sm font-normal overflow-hidden',
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

interface UserItemProps {
  id: Id<"members">
  image?: string
  label?: string
  variant?: VariantProps<typeof userItemVariants>['variant']
}

const UserItem = ({ 
  id, 
  image, 
  label, 
  variant = 'default'
}: UserItemProps) => {
  const workspaceId = useWorkspaceId()
  const avatarFallback = label?.charAt(0).toUpperCase() || ''

  return (
    <Button 
      variant="transparent"
      size="sm"
      className={cn(userItemVariants({ variant}))}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage className="rounded-md" src={image} />
          <AvatarFallback className="rounded-md bg-sky-500 text-white text-sm">{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  )
}
 
export default UserItem;
