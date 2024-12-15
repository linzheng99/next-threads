import Image from "next/image"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface MemberAvatarProps {
  image?: string
  name: string
  className?: string
  fallbackClassName?: string
}

export default function MemberAvatar({
  image,
  name,
  className,
  fallbackClassName
}: MemberAvatarProps) {
  if (image) {
    return (
      <div className={cn("size-5 relative rounded-md overflow-hidden", className)}>
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    )
  }
  return (
    <Avatar className={cn("size-5 rounded-md", className)}>
      <AvatarFallback className={cn("bg-sky-500 text-white font-semibold text-sm uppercase rounded-md", fallbackClassName)}>
        {name[0]}
      </AvatarFallback>
    </Avatar>
  )
}
